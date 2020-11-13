module.exports = {
	name: 'github',
    description: 'Sends the user a link to the github repository',
    guildOnly: false,
    usage: '',
	execute(message, args) {
        message.channel.send("Github Repository: https://github.com/bchaing/discord-bot");
	},
};