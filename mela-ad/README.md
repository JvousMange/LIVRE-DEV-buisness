# MELA SKIN — ad explicative en papier découpé (motion design en code)

Vidéo 9:16, 1080×1920, 24 i/s (animation « stop-motion » à 12 i/s), ~96 s, voix off FR + sous-titres mot par mot + bruitages + nappe pizz.
Sortie : `out/mela-skin-ad.mp4`

## Contenu
- `script.json` : texte des sous-titres (`cap`) et texte lu (`say`, écrit phonétiquement quand il le faut).
- `web/` : moteur SVG (`engine.js`), scènes (`scenes1.js`, `scenes2.js`), planning + sous-titres (`boot.js`).
- `tools/voice.py` : voix off (sherpa-onnx + Piper `fr_FR-siwis-medium`) -> `tmp/voice.wav` + `tmp/timeline.json`.
- `tools/render.mjs` : rendu image par image avec Chromium (principe Remotion : positionner -> capturer -> ffmpeg).
- `tools/audio.py` : bruitages + musique synthétisés, ducking sous la voix.
- `tools/build.sh` : enchaîne tout et encode en H.264 / AAC (-16 LUFS).

## Régénérer
```
npm install
pip install sherpa-onnx numpy pillow
python3 tools/texture.py                       # fond kraft + grain (déjà versionnés)
tools/build.sh <dossier-du-modèle-vits-piper-fr_FR-siwis-medium> 1.0
```
Le modèle vient de https://github.com/k2-fsa/sherpa-onnx/releases/tag/tts-models (`vits-piper-fr_FR-siwis-medium.tar.bz2`).

## Remplacer la voix
La voix est une voix de synthèse locale. Pour une voix plus naturelle (ElevenLabs, Higgsfield…), remplacer `tmp/voice.wav`
(22,05 kHz mono) en gardant les mêmes pauses que `tmp/timeline.json`, ou refaire l'alignement des mots, puis relancer `build.sh`
à partir de l'étape audio/rendu.

## Variantes de hook
Le hook A est dans la vidéo. Pour tester B ou C : modifier la première phrase de `script.json` (beat `hook`) et relancer `build.sh`.
