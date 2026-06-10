import {
  fetchContributionCalendar,
  fetchRepositories,
  fetchReadme,
  fetchOpenSourceStats,
} from "../services/githubService";

import {
  calculateCommitConsistency,
  calculateRepoMaintenance,
  calculateReadmeQuality,
  calculateActivityTrend,
  calculateOpenSourceParticipation,
} from "./healthScore";

import {
  calculateLearningVelocity,
} from "./learningVelocity";

import {
  calculateComparisonFinalScore,
} from "./comparisonScore";

export async function buildDeveloperProfile(
  username
) {
  try {
    const calendar =
      await fetchContributionCalendar(
        username
      );

    const repos =
      await fetchRepositories(
        username
      );

    if (
      !repos ||
      repos.length === 0
    ) {
      throw new Error(
        "No repositories found."
      );
    }

    const rankedRepos =
      [...repos].sort(
        (a, b) =>
          (b.stargazers_count +
            b.forks_count) -
          (a.stargazers_count +
            a.forks_count)
      );

    const analyzedRepos =
      rankedRepos.slice(0, 50);

    const openSourceStats =
      await fetchOpenSourceStats(
        username
      );

    let commitScore = 0;
    let activityTrendScore = 0;

    if (calendar) {
      const commitResult =
        calculateCommitConsistency(
          calendar
        );

      const activityResult =
        calculateActivityTrend(
          calendar
        );

      commitScore =
        commitResult.score;

      activityTrendScore =
        activityResult.activityTrendScore;
    }

    const maintenanceResult =
      calculateRepoMaintenance(
        analyzedRepos
      );

    const openSourceResult =
      calculateOpenSourceParticipation(
        analyzedRepos,
        openSourceStats
      );

    const learningResult =
      calculateLearningVelocity(
        analyzedRepos
      );

    let readmeScore = 0;

    try {
      const topRepo =
        rankedRepos[0];

      if (topRepo) {
        const readmeContent =
          await fetchReadme(
            topRepo.owner.login,
            topRepo.name
          );

        const readmeResult =
          calculateReadmeQuality(
            readmeContent
          );

        readmeScore =
          readmeResult.readmeQualityScore;
      }
    } catch {
      readmeScore = 0;
    }

    const comparisonResult =
      calculateComparisonFinalScore({
        commitConsistency:
          commitScore,

        repoMaintenance:
          maintenanceResult.repoMaintenanceScore,

        readmeQuality:
          readmeScore,

        activityTrend:
          activityTrendScore,

        openSourceParticipation:
          openSourceResult.openSourceParticipationScore,

        technologyDiversity:
          learningResult.technologyDiversityScore,

        learningVelocity:
          learningResult.learningVelocityScore,
      });

    return {
      username,

      avatar:
        repos[0]?.owner
          ?.avatar_url || "",

      commitConsistency:
        commitScore,

      repoMaintenance:
        maintenanceResult.repoMaintenanceScore,

      readmeQuality:
        readmeScore,

      activityTrend:
        activityTrendScore,

      openSourceParticipation:
        openSourceResult.openSourceParticipationScore,

      technologyDiversity:
        learningResult.technologyDiversityScore,

      learningVelocity:
        learningResult.learningVelocityScore,

      finalScore:
        comparisonResult.finalScore,

      grade:
        comparisonResult.grade,
    };
  } catch (error) {
    console.error(
      "Developer comparison failed:",
      error
    );

    return null;
  }
}