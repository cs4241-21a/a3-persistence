const crypto = require('./crypto');
const MongoDB = require('mongodb');
const MongoClient = MongoDB.MongoClient;
const url = 'mongodb+srv://kzhao5:Zhaoke328@a3.8ty2i.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

//mongodb+srv://' + process.env.DB_USER + ':' + process.env.DB_PASS + '@a3.8ty2i.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
const client = new MongoClient(url, {useNewUrlParser: true, useUnifiedTopology: true});

const connectClient = function () {
    return new Promise(resolve => {
        resolve(client.connect())
    })
};

const DB = function () {
    return new Promise(resolve =>
        connectClient().then(client => resolve(client.db('Scheduler')))
    );
};

DB().then(db => {
    db.createCollection('content');
    db.createCollection('users');
});


const ContentCollection = function () {
    return new Promise(resolve =>
        DB().then(db =>
            resolve(db.collection('content'))));
};

const UsersCollection = function () {
    return new Promise(resolve =>
        DB().then(db =>
            resolve(db.collection('users'))));
};


exports.getAllContent = function () {
    return new Promise(resolve => {
        ContentCollection().then(collection => {
            collection.find().sort({type: 1}).toArray().then(data => resolve(data));
        });
    })
};

exports.getContentForUser = function (user) {
    return new Promise(resolve => {
        ContentCollection().then(collection => {
            collection.find({username: user.username}).sort({type: 1}).toArray().then(data => resolve(data));
        });
    })
};

exports.addOrUpdateContent = function (user, type, text, id) {
    return new Promise(resolve => {
        if (id === undefined || id === '') {
            console.log("Adding ", type, " for ", user.username, ": ", text);
            ContentCollection().then(collection => collection.insertOne({
                username: user.username,
                type: type,
                text: text
            })).then(result => resolve(result));
        } else {
            console.log('Updating content ', id);
            ContentCollection().then(collection => collection.updateOne({_id: MongoDB.ObjectID(id)}, {
                $set: {
                    type: type,
                    text: text
                }
            })).then(result => resolve(result));
        }
    })
};

exports.deleteContent = function (user, contentID) {
    return new Promise(resolve =>
        ContentCollection().then(collection => collection.deleteOne({_id: MongoDB.ObjectID(contentID)})
            .then(result => resolve(result))))
};

exports.checkPass = function (username, password) {
    return new Promise((resolve, reject) => {
        this.getUser(username).then(user => {
            console.log("CHECK PASS: Got user document for " + username + ": " + user);
            if (user !== null && crypto.compareString(user.password, password)) resolve(user);
            else reject();
        }).catch(() => reject());
    });
};

exports.getUser = function (username) {
    return new Promise((resolve, reject) => {
        UsersCollection().then(collection =>
            collection.findOne({username: username}).then(user => {
                console.log("GET USER: Got user document for " + username + ": " + user);
                resolve(user);
                if (user === null) reject("User not found!");
            }).catch(error => reject(error))
        );
    })
};

exports.CreateUser = function (username, displayName, password) {
    return new Promise((resolve, reject) => {
        UsersCollection().then(collection => {
            collection.findOne({username: username}).then(data => {
                    if (data === null) {
                        console.log("Creating User: ", username, " with password: ", password);
                        let passHash = crypto.encrypt(password);
                        collection.insertOne({
                            username: username,
                            displayName: displayName,
                            password: passHash
                        }).catch(error => reject(error));
                        resolve("Account created successfully.");
                    }
                    reject("Username is taken.");
                }
            )
        });
    });
};