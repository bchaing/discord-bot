module.exports = {
	name: 'ping',
    description: 'Ping!',
    guildOnly: false,
    args: false,
    usage: '',
	execute(message, args) {
		message.channel.send('Pong.');
	},
};