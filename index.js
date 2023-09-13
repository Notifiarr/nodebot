/*
    https://discordjs.guide/sharding/#how-does-sharding-work
*/

import * as fs from 'fs';
import {ShardingManager} from 'discord.js';

const configJson = fs.readFileSync('/config/config.json', 'utf8').toString();
const config     = JSON.parse(configJson);

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
