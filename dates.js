const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

(async function() {
  // Connection URL
  const uri = "mongodb+srv://chatbot:chatbot@chatbot-nodejs-wts3i.azure.mongodb.net/test?retryWrites=true&w=majority";
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  // Database Name
  const dbName = 'chat-bot';

  try {
    // Use connect method to connect to the Server
    await client.connect();

    const db = client.db(dbName);
    const col = db.collection('dates')

    // Add new date
    let add = await col.insertOne({date: new Date()})
    assert.equal(1, add.insertedCount)

    // Show dates
    const dates = await col.find({}).toArray();
    console.log(dates)

  } catch (err) {
    console.log(err.stack);
  }

  client.close();
})();