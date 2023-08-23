const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");
const User = require("../models/userModels");

const sendMessage = asyncHandler(async (req, res) => {

    const {content,chatId} = req.body;

    if(!content || !chatId){
        res.status(400);
        throw new Error("Invalid data");
    }

    var newMessage = {
        sender:req.user._id,
        content:content,
        chat:chatId
    }

    try{
        var message = await Message.create(newMessage);
        message = await message.populate("sender","name pic");
        message = await message.populate("chat");
        message = await User.populate(message,{
            path:"chat.users",
            select:"name pic"
        });

        await Chat.findByIdAndUpdate(req.body.chatId,{
            latestMessage:message
        });
        res.json(message);
    }
    catch(err){
        res.status(500);
        console.log(err);
        throw new Error("Failed to send message");
    }
});

const allMessages = asyncHandler(async (req, res) => {
    try{
        const messages = await Message.find({chat:req.params.chatId})
        .populate("sender","name pic")
        .populate("chat");
        res.json(messages);
    }
    catch(err){
        res.status(500);
        console.log(err);
    }
});


module.exports = {sendMessage,allMessages};