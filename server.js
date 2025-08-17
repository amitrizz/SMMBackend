const express = require("express");
const app = express();
const PORT = 3000;
const { generatePDFWithTOC } = require('./englishReportGenrate.js');

const cors = require("cors");

// Allow requests from anywhere
app.use(cors());

app.get("/", async (req, res) => {


    const pdfPath = await generatePDFWithTOC();
    res.download(pdfPath, "MyDocument.pdf", (err) => {
        if (err) {
            console.error("Error while downloading file:", err);
            res.status(500).send("Error downloading the file.");
        }
    });
});



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
