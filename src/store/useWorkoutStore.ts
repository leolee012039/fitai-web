import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { defaultWorkoutPlan } from '@/lib/mockData';
import type { WorkoutPlan } from '@/types';

interface WorkoutState {
  plan: WorkoutPlan;
  activeDay: string;
  completed: Record<string, boolean>;
  setActiveDay: (day: string) => void;
  markComplete: (day: string) => void;
  replacePlan: (plan: WorkoutPlan) => void;
}

function todayStr() {
  const names = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const label = names[new Date().getDay()];
  return label === 'Sun' ? 'Sun' : label;
}

export const useWorkoutStore = create<WorkoutState>()(
  persist(
    (set, get) => ({
      plan: defaultWorkoutPlan(),
      activeDay: todayStr(),
      completed: { Mon: true, Tue: true },
      setActiveDay: (day) => set({ activeDay: day }),
      markComplete: (day) =>
        set({ completed: { ...get().completed, [day]: !get().completed[day] } }),
      replacePlan: (plan) => set({ plan }),
    }),
    { name: 'fitai-workout' },
  ),
);
