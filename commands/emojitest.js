module.exports = {
	name: 'emojify',
    description: 'Adds emojis to the message',
    guildOnly: false,
    args: true,
    usage: '<message>',
	execute(message, args) {
        (async () => {
            const emojis = message.guild.emojis.cache;
            let randomEmoji;
            let returnMessage = "";

            for (let i = 0; i < args.length; i++) {
                randomEmoji = emojis.random();
                returnMessage = `${returnMessage}${args[i]}${randomEmoji}`;
            }

            const webhooks = await message.channel.fetchWebhooks();
            const webhook = webhooks.first();
            
            await webhook.send(returnMessage, {
                username: `${message.author.username}`,
                avatarURL: `${message.author.avatarURL()}`,
            }).catch(console.error);

            message.delete();
        })();
	},
};