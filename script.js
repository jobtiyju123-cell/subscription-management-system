(function () {
  'use strict';

  /* ---------- Helpers ---------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function inr(n) { return '\u20B9' + Number(n).toLocaleString('en-IN'); }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  var toastTimer = null;
  function toast(msg) {
    var t = $('#toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('show'); }, 2600);
  }

  /* ---------- DEMONSTRATION DATA (all fictional) ---------- */
  var data = {
    customers: [
      { name: 'Nila Textiles Pvt Ltd', email: 'accounts@nila.demo', city: 'Kochi', plan: 'Business', status: 'Active' },
      { name: 'Greenleaf Organics', email: 'hello@greenleaf.demo', city: 'Thrissur', plan: 'Starter', status: 'Active' },
      { name: 'Coastline Logistics', email: 'finance@coastline.demo', city: 'Mangaluru', plan: 'Enterprise', status: 'Active' },
      { name: 'Pixel Orchard Studio', email: 'team@pixelorchard.demo', city: 'Bengaluru', plan: 'Pro', status: 'Trial' },
      { name: 'Sahyadri Foods', email: 'billing@sahyadri.demo', city: 'Kozhikode', plan: 'Business', status: 'Past Due' },
      { name: 'BlueWave Fitness', email: 'admin@bluewave.demo', city: 'Thiruvananthapuram', plan: 'Pro', status: 'Active' },
      { name: 'Kaveri Learning Hub', email: 'office@kaveri.demo', city: 'Chennai', plan: 'Starter', status: 'Cancelled' },
      { name: 'Urban Nest Realty', email: 'ops@urbannest.demo', city: 'Pune', plan: 'Enterprise', status: 'Active' }
    ],
    products: [
      { name: 'Brightloop Core', sku: 'BL-CORE', category: 'Platform', price: 1999, status: 'Active' },
      { name: 'Analytics Add-on', sku: 'BL-ANLY', category: 'Add-on', price: 799, status: 'Active' },
      { name: 'Extra Seats (5 pack)', sku: 'BL-SEAT5', category: 'Add-on', price: 499, status: 'Active' },
      { name: 'Priority Support', sku: 'BL-SUP', category: 'Service', price: 1499, status: 'Active' },
      { name: 'Onboarding Package', sku: 'BL-ONB', category: 'Service', price: 9999, status: 'Draft' }
    ],
    plans: [
      { name: 'Starter', billing: 'Monthly', price: 999, subscribers: 312, status: 'Active' },
      { name: 'Pro', billing: 'Monthly', price: 2499, subscribers: 284, status: 'Active' },
      { name: 'Business', billing: 'Quarterly', price: 6999, subscribers: 168, status: 'Active' },
      { name: 'Enterprise', billing: 'Yearly', price: 59999, subscribers: 82, status: 'Active' },
      { name: 'Legacy Basic', billing: 'Monthly', price: 499, subscribers: 0, status: 'Cancelled' }
    ],
    subscriptions: [
      { id: 'SUB-1042', customer: 'Nila Textiles Pvt Ltd', plan: 'Business', amount: 6999, start: '28 Oct 2026', status: 'Active' },
      { id: 'SUB-1041', customer: 'Pixel Orchard Studio', plan: 'Pro', amount: 2499, start: '26 Oct 2026', status: 'Trial' },
      { id: 'SUB-1040', customer: 'Coastline Logistics', plan: 'Enterprise', amount: 59999, start: '24 Oct 2026', status: 'Active' },
      { id: 'SUB-1039', customer: 'Sahyadri Foods', plan: 'Business', amount: 6999, start: '21 Oct 2026', status: 'Past Due' },
      { id: 'SUB-1038', customer: 'BlueWave Fitness', plan: 'Pro', amount: 2499, start: '18 Oct 2026', status: 'Active' },
      { id: 'SUB-1037', customer: 'Greenleaf Organics', plan: 'Starter', amount: 999, start: '15 Oct 2026', status: 'Active' },
      { id: 'SUB-1036', customer: 'Kaveri Learning Hub', plan: 'Starter', amount: 999, start: '10 Oct 2026', status: 'Cancelled' },
      { id: 'SUB-1035', customer: 'Urban Nest Realty', plan: 'Enterprise', amount: 59999, start: '06 Oct 2026', status: 'Active' }
    ],
    quotations: [
      { id: 'QUO-3021', customer: 'Harbor Light Hotels', item: 'Enterprise Plan (Yearly)', amount: 59999, date: '29 Oct 2026', status: 'Sent' },
      { id: 'QUO-3020', customer: 'Pixel Orchard Studio', item: 'Pro Plan + Analytics', amount: 3298, date: '25 Oct 2026', status: 'Accepted' },
      { id: 'QUO-3019', customer: 'Malabar Spice Co.', item: 'Business Plan (Quarterly)', amount: 6999, date: '22 Oct 2026', status: 'Draft' },
      { id: 'QUO-3018', customer: 'Silverline Clinics', item: 'Starter Plan', amount: 999, date: '17 Oct 2026', status: 'Expired' }
    ],
    invoices: [
      { id: 'INV-8812', customer: 'Sahyadri Foods', amount: 6999, due: '05 Nov 2026', status: 'Overdue' },
      { id: 'INV-8811', customer: 'Nila Textiles Pvt Ltd', amount: 6999, due: '10 Nov 2026', status: 'Pending' },
      { id: 'INV-8810', customer: 'Coastline Logistics', amount: 59999, due: '12 Nov 2026', status: 'Pending' },
      { id: 'INV-8809', customer: 'BlueWave Fitness', amount: 2499, due: '30 Oct 2026', status: 'Paid' },
      { id: 'INV-8808', customer: 'Greenleaf Organics', amount: 999, due: '28 Oct 2026', status: 'Paid' },
      { id: 'INV-8807', customer: 'Urban Nest Realty', amount: 59999, due: '20 Oct 2026', status: 'Paid' }
    ],
    payments: [
      { id: 'PAY-5521', customer: 'BlueWave Fitness', method: 'UPI', amount: 2499, date: '30 Oct 2026', status: 'Success' },
      { id: 'PAY-5520', customer: 'Greenleaf Organics', method: 'Card', amount: 999, date: '28 Oct 2026', status: 'Success' },
      { id: 'PAY-5519', customer: 'Sahyadri Foods', method: 'Net Banking', amount: 6999, date: '27 Oct 2026', status: 'Failed' },
      { id: 'PAY-5518', customer: 'Urban Nest Realty', method: 'Bank Transfer', amount: 59999, date: '24 Oct 2026', status: 'Success' },
      { id: 'PAY-5517', customer: 'Nila Textiles Pvt Ltd', method: 'UPI', amount: 6999, date: '22 Oct 2026', status: 'Success' },
      { id: 'PAY-5516', customer: 'Kaveri Learning Hub', method: 'Card', amount: 999, date: '19 Oct 2026', status: 'Refunded' }
    ]
  };

  var notifications = [
    { icon: 'bi-exclamation-triangle', title: 'Payment failed', text: 'PAY-5519 from Sahyadri Foods did not go through.', page: 'payments', unread: true },
    { icon: 'bi-receipt', title: 'Invoice overdue', text: 'INV-8812 is past its due date.', page: 'invoices', unread: true },
    { icon: 'bi-person-plus', title: 'New trial started', text: 'Pixel Orchard Studio began a Pro trial.', page: 'subscriptions', unread: true },
    { icon: 'bi-file-earmark-check', title: 'Quotation accepted', text: 'QUO-3020 was accepted by the customer.', page: 'quotations', unread: false }
  ];

  /* ---------- Page configuration ---------- */
  var STATUS_OPTIONS = ['Active', 'Trial', 'Pending', 'Past Due', 'Draft', 'Cancelled'];

  var pages = {
    customers: {
      title: 'Customers', sub: 'Everyone who has subscribed or requested a quote.', add: 'Add Customer',
      cols: [
        { key: 'name', label: 'Customer', strong: true }, { key: 'email', label: 'Email' },
        { key: 'city', label: 'City' }, { key: 'plan', label: 'Plan' }, { key: 'status', label: 'Status', type: 'badge' }
      ]
    },
    products: {
      title: 'Products', sub: 'Items and services you can add to a subscription.', add: 'Add Product',
      cols: [
        { key: 'name', label: 'Product', strong: true }, { key: 'sku', label: 'SKU' },
        { key: 'category', label: 'Category' }, { key: 'price', label: 'Price', type: 'money' },
        { key: 'status', label: 'Status', type: 'badge' }
      ]
    },
    plans: {
      title: 'Subscription Plans', sub: 'Pricing plans offered to customers.', add: 'Add Plan',
      cols: [
        { key: 'name', label: 'Plan', strong: true }, { key: 'billing', label: 'Billing' },
        { key: 'price', label: 'Price', type: 'money' }, { key: 'subscribers', label: 'Subscribers', type: 'number' },
        { key: 'status', label: 'Status', type: 'badge' }
      ]
    },
    subscriptions: {
      title: 'Subscriptions', sub: 'All customer subscriptions.', add: 'New Subscription', idPrefix: 'SUB-',
      cols: [
        { key: 'id', label: 'ID', strong: true }, { key: 'customer', label: 'Customer' },
        { key: 'plan', label: 'Plan' }, { key: 'amount', label: 'Amount', type: 'money' },
        { key: 'start', label: 'Start Date', type: 'date' }, { key: 'status', label: 'Status', type: 'badge' }
      ]
    },
    quotations: {
      title: 'Quotations', sub: 'Quotes sent to prospective customers.', add: 'New Quotation', idPrefix: 'QUO-',
      statusOptions: ['Draft', 'Sent', 'Accepted', 'Expired'],
      cols: [
        { key: 'id', label: 'Quote No.', strong: true }, { key: 'customer', label: 'Customer' },
        { key: 'item', label: 'Item' }, { key: 'amount', label: 'Amount', type: 'money' },
        { key: 'date', label: 'Date', type: 'date' }, { key: 'status', label: 'Status', type: 'badge' }
      ]
    },
    invoices: {
      title: 'Invoices', sub: 'Invoices raised for subscriptions.', add: 'New Invoice', idPrefix: 'INV-',
      statusOptions: ['Pending', 'Paid', 'Overdue', 'Draft'],
      cols: [
        { key: 'id', label: 'Invoice', strong: true }, { key: 'customer', label: 'Customer' },
        { key: 'amount', label: 'Amount', type: 'money' }, { key: 'due', label: 'Due Date', type: 'date' },
        { key: 'status', label: 'Status', type: 'badge' }
      ]
    },
    payments: {
      title: 'Payments', sub: 'Payments received from customers.', add: 'Record Payment', idPrefix: 'PAY-',
      statusOptions: ['Success', 'Pending', 'Failed', 'Refunded'],
      cols: [
        { key: 'id', label: 'Payment', strong: true }, { key: 'customer', label: 'Customer' },
        { key: 'method', label: 'Method' }, { key: 'amount', label: 'Amount', type: 'money' },
        { key: 'date', label: 'Date', type: 'date' }, { key: 'status', label: 'Status', type: 'badge' }
      ]
    }
  };

  var titles = {
    dashboard: ['Welcome back, Aarav', 'Here is what is happening with your subscriptions today.'],
    customers: [pages.customers.title, pages.customers.sub],
    products: [pages.products.title, pages.products.sub],
    plans: [pages.plans.title, pages.plans.sub],
    subscriptions: [pages.subscriptions.title, pages.subscriptions.sub],
    quotations: [pages.quotations.title, pages.quotations.sub],
    invoices: [pages.invoices.title, pages.invoices.sub],
    payments: [pages.payments.title, pages.payments.sub],
    reports: ['Reports', 'Quick business summary and data exports.'],
    settings: ['Settings', 'Manage your workspace preferences.']
  };

  var currentPage = 'dashboard';
  var modalKey = null;

  /* ---------- Table rendering ---------- */
  function badgeClass(v) {
    var map = {
      'Active': 'success', 'Paid': 'success', 'Success': 'success', 'Accepted': 'success',
      'Trial': 'info', 'Sent': 'info',
      'Pending': 'warning', 'Refunded': 'warning',
      'Past Due': 'danger', 'Overdue': 'danger', 'Failed': 'danger',
      'Draft': 'neutral', 'Cancelled': 'neutral', 'Expired': 'neutral'
    };
    return map[v] || 'neutral';
  }

  function cell(col, row) {
    var v = row[col.key];
    if (col.type === 'badge') return '<td><span class="badge ' + badgeClass(v) + '">' + esc(v) + '</span></td>';
    if (col.type === 'money') return '<td class="strong">' + inr(v) + '</td>';
    if (col.type === 'number') return '<td>' + Number(v).toLocaleString('en-IN') + '</td>';
    return '<td' + (col.strong ? ' class="strong"' : '') + '>' + esc(v) + '</td>';
  }

  function tableHTML(cols, rows) {
    var head = cols.map(function (c) { return '<th>' + esc(c.label) + '</th>'; }).join('');
    var body = rows.map(function (r) {
      return '<tr>' + cols.map(function (c) { return cell(c, r); }).join('') + '</tr>';
    }).join('');
    return '<table class="js-filter"><thead><tr>' + head + '</tr></thead><tbody>' + body + '</tbody></table>' +
           '<div class="empty" hidden>No matching records found.</div>';
  }

  function renderDashboardTables() {
    $('#recentSubs').innerHTML = tableHTML(
      [
        { key: 'customer', label: 'Customer', strong: true }, { key: 'plan', label: 'Plan' },
        { key: 'amount', label: 'Amount', type: 'money' }, { key: 'start', label: 'Start' },
        { key: 'status', label: 'Status', type: 'badge' }
      ],
      data.subscriptions.slice(0, 6)
    );
    $('#recentPays').innerHTML = tableHTML(
      [
        { key: 'id', label: 'Payment', strong: true }, { key: 'customer', label: 'Customer' },
        { key: 'method', label: 'Method' }, { key: 'amount', label: 'Amount', type: 'money' },
        { key: 'status', label: 'Status', type: 'badge' }
      ],
      data.payments.slice(0, 6)
    );
  }

  function renderGeneric(key) {
    var el = $('#page-generic');
    if (pages[key]) {
      var p = pages[key];
      el.innerHTML =
        '<div class="page-head"><div><h2>' + esc(p.title) + '</h2><p>' + esc(p.sub) + ' <span class="muted">(demonstration data)</span></p></div>' +
        '<div class="export-row">' +
        '<button class="btn btn-light" data-action="export" data-key="' + key + '"><i class="bi bi-download"></i> Export CSV</button>' +
        '<button class="btn btn-primary" data-action="add" data-key="' + key + '"><i class="bi bi-plus-lg"></i> ' + esc(p.add) + '</button>' +
        '</div></div>' +
        '<div class="card"><div class="table-wrap">' + tableHTML(p.cols, data[key]) + '</div></div>';
    } else if (key === 'reports') {
      el.innerHTML =
        '<div class="report-grid">' +
        '<div class="card"><span class="muted">Average revenue per account</span><span class="num">' + inr(999) + '</span><small class="kpi-trend up">Demo figure</small></div>' +
        '<div class="card"><span class="muted">Monthly churn rate</span><span class="num">2.4%</span><small class="kpi-trend down">Demo figure</small></div>' +
        '<div class="card"><span class="muted">Year-on-year growth</span><span class="num">62%</span><small class="kpi-trend up">Demo figure</small></div>' +
        '</div>' +
        '<div class="card"><div class="card-head"><h2>Export reports</h2><span class="muted">Downloads a CSV file of the demonstration data</span></div>' +
        '<div class="export-row">' +
        '<button class="btn btn-light" data-action="export" data-key="subscriptions"><i class="bi bi-download"></i> Subscriptions</button>' +
        '<button class="btn btn-light" data-action="export" data-key="invoices"><i class="bi bi-download"></i> Invoices</button>' +
        '<button class="btn btn-light" data-action="export" data-key="payments"><i class="bi bi-download"></i> Payments</button>' +
        '<button class="btn btn-light" data-action="export" data-key="customers"><i class="bi bi-download"></i> Customers</button>' +
        '</div></div>';
    } else if (key === 'settings') {
      el.innerHTML =
        '<div class="card settings-card"><div class="card-head"><h2>Workspace settings</h2></div>' +
        '<form id="settingsForm"><div class="form-grid">' +
        '<div class="field"><label for="setName">Business name</label><input id="setName" type="text" value="Brightloop Demo Pvt Ltd" required></div>' +
        '<div class="field"><label for="setEmail">Billing email</label><input id="setEmail" type="email" value="billing@brightloop.demo" required></div>' +
        '<div class="field"><label for="setCur">Currency</label><select id="setCur"><option>INR (\u20B9)</option><option>USD ($)</option><option>EUR (\u20AC)</option></select></div>' +
        '<div class="field"><label for="setTax">GST rate (%)</label><input id="setTax" type="number" min="0" max="40" value="18"></div>' +
        '</div>' +
        '<label class="check"><input type="checkbox" id="setNotif" checked> Email me about failed payments</label>' +
        '<label class="check"><input type="checkbox" id="setRemind" checked> Send invoice reminders automatically</label>' +
        '<div class="modal-actions"><button type="submit" class="btn btn-primary">Save settings</button></div>' +
        '</form></div>';
      $('#settingsForm').addEventListener('submit', function (e) {
        e.preventDefault();
        toast('Settings saved (demo only, nothing is stored).');
      });
    }
  }

  /* ---------- Navigation ---------- */
  function showPage(key) {
    if (!titles[key]) key = 'dashboard';
    currentPage = key;

    $$('.nav-item').forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-nav') === key);
    });

    $('#pageTitle').textContent = titles[key][0];
    $('#pageSub').textContent = titles[key][1];

    var isDash = key === 'dashboard';
    $('#page-dashboard').hidden = !isDash;
    $('#page-generic').hidden = isDash;
    if (!isDash) renderGeneric(key);

    $('#searchInput').value = '';
    closeDropdowns();
    closeSidebar();
    window.scrollTo(0, 0);
  }

  function openSidebar() { $('#sidebar').classList.add('open'); $('#overlay').classList.add('show'); }
  function closeSidebar() { $('#sidebar').classList.remove('open'); $('#overlay').classList.remove('show'); }

  /* ---------- Search ---------- */
  function applySearch(q) {
    q = q.trim().toLowerCase();
    var scope = currentPage === 'dashboard' ? $('#page-dashboard') : $('#page-generic');
    $$('table.js-filter', scope).forEach(function (table) {
      var visible = 0;
      $$('tbody tr', table).forEach(function (tr) {
        var show = !q || tr.textContent.toLowerCase().indexOf(q) !== -1;
        tr.style.display = show ? '' : 'none';
        if (show) visible++;
      });
      var empty = table.nextElementSibling;
      if (empty && empty.classList.contains('empty')) empty.hidden = visible !== 0;
    });
  }

  /* ---------- Dropdowns ---------- */
  function closeDropdowns() {
    $('#notifMenu').classList.remove('show');
    $('#profileMenu').classList.remove('show');
    $('#notifBtn').setAttribute('aria-expanded', 'false');
    $('#profileBtn').setAttribute('aria-expanded', 'false');
  }

  function toggleMenu(menuId, btnId) {
    var menu = $(menuId);
    var wasOpen = menu.classList.contains('show');
    closeDropdowns();
    if (!wasOpen) {
      menu.classList.add('show');
      $(btnId).setAttribute('aria-expanded', 'true');
    }
  }

  function renderNotifications() {
    var list = $('#notifList');
    list.innerHTML = notifications.map(function (n, i) {
      return '<button class="notif-item' + (n.unread ? ' unread' : '') + '" data-notif="' + i + '">' +
        '<span class="notif-icon"><i class="bi ' + n.icon + '"></i></span>' +
        '<span><strong>' + esc(n.title) + '</strong><span>' + esc(n.text) + '</span></span></button>';
    }).join('');
    var anyUnread = notifications.some(function (n) { return n.unread; });
    $('#notifDot').style.display = anyUnread ? '' : 'none';
  }

  /* ---------- Modal (add new record) ---------- */
  function openModal(key) {
    var p = pages[key];
    if (!p) return;
    modalKey = key;
    $('#modalTitle').textContent = p.add;
    var opts = p.statusOptions || STATUS_OPTIONS;

    $('#modalFields').innerHTML = p.cols.filter(function (c) { return c.key !== 'id'; }).map(function (c) {
      var id = 'f_' + c.key;
      var input;
      if (c.type === 'badge') {
        input = '<select id="' + id + '">' + opts.map(function (o) { return '<option>' + esc(o) + '</option>'; }).join('') + '</select>';
      } else if (c.type === 'money' || c.type === 'number') {
        input = '<input id="' + id + '" type="number" min="0" step="1" required>';
      } else {
        input = '<input id="' + id + '" type="text" required>';
      }
      return '<div class="field"><label for="' + id + '">' + esc(c.label) + '</label>' + input + '</div>';
    }).join('');

    $('#modal').hidden = false;
    var first = $('#modalFields input, #modalFields select');
    if (first) first.focus();
  }

  function closeModal() { $('#modal').hidden = true; modalKey = null; }

  function saveModal(e) {
    e.preventDefault();
    if (!modalKey) return;
    var p = pages[modalKey];
    var row = {};
    p.cols.forEach(function (c) {
      if (c.key === 'id') {
        var next = 1000 + data[modalKey].length + 1;
        row.id = p.idPrefix + next;
      } else {
        var v = $('#f_' + c.key).value;
        row[c.key] = (c.type === 'money' || c.type === 'number') ? Number(v) || 0 : v.trim();
      }
    });
    data[modalKey].unshift(row);
    var key = modalKey;
    closeModal();
    renderDashboardTables();
    if (currentPage === key) renderGeneric(key);
    toast('Record added (demo only, it will reset when you refresh).');
  }

  /* ---------- CSV export ---------- */
  function exportCSV(key) {
    var p = pages[key];
    if (!p) return;
    var lines = [p.cols.map(function (c) { return '"' + c.label + '"'; }).join(',')];
    data[key].forEach(function (r) {
      lines.push(p.cols.map(function (c) { return '"' + String(r[c.key]).replace(/"/g, '""') + '"'; }).join(','));
    });
    try {
      var blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'brightloop-demo-' + key + '.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(url); }, 500);
      toast('Exported demonstration data as CSV.');
    } catch (err) {
      toast('Download is blocked in this preview. Try opening the output in a new tab.');
    }
  }

  /* ---------- Charts ---------- */
  function buildCharts() {
    var revBox = $('#revenueChart');
    var stBox = $('#statusChart');
    if (typeof Chart === 'undefined') {
      [revBox, stBox].forEach(function (c) {
        c.parentNode.innerHTML = '<p class="muted">Chart library could not load. Check your internet connection and refresh.</p>';
      });
      return;
    }

    Chart.defaults.font.family = "'Inter', system-ui, sans-serif";
    Chart.defaults.color = '#64748b';

    var months = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
    var revenue = [520000, 550000, 590000, 610000, 640000, 680000, 700000, 730000, 760000, 790000, 820000, 845000];

    new Chart(revBox, {
      type: 'bar',
      data: {
        labels: months,
        datasets: [{
          label: 'Revenue',
          data: revenue,
          backgroundColor: function (ctx) { return ctx.dataIndex === revenue.length - 1 ? '#6d5dfc' : '#c4bdfd'; },
          hoverBackgroundColor: '#5647e5',
          borderRadius: 8,
          maxBarThickness: 34
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: function (c) { return ' ' + inr(c.parsed.y); } } }
        },
        scales: {
          x: { grid: { display: false } },
          y: {
            beginAtZero: true,
            grid: { color: '#eef0f6' },
            ticks: { callback: function (v) { return '\u20B9' + (v / 100000) + 'L'; } }
          }
        }
      }
    });

    new Chart(stBox, {
      type: 'doughnut',
      data: {
        labels: ['Active', 'Trial', 'Past Due', 'Cancelled'],
        datasets: [{
          data: [846, 142, 63, 199],
          backgroundColor: ['#6d5dfc', '#3b82f6', '#f59e0b', '#cbd5e1'],
          borderWidth: 2,
          borderColor: '#fff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '66%',
        plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, padding: 16 } } }
      }
    });
  }

  /* ---------- Events ---------- */
  document.addEventListener('click', function (e) {
    var t = e.target;

    // Close dropdowns when clicking outside them
    if (!t.closest('.dropdown')) closeDropdowns();

    var navBtn = t.closest('[data-nav]');
    if (navBtn) { showPage(navBtn.getAttribute('data-nav')); return; }

    var notifItem = t.closest('[data-notif]');
    if (notifItem) {
      var n = notifications[Number(notifItem.getAttribute('data-notif'))];
      if (n) { n.unread = false; renderNotifications(); showPage(n.page); }
      return;
    }

    var act = t.closest('[data-action]');
    if (!act) return;
    var action = act.getAttribute('data-action');
    var key = act.getAttribute('data-key');

    if (action === 'new-subscription') { showPage('subscriptions'); openModal('subscriptions'); }
    else if (action === 'add') { openModal(key); }
    else if (action === 'export') { exportCSV(key); }
    else if (action === 'export-subscriptions') { exportCSV('subscriptions'); }
    else if (action === 'profile') { closeDropdowns(); toast('Profile page is not part of this demo.'); }
    else if (action === 'signout') { closeDropdowns(); toast('Sign out is disabled in demo mode.'); }
  });

  $('#menuBtn').addEventListener('click', openSidebar);
  $('#overlay').addEventListener('click', closeSidebar);
  $('#notifBtn').addEventListener('click', function () { toggleMenu('#notifMenu', '#notifBtn'); });
  $('#profileBtn').addEventListener('click', function () { toggleMenu('#profileMenu', '#profileBtn'); });
  $('#markAllRead').addEventListener('click', function () {
    notifications.forEach(function (n) { n.unread = false; });
    renderNotifications();
    toast('All notifications marked as read.');
  });
  $('#searchInput').addEventListener('input', function (e) { applySearch(e.target.value); });
  $('#modalClose').addEventListener('click', closeModal);
  $('#modalCancel').addEventListener('click', closeModal);
  $('#modalForm').addEventListener('submit', saveModal);
  $('#modal').addEventListener('click', function (e) { if (e.target === $('#modal')) closeModal(); });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeDropdowns(); closeSidebar(); if (!$('#modal').hidden) closeModal(); }
  });

  window.addEventListener('resize', function () { if (window.innerWidth > 992) closeSidebar(); });

  /* ---------- Start ---------- */
  renderNotifications();
  renderDashboardTables();
  buildCharts();
})();