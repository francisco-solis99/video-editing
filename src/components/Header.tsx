import { Settings, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "./Link"

interface HeaderProps {
  showExport?: boolean
}

export function Header({ showExport = false }: HeaderProps) {
  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 text-primary-foreground"
            >
              <path d="M4 11v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8H4z" />
              <path d="M4 11L2 6h20l-2 5" />
            </svg>
          </div>
          <Link href="/" className="text-xl font-semibold text-foreground">
            TrimSilence
          </Link>
        </div>

        {/* <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/proyectos"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Proyectos
          </Link>
          <Link
            href="/ayuda"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Ayuda
          </Link>
        </nav> */}

        <div className="flex items-center gap-2">
          {showExport && (
            <>
              <Button
                variant="default"
                size="default"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Export
              </Button>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
