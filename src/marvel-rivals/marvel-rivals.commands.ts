import { Injectable } from '@nestjs/common';
import { GeminiService } from 'src/gemini/gemini.service';
import { MarvelRivalsApiService } from './marvel-rivals-api.service';
import { EmbedBuilder } from 'discord.js';
import { SlashCommand, Context, SlashCommandContext, Options } from 'necord';
import { HERO_EMOJI_MAP, RANK_EMOJIS } from 'src/constants';
import {
  MarvelRivalsBansAttachmentDTO,
  MarvelRivalsStatsNameDTO,
} from './marvel-rivals.dto';
import { MarvelRivalsService } from './marvel-rivals.service';
import { DiscordService } from 'src/discord/discord.service';
import { UseCooldown } from 'src/common/decorators/cooldown.decorator';
import { UseRateLimit } from 'src/common/decorators/reate-limit.decorator';
import { RemainingUses } from 'src/common/decorators/remaining-uses.decorator';

@Injectable()
export class MarvelRivalsCommands {
  constructor(
    private readonly marvelRivals: MarvelRivalsService,
    private readonly api: MarvelRivalsApiService,
    private readonly geminiService: GeminiService,
    private readonly discordService: DiscordService,
  ) {}

  @SlashCommand({
    name: 'test',
    description: 'test.',
    guilds: ['1337523233649594420', '546094494873944080'],
  })
  @UseCooldown()
  @UseRateLimit()
  public async onTest(
    @Context() [interaction]: SlashCommandContext,
    @RemainingUses() remainingUses: number,
  ) {
    if (!interaction.deferred && !interaction.replied) {
      await interaction.deferReply();
    }
    await interaction.editReply('test! ' + remainingUses);
  }

  @SlashCommand({
    name: 'stats',
    description:
      'Retrieve recommended bans for players featured in attached image.',
    guilds: ['1337523233649594420', '546094494873944080'],
  })
  @UseCooldown()
  public async onStats(
    @Context() [interaction]: SlashCommandContext,
    @Options() { name }: MarvelRivalsStatsNameDTO,
  ) {
    if (!interaction.deferred && !interaction.replied) {
      await interaction.deferReply();
    }

    const player = await this.api.getPlayerStats(name);
    if (!player) {
      await interaction.editReply('Could not fetch stats for player.');
      return;
    }

    let authorName = player.name;
    if (player.team) {
      authorName = `[${player.team}] ${authorName}`;
    }

    const { rank, tier } = this.marvelRivals.getPlayerRank(player.rank);

    const embed = new EmbedBuilder()
      .setTitle('Player Stats')
      .setDescription(`Level ${player.level} | ${player.playtime} Playtime`)
      .setAuthor({ name: authorName, iconURL: player.icon })
      .setColor('#fbdc2c')
      .setTimestamp()
      .setThumbnail(player.icon);

    embed.addFields({
      name: 'Competitive Overview [Season 1]',
      value: `${RANK_EMOJIS[rank]}${tier} ${player.elo}RS | ${player.ranked.matches} Matches | ${player.ranked.playtime} Playtime`,
      inline: false,
    });

    const topHeroes = this.marvelRivals.getTopHeroes(player, 3);

    for (const hero of topHeroes) {
      embed.addFields({
        name: `${HERO_EMOJI_MAP[hero.name]}`,
        value: `WR **${hero.winrate.toFixed(1)}%**\n__${hero.wins}W - ${hero.matches - hero.wins}L__\nKDA **${hero.kda}**\n${hero.stats.kills}/${hero.stats.deaths}/${hero.stats.assists}`,
        inline: true,
      });
    }

    embed.addFields({
      name: 'Match History',
      value: `WR: **${player.ranked.winrate.toFixed(2)}%** ${player.ranked.wins}W - ${player.ranked.matches - player.ranked.wins}L`,
      inline: false,
    });

    const recentMatches = this.marvelRivals.getRecentMatches(player, 3);

    for (const match of recentMatches) {
      const resultEmoji = match.isWin ? '✅' : '❌';
      embed.addFields({
        name: `${resultEmoji} ${match.name}`,
        value: `${HERO_EMOJI_MAP[match.hero] ?? ''} KDA **${match.stats.kda}** ${match.stats.kills}/${match.stats.deaths}/${match.stats.assists}`,
        inline: false,
      });
    }

    await interaction.editReply({
      embeds: [embed],
    });
  }

  @SlashCommand({
    name: 'bans',
    description:
      'Retrieve recommended bans for players featured in attached image.',
    guilds: ['1337523233649594420', '546094494873944080'],
  })
  @UseCooldown()
  @UseRateLimit()
  public async onBans(
    @Context() [interaction]: SlashCommandContext,
    @RemainingUses() remainingUses: number,
    @Options() { attachment }: MarvelRivalsBansAttachmentDTO,
  ) {
    if (!interaction.deferred && !interaction.replied) {
      await interaction.deferReply();
    }

    const playerNames = await this.geminiService.getUsernamesFromImage(
      attachment.url,
      attachment.contentType ?? 'image/png',
    );

    const players = await this.api.getAllPlayerStats(playerNames);
    const bans = this.marvelRivals.determineBans(players);

    const embed = new EmbedBuilder()
      .setTitle('Player Analysis')
      .setDescription('Analysis of detected players and their hero pools')
      .setColor('#fbdc2c')
      .setTimestamp();

    for (const player of players) {
      const heroInfo = player.heroes.map((hero) =>
        this.marvelRivals.generateHeroInfo(hero),
      );

      const { rank, tier } = this.marvelRivals.getPlayerRank(player.rank);

      embed.addFields({
        name: `${player.name} ${RANK_EMOJIS[rank] || ''} ${tier}`,
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

    return interaction.editReply({
      embeds: [embed],
      content: remainingUses > -1 ? `Remaining uses: ${remainingUses}` : '',
    });
  }
}
