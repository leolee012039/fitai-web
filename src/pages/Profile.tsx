import { useRef, useState } from 'react';
import { Camera, Download, Trash2, LogOut, Smartphone, Apple } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Toggle } from '@/components/ui/Toggle';
import { Badge } from '@/components/ui/Badge';
import { useProfileStore } from '@/store/useProfileStore';
import { useHealthStore } from '@/store/useHealthStore';

export function ProfilePage() {
  const { user, toggles, updateUser, toggle } = useProfileStore();
  const { appleHealthConnected, toggleAppleHealth } = useHealthStore();
  const avatarInput = useRef<HTMLInputElement>(null);
  const [avatar, setAvatar] = useState<string | null>(user.avatar_url ?? null);
  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    age: String(user.age ?? ''),
    weight: String(user.weight ?? ''),
    height: String(user.height ?? ''),
    goal: user.fitness_goal ?? '',
  });

  const onAvatar = (files: FileList | null) => {
    const f = files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setAvatar(url);
    updateUser({ avatar_url: url });
  };

  const saveProfile = () => {
    updateUser({
      name: form.name,
      email: form.email,
      age: form.age ? Number(form.age) : undefined,
      weight: form.weight ? Number(form.weight) : undefined,
      height: form.height ? Number(form.height) : undefined,
      fitness_goal: form.goal,
    });
    setEditing(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 space-y-6">
        <Card className="text-center">
          <div className="relative inline-block">
            <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
              {avatar ? <img src={avatar} alt={user.name} className="w-full h-full object-cover" /> : user.name[0]}
            </div>
            <button
              onClick={() => avatarInput.current?.click()}
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center shadow-card hover:scale-105 transition"
              aria-label="更換頭像"
            >
              <Camera size={14} />
            </button>
            <input
              ref={avatarInput}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => onAvatar(e.target.files)}
            />
          </div>
          <div className="font-bold text-lg mt-4">{user.name}</div>
          <div className="text-xs text-text-secondary">{user.email}</div>
          <Badge tone="warning" className="mt-3">🏋️ FITAI Gold 會員</Badge>
        </Card>

        <Card>
          <h3 className="text-base font-bold mb-2">使用統計</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-text-secondary">加入天數</span>
              <span className="font-bold">128 天</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">訓練紀錄</span>
              <span className="font-bold">47 次</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">AI 對話</span>
              <span className="font-bold">132 則</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">分析報告</span>
              <span className="font-bold">5 份</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="lg:col-span-2 space-y-6">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold">基本資料</h3>
            {editing ? (
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setEditing(false)}>取消</Button>
                <Button size="sm" variant="accent" onClick={saveProfile}>儲存</Button>
              </div>
            ) : (
              <Button size="sm" variant="subtle" onClick={() => setEditing(true)}>編輯</Button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="姓名" value={form.name} editing={editing} onChange={(v) => setForm({ ...form, name: v })} />
            <Field label="電子郵件" value={form.email} editing={editing} onChange={(v) => setForm({ ...form, email: v })} type="email" />
            <Field label="年齡" value={form.age} editing={editing} onChange={(v) => setForm({ ...form, age: v })} suffix="歲" />
            <Field label="身高" value={form.height} editing={editing} onChange={(v) => setForm({ ...form, height: v })} suffix="cm" />
            <Field label="體重" value={form.weight} editing={editing} onChange={(v) => setForm({ ...form, weight: v })} suffix="kg" />
            <Field label="健身目標" value={form.goal} editing={editing} onChange={(v) => setForm({ ...form, goal: v })} />
          </div>
        </Card>

        <Card>
          <h3 className="text-base font-bold mb-4">連線帳號</h3>
          <div className="space-y-3">
            <ConnectedRow
              icon={<Apple size={18} />}
              title="Apple 健康"
              subtitle={appleHealthConnected ? '已連線 · 背景同步中' : '未連線'}
              on={appleHealthConnected}
              onToggle={toggleAppleHealth}
            />
            <ConnectedRow
              icon={<Smartphone size={18} />}
              title="手動輸入"
              subtitle="當 Apple 健康無法使用時的備援"
              on={toggles.manualEntry}
              onToggle={() => toggle('manualEntry')}
            />
          </div>
        </Card>

        <Card>
          <h3 className="text-base font-bold mb-4">通知設定</h3>
          <div className="space-y-3">
            <ToggleRow title="訓練提醒" subtitle="排定訓練日當天推送提醒" on={toggles.notifWorkouts} onToggle={() => toggle('notifWorkouts')} />
            <ToggleRow title="報告分析完成" subtitle="AI 分析完成時通知" on={toggles.notifReports} onToggle={() => toggle('notifReports')} />
            <ToggleRow title="AI 教練提示" subtitle="每日健康建議" on={toggles.notifAi} onToggle={() => toggle('notifAi')} />
          </div>
        </Card>

        <Card>
          <h3 className="text-base font-bold mb-4">資料與隱私</h3>
          <div className="space-y-3">
            <ToggleRow
              title="分享匿名化資料"
              subtitle="協助我們改善 AI 建議品質"
              on={toggles.shareAnonymized}
              onToggle={() => toggle('shareAnonymized')}
            />
            <ActionRow icon={<Download size={16} />} title="匯出我的資料" subtitle="下載所有健康資料" />
            <ActionRow icon={<Trash2 size={16} />} title="刪除帳號" subtitle="永久移除所有資料" danger />
          </div>
        </Card>

        <Button variant="outline" size="lg" className="w-full">
          <LogOut size={16} /> 登出
        </Button>
      </div>
    </div>
  );
}

function Field({
  label, value, editing, onChange, type = 'text', suffix,
}: {
  label: string;
  value: string;
  editing: boolean;
  onChange: (v: string) => void;
  type?: string;
  suffix?: string;
}) {
  return (
    <div>
      <div className="text-xs font-semibold text-text-secondary uppercase tracking-wide">{label}</div>
      {editing ? (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-1 w-full px-3 py-2 rounded-lg border border-border-soft focus:border-accent outline-none text-sm"
        />
      ) : (
        <div className="mt-1 text-base font-semibold">{value || '—'}{suffix && value ? ` ${suffix}` : ''}</div>
      )}
    </div>
  );
}

function ConnectedRow({
  icon, title, subtitle, on, onToggle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  on: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-border-soft">
      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary">{icon}</div>
      <div className="flex-1">
        <div className="font-semibold">{title}</div>
        <div className="text-xs text-text-secondary">{subtitle}</div>
      </div>
      <Toggle on={on} onChange={onToggle} label={title} />
    </div>
  );
}

function ToggleRow({
  title, subtitle, on, onToggle,
}: {
  title: string;
  subtitle?: string;
  on: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="flex-1">
        <div className="font-semibold text-sm">{title}</div>
        {subtitle && <div className="text-xs text-text-secondary mt-0.5">{subtitle}</div>}
      </div>
      <Toggle on={on} onChange={onToggle} label={title} />
    </div>
  );
}

function ActionRow({
  icon, title, subtitle, danger,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  danger?: boolean;
}) {
  return (
    <button className={`w-full flex items-center gap-3 py-3 px-1 border-t border-border-soft text-left hover:bg-slate-50 rounded-lg transition ${danger ? 'text-red-600' : ''}`}>
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${danger ? 'bg-red-50' : 'bg-slate-100'}`}>
        {icon}
      </div>
      <div className="flex-1">
        <div className="font-semibold text-sm">{title}</div>
        {subtitle && <div className="text-xs text-text-secondary">{subtitle}</div>}
      </div>
      <span className="text-text-muted">›</span>
    </button>
  );
}
