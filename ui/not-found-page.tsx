export const NotFoundPage = ({ episode }: { episode: number }) => (
  <div className="max-w-2xl mx-auto p-4 text-center space-y-4">
    <h1 className="text-2xl font-bold">제 {episode}회 결과 없음</h1>
    <p className="text-muted-foreground">
      아직 추첨되지 않았거나 존재하지 않는 회차입니다.
    </p>
    <a href="/" className="text-blue-600 hover:underline">
      최신 회차로 이동 →
    </a>
  </div>
);
