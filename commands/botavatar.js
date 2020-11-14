const { VoiceState } = require("discord.js");

module.exports = {
	name: 'botavatar',
    description: 'Changes the avatar of the bot.',
    guildOnly: true,
    args: true,
    usage: '<picture>',
	execute(message, args) {
        client.user.setAvatar(args[0]);
	},
};