const { Command } = require('discord.js-commando');
const { oneLine } = require('common-tags');
const coin = ['heads', 'tails'];


module.exports = class CoinCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'coin',
            aliases: ['coinflip', 'coin-flip', 'flip'],
            group: 'general',
            memberName: 'coin',
            description: 'Flips a coin.',
        });
    }

    run(message) {
        return message.say(oneLine`
            Flipped \*\*${coin[ Math.floor(Math.random() * coin.length) ]}\*\*!
        `);
    }
};