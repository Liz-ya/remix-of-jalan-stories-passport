
CREATE TABLE public.user_stop_visits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  stop_id INT NOT NULL,
  visited_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, stop_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_stop_visits TO authenticated;
GRANT ALL ON public.user_stop_visits TO service_role;
ALTER TABLE public.user_stop_visits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own visits" ON public.user_stop_visits FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.user_badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  badge_id TEXT NOT NULL,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, badge_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_badges TO authenticated;
GRANT ALL ON public.user_badges TO service_role;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own badges" ON public.user_badges FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.user_rewards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  reward_id TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, reward_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_rewards TO authenticated;
GRANT ALL ON public.user_rewards TO service_role;
ALTER TABLE public.user_rewards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own rewards" ON public.user_rewards FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
