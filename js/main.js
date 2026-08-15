const TranswiftStore = {
  get(key, fallback) {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
};

const PasswordUtils = {
  async hash(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  },
  async verify(password, hash) {
    const passwordHash = await this.hash(password);
    return passwordHash === hash;
  },
};

const TranswiftUI = {
  toast(message, type = 'info') {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.background = type === 'error' ? 'var(--error)' : 'var(--primary)';
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2800);
  },
};

const seedDemoData = async () => {
  const users = TranswiftStore.get('tw_users', []);
  if (!users.find((u) => u.email === 'user@test.com')) {
    users.push({
      name: 'Demo User',
      email: 'user@test.com',
      phone: '+8801000000000',
      password: 'user123',
      createdAt: new Date().toLocaleDateString(),
    });
  }
  TranswiftStore.set('tw_users', users);

  const admin = TranswiftStore.get('tw_admin', null);
  if (!admin) {
    // Default admin password: TranswiftAdmin2026!
    // IMPORTANT: Change this password after first login via the admin panel
    const defaultPassword = 'TranswiftAdmin2026!';
    const hashedPassword = await PasswordUtils.hash(defaultPassword);
    TranswiftStore.set('tw_admin', { 
      email: 'admin@transwift.com', 
      passwordHash: hashedPassword 
    });
  }

  const rates = TranswiftStore.get('tw_rates', null);
  if (!rates) {
    TranswiftStore.set('tw_rates', {
      buyRate: 119.5,
      sellRate: 118.0,
      minOrderUsd: 50,
      gateways: ['Binance', 'Redotpay', 'Payoneer', 'bKash', 'Nagad'],
      updatedAt: new Date().toLocaleString(),
      buyTrend: 0.25,
      sellTrend: -0.1,
    });
  }

  const transactions = TranswiftStore.get('tw_transactions', []);
  if (transactions.length === 0) {
    TranswiftStore.set('tw_transactions', [
      {
        id: 'TW-1001',
        userEmail: 'user@test.com',
        type: 'Buy',
        usdAmount: 250,
        bdtAmount: 29875,
        rate: 119.5,
        status: 'Completed',
        date: new Date().toLocaleDateString(),
      },
      {
        id: 'TW-1002',
        userEmail: 'user@test.com',
        type: 'Sell',
        usdAmount: 150,
        bdtAmount: 17700,
        rate: 118.0,
        status: 'Pending',
        date: new Date().toLocaleDateString(),
      },
    ]);
  }
};

const setupNavigation = () => {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => links.classList.toggle('open'));
  }
};

const setupLogout = () => {
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('tw_active_user');
      TranswiftUI.toast('You have been logged out.');
      window.location.href = 'login.html';
    });
  }
};

const setupContactForm = () => {
  const form = document.getElementById('contactForm');
  if (!form) return;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const subject = document.getElementById('contactSubject').value.trim();
    const message = document.getElementById('contactMessage').value.trim();

    if (!name || !email || !subject || !message) {
      TranswiftUI.toast('Please complete all fields.', 'error');
      return;
    }

    const messages = TranswiftStore.get('tw_contacts', []);
    messages.push({
      name,
      email,
      subject,
      message,
      createdAt: new Date().toLocaleString(),
    });
    TranswiftStore.set('tw_contacts', messages);
    form.reset();
    const success = document.getElementById('contactSuccess');
    if (success) {
      success.textContent = 'Message sent! We will get back to you shortly.';
    }
    TranswiftUI.toast('Message sent successfully.');
  });
};

(async () => {
  await seedDemoData();
  setupNavigation();
  setupLogout();
  setupContactForm();
})();

window.TranswiftStore = TranswiftStore;
window.TranswiftUI = TranswiftUI;
window.PasswordUtils = PasswordUtils;
