const { stripIndents, oneLine } = require('common-tags');
const { Command } = require('discord.js-commando');
const { prefix } = require('../../config.json');

module.exports = class HelpCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'help',
			group: 'general',
			memberName: 'help',
			aliases: ['commands'],
			description: 'Displays a list of available commands, or detailed information for a specified command.',
			details: oneLine`
				The command may be part of a command name or a whole command name.
				If it isn't specified, all available commands will be listed.
			`,
			examples: ['help', 'help prefix'],
			guarded: true,

			args: [
				{
					key: 'command',
					prompt: 'Which command would you like to view the help for?',
					type: 'string',
					default: '',
				},
			],
		});
	}

	async run(msg, args) {
		const groups = this.client.registry.groups;
		const commands = this.client.registry.findCommands(args.command, false, msg);
		const showAll = args.command && args.command.toLowerCase() === 'all';

        if(args.command && !showAll) {
			if(commands.length === 1) {
				let help = stripIndents`
					${oneLine`
						__Command **${commands[0].name}**:__ ${commands[0].description}
						${commands[0].guildOnly ? ' (Usable only in servers)' : ''}
						${commands[0].nsfw ? ' (NSFW)' : ''}
					`}
					**Format:** ${msg.anyUsage(`${commands[0].name}${commands[0].format ? ` ${commands[0].format}` : ''}`)}
				`;
				if(commands[0].aliases.length > 0) help += `\n**Aliases:** ${commands[0].aliases.join(', ')}`;
				help += `\n${oneLine`
					**Group:** ${commands[0].group.name}
					(\`${commands[0].groupID}:${commands[0].memberName}\`)
				`}`;
				if(commands[0].details) help += `\n**Details:** ${commands[0].details}`;
				if(commands[0].examples) help += `\n**Examples:**\n${commands[0].examples.join('\n')}`;

				const messages = [];
				try {
					messages.push(await msg.direct(help));
					if(msg.channel.type !== 'dm') messages.push(await msg.reply('Sent you a DM with information.'));
				} catch(err) {
					messages.push(await msg.reply('Unable to send you the help DM. You probably have DMs disabled.'));
				}
				return messages;
			} else if(commands.length > 15) {
				return msg.reply('Multiple commands found. Please be more specific.');
			} else if(commands.length > 1) {
				return msg.reply(disambiguation(commands, 'commands'));
			} else {
				return msg.reply(
					`Unable to identify command. Use ${msg.usage(
						null, msg.channel.type === 'dm' ? null : undefined, msg.channel.type === 'dm' ? null : undefined
					)} to view the list of all commands.`
				);
			}
		} else {
            let returnMessage;
            const helpEmbed = {
                color: 0xeda338,
                author: {
                    name: 'Command List',
                    icon_url: this.client.user.displayAvatarURL(),
                },
                description: stripIndents`
                    Here are my list of commands!
                    Use \`${prefix}help <command>\` to view detailed information about a specific command.`,
                fields: [],
            };
            
			try {
                groups.forEach(grp => {
                    helpEmbed.fields.push({
                        name: `${grp.name} (${grp.commands.size})`,
                        value: `\`${grp.commands.filter(cmd => !cmd.hidden).map(cmd => cmd.name).join('\` \`')}\``,
                    });
                });

                returnMessage = msg.embed(helpEmbed);
			} catch(err) {
				console.error(err);
			}
            
            return returnMessage;
		}
	}
};

/* module.exports = {
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
                .setTitle('Command List')
                .setAuthor('Bonk Bot', `${message.client.user.avatarURL()}`)
                .setDescription(`\n\n You can send \`${prefix}help [command name]\` to get info on a specific command!`)
                .addField(`General (${commands.size})`, `\`${commands.map(command => command.name).join('\` \`')}\``);

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
}; */