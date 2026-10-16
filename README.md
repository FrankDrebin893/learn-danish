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
cd web && python -m http.server 8000   # open http://localhost:8000
```

`data/raw` is git-ignored. kaikki marks the Danish file as deprecated, so keep your own copy.

## Known limits of the POC

- Homographs pick one part of speech by a fixed priority (function words, then verbs, then nouns);
  e.g. proper names like "khan" still slip in.
- Glosses are Wiktionary's, some are long or odd ("A woman.").
- No example sentences yet (Tatoeba: 66k Danish sentences, join via its links export) and no audio
  files; the Listen button uses the browser's `da-DK` speech voice if the device has one.
- Progress is stored in `localStorage` only.
