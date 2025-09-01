const express = require("express");
const session = require("express-session");
const { engine } = require("express-handlebars");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Device detection middleware
function detectDevice(req, res, next) {
  const userAgent = req.headers["user-agent"] || "";
  const isMobile =
    /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      userAgent
    );

  // Allow manual override via query parameter for testing
  if (req.query.device === "mobile") {
    req.isMobile = true;
  } else if (req.query.device === "desktop") {
    req.isMobile = false;
  } else {
    req.isMobile = isMobile;
  }

  // Set layout and view paths based on device
  if (req.isMobile) {
    req.layoutPath = "main";
    req.viewPrefix = "";
  } else {
    req.layoutPath = "desktop/main";
    req.viewPrefix = "desktop/";
  }

  next();
}

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
        if (amount === undefined || amount === null || isNaN(amount))
          return "0,00";
        const num = parseFloat(amount);
        return num.toFixed(2).replace(".", ",");
      },
    },
  })
);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Session configuration
app.use(
  session({
    secret: "bbva-admin-secret-key-2024",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }, // 24 hours
  })
);

// Middleware for parsing JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (CSS, JS, images)
app.use(express.static(path.join(__dirname, "public")));

// Apply device detection middleware to all routes
app.use(detectDevice);

// In-memory data store (in production, use a real database)
let appData = {
  users: [
    {
      id: 1,
      name: "TASIO",
      email: "tasio@email.com",
      phone: "+34 944 23 00 45",
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
ha
// Captcha functionality
function generateCaptcha() {
  const months = [
    { name: "january", pieces: ["jan", "u", "ary"] },
    { name: "february", pieces: ["febr", "u", "ary"] },
    { name: "march", pieces: ["m", "ar", "ch"] },
    { name: "april", pieces: ["a", "pr", "il"] },
    { name: "may", pieces: ["m", "a", "y"] },
    { name: "june", pieces: ["j", "un", "e"] },
    { name: "july", pieces: ["j", "ul", "y"] },
    { name: "august", pieces: ["au", "gu", "st"] },
    { name: "september", pieces: ["sep", "t", "ember"] },
    { name: "october", pieces: ["oct", "o", "ber"] },
    { name: "november", pieces: ["n", "ov", "ember"] },
    { name: "december", pieces: ["dec", "em", "ber"] },
  ];

  // Select a random month as the correct answer
  const correctMonth = months[Math.floor(Math.random() * months.length)];

  // Organize all pieces by position (first, second, third)
  const firstParts = [];
  const secondParts = [];
  const thirdParts = [];

  months.forEach((month) => {
    firstParts.push(month.pieces[0]);
    secondParts.push(month.pieces[1]);
    thirdParts.push(month.pieces[2]);
  });

  // Remove duplicates and shuffle each column
  const uniqueFirstParts = [...new Set(firstParts)].sort(
    () => Math.random() - 0.5
  );
  const uniqueSecondParts = [...new Set(secondParts)].sort(
    () => Math.random() - 0.5
  );
  const uniqueThirdParts = [...new Set(thirdParts)].sort(
    () => Math.random() - 0.5
  );

  // Ensure correct pieces are included in their respective columns
  if (!uniqueFirstParts.includes(correctMonth.pieces[0])) {
    uniqueFirstParts.push(correctMonth.pieces[0]);
  }
  if (!uniqueSecondParts.includes(correctMonth.pieces[1])) {
    uniqueSecondParts.push(correctMonth.pieces[1]);
  }
  if (!uniqueThirdParts.includes(correctMonth.pieces[2])) {
    uniqueThirdParts.push(correctMonth.pieces[2]);
  }

  // Final shuffle for each column
  const column1 = uniqueFirstParts.sort(() => Math.random() - 0.5);
  const column2 = uniqueSecondParts.sort(() => Math.random() - 0.5);
  const column3 = uniqueThirdParts.sort(() => Math.random() - 0.5);

  return {
    correctMonth: correctMonth.name,
    correctPieces: correctMonth.pieces,
    columns: {
      first: column1,
      second: column2,
      third: column3,
    },
    day: Math.floor(Math.random() * 28) + 1, // Random day 1-28
    year: Math.floor(Math.random() * 50) + 1970, // Random year 1970-2019
  };
}

// Routes
app.get("/", (req, res) => {
  res.render(`${req.viewPrefix}login`, {
    title: "Iniciar sesión - BBVA",
    pageId: "login",
    layout: req.layoutPath,
  });
});

app.get("/main-page", requireUserAuth, (req, res) => {
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
  const accountsWithTransactions = userAccounts.map((account) => {
    const accountTransactions = appData.transactions
      .filter((t) => t.accountId === account.id)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 3);

    return {
      ...account,
      recentTransactions: accountTransactions,
    };
  });

  const userCards = appData.cards.filter((card) => card.userId === user.id);
  const totalProducts = userAccounts.length + userCards.length;

  // Admin mode logic - only enable when explicitly requested
  let finalAdminMode = false;

  if (req.session.isAdmin) {
    if (req.query.admin === "true") {
      // Explicitly requested admin mode
      finalAdminMode = true;
      req.session.adminMode = true; // Store for this session
    } else if (req.query.admin === "false") {
      // Explicitly requested to disable admin mode
      finalAdminMode = false;
      req.session.adminMode = false;
    } else {
      // No query parameter - check if we're in the same session with admin mode
      // Only persist admin mode within the same browser session, not across new tabs
      finalAdminMode = false; // Default to false for new page loads
    }
  }

  res.render(`${req.viewPrefix}main-page`, {
    title: "Inicio - BBVA",
    pageId: "main-page",
    layout: req.layoutPath,
    user: user,
    account: mainAccount,
    transactions: recentTransactions,
    allAccounts: accountsWithTransactions, // All user accounts with their transactions
    allCards: userCards,
    totalProducts: totalProducts,
    showVisible: true,
    showRightIcons: true,
    isAdminMode: finalAdminMode, // Pass final admin mode to template
    formatAmount: (amount) =>
      amount >= 0 ? `+${amount.toFixed(2)}` : amount.toFixed(2),
  });
});

app.get("/buzon", requireUserAuth, (req, res) => {
  // Pass user data for consistent personalization
  const user = appData.users[0];
  res.render(`${req.viewPrefix}buzon`, {
    title: "Buzón - BBVA",
    pageId: "buzon",
    layout: req.layoutPath,
    user: user,
    showVisible: false,
    showRightIcons: false,
  });
});

app.get("/gestor", requireUserAuth, (req, res) => {
  // Pass user data to gestor page for dynamic profile display
  const user = appData.users[0];
  res.render(`${req.viewPrefix}gestor`, {
    title: "Gestor - BBVA",
    pageId: "gestor",
    layout: req.layoutPath,
    user: user,
    showVisible: false,
    showRightIcons: true,
  });
});

// Admin authentication middleware
function requireAdminAuth(req, res, next) {
  console.log("🔐 Admin auth check:", {
    path: req.path,
    method: req.method,
    sessionExists: !!req.session,
    isAdmin: req.session?.isAdmin,
    sessionId: req.session?.id,
  });

  if (req.session && req.session.isAdmin) {
    console.log("✅ Admin auth passed");
    return next();
  } else {
    console.log("❌ Admin auth failed - redirecting to /admin-login");
    return res.redirect("/admin-login");
  }
}

// Admin login routes
app.get("/admin-login", (req, res) => {
  if (req.session && req.session.isAdmin) {
    return res.redirect("/admin-panel");
  }

  // Generate captcha for the session
  const captcha = generateCaptcha();
  req.session.captcha = captcha;

  res.render("admin-login", {
    title: "Acceso Admin - BBVA",
    pageId: "admin-login",
    captcha: captcha,
  });
});

app.post("/admin-login", (req, res) => {
  const { password, column1, column2, column3, day, year } = req.body;
  const storedCaptcha = req.session.captcha;

  // Validate captcha first
  let captchaValid = false;
  if (storedCaptcha && column1 && column2 && column3) {
    const userSelection = [column1, column2, column3];
    const correctPieces = storedCaptcha.correctPieces;

    captchaValid =
      userSelection[0] === correctPieces[0] &&
      userSelection[1] === correctPieces[1] &&
      userSelection[2] === correctPieces[2];
  }

  // Validate password and captcha
  if (password === "123123" && captchaValid) {
    req.session.isAdmin = true;
    req.session.isLoggedIn = true; // Also set user as logged in to access main page
    req.session.captcha = null; // Clear captcha after successful login

    // Check if they want to access admin panel or inline editing
    const redirectTo =
      req.body.mode === "inline" ? "/main-page?admin=true" : "/admin-panel";
    res.redirect(redirectTo);
  } else {
    // Generate new captcha for retry
    const newCaptcha = generateCaptcha();
    req.session.captcha = newCaptcha;

    let errorMessage = "Error de verificación. ";
    if (password !== "123123") {
      errorMessage += "Contraseña incorrecta. ";
    }
    if (!captchaValid) {
      errorMessage += "Captcha incorrecto. ";
    }
    errorMessage += "Inténtalo de nuevo.";

    res.render("admin-login", {
      title: "Acceso Admin - BBVA",
      pageId: "admin-login",
      captcha: newCaptcha,
      error: errorMessage,
    });
  }
});

// Admin logout route
app.get("/admin-logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }
    res.redirect("/main-page");
  });
});

// Exit admin mode route (keep session but disable admin mode)
app.post("/api/exit-admin-mode", requireAdminAuth, (req, res) => {
  req.session.adminMode = false;
  res.json({ success: true, message: "Admin mode exited" });
});

// Toggle admin mode route
app.post("/api/toggle-admin-mode", requireAdminAuth, (req, res) => {
  const { enable } = req.body;
  req.session.adminMode = enable === true;
  res.json({
    success: true,
    adminMode: req.session.adminMode,
    message: req.session.adminMode
      ? "Admin mode activated"
      : "Admin mode deactivated",
  });
});

// Accounts and Cards route
app.get("/accounts", requireUserAuth, (req, res) => {
  const user = appData.users[0];
  const userAccounts = appData.accounts.filter((acc) => acc.userId === user.id);
  const userCards = appData.cards.filter((card) => card.userId === user.id);

  res.render(`${req.viewPrefix}accounts`, {
    title: "Accounts and Cards - BBVA",
    pageId: "accounts",
    layout: req.layoutPath,
    user: user,
    accounts: userAccounts,
    cards: userCards,
    isAdminMode: req.session.isAdminMode || false,
  });
});

// Mortgages and Loans route
app.get("/mortgages", requireUserAuth, (req, res) => {
  const user = appData.users[0];

  res.render(`${req.viewPrefix}mortgages`, {
    title: "Mortgages and Loans - BBVA",
    pageId: "mortgages",
    layout: req.layoutPath,
    user: user,
    isAdminMode: req.session.isAdminMode || false,
  });
});

// Transfers route
app.get("/transfers", requireUserAuth, (req, res) => {
  // Pass user data and transfers data
  const user = appData.users[0];
  const userAccounts = appData.accounts.filter((acc) => acc.userId === user.id);

  // Create sample transfers data (in a real app, this would come from the database)
  const transfers = appData.transactions.map((transaction) => {
    const account = appData.accounts.find(
      (acc) => acc.id === transaction.accountId
    );
    return {
      id: transaction.id,
      description: transaction.description,
      amount: Math.abs(transaction.amount),
      currency: transaction.currency,
      date: transaction.date,
      accountNumber: account ? account.accountNumber : "N/A",
      transferType: transaction.amount > 0 ? "received" : "sent",
      recipientName: transaction.amount > 0 ? "Remitente" : "Beneficiario",
      senderName: transaction.amount > 0 ? "Remitente" : "Beneficiario",
      status: "completed",
    };
  });

  res.render(`${req.viewPrefix}transfers`, {
    title: "Transferencias - BBVA",
    pageId: "transfers",
    layout: req.layoutPath,
    user: user,
    accounts: userAccounts,
    transfers: transfers,
    showVisible: true,
    showRightIcons: true,
  });
});

// Admin Panel Route (Protected)
app.get("/admin-panel", requireAdminAuth, (req, res) => {
  // Create sample transfers data for admin panel
  const transfers = appData.transactions.map((transaction) => {
    const account = appData.accounts.find(
      (acc) => acc.id === transaction.accountId
    );
    return {
      id: transaction.id,
      description: transaction.description,
      amount: Math.abs(transaction.amount),
      currency: transaction.currency,
      date: transaction.date,
      fromAccountId: transaction.accountId,
      recipientName:
        transaction.amount > 0 ? "Remitente Externo" : "Beneficiario Externo",
      recipientAccount:
        transaction.amount > 0
          ? "ES21 0000 0000 0000 0000 0000"
          : "ES21 1111 1111 1111 1111 1111",
      transferType: transaction.amount > 0 ? "received" : "sent",
      status: "completed",
    };
  });

  const adminData = {
    ...appData,
    transfers: transfers,
  };
  res.render("admin-panel", {
    title: "Panel de Administración - BBVA",
    pageId: "admin-panel",
    data: adminData,
    transfersCount: transfers.length,
  });
});

// CRUD API Routes for Admin Panel

// Test API endpoint (for debugging)
app.get("/api/test", (req, res) => {
  console.log("🧪 Test API endpoint hit");
  res.json({ message: "API is working", timestamp: new Date().toISOString() });
});

// Real-time field update API for inline editing
app.put("/api/update-field", requireAdminAuth, (req, res) => {
  console.log("🎯 PUT /api/update-field endpoint hit!");
  console.log("👤 Admin auth status:", req.session.isAdmin);
  console.log("📦 Request body:", req.body);

  const { entity, id, field, value } = req.body;
  console.log("🔄 Update request received:", { entity, id, field, value });

  try {
    switch (entity) {
      case "user":
        const userIndex = appData.users.findIndex((u) => u.id === parseInt(id));
        if (userIndex !== -1) {
          console.log("📝 Before update:", appData.users[userIndex][field]);
          appData.users[userIndex][field] = value;
          console.log("✅ After update:", appData.users[userIndex][field]);
          res.json({
            success: true,
            message: "User updated successfully",
            newValue: value,
          });
        } else {
          res.status(404).json({ error: "User not found" });
        }
        break;

      case "account":
        const accountIndex = appData.accounts.findIndex(
          (a) => a.id === parseInt(id)
        );
        if (accountIndex !== -1) {
          console.log(
            "📝 Before account update:",
            appData.accounts[accountIndex][field]
          );
          // Special handling for numeric fields
          if (field === "balance") {
            appData.accounts[accountIndex][field] = parseFloat(value);
          } else if (field === "userId") {
            appData.accounts[accountIndex][field] = parseInt(value);
          } else {
            appData.accounts[accountIndex][field] = value;
          }
          console.log(
            "✅ After account update:",
            appData.accounts[accountIndex][field]
          );
          res.json({
            success: true,
            message: "Account updated successfully",
            newValue: appData.accounts[accountIndex][field],
          });
        } else {
          res.status(404).json({ error: "Account not found" });
        }
        break;

      case "card":
        const cardIndex = appData.cards.findIndex((c) => c.id === parseInt(id));
        if (cardIndex !== -1) {
          console.log(
            "📝 Before card update:",
            appData.cards[cardIndex][field]
          );
          // Special handling for numeric fields
          if (field === "limit") {
            appData.cards[cardIndex][field] = parseFloat(value);
          } else if (field === "userId") {
            appData.cards[cardIndex][field] = parseInt(value);
          } else {
            appData.cards[cardIndex][field] = value;
          }
          console.log("✅ After card update:", appData.cards[cardIndex][field]);
          res.json({
            success: true,
            message: "Card updated successfully",
            newValue: appData.cards[cardIndex][field],
          });
        } else {
          res.status(404).json({ error: "Card not found" });
        }
        break;

      case "transaction":
        const transactionIndex = appData.transactions.findIndex(
          (t) => t.id === parseInt(id)
        );
        if (transactionIndex !== -1) {
          const oldTransaction = appData.transactions[transactionIndex];
          console.log("📝 Before transaction update:", oldTransaction[field]);

          // Special handling for numeric fields
          if (field === "amount") {
            const newAmount = parseFloat(value);
            // Update account balance if amount changed
            const account = appData.accounts.find(
              (a) => a.id === oldTransaction.accountId
            );
            if (account) {
              console.log(
                "💰 Updating account balance:",
                account.balance,
                "->",
                account.balance - oldTransaction.amount + newAmount
              );
              account.balance =
                account.balance - oldTransaction.amount + newAmount;
            }
            appData.transactions[transactionIndex][field] = newAmount;
          } else if (field === "accountId") {
            appData.transactions[transactionIndex][field] = parseInt(value);
          } else if (field === "date") {
            appData.transactions[transactionIndex][field] = new Date(value);
          } else {
            appData.transactions[transactionIndex][field] = value;
          }
          console.log(
            "✅ After transaction update:",
            appData.transactions[transactionIndex][field]
          );
          res.json({
            success: true,
            message: "Transaction updated successfully",
            newValue: appData.transactions[transactionIndex][field],
          });
        } else {
          res.status(404).json({ error: "Transaction not found" });
        }
        break;

      default:
        res.status(400).json({ error: "Invalid entity type" });
    }
  } catch (error) {
    console.error("Error updating field:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Users CRUD
app.get("/api/users", requireAdminAuth, (req, res) => {
  res.json(appData.users);
});

app.post("/api/users", requireAdminAuth, (req, res) => {
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

app.put("/api/users/:id", requireAdminAuth, (req, res) => {
  const userId = parseInt(req.params.id);
  const userIndex = appData.users.findIndex((u) => u.id === userId);
  if (userIndex === -1)
    return res.status(404).json({ error: "User not found" });

  appData.users[userIndex] = { ...appData.users[userIndex], ...req.body };
  res.json(appData.users[userIndex]);
});

app.delete("/api/users/:id", requireAdminAuth, (req, res) => {
  const userId = parseInt(req.params.id);
  const userIndex = appData.users.findIndex((u) => u.id === userId);
  if (userIndex === -1)
    return res.status(404).json({ error: "User not found" });

  appData.users.splice(userIndex, 1);
  res.json({ message: "User deleted successfully" });
});

// Accounts CRUD
app.get("/api/accounts", requireAdminAuth, (req, res) => {
  res.json(appData.accounts);
});

app.post("/api/accounts", requireAdminAuth, (req, res) => {
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

app.put("/api/accounts/:id", requireAdminAuth, (req, res) => {
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

app.delete("/api/accounts/:id", requireAdminAuth, (req, res) => {
  const accountId = parseInt(req.params.id);
  const accountIndex = appData.accounts.findIndex((a) => a.id === accountId);
  if (accountIndex === -1)
    return res.status(404).json({ error: "Account not found" });

  appData.accounts.splice(accountIndex, 1);
  res.json({ message: "Account deleted successfully" });
});

// Cards CRUD
app.get("/api/cards", requireAdminAuth, (req, res) => {
  res.json(appData.cards);
});

app.post("/api/cards", requireAdminAuth, (req, res) => {
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

app.put("/api/cards/:id", requireAdminAuth, (req, res) => {
  const cardId = parseInt(req.params.id);
  const cardIndex = appData.cards.findIndex((c) => c.id === cardId);
  if (cardIndex === -1)
    return res.status(404).json({ error: "Card not found" });

  if (req.body.limit) req.body.limit = parseFloat(req.body.limit);
  if (req.body.userId) req.body.userId = parseInt(req.body.userId);

  appData.cards[cardIndex] = { ...appData.cards[cardIndex], ...req.body };
  res.json(appData.cards[cardIndex]);
});

app.delete("/api/cards/:id", requireAdminAuth, (req, res) => {
  const cardId = parseInt(req.params.id);
  const cardIndex = appData.cards.findIndex((c) => c.id === cardId);
  if (cardIndex === -1)
    return res.status(404).json({ error: "Card not found" });

  appData.cards.splice(cardIndex, 1);
  res.json({ message: "Card deleted successfully" });
});

// Transactions CRUD
app.get("/api/transactions", requireAdminAuth, (req, res) => {
  res.json(appData.transactions);
});

app.post("/api/transactions", requireAdminAuth, (req, res) => {
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

app.put("/api/transactions/:id", requireAdminAuth, (req, res) => {
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

app.delete("/api/transactions/:id", requireAdminAuth, (req, res) => {
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

// User authentication middleware
function requireUserAuth(req, res, next) {
  if (req.session && req.session.isLoggedIn) {
    return next();
  } else {
    return res.redirect("/");
  }
}

// User login route
app.post("/login", (req, res) => {
  const { userid, password } = req.body;

  // Check if credentials match the specified ones
  if (userid === "123123" && password === "123123") {
    req.session.isLoggedIn = true;
    req.session.userId = userid;
    res.redirect("/main-page");
  } else {
    res.render("login", {
      title: "Iniciar sesión - BBVA",
      pageId: "login",
      // error: "Credenciales incorrectas. Por favor, inténtalo de nuevo.",
    });
  }
});

// User logout route
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }
    res.redirect("/");
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
