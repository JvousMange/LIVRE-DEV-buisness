// Annonce complète : nouveau hook (terrasse + burger) + corps PRINCIPAL d'origine (scènes de projects/full).
import { scenes as fullScenes } from "../full/scenes.mjs";
import { scenes as newScenes } from "../postacne/scenes-shared.mjs";

export function scenes(C, X) {
  // les scènes d'origine appellent rel()/dur() sur des plans absents de cette version : on les laisse passer
  const safe = { rel: (n, p, o) => { try { return X.rel(n, p, o); } catch { return 0.5; } }, dur: (n) => { try { return X.dur(n); } catch { return 4; } } };
  return { ...fullScenes(C, safe), ...newScenes(C, X) };
}
