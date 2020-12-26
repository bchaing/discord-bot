// template for writing other commands
// copy and paste the code below to start writing other commands
module.exports = {
	name: 'args-info',
    description: '',
    guildOnly: false,
    args: false,
    aliases: [''],
	usage: '',
	cooldown: 0,
	execute(message, args) {
        message.channel.send(`Arguments: ${args} Size: ${args.length}`);
	},
};