
const Sequelize = require('sequelize');

const sequelize = new Sequelize("demp", "root", "aman@12", {
    host: "localhost",
    dialect: "mysql",
});



const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;


sequelize
    .authenticate()
    .then(() => {
        console.log("Database connection has been established successfully.");
    })
    .catch((err) => {
        console.error("Unable to connect to the database:", err);
    });

db.User = require('../models/uses.js')(sequelize, Sequelize);

module.exports = db;
