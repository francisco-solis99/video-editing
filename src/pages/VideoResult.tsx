import { useEffect, useState, useRef } from "react"
import { CheckCircle2, Download } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from '@/components/Link'
import { useVideoContext } from "@/hooks/useVideoContext"
import VideoLoad from "@/components/VideoLoad"
import { NoVideoLoad } from "@/components/NoVideoLoad"


export default function VideoResultPage() {
  const { originalVideo, outputVideo } = useVideoContext()
  const [originalDuration, setOriginalDuration] = useState<number>(0)
  const [outputDuration, setOutputDuration] = useState<number>(0)
  const linkRefToDownload = useRef<HTMLAnchorElement | null>(null)

  // Get video duration from video file
  const getVideoDuration = (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video')
      video.onloadedmetadata = () => {
        resolve(video.duration)
        URL.revokeObjectURL(video.src)
      }
      video.onerror = () => reject(new Error('Failed to load video'))
      video.src = URL.createObjectURL(file)
    })
  }

  // Load durations on mount
  useEffect(() => {
    const loadDurations = async () => {
      try {
        if (originalVideo) {
          const duration = await getVideoDuration(originalVideo)
          setOriginalDuration(duration)
        }
        if (outputVideo) {
          const duration = await getVideoDuration(outputVideo)
          setOutputDuration(duration)
        }
      } catch (error) {
        console.error('Error loading video duration:', error)
      }
    }

    loadDurations()
  }, [originalVideo, outputVideo])

  // Format seconds to MM:SS format
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')} min`
  }

  // Download video
  const handleDownload = () => {
    if (!outputVideo || !linkRefToDownload.current) return
    const url = URL.createObjectURL(outputVideo)
    linkRefToDownload.current.href = url;
    linkRefToDownload.current.download = outputVideo.name;
    linkRefToDownload.current.click();

    URL.revokeObjectURL(url)
  }

  const timeSaved = originalDuration - outputDuration

  return (
    <main className="container flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-12">
      {
        !outputVideo && !originalVideo ? (
          <NoVideoLoad />
        ) : (
          <>
            <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-primary/20">
              <CheckCircle2 className="h-12 w-12 text-primary" />
            </div>

            <h1 className="mb-3 text-center text-4xl font-bold text-foreground">¡Tu video está listo!</h1>
            <p className="mb-12 text-center text-muted-foreground">
              El video ha sido procesado y está listo para ser descargado.
            </p>

            <section className="max-w-2xl">
              <VideoLoad url={outputVideo ? URL.createObjectURL(outputVideo) : ""} />
            </section>

            <section className="mt-8 mb-12 grid w-full max-w-3xl gap-4 md:grid-cols-3">
              <Card className="border-border bg-card">
                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                  <p className="mb-2 text-sm text-muted-foreground">Duración Original</p>
                  <p className="text-3xl font-bold text-card-foreground">{formatDuration(originalDuration)}</p>
                </CardContent>
              </Card>

              <Card className="border-border bg-card">
                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                  <p className="mb-2 text-sm text-muted-foreground">Nueva Duración</p>
                  <p className="text-3xl font-bold text-card-foreground">{formatDuration(outputDuration)}</p>
                </CardContent>
              </Card>

              <Card className="border-primary bg-primary/10">
                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                  <p className="mb-2 text-sm text-primary">¡Ahorraste!</p>
                  <p className="text-3xl font-bold text-primary">{formatDuration(timeSaved)}</p>
                </CardContent>
              </Card>
            </section>

            <Button
              onClick={handleDownload}
              disabled={!outputVideo}
              size="lg"
              className="mb-6 bg-primary px-8 py-6 text-base font-semibold text-primary-foreground hover:bg-primary/90 cursor-pointer"
            >
              <Download className="mr-2 h-5 w-5" />
              Descargar Video Recortado (.mp4)
            </Button>

            <a style={{ display: 'none' }} ref={linkRefToDownload}></a>

            <Link href="/" className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
              ¿Recortar otro video?
            </Link>
          </>
        )
      }
    </main>
  )
}
