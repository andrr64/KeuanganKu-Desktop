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
import PieChartComponent, { PieData } from "../../../components/graphs/piechart/PieChart";

interface GraphsPageProps {
    wallet: WalletInterface;
}

function Graphs({ wallet }: GraphsPageProps) {
    const [selectedDateRange, setSelectedDateRange] = useState<DateRange>(DateRange.WEEK);
    const [spendingTrendData, setSpendingTrendData] = useState<{ x: number; y: number }[]>([]);
    const [spendingDistributionData, setSpendingDistributionData] = useState<PieData[]>([]);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [trendChartError, setTrendChartError] = useState<string | null>(null);
    const [distributionChartError, setDistributionChartError] = useState<string | null>(null);
    const [selectedChartType, setSelectedChartType] = useState<CartesianChartType>(CartesianChartType.line);

    // Fetch spending data
    const fetchSpendingData = useCallback(async () => {
        setIsLoading(true);
        setTrendChartError(null);
        setDistributionChartError(null);
        try {
            const trendResponse = await window.db_expenses.getLineGraph(wallet.id, selectedDateRange);
            if (trendResponse.success) {
                setSpendingTrendData(trendResponse.data);
            } else {
                setTrendChartError("Failed to fetch spending trend data");
            }

            const distributionResponse = await window.db_expenses.getPieGraph(wallet.id, selectedDateRange);
            if (distributionResponse.success) {
                setSpendingDistributionData(distributionResponse.data);
            } else {
                setDistributionChartError("Failed to fetch spending distribution data");
            }

        } catch (err) {
            setTrendChartError("An error occurred while fetching spending trend data");
            setDistributionChartError("An error occurred while fetching spending distribution data");
        } finally {
            await waitMs(250);
            setIsLoading(false);
        }
    }, [wallet.id, selectedDateRange]);

    // Fetch data when selectedDateRange or wallet changes
    useEffect(() => {
        fetchSpendingData();
    }, [fetchSpendingData]);

    // Render chart based on selectedDateRange
    const renderSpendingTrendChart = () => {
        if (isLoading) {
            return (
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    flexGrow={1}
                    height="100%"
                >
                    <CircularProgress />
                </Box>
            );
        }
        if (trendChartError) {
            return <Typography color="error">{trendChartError}</Typography>;
        }

        const chartData = {
            data: spendingTrendData,
            label: "Expense",
            color: "#FF0000",
        };

        switch (selectedDateRange) {
            case DateRange.WEEK:
                return selectedChartType === CartesianChartType.line ? (
                    <LineChartWeek lines={[chartData]} />
                ) : (
                    <BarChartWeek bars={[chartData]} />
                );
            case DateRange.MONTH:
                return selectedChartType === CartesianChartType.line ? (
                    <LineChartMonth lines={[chartData]} />
                ) : (
                    <BarChartMonth bars={[chartData]} />
                );
            case DateRange.YEAR:
                return selectedChartType === CartesianChartType.line ? (
                    <LineChartYear lines={[chartData]} />
                ) : (
                    <BarChartYear bars={[chartData]} />
                );
            default:
                return <Typography>Invalid date range</Typography>;
        }
    };

    const renderSpendingDistributionChart = () => {
        if (isLoading) {
            return (
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    flexGrow={1}
                    height="100%"
                >
                    <CircularProgress />
                </Box>
            );
        }
        if (distributionChartError) {
            return <Typography color="error">{distributionChartError}</Typography>;
        }

        return (
            <PieChartComponent data={spendingDistributionData} />
        );
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
                                value={selectedDateRange}
                                onChange={(val) => setSelectedDateRange(val)}
                            />
                        </Box>
                        <Box>
                            <Typography variant="body2" color="text.secondary">
                                Chart Type
                            </Typography>
                            <CustomDropdown
                                items={CartesianChartTypeMenuItems}
                                value={selectedChartType}
                                onChange={(val) => setSelectedChartType(val)}
                            />
                        </Box>
                    </Box>
                    <Box flexGrow={1} display="flex" justifyContent="center" alignItems="center">
                        {renderSpendingTrendChart()}
                    </Box>
                </CardContent>
            </Card>
            <Card sx={{ height: 520, padding: "10px", boxShadow: "none", border: '1.5px solid #EAEAEA' }}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: '10px', height: '100%' }}>
                    <Box>
                        <Typography variant="h6" fontWeight={700}>Spending Distribution</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Visualize the distribution of your expenses by category!
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'grid', gap: '10px', gridTemplateColumns: '1fr 1fr' }}>
                        <Box>
                            <Typography variant="body2" color="text.secondary">
                                Date Range
                            </Typography>
                            <CustomDropdown
                                items={dateRangeMenuItems}
                                value={selectedDateRange}
                                onChange={(val) => setSelectedDateRange(val)}
                            />
                        </Box>
                        <Box>
                            <Typography variant="body2" color="text.secondary">
                                Chart Type
                            </Typography>
                            <CustomDropdown
                                items={CartesianChartTypeMenuItems}
                                value={selectedChartType}
                                onChange={(val) => setSelectedChartType(val)}
                            />
                        </Box>
                    </Box>
                    <Box flexGrow={1} display="flex" justifyContent="center" alignItems="center">
                        {renderSpendingDistributionChart()}
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}

export default Graphs;