import { assetUrl } from './assetUrl';

/** Fixed match-clear SFX: 清脆铃声 */
export const MATCH_CLEAR_SFX_FILE = 'sfx/match-chime-win.wav';

/** Fun mode wrong-answer buzz */
export const WRONG_SFX_FILE = 'sfx/match-wrong.wav';

/** Say & Blast projectile impact */
export const SAY_BLAST_EXPLOSION_SFX_FILE = 'sfx/clear-boom.wav';

export function getMatchClearSfxUrl(): string {
  return assetUrl(MATCH_CLEAR_SFX_FILE);
}

export function getWrongSfxUrl(): string {
  return assetUrl(WRONG_SFX_FILE);
}

export function getSayBlastExplosionSfxUrl(): string {
  return assetUrl(SAY_BLAST_EXPLOSION_SFX_FILE);
}
