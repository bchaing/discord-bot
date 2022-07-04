const { Command } = require("@sapphire/framework");

class AvatarCommand extends Command {
  constructor(context, options) {
    super(context, {
      ...options,
      aliases: ["av", "icon", "pfp"],
      description: "Displays the profile picture of the specified user.",
      fullCategory: ["General"],
    });
  }

  async messageRun(message, args) {
    // get members from message
    const member = await args.pickResult("member");

    // return if no members specified
    if (!member.success) {
      return message.reply(
        "Please specify a valid user to get their profile picture.",
      );
    }

    // get avatar url of member
    const value = member.value;
    const avatar = value.user.displayAvatarURL({ dynamic: true });

    // send avatar url
    return message.channel.send(avatar).catch(this.container.logger.error);
  }
}

module.exports = {
  AvatarCommand,
};
