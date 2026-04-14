import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(ts: number | Date = Date.now()) {
  const d = typeof ts === 'number' ? new Date(ts) : ts;
  return d.toLocaleTimeString('zh-Hant', { hour: '2-digit', minute: '2-digit' });
}

export function isoWeekStart(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff)).toISOString().slice(0, 10);
}
