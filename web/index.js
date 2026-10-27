const express = require('express');
const cors = require('cors');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ['*'],
}));

app.use(express.json());

app.post('/API108/Add_Calls_New', async (req, res, next) => {
    console.log();
    try {
        // Replace this with your target URL
        const targetUrl = 'https://web.taei.co.in/API108/Add_Calls_New';

        // Forward the same body, headers, and method
        const response = await axios.post(targetUrl, req.body, {
            timeout: 10000, // optional timeout
        });

        // Return the same response data from target
        res.status(response.status).json(response.data);

    } catch (e) {
        logger.error('Error forwarding Add_Calls_New request:', e.message);
        
        // Send back appropriate error
        if (e.response) {
            res.status(e.response.status).json(e.response.data);
        } else {
            res.status(500).json({ message: 'Error forwarding request', error: e.message });
        }

        next(e);
    }
});

// ✅ Serve static files from /web
app.use(express.static(path.join(__dirname, 'web')));

// ✅ Fallback route for Flutter SPA (regex instead of wildcard)
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'web', 'index.html'));
});

app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));