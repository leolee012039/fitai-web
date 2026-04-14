import type { DailySummary, WorkoutPlan, ReportAnalysis } from '@/types';
import { isoWeekStart } from './utils';

export const mockSummary: DailySummary = {
  steps: 8432,
  calories: 542,
  heart_rate: 72,
  sleep_hours: 7.5,
};

export const mockHeartRate = [
  { day: 'Mon', value: 68 },
  { day: 'Tue', value: 74 },
  { day: 'Wed', value: 71 },
  { day: 'Thu', value: 76 },
  { day: 'Fri', value: 69 },
  { day: 'Sat', value: 78 },
  { day: 'Sun', value: 72 },
];

export const mockActivity = [
  { day: 'Mon', value: 32 },
  { day: 'Tue', value: 48 },
  { day: 'Wed', value: 20 },
  { day: 'Thu', value: 55 },
  { day: 'Fri', value: 40 },
  { day: 'Sat', value: 70 },
  { day: 'Sun', value: 25 },
];

export function defaultWorkoutPlan(): WorkoutPlan {
  return {
    id: 'local',
    week_start: isoWeekStart(),
    ai_generated: false,
    days: [
      {
        day: 'Mon',
        focus: 'Push — 胸 / 肩 / 三頭',
        exercises: [
          { id: '1', name: 'Bench Press 臥推', sets: 4, reps: '8-10', rest_seconds: 90, muscle_groups: ['胸', '三頭'] },
          { id: '2', name: 'Overhead Press 肩推', sets: 3, reps: '8-10', rest_seconds: 90, muscle_groups: ['肩'] },
          { id: '3', name: 'Incline DB Press 上斜啞鈴', sets: 3, reps: '12', rest_seconds: 60, muscle_groups: ['胸'] },
          { id: '4', name: 'Triceps Pushdown 下壓', sets: 3, reps: '15', rest_seconds: 45, muscle_groups: ['三頭'] },
        ],
      },
      {
        day: 'Tue',
        focus: 'Pull — 背 / 二頭',
        exercises: [
          { id: '5', name: 'Deadlift 硬舉', sets: 4, reps: '5', rest_seconds: 120, muscle_groups: ['背', '腿後'] },
          { id: '6', name: 'Pull-ups 引體向上', sets: 4, reps: '6-10', rest_seconds: 90, muscle_groups: ['背', '二頭'] },
          { id: '7', name: 'Barbell Row 槓鈴划船', sets: 3, reps: '10', rest_seconds: 75, muscle_groups: ['背'] },
          { id: '8', name: 'Hammer Curl 錘式彎舉', sets: 3, reps: '12', rest_seconds: 45, muscle_groups: ['二頭'] },
        ],
      },
      { day: 'Wed', focus: 'Active Recovery 主動恢復', exercises: [] },
      {
        day: 'Thu',
        focus: 'Legs — 腿',
        exercises: [
          { id: '9', name: 'Back Squat 深蹲', sets: 4, reps: '6-8', rest_seconds: 120, muscle_groups: ['股四頭', '臀'] },
          { id: '10', name: 'Romanian Deadlift 羅馬尼亞硬舉', sets: 3, reps: '10', rest_seconds: 90, muscle_groups: ['腿後', '臀'] },
          { id: '11', name: 'Walking Lunge 行走弓箭步', sets: 3, reps: '12 each', rest_seconds: 60, muscle_groups: ['股四頭'] },
          { id: '12', name: 'Calf Raise 提踵', sets: 4, reps: '15', rest_seconds: 45, muscle_groups: ['小腿'] },
        ],
      },
      {
        day: 'Fri',
        focus: 'Upper Hypertrophy 上身肌肥大',
        exercises: [
          { id: '13', name: 'DB Bench Press 啞鈴臥推', sets: 4, reps: '10', rest_seconds: 75, muscle_groups: ['胸'] },
          { id: '14', name: 'Seated Row 坐姿划船', sets: 4, reps: '10', rest_seconds: 75, muscle_groups: ['背'] },
          { id: '15', name: 'Lateral Raise 側平舉', sets: 3, reps: '15', rest_seconds: 45, muscle_groups: ['肩'] },
        ],
      },
      {
        day: 'Sat',
        focus: 'Cardio + Core 有氧 + 核心',
        exercises: [
          { id: '16', name: 'Zone 2 Run Zone 2 慢跑', sets: 1, reps: '30 min', rest_seconds: 0, muscle_groups: ['有氧'] },
          { id: '17', name: 'Plank 平板', sets: 3, reps: '60s', rest_seconds: 45, muscle_groups: ['核心'] },
          { id: '18', name: 'Hanging Leg Raise 懸吊舉腿', sets: 3, reps: '12', rest_seconds: 45, muscle_groups: ['核心'] },
        ],
      },
      { day: 'Sun', focus: 'Rest 休息', exercises: [] },
    ],
  };
}

export const mockAnalysis: ReportAnalysis = {
  biomarkers: [
    { name: '血紅素 Hemoglobin', value: '14.2', unit: 'g/dL', normalRange: '13.5-17.5' },
    { name: '維生素 D Vitamin D', value: '22', unit: 'ng/mL', normalRange: '30-100' },
    { name: '總膽固醇 Total Cholesterol', value: '210', unit: 'mg/dL', normalRange: '<200' },
    { name: 'HDL', value: '58', unit: 'mg/dL', normalRange: '>40' },
    { name: '空腹血糖 Glucose', value: '88', unit: 'mg/dL', normalRange: '70-100' },
  ],
  flagged: [
    { name: '維生素 D', value: '22 ng/mL', reason: '低於正常範圍 (30-100 ng/mL)' },
    { name: '總膽固醇', value: '210 mg/dL', reason: '略高於理想值 (<200 mg/dL)' },
  ],
  fitnessInsights: [
    '維生素 D 偏低可能影響恢復與能量 — 建議先諮詢醫師再補充。',
    'HDL 處於健康範圍；維持每週 150+ 分鐘有氧可持續保持。',
    '建議增加高纖食物（燕麥、豆類）協助平衡膽固醇。',
    '血糖表現良好 — 持續均衡飲食與阻力訓練。',
  ],
};
