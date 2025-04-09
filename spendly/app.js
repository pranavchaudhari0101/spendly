document.addEventListener('DOMContentLoaded', function() {
    const budgetForm = document.getElementById('budgetForm');
    const resultsSection = document.getElementById('results');
    const categoryBreakdown = document.querySelector('.category-breakdown');
    const backButton = document.getElementById('backButton');
    
    // Charts
    let savingsChart;
    let categoriesBarChart;
    let categoriesPieChart;
    
    // Colors for charts
    const chartColors = [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
        '#FF9F40', '#C9CBCF', '#7AC142', '#EC932F'
    ];
    
    // Handle form submission
    budgetForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const formData = {
            month: document.getElementById('month').value,
            income_type: document.getElementById('incomeType').value,
            payment_method: document.getElementById('paymentMethod').value,
            amount: parseFloat(document.getElementById('amount').value)
        };
        
        // Send data to Flask backend
        fetch('/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            // Show results section
            resultsSection.style.display = 'block';
            
            // Scroll to results
            resultsSection.scrollIntoView({ behavior: 'smooth' });
            
            // Display results
            displayResults(data, formData.amount);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while processing your request. Please try again.');
        });
    });
    
    // Display results
    function displayResults(data, totalAmount) {
        // Clear previous results
        categoryBreakdown.innerHTML = '';
        
        // Create category items
        const categories = Object.keys(data);
        categories.forEach(category => {
            const amount = data[category];
            const div = document.createElement('div');
            div.className = 'category-item';
            div.innerHTML = `
                <div class="category-name">${category}</div>
                <div class="category-amount">₹${Math.round(amount).toLocaleString()}</div>
            `;
            categoryBreakdown.appendChild(div);
        });
        
        // Create charts
        createSavingsChart(data.Savings, totalAmount);
        createCategoriesBarChart(data);
        createCategoriesPieChart(data);
    }
    
    // Create Savings vs Spending chart
    function createSavingsChart(savings, totalAmount) {
        const spending = totalAmount - savings;
        
        const ctx = document.getElementById('savingsChart').getContext('2d');
        
        // Destroy previous chart if exists
        if (savingsChart) {
            savingsChart.destroy();
        }
        
        savingsChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Total Spending', 'Savings'],
                datasets: [{
                    data: [spending, savings],
                    backgroundColor: ['#ff9999', '#66b3ff'],
                    borderColor: ['#ff8080', '#4da6ff'],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                const percentage = ((value / totalAmount) * 100).toFixed(1);
                                return `${label}: ₹${Math.round(value).toLocaleString()} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Create Categories Bar Chart
    function createCategoriesBarChart(data) {
        // Filter out savings
        const spendingData = { ...data };
        delete spendingData.Savings;
        
        const labels = Object.keys(spendingData);
        const values = Object.values(spendingData);
        
        const ctx = document.getElementById('categoriesBarChart').getContext('2d');
        
        // Destroy previous chart if exists
        if (categoriesBarChart) {
            categoriesBarChart.destroy();
        }
        
        categoriesBarChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Amount (₹)',
                    data: values,
                    backgroundColor: chartColors.slice(0, labels.length),
                    borderColor: chartColors.slice(0, labels.length).map(color => {
                        // Darken border color
                        return color;
                    }),
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '₹' + value.toLocaleString();
                            }
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.dataset.label || '';
                                const value = context.raw || 0;
                                return `${label}: ₹${Math.round(value).toLocaleString()}`;
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Create Categories Pie Chart
    function createCategoriesPieChart(data) {
        // Filter out savings
        const spendingData = { ...data };
        delete spendingData.Savings;
        
        const labels = Object.keys(spendingData);
        const values = Object.values(spendingData);
        
        const ctx = document.getElementById('categoriesPieChart').getContext('2d');
        
        // Destroy previous chart if exists
        if (categoriesPieChart) {
            categoriesPieChart.destroy();
        }
        
        categoriesPieChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: values,
                    backgroundColor: chartColors.slice(0, labels.length),
                    borderColor: chartColors.slice(0, labels.length).map(color => {
                        // Darken border color
                        return color;
                    }),
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return `${label}: ₹${Math.round(value).toLocaleString()} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Back button event
    backButton.addEventListener('click', function() {
        resultsSection.style.display = 'none';
        budgetForm.reset();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}); 