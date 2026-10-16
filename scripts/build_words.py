"""Build web/words.json: Danish lemmas ranked by subtitle frequency, with English glosses.

Inputs (data/raw/, see README for download URLs):
  kaikki-danish.jsonl  English Wiktionary Danish extract (wiktextract), CC BY-SA
  da_50k.txt           hermitdave/FrequencyWords, "word count" per line
"""
import json
import sys
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LIMIT = int(sys.argv[1]) if len(sys.argv) > 1 else 500

KEEP_POS = {"noun", "verb", "adj", "adv", "pron", "prep", "conj", "num", "det", "intj", "particle"}
# Homographs (have: verb/noun, for: prep/noun): function words and verbs beat nouns.
POS_PRIORITY = ["pron", "prep", "conj", "det", "particle", "intj", "num", "adv", "verb", "adj", "noun"]
JUNK_FORM_TAGS = {"inflection-template", "table-tags", "class", "romanization"}
JUNK_FORM_TEXT = {"no-table-tags", "da-noun-infl", "da-verb-infl", "da-adj-infl"}


def is_form_entry(entry):
    senses = entry.get("senses", [])
    return bool(senses) and all(
        s.get("form_of") or s.get("alt_of") or "form-of" in s.get("tags", []) for s in senses
    )


def gender(entry):
    for t in entry.get("head_templates", []):
        g = t.get("args", {}).get("g", "")
        if g.startswith("c"):
            return "en"
        if g.startswith("n"):
            return "et"
    return None


def ipa(entry):
    for s in entry.get("sounds", []):
        if s.get("ipa", "").startswith("["):
            return s["ipa"]
    for s in entry.get("sounds", []):
        if "ipa" in s:
            return s["ipa"]
    return None


def clean_forms(entry):
    out = []
    for f in entry.get("forms", []):
        form = f.get("form", "")
        tags = set(f.get("tags", []))
        if not form or form in JUNK_FORM_TEXT or tags & JUNK_FORM_TAGS or form == entry["word"] or form == "-":
            continue
        if "perfect" in tags or " " in form:  # "er"/"har racet": auxiliaries, not forms of this word
            continue
        out.append({"form": form, "tags": f.get("tags", [])})
    return out


def main():
    lemmas = {}  # (word, pos) -> entry dict
    form_to_lemma = defaultdict(list)  # inflected form -> [lemma words]; explicit form-of entries first
    explicit_form_of = set()

    with open(ROOT / "data/raw/kaikki-danish.jsonl", encoding="utf-8") as fh:
        for line in fh:
            e = json.loads(line)
            word, pos = e["word"], e.get("pos")
            if pos not in KEEP_POS or " " in word:
                continue
            if is_form_entry(e):
                for s in e["senses"]:
                    for fo in s.get("form_of", []):
                        lw = fo.get("word")
                        explicit_form_of.add(word)
                        if lw and lw not in form_to_lemma[word]:
                            form_to_lemma[word].append(lw)
                continue
            glosses = []
            for s in e.get("senses", []):
                glosses.extend(g for g in s.get("glosses", [])[-1:] if g not in glosses)
            if not glosses:
                continue
            forms = clean_forms(e)
            lemmas[(word, pos)] = {
                "danish": word,
                "english": glosses[:3],
                "pos": pos,
                "gender": gender(e),
                "ipa": ipa(e),
                "forms": forms[:8],
            }
            for f in forms:
                if word not in form_to_lemma[f["form"]]:
                    form_to_lemma[f["form"]].append(word)

    # A word that is an explicit inflected form of a verb etc. ("skal", "var", "giver") should
    # count towards that lemma unless it also has a function-word/verb entry of its own.
    lemma_pos = defaultdict(set)
    for w, pos in lemmas:
        lemma_pos[w].add(pos)
    lemma_words = {w for w, pos_set in lemma_pos.items() if not (pos_set <= {"noun", "adj"} and w in explicit_form_of)}
    counts = defaultdict(int)
    with open(ROOT / "data/raw/da_50k.txt", encoding="utf-8") as fh:
        for line in fh:
            word, _, n = line.rstrip("\n").partition(" ")
            if not n:
                continue
            if word in lemma_words:
                target = word
            elif word in form_to_lemma:
                target = form_to_lemma[word][0]
            else:
                continue
            counts[target] += int(n)

    ranked = sorted(counts.items(), key=lambda kv: -kv[1])
    by_word = defaultdict(list)
    for (w, pos), entry in lemmas.items():
        by_word[w].append(entry)

    out = []
    for word, n in ranked:
        entries = by_word.get(word)
        if not entries:
            continue
        entry = dict(min(entries, key=lambda e: POS_PRIORITY.index(e["pos"])))
        entry["rank"] = len(out) + 1
        entry["count"] = n
        out.append(entry)
        if len(out) >= LIMIT:
            break

    (ROOT / "web").mkdir(exist_ok=True)
    (ROOT / "web/words.json").write_text(
        json.dumps(out, ensure_ascii=False, indent=1), encoding="utf-8"
    )
    print(f"{len(lemmas)} lemmas, {len(form_to_lemma)} forms, wrote {len(out)} words")


if __name__ == "__main__":
    main()
