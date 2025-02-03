import { IncomeCategory } from "../../models/income_category";

export const db_getIncomeCategories = async (): Promise<IncomeCategory[]> => {
    //@ts-ignore
    const categories = await window.database_income_categories.getIncomeCategories();
    const incomeCategories = categories.map((category: any) => {
        return new IncomeCategory(category.id, category.name, category.description, category.createdAt, category.updatedAt);
    });
    return incomeCategories;
}