const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Load character data
const charactersPath = './data/characters.json';
let characters = require(charactersPath);

// Homepage (index)
app.get('/', (req, res) => {
    res.render('index');  // Make sure this renders the correct home page
});



// Info Page
app.get('/info', (req, res) => {
    res.render('info');
});

// Game Page
app.get('/game', (req, res) => {
    res.render('game');
});

// Character Page
app.get('/character', (req, res) => {
    res.render('character', { character: null, error: null });  // Initial state with no character
});

// Post Character Code
app.post('/character', (req, res) => {
    const code = req.body.characterCode;  // Ensure you're using the correct field name from the form
    console.log("Entered Code:", code);  // Log the entered code to check

    const character = characters.find(char => char.code === code);
    console.log("Found Character:", character);  // Log the found character or null

    if (character) {
        res.render('character', { character, error: null });
    } else {
        res.render('character', { character: null, error: "Code not found" });
    }
});


// Admin Page to Edit Characters
app.get('/admin', (req, res) => {
    res.render('admin', { characters });
});

// Add/Edit Character
app.post('/admin', (req, res) => {
    const { name, age, description, code } = req.body;
    const existingIndex = characters.findIndex(char => char.code === code);

    if (existingIndex !== -1) {
        // Update existing character
        characters[existingIndex] = { name, age, description, code };
    } else {
        // Add new character
        characters.push({ name, age, description, code });
    }

    // Save to file
    fs.writeFileSync(charactersPath, JSON.stringify(characters, null, 2));

    res.redirect('/admin');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});