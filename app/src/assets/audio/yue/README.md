# Cantonese (Yue) Audio Assets

This directory is reserved for Cantonese (ISO 639-3: `yue`) audio assets.

## Status: Phase 3 scaffold — do not populate yet

Cantonese support requires a separate cultural review before any audio or voice IDs are added.
See `src/constants/voices.ts` for the placeholder voice ID constant (`YUE_VOICE_ID_PLACEHOLDER`).

## Planned structure (Phase 4+)

```
yue/
  flashcards/      — pre-recorded flashcard audio
  scenarios/       — scenario intro audio clips
  tts-cache/       — runtime ElevenLabs TTS cache (managed by synthesizeSpeech)
```

## Cultural review checklist (before enabling)

- [ ] Confirm ElevenLabs has a suitable Cantonese voice (not Mandarin)
- [ ] Verify jyutping romanization display is correct in all UI components
- [ ] Review family terms — Cantonese maternal/paternal distinctions differ from Mandarin
      (e.g. 婆婆 = maternal grandmother in Cantonese, vs. paternal in Mandarin usage areas)
- [ ] Check scenario cultural context for Cantonese-speaking communities (HK, Guangdong, diaspora)
- [ ] Add `'yue'` to `SupportedLanguage` union type in `src/types/index.ts`
- [ ] Add `yue` entry to `VOICE_IDS` in `src/constants/voices.ts`
- [ ] Add `yue` entry to `FAMILY_TERMS` in `src/constants/familyTerms.ts`
