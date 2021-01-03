const { Command } = require('discord.js-commando');

module.exports = class PingCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'ping',
            group: 'general',
            memberName: 'ping',
            description: 'Returns the roundtrip latency of messages.',
        });
    }

    run(message) {
        // sends an initial message, measures reply latency and edits message with result
        message.say('🏓 Pong!').then((newMsg) => {
            const ping = newMsg.createdTimestamp - message.createdTimestamp;
            newMsg.edit(`🏓 Pong! \`${ping}ms\``);
           });
    }
};