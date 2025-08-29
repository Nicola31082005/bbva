const express = require("express");
const { engine } = require("express-handlebars");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Configure Handlebars as the view engine
app.engine(
  "handlebars",
  engine({
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "views/layouts"),
    partialsDir: path.join(__dirname, "views/partials"),
    helpers: {
      eq: (a, b) => a === b,
      gt: (a, b) => a > b,
      formatDate: (date) => {
        if (!date) return "";
        const d = new Date(date);
        return d.toLocaleDateString("es-ES", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      },
      formatAmount: (amount) => {
        if (amount === undefined || amount === null || isNaN(amount)) return "0,00";
        const num = parseFloat(amount);
        return num.toFixed(2).replace(".", ",");
      },
    },
  })
);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Middleware for parsing JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (CSS, JS, images)
app.use(express.static(path.join(__dirname, "public")));

// In-memory data store (in production, use a real database)
let appData = {
  users: [
    {
      id: 1,
      name: "Juan Pérez",
      email: "juan.perez@email.com",
      phone: "+34 612 345 678",
      status: "active",
    },
  ],
  accounts: [
    {
      id: 1,
      userId: 1,
      accountNumber: "*8464",
      balance: 400.06,
      currency: "€",
      type: "Cuenta corriente",
      status: "active",
    },
    {
      id: 2,
      userId: 1,
      accountNumber: "*1234",
      balance: 1250.3,
      currency: "€",
      type: "Cuenta de ahorro",
      status: "active",
    },
  ],
  cards: [
    {
      id: 1,
      userId: 1,
      cardNumber: "**** **** **** 1234",
      type: "Débito",
      status: "active",
      limit: 600.0,
      currency: "€",
    },
    {
      id: 2,
      userId: 1,
      cardNumber: "**** **** **** 5678",
      type: "Crédito",
      status: "active",
      limit: 3000.0,
      currency: "€",
    },
  ],
  transactions: [
    {
      id: 1,
      accountId: 1,
      type: "credit",
      description: "Transferencia recibida",
      amount: 400.0,
      currency: "€",
      date: new Date("2024-01-15"),
    },
    {
      id: 2,
      accountId: 1,
      type: "debit",
      description: "Transferencia realizada",
      amount: -400.0,
      currency: "€",
      date: new Date("2024-01-14"),
    },
    {
      id: 3,
      accountId: 1,
      type: "credit",
      description: "Abono por transferencia a su favor",
      amount: 400.0,
      currency: "€",
      date: new Date("2024-01-13"),
    },
    {
      id: 4,
      accountId: 2,
      type: "credit",
      description: "Depósito mensual",
      amount: 1000.0,
      currency: "€",
      date: new Date("2024-01-12"),
    },
  ],
  currencies: [
    { code: "€", name: "Euro", symbol: "€" },
    { code: "USD", name: "US Dollar", symbol: "$" },
    { code: "GBP", name: "British Pound", symbol: "£" },
  ],
};

// Helper function to get next ID
function getNextId(arrayName) {
  const items = appData[arrayName];
  return items.length > 0 ? Math.max(...items.map((item) => item.id)) + 1 : 1;
}

// Routes
app.get("/", (req, res) => {
  res.render("login", {
    title: "Log in - BBVA",
    pageId: "login",
  });
});

app.get("/main-page", (req, res) => {
  // Single user banking app - always use the first (and only) user
  const user = appData.users[0];
  const userAccounts = appData.accounts.filter((acc) => acc.userId === user.id);
  const mainAccount = userAccounts[0]; // Primary account for display

  // Get recent transactions for the main account
  const recentTransactions = appData.transactions
    .filter((t) => t.accountId === mainAccount.id)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);

  // Add transactions to each account
  const accountsWithTransactions = userAccounts.map(account => {
    const accountTransactions = appData.transactions
      .filter(t => t.accountId === account.id)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 3);
    
    return {
      ...account,
      recentTransactions: accountTransactions
    };
  });

  const userCards = appData.cards.filter((card) => card.userId === user.id);
  const totalProducts = userAccounts.length + userCards.length;

  res.render("main-page", {
    title: "Inicio - BBVA",
    pageId: "main-page",
    user: user,
    account: mainAccount,
    transactions: recentTransactions,
    allAccounts: accountsWithTransactions, // All user accounts with their transactions
    allCards: userCards,
    totalProducts: totalProducts,
    formatAmount: (amount) =>
      amount >= 0 ? `+${amount.toFixed(2)}` : amount.toFixed(2),
  });
});

app.get("/buzon", (req, res) => {
  // Pass user data for consistent personalization
  const user = appData.users[0];
  res.render("buzon", {
    title: "Buzón - BBVA",
    pageId: "buzon",
    user: user,
  });
});

app.get("/gestor", (req, res) => {
  // Pass user data to gestor page for dynamic profile display
  const user = appData.users[0];
  res.render("gestor", {
    title: "Gestor - BBVA",
    pageId: "gestor",
    user: user,
  });
});

app.get("/financiera", (req, res) => {
  // Pass user data for consistent personalization
  const user = appData.users[0];
  res.render("financiera", {
    title: "Salud Financiera - BBVA",
    pageId: "financiera",
    user: user,
  });
});

app.get("/transfers", (req, res) => {
  // Pass user data and transfers data
  const user = appData.users[0];
  const userAccounts = appData.accounts.filter((acc) => acc.userId === user.id);
  
  // Create sample transfers data (in a real app, this would come from the database)
  const transfers = appData.transactions.map(transaction => {
    const account = appData.accounts.find(acc => acc.id === transaction.accountId);
    return {
      id: transaction.id,
      description: transaction.description,
      amount: Math.abs(transaction.amount),
      currency: transaction.currency,
      date: transaction.date,
      accountNumber: account ? account.accountNumber : 'N/A',
      transferType: transaction.amount > 0 ? 'received' : 'sent',
      recipientName: transaction.amount > 0 ? 'Remitente' : 'Beneficiario',
      senderName: transaction.amount > 0 ? 'Remitente' : 'Beneficiario',
      status: 'completed'
    };
  });
  
  res.render("transfers", {
    title: "Transferencias - BBVA",
    pageId: "transfers",
    user: user,
    accounts: userAccounts,
    transfers: transfers,
  });
});

// Admin Panel Route
app.get("/admin-panel", (req, res) => {
  // Create sample transfers data for admin panel
  const transfers = appData.transactions.map(transaction => {
    const account = appData.accounts.find(acc => acc.id === transaction.accountId);
    return {
      id: transaction.id,
      description: transaction.description,
      amount: Math.abs(transaction.amount),
      currency: transaction.currency,
      date: transaction.date,
      fromAccountId: transaction.accountId,
      recipientName: transaction.amount > 0 ? 'Remitente Externo' : 'Beneficiario Externo',
      recipientAccount: transaction.amount > 0 ? 'ES21 0000 0000 0000 0000 0000' : 'ES21 1111 1111 1111 1111 1111',
      transferType: transaction.amount > 0 ? 'received' : 'sent',
      status: 'completed'
    };
  });

  const adminData = {
    ...appData,
    transfers: transfers
  };

  res.render("admin-panel", {
    title: "Panel de Administración - BBVA",
    pageId: "admin-panel",
    data: adminData,
    transfersCount: transfers.length,
  });
});

// CRUD API Routes for Admin Panel

// Users CRUD
app.get("/api/users", (req, res) => {
  res.json(appData.users);
});

app.post("/api/users", (req, res) => {
  const newUser = {
    id: getNextId("users"),
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    status: req.body.status || "active",
  };
  appData.users.push(newUser);
  res.json(newUser);
});

app.put("/api/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const userIndex = appData.users.findIndex((u) => u.id === userId);
  if (userIndex === -1)
    return res.status(404).json({ error: "User not found" });

  appData.users[userIndex] = { ...appData.users[userIndex], ...req.body };
  res.json(appData.users[userIndex]);
});

app.delete("/api/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const userIndex = appData.users.findIndex((u) => u.id === userId);
  if (userIndex === -1)
    return res.status(404).json({ error: "User not found" });

  appData.users.splice(userIndex, 1);
  res.json({ message: "User deleted successfully" });
});

// Accounts CRUD
app.get("/api/accounts", (req, res) => {
  res.json(appData.accounts);
});

app.post("/api/accounts", (req, res) => {
  const newAccount = {
    id: getNextId("accounts"),
    userId: parseInt(req.body.userId),
    accountNumber: req.body.accountNumber,
    balance: parseFloat(req.body.balance),
    currency: req.body.currency,
    type: req.body.type,
    status: req.body.status || "active",
  };
  appData.accounts.push(newAccount);
  res.json(newAccount);
});

app.put("/api/accounts/:id", (req, res) => {
  const accountId = parseInt(req.params.id);
  const accountIndex = appData.accounts.findIndex((a) => a.id === accountId);
  if (accountIndex === -1)
    return res.status(404).json({ error: "Account not found" });

  if (req.body.balance) req.body.balance = parseFloat(req.body.balance);
  if (req.body.userId) req.body.userId = parseInt(req.body.userId);

  appData.accounts[accountIndex] = {
    ...appData.accounts[accountIndex],
    ...req.body,
  };
  res.json(appData.accounts[accountIndex]);
});

app.delete("/api/accounts/:id", (req, res) => {
  const accountId = parseInt(req.params.id);
  const accountIndex = appData.accounts.findIndex((a) => a.id === accountId);
  if (accountIndex === -1)
    return res.status(404).json({ error: "Account not found" });

  appData.accounts.splice(accountIndex, 1);
  res.json({ message: "Account deleted successfully" });
});

// Cards CRUD
app.get("/api/cards", (req, res) => {
  res.json(appData.cards);
});

app.post("/api/cards", (req, res) => {
  const newCard = {
    id: getNextId("cards"),
    userId: parseInt(req.body.userId),
    cardNumber: req.body.cardNumber,
    type: req.body.type,
    status: req.body.status || "active",
    limit: parseFloat(req.body.limit),
    currency: req.body.currency,
  };
  appData.cards.push(newCard);
  res.json(newCard);
});

app.put("/api/cards/:id", (req, res) => {
  const cardId = parseInt(req.params.id);
  const cardIndex = appData.cards.findIndex((c) => c.id === cardId);
  if (cardIndex === -1)
    return res.status(404).json({ error: "Card not found" });

  if (req.body.limit) req.body.limit = parseFloat(req.body.limit);
  if (req.body.userId) req.body.userId = parseInt(req.body.userId);

  appData.cards[cardIndex] = { ...appData.cards[cardIndex], ...req.body };
  res.json(appData.cards[cardIndex]);
});

app.delete("/api/cards/:id", (req, res) => {
  const cardId = parseInt(req.params.id);
  const cardIndex = appData.cards.findIndex((c) => c.id === cardId);
  if (cardIndex === -1)
    return res.status(404).json({ error: "Card not found" });

  appData.cards.splice(cardIndex, 1);
  res.json({ message: "Card deleted successfully" });
});

// Transactions CRUD
app.get("/api/transactions", (req, res) => {
  res.json(appData.transactions);
});

app.post("/api/transactions", (req, res) => {
  const newTransaction = {
    id: getNextId("transactions"),
    accountId: parseInt(req.body.accountId),
    type: req.body.type,
    description: req.body.description,
    amount: parseFloat(req.body.amount),
    currency: req.body.currency,
    date: new Date(req.body.date || Date.now()),
  };
  appData.transactions.push(newTransaction);

  // Update account balance
  const account = appData.accounts.find(
    (a) => a.id === newTransaction.accountId
  );
  if (account) {
    account.balance += newTransaction.amount;
  }

  res.json(newTransaction);
});

app.put("/api/transactions/:id", (req, res) => {
  const transactionId = parseInt(req.params.id);
  const transactionIndex = appData.transactions.findIndex(
    (t) => t.id === transactionId
  );
  if (transactionIndex === -1)
    return res.status(404).json({ error: "Transaction not found" });

  const oldTransaction = appData.transactions[transactionIndex];

  if (req.body.amount) req.body.amount = parseFloat(req.body.amount);
  if (req.body.accountId) req.body.accountId = parseInt(req.body.accountId);
  if (req.body.date) req.body.date = new Date(req.body.date);

  // Update account balance if amount changed
  if (
    req.body.amount !== undefined &&
    req.body.amount !== oldTransaction.amount
  ) {
    const account = appData.accounts.find(
      (a) => a.id === oldTransaction.accountId
    );
    if (account) {
      account.balance =
        account.balance - oldTransaction.amount + req.body.amount;
    }
  }

  appData.transactions[transactionIndex] = { ...oldTransaction, ...req.body };
  res.json(appData.transactions[transactionIndex]);
});

app.delete("/api/transactions/:id", (req, res) => {
  const transactionId = parseInt(req.params.id);
  const transactionIndex = appData.transactions.findIndex(
    (t) => t.id === transactionId
  );
  if (transactionIndex === -1)
    return res.status(404).json({ error: "Transaction not found" });

  const transaction = appData.transactions[transactionIndex];

  // Update account balance
  const account = appData.accounts.find((a) => a.id === transaction.accountId);
  if (account) {
    account.balance -= transaction.amount;
  }

  appData.transactions.splice(transactionIndex, 1);
  res.json({ message: "Transaction deleted successfully" });
});

// Handle form submissions (you can expand these as needed)
app.post("/login", (req, res) => {
  // Handle login logic here
  res.redirect("/main-page");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
