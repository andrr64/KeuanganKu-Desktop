import React from 'react';
import { TextField, Button, Box, Typography, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import { useAlert } from '../alert/AlertContext';
import LoadingModal from '../modals/LoadingModal';
import { waitMs } from '../../util';

interface WalletFormProps {
    title: string;
}

interface WalletFormUIProps {
    whenIconCloseFire: () => void;
}

const WalletForm: React.FC<WalletFormUIProps> = ({ whenIconCloseFire }) => {
    const [loading, setLoading] = React.useState(false);
    const { showAlert } = useAlert();
    const [formData, setFormData] = React.useState<WalletFormProps>({
        title: '',
    });

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name as string]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.title.trim() === '') {
            showAlert("warning", "Title cannot be empty");
            return;
        }
        setLoading(true);
        await waitMs(200);
        const response = await window.db_wallets.addWallet(formData.title);
        setLoading(false);
        if (response.success) {
            const newWallet = response.data; ///TODO: handle new wallet
            showAlert("success", "Wallet has been successfully added");
            whenIconCloseFire();
        } else {
            showAlert("error", response.message);
        }
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
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Add
                </Button>
            </Box>
        </>
    );
};

export default WalletForm;
