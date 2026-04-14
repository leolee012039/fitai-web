import { useEffect, useRef, useState } from 'react';
import { Bot, Plus, Send, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { TypingIndicator } from '@/components/TypingIndicator';
import { useChatStore } from '@/store/useChatStore';

const SUGGESTED = [
  '分析我今天的飲食',
  '我的蛋白質夠嗎',
  '今天吃什麼比較好',
  '幫我規劃明天飲食',
  '分析我的睡眠',
  '今天的訓練建議',
];

export function ChatPage() {
  const { threads, activeId, loading, createThread, setActive, deleteThread, sendMessage, getActive } =
    useChatStore();
  const [input, setInput] = useState('');
  const active = getActive();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!activeId && threads.length === 0) createThread();
    else if (!activeId && threads.length > 0) setActive(threads[0].id);
  }, [activeId, threads, createThread, setActive]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [active?.messages.length, loading]);

  const handleSend = async (text?: string) => {
    const toSend = (text ?? input).trim();
    if (!toSend || loading) return;
    setInput('');
    await sendMessage(toSend);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-4 h-[calc(100vh-140px)]">
      {/* History sidebar */}
      <Card padded={false} className="hidden lg:flex flex-col">
        <div className="p-4 flex items-center justify-between border-b border-border-soft">
          <h3 className="font-bold">對話紀錄</h3>
          <Button variant="subtle" size="sm" onClick={() => createThread()}>
            <Plus size={14} /> 新對話
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {threads.length === 0 ? (
            <div className="text-center text-xs text-text-secondary py-8">尚無對話</div>
          ) : (
            threads.map((t) => (
              <button
                key={t.id}
                onClick={() => setActive(t.id)}
                className={cn(
                  'group w-full text-left px-3 py-2.5 rounded-lg mb-1 transition flex items-start gap-2',
                  t.id === activeId ? 'bg-accent/10 text-primary' : 'hover:bg-slate-50 text-text-secondary',
                )}
              >
                <MessageIcon active={t.id === activeId} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate">{t.title}</div>
                  <div className="text-[10px] text-text-muted">
                    {new Date(t.createdAt).toLocaleDateString('zh-Hant')}
                  </div>
                </div>
                <span
                  role="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteThread(t.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 text-text-muted hover:text-red-500 cursor-pointer"
                  aria-label="刪除"
                >
                  <Trash2 size={14} />
                </span>
              </button>
            ))
          )}
        </div>
      </Card>

      {/* Chat main */}
      <Card padded={false} className="flex flex-col overflow-hidden">
        <div className="px-5 py-3 border-b border-border-soft flex flex-wrap gap-2 items-center">
          <div className="text-xs font-semibold text-text-secondary mr-2">建議提問：</div>
          {SUGGESTED.map((p) => (
            <button
              key={p}
              onClick={() => handleSend(p)}
              className="px-3 py-1.5 text-xs font-semibold rounded-full bg-slate-50 border border-border-soft hover:border-accent hover:text-accent transition"
            >
              {p}
            </button>
          ))}
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-3 bg-background/40">
          {!active || active.messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-10">
              <div className="w-14 h-14 rounded-2xl bg-accent/10 text-accent flex items-center justify-center mb-3">
                <Bot size={28} />
              </div>
              <div className="font-bold text-lg">嗨！我是您的 AI 健身教練 💪</div>
              <div className="text-sm text-text-secondary mt-2 max-w-sm">
                點上面的提示或直接輸入問題，我會根據您最新的健康數據給予建議。
              </div>
              <div className="text-[11px] italic text-text-muted mt-6 max-w-sm">
                提醒：我不進行醫療診斷或開立處方。如有醫療疑慮請諮詢醫師。
              </div>
            </div>
          ) : (
            <>
              {active.messages.map((m) =>
                m.role === 'user' ? (
                  <div key={m.id} className="flex justify-end">
                    <div className="max-w-[78%] bg-accent text-white px-4 py-3 rounded-2xl rounded-br-sm text-sm leading-relaxed shadow-soft">
                      {m.text}
                    </div>
                  </div>
                ) : (
                  <div key={m.id} className="flex items-end gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shrink-0">
                      <Bot size={16} />
                    </div>
                    <div className="max-w-[78%] bg-white border border-primary/10 text-primary px-4 py-3 rounded-2xl rounded-bl-sm text-sm leading-relaxed whitespace-pre-wrap shadow-soft">
                      {m.text}
                    </div>
                  </div>
                ),
              )}
              {loading && (
                <div className="flex items-end gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shrink-0">
                    <Bot size={16} />
                  </div>
                  <TypingIndicator />
                </div>
              )}
            </>
          )}
        </div>

        <div className="p-4 border-t border-border-soft flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="詢問您的教練..."
            aria-label="訊息輸入"
            className="flex-1 rounded-xl bg-slate-50 border border-transparent focus:border-accent focus:bg-white outline-none px-4 py-3 text-sm"
          />
          <Button variant="accent" onClick={() => handleSend()} disabled={!input.trim() || loading}>
            <Send size={14} /> 傳送
          </Button>
        </div>
      </Card>
    </div>
  );
}

function MessageIcon({ active }: { active: boolean }) {
  return (
    <div
      className={cn(
        'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
        active ? 'bg-accent text-white' : 'bg-slate-100 text-text-secondary',
      )}
    >
      <Bot size={14} />
    </div>
  );
}
