import Income, { IncomeAttributes } from "../models/income.js";

export const addIncome = async (incomeData: IncomeAttributes) => {
    try {
        const income = await Income.create(incomeData);
        return income;
    } catch (error: any) {
        throw new Error('Error adding income: ' + error.message);
    }
};

export const getAllIncomes = async () => {
    try {
        const incomes = await Income.findAll();
        return incomes;
    } catch (error: any) {
        throw new Error('Error fetching incomes: ' + error.message);
    }
};

export const getIncomeById = async (id: number) => {
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

export const updateIncomeById = async (id: number, updateData: IncomeAttributes) => {
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

export const deleteIncome = async (id: number) => {
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