import { ExpenseInterface } from "../interfaces/expense.js";
import ExpenseModel from "../models/expense.js";

// Create a new expense
/**
 * Creates a new expense record in the database.
 *
 * @param {string} title - The title of the expense.
 * @param {number} amount - The amount of the expense.
 * @param {number} category_id - The ID of the category to which the expense belongs.
 * @param {string} [description] - An optional description of the expense.
 * @returns {Promise<ExpenseModel>} The created expense record.
 * @throws {Error} If there is an error creating the expense.
 */


export const createExpense = async (title: string, amount: number, category_id: number, wallet_id: number, description?: string): Promise<ExpenseInterface> => {
    try {
        const expense = await ExpenseModel.create({ 
            title, 
            amount,
            wallet_id, 
            category_id, 
            description, 
            createdAt: new Date(), 
            updatedAt: new Date() 
        });
        return expense.toJSON();
    } catch (error: any) {
        throw new Error(`Error creating expense: ${error.message}`);
    }
};

// Read an expense by ID
/**
 * Retrieves an expense by its ID.
 *
 * @param {number} id - The ID of the expense to retrieve.
 * @returns {Promise<ExpenseModel>} A promise that resolves to the expense object if found.
 * @throws {Error} If the expense is not found or if there is an error during the fetch operation.
 */
export const getExpenseById = async (id: number)=> {
    try {
        const expense = await ExpenseModel.findByPk(id);
        if (!expense) {
            throw new Error('Expense not found');
        }
        return expense.toJSON();
    } catch (error: any) {
        throw new Error(`Error fetching expense: ${error.message}`);
    }
};

// Update an expense by ID
/**
 * Updates an existing expense record in the database.
 *
 * @param {number} id - The ID of the expense to update.
 * @param {string} title - The new title of the expense.
 * @param {number} amount - The new amount of the expense.
 * @param {number} category_id - The new category ID of the expense.
 * @param {string} [description] - The new description of the expense (optional).
 * @returns {Promise<ExpenseModel>} The updated expense object.
 * @throws {Error} If the expense is not found or there is an error during the update.
 */
export const updateExpense = async (id: number, title: string, amount: number, category_id: number, description?: string): Promise<ExpenseInterface> => {
    try {
        const expense = await ExpenseModel.findByPk(id);
        if (!expense) {
            throw new Error('Expense not found');
        }
        expense.title = title;
        expense.amount = amount;
        expense.category_id = category_id;
        if (description !== undefined) {
            expense.description = description;
        }
        expense.updatedAt = new Date();
        await expense.save();
        return expense.toJSON();
    } catch (error: any) {
        throw new Error(`Error updating expense: ${error.message}`);
    }
};

// Delete an expense by ID
/**
 * Deletes an expense record by its ID.
 *
 * @param {number} id - The ID of the expense to delete.
 * @returns {Promise<boolean>} - Returns true if the expense was successfully deleted.
 * @throws {Error} - Throws an error if the expense is not found or if there is an issue deleting the expense.
 */
export const deleteExpense = async (id: number) => {
    try {
        const expense = await ExpenseModel.findByPk(id);
        if (!expense) {
            throw new Error('Expense not found');
        }
        await expense.destroy();
        return true;
    } catch (error: any) {
        throw new Error(`Error deleting expense: ${error.message}`);
    }
};

// Retrieve all expenses
/**
 * Retrieves all expense records from the database.
 *
 * @returns {Promise<ExpenseModel[]>} A promise that resolves to an array of expense records.
 * @throws {Error} If there is an error fetching the expense records.
 */
export const getAllExpenses = async (): Promise<ExpenseModel[]> => {
    try {
        const expenses = await ExpenseModel.findAll();
        return expenses.map(expense => expense.toJSON());
    } catch (error: any) {
        throw new Error('Error fetching expenses: ' + error.message);
    }
};