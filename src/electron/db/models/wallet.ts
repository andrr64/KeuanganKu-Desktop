import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../sequelize.js';
import { WalletInterface } from '../../interfaces/wallet.js';

// Model untuk Wallet
class WalletModel extends Model<WalletInterface> implements WalletInterface {
    public id!: number;
    public title!: string;
    public createdAt!: Date;
    public updatedAt!: Date;
}

WalletModel.init(
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
        tableName: 'wallets',
    }
);

export default WalletModel;
