import React, { useEffect, useState, useCallback } from "react";
import { WalletInterface } from "../../../../interfaces/entities/wallet";
import { IncomeInterface } from "../../../../interfaces/entities/income";
import { EXPENSE_TYPE, ExpenseInterface } from "../../../../interfaces/entities/expense";
import { Box, Card, CardContent, IconButton, Menu, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { Close, MoreVert, Search } from "@mui/icons-material";
import CustomDropdown from "../../../components/Dropdown";
import { formatCurrency } from "../../../util/number_formater";
import { formatDateSimple } from "../../../util/date_formater";
import { DeleteMenuItem, EditMenuItem, ViewMenuItem } from "../../../components/MenuItems";

interface WalletTransactionsProps {
    wallet: WalletInterface | null;
    handleDelete: (val: ExpenseInterface | IncomeInterface) => void;
    handleEdit: (val: ExpenseInterface | IncomeInterface) => void;
}

const WalletTransactions: React.FC<WalletTransactionsProps> = ({ wallet, handleDelete, handleEdit }) => {
    const [transactions, setTransactions] = useState<Array<ExpenseInterface | IncomeInterface>>([]);
    const [searchResults, setSearchResults] = useState<Array<ExpenseInterface | IncomeInterface>>([]);
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
    const [selectedTransaction, setSelectedTransaction] = useState<ExpenseInterface | IncomeInterface | null>(null);
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [searchQuery, setSearchQuery] = useState<string>('');

    // Fetch transactions
    const fetchTransactions = useCallback(async () => {
        if (wallet) {
            // Reset transactions sebelum fetching data baru
            setTransactions([]);

            const response = await window.db_wallets.getTransactions(wallet.id);
            if (response.success) {
                setTransactions(response.data);
            }
        }
    }, [wallet]);

    // Perform search
    const performSearch = useCallback(async () => {
        if (wallet && searchQuery.trim()) {
            const response = await window.db_wallets.searchTransactions(searchQuery.toLowerCase(), wallet.id);
            if (response.success) {
                setIsSearching(true);
                setSearchResults(response.data);
            }
        }
    }, [wallet, searchQuery]);

    // Reset search
    const resetSearch = useCallback(() => {
        setIsSearching(false);
        setSearchResults([]);
        setSearchQuery('');
    }, []);

    // Handle search on Enter key
    const handleSearchOnEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            performSearch();
        }
    };


    // Open menu for transaction actions
    const openMenu = (event: React.MouseEvent<HTMLElement>, transaction: ExpenseInterface | IncomeInterface) => {
        setMenuAnchor(event.currentTarget);
        setSelectedTransaction(transaction);
    };

    // Close menu
    const closeMenu = () => {
        setMenuAnchor(null);
        setSelectedTransaction(null);
    };

    // Fetch transactions on wallet change
    useEffect(() => {
        fetchTransactions();
    }, [wallet, fetchTransactions]);

    // Perform search when searchQuery changes
    useEffect(() => {
        if (searchQuery.trim()) {
            performSearch();
        } else {
            resetSearch();
        }
    }, [searchQuery, performSearch, resetSearch]);

    return (
        <Card sx={{ padding: "10px", boxShadow: "none", border: '1.5px solid #EAEAEA' }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Typography variant="h6" fontWeight={700}>Transactions</Typography>

                {/* Search Bar */}
                <TextField
                    label="Search Transactions"
                    variant="outlined"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyUp={handleSearchOnEnter}
                    fullWidth
                    sx={{ marginBottom: '10px' }}
                    slotProps={{
                        input: {
                            endAdornment: (
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <IconButton onClick={performSearch}>
                                        <Search />
                                    </IconButton>
                                    {searchQuery.length !== 0 && (
                                        <IconButton onClick={resetSearch}>
                                            <Close />
                                        </IconButton>
                                    )}
                                </Box>
                            ),
                        }
                    }}
                />

                {/* Filters */}
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                    <CustomDropdown items={[]} value={''} onChange={() => { }} />
                    <CustomDropdown items={[]} value={''} onChange={() => { }} />
                    <CustomDropdown items={[]} value={''} onChange={() => { }} />
                    <CustomDropdown items={[]} value={''} onChange={() => { }} />
                </Box>

                {/* Search Results */}
                {isSearching && (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            backgroundColor: '#f5f5f5',
                            padding: '10px',
                            borderRadius: '8px',
                            marginBottom: '10px'
                        }}
                    >
                        <Typography variant="body1">
                            Search Results for <b>'{searchQuery}'</b> ({searchResults.length} results)
                        </Typography>
                        <IconButton onClick={resetSearch} sx={{ color: '#888' }}>
                            <Close />
                        </IconButton>
                    </Box>
                )}

                {/* Transactions Table */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, height: '480px', overflowY: 'auto' }}>
                    <Table sx={{ '& .MuiTableCell-root': { fontSize: '12px' } }}>
                        <TableHead>
                            <TableRow>
                                <TableCell width={10}>No</TableCell>
                                <TableCell width={10}>Type</TableCell>
                                <TableCell>Title</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Amount</TableCell>
                                <TableCell>Created</TableCell>
                                <TableCell>Updated</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
             ``           </TableHead>
                        <TableBody>
                            {(isSearching ? searchResults : transactions).map((transaction, index) => (
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
                                    <TableCell>
                                        <IconButton onClick={(e) => openMenu(e, transaction)}>
                                            <MoreVert />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>
            </CardContent>

            {/* Transaction Actions Menu */}
            <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={closeMenu}>
                <ViewMenuItem onClick={() => { console.log("View", selectedTransaction); closeMenu(); }} />
                <EditMenuItem onClick={() => {
                    if (selectedTransaction !== null) {
                        handleEdit(selectedTransaction)
                    } closeMenu();
                }} />
                <DeleteMenuItem onClick={() => {
                    if (selectedTransaction !== null) {
                        handleDelete(selectedTransaction)
                    } closeMenu();
                }} />
            </Menu>
        </Card>
    );
};

export default WalletTransactions;