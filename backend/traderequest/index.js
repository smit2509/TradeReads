const AWS = require('aws-sdk');
const nodemailer = require('nodemailer');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS();
const secretsManager = new AWS.SecretsManager();

const tableName = 'books'; 

exports.handler = async (event, context) => {
  const { bookId1, bookId2 } = JSON.parse(event.body);

  try {
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SecretsManager.html#getSecretValue-property
    // Reference: To retrieve the encrypted secret value of a secret
    const secretName = 'smSecret'; 
    const secret = await secretsManager.getSecretValue({ SecretId: secretName }).promise();
    const { email, password } = JSON.parse(secret.SecretString);

    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#getItem-property
    // Reference: To read an item from a table
    const params1 = {
      TableName: tableName,
      Key: { book_id: bookId1 },
    };

    const res1 = await dynamodb.get(params1).promise();
    const book1 = res1.Item;

    
    const params2 = {
      TableName: tableName,
      Key: { book_id: bookId2 },
    };

    const res2 = await dynamodb.get(params2).promise();
    const book2 = res2.Item;

    
    const book1OwnerEmail = book1.book_owner; 
    const book2OwnerEmail = book2.book_owner; 

    // https://nodemailer.com/about/
    // Reference: Nodemailer features
    const transporter = nodemailer.createTransport({
      service: 'Gmail', 
      auth: {
        user: email, 
        pass: password, 
      },
    });

    // https://nodemailer.com/about/
    // Reference: Nodemailer features
    const mailOptions1 = {
      from: email, 
      to: book1OwnerEmail, 
      subject: 'Trade Request for Your Book',
      text: `User with email ${book2OwnerEmail} is interested in trading their book "${book2.title}" with your book "${book1.title}". Here are the details of the book they are offering:\n\nTitle: ${book2.title}\nAuthor: ${book2.author}\nGenre: ${book2.genre}\nRelease Year: ${book2.release_year}\nDescription: ${book2.description}`, // Email body
    };

    await transporter.sendMail(mailOptions1);
    console.log('Emails sent successfully');
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Trade request emails sent successfully' }),
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error sending email' }),
    };
  }
};
