import React, { useEffect } from 'react';
import { TextField, Button, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { IncomeCategoryInterface } from '../../interfaces/income_category';
import LoadingModal from '../modals/LoadingModal';
import { useAlert } from '../alert/AlertContext';

interface IncomeFormProps {
    title: string;
    description: string;
    amount: number;
    category_id: number;
}

const IncomeForm: React.FC = () => {
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
        // Handle form submission logic here
        console.log(formData);
    };

    const initData = async () => {
        const data = await window.db_income_categories.getIncomeCategories();
        setCategories((prevCategories) => [...prevCategories, ...data]);
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
                    mx: 'auto',
                    width: '50%',
                    backgroundColor: 'white',
                    minWidth: 300,
                }}
            >
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
                <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                        name="category_id"
                        value={formData.category_id}
                        onChange={handleChange}
                        required
                    >
                        {categories.map((cat) => (
                            <MenuItem key={cat.id} value={cat.id}>
                                {cat.name}
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

export default IncomeForm;