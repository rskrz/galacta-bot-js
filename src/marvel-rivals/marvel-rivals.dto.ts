import { Expose, Transform, Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { Attachment } from 'discord.js';
import { AttachmentOption, StringOption } from 'necord';

class MarvelRivalsPlayerKDAStatsDTO {
  @Expose()
  @IsNumber()
  kills: number;

  @Expose()
  @IsNumber()
  deaths: number;

  @Expose()
  @IsNumber()
  assists: number;

  @Expose()
  @Transform(
    ({ obj }: { obj: MarvelRivalsPlayerKDAStatsDTO }) =>
      obj.deaths > 0
        ? ((obj.kills + obj.assists) / obj.deaths).toFixed(2)
        : (obj.kills + obj.assists).toFixed(2),
    { toClassOnly: true },
  )
  kda: string;
}

class MarvelRivalsPlayerRankedStatsDTO {
  @Expose()
  @IsNumber()
  @Transform(({ value }: { value: number }) =>
    value !== undefined && value !== null ? value : 0,
  )
  matches: number = 0;

  @Expose()
  @IsNumber()
  @Transform(({ value }: { value: number }) =>
    value !== undefined && value !== null ? value : 0,
  )
  wins: number = 0;

  @Expose()
  @Transform(
    ({ obj }: { obj: MarvelRivalsPlayerRankedStatsDTO }) =>
      obj.matches > 0 ? (obj.wins / obj.matches) * 100 : 0,
    { toClassOnly: true },
  )
  winrate: number = 0;

  @Expose()
  @IsNumber()
  playtimeRaw: number;

  @Expose()
  @Transform(
    ({ obj }: { obj: MarvelRivalsPlayerRankedStatsDTO }) =>
      obj.playtimeRaw > 3600
        ? `${Math.round(obj.playtimeRaw / 3600)}h`
        : '< 1hr',
    { toClassOnly: true },
  )
  playtime: string;
}

export class MarvelRivalsPlayerDTO {
  @Expose()
  @IsString()
  id: string;

  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsNumber()
  rank: number = 0;

  @Expose()
  @IsNumber()
  @Transform(({ value }: { value: number }) =>
    value !== undefined && value !== null ? value : 0,
  )
  elo: number = 0;

  @Expose()
  @IsString()
  icon: string = '';

  @Expose()
  @IsString()
  team: string;

  @Expose()
  @IsString()
  level: string;

  @Expose()
  @IsNumber()
  playtimeRaw: number;

  @Expose()
  @Transform(
    ({ obj }: { obj: MarvelRivalsPlayerRankedStatsDTO }) =>
      obj.playtimeRaw > 3600
        ? `${Math.round(obj.playtimeRaw / 3600)}h`
        : '< 1hr',
    { toClassOnly: true },
  )
  playtime: string;

  @Expose()
  @IsNumber()
  @Transform(({ value }: { value: number }) =>
    value !== undefined && value !== null ? value : 0,
  )
  matches: number = 0;

  @Expose()
  @Type(() => MarvelRivalsPlayerRankedStatsDTO)
  ranked: MarvelRivalsPlayerRankedStatsDTO;

  @Expose()
  @Type(() => MarvelRivalsPlayerMatchHistoryDTO)
  matchHistory: MarvelRivalsPlayerMatchHistoryDTO[];

  @Expose()
  @Type(() => MarvelRivalsPlayerHeroesDTO)
  heroes: MarvelRivalsPlayerHeroesDTO[];
}

export class MarvelRivalsPlayerHeroesDTO {
  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsOptional()
  @Transform(({ value }) =>
    value !== undefined && value !== null ? parseInt(value, 10) : 0,
  )
  @IsNumber()
  matches: number = 0;

  @Expose()
  @IsOptional()
  @Transform(({ value }) =>
    value !== undefined && value !== null ? parseInt(value, 10) : 0,
  )
  @IsNumber()
  wins: number = 0;

  @Expose()
  @Transform(
    ({ obj }: { obj: MarvelRivalsPlayerHeroesDTO }) =>
      obj.matches > 0 ? (obj.wins / obj.matches) * 100 : 0,
    { toClassOnly: true },
  )
  winrate: number = 0;

  @Expose()
  @IsBoolean()
  isOneTrick: boolean = false;

  @Expose()
  @IsBoolean()
  isGoodPlayer: boolean = false;

  @Expose()
  @IsNumber()
  dominance: number = 0;

  @Expose()
  @IsString()
  kda: string;

  @Expose()
  @Type(() => MarvelRivalsPlayerKDAStatsDTO)
  stats: MarvelRivalsPlayerKDAStatsDTO;

  constructor(matches: number, wins: number) {
    this.matches = matches;
    this.wins = wins;
  }
}

export class MarvelRivalsPlayerMatchHistoryDTO {
  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsNumber()
  timestamp: number;

  @Expose()
  @IsString()
  isWin: string;

  @Expose()
  @IsBoolean()
  isCompetitive: boolean = false;

  @Expose()
  @IsString()
  hero: string;

  @Expose()
  @Type(() => MarvelRivalsPlayerKDAStatsDTO)
  stats: MarvelRivalsPlayerKDAStatsDTO;
}

export class MarvelRivalsBansAttachmentDTO {
  @AttachmentOption({
    name: 'image',
    description: 'Image of player usernames',
    required: true,
  })
  attachment: Attachment;
}

export class MarvelRivalsStatsNameDTO {
  @StringOption({
    name: 'name',
    description: 'Player username',
    required: true,
  })
  name: string;
}
