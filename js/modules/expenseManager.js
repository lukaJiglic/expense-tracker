export class ExpenseManager {
    constructor(storageManager) {
        this.storageManager = storageManager;
        this.expenses = this.storageManager.getExpenses() || [];
        this.categories = this.storageManager.getCategories() || this.getDefaultCategories();
    }
    
    // get default categories
    getDefaultCategories() {
        return [
            { id: 'food', name: 'Food/Dining', icon: 'bi-cup-hot', budget: 0 },
            { id: 'transport', name: 'Transportation', icon: 'bi-car-front', budget: 0 },
            { id: 'housing', name: 'Housing/Utilities', icon: 'bi-house', budget: 0 },
            { id: 'entertainment', name: 'Entertainment', icon: 'bi-tv', budget: 0 },
            { id: 'shopping', name: 'Shopping', icon: 'bi-cart', budget: 0 },
            { id: 'health', name: 'Healthcare', icon: 'bi-heart-pulse', budget: 0 },
            { id: 'education', name: 'Education', icon: 'bi-book', budget: 0 },
            { id: 'other', name: 'Other', icon: 'bi-three-dots', budget: 0 }
        ];
    }
    
    // add new expense
    addExpense(expense) {
        expense.id = this.generateId();
        this.expenses.push(expense);
        this.saveExpenses();
        return expense;
    }
    
    // update expense
    updateExpense(expenseId, updatedExpense) {
        const index = this.expenses.findIndex(expense => expense.id === expenseId);
        if (index !== -1) {
            this.expenses[index] = { ...this.expenses[index], ...updatedExpense };
            this.saveExpenses();
            return true;
        }
        return false;
    }
    
    // delete expense
    deleteExpense(expenseId) {
        const index = this.expenses.findIndex(expense => expense.id === expenseId);
        if (index !== -1) {
            this.expenses.splice(index, 1);
            this.saveExpenses();
            return true;
        }
        return false;
    }
    
    // get all expenses
    getAllExpenses() {
        return [...this.expenses];
    }
    
    // get expenses for date range
    getExpensesByDateRange(startDate, endDate) {
        return this.expenses.filter(expense => {
            const expenseDate = new Date(expense.date);
            return expenseDate >= startDate && expenseDate <= endDate;
        });
    }
    
    // get expenses for month
    getCurrentMonthExpenses() {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        return this.getExpensesByDateRange(startOfMonth, endOfMonth);
    }
    
    // get expenses for category
    getExpensesByCategory(categoryId) {
        return this.expenses.filter(expense => expense.category === categoryId);
    }
    
    // get expenses by category for date range
    getExpensesByCategoryInRange(categoryId, startDate, endDate) {
        return this.getExpensesByDateRange(startDate, endDate)
            .filter(expense => expense.category === categoryId);
    }
    
    // calculate total expenses for array of expenses
    calculateTotal(expenses) {
        return expenses.reduce((total, expense) => total + parseFloat(expense.amount), 0);
    }
    
    // get total expenses for month
    getCurrentMonthTotal() {
        return this.calculateTotal(this.getCurrentMonthExpenses());
    }
    
    // get total expenses for each category in month
    getCategoryTotals(dateRange = null) {
        const categoryTotals = {};
        
        this.categories.forEach(category => {
            categoryTotals[category.id] = 0;
        });
        
        const expenses = dateRange 
            ? this.getExpensesByDateRange(dateRange.startDate, dateRange.endDate) 
            : this.expenses;
        
        expenses.forEach(expense => {
            if (categoryTotals[expense.category] !== undefined) {
                categoryTotals[expense.category] += parseFloat(expense.amount);
            } else {
                categoryTotals[expense.category] = parseFloat(expense.amount);
            }
        });
        
        return categoryTotals;
    }
    
    // get expenses by date for period (daily, weekly, monthly)
    getExpensesByPeriod(periodType, dateRange) {
        const { startDate, endDate } = dateRange;
        const expenses = this.getExpensesByDateRange(startDate, endDate);
        const result = {};
        
        if (periodType === 'daily') {
            expenses.forEach(expense => {
                const dateStr = expense.date;
                if (!result[dateStr]) {
                    result[dateStr] = 0;
                }
                result[dateStr] += parseFloat(expense.amount);
            });
        } else if (periodType === 'weekly') {
            expenses.forEach(expense => {
                const date = new Date(expense.date);
                const weekStart = new Date(date);
                weekStart.setDate(date.getDate() - date.getDay());
                const weekKey = weekStart.toISOString().split('T')[0];
                
                if (!result[weekKey]) {
                    result[weekKey] = 0;
                }
                result[weekKey] += parseFloat(expense.amount);
            });
        } else if (periodType === 'monthly') {
            expenses.forEach(expense => {
                const date = new Date(expense.date);
                const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
                
                if (!result[monthKey]) {
                    result[monthKey] = 0;
                }
                result[monthKey] += parseFloat(expense.amount);
            });
        }
        
        return result;
    }
    
    // get top spending category
    getTopCategory(dateRange = null) {
        const categoryTotals = this.getCategoryTotals(dateRange);
        let topCategory = null;
        let maxAmount = -1;
        
        Object.keys(categoryTotals).forEach(categoryId => {
            if (categoryTotals[categoryId] > maxAmount) {
                maxAmount = categoryTotals[categoryId];
                topCategory = categoryId;
            }
        });
        
        if (topCategory) {
            const category = this.getCategoryById(topCategory);
            return {
                id: topCategory,
                name: category ? category.name : 'Unknown',
                amount: maxAmount
            };
        }
        
        return null;
    }
    
    // add new category
    addCategory(category) {
        if (!category.id) {
            category.id = this.generateId('category');
        }
        
        this.categories.push(category);
        this.saveCategories();
        return category;
    }
    
    // update category
    updateCategory(categoryId, updatedCategory) {
        const index = this.categories.findIndex(category => category.id === categoryId);
        if (index !== -1) {
            this.categories[index] = { ...this.categories[index], ...updatedCategory };
            this.saveCategories();
            return true;
        }
        return false;
    }
    
    // delete category
    deleteCategory(categoryId) {
        const index = this.categories.findIndex(category => category.id === categoryId);
        if (index !== -1) {
            const inUse = this.expenses.some(expense => expense.category === categoryId);
            if (inUse) {
                return false;
            }
            
            this.categories.splice(index, 1);
            this.saveCategories();
            return true;
        }
        return false;
    }
    
    // get all categories
    getAllCategories() {
        return [...this.categories];
    }
    
    // get category by ID
    getCategoryById(categoryId) {
        return this.categories.find(category => category.id === categoryId);
    }
    
    // generate unique ID
    generateId(prefix = 'exp') {
        return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    // save expenses to local storage
    saveExpenses() {
        this.storageManager.saveExpenses(this.expenses);
    }
    
    // save categories to local storage
    saveCategories() {
        this.storageManager.saveCategories(this.categories);
    }
    
    // search expenses
    searchExpenses(query) {
        query = query.toLowerCase();
        return this.expenses.filter(expense => {
            return (
                expense.description.toLowerCase().includes(query) ||
                this.getCategoryById(expense.category)?.name.toLowerCase().includes(query) ||
                expense.amount.toString().includes(query) ||
                expense.notes?.toLowerCase().includes(query)
            );
        });
    }
    
    // sort expenses
    sortExpenses(expenses, sortBy = 'date-desc') {
        const sortedExpenses = [...expenses];
        
        switch (sortBy) {
            case 'date-desc':
                sortedExpenses.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'date-asc':
                sortedExpenses.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case 'amount-desc':
                sortedExpenses.sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount));
                break;
            case 'amount-asc':
                sortedExpenses.sort((a, b) => parseFloat(a.amount) - parseFloat(b.amount));
                break;
            default:
                sortedExpenses.sort((a, b) => new Date(b.date) - new Date(a.date));
        }
        
        return sortedExpenses;
    }
}
