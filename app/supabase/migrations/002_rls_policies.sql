-- 002_rls_policies.sql
-- Enables RLS on every table. Default policy: deny all.
-- Explicit policies: SELECT/INSERT/UPDATE/DELETE only where auth.uid() = user_id.

-- ─── profiles ─────────────────────────────────────────────────────────────────
alter table profiles enable row level security;

create policy "profiles: owner select"
  on profiles for select
  using (auth.uid() = id);

create policy "profiles: owner insert"
  on profiles for insert
  with check (auth.uid() = id);

create policy "profiles: owner update"
  on profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "profiles: owner delete"
  on profiles for delete
  using (auth.uid() = id);

-- ─── skill_scores ─────────────────────────────────────────────────────────────
alter table skill_scores enable row level security;

create policy "skill_scores: owner select"
  on skill_scores for select
  using (auth.uid() = user_id);

create policy "skill_scores: owner insert"
  on skill_scores for insert
  with check (auth.uid() = user_id);

create policy "skill_scores: owner update"
  on skill_scores for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "skill_scores: owner delete"
  on skill_scores for delete
  using (auth.uid() = user_id);

-- ─── vocab_entries ────────────────────────────────────────────────────────────
alter table vocab_entries enable row level security;

create policy "vocab_entries: owner select"
  on vocab_entries for select
  using (auth.uid() = user_id);

create policy "vocab_entries: owner insert"
  on vocab_entries for insert
  with check (auth.uid() = user_id);

create policy "vocab_entries: owner update"
  on vocab_entries for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "vocab_entries: owner delete"
  on vocab_entries for delete
  using (auth.uid() = user_id);

-- ─── session_metrics ──────────────────────────────────────────────────────────
alter table session_metrics enable row level security;

create policy "session_metrics: owner select"
  on session_metrics for select
  using (auth.uid() = user_id);

create policy "session_metrics: owner insert"
  on session_metrics for insert
  with check (auth.uid() = user_id);

create policy "session_metrics: owner update"
  on session_metrics for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "session_metrics: owner delete"
  on session_metrics for delete
  using (auth.uid() = user_id);

-- ─── flashcard_progress ───────────────────────────────────────────────────────
alter table flashcard_progress enable row level security;

create policy "flashcard_progress: owner select"
  on flashcard_progress for select
  using (auth.uid() = user_id);

create policy "flashcard_progress: owner insert"
  on flashcard_progress for insert
  with check (auth.uid() = user_id);

create policy "flashcard_progress: owner update"
  on flashcard_progress for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "flashcard_progress: owner delete"
  on flashcard_progress for delete
  using (auth.uid() = user_id);
