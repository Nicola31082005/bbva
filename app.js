const express = require("express");
const session = require("express-session");
const { engine } = require("express-handlebars");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Device detection middleware
function detectDevice(req, res, next) {
  const userAgent = req.headers['user-agent'] || '';
  const isMobile = /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  
  // Allow manual override via query parameter for testing
  // Support both 'device=mobile' and 'mobile' query parameters
  if (req.query.device === 'mobile' || req.query.mobile !== undefined) {
    req.isMobile = true;
  } else if (req.query.device === 'desktop') {
    req.isMobile = false;
  } else {
    req.isMobile = isMobile;
  }
  
  // Set layout and view paths based on device
  if (req.isMobile) {
    req.layoutPath = 'main';
    req.viewPrefix = '';
  } else {
    req.layoutPath = 'desktop/main';
    req.viewPrefix = 'desktop/';
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
  // Desktop-specific data for handlebars templates
  desktopData: {
    mainPage: {
      id: 1,
      welcomeMessage: "Good afternoon, TASIO",
      lastConnection: "Last connection 09/01/2025 at 16:07",
      totalBalance: "400.06 €",
      contactTeam: "Contigo Team",
      contactPhone: "944 23 00 45",
      appointmentText: "Request teller appointment",
      balanceLabel: "AT BBVA YOU HAVE:",
      showAmountsLabel: "Show amounts",
      customizeText: "Customize Global Position",
      productsTitle: "Explore all the products you can take out",
      fastTransactionsTitle: "FAST TRANSACTIONS",
      operationsTitle: "Perform an operation",
      operationsSubtitle: "IMPORTANT ACTIVITY"
    },
    accounts: {
      id: 1,
      pageTitle: "Accounts and Cards",
      accountNumber: "ES2901825297280203028464",
      accountType: "CUENTAS PERSONALES",
      accountHolder: "ACCOUNT HOLDER",
      currentBalance: "400.06 €",
      availableBalance: "400.06€",
      cardNumber: "4188202159055886",
      cardStatus: "PENDING ACTIVATION",
      cardType: "TARJETAS DE DÉBITO",
      contactTeam: "Contigo Team",
      contactPhone: "944230045",
      appointmentText: "Request teller appointment",
      transfersTitle: "Next scheduled transfers and internal transfers",
      productSuggestion: "Do you want to take out a product?"
    },
    gestor: {
      id: 1,
      pageTitle: "My Profile",
      welcomeSubtitle: "Personal banking services",
      servicesTitle: "Services",
      consultationTitle: "Consultation",
      consultationDescription: "Financial advice and guidance",
      investmentsTitle: "Investments", 
      investmentsDescription: "Investment planning services",
      mortgagesTitle: "Mortgages",
      mortgagesDescription: "Home financing solutions",
      accountsTitle: "Accounts",
      accountsDescription: "Account setup and management",
      insuranceTitle: "Insurance",
      insuranceDescription: "Asset protection services",
      supportTitle: "Support",
      supportDescription: "24/7 banking assistance",
      assistantTitle: "Blue BBVA",
      assistantDescription: "Virtual assistant available 24/7 for banking queries.",
      contactTitle: "Need Immediate Help?",
      contactPhone: "944 23 00 45",
      profileSummaryTitle: "Profile Summary"
    },
    transfers: {
      id: 1,
      operationsTitle: "Perform an operation",
      operationsSubtitle: "IMPORTANT ACTIVITY"
    },
    mortgages: {
      id: 1,
      pageTitle: "Mortgages and Loans",
      availableProductsTitle: "Available Products",
      calculatorTitle: "Loan Calculator",
      contactTitle: "Need Help?",
      contactDescription: "Our mortgage and loan specialists are here to help you find the best solution for your needs.",
      contactPhone: "944 23 00 45"
    },
    fastActions: [
      { id: 1, label: "Check CVV", icon: "card" },
      { id: 2, label: "Manage a transfer", icon: "transfer" },
      { id: 3, label: "View PIN", icon: "pin" },
      { id: 4, label: "Send / Receive money (Bizum)", icon: "bizum" }
    ],
    operations: [
      {
        id: 1,
        title: "Transfers to other banks and transfers within the bank",
        description: "You can make a domestic transfer and send your money immediately, on a one-off basis or scheduled.",
        linkText: "Make a transfer to another bank or transfer within the bank"
      },
      {
        id: 2,
        title: "Send / Request Bizum",
        description: "All you need is your cell phone to send money to a friend, shop online or donate to the cause of your choice.",
        linkText: "Go to Bizum"
      },
      {
        id: 3,
        title: "International transfer",
        description: "In foreign currency to more than 31 countries and with a preferential exchange rate.",
        linkText: "Make an international transfer"
      },
      {
        id: 4,
        title: "Activate and deactivate your cards",
        description: "Securely control the use of your cards by turning them on (activating) or off (deactivating).",
        linkText: "Limit card operations"
      },
      {
        id: 5,
        title: "Split an expense",
        description: "Finance your purchases, payments or transfers and pay in a more convenient and flexible way.",
        linkText: "Split an expense"
      },
      {
        id: 6,
        title: "Transfer from account to card",
        description: "For when you want to settle a payment or take advantage of the benefits of using the card.",
        linkText: "Transfer from account to card"
      }
    ],
    mortgageProducts: [
      {
        id: 1,
        title: "Home Mortgage",
        description: "Finance your dream home with competitive interest rates.",
        features: ["Up to 80% financing", "Fixed and variable rates", "Up to 30 years term"]
      },
      {
        id: 2,
        title: "Personal Loan",
        description: "Quick approval for your personal projects and needs.",
        features: ["Up to €60,000", "Fast approval process", "Flexible repayment terms"]
      },
      {
        id: 3,
        title: "Car Loan",
        description: "Finance your new or used vehicle with special rates.",
        features: ["Up to 100% financing", "Competitive rates", "Up to 8 years term"]
      },
      {
        id: 4,
        title: "Home Improvement Loan",
        description: "Renovate and improve your home with our special financing.",
        features: ["Up to €50,000", "No collateral required", "Quick processing"]
      }
    ]
  }
};

// Helper function to get next ID
function getNextId(arrayName) {
  const items = appData[arrayName];
  return items.length > 0 ? Math.max(...items.map((item) => item.id)) + 1 : 1;
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

  // Handle message parameter for notifications
  let message = null;
  if (req.query.message === "admin-desktop-only") {
    message = {
      type: "warning",
      text: "El Panel de Administración solo está disponible en dispositivos desktop. Usa la Edición en Línea para editar desde móvil."
    };
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
    message: message, // Pass message for notifications
    // Pass desktop-specific data for desktop templates
    desktopData: appData.desktopData,
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
    desktopData: appData.desktopData,
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
    return res.redirect("/admin-wysiwyg");
  }
  res.render("admin-login", {
    title: "Acceso Admin - BBVA",
    pageId: "admin-login",
  });
});

app.post("/admin-login", (req, res) => {
  const { password } = req.body;

  if (password === "123123") {
    req.session.isAdmin = true;
    req.session.isLoggedIn = true; // Also set user as logged in to access main page
    
    // Check if they want to access admin panel or inline editing
    const redirectTo =
      req.body.mode === "inline" ? "/main-page?admin=true" : "/admin-wysiwyg";
    
    // If trying to access admin panel from mobile, redirect to main page with message
    if (redirectTo === "/admin-wysiwyg" && req.isMobile) {
      console.log("📱 Mobile user attempted admin panel access, redirecting to main page");
      return res.redirect("/main-page?message=admin-desktop-only");
    }
    
    res.redirect(redirectTo);
  } else {
    res.render("admin-login", {
      title: "Acceso Admin - BBVA",
      pageId: "admin-login",
      error: "Contraseña incorrecta. Inténtalo de nuevo.",
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
    // Pass desktop-specific data for desktop templates
    desktopData: appData.desktopData,
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
    // Pass desktop-specific data for desktop templates
    desktopData: appData.desktopData,
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
    // Pass desktop-specific data for desktop templates
    desktopData: appData.desktopData,
  });
});

// WYSIWYG Admin Mode Route (Protected) - Desktop Only
app.get("/admin-wysiwyg", requireAdminAuth, (req, res) => {
  console.log("🖥️ WYSIWYG Admin mode accessed:", {
    isMobile: req.isMobile,
    userAgent: req.headers['user-agent']
  });

  // Redirect mobile users to main page with message
  if (req.isMobile) {
    console.log("📱 Mobile user redirected from WYSIWYG admin");
    return res.redirect("/main-page?message=admin-desktop-only");
  }

  // Get user data for the WYSIWYG interface
  const user = appData.users[0];
  const userAccounts = appData.accounts.filter((acc) => acc.userId === user.id);
  const mainAccount = userAccounts[0];
  const recentTransactions = appData.transactions
    .filter((t) => t.accountId === mainAccount.id)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);

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

  res.render("desktop/main-page", {
    title: "WYSIWYG Admin - BBVA",
    pageId: "main-page",
    layout: "desktop/main",
    user: user,
    account: mainAccount,
    transactions: recentTransactions,
    allAccounts: accountsWithTransactions,
    allCards: userCards,
    totalProducts: totalProducts,
    showVisible: true,
    showRightIcons: true,
    isAdminMode: false,
    isWysiwygMode: true, // New flag for WYSIWYG mode
    desktopData: appData.desktopData,
    formatAmount: (amount) =>
      amount >= 0 ? `+${amount.toFixed(2)}` : amount.toFixed(2),
  });
});

// WYSIWYG Admin Routes for other pages
app.get("/admin-wysiwyg/gestor", requireAdminAuth, (req, res) => {
  console.log("🖥️ WYSIWYG Admin gestor page accessed");

  if (req.isMobile) {
    return res.redirect("/main-page?message=admin-desktop-only");
  }

  const user = appData.users[0];

  res.render("desktop/gestor", {
    title: "WYSIWYG Admin - Gestor - BBVA",
    pageId: "gestor",
    layout: "desktop/main",
    user: user,
    isAdminMode: false,
    isWysiwygMode: true,
    desktopData: appData.desktopData,
  });
});
app.get("/admin-wysiwyg/accounts", requireAdminAuth, (req, res) => {
  console.log("🖥️ WYSIWYG Admin accounts page accessed");

  if (req.isMobile) {
    return res.redirect("/main-page?message=admin-desktop-only");
  }

  const user = appData.users[0];
  const userAccounts = appData.accounts.filter((acc) => acc.userId === user.id);
  const userCards = appData.cards.filter((card) => card.userId === user.id);

  res.render("desktop/accounts", {
    title: "WYSIWYG Admin - Accounts - BBVA",
    pageId: "accounts",
    layout: "desktop/main",
    user: user,
    accounts: userAccounts,
    cards: userCards,
    isAdminMode: false,
    isWysiwygMode: true,
    desktopData: appData.desktopData,
  });
});



// Admin Panel Route (Protected) - Redirect to WYSIWYG
app.get("/admin-panel", requireAdminAuth, (req, res) => {
  console.log("🖥️ Admin panel accessed - redirecting to WYSIWYG mode");
  
  // Redirect mobile users to main page with message
  if (req.isMobile) {
    console.log("📱 Mobile user redirected from admin panel");
    return res.redirect("/main-page?message=admin-desktop-only");
  }

  // Redirect to WYSIWYG admin mode
  res.redirect("/admin-wysiwyg");
});

// CRUD API Routes for Admin Panel

// Desktop data API endpoint
app.get("/api/desktop-data", (req, res) => {
  res.json({
    desktopData: appData.desktopData
  });
});

// Update desktop content API endpoint
app.put("/api/desktop-content", (req, res) => {
  try {
    const { page, ...updates } = req.body;
    
    if (!page) {
      return res.status(400).json({ error: "Page parameter is required" });
    }
    
    console.log(`📝 Updating desktop content for page: ${page}`, updates);
    
    // Update the appropriate page data - only update fields that are provided
    if (page === 'mainPage') {
      const pageData = appData.desktopData.mainPage;
      
      // Map WYSIWYG field names to actual data field names
      if (updates.welcomeMessage !== undefined) pageData.welcomeMessage = updates.welcomeMessage;
      if (updates.lastConnection !== undefined) pageData.lastConnection = updates.lastConnection;
      if (updates.totalBalance !== undefined) pageData.totalBalance = updates.totalBalance;
      if (updates.contactPhone !== undefined) pageData.contactPhone = updates.contactPhone;
      if (updates.contactTeam !== undefined) pageData.contactTeam = updates.contactTeam;
      if (updates.appointmentText !== undefined) pageData.appointmentText = updates.appointmentText;
      if (updates.balanceLabel !== undefined) pageData.balanceLabel = updates.balanceLabel;
      if (updates.fastTransactionsTitle !== undefined) pageData.fastTransactionsTitle = updates.fastTransactionsTitle;
      if (updates.operationsTitle !== undefined) pageData.operationsTitle = updates.operationsTitle;
      if (updates.operationsSubtitle !== undefined) pageData.operationsSubtitle = updates.operationsSubtitle;
      
    } else if (page === 'accounts') {
      const pageData = appData.desktopData.accounts;
      
      if (updates.welcomeMessage !== undefined) pageData.pageTitle = updates.welcomeMessage;
      if (updates.lastConnection !== undefined) pageData.accountNumber = updates.lastConnection;
      if (updates.totalBalance !== undefined) {
        pageData.currentBalance = updates.totalBalance;
        pageData.availableBalance = updates.totalBalance;
      }
      if (updates.availableBalance !== undefined) pageData.availableBalance = updates.availableBalance;
      if (updates.accountType !== undefined) pageData.accountType = updates.accountType;
      if (updates.accountHolder !== undefined) pageData.accountHolder = updates.accountHolder;
      if (updates.cardNumber !== undefined) pageData.cardNumber = updates.cardNumber;
      if (updates.cardStatus !== undefined) pageData.cardStatus = updates.cardStatus;
      if (updates.cardType !== undefined) pageData.cardType = updates.cardType;
      if (updates.transfersTitle !== undefined) pageData.transfersTitle = updates.transfersTitle;
      if (updates.productSuggestion !== undefined) pageData.productSuggestion = updates.productSuggestion;
      if (updates.contactPhone !== undefined) pageData.contactPhone = updates.contactPhone;
      if (updates.contactTeam !== undefined) pageData.contactTeam = updates.contactTeam;
      if (updates.appointmentText !== undefined) pageData.appointmentText = updates.appointmentText;
      
    } else if (page === 'gestor') {
      const pageData = appData.desktopData.gestor;
      
      if (updates.welcomeMessage !== undefined) pageData.pageTitle = updates.welcomeMessage;
      if (updates.lastConnection !== undefined) pageData.welcomeSubtitle = updates.lastConnection;
      if (updates.servicesTitle !== undefined) pageData.servicesTitle = updates.servicesTitle;
      if (updates.consultationTitle !== undefined) pageData.consultationTitle = updates.consultationTitle;
      if (updates.consultationDescription !== undefined) pageData.consultationDescription = updates.consultationDescription;
      if (updates.assistantTitle !== undefined) pageData.assistantTitle = updates.assistantTitle;
      if (updates.assistantDescription !== undefined) pageData.assistantDescription = updates.assistantDescription;
      if (updates.contactTitle !== undefined) pageData.contactTitle = updates.contactTitle;
      if (updates.contactPhone !== undefined) pageData.contactPhone = updates.contactPhone;
      
    } else if (page === 'mortgages') {
      const pageData = appData.desktopData.mortgages;
      
      if (updates.welcomeMessage !== undefined) pageData.pageTitle = updates.welcomeMessage;
      if (updates.lastConnection !== undefined) pageData.contactDescription = updates.lastConnection;
      if (updates.availableProductsTitle !== undefined) pageData.availableProductsTitle = updates.availableProductsTitle;
      if (updates.calculatorTitle !== undefined) pageData.calculatorTitle = updates.calculatorTitle;
      if (updates.contactTitle !== undefined) pageData.contactTitle = updates.contactTitle;
      if (updates.contactPhone !== undefined) pageData.contactPhone = updates.contactPhone;
    }
    
    console.log(`✅ Desktop content updated successfully for page: ${page}`);
    res.json({ success: true, message: "Desktop content updated successfully" });
  } catch (error) {
    console.error("Error updating desktop content:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update operations API endpoint
app.put("/api/desktop-operations/:id", (req, res) => {
  try {
    const operationId = parseInt(req.params.id);
    const updates = req.body;
    
    const operationIndex = appData.desktopData.operations.findIndex(op => op.id === operationId);
    if (operationIndex === -1) {
      return res.status(404).json({ error: "Operation not found" });
    }
    
    console.log(`📝 Updating operation ${operationId}:`, updates);
    
    // Only update fields that are provided
    const operation = appData.desktopData.operations[operationIndex];
    if (updates.title !== undefined) operation.title = updates.title;
    if (updates.description !== undefined) operation.description = updates.description;
    if (updates.linkText !== undefined) operation.linkText = updates.linkText;
    
    console.log(`✅ Operation updated successfully: ${operationId}`);
    res.json({ success: true, message: "Operation updated successfully" });
  } catch (error) {
    console.error("Error updating operation:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add new operation API endpoint
app.post("/api/desktop-operations", (req, res) => {
  try {
    const { title, description, linkText } = req.body;
    
    const newId = Math.max(...appData.desktopData.operations.map(op => op.id)) + 1;
    const newOperation = {
      id: newId,
      title,
      description,
      linkText
    };
    
    appData.desktopData.operations.push(newOperation);
    
    console.log(`📝 New operation added: ${newId}`);
    res.json({ success: true, message: "Operation added successfully", operation: newOperation });
  } catch (error) {
    console.error("Error adding operation:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete operation API endpoint
app.delete("/api/desktop-operations/:id", (req, res) => {
  try {
    const operationId = parseInt(req.params.id);
    
    const operationIndex = appData.desktopData.operations.findIndex(op => op.id === operationId);
    if (operationIndex === -1) {
      return res.status(404).json({ error: "Operation not found" });
    }
    
    appData.desktopData.operations.splice(operationIndex, 1);
    
    console.log(`🗑️ Operation deleted: ${operationId}`);
    res.json({ success: true, message: "Operation deleted successfully" });
  } catch (error) {
    console.error("Error deleting operation:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update mortgage product API endpoint
app.put("/api/desktop-mortgage-products/:id", (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const updates = req.body;
    
    const productIndex = appData.desktopData.mortgageProducts.findIndex(prod => prod.id === productId);
    if (productIndex === -1) {
      return res.status(404).json({ error: "Mortgage product not found" });
    }
    
    console.log(`📝 Updating mortgage product ${productId}:`, updates);
    
    // Only update fields that are provided
    const product = appData.desktopData.mortgageProducts[productIndex];
    if (updates.title !== undefined) product.title = updates.title;
    if (updates.description !== undefined) product.description = updates.description;
    if (updates.features !== undefined) product.features = updates.features;
    
    console.log(`✅ Mortgage product updated successfully: ${productId}`);
    res.json({ success: true, message: "Mortgage product updated successfully" });
  } catch (error) {
    console.error("Error updating mortgage product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add new mortgage product API endpoint
app.post("/api/desktop-mortgage-products", (req, res) => {
  try {
    const { title, description, features } = req.body;
    
    const newId = Math.max(...appData.desktopData.mortgageProducts.map(prod => prod.id)) + 1;
    const newProduct = {
      id: newId,
      title,
      description,
      features
    };
    
    appData.desktopData.mortgageProducts.push(newProduct);
    
    console.log(`📝 New mortgage product added: ${newId}`);
    res.json({ success: true, message: "Mortgage product added successfully", product: newProduct });
  } catch (error) {
    console.error("Error adding mortgage product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete mortgage product API endpoint
app.delete("/api/desktop-mortgage-products/:id", (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    
    const productIndex = appData.desktopData.mortgageProducts.findIndex(prod => prod.id === productId);
    if (productIndex === -1) {
      return res.status(404).json({ error: "Mortgage product not found" });
    }
    
    appData.desktopData.mortgageProducts.splice(productIndex, 1);
    
    console.log(`🗑️ Mortgage product deleted: ${productId}`);
    res.json({ success: true, message: "Mortgage product deleted successfully" });
  } catch (error) {
    console.error("Error deleting mortgage product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

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
    // Preserve mobile query parameter in redirect to login
    const redirectUrl = req.isMobile ? "/?mobile" : "/";
    return res.redirect(redirectUrl);
  }
}

// User login route
app.post("/login", (req, res) => {
  const { userid, password } = req.body;

  // Check if credentials match the specified ones
  if (userid === "123123" && password === "123123") {
    req.session.isLoggedIn = true;
    req.session.userId = userid;
    
    // Preserve mobile query parameter in redirect
    const redirectUrl = req.isMobile ? "/main-page?mobile" : "/main-page";
    res.redirect(redirectUrl);
  } else {
    res.render(`${req.viewPrefix}login`, {
      title: "Iniciar sesión - BBVA",
      pageId: "login",
      layout: req.layoutPath,
      error: "Credenciales incorrectas. Por favor, inténtalo de nuevo.",
    });
  }
});

// User logout route
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }
    // Preserve mobile query parameter in redirect to login
    const redirectUrl = req.isMobile ? "/?mobile" : "/";
    res.redirect(redirectUrl);
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
