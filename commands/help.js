const { prefix } = require('../config.json');
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'help',
	description: 'List all of my commands or info about a specific command.',
	aliases: ['commands'],
	usage: '[command name]',
	cooldown: 0,
	execute(message, args) {
        const { commands } = message.client;

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

        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
            return message.channel.send(`${command} is not a valid command!`);
        }

        const helpEmbed = new MessageEmbed()
            .setColor('#eda338')
            .setTitle(`${command.name}`)
            .setAuthor('Bonk Bot', `${message.client.user.avatarURL()}`)
            .setDescription(`${command.description}`)
            .setTimestamp();

        if (command.description) helpEmbed.discription = `${command.description}`;
        if (command.aliases) helpEmbed.addField('Aliases', `\`${command.aliases.join(', ')}\``, true);
        if (command.usage) helpEmbed.addField('Usage', `b!${command.name} ${command.usage}`, true);

        helpEmbed.addField('Cooldown', `${command.cooldown || 0} second(s)`, true);

        message.channel.send(helpEmbed);
	},
};