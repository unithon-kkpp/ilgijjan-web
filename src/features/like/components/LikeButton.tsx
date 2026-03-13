interface LikeButtonProps {
  liked: boolean
  count: number
  onClick: () => void
}

export default function LikeButton({ liked, count, onClick }: LikeButtonProps) {
  return (
    <button onClick={onClick} aria-pressed={liked}>
      ♥ {count}
    </button>
  )
}
