const AWS = require('aws-sdk');
const nodemailer = require('nodemailer');

const secretsManager = new AWS.SecretsManager();

exports.handler = async (event, context) => {
  const { bookTitle, bookOwnerEmail, userEmail } = JSON.parse(event.body);

  try {
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SecretsManager.html#getSecretValue-property
    // Reference: To retrieve the encrypted secret value of a secret
    const secretName = 'smSecret'; 
    const secret = await secretsManager.getSecretValue({ SecretId: secretName }).promise();
    const { email, password } = JSON.parse(secret.SecretString);

    // https://nodemailer.com/smtp/
    // Reference: SMTP TRANSPORT
    const transporter = nodemailer.createTransport({
      service: 'Gmail', 
      auth: {
        user: email, 
        pass: password, 
      },
    });

    // https://nodemailer.com/about/
    // Reference: Nodemailer features
    const mailOptions = {
      from: email, 
      to: bookOwnerEmail, 
      subject: 'Take Request for Book', 
      text: `User with email ${userEmail} is interested in taking your book "${bookTitle}".`, // Email body
    };

    
    const info = await transporter.sendMail(mailOptions);

    console.log('Email sent:', info.response);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email sent successfully' }),
    };
  } catch (error) {
    console.error('Error sending email:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error sending email' }),
    };
  }
};
