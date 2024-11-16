const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
const https = require('https');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// UAT and Production API endpoints
const UAT_ENDPOINT = 'https://121.240.36.237/TIN/PanInquiryAPIBackEnd';
const PROD_ENDPOINT = 'https://opvapi.egov-nsdl.com/TIN/PanInquiryAPIBackEnd';

// Use only UAT endpoint for development/testing purposes
const apiUrl = UAT_ENDPOINT;

// Create an HTTPS agent to bypass SSL validation for the UAT endpoint (for development only)
const httpsAgent = new https.Agent({
    rejectUnauthorized: false, // Disable SSL certificate validation
});

// PAN Validation Route
app.post('/validate-pan', async (req, res) => {
    const { pan } = req.body;

    if (!pan) {
        return res.status(400).json({ error: 'PAN is required.' });
    }

    try {
        const response = await axios.post(
            apiUrl,
            { pan },
            { httpsAgent } // Use the custom HTTPS agent for UAT
        );
        res.json(response.data);
    } catch (error) {
        res.status(500).json({
            error: 'API call failed.',
            details: error.response?.data || error.message,
        });
    }
});

// Start server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
