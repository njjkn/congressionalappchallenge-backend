const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    comments: Array,
    userID: String,
    likes: Array,
    content: String,
    status: String,
    grade: Number,
    isSchoolWide: Boolean
})

module.exports = mongoose.model('Post', PostSchema);