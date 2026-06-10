const token = import.meta.env.VITE_GITHUB_TOKEN;
console.log(
  "Token exists:",
  !!import.meta.env.VITE_GITHUB_TOKEN
);

const query = `
query($username: String!) {
  user(login: $username) {
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            contributionCount
            date
          }
        }
      }
    }
  }
}
`;

const openSourceQuery = `
query($username: String!) {
  user(login: $username) {
    pullRequests {
      totalCount
    }

    repositoriesContributedTo {
      totalCount
    }
  }
}
`;

export async function fetchContributionCalendar(
  username
) {
  try {
    const response = await fetch(
      "https://api.github.com/graphql",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          variables: { username },
        }),
      }
    );

    if (!response.ok) {
      console.error(
        "Contribution API Error:",
        response.status
      );
      return null;
    }

    const result = await response.json();

    console.log(
      "Contribution API Result:",
      result
    );

    const data = result.data;

    if (!data?.user) {
      console.warn(
        "No user returned from GitHub GraphQL.",
        result
      );

      return null;
    }

    return data.user
      .contributionsCollection
      .contributionCalendar;
  } catch (error) {
    console.error(
      "Contribution fetch failed:",
      error
    );

    return null;
  }
}

export async function fetchRepositories(
  username
) {
  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      console.error(
        "Repositories API Error:",
        response.status
      );

      return [];
    }

    const repos =
      await response.json();

    return repos;
  } catch (error) {
    console.error(
      "Repository fetch failed:",
      error
    );

    return [];
  }
}

export async function fetchReadme(
  owner,
  repo
) {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/readme`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const data =
      await response.json();

    return atob(
      data.content.replace(/\n/g, "")
    );
  } catch (error) {
    console.error(
      "README fetch failed:",
      error
    );

    return null;
  }
}

export async function fetchOpenSourceStats(
  username
) {
  try {
    const response = await fetch(
      "https://api.github.com/graphql",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: openSourceQuery,
          variables: { username },
        }),
      }
    );

    if (!response.ok) {
      console.error(
        "Open Source API Error:",
        response.status
      );

      return null;
    }

    const result =
      await response.json();

    console.log(
      "Open Source Stats:",
      result
    );

    const data = result.data;

    if (!data?.user) {
      return null;
    }

    return {
      pullRequests:
        data.user.pullRequests
          .totalCount,

      contributedRepositories:
        data.user
          .repositoriesContributedTo
          .totalCount,
    };
  } catch (error) {
    console.error(
      "Open Source fetch failed:",
      error
    );

    return null;
  }
}
