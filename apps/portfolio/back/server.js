import express, { text } from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';

const app = express();
const PORT = 5000;

// Environment variables
const AUTH_USER = process.env.AUTH_USER;
const AUTH_PASS = process.env.AUTH_PASS;
const INBOX = process.env.INBOX;

const corsOptions = {
    origin: [process.env.DOMAIN_1, process.env.DOMAIN_2, process.env.IPV4],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

app.post('/sendmail', (req, res) => {

    const pigeon = nodemailer.createTransport({
        host: 'webhost.dynadot.com',
        port: 587,
        //secure: false,
        auth: {
            user: AUTH_USER,
            pass: AUTH_PASS
        }
    });

    const mailOptions = {
        from: 'pigeon@trevorwheeler.com',
        to: INBOX,
        replyTo: req.body.email,
        subject: req.body.subject,
        html: `
        <p><strong>From:</strong> ${req.body.email}</p>
        <p><strong>Name:</strong> ${req.body.first} ${req.body.last}</p>

        ${req.body.body}`
    }

    pigeon.sendMail(mailOptions, (error, info) => {
        if (error) {
            res.send('error');
        }
        else {
            res.send('Success');
        }
    });

});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
});
