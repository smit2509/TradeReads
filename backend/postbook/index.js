const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS();

exports.handler = async (event) => {
  const body = JSON.parse(event.body);

  const { title, author, description, genre, year, owner } = body;

  const params = {
    TableName: 'books', 
    Item: {
      book_id: uuidv4(), 
      title,
      author,
      description,
      genre,
      release_year: year, 
      book_owner: owner, 
      book_status: 'available',
      created_at: Date.now(),
    },
  };

  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#putItem-property
  // Reference: To add an item to a table
  try {
    await dynamodb.put(params).promise();
    const arn = process.env.SNS_ARN;
    
    // https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/sns-examples-publishing-messages.html
    // Reference: Publishing Messages in Amazon SNS
    const message = `New book added: ${title} by ${author}. Contact the owner at ${owner} for trading or take away. Happy Reading!!`;
    const publishParams = {
      Subject: 'New Book Alert',
      Message: message,
      TopicArn: arn, 
    };

    await sns.publish(publishParams).promise();

    return {
      statusCode: 201,
      body: JSON.stringify({ message: 'Book created successfully' }),
    };
  } catch (error) {
    console.error('Error creating book:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Server error' }),
    };
  }
};
