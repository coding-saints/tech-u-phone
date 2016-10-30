var mongoose = require('monggose');

var Recording = new mongoose.Schema({
   url: String,
transcription: String,
phoneNumber: String
});

var agent = new mongoose.Schema({
   extension: String,
    phoneNumber: String,
    recordings: [Recording]
});

var agent = Mongoose.model('agent', Agent);
module.exports = agent;