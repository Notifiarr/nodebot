import { type Client } from 'discord.js';
import config from './config.js';
import { type NotifiarrApiRequestBody, type Shards } from './types.js';

export function startup() {
    log('----- config.json start -----');
    log(`botToken: ${Boolean(config.botToken)}`);
    log(`userApiKey: ${Boolean(config.userApiKey)}`);
    log(`devDiscordUsers: ${config.devDiscordUsers.length > 0}`);

    log(`notifiarrApiUrl: ${Boolean(config.notifiarrApiUrl)}`);
    log(`betterUptimeUrl: ${Boolean(config.betterUptimeUrl)}`);
    log(`cronitorUrl: ${Boolean(config.cronitorUrl)}`);

    log(`webhooks: ${config.webhooks}`);
    log(`testing: ${config.testing}`);
    log(`debug: ${config.debug}`);
    log(`upPing: ${config.upPing}`);
    log(`scPing: ${config.scPing}`);
    log(`uptimeDelay: ${config.uptimeDelay}`);
    log(`countDelay: ${config.countDelay}`);
    log('----- config.json end -----');

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
        log('Uptime ping skipped, upPing = false');
        return;
    }

    if (config.betterUptimeUrl) {
        fetch(config.betterUptimeUrl)
            .then((response) => {
                if (response.ok) {
                    log('Better uptime ping sent, #' + counter);
                } else {
                    throw new Error(String(response));
                }
            })
            .catch((error) => {
                log('Failed to send uptime ping to better uptime');
                log(String(error));
            });
    } else {
        log('Uptime ping skipped, betterUptimeUrl = empty');
    }

    if (config.cronitorUrl) {
        fetch(config.cronitorUrl)
            .then((response) => {
                if (response.ok) {
                    log('Cronitor uptime ping sent, #' + counter);
                } else {
                    throw new Error(String(response));
                }
            })
            .catch((error) => {
                log('Failed to send uptime ping to cronitor');
                log(String(error));
            });
    } else {
        log('Uptime ping skipped, cronitorUrl = empty');
    }
}

export async function pingServerCount(client: Client, headers: Headers) {
    if (!config.scPing) {
        log('Server count skipped, scPing = false');
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
                                log('Server count (' + serverCount + ') ping sent');
                            } else {
                                throw new Error(String(response));
                            }
                        })
                        .catch((error) => {
                            log('Failed to send server count to notifiarr');
                            log(String(error));
                        });
                });
        })
        .catch((error) => log);
}

export function webhook(data: NotifiarrApiRequestBody, headers: Headers) {
    if (!config.webhooks) {
        log('webhooks disabled');
        return;
    }

    log('building webhook payload...');

    headers.set('X-server', String(data.server));

    const endpoint = data.event ? 'notification/discordApp' : 'user/keywords';

    fetch(config.notifiarrApiUrl + endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
    })
        .then((response) => {
            if (response.ok) {
                log('webhook sent: /' + endpoint);
            } else {
                throw new Error(String(response));
            }
        })
        .catch((error) => {
            log('Failed to send webhook payload to notifiarr');
            log(String(error));
        });
}

export function log(line: string) {
    if (!config.debug) {
        return;
    }

    console.log(getFullTimestamp() + ' ' + line);
}

export function getFullTimestamp() {
    const pad = (n: number, s = 2) => `${n.toString().padStart(s, '0')}`;
    const d = new Date();

    return (
        `${pad(d.getFullYear(), 4)}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` +
        ' ' +
        `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}.${pad(d.getMilliseconds(), 3)}`
    );
}
