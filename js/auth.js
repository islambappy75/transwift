const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');

// TODO: Implement password hashing for regular users similar to admin authentication
// Currently user passwords are stored in plain text for demo purposes only
// Production deployment should use server-side authentication with proper password hashing

if (registerForm) {
  registerForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const phone = document.getElementById('regPhone').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirm = document.getElementById('regConfirm').value;

    if (!name || !email || !phone || !password || !confirm) {
      TranswiftUI.toast('Please complete all fields.', 'error');
      return;
    }

    if (password !== confirm) {
      TranswiftUI.toast('Passwords do not match.', 'error');
      return;
    }

    const users = TranswiftStore.get('tw_users', []);
    if (users.find((user) => user.email === email)) {
      TranswiftUI.toast('Account already exists. Please login.', 'error');
      return;
    }

    users.push({
      name,
      email,
      phone,
      password,
      createdAt: new Date().toLocaleDateString(),
    });
    TranswiftStore.set('tw_users', users);
    TranswiftUI.toast('Registration successful!');
    window.location.href = 'login.html';
  });
}

if (loginForm) {
  const remembered = localStorage.getItem('tw_remember_email');
  if (remembered) {
    document.getElementById('loginEmail').value = remembered;
    document.getElementById('rememberMe').checked = true;
  }

  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const remember = document.getElementById('rememberMe').checked;

    const users = TranswiftStore.get('tw_users', []);
    const user = users.find((u) => u.email === email && u.password === password);

    if (!user) {
      TranswiftUI.toast('Invalid login credentials.', 'error');
      return;
    }

    TranswiftStore.set('tw_active_user', user);
    if (remember) {
      localStorage.setItem('tw_remember_email', email);
    } else {
      localStorage.removeItem('tw_remember_email');
    }
    TranswiftUI.toast('Login successful!');
    window.location.href = 'dashboard.html';
  });
}
