export interface User {
  id?: string;
  name: string;
  email: string;
  age?: number;
  weight?: number;
  height?: number;
  fitness_goal?: string;
  avatar_url?: string;
}

export interface DailySummary {
  steps: number;
  calories: number;
  heart_rate: number;
  sleep_hours: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  createdAt: number;
}

export interface ChatThread {
  id: string;
  title: string;
  createdAt: number;
  messages: ChatMessage[];
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string | number;
  rest_seconds: number;
  muscle_groups: string[];
  notes?: string;
}

export interface WorkoutDay {
  day: string;
  focus: string;
  exercises: Exercise[];
}

export interface WorkoutPlan {
  id: string;
  week_start: string;
  ai_generated: boolean;
  days: WorkoutDay[];
}

export interface Biomarker {
  name: string;
  value: string;
  unit?: string;
  normalRange?: string;
}

export interface FlaggedItem {
  name: string;
  value: string;
  reason: string;
}

export interface ReportAnalysis {
  biomarkers: Biomarker[];
  flagged: FlaggedItem[];
  fitnessInsights: string[];
}

export interface HealthReport {
  id: string;
  file_name: string;
  created_at: string;
  status: 'analyzing' | 'complete' | 'error';
  analysis?: ReportAnalysis;
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';
export type FoodSource = 'manual' | 'photo_ai' | 'search';
export type AiConfidence = 'high' | 'medium' | 'low';

export interface FoodItem {
  id: string;
  name_zh: string;
  name_en?: string;
  serving_size?: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  category?: string;
}

export interface NutritionLog extends FoodItem {
  log_id: string;
  meal_type: MealType;
  logged_at: string;
  source: FoodSource;
  ai_confidence?: AiConfidence;
  food_name: string;
}

export interface NutritionGoals {
  calorie_goal: number;
  protein_goal_g: number;
  carbs_goal_g: number;
  fat_goal_g: number;
  water_goal_ml: number;
  goal_type: 'lose_fat' | 'gain_muscle' | 'maintain';
}

export interface FoodAnalysis {
  name_zh: string;
  name_en: string;
  serving_size: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  confidence: AiConfidence;
}
