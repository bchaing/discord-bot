const { prefix } = require('../config.json');
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'help',
	description: 'List all of my commands or info about a specific command.',
	aliases: ['commands'],
	usage: '[command name]',
	execute(message, args) {
        // retrieve collection of commands
        const { commands } = message.client;

        // display main help page
        if (!args.length) {
            const helpEmbed = new MessageEmbed()
                .setColor('#eda338')
                .setTitle('Commands')
                .setAuthor('Bonk Bot', `${message.client.user.avatarURL()}`)
                .setDescription(`${commands.map(command => command.name).join(', ')} \n\n \*\*You can send \`${prefix}help [command name]\` to get info on a specific command!\*\*`)
                .setTimestamp();

            message.channel.send(helpEmbed);

            return;
        }

        // search for command by inputted name
        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        // check if command exists
        if (!command) {
            return message.channel.send(`${command} is not a valid command!`);
        }

        // displays specific command help page
        const helpEmbed = new MessageEmbed()
            .setColor('#eda338')
            .setTitle(`${command.name}`)
            .setAuthor('Bonk Bot', `${message.client.user.avatarURL()}`)
            .setDescription(`${command.description}`)
            .setTimestamp();

        // displays options for specific commands
        if (command.description) helpEmbed.discription = `${command.description}`;
        if (command.aliases) helpEmbed.addField('Aliases', `\`${command.aliases.join(', ')}\``, true);
        if (command.usage) helpEmbed.addField('Usage', `\`b!${command.name} ${command.usage}\``, true);
        if (command.cooldown) helpEmbed.addField('Cooldown', `\`${command.cooldown || 0} second(s)\``, true);

        message.channel.send(helpEmbed);
	},
};