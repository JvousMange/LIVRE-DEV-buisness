"""Génère VOIX_ELEVENLABS.md depuis script.json : texte à coller, intention par phrase, réglages."""
import json
sc = json.load(open("script.json"))
D = {  # (id, phrase) -> (tag v3, intention)
 ("hook",0):("[curious]","Complicité fatiguée, comme à une amie. Accent sur « toujours » et « gâchent ». Montée légère sur « tout ? »."),
 ("hook",1):("","Révélation calme, la voix redescend. Léger sourire de celle qui sait."),
 ("intro",0):("[excited]","Annonce énergique. « Cinq » net, « hyperpigmentation » détaché."),
 ("s1",0):("","« Un, » bien marqué. Constat, rythme régulier. Accent sur « des mois »."),
 ("s2",0):("","« Deux, » net. Accent sur « noires » puis « plus foncées »."),
 ("s3",0):("","« Trois, » net. Énumération qui accélère : « le rasage, l'épilation, les frottements »."),
 ("s4",0):("[sighs]","« Quatre, » net. « c'est encore pire » : soupir, la voix retombe."),
 ("s5",0):("[exasperated]","Lassitude : « aucun gommage ni crème éclat ne change quoi que ce soit »."),
 ("s5",1):("","Pause avant « Normal, ». Ton plus bas et sérieux, indignation contenue sur « peaux claires »."),
 ("bascule",0):("[curious]","Question complice, petite montée, silence après."),
 ("bascule",1):("","Posé, pédagogue. « en dessous » appuyé."),
 ("bascule",2):("[optimistic]","L'énergie remonte : on peut agir."),
 ("meca",0):("","Ferme et rassurant. Accent sur « pas »."),
 ("meca",1):("","Pédagogue fluide. Léger ralenti sur « enzyme », « tirozinase » bien articulé."),
 ("a1",0):("","Assuré, expert. Chiffre « dix pour cent » net."),
 ("a1",1):("","Sec, net, plus court."),
 ("a2",0):("","Enchaînement fluide. Accent sur « celles qui reviennent »."),
 ("a3",0):("","Rassurant, voix chaude. « cinq pour cent » net."),
 ("a3",1):("","Constat avec un petit sous-entendu : peu de soins font ça."),
 ("conso",0):("","Neutre, lancement."),
 ("conso",1):("[excited]","L'énergie monte. Sourire sur « les réunit tous », « tous » qui retombe positif."),
 ("preuve",0):("","Sincère, posé. Chiffre articulé, pas de vente."),
 ("garantie",0):("[playfully]","Taquin, sourire."),
 ("garantie",1):("","Très court, souriant, avec une respiration avant."),
 ("garantie",2):("","Confiant, posé. « quatre-vingt-dix jours » articulé."),
 ("garantie",3):("","Doux et direct. « rien » posé."),
 ("garantie",4):("[relaxed]","Léger, détendu."),
 ("offre",0):("[excited]","Enthousiasme maîtrisé. Accent sur « un offert », sourire dans la voix."),
}
out = ["# Voix off ElevenLabs — MELA SKIN\n",
"## Réglages conseillés",
"- **Modèle** : *Eleven v3* si tu l'as (il comprend les balises d'émotion entre crochets), sinon *Multilingual v2* (ignore alors les balises `[ ]`).",
"- **Voix** : dans la bibliothèque, filtre *Français*, voix féminine, usage *conversationnel / réseaux sociaux*. Teste 3 voix sur le premier bloc, garde celle qui sonne comme une amie qui parle, pas une speakerine.",
"- **Stabilité** : 30 à 40 % (plus bas = plus d'intention). **Similarité** : 70 à 80 %. **Style** : 25 à 45 % (v2). **Speaker boost** : activé. **Vitesse : 1,00** (pas 1,20 : c'est ce qui rendait la voix trop rapide).",
"- **Génère bloc par bloc** (16 blocs ci-dessous), 2 à 3 prises par bloc, garde la meilleure. C'est plus long mais c'est ce qui donne de l'intention.",
"- Les nombres sont écrits en lettres, et la marque s'écrit « Méla Skine » : ne les change pas.\n",
"## Comment me les envoyer",
"Joins ici **soit un seul fichier** avec toute la voix off, **soit 16 fichiers** (un par bloc), nommés `01`, `02`… dans l'ordre. Laisse au moins 0,3 s de silence entre les phrases. Je m'occupe de l'alignement avec les images, des sous-titres et du mixage.\n",
"## Les 16 blocs\n"]
for i, b in enumerate(sc["beats"], 1):
    out.append(f"### {i:02d} · {b['id']}")
    tagged = []
    for si, s in enumerate(b["sentences"]):
        tag, d = D[(b["id"], si)]
        tagged.append((tag + " " if tag else "") + s["say"])
        out.append(f"- *Intention* : {d}")
    out.append("\n```\n" + " ".join(tagged) + "\n```\n")
out.append("## Version sans balises (Multilingual v2)\n```")
for b in sc["beats"]: out.append(" ".join(s["say"] for s in b["sentences"]))
out.append("```\n")
open("VOIX_ELEVENLABS.md", "w").write("\n".join(out))
open("voix_elevenlabs_UN_SEUL_BLOC.txt", "w").write("\n\n".join(" ".join(((D[(b["id"], si)][0] + " ") if D[(b["id"], si)][0] else "") + s_["say"] for si, s_ in enumerate(b["sentences"])) for b in sc["beats"]) + "\n")
print("ok")
