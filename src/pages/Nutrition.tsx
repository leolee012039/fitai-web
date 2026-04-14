import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Droplet, Sparkles, MessageCircle, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressRing } from '@/components/ProgressRing';
import { AddFoodModal } from '@/components/nutrition/AddFoodModal';
import { useNutritionStore } from '@/store/useNutritionStore';
import { cn } from '@/lib/utils';
import type { MealType, NutritionLog } from '@/types';

const MEAL_SECTIONS: { key: MealType; label: string; icon: string }[] = [
  { key: 'breakfast', label: '早餐', icon: '🍳' },
  { key: 'lunch', label: '午餐', icon: '🍱' },
  { key: 'dinner', label: '晚餐', icon: '🍽' },
  { key: 'snack', label: '點心', icon: '🍪' },
];

export function NutritionPage() {
  const navigate = useNavigate();
  const {
    selectedDate,
    goals,
    setSelectedDate,
    fetchLogsForDate,
    getMealsGroupedForDate,
    getTotalsForDate,
    getCalorieProgress,
    getWaterForDate,
    addWater,
    removeFoodLog,
  } = useNutritionStore();

  const [modalMeal, setModalMeal] = useState<MealType | null>(null);

  useEffect(() => {
    fetchLogsForDate(selectedDate);
  }, [selectedDate, fetchLogsForDate]);

  const totals = getTotalsForDate();
  const progress = getCalorieProgress();
  const grouped = getMealsGroupedForDate();
  const water = getWaterForDate();

  const aiInsight = useMemo(() => buildInsight(totals, goals), [totals, goals]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[200px]">
          <h2 className="text-2xl font-bold">今日飲食</h2>
          <p className="text-xs text-text-secondary mt-0.5">記錄每一餐，讓 AI 幫您分析營養</p>
        </div>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          max={new Date().toISOString().slice(0, 10)}
          className="px-3 py-2 rounded-lg border border-border-soft bg-white text-sm"
        />
        <div className="px-4 py-2 rounded-full bg-accent text-white font-bold text-sm shadow-soft">
          已攝取 {Math.round(totals.calories)} / {goals.calorie_goal} kcal
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-6">
        <div className="space-y-6">
          {/* Macros card */}
          <Card>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="shrink-0">
                <ProgressRing progress={progress} size={160} stroke={14} label="熱量" />
                <div className="text-center mt-2 text-xs text-text-secondary">
                  還剩 {Math.max(0, goals.calorie_goal - Math.round(totals.calories))} kcal
                </div>
              </div>
              <div className="flex-1 w-full space-y-3">
                <MacroBar label="蛋白質" color="#3B82F6" current={totals.protein_g} goal={goals.protein_goal_g} unit="g" />
                <MacroBar label="碳水" color="#F9A825" current={totals.carbs_g} goal={goals.carbs_goal_g} unit="g" />
                <MacroBar label="脂肪" color="#F05454" current={totals.fat_g} goal={goals.fat_goal_g} unit="g" />
                <div className="mt-4 flex items-center gap-3 p-3 rounded-xl bg-blue-50 border border-blue-100">
                  <Droplet size={18} className="text-blue-500" />
                  <div className="flex-1">
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span>飲水 {water} ml</span>
                      <span className="text-text-secondary">目標 {goals.water_goal_ml} ml</span>
                    </div>
                    <div className="w-full h-2 bg-blue-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 transition-all" style={{ width: `${Math.min(100, (water / goals.water_goal_ml) * 100)}%` }} />
                    </div>
                  </div>
                  <Button size="sm" variant="subtle" onClick={() => addWater(250)}>
                    <Plus size={12} /> 250ml
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* AI insight */}
          <Card className="border-l-4 border-accent">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
                <Sparkles size={18} />
              </div>
              <div className="flex-1">
                <div className="font-bold mb-1">AI 洞察</div>
                <p className="text-sm text-primary/90 leading-relaxed">{aiInsight}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => navigate('/chat?topic=nutrition')}
                >
                  <MessageCircle size={14} /> 問更多
                </Button>
              </div>
            </div>
          </Card>

          {/* Meal sections */}
          <div className="space-y-4">
            {MEAL_SECTIONS.map((m) => {
              const list = grouped[m.key];
              const total = list.reduce((a, b) => a + b.calories, 0);
              return (
                <Card key={m.key} padded={false}>
                  <div className="flex items-center justify-between px-5 py-4 border-b border-border-soft/60">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{m.icon}</div>
                      <div>
                        <div className="font-bold">{m.label}</div>
                        <div className="text-xs text-text-secondary">
                          {list.length > 0 ? `${list.length} 項 · ${Math.round(total)} kcal` : '尚未記錄'}
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="accent" onClick={() => setModalMeal(m.key)}>
                      <Plus size={12} /> 新增
                    </Button>
                  </div>
                  {list.length > 0 && (
                    <div className="divide-y divide-border-soft/60">
                      {list.map((l) => (
                        <LogRow key={l.log_id ?? l.id} log={l} onRemove={() => removeFoodLog(l.log_id ?? l.id)} />
                      ))}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>

        {/* Right rail — weekly summary + goals */}
        <div className="space-y-4">
          <Card>
            <h3 className="font-bold mb-3">今日目標</h3>
            <div className="space-y-2 text-sm">
              <GoalRow label="熱量" current={Math.round(totals.calories)} goal={goals.calorie_goal} unit="kcal" />
              <GoalRow label="蛋白質" current={Math.round(totals.protein_g)} goal={goals.protein_goal_g} unit="g" />
              <GoalRow label="碳水" current={Math.round(totals.carbs_g)} goal={goals.carbs_goal_g} unit="g" />
              <GoalRow label="脂肪" current={Math.round(totals.fat_g)} goal={goals.fat_goal_g} unit="g" />
              <GoalRow label="飲水" current={Math.round(water)} goal={goals.water_goal_ml} unit="ml" />
            </div>
            <div className="mt-4 text-[11px] text-text-secondary">
              目標類型：
              <Badge tone="accent" className="ml-1">
                {goals.goal_type === 'lose_fat' ? '減脂' : goals.goal_type === 'gain_muscle' ? '增肌' : '維持'}
              </Badge>
            </div>
          </Card>

          <Card>
            <h3 className="font-bold mb-3">本週概覽</h3>
            <p className="text-xs text-text-secondary">持續記錄讓 AI 更精準分析趨勢</p>
            <ul className="mt-3 space-y-2 text-xs">
              <li className="flex justify-between">
                <span className="text-text-secondary">已記錄天數</span>
                <span className="font-bold">3 / 7</span>
              </li>
              <li className="flex justify-between">
                <span className="text-text-secondary">平均熱量</span>
                <span className="font-bold">1,840 kcal</span>
              </li>
              <li className="flex justify-between">
                <span className="text-text-secondary">平均蛋白質</span>
                <span className="font-bold">118 g</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>

      {modalMeal && <AddFoodModal meal={modalMeal} onClose={() => setModalMeal(null)} />}
    </div>
  );
}

function MacroBar({
  label, color, current, goal, unit,
}: {
  label: string;
  color: string;
  current: number;
  goal: number;
  unit: string;
}) {
  const pct = Math.min(100, (current / Math.max(1, goal)) * 100);
  return (
    <div>
      <div className="flex justify-between text-xs font-semibold mb-1">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ background: color }} />
          {label}
        </span>
        <span className="text-text-secondary">
          <span className="text-primary font-bold">{current.toFixed(1)}</span> / {goal} {unit}
        </span>
      </div>
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

function GoalRow({
  label, current, goal, unit,
}: {
  label: string;
  current: number;
  goal: number;
  unit: string;
}) {
  const pct = Math.min(100, (current / Math.max(1, goal)) * 100);
  return (
    <div>
      <div className="flex justify-between">
        <span>{label}</span>
        <span className="font-bold">
          {current}
          <span className="text-text-secondary"> / {goal} {unit}</span>
        </span>
      </div>
      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
        <div className="h-full bg-accent" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function LogRow({ log, onRemove }: { log: NutritionLog; onRemove: () => void }) {
  const [deleting, setDeleting] = useState(false);
  return (
    <div
      className={cn(
        'flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition',
        deleting && 'opacity-40 pointer-events-none',
      )}
    >
      <div className="flex-1 min-w-0">
        <div className="font-semibold truncate">{log.food_name || log.name_zh}</div>
        <div className="text-[11px] text-text-secondary">
          {log.serving_size ?? ''} · P {log.protein_g.toFixed(0)}g · C {log.carbs_g.toFixed(0)}g · F {log.fat_g.toFixed(0)}g
          {log.source === 'photo_ai' && (
            <span className="ml-1.5 text-accent">· 📷 AI</span>
          )}
        </div>
      </div>
      <div className="text-sm font-bold">{Math.round(log.calories)} kcal</div>
      <button
        onClick={() => {
          setDeleting(true);
          onRemove();
        }}
        className="text-text-muted hover:text-red-500 p-1"
        aria-label="刪除"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}

function buildInsight(totals: { calories: number; protein_g: number; carbs_g: number; fat_g: number }, goals: { calorie_goal: number; protein_goal_g: number }) {
  if (totals.calories === 0) {
    return '今天還沒記錄飲食。記錄您的第一餐，AI 會根據您的訓練與營養目標提供建議。';
  }
  const proteinGap = goals.protein_goal_g - totals.protein_g;
  const calGap = goals.calorie_goal - totals.calories;
  if (proteinGap > 30) {
    return `今天練腿消耗約 450 kcal，蛋白質攝取不足 (${Math.round(totals.protein_g)}g / ${goals.protein_goal_g}g)，建議在晚餐補充雞胸肉或豆腐。還可攝取 ${Math.round(calGap)} kcal。`;
  }
  if (totals.calories > goals.calorie_goal) {
    return `今日熱量已達標。考慮增加活動量 (20 分鐘快走) 或將晚餐改為清淡的蛋白質與蔬菜組合。`;
  }
  return `目前進度良好！已攝取 ${Math.round(totals.calories)} kcal，蛋白質 ${Math.round(totals.protein_g)}g。保持均衡比例，並記得補充水分。`;
}
