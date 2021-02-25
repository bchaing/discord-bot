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
        let mockingText = '';
        if (!text) {
            const lastMessage = await message.channel.messages.fetch({ limit: 2 });
            mockingText = lastMessage.filter(m => m.id !== message.id).first().content;
        } else {
            mockingText = text;
        }

        let retString = '';

        for (let i = 0; i < mockingText.length; i++) {
            if (Math.random() < 0.5) {
                retString += mockingText.charAt(i).toUpperCase();
            } else {
                retString += mockingText.charAt(i).toLowerCase();
            }
        }

        return message.say(retString);
    }
};