const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// In a real app, this would be a database
const DB = {
    tricks: [
         { id: 1, user: "PixelWizard", avatar: "https://i.pravatar.cc/100?u=wizard", trick: "Use `console.table()` to display an array of objects in a clean, readable table.", code: "const pets = [\n  { name: 'Foxy', type: 'Fox' },\n  { name: 'Whiskers', type: 'Cat' }\n];\nconsole.table(pets);", likes: 42 },
         { id: 2, user: "CSSDruid", avatar: "https://i.pravatar.cc/100?u=druid", trick: "To perfectly center a div, just use Grid! It's the modern and easiest way.", code: ".parent-container {\n  display: grid;\n  place-items: center;\n}", likes: 77 },
         { id: 3, user: "JSMage", avatar: "https://i.pravatar.cc/100?u=mage", trick: "You can destructure arrays to swap variables without a temporary one!", code: "let a = 1;\nlet b = 2;\n[a, b] = [b, a]; // a is now 2, b is now 1", likes: 103 }
    ],
};

// API Endpoint to get all the coding tricks
app.get('/api/tricks', (req, res) => {
    console.log("Request received for /api/tricks");
    res.json(DB.tricks);
});

// ===== ADD THIS NEW ENDPOINT TO HANDLE POSTING =====
app.post('/api/tricks', (req, res) => {
    console.log("Received a POST request to create a trick.");
    console.log("Data from frontend:", req.body);

    // Create a new trick object from the frontend data
    const newTrick = {
        id: Date.now(), // Create a unique ID
        // In a real app, user info would come from a login session
        user: "CoderJane", 
        avatar: "https://i.pravatar.cc/100?u=user123",
        trick: req.body.trick,
        code: req.body.code,
        likes: 0 // New posts start with 0 likes
    };

    // Add the new trick to the start of our database array
    DB.tricks.unshift(newTrick);

    // Respond to the frontend to say it was successful
    res.status(201).json(newTrick);
});
// ==================================================
app.listen(PORT, () => {
    console.log(`Code Critters backend is listening at http://localhost:${PORT}`);
});