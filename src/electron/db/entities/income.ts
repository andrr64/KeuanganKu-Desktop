import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn } from 'typeorm';
import IncomeCategory from './income_category.js';
import Wallet from './wallet.js';
import { IncomeInterface } from '../interfaces/income.js';

@Entity('incomes')
class Income extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: 'text', nullable: false })
  public title!: string;

  @Column({ type: 'decimal', precision: 24, scale: 2, nullable: false })
  public amount!: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  public createdAt!: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  public updatedAt!: Date;

  @ManyToOne(() => IncomeCategory, { eager: true })
  @JoinColumn({ name: 'categoryId' })
  public category!: IncomeCategory;
  
  @ManyToOne(() => Wallet, { eager: true }) 
  @JoinColumn({ name: 'walletId' })
  public wallet!: Wallet;

  @Column({ type: 'text', nullable: true })
  public description!: string;

  public toInterface(): IncomeInterface {
    return {
      id: this.id,
      title: this.title,
      amount: this.amount,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      wallet: this.wallet.toInterface(),
      category: this.category.toInterface(),
      description: this.description,
      type: 1
    };
  }
}

export default Income;