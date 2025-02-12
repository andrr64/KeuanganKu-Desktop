import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from 'typeorm';
import { IExpenseCategory } from '../interfaces/ExpenseCategory.js';

@Entity('expense_categories')
export class ExpenseCategory extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column()
  public name!: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  public createdAt!: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  public updatedAt!: Date;

  public toInterface(): IExpenseCategory {
    return {
      id: this.id,
      name: this.name,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  public static async initData() {
    const count = await ExpenseCategory.count();
    if (count < 1) {
      const categories = [
        { name: 'Food' },
        { name: 'Transportation' },
        { name: 'Utilities' },
        { name: 'Entertainment' },
        { name: 'Healthcare' }
      ];

      for (const category of categories) {
        const expenseCategory = new ExpenseCategory();
        expenseCategory.name = category.name;
        await expenseCategory.save();
      }
    }
  }
}
