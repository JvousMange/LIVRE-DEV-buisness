# MELA SKIN — prompts à générer pour la vidéo « tableau blanc »

Modèle conseillé : Nano Banana Pro / Nano Banana 2 (dans Higgsfield). Génère en haute résolution, une image par prompt, 2 à 3 variantes de chaque pour choisir.
Nomme les fichiers comme indiqué (ex. `main_1.png`) et envoie-les ici. Pour chaque image, dis-moi laquelle des variantes tu gardes.

Règles communes (déjà dans les prompts) : aucun texte, aucune lettre, aucun logo, mains anatomiquement correctes (5 doigts), pas de filigrane.

---

## A · LA MAIN AVEC LE FEUTRE (3 poses) — fond vert pour détourer

Fond **vert uni #00FF00**, sans ombre portée sur le fond, pour que je détoure proprement.
Si ton outil propose « remove background », génère sur fond blanc uni à la place et exporte en PNG transparent.

### A1 · `main_1.png` — main qui écrit / dessine
```
Photorealistic top-down photo of a woman's right hand holding a black dry-erase marker, as if drawing on a whiteboard in front of the camera, the marker tip pointing up and to the left, tip clearly visible and in sharp focus, thumb and index finger gripping the marker, natural relaxed grip, medium-brown skin tone, short clean natural nails, wearing a soft grey knit sweater sleeve, hand and forearm entering from the bottom right corner of the frame, isolated on a flat pure chroma green background (#00FF00), no shadows on the background, soft even studio lighting, high detail, vertical 9:16 composition, no text
```

### A2 · `main_2.png` — main qui pointe (index tendu)
```
Photorealistic top-down photo of a woman's right hand pointing with the index finger toward the upper left, other fingers curled, medium-brown skin tone, short clean natural nails, wearing a soft grey knit sweater sleeve, forearm entering from the bottom right corner of the frame, isolated on a flat pure chroma green background (#00FF00), no shadows on the background, soft even studio lighting, high detail, vertical 9:16 composition, no text
```

### A3 · `main_3.png` — main au repos (feutre tenu, relevé)
```
Photorealistic top-down photo of a woman's right hand holding a black dry-erase marker lifted slightly away from the surface, pen tip pointing up and to the left, relaxed fingers, medium-brown skin tone, short clean natural nails, soft grey knit sweater sleeve, forearm entering from the bottom right corner of the frame, isolated on a flat pure chroma green background (#00FF00), no shadows on the background, soft even studio lighting, high detail, vertical 9:16 composition, no text
```

---

## B · LE TABLEAU (fond) — `tableau.png`
```
Empty clean white dry-erase whiteboard surface filling the whole frame, slightly cool grey-white tone, very faint old marker smudges and eraser marks, subtle soft light reflections and a few soft bokeh glare spots near the top, no frame, no border, no objects, no hands, no text, photorealistic, perfectly flat front view, vertical 9:16
```

---

## C · LES PERSONNAGES (illustration au trait fin, façon dessin au feutre)

Style commun à tous (déjà écrit dans chaque prompt) : fin trait noir au feutre fin, hachures légères, remplissage coloré au feutre (bleu, rouge, orange, vert, jaune), dessin sur fond **blanc uni**, pas de ombre portée, cadrage centré avec de la marge autour.
Format 1:1. Peau mate à foncée : **ne pas éclaircir la peau** dans le rendu.

### C1 · `perso_taches.png` — raison 1 / hook : taches visibles sur le visage
```
Hand-drawn fine-liner black ink illustration, whiteboard marker style, of a young woman with medium-dark brown skin, shoulder-length dark hair, calm worried expression, front view bust, several small and medium dark brown spots (hyperpigmentation) on her cheeks, forehead and above her lip, light blue marker-colored shirt, thin black outlines with light crosshatching shading, skin colored with a soft brown marker fill, isolated on a pure white background, no shadow, no text, centered with generous margin
```

### C2 · `perso_fonddeteint.png` — raison 2 : elle cache avec du fond de teint
```
Hand-drawn fine-liner black ink illustration, whiteboard marker style, of a young woman with medium-dark brown skin applying foundation with a beauty sponge on her cheek, front three-quarter view, dark spots still slightly visible through the makeup, small foundation bottle in her other hand, light blue marker-colored shirt, thin black outlines with light crosshatching shading, soft brown marker fill for the skin, isolated on a pure white background, no shadow, no text, centered with generous margin
```

### C3 · `perso_soinsclairs.png` — raison 3 : les soins ne sont pas pensés pour sa peau
```
Hand-drawn fine-liner black ink illustration, whiteboard marker style, of a young woman with medium-dark brown skin holding a skincare tube and looking at its box with a disappointed, skeptical expression, the box shows an illustrated woman with very light skin, red irritation on her cheeks, light blue marker-colored shirt, thin black outlines with light crosshatching shading, soft brown marker fill for the skin, isolated on a pure white background, no shadow, no text, centered with generous margin
```

### C4 · `perso_gommage.png` — raison 4 : elle frotte, la peau s'irrite
```
Hand-drawn fine-liner black ink illustration, whiteboard marker style, of a young woman with medium-dark brown skin scrubbing her cheek hard with a grainy scrub on her fingers, wincing slightly, red irritation marks and small red radiating lines around the cheek, a few skincare jars nearby, light blue marker-colored shirt, thin black outlines with light crosshatching shading, soft brown marker fill for the skin, isolated on a pure white background, no shadow, no text, centered with generous margin
```

### C5 · `perso_imagine.png` — « imagine que tu puisses enfin… » : espoir, peau uniforme
```
Hand-drawn fine-liner black ink illustration, whiteboard marker style, of a young woman with medium-dark brown skin, looking at herself in a small hand mirror and smiling softly, even and glowing skin tone with no spots, light blue marker-colored shirt, thin black outlines with light crosshatching shading, soft brown marker fill for the skin, small yellow marker sparkle lines around her face, isolated on a pure white background, no shadow, no text, centered with generous margin
```

### C6 · `perso_serum.png` — offre / CTA : elle applique le sérum
```
Hand-drawn fine-liner black ink illustration, whiteboard marker style, of a young woman with medium-dark brown skin gently applying a serum with a glass dropper on her cheek, calm and confident, amber dropper bottle in her hand with a plain blank dark label, light blue marker-colored shirt, thin black outlines with light crosshatching shading, soft brown marker fill for the skin, isolated on a pure white background, no shadow, no text, centered with generous margin
```

---

## D · LE SCHÉMA DE LA PEAU (la science) — `peau_coupe.png`
```
Hand-drawn fine-liner black ink scientific illustration, whiteboard marker style, cross-section of human skin seen from the side: a thin outer surface layer on top, then the epidermis, then the dermis below, several dark brown melanocyte cells (round bodies with thin branching arms) at the base of the epidermis, tiny dark brown melanin dots rising from them toward the surface and clustering into a dark spot at the top, thin red marker wavy lines for the deeper layer, black outlines with light crosshatching, isolated on a pure white background, no text, no labels, no shadow, vertical 4:5 composition with generous margin
```

---

## E · LES ICÔNES (optionnel — je peux les dessiner en code, ne génère que si tu veux un rendu « main » plus riche)
Soleil / rasoir / frottement / cire : dis-le-moi et je te donne les prompts.

---

## Ce que je fais ensuite
1. Je détoure la main (vert → transparent) et calcule où est la pointe du feutre.
2. Je construis le tableau, les schémas, les traits qui se dessinent, les étiquettes manuscrites, les sous-titres au style de ta référence.
3. Pour tes personnages, la main « révèle » chaque dessin en suivant un trait pendant que la voix parle.
4. Je te montre un test de 15 secondes (intro + raison 1) avant de faire les 2 min 20.

## Le flacon
Envoie-moi ta photo du flacon **comme fichier** (png/jpg), pas seulement collée dans le chat : je l'utilise telle quelle sur les plans produit.
