import { LineChart } from "@mui/x-charts";
import { LineData } from "./LineChartWeek";

export interface LineChartMonthProps {
    lines: LineData[]; // Array dari LineData
}

const LineChartMonth: React.FC<LineChartMonthProps> = ({ lines }) => {
    // Format data untuk MUI Charts
    const chartData = {
        series: lines.map((line) => ({
            data: line.data.map((item) => item.y), // Nilai (y)
            label: line.label, // Label untuk legenda
            color: line.color, // Warna garis
        })),
        xAxis: lines[0].data.map((item) => `${item.x + 1}`), // Label sumbu X: x + 1 (tanggal)
    };

    // Fungsi untuk memformat nilai sumbu-Y menjadi format "K" (ribuan)
    const formatYAxis = (value: number) => {
        return `${(value / 1000).toFixed(0)}K`; // Contoh: 1000000 -> 1000K
    };

    return (
        <LineChart
            series={chartData.series.map((series) => ({
                ...series,
                showMark: false, 
            }))}
            xAxis={[
                {
                    data: chartData.xAxis,
                    scaleType: 'point', // Menggunakan skala titik untuk tanggal
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

export default LineChartMonth;