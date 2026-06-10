export function calculateLanguageAnalysis(
  repos,
  calendar
) {
  if (!repos || repos.length === 0) {
    return {
      languageDistribution: [],
      languageScores: [],
      impactScore: 0,
      weeklyAverage: 0,
      monthlyAverage: 0,
      topRepositories: [],
      developerPersonality:
        "No repositories found",
    };
  }

  // =========================
  // Language Distribution
  // =========================

  const languageMap = {};

  repos.forEach((repo) => {
  if (!repo.language) return;

  languageMap[repo.language] =
    (languageMap[repo.language] || 0) + 1;
  });

  const sortedLanguages =
    Object.entries(languageMap)
      .sort((a, b) => b[1] - a[1]);

  const topLanguages =
    sortedLanguages.slice(0, 6);

  const remainingLanguages =
    sortedLanguages.slice(6);

  const otherCount =
    remainingLanguages.reduce(
      (sum, [, count]) =>
        sum + count,
      0
    );

  const languageDistribution =
    topLanguages.map(
      ([language, count]) => ({
        language,
        count,
      })
    );

  if (otherCount > 0) {
    languageDistribution.push({
      language: "Other",
      count: otherCount,
    });
  }


  // =========================
  // Language Proficiency
  // =========================

  const languageScoresMap = {};

  repos.forEach((repo) => {
    const language =
      repo.language || "Unknown";

    const repoImpact =
      repo.stargazers_count +
      repo.forks_count +
      1;

    languageScoresMap[language] =
      (languageScoresMap[language] || 0) +
      repoImpact;
  });

  const maxScore = Math.max(
    ...Object.values(languageScoresMap),
    1
  );

  const languageScores =
    Object.entries(languageScoresMap)
      .map(([language, score]) => ({
        language,
        score: Math.round(
          (score / maxScore) * 100
        ),
      }))
      .sort(
        (a, b) =>
          b.score - a.score
      );

  // =========================
  // Contribution Frequency
  // =========================

  const totalContributions =
    calendar?.totalContributions || 0;

  const weeklyAverage =
    Math.round(
      totalContributions / 52
    );

  const monthlyAverage =
    Math.round(
      totalContributions / 12
    );

  // =========================
  // Impact Score
  // =========================

  const totalStars =
    repos.reduce(
      (sum, repo) =>
        sum +
        repo.stargazers_count,
      0
    );

  const totalForks =
    repos.reduce(
      (sum, repo) =>
        sum + repo.forks_count,
      0
    );

  const totalWatchers =
    repos.reduce(
      (sum, repo) =>
        sum + repo.watchers_count,
      0
    );

  const rawImpact =
    totalStars +
    totalForks +
    totalWatchers;

  let impactScore = 20;

  if (rawImpact >= 5000) {
    impactScore = 100;
  } else if (
    rawImpact >= 1000
  ) {
    impactScore = 80;
  } else if (
    rawImpact >= 250
  ) {
    impactScore = 60;
  } else if (
    rawImpact >= 50
  ) {
    impactScore = 40;
  }

  // =========================
  // Top Repositories
  // =========================

  const topRepositories =
    [...repos]
      .sort(
        (a, b) =>
          (b.stargazers_count +
            b.forks_count) -
          (a.stargazers_count +
            a.forks_count)
      )
      .slice(0, 5)
      .map((repo) => ({
        name: repo.name,
        stars:
          repo.stargazers_count,
        forks: repo.forks_count,
      }));

  // =========================
  // Developer Personality
  // =========================

  const topLanguage =
    languageScores[0]
      ?.language || "";

  let developerPersonality =
    "Versatile Developer";

  if (
    topLanguage ===
      "JavaScript" ||
    topLanguage ===
      "TypeScript"
  ) {
    developerPersonality =
      "Modern Web Architect";
  } else if (
    topLanguage === "Python"
  ) {
    developerPersonality =
      "Data Explorer";
  } else if (
    topLanguage === "Java"
  ) {
    developerPersonality =
      "Enterprise Builder";
  } else if (
    topLanguage === "C++"
  ) {
    developerPersonality =
      "Systems Engineer";
  }

  return {
    languageDistribution,
    languageScores,

    impactScore,

    weeklyAverage,
    monthlyAverage,

    topRepositories,

    developerPersonality,

    totalStars,
    totalForks,
    totalWatchers,
  };
}