
const express = require('express');
const multer = require('multer');
const stream = require('stream');
// const blobUtil = require('blob-util');
const fs = require('fs');
const htmlToDocx = require('html-docx-js');
const app = express();
const port = 3000;

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/body.html");
});

const upload = multer({ dest: './history' });

app.post('/convert', upload.single('htmlFile'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file was uploaded.');
    }
    
    const htmlContent = fs.readFileSync(req.file.path, 'utf-8');
    const docxBlob = htmlToDocx.asBlob(htmlContent);

    console.log(htmlContent);
    // Set the response headers to indicate a file download

// Assuming 'docxBlob' is your Blob
const blobToBuffer = async (blob) => {
  const reader = new stream.Readable();
  reader._read = () => {};
  reader.push(blob);
  reader.push(null);

  const chunks = [];
  for await (const chunk of reader) {
    chunks.push(chunk);
  }

  return Buffer.concat(chunks);
};

// Usage
blobToBuffer(docxBlob)
  .then(buffer => {
    // Define the path where you want to save the file
    const outputPath = 'output/converted.docx';

    // Write the Buffer to the file
    fs.writeFileSync(outputPath, buffer);
    console.log('File saved successfully.');
  })
  .catch(error => {
    console.error('Error saving file:', error);
  });



    // const buffer = blobUtil.bufferFromBlob(docxBuffer);
    // const outputPath = 'output/converted.docx';
    // fs.writeFileSync(outputPath, buffer);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', 'attachment; filename="converted.docx"');

    // Send the DOCX buffer as the response
    res.send(docxBlob);

    // Clean up: Delete the temporary DOCX file
    fs.unlinkSync(req.file.path);
});

app.listen(port, () => {
    console.log('Server is running on http://localhost:${port}');
});