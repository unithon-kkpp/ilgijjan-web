interface AudioPlayerProps {
  src: string
}

export default function AudioPlayer({ src }: AudioPlayerProps) {
  return (
    <audio controls className="w-full" src={src}>
      브라우저가 오디오를 지원하지 않습니다.
    </audio>
  )
}
