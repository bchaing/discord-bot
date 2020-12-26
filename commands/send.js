const { ownerID } = require('../config.json');

module.exports = {
	name: 'send',
    description: 'Allows bot owner to send messages as bot.',
    guildOnly: false,
    args: true,
    usage: '<channel> <message>',
	execute(message) {
        // check if the caller is the owner of the bot
        if(message.author.id == ownerID) {
            const channel = message.mentions.channels.first();
            
            // check if the tagged channel exists
            if (!channel) {
                message.channel.send('You need to tag a channel!');
                return;
            }
   
            // reformats the content of the message and sends it as the bot
            const msg = message.content.replace(`<#${channel.id}> `, '').replace(`b!send `, '');
            if (msg || message.attachments.size) {
                channel.send(`${msg}`, message.attachments.array()).catch(console.error);
                console.log(`Sent "${msg}" in #${channel.name}`);
            } 

            // delete the original message
            message.delete();
        } else {
        // respond to users that are not the bot owner
            message.channel.send("Only the bot owner can use this command!");
        }
	},
};