const { report } = require("process"),
  express = require("express"),
  mongodb = require("mongodb"),
  app = express();

const uri =
  "mongodb+srv://" +
  "test_user" +
  ":" +
  "tester_user_pw" +
  "@" +
  "cluster0.dpk53.mongodb.net/";

const http = require("http"),
  fs = require("fs"),
  // IMPORTANT: you must run `npm install` in the directory for this assignment
  // to install the mime library used in the following line of code
  mime = require("mime"),
  dir = "public/",
  port = 3000;

// Data maintained by the server for the forum
let appdata = [];

const client = new mongodb.MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
let collection = null;

client
  .connect()
  .then(() => {
    // will only create collection if it doesn't exist
    return client.db("Assignment3DB").collection("test_08");
  })
  .then((__collection) => {
    // store reference to collection
    collection = __collection;
    // blank query returns all documents
    return collection.find({}).toArray();
  })
  .then((new_data) => (appdata = new_data));
// .then(new_data => console.log(new_data));
// .then(new_data => console.log("new"));
// .then(console.log);

// route to get all docs
app.get("/", (req, res) => {
  if (collection !== null) {
    debugger;
    collection
      .find({})
      .toArray()
      .then((result) => res.json(result));
  }
});

// Unique ID which we are assigning every element
let id_counter = 0;

// The server we will be using and how it handles different calls
const server = http.createServer(function (request, response) {
  if (request.method === "GET") {
    handleGet(request, response);
  } else if (request.method === "POST") {
    handlePost(request, response);
  }
});

// Handles all GET calls. Either sends over a file or delivers the forum data
const handleGet = function (request, response) {
  const filename = dir + request.url.slice(1);

  if (request.url === "/") {
    sendFile(response, "public/index.html");
  } else if (request.url === "/initializeData") {
    getInitialDataList(response);
  } else {
    sendFile(response, filename);
  }
};

// Handles all POST calls, deals with submit, delete, and update
const handlePost = function (request, response) {
  if (request.url === "/submit") {
    handleAddition(request, response);
  } else if (request.url === "/deleteEntry") {
    handleDeletion(request, response);
  } else if (request.url === "/updateEntry") {
    handleUpdate(request, response);
  } else {
    console.log("I don't know what you want me to do!");
  }
};

// Handles adding an item to the forum
function handleAddition(request, response) {
  console.log("\n\nNEW POST DATA REQUEST");

  let dataString = "";

  // let new_id_value = "";

  let new_student = "";

  request.on("data", async function (data) {
    // console.log("Request body");
    // console.log(JSON.parse(data));

    // data_json = JSON.parse(data);
    // data_json.StudentHours = 10;
    dataString += data;

    let dataStringParsed = JSON.parse(dataString);

    let studentHours = getStudentHours(dataStringParsed.StudentRole);

    new_student = {
      StudentName: dataStringParsed.StudentName,
      StudentClass: dataStringParsed.StudentClass,
      StudentRole: dataStringParsed.StudentRole,
      StudentHours: studentHours,
    };

    // console.log("\n\nStudent Before")
    // console.log(new_student)
    // console.log("\n\n")

    // Creates a deep copy because the insertOne method modifies the student
    // new_student_copy = JSON.parse(JSON.stringify(new_student))

    // mongo_db_promise = collection.insertOne(new_student_copy).then((result) => {
    mongo_db_promise = collection.insertOne(new_student)
    
    // .then((result) => {
      // console.log("Result");
      // console.log(result);
      // console.log(result.insertedId.toString());
      // new_id_value += result.insertedId.toString();
    // });

    // console.log("\n\nStudent After")
    // console.log(new_student)
    // console.log("\n\n")

    // new_student.id = new_id_value

    // console.log("I'm the result");
    // console.log(new_id_value);

    // Appends data to server storage
    // Increments id counter to ensure uniqueness
    // id_counter = id_counter + 1;
  });

  request.on("end", async function () {
    await mongo_db_promise

    appdata.push(new_student);

    console.log("appData");
    console.log(appdata);

    // console.log("new_student id attempt")
    // console.log(new_student._id.toString())
    // new_student 

    const string_app_data = JSON.stringify(appdata);
    response.writeHead(200, "OK", { "Content-Type": "text/plain" });
    // Sends forum data back to front end
    response.end(string_app_data);
  });
}

// Handles deleting an item from the forum
function handleDeletion(request, response) {
  let dataString = "";

  let delete_promise = undefined

  request.on("data", function (data) {
    console.log("\n\nNEW DELETE DATA REQUEST");

    dataString += data;

    let dataStringParsed = JSON.parse(dataString);

    // let item_index = -1;
    let item_index = getEntryIndex(dataStringParsed);

    // // Search the forum until we find the id
    // for (let i = 0; i < appdata.length; i++) {
    //   if (String(appdata[i]._id.toString()) === dataStringParsed._id.toString()) {
    //     item_index = i;
    //     break;
    //   }
    // }

    // So long as the item exists, remove it
    if (item_index != -1) {
      appdata.splice(item_index, 1);
      // console.log("\n\n\nTrying to delete...")
      // console.log({"_id": mongodb.ObjectId(dataStringParsed._id)})
      // console.log(dataStringParsed)
      // console.log("\n\n\n")
      delete_promise = collection.deleteOne( newIDEntry(dataStringParsed) );
    }

  });

  request.on("end", async function () {
    await delete_promise

    console.log("appData");
    console.log(appdata);

    const string_app_data = JSON.stringify(appdata);

    response.writeHead(200, "OK", { "Content-Type": "text/plain" });

    // Return the forum data to the front end
    response.end(string_app_data);
  });
}

function newIDEntry(dataStringParsed){
  return {"_id": mongodb.ObjectId(dataStringParsed._id)}
}

function getEntryIndex(dataStringParsed){
  // Search the forum until we find the id
  let item_index = -1
  for (let i = 0; i < appdata.length; i++) {
    if (String(appdata[i]._id.toString()) === dataStringParsed._id.toString()) {
      item_index = i;
      break;
    }
  }

  return item_index
      
  
}


// Handles updating an item in the forum
function handleUpdate(request, response) {
  let dataString = "";

  let updatePromise = undefined

  request.on("data", function (data) {
    dataString += data;

    console.log("\n\nNEW UPDATE DATA REQUEST");

    let dataStringParsed = JSON.parse(dataString);

    // For every item, check if it is the one we need to update it. Then update it when found.

    let item_index = getEntryIndex(dataStringParsed);

    if (item_index != -1)
        appdata[item_index].StudentName = dataStringParsed.StudentName;
        appdata[item_index].StudentClass = dataStringParsed.StudentClass;
        appdata[item_index].StudentRole = dataStringParsed.StudentRole;

        let studentHours = getStudentHours(dataStringParsed.StudentRole);

        appdata[item_index].StudentHours = studentHours;

        delete_promise = collection.update( newIDEntry(dataStringParsed), {$set: appdata[item_index] });

  });

  request.on("end", async function () {

    // for (let i = 0; i < appdata.length; i++) {
    //   if (String(appdata[i].id) === String(dataStringParsed.id)) {
    //     appdata[i].StudentName = dataStringParsed.StudentName;
    //     appdata[i].StudentClass = dataStringParsed.StudentClass;
    //     appdata[i].StudentRole = dataStringParsed.StudentRole;

    //     let studentHours = getStudentHours(dataStringParsed.StudentRole);

    //     appdata[i].StudentHours = studentHours;

    //     break;
    //   }
    // }

    await updatePromise

    console.log("appData");
    console.log(appdata);

    const string_app_data = JSON.stringify(appdata);

    response.writeHead(200, "OK", { "Content-Type": "text/plain" });

    // Return forum data to front end
    response.end(string_app_data);
  });
}

// Handles the get request where we get all forum data
const getInitialDataList = function (response) {
  console.log("\n\nNEW GET INITIAL DATA REQUEST");

  console.log("appData");
  console.log(appdata);

  const string_app_data = JSON.stringify(appdata);

  response.writeHead(200, "OK", { "Content-Type": "text/plain" });

  // Return forum data
  response.end(string_app_data);
};

// Handles sending a file over to the front end
const sendFile = function (response, filename) {
  const type = mime.getType(filename);

  fs.readFile(filename, function (err, content) {
    // if the error = null, then we've loaded the file successfully
    if (err === null) {
      // status code: https://httpstatuses.com
      response.writeHeader(200, { "Content-Type": type });
      response.end(content);
    } else {
      // file not found, error code 404
      response.writeHeader(404);
      response.end("404 Error: File Not Found");
    }
  });
};

// Lists on the respective port for the server
server.listen(process.env.PORT || port);

// Function that converts student role to hours per week
function getStudentHours(studentRole) {
  if (studentRole === "SA") {
    return 10;
  } else if (studentRole === "TA" || studentRole === "GLA") {
    return 20;
  } else {
    return -1;
  }
}
