module.exports = {
	name: 'args-info',
    description: 'Reads back user inputted arguments.',
    guildOnly: false,
    args: true,
    usage: '<args>',
	execute(message, args) {
        const { commands } = message.client;
        message.channel.send(`Command name: ${ commands }\nArguments: ${args}`);
	},
};