module.exports = {
	name: 'kill',
    description: 'Kills the bot process.',
    guildOnly: true,
    args: false,
    usage: '',
    cooldown: 0,
	execute(message, args) {
        // checks if the user is an admin on the server
        if(!message.member.hasPermission('ADMINISTRATOR')) {
            message.channel.send('You must have permission to kill the bot!');
            return;
        }
        
        // sends shutdown message and destroys client
        message.channel.send('Shutting down...').then(() => {
            message.client.destroy();
        });

	},
};