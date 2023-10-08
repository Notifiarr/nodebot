import { ClientEvents } from "discord.js";

export type notifiarrApiRequestBody = {
  botToken: string;

  count?: number;
  shardData?: string;

  event?: keyof ClientEvents;
  server?: string | null;
  channel?: string | null;
  customId?: string | null;

  thread?: string;
  threadArchived?: boolean | null;
  threadName?: string;
  threadParent?: string | null;

  member?: string | null;
  memberCount?: number | null;

  message?: string | null;
  messageCount?: number | null;
  newMessage?: string | null;
  oldMessage?: string | null;
  previousMessage?: string | null;

  mediarequest_eventtype?: "ping";

  authorRoles?: string[];
};
export type shardData = {
  id?: number | number[] | null;
  status?: number | number[] | null;
  ping?: number | number[] | null;
  guilds?: number | number[] | null;
};
