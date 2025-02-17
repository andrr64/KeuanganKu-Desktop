import { Box, Card, CardContent, Typography } from "@mui/material";
import CustomDropdown from "../../../components/Dropdown";
import { DateRange, dateRangeMenuItems } from "../../../../enums/date_range";
import { useCallback, useEffect, useState } from "react";
import LineChartWeek from "../../../components/LineChartWeek";
import LineChartMonth from "../../../components/LineChartMonth";
import LineChartYear from "../../../components/LineChartYear";
import { WalletInterface } from "../../../../interfaces/entities/wallet";
import { CartesianChartType, CartesianChartTypeMenuItems } from "../../../../enums/chart_type";

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
            return <Typography>Loading...</Typography>;
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
                return <LineChartWeek lines={[chartData]} />;
            case DateRange.MONTH:
                return <LineChartMonth lines={[chartData]} />;
            case DateRange.YEAR:
                return <LineChartYear lines={[chartData]} />;
            default:
                return <Typography>Invalid date range</Typography>;
        }
    };

    return (
        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
            <Card sx={{ height: 520, padding: "10px", boxShadow: "none", border: '1.5px solid #EAEAEA' }}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
                    {renderChart()}
                </CardContent>
            </Card>
        </Box>
    );
}

export default Graphs;