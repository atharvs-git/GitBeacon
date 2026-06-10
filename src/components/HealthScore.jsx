import { useEffect, useState } from "react";
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
  calculateFinalHealthScore,
} from "../utils/healthscore";

import HealthRadarChart from "./HealthRadarChart";
import "../styles/HealthRadarChart.css";

function HealthScore({ username }) {
  const [scoreData, setScoreData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadHealthScore() {
      try {
        setError(null);
        setScoreData(null);

        console.log("Starting fetch...");

        const calendar =
          await fetchContributionCalendar(username);

        const repos =
          await fetchRepositories(username);

        const openSourceStats =
          await fetchOpenSourceStats(username);

        console.log(
          "Open Source Stats:",
          openSourceStats
        );

        if (!repos || repos.length === 0) {
          throw new Error(
            "No repositories found."
          );
        }

        // Analyze only top repositories
        const rankedRepos = [...repos].sort(
          (a, b) =>
            (b.stargazers_count +
              b.forks_count) -
            (a.stargazers_count +
              a.forks_count)
        );

        const analyzedRepos =
          rankedRepos.slice(0, 50);

        console.log(
          `Analyzing ${analyzedRepos.length} of ${repos.length} repositories`
        );

        // Commit Consistency
        let commitResult = {
          score: null,
          activeWeeksScore: null,
          streakQualityScore: null,
          contributionFrequencyScore: null,
          inactivityScore: null,
        };

        try {
          if (calendar) {
            commitResult =
              calculateCommitConsistency(
                calendar
              );
          }
        } catch (error) {
          console.warn(
            "Commit analysis failed:",
            error
          );
        }

        // Activity Trend
        let activityTrendResult = {
          activityTrendScore: null,
          activityTrendLabel:
            "Not available for organizations",
        };

        try {
          if (calendar) {
            activityTrendResult =
              calculateActivityTrend(
                calendar
              );
          }
        } catch (error) {
          console.warn(
            "Activity trend failed:",
            error
          );
        }

        // Repo Maintenance
        let maintenanceResult = {
          freshnessScore: 0,
          issuesHealthScore: 0,
          documentationScore: 0,
          licenseScore: 0,
          repoMaintenanceScore: 0,
        };

        try {
          maintenanceResult =
            calculateRepoMaintenance(
              analyzedRepos
            );
        } catch (error) {
          console.warn(
            "Maintenance analysis failed:",
            error
          );
        }

        // README Quality
        let readmeResult = {
          readmeExistsScore: null,
          readmeLengthScore: null,
          headingStructureScore: null,
          mediaScore: null,
          readmeQualityScore: null,
        };

        try {
          if (repos.length <= 500) {
            const topRepo =
              rankedRepos[0];

            if (topRepo) {
              console.log(
                "Top Repository:",
                topRepo.name
              );

              const readmeContent =
                await fetchReadme(
                  topRepo.owner.login,
                  topRepo.name
                );

              readmeResult =
                calculateReadmeQuality(
                  readmeContent
                );
            }
          } else {
            console.log(
              "README analysis skipped (large account)"
            );
          }
        } catch (error) {
          console.warn(
            "README analysis failed:",
            error
          );
        }

        let openSourceResult = {
          contributedReposScore: 0,
          pullRequestScore: 0,
          forkActivityScore: 0,
          starsReceivedScore: 0,
          openSourceParticipationScore: 0,
        };

        try {
          openSourceResult =
          calculateOpenSourceParticipation(
            analyzedRepos,
            openSourceStats
          );
        } catch (error) {
          console.warn(
            "Open Source Participation failed:",
            error
          );
        }
        const finalScoreResult =
        calculateFinalHealthScore({
          commitScore:
          commitResult.score ?? 0,
          maintenanceScore:
          maintenanceResult.repoMaintenanceScore ?? 0,
          readmeScore:
          readmeResult.readmeQualityScore ?? 0,
          activityTrendScore:
          activityTrendResult.activityTrendScore ?? 0,
          openSourceScore:
          openSourceResult.openSourceParticipationScore ?? 0,
        });

        setScoreData({
          ...commitResult,
          ...maintenanceResult,
          ...readmeResult,
          ...activityTrendResult,
          ...openSourceResult,
          ...finalScoreResult,

          totalRepositories:
            repos.length,

          analyzedRepositories:
            analyzedRepos.length,
        });
      } catch (error) {
        console.error(
          "Health score failed:",
          error
        );

        setError(
          error.message ||
            "Unable to load profile."
        );
      }
    }

    if (username) {
      loadHealthScore();
    }
  }, [username]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!scoreData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      
      <div className="healthRadarCard">
        <HealthRadarChart
        commitScore={scoreData.score}
        maintenanceScore={
          scoreData.repoMaintenanceScore
        }
        readmeScore={
          scoreData.readmeQualityScore || 0
        }
        activityTrendScore={
          scoreData.activityTrendScore
        }
        openSourceScore={
          scoreData.openSourceParticipationScore
        }
        />
      </div>
      <h2>
        <strong>
          Overall Score:{" "}
          {scoreData.finalHealthScore}%
        </strong>
      </h2>
      
      <p
      style={{
        fontSize: "14px",
        fontStyle: "italic",
        opacity: 0.8,
        }}
      >
        Grade: {scoreData.healthGrade}
      </p>
      <hr></hr>
      <br></br>
      <h2>Commit Consistency</h2>

      <p>
        <strong>
          Commit Consistency Score:{" "}
          {scoreData.score ??
            "Not Available"}%
        </strong>
      </p>

      <p>
        Active Weeks:{" "}
        {scoreData.activeWeeksScore ??
          "Not Available"}%
      </p>

      <p>
        Streak Quality:{" "}
        {scoreData.streakQualityScore ??
          "Not Available"}%
      </p>

      <p>
        Contribution Frequency:{" "}
        {scoreData.contributionFrequencyScore ??
          "Not Available"}%
      </p>

      <p>
        Inactivity:{" "}
        {scoreData.inactivityScore ??
          "Not Available"}%
      </p>
      <hr></hr>
      <br></br>
      <h3>
        Repository Maintenance
      </h3>

      <p>
        <strong>
          Repo Maintenance Score:{" "}
          {
            scoreData.repoMaintenanceScore
          }%
        </strong>
      </p>

      <p>
        Repository Freshness:{" "}
        {scoreData.freshnessScore}%
      </p>

      <p>
        Open Issues Health:{" "}
        {scoreData.issuesHealthScore}%
      </p>

      <p>
        Documentation Presence:{" "}
        {
          scoreData.documentationScore
        }%
      </p>

      <p>
        License Presence:{" "}
        {scoreData.licenseScore}%
      </p>

      <p
        style={{
          fontSize: "12px",
          fontStyle: "italic",
          opacity: 0.7,
        }}
      >
        Analyzed{" "}
        {
          scoreData.analyzedRepositories
        }{" "}
        of{" "}
        {
          scoreData.totalRepositories
        }{" "}
        repositories
      </p>
      <hr></hr>
      <br></br>

      <h3>README Quality</h3>

      <p>
        <strong>
          README Quality Score:{" "}
          {scoreData.readmeQualityScore ??
            "Not Available"}%
        </strong>
      </p>

      <p>
        README Exists:{" "}
        {scoreData.readmeExistsScore ??
          "Not Available"}%
      </p>

      <p>
        README Length:{" "}
        {scoreData.readmeLengthScore ??
          "Not Available"}%
      </p>

      <p>
        Heading Structure:{" "}
        {scoreData.headingStructureScore ??
          "Not Available"}%
      </p>

      <p>
        Links & Images:{" "}
        {scoreData.mediaScore ??
          "Not Available"}%
      </p>

      {scoreData.totalRepositories >
        500 && (
        <p
          style={{
            fontSize: "12px",
            fontStyle: "italic",
            opacity: 0.7,
          }}
        >
          README analysis skipped for
          large accounts.
        </p>
      )}

      <hr></hr>
      <br></br>

      <h3>Activity Trend</h3>

      <p>
        <strong>
          Activity Trend Score:{" "}
          {scoreData.activityTrendScore ??
            "Not Available"}%
        </strong>
      </p>

      <p
        style={{
          fontSize: "12px",
          fontStyle: "italic",
          opacity: 0.7,
        }}
      >
        {
          scoreData.activityTrendLabel
        }
      </p>

      <hr></hr>
      <br></br>

      <h3>Open Source Participation</h3>
      <p><strong>
        Open Source Score:{" "}
        {
        scoreData.openSourceParticipationScore
        }%
      </strong>
      </p>

      <p>
        Contributed Repositories:{" "}
        {scoreData.contributedReposScore}%
      </p>

      <p>
        Pull Requests:{" "}
        {scoreData.pullRequestScore}%
      </p>

      <p>
        Fork Activity:{" "}
        {scoreData.forkActivityScore}%
      </p>

      <p>
        Stars Received:{" "}
        {scoreData.starsReceivedScore}%
      </p>

      <p
      style={{
        fontSize: "12px",
        fontStyle: "italic",
        opacity: 0.7,
      }}
      >
        Contributions:{" "}
        {scoreData.contributedRepos} |
        PRs: {scoreData.pullRequests} |
        Forks: {scoreData.totalForks}|
        Stars: {scoreData.totalStars}
      </p>
    </div>
  );
}


