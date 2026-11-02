## cefr-vocabulary-dataset
⚠️ Unofficial, community-made vocabulary dataset — may contain errors and gaps. ~60,000 words across 9 languages (EN, DE, ES, FR, IT, PT, TR, KO, JA), split by CEFR level (A1–C1). Includes IPA phonetic pronunciation, part of speech, and definitions. Ideal for building language-learning and personal-development apps (flashcards, vocabulary trainers, spaced-repetition, pronunciation practice). Available in JSON and CSV.

# CEFR Vocabulary Dataset

A multilingual vocabulary dataset split by CEFR level. Each word includes its
lemma, language, level, part of speech (pos), **IPA phonetic pronunciation**,
definition, and source — provided in both JSON and CSV formats.

## ⚠️ Disclaimer

This is **not an official resource**. It was compiled automatically /
semi-automatically and may contain incorrect level labels, missing or
inaccurate IPA pronunciations, missing definitions, or empty fields (not every
entry has an IPA transcription or definition). Verify before relying on it for
anything that requires accuracy. Corrections and contributions are welcome.

## Coverage

Total **~59,947 words** across 37 language-level files.

| Language   | Code | Levels             |
|------------|------|--------------------|
| English    | en   | A1, A2, B1, B2, C1 |
| Japanese   | ja   | A1, A2, B1, B2, C1 |
| German     | de   | A1, A2, B1         |
| Spanish    | es   | A1, A2, B1, B2     |
| French     | fr   | A1, A2, B1, B2     |
| Italian    | it   | A1, A2, B1, B2     |
| Portuguese | pt   | A1, A2, B1, B2     |
| Korean     | ko   | A1, A2, B1, B2     |
| Turkish    | tr   | A1, A2, B1, B2     |

## Formats

- `vocab_json/` — one `.json` file per language-level (e.g. `en-A1.json`)
- `vocab_csv/`  — one `.csv` file per language-level (e.g. `en-A1.csv`)

## Fields

| Field               | Description                                      |
|---------------------|--------------------------------------------------|
| `id`                | Unique identifier (UUID)                         |
| `lemma`             | The word / dictionary form                       |
| `language`          | Language code (en, de, es, …)                    |
| `cefr_level`        | CEFR level (A1–C1)                               |
| `pos`               | Part of speech (noun, verb, adj, …)              |
| `ipa`               | IPA phonetic pronunciation (e.g. `/ˈdɪfrəns/`)   |
| `definition_target` | Definition / meaning                             |
| `audio_url`         | Audio pronunciation URL (may be empty)           |
| `source`            | Origin of the entry (oxford_3000_5000, jlpt_n3…) |
| `created_at`        | Creation timestamp                               |
| `updated_at`        | Last update timestamp                            |

## Example

```json
{
  "lemma": "difference",
  "language": "en",
  "cefr_level": "A1",
  "pos": "noun",
  "ipa": "/ˈdɪfrəns/",
  "definition_target": "The quality of being different.",
  "source": "oxford_3000_5000"
}
```

## Use Cases

Because the data is split by language and CEFR level and includes phonetic
(IPA) pronunciation, it's a ready-made building block for **language-learning
and personal-development applications**, such as:

- 📱 **Vocabulary trainers & flashcard apps** — load a specific level (e.g.
  `en-A1`) and build lessons that grow with the learner.
- 🔁 **Spaced-repetition (SRS) systems** — feed words into Anki-style review
  schedules, filtered by language and level.
- 🗣️ **Pronunciation practice** — use the IPA field to show learners how each
  word is pronounced, or drive text-to-speech.
- 🎯 **Level assessment & placement tests** — generate quizzes from a given CEFR
  band to estimate a learner's level.
- 🧠 **Daily "word of the day" / habit-building apps** — surface one new word per
  day as part of a personal-growth or learning routine.
- 🤖 **AI tutors & chatbots** — ground an LLM-based language tutor with a
  curated, level-appropriate vocabulary list.

Since each file is a plain JSON or CSV, you can drop it straight into a web,
mobile, or backend project with no database required.

## License & Contributions

Free to use for personal and educational projects. As noted above, this is an
unofficial dataset — if you spot mistakes, missing words, or wrong levels,
contributions and corrections are welcome.