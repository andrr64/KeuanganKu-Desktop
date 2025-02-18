import React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { DataPoint } from '../LineChartWeek';

export interface BarData {
  data: DataPoint[]; // Array data points
  label: string; // Label untuk legenda
  color: string; // Warna bar
}

export interface BarChartWeekProps {
  bars: BarData[]; // Array dari BarData
}

const BarChartWeek: React.FC<BarChartWeekProps> = ({ bars }) => {
  // Fungsi untuk mengonversi index hari ke nama hari
  const formatXAxis = (dayIndex: number) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[dayIndex]; // Ambil nama hari berdasarkan index
  };

  // Format data untuk MUI Charts
  const chartData = {
    series: bars.map((bar) => ({
      data: bar.data.map((item) => item.y), // Nilai (y)
      label: bar.label, // Label untuk legenda
      color: bar.color, // Warna bar
    })),
    xAxis: bars[0].data.map((item) => formatXAxis(item.x)), // Nama hari (x)
  };

  // Fungsi untuk memformat nilai sumbu-Y menjadi format "K" (ribuan)
  const formatYAxis = (value: number) => {
    return `${(value / 1000).toFixed(0)}K`; // Contoh: 1000000 -> 1000K
  };

  return (
    <BarChart
      series={chartData.series}
      xAxis={[
        {
          data: chartData.xAxis,
          scaleType: 'band', // Menggunakan skala band untuk nama hari
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

export default BarChartWeek;