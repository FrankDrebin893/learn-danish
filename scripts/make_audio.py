"""Pre-generate Danish pronunciation audio (web/audio/<rank>.mp3) with a neural voice.

Uses the `edge-tts` package (Microsoft Edge's read-aloud voices, da-DK-ChristelNeural). That is an
unofficial interface, fine for a personal app; for anything public use Azure Speech or Piper.
Existing files are skipped, so it is safe to re-run after growing words.json.
"""
import asyncio
import json
import sys
from pathlib import Path

import edge_tts

ROOT = Path(__file__).resolve().parent.parent
VOICE = sys.argv[1] if len(sys.argv) > 1 else "da-DK-ChristelNeural"
OUT = ROOT / "web/audio"


async def one(sem, rank, text):
    path = OUT / f"{rank}.mp3"
    if path.exists() and path.stat().st_size > 0:
        return
    async with sem:
        for attempt in range(3):
            try:
                await edge_tts.Communicate(text, VOICE, rate="-10%").save(str(path))
                return
            except Exception as exc:  # network hiccup: retry
                if attempt == 2:
                    print(f"failed {rank} {text}: {exc}")
                await asyncio.sleep(1 + attempt)


async def main():
    OUT.mkdir(exist_ok=True)
    words = json.loads((ROOT / "web/words.json").read_text(encoding="utf-8"))
    sem = asyncio.Semaphore(6)
    await asyncio.gather(*(one(sem, w["rank"], w["danish"]) for w in words))
    print(f"audio ready for {len(list(OUT.glob('*.mp3')))} words")


asyncio.run(main())
