import { describe, expect, test, mock } from "bun:test";
import { createLottoService } from "../../services/lotto-service";
import { createLruCache } from "../../lib/lru-cache";

const makeMockResult = (episodeId: number) => ({
  id: 1,
  episodeId,
  num1: 1,
  num2: 7,
  num3: 9,
  num4: 17,
  num5: 27,
  num6: 38,
  bonusNum: 31,
  drawDate: "20260221",
  rank1Winners: 24,
  rank1Prize: 1102298407,
  rank1TotalPrize: 26455161768,
  rank2Winners: 153,
  rank2Prize: 28818259,
  rank2TotalPrize: 4409193627,
  rank3Winners: 4649,
  rank3Prize: 948418,
  rank3TotalPrize: 4409195282,
  rank4Winners: 211663,
  rank4Prize: 50000,
  rank4TotalPrize: 10583150000,
  rank5Winners: 3139766,
  rank5Prize: 5000,
  rank5TotalPrize: 15698830000,
  totalSales: 123111058000,
  relatedSales: 123111058000,
  winType0: 0,
  winType1: 20,
  winType2: 2,
  winType3: 2,
  totalWinners: 3356255,
  gameSeqNo: 1,
});

describe("LottoService", () => {
  test("캐시 히트 시 DB 결과 반환", async () => {
    const cached = makeMockResult(1210);
    const mockRepo = {
      findByEpisode: mock(() => Promise.resolve(cached)),
      insert: mock(() => Promise.resolve()),
    };
    const mockEpisodeRepo = {
      findById: mock(() => Promise.resolve(null)),
      findLatest: mock(() => Promise.resolve(null)),
      findAll: mock(() => Promise.resolve([])),
      insert: mock(() => Promise.resolve()),
      markDrawn: mock(() => Promise.resolve()),
      insertMany: mock(() => Promise.resolve()),
    };
    const mockClient = {
      fetchResult: mock(() => Promise.resolve(null)),
    };

    const service = createLottoService({
      lottoResultRepo: mockRepo,
      episodeRepo: mockEpisodeRepo,
      dhlotteryClient: mockClient,
      lruCache: createLruCache(30),
    });

    const result = await service.getResult(1210);
    expect(result).toEqual(cached);
    expect(mockClient.fetchResult).not.toHaveBeenCalled();
  });

  test("캐시 미스 시 외부 API 호출 후 저장", async () => {
    const fetched = {
      episodeId: 1209,
      num1: 3,
      num2: 10,
      num3: 15,
      num4: 22,
      num5: 33,
      num6: 44,
      bonusNum: 7,
      drawDate: "20260214",
      rank1Winners: 10,
      rank1Prize: 2000000000,
      rank1TotalPrize: 20000000000,
      rank2Winners: 50,
      rank2Prize: 50000000,
      rank2TotalPrize: 2500000000,
      rank3Winners: 1000,
      rank3Prize: 1000000,
      rank3TotalPrize: 1000000000,
      rank4Winners: 50000,
      rank4Prize: 50000,
      rank4TotalPrize: 2500000000,
      rank5Winners: 800000,
      rank5Prize: 5000,
      rank5TotalPrize: 4000000000,
      totalSales: 100000000000,
      relatedSales: 100000000000,
      winType0: 0,
      winType1: 8,
      winType2: 1,
      winType3: 1,
      totalWinners: 851060,
      gameSeqNo: 1,
    };

    let callCount = 0;
    const mockRepo = {
      findByEpisode: mock(() => {
        callCount++;
        if (callCount === 1) return Promise.resolve(undefined);
        return Promise.resolve({ id: 1, ...fetched });
      }),
      insert: mock(() => Promise.resolve()),
    };
    const mockEpisodeRepo = {
      findById: mock(() => Promise.resolve(null)),
      findLatest: mock(() => Promise.resolve(null)),
      findAll: mock(() => Promise.resolve([])),
      insert: mock(() => Promise.resolve()),
      markDrawn: mock(() => Promise.resolve()),
      insertMany: mock(() => Promise.resolve()),
    };
    const mockClient = {
      fetchResult: mock(() => Promise.resolve(fetched)),
    };

    const service = createLottoService({
      lottoResultRepo: mockRepo,
      episodeRepo: mockEpisodeRepo,
      dhlotteryClient: mockClient,
      lruCache: createLruCache(30),
    });

    const result = await service.getResult(1209);
    expect(mockClient.fetchResult).toHaveBeenCalledWith(1209);
    expect(mockRepo.insert).toHaveBeenCalled();
    expect(mockEpisodeRepo.markDrawn).toHaveBeenCalledWith(1209, "20260214");
    expect(result?.episodeId).toBe(1209);
  });
});
