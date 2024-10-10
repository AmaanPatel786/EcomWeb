const Sequelize = require("sequelize");
const sequelize = new Sequelize(process.env.DB, process.env.USER,
process.env.PASSWORD, {
	host: "localhost",
	dialect: "mysql",
    port:3306
	}
);
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;