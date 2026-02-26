import type { EpisodeRepository } from '../repository/episode-repository'

const FIRST_DRAW_DATE = new Date('2002-12-07T00:00:00+09:00')
const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000

export const createEpisodeService = (deps: { episodeRepo: EpisodeRepository }) => ({
    getLatestEpisodeNumber: () => {
        const now = new Date()
        const diff = now.getTime() - FIRST_DRAW_DATE.getTime()
        const weeks = Math.floor(diff / MS_PER_WEEK)
        const drawDateThisWeek = new Date(FIRST_DRAW_DATE.getTime() + weeks * MS_PER_WEEK)

        const kstNow = new Date(now.getTime() + 9 * 60 * 60 * 1000)
        const kstHour = kstNow.getUTCHours()
        const isPastDraw = now >= drawDateThisWeek && (now.getTime() > drawDateThisWeek.getTime() + 24 * 60 * 60 * 1000 || kstHour >= 22)

        return isPastDraw ? weeks + 1 : weeks
    },

    getLatestDrawnEpisode: () => deps.episodeRepo.findLatest(),

    getEpisodes: (limit = 20, offset = 0) => deps.episodeRepo.findAll(limit, offset),

    ensureEpisodeExists: async (id: number) => {
        const existing = await deps.episodeRepo.findById(id)
        if (!existing) {
            await deps.episodeRepo.insert({ id, isDrawn: false })
        }
    },
})

export type EpisodeService = ReturnType<typeof createEpisodeService>
