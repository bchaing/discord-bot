const { bonkChannelID } = require('../config.json');

module.exports = {
	name: 'bonk',
    description: 'Moves a user to horny jail.',
    guildOnly: true,
    args: true,
    usage: '<user>',
    cooldown: 60,
	execute(message, args) {
        // creates variables for taggedMember and bonkChannel
        let taggedMember = (message.mentions.members.first());
        const bonkChannel = message.guild.channels.cache.get(bonkChannelID);

        // check if taggedMember is valid
        if (!taggedMember) {
            message.channel.send(`${args[0]} is not a valid user!`);
            taggedMember = message.member;

            if (!taggedMember.voice.channel) {
                return;
            }
        }

        // check if taggedMember is in a voice channel
        if (!taggedMember.voice.channel) {
            message.channel.send(`${args[0]} is not a voice channel!`);
            taggedMember = message.member;

            if (!taggedMember.voice.channel) {
                return;
            }
        } 

        // send bonk message
        message.channel.send(`GO TO HORNY JAIL ${taggedMember.user}`, { files: ['https://media1.tenor.com/images/6493bee2be7ae168a5ef7a68cf751868/tenor.gif?itemid=17298755'] });

        // move user to bonk channel
        taggedMember.edit({ channel:bonkChannel }).catch(err => console.log(err)); 
	},
};