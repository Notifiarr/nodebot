import { Events } from 'discord.js';
import logger from '../functions/logger.js';
import notifiarrWebhook from '../functions/notifiarrWebhook.js';
import { type EventModule } from '../types.js';

const event: EventModule<Events.GuildMemberAdd> = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        const webhookTimestamp = Date.now();
        logger.verbose(`shard ${member.guild.shardId} #${webhookTimestamp}: ${this.name}->${member.guild.id}`);
        try {
            await notifiarrWebhook(
                {
                    event: this.name,
                    botToken: member.client.token,
                    server: member.guild.id,
                    member: JSON.stringify(member),
                    memberCount: member.guild.memberCount,
                },
                member.guild.shardId,
                webhookTimestamp,
            );
        } catch (error) {
            logger.error('caught:', error);
        }
    },
};

export default event;
