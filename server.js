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
            message: "message submitted",
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
