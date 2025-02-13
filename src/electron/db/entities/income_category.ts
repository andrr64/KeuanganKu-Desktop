import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from 'typeorm';
import { IncomeCategoryInterface } from '../interfaces/income_category.js';

@Entity('income_categories')
class IncomeCategory extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  public name!: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  public createdAt!: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  public updatedAt!: Date;

  public static async initData() {
    const count = await IncomeCategory.count();
    if (count < 1) {
      const categories = [
        { name: 'Wallet Init' },
        { name: 'Salary' },
        { name: 'Business' },
        { name: 'Investment' },
        { name: 'Gift' },
        { name: 'Other' }
      ];
      
      for (const category of categories) {
        const incomeCategory = new IncomeCategory();
        incomeCategory.name = category.name;
        await incomeCategory.save();
      }
    }
  }

  public toInterface(): IncomeCategoryInterface{
    return {
      id: this.id,
      name: this.name,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

export default IncomeCategory;
