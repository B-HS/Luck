import { Badge } from "../ui/components/badge";
import { formatDate } from "../lib/format";

export const EpisodeHeader = ({
  episode,
  drawDate,
  latestEpisode,
}: {
  episode: number;
  drawDate: string;
  latestEpisode: number;
}) => (
  <div className="flex flex-col items-center gap-2">
    <div className="flex items-center gap-2">
      <h1 className="text-2xl font-bold">제 {episode}회 추첨결과</h1>
      {episode === latestEpisode && <Badge variant="default">최신</Badge>}
    </div>
    <p className="text-muted-foreground">{formatDate(drawDate)}</p>
    <div className="flex gap-2 mt-2">
      {episode > 1 && (
        <a
          href={`/episode/${episode - 1}`}
          className="text-sm text-blue-600 hover:underline"
        >
          ← 이전 회차
        </a>
      )}
      {episode < latestEpisode && (
        <a
          href={`/episode/${episode + 1}`}
          className="text-sm text-blue-600 hover:underline"
        >
          다음 회차 →
        </a>
      )}
    </div>
  </div>
);
