export function calculateComparisonFinalScore({
  commitConsistency,
  repoMaintenance,
  readmeQuality,
  activityTrend,
  openSourceParticipation,
  technologyDiversity,
  learningVelocity,
}) {
  const finalScore = Math.round(
    (
      commitConsistency +
      repoMaintenance +
      readmeQuality +
      activityTrend +
      openSourceParticipation +
      technologyDiversity +
      learningVelocity
    ) / 7
  );

  let grade;

  if (finalScore >= 90) {
    grade = "A+";
  } else if (finalScore >= 80) {
    grade = "A";
  } else if (finalScore >= 70) {
    grade = "B";
  } else if (finalScore >= 60) {
    grade = "C";
  } else if (finalScore >= 50) {
    grade = "D";
  } else {
    grade = "F";
  }

  return {
    finalScore,
    grade,
  };
}