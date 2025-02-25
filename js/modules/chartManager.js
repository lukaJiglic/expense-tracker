export class ChartManager {
    constructor() {
        this.charts = {};
    }
    
    // create or update a line chart
    createOrUpdateLineChart(chartId, labels, datasets, options = {}) {
        const ctx = document.getElementById(chartId).getContext('2d');
        
        // if chart already exists, destroy it
        if (this.charts[chartId]) {
            this.charts[chartId].destroy();
        }
        
        this.charts[chartId] = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: !!options.title,
                        text: options.title || ''
                    },
                    legend: {
                        display: datasets.length > 1,
                        position: 'top'
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                label += new Intl.NumberFormat('de-DE', {
                                    style: 'currency',
                                    currency: 'EUR'
                                }).format(context.parsed.y);
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: !!options.xAxisLabel,
                            text: options.xAxisLabel || ''
                        }
                    },
                    y: {
                        title: {
                            display: !!options.yAxisLabel,
                            text: options.yAxisLabel || ''
                        },
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return new Intl.NumberFormat('de-DE', {
                                    style: 'currency',
                                    currency: 'EUR',
                                    minimumFractionDigits: 0
                                }).format(value);
                            }
                        }
                    }
                }
            }
        });
        
        return this.charts[chartId];
    }
    
    //bar chart
    createOrUpdateBarChart(chartId, labels, datasets, options = {}) {
        const ctx = document.getElementById(chartId).getContext('2d');
        
        if (this.charts[chartId]) {
            this.charts[chartId].destroy();
        }
        
        this.charts[chartId] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: !!options.title,
                        text: options.title || ''
                    },
                    legend: {
                        display: datasets.length > 1,
                        position: 'top'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                label += new Intl.NumberFormat('de-DE', {
                                    style: 'currency',
                                    currency: 'EUR'
                                }).format(context.parsed.y);
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: !!options.xAxisLabel,
                            text: options.xAxisLabel || ''
                        }
                    },
                    y: {
                        title: {
                            display: !!options.yAxisLabel,
                            text: options.yAxisLabel || ''
                        },
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return new Intl.NumberFormat('de-DE', {
                                    style: 'currency',
                                    currency: 'EUR',
                                    minimumFractionDigits: 0
                                }).format(value);
                            }
                        }
                    }
                }
            }
        });
        
        return this.charts[chartId];
    }
    
    //pie chart
    createOrUpdatePieChart(chartId, labels, data, backgroundColors, options = {}) {
        const ctx = document.getElementById(chartId).getContext('2d');
        
        if (this.charts[chartId]) {
            this.charts[chartId].destroy();
        }
        
        this.charts[chartId] = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: backgroundColors,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: !!options.title,
                        text: options.title || ''
                    },
                    legend: {
                        position: 'right'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = new Intl.NumberFormat('de-DE', {
                                    style: 'currency',
                                    currency: 'EUR'
                                }).format(context.parsed);
                                
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((context.parsed / total) * 100);
                                
                                return `${label}: ${value} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
        
        return this.charts[chartId];
    }
    
    //doughnut chart
    createOrUpdateDoughnutChart(chartId, labels, data, backgroundColors, options = {}) {
        const ctx = document.getElementById(chartId).getContext('2d');
        
        if (this.charts[chartId]) {
            this.charts[chartId].destroy();
        }
        
        this.charts[chartId] = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: backgroundColors,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: !!options.title,
                        text: options.title || ''
                    },
                    legend: {
                        position: 'right'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = new Intl.NumberFormat('de-DE', {
                                    style: 'currency',
                                    currency: 'EUR'
                                }).format(context.parsed);
                                
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((context.parsed / total) * 100);
                                
                                return `${label}: ${value} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
        
        return this.charts[chartId];
    }
}