const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModels");

const accessChat = asyncHandler(async (req, res) => {
    const { userId } = req.body;

    if(!userId){
        res.status(400);
        console.log("user id params not sent with request");
        }

   var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
        {users: {$elemMatch: {$eq: req.user._id}}},
        {users: {$elemMatch: {$eq: userId}}}
        
    ],
   })
    .populate("users","-password")
    .populate("latestMessage");

    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name pic email",
    });

    if(isChat.length > 0){
        res.send(isChat[0]);
    }
    else{
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id,userId]
        };

        try{
            const createChat = await Chat.create(chatData);
            const FullChat = await Chat.findOne({_id: createChat._id})
            .populate("users","-password");

            res.status(201).send(FullChat);

        }catch(error){
            res.status(400);
            throw new Error("not there");
        }
        
    }

});

const fetchChat = asyncHandler(async (req, res) => {
    
    try{
        Chat.find({users: {$elemMatch: {$eq: req.user._id}}})
        .populate("users","-password")
        .populate("latestMessage")
        .populate("groupAdmin","-password")
        .sort({updatedAt: -1})
        .then(async (result) => {
            result = await User.populate(result, {
                path: "latestMessage.sender",
                select: "name pic email",
            });
            res.status(200).send(result);
        })
    }catch(error){
        res.status(400);
        throw new Error("not there");
    }

});

const createGroupChat = asyncHandler(async (req, res) => {
    if(!req.body.users || !req.body.name){
        return res.status(400).send("Invalid parameters");
    }

    var users = JSON.parse(req.body.users);

    if(users.length < 2){
        return res
        .status(400)
        .send("More than 2 users are required for group chat");
    }

    users.push(req.user);

    try{
        const groupChat = await Chat.create({
            chatName: req.body.name,
            isGroupChat: true,
            users: users,
            groupAdmin: req.user
        });
    
    const fullGroupChat = await Chat.findOne({_id: groupChat._id})
    .populate("users","-password")
    .populate("groupAdmin","-password");

    res.status(201).json(fullGroupChat);
    }
    catch(error){
        res.status(400);
        throw new Error("not there");
    }
});

const renameGroup = asyncHandler(async (req, res) => {

    const {chatId , chatName} = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        {chatName},
        {new: true}
    )
    .populate("users","-password")
    .populate("groupAdmin","-password");

    if(!updatedChat){
        res.status(400);
        throw new Error("Chat not found");
    }else{
        res.status(200).send(updatedChat);
    }
});

const addToGroup = asyncHandler(async (req, res) => {
    const {chatId , userId} = req.body;

    const added = await Chat.findByIdAndUpdate(
        chatId,
        {
            $push: {users: userId}
        },
        {
            new: true
        }
    )
    .populate("users","-password")
    .populate("groupAdmin","-password");

    if(!added){
        res.status(400);
        throw new Error("Chat not found");
    }else{
        res.status(200).send(added);
    }
});

const removeFromGroup = asyncHandler(async (req, res) => {
    const {chatId , userId} = req.body;

    const removed = await Chat.findByIdAndUpdate(
        chatId,
        {
            $pull: {users: userId}
        },
        {
            new: true
        }
    )
    .populate("users","-password")
    .populate("groupAdmin","-password");

    if(!removed){
        res.status(400);
        throw new Error("Chat not found");
    }else{
        res.status(200).send(removed);
    }
});

module.exports = {accessChat ,addToGroup, fetchChat , createGroupChat,renameGroup,removeFromGroup};
