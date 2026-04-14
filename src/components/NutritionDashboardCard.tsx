import { useNavigate } from 'react-router-dom';
import { ArrowRight, Utensils } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useNutritionStore } from '@/store/useNutritionStore';

export function NutritionDashboardCard() {
  const navigate = useNavigate();
  const { goals, getTotalsForDate, getCalorieProgress } = useNutritionStore();
  const totals = getTotalsForDate();
  const progress = getCalorieProgress();

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
            <Utensils size={18} />
          </div>
          <div>
            <h3 className="text-base font-bold">今日飲食</h3>
            <p className="text-xs text-text-secondary">Nutrition summary</p>
          </div>
        </div>
        <Button size="sm" variant="ghost" onClick={() => navigate('/nutrition')}>
          查看詳細飲食紀錄 <ArrowRight size={14} />
        </Button>
      </div>

      <div className="mb-3">
        <div className="flex justify-between text-xs font-semibold mb-1">
          <span>熱量</span>
          <span className="text-text-secondary">
            <span className="text-primary font-bold">{Math.round(totals.calories)}</span> / {goals.calorie_goal} kcal
          </span>
        </div>
        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-accent transition-all" style={{ width: `${progress * 100}%` }} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Mini label="蛋白質" color="#3B82F6" current={totals.protein_g} goal={goals.protein_goal_g} />
        <Mini label="碳水" color="#F9A825" current={totals.carbs_g} goal={goals.carbs_goal_g} />
        <Mini label="脂肪" color="#F05454" current={totals.fat_g} goal={goals.fat_goal_g} />
      </div>
    </Card>
  );
}

function Mini({ label, color, current, goal }: { label: string; color: string; current: number; goal: number }) {
  const pct = Math.min(100, (current / Math.max(1, goal)) * 100);
  return (
    <div>
      <div className="flex justify-between text-[11px] mb-1">
        <span className="flex items-center gap-1 font-semibold">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
          {label}
        </span>
        <span className="text-text-secondary">
          {Math.round(current)}/{goal}g
        </span>
      </div>
      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}
