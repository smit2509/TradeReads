const AWS = require('aws-sdk');

const dynamodb = new AWS.DynamoDB.DocumentClient();

const tableName = 'books'; 

exports.handler = async (event, context) => {
  const  bookId  = event.pathParameters.id;

  const params = {
    TableName: tableName,
    Key: { book_id: bookId },
  };
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#deleteItem-property
  // Reference: To delete an item
  try {
    await dynamodb.delete(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Book deleted successfully' }),
    };
  } catch (error) {
    console.error('Error deleting book:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Server error' }),
    };
  }
};
