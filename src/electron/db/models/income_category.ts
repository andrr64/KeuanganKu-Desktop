import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../sequelize.js';
import { IncomeCategoryInterface } from '../interfaces/income_category.js';

class IncomeCategoryModel extends Model<IncomeCategoryInterface> implements IncomeCategoryInterface {
    public id?: number;
    public name!: string;
    public description?: string;
    public createdAt!: Date;
    public updatedAt!: Date;
}

IncomeCategoryModel.init(
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

export default IncomeCategoryModel;