import { Box, Card, CardContent, CircularProgress, Typography } from "@mui/material";
import CustomDropdown from "../../../components/Dropdown";
import { DateRange, dateRangeMenuItems } from "../../../../enums/date_range";
import { useCallback, useEffect, useState } from "react";
import LineChartWeek from "../../../components/LineChartWeek";
import LineChartMonth from "../../../components/LineChartMonth";
import LineChartYear from "../../../components/LineChartYear";

import BarChartMonth from "../../../components/graphs/BarChartMonth";
import BarChartWeek from "../../../components/graphs/BarChartWeek";
import BarChartYear from "../../../components/graphs/BarChartYear";

import { WalletInterface } from "../../../../interfaces/entities/wallet";
import { CartesianChartType, CartesianChartTypeMenuItems } from "../../../../enums/chart_type";
import { waitMs } from "../../../../util";

interface GraphsPageProps {
    wallet: WalletInterface;
}

function Graphs({ wallet }: GraphsPageProps) {
    const [spendingDaterange, setSpendingDaterange] = useState<DateRange>(DateRange.WEEK);
    const [spendingData, setSpendingData] = useState<{ x: number; y: number }[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [chartType, setChartType] = useState<CartesianChartType>(CartesianChartType.line);

    // Fetch spending data
    const fetchSpendingData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await window.db_expenses.getLineGraph(wallet.id, spendingDaterange);
            if (response.success) {
                setSpendingData(response.data);
            } else {
                setError("Failed to fetch spending data");
            }
        } catch (err) {
            setError("An error occurred while fetching spending data");
        } finally {
            await waitMs(250);
            setIsLoading(false);
        }
    }, [wallet.id, spendingDaterange]);

    // Fetch data when spendingDaterange or wallet changes
    useEffect(() => {
        fetchSpendingData();
    }, [fetchSpendingData]);

    // Render chart based on spendingDaterange
    const renderChart = () => {
        if (isLoading) {
            return (
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    flexGrow={1} // Mengambil sisa ruang yang tersedia
                    height="100%" // Memastikan Box mengambil seluruh tinggi
                >
                    <CircularProgress />
                </Box>
            );
        }
        if (error) {
            return <Typography color="error">{error}</Typography>;
        }

        const chartData = {
            data: spendingData,
            label: "Expense",
            color: "#FF0000",
        };

        switch (spendingDaterange) {
            case DateRange.WEEK:
                return chartType === CartesianChartType.line ? (
                    <LineChartWeek lines={[chartData]} />
                ) : (
                    <BarChartWeek bars={[chartData]} />
                );
            case DateRange.MONTH:
                return chartType === CartesianChartType.line ? (
                    <LineChartMonth lines={[chartData]} />
                ) : (
                    <BarChartMonth bars={[chartData]} />
                );
            case DateRange.YEAR:
                return chartType === CartesianChartType.line ? (
                    <LineChartYear lines={[chartData]} />
                ) : (
                    <BarChartYear bars={[chartData]} />
                );
            default:
                return <Typography>Invalid date range</Typography>;
        }
    };

    return (
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
            <Card sx={{ height: 520, padding: "10px", boxShadow: "none", border: '1.5px solid #EAEAEA' }}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: '10px', height: '100%' }}>
                    <Box>
                        <Typography variant="h6" fontWeight={700}>Spending Trend Chart</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Track your expenses over time and identify spending patterns!
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'grid', gap: '10px', gridTemplateColumns: '1fr 1fr' }}>
                        <Box>
                            <Typography variant="body2" color="text.secondary">
                                Date Range
                            </Typography>
                            <CustomDropdown
                                items={dateRangeMenuItems}
                                value={spendingDaterange}
                                onChange={(val) => setSpendingDaterange(val)}
                            />
                        </Box>
                        <Box>
                            <Typography variant="body2" color="text.secondary">
                                Chart Type
                            </Typography>
                            <CustomDropdown
                                items={CartesianChartTypeMenuItems}
                                value={chartType}
                                onChange={(val) => setChartType(val)}
                            />
                        </Box>
                    </Box>
                    <Box flexGrow={1} display="flex" justifyContent="center" alignItems="center">
                        {renderChart()}
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}

export default Graphs;