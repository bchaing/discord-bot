const { Command } = require('discord.js-commando');
const fetch = require('node-fetch');
const { oneLineTrim, stripIndents } = require('common-tags');
const { dealAPIKey } = require('../../config.json');

module.exports = class DealsCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'deals',
            aliases: ['isthereanydeals', 'isthereanydeal', 'gamedeals', 'deal'],
            group: 'general',
            memberName: 'deals',
            description: 'Displays information on a game from isthereanydeals.com',
            args: [
                {
                    key: 'game',
                    prompt: 'What game do you want to look up?',
                    type: 'string', 
                },
            ],
        });
    }

    async run(message, { game }) {
        if (!dealAPIKey) return message.say('The API key has not been set up for this command.');

        const response = await fetch(oneLineTrim`
            https://api.isthereanydeal.com/v02/search/search/
            ?key=${dealAPIKey}&q=${game}&limit=10&strict=0
        `);
        const responseJSON = await response.json();
        const messages = [], search = [];
        let choice, list;

        responseJSON.data.results.forEach((value, index) => search.push(`[${index + 1}] ${value.title}`));
        if (search.length !== 0) {
            list = await message.say(stripIndents`
                \*\*Search results for:\*\* ${game}
                ${search.join('\n')}
                \*Respond with the number of the game you want to find\*
            `);
            messages.push(list);
        } else {
            return message.say('No results found.');
        }
        
        try {
            choice = await message.channel.awaitMessages(
                m => m.author.id === message.author.id, 
                {
                    max: 1,
                    time: 30000,
                    errors: ['time'],
                },
            );
        } catch (error) {
            list.delete();
            messages.push(message.say(`Cancelling search, you didn't specify a choice in time!`));
            return messages;
        }
        
        choice = parseInt(choice.first().content);

        list.delete();
        if (!choice || choice > search.length) return message.say('You didn\'t input a valid number.');

        const gamePlain = responseJSON.data.results[choice - 1].plain;

        const gameDetails = await fetch(oneLineTrim`
            https://api.isthereanydeal.com/v01/game/overview/
            ?key=${dealAPIKey}&region=us&country=US&plains=${gamePlain}
            &allowed=steam,gog,amazonus,battlenet,discord,epic,bundlestars,
            humblestore,indiegalastore,microsoft,newegg,origin,
            squenix,uplay
        `);

        const gameDetailsJSON = await gameDetails.json();
        const gameData = gameDetailsJSON.data[gamePlain];

        messages.push(message.say(stripIndents`
            On sale? ${gameData.price.cut !== 0 ? 'Yes' : 'No'} (${gameData.price.cut}% off)
            Current Best Price: ${gameData.price.price_formatted} (${gameData.price.store})
            Link: ${gameData.price.url}

            Historical Low Price: ${gameData.lowest.price_formatted} (${gameData.lowest.cut}% off) (${gameData.lowest.store})
            Last seen: ${gameData.lowest.recorded_formatted}
        `));
        
        return messages;
    }
};