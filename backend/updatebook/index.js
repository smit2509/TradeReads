const AWS = require('aws-sdk');

const dynamodb = new AWS.DynamoDB.DocumentClient();

const tableName = 'books'; 

exports.handler = async (event, context) => {
  const  bookId  = event.pathParameters.id;
  const { title, author, description, genre, release_year, book_status } = JSON.parse(event.body);

  const params = {
    TableName: tableName,
    Key: { book_id: bookId },
    UpdateExpression: 'SET title = :title, author = :author, description = :description, genre = :genre, release_year = :release_year, book_status = :book_status',
    ExpressionAttributeValues: {
      ':title': title,
      ':author': author,
      ':description': description,
      ':genre': genre,
      ':release_year': release_year,
      ':book_status': book_status,
    },
    ReturnValues: 'ALL_NEW',
  };
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#updateItem-property
  // Reference: To update an item in a table
  try {
    const data = await dynamodb.update(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(data.Attributes),
    };
  } catch (error) {
    console.error('Error updating book:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Server error' }),
    };
  }
};
