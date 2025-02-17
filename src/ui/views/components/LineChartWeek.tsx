import React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

interface DataPoint {
  x: number; // Index hari (0-6)
  y: number; // Nilai
}

interface LineChartWeekProps {
  data: DataPoint[];
}

const LineChartWeek: React.FC<LineChartWeekProps> = ({ data }) => {
  // Fungsi untuk mengonversi index hari ke nama hari
  const formatXAxis = (dayIndex: number) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[dayIndex]; // Ambil nama hari berdasarkan index
  };

  // Hitung nilai minimum untuk sumbu-Y
  const minValue = Math.min(...data.map((item) => item.y)) * 0.5;

  // Format data untuk MUI Charts
  const chartData = {
    series: [
      {
        data: data.map((item) => item.y), // Nilai (y)
        label: 'Income', // Label untuk legenda
        color: '#8884d8', // Warna garis
      },
    ],
    xAxis: data.map((item) => formatXAxis(item.x)), // Nama hari (x)
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
      margin={{ top: 25, bottom: 80,right: 20 }} // Menyesuaikan margin untuk legenda
      slotProps={{
        legend: {
          direction: 'row', // Mengatur arah legenda menjadi horizontal
          position: { vertical: 'bottom', horizontal: 'middle' }, // Posisi legenda di bawah
        },
      }}
      yAxis={[
        {
          min: minValue,
          valueFormatter: (value) => formatYAxis(value), // Format nilai sumbu-Y
        },
      ]}
    />
  );
};

export default LineChartWeek;