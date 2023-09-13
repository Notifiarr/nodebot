/*
    https://discordjs.guide/sharding/#how-does-sharding-work
*/

import * as fs from 'fs';
import {Shard, ShardingManager} from 'discord.js';

let config  = fs.readFileSync('config.json', 'utf8').toString();
config      = JSON.parse(config);

if (config['debug']) {
    console.log('index.js sharding starting...');
}

const manager = new ShardingManager('notifiarr.js', { 
    token: config['botToken'] 
});

if (config['debug']) {
    manager.on('shardCreate', shard => console.log('manager.shardCreate->'+ shard.id));
}

manager.spawn();
