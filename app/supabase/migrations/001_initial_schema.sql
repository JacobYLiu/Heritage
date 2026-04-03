-- 001_initial_schema.sql
-- Creates all application tables with language column and updated_at auto-trigger.

-- ─── updated_at trigger function ─────────────────────────────────────────────
create or replace function handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ─── profiles ─────────────────────────────────────────────────────────────────
create table profiles (
  id                  uuid primary key references auth.users(id) on delete cascade,
  name                text not null,
  selected_language   text not null check (selected_language in ('zh', 'ja', 'ko')),
  chinese_script      text not null default 'simplified' check (chinese_script in ('simplified', 'traditional')),
  heritage_background text not null check (heritage_background in ('yes', 'somewhat', 'no')),
  self_reported_level text not null check (self_reported_level in ('very', 'a-little', 'not-at-all')),
  is_premium          boolean not null default false,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create trigger profiles_updated_at
  before update on profiles
  for each row execute function handle_updated_at();

-- ─── skill_scores ─────────────────────────────────────────────────────────────
create table skill_scores (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  listening    numeric(5,2) not null default 0 check (listening between 0 and 100),
  speaking     numeric(5,2) not null default 0 check (speaking between 0 and 100),
  reading      numeric(5,2) not null default 0 check (reading between 0 and 100),
  writing      numeric(5,2) not null default 0 check (writing between 0 and 100),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create trigger skill_scores_updated_at
  before update on skill_scores
  for each row execute function handle_updated_at();

-- ─── vocab_entries ────────────────────────────────────────────────────────────
create table vocab_entries (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references auth.users(id) on delete cascade,
  language            text not null check (language in ('zh', 'ja', 'ko')),
  script              text not null,
  romanization        text not null,
  meaning             text not null,
  audio_url           text not null,
  example_sentence    text not null,
  example_translation text not null,
  context_note        text not null default '',
  personal_note       text,
  seen_at             timestamptz not null default now(),
  source              text not null check (source in ('flashcard', 'roleplay', 'listening')),
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create trigger vocab_entries_updated_at
  before update on vocab_entries
  for each row execute function handle_updated_at();

-- ─── session_metrics ──────────────────────────────────────────────────────────
create table session_metrics (
  id                   uuid primary key default gen_random_uuid(),
  user_id              uuid not null references auth.users(id) on delete cascade,
  language             text not null check (language in ('zh', 'ja', 'ko')),
  session_type         text not null check (session_type in ('flashcard', 'listening', 'roleplay')),
  words_encountered    integer not null default 0,
  words_marked_got     integer not null default 0,
  listening_accuracy   numeric(5,2),
  speaking_confidence  numeric(5,2),
  new_vocab_count      integer not null default 0,
  duration_seconds     integer not null default 0,
  skill_delta_listening  numeric(5,2) not null default 0,
  skill_delta_speaking   numeric(5,2) not null default 0,
  skill_delta_reading    numeric(5,2) not null default 0,
  skill_delta_writing    numeric(5,2) not null default 0,
  completed_at         timestamptz not null default now(),
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

create trigger session_metrics_updated_at
  before update on session_metrics
  for each row execute function handle_updated_at();

-- ─── flashcard_progress ───────────────────────────────────────────────────────
create table flashcard_progress (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references auth.users(id) on delete cascade,
  language         text not null check (language in ('zh', 'ja', 'ko')),
  flashcard_id     text not null,
  stability        numeric(10,4) not null default 0,
  difficulty       numeric(5,4) not null default 0.3,
  next_review_date timestamptz not null default now(),
  last_rating      text check (last_rating in ('again', 'hard', 'good', 'easy')),
  heard_at_home    boolean not null default false,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  unique (user_id, flashcard_id)
);

create trigger flashcard_progress_updated_at
  before update on flashcard_progress
  for each row execute function handle_updated_at();
