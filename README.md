# learn-danish

Proof of concept: a frequency-ordered Danish vocabulary flashcard app, the Danish counterpart of
SpanishWordLearningApp (which uses doozan/spanish_data).

## Data pipeline

| Need | Source | License |
|---|---|---|
| English glosses, POS, gender (en/et), inflections, IPA | [kaikki.org Danish extract](https://kaikki.org/dictionary/Danish/) (English Wiktionary) | CC BY-SA |
| Frequency | [hermitdave/FrequencyWords](https://github.com/hermitdave/FrequencyWords) `content/2018/da/da_50k.txt` (OpenSubtitles) | CC BY-SA 4.0 |

`scripts/build_words.py` keeps lemmas only, maps inflected forms in the frequency list to their lemma
(via Wiktionary `forms[]` and form-of entries), sums counts per lemma, ranks them and writes
`web/words.json` (top 500 by default).

```bash
mkdir -p data/raw
curl -L -o data/raw/kaikki-danish.jsonl https://kaikki.org/dictionary/Danish/kaikki.org-dictionary-Danish.jsonl
curl -L -o data/raw/da_50k.txt https://raw.githubusercontent.com/hermitdave/FrequencyWords/master/content/2018/da/da_50k.txt
python scripts/build_words.py 500
pip install edge-tts && python scripts/make_audio.py   # web/audio/<rank>.mp3, neural da-DK voice
cd web && python -m http.server 8000   # open http://localhost:8000
```

`data/raw` is git-ignored. kaikki marks the Danish file as deprecated, so keep your own copy.

## App

- **Quiz** (modelled on the Spanish app): compass layout with four options, arrow keys / WASD / 1-4,
  auto-advance with a fade, streak counter, missed-words review. Danish ➔ English, English ➔ Danish or
  mixed, top 100 / 300 / 500 words. Distractors share the part of speech where possible.
- **Cards**: simple flip cards with gender, IPA, all glosses and inflected forms.
- **Audio**: pre-generated mp3s from the `da-DK-ChristelNeural` voice via the unofficial `edge-tts`
  package (browser `speechSynthesis` Danish voices sounded bad). Fine for personal use; for anything
  public switch to Azure Speech or Piper.

## Known limits of the POC

- Homographs pick one part of speech by a fixed priority; proper names like "khan" still slip in.
- Quiz answers use a shortened first gloss (`short`), which can be vague for function words.
- No example sentences yet (Tatoeba: 66k Danish sentences via its links export).
- Progress counts are stored in `localStorage` only and not yet used for spaced repetition.
