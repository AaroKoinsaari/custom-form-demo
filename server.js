const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // Configure Express for JSON
app.use(express.static(__dirname));  // Serve static files from current directory

// Define route for the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Set CSP header for all routes to remove the CSP-issue in development environment
app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "default-src 'self'; img-src 'self' http://localhost:3000; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';");
    next();
});

// Define route for receiving and saving the data from the form
app.post('/submit-form', (req, res) => {
    const data = req.body;
    const filePath = path.join(__dirname, 'data.json');

    // Read existing data from the file, add new and save
    fs.readFile(filePath, (err, fileData) => {
        if (err && err.code === 'ENOENT') {
            // If the file doesn't exist create a new one
            fs.writeFile(filePath, JSON.stringify([data], null, 2), (err) => {
                if (err) throw err;
                res.send('Data saved successfully');
            });
        } else if (err) {
            throw err;
        } else {
            // If the file is found add the data to exisitng file 
            const json = JSON.parse(fileData);
            json.push(data);
            fs.writeFile(filePath, JSON.stringify(json, null, 2), (err) => {
                if (err) throw err;
                res.send('Data saved successfully');
            });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
