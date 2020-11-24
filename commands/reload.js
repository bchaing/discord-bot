module.exports = {
	name: 'reload',
	description: 'Reloads a command',
	execute(message, args) {
        // checks if there are any arguments
        if (!args.length) return message.channel.send(`You didn't pass any command to reload, ${message.author}!`);
        
        // gets command from args
        const commandName = args[0].toLowerCase();
        const command = message.client.commands.get(commandName)
            || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        // check if command exists 
        if (!command) return message.channel.send(`There is no command with name or alias \`${commandName}\`, ${message.author}!`);

        // deletes cache of command
        delete require.cache[require.resolve(`./${command.name}.js`)];

        // reload command into cache
        try {
            const newCommand = require(`./${command.name}.js`);
            message.client.commands.set(newCommand.name, newCommand);
        } catch (error) {
            console.error(error);
            message.channel.send(`There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\``);
        }

        message.channel.send(`Command \`${command.name}\` was reloaded!`);
        console.log(`[CLIENT] Command ${command.name} was reloaded!`);
	},
};