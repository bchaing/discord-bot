const { bonkChannelID } = require('../config.json');
const { MessageAttachment } = require('discord.js');

module.exports = {
	name: 'bonk',
    description: 'Moves a user to horny jail.',
    guildOnly: true,
    usage: '<user>',
    cooldown: 60,
	async execute(message, args) {
        // creates variables for taggedMember and bonkChannel
        let taggedMember = (message.mentions.members.first());
        const bonkChannel = message.guild.channels.cache.get(bonkChannelID);

        if (!bonkChannel) {
            console.log('You need to specify a valid channel ID in config.json!');
            return;
        }

        // bonk author if no arguments are passed
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
        console.log(`${message.author.username} bonked ${taggedMember.user.username}`);

        const connection = await taggedMember.voice.channel.join();

        // play audio file
        const dispatcher = connection.play('assets/audio/bonk.mp3', { volume: 1.0 });

        // move user to bonk channel
        taggedMember.edit({ channel:bonkChannel }).catch(err => console.log(err));

        // disconnect on audio file finish
        dispatcher.on('finish', () => {
            // leave channel after a delay
            setTimeout(() => { 
                if (taggedMember !== message.guild.me) connection.disconnect();
            }, 1 * 1000);
        });
	},
};