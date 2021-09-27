// Setup environment variables
require("dotenv").config();

// Load and start app
const app = require("./app");

app.listen(app.get("port"), () => {
  console.log(`Listening on port ${app.get("port")}`);
});
