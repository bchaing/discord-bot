const { VoiceState } = require("discord.js");

module.exports = {
	name: 'bonk',
    description: 'Moves a user to horny jail.',
    guildOnly: true,
    args: true,
    usage: '<user>',
    cooldown: 10,
	execute(message, args) {
        const taggedUser = message.mentions.users.first();
        const taggedMember = (message.mentions.members.first());
        const bonkChannel = message.guild.channels.cache.get('750271593401417779');
        message.channel.send(`GO TO HORNY JAIL ${taggedUser}`,{files: ["https://media1.tenor.com/images/6493bee2be7ae168a5ef7a68cf751868/tenor.gif?itemid=17298755"]});
        taggedMember.edit({channel:bonkChannel}).catch(err => console.log(err));
	},
};