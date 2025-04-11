
const Sequelize = require('sequelize');

const sequelize = new Sequelize("demp", "root", "aman@12", {
    host: "localhost",
    dialect: "mysql",
});



const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;


// Test the database connection
sequelize
    .authenticate()
    .then(() => {
        console.log("Database connection has been established successfully.");
    })
    .catch((err) => {
        console.error("Unable to connect to the database:", err);
    });

db.User = require("../models/user.model")(sequelize, Sequelize);
db.Task = require("../models/task.model")(sequelize, Sequelize);


db.User.hasMany(db.Task, { foreignKey: 'id' });
db.Task.belongsTo(db.User, { foreignKey: 'id' });


module.exports = db;
