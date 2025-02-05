import React, { useEffect } from 'react';
import { TextField, Button, Box, FormControl, InputLabel, Select, MenuItem, Typography, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import LoadingModal from '../LoadingModal';
import { useAlert } from '../../alert/AlertContext';
import { IncomeCategoryInterface } from '../../../interfaces/income_category';

interface IncomeFormProps {
    title: string;
    description: string;
    amount: number;
    category_id: number;
}

interface IncomeFormUIProps {
    whenIconCloseFire: () => void;
}

const IncomeForm: React.FC<IncomeFormUIProps> = ({ whenIconCloseFire }) => {
    const [loading, setLoading] = React.useState(true);
    const { showAlert } = useAlert();
    const [formData, setFormData] = React.useState<IncomeFormProps>({
        title: '',
        description: '',
        amount: 0,
        category_id: -1,
    });
    const [categories, setCategories] = React.useState<IncomeCategoryInterface[]>([
        { id: -1, name: 'Choose', createdAt: new Date(), updatedAt: new Date() },
    ]);

    const handleChange = (e: any | { name?: string; value: unknown }) => {
        const { name, value } = e.target;
        if (name == 'category_id' && value == -1) {
            showAlert("warning", "Please select a category");
            return;
        }
        setFormData({
            ...formData,
            [name as string]: value,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.amount > 1_000_000_000_000) {
            showAlert("error", "Amount cannot exceed 1 trillion");
            return;
        }
        // Handle form submission logic here
        console.log(formData);
    };

    const initData = async () => {
        //@ts-ignore
        const data: IncomeCategoryInterface[] = await window.db_income_categories.getIncomeCategories();
        formData.category_id = data[0].id?? 0;
        setCategories(data);
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
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Add
                </Button>
            </Box>
        </>
    );
};

export default IncomeForm;