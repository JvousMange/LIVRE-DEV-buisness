# Cahier des charges — Agent autonome de création de vidéos « papier/carton » 100 % vectorielles

Référence de qualité : la vidéo Cloudless / Clear+ (88 s, 9:16, ~35 plans, style papier découpé sur carton kraft).
Contrainte posée : **tout est généré en code vectoriel (SVG + animation par code)**. Aucune image générée par IA (pas de Higgsfield / Nanobanana / vidéo IA) dans le pipeline.

---

## 1. Objectif

À partir d'un **brief** (marque, produit, angle, offre) et d'un **script**, l'agent produit seul, sans intervention humaine entre l'entrée et la sortie :

- une vidéo verticale 1080×1920, 30 fps, 45 à 90 s, voix off + sous-titres + musique + bruitages ;
- des variantes (autres hooks, autres formats) ;
- tous les fichiers sources (SVG, storyboard JSON, SRT) pour retouche manuelle.

Le style doit être **reconnaissable comme du papier découpé** (matière, ombres entre couches, bords irréguliers), avec **une image pertinente pour chaque phrase**.

## 2. Entrées

| Entrée | Format | Remarque |
|---|---|---|
| Brief marque | `brand.json` : nom, produit, public, ton, claims autorisés/interdits, offre, CTA | Un fichier par marque, réutilisé à chaque vidéo |
| Charte | palette (hex), polices, logo SVG, packaging produit en SVG | Le packaging produit est fourni ou vectorisé à partir d'un packshot |
| Script | texte brut (`script.txt`) | Obligatoire, voir section 4.1 |
| Voix | identifiant ElevenLabs + réglages | Fichier fourni : voix « Marion » (PVC), 136,7 s. Le nom indique vitesse 1.2, stabilité 0.30, similarité 0.75 : à vérifier dans ElevenLabs |
| Durée cible, format | secondes, 9:16 / 1:1 / 4:5 | |

Le script texte est nécessaire : l'agent doit pouvoir le lire et le découper. L'audio seul n'est pas exploitable sans transcription.

## 3. Sorties

- `final_9x16.mp4` (H.264, AAC, 1080×1920, 30 fps, -14 LUFS) + `final_1x1.mp4`, `final_4x5.mp4` en option ;
- `storyboard.json` (plans, timings, métaphores, composants utilisés) ;
- `scenes/*.svg` (une scène = un SVG autonome) ;
- `subtitles.srt` ;
- `thumbnail.png` (1er plan fort) ;
- `qa_report.json` (contrôles automatiques et verdict visuel de chaque plan).

## 4. Architecture du pipeline

```
brief + script
   │
   ▼
[1 Voix]  ElevenLabs TTS "with timestamps" ──► voice.mp3 + timings mot par mot
   │
   ▼
[2 Découpage]  script ──► beats (1 phrase ou 1 idée = 1 plan, 1,5 à 3,5 s)
   │
   ▼
[3 Storyboard]  LLM : pour chaque beat → métaphore visuelle + type de plan + rôle couleur
   │
   ▼
[4 Scènes SVG]  LLM assemble des COMPOSANTS de la bibliothèque (pas de dessin from scratch)
   │
   ▼
[5 Look papier]  moteur de filtres SVG : texture kraft, ombres par couche, bords irréguliers
   │
   ▼
[6 Animation]  timeline GSAP : entrées, parallaxe, caméra, transitions, calée sur les timings
   │
   ▼
[7 Rendu]  Chromium headless (Playwright) : seek(t) → capture image par image → ffmpeg
   │
   ▼
[8 Audio]  voix + musique (ducking) + bruitages papier, normalisation
   │
   ▼
[9 QA]  contrôles automatiques + critique visuelle par LLM → corrections → nouveau rendu (max N tours)
   │
   ▼
sorties
```

### 4.1 Voix et timings (étape 1)

- Appel ElevenLabs `text-to-speech/{voice_id}/with-timestamps` : renvoie l'audio **et** l'alignement caractère par caractère. On en déduit le début et la fin de chaque mot, ce qui évite toute transcription.
- La durée audio impose la durée de chaque plan : le montage suit la voix, jamais l'inverse.
- Si le script est trop long pour la durée cible, l'agent propose une coupe plutôt que d'accélérer la voix au-delà du réglage validé.

### 4.2 Découpage et storyboard (étapes 2 et 3)

Règles apprises de la vidéo de référence :

1. **Une phrase (ou une idée) = un plan = un objet principal.**
2. Cadence de coupe : 1,5 à 3,5 s par plan, en moyenne ~2,5 s. Un plan de plus de 4 s doit contenir une animation interne.
3. Quatre familles de plans, alternées :
   - **Personnage en situation** (figure sans visage, décor récurrent) ;
   - **Gros plan macro** (visage, peau, objet) ;
   - **Métaphore mécanique** (engrenage, jauge, machine, balance) ;
   - **Panneau-étiquette** (nom + dosage d'un ingrédient, en carton, suspendu à une ficelle).
4. **Structure type** : hook émotionnel (0–10 s) → erreurs courantes (10–30 s) → explication / le « pourquoi » (30–50 s) → solution et ingrédients (50–70 s) → produit tardif, preuve, garantie, offre, CTA (70–fin).
5. Le produit n'apparaît pas avant ~75 % de la durée, sauf consigne contraire.
6. Pour chaque beat, le LLM doit remplir : `phrase`, `idée_clé`, `objet_visuel`, `métaphore`, `famille_de_plan`, `rôle_couleur` (problème / solution / neutre / accent), `mouvement_caméra`, `transition_sortante`.
7. Un dictionnaire de **métaphores validées** (voir 4.3) est consulté d'abord ; le LLM n'invente une métaphore que s'il n'y en a pas.

### 4.3 Bibliothèque de composants SVG (étape 4) — le cœur du projet

La qualité vient de cette bibliothèque, pas du prompt. Le LLM **assemble et paramètre** des composants, il ne dessine pas chaque forme librement.

- **Primitives papier** : `paperLayer(path, couleur, épaisseur)`, `tornEdge(path, rugosité, seed)`, `stack(n couches)`, `cutout(forme)`, `tape`, `string`, `hangingSign(texte)`.
- **Personnage** : figure sans visage paramétrable (corps, carnation, cheveux, t-shirt, pantalon, pose parmi ~15 poses, bras articulés). Même personnage, même décor d'un plan à l'autre.
- **Décors** : salle de bain (carrelage, miroir, meuble, serviette), salle de classe, cuisine, fond kraft nu.
- **Accessoires** : tube, pot, gélule, sachet, balance, calendrier, mouchoir, portefeuille, bouclier, loupe, engrenage, jauge, entonnoir, goutte, feuille, cristal, cailloux, haltère, étiquette de prix.
- **Pictogrammes** : coche verte, croix rouge, point d'interrogation, flèches, « + », symboles.
- **Anatomie / science** : coupe de peau et follicule en couches, molécule, cellule, courbe.
- **Produit** : le packaging de la marque en SVG (face, 3/4 en option), posé sur le fond kraft avec ombre portée cohérente.
- **Texte dans la scène** : police manuscrite et police tampon, avec effet « imprimé sur carton déchiré ».

Chaque composant est livré avec : un `id`, des paramètres typés, un point d'ancrage, des points d'animation nommés (ex. `gear.rotate`, `pill.pop`), et 1 à 3 exemples d'usage. Cible de départ : **80 composants**, enrichie à chaque vidéo (l'agent a le droit d'en proposer, mais un composant n'entre dans la bibliothèque qu'après validation visuelle).

### 4.4 Moteur de rendu « look papier » (étape 5)

Reproduire en vectoriel ce qui fait la qualité de la référence :

- **Fond kraft** : `feTurbulence` (bruit basse fréquence) + fibres (traits fins aléatoires à `seed` fixe) + grain léger. Pas de couleur plate.
- **Ombres par couche** : chaque couche reçoit une ombre portée dont l'offset et le flou dépendent de sa hauteur (z). C'est ce qui donne la sensation de papier empilé.
- **Bords irréguliers** : `feDisplacementMap` légère + chemins à rugosité contrôlée ; liseré légèrement plus clair ou plus foncé sur la tranche (effet d'épaisseur).
- **Lumière** : `feDiffuseLighting` ou dégradé directionnel unique et constant (source en haut à gauche) sur toute la vidéo.
- **Profondeur de champ** : flou progressif sur les couches de premier plan et d'arrière-plan (jamais sur le sujet).
- **Vignettage** et très léger grain global en dernier.
- **Palette** : 5 rôles de couleur fixes par marque (neutre kraft, sombre, problème, solution, accent). Aucune autre couleur n'est autorisée ; le QA le vérifie.
- **Reproductibilité** : tous les bruits sont déterministes (seed par scène), un même fichier donne toujours le même rendu.

### 4.5 Animation (étape 6)

- Moteur : **GSAP** (timeline pilotable par `seek(t)`), sans dépendance à une horloge réelle.
- **Effet stop-motion** : mouvements cadencés à 12 images/s « en doubles » pour l'élément animé, tandis que la caméra reste fluide à 30 fps.
- Vocabulaire d'entrées : pop avec dépassement (objets), glissement avec légère rotation (cartons), déchirure (révélation), chute avec rebond (pièces, gouttes), pousse (gélule → plante), tampon (coche, croix).
- **Caméra** : zoom lent, dérive horizontale, légère parallaxe entre couches. Un mouvement par plan, jamais deux.
- **Transitions** : coupe franche (par défaut), balayage papier, déchirure, morphing de formes entre deux plans proches. Maximum 1 transition « spectaculaire » toutes les 5 coupes.
- Les moments clés (apparition de l'objet principal) tombent **sur le mot concerné** dans les timings ElevenLabs, avec un décalage d'avance de ~100 ms.

### 4.6 Sous-titres

- Mot par mot ou 2 mots maximum, synchronisés aux timings.
- Blanc, très gras, grande taille, contour/ombre léger, sans fond, centrés dans le tiers bas, **hors zones masquées par les interfaces TikTok / Reels / Shorts**.
- Légère animation d'apparition (pop de 80 ms). Emphase en couleur d'accent sur les mots clés (chiffres, ingrédients, offre).
- Contraste lisible sur n'importe quel fond : si le contrôle automatique échoue, l'agent épaissit le contour ou décale le sous-titre.

### 4.7 Rendu (étape 7)

- **Playwright + Chromium headless** (déjà disponible dans l'environnement) charge la page de la timeline ; pour chaque image : `timeline.seek(t)` puis capture. Assemblage avec **ffmpeg**.
- Rendu parallélisé par tranches de plans (workers).
- Risque connu : les filtres SVG sont lourds à 1080×1920. Mesures prévues : texture de fond et ombres statiques calculées une fois par scène puis mises en cache sous forme de calque ; on n'anime que les groupes mobiles ; budget cible ≤ 1 s par image et par worker.
- Alternative envisagée : Remotion. Écartée par défaut parce que sa licence est payante pour une entreprise de plus de 3 personnes ; à reconsidérer si le moteur maison coûte trop cher à maintenir.

### 4.8 Audio (étape 8)

- Piste voix (ElevenLabs) en priorité.
- Musique d'ambiance sans droits ou sous licence, niveau -20 dB sous la voix, ducking automatique.
- **Bruitages papier** calés sur les animations : froissement, pop, tampon, déchirure, glissement. Une bibliothèque de ~30 sons, déclenchés par les points d'animation nommés.
- Normalisation à -14 LUFS, pic -1 dBTP.

### 4.9 Contrôle qualité automatique (étape 9)

Contrôles **déterministes** (bloquants) :

- durée totale = durée audio ± 0,3 s ;
- cadence de coupe dans la fourchette, aucun plan > 4 s sans animation interne ;
- aucun texte ou élément clé hors zone de sécurité ; aucun texte tronqué ;
- seules les couleurs de la palette sont utilisées ;
- contraste des sous-titres suffisant ;
- polices embarquées présentes ; aucun appel réseau pendant le rendu ;
- le produit apparaît dans la fenêtre prévue ; le CTA est présent à la fin.

Contrôles **par vision LLM** (une image-clé par plan), avec grille notée de 0 à 5 :

- **pertinence** : l'image illustre-t-elle bien la phrase prononcée ? (critère n°1 de la référence)
- lisibilité en 1 seconde (un seul point focal) ;
- cohérence avec les plans voisins (personnage, décor, lumière) ;
- rendu « papier » crédible ;
- absence de formes ambiguës ou de défauts de dessin.

Un plan sous 4/5 sur la pertinence ou la lisibilité est **régénéré** (max 3 tours par plan), puis signalé dans `qa_report.json` s'il échoue encore. Aucune sortie ne part avec un plan en échec non signalé.

### 4.10 Conformité des allégations

Pour les compléments, la cosmétique et la santé : un contrôle sépare le script en affirmations et les compare à `brand.json` (allégations autorisées / interdites). Une allégation de type « guérit », « traite », « garantit » ou chiffrée sans source est bloquée et réécrite ou remontée à l'humain. L'agent ne publie rien lui-même : il livre des fichiers.

## 5. Choix techniques

| Domaine | Choix |
|---|---|
| Langage | TypeScript (Node 22) |
| Orchestration de l'agent | Claude Agent SDK, un sous-agent par étape (storyboard, scènes, QA) |
| Modèle | le plus capable pour le storyboard et la QA visuelle ; un modèle plus rapide pour l'assemblage des scènes |
| Animation | GSAP (timeline) |
| Rendu | Playwright (Chromium) + ffmpeg |
| Voix | API ElevenLabs avec timestamps |
| Stockage | fichiers locaux, un dossier par projet vidéo, tout versionné dans Git |
| Reproductibilité | seeds fixes, versions verrouillées, aucun appel réseau pendant le rendu |

Arborescence cible :

```
/brands/<marque>/brand.json, palette.json, logo.svg, product.svg
/library/components/*.svg + components.json
/library/metaphors.json
/library/sfx/*.wav
/engine/ (filtres papier, timeline, rendu, audio, QA)
/projects/<video>/ (script.txt, voice.mp3, storyboard.json, scenes/, out/)
```

## 6. Critères d'acceptation

Une vidéo est acceptée si :

1. Les contrôles déterministes passent à 100 %.
2. Score moyen de pertinence ≥ 4,3/5 sur tous les plans et aucun plan < 4.
3. Test visuel en aveugle : pour 10 plans tirés au hasard, une personne qui ne connaît pas le script retrouve l'idée de la phrase dans au moins 8 cas.
4. Temps de production d'une vidéo de 60 s : moins de 45 min de bout en bout, sans intervention.
5. Même entrée, même rendu (reproductibilité à l'octet près pour la partie visuelle).
6. Sur 5 vidéos consécutives, au moins 4 sont jugées « publiables » par toi sans retouche de plus de 5 min.

## 7. Limites assumées

- Le vectoriel ne reproduira **pas à l'identique** la matière photoréaliste de la référence (qui semble générée par IA). On vise la même **lisibilité, la même cohérence et la même sensation de papier empilé**, avec un rendu plus « graphique » et plus propre. C'est un compromis voulu : en échange, tout est modifiable, cohérent d'une vidéo à l'autre et gratuit à régénérer.
- La qualité initiale dépend de la bibliothèque. Les 3 à 5 premières vidéos serviront à l'enrichir, avec ta validation sur chaque nouveau composant.
- Le packaging produit doit être fourni en SVG (ou vectorisé depuis un packshot) ; un sachet dessiné à la volée par le LLM ne sera pas fidèle à la marque.
- Les visages restent volontairement absents (c'est aussi le style de la référence).

## 8. Plan de réalisation

| Phase | Contenu | Résultat vérifiable |
|---|---|---|
| 0 | Fonds de style : filtre kraft + 10 composants + 1 scène de référence | Une scène fixe qui « fait papier » à côté de la référence |
| 1 | Pipeline minimal : voix + timings → 6 plans → rendu mp4 | Vidéo de 15 s de bout en bout |
| 2 | Bibliothèque à 80 composants, moteur d'animation, sous-titres, audio | Vidéo de 60–90 s complète |
| 3 | Storyboard par LLM + QA automatique et corrections | Vidéo générée sans intervention, rapport QA |
| 4 | Variantes (3 hooks, 3 formats), traitement par lots, conformité des allégations | 3 vidéos en parallèle depuis un seul brief |

## 9. Ce qu'il me faut de ta part

1. **Pour quelle marque** (Nina Costa, WATR, MELA SKIN, autre) et le `brand.json` : palette, polices, allégations autorisées.
2. **Le script en texte** : je n'ai pas pu transcrire le MP3 depuis ce conteneur (téléchargement du modèle bloqué).
3. **Le packaging** : SVG ou packshot propre à vectoriser.
4. **Une clé API ElevenLabs** dans l'environnement du projet (et la confirmation des réglages de la voix Marion).
5. **Les droits de musique** : fournir une piste ou valider une source libre.
