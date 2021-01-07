const { Command } = require('discord.js-commando');
const fetch = require('node-fetch');

module.exports = class DogCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'randomdog',
            aliases: ['woof', 'dog', 'bark'],
            group: 'general',
            memberName: 'randomdog',
            description: 'Sends a random image of a dog.',
        });
    }

    async run(message) {
        const response = await fetch('https://random.dog/woof.json');
        const responseJSON = await response.json();

        return message.say(responseJSON.url);
    }
};