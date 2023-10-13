import { SlashCommandBuilder, time } from 'discord.js';
import { type SlashCommandModule } from '../types.js';

const slashCommand: SlashCommandModule = {
    cooldown: 5,
    data: new SlashCommandBuilder().setName('uptime').setDescription('See how long the bot has been running'),
    async execute(interaction) {
        const seconds = Math.floor((Date.now() - interaction.client.uptime) / 1000);
        await interaction.reply(`Uptime: ${time(seconds, 'R')}.`);
    },
};

export default slashCommand;
