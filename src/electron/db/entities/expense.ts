import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, BaseEntity } from 'typeorm';
import { ExpenseCategory } from './expense_category.js';
import Wallet from './wallet.js';
import { IExpense } from '../interfaces/Expense.js';

@Entity('expenses')
class Expense extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number;
  
  @Column({ type: 'decimal', precision: 24, scale: 2, nullable: false })
  public amount!: number;

  @Column({ type: 'date', nullable: false })
  public date!: Date;

  @ManyToOne(() => ExpenseCategory)
  @JoinColumn({ name: 'categoryId' })
  public categoryId!: number;

  @ManyToOne(() => Wallet)
  @JoinColumn({ name: 'walletId' })
  public walletId!: number;

  @Column({ type: 'text', nullable: false })
  public title!: string;

  @Column({ type: 'text', nullable: true })
  public description!: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  public createdAt!: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  public updatedAt!: Date;

  public toInterface(): IExpense {
    return {
      id: this.id,
      amount: this.amount,
      date: this.date,
      categoryId: this.categoryId,
      walletId: this.walletId,
      title: this.title,
      description: this.description,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

export default Expense;
