require('dotenv').config();

module.exports = {
	hostname: process.env.SMS_HOSTNAME || "http://sandbox.sms.fpt.net",
	grant_type: process.env.SMS_GRANT_TYPE || "client_credentials",
	client_id: process.env.SMS_CLIENT_ID || "7c2Fc7994e6f9c8dd07Cc08d3f974c7c1979cdf8",
	client_secret: process.env.SMS_CLIENT_SECRET || "fe16BB720da2f4022f1f2590c2Ab448396f7808753c1fc8f64b9b0A3998aae80D538a526",
	scope: process.env.SMS_SCOPE || "send_brandname_otp",
	session_id: process.env.SMS_SESSION_ID || "coco",
	brand_name: process.env.SMS_BRAND_NAME || "FTI",
	access_token: process.env.SMS_ACCESS_TOKEN || "cEZzMmxDL1RmK1QyOVVXQS9vS2lCdDdWWG8rYzB2d1NTdDlCc0xoalc5Nkluam00VldDRGxvc2kxYkpWYkY2Sm5BVDRSa0hTc1lUZ2xGR0c3SzdENXQ3clcyR0FQK3pvNWRCV041MENhV2ZqZGREMG5HZlVHOHVkd2FnQjMwVWUzWWQ3S3VKR3ltVnRpU3BKUHJYNGlqbWJvQnZqbFY3N3Vhdm5vR2cwS1B3PQ=="
};