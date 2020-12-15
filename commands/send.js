module.exports = {
	name: 'send',
    description: 'Allows bot owner to send messages as bot.',
    guildOnly: false,
    args: true,
    usage: '<channel> <message>',
	execute(message, args) {
        if(message.author.id == '140944479090638848') {
            const channel = message.mentions.channels.first();
            if (channel == null) {
                message.channel.send('You need to tag a channel!');
                return;
            }
   
            const msg = message.content.replace(`<#${channel.id}>`, '').replace(`b!send `, '');
            if (msg) channel.send(`${msg}`).catch(console.error);   

            message.delete();
        } else {
            message.channel.send("Only the bot owner can use this command!");
        }
	},
};