import { ShardingManager } from 'discord.js';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import config from './config.js';
import logger from './functions/logger.js';
import startup from './functions/startup.js';

process
    .on('SIGINT', () => {
        logger.error('SIGINT caught, exiting...');
        process.exit();
    })
    .on('SIGTERM', () => {
        logger.error('SIGTERM caught, exiting...');
        // eslint-disable-next-line unicorn/no-process-exit
        process.exit();
    });

try {
    startup();

    const manager = new ShardingManager(fileURLToPath(new URL('notifiarr.js', import.meta.url)), {
        totalShards: 'auto',
        token: config.botToken,
        respawn: true,
    });

    manager.on('shardCreate', (shard) => {
        logger.info('manager.shardCreate->' + shard.id);
    });
    await manager.spawn();
} catch (error) {
    logger.error('caught:', error);
}
