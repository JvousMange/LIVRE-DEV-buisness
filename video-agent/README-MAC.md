# MELA SKIN — agent vidéo vectorielle (installation sur Mac)

## Prérequis (une seule fois)
```
brew install node ffmpeg
cd video-agent
npm init -y && npm i playwright && npx playwright install chromium
```

## Rendre la vidéo
```
node engine/build.mjs projects/full            # vidéo complète → projects/full/out/final_9x16.mp4
node engine/build.mjs projects/full --peek=compare,usine --at=10,20   # aperçus rapides (PNG dans projects/full/out/preview_*.png)
```
Le rendu complet prend ~20-30 min (4 workers). Les plans déjà rendus et inchangés sont mis en cache (projects/full/frames).

## Où modifier quoi
- `projects/full/script.json` : liste des plans et leur ancrage sur un mot de la voix (`at`, `offset`).
- `projects/full/scenes-*.mjs` : chaque plan (SVG + animations). Les temps utilisent `R("plan", "mot", décalage)` = instant du mot dans la voix, moins 0,45 s d'anticipation.
- `library/components*.mjs` : objets (femme, flacon, usine, panier, ticket…). `brands/mela-skin/brand.json` : palette.
- `engine/sfx.mjs` : bruitages synthétisés ; mixage et ducking sous la voix dans `engine/build.mjs`.
- La voix doit être `projects/full/voice-full.mp3` (fichier ElevenLabs d'origine, non versionné).
