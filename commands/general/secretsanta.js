const { Command } = require('discord.js-commando');
const { Collection } = require('discord.js');

module.exports = class SecretSantaCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'secretsanta',
            aliases: ['drawnames'],
            group: 'general',
            memberName: 'secretsanta',
            description: 'Options and utilities for hosting a secret santa gift exchange.',
            guildOnly: true,
            args: [
                {
                    key: 'action',
                    prompt: 'What action do you want to perform?',
                    type: 'string',
                    default: '',
                },
                {
                    key: 'options',
                    prompt: '',
                    type: 'string',
                    default: '',  
                },
            ],
        });
    }

    run(message, { action }) {
        if (action === 'draw') {
            const members = message.channel.members.map(member => {
                if (!member.user.bot) return member.user.username;
            }).filter(member => member != undefined);

            let temp, j, i = members.length;

            while (i) {
                j = Math.floor(Math.random() * i--);

                temp = members[i];
                members[i] = members[j];
                members[j] = temp;
            }

            const pairs = new Collection();

            members.forEach((member, index) => {
                if (index !== members.length - 1) pairs.set(members[index], members[index + 1]);
                else pairs.set(members[index], members[0]);
            });

            console.log(pairs);
        } else {
            return message.channel.send('Avaliable commands: draw');
        }
    }
};