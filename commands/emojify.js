module.exports = {
	name: 'emojify',
    description: 'Adds emojis to the message',
    guildOnly: false,
    args: true,
    usage: '<message>',
	execute(message, args) {
        (async () => {
            const emojis = message.guild.emojis.cache;      // stores the emojis of the guild
            let randomEmoji, returnMsg, emoji;              // variables for parsing animated emoji's
            let returnMessage = "";                         // message to send at the end

            // loops through every word, adding emoji's between
            for (let i = 0; i < args.length; i++) {
                randomEmoji = emojis.random();
                returnMsg = args[i];
                emoji = message.guild.emojis.cache.find(e => e.name.toLowerCase() === `${returnMsg.replace(/:/g, "").toLowerCase()}`);
                
                // checks if user is trying to send an emoji without nitro
                if (emoji) returnMsg = emoji;

                returnMessage = `${returnMessage}${returnMsg}${randomEmoji}`;
            }

            // fetches webhooks for sending message
            const webhooks = await message.channel.fetchWebhooks();
            const webhook = webhooks.first();
            
            await webhook.send(returnMessage, {
                username: `${message.author.username}`,
                avatarURL: `${message.author.avatarURL()}`,
            }).catch(console.error);

            // deletes original message
            message.delete().catch(error => {
                // Only log the error if it is not an Unknown Message error
                if (error.code !== 10008) {
                    console.error('Failed to delete the message:', error);
                }
            });
        })();
	},
};