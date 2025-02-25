export class StorageManager {
    constructor() {
        this.EXPENSES_KEY = 'expense_tracker_expenses';
        this.CATEGORIES_KEY = 'expense_tracker_categories';
        this.BUDGET_KEY = 'expense_tracker_budget';
        this.SETTINGS_KEY = 'expense_tracker_settings';
    }
    
    // get expenses from localStorage
    getExpenses() {
        const expenses = localStorage.getItem(this.EXPENSES_KEY);
        return expenses ? JSON.parse(expenses) : [];
    }
    
    // save expenses to localStorage
    saveExpenses(expenses) {
        localStorage.setItem(this.EXPENSES_KEY, JSON.stringify(expenses));
    }
    
    // get categories from localStorage
    getCategories() {
        const categories = localStorage.getItem(this.CATEGORIES_KEY);
        return categories ? JSON.parse(categories) : null;
    }
    
    // save categories to localStorage
    saveCategories(categories) {
        localStorage.setItem(this.CATEGORIES_KEY, JSON.stringify(categories));
    }
    
    // get budget from localStorage
    getBudget() {
        const budget = localStorage.getItem(this.BUDGET_KEY);
        return budget ? JSON.parse(budget) : { amount: 0, categoryBudgets: {} };
    }
    
    // save budget to localStorage
    saveBudget(budget) {
        localStorage.setItem(this.BUDGET_KEY, JSON.stringify(budget));
    }
    
    // get app settings from localStorage
    getSettings() {
        const settings = localStorage.getItem(this.SETTINGS_KEY);
        return settings ? JSON.parse(settings) : { darkMode: false, currency: 'EUR' };
    }
    
    // save app settings to localStorage
    saveSettings(settings) {
        localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
    }
    
    // export all data to a JSON string
    exportData() {
        const data = {
            expenses: this.getExpenses(),
            categories: this.getCategories(),
            budget: this.getBudget(),
            settings: this.getSettings(),
            exportDate: new Date().toISOString()
        };
        
        return JSON.stringify(data, null, 2);
    }
    
    // Import data from a JSON string
    importData(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            
            if (data.expenses) {
                this.saveExpenses(data.expenses);
            }
            
            if (data.categories) {
                this.saveCategories(data.categories);
            }
            
            if (data.budget) {
                this.saveBudget(data.budget);
            }
            
            if (data.settings) {
                this.saveSettings(data.settings);
            }
            
            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    }
    
    // clear all
    clearAllData() {
        localStorage.removeItem(this.EXPENSES_KEY);
        localStorage.removeItem(this.CATEGORIES_KEY);
        localStorage.removeItem(this.BUDGET_KEY);
        localStorage.removeItem(this.SETTINGS_KEY);
    }
}