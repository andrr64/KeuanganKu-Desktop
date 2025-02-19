import { ipcMain } from "electron";
import Income from '../db/entities/income.js';
import Wallet from '../db/entities/wallet.js';
import IncomeCategory from '../db/entities/income_category.js'; // Import IncomeCategory
import { IncomeFormInterface } from "./interfaces/income_form.js";
import { IPCResponse, ipcResponseError, ipcResponseSuccess } from "../db/interfaces/ipc_response.js";
import AppDataSource from "../db/config/ormconfig.js";
import { GetIncomesProp } from "./interfaces/get_income.js";
import { IncomeInterface } from "../db/interfaces/income.js";
import { DateRange } from "../enums/date_range.js";
import { Between } from "typeorm";
import { PieData } from "./interfaces/graph.js";

export function registerDBIncomeIPCHandler() {
    ipcMain.handle('add-income', async (_, data: IncomeFormInterface) => {
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const wallet = await queryRunner.manager.findOneBy(Wallet, { id: data.wallet_id });
            if (!wallet) {
                throw new Error('Wallet not found');
            }

            const incomeCategory = await queryRunner.manager.findOneBy(IncomeCategory, { id: data.category_id });
            if (!incomeCategory) {
                throw new Error('Income category not found');
            }

            wallet.balance += data.amount;
            await queryRunner.manager.save(wallet);

            const income = new Income();
            income.amount = data.amount;
            income.category = incomeCategory;
            income.wallet = wallet;
            income.title = data.title;
            income.description = data.description ?? '';

            await queryRunner.manager.save(income);
            await queryRunner.commitTransaction();
            return ipcResponseSuccess(income.toInterface());
        } catch (error: any) {
            await queryRunner.rollbackTransaction();
            return ipcResponseError(error.message);
        } finally {
            await queryRunner.release();
        }
    });

    ipcMain.handle('get-incomes', async (_, data: GetIncomesProp) => {
        try {
            // Check if the wallet exists
            const wallet = await Wallet.findOne({ where: { id: data.walletId } });
            if (!wallet) {
                return ipcResponseError('Wallet not found');
            }

            // Fetch incomes with the where condition
            const incomes = await Income.find({
                where: {
                    wallet: {
                        id: wallet.id
                    }
                }
            });

            // Format the data to the interface
            const formattedData = incomes.map(income => income.toInterface());

            // Return the success response with the formatted data
            return ipcResponseSuccess<IncomeInterface[]>(formattedData);
        } catch (error: any) {
            return ipcResponseError(error.message);
        }
    });

    ipcMain.handle('delete-income', async (_, id: number) => {
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const income = await queryRunner.manager.findOneBy(Income, { id });
            if (!income) {
                throw new Error('Income not found');
            }
            const wallet = await queryRunner.manager.findOneBy(Wallet, { id: income.wallet.id });
            if (!wallet) {
                throw new Error('Wallet not found');
            }
            wallet.balance -= income.amount;
            await queryRunner.manager.save(wallet);
            await queryRunner.manager.delete(Income, id);
            await queryRunner.commitTransaction();
            return ipcResponseSuccess(true);
        } catch (error: any) {
            await queryRunner.rollbackTransaction();
            return ipcResponseError(error.message);
        } finally {
            await queryRunner.release();
        }
    });

    ipcMain.handle('get-income-line-graph', async (_, walletId: number, dateRange: DateRange) => {
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
            const incomes = await Income.find({
                where: {
                    wallet: { id: walletId },
                    createdAt: Between(startDate, endDate),
                },
                order: { createdAt: 'ASC' },
            });

            // Format data untuk grafik berdasarkan dateRange
            let graphData : {}[];

            switch (dateRange) {
                case DateRange.WEEK:
                    // Kelompokkan data berdasarkan hari (0-6)
                    const weeklyData = Array(7).fill(0); // Inisialisasi array dengan 7 elemen (0-6)
                    incomes.forEach((income) => {
                        const dayIndex = income.createdAt.getDay(); // Ambil index hari (0-6)
                        weeklyData[dayIndex] += income.amount; // Tambahkan amount ke hari yang sesuai
                    });
                    graphData = weeklyData.map((total, index) => ({ x: index, y: total }));
                    break;

                case DateRange.MONTH:
                    // Kelompokkan data berdasarkan tanggal (0 hingga tanggal terakhir - 1)
                    const lastDayOfMonth = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0).getDate();
                    const monthlyData = Array(lastDayOfMonth).fill(0); // Inisialisasi array dengan jumlah hari dalam bulan
                    incomes.forEach((income) => {
                        const dayOfMonth = income.createdAt.getDate() - 1; // Ambil tanggal (0-based)
                        monthlyData[dayOfMonth] += income.amount; // Tambahkan amount ke tanggal yang sesuai
                    });
                    graphData = monthlyData.map((total, index) => ({ x: index, y: total }));
                    break;

                case DateRange.YEAR:
                    // Kelompokkan data berdasarkan bulan (0-11)
                    const yearlyData = Array(12).fill(0); // Inisialisasi array dengan 12 elemen (0-11)
                    incomes.forEach((income) => {
                        const monthIndex = income.createdAt.getMonth(); // Ambil index bulan (0-11)
                        yearlyData[monthIndex] += income.amount; // Tambahkan amount ke bulan yang sesuai
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

    ipcMain.handle('get-income-pie-graph', async (_, walletId: number, dateRange: DateRange): Promise<IPCResponse<PieData[] | null>> => {
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
            const incomes = await Income.find({
                where: {
                    wallet: { id: walletId },
                    createdAt: Between(startDate, endDate),
                },
                relations: ['category'], // Pastikan relasi kategori dimuat
            });

            // Kelompokkan data berdasarkan kategori
            const categoryMap = new Map<string, number>();

            incomes.forEach((income) => {
                const categoryName = income.category.name; // Ambil nama kategori
                if (categoryMap.has(categoryName)) {
                    categoryMap.set(categoryName, categoryMap.get(categoryName)! + income.amount);
                } else {
                    categoryMap.set(categoryName, income.amount);
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
            console.error('Error in get-income-pie-graph:', error);
            return ipcResponseError(error.message || 'An unexpected error occurred');
        }
    });
}