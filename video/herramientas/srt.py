"""
Crea un .srt a partir de los subtítulos con tiempos por palabra (Caption JSON).
Corta al llegar a --max caracteres o en un punto, coma o interrogación.

Uso (desde video/):
    python herramientas/srt.py src/lf/videos/subtitulos/ep03.json out/ep03-subtitles.srt --max 32
"""
import argparse
import json
from pathlib import Path


def ts(ms: int) -> str:
    h, ms = divmod(ms, 3600000)
    m, ms = divmod(ms, 60000)
    s, ms = divmod(ms, 1000)
    return f"{h:02}:{m:02}:{s:02},{ms:03}"


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("entrada")
    ap.add_argument("salida")
    ap.add_argument("--max", type=int, default=32)
    a = ap.parse_args()
    palabras = json.loads(Path(a.entrada).read_text(encoding="utf-8"))
    bloques, actual = [], []
    for p in palabras:
        texto = p["text"].strip()
        largo = len(" ".join(x["text"].strip() for x in actual + [p]))
        if actual and largo > a.max:
            bloques.append(actual)
            actual = []
        actual.append(p)
        if texto[-1:] in ".,?!:;":
            bloques.append(actual)
            actual = []
    if actual:
        bloques.append(actual)
    lineas = []
    for i, b in enumerate(bloques, 1):
        fin = b[-1]["endMs"]
        if i < len(bloques):
            fin = min(fin + 200, bloques[i][0]["startMs"])
        lineas += [str(i), f"{ts(b[0]['startMs'])} --> {ts(fin)}", " ".join(x["text"].strip() for x in b), ""]
    Path(a.salida).write_text("\n".join(lineas), encoding="utf-8")
    print(f"{len(bloques)} subtítulos · {a.salida}")


if __name__ == "__main__":
    main()
