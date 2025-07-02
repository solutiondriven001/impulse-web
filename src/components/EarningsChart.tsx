
"use client";

import { Bar, BarChart, Cell, LabelList, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { format } from 'date-fns';
import type { DailyEarning } from '@/types';

// This is the data structure the chart component will expect
export interface ChartData extends DailyEarning {
  name: string;
  shortName: string;
  monthName: string;
}

interface EarningsChartProps {
  data: ChartData[];
}

// Custom Tooltip for more details on hover
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as ChartData;
    return (
      <div className="rounded-lg border bg-popover p-3 shadow-sm text-popover-foreground">
        <p className="font-bold pb-2 border-b border-border mb-2">{format(new Date(data.date), 'EEE, MMM d, yyyy')}</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
            <span className="text-muted-foreground">Total:</span>
            <span className="font-bold text-right font-code">{data.total.toFixed(1)}</span>

            <span className="text-muted-foreground">Mining:</span>
            <span className="font-bold text-right font-code">{data.mining.toFixed(1)}</span>
            
            <span className="text-muted-foreground">Ads:</span>
            <span className="font-bold text-right font-code">{data.ads.toFixed(1)}</span>

            <span className="text-muted-foreground">Tasks:</span>
            <span className="font-bold text-right font-code">{data.tasks.toFixed(1)}</span>
        </div>
      </div>
    );
  }
  return null;
};

// Custom X-axis ticks to show Day and Month
const CustomXAxisTick = ({ x, y, payload }: any) => {
  // Add a guard clause to prevent crash if payload or its nested payload is not what we expect
  if (!payload || !payload.payload) {
    return null;
  }
  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={16} textAnchor="middle" fill="hsl(var(--card-foreground))" className="text-sm font-medium">
        {payload.payload.shortName}
      </text>
      <text x={0} y={0} dy={32} textAnchor="middle" fill="hsl(var(--card-foreground))" className="text-xs opacity-70">
        {payload.payload.monthName}
      </text>
    </g>
  );
};

// Custom Legend at the bottom
const renderLegend = () => {
    const legendItems = [
        { value: 'Earnings', color: '#D4FF5A' },
        { value: 'Today', color: '#6BC750' },
      ];
  return (
    <div className="flex justify-center items-center space-x-6 mt-4 text-sm text-card-foreground/80">
      {legendItems.map((item) => (
        <div key={item.value} className="flex items-center">
          <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }} />
          <span>{item.value}</span>
        </div>
      ))}
    </div>
  );
};

export const EarningsChart = ({ data }: EarningsChartProps) => {
  const todayString = format(new Date(), 'yyyy-MM-dd');
  const maxValue = Math.max(...data.map(i => i.total), 0);

  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 30, // Make space for labels
            right: 5,
            left: 5,
            bottom: 20,
          }}
          barCategoryGap="30%"
        >
          <XAxis
            dataKey="name"
            tickLine={false}
            axisLine={false}
            tick={<CustomXAxisTick />}
            height={40}
            interval={0} // Show all ticks
          />
          <YAxis hide={true} domain={[0, maxValue > 0 ? maxValue * 1.25 : 10]} />
          <Tooltip 
            content={<CustomTooltip />} 
            cursor={{ fill: 'hsla(var(--primary-h), var(--primary-s), var(--primary-l), 0.1)' }}
          />
          <Legend content={renderLegend} verticalAlign="bottom" />
          <Bar dataKey="total" radius={[6, 6, 0, 0]}>
            <LabelList 
                dataKey="total" 
                position="top" 
                formatter={(value: number) => value > 0 ? value.toFixed(1) : ''} 
                className="text-xs font-code" 
                fill="hsl(var(--card-foreground))" 
                offset={10} 
            />
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.date === todayString ? '#6BC750' : '#D4FF5A'} 
                className="transition-colors duration-300"
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
