const express = require("express");
const app = express();
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const bodyParser = require("body-parser");

const PORT = 5000;

const Post = require("./models/Post");

require("dotenv").config();

app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
});

app.get(
    "/posts",
    asyncHandler(async (req, res) => {
        const allPosts = await Post.find({});

        console.log(allPosts);

        res.send({});
    })
);

app.post(
    "/posts",
    bodyParser.json(),
    asyncHandler(async (req, res) => {
        const newPost = await new Post();
        newPost.text = req.body.text;
        newPost.authorid = req.body.authorid;
        newPost.save();
    })
);

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
