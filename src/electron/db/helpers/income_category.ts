import IncomeCategory from "../models/income_category.js";

// Create a new income category
export const createIncomeCategory = async (name: string, description?: string) => {
    try {
        const incomeCategory = await IncomeCategory.create({ 
            name, 
            description, 
            createdAt: new Date(), 
            updatedAt: new Date() 
        });
        return incomeCategory;
    } catch (error: any) {
        throw new Error(`Error creating income category: ${error.message}`);
    }
};

// Read an income category by ID
export const getIncomeCategoryById = async (id: number) => {
    try {
        const incomeCategory = await IncomeCategory.findByPk(id);
        if (!incomeCategory) {
            throw new Error('Income category not found');
        }
        return incomeCategory;
    } catch (error: any) {
        throw new Error(`Error fetching income category: ${error.message}`);
    }
};

// Update an income category by ID
export const updateIncomeCategory = async (id: number, name: string, description?: string) => {
    try {
        const incomeCategory = await IncomeCategory.findByPk(id);
        if (!incomeCategory) {
            throw new Error('Income category not found');
        }
        incomeCategory.name = name;
        incomeCategory.description = description;
        await incomeCategory.save();
        return incomeCategory;
    } catch (error: any) {
        throw new Error(`Error updating income category: ${error.message}`);
    }
};

// Delete an income category by ID
export const deleteIncomeCategory = async (id: number) => {
    try {
        const incomeCategory = await IncomeCategory.findByPk(id);
        if (!incomeCategory) {
            throw new Error('Income category not found');
        }
        await incomeCategory.destroy();
        return true;
    } catch (error: any) {
        throw new Error(`Error deleting income category: ${error.message}`);
    }
};

// Initialize data with 3 basic income categories
export const initIncomeCategories = async () => {
    const categories = [
        { name: 'Salary', description: 'Monthly salary' },
        { name: 'Freelance', description: 'Freelance work income' },
        { name: 'Investments', description: 'Income from investments' },
    ];

    for (const category of categories) {
        try {
            await createIncomeCategory(category.name, category.description);
        } catch (error: any) {
            console.error(`Error initializing income category ${category.name}: ${error.message}`);
        }
    }
};