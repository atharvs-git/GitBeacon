import "../styles/ContributionHeatmap.css";

function ContributionHeatmap({
  calendar,
}) {
  if (
    !calendar ||
    !calendar.weeks ||
    calendar.totalContributions === 0
  ) {
    return (
      <p className="no-data-message">
        No contribution activity found
      </p>
    );
  }

  function getColor(count) {
    if (count === 0)
      return "#161b22";

    if (count <= 2)
      return "#0e4429";

    if (count <= 5)
      return "#006d32";

    if (count <= 10)
      return "#26a641";

    return "#39d353";
  }

  return (
    <div className="heatmap-wrapper">
      <div className="heatmap-grid">
        {calendar.weeks.map(
          (week, weekIndex) => (
            <div
              key={weekIndex}
              className="heatmap-week"
            >
              {week.contributionDays.map(
                (day, dayIndex) => (
                  <div
                    key={dayIndex}
                    className="heatmap-cell"
                    style={{
                      backgroundColor:
                        getColor(
                          day.contributionCount
                        ),
                    }}
                    title={`${day.contributionCount} contributions on ${day.date}`}
                  />
                )
              )}
            </div>
          )
        )}
      </div>

      <div className="heatmap-legend">
        <span>Less</span>

        <div
          className="legend-box"
          style={{
            background: "#161b22",
          }}
        />

        <div
          className="legend-box"
          style={{
            background: "#0e4429",
          }}
        />

        <div
          className="legend-box"
          style={{
            background: "#006d32",
          }}
        />

        <div
          className="legend-box"
          style={{
            background: "#26a641",
          }}
        />

        <div
          className="legend-box"
          style={{
            background: "#39d353",
          }}
        />

        <span>More</span>
      </div>
    </div>
  );
}

export default ContributionHeatmap;