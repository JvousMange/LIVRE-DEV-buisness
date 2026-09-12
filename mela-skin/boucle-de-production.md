# MELA SKIN · La boucle de production

Deux documents existent déjà : `broll-prompts-kie.md` dit **quoi générer**, `systeme-split-test.md` dit **quoi tester**. Celui-ci dit **comment tenir la cadence** — combien de clips, dans quel ordre, combien de temps par jour, et où l'automatisation s'arrête vraiment.

---

## 0. Ce que « automatisé » veut dire, honnêtement

La chaîne a quatre maillons. Un seul est réellement automatique.

| Maillon | Automatisable | Qui fait le travail |
|---|---|---|
| **Écrire les prompts** | fait une fois pour toutes | le pack B-roll — c'est déjà derrière toi |
| **Générer les clips** | oui, en lot | kie.ai, sans toi, pendant que tu dors |
| **Trier les sorties** | non | toi, 10 secondes par clip |
| **Monter la créa** | non | toi, 10-15 min par créa |
| **Publier et suivre** | oui, programmable | un planificateur + ta feuille de suivi |

Personne ne vend ça comme ça, mais c'est le vrai tableau : **le goulot d'étranglement n'est pas la génération, c'est le tri et le montage.** Générer 30 clips par jour ne sert à rien si tu ne peux en monter que 3. Dimensionne toute ta production sur ton temps de montage, jamais sur tes crédits.

Le corollaire est encourageant : la seule chose qui augmente ton volume est de **raccourcir le montage**, donc de figer un template. C'est pour ça que `systeme-split-test.md` n'autorise que trois structures.

---

## 1. Le calcul de volume

Pars de ta cadence de publication et remonte. Exemple pour **3 posts par jour**, soit 21 créas par semaine :

| Étape | Calcul | Résultat |
|---|---|---|
| Créas par semaine | objectif | 21 |
| Plans par créa | structures A/B/C | 6 |
| Emplacements à remplir | 21 × 6 | 126 |
| Réutilisation maximale d'un clip | 3 créas, jamais plus | ÷ 3 |
| **Clips distincts nécessaires** | 126 ÷ 3 | **42 / semaine** |
| Taux de rebut en vidéo IA | compte 1 clip gardé sur 2 à 3 | × 2,5 |
| **Générations à lancer** | 42 × 2,5 | **~105 / semaine, soit 15 / jour** |

Le budget se déduit : `105 × prix_du_clip_chez_toi`. Note ce prix une fois dans ta feuille de suivi — c'est le seul chiffre qui décide si la cadence est tenable.

Deux leviers si le compte ne tombe pas juste : **baisser à 2 posts/jour** (le plus sain au démarrage), ou **monter la réutilisation à 4** en variant le son et le texte pour que la répétition ne se voie pas. Ne touche jamais au taux de rebut en gardant des clips moyens : un clip raté publié coûte plus cher qu'un clip jeté.

---

## 2. Semaine 0 — constituer le stock

Génère les 43 plans du pack **dans l'ordre de la section 10** (transitions et texture d'abord, persona en dernier). Une version de chaque, contrôle immédiat selon la section 11, et tu as ta base.

Ce que tu dois avoir à la fin de la semaine 0 :

- un dossier par groupe : `HOOK/`, `DOUL/`, `MEC/`, `PROD/`, `TEX/`, `RIT/`, `RES/`, `OFF/`, `TRA/`
- chaque fichier nommé `MELA_BROLL_[CODE]_[P4|P5|P6]_V1.mp4`
- **PROD-05 généré 3 ou 4 fois** — c'est le plan à trois mains, celui qui rate le plus
- un clip témoin validé avant de lancer le reste : PROD-01, comme dit le pack

Tant que le stock de base n'est pas constitué, ne publie rien. Poster avec quatre clips en boucle est la façon la plus rapide de brûler un compte neuf.

---

## 3. La journée type — 90 minutes

L'ordre compte : tu lances les générations **en premier** pour qu'elles tournent pendant que tu montes.

| Temps | Ce que tu fais |
|---|---|
| 0-10 min | Lancer les 15 générations du lendemain, en lot |
| 10-25 min | Trier les sorties de la veille — 10 s par clip, grille de la section 11 du pack, **regarde la dernière seconde en premier** |
| 25-70 min | Monter les 3 créas du jour à partir des structures figées |
| 70-85 min | Programmer les publications, remplir 3 lignes de la feuille de suivi |
| 85-90 min | Relever les chiffres à 48 h des posts d'avant-hier |

Ce qui fait dérailler cette journée, dans l'ordre de fréquence : rouvrir un prompt pour « l'améliorer », regénérer un clip correct parce qu'un autre serait plus joli, et changer de structure en cours de montage. Les trois coûtent une heure et zéro vue supplémentaire.

---

## 4. Le montage — ce qui reste à la main

Sept règles, et rien d'autre à décider :

1. **9:16, 1080p, 30 fps.** Le format est un réglage, pas un choix créatif.
2. **Le hook texte apparaît avant la première seconde.** Pas à 1,2 s. C'est la règle qui déplace le plus de vues.
3. **Une police, deux tailles, sur toute la marque.** Le texte lisible sur fond clair comme sur fond sombre : contour ou bandeau, jamais du blanc nu.
4. **Le son se pose en dernier**, et tu recales les coupes sur les temps forts. Tous les clips du pack sont générés muets — c'est voulu.
5. **Sous-titres dès qu'il y a une voix**, brûlés dans l'image.
6. **Export sans filigrane.** Un filigrane d'outil gratuit suffit à faire descendre une vidéo.
7. **Coupe la dernière seconde d'un clip qui dérive** plutôt que de le régénérer. Un plan propre sur 4 s et bancal sur la 5e se sauve au montage.

Fais-toi un projet template dans ton éditeur avec les trois structures déjà découpées en pistes vides. Le montage passe de 25 minutes à 10.

---

## 5. Publication

**Ne republie jamais le même fichier exporté**, même sur une autre plateforme, même à un mois d'écart. Réexporte — un fichier identique est reconnaissable par empreinte, et c'est le moyen le plus simple de plafonner ta portée sans comprendre pourquoi.

Le reste des réglages de publication — horaires, nombre de comptes, montée en cadence d'un compte neuf — dépend de la plateforme et bouge tout le temps. Ne les prends pas dans un document, y compris celui-ci : teste-les comme tu testes le reste, une variable à la fois, et note le résultat dans la colonne `variable_testee`.

Ce qui est stable, en revanche :

- Un compte neuf ne démarre pas à 3 posts/jour. Monte progressivement.
- Une créa par compte : la même vidéo sur trois comptes le même jour n'est pas de la distribution, c'est de la duplication.
- La description et les hashtags sont une variable comme une autre. Ils ne se changent pas en même temps que le hook.

---

## 6. La boucle hebdomadaire

**Lundi — analyse (45 min).** Tu relis les 21 lignes de la semaine, tu calcules la médiane, tu isoles les outliers à 2×, tu lis les courbes de rétention. Tu décides **une** variable à ouvrir pour la semaine. Tu l'écris en haut de la feuille.

**Mardi à dimanche — production.** La journée type, avec la variable de la semaine et rien d'autre qui bouge.

**En continu — reconstitution du stock.** Chaque clip utilisé trois fois est marqué mort. Sa régénération en V2 entre dans les 15 générations du lendemain. C'est ce flux qui remplace le « ne jamais réutiliser un clip » de la méthode d'origine : tu réutilises, mais tu renouvelles au même rythme.

---

## 7. Les quatre choses qui cassent la boucle

| Symptôme | Cause réelle | Correctif |
|---|---|---|
| Les vues s'effondrent après trois bonnes semaines | fatigue créative : les mêmes clips tournent depuis trop longtemps | vérifier le compteur de réutilisation, régénérer les plans morts |
| Tu produis moins que prévu | le montage a été sous-estimé | baisser la cadence, pas la qualité du tri |
| Un outlier n'est pas reproductible | deux variables ont bougé ensemble | relire la colonne `variable_testee` : elle était vide |
| Tout marche mais rien ne vend | le problème est après le clic | ce n'est pas un problème de créa — regarde la page produit avant de générer un clip de plus |

Le dernier est le plus fréquent et le plus coûteux. Une créa ne peut pas réparer une page qui ne convertit pas ; elle peut seulement y envoyer plus de monde.
