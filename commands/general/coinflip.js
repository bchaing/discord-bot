const { Command } = require('discord.js-commando');
const { oneLine } = require('common-tags');
const coin = ['heads', 'tails'];


module.exports = class CoinflipCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'coinflip',
            aliases: ['coin', 'coin-flip', 'flip'],
            group: 'general',
            memberName: 'coinflip',
            description: 'Flips a coin.',
        });
    }

    run(message) {
        return message.say(oneLine`
            Flipped \*\*${coin[ Math.floor(Math.random() * coin.length) ]}\*\*!
        `);
    }
};