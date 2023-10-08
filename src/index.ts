/*
    https://discordjs.guide/sharding/#how-does-sharding-work
*/

import fs from "node:fs";
import { ShardingManager } from "discord.js";
import * as fn from "./functions.js";

let config = [];

process
  .on("SIGINT", () => {
    fn.log("SIGINT caught, exiting...");
    process.exit();
  })
  .on("SIGTERM", () => {
    fn.log("SIGTERM caught, exiting...");
    process.exit();
  });

fn.log("Listening for SIGINT and SIGTERM...");

try {
  config = JSON.parse(
    fs.readFileSync("/config/config.json", "utf8").toString()
  );
} catch {
  fn.log("No config.json file found");
  process.exit();
}

const startup = fn.startup();
if (startup) {
  fn.log(startup);
  process.exit();
}

const manager = new ShardingManager("./notifiarr.js", {
  totalShards: "auto",
  token: config.botToken,
  respawn: true,
});

manager.on("shardCreate", (shard) => {
  fn.log("manager.shardCreate->" + shard.id);
});
manager.spawn();
