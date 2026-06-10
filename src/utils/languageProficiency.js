export function calculateLanguageProficiency(
  repos
) {
  if (!repos || repos.length === 0) {
    return [];
  }

  const languageStats = {};

  repos.forEach((repo) => {
    if (!repo.language) return;

    if (
      !languageStats[repo.language]
    ) {
      languageStats[
        repo.language
      ] = {
        repos: 0,
        stars: 0,
        recentRepos: 0,
      };
    }

    languageStats[
      repo.language
    ].repos++;

    languageStats[
      repo.language
    ].stars +=
      repo.stargazers_count || 0;

    const daysSinceUpdate =
      (
        new Date() -
        new Date(repo.updated_at)
      ) /
      (1000 * 60 * 60 * 24);

    if (daysSinceUpdate <= 180) {
      languageStats[
        repo.language
      ].recentRepos++;
    }
  });

  const maxRepos = Math.max(
    ...Object.values(
      languageStats
    ).map((l) => l.repos)
  );

  const maxStars = Math.max(
    ...Object.values(
      languageStats
    ).map((l) => l.stars),
    1
  );

  const maxRecent = Math.max(
    ...Object.values(
      languageStats
    ).map(
      (l) => l.recentRepos
    ),
    1
  );

  return Object.entries(
    languageStats
  )
    .map(
      ([language, stats]) => {
        const repoScore =
          (stats.repos /
            maxRepos) *
          50;

        const starScore =
          (stats.stars /
            maxStars) *
          30;

        const recentScore =
          (stats.recentRepos /
            maxRecent) *
          20;

        return {
          language,

          score: Math.round(
            repoScore +
              starScore +
              recentScore
          ),

          repos: stats.repos,

          stars: stats.stars,

          recentRepos:
            stats.recentRepos,
        };
      }
    )
    .sort(
      (a, b) =>
        b.score - a.score
    )
    .slice(0, 8);
}