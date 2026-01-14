const adminLoginForm = document.getElementById('adminLoginForm');
const adminLogout = document.getElementById('adminLogout');

const ensureAdminAuth = () => {
  const isLoginPage = window.location.pathname.includes('admin/login.html');
  const authed = localStorage.getItem('tw_admin_auth') === 'true';
  if (!isLoginPage && !authed) {
    window.location.href = 'login.html';
  }
};

const adminLogin = () => {
  if (!adminLoginForm) return;
  adminLoginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = document.getElementById('adminEmail').value.trim();
    const password = document.getElementById('adminPassword').value;
    const admin = TranswiftStore.get('tw_admin', { email: '', password: '' });

    if (email === admin.email && password === admin.password) {
      localStorage.setItem('tw_admin_auth', 'true');
      TranswiftUI.toast('Welcome, Admin!');
      window.location.href = 'dashboard.html';
    } else {
      TranswiftUI.toast('Invalid admin credentials.', 'error');
    }
  });
};

const setupAdminLogout = () => {
  if (!adminLogout) return;
  adminLogout.addEventListener('click', () => {
    localStorage.removeItem('tw_admin_auth');
    TranswiftUI.toast('Logged out from admin.');
    window.location.href = 'login.html';
  });
};

const populateAdminDashboard = () => {
  const totalEl = document.getElementById('adminTotalTransactions');
  if (!totalEl) return;
  const transactions = TranswiftStore.get('tw_transactions', []);
  const users = TranswiftStore.get('tw_users', []);

  const totalUsd = transactions.reduce((sum, tx) => sum + Number(tx.usdAmount || 0), 0);
  const totalBdt = transactions.reduce((sum, tx) => sum + Number(tx.bdtAmount || 0), 0);
  const pending = transactions.filter((tx) => tx.status === 'Pending').length;

  document.getElementById('adminTotalTransactions').textContent = transactions.length;
  document.getElementById('adminUsdVolume').textContent = `$${totalUsd.toFixed(2)}`;
  document.getElementById('adminBdtVolume').textContent = `৳${totalBdt.toFixed(2)}`;
  document.getElementById('adminPendingOrders').textContent = pending;
  document.getElementById('adminUserCount').textContent = users.length;

  const latestOrders = document.getElementById('adminLatestOrders');
  if (latestOrders) {
    latestOrders.innerHTML = transactions
      .slice(-5)
      .reverse()
      .map(
        (tx) => `
          <tr>
            <td>${tx.date}</td>
            <td>${tx.userEmail}</td>
            <td>${tx.type}</td>
            <td>${Number(tx.usdAmount).toFixed(2)}</td>
            <td><span class="badge ${tx.status.toLowerCase()}">${tx.status}</span></td>
          </tr>
        `
      )
      .join('');
  }
};

const populateAdminOrders = () => {
  const ordersTable = document.getElementById('adminOrdersTable');
  if (!ordersTable) return;
  const transactions = TranswiftStore.get('tw_transactions', []);

  ordersTable.innerHTML = transactions
    .map(
      (tx, index) => `
        <tr>
          <td>${tx.date}</td>
          <td>${tx.userEmail}</td>
          <td>${tx.type}</td>
          <td>${Number(tx.usdAmount).toFixed(2)}</td>
          <td>${Number(tx.bdtAmount).toFixed(2)}</td>
          <td><span class="badge ${tx.status.toLowerCase()}">${tx.status}</span></td>
          <td>
            <button class="action-btn approve" data-index="${index}" data-action="Completed">Approve</button>
            <button class="action-btn reject" data-index="${index}" data-action="Cancelled">Reject</button>
          </td>
        </tr>
      `
    )
    .join('');

  ordersTable.querySelectorAll('button').forEach((button) => {
    button.addEventListener('click', () => {
      const idx = Number(button.dataset.index);
      const action = button.dataset.action;
      const updated = TranswiftStore.get('tw_transactions', []);
      if (updated[idx]) {
        updated[idx].status = action;
        TranswiftStore.set('tw_transactions', updated);
        populateAdminOrders();
        TranswiftUI.toast(`Order ${action.toLowerCase()} successfully.`);
      }
    });
  });
};

const populateAdminUsers = () => {
  const usersTable = document.getElementById('adminUsersTable');
  if (!usersTable) return;
  const users = TranswiftStore.get('tw_users', []);
  usersTable.innerHTML = users
    .map(
      (user) => `
        <tr>
          <td>${user.name}</td>
          <td>${user.email}</td>
          <td>${user.phone}</td>
          <td>${user.createdAt || '-'}</td>
        </tr>
      `
    )
    .join('');
};

const setupRateForm = () => {
  const form = document.getElementById('rateForm');
  if (!form) return;
  const rates = TranswiftStore.get('tw_rates', { buyRate: 119.5, sellRate: 118.0 });
  document.getElementById('adminBuyRate').value = rates.buyRate;
  document.getElementById('adminSellRate').value = rates.sellRate;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const buyRate = Number(document.getElementById('adminBuyRate').value);
    const sellRate = Number(document.getElementById('adminSellRate').value);
    if (!buyRate || !sellRate) {
      TranswiftUI.toast('Please enter valid rates.', 'error');
      return;
    }
    TranswiftStore.set('tw_rates', {
      buyRate,
      sellRate,
      updatedAt: new Date().toLocaleString(),
      buyTrend: 0.12,
      sellTrend: -0.05,
    });
    const status = document.getElementById('rateStatus');
    if (status) {
      status.textContent = 'Rates updated successfully.';
    }
    TranswiftUI.toast('Rates updated!');
  });
};

ensureAdminAuth();
adminLogin();
setupAdminLogout();
populateAdminDashboard();
populateAdminOrders();
populateAdminUsers();
setupRateForm();
