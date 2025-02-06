import { DataSource } from 'typeorm';
import Wallet from '../entities/wallet.js';
import Income from '../entities/income.js';
import IncomeCategory from '../entities/income_category.js';
import Expense from '../entities/expense.js';
import { ExpenseCategory } from '../entities/expense_category.js';

const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'database.sqlite',
  synchronize: true,
  logging: false,
  entities: [Wallet, Income, IncomeCategory, Expense, ExpenseCategory],
  migrations: [],
  subscribers: [],
});

export default AppDataSource;
