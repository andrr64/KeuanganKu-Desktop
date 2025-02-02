import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../sequelize.js';

export interface IncomeAttributes {
    id?: number;
  title: string;
    description?: string;
    amount: number;
    category_id: number;
    createdAt: Date;
    updatedAt: Date;
}

// Model untuk Income
class Income extends Model<IncomeAttributes> implements IncomeAttributes {
    public id?: number;
    public title!: string;
    public description?: string;
    public amount!: number;
    public category_id!: number;
    public createdAt!: Date;
    public updatedAt!: Date;
}

Income.init(
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
                model: 'income_categories', // refers to table name
                key: 'id', // refers to column name in income_categories table
            },
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
        tableName: 'incomes',
    }
);

export default Income;
