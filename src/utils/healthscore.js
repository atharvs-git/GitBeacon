export function calculateCommitConsistency(calendar) {
  const allDays = calendar.weeks.flatMap(
    (week) => week.contributionDays
  );

  const activeDays = allDays.filter(
    (day) => day.contributionCount > 0
  );

  if (activeDays.length === 0) {
    return {
      score: 0,
      activeWeeksScore: 0,
      streakQualityScore: 0,
      contributionFrequencyScore: 0,
      inactivityScore: 0,
    };
  }

  const firstContributionDate = activeDays[0].date;

  const analysisDays = allDays.filter(
    (day) => day.date >= firstContributionDate
  );

  const firstDate = new Date(activeDays[0].date);

  const lastDate = new Date(
    activeDays[activeDays.length - 1].date
  );

  const weeksSinceFirstContribution = Math.max(
  1,
  Math.ceil(
    (lastDate - firstDate) /
      (1000 * 60 * 60 * 24 * 7)
  ) + 1
  );

  const activeWeeks = calendar.weeks.filter(
    (week) =>
      week.contributionDays.some(
        (day) => day.contributionCount > 0
      )
  ).length;

  const activeWeeksScore = Math.min(
  100,
  Math.round(
    (activeWeeks /
      weeksSinceFirstContribution) *
      100
  )
  );

  let currentStreak = 0;
  let longestStreak = 0;

  for (const day of analysisDays) {
    if (day.contributionCount > 0) {
      currentStreak++;

      if (currentStreak > longestStreak) {
        longestStreak = currentStreak;
      }
    } else {
      currentStreak = 0;
    }
  }

  let streakQualityScore;

  if (longestStreak >= 60) {
    streakQualityScore = 100;
  } else if (longestStreak >= 30) {
    streakQualityScore = 80;
  } else if (longestStreak >= 14) {
    streakQualityScore = 60;
  } else if (longestStreak >= 7) {
    streakQualityScore = 40;
  } else {
    streakQualityScore = 20;
  }

  const totalContributions =
    calendar.totalContributions;

  const contributionsPerActiveWeek =
    totalContributions / activeWeeks;

  let contributionFrequencyScore;

  if (contributionsPerActiveWeek >= 20) {
    contributionFrequencyScore = 100;
  } else if (contributionsPerActiveWeek >= 10) {
    contributionFrequencyScore = 80;
  } else if (contributionsPerActiveWeek >= 5) {
    contributionFrequencyScore = 60;
  } else if (contributionsPerActiveWeek >= 2) {
    contributionFrequencyScore = 40;
  } else {
    contributionFrequencyScore = 20;
  }

  let currentInactivity = 0;
  let longestInactivity = 0;

  for (const day of analysisDays) {
    if (day.contributionCount === 0) {
      currentInactivity++;

      if (currentInactivity > longestInactivity) {
        longestInactivity = currentInactivity;
      }
    } else {
      currentInactivity = 0;
    }
  }

  let inactivityScore;

  if (longestInactivity <= 7) {
    inactivityScore = 100;
  } else if (longestInactivity <= 14) {
    inactivityScore = 80;
  } else if (longestInactivity <= 30) {
    inactivityScore = 60;
  } else if (longestInactivity <= 60) {
    inactivityScore = 40;
  } else {
    inactivityScore = 20;
  }

  const commitConsistencyScore = Math.min(
  100,
  Math.round(
    activeWeeksScore * 0.4 +
      streakQualityScore * 0.25 +
      contributionFrequencyScore * 0.2 +
      inactivityScore * 0.15
  )
  );

  return {
    score: commitConsistencyScore,
    activeWeeksScore,
    streakQualityScore,
    contributionFrequencyScore,
    inactivityScore,
  };
}

export function calculateRepoMaintenance(repos) {
  if (!repos || repos.length === 0) {
    return {
      freshnessScore: 0,
      issuesHealthScore: 0,
      documentationScore: 0,
      licenseScore: 0,
      repoMaintenanceScore: 0,
    };
  }

  const today = new Date();

  let freshnessTotal = 0;
  let issuesTotal = 0;
  let docsTotal = 0;
  let licenseTotal = 0;

  repos.forEach((repo) => {
    // Repository Freshness
    const updatedDate = new Date(repo.updated_at);

    const daysOld = Math.floor(
      (today - updatedDate) /
        (1000 * 60 * 60 * 24)
    );

    let freshnessScore = 20;

    if (daysOld <= 30) {
      freshnessScore = 100;
    } else if (daysOld <= 90) {
      freshnessScore = 80;
    } else if (daysOld <= 180) {
      freshnessScore = 60;
    } else if (daysOld <= 365) {
      freshnessScore = 40;
    }

    freshnessTotal += freshnessScore;

    // Open Issues Health
    const issues = repo.open_issues_count || 0;

    let issueScore = 100;

    if (issues > 50) {
      issueScore = 20;
    } else if (issues > 20) {
      issueScore = 40;
    } else if (issues > 10) {
      issueScore = 60;
    } else if (issues > 5) {
      issueScore = 80;
    }

    issuesTotal += issueScore;

    // Documentation Presence
    const hasDescription =
      repo.description &&
      repo.description.trim().length > 0;

    docsTotal += hasDescription ? 100 : 20;

    // License Presence
    const hasLicense = !!repo.license;

    licenseTotal += hasLicense ? 100 : 20;
  });

  const freshnessScore = Math.round(
    freshnessTotal / repos.length
  );

  const issuesHealthScore = Math.round(
    issuesTotal / repos.length
  );

  const documentationScore = Math.round(
    docsTotal / repos.length
  );

  const licenseScore = Math.round(
    licenseTotal / repos.length
  );

  const repoMaintenanceScore = Math.round(
    freshnessScore * 0.4 +
      issuesHealthScore * 0.25 +
      documentationScore * 0.2 +
      licenseScore * 0.15
  );

  return {
    freshnessScore,
    issuesHealthScore,
    documentationScore,
    licenseScore,
    repoMaintenanceScore,
  };
}



export function calculateReadmeQuality(
  readmeContent
) {
  if (!readmeContent) {
    return {
      readmeExistsScore: 0,
      readmeLengthScore: 0,
      headingStructureScore: 0,
      mediaScore: 0,
      readmeQualityScore: 0,
    };
  }

  const readmeExistsScore = 100;

  const length = readmeContent.length;

  let readmeLengthScore = 20;

  if (length > 5000) {
    readmeLengthScore = 100;
  } else if (length > 3000) {
    readmeLengthScore = 80;
  } else if (length > 1500) {
    readmeLengthScore = 60;
  } else if (length > 500) {
    readmeLengthScore = 40;
  }

  const headings =
    readmeContent.match(/^#+\s/gm) || [];

  let headingStructureScore = 20;

  if (headings.length >= 8) {
    headingStructureScore = 100;
  } else if (headings.length >= 5) {
    headingStructureScore = 80;
  } else if (headings.length >= 3) {
    headingStructureScore = 60;
  } else if (headings.length >= 1) {
    headingStructureScore = 40;
  }

  const links =
    (
      readmeContent.match(
        /\[.*?\]\(.*?\)/g
      ) || []
    ).length;

  const images =
    (
      readmeContent.match(
        /!\[.*?\]\(.*?\)/g
      ) || []
    ).length;

  const mediaCount =
    links + images;

  let mediaScore = 20;

  if (mediaCount >= 10) {
    mediaScore = 100;
  } else if (mediaCount >= 5) {
    mediaScore = 80;
  } else if (mediaCount >= 3) {
    mediaScore = 60;
  } else if (mediaCount >= 1) {
    mediaScore = 40;
  }

  const readmeQualityScore = Math.round(
    readmeExistsScore * 0.4 +
      readmeLengthScore * 0.2 +
      headingStructureScore * 0.2 +
      mediaScore * 0.2
  );

  return {
    readmeExistsScore,
    readmeLengthScore,
    headingStructureScore,
    mediaScore,
    readmeQualityScore,
  };
}


export function calculateActivityTrend(calendar) {
  const allDays = calendar.weeks
    .flatMap((week) => week.contributionDays)
    .sort(
      (a, b) =>
        new Date(a.date) - new Date(b.date)
    );

  if (allDays.length < 120) {
    return {
      activityTrendScore: 20,
      activityTrendLabel: "Inactive",
    };
  }

  const recent60Days =
    allDays.slice(-60);

  const previous60Days =
    allDays.slice(-120, -60);

  const recentContributions =
    recent60Days.reduce(
      (sum, day) =>
        sum + day.contributionCount,
      0
    );

  const previousContributions =
    previous60Days.reduce(
      (sum, day) =>
        sum + day.contributionCount,
      0
    );

  if (
    previousContributions === 0 &&
    recentContributions === 0
  ) {
    return {
      activityTrendScore: 20,
      activityTrendLabel: "Inactive",
    };
  }

  const changePercent =
    previousContributions === 0
      ? 100
      : (
          ((recentContributions -
            previousContributions) /
            previousContributions) *
          100
        );

  let activityTrendScore;
  let activityTrendLabel;

  if (changePercent >= 50) {
    activityTrendScore = 100;
    activityTrendLabel =
      "Growing Rapidly";
  } else if (changePercent >= 15) {
    activityTrendScore = 80;
    activityTrendLabel = "Growing";
  } else if (changePercent >= -15) {
    activityTrendScore = 60;
    activityTrendLabel = "Stable";
  } else if (changePercent >= -50) {
    activityTrendScore = 40;
    activityTrendLabel = "Declining";
  } else {
    activityTrendScore = 20;
    activityTrendLabel = "Inactive";
  }

  return {
    activityTrendScore,
    activityTrendLabel,
    recentContributions,
    previousContributions,
  };
}


export function calculateOpenSourceParticipation(
  repos,
  openSourceStats
) {
  if (!repos || repos.length === 0) {
    return {
      contributedReposScore: 0,
      pullRequestScore: 0,
      forkActivityScore: 0,
      starsReceivedScore: 0,
      openSourceParticipationScore: 0,
    };
  }

  const contributedRepos =
    openSourceStats?.contributedRepositories || 0;

  let contributedReposScore;

  if (contributedRepos >= 100) {
    contributedReposScore = 100;
  } else if (contributedRepos >= 50) {
    contributedReposScore = 80;
  } else if (contributedRepos >= 20) {
    contributedReposScore = 60;
  } else if (contributedRepos >= 5) {
    contributedReposScore = 40;
  } else {
    contributedReposScore = 20;
  }

  const pullRequests =
    openSourceStats?.pullRequests || 0;

  let pullRequestScore;

  if (pullRequests >= 500) {
    pullRequestScore = 100;
  } else if (pullRequests >= 200) {
    pullRequestScore = 80;
  } else if (pullRequests >= 50) {
    pullRequestScore = 60;
  } else if (pullRequests >= 10) {
    pullRequestScore = 40;
  } else {
    pullRequestScore = 20;
  }

  const totalForks = repos.reduce(
    (sum, repo) =>
      sum + repo.forks_count,
    0
  );

  let forkActivityScore;

  if (totalForks >= 1000) {
    forkActivityScore = 100;
  } else if (totalForks >= 250) {
    forkActivityScore = 80;
  } else if (totalForks >= 50) {
    forkActivityScore = 60;
  } else if (totalForks >= 10) {
    forkActivityScore = 40;
  } else {
    forkActivityScore = 20;
  }

  const totalStars = repos.reduce(
    (sum, repo) =>
      sum + repo.stargazers_count,
    0
  );

  let starsReceivedScore;

  if (totalStars >= 5000) {
    starsReceivedScore = 100;
  } else if (totalStars >= 1000) {
    starsReceivedScore = 80;
  } else if (totalStars >= 100) {
    starsReceivedScore = 60;
  } else if (totalStars >= 10) {
    starsReceivedScore = 40;
  } else {
    starsReceivedScore = 20;
  }

  const openSourceParticipationScore =
    Math.round(
      contributedReposScore * 0.4 +
      pullRequestScore * 0.25 +
      forkActivityScore * 0.2 +
      starsReceivedScore * 0.15
    );

  return {
    contributedReposScore,
    pullRequestScore,
    forkActivityScore,
    starsReceivedScore,
    openSourceParticipationScore,

    contributedRepos,
    pullRequests,
    totalForks,
    totalStars,
  };
}


export function calculateFinalHealthScore({
  commitScore,
  maintenanceScore,
  readmeScore,
  activityTrendScore,
  openSourceScore,
}) {
  const finalHealthScore = Math.min(
  100,
  Math.round(
    commitScore * 0.3 +
      maintenanceScore * 0.25 +
      readmeScore * 0.15 +
      activityTrendScore * 0.1 +
      openSourceScore * 0.2
  )
  );

  let healthGrade;

  if (finalHealthScore >= 90) {
    healthGrade = "A+";
  } else if (finalHealthScore >= 80) {
    healthGrade = "A";
  } else if (finalHealthScore >= 70) {
    healthGrade = "B";
  } else if (finalHealthScore >= 60) {
    healthGrade = "C";
  } else if (finalHealthScore >= 50) {
    healthGrade = "D";
  } else {
    healthGrade = "F";
  }

  return {
    finalHealthScore,
    healthGrade,
  };
}