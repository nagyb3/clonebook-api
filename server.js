const express = require("express");
const app = express();
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const bodyParser = require("body-parser");
const cors = require("cors");

const PORT = 5000;

const Post = require("./models/post");
const User = require("./models/user");
const Comment = require("./models/comment");

require("dotenv").config();

app.use(bodyParser.json());
app.use(cors());

app.use(express.urlencoded({ extended: false }));

app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
});

app.get(
    "/posts",
    asyncHandler(async (req, res) => {
        const allPosts = await Post.find({});

        console.log(allPosts);

        res.send({ all_posts: allPosts });
    })
);

app.post(
    "/posts",
    asyncHandler(async (req, res) => {
        await Post.create({
            text: req.body.text,
            authorid: req.body.authorid,
        });
        res.send({
            response: "message submitted",
        });
    })
);

app.get(
    "/comments",
    asyncHandler(async (req, res) => {
        const theComment = await Comment.find({});
        res.send({
            comments_array: theComment,
        });
    })
);

app.get(
    "/comments/:commentid",
    asyncHandler(async (req, res) => {
        const theComment = await Comment.find({ _id: req.params.commentid });
        res.send({
            array: theComment,
        });
    })
);

app.post(
    "/comments",
    asyncHandler(async (req, res) => {
        await Comment.create({
            comment_author_id: req.body.comment_author_id,
            post_id: req.body.post_id,
            text: req.body.text,
        });
        res.send({
            response: "comment submitted",
        });
    })
);

mongoose.set("strictQuery", false);
const mongoDB = process.env.MONGODB_URL;

async function main() {
    await mongoose.connect(mongoDB);
}

main()
    .then((err) => {
        if (!err) {
            console.log("Connected to db successfully!");
        }
    })
    .catch((err) => console.log(err));
