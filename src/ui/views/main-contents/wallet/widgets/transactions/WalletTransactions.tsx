import React from "react";
import { EXPENSE_TYPE, ExpenseInterface } from "../../../../../interfaces/entities/expense";
import { IncomeInterface } from "../../../../../interfaces/entities/income";
import { Box, Card, CardContent, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { Search } from "@mui/icons-material";
import CustomDropdown from "../../../../components/Dropdown";
import { formatCurrency } from "../../../../util/number_formater";
import { formatDateSimple } from "../../../../util/date_formater";

interface WalletTransactionsProps {
    transactions: (ExpenseInterface | IncomeInterface)[];
    searchQuery: string;
    setSearchQuery: (value: string) => void;
}

const WalletTransactions: React.FC<WalletTransactionsProps> = ({transactions, searchQuery, setSearchQuery}) => {
    return (
        <Card sx={{ padding: "10px", boxShadow: "none", border: '1.5px solid #EAEAEA' }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Typography variant="h6" fontWeight={700}>Transactions</Typography>
                <TextField
                    label="Search Transactions"
                    variant="outlined"
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value) }}
                    fullWidth
                    sx={{ marginBottom: '10px' }}
                    slotProps={
                        {
                            input: {
                                endAdornment: (
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Search />
                                    </Box>
                                ),
                            }
                        }
                    }
                />
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '10px' }}>
                    <CustomDropdown items={[]} value={''} onChange={() => { }} />
                    <CustomDropdown items={[]} value={''} onChange={() => { }} />
                    <CustomDropdown items={[]} value={''} onChange={() => { }} />
                    <CustomDropdown items={[]} value={''} onChange={() => { }} />
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, height: '480px', overflowY: 'auto' }}>
                    <Table sx={{ '& .MuiTableCell-root': { fontSize: '12px' } }}>
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
                                    <TableCell>{index + 1}</TableCell>
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
                                    <TableCell>{formatDateSimple(transaction.createdAt)}</TableCell>
                                    <TableCell>{formatDateSimple(transaction.updatedAt)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>
            </CardContent>
        </Card>
    )
}

export default WalletTransactions;