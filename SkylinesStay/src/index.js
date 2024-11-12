const express = require("express");
const path = require("path");
const LogInCollection = require("./mongo");
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const tempelatePath = path.join(__dirname, '../tempelates');
const publicPath = path.join(__dirname, '../public');

app.set('view engine', 'hbs');
app.set('views', tempelatePath);
app.use(express.static(publicPath));

// Routes
app.get('/signup', (req, res) => {
    res.render('signup');
});

app.get('/', (req, res) => {
    res.render('login');
});

app.post('/signup', async (req, res) => {
    const data = {
        name: req.body.name,
        password: req.body.password
    };

    try {
        const checking = await LogInCollection.findOne({ name: req.body.name });

        if (checking) {
            // User already exists
            return res.send("User details already exist");
        }

        await LogInCollection.insertMany([data]);
        // User registered successfully
        return res.status(201).render("home", { naming: req.body.name });

    } catch (error) {
        console.error("Error in signup route:", error);
        return res.status(500).send("An error occurred while processing your request.");
    }
});

app.post('/login', async (req, res) => {
    try {
        const check = await LogInCollection.findOne({ name: req.body.name });

        if (!check || check.password !== req.body.password) {
            return res.send("Incorrect password or user not found");
        }

        // Successful login
        return res.status(201).render("home", { naming: `${req.body.password}+${req.body.name}` });

    } catch (error) {
        console.error("Error in login route:", error);
        return res.status(500).send("An error occurred while processing your request.");
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
