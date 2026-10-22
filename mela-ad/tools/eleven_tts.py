"""Génère la voix off via l'API ElevenLabs (avec horodatage des caractères). Clé lue dans ELEVENLABS_API_KEY (jamais affichée).
Usage : eleven_tts.py <texte.txt> <sortie.mp3> [--model=eleven_v4] [--speed=1.0] [--stability=0.3] [--voice=<id>]"""
import os, sys, json, base64, urllib.request, urllib.error
txt, out = sys.argv[1], sys.argv[2]
o = dict(a.lstrip("-").split("=", 1) for a in sys.argv[3:])
voice = o.get("voice", "Pipj99NMS7t8dQEzyxgB")  # Marion
body = {"text": open(txt).read().strip(), "model_id": o.get("model", "eleven_v4"),
        "voice_settings": {"stability": float(o.get("stability", .3)), "similarity_boost": float(o.get("similarity", .75)), "style": float(o.get("style", 0)), "use_speaker_boost": True, "speed": float(o.get("speed", 1.0))}}
req = urllib.request.Request(f"https://api.elevenlabs.io/v1/text-to-speech/{voice}/with-timestamps?output_format=mp3_44100_128", json.dumps(body).encode(),
                             {"xi-api-key": os.environ["ELEVENLABS_API_KEY"], "Content-Type": "application/json"})
try:
    r = json.load(urllib.request.urlopen(req, timeout=240))
except urllib.error.HTTPError as e:
    sys.exit(f"HTTP {e.code}: {e.read().decode()[:400]}")
open(out, "wb").write(base64.b64decode(r["audio_base64"]))
json.dump(r.get("alignment"), open(out + ".alignment.json", "w"))
print("ok", out, len(base64.b64decode(r["audio_base64"])) // 1024, "Ko")
