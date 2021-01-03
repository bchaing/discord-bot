module.exports = {
	name: 'avatar',
	description: 'Retrieves the profile picture of a user.',
	aliases: ['av', 'icon', 'pfp'],
	usage: '<user>, <user>, ...',
	execute(message, args) {
        // get collection of members if user @'s users
        const avatarArray = [];
        let avatar, taggedMember = message.mentions.members;

        if (taggedMember.size) {
        // if user uses @'s, retrieve and send avatarURL of each user in the collection
            taggedMember.each((member) => { 
                avatar = `${member.user.displayAvatarURL({ dynamic : true })}?size=1024`;
                avatarArray.push(avatar);
            });
        } else {
            // format args array to be seperate comma delimited inputs
            args = args.toString().split(',,').map(elem => elem.replace(/,/g, ' ').trim());
            
            // iterate through each input and search for the user
            args.forEach(arg => {
                taggedMember = message.guild.members.cache.find(m => m.user.username.toLowerCase() === arg.toLowerCase());

                if (taggedMember === undefined) {
                // check nicknames of members if username search fails
                    taggedMember = message.guild.members.cache.find(m => String(m.nickname).toLowerCase() === arg.toLowerCase());
                }

                // send avatar if user is found
                if (taggedMember !== undefined) {
                    avatar = `${taggedMember.user.displayAvatarURL({ dynamic : true })}?size=1024`;
                    avatarArray.push(avatar);
                }
            });
        }

        // send array of avatars
        message.channel.send({ files: avatarArray });

        // if no users are specified, send error response
        if (taggedMember === undefined) message.channel.send('Cannot find user!');
	},
};