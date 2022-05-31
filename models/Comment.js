const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    userID: String,
    postID: String,
    content: String,
    likes: Array
})

module.exports = mongoose.model('Comment', CommentSchema);