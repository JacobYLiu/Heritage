# Heritage — Production Audit Checklist

> Step 3.6: Complete before App Store submission.

---

## Accessibility (VoiceOver / TalkBack)

- [ ] All `TouchableOpacity` elements have `accessibilityLabel` set
- [ ] All `Image` elements have `accessibilityLabel` or `accessibilityRole="image"` + description
- [ ] Flashcard flip is accessible: card front/back each have distinct `accessibilityLabel`
- [ ] Roleplay MicButton has `accessibilityLabel` that reflects current state ("Start recording" / "Stop recording")
- [ ] FeedbackBanner is announced by screen reader (use `accessibilityLiveRegion="polite"`)
- [ ] SkillBars: each bar has `accessibilityLabel` with skill name and percentage
- [ ] HonorificsScreen term cards: tapping to expand/collapse is announced
- [ ] SkillTrendChart: chart is `accessibilityRole="image"` with summary `accessibilityLabel` (e.g. "Listening trend: started at 20, now 45")
- [ ] All text has sufficient contrast ratio (WCAG AA: 4.5:1 for normal, 3:1 for large)
- [ ] Dynamic text size: test at smallest and largest iOS accessibility text sizes
- [ ] Minimum touch target: 44×44pt for all interactive elements

## Performance

### Roleplay < 2s on 4G (from mic stop to parent speech playing)
- [ ] Measure: Whisper transcription latency (target < 800ms on 4G)
- [ ] Measure: Claude API response time (target < 1000ms)
- [ ] Measure: ElevenLabs TTS synthesis (target < 500ms, cached = 0ms)
- [ ] Use `captureMessage` breadcrumbs to trace latency in Sentry
- [ ] Verify TTS cache hit rate after 2nd turn of same scenario

### App startup
- [ ] Time from launch to home screen < 2s on iPhone 12 equivalent
- [ ] Profile image loads lazy (not blocking)
- [ ] Zustand store rehydration from SecureStore is non-blocking

### Memory
- [ ] No memory leaks from expo-av (call `sound.unloadAsync()` on unmount in all audio components)
- [ ] Roleplay state is cleared from `roleplayStore` after session completes
- [ ] ElevenLabs TTS cache does not grow unbounded — add LRU eviction in Phase 4 if needed

## Security

- [ ] **SecureStore audit**: Only `src/config/secrets.ts` reads from SecureStore. Grep for `SecureStore.getItemAsync` in all other files — expect 0 results.
- [ ] **API keys**: No API keys in source code, git history, or bundle. Verify with `git log -S "sk-"` and `git log -S "xi-api-key"`.
- [ ] **RLS policies**: All 5 Supabase tables have deny-all default + owner-only policies. Run `supabase db lint` and test with a second test user.
- [ ] **Auth tokens**: Supabase JWT is never logged. Search codebase for `console.log` containing auth or token.
- [ ] **Audio file paths**: TTS cache paths are local `cacheDirectory` only, never exposed to Supabase or Claude.
- [ ] **Claude prompt injection**: Whisper transcript is user-controlled input — Claude prompts wrap it with clear delimiters. Verify `buildRoleplayFamilyCharacterPrompt` treats transcript as data, not instructions.
- [ ] **Delete account**: Test full deletion flow — verify all rows removed from all 5 tables + Supabase Auth user deleted.
- [ ] **Offline cache**: cached deck JSON does not include API keys or auth tokens.
- [ ] **HTTPS only**: All fetch calls use `https://`. No `http://` in codebase.

## Pre-submission

- [ ] Replace all `ELEVENLABS_*_VOICE_ID` placeholders in `src/constants/voices.ts` with real voice IDs
- [ ] Add real Supabase URL + anon key to SecureStore init instructions in onboarding
- [ ] Set `EXPO_PUBLIC_SENTRY_DSN` in EAS Build secrets
- [ ] Run `npx expo install @sentry/react-native` and complete Sentry wizard
- [ ] Verify `app.json` has correct `bundleIdentifier` (iOS) and `package` (Android)
- [ ] Run `eas build --platform all --profile production`
- [ ] Submit to TestFlight / Google Play Internal Testing first
- [ ] Run through all 27 roleplay scenarios in staging
- [ ] Test offline mode: airplane mode after pre-download, verify cards load and audio plays
