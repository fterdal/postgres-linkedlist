# Linked List in Postgres

## Schema

- Ballots
  - userName (string)
- Candidates
  - name (string)
- CandidateRanking (through table for ballot<->candidate)
  - candidates appear on the ballot in *ranked order*
  - no candidate can appear on the same ballot twice
  - no two candidates can have the same rank
  - candidate ranks do not have gaps


To implement this schema, we could add a "rank" column to the CandidateRanking through table. But then we'd have to validate that the ranks never have any gaps. And if we want to move a candidate from the bottom of the ballot to the top, we'd have to increment every other candidate on the ballot.

Instead, let's implement this schema using a linked list.

Each CandidateRanking row has a previous_id, pointing to the previous candidate in the ranking. The candidate who appears first on the ballot will have a previous_id of null.

## Example

Assume there's a ballot with id 1, and here's the table of candidates:

Candidates
| id |      name     |
|----|:-------------:|
|  1 |    She-Ra     |
|  2 |    Catra      |
|  3 |    Bow        |
|  4 |    Entrapta   |

The user moves Catra (id 2) to the ranking. Since Catra is the first candidate on the ballot, Catra's previous_id is null:

CandidateRanking
| id | ballotId | candidateId | previousId |
|----|:--------:|:-----------:|:----------:|
| 1  |     1    |      2      |    null    |

Now the user moves Entrapta (id 4) on to the ballot. Since Entrapta is the second candidate on the ballot, right after Catra, Entrapta's previous_id points to Catra's row in the CandidateRanking table:

CandidateRanking
| id | ballotId | candidateId | previousId |
|----|:--------:|:-----------:|:----------:|
| 1  |     1    |      2      |    null    |
| 2  |     1    |      4      |     1      |
