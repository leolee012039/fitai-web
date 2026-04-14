import { useNavigate } from 'react-router-dom';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { Footprints, Flame, HeartPulse, Moon, Plus, RefreshCw, Smartphone } from 'lucide-react';
import { StatCard } from '@/components/StatCard';
import { NutritionDashboardCard } from '@/components/NutritionDashboardCard';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useHealthStore } from '@/store/useHealthStore';
import { formatTime } from '@/lib/utils';
import { mockHeartRate, mockActivity } from '@/lib/mockData';

export function DashboardPage() {
  const navigate = useNavigate();
  const { summary, appleHealthConnected, lastSyncedAt, sync } = useHealthStore();

  return (
    <div className="space-y-6">
      {/* Row 1 — stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Footprints size={18} />}
          label="步數"
          value={summary.steps.toLocaleString()}
          delta={{ value: '+12%', trend: 'up' }}
        />
        <StatCard
          icon={<Flame size={18} />}
          label="卡路里"
          value={summary.calories}
          unit="kcal"
          delta={{ value: '-3%', trend: 'down' }}
        />
        <StatCard
          icon={<HeartPulse size={18} />}
          label="心率"
          value={summary.heart_rate}
          unit="bpm"
          note="正常"
        />
        <StatCard
          icon={<Moon size={18} />}
          label="睡眠"
          value={summary.sleep_hours.toFixed(1)}
          unit="hrs"
          note="良好"
        />
      </div>

      {/* Row 2 — charts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <Card className="lg:col-span-3">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-base font-bold">心率趨勢</h3>
              <p className="text-xs text-text-secondary">過去 7 天 · 平均 {Math.round(mockHeartRate.reduce((a,b)=>a+b.value,0)/mockHeartRate.length)} bpm</p>
            </div>
            <div className="text-xs text-text-secondary">7 Days</div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={mockHeartRate} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
              <defs>
                <linearGradient id="hrGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F05454" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#F05454" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} width={30} />
              <Tooltip
                contentStyle={{ borderRadius: 10, border: '1px solid #E2E8F0', fontSize: 12 }}
                cursor={{ stroke: '#F05454', strokeDasharray: '3 3' }}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#F05454"
                strokeWidth={3}
                fill="url(#hrGrad)"
                dot={{ fill: '#1B2B5E', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-base font-bold">每週活動分鐘</h3>
              <p className="text-xs text-text-secondary">本週總計 {mockActivity.reduce((a, b) => a + b.value, 0)} 分鐘</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={mockActivity} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} width={30} />
              <Tooltip
                contentStyle={{ borderRadius: 10, border: '1px solid #E2E8F0', fontSize: 12 }}
                cursor={{ fill: 'rgba(240,84,84,0.08)' }}
              />
              <Bar dataKey="value" fill="#F05454" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Nutrition summary */}
      <NutritionDashboardCard />

      {/* Row 3 — devices + quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold">已連線裝置</h3>
            <span className="text-xs text-text-secondary">
              Last synced {lastSyncedAt ? formatTime(lastSyncedAt) : '—'}
            </span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-background border border-border-soft">
            <div className="w-10 h-10 rounded-xl bg-white shadow-soft flex items-center justify-center text-primary">
              <Smartphone size={18} />
            </div>
            <div className="flex-1">
              <div className="font-semibold">Apple 健康</div>
              <div className="text-xs text-text-secondary flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${appleHealthConnected ? 'bg-success' : 'bg-slate-400'}`} />
                {appleHealthConnected
                  ? `已同步 ${lastSyncedAt ? formatTime(lastSyncedAt) : ''}`
                  : '未連線'}
              </div>
            </div>
            <Button variant="subtle" size="sm" onClick={sync}>
              <RefreshCw size={12} /> 重新同步
            </Button>
          </div>
          <button
            onClick={() => alert('Integration: Fitbit / Garmin coming soon')}
            className="mt-3 w-full py-3 rounded-xl border-2 border-dashed border-border-soft text-text-secondary hover:border-accent hover:text-accent transition flex items-center justify-center gap-2 text-sm"
          >
            <Plus size={16} /> 新增裝置
          </button>
        </Card>

        <Card>
          <h3 className="text-base font-bold mb-4">快速動作</h3>
          <div className="space-y-3">
            <Button variant="accent" size="lg" className="w-full" onClick={() => navigate('/chat')}>
              問問人工智慧
            </Button>
            <Button variant="primary" size="lg" className="w-full" onClick={() => navigate('/upload')}>
              上傳健康報告
            </Button>
            <Button variant="outline" size="lg" className="w-full" onClick={() => navigate('/workouts')}>
              查看訓練計劃
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
