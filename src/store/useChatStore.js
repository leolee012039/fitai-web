import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient } from '@/lib/api';
import { useHealthStore } from './useHealthStore';
import { useNutritionStore } from './useNutritionStore';
function mockReply(q, ctx, nut) {
    const lower = q.toLowerCase();
    if (lower.includes('sleep') || lower.includes('睡')) {
        return `您昨晚睡了 ${ctx.sleep_hours.toFixed(1)} 小時，落在 7–9 小時的健康區間。平均心率 ${ctx.heart_rate} bpm 看起來不錯。建議睡前 30 分鐘避免藍光與咖啡因，維持固定時間入睡。長期失眠請諮詢醫師。`;
    }
    if (lower.includes('蛋白質') || lower.includes('protein')) {
        const gap = nut.calorie_goal ? nut.protein_g : 0;
        return `今日蛋白質攝取 ${gap}g，目標約 150g。每公斤體重建議 1.6–2.2g，訓練後 30 分鐘內補充效益最佳。若不足，可加一份雞胸肉 (約 31g)、豆腐一塊 (8g) 或乳清蛋白一匙 (25g)。`;
    }
    if (lower.includes('飲食') || lower.includes('今天吃') || lower.includes('規劃')) {
        return `依目前進度（${nut.calories_consumed} / ${nut.calorie_goal} kcal），晚餐建議清淡蛋白質 + 蔬菜：例如雞胸肉 150g、花椰菜一碗、糙米飯半碗。蛋白質剩餘需求約 ${Math.max(0, 150 - nut.protein_g)}g。（一般資訊非醫療建議）`;
    }
    if (lower.includes('workout') || lower.includes('訓練') || lower.includes('今天')) {
        return `今日建議：先以 5 分鐘動態暖身，專注動作控制與呼吸。您累積 ${ctx.steps.toLocaleString()} 步，身體已熱身。若疲勞，降低 10% 負重換取品質。記得訓練後 1 小時內補充蛋白質。`;
    }
    if (lower.includes('step') || lower.includes('步')) {
        return `${ctx.steps.toLocaleString()} 步約 6–7 公里。心血管建議 7,000–10,000 步/日。若減脂，晚餐後 15 分鐘散步能增加活動量而不影響恢復。`;
    }
    if (lower.includes('recovery') || lower.includes('恢復')) {
        return `恢復三要素：睡 7–9 小時 ✓、水分 30–35 ml/kg、蛋白質 1.6–2.2 g/kg。目前睡眠 ${ctx.sleep_hours.toFixed(1)} hrs ${ctx.sleep_hours >= 7 ? '達標' : '略低'}、蛋白質 ${nut.protein_g}g。建議每 4–6 週安排減量週。`;
    }
    return `根據今日數據（${ctx.steps.toLocaleString()} 步 · 心率 ${ctx.heart_rate} bpm · 睡眠 ${ctx.sleep_hours.toFixed(1)} hrs · 熱量 ${nut.calories_consumed}/${nut.calorie_goal} kcal），整體表現在健康區間。想深入哪個主題：睡眠、訓練、或營養？（一般資訊非醫療建議）`;
}
export const useChatStore = create()(persist((set, get) => ({
    threads: [],
    activeId: null,
    loading: false,
    createThread: () => {
        const id = 't_' + Date.now();
        const thread = {
            id,
            title: '新對話',
            createdAt: Date.now(),
            messages: [],
        };
        set({ threads: [thread, ...get().threads], activeId: id });
        return id;
    },
    setActive: (id) => set({ activeId: id }),
    deleteThread: (id) => {
        const next = get().threads.filter((t) => t.id !== id);
        set({
            threads: next,
            activeId: get().activeId === id ? next[0]?.id ?? null : get().activeId,
        });
    },
    getActive: () => get().threads.find((t) => t.id === get().activeId),
    sendMessage: async (text) => {
        let id = get().activeId;
        if (!id)
            id = get().createThread();
        const thread = get().threads.find((t) => t.id === id);
        if (!thread)
            return;
        const userMsg = {
            id: 'u_' + Date.now(),
            role: 'user',
            text,
            createdAt: Date.now(),
        };
        thread.messages = [...thread.messages, userMsg];
        if (thread.messages.length === 1) {
            thread.title = text.slice(0, 24);
        }
        set({ threads: [...get().threads], loading: true });
        const ctx = useHealthStore.getState().summary;
        const nut = useNutritionStore.getState().getContextSnapshot();
        let replyText;
        try {
            const { data } = await apiClient.post('/api/ai/chat', {
                message: text,
                context: { ...ctx, ...nut },
            });
            replyText = data.reply;
        }
        catch {
            await new Promise((r) => setTimeout(r, 800 + Math.random() * 600));
            replyText = mockReply(text, ctx, nut);
        }
        const aiMsg = {
            id: 'a_' + Date.now(),
            role: 'assistant',
            text: replyText,
            createdAt: Date.now(),
        };
        thread.messages = [...thread.messages, aiMsg];
        set({ threads: [...get().threads], loading: false });
    },
}), { name: 'fitai-chat' }));
