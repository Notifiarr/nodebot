import { type Client } from 'discord.js';
import config from './config.js';
import logger from './functions/logger.js';
import { type NotifiarrApiRequestBody, type Shards } from './types.js';

export function startup() {
    logger.debug('----- config.json start -----');
    logger.debug(`botToken: ${Boolean(config.botToken)}`);
    logger.debug(`userApiKey: ${Boolean(config.userApiKey)}`);
    logger.debug(`devDiscordUsers: ${config.devDiscordUsers.length > 0}`);

    logger.debug(`notifiarrApiUrl: ${Boolean(config.notifiarrApiUrl)}`);
    logger.debug(`betterUptimeUrl: ${Boolean(config.betterUptimeUrl)}`);
    logger.debug(`cronitorUrl: ${Boolean(config.cronitorUrl)}`);

    logger.debug(`webhooks: ${config.webhooks}`);
    logger.debug(`testing: ${config.testing}`);
    logger.debug(`logLevel: ${config.logLevel}`);
    logger.debug(`upPing: ${config.upPing}`);
    logger.debug(`scPing: ${config.scPing}`);
    logger.debug(`uptimeDelay: ${config.uptimeDelay}`);
    logger.debug(`countDelay: ${config.countDelay}`);
    logger.debug('----- config.json end -----');

    if (!config.botToken) {
        return 'CRITICAL ERROR: Config file is missing a bot token, it is required';
    }

    if (!config.userApiKey) {
        return 'CRITICAL ERROR: Config file is missing a user apikey, it is required';
    }

    if (config.upPing && !config.betterUptimeUrl && !config.cronitorUrl) {
        return 'CRITICAL ERROR: Betteruptime or Cronitor url is required when upPing is enabled';
    }
}

export function pingUptime(counter: number) {
    if (!config.upPing) {
        logger.debug('Uptime ping skipped, upPing = false');
        return;
    }

    if (config.betterUptimeUrl) {
        fetch(config.betterUptimeUrl)
            .then((response) => {
                if (response.ok) {
                    logger.debug('Better uptime ping sent, #' + counter);
                } else {
                    throw new Error(String(response));
                }
            })
            .catch((error) => {
                logger.error('Failed to send uptime ping to better uptime');
                logger.error(error);
            });
    } else {
        logger.debug('Uptime ping skipped, betterUptimeUrl = empty');
    }

    if (config.cronitorUrl) {
        fetch(config.cronitorUrl)
            .then((response) => {
                if (response.ok) {
                    logger.debug('Cronitor uptime ping sent, #' + counter);
                } else {
                    throw new Error(String(response));
                }
            })
            .catch((error) => {
                logger.error('Failed to send uptime ping to cronitor');
                logger.error(error);
            });
    } else {
        logger.debug('Uptime ping skipped, cronitorUrl = empty');
    }
}

export async function pingServerCount(client: Client, headers: Headers) {
    if (!config.scPing) {
        logger.debug('Server count skipped, scPing = false');
        return;
    }

    const shards: Shards[] = [];
    client.shard
        ?.broadcastEval((client) => [client.shard?.ids, client.ws.status, client.ws.ping, client.guilds.cache.size])
        .then((results) => {
            for (const data of results) {
                shards.push({
                    id: data[0],
                    status: data[1],
                    ping: data[2],
                    guilds: data[3],
                });
            }
        })
        .then(async () => {
            const shardData = JSON.stringify(shards);
            let data: NotifiarrApiRequestBody = { botToken: config.botToken };

            await client.shard
                ?.fetchClientValues('guilds.cache.size')
                .then((results) => results as number[])
                .then((results) => {
                    const serverCount = results.reduce((acc: number, guildCount: number) => acc + guildCount, 0);

                    data = {
                        count: serverCount,
                        shardData,
                        botToken: config.botToken,
                    };

                    const headersClone = headers;
                    headersClone.delete('X-server');

                    fetch(config.notifiarrApiUrl + 'system/serverCount', {
                        method: 'POST',
                        headers: headersClone,
                        body: JSON.stringify(data),
                    })
                        .then((response) => {
                            if (response.ok) {
                                logger.debug('Server count (' + serverCount + ') ping sent');
                            } else {
                                throw new Error(String(response));
                            }
                        })
                        .catch((error) => {
                            logger.error('Failed to send server count to notifiarr');
                            logger.error(error);
                        });
                });
        })
        .catch(logger.error);
}

export function webhook(data: NotifiarrApiRequestBody, headers: Headers) {
    if (!config.webhooks) {
        logger.debug('webhooks disabled');
        return;
    }

    logger.debug('building webhook payload...');

    headers.set('X-server', String(data.server));

    const endpoint = data.event ? 'notification/discordApp' : 'user/keywords';

    fetch(config.notifiarrApiUrl + endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
    })
        .then((response) => {
            if (response.ok) {
                logger.debug('webhook sent: /' + endpoint);
            } else {
                throw new Error(String(response));
            }
        })
        .catch((error) => {
            logger.error('Failed to send webhook payload to notifiarr');
            logger.error(error);
        });
}
