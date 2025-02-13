import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, BaseEntity } from 'typeorm';
import { ExpenseCategory } from './expense_category.js';
import Wallet from './wallet.js';
import { ExpenseInterface } from '../interfaces/expense.js';

@Entity('expenses')
class Expense extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number;
  
  @Column({ type: 'decimal', precision: 24, scale: 2, nullable: false })
  public amount!: number;

  @ManyToOne(() => ExpenseCategory, { eager: true }) // Tambahkan eager agar otomatis di-load
  @JoinColumn({ name: 'categoryId' })
  public category!: ExpenseCategory;
  
  @ManyToOne(() => Wallet, { eager: true }) 
  @JoinColumn({ name: 'walletId' })
  public wallet!: Wallet;

  @Column({ type: 'text', nullable: false })
  public title!: string;

  @Column({ type: 'text', nullable: true })
  public description!: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  public createdAt!: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  public updatedAt!: Date;

  public toInterface(): ExpenseInterface {
    return {
      id: this.id,
      amount: this.amount,
      category: this.category.toInterface(),
      wallet: this.wallet.toInterface(),
      title: this.title,
      description: this.description,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      type: 0
    };
  }
  
}

export default Expense;
