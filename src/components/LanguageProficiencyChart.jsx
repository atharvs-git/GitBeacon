import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";

function LanguageProficiencyChart({
  data,
}) {
  const colors = [
    "#6366f1",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#06b6d4",
    "#84cc16",
    "#f97316",
  ];

  return (
    <div className="language-proficiency-chart-container">
      <ResponsiveContainer
        width="100%"
        height={320}
      >
        <BarChart
          data={data}
          layout="vertical"
          margin={{
            top: 10,
            right: 20,
            left: 20,
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
            dataKey="language"
            width={
              window.innerWidth <= 480
                ? 70
                : 110
            }
            tick={{
              fontSize:
                window.innerWidth <= 480
                  ? 11
                  : 13,
            }}
          />

          <Tooltip
            formatter={(
              value
            ) => [
              `${value}%`,
              "Proficiency",
            ]}
          />

          <Bar
            dataKey="score"
            radius={[8, 8, 8, 8]}
            barSize={
              window.innerWidth <= 480
                ? 24
                : 28
            }
          >
            {data.map(
              (
                entry,
                index
              ) => (
                <Cell
                  key={index}
                  fill={
                    colors[
                      index %
                        colors.length
                    ]
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

export default LanguageProficiencyChart;