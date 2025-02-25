export function formatDateForInput(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

//get first day of the month
export function getFirstDayOfMonth(date) {
    const d = new Date(date);
    return new Date(d.getFullYear(), d.getMonth(), 1);
}

//get last day of the month
export function getLastDayOfMonth(date) {
    const d = new Date(date);
    return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}

//get first day of the week (Sunday)
export function getFirstDayOfWeek(date) {
    const d = new Date(date);
    const day = d.getDay();
    return new Date(d.setDate(d.getDate() - day));
}

//get date range for period
export function getDateRangeForPeriod(period, date = new Date()) {
    let startDate, endDate;
    
    switch (period) {
        case 'day':
            startDate = new Date(date);
            startDate.setHours(0, 0, 0, 0);
            
            endDate = new Date(date);
            endDate.setHours(23, 59, 59, 999);
            break;
            
        case 'week':
            startDate = getFirstDayOfWeek(date);
            startDate.setHours(0, 0, 0, 0);
            
            endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 6);
            endDate.setHours(23, 59, 59, 999);
            break;
            
        case 'month':
            startDate = getFirstDayOfMonth(date);
            startDate.setHours(0, 0, 0, 0);
            
            endDate = getLastDayOfMonth(date);
            endDate.setHours(23, 59, 59, 999);
            break;
            
        case 'year':
            startDate = new Date(date.getFullYear(), 0, 1);
            startDate.setHours(0, 0, 0, 0);
            
            endDate = new Date(date.getFullYear(), 11, 31);
            endDate.setHours(23, 59, 59, 999);
            break;
            
        default:
            startDate = getFirstDayOfMonth(date);
            startDate.setHours(0, 0, 0, 0);
            
            endDate = getLastDayOfMonth(date);
            endDate.setHours(23, 59, 59, 999);
    }
    
    return { startDate, endDate };
}

//format date
export function formatDate(date) {
    const d = new Date(date);
    const day = d.getDate();
    const month = getMonthName(d.getMonth());
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
}

//get month name
export function getMonthName(month) {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month];
}