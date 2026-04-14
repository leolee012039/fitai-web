import { useEffect, useRef, useState } from 'react';
import { Camera, Search, Pencil, X, AlertTriangle, Sparkles, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useNutritionStore } from '@/store/useNutritionStore';
import { searchFoods } from '@/lib/taiwaneseFoods';
import { apiClient } from '@/lib/api';
import type { FoodAnalysis, FoodItem, MealType } from '@/types';
import { cn } from '@/lib/utils';

type Tab = 'photo' | 'search' | 'manual';

interface Props {
  meal: MealType;
  onClose: () => void;
}

const MEAL_LABELS: Record<MealType, string> = {
  breakfast: '早餐',
  lunch: '午餐',
  dinner: '晚餐',
  snack: '點心',
};

export function AddFoodModal({ meal, onClose }: Props) {
  const [tab, setTab] = useState<Tab>('search');
  const addFood = useNutritionStore((s) => s.addFoodLog);
  const analyze = useNutritionStore((s) => s.analyzePhotoWithAI);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end lg:items-center justify-center p-0 lg:p-6 animate-in fade-in"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full lg:max-w-2xl rounded-t-3xl lg:rounded-2xl shadow-2xl flex flex-col max-h-[92vh]"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-soft">
          <div>
            <h3 className="text-lg font-bold">新增食物</h3>
            <p className="text-xs text-text-secondary">加入到「{MEAL_LABELS[meal]}」</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center" aria-label="關閉">
            <X size={18} />
          </button>
        </div>

        <div className="flex border-b border-border-soft px-4">
          <TabButton active={tab === 'photo'} onClick={() => setTab('photo')} icon={<Camera size={14} />}>拍照辨識</TabButton>
          <TabButton active={tab === 'search'} onClick={() => setTab('search')} icon={<Search size={14} />}>搜尋食物</TabButton>
          <TabButton active={tab === 'manual'} onClick={() => setTab('manual')} icon={<Pencil size={14} />}>手動輸入</TabButton>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {tab === 'photo' && (
            <PhotoTab
              onConfirm={async (food) => {
                await addFood(meal, {
                  name_zh: food.name_zh,
                  name_en: food.name_en,
                  serving_size: food.serving_size,
                  calories: food.calories,
                  protein_g: food.protein_g,
                  carbs_g: food.carbs_g,
                  fat_g: food.fat_g,
                  source: 'photo_ai',
                  ai_confidence: food.confidence,
                });
                onClose();
              }}
              analyze={analyze}
            />
          )}
          {tab === 'search' && (
            <SearchTab
              onPick={async (f, qty) => {
                await addFood(meal, {
                  name_zh: f.name_zh,
                  name_en: f.name_en,
                  serving_size: qty > 1 ? `${f.serving_size} × ${qty}` : f.serving_size,
                  calories: f.calories * qty,
                  protein_g: f.protein_g * qty,
                  carbs_g: f.carbs_g * qty,
                  fat_g: f.fat_g * qty,
                  source: 'search',
                });
                onClose();
              }}
            />
          )}
          {tab === 'manual' && (
            <ManualTab
              onSubmit={async (food) => {
                await addFood(meal, { ...food, source: 'manual' });
                onClose();
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function TabButton({
  active, onClick, children, icon,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  icon: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-semibold border-b-2 -mb-px transition',
        active ? 'border-accent text-accent' : 'border-transparent text-text-secondary hover:text-primary',
      )}
    >
      {icon}
      {children}
    </button>
  );
}

/* ------------------------- Photo tab ------------------------- */
function PhotoTab({
  onConfirm,
  analyze,
}: {
  onConfirm: (food: FoodAnalysis) => Promise<void>;
  analyze: (mime: string, b64: string) => Promise<FoodAnalysis>;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [image, setImage] = useState<string | null>(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FoodAnalysis | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    if (cameraOn && videoRef.current) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: 'environment' } })
        .then((s) => {
          stream = s;
          if (videoRef.current) videoRef.current.srcObject = s;
        })
        .catch(() => setCameraOn(false));
    }
    return () => {
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, [cameraOn]);

  const runAnalysis = async (mime: string, b64: string) => {
    setLoading(true);
    try {
      const r = await analyze(mime, b64);
      setResult(r);
    } finally {
      setLoading(false);
    }
  };

  const capture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const v = videoRef.current;
    const c = canvasRef.current;
    c.width = v.videoWidth;
    c.height = v.videoHeight;
    c.getContext('2d')!.drawImage(v, 0, 0);
    const dataUrl = c.toDataURL('image/jpeg', 0.85);
    setImage(dataUrl);
    setCameraOn(false);
    const b64 = dataUrl.split(',')[1];
    runAnalysis('image/jpeg', b64);
  };

  const onFile = (f: File | undefined) => {
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setImage(dataUrl);
      const b64 = dataUrl.split(',')[1];
      runAnalysis(f.type, b64);
    };
    reader.readAsDataURL(f);
  };

  const reset = () => {
    setImage(null);
    setResult(null);
  };

  return (
    <div className="space-y-4">
      {!image ? (
        <>
          <div className="rounded-2xl overflow-hidden bg-black aspect-video flex items-center justify-center">
            {cameraOn ? (
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            ) : (
              <div className="text-white/60 text-center p-6">
                <Camera size={40} className="mx-auto mb-2" />
                <div className="text-sm">開啟相機拍攝您的餐點，AI 會自動辨識熱量與營養素</div>
              </div>
            )}
            <canvas ref={canvasRef} className="hidden" />
          </div>
          <div className="flex flex-wrap gap-2">
            {!cameraOn ? (
              <Button variant="accent" onClick={() => setCameraOn(true)}>
                <Camera size={14} /> 開啟相機
              </Button>
            ) : (
              <Button variant="accent" onClick={capture}>
                <Camera size={14} /> 拍攝
              </Button>
            )}
            <Button variant="outline" onClick={() => fileRef.current?.click()}>上傳圖片</Button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => onFile(e.target.files?.[0])}
            />
          </div>
        </>
      ) : (
        <>
          <div className="rounded-2xl overflow-hidden">
            <img src={image} alt="餐點" className="w-full max-h-80 object-cover" />
          </div>
          {loading ? (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-accent/5">
              <Sparkles size={18} className="text-accent animate-pulse" />
              <div className="text-sm font-semibold">AI 正在辨識中...</div>
            </div>
          ) : result ? (
            <AnalysisEditableCard initial={result} onConfirm={onConfirm} />
          ) : null}
          <div className="flex gap-2">
            <Button variant="outline" onClick={reset}>重拍</Button>
          </div>
        </>
      )}
    </div>
  );
}

function AnalysisEditableCard({
  initial,
  onConfirm,
}: {
  initial: FoodAnalysis;
  onConfirm: (food: FoodAnalysis) => Promise<void>;
}) {
  const [food, setFood] = useState<FoodAnalysis>(initial);

  const setN = (k: keyof FoodAnalysis) => (v: string) => {
    if (['calories', 'protein_g', 'carbs_g', 'fat_g'].includes(String(k))) {
      setFood({ ...food, [k]: Number(v) || 0 });
    } else {
      setFood({ ...food, [k]: v } as FoodAnalysis);
    }
  };

  const conf = food.confidence;
  return (
    <div className={cn(
      'rounded-2xl p-4 border',
      conf === 'high' ? 'border-emerald-200 bg-emerald-50/50' :
      conf === 'medium' ? 'border-amber-200 bg-amber-50/50' :
      'border-red-200 bg-red-50/50',
    )}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="font-bold text-lg">{food.name_zh}</div>
          <div className="text-xs text-text-secondary">{food.name_en} · {food.serving_size}</div>
        </div>
        <Badge tone={conf === 'high' ? 'success' : conf === 'medium' ? 'warning' : 'danger'}>
          信心度 {conf}
        </Badge>
      </div>

      {conf === 'low' && (
        <div className="flex items-center gap-2 mb-3 p-2.5 rounded-lg bg-red-50 text-red-700 text-xs">
          <AlertTriangle size={14} />
          估算可能不準確，建議手動調整
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        <EditField label="名稱" value={food.name_zh} onChange={setN('name_zh')} />
        <EditField label="份量" value={food.serving_size} onChange={setN('serving_size')} />
        <EditField label="熱量 (kcal)" value={String(food.calories)} onChange={setN('calories')} type="number" />
        <EditField label="蛋白質 (g)" value={String(food.protein_g)} onChange={setN('protein_g')} type="number" />
        <EditField label="碳水 (g)" value={String(food.carbs_g)} onChange={setN('carbs_g')} type="number" />
        <EditField label="脂肪 (g)" value={String(food.fat_g)} onChange={setN('fat_g')} type="number" />
      </div>

      <Button variant="accent" className="w-full mt-4" onClick={() => onConfirm(food)}>
        <Check size={14} /> 確認加入
      </Button>
    </div>
  );
}

function EditField({
  label, value, onChange, type = 'text',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <div className="text-[10px] font-semibold text-text-secondary uppercase tracking-wide">{label}</div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full px-3 py-2 rounded-lg border border-border-soft bg-white focus:border-accent outline-none text-sm"
      />
    </label>
  );
}

/* ------------------------- Search tab ------------------------- */
function SearchTab({ onPick }: { onPick: (f: FoodItem, qty: number) => Promise<void> }) {
  const [q, setQ] = useState('');
  const [debounced, setDebounced] = useState('');
  const [results, setResults] = useState<FoodItem[]>([]);
  const [picked, setPicked] = useState<FoodItem | null>(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(q), 300);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    if (!debounced) {
      setResults([]);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const { data } = await apiClient.get<FoodItem[]>('/api/nutrition/foods/search', { params: { q: debounced } });
        if (!cancelled) {
          setResults(
            data.map((d) => ({
              ...d,
              calories: (d as unknown as { calories_per_serving?: number }).calories_per_serving ?? d.calories,
            })),
          );
        }
      } catch {
        if (!cancelled) setResults(searchFoods(debounced));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [debounced]);

  if (picked) {
    return (
      <div>
        <button onClick={() => setPicked(null)} className="text-xs text-text-secondary hover:text-primary mb-3">← 返回搜尋</button>
        <div className="rounded-2xl border border-border-soft p-4 bg-slate-50">
          <div className="font-bold text-lg">{picked.name_zh}</div>
          <div className="text-xs text-text-secondary">{picked.name_en} · {picked.serving_size}</div>
          <div className="mt-4 flex items-center gap-3">
            <span className="text-sm font-semibold">份數</span>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => setQty(Math.max(0.25, qty - 0.25))}>−</Button>
              <div className="w-12 text-center font-bold">{qty}</div>
              <Button size="sm" variant="outline" onClick={() => setQty(qty + 0.25)}>＋</Button>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2 mt-4 text-center">
            <Stat label="熱量" value={`${Math.round(picked.calories * qty)} kcal`} />
            <Stat label="蛋白質" value={`${(picked.protein_g * qty).toFixed(1)} g`} />
            <Stat label="碳水" value={`${(picked.carbs_g * qty).toFixed(1)} g`} />
            <Stat label="脂肪" value={`${(picked.fat_g * qty).toFixed(1)} g`} />
          </div>
          <Button variant="accent" className="w-full mt-4" onClick={() => onPick(picked, qty)}>
            <Check size={14} /> 加入記錄
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="搜尋食物 (滷肉飯、雞胸肉...)"
          autoFocus
          className="w-full pl-9 pr-4 py-3 rounded-xl border border-border-soft bg-slate-50 focus:bg-white focus:border-accent outline-none text-sm"
        />
      </div>
      <div className="mt-3 space-y-1">
        {results.length === 0 ? (
          <div className="text-center py-10 text-sm text-text-secondary">
            {q ? '找不到符合的食物' : '輸入食物名稱開始搜尋'}
          </div>
        ) : (
          results.map((f) => (
            <button
              key={f.id}
              onClick={() => setPicked(f)}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-left border border-transparent hover:border-border-soft transition"
            >
              <div className="flex-1">
                <div className="font-semibold">{f.name_zh}</div>
                <div className="text-xs text-text-secondary">{f.serving_size} · {f.category}</div>
              </div>
              <div className="text-sm font-bold text-accent">{f.calories} kcal</div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-2 bg-white rounded-lg border border-border-soft">
      <div className="text-[10px] text-text-secondary">{label}</div>
      <div className="text-sm font-bold">{value}</div>
    </div>
  );
}

/* ------------------------- Manual tab ------------------------- */
function ManualTab({
  onSubmit,
}: {
  onSubmit: (food: Omit<FoodItem, 'id'>) => Promise<void>;
}) {
  const [form, setForm] = useState({
    name_zh: '',
    serving_size: '1份',
    calories: '',
    protein_g: '',
    carbs_g: '',
    fat_g: '',
  });

  const set = (k: keyof typeof form) => (v: string) => setForm({ ...form, [k]: v });

  const submit = async () => {
    if (!form.name_zh.trim() || !form.calories) return;
    await onSubmit({
      name_zh: form.name_zh.trim(),
      serving_size: form.serving_size,
      calories: Number(form.calories) || 0,
      protein_g: Number(form.protein_g) || 0,
      carbs_g: Number(form.carbs_g) || 0,
      fat_g: Number(form.fat_g) || 0,
    });
  };

  return (
    <div className="space-y-3">
      <EditField label="食物名稱" value={form.name_zh} onChange={set('name_zh')} />
      <EditField label="份量" value={form.serving_size} onChange={set('serving_size')} />
      <div className="grid grid-cols-2 gap-3">
        <EditField label="熱量 (kcal) *" value={form.calories} onChange={set('calories')} type="number" />
        <EditField label="蛋白質 (g)" value={form.protein_g} onChange={set('protein_g')} type="number" />
        <EditField label="碳水 (g)" value={form.carbs_g} onChange={set('carbs_g')} type="number" />
        <EditField label="脂肪 (g)" value={form.fat_g} onChange={set('fat_g')} type="number" />
      </div>
      <Button variant="accent" className="w-full" onClick={submit} disabled={!form.name_zh.trim() || !form.calories}>
        儲存
      </Button>
    </div>
  );
}
