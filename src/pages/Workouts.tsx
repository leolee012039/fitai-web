import { useState } from 'react';
import { Play, Sparkles, Check } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressRing } from '@/components/ProgressRing';
import { useWorkoutStore } from '@/store/useWorkoutStore';
import { defaultWorkoutPlan } from '@/lib/mockData';
import { cn } from '@/lib/utils';

export function WorkoutsPage() {
  const { plan, activeDay, completed, setActiveDay, markComplete, replacePlan } = useWorkoutStore();
  const [generating, setGenerating] = useState(false);
  const today = plan.days.find((d) => d.day === activeDay) ?? plan.days[0];
  const workoutDays = plan.days.filter((d) => d.exercises.length > 0);
  const doneCount = workoutDays.filter((d) => completed[d.day]).length;
  const progress = workoutDays.length ? doneCount / workoutDays.length : 0;

  const generate = () => {
    setGenerating(true);
    setTimeout(() => {
      const next = defaultWorkoutPlan();
      next.ai_generated = true;
      next.days.forEach((d) =>
        d.exercises.forEach((ex) => {
          if (typeof ex.sets === 'number') ex.sets = Math.max(2, ex.sets + (Math.random() > 0.5 ? 1 : -1));
        }),
      );
      replacePlan(next);
      setGenerating(false);
    }, 1400);
  };

  return (
    <div className="space-y-6">
      {/* Week strip */}
      <Card>
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold">本週訓練</h3>
            <p className="text-xs text-text-secondary">Week of {plan.week_start}</p>
          </div>
          <ProgressRing progress={progress} size={80} stroke={9} label="進度" />
        </div>
        <div className="grid grid-cols-7 gap-2">
          {plan.days.map((d) => {
            const isToday = d.day === activeDay;
            const isDone = completed[d.day];
            const isRest = d.exercises.length === 0;
            return (
              <button
                key={d.day}
                onClick={() => setActiveDay(d.day)}
                className={cn(
                  'p-3 rounded-xl text-center transition border',
                  isToday
                    ? 'bg-accent text-white border-accent shadow-card'
                    : isRest
                      ? 'bg-slate-50 border-border-soft text-text-secondary'
                      : 'bg-white border-border-soft hover:border-accent/60',
                )}
              >
                <div className={cn('text-[11px]', isToday ? 'text-white/80' : 'text-text-secondary')}>
                  {d.day}
                </div>
                <div className="font-bold text-base mt-0.5">{d.day}</div>
                <div className="mt-1 flex justify-center">
                  {isDone ? (
                    <Check size={12} className={isToday ? 'text-white' : 'text-success'} />
                  ) : (
                    <span
                      className={cn(
                        'w-1.5 h-1.5 rounded-full',
                        isToday ? 'bg-white' : isRest ? 'bg-text-muted' : 'bg-accent',
                      )}
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Today's workout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs text-text-secondary">{today.day} · 今日訓練</div>
              <h3 className="text-xl font-bold mt-1">{today.focus}</h3>
            </div>
            {today.exercises.length > 0 && (
              <Button
                variant={completed[today.day] ? 'outline' : 'accent'}
                onClick={() => markComplete(today.day)}
              >
                {completed[today.day] ? '已完成 ✓' : (<><Play size={14} /> 開始訓練</>)}
              </Button>
            )}
          </div>

          {today.exercises.length === 0 ? (
            <div className="mt-6 p-8 bg-slate-50 rounded-xl text-center">
              <div className="text-2xl mb-1">🌿</div>
              <div className="font-bold">休息日</div>
              <div className="text-sm text-text-secondary mt-1">補充水分、輕度活動 20-30 分鐘。</div>
            </div>
          ) : (
            <div className="mt-5 space-y-2">
              {today.exercises.map((ex) => (
                <div
                  key={ex.id}
                  className="p-4 rounded-xl border border-border-soft bg-slate-50/60 hover:bg-white hover:border-accent/30 transition"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{ex.name}</div>
                      <div className="text-xs text-text-secondary mt-0.5">
                        {ex.sets} × {ex.reps} · 組間休息 {ex.rest_seconds}s
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {ex.muscle_groups.map((m) => (
                        <Badge key={m} tone="accent">{m}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="bg-gradient-to-br from-primary to-[#2A3D7A] text-white">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4">
            <Sparkles size={20} />
          </div>
          <h3 className="text-lg font-bold">AI 訓練計劃產生器</h3>
          <p className="text-sm text-white/80 mt-2">
            依您的年齡、體重、恢復狀態與目標，由 Claude 產生一週客製化訓練。
          </p>
          <Button
            variant="accent"
            size="lg"
            className="w-full mt-5"
            onClick={generate}
            loading={generating}
          >
            <Sparkles size={14} /> AI 生成計劃
          </Button>
          {plan.ai_generated && (
            <div className="mt-3 text-[11px] text-white/70 text-center">
              目前顯示為 AI 生成計劃
            </div>
          )}
        </Card>
      </div>

      {/* Weekly overview */}
      <div>
        <h3 className="text-base font-bold mb-3">本週概覽</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3">
          {plan.days.map((d) => (
            <Card key={d.day} className="p-4">
              <div className="flex items-center justify-between">
                <div className="font-bold">{d.day}</div>
                {completed[d.day] && <Check size={14} className="text-success" />}
              </div>
              <div className="text-xs text-text-secondary mt-1 line-clamp-2 min-h-[32px]">
                {d.focus}
              </div>
              <div className="text-[11px] text-text-muted mt-2">
                {d.exercises.length > 0 ? `${d.exercises.length} 項動作` : '休息'}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
