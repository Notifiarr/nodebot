import { Events } from 'discord.js';
import logger from '../functions/logger.js';
import notifiarrWebhook from '../functions/notifiarrWebhook.js';
import { type EventModule } from '../types.js';

const event: EventModule<Events.GuildBanAdd> = {
    name: Events.GuildBanAdd,
    async execute(ban) {
        logger.debug(`${this.name}->${ban.guild.id}`);
        try {
            await notifiarrWebhook({
                event: this.name,
                botToken: ban.client.token,
                server: ban.guild.id,
                user: JSON.stringify(ban.user),
            });
        } catch (error) {
            logger.error('caught:', error);
        }
    },
};

export default event;
