const { Command } = require('discord.js-commando');
const { persistentRoles } = require('../../index');
const Discord = require('discord.js');

module.exports = class RolePersistCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'rolepersist',
            group: 'general',
            memberName: 'rolepersist',
            description: 'Role Persistence manager.',
            guildOnly: true,
            args: [
                {
                    key: 'command',
                    prompt: 'What role persist command do you want to perform?',
                    type: 'string',
                },
            ],
        });
    }

    run(message, { command }) {
        if (command === 'update') {
            message.guild.members.cache.forEach(m => {
                persistentRoles.update(m.user.id, m.roles.cache);
            });

            return message.say('Updated persistent roles database!');
        } else if (command.includes('list') || command.includes('ls')) {
            const member = message.mentions.members.first() || message.member;
            let memberRoles = '';
            persistentRoles.getRoles(member.user.id).forEach(r => {
                memberRoles += `${r.name}\n`;
            });
            return message.say(`${member.user.tag} roles:\n ${Discord.Util.removeMentions(memberRoles)}`);
        } else if (command.includes('set')) {
            const member = message.mentions.members.first();
            const roles = persistentRoles.get(member.user.id);

            const updateMember = message.guild.members.cache.get('387014337409187842');
            updateMember.roles.set(roles);
        }
    }
};