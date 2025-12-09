import { Button } from "@/components/ui/button"
import { Link } from "@/components/Link"


export function NoVideoLoad() {
  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-border bg-card p-8 text-center">
      <h2 className="mb-2 text-2xl font-semibold text-foreground">No hay video cargado</h2>
      <p className="mb-4 text-muted-foreground">Vuelve a la página de inicio y sube un video para continuar.</p>
      <div className="flex justify-center">
        <Button
          asChild
          size="lg"
          className="bg-primary px-8 py-6 text-base font-semibold text-primary-foreground hover:bg-primary/90 cursor-pointer"
        >
          <Link href="/">
            Volver al inicio
          </Link>
        </Button>
      </div>
    </div>
  )
}
