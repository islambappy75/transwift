const applyRatesToPage = () => {
  const rates = TranswiftStore.get('tw_rates', {
    buyRate: 119.5,
    sellRate: 118.0,
    minOrderUsd: 50,
    gateways: ['Binance', 'Redotpay', 'Payoneer', 'bKash', 'Nagad'],
    updatedAt: new Date().toLocaleString(),
    buyTrend: 0.25,
    sellTrend: -0.1,
  });

  const buyRateEl = document.getElementById('buyRate');
  const sellRateEl = document.getElementById('sellRate');
  const updatedEl = document.getElementById('rateUpdated');
  const minOrderEl = document.getElementById('minOrder');
  const buyTrendEl = document.getElementById('buyTrend');
  const sellTrendEl = document.getElementById('sellTrend');

  if (buyRateEl) buyRateEl.textContent = rates.buyRate.toFixed(2);
  if (sellRateEl) sellRateEl.textContent = rates.sellRate.toFixed(2);
  if (updatedEl) updatedEl.textContent = rates.updatedAt;
  if (minOrderEl) minOrderEl.textContent = Number(rates.minOrderUsd || 0).toFixed(2);

  if (buyTrendEl) {
    buyTrendEl.textContent = `${rates.buyTrend > 0 ? '▲' : '▼'} ${Math.abs(rates.buyTrend).toFixed(2)}%`;
    buyTrendEl.classList.toggle('up', rates.buyTrend >= 0);
    buyTrendEl.classList.toggle('down', rates.buyTrend < 0);
  }

  if (sellTrendEl) {
    sellTrendEl.textContent = `${rates.sellTrend > 0 ? '▲' : '▼'} ${Math.abs(rates.sellTrend).toFixed(2)}%`;
    sellTrendEl.classList.toggle('up', rates.sellTrend >= 0);
    sellTrendEl.classList.toggle('down', rates.sellTrend < 0);
  }
};

const setupCalculator = () => {
  const calcBtn = document.getElementById('calcBtn');
  if (!calcBtn) return;
  calcBtn.addEventListener('click', () => {
    const amount = Number(document.getElementById('calcAmount').value);
    const direction = document.getElementById('calcDirection').value;
    if (!amount) {
      TranswiftUI.toast('Enter a valid amount.', 'error');
      return;
    }

    const rates = TranswiftStore.get('tw_rates', { buyRate: 119.5, sellRate: 118.0 });
    let result = 0;
    if (direction === 'usdToBdt') {
      result = amount * rates.buyRate;
      document.getElementById('calcResult').value = `৳${result.toFixed(2)}`;
    } else {
      result = amount / rates.sellRate;
      document.getElementById('calcResult').value = `$${result.toFixed(2)}`;
    }
  });
};

applyRatesToPage();
setupCalculator();
