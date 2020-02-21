const Sequelize = require("sequelize")
const db = require("./connection")

const Candidate = db.define("candidate", {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  }
})

module.exports = Candidate

