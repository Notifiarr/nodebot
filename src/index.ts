/*
    https://discordjs.guide/sharding/#how-does-sharding-work
*/

import { ShardingManager } from 'discord.js';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import config from './config.js';
import * as fn from './functions.js';

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

const startup = fn.startup();
if (startup) {
    fn.log(startup);
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit();
}

const manager = new ShardingManager(fileURLToPath(new URL('notifiarr.js', import.meta.url)), {
    totalShards: 'auto',
    token: config.botToken,
    respawn: true,
});

manager.on('shardCreate', (shard) => {
    fn.log('manager.shardCreate->' + shard.id);
});
await manager.spawn();
