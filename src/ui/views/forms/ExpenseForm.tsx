import React, { useEffect } from 'react';
import { TextField, Button, Box, FormControl, InputLabel, Select, MenuItem, Typography, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import { useAlert } from '../alert/AlertContext';
import LoadingModal from '../modals/LoadingModal';
import { ExpenseCategoryInterface } from '../../interfaces/entities/expense_category';
import { WalletInterface } from '../../interfaces/entities/wallet';
import { waitMs } from '../../util';
import { ExpenseInterface } from '../../interfaces/entities/expense';

interface ExpenseFormInterface {
    title: string;
    description: string;
    amount: number;
    category_id: number;
    wallet_id: number;
    date: string;
    time: string; // Add this line
}

interface ExpenseFormUIProps {
    whenIconCloseFire: () => void;
    whenNewDataSaved?: (val: ExpenseInterface) => void;
}

const ExpenseForm: React.FC<ExpenseFormUIProps> = ({ whenIconCloseFire, whenNewDataSaved }) => {
    const [loading, setLoading] = React.useState(false);
    const { showAlert } = useAlert();
    const [formData, setFormData] = React.useState<ExpenseFormInterface>({
        title: '',
        description: '',
        amount: 0,
        category_id: -1,
        wallet_id: -1,
        date: '',
        time: '', // Add this line
    });

    const [categories, setCategories] = React.useState<ExpenseCategoryInterface[]>([]);
    const [wallets, setWallets] = React.useState<WalletInterface[]>([]);
    const [fetched, setFetched] = React.useState(false);

    const handleChange = (e: any | { name?: string; value: unknown }) => {
        const { name, value } = e.target;
        if (name == 'category_id' && value == -1) {
            showAlert("warning", "Please select a category");
            return;
        }
        if (name == 'wallet_id' && value == -1) {
            showAlert("warning", "Please select a wallet");
            return;
        }
        setFormData({
            ...formData,
            [name as string]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        try {
            e.preventDefault();
            if (formData.amount > 1_000_000_000_000) {
                showAlert("error", "Amount cannot exceed 1 trillion");
                return;
            } else if (formData.amount <= 0) {
                showAlert("error", "Amount must be greater than 0");
                return;
            }
            setLoading(true);
            waitMs(200);
            const response = await window.db_expenses.addExpense({
                ...formData,
                ///TODO: Combine date and time
            });
            if (response.success) {
                if (whenNewDataSaved) {
                    whenNewDataSaved(response.data!);
                }
                showAlert("success", "Expense added successfully");
            } else {
                showAlert("error", response.message);
            }
            setLoading(false);
        } catch (error: any) {
            if (loading) {
                setLoading(false);
            }
            showAlert('error', error.message)
        }
        return;
    };

    const initCategories = async () => {
        const response = await window.db_expense_categories.getExpenseCategories();
        if (!response.success) {
            throw new Error(response.message);
        }
        setCategories(response.data);
    };

    const initWallets = async () => {
        const response = await window.db_wallets.getWallets();
        if (!response.success) {
            throw new Error(response.message);
        }
        setWallets(response.data);
    };

    const initData = async () => {
        try {
            await initWallets();
            await initCategories();
        } catch (error: any) {
            showAlert('error', error.message);
            whenIconCloseFire();
        } finally {
            setFetched(true);
        }
    };

    useEffect(() => {
        initData();
    }, []);
    if (!fetched) {
        return null;
    }

    return (
        <>
            <LoadingModal open={loading} />
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    mt: 3,
                    p: 4,
                    mx: 'auto',
                    borderRadius: 4,
                    backgroundColor: 'white',
                    maxWidth: 560,
                    minWidth: 400,
                }}
            >
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start',
                }}>
                    <Box>
                        <Typography variant="h5">
                            Add Expense
                        </Typography>
                        <Typography variant="subtitle1" color="textSecondary">
                            Please fill out the form below to add a new expense entry
                        </Typography>
                    </Box>
                    <IconButton onClick={(_) => whenIconCloseFire()}>
                        <Close />
                    </IconButton>
                </Box>
                <TextField
                    label="Title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    fullWidth
                />
                <TextField
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    multiline
                    rows={3}
                    fullWidth
                />
                <TextField
                    label="Amount"
                    name="amount"
                    type="number"
                    value={formData.amount}
                    onChange={handleChange}
                    required
                    fullWidth
                />
                <Box sx={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 2, alignItems: 'center' }}>
                    <TextField
                        label="Date"
                        name="date"
                        type="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                        fullWidth
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        label="Time"
                        name="time"
                        type="time"
                        value={formData.time}
                        onChange={handleChange}
                        required
                        fullWidth
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <Button
                        variant="outlined"
                        onClick={() => {
                            const now = new Date();
                            setFormData({
                                ...formData,
                                date: now.toISOString().split('T')[0],
                                time: now.toTimeString().split(' ')[0].slice(0, 5),
                            });
                        }}
                    >
                        Now
                    </Button>
                </Box>

                <FormControl fullWidth required>
                    <InputLabel id="category-label">Category</InputLabel>
                    <Select
                        labelId="category-label"
                        name="category_id"
                        value={formData}
                        onChange={handleChange}
                        label="Category"
                    >
                        {categories.map((cat) => (
                            <MenuItem key={cat.id} value={cat.id}>
                                {cat.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl fullWidth required>
                    <InputLabel id="wallet-label">Wallet</InputLabel>
                    <Select
                        labelId="wallet-label"
                        name="wallet_id"
                        value={formData.wallet_id}
                        onChange={handleChange}
                        label="Wallet"
                    >
                        {wallets.map((wallet) => (
                            <MenuItem key={wallet.id} value={wallet.id}>
                                {`${wallet.name} (${wallet.balance})`}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Submit
                </Button>
            </Box>
        </>
    );
};

export default ExpenseForm;