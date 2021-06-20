const snoowrap = require("snoowrap");
const fetch = require("node-fetch");
const { isURL, sendWebhookMessage } = require("../util/Util");
const { redditClientId, redditSecret, redditToken } = require("../config.json");
const youtubedl = require("youtube-dl-exec");
const fs = require("fs");

module.exports = {
  name: "message",
  async execute(message) {
    //  code for bonk-mute
    if (message.member === null) return;

    const muted = message.member.roles.cache.some(
      (role) => role.name === "bonk-mute",
    );
    if (muted) {
      message.delete();

      let returnMessage = message.content.replace(/([^\s]+)/g, "bonk");
      if (message.embeds.size) {
        if (returnMessage.size) returnMessage += " ";
        returnMessage += "bonk ".repeat(message.embeds.size);
      }

      sendWebhookMessage(
        message.channel,
        message.member.displayName,
        message.author.avatarURL(),
        returnMessage || "bonk",
      );
      return;
    }

    // reddit embeds
    if (!isURL(message.content)) {
      return;
    }

    const messageURL = message.content;
    if (messageURL.includes("reddit")) {
      const submissionid = messageURL.split("/")[6];

      const r = new snoowrap({
        userAgent: "A random string.",
        clientId: redditClientId,
        clientSecret: redditSecret,
        refreshToken: redditToken,
      });

      const submission = await (await r.getSubmission(submissionid))
        .fetch()
        .url.catch();

      const embedSites = [
        /i.redd.it/,
        /i.imgur.com/,
        /clips.twitch.tv/,
        /streamable.com/,
        /youtube.com/,
        /gfycat.com/,
      ];

      if (embedSites.some((site) => site.test(submission))) {
        message.say(submission);
      } else if (/v.redd.it/.test(submission)) {
        const url = await getVredLink(submission);
        if (url) return message.say(url);
      }
    } else if (messageURL.includes("v.redd.it")) {
      const url = await getVredLink(messageURL);
      if (url) return message.say(url);
    } else if (
      (messageURL.includes("www.tiktok.com") &&
        messageURL.includes("/video/")) ||
      messageURL.includes("vm.tiktok.com")
    ) {
      const destRegex = new RegExp(/[\n\r].*Destination:\s*([^\n\r]*)/gm);
      const output = await youtubedl(messageURL, {
        output: "assets/tiktok/%(title)s.%(ext)s",
      });

      const videoPath = destRegex.exec(output)[1];
      await message.channel.send({ files: [videoPath] });

      fs.unlinkSync(videoPath);
    }
  },
};

// get link to vred.rip video
async function getVredLink(link) {
  const id = link.split("/")[3];
  for (let i = 0; i < 2; i++) {
    const apiURL = `https://vred.rip/api/vreddit/${id}`;

    let resp, json;
    try {
      resp = await fetch(apiURL);
      json = await resp.json();
    } catch {
      continue;
    }

    return json.video_url;
  }
}
