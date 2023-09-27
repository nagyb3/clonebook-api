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

//get all of the posts (user for homepage)
app.get(
    "/posts",
    asyncHandler(async (req, res) => {
        const allPosts = await Post.find({});
        res.send({ all_posts: allPosts });
    })
);

//create post
app.post(
    "/posts",
    asyncHandler(async (req, res) => {
        if (
            req.body.text === undefined ||
            req.body.author_username === undefined
        ) {
            res.sendStatus(422);
        }
        try {
            jwt.verify(req.headers.authorization.split(" ")[1], "secretKey");
            await Post.create({
                text: req.body.text,
                author_username: req.body.author_username,
            });
            res.send({
                response: "message submitted",
            });
        } catch {
            res.sendStatus(401);
        }
    })
);

//GET all of the posts for a username
app.get(
    "/posts/user/:username",
    asyncHandler(async (req, res) => {
        try {
            res.send(
                await Post.find({
                    author_username: req.params.username,
                })
            );
        } catch {
            res.sendStatus(401);
        }
    })
);

//GET a post by id
app.get(
    "/posts/:postid",
    asyncHandler(async (req, res) => {
        try {
            res.send(await Post.findOne({ _id: req.params.postid }));
        } catch {
            res.sendStatus(401);
        }
    })
);

//get all of the comments
app.get(
    "/comments",
    asyncHandler(async (req, res) => {
        const allComments = await Comment.find({});
        res.send({
            comments_array: allComments,
        });
    })
);

//get a comment by its id
app.get(
    "/comments/:commentid",
    asyncHandler(async (req, res) => {
        try {
            const theComment = await Comment.find({
                _id: req.params.commentid,
            });
            res.send({
                array: theComment,
            });
        } catch {
            res.sendStatus(401);
        }
    })
);

//post a comment
app.post(
    "/comments",
    asyncHandler(async (req, res) => {
        if (
            (req.body.comment_author_username === undefined ||
                req.body.post_id === undefined,
            req.body.text === undefined)
        ) {
            res.sendStatus(422);
        }
        try {
            jwt.verify(req.headers.authorization.split(" ")[1], "secretKey");
            await Comment.create({
                comment_author_username: req.body.comment_author_username,
                post_id: req.body.post_id,
                text: req.body.text,
            });
            res.send({
                response: "comment submitted",
            });
        } catch {
            res.sendStatus(401);
        }
    })
);

// post a message (chat)
app.post(
    "/message",
    asyncHandler(async (req, res) => {
        if (
            (req.body.text === undefined ||
                req.body.sender_user_id === undefined,
            req.body.receiver_user_id === undefined)
        ) {
            res.sendStatus(422);
        } else {
            try {
                jwt.verify(
                    req.headers.authorization.split(" ")[1],
                    "secretKey"
                );
                await Message.create({
                    text: req.body.text,
                    sender_user_id: req.body.sender_user_id,
                    receiver_user_id: req.body.receiver_user_id,
                });
            } catch {
                res.sendStatus(401);
            }
        }
    })
);

//get a message by its id
app.get(
    "/message/:id",
    asyncHandler(async (req, res) => {
        try {
            const theComment = await Comment.find({ _id: req.params.id });
            res.send({ comment: theComment });
        } catch {
            res.send(401);
        }
    })
);

//get the messages that given user either sent or received
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

//delete a post by its id
app.delete(
    "/posts/:postid",
    asyncHandler(async (req, res) => {
        await Post.deleteOne({ _id: req.params.postid });
        res.sendStatus(200);
    })
);

//get the friends of a user
app.get(
    "/friends/:userid",
    asyncHandler(async (req, res) => {
        const thisUser = await User.findOne({ username: req.params.userid });
        res.send({
            friends: thisUser.friends,
        });
    })
);

//add a user a to another user's friends array (make friendship)
app.put(
    "/friends/add",
    asyncHandler(async (req, res) => {
        try {
            jwt.verify(req.headers.authorization.split(" ")[1], "secretKey");
            // figure out if other user exists!!
            const secondUser = await User.findOne({
                username: req.body.second_username,
            });
            const reqUser = await User.findOne({
                username: req.body.req_username,
            });
            if (secondUser === null || reqUser === null) {
                //second_username doesnt exist in db
                res.sendStatus(404);
            } else {
                //both users exist
                //check if they already friends:
                if (
                    !(
                        reqUser.friends.includes(req.body.second_username) ||
                        secondUser.friends.includes(req.body.req_username)
                    )
                ) {
                    await User.updateOne(
                        { username: req.body.req_username },
                        { $push: { friends: req.body.second_username } }
                    );
                    await User.updateOne(
                        { username: req.body.second_username },
                        { $push: { friends: req.body.req_username } }
                    );
                    res.sendStatus(200);
                } else {
                    res.send({
                        status: "already friends",
                    });
                }
            }
        } catch {
            res.sendStatus(401);
        }
    })
);

//messenger
//get the chats between two users
app.post(
    "/chat",
    asyncHandler(async (req, res) => {
        try {
            jwt.verify(req.headers.authorization.split(" ")[1], "secretKey");
            const messagesList = await Message.find({
                $or: [
                    {
                        sender_username: req.body.rec_user,
                        receiver_username: req.body.req_user,
                    },
                    {
                        sender_username: req.body.req_user,
                        receiver_username: req.body.rec_user,
                    },
                ],
            });
            res.json({
                requester: req.body.id,
                parameter_user: req.params.id,
                messages: messagesList,
            });
        } catch {
            res.sendStatus(401);
        }
    })
);

//create message
app.post(
    "/messages/create",
    bodyParser.json(),
    asyncHandler(async (req, res) => {
        try {
            jwt.verify(req.headers.authorization.split(" ")[1], "secretKey");
            await Message.create({
                sender_username: req.body.sender_username,
                receiver_username: req.body.receiver_username,
                text: req.body.text,
            });
            res.sendStatus(200);
        } catch {
            res.sendStatus(401);
        }
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
