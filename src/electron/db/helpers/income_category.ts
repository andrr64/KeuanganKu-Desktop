import IncomeCategory from "../models/income_category.js";

// Create a new income category
/**
 * Creates a new income category in the database.
 *
 * @param {string} name - The name of the income category.
 * @param {string} [description] - An optional description of the income category.
 * @returns {Promise<IncomeCategory>} A promise that resolves to the created income category.
 * @throws {Error} If there is an error creating the income category.
 */
export const createIncomeCategory = async (name: string, description?: string): Promise<IncomeCategory> => {
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
/**
 * Retrieves an income category by its ID.
 *
 * @param {number} id - The ID of the income category to retrieve.
 * @returns {Promise<IncomeCategory>} A promise that resolves to the income category if found.
 * @throws {Error} Throws an error if the income category is not found or if there is an issue fetching the income category.
 */
export const getIncomeCategoryById = async (id: number): Promise<IncomeCategory> => {
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
/**
 * Updates an existing income category with the provided name and optional description.
 *
 * @param {number} id - The ID of the income category to update.
 * @param {string} name - The new name for the income category.
 * @param {string} [description] - The new description for the income category (optional).
 * @returns {Promise<IncomeCategory>} The updated income category.
 * @throws {Error} If the income category is not found or if there is an error during the update process.
 */
export const updateIncomeCategory = async (id: number, name: string, description?: string): Promise<IncomeCategory> => {
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
/**
 * Deletes an income category by its ID.
 *
 * @param {number} id - The ID of the income category to delete.
 * @returns {Promise<boolean>} - A promise that resolves to true if the income category was successfully deleted.
 * @throws {Error} - Throws an error if the income category is not found or if there is an issue deleting it.
 */
export const deleteIncomeCategory = async (id: number): Promise<boolean> => {
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
/**
 * Initializes the income categories by creating predefined categories.
 * 
 * This function creates the following income categories:
 * - Salary: Monthly salary
 * - Freelance: Freelance work income
 * - Investments: Income from investments
 * 
 * For each category, it calls the `createIncomeCategory` function with the category's name and description.
 * If an error occurs during the creation of a category, it logs an error message to the console.
 * 
 * @async
 * @function
 * @returns {Promise<void>} A promise that resolves when all categories have been initialized.
 */
export const initIncomeCategories = async (): Promise<void> => {
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