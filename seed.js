const { db } = require("./database")
const { blue, red, green } = require("chalk")

async function seed() {
  try {
    console.log(blue("🌱 Beginning Seeding"))
    await db.sync({ force: true })


    console.log(green("🌲 Finished Seeding"))
  } catch (err) {
    console.error(err)
    console.log(red("🔥 Seeding Failed"))
  } finally {
    await db.close()
  }
}
seed()
