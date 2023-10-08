/*
    https://discordjs.guide/sharding/#how-does-sharding-work
*/

import { ShardingManager } from 'discord.js';
import fs from 'node:fs';
import process from 'node:process';
import type cfg from '../config.json';
import * as fn from './functions.js';

let config: typeof cfg;

process
  .on('SIGINT', () => {
    fn.log('SIGINT caught, exiting...');
    process.exit();
  })
  .on('SIGTERM', () => {
    fn.log('SIGTERM caught, exiting...');
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit();
  });

fn.log('Listening for SIGINT and SIGTERM...');

try {
  config = JSON.parse(fs.readFileSync('/config/config.json', 'utf8').toString()) as typeof cfg;
} catch {
  fn.log('No config.json file found');
  // eslint-disable-next-line unicorn/no-process-exit
  process.exit();
}

const startup = fn.startup();
if (startup) {
  fn.log(startup);
  // eslint-disable-next-line unicorn/no-process-exit
  process.exit();
}

const manager = new ShardingManager('./notifiarr.js', {
  totalShards: 'auto',
  token: config.botToken,
  respawn: true,
});

manager.on('shardCreate', (shard) => {
  fn.log('manager.shardCreate->' + shard.id);
});
await manager.spawn();
