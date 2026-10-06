"use client";

import { cn } from "@/lib/utils";

interface ChartProps {
  data: any[];
  xKey: string;
  series: { key: string; label: string; color: string }[];
  height?: number;
  showLegend?: boolean;
  formatValue?: (value: number) => string;
  horizontal?: boolean;
}

export function BarChart({
  data,
  xKey,
  series,
  height = 250,
  showLegend = true,
  formatValue,
  horizontal = false,
}: ChartProps) {
  if (!data.length) return null;

  const maxValue = Math.max(
    ...data.flatMap((d) => series.map((s) => Number(d[s.key])))
  );
  const barHeight = horizontal ? 24 : 18;
  const chartHeight = Math.max(height, data.length * (barHeight + 8) + 40);
  const padding = { top: 20, right: 30, bottom: 30, left: horizontal ? 100 : 60 };
  const width = 100; // Will be made responsive via container
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  return (
    <div className="relative w-full h-[{chartHeight}px]" style={{ height: chartHeight }}>
      <svg
        className="absolute inset-0"
        width="100%"
        height="100%"
        viewBox={`0 0 ${width} ${chartHeight}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Bar chart showing data trends"
      >
        {/* Horizontal grid lines */}
        {Array.from({ length: 5 }).map((_, i) => {
          const y = padding.top + (innerHeight * i) / 4;
          return (
            <line
              key={`hgrid-${i}`}
              x1={padding.left}
              y1={y}
              x2={width - padding.right}
              y2={y}
              stroke="#e2e8f0"
              strokeWidth="1"
            />
          );
        })}

        {/* Bars */}
        {series.map((serie, serieIndex) => {
          const barWidth = innerWidth / (series.length * 1.2);
          const offset =
            (serieIndex - (series.length - 1) / 2) * barWidth * 1.2;
          return data.map((d, index) => {
            const value = Number(d[serie.key]) || 0;
            const barHeightValue =
              (innerHeight * value) / (maxValue || 1);
            const x =
              padding.left +
              offset +
              (innerWidth * index) / (data.length - 1 || 1) -
              barWidth / 2;
            const y =
              chartHeight -
              padding.bottom -
              barHeightValue;

            return (
              <rect
                key={`bar-${serieIndex}-${index}`}
                x={x}
                y={y}
                width={barWidth}
                height={barHeightValue}
                fill={serie.color}
                rx={2}
              />
            );
          });
        })}

        {/* X-axis labels (categories) */}
        {data.map((d, index) => {
          const x =
            padding.left +
            (innerWidth * index) / (data.length - 1 || 1);
          const y = chartHeight - padding.bottom + 18;
          return (
            <text
              key={`xlabel-${index}`}
              x={x}
              y={y}
              textAnchor="middle"
              fontSize="11"
              fill="#64748b"
            >
              {String(d[xKey])}
            </text>
          );
        })}

        {/* Y-axis labels (values) */}
        {Array.from({ length: 5 }).map((_, i) => {
          const value = (maxValue * i) / 4;
          const y =
            chartHeight -
            padding.bottom -
            (innerHeight * i) / 4;
          const formatted = formatValue
            ? formatValue(value)
            : value.toLocaleString("fa-IR");
          return (
            <text
              key={`ylabel-${i}`}
              x={padding.left - 8}
              y={y + 4}
              textAnchor="end"
              fontSize="10"
              fill="#64748b"
            >
              {formatted}
            </text>
          );
        })}

        {/* Legend */}
        {showLegend && (
          <g transform={`translate(${width - padding.right + 10}, ${padding.top + 10})`}>
            {series.map((s, i) => (
              <g key={`legend-${i}`} transform={`translate(0, ${i * 20})`}>
                <rect
                  x={0}
                  y={0}
                  width={14}
                  height={8}
                  fill={s.color}
                  rx={1}
                />
                <text
                  x={18}
                  y={12}
                  fontSize="11"
                  fill="#334155"
                >
                  {s.label}
                </text>
              </g>
            ))}
          </g>
        )}
      </svg>
    </div>
  );
}

export function LineChart({
  data,
  xKey,
  series,
  height = 250,
  showLegend = true,
  formatValue,
}: ChartProps) {
  if (!data.length) return null;

  const maxValue = Math.max(
    ...data.flatMap((d) => series.map((s) => Number(d[s.key])))
  );
  const minValue = Math.min(
    ...data.flatMap((d) => series.map((s) => Number(d[s.key])))
  );
  const valueRange = maxValue - minValue || 1;
  const padding = { top: 20, right: 30, bottom: 30, left: 60 };
  const chartHeight = height;
  const width = 100;
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  return (
    <div className="relative w-full h-[{chartHeight}px]" style={{ height: chartHeight }}>
      <svg
        className="absolute inset-0"
        width="100%"
        height="100%"
        viewBox={`0 0 ${width} ${chartHeight}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Line chart showing data trends"
      >
        {/* Horizontal grid lines */}
        {Array.from({ length: 5 }).map((_, i) => {
          const y = padding.top + (innerHeight * i) / 4;
          return (
            <line
              key={`hgrid-${i}`}
              x1={padding.left}
              y1={y}
              x2={width - padding.right}
              y2={y}
              stroke="#e2e8f0"
              strokeWidth="1"
            />
          );
        })}

        {/* Lines */}
        {series.map((serie, serieIndex) => {
          const points = data
            .map((d, index) => {
              const value = Number(d[serie.key]) || 0;
              const x =
                padding.left +
                (innerWidth * index) / (data.length - 1 || 1);
              const y =
                chartHeight -
                padding.bottom -
                ((innerHeight * (value - minValue)) / valueRange);
              return `${x},${y}`;
            })
            .join(" ");

          return (
            <path
              key={`line-${serieIndex}`}
              d={`M${points}`}
              fill="none"
              stroke={serie.color}
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          );
        })}

        {/* Points */}
        {series.map((serie, serieIndex) => {
          return data.map((d, index) => {
            const value = Number(d[serie.key]) || 0;
            const x =
              padding.left +
              (innerWidth * index) / (data.length - 1 || 1);
            const y =
              chartHeight -
              padding.bottom -
              ((innerHeight * (value - minValue)) / valueRange);
            return (
              <circle
                key={`point-${serieIndex}-${index}`}
                cx={x}
                cy={y}
                r={3}
                fill={serie.color}
              />
            );
          });
        })}

        {/* X-axis labels (categories) */}
        {data.map((d, index) => {
          const x =
            padding.left +
            (innerWidth * index) / (data.length - 1 || 1);
          const y = chartHeight - padding.bottom + 18;
          return (
            <text
              key={`xlabel-${index}`}
              x={x}
              y={y}
              textAnchor="middle"
              fontSize="11"
              fill="#64748b"
            >
              {String(d[xKey])}
            </text>
          );
        })}

        {/* Y-axis labels (values) */}
        {Array.from({ length: 5 }).map((_, i) => {
          const value = minValue + (valueRange * i) / 4;
          const y =
            chartHeight -
            padding.bottom -
            (innerHeight * i) / 4;
          const formatted = formatValue
            ? formatValue(value)
            : value.toLocaleString("fa-IR");
          return (
            <text
              key={`ylabel-${i}`}
              x={padding.left - 8}
              y={y + 4}
              textAnchor="end"
              fontSize="10"
              fill="#64748b"
            >
              {formatted}
            </text>
          );
        })}

        {/* Legend */}
        {showLegend && (
          <g transform={`translate(${width - padding.right + 10}, ${padding.top + 10})`}>
            {series.map((s, i) => (
              <g key={`legend-${i}`} transform={`translate(0, ${i * 20})`}>
                <rect
                  x={0}
                  y={0}
                  width={14}
                  height={8}
                  fill={s.color}
                  rx={1}
                />
                <text
                  x={18}
                  y={12}
                  fontSize="11"
                  fill="#334155"
                >
                  {s.label}
                </text>
              </g>
            ))}
          </g>
        )}
      </svg>
    </div>
  );
}

export function PieChart({
  data,
  labelKey,
  valueKey,
  colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"],
  height = 250,
  showLegend = true,
}: {
  data: any[];
  labelKey: string;
  valueKey: string;
  colors?: string[];
  height?: number;
  showLegend?: boolean;
}) {
  if (!data.length) return null;

  const total = data.reduce((sum, d) => sum + (Number(d[valueKey]) || 0), 0);
  const padding = { top: 20, right: 20, bottom: 20, left: 20 };
  const chartHeight = height;
  const width = 100;
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;
  const radius = Math.min(innerWidth, innerHeight) / 2 * 0.8;
  const cx = padding.left + innerWidth / 2;
  const cy = padding.top + innerHeight / 2;

  return (
    <div className="relative w-full h-[{chartHeight}px]" style={{ height: chartHeight }}>
      <svg
        className="absolute inset-0"
        width="100%"
        height="100%"
        viewBox={`0 0 ${width} ${chartHeight}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Pie chart showing data distribution"
      >
        {/* Pie slices */}
        {data.map((d, index) => {
          const value = Number(d[valueKey]) || 0;
          const percentage = total > 0 ? (value / total) * 360 : 0;
          const startAngle =
            data
              .slice(0, index)
              .reduce((sum, d) => sum + (Number(d[valueKey]) || 0), 0) /
              total *
              360;
          const endAngle = startAngle + percentage;

          const startX = cx + radius * Math.cos(((startAngle - 90) * Math.PI) / 180);
          const startY = cy + radius * Math.sin(((startAngle - 90) * Math.PI) / 180);
          const endX = cx + radius * Math.cos(((endAngle - 90) * Math.PI) / 180);
          const endY = cy + radius * Math.sin(((endAngle - 90) * Math.PI) / 180);

          const largeArc = percentage > 180 ? 1 : 0;

          const pathD = [
            `M ${cx} ${cy}`,
            `L ${startX} ${startY}`,
            `A ${radius} ${radius} 0 ${largeArc} 1 ${endX} ${endY}`,
            "Z",
          ].join(" ");

          return (
            <path
              key={`pie-${index}`}
              d={pathD}
              fill={colors[index % colors.length]}
            />
          );
        })}

        {/* Legend */}
        {showLegend && (
          <g transform={`translate(${width - padding.right + 10}, ${padding.top + 10})`}>
            {data.map((d, index) => (
              <g key={`legend-${index}`} transform={`translate(0, ${index * 20})`}>
                <rect
                  x={0}
                  y={0}
                  width={14}
                  height={8}
                  fill={colors[index % colors.length]}
                  rx={1}
                />
                <text
                  x={18}
                  y={12}
                  fontSize="11"
                  fill="#334155"
                >
                  {String(d[labelKey])}
                </text>
              </g>
            ))}
          </g>
        )}
      </svg>
    </div>
  );
}

export function AreaChart({
  data,
  xKey,
  series,
  height = 250,
  showLegend = true,
  formatValue,
}: ChartProps) {
  if (!data.length) return null;

  const maxValue = Math.max(
    ...data.flatMap((d) => series.map((s) => Number(d[s.key])))
  );
  const padding = { top: 20, right: 30, bottom: 30, left: 60 };
  const chartHeight = height;
  const width = 100;
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  return (
    <div className="relative w-full h-[{chartHeight}px]" style={{ height: chartHeight }}>
      <svg
        className="absolute inset-0"
        width="100%"
        height="100%"
        viewBox={`0 0 ${width} ${chartHeight}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Area chart showing data trends"
      >
        {/* Horizontal grid lines */}
        {Array.from({ length: 5 }).map((_, i) => {
          const y = padding.top + (innerHeight * i) / 4;
          return (
            <line
              key={`hgrid-${i}`}
              x1={padding.left}
              y1={y}
              x2={width - padding.right}
              y2={y}
              stroke="#e2e8f0"
              strokeWidth="1"
            />
          );
        })}

        {/* Areas */}
        {series.map((serie, serieIndex) => {
          const points = data
            .map((d, index) => {
              const value = Number(d[serie.key]) || 0;
              const x =
                padding.left +
                (innerWidth * index) / (data.length - 1 || 1);
              const y =
                chartHeight -
                padding.bottom -
                (innerHeight * value) / (maxValue || 1);
              return `${x},${y}`;
            })
            .concat([
              `${padding.left + innerWidth} ${chartHeight - padding.bottom}`,
              `${padding.left} ${chartHeight - padding.bottom}`,
            ])
            .join(" ");

          return (
            <path
              key={`area-${serieIndex}`}
              d={`M${points}`}
              fill={serie.color}
              fillOpacity="0.2"
            />
          );
        })}

        {/* Lines on top */}
        {series.map((serie, serieIndex) => {
          const points = data
            .map((d, index) => {
              const value = Number(d[serie.key]) || 0;
              const x =
                padding.left +
                (innerWidth * index) / (data.length - 1 || 1);
              const y =
                chartHeight -
                padding.bottom -
                (innerHeight * value) / (maxValue || 1);
              return `${x},${y}`;
            })
            .join(" ");

          return (
            <path
              key={`line-${serieIndex}`}
              d={`M${points}`}
              fill="none"
              stroke={serie.color}
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          );
        })}

        {/* X-axis labels (categories) */}
        {data.map((d, index) => {
          const x =
            padding.left +
            (innerWidth * index) / (data.length - 1 || 1);
          const y = chartHeight - padding.bottom + 18;
          return (
            <text
              key={`xlabel-${index}`}
              x={x}
              y={y}
              textAnchor="middle"
              fontSize="11"
              fill="#64748b"
            >
              {String(d[xKey])}
            </text>
          );
        })}

        {/* Y-axis labels (values) */}
        {Array.from({ length: 5 }).map((_, i) => {
          const value = (maxValue * i) / 4;
          const y =
            chartHeight -
            padding.bottom -
            (innerHeight * i) / 4;
          const formatted = formatValue
            ? formatValue(value)
            : value.toLocaleString("fa-IR");
          return (
            <text
              key={`ylabel-${i}`}
              x={padding.left - 8}
              y={y + 4}
              textAnchor="end"
              fontSize="10"
              fill="#64748b"
            >
              {formatted}
            </text>
          );
        })}

        {/* Legend */}
        {showLegend && (
          <g transform={`translate(${width - padding.right + 10}, ${padding.top + 10})`}>
            {series.map((s, i) => (
              <g key={`legend-${i}`} transform={`translate(0, ${i * 20})`}>
                <rect
                  x={0}
                  y={0}
                  width={14}
                  height={8}
                  fill={s.color}
                  rx={1}
                />
                <text
                  x={18}
                  y={12}
                  fontSize="11"
                  fill="#334155"
                >
                  {s.label}
                </text>
              </g>
            ))}
          </g>
        )}
      </svg>
    </div>
  );
}
