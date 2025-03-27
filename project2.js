let investments = JSON.parse(localStorage.getItem('investments')) || [];
let chart;

function addInvestment() {
  const assetName = document.getElementById('asset-name').value;
  const investedAmount = parseFloat(document.getElementById('invested-amount').value);
  const currentValue = parseFloat(document.getElementById('current-value').value);

  if (!assetName || investedAmount <= 0 || currentValue <= 0) {
    alert('Please enter valid values.');
    return;
  }

  const investment = { assetName, investedAmount, currentValue };
  investments.push(investment);
  localStorage.setItem('investments', JSON.stringify(investments));

  document.getElementById('asset-name').value = '';
  document.getElementById('invested-amount').value = '';
  document.getElementById('current-value').value = '';

  updatePortfolio();
}

function updatePortfolio() {
  const portfolioList = document.getElementById('portfolio-list');
  portfolioList.innerHTML = '';
  let totalValue = 0;

  investments.forEach((investment, index) => {
    totalValue += investment.currentValue;
    const percentageChange = (((investment.currentValue - investment.investedAmount) / investment.investedAmount) * 100).toFixed(2);

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${investment.assetName}</td>
      <td>$${investment.investedAmount.toFixed(2)}</td>
      <td>$${investment.currentValue.toFixed(2)}</td>
      <td>${percentageChange}%</td>
      <td>
        <button class="update-btn" onclick="updateInvestment(${index})">Update</button>
        <button class="remove-btn" onclick="removeInvestment(${index})">Remove</button>
      </td>
    `;
    portfolioList.appendChild(row);
  });

  document.getElementById('total-value').textContent = `$${totalValue.toFixed(2)}`;
  updateChart();
}

function updateInvestment(index) {
  const newValue = prompt('Enter the new current value:', investments[index].currentValue);
  if (newValue && !isNaN(newValue) && parseFloat(newValue) > 0) {
    investments[index].currentValue = parseFloat(newValue);
    localStorage.setItem('investments', JSON.stringify(investments));
    updatePortfolio();
  } else {
    alert('Invalid value entered.');
  }
}

function removeInvestment(index) {
  investments.splice(index, 1);
  localStorage.setItem('investments', JSON.stringify(investments));
  updatePortfolio();
}

function updateChart() {
  const ctx = document.getElementById('portfolio-chart').getContext('2d');
  const labels = investments.map(inv => inv.assetName);
  const data = investments.map(inv => inv.currentValue);

  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56', '#4bc0c0'],
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
        },
      },
    },
  });
}

// Initialize the portfolio on page load
updatePortfolio();
