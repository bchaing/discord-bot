const { Command } = require('discord.js-commando');
const { oneLine } = require('common-tags');

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
        
        messages.push(message.say(oneLine`
            ${user.displayName}
            \*\*executed\*\* ${user.displayName}
        `));
        
        const invite = await message.channel.createInvite(
            {
                maxAge: 86400, // maximum time for the invite, in milliseconds
                maxUses: 1, // maximum times it can be used
            },
        );

        user.createDM();
        const member = await this.client.users.fetch(user.id);
        member.send(`https://discord.gg/${invite.code}`);
        
        user.kick();

        return messages;
    }
};