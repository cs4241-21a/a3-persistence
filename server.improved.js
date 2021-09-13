const http = require("http"),
  fs = require("fs"),
  // IMPORTANT: you must run `npm install` in the directory for this assignment
  // to install the mime library used in the following line of code
  mime = require("mime"),
  dir = "public/",
  port = 3000;

/* default data is empty */
const appdata = [];

const server = http.createServer(function (request, response) {
  if (request.method === "GET") {
    handleGet(request, response);
  } else if (request.method === "POST") {
    handlePost(request, response);
  }
});

const handleGet = function (request, response) {
  const filename = dir + request.url.slice(1);

  if (request.url === "/") {
    sendFile(response, "public/index.html");
  } else {
    sendFile(response, filename);
  }
};

/* interact with sumbit and remove requests, able to interact with existing data
by matching the name and team */
const handlePost = function (request, response) {
  let dataString = "";

  request.on("data", function (data) {
    dataString += data;
  });

  /* check if the request is adding or removing data */
  if (request.url === "/submit") {
    request.on("end", function () {
      const dataJSON = JSON.parse(dataString);
      let avg = dataJSON.time / dataJSON.laps;
      dataJSON.avg = avg;
      let modified = false;
      for (let i = 0; i < appdata.length; i++) {
        if (
          appdata[i].name.toUpperCase() === dataJSON.name.toUpperCase() &&
          appdata[i].team.toUpperCase() === dataJSON.team.toUpperCase()
        ) {
          appdata[i] = dataJSON;
          modified = true;
        }
      }
      if (!modified) {
        appdata.push(dataJSON);
      }
      /* sorting data by fastest average time */
      appdata.sort(function (a, b) {
        return a["avg"] - b["avg"];
      });
      response.writeHead(200, "OK", { "Content-Type": "text/plain" });
      response.end(JSON.stringify(appdata));
    });
  } else if (request.url === "/remove") {
    request.on("end", function () {
      const dataJSON = JSON.parse(dataString);
      for (let i = 0; i < appdata.length; i++) {
        if (
          appdata[i].name.toUpperCase() === dataJSON.name.toUpperCase() &&
          appdata[i].team.toUpperCase() === dataJSON.team.toUpperCase()
        ) {
          appdata.splice(i, 1)
        }
      }
      /* sorting data by fastest average time */
      appdata.sort(function (a, b) {
        return a["avg"] - b["avg"];
      });
      response.writeHead(200, "OK", { "Content-Type": "text/plain" });
      response.end(JSON.stringify(appdata));
    });
  }
};

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

server.listen(process.env.PORT || port);
