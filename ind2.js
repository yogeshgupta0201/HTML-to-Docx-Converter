const fs = require('fs');
const express = require('express');
const multer = require('multer');
const path = require('path'); // Import the path module
const app = express();
const port = 3000;

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.get("/about.html", (req, res) => {
    res.sendFile(__dirname + "/about.html");
});

app.get("/contact.html", (req, res) => {
    res.sendFile(__dirname + "/contact.html");
});

app.get('/style.css', (req, res) => {
    res.sendFile(__dirname + '/style.css');
});



const upload = multer({ dest: './history' });

app.post('/convert', upload.single('htmlFile'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file was uploaded.');
    }

    // Define the path where you want to save the file
    const outputPath = path.join(__dirname, 'output', 'converted.docx'); // Use path.join to create an absolute path

    // Rename and move the uploaded file to the desired location
    fs.renameSync(req.file.path, outputPath);

    // Set the response headers to indicate a file download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', 'attachment; filename="converted.docx"');

    // Send the file as the response
    res.sendFile(outputPath); // Provide the absolute path
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
