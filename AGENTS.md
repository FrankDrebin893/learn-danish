# AGENTS.md

Danish vocabulary learning app (quiz + flashcards), a proof of concept modelled on
SpanishWordLearningApp. Static site, no build step. See [README.md](README.md) for the data sources.

## Layout

- `scripts/build_words.py [N]`: builds `web/words.json` (top N lemmas, default 500) from
  `data/raw/kaikki-danish.jsonl` and `data/raw/da_50k.txt`. Download commands are in the README.
- `scripts/make_audio.py [voice]`: generates `web/audio/<rank>.mp3` with `edge-tts`; skips existing files.
- `web/`: `index.html`, `app.js`, `app.css`, `words.json`, `audio/`. Vanilla JS, no dependencies.
- `data/raw/` is git-ignored (98 MB kaikki file).

## Commands

```bash
python scripts/build_words.py 500
python scripts/make_audio.py
cd web && python -m http.server 8000
```

Run Python with `PYTHONIOENCODING=utf-8` when printing Danish text on Windows. Audio files are named
by frequency rank, so rebuild audio after any change that renumbers `words.json`
(delete `web/audio` first).

## Conventions

- `words.json` fields: `rank`, `danish`, `english[]`, `short` (quiz-sized gloss), `pos`, `gender`
  (`en`/`et`/null), `ipa`, `forms[]`, `count`.
- Keep the app dependency-free and static so it can be hosted on GitHub Pages.
- Data is CC BY-SA (Wiktionary via kaikki.org, OpenSubtitles via FrequencyWords). Keep the attribution
  footer in `web/index.html`, and put any published derived data under CC BY-SA 4.0.
- The audio uses the unofficial `edge-tts` interface: personal use only. Use Azure Speech or Piper
  before publishing.
