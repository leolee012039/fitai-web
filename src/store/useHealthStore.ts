import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mockSummary } from '@/lib/mockData';
import type { DailySummary } from '@/types';

interface HealthState {
  summary: DailySummary;
  appleHealthConnected: boolean;
  lastSyncedAt: number | null;
  setSummary: (s: Partial<DailySummary>) => void;
  toggleAppleHealth: () => void;
  sync: () => void;
}

export const useHealthStore = create<HealthState>()(
  persist(
    (set, get) => ({
      summary: mockSummary,
      appleHealthConnected: true,
      lastSyncedAt: Date.now(),
      setSummary: (s) => set({ summary: { ...get().summary, ...s } }),
      toggleAppleHealth: () => set({ appleHealthConnected: !get().appleHealthConnected }),
      sync: () => {
        const current = get().summary;
        set({
          summary: {
            ...current,
            steps: current.steps + Math.floor(Math.random() * 400),
            heart_rate: 66 + Math.floor(Math.random() * 14),
          },
          lastSyncedAt: Date.now(),
          appleHealthConnected: true,
        });
      },
    }),
    { name: 'fitai-health' },
  ),
);
