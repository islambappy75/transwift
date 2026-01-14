const orderForm = document.querySelector('form[data-type]');
const orderSummary = document.getElementById('orderSummary');
const modal = document.getElementById('orderModal');
const modalMessage = document.getElementById('modalMessage');
const closeModal = document.getElementById('closeModal');

const buildSummary = (type, usdAmount, rate) => {
  const feeRate = 0.015;
  const fee = usdAmount * rate * feeRate;
  const bdtTotal = usdAmount * rate;
  const total = bdtTotal + fee;
  return { fee, bdtTotal, total };
};

const renderSummary = (type, usdAmount, rate) => {
  if (!orderSummary) return;
  const summary = buildSummary(type, usdAmount, rate);
  orderSummary.innerHTML = `
    <p>Rate: ${rate.toFixed(2)} BDT/USD</p>
    <p>BDT Total: ৳${summary.bdtTotal.toFixed(2)}</p>
    <p>Fees: ৳${summary.fee.toFixed(2)}</p>
    <p><strong>Payable: ৳${summary.total.toFixed(2)}</strong></p>
  `;
};

const handleFormSubmit = (event) => {
  event.preventDefault();
  const usdAmount = Number(document.getElementById('usdAmount').value);
  const paymentMethod = document.getElementById('paymentMethod').value;
  const accountDetails = document.getElementById('accountDetails').value.trim();
  const type = orderForm.dataset.type;

  if (!usdAmount || !paymentMethod || !accountDetails) {
    TranswiftUI.toast('Please complete all fields.', 'error');
    return;
  }

  const rates = TranswiftStore.get('tw_rates', { buyRate: 119.5, sellRate: 118.0 });
  const rate = type === 'Buy' ? rates.buyRate : rates.sellRate;
  const summary = buildSummary(type, usdAmount, rate);
  const transactions = TranswiftStore.get('tw_transactions', []);
  const user = TranswiftStore.get('tw_active_user', { email: 'guest@transwift.com' });

  const newOrder = {
    id: `TW-${Math.floor(Math.random() * 9000) + 1000}`,
    userEmail: user.email,
    type,
    usdAmount,
    bdtAmount: summary.bdtTotal,
    rate,
    status: 'Pending',
    date: new Date().toLocaleDateString(),
    paymentMethod,
    accountDetails,
  };

  transactions.push(newOrder);
  TranswiftStore.set('tw_transactions', transactions);

  if (modalMessage) {
    modalMessage.textContent = `Your ${type} order for $${usdAmount.toFixed(2)} has been placed.`;
  }
  if (modal) modal.classList.add('active');
  orderForm.reset();
  if (orderSummary) orderSummary.innerHTML = '';
  TranswiftUI.toast('Order placed successfully!');
};

if (orderForm) {
  const rateKey = orderForm.dataset.type === 'Buy' ? 'buyRate' : 'sellRate';
  const rates = TranswiftStore.get('tw_rates', { buyRate: 119.5, sellRate: 118.0 });
  const rate = rates[rateKey];
  const usdInput = document.getElementById('usdAmount');
  usdInput.addEventListener('input', () => {
    const usdAmount = Number(usdInput.value || 0);
    if (usdAmount > 0) {
      renderSummary(orderForm.dataset.type, usdAmount, rate);
    } else if (orderSummary) {
      orderSummary.innerHTML = '';
    }
  });

  orderForm.addEventListener('submit', handleFormSubmit);
}

if (closeModal && modal) {
  closeModal.addEventListener('click', () => modal.classList.remove('active'));
}
