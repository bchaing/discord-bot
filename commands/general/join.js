const { Command } = require('discord.js-commando');

module.exports = class JoinCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'join',
            group: 'general',
            memberName: 'join',
            description: 'Joins the calling member\'s voice channel or specified voice channel.',
            guildOnly: true,
            args: [
                {
                    key: 'channel',
                    prompt: '',
                    type: 'string',
                    default: '',
                },
            ],
        });
    }

    run(message, { channel }) {
        if (!channel) {
            // check if user specified a voice channel
                if (message.member.voice.channel) {
                // join user's voice channel if possible
                    message.member.voice.channel.join();
                    console.log(`Joined voice channel: ${message.member.voice.channel.name}`);
                } else {
                // sends response if unable to join
                    message.reply('You need to specify a voice channel to join!');
                }
            } else {
            // search for user specified channel and attempt to join
                let voiceChannel;
    
                // allow for vc mentions or just plain text
                if (message.mentions.roles.size != 0) voiceChannel = message.guild.channels.cache.find(vc => message.mentions.roles.some(role => role.name === vc.name));
                else voiceChannel = message.guild.channels.cache.find(vc => vc.name.toLowerCase() === channel.toLowerCase());
                
                if (voiceChannel) {
                // join voice channel if found
                    voiceChannel.join();
                    return console.log(`Joined voice channel: ${voiceChannel.name}`);
                } else {
                // notifies user that voice channel could not be found
                    return message.reply('You need to specify a valid voice channel to join!');
                }
            }
    }
};