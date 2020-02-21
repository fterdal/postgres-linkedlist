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

Candidates
| id |      name     |
|----|:-------------:|
|  1 |    She-Ra     |
|  2 |    Catra      |
|  3 |    Bow        |
|  4 |    Entrapta   |
