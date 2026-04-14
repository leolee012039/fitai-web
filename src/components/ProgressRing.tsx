interface ProgressRingProps {
  progress: number;
  size?: number;
  stroke?: number;
  label?: string;
  color?: string;
}

export function ProgressRing({
  progress,
  size = 96,
  stroke = 10,
  label,
  color = '#F05454',
}: ProgressRingProps) {
  const clamped = Math.max(0, Math.min(1, progress));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - clamped);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="#F1F5F9" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-lg font-bold">{Math.round(clamped * 100)}%</div>
        {label && <div className="text-[10px] text-text-secondary mt-0.5">{label}</div>}
      </div>
    </div>
  );
}
