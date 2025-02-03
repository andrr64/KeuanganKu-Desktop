import ExpenseCategory from "../models/expense_category.js";

// Create a new expense category
/**
 * Creates a new expense category in the database.
 *
 * @param name - The name of the expense category.
 * @param description - An optional description of the expense category.
 * @returns The created expense category object.
 * @throws Will throw an error if there is an issue creating the expense category.
 */
export const createExpenseCategory = async (name: string, description?: string) => {
    try {
        const expenseCategory = await ExpenseCategory.create({ 
            name, 
            description, 
            createdAt: new Date(), 
            updatedAt: new Date() 
        });
        return expenseCategory;
    } catch (error: any) {
        throw new Error(`Error creating expense category: ${error.message}`);
    }
};

// Read an expense category by ID
/**
 * Retrieves an expense category by its ID.
 *
 * @param {number} id - The ID of the expense category to retrieve.
 * @returns {Promise<ExpenseCategory>} A promise that resolves to the expense category if found.
 * @throws {Error} If the expense category is not found or if there is an error during retrieval.
 */
export const getExpenseCategoryById = async (id: number): Promise<ExpenseCategory> => {
    try {
        const expenseCategory = await ExpenseCategory.findByPk(id);
        if (!expenseCategory) {
            throw new Error('Expense category not found');
        }
        return expenseCategory;
    } catch (error: any) {
        throw new Error(`Error fetching expense category: ${error.message}`);
    }
};

// Update an expense category by ID
/**
 * Updates an existing expense category with the provided name and optional description.
 *
 * @param {number} id - The ID of the expense category to update.
 * @param {string} name - The new name for the expense category.
 * @param {string} [description] - The new description for the expense category (optional).
 * @returns {Promise<ExpenseCategory>} The updated expense category.
 * @throws {Error} If the expense category is not found or if there is an error during the update process.
 */
export const updateExpenseCategory = async (id: number, name: string, description?: string): Promise<ExpenseCategory> => {
    try {
        const expenseCategory = await ExpenseCategory.findByPk(id);
        if (!expenseCategory) {
            throw new Error('Expense category not found');
        }
        expenseCategory.name = name;
        expenseCategory.description = description;
        await expenseCategory.save();
        return expenseCategory;
    } catch (error: any) {
        throw new Error(`Error updating expense category: ${error.message}`);
    }
};

// Delete an expense category by ID
/**
 * Deletes an expense category by its ID.
 *
 * @param {number} id - The ID of the expense category to delete.
 * @returns {Promise<boolean>} - A promise that resolves to true if the expense category was successfully deleted.
 * @throws {Error} - Throws an error if the expense category is not found or if there is an error during deletion.
 */
export const deleteExpenseCategory = async (id: number): Promise<boolean> => {
    try {
        const expenseCategory = await ExpenseCategory.findByPk(id);
        if (!expenseCategory) {
            throw new Error('Expense category not found');
        }
        await expenseCategory.destroy();
        return true;
    } catch (error: any) {
        throw new Error(`Error deleting expense category: ${error.message}`);
    }
};

// Initialize data with 3 basic expense categories
/**
 * Initializes the default expense categories in the database.
 * 
 * This function creates a predefined set of expense categories, such as 'Rent', 'Utilities', 
 * and 'Groceries', each with a corresponding description. It attempts to create each category 
 * by calling the `createExpenseCategory` function. If an error occurs during the creation of 
 * any category, it logs an error message to the console.
 * 
 * @returns {Promise<void>} A promise that resolves when all categories have been initialized.
 */
export const initExpenseCategories = async (): Promise<void> => {
    const categories = [
        { name: 'Rent', description: 'Monthly rent' },
        { name: 'Utilities', description: 'Utility bills' },
        { name: 'Groceries', description: 'Monthly groceries' },
        { name: 'Gasoline', description: 'Gas for vehicle, bro.' },
    ];

    for (const category of categories) {
        try {
            await createExpenseCategory(category.name, category.description);
        } catch (error: any) {
            console.error(`Error initializing expense category ${category.name}: ${error.message}`);
        }
    }
};