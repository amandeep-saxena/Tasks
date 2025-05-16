module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("UserData", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: Sequelize.STRING,
        },
        email: {
            type: Sequelize.STRING,
        },
        password: {
            type: Sequelize.STRING,
        },
        address: {
            type: Sequelize.STRING,
        },
        latitude: {
            type: Sequelize.STRING,
        },
        longitude: {
            type: Sequelize.STRING,
        },
        status: {
            type: Sequelize.STRING,
            defaultValue: "active"
        },
        register_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },
    });

    User.sync({ alter: true });
    return User;
};

