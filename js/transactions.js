const tableBody = document.getElementById('transactionTable');
const filterType = document.getElementById('filterType');
const searchInput = document.getElementById('searchInput');

const renderTransactions = () => {
  if (!tableBody) return;
  const type = filterType ? filterType.value : 'All';
  const term = searchInput ? searchInput.value.toLowerCase() : '';
  const transactions = TranswiftStore.get('tw_transactions', []);

  const filtered = transactions.filter((tx) => {
    const matchesType = type === 'All' || tx.type === type;
    const searchable = `${tx.status} ${tx.usdAmount} ${tx.bdtAmount}`.toLowerCase();
    const matchesSearch = !term || searchable.includes(term);
    return matchesType && matchesSearch;
  });

  tableBody.innerHTML = filtered
    .map(
      (tx) => `
        <tr>
          <td>${tx.date}</td>
          <td>${tx.type}</td>
          <td>${Number(tx.usdAmount).toFixed(2)}</td>
          <td>${Number(tx.bdtAmount).toFixed(2)}</td>
          <td>${Number(tx.rate).toFixed(2)}</td>
          <td><span class="badge ${tx.status.toLowerCase()}">${tx.status}</span></td>
        </tr>
      `
    )
    .join('');
};

if (filterType) {
  filterType.addEventListener('change', renderTransactions);
}
if (searchInput) {
  searchInput.addEventListener('input', renderTransactions);
}

renderTransactions();
