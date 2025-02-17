import { Box, Card, CardContent, Typography } from '@mui/material';
import CustomDropdown from '../../../components/Dropdown';
import { WalletInterface } from '../../../../interfaces/entities/wallet';
import React, { useEffect, useState } from 'react';
import { ExpenseInterface } from '../../../../interfaces/entities/expense';
import { IncomeInterface } from '../../../../interfaces/entities/income';
import WalletTransactions from './Transactions';
import LineChartWeek from '../../../components/LineChartWeek';

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

    const data = [
        { x: 0, y: 10 * 100000 }, // Sunday
        { x: 1, y: 20 * 100000 }, // Monday
        { x: 2, y: 15 * 100000 }, // Tuesday
        { x: 3, y: 25 * 100000 }, // Wednesday
        { x: 4, y: 30 * 100000 }, // Thursday
        { x: 5, y: 22 * 100000 }, // Friday
        { x: 6, y: 28 * 100000 }, // Saturday
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
                        <LineChartWeek data={data} />
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
}

export default WXWalletSummary;
