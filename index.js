/*
    https://discordjs.guide/sharding/#how-does-sharding-work
*/

import * as fs from 'fs';
import {Shard, ShardingManager} from 'discord.js';

let config			= fs.readFileSync('config.json', 'utf8').toString();
config				= JSON.parse(config);

const debug         = config['debug'];
let userInfo        = fs.readFileSync(config['absoluteUsersPath'] + config['liveNotifiarrUser'] + '.json', 'utf8').toString();
userInfo            = JSON.parse(userInfo);
const botToken      = userInfo.botToken;

const manager = new ShardingManager('./notifiarr.js', { 
    token: botToken
});

if (debug) {
    manager.on('shardCreate', shard => console.log('manager.shardCreate->'+ shard.id));
}

manager.spawn();
