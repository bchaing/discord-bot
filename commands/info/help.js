const { stripIndents, oneLine } = require('common-tags');
const { Command } = require('discord.js-commando');
const { prefix } = require('../../config.json');

module.exports = class HelpCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'help',
			group: 'info',
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
				const helpEmbed = { 
					color: 0xeda338,
					author: {
						name: commands[0].name,
						icon_url: this.client.user.displayAvatarURL(),
					},
					description: oneLine`${commands[0].description}
					${commands[0].guildOnly ? ' (Usable only in servers)' : ''}
					${commands[0].nsfw ? ' (NSFW)' : ''}
					`,
					fields: [
						{
							name: 'Format',
							value: `${msg.anyUsage(`${commands[0].name}${commands[0].format ? ` ${commands[0].format}` : ''}`)}`,
							inline: true,
						},
					],
				};

				if(commands[0].aliases.length > 0) {
					helpEmbed.fields.push({
						name: 'Aliases',
						value: `\`${commands[0].aliases.join('\` \`')}\``,
						inline: true,
					});
				}

				if(commands[0].details) {
					helpEmbed.fields.push({
						name: 'Details',
						value: `${commands[0].details}`,
					});
				} 

				if(commands[0].examples) {
					helpEmbed.fields.push({
						name: 'Examples',
						value: `${commands[0].examples.join('\n')}`,
					});	
				}

				if(commands[0].throttling) {
					helpEmbed.fields.push({
						name: 'Cooldown',
						value: oneLine`
							\*\*${commands[0].throttling.usages}\*\* use(s) every
							\*\*${commands[0].throttling.duration}\*\* seconds.
						`,
					});	
				}

				msg.embed(helpEmbed);

				return;
			} else if(commands.length > 1) {
				return msg.reply('Multiple commands found. Please be more specific.');
			} else {
				return msg.reply(
					`Unable to identify command. Use ${msg.usage(
						null, msg.channel.type === 'dm' ? null : undefined, msg.channel.type === 'dm' ? null : undefined,
					)} to view the list of all commands.
				`);
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
                        name: oneLine`${grp.name} (${grp.commands.size - grp.commands.filter(cmd => cmd.hidden).size})`,
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