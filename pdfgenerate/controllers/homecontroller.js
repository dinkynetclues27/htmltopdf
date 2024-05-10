const fs = require('fs');
const pdf = require('pdf-creator-node');
const path = require('path');
const nodemailer = require('nodemailer');
const options = require('../helpers/options');
const data = require('../helpers/data');

const homeview = (req, res, next) => {
    res.render('home');
}

const generatepdf = async (req, res, next) => {
    const html = fs.readFileSync(path.join(__dirname, '../views/template.html'), 'utf-8');
    const filename = Math.random() + '_doc' + '.pdf';

    let array = [];
    data.forEach(d => {
        const prod = {
            name: d.name,
            description: d.description,
            unit: d.unit,
            quantity: d.quantity,
            price: d.price,
            total: d.quantity * d.price
        }
        array.push(prod);
    });
    let subtotal = 0;
    array.forEach(i => {
        subtotal += i.total
    });
    const tax = (subtotal * 20) / 100;
    const grandtotal = subtotal - tax;
    const obj = {
        prodlist: array,
        subtotal: subtotal,
        tax: tax,
        gtotal: grandtotal
    }

    const document = {
        html: html,
        data: {
            products: obj
        },
        path: './docs/' + filename
    }
    pdf.create(document, options)
        .then(result => {
            console.log('PDF created:', result);
            sendEmail(result.filename);
        })
        .catch(error => {
            console.log('Error creating PDF:', error);
            res.status(500).send('Error generating PDF');
        });

    function sendEmail(attachmentPath) {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: "your email", 
                pass: "your password",
            },
        });

        let mailOptions = {
            from: "from password", 
            to: "to password", 
            subject: 'PDF Attachment',
            text: 'Please find the attached PDF.',
            attachments: [
                {
                    filename: 'generated_pdf.pdf',
                    path: attachmentPath,
                },
            ],
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return;
            }
            console.log('Email sent:', info.response);
        });
    }

    const filepath = 'http://localhost:4000/docs/' + filename;
    res.render('download', {
        path: filepath
    });
}

module.exports = { homeview, generatepdf };
