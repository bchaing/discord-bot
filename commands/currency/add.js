const { Command } = require('discord.js-commando');
const { userData } = require('../../index');

module.exports = class AddCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'add',
            group: 'currency',
            memberName: 'add',
            description: '',
            guildOnly: true,
            args: [
                {
                    key: 'amount',
                    prompt: 'How much do you want to add?',
                    type: 'integer',
                },
                {
                    key: 'member',
                    prompt: 'What member do you want the balance of?',
                    type: 'member',
                    default: '',
                },
            ],
        });
    }

    run(message, { amount, member }) {
        if (!member) {
            member = message.member;
        }
        
        userData.addBalance(member.user.id, message.guild.id, amount);

        return message.say(`Added ${amount} bonkus to ${member.displayName}.`);
    }
};