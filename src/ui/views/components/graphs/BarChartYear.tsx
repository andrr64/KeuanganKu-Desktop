import { BarChart } from "@mui/x-charts";
import { LineData } from "../LineChartWeek";

export interface BarChartProps {
    bars: LineData[]; // Array dari LineData
}

const BarChartYear: React.FC<BarChartProps> = ({ bars }) => {
    // Fungsi untuk mengonversi index bulan ke nama bulan
    const formatXAxis = (monthIndex: number) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months[monthIndex]; // Ambil nama bulan berdasarkan index
    };

    // Format data untuk MUI Charts
    const chartData = {
        series: bars.map((line) => ({
            data: line.data.map((item) => item.y), // Nilai (y)
            label: line.label, // Label untuk legenda
        })),
        xAxis: bars[0].data.map((item) => formatXAxis(item.x)), // Nama bulan (x)
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
                    scaleType: 'band', // Menggunakan skala band untuk nama bulan
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
            colors={bars.map((bar) => bar.color)} // Mengatur warna dari prop bars
        />
    );
};

export default BarChartYear;