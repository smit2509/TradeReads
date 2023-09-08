const AWS = require('aws-sdk');

const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const  bookOwner  = event.pathParameters.id;
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#scan-property
  // Reference: To scan a table
  const params = {
    TableName: 'books', 
    FilterExpression: 'book_owner = :owner',
    ExpressionAttributeValues: {
      ':owner': bookOwner,
    },
  };

  try {
    const data = await dynamodb.scan(params).promise();

    if (data.Items.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'No books found for the specified owner' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data.Items),
    };
  } catch (error) {
    console.error('Error retrieving books by owner:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Server error' }),
    };
  }
};
