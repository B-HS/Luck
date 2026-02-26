export const getCacheHeader = (episode: number, latestEpisode: number) => {
    if (episode < latestEpisode) {
        return 'public, max-age=86400, s-maxage=604800'
    }
    return 'public, max-age=0, s-maxage=300, stale-while-revalidate=60'
}
