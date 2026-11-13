"""
Transcribe la voz de un video (avatar de HeyGen) y guarda los subtítulos con
el tiempo de cada palabra, en el formato Caption de @remotion/captions:

    [{"text": " Hola", "startMs": 0, "endMs": 320, "timestampMs": 160, "confidence": 0.98}, ...]

Uso (desde video/):
    python herramientas/transcribir.py publico/medios/avatar.mp4 src/lf/videos/subtitulos/mi-video.json

Opciones:
    --modelo medium    (small es más rápido; medium acierta más en español)
    --guion guion.txt  si das el guion, se avisa de las palabras que no coinciden

Necesita: pip install faster-whisper (la primera vez descarga el modelo).
La transcripción automática se revisa siempre a mano antes de publicar.
"""
import argparse
import json
import re
import sys
import unicodedata
from pathlib import Path


def normalizar(p: str) -> str:
    p = unicodedata.normalize("NFD", p.lower())
    p = "".join(c for c in p if unicodedata.category(c) != "Mn")
    return re.sub(r"[^a-z0-9ñ]", "", p)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("video")
    ap.add_argument("salida")
    ap.add_argument("--modelo", default="medium")
    ap.add_argument("--idioma", default="es")
    ap.add_argument("--guion", default=None)
    a = ap.parse_args()

    import subprocess

    import numpy as np
    from faster_whisper import WhisperModel

    # El audio se decodifica con ffmpeg (16 kHz, mono) en lugar de con PyAV:
    # evita incompatibilidades de versiones y funciona igual en Windows.
    crudo = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", a.video, "-ac", "1", "-ar", "16000", "-f", "f32le", "-"],
        check=True,
        capture_output=True,
    ).stdout
    audio = np.frombuffer(crudo, dtype=np.float32)

    modelo = WhisperModel(a.modelo, device="cpu", compute_type="int8")
    segmentos, info = modelo.transcribe(
        audio,
        language=a.idioma,
        word_timestamps=True,
        vad_filter=True,
        beam_size=5,
    )
    palabras = []
    for s in segmentos:
        for w in s.words or []:
            ini, fin = round(w.start * 1000), round(w.end * 1000)
            palabras.append(
                {
                    "text": w.word if w.word.startswith(" ") else " " + w.word,
                    "startMs": ini,
                    "endMs": fin,
                    "timestampMs": round((ini + fin) / 2),
                    "confidence": round(float(w.probability), 3),
                }
            )
    if palabras:
        palabras[0]["text"] = palabras[0]["text"].lstrip()

    Path(a.salida).parent.mkdir(parents=True, exist_ok=True)
    Path(a.salida).write_text(json.dumps(palabras, ensure_ascii=False, indent=1), encoding="utf-8")
    texto = "".join(p["text"] for p in palabras).strip()
    print(f"{len(palabras)} palabras · {info.duration:.2f} s · {a.salida}")
    print(texto)

    dudosas = [p for p in palabras if p["confidence"] < 0.6]
    if dudosas:
        print("\nPalabras con poca confianza (revísalas):")
        for p in dudosas:
            print(f"  {p['startMs']/1000:6.2f} s  {p['text'].strip()}  ({p['confidence']})")

    if a.guion:
        g = [normalizar(x) for x in Path(a.guion).read_text(encoding="utf-8").split()]
        g = [x for x in g if x]
        t = [normalizar(p["text"]) for p in palabras]
        faltan = sorted(set(g) - set(t))
        if faltan:
            print("\nPalabras del guion que no aparecen en la transcripción:", ", ".join(faltan))


if __name__ == "__main__":
    sys.exit(main())
