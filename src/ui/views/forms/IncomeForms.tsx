import React, { useEffect } from 'react';
import { TextField, Button, Box, FormControl, InputLabel, Select, MenuItem, Typography, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import { useAlert } from '../alert/AlertContext';
import LoadingModal from '../modals/LoadingModal';
import { waitMs } from '../../util';
import { IncomeFormInterface } from '../../interfaces/request/income_form';
import { IncomeCategoryInterface } from '../../interfaces/entities/income_category';
import { WalletInterface } from '../../interfaces/entities/wallet';
import { IncomeInterface } from '../../interfaces/entities/income';

interface IncomeFormUIProps {
    whenIconCloseFire: () => void;
    whenNewDataSaved?: (val: IncomeInterface) => void;
}

const IncomeForm: React.FC<IncomeFormUIProps> = ({ whenIconCloseFire, whenNewDataSaved }) => {
    const [loading, setLoading] = React.useState(false);
    const { showAlert } = useAlert();
    const [formData, setFormData] = React.useState<IncomeFormInterface>({
        title: '',
        description: '',
        amount: 0,
        category_id: -1,
        wallet_id: -1 // Add this line
    });
    const [categories, setCategories] = React.useState<IncomeCategoryInterface[]>([]);
    const [wallets, setWallets] = React.useState<WalletInterface[]>([]); // Add this line
    const [fetched, setFetched] = React.useState(false);

    const handleChange = (e: any | { name?: string; value: unknown }) => {
        const { name, value } = e.target;
        if (name == 'category_id' && value == -1) {
            showAlert("warning", "Please select a category");
            return;
        }
        if (name == 'wallet_id' && value == -1) { // Add this block
            showAlert("warning", "Please select a wallet");
            return;
        }
        setFormData({
            ...formData,
            [name as string]: name === 'amount' ? Number(value) : value, // Ensure amount is a number
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
            await waitMs(250);
            const response = await window.db_incomes.addIncome(formData);
            setLoading(false);
            if (response.success) {
                showAlert("success", "Income added successfully");
                if (whenNewDataSaved){
                    whenNewDataSaved(response.data!);
                }
            } else {
                showAlert("error", response.message);
            }
            return;
        } catch (error: any) {
            if (loading) {
                setLoading(false);
            }
            showAlert('error', error.message)
        }
    };

    const initCategories = async () => {
        const response = await window.db_expense_categories.getExpenseCategories();
        if (!response.success) {
            throw new Error(response.message);
        }
        formData.category_id = response.data[0].id ?? 0;
        setCategories(response.data);
    };

    const initWallets = async () => {
        const response = await window.db_wallets.getWallets();
        if (!response.success) {
            throw new Error(response.message);
        }

        formData.wallet_id = response.data[0].id ?? -1;
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
                            Add Income
                        </Typography>
                        <Typography variant="subtitle1" color="textSecondary">
                            Please fill out the form below to add a new income entry
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
                        {wallets.map((wallet: WalletInterface) => (
                            <MenuItem key={wallet.id} value={wallet.id}>
                                {wallet.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Add
                </Button>
            </Box>
        </>
    );
};

export default IncomeForm;