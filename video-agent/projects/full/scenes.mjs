// Vidéo complète MELA SKIN.
import { scenesOpen } from "./scenes-open.mjs";
import { scenesA } from "./scenes-a.mjs";
import { scenesB } from "./scenes-b.mjs";
import { scenesC } from "./scenes-c.mjs";
import { scenesF } from "./scenes-factory.mjs";
import { scenesG } from "./scenes-g.mjs";

export function scenes(C, X) {
  return { ...scenesA(C, X), ...scenesB(C, X), ...scenesC(C, X), ...scenesOpen(C, X), ...scenesF(C, X), ...scenesG(C, X) };
}
