const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	storage: 'database.sqlite',
});

const Users = require('../models/Users')(sequelize, Sequelize.DataTypes);

Users.prototype.saveRoles = async roles => {
	const user = await Users.findOne({
		where: { user_id: this.user_id },
	});

	if (user) {
		user.roles = roles;
		return user.save();
	}

	return Users.create({ user_id: this.user_id, roles: roles });
};

Users.prototype.getRoles = () => {
	return Users.findAll({
		where: { user_id: this.user_id },
	});
};

module.exports = { Users };