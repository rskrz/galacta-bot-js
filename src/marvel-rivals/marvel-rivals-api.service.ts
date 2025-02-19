import { Injectable } from '@nestjs/common';
import { MarvelRivalsPlayerDTO } from './marvel-rivals.dto';

@Injectable()
export abstract class MarvelRivalsApiService {
  abstract getAllPlayerStats(names: string[]): Promise<MarvelRivalsPlayerDTO[]>;
  abstract getPlayerStats(name: string): Promise<MarvelRivalsPlayerDTO>;
}
