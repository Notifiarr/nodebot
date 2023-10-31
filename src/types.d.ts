import {
    type AutocompleteInteraction,
    type Awaitable,
    type ChatInputCommandInteraction,
    type ClientEvents,
    type Collection,
    type SlashCommandBuilder,
} from 'discord.js';

export interface SlashCommandModule {
    autocomplete?: (eventArguments: AutocompleteInteraction) => Awaitable<void>;
    data: SlashCommandBuilder | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>;
    cooldown?: number; // In seconds
    execute: (eventArguments: ChatInputCommandInteraction) => Awaitable<void>;
}

export interface EventModule<K extends keyof ClientEvents> {
    name: K;
    once?: boolean;
    execute: (...eventArguments: ClientEvents[K]) => Awaitable<void>;
}

declare module 'discord.js' {
    export interface Client {
        slashCommands: Collection<string, SlashCommandModule>;
        cooldowns: Collection<string, Collection<ClientUser['id'], number>>;
    }
}

export interface Shards {
    id?: number | number[];
    status?: number | number[];
    ping?: number | number[];
    guilds?: number | number[];
}
