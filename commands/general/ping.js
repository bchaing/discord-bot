module.exports = {
	name: 'ping',
    description: 'Responds to the user and prints the latency of message replies.',
	execute(message) {
        // sends an initial message, measures reply latency and edits message with result
        message.channel.send('🏓 Pong!').then((newMsg) => {
            const ping = newMsg.createdTimestamp - message.createdTimestamp;
            newMsg.edit(`🏓 Pong! \`${ping}ms\``);
           });
	},
};