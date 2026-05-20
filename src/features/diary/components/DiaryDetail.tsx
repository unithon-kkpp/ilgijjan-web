import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Diary } from '../types/diary.types'
import { useTogglePublish } from '../hooks/useTogglePublish'
import { useDeleteDiary } from '../hooks/useDeleteDiary'
import { useLike } from '@/features/like/hooks/useLike'
import BackButton from '@/shared/components/ui/BackButton'
import ToggleSwitch from '@/shared/components/ui/ToggleSwitch'
import WeatherIcon from './WeatherIcon'
import MoodIcon from './MoodIcon'
import CustomMusicPlayer from './CustomMusicPlayer'
import DeleteConfirmModal from './DeleteConfirmModal'
import OriginalContentModal from './OriginalContentModal'
import {
  TrashIcon,
  HeartIcon,
  BookIcon,
  GrassSprig,
  LineToggleIcon,
  ImageToggleIcon,
} from './icons'
import { formatDiaryDate } from '../lib/date'

// 색상 토큰 — 화면 전용 (잔디 영역 / 가사 카드 등)
const GRASS_GREEN = '#CDE89B'
const SHARE_CARD_GREEN = '#B5D984'
const LYRICS_BLUE = '#DBEBFB'
const TEXT_BLACK = '#424242'
const HEART_RED = '#FF6969'
// 비공개 상태일 때 하트/카운트 색 — 잔디 배경 위에서 자연스럽게 죽도록 살짝 올리브 톤
const HEART_GRAY = '#9DA890'

interface DiaryDetailProps {
  diary: Diary
  // 생성 직후 진입한 경우 true. 뒤로가기 시 작성 단계로 돌아가지 않고 일기 목록으로 이동.
  fromCreate?: boolean
}

export default function DiaryDetail({ diary, fromCreate = false }: DiaryDetailProps) {
  const navigate = useNavigate()

  // 생성 직후엔 history 가 [..., photo, weather, detail] 라 navigate(-1) 가 weather 로 빠짐.
  // 이 경우만 일기 목록으로 직행. 평소엔 일반 뒤로가기.
  const handleBack = () => {
    if (fromCreate) navigate('/', { replace: true })
    else navigate(-1)
  }

  const hasLyrics = !!diary.lyrics
  const hasImage = !!diary.imageUrl
  // 기본: 그림(AI 생성 이미지) 모드. 그림이 없을 때만 가사 모드로 시작.
  const [showLyrics, setShowLyrics] = useState<boolean>(!hasImage)
  const [originalOpen, setOriginalOpen] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)

  const likeMutation = useLike(diary.diaryId)
  const publishMutation = useTogglePublish(diary.diaryId)
  const deleteMutation = useDeleteDiary(diary.diaryId)

  function handleConfirmDelete() {
    deleteMutation.mutate(undefined, {
      onSuccess: () => {
        // 삭제 후 일기 목록으로 — replace 로 두면 뒤로가기로 다시 못 들어옴
        navigate('/', { replace: true })
      },
    })
  }

  const canToggleCard = hasLyrics && hasImage
  const hasOriginal = diary.isOwner && (diary.text || diary.photoUrl)

  // 좋아요 색/상태
  //  - 비공개: 회색 완전 채움 (비활성)
  //  - 공개+안누름: 빨간 테두리만
  //  - 공개+눌렀음: 빨강 완전 채움
  const likeEnabled = diary.isPublic
  const heartColor = likeEnabled ? HEART_RED : HEART_GRAY
  const heartFilled = !likeEnabled || diary.isLiked
  const likeTextColor = likeEnabled ? TEXT_BLACK : HEART_GRAY

  return (
    <div
      className="relative w-full h-full overflow-hidden flex flex-col"
      style={{ backgroundColor: '#FAF9F5' }}
    >
      {/* 헤더 — 뒤로가기 + 휴지통 */}
      <div className="shrink-0 flex items-center justify-between px-5 pt-5 pb-2">
        <BackButton onClick={handleBack} />
        {diary.isOwner ? (
          <button
            className="rounded-full p-2 -m-2 transition-all duration-150 ease-out hover:bg-black/5 active:bg-black/10"
            onClick={() => setDeleteConfirmOpen(true)}
            aria-label="삭제"
          >
            <TrashIcon size={26} />
          </button>
        ) : (
          <div style={{ width: 26, height: 26 }} />
        )}
      </div>

      {/* 날짜 + 날씨 + 무드 */}
      <div className="shrink-0 flex items-center justify-between px-8 pt-5 pb-4">
        <p
          className="font-nanum"
          style={{ fontWeight: 700, fontSize: 20, color: TEXT_BLACK }}
        >
          {formatDiaryDate(diary.date)}
        </p>
        <div className="flex items-center gap-4">
          <WeatherIcon weather={diary.weather} size={40} />
          <MoodIcon mood={diary.mood} size={42} />
        </div>
      </div>

      {/* 카드 영역 — z-10으로 잔디 위에 떠 있음. 가사 ↔ 이미지 flip 애니메이션 */}
      <div className="relative shrink-0 px-5 z-10">
        <div
          className="w-full relative group"
          style={{
            aspectRatio: '1 / 1',
            perspective: '1200px',
            cursor: canToggleCard ? 'pointer' : 'default',
          }}
          onClick={
            canToggleCard ? () => setShowLyrics(!showLyrics) : undefined
          }
        >
          {/* 회전 컨테이너 — showLyrics 에 따라 Y축 0deg ↔ 180deg */}
          <div
            className="absolute inset-0"
            style={{
              transformStyle: 'preserve-3d',
              transition: 'transform 850ms cubic-bezier(0.4, 0, 0.2, 1)',
              transform: showLyrics ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}
          >
            {/* 앞면: 이미지 */}
            <div
              className="absolute inset-0 rounded-[20px] overflow-hidden"
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
              }}
            >
              {hasImage ? (
                <img
                  src={diary.imageUrl!}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ backgroundColor: '#E8E8E8' }}
                >
                  <span
                    className="font-nanum text-[14px] text-[#7a7a7a]"
                    style={{ fontWeight: 700 }}
                  >
                    그림을 만들고 있어요...
                  </span>
                </div>
              )}
            </div>
            {/* 뒷면: 가사 — rotateY(180) 으로 미리 뒤집어둠 */}
            <div
              className="absolute inset-0 rounded-[20px] overflow-hidden"
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                backgroundColor: LYRICS_BLUE,
              }}
            >
              <div
                className="w-full h-full overflow-y-auto"
                style={{ padding: '32px 40px' }}
              >
                <p
                  className="font-katuri text-center whitespace-pre-wrap break-keep"
                  style={{
                    fontWeight: 400,
                    fontSize: 22,
                    lineHeight: 1.55,
                    color: TEXT_BLACK,
                  }}
                >
                  {diary.lyrics ?? '가사를 만들고 있어요...'}
                </p>
              </div>
            </div>
          </div>

          {/* 토글 버튼 — 부모(group) 호버/액티브와 연동돼서 박스 어디를 만져도 같이 강조됨 */}
          {canToggleCard && (
            <button
              className="absolute z-10 flex items-center justify-center rounded-full transition-all duration-150 ease-out group-hover:bg-white/60 group-active:bg-white/80"
              style={{ left: 10, bottom: 8, width: 38, height: 34 }}
              onClick={(e) => {
                // 부모 박스에도 onClick이 걸려있어서 막지 않으면 토글이 두 번 일어남
                e.stopPropagation()
                setShowLyrics(!showLyrics)
              }}
              aria-label={showLyrics ? '그림 보기' : '가사 보기'}
            >
              {showLyrics ? <ImageToggleIcon /> : <LineToggleIcon />}
            </button>
          )}
        </div>
      </div>

      {/* 잔디 영역 — flex-1로 나머지 채움. 카드 위로 끌어올려서 곡선이 카드 하단 1/3에 걸침 */}
      <div
        className="relative flex-1 flex flex-col px-9"
        style={{
          backgroundColor: GRASS_GREEN,
          marginTop: -230,
          paddingTop: 260,
          paddingBottom: 24,
          borderRadius: '50% 50% 0 0 / 60px 60px 0 0',
        }}
      >
        {/* 발자국 장식 — 잔디 영역 전역에 분산 */}
        <GrassSprig style={{ left: '6%', top: 180 }} size={14} />
        <GrassSprig style={{ right: '8%', top: 220 }} size={14} />
        <GrassSprig style={{ left: '12%', bottom: 135 }} />
        <GrassSprig style={{ right: '14%', bottom: 155 }} />
        <GrassSprig style={{ left: '50%', bottom: 120 }} size={14} />

        {/* 좋아요 + 책 아이콘 */}
        <div className="flex items-center justify-between">
          <button
            className="flex items-center gap-2"
            disabled={!likeEnabled || likeMutation.isPending}
            onClick={() => likeMutation.mutate({ wasLiked: diary.isLiked })}
            aria-label="좋아요"
            aria-pressed={diary.isLiked}
          >
            <HeartIcon size={36} color={heartColor} filled={heartFilled} />
            <span
              className="font-nanum text-[18px]"
              style={{ fontWeight: 800, color: likeTextColor }}
            >
              {diary.likeCount}
            </span>
          </button>
          {hasOriginal && (
            <button
              onClick={() => setOriginalOpen(true)}
              aria-label="원본 보기"
            >
              <BookIcon size={41} />
            </button>
          )}
        </div>

        {/* 음악 컨트롤 — 좋아요 바로 아래 붙임 */}
        <div className="mt-4">
          {diary.musicUrl ? (
            <CustomMusicPlayer src={diary.musicUrl} />
          ) : (
            <p
              className="font-nanum text-center text-[14px]"
              style={{ color: '#5a5a5a', fontWeight: 700 }}
            >
              노래를 만들고 있어요...
            </p>
          )}
        </div>

        {/* 공유 토글 — 자연 흐름 하단 (잔디 안 가운데, 좌우 여백) */}
        {diary.isOwner && (
          <div
            className="mt-auto flex items-center px-5 mx-auto w-full"
            style={{
              maxWidth: 320,
              height: 72,
              backgroundColor: SHARE_CARD_GREEN,
              borderRadius: 16,
            }}
          >
            <div className="flex-1">
              <p
                className="font-nanum text-[17px]"
                style={{ fontWeight: 800, color: TEXT_BLACK }}
              >
                노래 공유
              </p>
              <p
                className="font-nanum text-[12px] mt-[3px]"
                style={{ fontWeight: 500, color: TEXT_BLACK }}
              >
                다른 친구들도 이 노래를 들을 수 있어요!
              </p>
            </div>
            <button
              disabled={publishMutation.isPending}
              onClick={() => publishMutation.mutate({ wasPublic: diary.isPublic })}
              aria-label="공개 토글"
              aria-pressed={diary.isPublic}
            >
              <ToggleSwitch on={diary.isPublic} />
            </button>
          </div>
        )}
      </div>

      {originalOpen && (
        <OriginalContentModal diary={diary} onClose={() => setOriginalOpen(false)} />
      )}

      {deleteConfirmOpen && (
        <DeleteConfirmModal
          onCancel={() => {
            setDeleteConfirmOpen(false)
            deleteMutation.reset()
          }}
          onConfirm={handleConfirmDelete}
          isLoading={deleteMutation.isPending}
          isError={deleteMutation.isError}
        />
      )}
    </div>
  )
}
