import fs from "node:fs";
import { type Client } from "discord.js";
import { type notifiarrApiRequestBody, type shardData } from "./types.js";

const config = JSON.parse(
  fs.readFileSync("/config/config.json", "utf8").toString()
);

export function startup() {
  log("----- config.json start -----");
  log("botToken: " + (config.botToken ? "true" : "false"));
  log("userApikey: " + (config.userApikey ? "true" : "false"));
  log(
    "devDiscordUsers: " + (config.devDiscordUsers.length > 0 ? "true" : "false")
  );

  log("notifiarrApiURL: " + (config.notifiarrApiURL ? "true" : "false"));
  log("betterUptimeURL: " + (config.betterUptimeURL ? "true" : "false"));
  log("cronitorURL: " + (config.cronitorURL ? "true" : "false"));

  log("webhooks: " + (config.webhooks ? "true" : "false"));
  log("testing: " + (config.testing ? "true" : "false"));
  log("debug: " + (config.debug ? "true" : "false"));
  log("upPing: " + (config.upPing ? "true" : "false"));
  log("scPing: " + (config.scPing ? "true" : "false"));
  log("uptimeDelay: " + config.uptimeDelay);
  log("countDelay: " + config.countDelay);
  log("----- config.json end -----");

  if (!config.botToken) {
    return "CRITICAL ERROR: Config file is missing a bot token, it is required";
  }

  if (!config.userApikey) {
    return "CRITICAL ERROR: Config file is missing a user apikey, it is required";
  }

  if (config.upPing && !config.betterUptimeURL && !config.cronitorURL) {
    return "CRITICAL ERROR: Betteruptime or Cronitor url is required when upPing is enabled";
  }
}

export function pingUptime(counter: number) {
  if (!config.upPing) {
    log("Uptime ping skipped, upPing = false");
    return;
  }

  if (config.betterUptimeURL) {
    fetch(config.betterUptimeURL)
      .then((res) => {
        if (res.ok) {
          log("Better uptime ping sent, #" + counter);
        } else {
          throw res;
        }
      })
      .catch((error) => {
        log("Failed to send uptime ping to better uptime");
        log(error);
      });
  } else {
    log("Uptime ping skipped, betterUptimeURL = empty");
  }

  if (config.cronitorURL) {
    fetch(config.cronitorURL)
      .then((res) => {
        if (res.ok) {
          log("Cronitor uptime ping sent, #" + counter);
        } else {
          throw res;
        }
      })
      .catch((error) => {
        log("Failed to send uptime ping to cronitor");
        log(error);
      });
  } else {
    log("Uptime ping skipped, cronitorURL = empty");
  }
}

export function pingServerCount(client: Client, headers: Headers) {
  if (!config.scPing) {
    log("Server count skipped, scPing = false");
    return;
  }

  const shards: shardData[] = [];
  client.shard
    ?.broadcastEval((client) => [
      client.shard?.ids,
      client.ws.status,
      client.ws.ping,
      client.guilds.cache.size,
    ])
    .then((results) => {
      results.map((data) => {
        shards.push({
          id: data[0],
          status: data[1],
          ping: data[2],
          guilds: data[3],
        });
      });
    })
    .then(() => {
      const shardData = JSON.stringify(shards);
      let data: notifiarrApiRequestBody = { botToken: config.botToken };

      client.shard
        ?.fetchClientValues("guilds.cache.size")
        .then((results) => results as number[])
        .then((results) => {
          const serverCount = results.reduce(
            (acc: number, guildCount: number) => acc + guildCount,
            0
          );

          data = {
            count: serverCount,
            shardData,
            botToken: config.botToken,
          };

          const headersClone = headers;
          headersClone.delete("X-server");

          fetch(config.notifiarrApiURL + "system/serverCount", {
            method: "POST",
            headers: headersClone,
            body: JSON.stringify(data),
          })
            .then((res) => {
              if (res.ok) {
                log("Server count (" + serverCount + ") ping sent");
              } else {
                throw res;
              }
            })
            .catch((error) => {
              log("Failed to send server count to notifiarr");
              log(error);
            });
        });
    });
}

export function webhook(data: notifiarrApiRequestBody, headers: Headers) {
  if (!config.webhooks) {
    log("webhooks disabled");
    return;
  }

  log("building webhook payload...");

  headers.set("X-server", String(data.server));

  const endpoint = data.event ? "notification/discordApp" : "user/keywords";

  fetch(config.notifiarrApiURL + endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  })
    .then((res) => {
      if (res.ok) {
        log("webhook sent: /" + endpoint);
      } else {
        throw res;
      }
    })
    .catch((error) => {
      log("Failed to send webhook payload to notifiarr");
      log(error);
    });
}

export function log(line: string) {
  if (!config.debug) {
    return;
  }

  console.log(getFullTimestamp() + " " + line);
}

export function getFullTimestamp() {
  const pad = (n: number, s = 2) => `${new Array(s).fill(0)}${n}`.slice(-s);
  const d = new Date();

  return `${pad(d.getFullYear(), 4)}-${pad(d.getMonth() + 1)}-${pad(
    d.getDate()
  )} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}.${pad(
    d.getMilliseconds(),
    3
  )}`;
}
