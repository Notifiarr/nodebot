/*
    https://discordjs.guide/sharding/#how-does-sharding-work
*/

import * as fn from './functions.js';
import * as fs from 'fs';
import {ShardingManager} from 'discord.js';
let config = [];

try {
    config = JSON.parse(fs.readFileSync('/config/config.json', 'utf8').toString());
} catch (error) {
    log('No config.json file found');
    process.exit();
}

if (fn.startup()) {
    fn.log(startup);
    process.exit();
}

const manager = new ShardingManager('./notifiarr.js', { 
    totalShards: 'auto',
    token: config.botToken,
    timeout: -1,
    respawn: true
});

manager.on('shardCreate', shard => fn.log('manager.shardCreate->'+ shard.id));
manager.spawn();
