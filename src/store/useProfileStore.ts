import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/types';

interface ProfileState {
  user: User;
  toggles: {
    manualEntry: boolean;
    notifWorkouts: boolean;
    notifReports: boolean;
    notifAi: boolean;
    shareAnonymized: boolean;
  };
  updateUser: (u: Partial<User>) => void;
  toggle: (key: keyof ProfileState['toggles']) => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
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
      toggle: (key) =>
        set({ toggles: { ...get().toggles, [key]: !get().toggles[key] } }),
    }),
    { name: 'fitai-profile' },
  ),
);
