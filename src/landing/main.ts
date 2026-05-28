// CSS 는 index.html 의 <link> 로 직접 로드하므로 여기서 import 하지 않는다.
// (JS-import 방식은 dev 에서 모듈 실행 직전까지 스타일이 비어 FOUC 발생)

// 스크롤하다 화면에 들어오는 .reveal 요소를 한 번씩 나타나게 한다 (토스 스타일).
// IntersectionObserver = "이 요소가 화면(뷰포트)에 들어왔는지" 를 브라우저가 알려주는 기능.
const reveals = document.querySelectorAll<HTMLElement>('.reveal')

if ('IntersectionObserver' in window && reveals.length > 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target) // 한 번 나타나면 더는 관찰 안 함
        }
      }
    },
    {
      threshold: 0.15, // 15% 보이면 등장
      rootMargin: '0px 0px -10% 0px', // 화면 하단 10% 전에 미리 발동
    },
  )

  reveals.forEach((el) => observer.observe(el))
} else {
  // 옛 브라우저 등 관찰 기능이 없으면 그냥 다 보이게
  reveals.forEach((el) => el.classList.add('is-visible'))
}
