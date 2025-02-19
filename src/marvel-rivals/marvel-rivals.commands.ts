import { Injectable } from '@nestjs/common';
import { GeminiService } from 'src/gemini/gemini.service';
import { MarvelRivalsApiService } from './marvel-rivals-api.service';
import { EmbedBuilder, Colors } from 'discord.js';
import { SlashCommand, Context, SlashCommandContext, Options } from 'necord';
import { RANK_EMOJIS } from 'src/constants';
import {
  MarvelRivalsBansAttachmentDTO,
  MarvelRivalsStatsNameDTO,
} from './marvel-rivals.dto';
import { MarvelRivalsService } from './marvel-rivals.service';

@Injectable()
export class MarvelRivalsCommands {
  constructor(
    private readonly marvelRivals: MarvelRivalsService,
    private readonly api: MarvelRivalsApiService,
    private readonly geminiService: GeminiService,
  ) {}

  @SlashCommand({
    name: 'stats',
    description:
      'Retrieve recommended bans for players featured in attached image.',
    guilds: ['546094494873944080'],
  })
  public async onStats(
    @Context() [interaction]: SlashCommandContext,
    @Options() { name }: MarvelRivalsStatsNameDTO,
  ) {
    await interaction.deferReply();
    const player = await this.api.getPlayerStats(name);

    console.log(player);

    await interaction.editReply({ content: 'stats' });
  }

  @SlashCommand({
    name: 'bans',
    description:
      'Retrieve recommended bans for players featured in attached image.',
    guilds: ['546094494873944080'],
  })
  public async onBans(
    @Context() [interaction]: SlashCommandContext,
    @Options() { attachment }: MarvelRivalsBansAttachmentDTO,
  ) {
    await interaction.deferReply();

    const playerNames = await this.geminiService.getUsernamesFromImage(
      attachment.url,
      attachment.contentType ?? 'image/png',
    );

    const players = await this.api.getAllPlayerStats(playerNames);
    const bans = this.marvelRivals.determineBans(players);

    const embed = new EmbedBuilder()
      .setTitle('Player Analysis')
      .setDescription('Analysis of detected players and their hero pools')
      .setColor(Colors.Blue)
      .setTimestamp();

    for (const player of players) {
      const heroInfo = player.heroes.map((hero) =>
        this.marvelRivals.generateHeroInfo(hero),
      );

      const { rank, tier } = this.marvelRivals.getPlayerRank(player.rank);
      embed.addFields({
        name: `${player.name} ${RANK_EMOJIS[rank] || ''} ${tier > -1 ? tier : ''}`,
        value: heroInfo.length ? heroInfo.join('\n') : 'No hero data available',
        inline: false,
      });
    }

    const oneTrickInfo = this.marvelRivals.generateCategoryInfo(
      bans.oneTricks,
      'One Tricks',
    );
    const goodPlayerInfo = this.marvelRivals.generateCategoryInfo(
      bans.goodPlayers,
      'Good Players',
    );
    const commonHeroInfo = this.marvelRivals.generateCategoryInfo(
      bans.commonHeroes,
      'Common Heroes',
    );

    embed.addFields({
      name: '🚫 Recommended Bans',
      value: oneTrickInfo + goodPlayerInfo + commonHeroInfo,
      inline: false,
    });

    return interaction.editReply({ embeds: [embed] });
  }
}
