/*
    https://discordjs.guide/sharding/#how-does-sharding-work
*/

import * as fs from 'fs';
import {ShardingManager} from 'discord.js';

const config   = JSON.parse(fs.readFileSync('/config/config.json', 'utf8').toString());
const userInfo = JSON.parse(fs.readFileSync('/config/' + config['liveNotifiarrUser'] + '.json', 'utf8').toString());
const manager  = new ShardingManager('./notifiarr.js', { token: userInfo.botToken });

if (config['debug']) manager.on('shardCreate', shard => console.log('manager.shardCreate->'+ shard.id));

manager.spawn();
