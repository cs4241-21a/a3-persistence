/*
 * Database connectivity module; handles all database operations for
 */

const {MongoClient} = require('mongodb');
const ObjectID = require('mongodb').ObjectId;

module.exports = function(db){
    let module = {};

    const client = new MongoClient(db);

    module.addEntryToDatabase = async function(data) {
        await client.connect();

        client.db('database').collection('test').insertOne(data, (err, res) => {
            if(err) throw err;
            console.log('1 document inserted.');
        });
    }

    module.getAllDatabaseData = async function(username) {
        await client.connect();
        const returnPromise = new Promise((res, rej) => {
            client.db('database').collection('test').find({ user: username }).toArray((err, result) => {
                if (err) {
                    rej(err);
                    throw err;
                }
                res(result);
            });
        });
        return returnPromise;
    }

    module.modifyEntryInDatabase = async function(data) {
        await client.connect();

        const objectID = new ObjectID(data._id);

        const toUpdate = Object.keys(data).filter((key) => {
            return key !== '_id';
        });

        var dictDataSet = {};
        toUpdate.forEach((key) => {
            dictDataSet[key] = data[key];
        })

        const query = { _id: objectID };

        client.db('database')
        .collection('test')
        .updateOne(query, { $set: dictDataSet }, {});

        console.log('1 document updated.')
    }

    module.deleteEntryInDatabase = async function(data) {
        await client.connect();
        const objectID = new ObjectID(data._id);

        const toDelete = { _id: objectID };

        const result = await client.db('database').collection('test').deleteOne(toDelete);
        if(result.deletedCount === 1) {
            console.log('1 document deleted.');
        } else {
            console.log('No documents deleted; _id ' + data._id + ' not found.');
        }
    }

    return module;
}
