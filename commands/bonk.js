module.exports = {
	name: 'bonk',
    description: 'Moves a user to horny jail.',
    guildOnly: true,
    args: true,
    usage: '<user>',
	execute(message, args) {
        const mentionedMember = (message.mentions.users.first());
        //mentionedMember.voice.setChannel(750271593401417779);
	},
};