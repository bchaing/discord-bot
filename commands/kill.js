module.exports = {
	name: 'kill',
    description: 'Kills the bot process.',
    guildOnly: true,
    args: false,
    usage: '',
    cooldown: 0,
	execute(message, args) {
        message.channel.send('Bonking Bonk Bot. Goodbye!');
        
        message.client.destroy();
	},
};