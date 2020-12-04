module.exports = {
	name: 'emojify',
    description: 'Adds emojis to the message',
    guildOnly: false,
    args: true,
    usage: '<message>',
	execute(message, args) {
        const emojis = message.guild.emojis.cache;
        let randomEmoji;
        let returnMessage = "";

        for (let i = 0; i < args.length; i++) {
            randomEmoji = emojis.random();
            returnMessage = `${returnMessage}${args[i]}${randomEmoji}`;
        }

        try {
            message.channel.send(returnMessage);
        } catch(error) {
            console.log(error);
            message.channel.send("Message is too long!");
        }
	},
};