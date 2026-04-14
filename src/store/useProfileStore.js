import { create } from 'zustand';
import { persist } from 'zustand/middleware';
export const useProfileStore = create()(persist((set, get) => ({
    user: {
        name: 'Alex Chen',
        email: 'alex@fitai.com',
        age: 28,
        weight: 72,
        height: 178,
        fitness_goal: 'Build lean muscle & improve recovery',
    },
    toggles: {
        manualEntry: false,
        notifWorkouts: true,
        notifReports: true,
        notifAi: false,
        shareAnonymized: false,
    },
    updateUser: (u) => set({ user: { ...get().user, ...u } }),
    toggle: (key) => set({ toggles: { ...get().toggles, [key]: !get().toggles[key] } }),
}), { name: 'fitai-profile' }));
