import { ExpenseManager } from './modules/expenseManager.js';
import { UIManager } from './modules/uiManager.js';
import { ChartManager } from './modules/chartManager.js';
import { StorageManager } from './modules/storageManager.js';
import { BudgetManager } from './modules/budgetManager.js';
import { ExportManager } from './modules/exportManager.js';


//start app and initialize all managers
document.addEventListener('DOMContentLoaded', () => {
    const storageManager = new StorageManager();
    
    const expenseManager = new ExpenseManager(storageManager);
    const budgetManager = new BudgetManager(storageManager);
    const chartManager = new ChartManager();
    const exportManager = new ExportManager(expenseManager, budgetManager);
    
    const uiManager = new UIManager(
        expenseManager,
        budgetManager,
        chartManager,
        exportManager
    );
    
    // setup event listener and load intial data
    uiManager.setupEventListeners();
    uiManager.loadInitialData();
});