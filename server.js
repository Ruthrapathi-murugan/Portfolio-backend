require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    },
    tls: {
        rejectUnauthorized: false // This option prevents SSL issues with certain Gmail configurations
    }
});




// Allow requests from your frontend domain
const corsOptions = {
  origin: 'https://ruthrapathi-info.netlify.app', // Your frontend URL
  methods: ['GET', 'POST'], // Add other HTTP methods as needed
  credentials: true, // Enable this if you are sending cookies or authentication tokens
};

app.use(cors(corsOptions));

app.options('*', cors(corsOptions)); // Allow preflight requests from all routes
app.use(cors());


// POST route to handle contact form submission
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;

    // Log the incoming request body to check the data
    console.log('Received form data:', req.body);

    if (!name || !email || !message) {
        console.log('Missing fields');
        return res.status(400).json({ message: 'All fields are required' });
    }

    const mailOptions = {
        from: email,
        to: process.env.EMAIL,
        subject: `New Contact Form Submission from  ${name}`,
        text: `You have received a new message from ${name}.\n\nMessage: ${message}\n\nEmail: ${email}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error while sending email:', error); // Log the actual error
            return res.status(500).json({ message: 'Error sending email', error });
        } else {
            console.log('Email sent:', info.response);
            return res.status(200).json({ message: 'Email sent successfully', info });
        }
    });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

