import { useEffect, useState } from "react";

import {
  fetchRepositories,
} from "../services/githubService";

import {
  calculateLearningVelocity,
} from "../utils/learningVelocity";

import LearningVelocityChart from "./LearningVelocityChart";

function LearningVelocity({
  username,
}) {
  const [data, setData] =
    useState(null);

  const [error, setError] =
    useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        setError(null);
        setData(null);

        const repos =
          await fetchRepositories(
            username
          );

        if (
          !repos ||
          repos.length === 0
        ) {
          setError(
            "No repositories found."
          );

          return;
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

        const result =
          calculateLearningVelocity(
            analyzedRepos
          );

        console.log(
          "Learning Velocity:",
          result
        );

        setData(result);
      } catch (error) {
        console.error(
          "Learning Velocity failed:",
          error
        );

        setError(
          "Unable to analyze repositories."
        );
      }
    }

    if (username) {
      loadData();
    }
  }, [username]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <br />

      <h2>
        <strong>
          Overall Score:{" "}
          {
            data.overallLearningScore
          }%
        </strong>
      </h2>

      <p
        style={{
          fontSize: "14px",
          fontStyle: "italic",
          opacity: 0.7,
        }}
      >
        {data.learningMomentum}
      </p>

      <br />

      <LearningVelocityChart
        technologyDiversityScore={
          data.technologyDiversityScore
        }
        learningVelocityScore={
          data.learningVelocityScore
        }
      />

      <br />
      <hr />
      <br />

      <h3>Top Languages</h3>

      {data.topLanguages?.length >
      0 ? (
        <ul>
          {data.topLanguages.map(
            ([language, count]) => (
              <li key={language}>
                {language} (
                {count} repos)
              </li>
            )
          )}
        </ul>
      ) : (
        <p>
          No language data
          available.
        </p>
      )}

      <br />

      <p>
        <strong>
          {data.diversityLabel}
        </strong>
      </p>

      <hr />
      <br />

      <p>
        <strong>
          Technology Diversity:{" "}
          {
            data.technologyDiversityScore
          }%
        </strong>
      </p>

      <p>
        <strong>
          Learning Velocity:{" "}
          {
            data.learningVelocityScore
          }%
        </strong>
      </p>

      <p>
        <strong>
          Unique Languages:{" "}
          {data.uniqueLanguages}
        </strong>
      </p>

      <p>
        <strong>
          New Languages:{" "}
          {data.newLanguages}
        </strong>
      </p>

      <p
        style={{
          fontSize: "12px",
          fontStyle: "italic",
          opacity: 0.7,
        }}
      >
        Based on language
        diversity and recently
        adopted technologies.
      </p>
    </div>
  );
}

export default LearningVelocity;