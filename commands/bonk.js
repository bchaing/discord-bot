module.exports = {
	name: 'bonk',
    description: 'Moves a user to horny jail.',
    guildOnly: true,
    args: true,
    usage: '<user>',
    cooldown: 10,
	execute(message, args) {
        // creates variables for taggedMember and bonkChannel
        const taggedMember = (message.mentions.members.first());
        const bonkChannel = message.guild.channels.cache.get('750271593401417779');
        
        // send bonk message
        message.channel.send(`GO TO HORNY JAIL ${taggedMember.user}`,{files: ["https://media1.tenor.com/images/6493bee2be7ae168a5ef7a68cf751868/tenor.gif?itemid=17298755"]});
        
        // move user to bonk channel
        taggedMember.edit({channel:bonkChannel}).catch(err => console.log(err));
	},
};