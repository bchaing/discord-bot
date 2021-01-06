const { Command } = require('discord.js-commando');
const fetch = require('node-fetch');
const { MessageEmbed } = require('discord.js');
const { nasaAPIKey } = require('../../config.json');

module.exports = class NASACommand extends Command {
    constructor(client) {
        super(client, {
            name: 'nasa',
            group: 'general',
            memberName: 'nasa',
            description: 'Displays NASA\'s astronomy picture of the day.',
        });
    }

    async run(message) {
        if (!nasaAPIKey) {
            return message.channel.send('The API keys have not been set up for this command.');
        }
        
        const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${nasaAPIKey}`);
        const data = await response.json();    
        
        const APODEmbed = new MessageEmbed()
            .setColor(0x0B3D91)
            .setAuthor(
                'NASA\'s Astronomy Picture of the Day', 
                'attachment://nasa.png',
            )
            .attachFiles('./assets/images/nasa.png')
            .setTitle(data.title)
            .setDescription(data.explanation)
            .setImage(data.hdurl);

        return message.channel.send({ embed: APODEmbed });
    }
};