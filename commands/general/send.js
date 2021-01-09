const { Command } = require('discord.js-commando');

module.exports = class SendCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'send',
            group: 'general',
            memberName: 'send',
            description: 'Allows user to send messages as bot.',
            guildOnly: true,
        });
    }

    run(message) {
        let channel = message.mentions.channels.first();
        
        // check if the tagged channel exists
        if (!channel) {
            channel = message.channel;
        }

        // reformats the content of the message and sends it as the bot
        const msg = message.content.replace(`<#${channel.id}> `, '').replace(`b!send `, '');
        if (msg || message.attachments.size) {
            channel.send(`${msg}`, message.attachments.array()).catch(console.error);
        } 

        // delete the original message
        return message.delete();
    }
};