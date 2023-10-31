import { type Client } from 'discord.js';
import config from '../config.js';
import { type Shards } from '../types.js';
import logger from './logger.js';

export default async function pingServerCount(client: Client) {
    if (!config.scPing) {
        logger.info('Server count skipped, scPing = false');
        return;
    }

    if ('shard' in client && client.shard) {
        const shards: Shards[] = [];
        try {
            const broadcastResults = await client.shard.broadcastEval((client) => [
                client.shard?.ids,
                client.ws.status,
                client.ws.ping,
                client.guilds.cache.size,
            ]);
            for (const data of broadcastResults) {
                shards.push({
                    id: data[0],
                    status: data[1],
                    ping: data[2],
                    guilds: data[3],
                });
            }
        } catch (error) {
            logger.error('caught:', error);
            return;
        }

        let serverCount = 0;
        try {
            const clientValues = await client.shard.fetchClientValues('guilds.cache.size');
            serverCount = clientValues.map(Number).reduce((a, c) => a + c);
        } catch (error) {
            logger.error('caught:', error);
            return;
        }

        const headers = new Headers();
        headers.set('Content-Type', 'application/json');
        headers.set('X-api-key', config.userApiKey);

        try {
            const response = await fetch(config.notifiarrApiUrl + 'system/serverCount', {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    botToken: config.botToken,
                    count: serverCount,
                    shardData: JSON.stringify(shards),
                }),
            });
            if (response.ok) {
                logger.info(`Server count ping sent: ${serverCount}`);
                logger.http(await response.text());
            } else {
                logger.error(`Server count ping failed: ${serverCount}`);
                logger.http(await response.text());
            }
        } catch (error) {
            logger.error('caught:', error);
        }
    }
}
