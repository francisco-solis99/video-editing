import { useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "./ui/button"


export default function UploadControl({ setOriginalVideo }: { setOriginalVideo: (file: File | null) => void }) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)


  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  const handleFileSelect = (files: FileList) => {
    const file = files[0]
    if (!file) return;
    console.log({ file })

    setOriginalVideo(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files)
  }

  return (
    <div className="w-full max-w-4xl">
      <div
        className={cn(
          "flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card/50 p-16 transition-all",
          isDragging && "border-primary bg-primary/5",
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-10 w-10 text-primary"
          >
            <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
            <line x1="7" y1="2" x2="7" y2="22" />
            <line x1="17" y1="2" x2="17" y2="22" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <line x1="2" y1="7" x2="7" y2="7" />
            <line x1="2" y1="17" x2="7" y2="17" />
            <line x1="17" y1="17" x2="22" y2="17" />
            <line x1="17" y1="7" x2="22" y2="7" />
          </svg>
        </div>

        <h2 className="mb-3 text-3xl font-bold text-foreground">Sube tu video para empezar</h2>
        <p className="mb-8 text-center text-muted-foreground">Arrastra y suelta un archivo de video aquí</p>
        <input type="file" accept="video/*,audio/mpeg,.mp3" onChange={(e) => handleFileSelect(e.target.files!)} ref={fileInputRef} className="hidden" />

        <Button
          onClick={openFileDialog}
          size="lg"
          className="bg-primary px-8 py-6 text-base font-semibold text-primary-foreground hover:bg-primary/90 cursor-pointer"
        >
          O selecciona un video desde tu computadora
        </Button>
      </div>

      <p className="mt-6 text-sm text-muted-foreground">Formatos soportados: .MP4, .MOV. Tamaño máximo: 2GB</p>
    </div>
  )
}
