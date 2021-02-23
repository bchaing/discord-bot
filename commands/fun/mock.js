const { Command } = require('discord.js-commando');

module.exports = class MockCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'mock',
            group: 'fun',
            memberName: 'mock',
            description: 'Adds mocking Spongebob capitalization to text.',
            args: [
                {
                    key: 'text',
                    type: 'string',
                    prompt: 'What is the text that you want to use?',
                    default: '',
                },
            ],
        });
    }

    async run(message, { text }) {
        if (!text) {
            const lastMessage = await message.channel.messages.fetch({ limit: 2 });
            text = lastMessage.filter(m => m.author != message.author).first().content;
        }

        let retString = '';

        for (let i = 0; i < text.length; i++) {
            if (Math.random() < 0.5) {
                retString += text.charAt(i).toUpperCase();
            } else {
                retString += text.charAt(i).toLowerCase();
            }
        }

        return message.say(retString);
    }
};