import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../sequelize.js';
import { ExpenseCategoryInterface } from '../interfaces/expense_category.js';

// Model for ExpenseCategory
class ExpenseCategoryModel extends Model<ExpenseCategoryInterface> implements ExpenseCategoryInterface {
    public id?: number;
    public name!: string;
    public description?: string;
    public createdAt!: Date;
    public updatedAt!: Date;
}

ExpenseCategoryModel.init(
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

export default ExpenseCategoryModel;