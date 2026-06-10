import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function LanguageDistributionChart({
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
  ];

  return (
    <div className="language-chart-container">
      <ResponsiveContainer
        width="100%"
        height={300}
      >
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="language"
            outerRadius={100}
            labelLine={false}
            stroke="#ffffff"
            strokeWidth={2}
            label={(props) => {
              const {
                cx,
                cy,
                midAngle,
                innerRadius,
                outerRadius,
                payload,
                percent,
              } = props;

              // Hide labels for tiny slices
              if (percent < 0.04) {
                return null;
              }

              const RADIAN =
                Math.PI / 180;

              const radius =
                innerRadius +
                (outerRadius -
                  innerRadius) *
                  0.7;

              const x =
                cx +
                radius *
                  Math.cos(
                    -midAngle *
                      RADIAN
                  );

              const y =
                cy +
                radius *
                  Math.sin(
                    -midAngle *
                      RADIAN
                  );

              let rotation =
                -midAngle;

              // Keep text upright
              if (
                rotation > 90 ||
                rotation < -90
              ) {
                rotation += 180;
              }

              return (
                <text
                  x={x}
                  y={y}
                  fill="#ffffff"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={
                    window.innerWidth <=
                    480
                      ? 10
                      : 9
                  }
                  fontWeight="700"
                  transform={`rotate(${rotation}, ${x}, ${y})`}
                >
                  {payload.language}
                </text>
              );
            }}
          >
            {data.map(
              (entry, index) => (
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
          </Pie>

          <Tooltip
            formatter={(
              value,
              name
            ) => [
              `${value} repos`,
              name,
            ]}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default LanguageDistributionChart;