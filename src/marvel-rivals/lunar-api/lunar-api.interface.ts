export interface LunarApiPlayerIdResponse {
  name: string;
  id: string;
}

export interface LunarApiPlayerStatsResponse {
  player_name: string; // Player's username
  player_uid: string; // Player's unique ID
  last_updated: number; // Timestamp of when the profile was last updated
  player_icon_id: string; // Player's profile icon ID
  is_profile_private: boolean; // Whether the profile is private
  region: string; // Region where the player is located
  achievements_completed: string; // Number of achievements completed (as a string)
  team: Team;
  stats: Stats; // Player stats (level, rank, etc.)
  hero_stats: HeroStats; // Stats for each hero
}

interface Team {
  id: string;
  name: string;
  type: string;
}

interface Stats {
  level: string; // Player's level (string to match the response format)
  rank: Rank; // Player's rank information
  total_matches: number;
  total_wins: number;
  total_losses: number;
  total_playtime: TotalPlaytime;
}

interface Rank {
  level?: number; // Rank level (e.g., 19)
  rank: string; // Rank name (e.g., "Celestial 3")
  score: number; // Player's score
  win_count: number; // Number of wins
}

interface TotalPlaytime {
  hours: number;
  minutes: number;
  seconds: number;
  raw: number;
}

interface HeroStats {
  [key: string]: Hero; // Hero stats keyed by hero ID (e.g., "1018" for Doctor Strange)
}

interface Hero {
  hero_name: string; // Hero's name (e.g., "Doctor Strange")
  ranked?: RankedHeroStats; // Ranked stats for the hero
}

interface RankedHeroStats {
  matches?: number; // Total matches played with this hero
  wins: number; // Total wins with this hero
  mvp: number; // Number of MVPs with this hero
  svp: number; // Number of SVPs (if relevant)
  kills: number; // Total kills with this hero
  deaths: number; // Total deaths with this hero
  assists: number; // Total assists with this hero
  kdr: string; // Kill/Death Ratio
  kda: string; // Kill/Death/Assist ratio
  damage_given: number; // Total damage dealt with this hero
  damage_received: number; // Total damage received with this hero
  heal: number; // Healing done (if relevant)
}
