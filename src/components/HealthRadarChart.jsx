import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

function HealthRadarChart({
  commitScore,
  maintenanceScore,
  readmeScore,
  activityTrendScore,
  openSourceScore,
}) {
  const data = [
  {
    metric:
      window.innerWidth <= 480
        ? "Commit"
        : "Commit Consistency",
    score: commitScore,
  },
  {
    metric:
      window.innerWidth <= 480
        ? "Repo"
        : "Repo Maintenance",
    score: maintenanceScore,
  },
  {
    metric: "README",
    score: readmeScore,
  },
  {
    metric:
      window.innerWidth <= 480
        ? "Trend"
        : "Activity Trend",
    score: activityTrendScore,
  },
  {
    metric:
      window.innerWidth <= 480
        ? "OSS"
        : "Open Source",
    score: openSourceScore,
  },
];
  
  
  return (
  <div className="radarWrapper">
    <ResponsiveContainer
      width="100%"
      height="100%"
    >
        <RadarChart data={data}>
        <PolarGrid
        stroke="rgba(255,255,255,0.15)"
        />

    <PolarAngleAxis
    dataKey="metric"
    tick={{
        fill: "#d1d5db",
        fontSize:
        window.innerWidth <= 480
        ? 10
        : window.innerWidth <= 768
        ? 12
        : 14,
        }}
    />

        <PolarRadiusAxis
        domain={[0, 100]}
        tick={false}
        axisLine={false}
        />
        
        <Radar
        dataKey="score"
        stroke="#4f8cff"
        fill="#4f8cff"
        fillOpacity={0.35}
        />
        </RadarChart>
    
      
    </ResponsiveContainer>
  </div>
  );
}

export default HealthRadarChart;