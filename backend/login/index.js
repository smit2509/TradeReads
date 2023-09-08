const AWS = require('aws-sdk');
const bcrypt = require('bcryptjs');

AWS.config.update({ region: 'us-east-1' }); 
const dynamodb = new AWS.DynamoDB.DocumentClient();

const tableName = 'users'; 

exports.handler = async (event, context, callback) => {
  const { email, password } = JSON.parse(event.body);
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#getItem-property
  // Reference: To read an item from a table
  try {
    // Find the user
    const params = {
      TableName: tableName,
      Key: { email },
    };

    const data = await dynamodb.get(params).promise();

    if (!data.Item) {
      return callback(null, {
        statusCode: 404,
        body: JSON.stringify({ message: 'User not found' }),
      });
    }

    const user = data.Item;
    // https://www.npmjs.com/package/bcrypt
    // Reference: To check a password:
    const result = await bcrypt.compare(password, user.password);

    if (result) {
      return callback(null, {
        statusCode: 200,
        body: JSON.stringify({ message: 'Login successful', user }),
      });
    } else {
      return callback(null, {
        statusCode: 401,
        body: JSON.stringify({ message: 'Incorrect password' }),
      });
    }
  } catch (error) {
    console.error('Error:', error);
    return callback(null, {
      statusCode: 500,
      body: JSON.stringify({ message: 'Server error' }),
    });
  }
};
