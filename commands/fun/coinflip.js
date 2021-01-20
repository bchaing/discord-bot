const { Command } = require('discord.js-commando');
const coin = ['Heads', 'Tails'];

module.exports = class CoinflipCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'coinflip',
            aliases: ['coin', 'coin-flip', 'flip'],
            group: 'fun',
            memberName: 'coinflip',
            description: 'Flips a coin.',
            args: [
                {
                    key: 'number',
                    prompt: 'How many coins do you want to flip?',
                    type: 'integer',
                    default: 1,
                },
            ],
        });
    }

    run(message, { number }) {
        if (number > 180) return message.say('Number must be between 1 and 180');

        const coins = [];

        for (let i = 0; i < number; i++) { 
            coins.push(coin[Math.floor(Math.random() * coin.length)]);
        }
        
        return message.say(`\*\*${coins.join('\*\*, \*\*')}\*\*`);
    }
};