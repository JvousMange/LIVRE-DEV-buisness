// Vidéo complète MELA SKIN : l'ouverture validée (phase 1) + le reste du script.
import { scenes as opening } from "../phase1/scenes.mjs";
import { scenesA } from "./scenes-a.mjs";
import { scenesB } from "./scenes-b.mjs";
import { scenesC } from "./scenes-c.mjs";
import { scenesF } from "./scenes-factory.mjs";

export function scenes(C, X) {
  const o = opening(C);
  return { hookFace: o.hookFace, skinRub: o.skinRub, mirror: o.mirror, ...scenesA(C, X), ...scenesB(C, X), ...scenesF(C, X), ...scenesC(C, X) };
}
