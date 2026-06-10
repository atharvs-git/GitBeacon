function ComparisonResult({
  profile1,
  profile2,
}) {
  const metrics = [
    {
      label:
        "Commit Consistency",
      user1:
        profile1.commitConsistency,
      user2:
        profile2.commitConsistency,
    },
    {
      label:
        "Repo Maintenance",
      user1:
        profile1.repoMaintenance,
      user2:
        profile2.repoMaintenance,
    },
    {
      label: "README",
      user1:
        profile1.readmeQuality,
      user2:
        profile2.readmeQuality,
    },
    {
      label:
        "Activity Trend",
      user1:
        profile1.activityTrend,
      user2:
        profile2.activityTrend,
    },
    {
      label:
        "Open Source",
      user1:
        profile1.openSourceParticipation,
      user2:
        profile2.openSourceParticipation,
    },
    {
      label:
        "Tech Diversity",
      user1:
        profile1.technologyDiversity,
      user2:
        profile2.technologyDiversity,
    },
    {
      label:
        "Learning Velocity",
      user1:
        profile1.learningVelocity,
      user2:
        profile2.learningVelocity,
    },
  ];

  return (
    <div className="comparison-result">
      <div className="comparison-final-score">
        <h2><i>
          FINAL SCORES      
        </i>
        </h2>
        <br></br>

        <div className="comparison-final-values">
          <div>
            <h1>
                {profile1.finalScore}%
            </h1>
            <br></br>
            <p className="comparison-final-username">
                {profile1.username}
            </p>
          </div>
          
          <div className="comparison-vs-text">
            VS
          </div>
          

          <div>
            <h1>
                {profile2.finalScore}%
            </h1>
            <br></br>
            <p className="comparison-final-username">
                {profile2.username}
            </p>
          </div>
        </div>
      </div>

      <div className="comparison-metrics">
        {metrics.map(
          (metric) => (
            <div
              key={
                metric.label
              }
              className="comparison-metric-row"
            >
              <span>
                {
                  metric.user1
                }
                %
              </span>

              <span className="comparison-metric-label">
                {
                  metric.label
                }
              </span>

              <span>
                {
                  metric.user2
                }
                %
              </span>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default ComparisonResult;