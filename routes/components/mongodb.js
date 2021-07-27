
//mongoDB 

require("dotenv").config();
console.log("MongoDB",process.env.MongoDB);

var url = process.env.MongoDB;
//var url = 'mongodb://root:Love20%40%21@49.50.167.171:21302/Quaca';



exports.url = url;
