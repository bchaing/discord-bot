module.exports = {
	name: 'kill',
    description: 'Kills the bot process.',
    guildOnly: true,
    args: false,
    usage: '',
    cooldown: 0,
	execute(message, args) {
        if(!message.member.hasPermission('ADMINISTRATOR')) {
            message.channel.send('You must have permission to kill the bot!');
            return;
        }

        message.channel.send('Bonking Bonk Bot. Goodbye!');
        
        message.client.destroy();
	},
};