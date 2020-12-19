const { botOwnerID } = require('../config.json');

module.exports = {
	name: 'send',
    description: 'Allows bot owner to send messages as bot.',
    guildOnly: false,
    args: true,
    usage: '<channel> <message>',
	execute(message) {
        if(message.author.id == botOwnerID) {
            const channel = message.mentions.channels.first();
            if (channel === undefined) {
                message.channel.send('You need to tag a channel!');
                return;
            }
   
            const msg = message.content.replace(`<#${channel.id}>`, '').replace(`b!send `, '');
            if (msg || message.attachments.size) {
                channel.send(`${msg}`, message.attachments.array()).catch(console.error);
            } 

            message.delete();
        } else {
            message.channel.send("Only the bot owner can use this command!");
        }
	},
};