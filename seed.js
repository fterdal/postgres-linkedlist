const { blue, red, green } = require("chalk")
const { db, Ballot, Candidate, CandidateRank } = require("./database")

const seedCandidates = [
  { name: "She-Ra" },
  { name: "Catra" },
  { name: "Bow" },
  { name: "Entrapta" }
]

const seedBallot = { userName: "Hordak" }

async function seed() {
  try {
    console.log(blue("🌱 Beginning Seeding"))
    await db.sync({ force: true })

    const hordaksBallot = await Ballot.create(seedBallot)
    const [sheRa, catra, bow, entrapta] = await Candidate.bulkCreate(
      seedCandidates
    )

    // // console.log(hordaksBallot.__proto__)
    await hordaksBallot.addCandidate(catra)
    await hordaksBallot.addCandidate(entrapta)

    console.log(green("🌲 Finished Seeding"))
  } catch (err) {
    console.error(err)
    console.log(red("🔥 Seeding Failed"))
  } finally {
    await db.close()
  }
}
seed()
