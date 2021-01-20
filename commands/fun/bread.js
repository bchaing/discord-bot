const { Command } = require('discord.js-commando');
const fetch = require('node-fetch');

module.exports = class BreadCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'bread',
            group: 'fun',
            memberName: 'bread',
            description: 'Sends bread related puns.',
        });
    }

    async run(message) {
        const url = 'https://my-bao-server.herokuapp.com/api/breadpuns';
        const response = await fetch(url);
        const json = await response.json();

        return message.say(json);
    }
};