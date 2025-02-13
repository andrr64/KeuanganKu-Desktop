import { Box, Card, CardContent, Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import CustomDropdown from '../../../../components/Dropdown';
import { LineChart } from '@mui/x-charts/LineChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { WalletInterface } from '../../../../../interfaces/entities/wallet';
import React, { useEffect, useState } from 'react';
import { EXPENSE_TYPE, ExpenseInterface } from '../../../../../interfaces/entities/expense';
import { IncomeInterface } from '../../../../../interfaces/entities/income';
import { formatDate } from '../../../../util/date_formater';
import { formatCurrency } from '../../../../util/number_formater';

interface WXWalletSummaryProps {
    wallet: WalletInterface | null;
}

const WXWalletSummary: React.FC<WXWalletSummaryProps> = ({ wallet }) => {
    const [transactions, setTransactions] = useState<ExpenseInterface[] | IncomeInterface[]>([]);

    useEffect(() => {
        const fetchExpenseData = async () => {
            if (!wallet) {
                setTransactions([]);
                return;
            }

            const response = await window.db_wallets.getTransactions(wallet.id);
            if (response.success) {
                setTransactions(response.data);
            }
        };
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
            <Card sx={{ padding: "10px", boxShadow: "none", border: '1.5px solid #EAEAEA' }}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <Typography variant="h6" fontWeight={700}>Transactions</Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '10px' }}>
                        <CustomDropdown items={[]} value={''} onChange={() => { }} />
                        <CustomDropdown items={[]} value={''} onChange={() => { }} />
                        <CustomDropdown items={[]} value={''} onChange={() => { }} />
                        <CustomDropdown items={[]} value={''} onChange={() => { }} />
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {transactions.length === 0 && (
                            <Typography variant="body2" color="text.secondary">
                                No transactions found.
                            </Typography>
                        )}
                        {transactions.length > 0 && (
                            <>
                                <Box sx={{ height: '480px', overflowY: 'auto' }}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>No</TableCell>
                                                <TableCell>Type</TableCell>
                                                <TableCell>Title</TableCell>
                                                <TableCell>Description</TableCell>
                                                <TableCell>Amount</TableCell>
                                                <TableCell>Created</TableCell>
                                                <TableCell>Updated</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {transactions.map((transaction, index) => (
                                                <TableRow key={transaction.id}>
                                                    <TableCell>{index+1}</TableCell>
                                                    <TableCell>
                                                        <Box
                                                            sx={{
                                                                width: 14,
                                                                height: 14,
                                                                borderRadius: '50%',
                                                                backgroundColor: transaction.type === EXPENSE_TYPE ? 'red' : 'green',
                                                                display: 'inline-block',
                                                                marginRight: 1,
                                                            }}
                                                        />
                                                    </TableCell>
                                                    <TableCell>{transaction.title}</TableCell>
                                                    <TableCell>{transaction.description}</TableCell>
                                                    <TableCell>{formatCurrency(transaction.amount)}</TableCell>
                                                    <TableCell>{formatDate(transaction.createdAt)}</TableCell>
                                                    <TableCell>{formatDate(transaction.updatedAt)}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </Box>
                            </>
                        )}
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}

export default WXWalletSummary;
