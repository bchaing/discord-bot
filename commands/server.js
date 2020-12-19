module.exports = {
	name: 'server',
    description: 'Displays server info.',
	execute(message) {
		message.channel.send(`Server name: ${message.guild.name}\nTotal members: ${message.guild.memberCount}`);
	},
};