const express = require("express");
const app = express();
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const session = require("express-session");

const PORT = 5000;

const Post = require("./models/post");
const User = require("./models/user");
const Comment = require("./models/comment");
const Message = require("./models/message");

require("dotenv").config();

app.use(
    session({
        secret: "keyboard cat",
        resave: false,
        saveUninitialized: true,
        cookie: { secure: true },
    })
);

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
        res.send({ all_posts: allPosts });
    })
);

app.post(
    "/posts",
    asyncHandler(async (req, res) => {
        //TODO: handle if text or authorid is not given
        await Post.create({
            text: req.body.text,
            // authorid: req.body.authorid,
            author_username: req.body.author_username,
        });
        res.send({
            response: "message submitted",
        });
    })
);

//GET all of the posts for a username
app.get(
    "/posts/user/:username",
    asyncHandler(async (req, res) => {
        //TODO
    })
);

//GET a post by id
app.get(
    "/posts/:postid",
    asyncHandler(async (req, res) => {
        //TODO
    })
);

app.get(
    "/comments",
    asyncHandler(async (req, res) => {
        const allComments = await Comment.find({});
        res.send({
            comments_array: allComments,
        });
    })
);

app.get(
    "/comments/:commentid",
    asyncHandler(async (req, res) => {
        //TODO: handle if commentid doesnt exist
        const theComment = await Comment.find({ _id: req.params.commentid });
        res.send({
            array: theComment,
        });
    })
);

app.post(
    "/comments",
    asyncHandler(async (req, res) => {
        //TODO: handle if required attr is not given
        await Comment.create({
            comment_author_username: req.body.comment_author_username,
            post_id: req.body.post_id,
            text: req.body.text,
        });
        res.send({
            response: "comment submitted",
        });
    })
);

app.post(
    "/message",
    asyncHandler(async (req, res) => {
        //TODO: handle if a required attr is not given
        await Message.create({
            text: req.body.text,
            sender_user_id: req.body.sender_user_id,
            receiver_user_id: req.body.receiver_user_id,
        });
    })
);

app.get(
    "/message/:id",
    asyncHandler(async (req, res) => {
        //TODO: handle if id doesnt exist
        const theComment = await Comment.find({ _id: req.params.id });
        res.send({ comment: theComment });
    })
);

app.get(
    "/message/user/:userid",
    asyncHandler(async (req, res) => {
        const messagesWithUserId = await Message.find({
            $or: [
                { sender_user_id: req.params.userid },
                { receiver_user_id: req.params.userid },
            ],
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

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            const user = await User.findOne({ username: username });
            if (!user) {
                return done(null, false, { message: "Incorrect username" });
            }
            bcryptjs.compare(password, user.password, (err, result) => {
                if (err) throw err;
                if (result === true) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            });
        } catch (err) {
            return done(err);
        }
    })
);

app.post("/signup", bodyParser.json(), async (req, res) => {
    if (req.body.username === undefined || req.body.password === undefined) {
        res.send("No username or password given!");
    } else {
        const hashPassword = await bcryptjs.hash(req.body.password, 10);
        const newUser = new User({
            username: req.body.username,
            password: hashPassword,
            email: req.body.email,
        });
        await newUser.save();
        res.send("Sucess!!");
    }
});

app.post(
    "/login",
    bodyParser.json(),
    passport.authenticate("local"),
    (req, res) => {
        jwt.sign(
            { username: req.body.username, password: req.body.password },
            "secretKey",
            (err, token) => {
                res.json({
                    token,
                });
            }
        );
    }
);
