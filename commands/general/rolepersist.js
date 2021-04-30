const { Command } = require("discord.js-commando");
const { userData } = require("../../util/dbCollections");
const { stripIndents } = require("common-tags");
const Discord = require("discord.js");

module.exports = class RolePersistCommand extends Command {
  constructor(client) {
    super(client, {
      name: "rolepersist",
      group: "general",
      memberName: "rolepersist",
      description: "Role Persistence manager.",
      guildOnly: true,
      args: [
        {
          key: "command",
          prompt: "What role persist command do you want to perform?",
          type: "string",
          default: "",
        },
        {
          key: "member",
          prompt: "",
          type: "member",
          default: "",
        },
        {
          key: "source",
          prompt: "Who do you want to get the roles from?",
          type: "member",
          default: "",
        },
      ],
    });
  }

  run(message, { command, member, source }) {
    switch (command) {
      case "update":
        message.guild.members.cache.forEach((m) => {
          userData.updateRoles(
            m.user.id,
            message.guild.id,
            m.roles.cache.map((r) => r.id),
          );
        });
        return message.say("Updated persistent roles database!");

      case "ls":
      case "list": {
        const taggedMember = member || message.member;
        let memberRoles = "";

        const roles = userData.getRoles(taggedMember.user.id, message.guild.id);

        if (roles !== "no roles") {
          roles.forEach((r) => {
            if (message.guild.roles.cache.get(r)) {
              memberRoles += `${message.guild.roles.cache.get(r).name}\n`;
            }
          });
        }

        return message.say(stripIndents`
                ${taggedMember.user.tag} roles:
                ${Discord.Util.removeMentions(memberRoles)}
            `);
      }

      case "set": {
        let roleMember, updateMember;
        if (source) {
          roleMember = source;
          updateMember = member;
        } else {
          roleMember = member || message.member;
        }

        const roles = userData.getRoles(roleMember.user.id, message.guild.id);
        if (roles !== "no roles") updateMember.roles.set(roles);

        return message.say(`Set roles for ${updateMember.user.tag}`);
      }

      case "download": {
        return message.channel.send({ files: ["./database.sqlite"] });
      }

      case "help":
      default:
        return message.say(stripIndents`
                **Role Persistence Commands**
                \`update\` - updates role persist database for all members in a guild
                \`set <destination_member> <source_member> \` - sets roles of destination with source
                \`list <member>\` - lists the roles stored for role persistence of a member
            `);
    }
  }
};
