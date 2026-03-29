'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

interface AnalyticsPieChartProps {
  data: { [key: string]: string | number; clicks: number }[]
  dataKey: string
}

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
]

export function AnalyticsPieChart({ data, dataKey }: AnalyticsPieChartProps) {
  if (data.length === 0) {
    return (
      <div className="h-[200px] flex items-center justify-center text-muted-foreground">
        No data available
      </div>
    )
  }

  const chartData = data.map((item) => ({
    name: item[dataKey] as string,
    value: item.clicks,
  }))

  const total = chartData.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
          >
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload
                const percentage = ((data.value / total) * 100).toFixed(1)
                return (
                  <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
                    <p className="text-sm font-medium">{data.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {data.value} clicks ({percentage}%)
                    </p>
                  </div>
                )
              }
              return null
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap gap-2 mt-2 justify-center">
        {chartData.slice(0, 5).map((item, index) => (
          <div key={item.name} className="flex items-center gap-1.5">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="text-xs text-muted-foreground truncate max-w-[80px]">
              {item.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
