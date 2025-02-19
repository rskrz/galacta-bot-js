import { Expose, Transform, Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Attachment } from 'discord.js';
import { AttachmentOption, StringOption } from 'necord';

export class MarvelRivalsPlayerDTO {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @Expose()
  @IsNumber()
  rank: number = 0;

  @Type(() => MarvelRivalsPlayerHeroesDTO)
  heroes: MarvelRivalsPlayerHeroesDTO[];
}

export class MarvelRivalsPlayerHeroesDTO {
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

  isOneTrick: boolean = false;
  isGoodPlayer: boolean = false;

  dominance: number = 0;

  constructor(matches: number, wins: number) {
    this.matches = matches;
    this.wins = wins;
  }
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
