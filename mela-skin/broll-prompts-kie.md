# MELA SKIN · Prompts vidéo B-roll pour mashups

43 B-rolls + 3 personas. Prompts en anglais (kie.ai refuse souvent le français), 9:16, 5 s.

---

## 0. Mode d'emploi

### Réglages de l'interface kie.ai

Ton modèle prend jusqu'à 10 images de référence, adressables une par une dans le prompt (`@image1`, `@image2`…). Tous les prompts de ce fichier sont écrits dans cette syntaxe.

| Champ | Ce que tu mets |
|---|---|
| `first_frame_url` · `last_frame_url` | **Vides.** C'est ce qui laisse le modèle composer son mouvement. |
| `prompt` | Le bloc complet du plan, tel quel. |
| `reference_image_urls` | Les images du plan, **dans l'ordre** : File 1 = `@image1`, File 2 = `@image2`. L'ordre est ce qui fait tenir le prompt, ne l'inverse pas. |
| `reference_video_urls` · `reference_audio_urls` | Vides. Sans usage pour du B-roll. |
| `generate_audio` | **Off.** Tous les prompts disent `no music, no voice` : le laisser sur On fait fabriquer une bande-son que tu jetteras, et te la fait payer. Ton son se pose au montage. |
| `return_last_frame` | Off. Utile seulement pour enchaîner deux clips bout à bout, ce que le pack ne fait jamais. |
| `resolution` | 1080p sur les plans macro et produit, 720p suffit sur les transitions et les plans flous. |
| `aspect_ratio` | **9:16 explicitement**, jamais `adaptive` : en adaptatif, le modèle reprend le ratio de ta référence et ton packshot te sortira un clip carré. |
| `duration` | 3, 4 ou 5 s selon ce qu'indique le plan. Ne monte pas au-dessus. |
| `output_format` | mp4. |

Le piège du lot est `aspect_ratio`. Le second est `generate_audio`, qui est sur On par défaut.

**Quelle image dans quel slot :**

| Plans | File 1 (`@image1`) | File 2 (`@image2`) |
|---|---|---|
| HOOK-04, HOOK-05, PROD-01 à 05, TEX-01, TEX-02, RIT-06, RES-05, TRA-03 | sérum | — |
| HOOK-01, HOOK-02, HOOK-03, HOOK-06, DOUL-ACNE, DOUL-MELA, DOUL-HPI, RIT-01, RIT-03, RES-01 à 04, MEC-04, TRA-02 | persona | — |
| RIT-02, RIT-05 | persona | sérum |
| RIT-04 | persona | SPF |
| OFF-01, OFF-02 | sérum | pochette |
| DOUL-TEINT, DOUL-GEN, TEX-03, TEX-04, TEX-05, MEC-01, MEC-02, MEC-03, OFF-03, TRA-01, TRA-04 | — | — |

Les 11 plans de la dernière ligne n'ont aucune référence : tu laisses `reference_image_urls` vide, le prompt se suffit.

**Puisque tu as 10 slots** : sur les plans produit, attache le packshot de face **et** une vue 3/4 du flacon en `@image1` et `@image2`, et écris `from @image1 and @image2` dans le prompt. Deux angles tiennent une étiquette bien mieux qu'un seul. Même logique pour une persona dont tu as plusieurs portraits.

### Légende des pièces jointes

| Icône | Ce que tu attaches |
|---|---|
| 📎 SÉRUM | La photo du flacon sérum (packshot du site, **badge « 90 jours » retiré**) |
| 📎 SPF | La photo du tube crème solaire SPF 50+ (**badge retiré** aussi) |
| 📎 POCHETTE | La photo de ta pochette MELA SKIN (sinon génère-la d'abord, voir 0.4) |
| 👤 PERSONA | L'image maîtresse de la persona du mashup (voir section 1) |
| ✋ MAIN | Rien à attacher : tu choisis juste le phototype de la main (voir 0.3) |
| — | Aucune pièce jointe |

### Deux façons de produire ces plans

**Méthode A — référence directe, en une étape.** C'est la bonne méthode si ton modèle accepte des **images de référence** sans les imposer comme première frame (Kling « elements », Seedance reference-to-video, Veo references). Tu colles le prompt complet, tu attaches les pièces jointes indiquées **en référence**, et tu génères la vidéo directement. Pas d'image de départ, pas de première frame, pas de dernière frame.

C'est la méthode à préférer partout où elle est disponible : l'étiquette et le visage sont tenus par la référence, et le modèle reste libre de composer son mouvement au lieu d'être contraint de partir d'une image figée.

Ce que tu attaches en référence, par plan : le 📎 et le 👤 en tête de chaque plan te le disent. Sur un plan qui porte les deux (RIT-02, RIT-05), attache les deux images.

**Méthode B — image de départ, puis animation.** Le repli si ton modèle n'accepte qu'une première frame.

1. **Image de départ** (Nano Banana) : colle uniquement les lignes `Scene` + `Light` + `Style` du prompt, et attache les pièces jointes indiquées.
2. **Vidéo** (Seedance ou Kling, image-to-video) : mets l'image validée en première frame et colle **le prompt complet**. Si ton modèle accepte une image de référence *en plus* de la première frame, remets le 📎 SÉRUM : l'étiquette tiendra mieux.

Plus long et plus cher, mais tu vois et valides l'image avant de payer l'animation.

**Méthode C — sans aucune référence.** Si tu n'attaches rien du tout, prends les prompts de `broll-prompts-text-to-video.md` : ils sont réécrits pour tenir sans image, au prix de l'étiquette et de la constance des visages. À réserver aux plans qui n'ont de toute façon rien à attacher.

Les plans marqués « — » ou « ✋ MAIN » n'ont aucune pièce jointe : ils partent directement en vidéo dans les trois méthodes.

**Avant de lancer le batch** : génère un seul clip témoin (HOOK-05 ou RIT-02), regarde-le en entier, corrige le process. Ensuite seulement tu lances le reste.

### 0.1 Préparer la photo du sérum

- Retire le badge « 100 % remboursé 90 jours » du packshot (recadrage ou gomme). Sinon le modèle le recopie dans la scène.
- Fond uni, flacon entier, étiquette de face. Si tu as une vue 3/4, attache les deux.
- **Packshot de référence retenu** : flacon compte-gouttes en verre ambré, capuchon-pipette brun foncé, étiquette brune enveloppante en lettres crème, 30 ml, sur fond beige. Il ne porte aucun badge : utilisable tel quel, rien à retoucher.

**Description produit de secours** (si un modèle perd l'étiquette malgré la référence, ajoute cette ligne au prompt) :

```
a slim cylindrical amber glass dropper bottle with a dark chocolate-brown screw dropper cap and a matte warm-brown wraparound label with pale cream lettering, exactly as in @image1, 30ml
```

Ne fais pas décrire le texte de l'étiquette mot à mot : le modèle le redessinerait de travers. C'est l'image de référence qui porte le texte, la description ne porte que la forme et les couleurs.

### 0.2 Texture du sérum

Tous les prompts utilisent : `lightweight translucent serum with a faint golden tint`.
**Si ton sérum est laiteux**, remplace partout par : `lightweight milky-white fluid serum`.

### 0.3 Phototype des mains

Les prompts ✋ sont écrits en phototype V. Pour changer, remplace `warm medium-brown skin (phototype V)` par :
- P4 : `warm golden-tan skin (phototype IV)`
- P6 : `rich dark-brown skin (phototype VI)`

Dans un même mashup, la main doit avoir le phototype de la persona.

### 0.4 Pochette (si tu n'as pas de photo)

```
Product photo of a small rectangular zip pouch in cream cotton canvas, a small embroidered circled letter M monogram in terracotta thread centered on the front, dark brown zipper pull, lying flat on a plain warm beige background, soft diffused light, photorealistic, no other text.
```

### 0.5 Negative prompt universel (si ton outil a le champ)

```
text, letters, subtitles, watermark, badge, sticker, price tag, extra fingers, deformed hands, fused fingers, plastic skin, airbrushed skin, skin lightening, lighter skin tone, grey or ashy cast, cool blue light, fluorescent light, clinical white lab, changing label, extra bottles, distorted logo
```

### 0.6 Clip témoin — prêt à coller (HOOK-05)

Le plan le plus rentable à tester en premier : il ne dépend d'aucune persona, seulement du packshot et d'une main. S'il tient, le reste du batch tient.

**Étape 1 — image de départ** (Nano Banana, 9:16, packshot en référence) :

```
The MELA SKIN serum bottle from @image1, identical shape, colors and label, standing on a cream stone bathroom counter, label facing the camera turned slightly at 20 degrees. Warm terracotta zellige tiles behind, a folded cream towel at the edge of the frame. Soft warm window light from the left, golden tone, gentle shadows, no cool light. Photorealistic, 50mm f/2, shallow depth of field, warm cinematic grade, subtle film grain, no extra text, vertical 9:16.
```

Génère-en 3, garde celle où l'étiquette est la plus nette et la plus droite.

**Étape 2 — vidéo** (Seedance ou Kling, image-to-video, l'image validée en première frame) : colle le prompt complet de HOOK-05 en section 2.

**Ce que tu regardes sur le clip témoin**, dans cet ordre : l'étiquette n'a ni glissé ni muté pendant le mouvement · la main entre bien dans la première demi-seconde · les doigts sont au bon compte · la lumière est restée chaude. Si l'étiquette lâche au moment où la main saisit le flacon, ce n'est pas le prompt qu'il faut enrichir, c'est le mouvement qu'il faut ralentir : remplace `grabs the bottle in one decisive motion` par `closes around the bottle and lifts it slowly`.

---

## 1. Personas (images maîtresses)

À générer en Nano Banana, 3 à 4 candidates par persona, tu en figes une. Rien à attacher.

### PERSONA A · mashup « Chaque soir le fond de teint part » · P5

```
Photorealistic vertical 9:16 smartphone photo of a woman aged about 36 with warm medium-brown skin, phototype V, natural skin texture with visible pores, mild uneven tone: a darker shadow of hyperpigmentation around the mouth and faint darker patches on both cheekbones. Dark hair pulled back in a low bun, small gold hoop earrings, cream ribbed tank top, no makeup. She stands at a bathroom sink in three-quarter view, warm terracotta zellige tiles and a light oak shelf behind her. Soft warm window light from the left, golden tone, gentle shadows. Calm neutral expression. Realistic, no text.
```

### PERSONA B · mashup « Le bouton part, la marque reste » · P6

```
Photorealistic vertical 9:16 smartphone photo of a woman aged about 24 with rich dark-brown skin, phototype VI, natural skin texture with visible pores, several flat dark post-acne marks on the chin, jawline and left cheek, one small healing spot. Short natural coily hair, small silver studs, oversized sage-green t-shirt, no makeup. She sits on the edge of a bathtub in a small warm bathroom with cream tiles and a wooden stool, a window on her left. Soft warm daylight, gentle shadows. Relaxed, slightly tired expression. Realistic, no text.
```

### PERSONA C · mashup « Pourquoi ça marche sur peau mate » · P4

```
Photorealistic vertical 9:16 smartphone photo of a woman aged about 30 with warm golden-tan skin, phototype IV, natural skin texture with visible pores, soft symmetrical brownish patches on both cheekbones and faintly above the upper lip. Long dark wavy hair worn loose, cream linen shirt, no makeup. She stands near a window with a sheer linen curtain, terracotta plaster wall behind her. Soft warm natural light from the side, golden tone. Calm expression. Realistic, no text.
```

Pour un plan avec changement de tenue (serviette, bonnet, grossesse), fais l'image de départ en Nano Banana avec la persona attachée + le prompt du plan : c'est là que la tenue change, pas dans la vidéo.

---

## 2. HOOK

### HOOK-01 · Le coton qui révèle les taches
👤 PERSONA A · 5 s

```
Scene: Close-up of the woman from @image1, same face and exact same skin tone and depth, standing at her bathroom sink with terracotta zellige tiles behind her. Her face wears an even layer of matte foundation matching her skin tone that hides her marks. She holds a white cotton pad against her left cheek.
Action: In one slow continuous stroke she wipes the cotton pad across her cheek toward her ear, removing the foundation and revealing flat darker hyperpigmentation patches on the cheekbone; the cotton pad now shows a brown foundation stain.
Camera: Fixed at face height, slight handheld micro-shake, very slow push-in.
Light: Soft warm window light from the left, golden evening tone, gentle shadows, no cool or fluorescent light.
Style: Photorealistic, natural skin texture with visible pores, authentic smartphone video look, no text, vertical 9:16, 5 seconds.
Audio: Soft rubbing sound of the cotton pad, no music, no voice.
```

### HOOK-02 · Correcteur agacé
👤 PERSONA A · 4 s

```
Scene: Tight close-up of the lower half of the face of the woman from @image1, bare skin with a darker shadow of hyperpigmentation around the corners of her mouth. Her ring finger holds a small dab of creamy concealer near the corner of her lips.
Action: She taps the concealer onto the darker shadow with quick, slightly impatient little taps.
Camera: Static mirror point of view, handheld with natural micro-shake.
Light: Soft warm window light from the left, golden tone, no cool or fluorescent light.
Style: Photorealistic, natural skin texture with visible pores, authentic smartphone video look, no text, vertical 9:16, 4 seconds.
Audio: Faint tapping sound, no music, no voice.
```

### HOOK-03 · Miroir embué
👤 PERSONA (du mashup) · 5 s · image de départ avec serviette sur les cheveux

```
Scene: A bathroom mirror fully fogged with condensation after a shower. Behind the fog, the blurred silhouette of the woman from @image1, same skin tone, her hair wrapped in a cream towel, terracotta tiles softly visible.
Action: Her palm wipes across the mirror in one wide horizontal stroke, revealing her clear reflection looking closely at her own cheek.
Camera: Fixed just behind her shoulder, facing the mirror.
Light: Warm dim bathroom light, steam in the air, glow from one bright window, no cool light.
Style: Photorealistic, natural skin texture with visible pores, cinematic, no text, vertical 9:16, 5 seconds.
Audio: Squeak of a palm on wet glass, no music, no voice.
```

### HOOK-04 · Goutte sur terracotta
📎 SÉRUM · 5 s

```
Scene: Extreme macro of the glass dropper of the MELA SKIN serum from @image1, dark brown rubber bulb and clear glass tube, held vertically above a matte terracotta-colored surface. A single drop of lightweight translucent serum with a faint golden tint is forming at the tip.
Action: The drop detaches and falls, hits the surface and spreads into a small glossy circle.
Camera: Static, ultra slow motion.
Light: Warm golden light raking low across the surface from the right, catching a bright highlight on the drop.
Style: Photorealistic, 100mm macro lens, glossy viscous texture, premium skincare commercial, no text, vertical 9:16, 5 seconds.
Audio: One soft drip, no music.
```

### HOOK-05 · La main qui attrape le flacon
📎 SÉRUM · ✋ MAIN · 4 s · **clip témoin conseillé**

```
Scene: The MELA SKIN serum bottle from @image1, identical shape, colors and label, standing on a cream stone bathroom counter, label facing the camera turned slightly at 20 degrees. Warm terracotta zellige tiles behind, a folded cream towel at the edge of the frame.
Action: Within the first half-second, a woman's hand with warm medium-brown skin (phototype V) and short natural nails enters quickly from the right and grabs the bottle in one decisive motion, lifting it out of frame.
Camera: Static, at the height of the bottle.
Light: Soft warm window light from the left, golden tone, gentle shadows, no cool light.
Style: Photorealistic, 50mm f/2, shallow depth of field, warm cinematic grade, subtle film grain, no extra text, vertical 9:16, 4 seconds.
Audio: Light clink of glass on stone, no music.
```

### HOOK-06 · La joue tournée vers la fenêtre
👤 PERSONA B · 4 s

```
Scene: Selfie-camera framing of the woman from @image1, same face and exact same skin tone, sitting near a window, bare face, flat dark post-acne marks visible on her chin and left cheek.
Action: She slowly turns her face to the side toward the window, presenting her cheek to the light.
Camera: Front-facing smartphone held at arm's length, natural handheld shake.
Light: Bright warm daylight from the window raking across her skin, revealing real texture and the marks, no cool light.
Style: Photorealistic, natural skin texture with visible pores, authentic smartphone selfie video, no text, vertical 9:16, 4 seconds.
Audio: Quiet room tone, no music, no voice.
```

---

## 3. DOULEUR

### DOUL-ACNE · La marque qui reste
👤 PERSONA B · 4 s

```
Scene: Tight close-up of the chin and jawline of the woman from @image1, rich dark-brown skin with the exact same tone, flat dark post-acne marks where pimples have healed, one small healing spot.
Action: Her fingertip gently touches one dark mark on her chin and stays still.
Camera: Very slow push-in, handheld micro-shake.
Light: Soft warm daylight from the side, gentle shadows, no cool light.
Style: Photorealistic, natural skin texture with visible pores, documentary beauty look, no text, vertical 9:16, 4 seconds.
Audio: Quiet room tone, no music, no voice.
```

### DOUL-MELA · Mélasma de grossesse
👤 PERSONA (idéalement C) · 5 s · image de départ en version enceinte

```
Scene: The woman from @image1, same face and skin tone, visibly pregnant at about seven months, wearing a cream ribbed dress, standing side-on to a bathroom mirror. Soft symmetrical brownish patches on both cheekbones and above her upper lip. One hand rests on her belly.
Action: She slowly raises her other hand and touches one cheekbone while looking at her reflection.
Camera: Fixed over her shoulder, facing the mirror.
Light: Soft warm morning window light, golden tone, no cool light.
Style: Photorealistic, natural skin texture with visible pores, intimate and calm, no text, vertical 9:16, 5 seconds.
Audio: Quiet room tone, no music, no voice.
```

### DOUL-HPI · L'ombre après l'épilation
👤 PERSONA (du mashup) · 4 s

```
Scene: Extreme close-up of the upper lip of the woman from @image1, exact same skin tone, a slightly darker shadow of hyperpigmentation just above the lip. A pair of slanted metal tweezers is held close to the skin.
Action: The tweezers pluck a single fine hair at the edge of the upper lip and pull slowly away.
Camera: Static macro, mirror point of view.
Light: Soft warm window light, gentle shadows, no cool light.
Style: Photorealistic, natural skin texture with visible pores, 100mm macro, no text, vertical 9:16, 4 seconds.
Audio: Tiny pluck sound, no music, no voice.
```

### DOUL-TEINT · Aucune teinte ne va
✋ MAIN · 4 s

```
Scene: Top-down close-up of the back of a woman's hand with warm medium-brown skin (phototype V) resting on a cream stone bathroom counter. Three streaks of liquid foundation side by side on the back of the hand: one too light and ashy, one too pink, one too orange. Three plain unbranded foundation bottles blurred at the edge of the frame.
Action: She slowly turns her hand toward the light, the three mismatched swatches catching the light.
Camera: Static, top-down.
Light: Soft warm window light from above left, no cool light.
Style: Photorealistic, natural skin texture, 50mm macro, no logos, no text, vertical 9:16, 4 seconds.
Audio: No music, no voice.
```

### DOUL-GEN · Le tiroir des produits qui n'ont rien fait
— · 4 s

```
Scene: Top-down view of an open bathroom drawer filled with about eight half-used skincare bottles and tubes in plain white and clear unbranded packaging, no logos, no text.
Action: A hand with warm medium-brown skin (phototype V) pushes the drawer shut in one firm motion.
Camera: Static, top-down.
Light: Soft warm natural light, gentle shadows, no cool light.
Style: Photorealistic, 35mm, warm cinematic grade, no text, vertical 9:16, 4 seconds.
Audio: Soft thud of the drawer closing, bottles rattling, no music.
```

---

## 4. PRODUIT

### PROD-01 · Rayon de soleil sur le rebord
📎 SÉRUM · 5 s

```
Scene: The MELA SKIN serum bottle from @image1, identical shape, colors and label, standing on a warm terracotta plaster ledge, label facing the camera. A folded cream linen cloth on its left, a small sage-green ceramic dish on its right.
Action: A beam of morning sunlight slowly slides across the ledge and passes over the bottle, making the amber glass glow.
Camera: Static.
Light: Soft morning sun through a window, dust particles floating in the beam, warm golden tone.
Style: Photorealistic, 50mm f/2, shallow depth of field, warm matte film tones, premium product film, no extra text, vertical 9:16, 5 seconds.
Audio: Soft ambient room tone, no music.
```

### PROD-02 · Rotation sur plinthe
📎 SÉRUM · 5 s

```
Scene: The MELA SKIN serum bottle from @image1, identical shape, colors and label, centered on a small round cream plinth against a seamless deep terracotta-brown backdrop.
Action: The plinth rotates slowly by about 60 degrees, the bottle turning with it.
Camera: Static, slightly below eye level.
Light: Warm directional key light from the left, soft rim light outlining the amber glass, long soft shadow.
Style: Photorealistic, 85mm, studio product film, warm grade, no extra text, vertical 9:16, 5 seconds.
Audio: No music.
```

Pas de 360° complet : le modèle inventerait le dos de l'étiquette.

### PROD-03 · Ombres de feuillage
📎 SÉRUM · 5 s

```
Scene: The MELA SKIN serum bottle from @image1, identical shape, colors and label, standing on a cream linen cloth on a wooden table.
Action: Shadows of olive leaves move gently across the bottle and the cloth in a light breeze.
Camera: Static.
Light: Warm late-afternoon sun from the side, dappled light through leaves, golden tone.
Style: Photorealistic, 50mm f/2.8, warm matte film tones, subtle grain, no extra text, vertical 9:16, 5 seconds.
Audio: Faint rustle of leaves, no music.
```

### PROD-04 · Pierre mouillée
📎 SÉRUM · 5 s

```
Scene: The MELA SKIN serum bottle from @image1, identical shape, colors and label, standing on a wet terracotta-colored river stone, tiny water droplets on the amber glass, a thin film of water on the stone.
Action: A single water droplet rolls slowly down the side of the bottle.
Camera: Very slow push-in.
Light: Warm backlight making the amber glass and water droplets glow, soft fill from the front.
Style: Photorealistic, 100mm macro, fresh and premium, no extra text, vertical 9:16, 5 seconds.
Audio: Soft water trickle, no music.
```

### PROD-05 · Trois carnations, un flacon
📎 SÉRUM · 3 mains · 4 s

```
Scene: Close-up of three women's hands gathered around the MELA SKIN serum bottle from @image1, identical shape, colors and label, fingertips lightly touching the bottle held in the center: one hand with warm golden-tan skin (phototype IV), one with warm medium-brown skin (phototype V), one with rich dark-brown skin (phototype VI). Short natural nails. Plain terracotta background.
Action: The hands stay still and relaxed while the camera moves.
Camera: Slow push-in toward the bottle.
Light: Soft warm directional light, gentle shadows, no cool light.
Style: Photorealistic, natural skin texture, 50mm f/2, shallow depth of field, no extra text, vertical 9:16, 4 seconds.
Audio: No music.
```

Plan à risque pour les doigts : génère 3 images de départ et garde la plus propre.

---

## 5. TEXTURE

### TEX-01 · La pipette se remplit
📎 SÉRUM · 4 s

```
Scene: Extreme macro side view of the glass dropper from @image1, dark brown rubber bulb, dipped into the open neck of the amber glass bottle.
Action: The bulb is released and the lightweight translucent serum with a faint golden tint rises slowly up the clear glass tube.
Camera: Static, side view.
Light: Warm backlight making the serum glow golden inside the glass.
Style: Photorealistic, 100mm macro, premium skincare commercial, no text, vertical 9:16, 4 seconds.
Audio: Faint suction sound, no music.
```

### TEX-02 · La goutte qui perle
📎 SÉRUM · 5 s

```
Scene: Extreme macro of the tip of the glass dropper from @image1 at the top of the frame, the amber bottle softly blurred in the background on a cream surface.
Action: A drop of lightweight translucent serum with a faint golden tint slowly swells at the tip, trembles, then falls out of frame.
Camera: Static, ultra slow motion.
Light: Warm golden backlight catching the drop.
Style: Photorealistic, 100mm macro, glossy texture, premium skincare commercial, no text, vertical 9:16, 5 seconds.
Audio: Single soft drip, no music.
```

### TEX-03 · Étiré entre les doigts
✋ MAIN · 4 s

```
Scene: Extreme close-up of the thumb and index finger of a woman's hand with warm medium-brown skin (phototype V), short natural nails, a small amount of lightweight translucent serum with a faint golden tint pressed between them, plain terracotta background.
Action: The fingers slowly separate, stretching the serum into a thin glossy film that thins out and breaks.
Camera: Static macro.
Light: Warm backlight highlighting the glossy serum, soft fill.
Style: Photorealistic, natural skin texture, 100mm macro, no text, vertical 9:16, 4 seconds.
Audio: Faint tacky sound, no music.
```

### TEX-04 · Absorbé sans trace blanche
✋ MAIN (P6 recommandé) · 5 s

```
Scene: Top-down macro of the back of a woman's hand with rich dark-brown skin (phototype VI), short natural nails, a small pool of lightweight translucent serum with a faint golden tint on the back of the hand, cream linen underneath.
Action: Two fingertips of the other hand spread the serum in small circles until it is fully absorbed, leaving the skin with a soft natural sheen and no white or grey residue.
Camera: Static, top-down.
Light: Soft warm daylight from the side revealing skin texture, no cool light.
Style: Photorealistic, natural skin texture with visible pores, 100mm macro, no text, vertical 9:16, 5 seconds.
Audio: No music.
```

### TEX-05 · Goutte sur verre
— · 5 s

```
Scene: A vertical sheet of clear glass in front of a softly blurred terracotta wall. A single drop of lightweight translucent serum with a faint golden tint clings to the top of the glass.
Action: The drop slides slowly down the glass, leaving a thin glossy trail.
Camera: Static, slight slow push-in.
Light: Warm golden backlight through the glass.
Style: Photorealistic, 100mm macro, premium skincare commercial, no text, vertical 9:16, 5 seconds.
Audio: No music.
```

---

## 6. RITUEL (ton protocole : nettoyer, 3-4 gouttes en tapotant, SPF le matin)

### RIT-01 · Nettoyage doux
👤 PERSONA (du mashup) · 4 s

```
Scene: Medium close-up of the woman from @image1, same face and exact skin tone, leaning over the bathroom sink, her face covered in a soft white cleansing foam, terracotta zellige tiles behind her.
Action: She rinses her face with one splash of water from her cupped hands.
Camera: Static, slightly side-on.
Light: Soft warm window light from the left, golden tone, no cool light.
Style: Photorealistic, natural skin texture with visible pores, authentic smartphone video look, no text, vertical 9:16, 4 seconds.
Audio: Water splash, running tap, no music, no voice.
```

### RIT-02 · Les gouttes sur la pommette
👤 PERSONA + 📎 SÉRUM · 4 s · **clip témoin conseillé**

```
Scene: Close-up of the woman from @image1, same face and exact skin tone, bare face after cleansing, holding the glass dropper of the MELA SKIN serum from @image2 (dark brown bulb, clear glass tube) just above her cheekbone.
Action: She squeezes the bulb gently and deposits a few small drops of lightweight translucent serum along her cheekbone.
Camera: Static, slight upward tilt, mirror point of view.
Light: Soft warm window light from the left, golden tone, no cool light.
Style: Photorealistic, natural skin texture with visible pores, authentic smartphone video look, no text, vertical 9:16, 4 seconds.
Audio: Quiet room tone, no music, no voice.
```

### RIT-03 · Les tapotements
👤 PERSONA (du mashup) · 4 s

```
Scene: Close-up of the woman from @image1, same face and exact skin tone, eyes half-closed, fingertips of both hands resting on her cheeks where the serum was applied.
Action: Her fingertips gently pat the serum into her cheeks with a light, rhythmic tapping motion.
Camera: Slow orbit of a few degrees to the right.
Light: Soft warm window light, healthy natural sheen on the skin, no cool light.
Style: Photorealistic, natural skin texture with visible pores, calm intimate morning atmosphere, no text, vertical 9:16, 4 seconds.
Audio: Soft tapping sound, no music, no voice.
```

### RIT-04 · Le SPF du matin
👤 PERSONA + 📎 SPF · 4 s

```
Scene: Close-up of the hands of the woman from @image1, same skin tone, holding the MELA SKIN SPF 50+ sunscreen tube from @image2, identical dark chocolate-brown tube, flip cap and label, above the bathroom sink. Her face is softly out of focus in the background.
Action: She squeezes a line of white sunscreen along her index and middle finger.
Camera: Static, close on the hands.
Light: Bright warm morning daylight from the window, no cool light.
Style: Photorealistic, natural skin texture, 50mm f/2, shallow depth of field, no extra text, vertical 9:16, 4 seconds.
Audio: Soft squeeze sound, no music, no voice.
```

### RIT-05 · Version soir, bonnet en satin
👤 PERSONA (idéalement B) + 📎 SÉRUM · 5 s · image de départ avec bonnet

```
Scene: Medium close-up of the woman from @image1, same face and exact skin tone, wearing a black satin bonnet over her hair and a sage-green t-shirt, sitting on the edge of her bed in the evening, holding the MELA SKIN serum bottle from @image2, identical shape, colors and label.
Action: She unscrews the dropper and lifts the glass pipette out of the bottle.
Camera: Static, eye level, handheld micro-shake.
Light: Warm bedside lamp only, amber tone, dark cosy surroundings, no cool light.
Style: Photorealistic, natural skin texture with visible pores, authentic smartphone video look, no text, vertical 9:16, 5 seconds.
Audio: Soft unscrewing sound, no music, no voice.
```

### RIT-06 · Version matin, café
📎 SÉRUM · 5 s

```
Scene: The MELA SKIN serum bottle from @image1, identical shape, colors and label, on a cream stone bathroom counter next to a sage-green ceramic cup of black coffee, a folded cream towel behind.
Action: Steam rises slowly from the coffee while the morning light gradually brightens.
Camera: Static.
Light: Soft warm morning window light, golden tone.
Style: Photorealistic, 50mm f/2, shallow depth of field, warm matte film tones, no extra text, vertical 9:16, 5 seconds.
Audio: Faint morning ambience, no music.
```

---

## 7. RÉSULTAT

**Règle** : dans ces plans, garde la peau de la persona **telle qu'elle est** sur l'image maîtresse. Ne demande pas au modèle d'effacer les taches. Un « après » généré par IA de la même femme qu'on a vue avec des taches, c'est un faux résultat. Ces plans montrent l'aisance et le rituel. Pour la preuve de résultat, filme tes vraies clientes.

### RES-01 · Peau nue en lumière naturelle
👤 PERSONA · 4 s

```
Scene: Close-up of the cheek of the woman from @image1, bare face, skin exactly as in @image1 with the same tone, texture and marks, no retouching.
Action: She turns her face very slightly toward the window.
Camera: Slow push-in on her cheek.
Light: Natural warm daylight raking across the skin, revealing real texture, no cool light.
Style: Photorealistic, natural skin texture with visible pores, 85mm f/2, documentary beauty film, no text, vertical 9:16, 4 seconds.
Audio: Quiet room tone, no music, no voice.
```

### RES-02 · Le fond de teint reste au tiroir
👤 PERSONA A · 4 s

```
Scene: The woman from @image1, same face and exact skin tone, bare face, dressed for work in a cream blouse, standing at her bathroom sink in the morning, holding a plain unbranded foundation bottle, a drawer open below.
Action: She places the foundation bottle into the drawer and slides the drawer shut.
Camera: Static medium shot, slightly side-on.
Light: Soft warm morning window light, golden tone, no cool light.
Style: Photorealistic, natural skin texture with visible pores, authentic smartphone video look, no logos, no text, vertical 9:16, 4 seconds.
Audio: Drawer closing, no music, no voice.
```

### RES-03 · La main sur la joue
👤 PERSONA · 4 s

```
Scene: Close-up of the woman from @image1, same face and exact skin tone, looking at herself in the bathroom mirror, skin exactly as in @image1.
Action: Her hand glides slowly along her cheek and a small natural smile appears.
Camera: Static, over-the-shoulder mirror framing.
Light: Soft warm window light, golden tone, no cool light.
Style: Photorealistic, natural skin texture with visible pores, intimate and calm, no text, vertical 9:16, 4 seconds.
Audio: Quiet room tone, no music, no voice.
```

### RES-04 · Plein soleil en terrasse
👤 PERSONA · 5 s · image de départ en extérieur

```
Scene: The woman from @image1, same face and exact skin tone, bare face, sitting on a sunny terrace with terracotta pots and a cream wall behind her, wearing a cream linen shirt.
Action: She tilts her face up toward the sun with her eyes closed, relaxed.
Camera: Slow push-in from a medium close-up.
Light: Warm late-afternoon sun, golden tone, soft natural shadows.
Style: Photorealistic, natural skin texture with visible pores, 85mm f/2, warm cinematic grade, no text, vertical 9:16, 5 seconds.
Audio: Soft outdoor ambience, distant birds, no music.
```

### RES-05 · Flacons vides alignés
📎 SÉRUM · ✋ MAIN · 4 s

```
Scene: Three empty MELA SKIN serum bottles from @image1, identical shape, colors and label, lined up on a light oak bathroom shelf against terracotta tiles, an empty space at the end of the row.
Action: A hand with warm medium-brown skin (phototype V) sets a fourth, full bottle down in the empty space at the end of the row.
Camera: Static, eye level with the shelf.
Light: Soft warm window light, golden tone, no cool light.
Style: Photorealistic, 50mm f/2, warm matte film tones, no extra text, vertical 9:16, 4 seconds.
Audio: Soft clink of glass on wood, no music.
```

---

## 8. OFFRE

### OFF-01 · Unboxing
📎 SÉRUM + 📎 POCHETTE · ✋ MAIN · 5 s

```
Scene: Top-down view of an open kraft shipping box on a cream linen bedsheet, cream tissue paper inside partly covering the MELA SKIN serum bottle from @image1 and the MELA SKIN pouch from @image2, identical shapes, colors and labels.
Action: Two hands with warm medium-brown skin (phototype V) fold back the tissue paper, revealing the bottle and the pouch.
Camera: Static, top-down.
Light: Soft warm morning light from a window, gentle shadows.
Style: Photorealistic, 35mm, warm matte film tones, no extra text, vertical 9:16, 5 seconds.
Audio: Crinkle of tissue paper, no music.
```

### OFF-02 · Trois flacons et la pochette
📎 SÉRUM + 📎 POCHETTE · 5 s

```
Scene: Three identical MELA SKIN serum bottles from @image1 standing side by side on a terracotta surface, the MELA SKIN pouch from @image2 leaning against them, identical shapes, colors and labels.
Action: The arrangement stays still while the camera moves.
Camera: Slow orbit of about 30 degrees around the arrangement.
Light: Warm directional light from the left creating soft long shadows, glowing amber glass.
Style: Photorealistic, premium e-commerce product film, 50mm, no extra text, vertical 9:16, 5 seconds.
Audio: No music.
```

Cale le nombre de flacons sur l'offre que tu pousses dans la vidéo.

### OFF-03 · L'e-book sur le téléphone (fond vert)
✋ MAIN · 5 s · l'écran s'incruste au montage

```
Scene: A hand with warm medium-brown skin (phototype V) holding a smartphone vertically above a cream linen bedsheet, the phone screen is a flat uniform bright green for compositing.
Action: The thumb makes two slow upward scrolling swipes on the screen.
Camera: Static, slightly over-the-shoulder point of view.
Light: Soft warm natural light, no reflections on the screen.
Style: Photorealistic, natural skin texture, 35mm, no text on the screen, vertical 9:16, 5 seconds.
Audio: No music.
```

Au montage, tu incrustes un vrai enregistrement d'écran de ton e-book. Même méthode pour montrer des avis : uniquement de vrais avis.

---

## 9. MÉCANISME

### MEC-01 · Les 5 actifs
— · 5 s

```
Scene: A row of five small clear glass laboratory vials on a cream stone surface against a warm terracotta plaster wall. Four vials contain fine white crystalline powders with slightly different textures, the fifth contains a pale golden oil. No labels, no text.
Action: The vials stay still while the camera moves.
Camera: Slow lateral slide along the row, left to right.
Light: Warm golden side light, soft shadows, no clinical white or cool light.
Style: Photorealistic, 100mm macro, shallow depth of field, premium, no text, vertical 9:16, 5 seconds.
Audio: No music.
```

Au montage, dans l'ordre : acide azélaïque 10 %, niacinamide 5 %, acide tranexamique 2 %, alpha-arbutine 2 % (les 4 poudres), vitamine C stable 3 % (l'huile dorée).

### MEC-02 · La poudre en slow-mo
— · 5 s

```
Scene: A small glass scoop holding fine white crystalline powder above a matte terracotta surface.
Action: The powder pours slowly from the scoop and forms a small cone on the surface, fine particles drifting in the air.
Camera: Static, ultra slow motion.
Light: Warm golden backlight making the floating particles glow.
Style: Photorealistic, 100mm macro, premium, no text, vertical 9:16, 5 seconds.
Audio: Faint grainy pouring sound, no music.
```

### MEC-03 · Le trajet d'une tache
— · 5 s

```
Scene: Stylized 3D cross-section of human skin layers in warm tones of cream, terracotta and deep brown. At the base of the upper layer, a star-shaped pigment cell glows softly.
Action: The cell releases small dark-brown pigment granules that slowly drift upward through the layers toward the skin surface.
Camera: Slow push-in toward the cell.
Light: Soft warm internal glow, no cool colors.
Style: Soft clay-like 3D scientific illustration, premium and calm, no text, no labels, vertical 9:16, 5 seconds.
Audio: No music.
```

Si le rendu fait trop « IA bizarre », fais ce plan en motion design sur Canva, avec le schéma de ta fiche produit.

### MEC-04 · Le soleil sur la joue
👤 PERSONA C · 4 s

```
Scene: Close-up of the woman from @image1, same face and exact skin tone, near a window, a harsh bright sunbeam falling across her cheekbone and the brownish patches on it.
Action: She squints slightly and raises her hand to shade her face.
Camera: Static, close-up.
Light: Hard warm direct sunlight through the window, strong contrast.
Style: Photorealistic, natural skin texture with visible pores, cinematic, no text, vertical 9:16, 4 seconds.
Audio: Quiet room tone, no music, no voice.
```

Raccorde directement sur RIT-04.

---

## 10. TRANSITIONS

### TRA-01 · Main sur l'objectif
✋ MAIN · 3 s

```
Scene: A warm bathroom with terracotta zellige tiles softly out of focus.
Action: A hand with warm medium-brown skin (phototype V) moves quickly toward the camera and covers the lens completely, the frame ending in dark brown.
Camera: Static.
Light: Soft warm window light, no cool light.
Style: Photorealistic, 35mm, motion blur on the hand, no text, vertical 9:16, 3 seconds.
Audio: Soft whoosh, no music.
```

### TRA-02 · Serviette devant le visage
👤 PERSONA · 3 s

```
Scene: Close-up of the woman from @image1, same face and exact skin tone, in her bathroom, holding a cream towel.
Action: The cream towel passes quickly in front of her face from right to left, covering the whole frame for a moment.
Camera: Static.
Light: Soft warm window light, golden tone.
Style: Photorealistic, natural skin texture, motion blur on the towel, no text, vertical 9:16, 3 seconds.
Audio: Soft fabric whoosh, no music.
```

### TRA-03 · Le flacon traverse le cadre
📎 SÉRUM · ✋ MAIN · 3 s

```
Scene: Seamless deep terracotta-brown backdrop.
Action: A hand with warm medium-brown skin (phototype V) carries the MELA SKIN serum bottle from @image1 quickly across the frame from left to right.
Camera: Static.
Light: Warm directional light, glowing amber glass.
Style: Photorealistic, strong motion blur, identical bottle shape and colors, no extra text, vertical 9:16, 3 seconds.
Audio: Fast whoosh, no music.
```

### TRA-04 · Le rideau qui s'ouvre
— · 3 s

```
Scene: A room with a terracotta plaster wall, a sheer cream linen curtain closed over a window, dim warm light.
Action: The curtain slides open to the side and bright morning sunlight floods the room.
Camera: Static.
Light: From dim to bright warm golden morning sun.
Style: Photorealistic, 35mm, warm cinematic grade, no text, vertical 9:16, 3 seconds.
Audio: Curtain rings sliding, no music.
```

---

## 11. Récap : quand attacher le sérum

| Attache 📎 SÉRUM | Codes |
|---|---|
| Oui | HOOK-04, HOOK-05, PROD-01 à 05, TEX-01, TEX-02, RIT-02, RIT-05, RIT-06, RES-05, OFF-01, OFF-02, TRA-03 |
| Non (📎 SPF à la place) | RIT-04 |
| Non | Tout le reste |

## 12. Contrôle avant de garder un clip

Tu rejettes le clip si : le visage a changé, l'étiquette a bougé ou muté, la peau sort plus claire que sur la référence, une main est déformée, la lumière a viré au froid, ou du texte parasite est apparu.

Nommage : `MELA_BROLL_[CODE]_[P4|P5|P6]_V1` (ex. `MELA_BROLL_TEX-04_P6_V2`).

---

## 13. Ordre de passage (run manuel)

Les 43 plans se rangent en 4 groupes, du moins cher au plus cher. Tu ne passes au groupe suivant qu'une fois le précédent propre.

| # | Groupe | Plans | Ce que tu attaches |
|---|---|---|---|
| 0 | **Clip témoin** | HOOK-05 | packshot |
| 1 | Sans référence | 11 plans | rien (text-to-video direct possible) |
| 2 | Produit seul | 13 plans | packshot |
| 3 | Personas | 3 images maîtresses, puis 18 plans | persona (+ packshot sur RIT-02, RIT-05 ; SPF sur RIT-04) |

**Groupe 0 — le témoin.** Section 0.6, prêt à coller. Tu le regardes en entier avant toute autre dépense. Tant qu'il n'est pas bon, tu ne lances rien d'autre : ce qui casse ici cassera sur les 42 autres.

**Groupe 1 — les 11 plans sans référence.** DOUL-TEINT, DOUL-GEN, TEX-03, TEX-04, TEX-05, MEC-01, MEC-02, MEC-03, OFF-03, TRA-01, TRA-04. Aucune image à attacher, le prompt complet suffit. C'est le groupe le plus fiable : à faire en premier après le témoin pour te constituer un fond de banque utilisable tout de suite.

**Groupe 2 — les 13 plans produit restants.** HOOK-04, PROD-01 à 05, TEX-01, TEX-02, RIT-06, RES-05, OFF-01, OFF-02, TRA-03. Même méthode que le témoin : image de départ avec le packshot, puis animation. PROD-05 (trois mains) et OFF-01 (deux mains) sont les deux plans à doigts : 3 images de départ chacun, tu gardes la plus propre.

**Groupe 3 — les personas.** D'abord les 3 images maîtresses (section 1), 3 à 4 candidates chacune, tu en figes **une** par persona et tu ne la changes plus. Ensuite les 18 plans qui en dépendent. Quatre d'entre eux changent la tenue — HOOK-03 (serviette), DOUL-MELA (enceinte), RIT-05 (bonnet), RES-04 (extérieur) : le changement se fait à l'image de départ, avec la maîtresse attachée, jamais dans la vidéo.

**Règle de dépense sur tout le run** : une image ratée se rejette pour presque rien, une vidéo ratée se paie plein tarif. Tu ne montes jamais une image en vidéo tant qu'elle n'a pas passé la grille de la section 12.
