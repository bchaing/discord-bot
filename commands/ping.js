module.exports = {
	name: 'ping',
    description: 'Ping!',
    guildOnly: false,
    args: false,
    usage: '',
	execute(message) {
		message.channel.send('Pong.');
	},
};