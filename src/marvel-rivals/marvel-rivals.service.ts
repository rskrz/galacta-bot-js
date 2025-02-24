import { HERO_EMOJI_MAP } from 'src/constants';
import {
  MarvelRivalsPlayerDTO,
  MarvelRivalsPlayerHeroesDTO,
} from './marvel-rivals.dto';
import { HeroMetrics, HeroPlayerMapping } from './marvel-rivals.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MarvelRivalsService {
  public determineBans(players: MarvelRivalsPlayerDTO[]) {
    const COMMON_WINRATE_THRESHOLD = 40;
    const COMMON_MATCH_THRESHOLD = 20;

    const GOOD_PLAYER_WINRATE_THRESHOLD = 60;
    const GOOD_PLAYER_MATCH_THRESHOLD = 30;

    const allHeroes: HeroPlayerMapping = {};
    const oneTricks: HeroPlayerMapping = {};
    const goodPlayers: HeroPlayerMapping = {};

    for (const player of players) {
      const topHeroes = this.getTopHeroes(player);
      const heroMetrics = this.calculateHeroPoolMetrics(topHeroes);

      player.heroes = topHeroes;

      if (heroMetrics.isOneTrick) {
        player.heroes[0].isOneTrick = true;
        player.heroes[0].dominance = heroMetrics.primaryHeroDominance;
        const topHero = player.heroes[0];
        if (oneTricks[topHero.name]) {
          oneTricks[topHero.name].push(player.name);
        } else {
          oneTricks[topHero.name] = [player.name];
        }
      }

      for (const [i, hero] of topHeroes.entries()) {
        if (
          hero.winrate >= COMMON_WINRATE_THRESHOLD &&
          hero.matches >= COMMON_MATCH_THRESHOLD
        ) {
          if (allHeroes[hero.name]) {
            allHeroes[hero.name].push(player.name);
          } else {
            allHeroes[hero.name] = [player.name];
          }
        }

        if (
          hero.winrate >= GOOD_PLAYER_WINRATE_THRESHOLD &&
          hero.matches >= GOOD_PLAYER_MATCH_THRESHOLD
        ) {
          if (goodPlayers[hero.name]) {
            goodPlayers[hero.name].push(player.name);
          } else {
            goodPlayers[hero.name] = [player.name];
          }
          player.heroes[i].isGoodPlayer = true;
        }
      }
    }

    const commonHeroes = Object.fromEntries(
      Object.entries(allHeroes).filter(([, arr]) => arr.length > 2),
    );

    return {
      players,
      oneTricks,
      goodPlayers,
      commonHeroes,
    };
  }

  public getTopHeroes(player: MarvelRivalsPlayerDTO, count = 5) {
    return player.heroes
      .filter((hero) => hero.matches > 0)
      .toSorted((a, b) => b.matches - a.matches)
      .slice(0, count);
  }

  public getRecentMatches(player: MarvelRivalsPlayerDTO, count = 3) {
    return player.matchHistory
      .filter((match) => match.isCompetitive)
      .toSorted((a, b) => b.timestamp - a.timestamp)
      .slice(0, count);
  }

  private calculateHeroPoolMetrics(
    topHeroes: MarvelRivalsPlayerHeroesDTO[],
  ): HeroMetrics {
    const ONE_TRICK_MINIMUM_MATCHES = 50;
    const PRIMARY_HERO_THRESHOLD = 0.4;
    const PLAY_RATE_DECAY_THRESHOLD = 2.0;
    const HERO_POOL_CONCENTRATION_THRESHOLD = 0.25;

    const totalMatches = topHeroes.reduce((sum, hero) => sum + hero.matches, 0);

    // Calculate play rate distribution
    const playRates = topHeroes.map((hero) => hero.matches / totalMatches);

    // Calculate Herfindahl-Hirschman Index (HHI) for hero pool concentration
    const hhi = playRates.reduce((sum, rate) => sum + rate * rate, 0);

    // Calculate primary hero dominance
    const primaryHeroDominance = playRates[0] || 0;

    // Calculate play rate decay between primary and secondary heroes
    const playRateDecay =
      playRates.length > 1 ? playRates[0] / playRates[1] : Infinity;

    // Determine if player is a one-trick using multiple criteria
    const isOneTrick =
      totalMatches >= ONE_TRICK_MINIMUM_MATCHES &&
      primaryHeroDominance > PRIMARY_HERO_THRESHOLD &&
      playRateDecay > PLAY_RATE_DECAY_THRESHOLD &&
      hhi > HERO_POOL_CONCENTRATION_THRESHOLD;

    return {
      diversityScore: 1 - hhi, // Convert HHI to diversity score
      primaryHeroDominance,
      playRateDecay,
      isOneTrick,
      totalMatches,
    };
  }

  public getPlayerRank(level: number) {
    const rankTiers: { [key: string]: number[] } = {
      Bronze: [0, 1, 2, 3],
      Silver: [4, 5, 6],
      Gold: [7, 8, 9],
      Platinum: [10, 11, 12],
      Diamond: [13, 14, 15],
      Grandmaster: [16, 17, 18],
      Celestial: [19, 20, 21],
      Eternity: [22],
      'One Above All': [23],
    };

    const romanNumerals = ['', 'I', 'II', 'III'];

    for (const [rank, levels] of Object.entries(rankTiers)) {
      if (levels.includes(level)) {
        if (rank === 'Eternity' || rank === 'One Above All') {
          return { rank, tier: '' };
        }
        const tier = 3 - (level - Math.min(...levels));
        return { rank, tier: romanNumerals[tier] };
      }
    }

    return { rank: 'Default', tier: '' };
  }

  public generateCategoryInfo(
    category: HeroPlayerMapping,
    categoryName: string,
  ): string {
    let categoryInfo =
      Object.keys(category).length > 0 ? `__${categoryName}__\n` : '';
    for (const [heroName, players] of Object.entries(category)) {
      categoryInfo += `${HERO_EMOJI_MAP[heroName]} ${players.join(', ')}\n`;
    }
    return categoryInfo;
  }

  public generateHeroInfo(hero: MarvelRivalsPlayerHeroesDTO) {
    let info = `${HERO_EMOJI_MAP[hero.name] || hero.name} ${hero.matches} matches, ${hero.winrate.toFixed(1)}% WR`;
    if (hero.isOneTrick) {
      info = `**${info} - One Trick ${(hero.dominance * 100).toFixed(1)}% DOM**`;
    } else if (hero.isGoodPlayer) {
      info = `**${info} - Good Player**`;
    }
    return info;
  }
}
