export class BudgetManager {
    constructor(storageManager) {
        this.storageManager = storageManager;
        this.budget = this.storageManager.getBudget() || { amount: 0, categoryBudgets: {} };
    }
    
    // get total budget
    getBudget() {
        return this.budget;
    }
    
    // set total budget
    setTotalBudget(amount) {
        this.budget.amount = parseFloat(amount);
        this.saveBudget();
        return this.budget;
    }
    
    // get category budget
    getCategoryBudget(categoryId) {
        return this.budget.categoryBudgets[categoryId] || 0;
    }
    
    // set category budget
    setCategoryBudget(categoryId, amount) {
        this.budget.categoryBudgets[categoryId] = parseFloat(amount);
        this.saveBudget();
        return this.budget;
    }
    
    // delete category budget
    deleteCategoryBudget(categoryId) {
        if (this.budget.categoryBudgets[categoryId] !== undefined) {
            delete this.budget.categoryBudgets[categoryId];
            this.saveBudget();
            return true;
        }
        return false;
    }
    
    // get all category budgets
    getAllCategoryBudgets() {
        return { ...this.budget.categoryBudgets };
    }
    
    // save budget to storage
    saveBudget() {
        this.storageManager.saveBudget(this.budget);
    }
}