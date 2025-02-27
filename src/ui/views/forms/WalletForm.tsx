import React from 'react';
import { TextField, Button, Box, Typography, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import { useAlert } from '../alert/AlertContext';
import LoadingModal from '../modals/LoadingModal';
import { waitMs } from '../../util';
import { WalletInterface } from '../../interfaces/entities/wallet';

interface WalletFormProps {
    title: string;
    balance: number;
}

interface WalletFormUIProps {
    handleNewWallet: (wallet: WalletInterface) => void;
    whenIconCloseFire: () => void;
}

const WalletForm: React.FC<WalletFormUIProps> = ({ whenIconCloseFire, handleNewWallet}) => {
    const [loading, setLoading] = React.useState(false);
    const { showAlert } = useAlert();
    const [formData, setFormData] = React.useState<WalletFormProps>({
        title: '',
        balance: 0,
    });

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name as string]: name === 'balance' ? parseFloat(value) : value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        try {
            e.preventDefault();
            if (formData.title.trim() === '') {
                showAlert("warning", "Title cannot be empty");
                return;
            }
            if (isNaN(formData.balance) || formData.balance < 0) {
                showAlert("warning", "Balance must be a non-negative number");
                return;
            }
            setLoading(true);
            await waitMs(200);
            const response = await window.db_wallets.addWallet(formData.title, formData.balance);
            setLoading(false);
            if (response.success) {
                showAlert("success", "Wallet has been successfully added");
                handleNewWallet(response.data!);
                whenIconCloseFire();
            } else {
                showAlert("error", response.message);
            }
        } catch (error: any) {
            if (loading) { setLoading(false); }
            showAlert('error', error.message);
        }
        return;
    };

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
                            Add Wallet
                        </Typography>
                        <Typography variant="subtitle1" color="textSecondary">
                            Please fill out the form below to add a new wallet
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
                    label="Balance"
                    name="balance"
                    type="number"
                    value={formData.balance}
                    onChange={handleChange}
                    required
                    fullWidth
                />
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Add
                </Button>
            </Box>
        </>
    );
};

export default WalletForm;
