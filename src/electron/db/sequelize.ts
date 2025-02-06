import { Sequelize } from 'sequelize';

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './keuanganku.db',
});

const initializeDatabase = async () => {
    try {
        await sequelize.sync({ force: false });
        console.log('Berhasil menyinkronkan database');
    } catch (error) {
        console.error('Gagal menyinkronkan database:', error);
    }
};


export { sequelize, initializeDatabase};
