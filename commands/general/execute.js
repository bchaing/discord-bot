const { Command } = require('discord.js-commando');
const { oneLine } = require('common-tags');
const { getNickname } = require('../../util/Util');
const { unregisterCustomQueryHandler } = require('puppeteer');

module.exports = class ExecuteCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'execute',
            aliases: ['kill'],
            group: 'general',
            memberName: 'execute',
            description: oneLine`
                Kicks user from the server and sends 
                them and invite link to rejoin.
            `,
            args: [
                {
                    key: 'user',
                    prompt: 'Who do you want to execute?',
                    type: 'member',
                },
            ],
        });
    }

    async run(message, { user }) {
        const messages = [];
        
        messages.push(message.say(oneLine`${getNickname(message.member)}
            \*\*executed\*\* ${getNickname(user)}
        `));
        
        const invite = await message.channel.createInvite(
            {
                maxAge: 86400, // maximum time for the invite, in milliseconds
                maxUses: 1, // maximum times it can be used
            },
        );

        user.createDM();
        await user.send(`https://discord.gg/${invite.code}`);
        
        user.kick();

        return messages;
    }
};