const { token, ownerID } = require('../config.json');

module.exports = {
	name: 'restart',
    description: 'Restarts the bot process.',
	execute(message) {
        if (message.author.id == ownerID) {
        console.log('Restarting...')
        message.channel.send('Restarting...')
            .then(message.client.destroy())
            .then(message.client.login(token))
            .then( () => {
                console.log('Done!');
                message.channel.send('Done!');
            });
        }
	},
};