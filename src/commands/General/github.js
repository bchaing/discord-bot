const { Command } = require("@sapphire/framework");

class GithubCommand extends Command {
  constructor(context, options) {
    super(context, {
      ...options,
      aliases: ["repo", "git"],
      description: "Link to the bot's Github repo.",
      fullCategory: ["General"],
    });
  }

  async messageRun(message) {
    await message
      .reply(process.env.GITHUB_LINK)
      .catch(this.container.logger.error);
  }
}

module.exports = {
  GithubCommand,
};
