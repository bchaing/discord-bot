module.exports = {
	name: 'emojify',
    description: 'Adds emojis to the message',
    guildOnly: false,
    args: true,
    usage: '<message>',
	execute(message, args) {
        (async () => {
            const emojis = message.guild.emojis.cache;
            let randomEmoji, returnMsg, emoji;
            let returnMessage = "";

            for (let i = 0; i < args.length; i++) {
                randomEmoji = emojis.random();
                returnMsg = args[i];
                emoji = message.guild.emojis.cache.find(e => e.name.toLowerCase() === `${returnMsg.replace(/:/g, "").toLowerCase()}`);
                
                if (emoji != null) {
                    returnMsg = emoji;
                }

                returnMessage = `${returnMessage}${returnMsg}${randomEmoji}`;
            }

            const webhooks = await message.channel.fetchWebhooks();
            const webhook = webhooks.first();
            
            await webhook.send(returnMessage, {
                username: `${message.author.username}`,
                avatarURL: `${message.author.avatarURL()}`,
            }).catch(console.error);

            message.delete().catch(error => {
                // Only log the error if it is not an Unknown Message error
                if (error.code !== 10008) {
                    console.error('Failed to delete the message:', error);
                }
            });
        })();
	},
};