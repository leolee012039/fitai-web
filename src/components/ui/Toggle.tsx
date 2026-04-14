import { cn } from '@/lib/utils';

interface ToggleProps {
  on: boolean;
  onChange: () => void;
  label?: string;
}

export function Toggle({ on, onChange, label }: ToggleProps) {
  return (
    <button
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={onChange}
      className={cn(
        'relative w-11 h-[26px] rounded-full transition-colors shrink-0',
        on ? 'bg-accent/40' : 'bg-slate-300',
      )}
    >
      <span
        className={cn(
          'absolute top-[2px] w-[22px] h-[22px] rounded-full bg-white shadow-sm transition-all',
          on ? 'left-[20px] bg-accent' : 'left-[2px]',
        )}
      />
    </button>
  );
}
