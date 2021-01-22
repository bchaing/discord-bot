module.exports = (sequelize, DataTypes) => {
	return sequelize.define('SecretSantas', {
		title: DataTypes.TEXT,
		date: DataTypes.INTEGER,
		members: DataTypes.JSON,
	},
	{
		timestamps: false,
	});
};