# BBVA Express App

A BBVA banking application built with Express.js and Handlebars templating engine.

## Features

- **Login Page** (`/login`) - User authentication interface
- **Main Dashboard** (`/main-page`) - Account overview and recent transactions
- **Mailbox** (`/buzon`) - Messages and notifications center
- **Manager** (`/gestor`) - Customer service and support
- **Financial Health** (`/financiera`) - Asset management and financial overview

## Project Structure

```
bbva/
├── app.js                 # Main Express application
├── package.json           # Dependencies and scripts
├── views/
│   ├── layouts/
│   │   └── main.handlebars    # Main layout template
│   ├── login.handlebars       # Login page
│   ├── main-page.handlebars   # Dashboard page
│   ├── buzon.handlebars       # Mailbox page
│   ├── gestor.handlebars      # Manager page
│   └── financiera.handlebars  # Financial health page
└── public/
    └── css/
        ├── login.css          # Login page styles
        ├── main-page.css      # Dashboard styles
        ├── buzon.css          # Mailbox styles
        ├── gestor.css         # Manager styles
        └── financiera.css     # Financial health styles
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Or start the production server:
```bash
npm start
```

## Usage

- Navigate to `http://localhost:3000` to access the login page
- Use the navigation between different sections:
  - `/login` - Login page
  - `/main-page` - Main dashboard
  - `/buzon` - Mailbox
  - `/gestor` - Manager/Support
  - `/financiera` - Financial health

## Technologies Used

- **Express.js** - Web framework
- **Handlebars** - Templating engine
- **CSS3** - Styling with CSS custom properties
- **SVG Icons** - Scalable vector graphics for UI elements

## Development

The application uses:
- Handlebars for server-side rendering
- CSS custom properties for consistent theming
- Responsive design principles
- BBVA brand colors and styling

## Routes

- `GET /` - Redirects to login
- `GET /login` - Login page
- `POST /login` - Handle login form submission
- `GET /main-page` - Main dashboard
- `GET /buzon` - Mailbox page
- `GET /gestor` - Manager page
- `GET /financiera` - Financial health page
