export class UIManager {
    constructor(expenseManager, budgetManager, chartManager, exportManager) {
        this.expenseManager = expenseManager;
        this.budgetManager = budgetManager;
        this.chartManager = chartManager;
        this.exportManager = exportManager;
        
        // UI Element references
        this.tabs = {
            dashboard: document.getElementById('dashboard-tab'),
            expenses: document.getElementById('expenses-tab'),
            categories: document.getElementById('categories-tab'),
            budgets: document.getElementById('budgets-tab'),
            reports: document.getElementById('reports-tab')
        };
        
        this.views = {
            dashboard: document.getElementById('dashboard-view'),
            expenses: document.getElementById('expenses-view'),
            categories: document.getElementById('categories-view'),
            budgets: document.getElementById('budgets-view'),
            reports: document.getElementById('reports-view')
        };
        
        this.modals = {
            addExpense: new bootstrap.Modal(document.getElementById('add-expense-modal')),
            addCategory: new bootstrap.Modal(document.getElementById('add-category-modal')),
            setBudget: new bootstrap.Modal(document.getElementById('set-budget-modal'))
        };
        
        this.currentView = 'dashboard';
        
        this.currentPeriod = 'month';
        this.customDateRange = null;
    }
    
    // setup event listeners
    setupEventListeners() {
        // tab navigation
        Object.keys(this.tabs).forEach(tabKey => {
            this.tabs[tabKey].addEventListener('click', (e) => {
                e.preventDefault();
                this.switchView(tabKey);
            });
        });
        
        //add expense button click event
        document.getElementById('add-expense-btn').addEventListener('click', () => {
            this.prepareAddExpenseModal();
            this.modals.addExpense.show();
        });
        
        // add expense button in expenses view
        document.getElementById('add-expense-btn-2').addEventListener('click', () => {
            this.prepareAddExpenseModal();
            this.modals.addExpense.show();
        });
        
        // save expense button
        document.getElementById('save-expense-btn').addEventListener('click', () => {
            this.saveExpense();
        });
        
        //add category button
        document.getElementById('add-category-btn').addEventListener('click', () => {
            this.prepareAddCategoryModal();
            this.modals.addCategory.show();
        });
        
        // save category button
        document.getElementById('save-category-btn').addEventListener('click', () => {
            this.saveCategory();
        });
        
        // set budget button
        document.getElementById('set-budget-btn').addEventListener('click', () => {
            this.prepareSetBudgetModal();
            this.modals.setBudget.show();
        });
        
        // save budget button
        document.getElementById('save-budget-btn').addEventListener('click', () => {
            this.saveBudget();
        });
        
        // view all expenses link
        document.getElementById('view-all-expenses').addEventListener('click', (e) => {
            e.preventDefault();
            this.switchView('expenses');
        });
        
        // search expenses
        document.getElementById('search-btn').addEventListener('click', () => {
            const searchQuery = document.getElementById('search-expenses').value;
            this.searchExpenses(searchQuery);
        });
        
        document.getElementById('search-expenses').addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                const searchQuery = e.target.value;
                this.searchExpenses(searchQuery);
            }
        });
        
        // sort expenses
        document.getElementById('sort-expenses').addEventListener('change', (e) => {
            const sortBy = e.target.value;
            this.sortExpenses(sortBy);
        });
        
        // category filter
        document.getElementById('category-filter').addEventListener('change', (e) => {
            const categoryId = e.target.value;
            this.filterExpensesByCategory(categoryId);
        });
        
        // time period filter dash
        document.querySelector('#time-period-dropdown').addEventListener('click', (e) => {
            if (e.target.tagName === 'A' && e.target.dataset.period) {
                e.preventDefault();
                this.changePeriod(e.target.dataset.period);
            }
        });
        
        // time period filter report
        document.querySelector('#report-period-dropdown').addEventListener('click', (e) => {
            if (e.target.tagName === 'A' && e.target.dataset.period) {
                e.preventDefault();
                this.changePeriod(e.target.dataset.period, 'reports');
            }
        });
        
        // export data JSON
        document.getElementById('export-data').addEventListener('click', (e) => {
            e.preventDefault();
            this.exportData();
        });
        
        // export report CSV
        document.getElementById('export-report-btn').addEventListener('click', () => {
            this.exportReport();
        });
        
        // import data JSON
        document.getElementById('import-data').addEventListener('click', (e) => {
            e.preventDefault();
            this.importData();
        });
        
        // dark mode toggle
        document.getElementById('dark-mode-toggle').addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleDarkMode();
        });
    }
    
    //switch views
    switchView(viewName) {
        //remove active from all tabs
        Object.values(this.tabs).forEach(tab => {
            tab.classList.remove('active');
        });
        
        //hide all views
        Object.values(this.views).forEach(view => {
            view.classList.remove('active-view');
        });
        
        //add active class to selected tab
        this.tabs[viewName].classList.add('active');
        
        // show selected view
        this.views[viewName].classList.add('active-view');
        
        // update current view
        this.currentView = viewName;
        
        // update the view content
        this.updateCurrentViewContent();
    }
    
    //update the content of the current view
    updateCurrentViewContent() {
        switch (this.currentView) {
            case 'dashboard':
                this.updateDashboard();
                break;
            case 'expenses':
                this.updateExpensesView();
                break;
            case 'categories':
                this.updateCategoriesView();
                break;
            case 'budgets':
                this.updateBudgetsView();
                break;
            case 'reports':
                this.updateReportsView();
                break;
        }
    }
    
    // load initial data
    loadInitialData() {
        // update dashboard as default view
        this.updateDashboard();
        
        // set default date in add expense modal to today
        const today = new Date().toISOString().substr(0, 10);
        document.getElementById('expense-date').value = today;
    }
    
    // update dashboard view
    updateDashboard() {
        // get data for period
        const dateRange = this.getDateRangeForPeriod(this.currentPeriod);
        const expenses = this.expenseManager.getExpensesByDateRange(dateRange.startDate, dateRange.endDate);
        const totalExpenses = this.expenseManager.calculateTotal(expenses);
        
        // update period text
        document.getElementById('expense-period').textContent = this.getPeriodText(this.currentPeriod);
        
        // update total expenses
        document.getElementById('total-expenses').textContent = this.formatCurrency(totalExpenses);
        
        //update budget info
        const budget = this.budgetManager.getBudget();
        document.getElementById('budget-amount').textContent = this.formatCurrency(budget.amount);
        const remaining = Math.max(0, budget.amount - totalExpenses);
        document.getElementById('budget-remaining').textContent = `${this.formatCurrency(remaining)} remaining`;
        
        // update top category
        const topCategory = this.expenseManager.getTopCategory({ startDate: dateRange.startDate, endDate: dateRange.endDate });
        if (topCategory && topCategory.amount > 0) {
            document.getElementById('top-category').textContent = topCategory.name;
            document.getElementById('top-category-amount').textContent = this.formatCurrency(topCategory.amount);
        } else {
            document.getElementById('top-category').textContent = 'None';
            document.getElementById('top-category-amount').textContent = '€0.00';
        }
        
        // update charts
        this.updateDashboardCharts(dateRange);
        
        // update recent expenses table
        this.updateRecentExpensesTable(expenses);
    }
    
    // update expenses view
    updateExpensesView() {
        const expenses = this.expenseManager.sortExpenses(this.expenseManager.getAllExpenses(), 'date-desc');
        
        this.populateExpensesTable(expenses, 'all-expenses-table');
        
        this.updateCategoryFilterOptions();
    }
    
    // update categories view
    updateCategoriesView() {
        const categories = this.expenseManager.getAllCategories();
        const tableBody = document.getElementById('categories-table');
        tableBody.innerHTML = '';
        
        if (categories.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center">No categories found. Please add some!</td>
                </tr>
            `;
            return;
        }
        
        // get category expenses
        const categoryTotals = this.expenseManager.getCategoryTotals();
        
        categories.forEach(category => {
            const total = categoryTotals[category.id] || 0;
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td><i class="bi ${category.icon}"></i></td>
                <td>${category.name}</td>
                <td>${this.formatCurrency(total)}</td>
                <td>${this.formatCurrency(category.budget || 0)}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary edit-category" data-id="${category.id}">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger delete-category" data-id="${category.id}">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
        
        // add event listeners for edit and delete buttons
        document.querySelectorAll('.edit-category').forEach(button => {
            button.addEventListener('click', () => {
                const categoryId = button.dataset.id;
                this.editCategory(categoryId);
            });
        });
        
        document.querySelectorAll('.delete-category').forEach(button => {
            button.addEventListener('click', () => {
                const categoryId = button.dataset.id;
                this.deleteCategory(categoryId);
            });
        });
    }
    
    // update budgets view
    updateBudgetsView() {
        const budget = this.budgetManager.getBudget();
        const expenses = this.expenseManager.getCurrentMonthExpenses();
        const totalExpenses = this.expenseManager.calculateTotal(expenses);
        
        //update budget amounts
        document.getElementById('total-budget').textContent = this.formatCurrency(budget.amount);
        document.getElementById('budget-used').textContent = this.formatCurrency(totalExpenses);
        document.getElementById('budget-left').textContent = this.formatCurrency(Math.max(0, budget.amount - totalExpenses));
        
        // update category budgets
        this.updateCategoryBudgets(budget, expenses);
    }
    
    // update reports view
    updateReportsView() {
        const dateRange = this.getDateRangeForPeriod(this.currentPeriod);
        
        // update monthly expense chart
        this.updateMonthlyExpenseChart(dateRange);
        
        // Update category distribution chart
        this.updateCategoryDistributionChart(dateRange);
        
        // Update category trend chart
        this.updateCategoryTrendChart(dateRange);
    }
    
    // prepare Add Expense Modal
    prepareAddExpenseModal(expenseToEdit = null) {
        // reset form
        document.getElementById('add-expense-form').reset();
        
        //set modal title
        document.getElementById('add-expense-modal-label').textContent = expenseToEdit ? 'Edit Expense' : 'Add New Expense';
        
        // set today's date as default if not editing
        if (!expenseToEdit) {
            const today = new Date().toISOString().substr(0, 10);
            document.getElementById('expense-date').value = today;
        }
        
        // populate categories dropdown
        const categoriesDropdown = document.getElementById('expense-category');
        categoriesDropdown.innerHTML = '';
        
        const categories = this.expenseManager.getAllCategories();
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            categoriesDropdown.appendChild(option);
        });
        
        // ff editing, fill form with expense data
        if (expenseToEdit) {
            document.getElementById('expense-amount').value = expenseToEdit.amount;
            document.getElementById('expense-description').value = expenseToEdit.description;
            document.getElementById('expense-category').value = expenseToEdit.category;
            document.getElementById('expense-date').value = expenseToEdit.date;
            document.getElementById('expense-notes').value = expenseToEdit.notes || '';
            
            // store expense ID for updating
            document.getElementById('save-expense-btn').dataset.expenseId = expenseToEdit.id;
        } else {
            // clear expense ID for new expense
            document.getElementById('save-expense-btn').removeAttribute('data-expense-id');
        }
    }
    
    // save expense from modal
    saveExpense() {
        const form = document.getElementById('add-expense-form');
        
        // check form validity
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        
        const amount = parseFloat(document.getElementById('expense-amount').value);
        const description = document.getElementById('expense-description').value;
        const category = document.getElementById('expense-category').value;
        const date = document.getElementById('expense-date').value;
        const notes = document.getElementById('expense-notes').value;
        
        const expense = {
            amount,
            description,
            category,
            date,
            notes
        };
        
        // check if we're updating or adding a new expense
        const expenseId = document.getElementById('save-expense-btn').dataset.expenseId;
        
        if (expenseId) {
            this.expenseManager.updateExpense(expenseId, expense);
        } else {
            this.expenseManager.addExpense(expense);
        }
        
        this.modals.addExpense.hide();
        
        this.updateCurrentViewContent();
    }
    
    // prepare Add Category Modal
    prepareAddCategoryModal(categoryToEdit = null) {
        // reset form
        document.getElementById('add-category-form').reset();
        
        // set modal title
        document.getElementById('add-category-modal-label').textContent = categoryToEdit ? 'Edit Category' : 'Add New Category';
        
        // reset icon selection
        const iconOptions = document.querySelectorAll('.icon-option');
        iconOptions.forEach(option => {
            option.classList.remove('selected');
        });
        document.querySelector('.icon-option').classList.add('selected');
        document.getElementById('category-icon').value = 'bi-cart';
        
        // if editing, fill form with category data
        if (categoryToEdit) {
            document.getElementById('category-name').value = categoryToEdit.name;
            document.getElementById('category-budget').value = categoryToEdit.budget || '';
            document.getElementById('category-icon').value = categoryToEdit.icon;
            
            //select the correct icon
            iconOptions.forEach(option => {
                const icon = option.querySelector('i');
                if (icon.className.includes(categoryToEdit.icon)) {
                    option.classList.add('selected');
                } else {
                    option.classList.remove('selected');
                }
            });
            
            //store category ID for updating
            document.getElementById('save-category-btn').dataset.categoryId = categoryToEdit.id;
        } else {
            //clear category ID for new category
            document.getElementById('save-category-btn').removeAttribute('data-category-id');
        }
        
        // add event listeners for icon selection
        iconOptions.forEach(option => {
            option.addEventListener('click', () => {
                // remove selected class from all options
                iconOptions.forEach(opt => {
                    opt.classList.remove('selected');
                });
                
                // add selected class to clicked option
                option.classList.add('selected');
                
                // update hidden input
                const iconClass = option.querySelector('i').className.split(' ')[1];
                document.getElementById('category-icon').value = iconClass;
            });
        });
    }
    
    // save category from modal
    saveCategory() {
        const form = document.getElementById('add-category-form');
        
        //check form validity
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        
        // get form values
        const name = document.getElementById('category-name').value;
        const icon = document.getElementById('category-icon').value;
        const budget = parseFloat(document.getElementById('category-budget').value) || 0;
        
        const category = {
            name,
            icon,
            budget
        };
        
        // check if we're updating or adding a new category
        const categoryId = document.getElementById('save-category-btn').dataset.categoryId;
        
        if (categoryId) {
            category.id = categoryId;
            this.expenseManager.updateCategory(categoryId, category);
            
            this.budgetManager.setCategoryBudget(categoryId, budget);
        } else {
            const newCategory = this.expenseManager.addCategory(category);
            
            if (budget > 0) {
                this.budgetManager.setCategoryBudget(newCategory.id, budget);
            }
        }
        
        this.modals.addCategory.hide();
        
        this.updateCurrentViewContent();
        
        this.updateCategoryDropdowns();
    }
    
    // prepare Set Budget Modal
    prepareSetBudgetModal() {
        // reset form
        document.getElementById('set-budget-form').reset();
        
        // set current budget amount
        const budget = this.budgetManager.getBudget();
        document.getElementById('budget-amount-input').value = budget.amount;
    }
    
    // save budget from modal
    saveBudget() {
        const form = document.getElementById('set-budget-form');
        
        // check form validity
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }
        
        // get form values
        const amount = parseFloat(document.getElementById('budget-amount-input').value);
        
        // set budget
        this.budgetManager.setTotalBudget(amount);
        
        // close modal
        this.modals.setBudget.hide();
        
        //update UI
        this.updateCurrentViewContent();
    }
    
    updateDashboardCharts(dateRange) {
        this.updateExpenseTrendChart(dateRange);
        
        this.updateExpenseCategoryChart(dateRange);
    }
    
    updateExpenseTrendChart(dateRange) {
        const { startDate, endDate } = dateRange;
        const periodType = this.getPeriodTypeForChart(this.currentPeriod);
        
        const expensesByPeriod = this.expenseManager.getExpensesByPeriod(periodType, { startDate, endDate });
        
        // prepare data
        const labels = Object.keys(expensesByPeriod).sort();
        const data = labels.map(label => expensesByPeriod[label]);
        
        // format labels
        const formattedLabels = labels.map(label => {
            if (periodType === 'daily') {
                return new Date(label).toLocaleDateString();
            } else if (periodType === 'weekly') {
                const date = new Date(label);
                const endDate = new Date(date);
                endDate.setDate(date.getDate() + 6);
                return `${date.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
            } else if (periodType === 'monthly') {
                const [year, month] = label.split('-');
                return new Date(parseInt(year), parseInt(month) - 1, 1).toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
            }
            return label;
        });
        
        // update chart
        this.chartManager.createOrUpdateLineChart(
            'expense-trend-chart',
            formattedLabels,
            [{
                label: 'Expenses',
                data: data,
                borderColor: '#007bff',
                backgroundColor: 'rgba(0, 123, 255, 0.1)',
                tension: 0.1
            }],
            {
                title: 'Expense Trends',
                yAxisLabel: 'Amount (€)'
            }
        );
    }
    
    updateExpenseCategoryChart(dateRange) {
        const { startDate, endDate } = dateRange;
        const expenses = this.expenseManager.getExpensesByDateRange(startDate, endDate);
        
        // group expenses by category
        const categories = this.expenseManager.getAllCategories();
        const categoryTotals = {};
        
        categories.forEach(category => {
            categoryTotals[category.id] = 0;
        });
        
        expenses.forEach(expense => {
            if (categoryTotals[expense.category] !== undefined) {
                categoryTotals[expense.category] += parseFloat(expense.amount);
            }
        });
        
        // filter out categories with zero expenses
        const filteredCategories = categories.filter(category => categoryTotals[category.id] > 0);
        
        // frepare data
        const labels = filteredCategories.map(category => category.name);
        const data = filteredCategories.map(category => categoryTotals[category.id]);
        const backgroundColors = this.generateCategoryColors(filteredCategories.length);
        
        // update chart
        this.chartManager.createOrUpdatePieChart(
            'expense-category-chart',
            labels,
            data,
            backgroundColors,
            {
                title: 'Expenses by Category'
            }
        );
    }
    
    updateMonthlyExpenseChart(dateRange) {
        const { startDate, endDate } = dateRange;
        
        const monthlyExpenses = this.expenseManager.getExpensesByPeriod('monthly', { startDate, endDate });
        
        const labels = Object.keys(monthlyExpenses).sort();
        const data = labels.map(label => monthlyExpenses[label]);
        
        const formattedLabels = labels.map(label => {
            const [year, month] = label.split('-');
            return new Date(parseInt(year), parseInt(month) - 1, 1).toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
        });
        
        this.chartManager.createOrUpdateBarChart(
            'monthly-expense-chart',
            formattedLabels,
            [{
                label: 'Total Expenses',
                data: data,
                backgroundColor: '#007bff'
            }],
            {
                title: 'Monthly Expenses',
                yAxisLabel: 'Amount (€)'
            }
        );
    }
    
    updateCategoryDistributionChart(dateRange) {
        const { startDate, endDate } = dateRange;
        const expenses = this.expenseManager.getExpensesByDateRange(startDate, endDate);
        
        // group expenses by category
        const categories = this.expenseManager.getAllCategories();
        const categoryTotals = {};
        
        categories.forEach(category => {
            categoryTotals[category.id] = 0;
        });
        
        expenses.forEach(expense => {
            if (categoryTotals[expense.category] !== undefined) {
                categoryTotals[expense.category] += parseFloat(expense.amount);
            }
        });
        
        // filter out categories with zero expenses
        const filteredCategories = categories.filter(category => categoryTotals[category.id] > 0);
        
        // prepare data
        const labels = filteredCategories.map(category => category.name);
        const data = filteredCategories.map(category => categoryTotals[category.id]);
        const backgroundColors = this.generateCategoryColors(filteredCategories.length);
        
        // update chart
        this.chartManager.createOrUpdatePieChart(
            'category-distribution-chart',
            labels,
            data,
            backgroundColors,
            {
                title: 'Category Distribution'
            }
        );
    }
    
    updateCategoryTrendChart(dateRange) {
        const { startDate, endDate } = dateRange;
        const periodType = this.getPeriodTypeForChart(this.currentPeriod);
        
        // get top 5 categories by total expense
        const categoryTotals = this.expenseManager.getCategoryTotals({ startDate, endDate });
        const categories = this.expenseManager.getAllCategories();
        
        const topCategories = categories
            .map(category => ({
                id: category.id,
                name: category.name,
                total: categoryTotals[category.id] || 0
            }))
            .sort((a, b) => b.total - a.total)
            .slice(0, 5)
            .filter(category => category.total > 0);
        
        if (topCategories.length === 0) {
            // if no categories with expenses, clear chart
            document.getElementById('category-trend-chart').getContext('2d').clearRect(0, 0, 
                document.getElementById('category-trend-chart').width, 
                document.getElementById('category-trend-chart').height);
            return;
        }
        
        // get expenses by period
        const periodLabels = [];
        const periodData = {};
        
        topCategories.forEach(category => {
            periodData[category.id] = {};
        });
        
        // group expenses by period and category
        const expenses = this.expenseManager.getExpensesByDateRange(startDate, endDate);
        
        expenses.forEach(expense => {
            if (topCategories.some(cat => cat.id === expense.category)) {
                let periodKey;
                const date = new Date(expense.date);
                
                if (periodType === 'daily') {
                    periodKey = expense.date;
                } else if (periodType === 'weekly') {
                    const weekStart = new Date(date);
                    weekStart.setDate(date.getDate() - date.getDay());
                    periodKey = weekStart.toISOString().split('T')[0];
                } else if (periodType === 'monthly') {
                    periodKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
                }
                
                if (!periodLabels.includes(periodKey)) {
                    periodLabels.push(periodKey);
                }
                
                if (!periodData[expense.category][periodKey]) {
                    periodData[expense.category][periodKey] = 0;
                }
                
                periodData[expense.category][periodKey] += parseFloat(expense.amount);
            }
        });
        
        // sort period labels
        periodLabels.sort();
        
        // format labels based on period type
        const formattedLabels = periodLabels.map(label => {
            if (periodType === 'daily') {
                return new Date(label).toLocaleDateString();
            } else if (periodType === 'weekly') {
                const date = new Date(label);
                const endDate = new Date(date);
                endDate.setDate(date.getDate() + 6);
                return `${date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`;
            } else if (periodType === 'monthly') {
                const [year, month] = label.split('-');
                return new Date(parseInt(year), parseInt(month) - 1, 1).toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
            }
            return label;
        });
        
        // prepare datasets
        const datasets = topCategories.map((category, index) => {
            const colors = [
                '#007bff', '#28a745', '#ffc107', '#dc3545', '#17a2b8'
            ];
            
            const data = periodLabels.map(label => periodData[category.id][label] || 0);
            
            return {
                label: category.name,
                data: data,
                borderColor: colors[index],
                backgroundColor: `${colors[index]}33`,
                tension: 0.1
            };
        });
        
        // update chart
        this.chartManager.createOrUpdateLineChart(
            'category-trend-chart',
            formattedLabels,
            datasets,
            {
                title: 'Expense Trends by Category',
                yAxisLabel: 'Amount (€)'
            }
        );
    }
    
    updateRecentExpensesTable(expenses) {
        const tableBody = document.getElementById('recent-expenses-table');
        tableBody.innerHTML = '';
        
        if (expenses.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center">No expenses yet. Add some!</td>
                </tr>
            `;
            return;
        }
        
        // sort expenses by date (newest first) and take the first 5
        const recentExpenses = this.expenseManager.sortExpenses(expenses, 'date-desc').slice(0, 5);
        
        recentExpenses.forEach(expense => {
            const category = this.expenseManager.getCategoryById(expense.category);
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${new Date(expense.date).toLocaleDateString()}</td>
                <td>${expense.description}</td>
                <td><i class="bi ${category?.icon || 'bi-tag'}"></i> ${category?.name || 'Unknown'}</td>
                <td>${this.formatCurrency(expense.amount)}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary edit-expense" data-id="${expense.id}">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger delete-expense" data-id="${expense.id}">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
        
        // add event listeners for edit and delete buttons
        document.querySelectorAll('.edit-expense').forEach(button => {
            button.addEventListener('click', () => {
                const expenseId = button.dataset.id;
                this.editExpense(expenseId);
            });
        });
        
        document.querySelectorAll('.delete-expense').forEach(button => {
            button.addEventListener('click', () => {
                const expenseId = button.dataset.id;
                this.deleteExpense(expenseId);
            });
        });
    }
    
    //update category budgets
    updateCategoryBudgets(budget, expenses) {
        const container = document.getElementById('category-budgets-container');
        container.innerHTML = '';
        
        // group expenses by category
        const categoryExpenses = {};
        expenses.forEach(expense => {
            if (!categoryExpenses[expense.category]) {
                categoryExpenses[expense.category] = 0;
            }
            categoryExpenses[expense.category] += parseFloat(expense.amount);
        });
        
        // grt categories with budgets
        const categories = this.expenseManager.getAllCategories();
        const categoriesWithBudgets = categories.filter(category => 
            category.budget > 0 || (budget.categoryBudgets && budget.categoryBudgets[category.id])
        );
        
        if (categoriesWithBudgets.length === 0) {
            container.innerHTML = '<p class="text-center">No category budgets set. Add budgets to categories to track spending by category.</p>';
            return;
        }
        
        categoriesWithBudgets.forEach(category => {
            const categoryBudget = category.budget || (budget.categoryBudgets && budget.categoryBudgets[category.id]) || 0;
            const categoryExpense = categoryExpenses[category.id] || 0;
            const percentage = categoryBudget > 0 ? (categoryExpense / categoryBudget) * 100 : 0;
            
            // determine progress bar
            let progressClass = 'bg-success';
            if (percentage > 90) {
                progressClass = 'bg-danger';
            } else if (percentage > 75) {
                progressClass = 'bg-warning';
            }
            
            const budgetItem = document.createElement('div');
            budgetItem.className = 'budget-progress-container';
            budgetItem.innerHTML = `
                <div class="budget-progress-label">
                    <span><i class="bi ${category.icon}"></i> ${category.name}</span>
                    <span>${this.formatCurrency(categoryExpense)} / ${this.formatCurrency(categoryBudget)}</span>
                </div>
                <div class="progress">
                    <div class="progress-bar ${progressClass}" role="progressbar" style="width: ${Math.min(100, percentage)}%" 
                         aria-valuenow="${Math.min(100, percentage)}" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
            `;
            
            container.appendChild(budgetItem);
        });
    }
    
    updateCategoryFilterOptions() {
        const categoryFilter = document.getElementById('category-filter');
        categoryFilter.innerHTML = '<option value="all">All Categories</option>';
        
        const categories = this.expenseManager.getAllCategories();
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            categoryFilter.appendChild(option);
        });
    }
    
    updateCategoryDropdowns() {
        // update expense category dropdown
        const expenseCategoryDropdown = document.getElementById('expense-category');
        if (expenseCategoryDropdown) {
            const selectedValue = expenseCategoryDropdown.value;
            expenseCategoryDropdown.innerHTML = '';
            
            const categories = this.expenseManager.getAllCategories();
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                expenseCategoryDropdown.appendChild(option);
            });
            
            // restore selected value if possible
            if (selectedValue && categories.some(cat => cat.id === selectedValue)) {
                expenseCategoryDropdown.value = selectedValue;
            }
        }
        
        // update category filter dropdown
        this.updateCategoryFilterOptions();
    }
    
    // populate expenses table
    populateExpensesTable(expenses, tableId) {
        const tableBody = document.getElementById(tableId);
        tableBody.innerHTML = '';
        
        if (expenses.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center">No expenses found.</td>
                </tr>
            `;
            return;
        }
        
        expenses.forEach(expense => {
            const category = this.expenseManager.getCategoryById(expense.category);
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${new Date(expense.date).toLocaleDateString()}</td>
                <td>${expense.description}</td>
                <td><i class="bi ${category?.icon || 'bi-tag'}"></i> ${category?.name || 'Unknown'}</td>
                <td>${this.formatCurrency(expense.amount)}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary edit-expense" data-id="${expense.id}">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger delete-expense" data-id="${expense.id}">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
        
        // add event listeners for edit and delete buttons
        document.querySelectorAll('.edit-expense').forEach(button => {
            button.addEventListener('click', () => {
                const expenseId = button.dataset.id;
                this.editExpense(expenseId);
            });
        });
        
        document.querySelectorAll('.delete-expense').forEach(button => {
            button.addEventListener('click', () => {
                const expenseId = button.dataset.id;
                this.deleteExpense(expenseId);
            });
        });
    }
    
    editExpense(expenseId) {
        const expense = this.expenseManager.getAllExpenses().find(exp => exp.id === expenseId);
        if (expense) {
            this.prepareAddExpenseModal(expense);
            this.modals.addExpense.show();
        }
    }
    
    deleteExpense(expenseId) {
        if (confirm('Are you sure you want to delete this expense?')) {
            this.expenseManager.deleteExpense(expenseId);
            this.updateCurrentViewContent();
        }
    }
    
    editCategory(categoryId) {
        const category = this.expenseManager.getCategoryById(categoryId);
        if (category) {
            this.prepareAddCategoryModal(category);
            this.modals.addCategory.show();
        }
    }
    
    deleteCategory(categoryId) {
        const inUse = this.expenseManager.getAllExpenses().some(expense => expense.category === categoryId);
        
        if (inUse) {
            alert('Cannot delete this category because it has expenses associated with it. Please reassign those expenses to another category first.');
            return;
        }
        
        if (confirm('Are you sure you want to delete this category?')) {
            this.expenseManager.deleteCategory(categoryId);
            this.updateCurrentViewContent();
            this.updateCategoryDropdowns();
        }
    }
    
    searchExpenses(query) {
        if (!query.trim()) {
            this.updateExpensesView();
            return;
        }
        
        const results = this.expenseManager.searchExpenses(query);
        this.populateExpensesTable(results, 'all-expenses-table');
    }
    
    filterExpensesByCategory(categoryId) {
        if (categoryId === 'all') {
            this.updateExpensesView();
            return;
        }
        
        const filteredExpenses = this.expenseManager.getExpensesByCategory(categoryId);
        this.populateExpensesTable(filteredExpenses, 'all-expenses-table');
    }
    
    sortExpenses(sortBy) {
        const tableBody = document.getElementById('all-expenses-table');
        const expenses = this.expenseManager.sortExpenses(this.expenseManager.getAllExpenses(), sortBy);
        this.populateExpensesTable(expenses, 'all-expenses-table');
    }
    
    changePeriod(period, view = 'dashboard') {
        this.currentPeriod = period;
        
        if (period === 'custom') {
            this.currentPeriod = 'month';
        }
        
        if (view === 'reports') {
            this.updateReportsView();
        } else {
            this.updateDashboard();
        }
        
        const dropdownButton = document.getElementById(view === 'reports' ? 'report-period-dropdown' : 'time-period-dropdown');
        dropdownButton.innerHTML = `<i class="bi bi-calendar3"></i> ${this.getPeriodText(this.currentPeriod)}`;
    }
    
    exportData() {
        const data = this.exportManager.exportData();
        this.downloadFile('expense_tracker_data.json', data, 'application/json');
    }
    
    exportReport() {
        const dateRange = this.getDateRangeForPeriod(this.currentPeriod);
        const data = this.exportManager.exportReport(dateRange);
        this.downloadFile('expense_report.csv', data, 'text/csv');
    }
    
    importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = e => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.readAsText(file, 'UTF-8');
            
            reader.onload = readerEvent => {
                const content = readerEvent.target.result;
                const success = this.exportManager.importData(content);
                
                if (success) {
                    alert('Data imported successfully!');
                    window.location.reload();
                } else {
                    alert('Failed to import data. Please make sure the file is in the correct format.');
                }
            };
        };
        
        input.click();
    }
    
    // toggle dark mode
    toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        
        const settings = this.storageManager.getSettings();
        settings.darkMode = isDarkMode;
        this.storageManager.saveSettings(settings);
    }
    

    formatCurrency(amount) {
        return new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: 'EUR'
        }).format(amount);
    }


    getDateRangeForPeriod(period) {
        const now = new Date();
        let startDate, endDate;
        
        switch (period) {
            case 'week':
                startDate = new Date(now);
                startDate.setDate(now.getDate() - now.getDay());
                startDate.setHours(0, 0, 0, 0);
                
                endDate = new Date(startDate);
                endDate.setDate(startDate.getDate() + 6);
                endDate.setHours(23, 59, 59, 999);
                break;
                
            case 'month':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                
                endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                endDate.setHours(23, 59, 59, 999);
                break;
                
            case 'year':
                startDate = new Date(now.getFullYear(), 0, 1);
                
                endDate = new Date(now.getFullYear(), 11, 31);
                endDate.setHours(23, 59, 59, 999);
                break;
                
            case 'custom':
                if (this.customDateRange) {
                    return this.customDateRange;
                }
                
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                endDate.setHours(23, 59, 59, 999);
                break;
                
            default:
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                endDate.setHours(23, 59, 59, 999);
        }
        
        return { startDate, endDate };
    }
    
    getPeriodTypeForChart(period) {
        switch (period) {
            case 'week':
                return 'daily';
            case 'month':
                return 'daily';
            case 'year':
                return 'monthly';
            case 'custom':
                if (this.customDateRange) {
                    const days = (this.customDateRange.endDate - this.customDateRange.startDate) / (1000 * 60 * 60 * 24);
                    if (days <= 31) return 'daily';
                    if (days <= 365) return 'weekly';
                    return 'monthly';
                }
                return 'daily';
            default:
                return 'daily';
        }
    }
    
    getPeriodText(period) {
        switch (period) {
            case 'week':
                return 'This Week';
            case 'month':
                return 'This Month';
            case 'year':
                return 'This Year';
            case 'custom':
                if (this.customDateRange) {
                    const start = this.customDateRange.startDate.toLocaleDateString();
                    const end = this.customDateRange.endDate.toLocaleDateString();
                    return `${start} - ${end}`;
                }
                return 'Custom Range';
            default:
                return 'This Month';
        }
    }
    
    generateCategoryColors(count) {
        const baseColors = [
            '#007bff', '#28a745', '#ffc107', '#dc3545', '#17a2b8',
            '#6610f2', '#fd7e14', '#20c997', '#e83e8c', '#6c757d'
        ];
        
        const colors = [];
        for (let i = 0; i < count; i++) {
            colors.push(baseColors[i % baseColors.length]);
        }
        
        return colors;
    }
    
    downloadFile(filename, content, contentType) {
        const blob = new Blob([content], { type: contentType });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        
        URL.revokeObjectURL(url);
    }
}