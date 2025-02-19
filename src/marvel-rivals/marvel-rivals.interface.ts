export interface MarvelRivalsPlayerStats {
  id: number;
}

export interface HeroMetrics {
  diversityScore: number;
  primaryHeroDominance: number;
  playRateDecay: number;
  isOneTrick: boolean;
  totalMatches: number;
}

export interface HeroPlayerMapping {
  [heroName: string]: string[];
}
