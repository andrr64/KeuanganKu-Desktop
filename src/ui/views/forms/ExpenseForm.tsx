import React, { useEffect } from 'react';
import { TextField, Button, Box, FormControl, InputLabel, Select, MenuItem, Typography, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import { useAlert } from '../alert/AlertContext';
import LoadingModal from '../modals/LoadingModal';
import { ExpenseCategoryInterface } from '../../interfaces/expense_category';
import { WalletInterface } from '../../interfaces/wallet';
import { waitMs } from '../../util';

interface ExpenseFormInterface {
    title: string;
    description: string;
    amount: number;
    category_id: number;
    wallet_id: number; // Add this line
}

interface ExpenseFormUIProps {
    whenIconCloseFire: () => void;
}

const ExpenseForm: React.FC<ExpenseFormUIProps> = ({ whenIconCloseFire }) => {
    const [loading, setLoading] = React.useState(true);
    const { showAlert } = useAlert();
    const [formData, setFormData] = React.useState<ExpenseFormInterface>({
        title: '',
        description: '',
        amount: 0,
        category_id: -1,
        wallet_id: -1, // Add this line
    });
    const [categories, setCategories] = React.useState<ExpenseCategoryInterface[]>([]);
    const [wallets, setWallets] = React.useState<WalletInterface[]>([]);

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
            const response = await window.db_expenses.addExpense(formData);
            if (response.success) {
                showAlert("success", "Expense added successfully");
            } else {
                showAlert("error", response.message);
            }
            setLoading(false);
        } catch (error: any) {
            if  (loading){
                setLoading(false);
            }
            showAlert('error', error.message)
        }
        return;
    };

    const initCategories = async () => {
        const response = await window.db_expense_categories.getExpenseCategories();
        if (response.data) {
            formData.category_id = response.data[0].id ?? 0;
            setCategories(response.data);
        } else {
            showAlert("error", "Failed to fetch categories");
            whenIconCloseFire();
        }
    };
    const initWallets = async () => {
        const response = await window.db_wallets.getWallets();
        console.log(response.success);
        if (response.success) {
            formData.wallet_id = response.data[0].id ?? -1;
            setWallets(response.data);
        } else {
            showAlert("error", "Failed to fetch wallets");
            whenIconCloseFire();
        }
    };


    const initData = async () => {
        await initCategories();
        await initWallets();
        setLoading(false);
    };

    useEffect(() => {
        initData();
    }, []);

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
                <FormControl fullWidth required>
                    <InputLabel id="category-label">Category</InputLabel>
                    <Select
                        labelId="category-label"
                        name="category_id"
                        value={formData.category_id}
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