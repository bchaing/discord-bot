module.exports = {
	name: 'emojify',
    description: 'Adds emojis to the message',
    guildOnly: false,
    args: true,
    usage: '<args>',
	execute(message, args) {
        const emojis = message.guild.emojis.cache;
        let randomEmoji;
        let returnMessage = "";

        for (let i = 0; i < args.length; i++) {
            randomEmoji = emojis.random();
            returnMessage = `${returnMessage} ${args[i]} ${randomEmoji}`;
        }

        message.channel.send(returnMessage);
	},
};