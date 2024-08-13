const express = require("express")
const multer = require("multer")
const path = require("path")
const fs = require("fs")
const cors = require("cors")

const app = express()
const port = 3003 // Use port 80 or another port if necessary

// Enable CORS for development purposes
app.use(cors())

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, "uploads")
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir)
        }
        cb(null, uploadDir)
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)) // Append timestamp to file name
    },
})

const upload = multer({ storage })

// Serve static files from the 'uploads' directory
app.use("/files", express.static(path.join(__dirname, "uploads")))

// Route to handle file uploads
app.post("/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" })
    }
    res.json({
        fileUrl: `http://${req.headers.host}/files/${req.file.filename}`,
    })
})

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
})
