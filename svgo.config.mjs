// SVG 최적화 설정 (Figma export SVG 압축용)
// viewBox는 반드시 보존 — 이 프로젝트 SVG들은 width/height=100% + viewBox로 크기를 잡기 때문.
export default {
  multipass: true,
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          removeViewBox: false, // viewBox 제거 시 100% 스케일링이 깨짐 → 비활성
        },
      },
    },
  ],
};
