import { useEffect, useState } from "react";

import {
  fetchRepositories,
  fetchContributionCalendar,
} from "../services/githubService";

import {
  calculateLanguageAnalysis,
} from "../utils/languageAnalysis";

import {
  calculateLanguageProficiency,
} from "../utils/languageProficiency";

import LanguageDistributionChart
from "./LanguageDistributionChart";

import LanguageProficiencyChart
from "./LanguageProficiencyChart";

import ContributionHeatMap
from "./ContributionHeatMap";

function LanguageAnalysis({
  username,
}) {
  const [data, setData] =
    useState(null);

  const [calendarData, setCalendarData] =
    useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const repos =
          await fetchRepositories(
            username
          );

        const proficiencyData =
          calculateLanguageProficiency(
            repos
          );

        const calendar =
          await fetchContributionCalendar(
            username
          );

        setCalendarData(calendar);

        const result =
          calculateLanguageAnalysis(
            repos,
            calendar
          );

        console.log(
          "Language Analysis:",
          result
        );

        setData({
          ...result,
          proficiencyData,
        });
      } catch (error) {
        console.error(error);
      }
    }

    if (username) {
      loadData();
    }
  }, [username]);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <br />

      <h2>
        {data.developerPersonality}
      </h2>

      <p
        style={{
          fontSize: "14px",
          opacity: 0.7,
        }}
      >
        Based on your dominant
        languages and repository
        activity.
      </p>

      <hr />

      <br />

      <h3>
        Contribution Insights
      </h3>

      <p>
        <strong>
          Weekly Average:
        </strong>{" "}
        {data.weeklyAverage}
      </p>

      <p>
        <strong>
          Monthly Average:
        </strong>{" "}
        {data.monthlyAverage}
      </p>

      <p>
        <strong>
          Impact Score:
        </strong>{" "}
        {data.impactScore}%
      </p>

      <br />

      <hr />

      <br />

      <h3>
        Language Distribution
      </h3>

      {data.languageDistribution &&
      data.languageDistribution.length >
        0 ? (
        <LanguageDistributionChart
          data={
            data.languageDistribution
          }
        />
      ) : (
        <p
          style={{
            textAlign:
              "center",
            opacity: 0.7,
          }}
        >
          No data found
        </p>
      )}

      <br />

      <hr />

      <br />

      <h3>
        Language Proficiency
      </h3>

      {data.proficiencyData &&
      data.proficiencyData.length >
        0 ? (
        <LanguageProficiencyChart
          data={
            data.proficiencyData
          }
        />
      ) : (
        <p
          style={{
            textAlign:
              "center",
            opacity: 0.7,
          }}
        >
          No data found
        </p>
      )}

      <br />

      <hr />

      <br />

      <h3>
        Top Repositories
      </h3>

      {data.topRepositories &&
      data.topRepositories.length >
        0 ? (
        <ul>
          {data.topRepositories.map(
            (repo) => (
              <li
                key={repo.name}
              >
                {repo.name}
                {" | ⭐ "}
                {repo.stars}
                {" | Forks "}
                {repo.forks}
              </li>
            )
          )}
        </ul>
      ) : (
        <p
          style={{
            textAlign:
              "center",
            opacity: 0.7,
          }}
        >
          No repositories found
        </p>
      )}

      <br />

      <p
        style={{
          fontSize: "12px",
          fontStyle: "italic",
          opacity: 0.7,
        }}
      >
        Language proficiency is
        estimated using repository
        usage, stars received and
        recent activity within
        each language ecosystem.
      </p>

      <br />
      <hr />
      <br />

      <h3>
        Contribution Activity
      </h3>

      <ContributionHeatMap
        calendar={calendarData}
      />
    </div>
  );
}

export default LanguageAnalysis;
