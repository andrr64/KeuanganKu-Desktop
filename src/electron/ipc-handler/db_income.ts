import { ipcMain } from "electron";
import Income from '../db/entities/income.js';
import Wallet from '../db/entities/wallet.js';
import IncomeCategory from '../db/entities/income_category.js'; // Import IncomeCategory
import { IncomeFormInterface } from "./interfaces/income_form.js";
import { ipcResponseError, ipcResponseSuccess } from "../db/interfaces/ipc_response.js";
import AppDataSource from "../db/config/ormconfig.js";
import { GetIncomesProp } from "./interfaces/get_income.js";
import { IncomeInterface } from "../db/interfaces/income.js";

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
            const incomes = await Income.find({ where: {
                wallet: {
                    id: wallet.id
                }
            }});

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
}