import { Box, Card, CardContent, Typography } from '@mui/material';
import CustomDropdown from '../../../../components/Dropdown';
import { LineChart } from '@mui/x-charts/LineChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { WalletInterface } from '../../../../../interfaces/entities/wallet';
import React, { useEffect, useState } from 'react';
import { ExpenseInterface } from '../../../../../interfaces/entities/expense';
import { formatDate } from '../../../../util/date_formater';
import { formatCurrency } from '../../../../util/number_formater';
import { IncomeInterface } from '../../../../../interfaces/entities/income';

interface WXWalletSummaryProps {
    wallet: WalletInterface;
}

const WXWalletSummary: React.FC<WXWalletSummaryProps> = ({ wallet }) => {
    const [transactions, setTransactions] = useState<ExpenseInterface[] | IncomeInterface[]>([]);
    
    useEffect(() => {
        async function fetchExpenseData() {
            if (!wallet) return;

            const response = await window.db_wallets.getTransactions(wallet.id);
            if (response.success){
                setTransactions(response.data);
            }
        }
        fetchExpenseData();
    }, [wallet]);

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

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <Box sx={{ width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                <Card sx={{ padding: "10px", boxShadow: "none", border: '1.5px solid #EAEAEA' }}>
                    <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <Box>
                            <Typography variant="h6" fontWeight={700}>Spending Trend Chart</Typography>
                            <Typography variant="body2" color="text.secondary">
                                Track your expenses over time and identify spending patterns!
                            </Typography>
                        </Box>
                        <CustomDropdown />
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
                        <CustomDropdown />
                        <PieChart
                            series={[{ data: pieData }]}
                            height={250}
                        />
                    </CardContent>
                </Card>
            </Box>
            <Card sx={{ padding: "10px", boxShadow: "none", border: '1.5px solid #EAEAEA' }}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <Typography variant="h6" fontWeight={700}>Transactions</Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '10px' }}>
                        <CustomDropdown />
                        <CustomDropdown />
                        <CustomDropdown />
                        <CustomDropdown />
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {transactions.length === 0 && (
                            <Typography variant="body2" color="text.secondary">
                                No transactions found.
                            </Typography>
                        )}
                        {transactions.map((transaction) => (
                            <Card key={transaction.id} sx={{ padding: "10px", boxShadow: "none", border: '1.5px solid #EAEAEA' }}>
                                <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <Box>
                                        <Typography variant="h6" fontWeight={700}>{transaction.title}</Typography>
                                        <Typography variant='body2'>{formatDate(transaction.createdAt)}</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {transaction.description}
                                        </Typography>
                                    </Box>
                                    <Typography variant="body1" color="text.primary">
                                        {formatCurrency(transaction.amount)}
                                    </Typography>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}

export default WXWalletSummary;
