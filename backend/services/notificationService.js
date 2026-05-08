const AWS = require("aws-sdk");

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const ses = new AWS.SES();

async function sendEmail(to, subject, message) {
  const params = {
    Source: process.env.EMAIL_USER,
    Destination: {
      ToAddresses: [to],
    },
    Message: {
      Subject: { Data: subject },
      Body: {
        Text: { Data: message },
      },
    },
  };

  await ses.sendEmail(params).promise();
}

module.exports = { sendEmail };