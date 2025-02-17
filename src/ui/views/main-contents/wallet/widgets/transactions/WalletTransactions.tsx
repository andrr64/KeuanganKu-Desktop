import React, { useEffect, useState } from "react";
import { EXPENSE_TYPE, ExpenseInterface } from "../../../../../interfaces/entities/expense";
import { IncomeInterface } from "../../../../../interfaces/entities/income";
import { Box, Card, CardContent, IconButton, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography, Menu } from "@mui/material";
import { Close, MoreVert, Search } from "@mui/icons-material";
import CustomDropdown from "../../../../components/Dropdown";
import { formatCurrency } from "../../../../util/number_formater";
import { formatDateSimple } from "../../../../util/date_formater";
import { DeleteMenuItem, EditMenuItem, ViewMenuItem } from "../../../../components/MenuItems";
import { useAlert } from "../../../../alert/AlertContext";

interface WalletTransactionsProps {
    transactions: (ExpenseInterface | IncomeInterface)[];
    searchResults: (ExpenseInterface | IncomeInterface)[];
    searchQuery: string;
    isSearching: boolean;

    resetSearch: () => void;
    setSearchQuery: (value: string) => void;
    performSearch: (query: string) => void;
}

const WalletTransactions: React.FC<WalletTransactionsProps> = ({
    transactions,
    searchQuery,
    setSearchQuery,
    searchResults,
    performSearch,
    resetSearch,
    isSearching
}) => {
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
    const [selectedTransaction, setSelectedTransaction] = useState<ExpenseInterface | IncomeInterface | null>(null);
    const [localQuery, setLocalQuery] = useState<string>('');
    const { showAlert } = useAlert();

    const openMenu = (event: React.MouseEvent<HTMLElement>, transaction: ExpenseInterface | IncomeInterface) => {
        setMenuAnchor(event.currentTarget);
        setSelectedTransaction(transaction);
    };

    const closeMenu = () => {
        setMenuAnchor(null);
        setSelectedTransaction(null);
    };

    const handleSearchOnEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            if (localQuery.trim()) {
                setSearchQuery(localQuery);
            } else {
                showAlert('error', 'Search query cannot be empty');
            }
        }
    };
    useEffect(() => {
        if (searchQuery.trim()) {
            performSearch(searchQuery);  // Lakukan pencarian hanya jika query tidak kosong
        }
    }, [searchQuery]);


    return (
        <Card sx={{ padding: "10px", boxShadow: "none", border: '1.5px solid #EAEAEA' }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Typography variant="h6" fontWeight={700}>Transactions</Typography>
                <TextField
                    label="Search Transactions"
                    variant="outlined"
                    value={localQuery}
                    onChange={(e) => setLocalQuery(e.target.value)}
                    onKeyUp={handleSearchOnEnter}
                    fullWidth
                    sx={{ marginBottom: '10px' }}
                    slotProps={{
                        input: {
                            endAdornment: (
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <IconButton onClick={() => {
                                        if (localQuery.trim()) {
                                            setSearchQuery(localQuery);
                                        } else {
                                            showAlert('error', 'Search query cannot be empty');
                                        }
                                    }}>
                                        <Search />
                                    </IconButton>
                                    {localQuery.length !== 0 && (
                                        <IconButton onClick={() => {
                                            setLocalQuery('');
                                        }}>
                                            <Close />
                                        </IconButton>
                                    )}
                                </Box>
                            ),
                        }
                    }}
                />
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                    <CustomDropdown items={[]} value={''} onChange={() => { }} />
                    <CustomDropdown items={[]} value={''} onChange={() => { }} />
                    <CustomDropdown items={[]} value={''} onChange={() => { }} />
                    <CustomDropdown items={[]} value={''} onChange={() => { }} />
                </Box>
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
                        <Typography variant="body1" >
                            Search Results for <b> '{searchQuery}'</b>   ({searchResults.length} results)
                        </Typography>
                        <IconButton onClick={(_) => resetSearch()} sx={{ color: '#888' }}>
                            <Close />
                        </IconButton>
                    </Box>
                )}

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, height: '480px', overflowY: 'auto' }}>
                    <Table sx={{ '& .MuiTableCell-root': { fontSize: '12px' } }}>
                        <TableHead>
                            <TableRow >
                                <TableCell width={10}>No</TableCell>
                                <TableCell width={10}>Type</TableCell>
                                <TableCell>Title</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Amount</TableCell>
                                <TableCell>Created</TableCell>
                                <TableCell>Updated</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
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

            {/* Menu Dropdown */}
            <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={closeMenu}>
                <ViewMenuItem onClick={() => { console.log("View", selectedTransaction); closeMenu(); }} />
                <EditMenuItem onClick={() => { console.log("Edit", selectedTransaction); closeMenu(); }} />
                <DeleteMenuItem onClick={() => { console.log("Delete", selectedTransaction); closeMenu(); }} />
            </Menu>
        </Card>
    );
};

export default WalletTransactions;
