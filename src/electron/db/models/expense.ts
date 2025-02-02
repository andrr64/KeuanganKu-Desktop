import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../sequelize.js';

export interface ExpenseAttributes {
    id?: number;
    title: string;
    description?: string;
    amount: number;
    category_id: number;
    createdAt: Date;
    updatedAt: Date;
}

// Model untuk Expense
class Expense extends Model<ExpenseAttributes> implements ExpenseAttributes {
    public id?: number;
    public title!: string;
    public description?: string;
    public amount!: number;
    public category_id!: number;
    public createdAt!: Date;
    public updatedAt!: Date;
}

Expense.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        amount: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'expense_categories', // refers to table name
                key: 'id', // refers to column name in expense_categories table
            }
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        tableName: 'expenses',
    }
);

export default Expense;