module.exports = {
	name: 'args-info',
    description: 'Reads back user inputted arguments.',
    guildOnly: false,
    args: true,
    usage: '<args>',
	execute(message, args) {
        const { commands } = message.client;
        
        if (args[0] === 'foo') {
            return message.channel.send('bar');
        }
    
        message.channel.send(`Command name: ${ command }\nArguments: ${args}`);
	},
};