const moment = require('moment');
const mongoose = require('mongoose');
const Love = mongoose.model('Love');


exports.getLoveList = (req, res) => {
    
};

exports.insertNewThing = (req, res) => {
    let title = req.body.title;
    let content = req.body.content;
    let imgPath = req.body.imgPath;
};