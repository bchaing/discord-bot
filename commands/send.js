const { ownerID } = require('../config.json');

module.exports = {
	name: 'send',
    description: 'Allows bot owner to send messages as bot.',
    guildOnly: false,
    args: true,
    usage: '<channel> <message>',
	execute(message) {
        if(message.author.id == ownerID) {
            const channel = message.mentions.channels.first();
            if (!channel) {
                message.channel.send('You need to tag a channel!');
                return;
            }
   
            const msg = message.content.replace(`<#${channel.id}> `, '').replace(`b!send `, '');
            if (msg || message.attachments.size) {
                channel.send(`${msg}`, message.attachments.array()).catch(console.error);
                console.log(`Sent "${msg}" in #${channel.name}`);
            } 

            message.delete();
        } else {
            message.channel.send("Only the bot owner can use this command!");
        }
	},
};