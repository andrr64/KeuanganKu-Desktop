import { ipcMain } from "electron";
import Income from '../db/entities/income.js';
import Wallet from '../db/entities/wallet.js';
import { IncomeFormInterface } from "./interfaces/income_form.js";
import { ipcResponseError, ipcResponseSuccess } from "../db/interfaces/ipc_response.js";
import AppDataSource from "../db/config/ormconfig.js";

export function registerDBIncomeIPCHandler() {
    ipcMain.handle('add-income', async (_, data: IncomeFormInterface) => {
        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.startTransaction();
        try {
            const wallet = await queryRunner.manager.findOneBy(Wallet, { id: data.wallet_id });
            if (!wallet) {
                throw new Error('Wallet not found');
            }

            wallet.balance += data.amount;
            await queryRunner.manager.save(wallet);

            const income = new Income();
            income.amount = data.amount;
            income.categoryId = data.category_id;
            income.walletId = data.wallet_id;
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
}
