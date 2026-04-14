import { useRef, useState } from 'react';
import { UploadCloud, FileText, Image as ImageIcon, AlertTriangle, CheckCircle2, Sparkles, X } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { mockAnalysis } from '@/lib/mockData';
import type { HealthReport, ReportAnalysis } from '@/types';

interface PickedFile {
  name: string;
  type: string;
  url: string;
  isImage: boolean;
}

export function UploadPage() {
  const fileInput = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<PickedFile | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ReportAnalysis | null>(null);
  const [history, setHistory] = useState<HealthReport[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('fitai-reports') || '[]') as HealthReport[];
    } catch {
      return [];
    }
  });

  const saveHistory = (next: HealthReport[]) => {
    setHistory(next);
    localStorage.setItem('fitai-reports', JSON.stringify(next));
  };

  const onFiles = (files: FileList | null) => {
    const f = files?.[0];
    if (!f) return;
    setFile({
      name: f.name,
      type: f.type,
      url: URL.createObjectURL(f),
      isImage: f.type.startsWith('image/'),
    });
    setAnalysis(null);
    setUploadProgress(100);
  };

  const analyze = () => {
    if (!file) return;
    setAnalyzing(true);
    setUploadProgress(0);
    const tick = setInterval(() => {
      setUploadProgress((p) => Math.min(95, p + 8 + Math.random() * 10));
    }, 140);
    setTimeout(() => {
      clearInterval(tick);
      setUploadProgress(100);
      setAnalysis(mockAnalysis);
      setAnalyzing(false);
      const report: HealthReport = {
        id: 'r_' + Date.now(),
        file_name: file.name,
        created_at: new Date().toISOString(),
        status: 'complete',
        analysis: mockAnalysis,
      };
      saveHistory([report, ...history].slice(0, 20));
    }, 1600);
  };

  const reset = () => {
    setFile(null);
    setAnalysis(null);
    setUploadProgress(0);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
      <div className="space-y-6">
        <Card>
          <h3 className="text-base font-bold mb-1">上傳健康報告</h3>
          <p className="text-xs text-text-secondary mb-4">支援 PDF、JPG、PNG，AI 會自動分析生物標記並標記異常值。</p>

          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); onFiles(e.dataTransfer.files); }}
            onClick={() => fileInput.current?.click()}
            className={`cursor-pointer border-2 border-dashed rounded-2xl p-10 text-center transition
              ${dragOver ? 'border-accent bg-accent/5' : 'border-border-soft hover:border-accent/60 hover:bg-slate-50'}`}
          >
            <div className="w-14 h-14 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mx-auto mb-3">
              <UploadCloud size={28} />
            </div>
            <div className="font-semibold text-primary">拖曳檔案至此處</div>
            <div className="text-xs text-text-secondary mt-1">或點擊選擇文件</div>
            <div className="flex items-center justify-center gap-2 mt-4">
              <Badge tone="default">PDF</Badge>
              <Badge tone="default">JPG</Badge>
              <Badge tone="default">PNG</Badge>
            </div>
            <input
              ref={fileInput}
              type="file"
              accept="image/*,application/pdf"
              className="hidden"
              onChange={(e) => onFiles(e.target.files)}
            />
          </div>

          {file && (
            <div className="mt-4 flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-border-soft">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">
                {file.isImage ? <ImageIcon size={20} className="text-primary" /> : <FileText size={20} className="text-primary" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm truncate">{file.name}</div>
                <div className="w-full h-1.5 rounded-full bg-slate-200 mt-1.5 overflow-hidden">
                  <div className="h-full bg-accent transition-all" style={{ width: `${uploadProgress}%` }} />
                </div>
              </div>
              <button onClick={reset} className="text-text-secondary hover:text-red-500" aria-label="移除">
                <X size={18} />
              </button>
            </div>
          )}

          {file && (
            <div className="mt-4 flex gap-3">
              <Button variant="accent" onClick={analyze} loading={analyzing} className="flex-1">
                <Sparkles size={14} /> {analyzing ? '分析中...' : 'AI 分析報告'}
              </Button>
              <Button variant="outline" onClick={reset}>取消</Button>
            </div>
          )}

          {file?.isImage && (
            <div className="mt-4">
              <img src={file.url} alt="預覽" className="w-full max-h-[360px] object-contain rounded-xl bg-slate-100" />
            </div>
          )}
        </Card>

        {analysis && (
          <>
            <Card>
              <h3 className="text-base font-bold mb-3">生物標記</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {analysis.biomarkers.map((b, i) => {
                  const flagged = analysis.flagged.some((f) => f.name.includes(b.name.split(' ')[0]));
                  return (
                    <div
                      key={i}
                      className={`flex items-center justify-between p-3 rounded-xl border ${
                        flagged ? 'border-red-200 bg-red-50' : 'border-border-soft bg-slate-50'
                      }`}
                    >
                      <div>
                        <div className="text-sm font-semibold">{b.name}</div>
                        {b.normalRange && (
                          <div className="text-[11px] text-text-secondary">正常範圍 {b.normalRange}</div>
                        )}
                      </div>
                      <div className={`text-sm font-bold ${flagged ? 'text-red-600' : 'text-primary'}`}>
                        {b.value} {b.unit}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {analysis.flagged.length > 0 && (
              <Card className="border border-red-200 bg-red-50/30">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle size={18} className="text-red-600" />
                  <h3 className="text-base font-bold text-red-700">需要關注的項目</h3>
                </div>
                <div className="space-y-2">
                  {analysis.flagged.map((f, i) => (
                    <div key={i} className="p-3 rounded-xl bg-white border border-red-200">
                      <div className="font-semibold text-red-700">{f.name}：{f.value}</div>
                      <div className="text-xs text-text-secondary mt-1">{f.reason}</div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            <Card className="border border-emerald-200 bg-emerald-50/30">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 size={18} className="text-emerald-600" />
                <h3 className="text-base font-bold text-emerald-700">健身建議</h3>
              </div>
              <ul className="space-y-2">
                {analysis.fitnessInsights.map((ins, i) => (
                  <li key={i} className="text-sm text-primary leading-relaxed flex gap-2">
                    <span className="text-emerald-600 mt-0.5">•</span>
                    <span>{ins}</span>
                  </li>
                ))}
              </ul>
              <p className="text-[11px] italic text-text-muted mt-3">
                以上為一般健身資訊，非醫療建議。如有醫療疑慮請諮詢醫師。
              </p>
            </Card>
          </>
        )}
      </div>

      <div>
        <Card padded={false}>
          <div className="p-5 border-b border-border-soft">
            <h3 className="font-bold">歷史報告</h3>
            <p className="text-xs text-text-secondary mt-0.5">最近 20 筆</p>
          </div>
          <div className="max-h-[560px] overflow-y-auto divide-y divide-border-soft/60">
            {history.length === 0 ? (
              <div className="p-5 text-center text-xs text-text-secondary">尚無歷史報告</div>
            ) : (
              history.map((r) => (
                <div key={r.id} className="p-4 hover:bg-slate-50 transition cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
                      <FileText size={16} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold truncate">{r.file_name}</div>
                      <div className="text-[11px] text-text-secondary">
                        {new Date(r.created_at).toLocaleString('zh-Hant')}
                      </div>
                    </div>
                    <Badge tone={r.status === 'complete' ? 'success' : r.status === 'error' ? 'danger' : 'warning'}>
                      {r.status === 'complete' ? '已完成' : r.status === 'error' ? '失敗' : '分析中'}
                    </Badge>
                  </div>
                  {r.analysis && (
                    <div className="mt-2 text-[11px] text-text-secondary">
                      {r.analysis.biomarkers.length} 個生物標記 · {r.analysis.flagged.length} 項異常
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
