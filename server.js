const bcrypt = require('bcrypt');
const crypto = require('crypto');
const express = require('express');
const cookieSession = require('cookie-session');
const compression = require('compression');
const helpers = require('view-helpers');
const { MongoClient, ObjectId } = require('mongodb');
const { DateTime } = require('luxon');
require('dotenv').config();

const port = 3000;
const dir = `${__dirname}/public`;
const sessionMaxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
const defaultRoom = 'Public';

// server
const server = express();
server.listen(process.env.PORT || port);

// middleware
server.use(compression({ level: 6 }));
server.use(express.json()); // parses HTTP request body
server.use(cookieSession({
  name: 'session:pogchat',
  keys: [process.env.SESSION_KEY1, process.env.SESSION_KEY2],
  maxAge: sessionMaxAge
})); // enables cookie-based sessions
server.use(helpers('pogchat')); // adds helper functions like req.isMobile

// default index.html route
server.get('/', async (req, res) => {
  if (req.session.username && await authenticateSession(req.session.username, req.session.token)) {
    res.sendFile(`${dir}/chat.html`);
  } else {
    res.sendFile(`${dir}/index.html`);
  }
});

// middleware
server.use(express.static(dir)); // serve all public files

// database
const uri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@pogchat.kzrfm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const mongoClient = new MongoClient(uri);

// chat data
server.get('/chat/public', async (req, res) => {
  const response = await getChat(req.session.username, req.session.token, defaultRoom);
  res.status(response ? 200 : 401).send(response);
});

server.get('/chat/private', async (req, res) => {
  const response = await getChat(req.session.username, req.session.token, req.session.username);
  res.status(response ? 200 : 401).send(response);
});

// messaging
server.post('/chat/message/add', async (req, res) => {
  const response = await addMessage(req.body.content, req.session.username, req.session.token, req.body.room === defaultRoom ? defaultRoom : req.session.username);
  res.status(response ? 200 : 401).send(response);
});

// polling
server.post('/chat/poll/add', async (req, res) => {
  const response = await addPoll(req.body.content, req.body.choices, req.session.username, req.session.token, req.body.room === defaultRoom ? defaultRoom : req.session.username);
  res.status(response ? 200 : 401).send(response);
});

server.post('/chat/poll/vote', async (req, res) => {
  const response = await voteForPoll(req.body.id, req.body.choice, req.session.username, req.session.token, req.body.room === defaultRoom ? defaultRoom : req.session.username);
  res.status(response ? 200 : 401).send(response);
});

// messaging and polling
server.put('/chat/update', async (req, res) => {
  const response = await updateChat(req.body.id, req.body.content, req.session.username, req.session.token, req.body.room === defaultRoom ? defaultRoom : req.session.username);
  res.status(response ? 200 : 401).send(response);
});

server.delete('/chat/delete', async (req, res) => {
  const response = await deleteChat(req.body.id, req.session.username, req.session.token, req.body.room === defaultRoom ? defaultRoom : req.session.username);
  res.status(response ? 200 : 401).send(response);
});

// authentication
server.post('/login', async (req, res) => {
  const auth = await authenticateUser(req.body.username, req.body.secret);
  if (auth) {
    console.log(`[LOGIN] ${ req.body.username } logged in from a ${ req.isMobile ? 'mobile' : 'desktop' } device.`);
    req.session.username = req.body.username;
    req.session.token = auth.token;
    res.send({ newAccount: auth.newAccount })
  } else {
    res.sendStatus(401);
  }
});

server.post('/logout', async (req, res) => {
  res.sendStatus(await getMongoClient().then(async client => {
    console.log(`[LOGOUT] ${ req.session.username } logged out from a ${ req.isMobile ? 'mobile' : 'desktop' } device.`);
    const sessionsCollection = client.db("auth").collection("sessions");
    await sessionsCollection.deleteOne({ username: req.session.username });
    await mongoClient.close();
    req.session = null;
    return 200;
  }).catch(() => 500));
});

// returns active session details (if they exist)
server.get('/session', async (req, res) => {
  if (req.session.username && await authenticateSession(req.session.username, req.session.token)) {
    console.log(`[SESSION] ${ req.session.username } retrieved session from a ${ req.isMobile ? 'mobile' : 'desktop' } device.`);
    res.send({ username: req.session.username });
  } else {
    res.sendStatus(404);
  }
});

// get chat data
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

// adds new message to data, returns updated data
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
        admin: username === 'Paradoxdotexe'});
      messages = await messageCollection.find().toArray();
    }
    await mongoClient.close();
    return messages;
  }).catch(() => null);
};

// deletes specified chat from data
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

// updates specified chat content from data
const updateChat = async (id, content, username, token, room) => {
  return getMongoClient().then(async client => {
    let messages = null;
    if (await authenticateToken(username, token, client)) {
      console.log(`[UPDATE CHAT] ${ username } updated a chat.`);
      const messageCollection = client.db("chat").collection(room);
      const message = await messageCollection.findOne({'_id': ObjectId(id)});
      if (message && message['username'] === username) {
        await messageCollection.updateOne({'_id': ObjectId(id)}, { $set: { content } })
      }
      messages = await messageCollection.find().toArray();
    }
    await mongoClient.close();
    return messages;
  }).catch(() => null);
};

// adds new poll to data, returns updated data
const addPoll = async (content, choices, username, token, room) => {
  return getMongoClient().then(async client => {
    let chat = null;
    if (await authenticateToken(username, token, client)) {
      console.log(`[ADD POLL] ${ username } started a poll.`);
      const chatCollection = client.db("chat").collection(room);
      await chatCollection.insertOne({
        username,
        content,
        choices: choices,
        votes: {},
        submitted: DateTime.utc(),
        admin: username === 'Paradoxdotexe'});
      chat = await chatCollection.find().toArray();
    }
    await mongoClient.close();
    return chat;
  }).catch(() => null);
};

// votes for a poll, returns updated data
const voteForPoll = async (id, choice, username, token, room) => {
  return getMongoClient().then(async client => {
    let chat = null;
    if (await authenticateToken(username, token, client)) {
      console.log(`[VOTE FOR POLL] ${ username } voted for a poll.`);
      const chatCollection = client.db("chat").collection(room);
      const poll = await chatCollection.findOne({'_id': ObjectId(id)});
      if (poll) {
        poll.votes[username] = choice;
        await chatCollection.updateOne({'_id': ObjectId(id)}, { $set: { votes: poll.votes } })
      }
      chat = await chatCollection.find().toArray();
    }
    await mongoClient.close();
    return chat;
  }).catch(() => null);
};

// authenticates user secret against hash
const authenticateUser = async (username, secret) => {
  return getMongoClient().then(async client => {
    let auth;
    const hashesCollection = client.db("auth").collection("hashes");
    const hashDocument = await hashesCollection.findOne({ username });
    if (hashDocument) {
      auth = bcrypt.compareSync(secret, hashDocument['hash']) ? { token: await generateToken(username, client), newAccount: false } : null;
    } else {
      const hash = bcrypt.hashSync(secret, 10);
      await hashesCollection.insertOne({ username, hash });
      await client.db("chat").createCollection(username); // create private chatroom for new user
      auth = { token: await generateToken(username, client), newAccount: true };
    }
    await mongoClient.close();
    return auth;
  }).catch(() => null);
};

// creates a new session token and returns it
const generateToken = async (username, client) => {
  const sessions = client.db("auth").collection("sessions");
  const token = crypto.randomBytes(48).toString('hex');
  const expiry = DateTime.utc().plus(sessionMaxAge).toMillis();
  await sessions.updateOne({ username }, { $set: { token, expiry } }, { upsert: true });
  await mongoClient.close();
  return token;
};

// spawn a mongo client
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

// authenticates user session token
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

// spawns mongo client and authenticates token
const authenticateSession = async (username, token) => {
  return getMongoClient().then(async client => {
    const authenticated = await authenticateToken(username, token, client);
    await mongoClient.close();
    return authenticated;
  }).catch(() => false);
}
