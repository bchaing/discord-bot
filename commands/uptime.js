module.exports = {
	name: 'uptime',
    description: 'Returns the uptime of the current bot process.',
	execute(message) {
        // variables for total uptime and individual components
        const uptime = message.client.uptime;
        const seconds = Math.floor(uptime / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        
        // sends formatted uptime
        message.channel.send(`Up for ${ days } days, ${ hours % 24} hours, ${ minutes % 60} minutes, ${ seconds % 60} seconds`);
	},
};