import { Events } from 'discord.js';
import logger from '../functions/logger.js';
import notifiarrWebhook from '../functions/notifiarrWebhook.js';
import { type EventModule } from '../types.js';

const event: EventModule<Events.ThreadCreate> = {
    name: Events.ThreadCreate,
    async execute(thread, newlyCreated) {
        logger.verbose(`shard ${thread.guild.shardId}: ${this.name}->${thread.guild.id}`);
        try {
            await notifiarrWebhook(
                {
                    event: this.name,
                    botToken: thread.client.token,
                    server: thread.guild.id,
                    member: thread.ownerId ?? undefined,
                    thread: thread.id,
                    threadParent: thread.parentId ?? undefined,
                },
                thread.guild.shardId,
                0,
            );
        } catch (error) {
            logger.error('caught:', error);
        }
    },
};

export default event;
