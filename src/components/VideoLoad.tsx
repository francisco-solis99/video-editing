import { useRef, useState } from "react"
import { Play, Pause } from "lucide-react"

interface VideoLoadProps {
  url: string
}

export default function VideoLoad({ url }: VideoLoadProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleClickPlay = () => {
    if (!videoRef.current) return

    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  return (
    <div className="relative w-full bg-card/50 max-w-4xl aspect-video overflow-hidden rounded-2xl shadow-[0_0_20px] shadow-primary/30">
      <button
        onClick={handleClickPlay}
        className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/50 p-8 backdrop-blur-sm transition-all hover:bg-black/70 cursor-pointer z-10 ${isPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`}
      >
        {isPlaying ? <Pause className="h-8 w-8 text-white" /> : <Play className="h-8 w-8 text-white" />}
      </button>
      <video src={url} controls width={500} ref={videoRef} className="w-full rounded-2xl shadow-lg"></video>
    </div>
  )
}
