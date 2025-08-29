const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Configure Handlebars as the view engine
app.engine('handlebars', engine({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/partials')
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Serve static files (CSS, JS, images)
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.render('login', { 
        title: 'Log in - BBVA',
        pageId: 'login'
    });
});

app.get('/main-page', (req, res) => {
    res.render('main-page', { 
        title: 'Inicio - BBVA',
        pageId: 'main-page'
    });
});

app.get('/buzon', (req, res) => {
    res.render('buzon', { 
        title: 'Buzón - BBVA',
        pageId: 'buzon'
    });
});

app.get('/gestor', (req, res) => {
    res.render('gestor', { 
        title: 'Gestor - BBVA',
        pageId: 'gestor'
    });
});

app.get('/financiera', (req, res) => {
    res.render('financiera', { 
        title: 'Salud Financiera - BBVA',
        pageId: 'financiera'
    });
});

// Handle form submissions (you can expand these as needed)
app.post('/login', (req, res) => {
    // Handle login logic here
    res.redirect('/main-page');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
