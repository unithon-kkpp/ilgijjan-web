import { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAtom } from 'jotai'
import { diaryDraftAtom } from '@/app/store'
import { useImageUpload } from '@/features/storage/hooks/useImageUpload'
import StepProgress from '@/features/diary/components/StepProgress'

export default function DiaryNewPhotoPage() {
  const navigate = useNavigate()
  const [draft, setDraft] = useAtom(diaryDraftAtom)
  const upload = useImageUpload()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [error, setError] = useState('')

  // StrictMode 이중 마운트 시 자동 열기가 두 번 실행되지 않도록 가드
  const didAutoOpenRef = useRef(false)

  // 진입 시: 이미 업로드된 사진이 있으면 미리보기 복원, 없으면 파일 선택창 자동 열기
  useEffect(() => {
    if (didAutoOpenRef.current) return
    didAutoOpenRef.current = true

    if (draft.photoUrl) {
      setPreviewUrl(draft.photoUrl)
    } else {
      fileInputRef.current?.click()
    }
  }, [])

  const handleFile = async (file: File) => {
    setError('')
    // 즉시 미리보기
    const localUrl = URL.createObjectURL(file)
    setPreviewUrl(localUrl)
    try {
      const { url } = await upload.mutateAsync(file)
      if (!url) {
        throw new Error('서버 응답에 url이 없습니다')
      }
      setDraft((d) => ({ ...d, photoUrl: url }))
    } catch (e) {
      console.error('이미지 업로드 실패:', e)
      setError('이미지 업로드에 실패했어요. 다시 시도해주세요!')
      setPreviewUrl(null)
    }
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    e.target.value = ''
  }

  const retake = () => {
    setPreviewUrl(null)
    setError('')
    setDraft((d) => ({ ...d, photoUrl: null }))
    fileInputRef.current?.click()
  }

  const canProceed = !!draft.photoUrl && !upload.isPending

  return (
    <div className="relative w-full h-full" style={{ backgroundColor: '#faf9f5' }}>
      <StepProgress current={1} />

      <div className="flex flex-col items-center pt-[140px]">
        {/* 사진 영역 */}
        <div
          className="rounded-[10px] flex items-center justify-center overflow-hidden"
          style={{
            width: 305,
            height: 305,
            backgroundColor: '#d9d9d9',
          }}
        >
          {previewUrl ? (
            <img src={previewUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <span className="text-[20px] text-black/60">image</span>
          )}
        </div>

        {error && (
          <p
            className="mt-3 text-[14px] text-[#dd2929] text-center"
            style={{ fontFamily: "'NanumSquareRound', sans-serif" }}
          >
            {error}
          </p>
        )}

        {/* 버튼 */}
        <div className="flex gap-[20px] mt-[27px]">
          <button
            onClick={retake}
            disabled={upload.isPending}
            className="rounded-[6px]"
            style={{
              width: 145,
              height: 55,
              backgroundColor: '#eee',
              color: 'rgba(66,66,66,0.7)',
              fontFamily: "'AndongKaturi', sans-serif",
              fontSize: 26,
            }}
          >
            다시 찍기
          </button>
          <button
            onClick={() => navigate('/diary/new/weather')}
            disabled={!canProceed}
            className="rounded-[6px] text-white"
            style={{
              width: 145,
              height: 55,
              backgroundColor: canProceed ? '#91ccff' : '#cfe7ff',
              fontFamily: "'AndongKaturi', sans-serif",
              fontSize: 30,
              transition: 'background-color 0.2s',
            }}
          >
            {upload.isPending ? '업로드 중...' : '다음'}
          </button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={onFileChange}
      />
    </div>
  )
}
