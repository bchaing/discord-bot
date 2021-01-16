module.exports = (sequelize, DataTypes) => {
	return sequelize.define('users', {
		id: {
			type: DataTypes.TEXT,
			primaryKey: true,
		},
		user_id: {
			type: DataTypes.TEXT,
		},
		guild_id: {
			type: DataTypes.TEXT,
		},
		roles: {
			type: DataTypes.JSON,
		},
	}, {
		timestamps: false,
	});
};