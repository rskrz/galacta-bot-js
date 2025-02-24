import { MARVLE_RIVALS_HEROES } from './marvel-rivals/marvel-rivals-heroes';
import { MARVEL_RIVALS_ITEMS } from './marvel-rivals/marvel-rivals-items';

export const HERO_EMOJI_MAP = {
  'Adam Warlock': '<:adamwarlock_avatar:1340550566493032560>',
  'Black Panther': '<:blackpanther_avatar:1340550560004309002>',
  'Black Widow': '<:blackwidow_avatar:1340550553318588416>',
  'Captain America': '<:captainamerica_avatar:1340550546830131251>',
  'Cloak & Dagger': '<:cloakanddagger_avatar:1340550540765167616>',
  'Doctor Strange': '<:doctorstrange_avatar:1340550535798980741>',
  Groot: '<:groot_avatar:1340550529947930666>',
  Hawkeye: '<:hawkeye_avatar:1340550525338259467>',
  Hela: '<:hela_avatar:1340550519927738470>',
  Hulk: '<:hulk_avatar:1340550515553079307>',
  'Invisible Woman': '<:invisiblewoman_avatar:1340550509278396466>',
  'Iron Fist': '<:ironfist_avatar:1340550357662826606>',
  'Iron Man': '<:ironman_avatar:1340550491750273075>',
  'Jeff the Land Shark': '<:jeffthelandshark_avatar:1340550486587342903>',
  'Jeff The Land Shark': '<:jeffthelandshark_avatar:1340550486587342903>',
  Loki: '<:loki_avatar:1340550482141384816>',
  'Luna Snow': '<:lunasnow_avatar:1340550477431046185>',
  Magik: '<:magik_avatar:1340550464118329344>',
  Magneto: '<:magneto_avatar:1340551258913902602>',
  Mantis: '<:mantis_avatar:1340551266413318215>',
  'Mister Fantastic': '<:misterfantastic_avatar:1340551277951586354>',
  'Moon Knight': '<:moonknight_avatar:1340551282863112272>',
  Namor: '<:namor_avatar:1340551287472914432>',
  'Peni Parker': '<:peniparker_avatar:1340551292908601374>',
  Psylocke: '<:psylocke_avatar:1340551299183415346>',
  'Rocket Raccoon': '<:rocketraccoon_avatar:1340551306431037471>',
  'Scarlet Witch': '<:scarletwitch_avatar:1340551310545784853>',
  'Spider-Man': '<:spiderman_avatar:1340551324470870026>',
  'Squirrel Girl': '<:squirrelgirl_avatar:1340551329881526335>',
  'Star-Lord': '<:starlord_avatar:1340551335577255978>',
  Storm: '<:storm_avatar:1340551341025792051>',
  'The Punisher': '<:thepunisher_avatar:1340551347602460702>',
  Thor: '<:thor_avatar:1340551353461903380>',
  Venom: '<:venom_avatar:1340551359426072576>',
  'Winter Soldier': '<:wintersoldier_avatar:1340551365407281172>',
  Wolverine: '<:wolverine_avatar:1340551371786817576>',
};

export const RANK_EMOJIS = {
  Default: '',
  Bronze: '<:1BronzeRank:1340552249830670356>',
  Silver: '<:2SilverRank:1340552259972497539>',
  Gold: '<:3GoldRank:1340552269933842433>',
  Platinum: '<:4PlatinumRank:1340552279463559208>',
  Diamond: '<:5DiamondRank:1340552289580224616>',
  Grandmaster: '<:6GrandmasterRank:1340552300007133234>',
  Celestial: '<:7CelestialRank:1340552308559446016>',
  Eternity: '<:8EternityRank:1340552318747414539>',
  'One Above All': '<:9OneAboveAllRank:1340552329040232538>',
};

export const EXCLUDED_PHRASES = [
  'DEFEND',
  'ATTACK',
  'CHRONO-EXPLORER',
  "Galacta's Favorite",
  'Rising Rival',
  'Heroic Ally',
  'SPIDER-ISLANDS',
  'TOKYO 2099',
  'COMPETETIVE - CONVOY',
  'HELP THE MASTER WEAVER SAVE THE WEB OF LIFE AND DESTINY',
  'HELP SPIDER-ZERO REPAIR THE WEB OF LIFE AND DESTINY',
  "CAPTURE HELL'S HEAVEN",
  "HELL'S HEAVEN",
  'HYDRA CHARTERIS BASE',
  'COMPETITIVE - DOMINATION',
  'STOP THE YGGDRASILL TAPPING DEVICE FROM BEING DESTROYED',
  "DESTROY LOKI'S YGGODRASILL TAPPING DEVICE",
  'YGGDRASILL PATH',
  'YGGSGARD',
  'CAPTURE THE ROYAL PALACE',
  'ROYAL PALACE',
  'PREVENT THE STGATUE OF BAST FROM RETURNING TO ITS PLACE',
  'HELP THE STATUE OF BAST RETURN TO ITS PLACE',
  'HALL OF DJALIA',
  'INTERGALLACTIC EMPIRE OF WAKANDA',
  'COMPETITIVE - CONVERGENCE',
  "STOP KNULL'S ESSENCE FROM GOING UNDERGROUND.",
  "ESCORT KNULL'S ESSENCE TO THE UNDERGROUND.",
  'SYMBIOTIC SURFACE',
  'KLYNTAR',
  "CAPTURE BIRNIN T'CHALLA",
  "BIRNIN T'CHALLA",
  'PREVENT H.E.R.B.I.E. FROM SCANNING ALL THE LOST PAGES OF THE DARKHOLD',
  'HELP H.E.R.B.I.E. SCAN ALL THE LOST PAGES OF THE DARKHOLD',
  'MIDTOWN',
  'EMPIRE OF ETERNAL NIGHT',
];

export const MARVEL_RIVALS_ITEMS_MAP = Object.fromEntries(
  MARVEL_RIVALS_ITEMS.map((item) => [item.id, item]),
);

export const MARVEL_RIVALS_HEROES_MAP = Object.fromEntries(
  MARVLE_RIVALS_HEROES.map((item) => [item.id, item]),
);

export const DISCORD_APPLICATION_ID = '1340393691512049817';

export enum DISCORD_ENTITLEMENTS {
  PREMIUM = '1343021259818008658',
}

export const DISCORD_COMMAND_COOLDOWN_SECONDS = 5;
export const DISCORD_COMMAND_RATE_LIMIT_USAGE_COUNT = 3;
export const DISCORD_COMMAND_RATE_LIMIT_WINDOW_MS = 60 * 1000; //24 * 60 * 60 * 1000;
