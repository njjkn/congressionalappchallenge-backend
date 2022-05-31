const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')
const User = require("../../models/User")
const Post = require("../../models/Post")
const Comment = require("../../models/Comment");
const { ObjectId } = require('mongodb');
const { reset } = require('nodemon');

const ObjectID = require("mongodb").ObjectId;

router.post("/signup/user", async (req, res) => {
    const email = req.body.email;
    const user = await User.findOne({email: email});
    if (user) {
        return res.status(400).send({});
    } else {
        const newUser = new User(req.body);
        newUser.save().catch(err => console.log(err));
        return res.status(200).send(newUser);
    }
})

router.get("/fetch/user/:userID", async (req, res) => {
    const userId = req.params.userID;
    var userObjId = null;
    try {
        userObjId = ObjectID(userId);
        
    } catch (error)  {
        console.log(error)
        return res.status(400).send({});
    }
    const user = await User.findById(userObjId);
    if (user) {
        return res.status(200).send(user);
    } else {
        return res.status(400).send({});
    }
})

router.post("/create/post/:userID", async (req, res) => {
    const userId = req.params.userID;
    var userObjId = null;
    try {
        userObjId = ObjectID(userId);
    } catch (error) {
        console.log(error)
        return res.status(400).send({});
    }
    const user = await User.findById(userObjId);

    if (user) {
        const newPost = new Post(req.body);
        newPost.save().catch(err => console.log(err));
        var userPostList = user.posts;
        userPostList.push(newPost._id);
        var userQuery = {email: user.email}
        var updatedValues = {
            email: user.email,
            fullname: user.fullname,
            grade: user.grade,
            feedback: user.feedback,
            comments: user.comments,
            isStudentRep: user.isStudentRep,
            posts: userPostList
        }

        await User.findOneAndUpdate(userQuery, updatedValues);
        return res.status(200).send(newPost);
    } else {
        return res.status(404).send({});
    }
})

router.get("/fetch/posts/grade/:userID", async (req, res) => {
    const userId = req.params.userID;
    var userObjId = null;
    try {
        userObjId = ObjectID(userId);
    } catch (error) {
        console.log(error);
        return res.status(404).send({});
    }
    
    const user = await User.findById(userObjId);
    if (user) {
        const userGrade = user.grade;
        const gradePostList = await Post.find({grade: userGrade});
        return res.status(200).send(gradePostList);
    } else {
        return res.status(404).send({});
    }
})

router.get("/fetch/posts/schoolwide", async (req, res) => {
    const postList = await Post.find({isSchoolWide: true});
    return res.status(200).send(postList);
})

router.get("/fetch/post/:postID", async (req, res) => {
    const postId = req.params.postID;
    var postObjId = null;
    try {
        postObjId = ObjectID(postId);
    } catch (error) {
        return res.status(404).send(error);
    }
    const post = await Post.findById(postObjId);

    if (post) {
        return res.status(200).send(post);
    } else {
        return res.status(404).send({});
    }
})

router.post("/create/post/comment/:postID/:userID", async (req, res) => {
    const postId = req.params.postID;
    const userId = req.params.userID;
    var postObjId = null;
    var userObjId = null;
    try {
        postObjId = ObjectID(postId);
        userObjId = ObjectID(userId);
    } catch (error) {
        return res.status(404).send(error);
    }

    const post = await Post.findById(postObjId);
    const user = await User.findById(userObjId);

    if (post && user) {
        const newComment = new Comment(req.body);
        newComment.save().catch(err => console.log(err));
        var postCommentsList = post.comments;
        postCommentsList.push(newComment._id);

        var postQuery = {userID: post.userID};
        var postUpdatedValues = {
            comments: postCommentsList,
            userID: post.userID,
            likes: post.likes,
            content: post.content,
            status: post.status,
            grade: post.grade,
            isSchoolWide: post.isSchoolWide
        }

        await Post.findOneAndUpdate(postQuery, postUpdatedValues);

        var userCommentsList = user.comments;
        userCommentsList.push(newComment._id);
        var userQuery = {email: user.email};
        var userUpdatedValues = {
            email: user.email,
            fullname: user.fullname,
            grade: user.grade,
            feedback: user.feedback,
            comments: userCommentsList,
            isStudentRep: user.isStudentRep,
            posts: user.posts
        }

        await User.findOneAndUpdate(userQuery, userUpdatedValues);

        return res.status(200).send(newComment);
    }
})

router.get("/fetch/post/comments/:postID", async (req, res) => {
    const postId = String(req.params.postID);
    const postCommentsList = await Comment.find({postID: postId});
    return res.status(200).send(postCommentsList);
})

router.put("/update/post/likes/:postID/:userID", async (req, res) => {
    const userId = req.params.userID;
    const postId = req.params.postID;
    var postObjId = null;
    var userObjId = null;
    try {
        postObjId = ObjectID(postId);
        userObjId = ObjectID(userId);
    } catch (error) {
        return res.status(404).send({});
    }

    const post = await Post.findById(postObjId);
    const user = await User.findById(userObjId);

    if (user && post) {
        var postLikes = post.likes;
        if (postLikes.includes(userObjId)) {
            postLikes = postLikes.filter((user) => !(user.equals(userObjId)));
        } else {
            postLikes.push(userObjId);
        }

        var postQuery = {userID: post.userID};
        var postUpdatedValues = {
            comments: post.comments,
            userID: post.userID,
            likes: postLikes,
            content: post.content,
            status: post.status,
            grade: post.grade,
            isSchoolWide: post.isSchoolWide
        }

        await Post.findOneAndUpdate(postQuery, postUpdatedValues);
        return res.status(200).send(postLikes);
    } else {
        return res.status(404).send({});
    }
})

router.put("/update/comment/likes/:commentID/:userID", async (req, res) => {
    const userId = req.params.userID;
    const commentId = req.params.commentID;
    var commentObjId = null;
    var userObjId = null;
    try {
        commentObjId = ObjectID(commentId);
        userObjId = ObjectID(userId);
    } catch (error) {
        return res.status(404).send({});
    }

    const comment = await Comment.findById(commentObjId);
    const user = await User.findById(userObjId);

    if (user && comment) {
        var commentLikes = comment.likes;
        if (commentLikes.includes(userObjId)) {
            commentLikes = commentLikes.filter((user) => !(user.equals(userObjId)));
        } else {
            commentLikes.push(userObjId);
        }

        var commentQuery = {userID: comment.userID};
        var commentUpdatedValues = {
            userID: comment.userID,
            postID: comment.postID,
            content: comment.content,
            likes: commentLikes
        }

        await Comment.findOneAndUpdate(commentQuery, commentUpdatedValues);
        return res.status(200).send(commentLikes);
    } else {
        return res.status(404).send({});
    }
})

router.put("/update/post/status/:postID/:userID", async (req, res) => {
    var statusArray = ["pending", "resolved", "unresolved"]
    const postId = req.params.postID;
    const userId = req.params.userID;
    var postObjId = null;
    var userObjId = null;
    try {
        postObjId = ObjectID(postId);
        userObjId = ObjectID(userId);
    } catch(error) {
        return res.status(404).send({});
    }
    const post = await Post.findById(postObjId);
    const user = await User.findById(userObjId);

    if (post && user) {
        const updatedStatus = req.body.status.toLowerCase();
        if (!statusArray.includes(updatedStatus)) {
            return res.status(400).send({});
        }
        var postQuery = {userID: post.userID};
        var postUpdatedValues = {
            comments: post.comments,
            userID: post.userID,
            likes: post.likes,
            content: post.content,
            status: updatedStatus,
            grade: post.grade,
            isSchoolWide: post.isSchoolWide
        }

        await Post.findOneAndUpdate(postQuery, postUpdatedValues);
        return res.status(200).send(postUpdatedValues);
    }
})

router.delete("/remove/comment/:commentID", async (req, res) => {
    const commentId = req.params.commentID;
    var commentObjId = null
    try {
        commentObjId = ObjectID(commentId);
    } catch (error) {
        return res.status(400).send(error);
    }
    const comment = await Comment.findById(commentObjId);
    if (comment) {
        const userId = comment.userID;
        const postId = comment.postID;

        var userObjId = null
        var postObjId = null

        try {
            userObjId = ObjectID(userId)
            postObjId = ObjectID(postId)
        } catch(error) {
            return res.status(400).send(error);
        }

        const user = await User.findById(userObjId)
        const post = await Post.findById(postObjId)

        if (user && post) {
            var userCommentsList = user.comments
            userCommentsList = userCommentsList.filter((comment) => !(comment.equals(commentObjId)));
            var userQuery = {email: user.email}
            var userUpdatedValues = {
                email: user.email,
                fullname: user.fullname,
                grade: user.grade,
                feedback: user.feedback,
                comments: userCommentsList,
                isStudentRep: user.isStudentRep,
                posts: user.posts
            }

            await User.findOneAndUpdate(userQuery, userUpdatedValues)

            var postCommentsList = post.comments
            postCommentsList = postCommentsList.filter((comment) => !(comment.equals(commentObjId)));
            var postQuery = {userID: post.userID}
            var postUpdatedValues = {
                comments: postCommentsList,
                userID: post.userID,
                likes: post.likes,
                content: post.content,
                status: post.status,
                grade: post.grade,
                isSchoolWide: post.isSchoolWide
            }

            await Post.findOneAndUpdate(postQuery, postUpdatedValues)

            await Comment.deleteOne(commentObjId);

            return res.status(200).send(comment);
        } else {
            return res.status(400).send(error)
        }
    } else {
        return res.status(400).send(error);
    }
})

router.get("/fetch/posts/:userID", async (req, res) => {
    const userId = req.params.userID;
    var userObjId = null
    try {
        userObjId = ObjectID(userId);
    } catch(error) {
        return res.status(400).send(error);
    }
    const user = await User.findById(userObjId);
    if (user) {
        var userPostsList = await Post.find({userID: userId});
        return res.status(200).send(userPostsList);
    } else {
        return res.status(400).send({});
    }
})

router.get("/fetch/comments/:userID", async (req, res) => {
    const userId = req.params.userID;
    var userObjId = null
    try {
        userObjId = ObjectID(userId);
    } catch(error) {
        return res.status(400).send(error);
    }
    const user = await User.findById(userObjId);
    if (user) {
        var userCommentsList = await Comment.find({userID: userId});
        return res.status(200).send(userCommentsList);
    } else {
        return res.status(400).send({});
    }
})

module.exports = router;