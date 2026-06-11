import { cn } from "@/lib/utils"

function NeoSkeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse bg-muted border-[3px] border-border shadow-neo", className)}
      {...props}
    />
  )
}

export { NeoSkeleton }
