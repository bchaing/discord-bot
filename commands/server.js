module.exports = {
	name: 'server',
    description: 'Displays server info.',
    guildOnly: false,
    args: false,
    usage: '',
	execute(message, args) {
        message.channel.send(`Server name: ${message.guild.name}\nTotal members: ${message.guild.memberCount}`);
	},
};