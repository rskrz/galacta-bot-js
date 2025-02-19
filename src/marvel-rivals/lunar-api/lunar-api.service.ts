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
} from '../marvel-rivals.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class LunarApiService extends MarvelRivalsApiService {
  constructor(private readonly httpService: HttpService) {
    super();
  }

  private async fetchPlayerId(name: string): Promise<string> {
    const {
      data: { id },
    } = await firstValueFrom(
      this.httpService.get<LunarApiPlayerIdResponse>(`/player-id/${name}`),
    );
    return id;
  }

  public async fetchPlayerStats(
    playerId: string,
  ): Promise<LunarApiPlayerStatsResponse> {
    const { data } = await firstValueFrom(
      this.httpService.get<LunarApiPlayerStatsResponse>(`/player/${playerId}`),
    );

    return data;
  }

  public async getBothData(name: string) {
    const playerId = await this.fetchPlayerId(name);
    const stats = await this.fetchPlayerStats(playerId);
    return stats;
  }

  public async getPlayerStats(name: string): Promise<MarvelRivalsPlayerDTO> {
    const playerId = await this.fetchPlayerId(name);
    const playerStats = await this.fetchPlayerStats(playerId);
    return this.transformToMarvelRivalsPlayerDTO(playerStats);
  }

  public async getAllPlayerStats(names: string[]) {
    const playerIdRequests = names.map((name) => this.fetchPlayerId(name));
    const playerIds = await Promise.all(playerIdRequests);

    const playerStatsRequests = playerIds.map((id) =>
      this.fetchPlayerStats(id),
    );
    const playerStats = await Promise.all(playerStatsRequests);

    return playerStats.map((player) =>
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
          }),
        );
      }
    }

    return plainToClass(MarvelRivalsPlayerDTO, {
      id: player.player_uid,
      name: player.player_name,
      rank: player.stats.rank.level,
      heroes: heroStats,
    });
  }
}
