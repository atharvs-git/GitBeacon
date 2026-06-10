export function calculateLearningVelocity(repos) {
  if (!repos || repos.length === 0) {
    return {
      technologyDiversityScore: 0,
      learningVelocityScore: 0,
      overallLearningScore: 0,

      uniqueLanguages: 0,
      newLanguages: 0,

      topLanguages: [],

      diversityLabel:
      "No repositories found",

      learningMomentum:
      "Unable to analyze",
    };
  }

  const allLanguages = new Set();

  repos.forEach((repo) => {
    if (repo.language) {
      allLanguages.add(repo.language);
    }
  });

  const uniqueLanguages =
    allLanguages.size;

  let technologyDiversityScore;

  if (uniqueLanguages >= 9) {
    technologyDiversityScore = 100;
  } else if (uniqueLanguages >= 6) {
    technologyDiversityScore = 80;
  } else if (uniqueLanguages >= 4) {
    technologyDiversityScore = 60;
  } else if (uniqueLanguages >= 2) {
    technologyDiversityScore = 40;
  } else {
    technologyDiversityScore = 20;
  }

  const today = new Date();

  const recentLanguages =
    new Set();

  const oldLanguages =
    new Set();

  repos.forEach((repo) => {
    if (!repo.language) return;

    const updatedDate =
      new Date(repo.updated_at);

    const daysOld =
      (today - updatedDate) /
      (1000 * 60 * 60 * 24);

    if (daysOld <= 180) {
      recentLanguages.add(
        repo.language
      );
    } else {
      oldLanguages.add(
        repo.language
      );
    }
  });

  let newLanguages = 0;

  recentLanguages.forEach(
    (language) => {
      if (
        !oldLanguages.has(language)
      ) {
        newLanguages++;
      }
    }
  );

  let learningVelocityScore;

  if (newLanguages >= 4) {
    learningVelocityScore = 100;
  } else if (newLanguages >= 3) {
    learningVelocityScore = 80;
  } else if (newLanguages >= 2) {
    learningVelocityScore = 60;
  } else if (newLanguages >= 1) {
    learningVelocityScore = 40;
  } else {
    learningVelocityScore = 20;
  }

  const overallLearningScore =
    Math.round(
      technologyDiversityScore *
        0.6 +
        learningVelocityScore *
        0.4
    );

  const languageCounts = {};
  repos.forEach((repo) => {
    if (!repo.language) return;
    languageCounts[repo.language] =
    (languageCounts[repo.language] || 0) + 1;
  });
  const topLanguages = Object.entries(
    languageCounts
  )
  .sort((a, b) => b[1] - a[1])
  .slice(0, 5);

  let diversityLabel;
  if (uniqueLanguages >= 9) {
    diversityLabel = "Polyglot Developer";
  } else if (uniqueLanguages >= 6) {
    diversityLabel = "Highly Diverse";
  } else if (uniqueLanguages >= 4) {
    diversityLabel = "Multi-Stack Developer";
  } else if (uniqueLanguages >= 2) {
    diversityLabel = "Focused Explorer";
  } else {
    diversityLabel = "Specialist";
  }

  let learningMomentum;
  if (learningVelocityScore >= 100) {
    learningMomentum =
    "Rapid Technology Adoption";
  } else if (
    learningVelocityScore >= 80) 
  {
    learningMomentum =
    "Strong Learning Momentum";
  } else if (
    learningVelocityScore >= 60) 
  {
    learningMomentum =
    "Steady Learning";
  } else if (
  learningVelocityScore >= 40) 
  {
    learningMomentum =
    "Occasional Exploration";
  } else {
    learningMomentum =
    "Stable Technology Usage";
  }

  return {
    technologyDiversityScore,
    learningVelocityScore,
    overallLearningScore,
    uniqueLanguages,
    newLanguages,
    topLanguages,
    diversityLabel,
    learningMomentum,
  };
}