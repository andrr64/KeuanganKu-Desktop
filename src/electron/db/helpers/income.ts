import Income, { IncomeAttributes } from "../models/income.js";

/**
 * Adds a new income record to the database.
 *
 * @param {IncomeAttributes} incomeData - The data of the income to be added.
 * @returns {Promise<Income>} The created income record.
 * @throws {Error} If there is an error while adding the income.
 */
export const addIncome = async (incomeData: IncomeAttributes): Promise<Income> => {
    try {
        const income = await Income.create(incomeData);
        return income;
    } catch (error: any) {
        throw new Error('Error adding income: ' + error.message);
    }
};

/**
 * Retrieves all income records from the database.
 *
 * @returns {Promise<Income[]>} A promise that resolves to an array of income records.
 * @throws {Error} If there is an error fetching the income records.
 */
export const getAllIncomes = async (): Promise<Income[]> => {
    try {
        const incomes = await Income.findAll();
        return incomes;
    } catch (error: any) {
        throw new Error('Error fetching incomes: ' + error.message);
    }
};

/**
 * Retrieves an income record by its ID.
 *
 * @param {number} id - The ID of the income record to retrieve.
 * @returns {Promise<Income>} A promise that resolves to the income record if found.
 * @throws {Error} Throws an error if the income record is not found or if there is an issue fetching the income.
 */
export const getIncomeById = async (id: number): Promise<Income> => {
    try {
        const income = await Income.findByPk(id);
        if (!income) {
            throw new Error('Income not found');
        }
        return income;
    } catch (error: any) {
        throw new Error('Error fetching income: ' + error.message);
    }
};

/**
 * Updates an income record by its ID.
 *
 * @param {number} id - The ID of the income record to update.
 * @param {IncomeAttributes} updateData - The data to update the income record with.
 * @returns {Promise<Income>} The updated income record.
 * @throws {Error} If the income record is not found or if there is an error during the update.
 */
export const updateIncomeById = async (id: number, updateData: IncomeAttributes): Promise<Income> => {
    try {
        const income = await Income.findByPk(id);
        if (!income) {
            throw new Error('Income not found');
        }
        await income.update(updateData);
        return income;
    } catch (error: any) {
        throw new Error('Error updating income: ' + error.message);
    }
};

/**
 * Deletes an income record by its ID.
 *
 * @param {number} id - The ID of the income record to delete.
 * @returns {Promise<{ message: string }>} A promise that resolves to an object containing a success message.
 * @throws {Error} If the income record is not found or if there is an error during deletion.
 */
export const deleteIncome = async (id: number): Promise<{ message: string; }> => {
    try {
        const income = await Income.findByPk(id);
        if (!income) {
            throw new Error('Income not found');
        }
        await income.destroy();
        return { message: 'Income deleted successfully' };
    } catch (error: any) {
        throw new Error('Error deleting income: ' + error.message);
    }
};