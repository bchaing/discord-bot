const { bonkChannelID } = require('../config.json');
const { MessageAttachment } = require('discord.js');

module.exports = {
	name: 'bonk',
    description: 'Moves a user to horny jail.',
    guildOnly: true,
    usage: '<user>',
    cooldown: 60,
	execute(message, args) {
        // creates variables for taggedMember and bonkChannel
        let taggedMember = (message.mentions.members.first());
        const bonkChannel = message.guild.channels.cache.get(bonkChannelID);

        if (!args.length) taggedMember = message.member;

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
            message.channel.send(`${args[0]} is not in a voice channel!`);
            taggedMember = message.member;

            if (!taggedMember.voice.channel) {
                return;
            }
        } 

        // send bonk message
        const bonkGIF = new MessageAttachment('./assets/images/bonk.gif');
        message.channel.send(`GO TO HORNY JAIL ${taggedMember.user}`, bonkGIF);
        console.log(`Bonked ${taggedMember.user.username}`);

        // move user to bonk channel
        taggedMember.edit({ channel:bonkChannel }).catch(err => console.log(err)); 
	},
};