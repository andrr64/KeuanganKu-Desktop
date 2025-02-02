import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../sequelize.js';

export interface ExpenseCategoryAttributes {
    id?: number;
    name: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

// Model for ExpenseCategory
class ExpenseCategory extends Model<ExpenseCategoryAttributes> implements ExpenseCategoryAttributes {
    public id?: number;
    public name!: string;
    public description?: string;
    public createdAt!: Date;
    public updatedAt!: Date;
}

ExpenseCategory.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
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
        tableName: 'expense_categories',
    }
);

export default ExpenseCategory;