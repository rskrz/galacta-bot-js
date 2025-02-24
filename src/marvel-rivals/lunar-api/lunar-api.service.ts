import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { MarvelRivalsApiService } from '../marvel-rivals-api.service';
import {
  LunarApiPlayerIdResponse,
  LunarApiPlayerStatsResponse,
} from './lunar-api.interface';
import {
  MarvelRivalsPlayerDTO,
  MarvelRivalsPlayerHeroesDTO,
  MarvelRivalsPlayerMatchHistoryDTO,
} from '../marvel-rivals.dto';
import { plainToClass } from 'class-transformer';
import {
  MARVEL_RIVALS_ITEMS_MAP,
  MARVEL_RIVALS_HEROES_MAP,
} from 'src/constants';

@Injectable()
export class LunarApiService extends MarvelRivalsApiService {
  constructor(private readonly httpService: HttpService) {
    super();
  }

  private async fetchPlayerId(name: string): Promise<string | null> {
    try {
      const {
        data: { id },
      } = await firstValueFrom(
        this.httpService.get<LunarApiPlayerIdResponse>(`/player-id/${name}`),
      );
      return id;
    } catch (_e) {
      console.error(
        `LunarApiService - Error fetching player id for name: ${name}`,
      );
      return null;
    }
  }

  public async fetchPlayerStats(
    playerId: string,
  ): Promise<LunarApiPlayerStatsResponse | null> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get<LunarApiPlayerStatsResponse>(
          `/player/${playerId}?season=1`,
        ),
      );
      return data;
    } catch (_e) {
      console.error(
        `LunarApiService - Error fetching player stats for id: ${playerId}`,
      );
      return null;
    }
  }

  public async getBothData(name: string) {
    const playerId = await this.fetchPlayerId(name);
    if (!playerId) return;
    const stats = await this.fetchPlayerStats(playerId);
    return stats;
  }

  public async getPlayerStats(
    name: string,
  ): Promise<MarvelRivalsPlayerDTO | null> {
    const playerId = await this.fetchPlayerId(name);
    if (!playerId) {
      return null;
    }
    const playerStats = await this.fetchPlayerStats(playerId);
    if (!playerStats) {
      return null;
    }
    return this.transformToMarvelRivalsPlayerDTO(playerStats);
  }

  public async getAllPlayerStats(
    names: string[],
  ): Promise<MarvelRivalsPlayerDTO[]> {
    const playerIdRequests = names.map((name) => this.fetchPlayerId(name));
    const playerIds = await Promise.all(playerIdRequests);
    const filteredPlayerIds = playerIds.filter((id) => id != null);

    const playerStatsRequests = filteredPlayerIds.map((id) =>
      this.fetchPlayerStats(id),
    );
    const playerStats = await Promise.all(playerStatsRequests);
    const filteredPlayerStats = playerStats.filter((id) => id != null);

    return filteredPlayerStats.map((player) =>
      this.transformToMarvelRivalsPlayerDTO(player),
    );
  }

  private transformToMarvelRivalsPlayerDTO(
    player: LunarApiPlayerStatsResponse,
  ): MarvelRivalsPlayerDTO {
    const heroStats: MarvelRivalsPlayerHeroesDTO[] = [];
    for (const hero of Object.values(player.hero_stats)) {
      if (hero.ranked) {
        heroStats.push(
          plainToClass(MarvelRivalsPlayerHeroesDTO, {
            name: hero.hero_name,
            matches: hero.ranked.matches,
            wins: hero.ranked.wins,
            kda: hero.ranked.kda,
            stats: {
              kills: hero.ranked.kills,
              deaths: hero.ranked.deaths,
              assists: hero.ranked.assists,
            },
          }),
        );
      }
    }

    const matchHistory: MarvelRivalsPlayerMatchHistoryDTO[] = [];
    if (player.match_history) {
      for (const match of Object.values(player.match_history)) {
        matchHistory.push(
          plainToClass(MarvelRivalsPlayerMatchHistoryDTO, {
            name: match.match_map.name,
            timestamp: match.match_timestamp,
            isWin: match.stats.is_win,
            isCompetitive: match.gamemode.id === 2,
            hero: match.stats.hero.id
              ? MARVEL_RIVALS_HEROES_MAP[match.stats.hero.id.toString()].name
              : '',
            stats: {
              kills: match.stats.kills,
              deaths: match.stats.deaths,
              assists: match.stats.assists,
            },
          }),
        );
      }
    }

    return plainToClass(MarvelRivalsPlayerDTO, {
      id: player.player_uid,
      name: player.player_name,
      rank: player.stats.rank.level,
      elo: player.stats.rank.score,
      level: player.stats.level,
      icon: MARVEL_RIVALS_ITEMS_MAP[player.player_icon_id]?.icon,
      team: player.team.name,
      playtimeRaw: player.stats.total_playtime.raw,
      matches: player.stats.total_matches,
      ranked: {
        playtimeRaw: player.stats.ranked?.total_playtime.raw,
        matches: player.stats.ranked?.total_matches,
        wins: player.stats.ranked?.total_wins,
      },
      heroes: heroStats,
      matchHistory: matchHistory,
    });
  }
}
