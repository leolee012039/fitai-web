export function TypingIndicator() {
  return (
    <div className="inline-flex items-center gap-1 bg-primary rounded-2xl rounded-bl-sm px-4 py-3">
      <span className="typing-dot w-1.5 h-1.5 rounded-full bg-white" />
      <span className="typing-dot w-1.5 h-1.5 rounded-full bg-white" />
      <span className="typing-dot w-1.5 h-1.5 rounded-full bg-white" />
    </div>
  );
}
