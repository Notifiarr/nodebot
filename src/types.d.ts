import { type ClientEvents } from 'discord.js';

export interface NotifiarrApiRequestBody {
    botToken: string;

    count?: number;
    shardData?: string;

    event?: keyof ClientEvents;
    server?: string;
    channel?: string;
    customId?: string;

    thread?: string;
    threadArchived?: boolean;
    threadName?: string;
    threadParent?: string;

    member?: string;
    memberCount?: number;

    message?: string;
    messageCount?: number;
    newMessage?: string;
    oldMessage?: string;
    previousMessage?: string;

    mediarequest_eventtype?: 'ping';

    authorRoles?: string[];
}
export interface Shards {
    id?: number | number[];
    status?: number | number[];
    ping?: number | number[];
    guilds?: number | number[];
}
