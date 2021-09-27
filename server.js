// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require("express");
const app = express();
const { DateTime } = require('luxon');
const { MongoClient, ObjectId } = require('mongodb');
const uri = "mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@kylewm.cui7b.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const dir = `${__dirname}/views`;
const mongoClient = new MongoClient(uri);
const defaultRoom = 'Public';
// our default array of dreams
const entries = [
  ["500", "Red"],
  ["10", "Blue"],
  ["60", "Green"]
];

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + "/views/index.html");
});

// send the default array of dreams to the webpage
app.get("/entries", (request, response) => {
  // express helps us take JS objects and send them as JSON
  response.json(entries);
});

app.get('/', async (req, res) => {
  if (req.session.username && await authenticateSession(req.session.username, req.session.token)) {
    res.sendFile(`${dir}/chat.html`);
  } else {
    res.sendFile(`${dir}/index.html`);
  }
});

app.get('/chat/public', async (req, res) => {
  const response = await getChat(req.session.username, req.session.token, defaultRoom);
  res.status(response ? 200 : 401).send(response);
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

const getMongoClient = () => {
  return new Promise((resolve, reject) => {
    mongoClient.connect(async err => {
      if (err) {
        console.error(err);
        reject()
      } else {
        resolve(mongoClient);
      }
    });
  });
}

const authenticateSession = async (username, token) => {
  return getMongoClient().then(async client => {
    const authenticated = await authenticateToken(username, token, client);
    await mongoClient.close();
    return authenticated;
  }).catch(() => false);
}

const authenticateToken = async (username, token, client) => {
  const sessionsCollection = client.db("auth").collection("sessions");
  const sessionDocument = await sessionsCollection.findOne({ username });
  if (sessionDocument) {
    if (DateTime.utc().toMillis() > sessionDocument['expiry']) {
      await sessionsCollection.deleteOne({ username });
      return false;
    }
    return sessionDocument['token'] === token;
  }
  return false;
};

const addMessage = async (content, username, token, room) => {
  return getMongoClient().then(async client => {
    let messages = null;
    if (await authenticateToken(username, token, client)) {
      console.log(`[ADD MESSAGE] ${ username } sent a message.`);
      const messageCollection = client.db("chat").collection(room);
      await messageCollection.insertOne({
        username,
        content,
        submitted: DateTime.utc(),
        admin: username === 'kwmcfatter'});
      messages = await messageCollection.find().toArray();
    }
    await mongoClient.close();
    return messages;
  }).catch(() => null);
};

const deleteChat = async (id, username, token, room) => {
  return getMongoClient().then(async client => {
    let messages = null;
    if (await authenticateToken(username, token, client)) {
      console.log(`[DELETE CHAT] ${ username } deleted a chat.`);
      const messageCollection = client.db("chat").collection(room);
      const message = await messageCollection.findOne({ '_id': ObjectId(id) });
      if (message && message['username'] === username) {
        await messageCollection.deleteOne({ '_id': ObjectId(id) });
      }
      messages = await messageCollection.find().toArray();
    }
    await mongoClient.close();
    return messages;
  }).catch(() => null);
};

const getChat = async (username, token, room) => {
  return getMongoClient().then(async client => {
    let messages = null;
    if (await authenticateToken(username, token, client)) {
      console.log(`[GET CHAT] ${ username } retrieved the chatroom "${ room }".`);
      const messageCollection = client.db("chat").collection(room);
      messages = await messageCollection.find().toArray();
    }
    await mongoClient.close();
    return messages;
  }).catch(() => null);
};