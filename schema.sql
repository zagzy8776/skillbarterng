-- User Progress and Activity Tracking Tables

-- Create user progress table
CREATE TABLE public.user_progress (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  total_xp integer DEFAULT 0 NOT NULL,
  current_level integer DEFAULT 1 NOT NULL,
  points integer DEFAULT 0 NOT NULL,
  learning_time_minutes integer DEFAULT 0 NOT NULL,
  skills_mastered integer DEFAULT 0 NOT NULL,
  students_taught integer DEFAULT 0 NOT NULL,
  active_swaps integer DEFAULT 0 NOT NULL,
  total_connections integer DEFAULT 0 NOT NULL,
  profile_completion integer DEFAULT 0 NOT NULL,
  day_streak integer DEFAULT 0 NOT NULL,
  last_activity_at timestamp with time zone DEFAULT now() NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT user_progress_pkey PRIMARY KEY (id),
  CONSTRAINT user_progress_user_id_unique UNIQUE (user_id)
);

-- Create user activities table for tracking real-time activity
CREATE TABLE public.user_activities (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  activity_type text NOT NULL, -- 'skill_learned', 'skill_taught', 'swap_completed', 'profile_updated', 'connection_made'
  activity_description text NOT NULL,
  xp_earned integer DEFAULT 0 NOT NULL,
  points_earned integer DEFAULT 0 NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create skill progress table
CREATE TABLE public.skill_progress (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  skill_name text NOT NULL,
  skill_category text,
  progress_percentage integer DEFAULT 0 NOT NULL,
  status text DEFAULT 'new' NOT NULL, -- 'new', 'learning', 'active', 'mastered'
  xp_invested integer DEFAULT 0 NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT skill_progress_pkey PRIMARY KEY (id)
);

-- Create swap sessions table for tracking teaching/learning sessions
CREATE TABLE public.swap_sessions (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  requester_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  target_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  skill_being_taught text NOT NULL,
  skill_being_learned text NOT NULL,
  session_duration_minutes integer DEFAULT 0,
  session_rating integer CHECK (session_rating >= 1 AND session_rating <= 5),
  completed_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT swap_sessions_pkey PRIMARY KEY (id)
);

-- Add indexes for better performance
CREATE INDEX idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX idx_user_activities_user_id ON public.user_activities(user_id);
CREATE INDEX idx_user_activities_created_at ON public.user_activities(created_at DESC);
CREATE INDEX idx_skill_progress_user_id ON public.skill_progress(user_id);
CREATE INDEX idx_swap_sessions_requester_id ON public.swap_sessions(requester_id);
CREATE INDEX idx_swap_sessions_target_id ON public.swap_sessions(target_id);

-- Function to calculate level from XP
CREATE OR REPLACE FUNCTION calculate_level(xp integer)
RETURNS integer AS $$
BEGIN
  RETURN CASE 
    WHEN xp < 100 THEN 1
    WHEN xp < 300 THEN 2
    WHEN xp < 600 THEN 3
    WHEN xp < 1000 THEN 4
    WHEN xp < 1500 THEN 5
    WHEN xp < 2100 THEN 6
    WHEN xp < 2800 THEN 7
    WHEN xp < 3600 THEN 8
    WHEN xp < 4500 THEN 9
    ELSE 10
  END;
END;
$$ LANGUAGE plpgsql;

-- Function to get XP needed for next level
CREATE OR REPLACE FUNCTION xp_for_next_level(current_xp integer)
RETURNS integer AS $$
DECLARE
  current_level integer;
  next_level_xp integer;
BEGIN
  SELECT calculate_level(current_xp) INTO current_level;
  
  -- XP thresholds for each level
  CASE current_level
    WHEN 1 THEN next_level_xp := 100;
    WHEN 2 THEN next_level_xp := 300;
    WHEN 3 THEN next_level_xp := 600;
    WHEN 4 THEN next_level_xp := 1000;
    WHEN 5 THEN next_level_xp := 1500;
    WHEN 6 THEN next_level_xp := 2100;
    WHEN 7 THEN next_level_xp := 2800;
    WHEN 8 THEN next_level_xp := 3600;
    WHEN 9 THEN next_level_xp := 4500;
    ELSE next_level_xp := 999999; -- Max level
  END CASE;
  
  RETURN next_level_xp - current_xp;
END;
$$ LANGUAGE plpgsql;

-- Function to update user progress when activity happens
CREATE OR REPLACE FUNCTION update_user_progress(
  p_user_id uuid,
  p_activity_type text,
  p_description text,
  p_xp_earned integer DEFAULT 0,
  p_points_earned integer DEFAULT 0
)
RETURNS void AS $$
DECLARE
  current_xp integer;
  current_level integer;
  new_level integer;
BEGIN
  -- Insert activity record
  INSERT INTO user_activities (user_id, activity_type, activity_description, xp_earned, points_earned)
  VALUES (p_user_id, p_activity_type, p_description, p_xp_earned, p_points_earned);
  
  -- Update or insert user progress
  INSERT INTO user_progress (user_id, total_xp, points, last_activity_at)
  VALUES (p_user_id, p_xp_earned, p_points_earned, now())
  ON CONFLICT (user_id) 
  DO UPDATE SET
    total_xp = user_progress.total_xp + p_xp_earned,
    points = user_progress.points + p_points_earned,
    last_activity_at = now(),
    updated_at = now();
  
  -- Check if user leveled up
  SELECT total_xp, current_level INTO current_xp, current_level
  FROM user_progress WHERE user_id = p_user_id;
  
  SELECT calculate_level(current_xp) INTO new_level;
  
  IF new_level > current_level THEN
    UPDATE user_progress 
    SET current_level = new_level, updated_at = now()
    WHERE user_id = p_user_id;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_progress_updated_at 
  BEFORE UPDATE ON public.user_progress 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_skill_progress_updated_at 
  BEFORE UPDATE ON public.skill_progress 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
