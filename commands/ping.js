module.exports = {
	name: 'ping',
    description: 'Responds to the user and prints the latency of message replies.',
	execute(message) {
		message.channel.send('🏓 Pong!').then((newMsg) => {
            const ping = newMsg.createdTimestamp - message.createdTimestamp;
            newMsg.edit(`🏓 Pong! \`${ping}ms\``);
           });
	},
};