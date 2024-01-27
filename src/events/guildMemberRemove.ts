import { Events } from 'discord.js';
import logger from '../functions/logger.js';
import notifiarrWebhook from '../functions/notifiarrWebhook.js';
import { type EventModule } from '../types.js';

const event: EventModule<Events.GuildMemberRemove> = {
    name: Events.GuildMemberRemove,
    async execute(member) {
        logger.verbose(`shard ${member.guild.shardId}: ${this.name}->${member.guild.id}`);
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
                0,
            );
        } catch (error) {
            logger.error('caught:', error);
        }
    },
};

export default event;
