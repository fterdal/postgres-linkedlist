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
      // {
      //   unique: true,
      //   fields: ["ballotId", "previousId"],
      // },
      {
        unique: true,
        fields: ["ballotId", "previousId"],
        where: {
          previousId: null
        }
      },
    ]
  }
)
/**
 * We need to ensure that any single ballot cannot have more than one
 * row with previousNull = null.
 *
 * We also need to ensure that any single ballot cannot have the same
 * candidate appear twice.
 *
 * This SO post may be useful: https://dba.stackexchange.com/questions/9759/postgresql-multi-column-unique-constraint-and-null-values#9760
 */

module.exports = CandidateRank
