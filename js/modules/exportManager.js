export class ExportManager {
    constructor(expenseManager, budgetManager) {
        this.expenseManager = expenseManager;
        this.budgetManager = budgetManager;
    }
    
    // export all data as JSON
    exportData() {
        const data = {
            expenses: this.expenseManager.getAllExpenses(),
            categories: this.expenseManager.getAllCategories(),
            budget: this.budgetManager.getBudget(),
            exportDate: new Date().toISOString()
        };
        
        return JSON.stringify(data, null, 2);
    }
    
    // import data from JSON
    importData(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            
            // Validate data structure
            if (!data.expenses || !Array.isArray(data.expenses) || 
                !data.categories || !Array.isArray(data.categories)) {
                throw new Error('Invalid data format');
            }
            
            this.expenseManager.expenses = data.expenses;
            this.expenseManager.saveExpenses();
            
            this.expenseManager.categories = data.categories;
            this.expenseManager.saveCategories();
            
            if (data.budget) {
                this.budgetManager.budget = data.budget;
                this.budgetManager.saveBudget();
            }
            
            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    }
    
    // export expense report as CSV
    exportReport(dateRange) {
        const { startDate, endDate } = dateRange;
        const expenses = this.expenseManager.getExpensesByDateRange(startDate, endDate);
        
        let csv = 'Date,Description,Category,Amount,Notes\n';
        
        expenses.forEach(expense => {
            const category = this.expenseManager.getCategoryById(expense.category);
            const categoryName = category ? category.name : 'Unknown';
            
            const date = new Date(expense.date).toLocaleDateString();
            const description = `"${expense.description.replace(/"/g, '""')}"`;
            const amount = expense.amount;
            const notes = expense.notes ? `"${expense.notes.replace(/"/g, '""')}"` : '';
            
            csv += `${date},${description},${categoryName},${amount},${notes}\n`;
        });
        
        return csv;
    }
}