const Sequelize = require("sequelize")
const db = require("./connection")

const Ballot = db.define("ballot", {
  userName: {
    type: Sequelize.STRING,
    allowNull: false
  }
})

module.exports = Ballot
