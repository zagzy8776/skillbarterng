import { supabase } from './supabaseClient'

export interface UserProgress {
  id: string
  user_id: string
  total_xp: number
  current_level: number
  points: number
  learning_time_minutes: number
  skills_mastered: number
  students_taught: number
  active_swaps: number
  total_connections: number
  profile_completion: number
  day_streak: number
  last_activity_at: string
  created_at: string
  updated_at: string
}

export interface UserActivity {
  id: string
  user_id: string
  activity_type: string
  activity_description: string
  xp_earned: number
  points_earned: number
  created_at: string
}

export interface SkillProgress {
  id: string
  user_id: string
  skill_name: string
  skill_category?: string
  progress_percentage: number
  status: 'new' | 'learning' | 'active' | 'mastered'
  xp_invested: number
  created_at: string
  updated_at: string
}

// Get user's current progress
export async function getUserProgress(userId: string): Promise<UserProgress | null> {
  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) {
    console.error('Error fetching user progress:', error)
    return null
  }

  return data
}

// Initialize user progress for new users
export async function initializeUserProgress(userId: string): Promise<UserProgress> {
  const { data, error } = await supabase
    .from('user_progress')
    .insert({
      user_id: userId,
      total_xp: 50, // Starting XP for new users
      current_level: 1,
      points: 100, // Starting points
      learning_time_minutes: 0,
      skills_mastered: 0,
      students_taught: 0,
      active_swaps: 0,
      total_connections: 0,
      profile_completion: 10, // 10% for just signing up
      day_streak: 0
    })
    .select()
    .single()

  if (error) {
    console.error('Error initializing user progress:', error)
    throw error
  }

  // Add initial activity
  await addUserActivity(userId, 'profile_created', 'Welcome to SkillBarterNG!', 50, 100)

  return data
}

// Add user activity and update progress
export async function addUserActivity(
  userId: string,
  activityType: string,
  description: string,
  xpEarned: number = 0,
  pointsEarned: number = 0
): Promise<void> {
  try {
    // Use the database function to update progress and add activity
    const { error } = await supabase
      .rpc('update_user_progress', {
        p_user_id: userId,
        p_activity_type: activityType,
        p_description: description,
        p_xp_earned: xpEarned,
        p_points_earned: pointsEarned
      })

    if (error) {
      console.error('Error updating user progress:', error)
      throw error
    }
  } catch (error) {
    console.error('Error adding user activity:', error)
    throw error
  }
}

// Get recent user activities
export async function getUserActivities(userId: string, limit: number = 10): Promise<UserActivity[]> {
  const { data, error } = await supabase
    .from('user_activities')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching user activities:', error)
    return []
  }

  return data || []
}

// Update skill progress
export async function updateSkillProgress(
  userId: string,
  skillName: string,
  progressPercentage: number,
  status: 'new' | 'learning' | 'active' | 'mastered',
  xpInvested: number = 0
): Promise<void> {
  const { error } = await supabase
    .from('skill_progress')
    .upsert({
      user_id: userId,
      skill_name: skillName,
      progress_percentage: progressPercentage,
      status: status,
      xp_invested: xpInvested
    }, {
      onConflict: 'user_id,skill_name'
    })

  if (error) {
    console.error('Error updating skill progress:', error)
    throw error
  }
}

// Get user's skill progress
export async function getUserSkillProgress(userId: string): Promise<SkillProgress[]> {
  const { data, error } = await supabase
    .from('skill_progress')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })

  if (error) {
    console.error('Error fetching skill progress:', error)
    return []
  }

  return data || []
}

// Complete a swap session and update progress
export async function completeSwapSession(
  requesterId: string,
  targetId: string,
  skillBeingTaught: string,
  skillBeingLearned: string,
  durationMinutes: number,
  rating: number
): Promise<void> {
  // Insert swap session record
  const { error: sessionError } = await supabase
    .from('swap_sessions')
    .insert({
      requester_id: requesterId,
      target_id: targetId,
      skill_being_taught: skillBeingTaught,
      skill_being_learned: skillBeingLearned,
      session_duration_minutes: durationMinutes,
      session_rating: rating,
      completed_at: new Date().toISOString()
    })

  if (sessionError) {
    console.error('Error completing swap session:', sessionError)
    throw sessionError
  }

  // Update both users' progress
  const xpReward = Math.floor(durationMinutes / 10) * 10 + (rating * 5)
  const pointsReward = Math.floor(durationMinutes / 5) + (rating * 10)

  // Update requester (learner)
  await addUserActivity(
    requesterId,
    'skill_learned',
    `Completed learning session: ${skillBeingLearned} (${durationMinutes}min, ${rating}⭐)`,
    xpReward,
    pointsReward
  )

  // Update target (teacher)
  await addUserActivity(
    targetId,
    'skill_taught',
    `Completed teaching session: ${skillBeingTaught} (${durationMinutes}min, ${rating}⭐)`,
    xpReward,
    pointsReward
  )

  // Update learning time for the learner
  await updateLearningTime(requesterId, durationMinutes)
  await updateTeachingStats(targetId, 1, durationMinutes)
}

// Update learning time
async function updateLearningTime(userId: string, minutesToAdd: number): Promise<void> {
  // Get current learning time first
  const { data: currentData } = await supabase
    .from('user_progress')
    .select('learning_time_minutes')
    .eq('user_id', userId)
    .single()

  if (currentData) {
    const { error } = await supabase
      .from('user_progress')
      .update({
        learning_time_minutes: currentData.learning_time_minutes + minutesToAdd
      })
      .eq('user_id', userId)

    if (error) {
      console.error('Error updating learning time:', error)
    }
  }
}

// Update teaching statistics
async function updateTeachingStats(userId: string, studentsCount: number, totalMinutes: number): Promise<void> {
  // Get current students taught count first
  const { data: currentData } = await supabase
    .from('user_progress')
    .select('students_taught')
    .eq('user_id', userId)
    .single()

  if (currentData) {
    const { error } = await supabase
      .from('user_progress')
      .update({
        students_taught: currentData.students_taught + studentsCount
      })
      .eq('user_id', userId)

    if (error) {
      console.error('Error updating teaching stats:', error)
    }
  }
}

// Calculate XP needed for next level
export function getXpForNextLevel(currentXp: number): number {
  const levelThresholds = [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500]
  
  for (let i = 1; i < levelThresholds.length; i++) {
    if (currentXp < levelThresholds[i]) {
      return levelThresholds[i] - currentXp
    }
  }
  
  return 0 // Max level reached
}

// Calculate current level from XP
export function getCurrentLevel(currentXp: number): number {
  const levelThresholds = [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500]
  
  for (let i = levelThresholds.length - 1; i >= 0; i--) {
    if (currentXp >= levelThresholds[i]) {
      return i + 1
    }
  }
  
  return 1
}

// Get XP progress for current level
export function getXpProgress(currentXp: number): { current: number; needed: number; percentage: number } {
  const levelThresholds = [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500]
  
  let currentLevel = 1
  let nextLevelThreshold = 100
  
  for (let i = 0; i < levelThresholds.length - 1; i++) {
    if (currentXp >= levelThresholds[i] && currentXp < levelThresholds[i + 1]) {
      currentLevel = i + 1
      nextLevelThreshold = levelThresholds[i + 1]
      break
    }
  }
  
  const currentLevelXp = levelThresholds[currentLevel - 1]
  const xpInCurrentLevel = currentXp - currentLevelXp
  const xpNeededForNextLevel = nextLevelThreshold - currentXp
  const xpRequiredForLevel = nextLevelThreshold - currentLevelXp
  
  const percentage = Math.round((xpInCurrentLevel / xpRequiredForLevel) * 100)
  
  return {
    current: xpInCurrentLevel,
    needed: xpNeededForNextLevel,
    percentage: Math.min(percentage, 100)
  }
}
