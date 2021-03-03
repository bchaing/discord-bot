const { Command } = require('discord.js-commando');
const { MessageAttachment } = require('discord.js');
const Canvas = require('canvas');

module.exports = class IronBMOCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'ironbmo',
            group: 'fun',
            memberName: 'ironbmo',
            description: 'Inserts image in to ironbmo template.',
            args: [
                {
                    key: 'image',
                    type: 'string',
                    prompt: 'What image do you want?',
                    default: '',
                },
            ],
        });
    }

    async run(message, { image }) {
        const canvas = Canvas.createCanvas(315, 475);
        const ctx = canvas.getContext('2d');
        
        const background = await Canvas.loadImage('./assets/images/ironbmo.png');
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        
        let face;
        try {
            if (image) {
                face = await Canvas.loadImage(image);
            } else if (message.attachments.size()) {
                face = await Canvas.loadImage(message.attachments.first().url);
            } else {

            }
        } catch (err) {
           return message.say('You didn\'t provide a valid image.'); 
        }
        
        ctx.drawImage(face, 77, 39, 167, 121);

        const attachment = new MessageAttachment(canvas.toBuffer(), 'ironbmo.png');
        message.channel.send(attachment);
    }
};