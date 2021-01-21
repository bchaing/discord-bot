const { Command } = require('discord.js-commando');
const fetch = require('node-fetch');

module.exports = class RandomDogCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'randomdog',
            aliases: ['woof', 'dog', 'bark'],
            group: 'fun',
            memberName: 'randomdog',
            description: 'Sends a random image of a dog.',
        });
    }

    async run(message) {
        const url = 'https://random.dog/woof.json';
        const response = await fetch(url);
        const json = await response.json();

        return message.say(json.url);
    }
};