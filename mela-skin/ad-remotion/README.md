# MELA SKIN · pub animée (Remotion + papier découpé en code)

Pub verticale 9:16 de 2 min 17, **dessinée et animée entièrement en code**, sur la voix off fournie.

- `DIRECTION.md` : la direction d'animation (idée visuelle de chacun des 43 plans, métaphores, personnages, rythme).
- `../ad-papier-carton/` : le dessin (Python + Pillow). `film.py` exporte chaque plan en **couches PNG** (une feuille de papier = un PNG avec son ombre) et un manifest (groupes, actions, caméra). `act1.py` à `act4.py` contiennent les 43 plans chorégraphiés sur les mots de la voix (`timing.py`).
- `episodes/01-mela/papercut/` : le projet Remotion. `src/film/` joue les couches (ressorts, squash & stretch, tremblements, caméra) ; transitions, sous-titres en étiquettes déchirées et grain viennent du kit `papercut-explainer` (bibliothèque tierce, voir sa licence).

## Reconstruire
```bash
export PAPERCUT_LIB=<chemin>/papercut-explainer/library     # kit tiers
bash $PAPERCUT_LIB/new_episode.sh . 01-mela MelaAd mela-ad  # une seule fois (npm i, kit, polices)
cd ../ad-papier-carton
PROJ=../ad-remotion/episodes/01-mela/papercut
python3 prep.py $PROJ voix.mp3              # plan, sous-titres, voix, transitions
python3 film.py $PROJ/public/layers         # dessine les 43 plans en couches
python3 sound.py $PROJ                      # repères sonores
cd $PROJ && node $PAPERCUT_LIB/audio/render.mjs --bed marimba-F-108   # musique + bruitages synthétisés
npx remotion render src/index.ts MelaAd out/mela-ad.mp4 --scale=0.5     # aperçu ; --scale=1 pour 1080x1920
```
