// const express = require('express');
// const multer  = require('multer');
// const puppeteer = require('puppeteer');
// const fs = require('fs');

// const app = express();
// const upload = multer({ dest: 'uploads/' });

// app.get('/', (req, res) => {
//   res.send(`
//     <form action="/upload" method="post" enctype="multipart/form-data">
//       <input type="file" name="htmlFile" />
//       <button type="submit">Upload</button>
//     </form>
//   `);
// });


// app.post('/upload', upload.single('htmlFile'), async (req, res) => {
//   try {
//     const htmlFilePath = req.file.path;
//     const htmlContent = fs.readFileSync(htmlFilePath, 'utf8');
    
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
    
//     await page.setContent(htmlContent);
    
//     const pdfBuffer = await page.pdf({ format: 'A4' });
    
//     res.set('Content-Type', 'application/pdf');
//     res.send(pdfBuffer);
    
//     await browser.close();
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).send('Error converting HTML to PDF');
//   }
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });


const express = require('express');
const multer = require('multer');
const puppeteer = require('puppeteer');
const fs = require('fs');
const nodemailer = require('nodemailer');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.get('/', (req, res) => {
  res.send(`
    <form action="/upload" method="post" enctype="multipart/form-data">
      <input type="file" name="htmlFile" />
      <button type="submit">Upload</button>
    </form>
  `);
});

app.post('/upload', upload.single('htmlFile'), async (req, res) => {
  try {
    const htmlFilePath = req.file.path;
    const htmlContent = fs.readFileSync(htmlFilePath, 'utf8');

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(htmlContent);

    const pdfBuffer = await page.pdf({ format: 'A4' });

    await sendEmail(pdfBuffer);

    res.set('Content-Type', 'application/pdf');
    res.send(pdfBuffer);

    await browser.close();
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error converting HTML to PDF');
  }
});

async function sendEmail(pdfBuffer) {
  try {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: "your email", 
        pass: "your password",

      },
    });

    let mailOptions = {
        from: "from email", 
        to: "to email", 
      subject: 'PDF Attachment',
      text: 'Please find the attached PDF.',
      attachments: [
        {
          filename: 'generated_pdf.pdf',
          content: pdfBuffer,
        },
      ],
    };

    let info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
