const Sequelize = require("sequelize")
const db = require("./connection")

const CandidateRank = db.define(
  "candidate_rank",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    }
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["ballotId", "previousId"]
      }
    ]
  }
)

module.exports = CandidateRank
