const AWS = require('aws-sdk');

const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const  bookId  = event.pathParameters.id;
  console.log(bookId);
  const params = {
    TableName: 'books', 
    Key: { book_id: bookId },
  };
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#getItem-property
  // Reference: To read an item from a table
  try {
    const data = await dynamodb.get(params).promise();

    if (!data.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Book not found' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data.Item),
    };
  } catch (error) {
    console.error('Error retrieving book:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Server error' }),
    };
  }
};
