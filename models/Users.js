module.exports = (sequelize, DataTypes) => {
	return sequelize.define('users', {
		user_id: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		roles: {
			type: DataTypes.JSON,
		},
	}, {
		timestamps: false,
	});
};