const { Command } = require('discord.js-commando');
const { userData } = require('../../util/dbCollections');

module.exports = class BalanceCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'balance',
            group: 'currency',
            memberName: 'balance',
            description: 'Displays the balance of the current user',
            guildOnly: true,
            args: [
                {
                    key: 'member',
                    prompt: 'What member do you want the balance of?',
                    type: 'member',
                    default: '',
                },
            ],
            ownerOnly: true,
        });
    }

    run(message, { member }) {
        if (!member) {
            member = message.member;
        }
        
        return message.say(`\*\*${member.displayName}\*\* has \*\*${userData.getBalance(member.user.id, message.guild.id)}\*\* bonkus.`);
    }
};