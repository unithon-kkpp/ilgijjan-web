interface DiaryEditorProps {
  value: string
  onChange: (value: string) => void
}

export default function DiaryEditor({ value, onChange }: DiaryEditorProps) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="오늘 있었던 일을 써봐요"
    />
  )
}
