import dotenv from 'dotenv';
import process from 'node:process';

dotenv.config();

function evalBool(value: string | undefined): boolean {
    if (value === undefined) return false;
    if (value.toLocaleLowerCase() === 'false') return false;
    if (value.toLocaleLowerCase() === 'true') return true;

    return false;
}

function blankUndefined(value: string | undefined): string | undefined {
    if (value === undefined) return undefined;
    if (value === '') return undefined;

    return value;
}

const config = {
    botToken: process.env.BOT_TOKEN ?? '',
    userApiKey: process.env.USER_API_KEY ?? '',
    devDiscordUsers: (process.env.DEV_DISCORD_USERS ?? '').split(',').map(Number),

    notifiarrApiUrl: blankUndefined(process.env.NOTIFIARR_API_URL),
    betterUptimeUrl: blankUndefined(process.env.BETTER_UPTIME_URL),
    cronitorUrl: blankUndefined(process.env.CRONITOR_URL),

    webhooks: evalBool(process.env.WEBHOOKS),
    testing: evalBool(process.env.TESTING),
    debug: evalBool(process.env.DEBUG),
    upPing: evalBool(process.env.UP_PING),
    scPing: evalBool(process.env.SC_PING),
    uptimeDelay: Number(process.env.UPTIME_DELAY ?? 4),
    countDelay: Number(process.env.COUNT_DELAY ?? 10),
};

export default config;
