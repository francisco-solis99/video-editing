import { cn } from "@/lib/utils"
import { Clock } from "lucide-react"
import type { Chunk } from "@/types/videoTypes";

interface SilencesListProps {
  detectedSilences: Chunk[];
}

export function SilencesList({ detectedSilences }: SilencesListProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <h2 className="mb-4 text-lg font-semibold text-card-foreground">
        Silencios Detectados ({detectedSilences.length})
      </h2>
      <ul className="max-h-[400px] space-y-2 overflow-y-auto pr-2">
        {detectedSilences.map((silence, index) => (
          <button
            className={cn(
              "w-full rounded-lg border border-border bg-background p-4 text-left transition-all hover:border-primary hover:bg-accent"
            )}
          >
            <li className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {index + 1}
                </div>
                <div>
                  <div className="text-sm font-medium text-foreground">
                    {silence[0].toFixed(2)} - {silence[1].toFixed(2)}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{(silence[1] - silence[0]).toFixed(1)}s</span>
                  </div>
                </div>
              </div>
              {/* <Play className="h-4 w-4 text-muted-foreground" /> */}
            </li>
          </button>
        ))}
      </ul>
    </div>
  )
}
