import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient } from '@/lib/api';
import type {
  FoodAnalysis,
  FoodItem,
  MealType,
  NutritionGoals,
  NutritionLog,
} from '@/types';

interface NutritionTotals {
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
}

interface NutritionState {
  logs: Record<string, NutritionLog[]>;   // keyed by YYYY-MM-DD
  water: Record<string, number>;          // ml per day
  goals: NutritionGoals;
  selectedDate: string;

  setSelectedDate: (date: string) => void;
  setGoals: (g: Partial<NutritionGoals>) => void;

  fetchLogsForDate: (date: string) => Promise<void>;
  addFoodLog: (meal: MealType, food: Omit<FoodItem, 'id'> & { source?: NutritionLog['source']; ai_confidence?: NutritionLog['ai_confidence'] }) => Promise<void>;
  removeFoodLog: (logId: string) => Promise<void>;
  addWater: (ml: number) => Promise<void>;
  analyzePhotoWithAI: (mimeType: string, base64: string) => Promise<FoodAnalysis>;

  getLogsForSelectedDate: () => NutritionLog[];
  getTotalsForDate: (date?: string) => NutritionTotals;
  getCalorieProgress: (date?: string) => number;
  getMealsGroupedForDate: (date?: string) => Record<MealType, NutritionLog[]>;
  getWaterForDate: (date?: string) => number;
  getContextSnapshot: () => Record<string, number>;
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function emptyMealMap(): Record<MealType, NutritionLog[]> {
  return { breakfast: [], lunch: [], dinner: [], snack: [] };
}

function mockAnalyze(): FoodAnalysis {
  const samples: FoodAnalysis[] = [
    { name_zh: '滷肉飯', name_en: 'Braised Pork Rice', serving_size: '1碗 (250g)', calories: 480, protein_g: 16, carbs_g: 58, fat_g: 20, confidence: 'medium' },
    { name_zh: '雞腿便當', name_en: 'Chicken Leg Bento', serving_size: '1份', calories: 750, protein_g: 38, carbs_g: 85, fat_g: 28, confidence: 'high' },
    { name_zh: '蔬菜沙拉', name_en: 'Garden Salad', serving_size: '1碗 (200g)', calories: 180, protein_g: 6, carbs_g: 18, fat_g: 9, confidence: 'low' },
  ];
  return samples[Math.floor(Math.random() * samples.length)];
}

export const useNutritionStore = create<NutritionState>()(
  persist(
    (set, get) => ({
      logs: {},
      water: {},
      goals: {
        calorie_goal: 2000,
        protein_goal_g: 150,
        carbs_goal_g: 250,
        fat_goal_g: 65,
        water_goal_ml: 2000,
        goal_type: 'maintain',
      },
      selectedDate: todayIso(),

      setSelectedDate: (date) => set({ selectedDate: date }),
      setGoals: (g) => set({ goals: { ...get().goals, ...g } }),

      fetchLogsForDate: async (date) => {
        try {
          const { data } = await apiClient.get<NutritionLog[]>('/api/nutrition/logs', { params: { date } });
          const mapped = data.map((d) => ({ ...d, log_id: d.log_id ?? (d as unknown as { id?: string }).id ?? '', name_zh: d.food_name, id: d.log_id }));
          set({ logs: { ...get().logs, [date]: mapped as NutritionLog[] } });
        } catch {
          // offline-friendly — keep whatever's in the store
        }
      },

      addFoodLog: async (meal, food) => {
        const date = get().selectedDate;
        const local: NutritionLog = {
          log_id: 'l_' + Date.now() + Math.random().toString(36).slice(2, 6),
          id: 'l_' + Date.now(),
          meal_type: meal,
          logged_at: new Date().toISOString(),
          food_name: food.name_zh,
          name_zh: food.name_zh,
          name_en: food.name_en,
          serving_size: food.serving_size,
          calories: food.calories,
          protein_g: food.protein_g,
          carbs_g: food.carbs_g,
          fat_g: food.fat_g,
          source: food.source ?? 'manual',
          ai_confidence: food.ai_confidence,
          category: food.category,
        };
        const list = [...(get().logs[date] ?? []), local];
        set({ logs: { ...get().logs, [date]: list } });

        try {
          await apiClient.post('/api/nutrition/logs', {
            meal_type: meal,
            food_name: food.name_zh,
            serving_size: food.serving_size,
            calories: food.calories,
            protein_g: food.protein_g,
            carbs_g: food.carbs_g,
            fat_g: food.fat_g,
            source: food.source ?? 'manual',
            ai_confidence: food.ai_confidence,
          });
        } catch {
          /* offline — keep local */
        }
      },

      removeFoodLog: async (logId) => {
        const date = get().selectedDate;
        const next = (get().logs[date] ?? []).filter((l) => l.log_id !== logId && l.id !== logId);
        set({ logs: { ...get().logs, [date]: next } });
        try {
          await apiClient.delete(`/api/nutrition/logs/${logId}`);
        } catch {
          /* ignore */
        }
      },

      addWater: async (ml) => {
        const date = get().selectedDate;
        const cur = get().water[date] ?? 0;
        set({ water: { ...get().water, [date]: cur + ml } });
        try {
          await apiClient.post('/api/nutrition/water', { ml });
        } catch {
          /* ignore */
        }
      },

      analyzePhotoWithAI: async (mimeType, base64) => {
        try {
          const { data } = await apiClient.post<{ analysis: FoodAnalysis }>('/api/nutrition/analyze-photo', {
            mime_type: mimeType,
            data_base64: base64,
          });
          return data.analysis;
        } catch {
          await new Promise((r) => setTimeout(r, 1200));
          return mockAnalyze();
        }
      },

      getLogsForSelectedDate: () => get().logs[get().selectedDate] ?? [],

      getTotalsForDate: (date) => {
        const d = date ?? get().selectedDate;
        const list = get().logs[d] ?? [];
        return list.reduce<NutritionTotals>(
          (acc, l) => ({
            calories: acc.calories + l.calories,
            protein_g: acc.protein_g + l.protein_g,
            carbs_g: acc.carbs_g + l.carbs_g,
            fat_g: acc.fat_g + l.fat_g,
          }),
          { calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0 },
        );
      },

      getCalorieProgress: (date) => {
        const t = get().getTotalsForDate(date);
        return Math.min(1, t.calories / Math.max(1, get().goals.calorie_goal));
      },

      getMealsGroupedForDate: (date) => {
        const d = date ?? get().selectedDate;
        const list = get().logs[d] ?? [];
        const map = emptyMealMap();
        list.forEach((l) => map[l.meal_type].push(l));
        return map;
      },

      getWaterForDate: (date) => {
        const d = date ?? get().selectedDate;
        return get().water[d] ?? 0;
      },

      getContextSnapshot: () => {
        const totals = get().getTotalsForDate();
        const date = get().selectedDate;
        const meals = (get().logs[date] ?? []).length;
        return {
          calories_consumed: Math.round(totals.calories),
          calorie_goal: get().goals.calorie_goal,
          protein_g: Math.round(totals.protein_g),
          carbs_g: Math.round(totals.carbs_g),
          fat_g: Math.round(totals.fat_g),
          water_ml: get().getWaterForDate(),
          meals_logged: meals,
        };
      },
    }),
    { name: 'fitai-nutrition' },
  ),
);
