import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import VideoLoad from "@/components/VideoLoad"
import { useVideoContext } from "@/hooks/useVideoContext"
import { Link } from "@/components/Link"


export default function VideoUploadPage() {
  const context = useVideoContext()
  const { originalVideo, setOriginalVideo, setOutputVideo } = context || {}
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (setOriginalVideo && setOutputVideo) {
      setOriginalVideo(null)
      setOutputVideo(null)
    }
  }, [setOriginalVideo, setOutputVideo])

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

  const handleClickUploadAnother = () => {
    setOriginalVideo(null)
  }

  return (
    <main className="container flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-12">

      {
        !originalVideo ? (
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
              <input type="file" accept="video/*" onChange={(e) => handleFileSelect(e.target.files!)} ref={fileInputRef} className="hidden" />

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
          : (
            <div>
              <VideoLoad url={originalVideo ? URL.createObjectURL(originalVideo) : ""} />
              <div className="flex space-x-4 justify-center items-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-primary mt-8 px-8 py-6 text-base font-semibold text-primary-foreground hover:bg-primary/90 cursor-pointer"
                >
                  <Link href="/video-process">
                    Ir a procesar Video
                  </Link>
                </Button>
                <Button
                  onClick={handleClickUploadAnother}
                  size="lg"
                  className="bg-secondary mt-8 px-8 py-6 text-base font-semibold text-primary-foreground hover:bg-secondary/90 border hover:border-primary/90 cursor-pointer"
                >
                  Subir otro video
                </Button>
              </div>
            </div>
          )
      }
    </main>
  )
}
