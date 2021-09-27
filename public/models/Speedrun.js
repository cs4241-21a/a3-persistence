const mongoose = require("mongoose");
const speedrunSchema = mongoose.Schema({
    userName: {type: String, unique: true, required: true},
    totalDeaths: {type: Number, required: true},
    totalStrawberries: {type: Number, required: true},
    inputType: {type: String, required:true},
    platform: {type: String, required:true},
    dateCompleted: {type: Date, required:true},
    dbid: {type: String}
  });
  
module.exports = mongoose.model("Speedrun", speedrunSchema);