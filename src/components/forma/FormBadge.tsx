export function FormBadge({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full bg-[#0F2A1E] px-2.5 py-1 text-xs font-semibold text-primary border border-primary/20 ${className || ''}`}>
      ◈ FORMA AI
    </span>
  );
}
