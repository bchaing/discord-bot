const { Command } = require('discord.js-commando');
const { persistentRoles } = require('../../index');
const { stripIndents } = require('common-tags');
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
                {
                    key: 'member',
                    prompt: '',
                    type: 'member',
                    default: '',
                },
                {
                    key: 'source',
                    prompt: 'Who do you want to get the roles from?',
                    type: 'member',
                    default: '',
                },
            ],
        });
    }

    run(message, { command, member, source }) {
        if (command === 'update') {
            message.guild.members.cache.forEach(m => {
                persistentRoles.update(m.user.id, m.roles.cache);
            });

            return message.say('Updated persistent roles database!');
        } else if (command === 'list' || command === 'ls') {
            const taggedMember = member || message.member;
            let memberRoles = '';

            persistentRoles.getRoles(taggedMember.user.id).forEach(r => {
                memberRoles += `${r.name}\n`;
            });

            return message.say(`${taggedMember.user.tag} roles:\n ${Discord.Util.removeMentions(memberRoles)}`);
        } else if (command === 'set') {
            let roleMember, updateMember;
            if (source) {
                roleMember = source;
                updateMember = member;
            } else {
                roleMember = member || message.member;
            }
            
            const roles = persistentRoles.getRoles(roleMember.user.id).map(r => r.id);
            updateMember.roles.set(roles);

            return message.say(`Set roles for ${updateMember.user.tag}`);
        } else if (command === 'help') {
            return message.say(stripIndents`
                Help: 
                \`update\` - updates role persist database for all members in a guild
                \`set <destination_member> <source_member> \` - sets roles of destination with source
                \`list <member>\` - lists the roles stored for role persistence of a member.
            `); 
        } else {
            return message.say('Available commands: \`update\` \`set\` \`list\`');
        }
    }
};