// CSS 는 index.html 의 <link> 로 직접 로드하므로 여기서 import 하지 않는다.
// (JS-import 방식은 dev 에서 모듈 실행 직전까지 스타일이 비어 FOUC 발생)

// 스크롤하다 화면에 들어오는 .reveal 요소를 한 번씩 나타나게 한다 (토스 스타일).
// IntersectionObserver = "이 요소가 화면(뷰포트)에 들어왔는지" 를 브라우저가 알려주는 기능.

// [data-reveal-group] 안에 있는 .reveal 들은 개별 관찰 대상에서 제외하고,
// 부모(그룹)가 화면에 들어오는 순간 자식 .reveal 들을 한꺼번에 등장시킨다.
// 가로 스크롤 캐러셀처럼 자식 일부가 뷰포트 밖에 있어도 한 번에 깨워주기 위함.
const groups = document.querySelectorAll<HTMLElement>('[data-reveal-group]')
const groupedReveals = new Set<HTMLElement>()
groups.forEach((g) => {
  g.querySelectorAll<HTMLElement>('.reveal').forEach((el) => groupedReveals.add(el))
})

const reveals = Array.from(document.querySelectorAll<HTMLElement>('.reveal')).filter(
  (el) => !groupedReveals.has(el),
)

if ('IntersectionObserver' in window) {
  const observerOptions: IntersectionObserverInit = {
    threshold: 0.15, // 15% 보이면 등장
    rootMargin: '0px 0px -10% 0px', // 화면 하단 10% 전에 미리 발동
  }

  // 1) 개별 reveal (그룹에 속하지 않은 것들)
  if (reveals.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target) // 한 번 나타나면 더는 관찰 안 함
        }
      }
    }, observerOptions)

    reveals.forEach((el) => observer.observe(el))
  }

  // 2) 그룹 reveal — 부모가 보이면 자식 .reveal 들을 한꺼번에 등장
  if (groups.length > 0) {
    const groupObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target
            .querySelectorAll<HTMLElement>('.reveal')
            .forEach((el) => el.classList.add('is-visible'))
          groupObserver.unobserve(entry.target)
        }
      }
    }, observerOptions)

    groups.forEach((el) => groupObserver.observe(el))
  }
} else {
  // 옛 브라우저 등 관찰 기능이 없으면 그냥 다 보이게
  document
    .querySelectorAll<HTMLElement>('.reveal')
    .forEach((el) => el.classList.add('is-visible'))
}
