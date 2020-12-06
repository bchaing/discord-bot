module.exports = {
	name: 'ping',
    description: 'Ping!',
    guildOnly: false,
    args: false,
    usage: '',
	execute(message) {
		message.channel.send('🏓 Pong!').then((newMsg) => {
            const ping = newMsg.createdTimestamp - message.createdTimestamp;
            newMsg.edit(`🏓 Pong! \`${ping}ms\``);
           });
	},
};