import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";

function LearningVelocityChart({
  technologyDiversityScore,
  learningVelocityScore,
}) {
  const isMobile =
    window.innerWidth <= 480;

  const chartData = [
    {
      name: isMobile
        ? "Diversity"
        : "Technology Diversity",
      score: technologyDiversityScore,
    },
    {
      name: isMobile
        ? "Velocity"
        : "Learning Velocity",
      score: learningVelocityScore,
    },
  ];

  return (
    <div className="learning-chart-container">
      <ResponsiveContainer
        width="100%"
        height={220}
      >
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{
            top: 10,
            right: 10,
            left: isMobile ? 0 : 10,
            bottom: 10,
          }}
        >
          <XAxis
            type="number"
            domain={[0, 100]}
            hide
          />

          <YAxis
            type="category"
            dataKey="name"
            width={isMobile ? 60 : 140}
            tick={{
              fontSize: isMobile
                ? 10
                : 13,
            }}
          />

          <Tooltip
            formatter={(value) => [
              `${value}/100`,
              "Score",
            ]}
          />

          <Bar
            dataKey="score"
            radius={[8, 8, 8, 8]}
            barSize={
              isMobile ? 24 : 32
            }
          >
            {chartData.map(
              (_, index) => (
                <Cell
                  key={index}
                  fill={
                    index === 0
                      ? "#eeeb33"
                      : "#f75742"
                  }
                />
              )
            )}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default LearningVelocityChart;