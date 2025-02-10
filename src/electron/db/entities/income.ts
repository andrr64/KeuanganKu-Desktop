import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn } from 'typeorm';
import IncomeCategory from './income_category.js';
import Wallet from './wallet.js';
import { IIncome } from '../interfaces/Income.js';

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

  @ManyToOne(() => IncomeCategory)
  @JoinColumn({ name: 'categoryId' })
  public categoryId!: number;

  @ManyToOne(() => Wallet)
  @JoinColumn({ name: 'walletId' })
  public walletId!: number;

  @Column({ type: 'text', nullable: true })
  public description!: string;

  public toInterface(): IIncome {
    return {
      id: this.id,
      title: this.title,
      amount: this.amount,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      categoryId: this.categoryId,
      walletId: this.walletId,
      description: this.description,
    };
  }
}

export default Income;