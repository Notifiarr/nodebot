/*
    https://discord.js.org/#/docs/main/stable/class/Client
*/

import fs from "node:fs";
import { Client, GatewayIntentBits } from "discord.js";
import * as fn from "./functions.js";
import { type notifiarrApiRequestBody } from "./types.js";

const config = JSON.parse(
  fs.readFileSync("/config/config.json", "utf8").toString()
);
const headers = new Headers();
headers.set("Content-Type", "application/json");
headers.set("X-api-key", config.userApikey);
headers.set("X-server", "0");

let data: notifiarrApiRequestBody = { botToken: config.botToken };
let upCounter = 1;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

client.on("ready", () => {
  if (!config.testing) {
    fn.log("pingUptime() and pingServerCount() intervals started");

    fn.pingUptime(upCounter);

    setInterval(() => {
      upCounter++;
      fn.pingUptime(upCounter);
    }, 60_000 * config.uptimeDelay);

    setInterval(() => {
      fn.pingServerCount(client, headers);
    }, 60_000 * config.countDelay);
  }

  fn.log("client.ready");
});

client.on("interactionCreate", async (interaction) => {
  data = {
    event: "interactionCreate",
    member: interaction.user.id,
    server: interaction.guildId,
    channel: interaction.channelId,
    customId: interaction.isMessageComponent() ? interaction.customId : null,
    botToken: interaction.client.token,
  };

  fn.log("client.interactionCreate->" + data.server);
  if (interaction.isChatInputCommand()) {
    await interaction.reply({
      content: "Response sent to Notifiarr!",
      ephemeral: true,
    });
  }

  fn.webhook(data, headers);
});

client.on("threadCreate", (thread) => {
  data = {
    event: "threadCreate",
    threadParent: thread.parentId,
    thread: thread.id,
    member: thread.ownerId,
    server: thread.guildId,
    botToken: thread.client.token,
  };

  fn.log("client.threadCreate->" + data.server);
  fn.webhook(data, headers);
});

client.on("threadUpdate", (thread) => {
  data = {
    event: "threadUpdate",
    threadName: thread.name,
    threadArchived: thread.archived,
    threadParent: thread.parentId,
    thread: thread.id,
    messageCount: thread.messageCount,
    memberCount: thread.memberCount,
    member: thread.ownerId,
    server: thread.guildId,
    botToken: thread.client.token,
  };

  fn.log("client.threadUpdate->" + data.server);
  fn.webhook(data, headers);
});

client.on("threadDelete", (thread) => {
  data = {
    event: "threadDelete",
    threadName: thread.name,
    threadArchived: thread.archived,
    threadParent: thread.parentId,
    thread: thread.id,
    messageCount: thread.messageCount,
    memberCount: thread.memberCount,
    member: thread.ownerId,
    server: thread.guildId,
    botToken: thread.client.token,
  };

  fn.log("client.threadDelete->" + data.server);
  fn.webhook(data, headers);
});

client.on("guildBanAdd", (ban) => {
  data = {
    event: "guildBanAdd",
    member: JSON.stringify(ban.user),
    server: ban.guild.id,
    botToken: ban.client.token,
  };

  fn.log("client.guildBanAdd->" + data.server);
  fn.webhook(data, headers);
});

client.on("guildBanRemove", (ban) => {
  data = {
    event: "guildBanRemove",
    member: JSON.stringify(ban.user),
    server: ban.guild.id,
    botToken: ban.client.token,
  };

  fn.log("client.guildBanRemove->" + data.server);
  fn.webhook(data, headers);
});

client.on("guildMemberRemove", (member) => {
  data = {
    event: "guildMemberRemove",
    memberCount: member.guild.memberCount,
    member: JSON.stringify(member),
    server: member.guild.id,
    botToken: member.client.token,
  };

  fn.log("client.guildMemberRemove->" + data.server);
  fn.webhook(data, headers);
});

client.on("guildMemberAdd", (member) => {
  data = {
    event: "guildMemberAdd",
    memberCount: member.guild.memberCount,
    member: JSON.stringify(member),
    server: member.guild.id,
    botToken: member.client.token,
  };

  fn.log("client.guildMemberAdd->" + data.server);
  fn.webhook(data, headers);
});

client.on("messageUpdate", (oldMessage, newMessage) => {
  data = {
    event: "messageUpdate",
    newMessage: JSON.stringify(newMessage),
    oldMessage: JSON.stringify(oldMessage),
    server: newMessage.guild?.id,
    botToken: oldMessage.client.token,
  };

  fn.log("client.messageUpdate->" + data.server);
  fn.webhook(data, headers);
});

client.on("messageDelete", (message) => {
  data = {
    event: "messageDelete",
    message: JSON.stringify(message),
    server: message.guild?.id,
    botToken: message.client.token,
  };

  fn.log("client.messageDelete->" + data.server);
  fn.webhook(data, headers);
});

client.on("messageCreate", (message) => {
  if(message.inGuild())return;
  // -- tester.js ONLY
  if (
    config.testing &&
    !config.devDiscordUsers.includes(Number.parseInt(message.author.id))
  ) {
    fn.log(
      "Ignoring non allowed user " +
        message.author.username +
        " (" +
        message.author.id +
        ")"
    );
    return;
  }

  if (!message.author.bot) {
    message.channel.messages
      .fetch({ before: message.id, limit: 15 })
      .then((messages) => {
        data = {
          event: "messageCreate",
          mediarequest_eventtype: "ping",
          message: JSON.stringify(message),
          previousMessage: JSON.stringify(messages),
          channel: message.channel.id,
          server: message.guild?.id,
          authorRoles: Array.from(message.member?.roles.cache.keys() || []),
          botToken: message.client.token,
        };

        fn.log("client.messageCreate->" + data.server);
        fn.webhook(data, headers);
      });
  }
});

fn.log("client.login started");
client.login(config.botToken);
fn.log("client.login complete");

export default headers;
