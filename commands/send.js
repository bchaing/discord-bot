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
            
            message.delete();
            channel.send(`${message.content.replace(`<#${channel.id}>`, '').replace(`b!send`, '')}`).catch(console.error);
        } else {
            message.channel.send("Only the bot owner can use this command!");
        }
	},
};