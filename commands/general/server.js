const { Command } = require('discord.js-commando');

module.exports = class ServerCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'server',
            group: 'general',
            memberName: 'server',
            description: 'Displays information on the server.',
            guildOnly: true,
        });
    }

    run(message) {
        return message.say(`Server name: ${message.guild.name}\nTotal members: ${message.guild.memberCount}`);
    }
};