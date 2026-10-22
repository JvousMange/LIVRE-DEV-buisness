"""Moteurs TTS locaux (sherpa-onnx) : Piper (VITS) et Kokoro. Retourne (samples float32, sr)."""
import numpy as np, sherpa_onnx

def piper(model_dir, name, sid=0, speed=1.0):
    cfg = sherpa_onnx.OfflineTtsConfig(model=sherpa_onnx.OfflineTtsModelConfig(vits=sherpa_onnx.OfflineTtsVitsModelConfig(
        model=f"{model_dir}/{name}.onnx", tokens=f"{model_dir}/tokens.txt", data_dir=f"{model_dir}/espeak-ng-data"), num_threads=4))
    tts = sherpa_onnx.OfflineTts(cfg)
    return lambda text: _run(tts, text, sid, speed)

def kokoro(model_dir, sid=30, speed=1.0, lang="fr"):
    cfg = sherpa_onnx.OfflineTtsConfig(model=sherpa_onnx.OfflineTtsModelConfig(kokoro=sherpa_onnx.OfflineTtsKokoroModelConfig(
        model=f"{model_dir}/model.onnx", voices=f"{model_dir}/voices.bin", tokens=f"{model_dir}/tokens.txt",
        data_dir=f"{model_dir}/espeak-ng-data", dict_dir=f"{model_dir}/dict", lexicon=f"{model_dir}/lexicon-us-en.txt,{model_dir}/lexicon-zh.txt", lang=lang), num_threads=4))
    tts = sherpa_onnx.OfflineTts(cfg)
    return lambda text: _run(tts, text, sid, speed)

def _run(tts, text, sid, speed):
    a = tts.generate(text, sid=sid, speed=speed)
    return np.array(a.samples, dtype=np.float32), a.sample_rate
