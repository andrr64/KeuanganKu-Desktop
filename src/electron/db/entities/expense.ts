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

  public toInterface(): IExpense {
    return {
      id: this.id,
      amount: this.amount,
      categoryId: this.category?.id ?? null, // Ambil ID dari relasi
      walletId: this.wallet?.id ?? null, 
      title: this.title,
      description: this.description,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
  
}

export default Expense;
