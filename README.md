# Matchingo

Emoji / image match-3 vocabulary game with Ebbinghaus-style spaced repetition.

Extracted from [smelly-cat-dictation](../smelly-cat-dictation).

## Run

```bash
npm install
npm run dev
```

## Scripts

```bash
# regenerate emoji noun categories (optional)
npx tsx scripts/generate-emoji-nouns.ts

# generate thiings image dataset after placing images in public/thiings/
npx tsx scripts/generate-thiings-dataset.ts
```

## Notes

- Progress is stored in `localStorage` under `match3-vocab-ebbinghaus-v1:*`
- Guest mode only (no auth)
- Thiings image pack is optional; emoji categories work out of the box
