-- 003_indexes.sql
-- Indexes on user_id, language, updated_at, next_review_date.

-- skill_scores
create index idx_skill_scores_user_id    on skill_scores (user_id);
create index idx_skill_scores_updated_at on skill_scores (updated_at);

-- vocab_entries
create index idx_vocab_entries_user_id    on vocab_entries (user_id);
create index idx_vocab_entries_language   on vocab_entries (language);
create index idx_vocab_entries_updated_at on vocab_entries (updated_at);

-- session_metrics
create index idx_session_metrics_user_id    on session_metrics (user_id);
create index idx_session_metrics_language   on session_metrics (language);
create index idx_session_metrics_updated_at on session_metrics (updated_at);

-- flashcard_progress
create index idx_flashcard_progress_user_id          on flashcard_progress (user_id);
create index idx_flashcard_progress_language         on flashcard_progress (language);
create index idx_flashcard_progress_next_review_date on flashcard_progress (next_review_date);
create index idx_flashcard_progress_updated_at       on flashcard_progress (updated_at);
