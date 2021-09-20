const { MongoClient, ObjectID } = require('mongodb')
const client = new MongoClient(process.env.mongodbURL)

// Database Name
const dbName = 'lostandfound'
let founditems
let lostitems

let main = async function () {
    // Use connect method to connect to the server
    await client.connect()
    console.log('Connected successfully to server')
    const db = client.db(dbName)
    founditems = db.collection('founditems')
    lostitems = db.collection('lostitems')
}
main()

exports.update = async function(data) {
    const updateResult = await lostitems.updateOne({ _id: new ObjectID(data._id) }, {
        $set: {
          item: data.item,
          when: data.when,
          where: data.where,
          description: data.description,
          photo: data.photo
        }
    })
    console.log('Updated documents =>', updateResult)
    return updateResult
}

exports.create = async function(collection, data) {
    if (collection === 'lostItems') {
        const insertResult = await lostitems.insertMany([data])
        console.log('Inserted documents =>', insertResult)
        return insertResult
    } else if (collection === 'foundItems') {
        const insertResult = await founditems.insertMany([data])
        console.log('Inserted documents =>', insertResult)
        return insertResult
    } else {
        return undefined
    }
}

exports.delete = async function(uid) {
    const deleteResult = await lostitems.deleteMany({ _id: new ObjectID(uid) })
    // console.log('Deleted documents =>', deleteResult)    
    return deleteResult
}

exports.getLostItems = async function() {
    const findResult = await lostitems.find({}).toArray()
    // console.log('Found lostitems document =>', findResult)
    return findResult
}

exports.getFoundItems = async function() {
    const findResult = await founditems.find({}).toArray()
    // console.log('Found founditems document =>', findResult)
    return findResult
}