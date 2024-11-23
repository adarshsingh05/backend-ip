const express = require('express');
const cors = require('cors');
const app = express();

// List of allowed frontend URLs
const allowedOrigins = [
  "https://frontend-ip-8pew.vercel.app",
  "http://localhost:3000",
  "https://yet-another-url.com"
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (allowedOrigins.includes(origin)) {
        callback(null, true); // Allow the request
      } else {
        callback(new Error("Not allowed by CORS")); // Reject the request
      }
    },
    methods: "GET,POST", // Restrict to allowed methods
    credentials: true, // Allow cookies or credentials if required
  })
);




  // app.use(cors()); // Allow requests from any origin

let visitorData = []; // Store visitor IPs

// Route to get the public IP address
app.get('/api/ip', (req, res) => {
    const userIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const formattedIp = userIp.includes('::ffff:') ? userIp.split('::ffff:')[1] : userIp;

    // Log and store the visitor's IP address
    visitorData.push({ ip: formattedIp, timestamp: new Date().toISOString() });
    console.log(`Visitor IP: ${formattedIp}`);

    res.json({ ip: formattedIp });
});

// Route to get all logged visitor data
app.get('/api/visitors', (req, res) => {
    res.json(visitorData);
});
app.listen(9000, () => console.log('Server running on port 9000'));

module.exports = app;
