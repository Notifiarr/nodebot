import { Events } from 'discord.js';
import logger from '../functions/logger.js';
import notifiarrWebhook from '../functions/notifiarrWebhook.js';
import { type EventModule } from '../types.js';

const event: EventModule<Events.ThreadDelete> = {
    name: Events.ThreadDelete,
    async execute(thread) {
        logger.verbose(`${this.name}->${thread.guild.id}`);
        try {
            await notifiarrWebhook({
                event: this.name,
                botToken: thread.client.token,
                server: thread.guild.id,
                member: thread.ownerId ?? undefined,
                memberCount: thread.memberCount ?? undefined,
                messageCount: thread.messageCount ?? undefined,
                thread: thread.id,
                threadArchived: thread.archived ?? undefined,
                threadName: thread.name,
                threadParent: thread.parentId ?? undefined,
            });
        } catch (error) {
            logger.error('caught:', error);
        }
    },
};

export default event;
