import fetch from 'node-fetch';
import * as fs from 'fs';
const config = JSON.parse(fs.readFileSync('/config/config.json', 'utf8').toString());

export function startup() {
    log('----- config.json start -----');
    log('botToken: ' + (config['botToken'] ? 'true' : 'false'));
    log('userApikey: ' + (config['userApikey'] ? 'true' : 'false'));
    log('devDiscordUsers: ' + (config['devDiscordUsers'].length > 0 ? 'true' : 'false'));

    log('notifiarrApiURL: ' + (config['notifiarrApiURL'] ? 'true' : 'false'));
    log('betterUptimeURL: ' + (config['betterUptimeURL'] ? 'true' : 'false'));
    log('cronitorURL: ' + (config['cronitorURL'] ? 'true' : 'false'));

    log('webhooks: ' + (config['webhooks'] ? 'true' : 'false'));
    log('testing: ' + (config['testing'] ? 'true' : 'false'));
    log('debug: ' + (config['debug'] ? 'true' : 'false'));
    log('upPing: ' + (config['upPing'] ? 'true' : 'false'));
    log('scPing: ' + (config['scPing'] ? 'true' : 'false'));
    log('uptimeDelay: ' + config['uptimeDelay']);
    log('countDelay: ' + config['countDelay']);
    log('----- config.json end -----');

    if (!config['botToken']) {
        return 'CRITICAL ERROR: Config file is missing a bot token, it is required';
    }
    
    if (!config['userApikey']) {
        return 'CRITICAL ERROR: Config file is missing a user apikey, it is required';
    }

    if (config['upPing'] && !config['betterUptimeURL'] && !config['cronitorURL']) {
        return 'CRITICAL ERROR: Betteruptime or Cronitor url is required when upPing is enabled';
    }
}

export function pingUptime(counter) {
    if (!config['upPing']) {
        log('Uptime ping skipped, upPing = false');
        return;
    }

    if (!config['betterUptimeURL']) {
        log('Uptime ping skipped, betterUptimeURL = empty');
    } else {
        fetch(config['betterUptimeURL']).then((res) => {
            if (res.ok) {
                log('Better uptime ping sent, #' + counter);
            } else {
                throw res;
            }
        }).catch(error => {
            log('Failed to send uptime ping to better uptime');
            log(error);
        });
    }

    if (!config['cronitorURL']) {
        log('Uptime ping skipped, cronitorURL = empty');
    } else {
        fetch(config['cronitorURL']).then((res) => {
            if (res.ok) {
                log('Cronitor uptime ping sent, #' + counter);
            } else {
                throw res;
            }
        }).catch(error => {
            log('Failed to send uptime ping to cronitor');
            log(error);
        });
    }
}

export function pingServerCount(client, headers) {
    if (!config['scPing']) {
        log('Server count skipped, scPing = false');
        return;
    }

	let shards = [];
	client.shard.broadcastEval(client => [client.shard.ids, client.ws.status, client.ws.ping, client.guilds.cache.size]).then((results) => {
		results.map((data) => {
			shards.push({'id': data[0], 'status': data[1], 'ping': data[2], 'guilds': data[3]});
		});
	}).then(() => {
		let shardData = JSON.stringify(shards);
        let data = [];

		client.shard.fetchClientValues('guilds.cache.size').then(results => {
			const serverCount = results.reduce((acc, guildCount) => acc + guildCount, 0);

			data = {
				'count': serverCount,
				'shardData': shardData,
				'botToken': config['botToken']
			}

			let headersClone = headers;
			delete headersClone['X-server'];

			fetch(config['notifiarrApiURL'] + 'system/serverCount', {
				method: 'POST',
				headers: headersClone,
				body: JSON.stringify(data)
			}).then((res) => {
                if (res.ok) {
                    log('Server count (' + serverCount + ') ping sent');
                } else {
                    throw res;
                }
			}).catch(error => {
                log('Failed to send server count to notifiarr');
                log(error);
            });
		});
	});
}

export function webhook(data, headers) {
    if (!config['webhooks']) {
        log('webhooks disabled');
        return;
    }

    log('building webhook payload...');

    headers['X-server'] = data['server'];

    const endpoint = (data.event ? 'notification/discordApp' : 'user/keywords');

    fetch(config['notifiarrApiURL'] + endpoint, {
        method: 'POST', 
        headers: headers, 
        body: JSON.stringify(data)
	}).then((res) => {
        if (res.ok) {
            log('webhook sent: /' + endpoint);
        } else {
            throw res;
        }
    }).catch(error => {
        log ('Failed to send webhook payload to notifiarr');
        log(error);
    });
}

export function log(line) {
    if (!config['debug']) {
        return;
    }

    console.log(getFullTimestamp() + ' ' + line);
}

export function getFullTimestamp() {
    const pad = (n,s=2) => (`${new Array(s).fill(0)}${n}`).slice(-s);
    const d = new Date();

    return `${pad(d.getFullYear(),4)}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}.${pad(d.getMilliseconds(),3)}`;
}
