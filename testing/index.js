/*
    https://discordjs.guide/sharding/#how-does-sharding-work
*/

import * as fs from 'fs';
import {Shard, ShardingManager} from 'discord.js';

let config			= fs.readFileSync('config.json', 'utf8').toString();
config				= JSON.parse(config);

const debug         = config['debug'];
const botToken      = config['devBotToken'];

const manager = new ShardingManager('./tester.js', { 
    token: botToken 
});

if (debug) {
    manager.on('shardCreate', shard => console.log('manager.shardCreate->'+ shard.id));
}

manager.spawn();
