"""Post-process web/words.json `short` glosses: hand-written overrides for grammatical/truncated entries,
then cut anything still over 40 chars at a word boundary. Idempotent; run after build_words.py."""
import json
from pathlib import Path

P = Path(__file__).resolve().parent.parent / "web/words.json"
OVERRIDES = {
    "mig": "me", "min": "my, mine", "ham": "him", "os": "us", "hende": "her", "jer": "you (plural)",
    "andre": "others", "sådan": "like this, such", "gange": "times", "helt": "completely, quite",
    "sin": "his, her, its (own)", "sit": "his, her, its (own)", "vel": "well, I suppose", "hen": "away, over (to)",
    "engang": "once, one day", "øjeblik": "moment", "fatte": "to grasp, understand", "forbi": "past, over",
    "styre": "to govern, steer", "veje": "to weigh", "fjerne": "to remove",
}


def trim(s, n=40):
    if len(s) <= n:
        return s
    cut = s[:n].rsplit(",", 1)[0] if "," in s[:n] else s[:n].rsplit(" ", 1)[0]
    return cut.rstrip(" ,;:-")


words = json.loads(P.read_text(encoding="utf-8"))
for w in words:
    w["short"] = trim(OVERRIDES.get(w["danish"], w["short"]))
P.write_text(json.dumps(words, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
