const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://2003deepak:Deepak%407449*@atlascluster.yeqsq.mongodb.net/bookmark?retryWrites=true&w=majority&appName=AtlasCluster").then(() => {
        console.log('Connected to DB');
    })
    .catch((err) => {
        console.log('Error connecting to DB:', err);
    });

module.exports = mongoose.connection;