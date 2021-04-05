const { Command } = require('discord.js-commando');
const { bonkChannelID } = require('../../config.json');
const { MessageAttachment } = require('discord.js');
const { oneLine } = require('common-tags');

module.exports = class BonkCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'bonk',
            group: 'voice',
            memberName: 'bonk',
            description: 'Kicks a user to horny jail.',
            guildOnly: true,
            throttling: {
                usages: 1,
                duration: 30,
            },
            args: [
                {
                    key: 'user',
                    prompt: '',
                    type: 'member',
                    default: '',
                },
            ],
        });
    }

    async run(message, { user }) {
        // creates variables for taggedMember and bonkChannel
        const messages = [];
        const bonkChannel = message.guild.channels.cache.get(bonkChannelID);
        let taggedMember = user;

        console.log(user);

        if (!bonkChannel) {
            console.error(oneLine`
                You need to specify a valid channel ID in config.json!
            `);
            return;
        }

        // bonk author if no arguments are passed
        if (!user) taggedMember = message.member;

        // check if taggedMember is valid
        if (!taggedMember) {
            messages.push(message.say(`${user} is not a valid user!`));
            taggedMember = message.member;

            if (!taggedMember.voice.channel) {
                return;
            }
        }

        // check if taggedMember is in a voice channel
        if (!taggedMember.voice.channel) {
            messages.push(message.say(`${taggedMember} is not in a voice channel!`));
            taggedMember = message.member;

            if (!taggedMember.voice.channel) return;
        } 

        // send bonk message
        const bonkGIF = new MessageAttachment('./assets/images/bonk.gif');
        messages.push(message.channel.send(`GO TO HORNY JAIL ${taggedMember.user}`, bonkGIF));

        const connection = await taggedMember.voice.channel.join();

        // play audio file
        const dispatcher = connection.play(
            'assets/audio/bonk.mp3', 
            { volume: 1.0 },
            );

        // move user to bonk channel
        taggedMember.edit({ channel:bonkChannel }).catch(console.error);

        // disconnect on audio file finish
        dispatcher.on('finish', () => {
            // leave channel after a delay
            setTimeout(() => { 
                if (taggedMember !== message.guild.me) connection.disconnect();
            }, 1 * 1000);
            
            return messages;
        });
    }
};