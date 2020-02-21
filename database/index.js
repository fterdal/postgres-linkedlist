const db = require("./connection")

// Models
const Ballot = require("./ballot")
const Candidate = require("./candidate")
const CandidateRank = require("./candidate_rank")

// Associations
Ballot.belongsToMany(Candidate, { through: CandidateRank })
Candidate.belongsToMany(Ballot, { through: CandidateRank })

// Exports
module.exports = {
  db,
  Ballot,
  Candidate,
  CandidateRank
}
