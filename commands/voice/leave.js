const { Command } = require('discord.js-commando');

module.exports = class LeaveCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'leave',
            group: 'voice',
            memberName: 'leave',
            description: 'Disconnects the bot from any voice channel connection.',
            guildOnly: true,
        });
    }

    run(message) {
        // check voice channel connection and leave if necessary
        if (message.guild.me.voice.channel !== null) {
            // leave current voice channel
            message.guild.me.voice.channel.leave();
            return console.log(`Left voice channel: ${message.guild.me.voice.channel.name}`);
        } else {
            // bot is not in a voice channel
            return message.reply('No active voice channel connections!');
        }
    }
};
