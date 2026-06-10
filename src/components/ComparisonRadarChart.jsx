import {
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
} from "recharts";

function ComparisonRadarChart({
  profile1,
  profile2,
}) {
    const isMobile = window.innerWidth < 480;

const data = [
  {
    metric: isMobile ? "Commit" : "Commit Consistency",
    user1: profile1.commitConsistency,
    user2: profile2.commitConsistency,
  },
  {
    metric: isMobile ? "Repo" : "Repo Maintenance",
    user1: profile1.repoMaintenance,
    user2: profile2.repoMaintenance,
  },
  {
    metric: "README",
    user1: profile1.readmeQuality,
    user2: profile2.readmeQuality,
  },
  {
    metric: isMobile ? "Active" : "Activity Trend",
    user1: profile1.activityTrend,
    user2: profile2.activityTrend,
  },
  {
    metric: isMobile ? "OS" : "Open Source",
    user1: profile1.openSourceParticipation,
    user2: profile2.openSourceParticipation,
  },
  {
    metric: isMobile ? "Tech" : "Tech Diversity",
    user1: profile1.technologyDiversity,
    user2: profile2.technologyDiversity,
  },
  {
    metric: isMobile ? "Velocity" : "Learning Velocity",
    user1: profile1.learningVelocity,
    user2: profile2.learningVelocity,
  },
];

  return (
    <div className="comparison-radar-container">
      <ResponsiveContainer
        width="100%"
        height={450}
      >
        <RadarChart data={data}>
          <PolarGrid />

          <PolarAngleAxis
            dataKey="metric"
            tick={{
              fontSize: 12,
            }}
          />

          <PolarRadiusAxis
          domain={[0, 100]}
          tick={false}
          axisLine={false}
          />

          <Tooltip />

          <Radar
            name={
              profile1.username
            }
            dataKey="user1"
            stroke="#D4AF37"
            fill="#D4AF37"
            fillOpacity={0.25}
          />

          <Radar
            name={
              profile2.username
            }
            dataKey="user2"
            stroke="#aa7777"
            fill="#aa7777"
            fillOpacity={0.25}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ComparisonRadarChart;