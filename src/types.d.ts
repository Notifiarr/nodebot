import { type Awaitable, type ClientEvents } from 'discord.js';

export interface EventModule<K extends keyof ClientEvents> {
    name: K;
    once?: boolean;
    execute: (...eventArguments: ClientEvents[K]) => Awaitable<void>;
}

export interface Shards {
    id?: number | number[];
    status?: number | number[];
    ping?: number | number[];
    guilds?: number | number[];
}
