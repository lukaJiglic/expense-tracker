Expense Tracker

features
- Expense management: add, edit, delete, and search expenses
- Category Management: create and customize expense categories with icons
- Budget tracking: set monthly budgets (overall and per category)
- Dashboard: view expense summaries, trends, and recent transactions
- Reports: analyze spending patterns with interactive charts
- Data Export/Import: Export data as JSON or reports as CSV
- Dark/Light Mode: Switch between visual themes
- Responsive Design: Works on desktop and mobile devices
- Local Storage: All data is stored in your browser's local storage


Running the Application
1. Clone or download the repository to your local machine
2. Run npx http-server in the root directory to start the server
3. open the location of the server in your browser


Project Structure
- `index.html` - Main HTML file
- `css/` - Stylesheet files
  - `style.css` - Main stylesheet
  - `reset.css` - CSS reset
- `js/` - JavaScript files
  - `app.js` - Main application entry point
  - `modules/` - Contains core functionality modules:
    - `expenseManager.js` - Manages expense data
    - `uiManager.js` - Handles UI operations
    - `chartManager.js` - Manages chart creation and updates
    - `storageManager.js` - Handles localStorage operations
    - `budgetManager.js` - Manages budget operations
    - `exportManager.js` - Handles data export and import
  - `utils/` - Utility functions
    - `currencyUtils.js` - Currency formatting helpers
    - `dateUtils.js` - Date manipulation helpers