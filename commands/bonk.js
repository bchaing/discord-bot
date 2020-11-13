const { VoiceState } = require("discord.js");

module.exports = {
	name: 'bonk',
    description: 'Moves a user to horny jail.',
    guildOnly: true,
    args: true,
    usage: '<user>',
	execute(message, args) {
        const user = (message.mentions.member.first());
        //const member = message.guild.member(message.guild.member);
        //member.voice.setChannel(750271593401417779, "Bonk.");
        //member.voice.channel(750271593401417779);
        message.guild.member.get(user).channel(750271593401417779);
	},
};