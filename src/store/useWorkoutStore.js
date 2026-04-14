import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { defaultWorkoutPlan } from '@/lib/mockData';
function todayStr() {
    const names = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const label = names[new Date().getDay()];
    return label === 'Sun' ? 'Sun' : label;
}
export const useWorkoutStore = create()(persist((set, get) => ({
    plan: defaultWorkoutPlan(),
    activeDay: todayStr(),
    completed: { Mon: true, Tue: true },
    setActiveDay: (day) => set({ activeDay: day }),
    markComplete: (day) => set({ completed: { ...get().completed, [day]: !get().completed[day] } }),
    replacePlan: (plan) => set({ plan }),
}), { name: 'fitai-workout' }));
