import React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { Typography } from '@mui/material';

export interface PieData {
  label: string;
  value: number;
  color?: string;
}

interface PieChartProps {
  data: PieData[];
}

const PieChartComponent: React.FC<PieChartProps> = ({ data }) => {
  if (data.length === 0) {
    return (
      <Typography variant='body2' sx={{ color: 'text.secondary' }}>
        No data available
      </Typography>
    );
  }

  const chartData = data.map((item) => ({
    id: item.label, // Unique identifier for each segment
    label: item.label, // Label for the segment
    value: item.value, // Value for the segment
  }));

  return (
    <PieChart
      series={[
        {
          data: chartData,
          highlightScope: { faded: 'global', highlighted: 'item' },
          faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
        },
      ]}
      height={200}
    />
  );
};

export default PieChartComponent;