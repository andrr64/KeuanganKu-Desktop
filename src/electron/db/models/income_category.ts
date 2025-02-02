import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../sequelize.js';

export interface IncomeCategoryAttributes {
    id?: number;
    name: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

// Model untuk IncomeCategory
class IncomeCategory extends Model<IncomeCategoryAttributes> implements IncomeCategoryAttributes {
    public id?: number;
    public name!: string;
    public description?: string;
    public createdAt!: Date;
    public updatedAt!: Date;
}

IncomeCategory.init(
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
        tableName: 'income_categories',
    }
);

export default IncomeCategory;