import { Box, Card, CardContent, Typography } from '@mui/material';
import CustomDropdown from '../../../../components/Dropdown';
import { LineChart } from '@mui/x-charts/LineChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { WalletInterface } from '../../../../../interfaces/entities/wallet';
import React, { useEffect, useState } from 'react';
import { ExpenseInterface } from '../../../../../interfaces/entities/expense';
import { IncomeInterface } from '../../../../../interfaces/entities/income';
import WalletTransactions from '../transactions/WalletTransactions';

interface WXWalletSummaryProps {
    wallet: WalletInterface | null;
}

const WXWalletSummary: React.FC<WXWalletSummaryProps> = ({ wallet }) => {
    const [transactions, setTransactions] = useState<ExpenseInterface[] | IncomeInterface[]>([]);
    const [searchResults, setSearchResults] = useState<ExpenseInterface[] | IncomeInterface[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [isInSearchMode, setIsInSearchMode] = useState<boolean>(false);

    const performSearch = async () => {
        if (wallet !== null) {
            const query = searchQuery.toLowerCase();
            const response = await window.db_wallets.searchTransactions(query, wallet.id);
            if (response.success) {
                setIsInSearchMode(true);
                setSearchResults([...response.data]);
            }
        }
    }

    const chartData = {
        xAxis: [{ scaleType: 'point', data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] }],
        series: [
            {
                data: [2, 5.5, 2, 8.5, 1.5, 5, 3],
                area: true,
                color: '#1976D2',
                showMark: true,
            },
        ],
    };
    const pieData = [
        { label: "Food", value: 40, color: "#ff7043" },
        { label: "Transport", value: 25, color: "#42a5f5" },
        { label: "Shopping", value: 20, color: "#66bb6a" },
        { label: "Entertainment", value: 15, color: "#ab47bc" },
    ];

    useEffect(() => {
        const fetchExpenseData = async () => {
            setTransactions([]); // Reset data sebelum fetch data baru
            if (wallet) {
                const response = await window.db_wallets.getTransactions(wallet.id);
                if (response.success) {
                    setTransactions([...response.data]); // Pastikan update state menggantikan data lama
                }
            }
        };
        fetchExpenseData();
    }, [wallet]);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <WalletTransactions
                transactions={transactions}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                searchResults={searchResults}
                resetSearch={() => {
                    setIsInSearchMode(false);
                    setSearchResults([]);
                    setSearchQuery(''); // reset query tanpa memicu pencarian
                }}
                isSearching={isInSearchMode}
                performSearch={performSearch}
            />
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                <Card sx={{ padding: "10px", boxShadow: "none", border: '1.5px solid #EAEAEA' }}>
                    <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <Box>
                            <Typography variant="h6" fontWeight={700}>Spending Trend Chart</Typography>
                            <Typography variant="body2" color="text.secondary">
                                Track your expenses over time and identify spending patterns!
                            </Typography>
                        </Box>
                        <CustomDropdown items={[]} value={''} onChange={() => { }} />
                        <LineChart
                            series={chartData.series}
                            height={250}
                            margin={{ top: 20, bottom: 30, left: 30, right: 20 }}
                        />
                    </CardContent>
                </Card>
                <Card sx={{ padding: "10px", boxShadow: "none", border: '1.5px solid #EAEAEA' }}>
                    <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <Box>
                            <Typography variant="h6" fontWeight={700}>Where Does Your Money Go?</Typography>
                            <Typography variant="body2" color="text.secondary">
                                Visualize your spending by category and track where your money goes!
                            </Typography>
                        </Box>
                        <CustomDropdown items={[]} value={''} onChange={() => { }} />
                        <PieChart
                            series={[{ data: pieData }]}
                            height={250}
                        />
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
}

export default WXWalletSummary;
