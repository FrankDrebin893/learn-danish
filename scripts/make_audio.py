"""Pre-generate Danish pronunciation audio (web/audio/<rank>.mp3) with Piper (offline, MIT-licensed engine).

Voice: da_DK-talesyntese-medium (trained on the CC0 Norwegian Language Bank dataset), so the audio
is safe to publish. Needs `pip install piper-tts`, ffmpeg on PATH, and the voice files:

    curl -L -o data/da.onnx https://huggingface.co/rhasspy/piper-voices/resolve/main/da/da_DK/talesyntese/medium/da_DK-talesyntese-medium.onnx
    curl -L -o data/da.onnx.json https://huggingface.co/rhasspy/piper-voices/resolve/main/da/da_DK/talesyntese/medium/da_DK-talesyntese-medium.onnx.json

Usage: python scripts/make_audio.py [path/to/voice.onnx]. Existing files are skipped.
"""
import json
import subprocess
import sys
import wave
from io import BytesIO
from pathlib import Path

from piper import PiperVoice

ROOT = Path(__file__).resolve().parent.parent
MODEL = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "data/da.onnx"
OUT = ROOT / "web/audio"


def main():
    OUT.mkdir(exist_ok=True)
    voice = PiperVoice.load(str(MODEL))
    words = json.loads((ROOT / "web/words.json").read_text(encoding="utf-8"))
    for w in words:
        path = OUT / f"{w['rank']}.mp3"
        if path.exists() and path.stat().st_size > 0:
            continue
        buf = BytesIO()
        with wave.open(buf, "wb") as f:
            voice.synthesize_wav(w["danish"], f)
        subprocess.run(
            ["ffmpeg", "-y", "-loglevel", "error", "-i", "pipe:0", "-ac", "1", "-b:a", "48k", str(path)],
            input=buf.getvalue(), check=True,
        )
    print(f"audio ready for {len(list(OUT.glob('*.mp3')))} words")


main()
