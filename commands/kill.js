module.exports = {
	name: 'kill',
    description: 'Kills the bot process.',
	execute(message) {
        // checks if the user is an admin on the server
        if(!message.member.hasPermission('ADMINISTRATOR')) {
            message.channel.send('You must have permission to kill the bot!');
            return;
        }
        
        // sends shutdown message and destroys client
        message.channel.send('Shutting down...').then(() => {
            message.client.destroy();
            console.log("Killing bot process");
        });

	},
};