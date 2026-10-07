-- MVP master-data schema for Academic scholarship records.
--
-- The source table has many nullable columns. For the first SABO iteration we
-- keep only fields used for listing, filtering, recommendations, and source
-- verification. Detailed criteria stay in eligibility_criteria so the schema
-- can evolve without adding a new nullable column for every test type.

CREATE TABLE IF NOT EXISTS scholarships (
  id BIGSERIAL PRIMARY KEY,
  name TEXT,
  provider TEXT,
  coverage TEXT,
  level TEXT,
  program_category TEXT,
  university TEXT,
  continent TEXT,
  country TEXT,
  open_registration DATE,
  earliest_deadline DATE,
  currency TEXT,
  scholarship_type TEXT,
  funding_type TEXT,
  benefit_notes TEXT,
  document_category TEXT,
  document_detail TEXT,
  eligibility_notes TEXT,
  eligibility_criteria JSONB NOT NULL DEFAULT '{}'::jsonb,
  source_url TEXT,
  source_checked_at DATE,
  status TEXT NOT NULL DEFAULT 'active',
  record_type TEXT NOT NULL DEFAULT 'scholarship',
  scholarship TEXT,
  degree TEXT,
  grade TEXT,
  currency_beasiswa TEXT,
  notes_benefit TEXT,
  notes_document_detail TEXT,
  min__gpa__scale_100_ TEXT,
  min__gpa__scale_4_0_ TEXT,
  min_age TEXT,
  standardized_test TEXT,
  a_level TEXT,
  nationality TEXT,
  min_gpa_raport TEXT,
  ielts__overall_ TEXT,
  minimum_total_score_sat TEXT,
  min_score_delf_dalf TEXT,
  min_score_dsh__germany_ TEXT,
  min_score_hsk TEXT,
  min_score_jlpt TEXT,
  min_score_tocfl TEXT,
  min_score_toefl_ibt TEXT,
  minimum_score_act TEXT,
  eligibility__notes_ TEXT,
  raw_source_record JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Keep migration safe when the prototype table already exists.
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS provider TEXT;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS coverage TEXT;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS level TEXT;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS program_category TEXT;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS university TEXT;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS continent TEXT;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS country TEXT;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS open_registration DATE;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS earliest_deadline DATE;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS currency TEXT;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS scholarship_type TEXT;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS funding_type TEXT;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS benefit_notes TEXT;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS document_category TEXT;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS document_detail TEXT;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS eligibility_notes TEXT;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS eligibility_criteria JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS source_url TEXT;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS source_checked_at DATE;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active';
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS record_type TEXT NOT NULL DEFAULT 'scholarship';
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS scholarship TEXT;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS degree TEXT;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS grade TEXT;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS currency_beasiswa TEXT;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS notes_benefit TEXT;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS notes_document_detail TEXT;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS min__gpa__scale_100_ TEXT;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS min__gpa__scale_4_0_ TEXT;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS min_age TEXT;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS standardized_test TEXT;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS a_level TEXT;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS nationality TEXT;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS min_gpa_raport TEXT;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS ielts__overall_ TEXT;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS minimum_total_score_sat TEXT;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS min_score_delf_dalf TEXT;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS min_score_dsh__germany_ TEXT;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS min_score_hsk TEXT;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS min_score_jlpt TEXT;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS min_score_tocfl TEXT;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS min_score_toefl_ibt TEXT;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS minimum_score_act TEXT;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS eligibility__notes_ TEXT;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS raw_source_record JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW();
ALTER TABLE scholarships ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- Remove check constraints from the prototype table. The source contains
-- free-text values such as D3, multiple countries, and different benefit
-- descriptions, so these fields must not be restricted to the old dummy
-- enum values.
DO $$
DECLARE
  constraint_name TEXT;
BEGIN
  FOR constraint_name IN
    SELECT con.conname
    FROM pg_constraint AS con
    JOIN pg_class AS rel ON rel.oid = con.conrelid
    JOIN pg_namespace AS ns ON ns.oid = rel.relnamespace
    WHERE rel.relname = 'scholarships'
      AND ns.nspname = current_schema()
      AND con.contype = 'c'
  LOOP
    EXECUTE format('ALTER TABLE scholarships DROP CONSTRAINT %I', constraint_name);
  END LOOP;
END $$;

ALTER TABLE scholarships ALTER COLUMN name DROP NOT NULL;

-- Remove the old spreadsheet grouping row if a previous seed already inserted
-- it. It is metadata, not an actual scholarship record.
DELETE FROM scholarships
WHERE record_type = 'country_group'
   OR (name IS NULL AND scholarship IS NULL AND country IS NOT NULL);

CREATE INDEX IF NOT EXISTS scholarships_earliest_deadline_idx ON scholarships (earliest_deadline);
CREATE INDEX IF NOT EXISTS scholarships_country_idx ON scholarships (country);
CREATE INDEX IF NOT EXISTS scholarships_level_idx ON scholarships (level);
CREATE INDEX IF NOT EXISTS scholarships_funding_type_idx ON scholarships (funding_type);
CREATE INDEX IF NOT EXISTS scholarships_status_idx ON scholarships (status);
