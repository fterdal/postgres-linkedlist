const Sequelize = require("sequelize")
const db = new Sequelize("postgres://localhost:5432/linkedlist", {
  logging: false
})

module.exports = db
