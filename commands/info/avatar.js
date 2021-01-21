const { Command } = require('discord.js-commando');
const { oneLineTrim } = require('common-tags');

module.exports = class AvatarCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'avatar',
            aliases: ['av', 'icon', 'pfp'],
            group: 'info',
            memberName: 'avatar',
            description: 'Retrieves the profile picture of a user.',
            args: [
                {
                    key: 'user',
                    prompt: 'Who\'s avatar do you want to display?',
                    type: 'string',
                },
            ],
        });
    }

    run(message, { user }) {
        // get collection of members if user @'s users
        const avatarArray = [];
        let avatar, userArray, taggedMember = message.mentions.members;

        if (taggedMember.size) {
        // retrieve and send avatarURL of each mentioned user in the collection
            taggedMember.each((member) => { 
                avatar = oneLineTrim`
                    ${member.user.displayAvatarURL({ dynamic : true })}
                    ?size=1024
                `;
                avatarArray.push(avatar);
            });
        } else {
            // format args array to be seperate comma delimited inputs
            userArray = user.split(',').map(userElem => userElem.trim());
            
            // iterate through each input and search for the user
            userArray.forEach(query => {
                taggedMember = message.guild.members.cache.find(m => 
                    m.user.username.toLowerCase() === query.toLowerCase());

                if (taggedMember === undefined) {
                // check nicknames of members if username search fails
                    taggedMember = message.guild.members.cache.find(m => 
                        String(m.nickname).toLowerCase() === query.toLowerCase());
                }

                // send avatar if user is found
                if (taggedMember !== undefined) {
                    avatar = oneLineTrim`
                        ${taggedMember.user.displayAvatarURL({ dynamic : true })}
                        ?size=1024
                    `;
                    avatarArray.push(avatar);
                }
            });
        }

        // if no users are specified, send error response
        if (avatarArray === [] || taggedMember === undefined) {
            return message.say('Cannot find user(s)!');
        }

        // send array of avatars
        return message.channel.send({ files: avatarArray });        
    }
};