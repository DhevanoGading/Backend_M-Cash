const { Client } = require("node-appwrite");

const client = new Client()
  .setEndpoint(process.env.APP_WRITTER_ENDPOINT)
  .setProject(process.env.APP_WRITTER_PROJECT_ID)
  .setKey(process.env.APP_WRITTER_API_KEY);

module.exports = client;
