
//format amount as currency
export function formatCurrency(amount, currency = 'EUR') {
    return new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: currency
    }).format(amount);
}

//format amount 2 decimal places
export function formatNumber(amount) {
    return new Intl.NumberFormat('de-DE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}

//parse currency string to number
export function parseCurrency(currencyString) {
    return parseFloat(currencyString.replace(/[^\d,-]/g, '').replace(',', '.'));
}

//calculate percentage
export function calculatePercentage(value, total) {
    if (total === 0) return 0;
    return (value / total) * 100;
}

//format percentage
export function formatPercentage(percentage) {
    return `${Math.round(percentage)}%`;
}