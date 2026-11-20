"""
Recorte del presentador (matte) para efectos «detrás de la cabeza».
Crea un WebM VP9 con alfa del mismo tamaño y fps que el video, solo con la persona.

Uso (desde video/):
    python herramientas/recorte.py publico/medios/avatar.mp4 publico/medios/avatar-recorte.webm --desde 0 --hasta 6 --modelo ruta/selfie_multiclass_256x256.tflite
"""
import argparse
import json
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("video")
    ap.add_argument("salida")
    ap.add_argument("--desde", type=float, default=0)
    ap.add_argument("--hasta", type=float, required=True)
    ap.add_argument("--modelo", required=True)
    a = ap.parse_args()

    import cv2
    import mediapipe as mp
    from mediapipe.tasks import python as mpt
    from mediapipe.tasks.python import vision

    info = json.loads(subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height,r_frame_rate", "-of", "json", a.video], capture_output=True, check=True).stdout)["streams"][0]
    w, h = info["width"], info["height"]
    fps = info["r_frame_rate"]
    crudo = subprocess.run(["ffmpeg", "-v", "error", "-ss", str(a.desde), "-to", str(a.hasta), "-i", a.video, "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], capture_output=True, check=True).stdout
    n = len(crudo) // (w * h * 3)
    frames = np.frombuffer(crudo, np.uint8)[: n * w * h * 3].reshape(n, h, w, 3)

    opciones = vision.ImageSegmenterOptions(base_options=mpt.BaseOptions(model_asset_path=a.modelo), output_category_mask=True, running_mode=vision.RunningMode.IMAGE)
    seg = vision.ImageSegmenter.create_from_options(opciones)
    with tempfile.TemporaryDirectory() as tmp:
        prev = None
        for i, fr in enumerate(frames):
            res = seg.segment(mp.Image(image_format=mp.ImageFormat.SRGB, data=np.ascontiguousarray(fr)))
            cat = res.category_mask.numpy_view()
            m = (cat != 0).astype(np.float32)
            m = cv2.resize(m, (w, h), interpolation=cv2.INTER_LINEAR)
            m = cv2.GaussianBlur(m, (0, 0), 2.2)
            if prev is not None:
                m = 0.65 * m + 0.35 * prev  # suaviza el temblor entre fotogramas
            prev = m
            a8 = np.clip((m - 0.35) / 0.4, 0, 1)
            rgba = np.dstack([fr, (a8 * 255).astype(np.uint8)])
            cv2.imwrite(f"{tmp}/f{i:05d}.png", cv2.cvtColor(rgba, cv2.COLOR_RGBA2BGRA))
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-framerate", fps, "-i", f"{tmp}/f%05d.png", "-c:v", "libvpx-vp9", "-pix_fmt", "yuva420p", "-b:v", "6M", "-auto-alt-ref", "0", a.salida], check=True)
    print(f"{n} fotogramas · {a.salida}")


if __name__ == "__main__":
    sys.exit(main())
