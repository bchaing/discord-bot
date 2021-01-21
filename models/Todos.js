module.exports = (sequelize, DataTypes) => {
	return sequelize.define('todos', {
		task: {
			type: DataTypes.STRING,
			unique: true,
		},
	},
	{
		timestamps: false,
	});
};