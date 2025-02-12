import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from 'typeorm';
import { IWallet } from '../interfaces/Wallet.js';

@Entity('wallets')
export class Wallet extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  public name!: string;

  @Column({ type: 'text', nullable: true })
  public description!: string;

  @Column({ type: 'decimal', precision: 32, scale: 2, nullable: false })
  public balance!: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  public createdAt!: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  public updatedAt!: Date;

  public toInterface(): IWallet {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      balance: this.balance,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

export default Wallet;