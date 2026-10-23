# MELA SKIN — système « hook interchangeable + corps figé »

## Principe
Une seule pub, deux blocs :

| Bloc | Rôle | Durée | Statut |
|---|---|---|---|
| **Hook** (1 phrase + pont) | Arrêter le scroll **et** parler à une audience précise | 5 à 8 s | **Change** (6 variantes) |
| **Pont** | « Alors ta peau fabrique trop de pigment. » — raccord commun | 2 s | Identique |
| **Corps** | 5 signes → mécanisme → actifs → preuve → garantie → offre | ~87 s | **Identique, aucune modification** |

Le corps n'est jamais retouché : voix, images, sous-titres, bruitages, offre. Quand les résultats diffèrent, la seule cause possible est le hook. C'est ce qui rend le test lisible.

## Les 6 hooks

| ID | Nom | Audience visée | Hook (voix off) | Visuel |
|---|---|---|---|---|
| **A** | post-acné | Marques après boutons | « Tes boutons partent, mais tu as toujours des marques noires qui gâchent tout ? » | Boutons qui s'envolent, les marques restent, honte devant le miroir |
| **B** | grossesse-mélasma | Masque de grossesse / mélasma | « Depuis ta grossesse, ce masque foncé sur tes joues ne part pas ? » | Silhouette enceinte, taches symétriques sur les joues |
| **C** | rasage-épilation | Marques après rasage / épilation | « Après le rasage ou l'épilation, tes marques sont plus foncées que ta peau ? » | Jambe et rasoir, cire arrachée, comparaison de teintes |
| **D** | fond-de-teint | Teint non uniforme, maquillage « cache-taches » | « Tu mets du fond de teint juste pour cacher tes taches ? » | Éponge qui tamponne, les taches transparaissent |
| **E** | peau-mate | Peaux mates/foncées déçues par les soins classiques | « Peau mate ou foncée, et aucun soin ne marche sur tes taches ? » | Affiches de visages clairs, produits barrés |
| **F** | tout-essayé | Déjà tout essayé | « Citron, gommage, vitamine C, tu as tout essayé et tes taches sont toujours là ? » | Produits en pluie, croix rouges, tache qui s'agrandit |

Chaque hook se termine par le même pont. Les angles couvrent les 4 déclencheurs d'achat du produit (post-acné, grossesse, rasage, teint non uniforme) plus 2 angles transversaux (appartenance « peau mate » et frustration « j'ai tout essayé »).

## Nommage
`MELA_explicatif_hook{ID}_{nom}_{JJMM}_v1.mp4` — par exemple `MELA_explicatif_hookB_grossesse-melasma_2310_v1.mp4`.
Une nouvelle version du hook devient `v2`. Le corps ne change pas de version tant qu'il n'est pas testé à son tour.

## Plan de test sur Meta
1. **Une campagne de test, un seul ensemble de publicités** (public large : femmes, 22–45 ans, pays cible). Le hook est le seul filtre d'audience : c'est la vidéo qui sélectionne qui s'arrête.
2. **6 publicités** (une par hook), même budget, même texte principal, même titre, même bouton, même page d'arrivée.
3. **Laisser tourner** jusqu'à avoir assez de données par hook (ordre de grandeur : quelques milliers d'impressions chacun avant de décider, davantage pour juger le coût par achat).
4. **Indicateurs, dans l'ordre :**
   - **Taux d'accroche** = vues de 3 s ÷ impressions → mesure le hook seul.
   - **Taux de rétention** = ThruPlay ÷ vues de 3 s → mesure la tenue du corps (devrait être proche d'un hook à l'autre).
   - **CTR sur lien**, puis **coût par ajout au panier et par achat** → mesure ce qui convertit.
5. **Décision :** garder les 1 à 2 hooks qui ont le meilleur taux d'accroche **et** un coût par achat correct. Un bon taux d'accroche avec un mauvais coût par achat veut dire que le hook attire un public qui ne convertit pas.
6. **Itération :** sur le hook gagnant, créer 3 reformulations du même angle (autre première phrase, autre premier visuel), toujours avec le même corps.
7. **Ensuite seulement**, tester le corps : même hook gagnant, deux versions de corps (par exemple l'offre ou la garantie). Une seule variable à la fois.

Ces résultats sont des mesures sur ton compte, pas une garantie : un hook qui gagne sur un public peut perdre sur un autre.

## Points de conformité à garder
- Aucun hook ne promet un résultat chiffré ni une guérison. Les hooks identifient une situation (grossesse, rasage…), ils ne disent pas que le produit la traite.
- La **garantie 90 jours** et l'offre **« 2 achetés, 1 offert »** sont dans le corps : à confirmer qu'elles sont réelles et actives avant de diffuser.
- Les chiffres de preuve (94 % le recommandent) viennent de ton test consommateur : garde la mention dans le texte de la publicité.

## Ajouter un nouveau hook
1. Ajouter une entrée dans `hooks.json` (id, nom, audience, phrase + balise d'émotion).
2. Ajouter ses plans dans `web/hooks.js` : réutiliser un plan existant avec `reuse(...)`, ou en dessiner un nouveau.
3. Lancer `ELEVENLABS_API_KEY=… tools/build_hook.sh <ID>` : voix du hook générée dans ElevenLabs avec ta voix Marion, collée au corps figé (`body/`), puis rendu complet.
