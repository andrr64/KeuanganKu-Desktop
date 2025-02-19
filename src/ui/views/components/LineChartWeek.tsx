import React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { Typography } from '@mui/material';

export interface DataPoint {
  x: number; // Index hari (0-6)
  y: number; // Nilai
}

export interface LineData {
  data: DataPoint[]; // Array data points
  label: string; // Label untuk legenda
  color: string; // Warna garis
}

export interface LineChartWeekProps {
  lines: LineData[]; // Array dari LineData
}

const LineChartWeek: React.FC<LineChartWeekProps> = ({ lines }) => {
  if (lines.length === 0) {
    return (
      <Typography variant='body2' sx={{ color: 'text.secondary' }}>
        No data available
      </Typography>
    );
  }// Fungsi untuk mengonversi index hari ke nama hari
  const formatXAxis = (dayIndex: number) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[dayIndex]; // Ambil nama hari berdasarkan index
  };

  // Format data untuk MUI Charts
  const chartData = {
    series: lines.map((line) => ({
      data: line.data.map((item) => item.y), // Nilai (y)
      label: line.label, // Label untuk legenda
      color: line.color, // Warna garis
    })),
    xAxis: lines[0].data.map((item) => formatXAxis(item.x)), // Nama hari (x)
  };

  // Fungsi untuk memformat nilai sumbu-Y menjadi format "K" (ribuan)
  const formatYAxis = (value: number) => {
    return `${(value / 1000).toFixed(0)}K`; // Contoh: 1000000 -> 1000K
  };

  return (
    <LineChart
      series={chartData.series}
      xAxis={[
        {
          data: chartData.xAxis,
          scaleType: 'point', // Menggunakan skala titik untuk nama hari
        },
      ]}
      height={360}
      margin={{ top: 25, bottom: 80, right: 20 }} // Menyesuaikan margin untuk legenda
      slotProps={{
        legend: {
          direction: 'row', // Mengatur arah legenda menjadi horizontal
          position: { vertical: 'bottom', horizontal: 'middle' }, // Posisi legenda di bawah
        },
      }}
      yAxis={[
        {
          valueFormatter: (value) => formatYAxis(value), // Format nilai sumbu-Y
        },
      ]}
    />
  );
};

export default LineChartWeek;