import { ipcMain } from "electron";
import Expense from '../db/entities/expense.js';
import Wallet from '../db/entities/wallet.js';
import { ExpenseFormInterface } from "./interfaces/expense_form.js";
import { ipcResponseError, ipcResponseSuccess,  IPCResponse } from "../db/interfaces/ipc_response.js";
import AppDataSource from "../db/config/ormconfig.js";
import { GetExpensesProp } from "./interfaces/get_expense.js";
import { ExpenseInterface } from "../db/interfaces/expense.js";
import { ExpenseCategory } from "../db/entities/expense_category.js";
import { DateRange } from "../enums/date_range.js";
import { Between } from "typeorm";
import { PieData } from "./interfaces/graph.js";

export function registerDBExpenseIPCHandler() {
    ipcMain.handle('add-expense', async (_, data: ExpenseFormInterface) => {
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const wallet = await queryRunner.manager.findOneBy(Wallet, { id: data.wallet_id });
            if (!wallet) {
                throw new Error('Wallet not found');
            }

            if (wallet.balance < data.amount) {
                throw new Error('Insufficient balance');
            }
            wallet.balance -= data.amount;

            const expense_category = await queryRunner.manager.findOneBy(ExpenseCategory, { id: data.category_id });
            if (!expense_category) {
                throw new Error('Category not found');
            }
            await queryRunner.manager.save(wallet);

            const expense = new Expense();
            expense.amount = data.amount;
            expense.title = data.title;
            expense.description = data.description ?? '';
            expense.wallet = wallet; // Simpan wallet sebagai relasi
            expense.category = expense_category;
            await queryRunner.manager.save(expense);
            await queryRunner.commitTransaction();
            return ipcResponseSuccess(expense.toInterface());
        } catch (error: any) {
            await queryRunner.rollbackTransaction();
            return ipcResponseError(error.message);
        } finally {
            await queryRunner.release();
        }
    });

    ipcMain.handle('get-expenses', async (_, data: GetExpensesProp) => {
        try {
            // Check if the wallet exists
            const wallet = await Wallet.findOne({ where: { id: data.walletId } });
            if (!wallet) {
                return ipcResponseError('Wallet not found');
            }

            // Fetch expenses with the where condition
            const expenses = await Expense.find({
                where: {
                    wallet: {
                        id: data.walletId
                    }
                }
            });

            // Format the data to the interface
            const formattedData = expenses.map(expense => expense.toInterface());

            // Return the success response with the formatted data
            return ipcResponseSuccess<ExpenseInterface[]>(formattedData);
        } catch (error: any) {
            // Return the error response if something goes wrong
            return ipcResponseError(error.message);
        }
    });

    ipcMain.handle('delete-expense', async (_, id: number) => {
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const expense = await queryRunner.manager.findOneBy(Expense, { id });
            if (!expense) {
                throw new Error('Expense not found');
            }
            const wallet = await queryRunner.manager.findOneBy(Wallet, { id: expense.wallet.id });
            if (!wallet) {
                throw new Error('Wallet not found');
            }
            wallet.balance += expense.amount;
            await queryRunner.manager.save(wallet);
            await queryRunner.manager.delete(Expense, id);
            await queryRunner.commitTransaction();
            return ipcResponseSuccess(true);
        } catch (error: any) {
            await queryRunner.rollbackTransaction();
            return ipcResponseError(error.message);
        } finally {
            await queryRunner.release();
        }
    });

    ipcMain.handle('get-expense-line-graph', async (_, walletId: number, dateRange: DateRange) => {
        try {
            // Cari wallet berdasarkan ID
            const wallet = await Wallet.findOne({ where: { id: walletId } });
            if (!wallet) {
                return ipcResponseError('Wallet not found');
            }

            // Tentukan rentang tanggal berdasarkan dateRange
            const endDate = new Date();
            let startDate: Date;

            switch (dateRange) {
                case DateRange.WEEK:
                    startDate = new Date();
                    startDate.setDate(endDate.getDate() - 7);
                    break;
                case DateRange.MONTH:
                    startDate = new Date();
                    startDate.setMonth(endDate.getMonth() - 1);
                    break;
                case DateRange.YEAR:
                    startDate = new Date();
                    startDate.setFullYear(endDate.getFullYear() - 1);
                    break;
                default:
                    throw new Error('Invalid date range');
            }

            // Cari data income dalam rentang tanggal yang ditentukan
            const expenses = await Expense.find({
                where: {
                    wallet: { id: walletId },
                    createdAt: Between(startDate, endDate),
                },
                order: { createdAt: 'ASC' },
            });

            // Format data untuk grafik berdasarkan dateRange
            let graphData: {}[];

            switch (dateRange) {
                case DateRange.WEEK:
                    // Kelompokkan data berdasarkan hari (0-6)
                    const weeklyData = Array(7).fill(0); // Inisialisasi array dengan 7 elemen (0-6)
                    expenses.forEach((expense) => {
                        const dayIndex = expense.createdAt.getDay(); // Ambil index hari (0-6)
                        weeklyData[dayIndex] += expense.amount; // Tambahkan amount ke hari yang sesuai
                    });
                    graphData = weeklyData.map((total, index) => ({ x: index, y: total }));
                    break;

                case DateRange.MONTH:
                    // Kelompokkan data berdasarkan tanggal (0 hingga tanggal terakhir - 1)
                    const lastDayOfMonth = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0).getDate();
                    const monthlyData = Array(lastDayOfMonth).fill(0); // Inisialisasi array dengan jumlah hari dalam bulan
                    expenses.forEach((expense) => {
                        const dayOfMonth = expense.createdAt.getDate() - 1; // Ambil tanggal (0-based)
                        monthlyData[dayOfMonth] += expense.amount; // Tambahkan amount ke tanggal yang sesuai
                    });
                    graphData = monthlyData.map((total, index) => ({ x: index, y: total }));
                    break;

                case DateRange.YEAR:
                    // Kelompokkan data berdasarkan bulan (0-11)
                    const yearlyData = Array(12).fill(0); // Inisialisasi array dengan 12 elemen (0-11)
                    expenses.forEach((expense) => {
                        const monthIndex = expense.createdAt.getMonth(); // Ambil index bulan (0-11)
                        yearlyData[monthIndex] += expense.amount; // Tambahkan amount ke bulan yang sesuai
                    });
                    graphData = yearlyData.map((total, index) => ({ x: index, y: total }));
                    break;

                default:
                    throw new Error('Invalid date range');
            }

            // Kirim respons sukses
            return ipcResponseSuccess(graphData);
        } catch (error: any) {
            // Tangani error dan kirim respons error
            console.error('Error in get-income-line-graph:', error);
            return ipcResponseError(error.message || 'An unexpected error occurred');
        }
    });

    ipcMain.handle('get-expense-pie-graph', async (_, walletId: number, dateRange: DateRange): Promise<IPCResponse<PieData[] | null>> => {
        try {
            // Cari wallet berdasarkan ID
            const wallet = await Wallet.findOne({ where: { id: walletId } });
            if (!wallet) {
                return ipcResponseError('Wallet not found');
            }

            // Tentukan rentang tanggal berdasarkan dateRange
            const endDate = new Date();
            let startDate: Date;

            switch (dateRange) {
                case DateRange.WEEK:
                    startDate = new Date();
                    startDate.setDate(endDate.getDate() - 7);
                    break;
                case DateRange.MONTH:
                    startDate = new Date();
                    startDate.setMonth(endDate.getMonth() - 1);
                    break;
                case DateRange.YEAR:
                    startDate = new Date();
                    startDate.setFullYear(endDate.getFullYear() - 1);
                    break;
                default:
                    throw new Error('Invalid date range');
            }

            // Cari data pengeluaran dalam rentang tanggal yang ditentukan
            const expenses = await Expense.find({
                where: {
                    wallet: { id: walletId },
                    createdAt: Between(startDate, endDate),
                },
                relations: ['category'], // Pastikan relasi kategori dimuat
            });

            // Kelompokkan data berdasarkan kategori
            const categoryMap = new Map<string, number>();

            expenses.forEach((expense) => {
                const categoryName = expense.category.name; // Ambil nama kategori
                if (categoryMap.has(categoryName)) {
                    categoryMap.set(categoryName, categoryMap.get(categoryName)! + expense.amount);
                } else {
                    categoryMap.set(categoryName, expense.amount);
                }
            });

            // Format data untuk pie chart
            const pieChartData = Array.from(categoryMap).map(([category, total]) => ({
                label: category,
                value: total,
            }));
            
            // Kirim respons sukses
            return ipcResponseSuccess(pieChartData);
        } catch (error: any) {
            // Tangani error dan kirim respons error
            console.error('Error in get-expense-pie-chart:', error);
            return ipcResponseError(error.message || 'An unexpected error occurred');
        }
    });
}