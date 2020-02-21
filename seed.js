const { blue, red, green } = require("chalk")
const sql = require("sql-template-strings")
const { db, Ballot, Candidate, CandidateRank } = require("./database")

const seedCandidates = [
  { name: "She-Ra" },
  { name: "Catra" },
  { name: "Bow" },
  { name: "Entrapta" }
]

const seedBallot = { userName: "Hordak" }

const sqlQueries = {
  async getAllBallots() {
    const [, { rows }] = await db.query(sql`
      SELECT * FROM ballots
    `)
    return rows
  },
  async getAllCandidates() {
    const [, { rows }] = await db.query(sql`
      SELECT * FROM candidates
    `)
    return rows
  },
  async getAllCandidateRanks() {
    const [, { rows }] = await db.query(sql`
      SELECT * FROM candidate_ranks
    `)
    return rows
  }
}

async function seed() {
  try {
    console.log(blue("🌱 Beginning Seeding"))
    await db.sync({ force: true })

    const hordaksBallot = await Ballot.create(seedBallot)
    const [sheRa, catra, bow, entrapta] = await Candidate.bulkCreate(
      seedCandidates
    )

    await hordaksBallot.addCandidate(catra)
    // This should throw an error. No two candidates can have previousId = null
    // await hordaksBallot.addCandidate(entrapta)

    // This should throw an error. No two candidates can have previousId = 1
    await hordaksBallot.addCandidate(entrapta)
    await hordaksBallot.addCandidate(bow, {
      through: { previousId: 1 }
    })
    await hordaksBallot.addCandidate(sheRa, { through: { previousId: 2 } })

    const ranks = await CandidateRank.findAll()

    // console.log(ranks[0].__proto__)

    // const rows = await sqlQueries.getAllBallots()
    // console.log("RESULTS", rows)
    // const rows = await sqlQueries.getAllCandidates()
    // console.log("RESULTS", rows)
    const rows = await sqlQueries.getAllCandidateRanks()
    console.log("RESULTS", rows)

    console.log(green("🌲 Finished Seeding"))
  } catch (err) {
    console.error(err)
    console.log(red("🔥 Seeding Failed"))
  } finally {
    await db.close()
  }
}
seed()
