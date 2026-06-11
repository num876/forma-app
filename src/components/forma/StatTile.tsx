export function StatTile({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-card border border-border">
      <span className="text-[0.7rem] uppercase tracking-wider text-muted-foreground mb-1 font-semibold">{label}</span>
      <span className="text-xl font-black text-foreground">{value ?? "—"}</span>
    </div>
  );
}
