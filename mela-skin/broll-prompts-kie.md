# MELA SKIN · Prompts vidéo B-roll pour mashups

43 B-rolls. Une seule image de référence dans tout le pack : **le packshot du sérum, de face**, appelé `@image1`. Tout le reste — les femmes, les mains, la pochette — est décrit dans le prompt. Prompts en anglais, 9:16, 3 à 5 s, génération directe en vidéo.

---

## 0. Mode d'emploi

### Réglages de l'interface

| Champ | Ce que tu mets |
|---|---|
| `first_frame_url` · `last_frame_url` | **Vides.** C'est ce qui laisse le modèle composer son mouvement au lieu de partir d'une image figée. |
| `prompt` | Le bloc complet du plan, tel quel. |
| `reference_image_urls` | Le packshot du sérum sur les 16 plans qui le demandent. Vide sur les 27 autres. |
| `reference_video_urls` · `reference_audio_urls` | Vides. Sans usage pour du B-roll. |
| `generate_audio` | **Off.** Tous les prompts disent `no music, no voice` : le laisser sur On te fait payer une bande-son que tu jetteras au montage. |
| `return_last_frame` | Off. |
| `resolution` | 1080p sur les plans macro et produit, 720p suffit sur les transitions et les plans flous. |
| `aspect_ratio` | **9:16 explicitement**, jamais `adaptive` : en adaptatif le modèle reprend le ratio de ta référence et ton packshot te sortira un clip presque carré. |
| `duration` | 3, 4 ou 5 s selon ce qu'indique le plan. Ne monte pas au-dessus. |
| `output_format` | mp4. |

Les deux réglages qui coûtent des crédits quand on les rate : `aspect_ratio` sur adaptive, et `generate_audio` laissé sur On.

### Les 16 plans qui prennent `@image1`

HOOK-04, HOOK-05, PROD-01, PROD-02, PROD-03, PROD-04, PROD-05, TEX-01, TEX-02, RIT-02, RIT-05, RIT-06, RES-05, OFF-01, OFF-02, TRA-03.

Les 27 autres se génèrent sans rien attacher.

### Le packshot

Flacon entier, étiquette de face, fond uni, badge « 90 jours » absent. Celui que tu as convient tel quel.

Comme le modèle ne voit que la face, **aucun plan de ce pack ne fait pivoter le flacon** : l'étiquette reste tournée vers la caméra du début à la fin. C'est une contrainte, pas une préférence — un flacon qui tourne oblige le modèle à inventer un dos d'étiquette qu'il n'a jamais vu, et ça se voit immédiatement.

**Description de secours** (si un modèle perd l'étiquette malgré la référence, ajoute-la au prompt) :

```
a slim cylindrical amber glass dropper bottle with a dark chocolate-brown screw dropper cap and a matte warm-brown wraparound label with pale cream lettering, exactly as in @image1, 30ml
```

Ne fais jamais décrire le texte de l'étiquette mot à mot : le modèle le redessinerait de travers. C'est `@image1` qui porte le texte.

### Les femmes

Elles ne seront pas les mêmes d'un clip à l'autre, et c'est assumé. Trois profils tournent dans le pack, chacun rattaché à une douleur :

- **P5 — taches et fond de teint** : `a woman aged about 36 with warm medium-brown skin, phototype V, natural skin texture with visible pores, a darker shadow of hyperpigmentation around her mouth and faint darker patches on both cheekbones, dark hair pulled back in a low bun, small gold hoop earrings, cream ribbed tank top, no makeup`
- **P6 — marques post-acné** : `a woman aged about 24 with rich dark-brown skin, phototype VI, natural skin texture with visible pores, several flat dark post-acne marks on her chin, jawline and left cheek, short natural coily hair, small silver studs, oversized sage-green t-shirt, no makeup`
- **P4 — mélasma** : `a woman aged about 30 with warm golden-tan skin, phototype IV, natural skin texture with visible pores, soft symmetrical brownish patches on both cheekbones and faintly above her upper lip, long dark wavy hair worn loose, cream linen shirt, no makeup`

Ces descriptions sont déjà écrites dans chaque prompt, tu n'as rien à assembler. Si tu veux changer le phototype d'un plan, remplace le bloc par un autre — la seule règle est de garder le même profil à l'intérieur d'un même mashup, sinon le montage raconte trois histoires.

### Mains

Les prompts sans visage sont écrits en phototype V. Pour changer, remplace `warm medium-brown skin (phototype V)` par `warm golden-tan skin (phototype IV)` ou `rich dark-brown skin (phototype VI)`.

### Texture du sérum

Tous les prompts utilisent `lightweight translucent serum with a faint golden tint`. **Si ton sérum est laiteux**, remplace partout par `lightweight milky-white fluid serum`.

### Negative prompt (à chaque génération)

```
text, letters, words, logo, brand name, subtitles, watermark, badge, sticker, price tag, extra fingers, six fingers, deformed hands, fused fingers, plastic skin, airbrushed skin, skin lightening, lighter skin tone, grey or ashy cast, cool blue light, fluorescent light, clinical white lab, morphing face, warping label, rotating bottle, extra bottles, distorted logo, floating objects
```

`morphing face`, `warping label` et `rotating bottle` visent les trois façons dont un clip se dégrade en cours de route.

---

## 1. HOOK

### HOOK-01 · Le coton qui révèle les taches · 4 s

```
Scene: Close-up of a woman aged about 36 with warm medium-brown skin, phototype V, natural skin texture with visible pores, dark hair pulled back in a low bun, small gold hoop earrings, cream ribbed tank top, standing at a bathroom sink with warm terracotta zellige tiles behind her. Her face wears an even layer of matte foundation matching her skin tone. She holds a white cotton pad against her left cheek.
Action: In one slow continuous stroke she wipes the cotton pad across her cheek toward her ear, removing the foundation and revealing flat darker hyperpigmentation patches on the cheekbone; the cotton pad now shows a brown foundation stain.
Camera: Fixed at face height, slight handheld micro-shake, very slow push-in.
Light: Soft warm window light from the left, golden evening tone, gentle shadows, no cool or fluorescent light.
Style: Photorealistic, natural skin texture with visible pores, authentic smartphone video look, no text, vertical 9:16, 4 seconds.
Audio: Soft rubbing sound of the cotton pad, no music, no voice.
```

### HOOK-02 · Correcteur agacé · 4 s

```
Scene: Tight close-up of the lower half of the face of a woman with warm medium-brown skin, phototype V, natural skin texture with visible pores, bare skin with a darker shadow of hyperpigmentation around the corners of her mouth. Her ring finger holds a small dab of creamy concealer near the corner of her lips.
Action: She taps the concealer onto the darker shadow with quick, slightly impatient little taps.
Camera: Static mirror point of view, handheld with natural micro-shake.
Light: Soft warm window light from the left, golden tone, no cool or fluorescent light.
Style: Photorealistic, natural skin texture with visible pores, authentic smartphone video look, no text, vertical 9:16, 4 seconds.
Audio: Faint tapping sound, no music, no voice.
```

### HOOK-03 · Miroir embué · 5 s

```
Scene: A bathroom mirror fully fogged with condensation after a shower. Behind the fog, the blurred silhouette of a woman with warm medium-brown skin, phototype V, her hair wrapped in a cream towel, warm terracotta tiles softly visible around her.
Action: Her palm wipes across the mirror in one wide horizontal stroke, revealing her clear reflection looking closely at her own cheek.
Camera: Fixed just behind her shoulder, facing the mirror.
Light: Warm dim bathroom light, steam in the air, glow from one bright window, no cool light.
Style: Photorealistic, natural skin texture with visible pores, cinematic, no text, vertical 9:16, 5 seconds.
Audio: Squeak of a palm on wet glass, no music, no voice.
```

### HOOK-04 · Goutte sur terracotta · 5 s · `@image1`

```
Scene: Extreme macro of the glass dropper of the MELA SKIN serum from @image1, dark chocolate-brown rubber bulb and clear glass tube, held vertically above a matte terracotta-colored surface. A single drop of lightweight translucent serum with a faint golden tint is forming at the tip.
Action: The drop detaches and falls, hits the surface and spreads into a small glossy circle.
Camera: Static, ultra slow motion.
Light: Warm golden light raking low across the surface from the right, catching a bright highlight on the drop.
Style: Photorealistic, 100mm macro lens, glossy viscous texture, premium skincare commercial, no text, vertical 9:16, 5 seconds.
Audio: One soft drip, no music.
```

### HOOK-05 · La main qui attrape le flacon · 4 s · `@image1`

```
Scene: The MELA SKIN serum bottle from @image1, identical shape, colors and label, standing on a cream stone bathroom counter, label facing the camera. Warm terracotta zellige tiles behind, a folded cream towel at the edge of the frame.
Action: Within the first half-second, a woman's hand with warm medium-brown skin (phototype V) and short natural nails enters quickly from the right, closes around the bottle and lifts it straight up out of frame, the label staying toward the camera.
Camera: Static, at the height of the bottle.
Light: Soft warm window light from the left, golden tone, gentle shadows, no cool light.
Style: Photorealistic, 50mm f/2, shallow depth of field, warm cinematic grade, subtle film grain, no extra text, vertical 9:16, 4 seconds.
Audio: Light clink of glass on stone, no music.
```

Levée verticale, sans rotation du poignet : c'est ce qui garde l'étiquette de face pendant la saisie.

### HOOK-06 · La joue tournée vers la fenêtre · 4 s

```
Scene: Selfie-camera framing of a woman aged about 24 with rich dark-brown skin, phototype VI, natural skin texture with visible pores, several flat dark post-acne marks on her chin and left cheek, short natural coily hair, oversized sage-green t-shirt, bare face, sitting near a window.
Action: She slowly turns her face to the side toward the window, presenting her cheek to the light.
Camera: Front-facing smartphone held at arm's length, natural handheld shake.
Light: Bright warm daylight from the window raking across her skin, revealing real texture and the marks, no cool light.
Style: Photorealistic, natural skin texture with visible pores, authentic smartphone selfie video, no text, vertical 9:16, 4 seconds.
Audio: Quiet room tone, no music, no voice.
```

---

## 2. DOULEUR

### DOUL-ACNE · La marque qui reste · 4 s

```
Scene: Tight close-up of the chin and jawline of a woman with rich dark-brown skin, phototype VI, natural skin texture with visible pores, flat dark post-acne marks where pimples have healed, one small healing spot.
Action: Her fingertip gently touches one dark mark on her chin and stays still.
Camera: Very slow push-in, handheld micro-shake.
Light: Soft warm daylight from the side, gentle shadows, no cool light.
Style: Photorealistic, natural skin texture with visible pores, documentary beauty look, no text, vertical 9:16, 4 seconds.
Audio: Quiet room tone, no music, no voice.
```

### DOUL-MELA · Mélasma de grossesse · 5 s

```
Scene: A woman aged about 30 with warm golden-tan skin, phototype IV, natural skin texture with visible pores, soft symmetrical brownish patches on both cheekbones and faintly above her upper lip, long dark wavy hair worn loose, visibly pregnant at about seven months, wearing a cream ribbed dress, standing side-on to a bathroom mirror. One hand rests on her belly.
Action: She slowly raises her other hand and touches one cheekbone while looking at her reflection.
Camera: Fixed over her shoulder, facing the mirror.
Light: Soft warm morning window light, golden tone, no cool light.
Style: Photorealistic, natural skin texture with visible pores, intimate and calm, no text, vertical 9:16, 5 seconds.
Audio: Quiet room tone, no music, no voice.
```

### DOUL-HPI · L'ombre après l'épilation · 4 s

```
Scene: Extreme close-up of the upper lip of a woman with warm medium-brown skin, phototype V, natural skin texture with visible pores, a slightly darker shadow of hyperpigmentation just above the lip. A pair of slanted metal tweezers is held close to the skin.
Action: The tweezers pluck a single fine hair at the edge of the upper lip and pull slowly away.
Camera: Static macro, mirror point of view.
Light: Soft warm window light, gentle shadows, no cool light.
Style: Photorealistic, natural skin texture with visible pores, 100mm macro, no text, vertical 9:16, 4 seconds.
Audio: Tiny pluck sound, no music, no voice.
```

### DOUL-TEINT · Aucune teinte ne va · 4 s

```
Scene: Top-down close-up of the back of a woman's hand with warm medium-brown skin (phototype V) resting on a cream stone bathroom counter. Three streaks of liquid foundation side by side on the back of the hand: one too light and ashy, one too pink, one too orange. Three plain unbranded foundation bottles blurred at the edge of the frame.
Action: She slowly turns her hand toward the light, the three mismatched swatches catching the light.
Camera: Static, top-down.
Light: Soft warm window light from above left, no cool light.
Style: Photorealistic, natural skin texture, 50mm macro, no logos, no text, vertical 9:16, 4 seconds.
Audio: No music, no voice.
```

### DOUL-GEN · Le tiroir des produits qui n'ont rien fait · 4 s

```
Scene: Top-down view of an open bathroom drawer filled with about eight half-used skincare bottles and tubes in plain white and clear unbranded packaging, no logos, no text.
Action: A hand with warm medium-brown skin (phototype V) pushes the drawer shut in one firm motion.
Camera: Static, top-down.
Light: Soft warm natural light, gentle shadows, no cool light.
Style: Photorealistic, 35mm, warm cinematic grade, no text, vertical 9:16, 4 seconds.
Audio: Soft thud of the drawer closing, bottles rattling, no music.
```

---

## 3. PRODUIT

### PROD-01 · Rayon de soleil sur le rebord · 5 s · `@image1`

```
Scene: The MELA SKIN serum bottle from @image1, identical shape, colors and label, standing on a warm terracotta plaster ledge, label facing the camera. A folded cream linen cloth on its left, a small sage-green ceramic dish on its right.
Action: A beam of morning sunlight slowly slides across the ledge and passes over the bottle, making the amber glass glow. The bottle stays perfectly still.
Camera: Static.
Light: Soft morning sun through a window, dust particles floating in the beam, warm golden tone.
Style: Photorealistic, 50mm f/2, shallow depth of field, warm matte film tones, premium product film, no extra text, vertical 9:16, 5 seconds.
Audio: Soft ambient room tone, no music.
```

Le meilleur plan produit du pack : c'est la lumière qui bouge, pas le flacon. Rien à inventer pour le modèle.

### PROD-02 · Lumière tournante sur plinthe · 5 s · `@image1`

```
Scene: The MELA SKIN serum bottle from @image1, identical shape, colors and label, centered on a small round cream plinth against a seamless deep terracotta-brown backdrop, label facing the camera.
Action: The bottle stays perfectly still and does not rotate while a warm key light slowly sweeps from the left to the right, the shadow travelling across the backdrop behind it.
Camera: Static, slightly below eye level.
Light: Warm directional key light sweeping from left to right, soft rim light outlining the amber glass, long soft shadow.
Style: Photorealistic, 85mm, studio product film, warm grade, no extra text, vertical 9:16, 5 seconds.
Audio: No music.
```

Plan réécrit : la rotation de la plinthe est remplacée par une rotation de la lumière. Tu obtiens le même effet de volume, sans jamais demander au modèle un dos d'étiquette qu'il n'a pas vu.

### PROD-03 · Ombres de feuillage · 5 s · `@image1`

```
Scene: The MELA SKIN serum bottle from @image1, identical shape, colors and label, standing on a cream linen cloth on a wooden table, label facing the camera.
Action: Shadows of olive leaves move gently across the bottle and the cloth in a light breeze. The bottle stays still.
Camera: Static.
Light: Warm late-afternoon sun from the side, dappled light through leaves, golden tone.
Style: Photorealistic, 50mm f/2.8, warm matte film tones, subtle grain, no extra text, vertical 9:16, 5 seconds.
Audio: Faint rustle of leaves, no music.
```

### PROD-04 · Pierre mouillée · 5 s · `@image1`

```
Scene: The MELA SKIN serum bottle from @image1, identical shape, colors and label, standing on a wet terracotta-colored river stone, label facing the camera, tiny water droplets on the amber glass, a thin film of water on the stone.
Action: A single water droplet rolls slowly down the side of the bottle.
Camera: Very slow push-in, straight on.
Light: Warm backlight making the amber glass and water droplets glow, soft fill from the front.
Style: Photorealistic, 100mm macro, fresh and premium, no extra text, vertical 9:16, 5 seconds.
Audio: Soft water trickle, no music.
```

### PROD-05 · Trois carnations, un flacon · 4 s · `@image1`

```
Scene: Close-up of three women's hands gathered around the MELA SKIN serum bottle from @image1, identical shape, colors and label, held upright in the center with the label facing the camera, fingertips lightly touching it: one hand with warm golden-tan skin (phototype IV), one with warm medium-brown skin (phototype V), one with rich dark-brown skin (phototype VI). Short natural nails, five fingers on each hand.
Action: The hands stay still and relaxed while the camera moves.
Camera: Slow push-in toward the bottle, straight on.
Light: Soft warm directional light, gentle shadows, no cool light.
Style: Photorealistic, natural skin texture, 50mm f/2, shallow depth of field, no extra text, vertical 9:16, 4 seconds.
Audio: No music.
```

Trois mains dans le cadre : le plan le plus risqué du pack. Génère-le 3 ou 4 fois et compte les doigts sur chaque sortie.

---

## 4. TEXTURE

Le bloc le plus fiable : pas de visage, et l'étiquette est hors champ ou floue.

### TEX-01 · La pipette se remplit · 4 s · `@image1`

```
Scene: Extreme macro side view of the glass dropper from @image1, dark chocolate-brown rubber bulb, dipped into the open neck of the amber glass bottle. Only the neck and shoulder of the bottle are in frame.
Action: The bulb is released and the lightweight translucent serum with a faint golden tint rises slowly up the clear glass tube.
Camera: Static, side view.
Light: Warm backlight making the serum glow golden inside the glass.
Style: Photorealistic, 100mm macro, premium skincare commercial, no text, vertical 9:16, 4 seconds.
Audio: Faint suction sound, no music.
```

### TEX-02 · La goutte qui perle · 5 s · `@image1`

```
Scene: Extreme macro of the tip of the glass dropper from @image1 at the top of the frame, the amber bottle softly blurred out of focus in the background on a cream surface.
Action: A drop of lightweight translucent serum with a faint golden tint slowly swells at the tip, trembles, then falls out of frame.
Camera: Static, ultra slow motion.
Light: Warm golden backlight catching the drop.
Style: Photorealistic, 100mm macro, glossy texture, premium skincare commercial, no text, vertical 9:16, 5 seconds.
Audio: Single soft drip, no music.
```

### TEX-03 · Étiré entre les doigts · 4 s

```
Scene: Extreme close-up of the thumb and index finger of a woman's hand with warm medium-brown skin (phototype V), short natural nails, a small amount of lightweight translucent serum with a faint golden tint pressed between them, plain terracotta background.
Action: The fingers slowly separate, stretching the serum into a thin glossy film that thins out and breaks.
Camera: Static macro.
Light: Warm backlight highlighting the glossy serum, soft fill.
Style: Photorealistic, natural skin texture, 100mm macro, no text, vertical 9:16, 4 seconds.
Audio: Faint tacky sound, no music.
```

### TEX-04 · Absorbé sans trace blanche · 5 s

```
Scene: Top-down macro of the back of a woman's hand with rich dark-brown skin (phototype VI), short natural nails, a small pool of lightweight translucent serum with a faint golden tint on the back of the hand, cream linen underneath.
Action: Two fingertips of the other hand spread the serum in small circles until it is fully absorbed, leaving the skin with a soft natural sheen and no white or grey residue.
Camera: Static, top-down.
Light: Soft warm daylight from the side revealing skin texture, no cool light.
Style: Photorealistic, natural skin texture with visible pores, 100mm macro, no text, vertical 9:16, 5 seconds.
Audio: No music.
```

### TEX-05 · Goutte sur verre · 5 s

```
Scene: A vertical sheet of clear glass in front of a softly blurred terracotta wall. A single drop of lightweight translucent serum with a faint golden tint clings to the top of the glass.
Action: The drop slides slowly down the glass, leaving a thin glossy trail.
Camera: Static, slight slow push-in.
Light: Warm golden backlight through the glass.
Style: Photorealistic, 100mm macro, premium skincare commercial, no text, vertical 9:16, 5 seconds.
Audio: No music.
```

---

## 5. RITUEL

Ton protocole : nettoyer, 3-4 gouttes en tapotant, SPF le matin.

### RIT-01 · Nettoyage doux · 4 s

```
Scene: Medium close-up of a woman with warm medium-brown skin, phototype V, natural skin texture with visible pores, dark hair pulled back, leaning over a bathroom sink, her face covered in soft white cleansing foam, warm terracotta zellige tiles behind her.
Action: She rinses her face with one splash of water from her cupped hands.
Camera: Static, slightly side-on.
Light: Soft warm window light from the left, golden tone, no cool light.
Style: Photorealistic, natural skin texture with visible pores, authentic smartphone video look, no text, vertical 9:16, 4 seconds.
Audio: Water splash, running tap, no music, no voice.
```

### RIT-02 · Les gouttes sur la pommette · 4 s · `@image1`

```
Scene: Close-up of a woman with warm medium-brown skin, phototype V, natural skin texture with visible pores, bare face after cleansing, faint darker patches on the cheekbone, holding the glass dropper of the MELA SKIN serum from @image1, dark chocolate-brown bulb and clear glass tube, just above her cheekbone.
Action: She squeezes the bulb gently and deposits a few small drops of lightweight translucent serum with a faint golden tint along her cheekbone.
Camera: Static, slight upward tilt, mirror point of view.
Light: Soft warm window light from the left, golden tone, no cool light.
Style: Photorealistic, natural skin texture with visible pores, authentic smartphone video look, no text, vertical 9:16, 4 seconds.
Audio: Quiet room tone, no music, no voice.
```

Seule la pipette vient de la référence, pas le flacon entier : c'est plus sûr, la pipette n'a pas d'étiquette à tenir.

### RIT-03 · Les tapotements · 4 s

```
Scene: Close-up of a woman with warm medium-brown skin, phototype V, natural skin texture with visible pores, eyes half-closed, fingertips of both hands resting on her cheeks where the serum was applied.
Action: Her fingertips gently pat the serum into her cheeks with a light, rhythmic tapping motion.
Camera: Slow orbit of a few degrees to the right.
Light: Soft warm window light, healthy natural sheen on the skin, no cool light.
Style: Photorealistic, natural skin texture with visible pores, calm intimate morning atmosphere, no text, vertical 9:16, 4 seconds.
Audio: Soft tapping sound, no music, no voice.
```

### RIT-04 · Le SPF du matin · 4 s

```
Scene: Close-up of the hands of a woman with warm medium-brown skin, phototype V, holding a dark chocolate-brown sunscreen tube with a flip cap and a plain matte label, above a bathroom sink. Her face is softly out of focus in the background.
Action: She squeezes a line of white sunscreen along her index and middle finger.
Camera: Static, close on the hands.
Light: Bright warm morning daylight from the window, no cool light.
Style: Photorealistic, natural skin texture, 50mm f/2, shallow depth of field, no extra text, vertical 9:16, 4 seconds.
Audio: Soft squeeze sound, no music, no voice.
```

Le tube SPF est décrit, pas référencé — tu n'as pas de packshot pour lui. Si tu en obtiens un, attache-le en `@image2` et remplace la description par `the sunscreen tube from @image2`.

### RIT-05 · Version soir, bonnet en satin · 5 s · `@image1`

```
Scene: Medium close-up of a woman aged about 24 with rich dark-brown skin, phototype VI, natural skin texture with visible pores, flat dark post-acne marks on her chin, wearing a black satin bonnet over her hair and a sage-green t-shirt, sitting on the edge of her bed in the evening, holding the MELA SKIN serum bottle from @image1, identical shape, colors and label, label facing the camera.
Action: She unscrews the dropper and lifts the glass pipette straight up out of the bottle, the bottle staying upright and still in her other hand.
Camera: Static, eye level, handheld micro-shake.
Light: Warm bedside lamp only, amber tone, dark cosy surroundings, no cool light.
Style: Photorealistic, natural skin texture with visible pores, authentic smartphone video look, no extra text, vertical 9:16, 5 seconds.
Audio: Soft unscrewing sound, no music, no voice.
```

### RIT-06 · Version matin, café · 5 s · `@image1`

```
Scene: The MELA SKIN serum bottle from @image1, identical shape, colors and label, label facing the camera, on a cream stone bathroom counter next to a sage-green ceramic cup of black coffee, a folded cream towel behind.
Action: Steam rises slowly from the coffee while the morning light gradually brightens. The bottle stays still.
Camera: Static.
Light: Soft warm morning window light, golden tone.
Style: Photorealistic, 50mm f/2, shallow depth of field, warm matte film tones, no extra text, vertical 9:16, 5 seconds.
Audio: Faint morning ambience, no music.
```

---

## 6. RÉSULTAT

**Règle** : ces plans ne montrent pas un « après ». Les prompts décrivent une peau qui garde ses marques — ne les retire pas de la description pour fabriquer un résultat. Un avant/après généré par IA est un faux résultat. Pour la preuve, filme tes vraies clientes.

### RES-01 · Peau nue en lumière naturelle · 4 s

```
Scene: Close-up of the cheek of a woman with warm medium-brown skin, phototype V, bare face, natural skin texture with visible pores, faint darker patches still visible on the cheekbone, no retouching.
Action: She turns her face very slightly toward the window.
Camera: Slow push-in on her cheek.
Light: Natural warm daylight raking across the skin, revealing real texture, no cool light.
Style: Photorealistic, natural skin texture with visible pores, 85mm f/2, documentary beauty film, no text, vertical 9:16, 4 seconds.
Audio: Quiet room tone, no music, no voice.
```

### RES-02 · Le fond de teint reste au tiroir · 4 s

```
Scene: A woman with warm medium-brown skin, phototype V, natural skin texture with visible pores, bare face, dark hair in a low bun, dressed for work in a cream blouse, standing at her bathroom sink in the morning, holding a plain unbranded foundation bottle, a drawer open below.
Action: She places the foundation bottle into the drawer and slides the drawer shut.
Camera: Static medium shot, slightly side-on.
Light: Soft warm morning window light, golden tone, no cool light.
Style: Photorealistic, natural skin texture with visible pores, authentic smartphone video look, no logos, no text, vertical 9:16, 4 seconds.
Audio: Drawer closing, no music, no voice.
```

### RES-03 · La main sur la joue · 4 s

```
Scene: Close-up of a woman with warm medium-brown skin, phototype V, natural skin texture with visible pores, faint darker patches on the cheekbone, looking at herself in the bathroom mirror.
Action: Her hand glides slowly along her cheek and a small natural smile appears.
Camera: Static, over-the-shoulder mirror framing.
Light: Soft warm window light, golden tone, no cool light.
Style: Photorealistic, natural skin texture with visible pores, intimate and calm, no text, vertical 9:16, 4 seconds.
Audio: Quiet room tone, no music, no voice.
```

### RES-04 · Plein soleil en terrasse · 5 s

```
Scene: A woman aged about 30 with warm golden-tan skin, phototype IV, natural skin texture with visible pores, soft brownish patches on both cheekbones, long dark wavy hair worn loose, bare face, sitting on a sunny terrace with terracotta pots and a cream wall behind her, wearing a cream linen shirt.
Action: She tilts her face up toward the sun with her eyes closed, relaxed.
Camera: Slow push-in from a medium close-up.
Light: Warm late-afternoon sun, golden tone, soft natural shadows.
Style: Photorealistic, natural skin texture with visible pores, 85mm f/2, warm cinematic grade, no text, vertical 9:16, 5 seconds.
Audio: Soft outdoor ambience, distant birds, no music.
```

### RES-05 · Flacons vides alignés · 4 s · `@image1`

```
Scene: Four identical MELA SKIN serum bottles from @image1, identical shape, colors and label, all labels facing the camera: three empty ones lined up on a light oak bathroom shelf against warm terracotta tiles, and an empty space at the end of the row.
Action: A hand with warm medium-brown skin (phototype V) sets a fourth, full bottle down in the empty space at the end of the row, the label facing the camera.
Camera: Static, eye level with the shelf.
Light: Soft warm window light, golden tone, no cool light.
Style: Photorealistic, 50mm f/2, warm matte film tones, no extra text, vertical 9:16, 4 seconds.
Audio: Soft clink of glass on wood, no music.
```

Quatre exemplaires depuis une seule référence : `identical` et `all labels facing the camera` sont ce qui les empêche de diverger. Ne les enlève pas.

---

## 7. OFFRE

### OFF-01 · Unboxing · 5 s · `@image1`

```
Scene: Top-down view of an open kraft shipping box on a cream linen bedsheet, cream tissue paper inside partly covering the MELA SKIN serum bottle from @image1, identical shape, colors and label, lying on its side with the label facing up, next to a small cream cotton canvas zip pouch with a dark brown zipper pull and a small embroidered circular emblem in terracotta thread.
Action: Two hands with warm medium-brown skin (phototype V), five fingers each, fold back the tissue paper, revealing the bottle and the pouch.
Camera: Static, top-down.
Light: Soft warm morning light from a window, gentle shadows.
Style: Photorealistic, 35mm, warm matte film tones, no extra text, vertical 9:16, 5 seconds.
Audio: Crinkle of tissue paper, no music.
```

`lying on its side with the label facing up` est indispensable en vue du dessus : sans ça, le modèle te montre le dessus du bouchon et ta référence ne sert à rien.

### OFF-02 · Trois flacons et la pochette · 5 s · `@image1`

```
Scene: Three identical MELA SKIN serum bottles from @image1, identical shape, colors and label, standing side by side on a terracotta surface, all three labels facing the camera, a small cream cotton canvas zip pouch with a dark brown zipper pull leaning against them.
Action: The arrangement stays perfectly still while the camera moves straight forward.
Camera: Very slow push-in, straight on, no orbit.
Light: Warm directional light from the left creating soft long shadows, glowing amber glass.
Style: Photorealistic, premium e-commerce product film, 50mm, no extra text, vertical 9:16, 5 seconds.
Audio: No music.
```

Plan réécrit : l'orbite de 30° est remplacée par un travelling avant. Une orbite fait passer la caméra sur le flanc des flacons, que ta référence de face ne documente pas. Cale le nombre de flacons sur l'offre que tu pousses dans la vidéo.

### OFF-03 · L'e-book sur le téléphone (fond vert) · 5 s

```
Scene: A hand with warm medium-brown skin (phototype V), five fingers, holding a smartphone vertically above a cream linen bedsheet, the phone screen a flat uniform bright green for compositing.
Action: The thumb makes two slow upward scrolling swipes on the screen.
Camera: Static, slightly over-the-shoulder point of view.
Light: Soft warm natural light, no reflections on the screen.
Style: Photorealistic, natural skin texture, 35mm, no text on the screen, vertical 9:16, 5 seconds.
Audio: No music.
```

Au montage tu incrustes un vrai enregistrement d'écran de ton e-book. Même méthode pour les avis : uniquement de vrais avis.

---

## 8. MÉCANISME

### MEC-01 · Les 5 actifs · 5 s

```
Scene: A row of five small clear glass laboratory vials on a cream stone surface against a warm terracotta plaster wall. Four vials contain fine white crystalline powders with slightly different textures, the fifth contains a pale golden oil. No labels, no text.
Action: The vials stay still while the camera moves.
Camera: Slow lateral slide along the row, left to right.
Light: Warm golden side light, soft shadows, no clinical white or cool light.
Style: Photorealistic, 100mm macro, shallow depth of field, premium, no text, vertical 9:16, 5 seconds.
Audio: No music.
```

Au montage, dans l'ordre : acide azélaïque 10 %, niacinamide 5 %, acide tranexamique 2 %, alpha-arbutine 2 % (les 4 poudres), vitamine C stable 3 % (l'huile dorée).

### MEC-02 · La poudre en slow-mo · 5 s

```
Scene: A small glass scoop holding fine white crystalline powder above a matte terracotta surface.
Action: The powder pours slowly from the scoop and forms a small cone on the surface, fine particles drifting in the air.
Camera: Static, ultra slow motion.
Light: Warm golden backlight making the floating particles glow.
Style: Photorealistic, 100mm macro, premium, no text, vertical 9:16, 5 seconds.
Audio: Faint grainy pouring sound, no music.
```

### MEC-03 · Le trajet d'une tache · 5 s

```
Scene: Stylized 3D cross-section of human skin layers in warm tones of cream, terracotta and deep brown. At the base of the upper layer, a star-shaped pigment cell glows softly.
Action: The cell releases small dark-brown pigment granules that slowly drift upward through the layers toward the skin surface.
Camera: Slow push-in toward the cell.
Light: Soft warm internal glow, no cool colors.
Style: Soft clay-like 3D scientific illustration, premium and calm, no text, no labels, vertical 9:16, 5 seconds.
Audio: No music.
```

Si le rendu fait trop « IA bizarre », fais ce plan en motion design sur Canva avec le schéma de ta fiche produit.

### MEC-04 · Le soleil sur la joue · 4 s

```
Scene: Close-up of a woman aged about 30 with warm golden-tan skin, phototype IV, natural skin texture with visible pores, soft brownish patches on her cheekbone, near a window, a harsh bright sunbeam falling across her cheekbone and the patches on it.
Action: She squints slightly and raises her hand to shade her face.
Camera: Static, close-up.
Light: Hard warm direct sunlight through the window, strong contrast.
Style: Photorealistic, natural skin texture with visible pores, cinematic, no text, vertical 9:16, 4 seconds.
Audio: Quiet room tone, no music, no voice.
```

Raccorde directement sur RIT-04.

---

## 9. TRANSITIONS

### TRA-01 · Main sur l'objectif · 3 s

```
Scene: A warm bathroom with terracotta zellige tiles softly out of focus.
Action: A hand with warm medium-brown skin (phototype V) moves quickly toward the camera and covers the lens completely, the frame ending in dark brown.
Camera: Static.
Light: Soft warm window light, no cool light.
Style: Photorealistic, 35mm, motion blur on the hand, no text, vertical 9:16, 3 seconds.
Audio: Soft whoosh, no music.
```

### TRA-02 · Serviette devant le visage · 3 s

```
Scene: Close-up of a woman with warm medium-brown skin, phototype V, natural skin texture with visible pores, in a warm bathroom, holding a cream towel.
Action: The cream towel passes quickly in front of her face from right to left, covering the whole frame for a moment.
Camera: Static.
Light: Soft warm window light, golden tone.
Style: Photorealistic, natural skin texture, motion blur on the towel, no text, vertical 9:16, 3 seconds.
Audio: Soft fabric whoosh, no music.
```

### TRA-03 · Le flacon traverse le cadre · 3 s · `@image1`

```
Scene: Seamless deep terracotta-brown backdrop.
Action: A hand with warm medium-brown skin (phototype V) carries the MELA SKIN serum bottle from @image1, identical shape and colors, quickly across the frame from left to right, the label kept toward the camera.
Camera: Static.
Light: Warm directional light, glowing amber glass.
Style: Photorealistic, strong motion blur, no extra text, vertical 9:16, 3 seconds.
Audio: Fast whoosh, no music.
```

### TRA-04 · Le rideau qui s'ouvre · 3 s

```
Scene: A room with a terracotta plaster wall, a sheer cream linen curtain closed over a window, dim warm light.
Action: The curtain slides open to the side and bright morning sunlight floods the room.
Camera: Static.
Light: From dim to bright warm golden morning sun.
Style: Photorealistic, 35mm, warm cinematic grade, no text, vertical 9:16, 3 seconds.
Audio: Curtain rings sliding, no music.
```

---

## 10. Ordre de passage

| # | Groupe | Plans | Pourquoi dans cet ordre |
|---|---|---|---|
| 1 | Transitions + Texture sans référence | TRA-01, TRA-02, TRA-04, TEX-03, TEX-04, TEX-05 | rien à tenir, rien à attacher : ta banque de secours en quelques minutes |
| 2 | Mécanisme + mains | MEC-01, MEC-02, MEC-03, DOUL-TEINT, DOUL-GEN, OFF-03 | toujours sans référence, toujours sûr |
| 3 | Produit | HOOK-04, HOOK-05, TEX-01, TEX-02, PROD-01 à 05, RIT-06, RES-05, OFF-01, OFF-02, TRA-03 | c'est là que `@image1` entre en jeu, commence par HOOK-04 ou PROD-01 |
| 4 | Persona | les 16 plans restants | le plus tolérant : une femme différente à chaque clip ne se voit pas au montage |

Commence par un plan du groupe 3 comme clip témoin — PROD-01 est le plus lisible pour juger si ton étiquette tient.

## 11. Contrôle avant de garder un clip

Tu rejettes le clip si : l'étiquette a bougé, muté ou fait apparaître des lettres · le flacon a pivoté et montre un dos inventé · la peau sort plus claire qu'au début du clip · une main est déformée ou a plus de cinq doigts · le visage se déforme en cours de plan · la lumière a viré au froid · du texte parasite est apparu.

**Regarde la dernière seconde en premier.** C'est là que la dérive apparaît. Un clip propre sur quatre secondes et bancal sur la cinquième se sauve en coupant au montage : inutile de le régénérer.

Nommage : `MELA_BROLL_[CODE]_[P4|P5|P6]_V1` (ex. `MELA_BROLL_TEX-04_P6_V2`).
