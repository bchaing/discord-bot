const { Command } = require('discord.js-commando');

module.exports = class GitHubCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'github',
            aliases: ['git'],
            group: 'info',
            memberName: 'github',
            description: 'Displays the github link to the project.',
        });
    }

    run(message) {
        const linkEmbed = {
            color: 0x1E2327,
            author: {
                name: 'GitHub Repository',
                iconURL: 'attachment://github.png',
            },
            description: 'https://github.com/bchaing/discord-bot',
        };

        return message.channel.send({ 
            embed: linkEmbed, 
            files: ['./assets/images/github.png'],
        });
    }
};