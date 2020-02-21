# Linked List in Postgres

## Schema

- Ballots
  - userName (string)
- Candidates
  - name (string)
- CandidateRanking (through table for ballot<->candidate)
  - candidates appear on the ballot in _ranked order_
  - no candidate can appear on the same ballot twice
  - no two candidates can have the same rank
  - candidate ranks do not have gaps

To implement this schema, we could add a "rank" column to the CandidateRanking through table. But then we'd have to validate that the ranks never have any gaps. And if we want to move a candidate from the bottom of the ballot to the top, we'd have to increment every other candidate on the ballot.

Instead, let's implement this schema using a linked list.

Each CandidateRanking row has a previousId, pointing to the previous candidate in the ranking. The candidate who appears first on the ballot will have a previousId of null.

## Example

Assume there's a ballot with id 1, and here's the table of candidates:

_Candidates_
| id | name |
|----|:-------------:|
| 1 | She-Ra |
| 2 | Catra |
| 3 | Bow |
| 4 | Entrapta |

The user moves Catra (id 2) to the ranking. Since Catra is the first candidate on the ballot, Catra's previousId is null:

_CandidateRanking_
| id | ballotId | candidateId | previousId |
|----|:--------:|:-----------:|:----------:|
| 1 | 1 | 2 | null |

Here's the ballot in linked list form:

(head)
Catra

Now the user moves Entrapta (id 4) on to the ballot. Since Entrapta is the second candidate on the ballot, right after Catra, Entrapta's previousId points to Catra's row in the CandidateRanking table:

| id  | ballotId | candidateId | previousId |
| --- | :------: | :---------: | :--------: |
| 1   |    1     |      2      |    null    |
| 2   |    1     |      4      |     1      |

(head)
Catra <-- Entrapta

The user also adds Bow to the list:

| id  | ballotId | candidateId | previousId |
| --- | :------: | :---------: | :--------: |
| 1   |    1     |      2      |    null    |
| 2   |    1     |      4      |     1      |
| 3   |    1     |      3      |     2      |

(head)
Catra <-- Entrapta <-- Bow

Now, the user adds She-Ra to the ballot. But this time, the user wants to add She-Ra to the top of the ballot (Catra will not be pleased). Here are the steps we'll need to follow:

1. Set She-Ra's previousId to null, and
2. Catra's previousId to She-Ra's.

That's it! The remaining rows in the ballot do not need to change. Here's what the resulting table will look like:

| id  | ballotId | candidateId | previousId |
| --- | :------: | :---------: | :--------: |
| 1   |    1     |      2      |     4      | // Catra |
| 2   |    1     |      4      |     1      | // Entrapta |
| 3   |    1     |      3      |     2      | // Bow |
| 4   |    1     |      1      |    null    | // She-Ra |

(head)
She-Ra <-- Catra <-- Entrapta <-- Bow

Finally, suppose the user wants to move Entrapta to the second place, behind She-Ra. Here are the steps we'll need to follow:

1. Entrapta's previousId should be 4 (pointing to She-Ra)
2. Catra's previousId sould be 2 (pointing to Entrapta)
3. Bow's previousId sould be 1 (pointing to Catra)

The resulting table will look like this:

| id  | ballotId | candidateId | previousId |
| --- | :------: | :---------: | :--------: |
| 1   |    1     |      2      |     2      | // Catra |
| 2   |    1     |      4      |     4      | // Entrapta |
| 3   |    1     |      3      |     1      | // Bow |
| 4   |    1     |      1      |    null    | // She-Ra |

(head)
She-Ra <-- Entrapta <-- Catra <-- Bow

Retrieving the ranked ballot is a matter of recursive traversal:

1. For the given ballotId, find the CandidateRank row with previousId of null (that's the top of the ballot).
2. Find the CandidateRank row with previousId equal to that previousId
3. Repeat 2 until there is no row with that previousId
