const AWS = require('aws-sdk');
const bcrypt = require('bcryptjs');

AWS.config.update({ region: 'us-east-1' }); 

const dynamodb = new AWS.DynamoDB.DocumentClient();


const tableName = 'users'; 

exports.handler = async (event, context, callback) => {
  const { username, email, password } = JSON.parse(event.body);

  try {
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#getItem-property
    // Reference: To read an item from a table
    const params = {
      TableName: tableName,
      Key: { email },
    };

    const data = await dynamodb.get(params).promise();

    if (data.Item) {
      return callback(null, {
        body: JSON.stringify({ message: 'Username already exists' }),
      });
    }

    // https://www.npmjs.com/package/bcrypt
    // Reference: To hash a password
    const hash = await bcrypt.hash(password, 10);

    const newUser = {
      user_id: Date.now().toString(),
      username,
      email,
      password: hash,
      created_at: Date.now(),
    };
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#putItem-property
    // Reference: To add an item to a table
    const putParams = {
      TableName: tableName,
      Item: newUser,
    };

    await dynamodb.put(putParams).promise();

    // https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/sns-examples-subscribing-unubscribing-topics.html
    // Reference: Managing Subscriptions in Amazon SNS
    const sns = new AWS.SNS();
    const topicArn = process.env.SNS_ARN; 

    const subscribeParams = {
      Protocol: 'email',
      TopicArn: topicArn,
      Endpoint: email, 
    };

    await sns.subscribe(subscribeParams).promise();

    return callback(null, {
      body: JSON.stringify({ message: 'User registered successfully' }),
    });
  } catch (error) {
    console.error('Error:', error);
    return callback(null, {
      body: JSON.stringify({ message: 'Server error' }),
    });
  }
};
