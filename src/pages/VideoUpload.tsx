import { useEffect } from "react"
import { Button } from "@/components/ui/button"

import VideoLoad from "@/components/VideoLoad"
import { useVideoContext } from "@/hooks/useVideoContext"
import { Link } from "@/components/Link"
import UploadControl from "@/components/UploadControl"


export default function VideoUploadPage() {
  const context = useVideoContext()
  const { originalVideo, setOriginalVideo, setOutputVideo } = context || {}

  useEffect(() => {
    if (setOriginalVideo && setOutputVideo) {
      setOriginalVideo(null)
      setOutputVideo(null)
    }
  }, [setOriginalVideo, setOutputVideo])


  const handleClickUploadAnother = () => {
    setOriginalVideo(null)
  }

  return (
    <main className="container flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-12">

      {
        !originalVideo ? (
          <UploadControl setOriginalVideo={setOriginalVideo} />
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
