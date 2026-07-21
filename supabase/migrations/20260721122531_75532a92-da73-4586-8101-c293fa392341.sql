CREATE TABLE public.visitor_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  stop_id INTEGER NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  demo_attended BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX visitor_progress_user_stop_idx ON public.visitor_progress (user_id, stop_id, completed_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.visitor_progress TO authenticated;
GRANT ALL ON public.visitor_progress TO service_role;
ALTER TABLE public.visitor_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own progress" ON public.visitor_progress FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);