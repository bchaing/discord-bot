const { Command } = require('discord.js-commando');
const fetch = require('node-fetch');

module.exports = class RandomCatCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'randomcat',
            aliases: ['meow', 'cat', 'purr'],
            group: 'general',
            memberName: 'randomcat',
            description: 'Sends a random image of a dog.',
        });
    }

    async run(message) {
        const response = await fetch('https://api.thecatapi.com/v1/images/search');
        const responseJSON = await response.json();

        return message.say(responseJSON[0].url);
    }
};