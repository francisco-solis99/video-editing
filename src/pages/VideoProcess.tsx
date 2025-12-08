import type { Chunk } from "@/types/videoTypes"
import VideoLoad from "@/components/VideoLoad"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"
import { useMemo, useState } from "react"
import { useVideoContext } from "@/hooks/useVideoContext"
import { detectSilentChunks, removeSilenceWithFilter } from "@/lib/ffmpeg"
import { Clock } from "lucide-react"
import { useRouter } from "@/hooks/useRouter"


type VideoProcessSteps = '' | 'analyzing' | 'processing'

export default function VideoProcessPage() {
  const [step, setStep] = useState<VideoProcessSteps>('')
  const [threshold, setThreshold] = useState<number>(0.02);
  const [minSilenceDuration, setMinSilenceDuration] = useState<number>(0.5);
  const [detectedSilences, setDetectedSilences] = useState<Chunk[]>([]);

  const [progress, setProgress] = useState(0)
  const { originalVideo, setOutputVideo } = useVideoContext()
  const { navigateTo } = useRouter()

  const isAnalyzing = step === 'analyzing'
  const isProcessing = step === 'processing'

  const secondsToBeCut = useMemo(() => {
    let total = 0;
    detectedSilences.forEach(([start, end]) => {
      total += end - start;
    });
    return total.toFixed(2);
  }, [detectedSilences]);


  const handleAnalyze = async () => {
    if (!originalVideo) return;
    setStep('analyzing')
    setDetectedSilences([])

    const chunks = await detectSilentChunks(originalVideo, threshold, minSilenceDuration)
    setDetectedSilences(chunks)
    setStep('')
  }

  const handleGenerate = async () => {
    try {
      setStep('processing')
      setProgress(0)
      const blob = await removeSilenceWithFilter(
        originalVideo!,
        detectedSilences,
        (percent: number) => setProgress(percent)
      )
      if (!blob) return;
      const outputVideo = new File([blob], "output.mp4", { type: "video/mp4" })
      if (setOutputVideo) {
        setOutputVideo(outputVideo)
        navigateTo("/video-result")
      }
    } catch (error) {
      console.error("Error generating video:", error);
    } finally {
      setStep('')
      setProgress(0)
    }
  }

  const handleSubmitTrim = (e: React.FormEvent) => {
    e.preventDefault()
    handleAnalyze()
  }

  return (
    <main className="container px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold text-foreground">Opciones de Recorte de Silencios</h1>
        <p className="text-muted-foreground">Ajusta los parámetros para detectar y eliminar silencios de tu video.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        {/* Video Player */}
        <section>
          <VideoLoad url={originalVideo ? URL.createObjectURL(originalVideo) : ""} />
          {
            detectedSilences.length > 0 && (
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
            )}
        </section>
        {/* Controls Panel */}
        <div className="flex flex-col gap-6">
          <h2 className="mb-6 text-xl font-semibold text-card-foreground">Controles de Detección</h2>
          <form className="rounded-2xl border border-border bg-card p-6" onSubmit={handleSubmitTrim}>
            <div className="mb-6 space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-card-foreground">Umbral de Silencio</Label>
                <span className="text-sm text-muted-foreground">{threshold} dB</span>
              </div>
              <Slider
                min={0}
                max={0.05}
                step={0.001}
                value={[threshold]}
                onValueChange={(value) => setThreshold(value[0])}
                className="**:[[role=slider]]:bg-primary"
              />
            </div>

            <div className="mb-6 space-y-2">
              <Label htmlFor="duration" className="text-sm font-medium text-card-foreground">
                Duración Mínima (segundos)
              </Label>
              <Input
                id="duration"
                type="number"
                step="0.1"
                value={minSilenceDuration}
                onChange={(e) => setMinSilenceDuration(parseFloat(e.target.value))}
                max={3}
                min={0.1}
                className="bg-input"
              />
            </div>

            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing || isProcessing}
              className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 cursor-pointer"
            >
              {isAnalyzing ? "Analizando..." : "Analizar y Previsualizar Recortes"}
            </Button>
          </form>

          {detectedSilences.length > 0 && (
            <div className="rounded-2xl border border-border bg-card p-6">
              <p className="mb-4 text-sm text-card-foreground">
                Se detectaron <span className="font-semibold">{detectedSilences.length}</span> silencios. Se recortarán{" "}
                <span className="font-semibold"> {secondsToBeCut} </span> segundos en total.
              </p>

              {isProcessing ? (
                <>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Generando video...</span>
                    <span className="font-semibold text-primary">{progress}%</span>
                  </div>
                  <Progress value={progress} className="mb-4" />
                </>
              ) : null}

              <Button
                onClick={handleGenerate}
                disabled={isAnalyzing || isProcessing}
                className={cn(
                  "w-full bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer",
                  isProcessing && "opacity-50",
                )}
              >
                Generar Video Final Recortado
              </Button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
