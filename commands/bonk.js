const { VoiceState } = require("discord.js");

module.exports = {
	name: 'bonk',
    description: 'Moves a user to horny jail.',
    guildOnly: true,
    args: true,
    usage: '<user>',
	execute(message, args) {
        const taggedUser = message.mentions.users.first();
        message.channel.send(`GO TO HORNY JAIL ${taggedUser}`,{files: ["https://media1.tenor.com/images/6493bee2be7ae168a5ef7a68cf751868/tenor.gif?itemid=17298755"]});
        //const taggedUser = (message.mentions.members.first());
        //taggedUser.edit({channel:750271593401417779}).catch(err => console.log(err));
	},
};