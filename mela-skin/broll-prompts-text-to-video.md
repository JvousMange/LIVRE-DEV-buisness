# MELA SKIN · Prompts B-roll text-to-video

Les mêmes 43 plans que `broll-prompts-kie.md`, réécrits pour tenir **sans aucune image** : pas d'image de départ, pas de première frame, pas de dernière frame, et surtout aucune référence. Un bloc = un clip. Prompts en anglais, 9:16, 3 à 5 s.

> **Lis ça avant de t'en servir.** Si ton modèle accepte une image de référence sans l'imposer comme première frame (Kling « elements », Seedance reference-to-video, Veo references), **n'utilise pas ce fichier** : prends `broll-prompts-kie.md` en méthode A. Tu génères aussi en une seule étape, mais tu gardes ton étiquette et tes personas. Ce fichier-ci est le repli pour quand tu n'attaches vraiment rien — il paie cette liberté en identité produit, comme expliqué juste en dessous.

Les codes sont identiques d'un fichier à l'autre : `HOOK-01` ici est le même plan que `HOOK-01` là-bas. Tu peux mélanger les deux méthodes dans un même mashup.

---

## 0. Ce que le text-to-video te coûte

Il faut le savoir avant de lancer, parce que ça change ce que tu peux faire de ces clips.

**Ton étiquette ne sera pas la tienne.** Aucun modèle ne peut inventer ton étiquette sans la voir. Les prompts ci-dessous décrivent donc un flacon ambré à capuchon brun avec une **étiquette brune unie et sans texte**. En macro, en flou de mouvement ou en arrière-plan, ça passe pour ton produit. En gros plan net et frontal, ça ne passe pas.

Conséquence pratique : les plans où le flacon est le sujet net et central — PROD-01, PROD-02, PROD-05, OFF-02 — restent meilleurs avec la méthode image de référence. En t2v, traite-les comme des plans d'ambiance, pas comme des packshots. Un vrai packshot se filme ou se génère avec référence, jamais en t2v.

**Tes personas ne seront pas stables d'un clip à l'autre.** Deux clips générés depuis la même description donnent deux femmes différentes. La parade n'est pas d'écrire une description plus longue : c'est de **cadrer pour que le visage ne soit pas l'ancre**. Les prompts persona ci-dessous privilégient la joue, le menton, les mains, le reflet, le contre-jour, la nuque, le visage flou. Dans un mashup monté serré, personne ne remarque que ce n'est pas la même femme si on ne voit jamais deux fois le même visage en entier.

Les trois plans qui montrent un visage entier et reconnaissable — HOOK-06, RES-04, RIT-03 — sont ceux où la triche se voit. Si ton mashup en contient deux, génère-les avec référence.

**Ce qui gagne au change** : les 11 plans qui n'avaient déjà aucune pièce jointe (DOUL-TEINT, DOUL-GEN, TEX-03, TEX-04, TEX-05, MEC-01, MEC-02, MEC-03, OFF-03, TRA-01, TRA-04) sont strictement aussi bons ici, et deux fois plus rapides à produire. Commence par eux.

### Negative prompt (colle-le à chaque génération)

```
text, letters, words, logo, brand name, subtitles, watermark, badge, sticker, price tag, extra fingers, six fingers, deformed hands, fused fingers, plastic skin, airbrushed skin, skin lightening, lighter skin tone, grey or ashy cast, cool blue light, fluorescent light, clinical white lab, morphing face, changing face, warping label, extra bottles, floating objects
```

`morphing face` et `warping label` sont les deux ajouts propres au t2v : ce sont les deux façons dont un clip sans référence se dégrade en cours de route.

### Réglages

- Durée : 5 s max. Au-delà, le sujet dérive — c'est vrai avec référence, c'est pire sans.
- Une seule action par clip. Les prompts ci-dessous n'en contiennent qu'une, ne les fusionne pas.
- Si ton modèle a un curseur de mouvement caméra, garde-le bas : un mouvement ample donne au modèle l'occasion de redessiner le sujet.

---

## 1. HOOK

### HOOK-01 · Le coton qui révèle les taches · 5 s

```
Scene: Close-up of a woman aged about 36 with warm medium-brown skin, phototype V, natural skin texture with visible pores, standing at a bathroom sink with warm terracotta zellige tiles behind her, dark hair pulled back in a low bun, cream ribbed tank top. Her face wears an even layer of matte foundation matching her skin tone. She holds a white cotton pad against her left cheek.
Action: In one slow continuous stroke she wipes the cotton pad across her cheek toward her ear, removing the foundation and revealing flat darker hyperpigmentation patches on the cheekbone; the cotton pad now shows a brown foundation stain.
Camera: Fixed at face height, slight handheld micro-shake, very slow push-in.
Light: Soft warm window light from the left, golden evening tone, gentle shadows, no cool or fluorescent light.
Style: Photorealistic, natural skin texture with visible pores, authentic smartphone video look, no text, vertical 9:16, 5 seconds.
Audio: Soft rubbing sound of the cotton pad, no music, no voice.
```

### HOOK-02 · Correcteur agacé · 4 s

```
Scene: Tight close-up of the lower half of the face of a woman with warm medium-brown skin, phototype V, natural skin texture with visible pores, bare skin with a darker shadow of hyperpigmentation around the corners of her mouth. Her ring finger holds a small dab of creamy concealer near the corner of her lips. Her eyes are above the top edge of the frame.
Action: She taps the concealer onto the darker shadow with quick, slightly impatient little taps.
Camera: Static mirror point of view, handheld with natural micro-shake.
Light: Soft warm window light from the left, golden tone, no cool or fluorescent light.
Style: Photorealistic, natural skin texture with visible pores, authentic smartphone video look, no text, vertical 9:16, 4 seconds.
Audio: Faint tapping sound, no music, no voice.
```

Le cadrage coupe les yeux volontairement : c'est ce qui rend ce plan sûr en t2v.

### HOOK-03 · Miroir embué · 5 s

```
Scene: A bathroom mirror fully fogged with condensation after a shower. Behind the fog, the blurred silhouette of a woman with warm medium-brown skin, phototype V, her hair wrapped in a cream towel, warm terracotta tiles softly visible around her.
Action: Her palm wipes across the mirror in one wide horizontal stroke, revealing a narrow clear band showing her cheek and jaw as she looks closely at her own skin.
Camera: Fixed just behind her shoulder, facing the mirror.
Light: Warm dim bathroom light, steam in the air, glow from one bright window, no cool light.
Style: Photorealistic, natural skin texture with visible pores, cinematic, no text, vertical 9:16, 5 seconds.
Audio: Squeak of a palm on wet glass, no music, no voice.
```

Meilleur plan du lot en t2v : la buée fait le travail de dissimulation à ta place.

### HOOK-04 · Goutte sur terracotta · 5 s

```
Scene: Extreme macro of a glass dropper pipette with a dark chocolate-brown rubber bulb and a clear glass tube, held vertically above a matte terracotta-colored surface. A single drop of lightweight translucent serum with a faint golden tint is forming at the tip.
Action: The drop detaches and falls, hits the surface and spreads into a small glossy circle.
Camera: Static, ultra slow motion.
Light: Warm golden light raking low across the surface from the right, catching a bright highlight on the drop.
Style: Photorealistic, 100mm macro lens, glossy viscous texture, premium skincare commercial, no text, vertical 9:16, 5 seconds.
Audio: One soft drip, no music.
```

Aucune étiquette dans le cadre : ce plan est identique en qualité aux deux méthodes.

### HOOK-05 · La main qui attrape le flacon · 4 s

```
Scene: A slim cylindrical amber glass dropper bottle with a dark chocolate-brown screw dropper cap and a plain matte warm-brown wraparound label with no readable text, standing on a cream stone bathroom counter. Warm terracotta zellige tiles behind, a folded cream towel at the edge of the frame.
Action: Within the first half-second, a woman's hand with warm medium-brown skin (phototype V) and short natural nails enters quickly from the right, closes around the bottle and lifts it out of frame.
Camera: Static, at the height of the bottle.
Light: Soft warm window light from the left, golden tone, gentle shadows, no cool light.
Style: Photorealistic, 50mm f/2, shallow depth of field, warm cinematic grade, subtle film grain, no text on the label, vertical 9:16, 4 seconds.
Audio: Light clink of glass on stone, no music.
```

### HOOK-06 · La joue tournée vers la fenêtre · 4 s

```
Scene: Selfie-camera framing of a woman aged about 24 with rich dark-brown skin, phototype VI, natural skin texture with visible pores, several flat dark post-acne marks on her chin and left cheek, short natural coily hair, oversized sage-green t-shirt, bare face, sitting near a window.
Action: She slowly turns her face to the side toward the window, presenting her cheek to the light, until her profile fills the frame.
Camera: Front-facing smartphone held at arm's length, natural handheld shake.
Light: Bright warm daylight from the window raking across her skin, revealing real texture and the marks, no cool light.
Style: Photorealistic, natural skin texture with visible pores, authentic smartphone selfie video, no text, vertical 9:16, 4 seconds.
Audio: Quiet room tone, no music, no voice.
```

Visage entier : c'est un des trois plans où l'absence de référence se voit. Le mouvement vers le profil limite les dégâts, mais si ce plan porte ton mashup, fais-le avec référence.

---

## 2. DOULEUR

### DOUL-ACNE · La marque qui reste · 4 s

```
Scene: Tight close-up of the chin and jawline of a woman with rich dark-brown skin, phototype VI, natural skin texture with visible pores, flat dark post-acne marks where pimples have healed, one small healing spot. The frame stops below her nose.
Action: Her fingertip gently touches one dark mark on her chin and stays still.
Camera: Very slow push-in, handheld micro-shake.
Light: Soft warm daylight from the side, gentle shadows, no cool light.
Style: Photorealistic, natural skin texture with visible pores, documentary beauty look, no text, vertical 9:16, 4 seconds.
Audio: Quiet room tone, no music, no voice.
```

### DOUL-MELA · Mélasma de grossesse · 5 s

```
Scene: A woman aged about 30 with warm golden-tan skin, phototype IV, natural skin texture with visible pores, soft symmetrical brownish patches on both cheekbones and faintly above her upper lip, long dark wavy hair worn loose, visibly pregnant at about seven months, wearing a cream ribbed dress, standing side-on to a bathroom mirror. One hand rests on her belly. Her face is seen only in the mirror reflection.
Action: She slowly raises her other hand and touches one cheekbone while looking at her reflection.
Camera: Fixed over her shoulder, facing the mirror.
Light: Soft warm morning window light, golden tone, no cool light.
Style: Photorealistic, natural skin texture with visible pores, intimate and calm, no text, vertical 9:16, 5 seconds.
Audio: Quiet room tone, no music, no voice.
```

Le visage passe par le reflet : un reflet légèrement imparfait ne choque pas, un visage direct imparfait si.

### DOUL-HPI · L'ombre après l'épilation · 4 s

```
Scene: Extreme close-up of the upper lip and philtrum of a woman with warm medium-brown skin, phototype V, natural skin texture with visible pores, a slightly darker shadow of hyperpigmentation just above the lip. A pair of slanted metal tweezers is held close to the skin. The frame shows only the mouth and the base of the nose.
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

Rappel : en t2v ces plans sont de l'ambiance, pas des packshots. L'étiquette sera unie et muette.

### PROD-01 · Rayon de soleil sur le rebord · 5 s

```
Scene: A slim cylindrical amber glass dropper bottle with a dark chocolate-brown screw dropper cap and a plain matte warm-brown wraparound label with no readable text, standing on a warm terracotta plaster ledge. A folded cream linen cloth on its left, a small sage-green ceramic dish on its right.
Action: A beam of morning sunlight slowly slides across the ledge and passes over the bottle, making the amber glass glow.
Camera: Static.
Light: Soft morning sun through a window, dust particles floating in the beam, warm golden tone.
Style: Photorealistic, 50mm f/2, shallow depth of field, warm matte film tones, premium product film, no text on the label, vertical 9:16, 5 seconds.
Audio: Soft ambient room tone, no music.
```

### PROD-02 · Rotation sur plinthe · 5 s

```
Scene: A slim cylindrical amber glass dropper bottle with a dark chocolate-brown screw dropper cap and a plain matte warm-brown wraparound label with no readable text, centered on a small round cream plinth against a seamless deep terracotta-brown backdrop.
Action: The plinth rotates slowly by about 60 degrees, the bottle turning with it.
Camera: Static, slightly below eye level.
Light: Warm directional key light from the left, soft rim light outlining the amber glass, long soft shadow.
Style: Photorealistic, 85mm, studio product film, warm grade, no text on the label, vertical 9:16, 5 seconds.
Audio: No music.
```

Une étiquette unie tourne sans se trahir, là où une étiquette texturée se serait déformée. C'est le seul plan que le t2v rend *plus* sûr.

### PROD-03 · Ombres de feuillage · 5 s

```
Scene: A slim cylindrical amber glass dropper bottle with a dark chocolate-brown screw dropper cap and a plain matte warm-brown wraparound label with no readable text, standing on a cream linen cloth on a wooden table.
Action: Shadows of olive leaves move gently across the bottle and the cloth in a light breeze.
Camera: Static.
Light: Warm late-afternoon sun from the side, dappled light through leaves, golden tone.
Style: Photorealistic, 50mm f/2.8, warm matte film tones, subtle grain, no text on the label, vertical 9:16, 5 seconds.
Audio: Faint rustle of leaves, no music.
```

### PROD-04 · Pierre mouillée · 5 s

```
Scene: A slim cylindrical amber glass dropper bottle with a dark chocolate-brown screw dropper cap and a plain matte warm-brown wraparound label with no readable text, standing on a wet terracotta-colored river stone, tiny water droplets on the amber glass, a thin film of water on the stone.
Action: A single water droplet rolls slowly down the side of the bottle.
Camera: Very slow push-in.
Light: Warm backlight making the amber glass and water droplets glow, soft fill from the front.
Style: Photorealistic, 100mm macro, fresh and premium, no text on the label, vertical 9:16, 5 seconds.
Audio: Soft water trickle, no music.
```

### PROD-05 · Trois carnations, un flacon · 4 s

```
Scene: Close-up of three women's hands gathered around a slim cylindrical amber glass dropper bottle with a dark chocolate-brown cap and a plain matte warm-brown label with no readable text, held upright in the center, fingertips lightly touching it: one hand with warm golden-tan skin (phototype IV), one with warm medium-brown skin (phototype V), one with rich dark-brown skin (phototype VI). Short natural nails, five fingers on each hand. Plain terracotta background.
Action: The hands stay still and relaxed while the camera moves.
Camera: Slow push-in toward the bottle.
Light: Soft warm directional light, gentle shadows, no cool light.
Style: Photorealistic, natural skin texture, 50mm f/2, shallow depth of field, no text on the label, vertical 9:16, 4 seconds.
Audio: No music.
```

Trois mains sans référence, c'est le plan le plus casse-gueule du pack. Génère-le 3 ou 4 fois, compte les doigts sur chaque sortie.

---

## 4. TEXTURE

Le meilleur bloc du pack en t2v : pas de visage, pas d'étiquette, rien à trahir.

### TEX-01 · La pipette se remplit · 4 s

```
Scene: Extreme macro side view of a glass dropper pipette with a dark chocolate-brown rubber bulb, dipped into the open neck of an amber glass bottle. Only the neck of the bottle is in frame.
Action: The bulb is released and lightweight translucent serum with a faint golden tint rises slowly up the clear glass tube.
Camera: Static, side view.
Light: Warm backlight making the serum glow golden inside the glass.
Style: Photorealistic, 100mm macro, premium skincare commercial, no text, vertical 9:16, 4 seconds.
Audio: Faint suction sound, no music.
```

### TEX-02 · La goutte qui perle · 5 s

```
Scene: Extreme macro of the tip of a glass dropper pipette at the top of the frame, an amber glass bottle softly blurred out of focus in the background on a cream surface.
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

### RIT-01 · Nettoyage doux · 4 s

```
Scene: Medium close-up of a woman with warm medium-brown skin, phototype V, natural skin texture with visible pores, dark hair pulled back, leaning over a bathroom sink, her face covered in soft white cleansing foam, warm terracotta zellige tiles behind her.
Action: She rinses her face with one splash of water from her cupped hands.
Camera: Static, slightly side-on.
Light: Soft warm window light from the left, golden tone, no cool light.
Style: Photorealistic, natural skin texture with visible pores, authentic smartphone video look, no text, vertical 9:16, 4 seconds.
Audio: Water splash, running tap, no music, no voice.
```

La mousse couvre le visage sur la moitié du clip : plan sûr.

### RIT-02 · Les gouttes sur la pommette · 4 s

```
Scene: Close-up of the cheekbone and jaw of a woman with warm medium-brown skin, phototype V, natural skin texture with visible pores, bare face after cleansing, faint darker patches on the cheekbone. A hand holds a glass dropper pipette with a dark chocolate-brown bulb just above her cheekbone. The frame stops at the level of her eyes.
Action: She squeezes the bulb gently and deposits a few small drops of lightweight translucent serum with a faint golden tint along her cheekbone.
Camera: Static, slight upward tilt, mirror point of view.
Light: Soft warm window light from the left, golden tone, no cool light.
Style: Photorealistic, natural skin texture with visible pores, authentic smartphone video look, no text, vertical 9:16, 4 seconds.
Audio: Quiet room tone, no music, no voice.
```

### RIT-03 · Les tapotements · 4 s

```
Scene: Close-up of a woman with warm medium-brown skin, phototype V, natural skin texture with visible pores, eyes closed, fingertips of both hands resting on her cheeks where serum was applied.
Action: Her fingertips gently pat the serum into her cheeks with a light, rhythmic tapping motion.
Camera: Static, no camera move.
Light: Soft warm window light, healthy natural sheen on the skin, no cool light.
Style: Photorealistic, natural skin texture with visible pores, calm intimate morning atmosphere, no text, vertical 9:16, 4 seconds.
Audio: Soft tapping sound, no music, no voice.
```

Deux écarts volontaires par rapport à la version avec référence : les yeux sont **fermés** et l'orbite caméra est supprimée. Yeux ouverts plus caméra qui tourne, c'est la recette du visage qui se remodèle en cours de plan.

### RIT-04 · Le SPF du matin · 4 s

```
Scene: Close-up of the hands of a woman with warm medium-brown skin, phototype V, holding a dark chocolate-brown sunscreen tube with a flip cap and a plain matte label with no readable text, above a bathroom sink. Her face is softly out of focus in the background.
Action: She squeezes a line of white sunscreen along her index and middle finger.
Camera: Static, close on the hands.
Light: Bright warm morning daylight from the window, no cool light.
Style: Photorealistic, natural skin texture, 50mm f/2, shallow depth of field, no text on the tube, vertical 9:16, 4 seconds.
Audio: Soft squeeze sound, no music, no voice.
```

### RIT-05 · Version soir, bonnet en satin · 5 s

```
Scene: Medium close-up of a woman aged about 24 with rich dark-brown skin, phototype VI, natural skin texture with visible pores, flat dark post-acne marks on her chin, wearing a black satin bonnet over her hair and a sage-green t-shirt, sitting on the edge of her bed in the evening, holding a slim amber glass dropper bottle with a dark chocolate-brown cap and a plain matte warm-brown label with no readable text.
Action: She unscrews the dropper and lifts the glass pipette out of the bottle.
Camera: Static, eye level, handheld micro-shake.
Light: Warm bedside lamp only, amber tone, dark cosy surroundings, no cool light.
Style: Photorealistic, natural skin texture with visible pores, authentic smartphone video look, no text on the label, vertical 9:16, 5 seconds.
Audio: Soft unscrewing sound, no music, no voice.
```

La lampe de chevet seule laisse la moitié du visage dans l'ombre : c'est ce qui sauve le plan.

### RIT-06 · Version matin, café · 5 s

```
Scene: A slim cylindrical amber glass dropper bottle with a dark chocolate-brown screw dropper cap and a plain matte warm-brown wraparound label with no readable text, on a cream stone bathroom counter next to a sage-green ceramic cup of black coffee, a folded cream towel behind.
Action: Steam rises slowly from the coffee while the morning light gradually brightens.
Camera: Static.
Light: Soft warm morning window light, golden tone.
Style: Photorealistic, 50mm f/2, shallow depth of field, warm matte film tones, no text on the label, vertical 9:16, 5 seconds.
Audio: Faint morning ambience, no music.
```

---

## 6. RÉSULTAT

**La règle ne bouge pas** : ces plans ne montrent pas un « après ». Les prompts décrivent une peau qui garde ses marques. Ne les retire pas de la description pour fabriquer un résultat — la preuve se filme sur tes vraies clientes.

### RES-01 · Peau nue en lumière naturelle · 4 s

```
Scene: Close-up of the cheek of a woman with warm medium-brown skin, phototype V, bare face, natural skin texture with visible pores, faint darker patches still visible on the cheekbone, no retouching. The frame shows the cheek, jaw and the corner of the mouth.
Action: She turns her face very slightly toward the window.
Camera: Slow push-in on her cheek.
Light: Natural warm daylight raking across the skin, revealing real texture, no cool light.
Style: Photorealistic, natural skin texture with visible pores, 85mm f/2, documentary beauty film, no text, vertical 9:16, 4 seconds.
Audio: Quiet room tone, no music, no voice.
```

### RES-02 · Le fond de teint reste au tiroir · 4 s

```
Scene: A woman with warm medium-brown skin, phototype V, natural skin texture with visible pores, bare face, dark hair in a low bun, dressed for work in a cream blouse, standing at a bathroom sink in the morning, holding a plain unbranded foundation bottle, a drawer open below. Seen from behind her shoulder, her face visible only as a partial reflection.
Action: She places the foundation bottle into the drawer and slides the drawer shut.
Camera: Static medium shot, slightly side-on.
Light: Soft warm morning window light, golden tone, no cool light.
Style: Photorealistic, natural skin texture with visible pores, authentic smartphone video look, no logos, no text, vertical 9:16, 4 seconds.
Audio: Drawer closing, no music, no voice.
```

### RES-03 · La main sur la joue · 4 s

```
Scene: Close-up of a woman with warm medium-brown skin, phototype V, natural skin texture with visible pores, faint darker patches on the cheekbone, looking at herself in a bathroom mirror, seen over her shoulder so her face appears only in the reflection.
Action: Her hand glides slowly along her cheek and a small natural smile appears.
Camera: Static, over-the-shoulder mirror framing.
Light: Soft warm window light, golden tone, no cool light.
Style: Photorealistic, natural skin texture with visible pores, intimate and calm, no text, vertical 9:16, 4 seconds.
Audio: Quiet room tone, no music, no voice.
```

### RES-04 · Plein soleil en terrasse · 5 s

```
Scene: A woman aged about 30 with warm golden-tan skin, phototype IV, natural skin texture with visible pores, soft brownish patches on both cheekbones, long dark wavy hair worn loose, bare face, sitting on a sunny terrace with terracotta pots and a cream wall behind her, wearing a cream linen shirt.
Action: She tilts her face up toward the sun with her eyes closed, relaxed, and stays still.
Camera: Slow push-in from a medium close-up.
Light: Warm late-afternoon sun, golden tone, soft natural shadows.
Style: Photorealistic, natural skin texture with visible pores, 85mm f/2, warm cinematic grade, no text, vertical 9:16, 5 seconds.
Audio: Soft outdoor ambience, distant birds, no music.
```

Visage entier et net, plein soleil : le plan le plus exposé du pack. Yeux fermés et immobilité sont là pour le stabiliser, mais c'est le premier que je referais avec référence.

### RES-05 · Flacons vides alignés · 4 s

```
Scene: Three identical empty slim amber glass dropper bottles with dark chocolate-brown caps and plain matte warm-brown labels with no readable text, lined up on a light oak bathroom shelf against warm terracotta tiles, an empty space at the end of the row.
Action: A hand with warm medium-brown skin (phototype V) sets a fourth identical full bottle down in the empty space at the end of the row.
Camera: Static, eye level with the shelf.
Light: Soft warm window light, golden tone, no cool light.
Style: Photorealistic, 50mm f/2, warm matte film tones, no text on the labels, vertical 9:16, 4 seconds.
Audio: Soft clink of glass on wood, no music.
```

Quatre flacons qui doivent se ressembler entre eux : le mot `identical` est répété exprès, ne l'enlève pas.

---

## 7. OFFRE

### OFF-01 · Unboxing · 5 s

```
Scene: Top-down view of an open kraft shipping box on a cream linen bedsheet, cream tissue paper inside partly covering a slim amber glass dropper bottle with a dark chocolate-brown cap and a plain matte warm-brown label with no readable text, next to a small cream cotton canvas zip pouch with a dark brown zipper pull and no readable text.
Action: Two hands with warm medium-brown skin (phototype V), five fingers each, fold back the tissue paper, revealing the bottle and the pouch.
Camera: Static, top-down.
Light: Soft warm morning light from a window, gentle shadows.
Style: Photorealistic, 35mm, warm matte film tones, no text, vertical 9:16, 5 seconds.
Audio: Crinkle of tissue paper, no music.
```

### OFF-02 · Trois flacons et la pochette · 5 s

```
Scene: Three identical slim amber glass dropper bottles with dark chocolate-brown caps and plain matte warm-brown labels with no readable text, standing side by side on a terracotta surface, a small cream cotton canvas zip pouch with a dark brown zipper pull leaning against them.
Action: The arrangement stays still while the camera moves.
Camera: Slow orbit of about 30 degrees around the arrangement.
Light: Warm directional light from the left creating soft long shadows, glowing amber glass.
Style: Photorealistic, premium e-commerce product film, 50mm, no text, vertical 9:16, 5 seconds.
Audio: No music.
```

L'orbite oblige le modèle à inventer le dos des flacons. En t2v, réduis-la à 15 degrés si le premier essai part en vrille, ou reste sur la version avec référence.

### OFF-03 · L'e-book sur le téléphone (fond vert) · 5 s

```
Scene: A hand with warm medium-brown skin (phototype V), five fingers, holding a smartphone vertically above a cream linen bedsheet, the phone screen a flat uniform bright green for compositing.
Action: The thumb makes two slow upward scrolling swipes on the screen.
Camera: Static, slightly over-the-shoulder point of view.
Light: Soft warm natural light, no reflections on the screen.
Style: Photorealistic, natural skin texture, 35mm, no text on the screen, vertical 9:16, 5 seconds.
Audio: No music.
```

Le fond vert reste la bonne méthode : c'est le seul plan du pack où tu peux incruster ton vrai contenu au montage. Même logique pour les avis : uniquement de vrais avis.

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
Scene: Close-up of the cheekbone and temple of a woman with warm golden-tan skin, phototype IV, natural skin texture with visible pores, soft brownish patches on the cheekbone, near a window, a harsh bright sunbeam falling across her cheek. The frame stops just above her eyebrow.
Action: She raises her hand into the frame to shade her cheek from the sunbeam.
Camera: Static, close-up.
Light: Hard warm direct sunlight through the window, strong contrast.
Style: Photorealistic, natural skin texture with visible pores, cinematic, no text, vertical 9:16, 4 seconds.
Audio: Quiet room tone, no music, no voice.
```

Raccorde directement sur RIT-04.

---

## 9. TRANSITIONS

Les quatre meilleurs plans en t2v : le flou de mouvement absout tout.

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
Scene: Close-up of a woman with warm medium-brown skin, phototype V, natural skin texture with visible pores, in a warm bathroom, holding a cream towel at the edge of the frame.
Action: The cream towel passes quickly in front of her face from right to left, covering the whole frame for a moment.
Camera: Static.
Light: Soft warm window light, golden tone.
Style: Photorealistic, natural skin texture, motion blur on the towel, no text, vertical 9:16, 3 seconds.
Audio: Soft fabric whoosh, no music.
```

Le visage n'est visible qu'une demi-seconde avant d'être couvert : c'est le seul plan persona totalement sûr en t2v.

### TRA-03 · Le flacon traverse le cadre · 3 s

```
Scene: Seamless deep terracotta-brown backdrop.
Action: A hand with warm medium-brown skin (phototype V) carries a slim amber glass dropper bottle with a dark chocolate-brown cap quickly across the frame from left to right.
Camera: Static.
Light: Warm directional light, glowing amber glass.
Style: Photorealistic, strong motion blur, no text on the label, vertical 9:16, 3 seconds.
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

| # | Groupe | Plans | Pourquoi d'abord |
|---|---|---|---|
| 1 | Transitions + Texture | TRA-01 à 04, TEX-01 à 05 | 9 plans quasi increvables, ta banque de secours |
| 2 | Mécanisme + mains | MEC-01, MEC-02, MEC-03, DOUL-TEINT, DOUL-GEN, OFF-03 | ni visage ni étiquette |
| 3 | Produit | HOOK-04, HOOK-05, PROD-01 à 05, RIT-06, RES-05, OFF-01, OFF-02 | l'étiquette unie tient si le cadre reste calme |
| 4 | Persona visage caché | HOOK-02, HOOK-03, DOUL-ACNE, DOUL-HPI, DOUL-MELA, RIT-01, RIT-02, RIT-04, RIT-05, RES-01, RES-02, RES-03, MEC-04, TRA-02 | cadrages qui coupent, couvrent ou reflètent |
| 5 | Persona visage entier | HOOK-01, HOOK-06, RIT-03, RES-04 | les 4 plans à refaire avec référence si le budget le permet |

## 11. Contrôle avant de garder un clip

Les critères de la version avec référence, plus les deux propres au t2v :

Tu rejettes le clip si le visage se déforme ou change de traits en cours de plan · si l'étiquette fait apparaître des lettres ou un motif · si la peau sort plus claire qu'au début du clip · si une main est déformée ou a plus de cinq doigts · si la lumière vire au froid · si du texte parasite apparaît.

Et une règle qui n'existe que sans référence : **regarde la dernière seconde en premier.** C'est là que la dérive se voit. Un clip propre aux quatre premières secondes et bancal à la cinquième se sauve en coupant au montage — inutile de le régénérer.

Nommage : `MELA_BROLLT2V_[CODE]_[P4|P5|P6]_V1` (ex. `MELA_BROLLT2V_TEX-04_P6_V2`). Le `T2V` évite de confondre les deux banques quand tu montes.
