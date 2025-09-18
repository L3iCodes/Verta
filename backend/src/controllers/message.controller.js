import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
    try{
        const loggedUserId = req.user._id;

        //Get users except for the current user
        const filteredUsers = await User.find(
            {_id: {$ne:loggedUserId}} //$ne: not equal
        ).select("-password");

        res.status(200).json(filteredUsers);
    }catch(error){
        console.log("Error in getUsersForSidebar Controller: ", error.message);
        res.status(500).json({error: "Internal Server Error"});
    };
};

export const getMessages = async (req, res) => {
    try{
        const { id: userToChatId } = req.params;
        const currentUserId = req.user._id;

        //Get messages between two users
        const messages = await Message.find({
            $or:[
                {senderId: currentUserId, receiverId:userToChatId},
                {senderId:userToChatId, receiverId:currentUserId}
            ]
        });

        res.status(200).json(messages);
    }catch(error){
        console.log("Error in getMessages Controller: ", error.message);
        res.status(500).json({error: "Internal Server Error"});
    };
};

export const sendMessage = async (req, res) => {
    try{
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        //Check if message has an image
        let imageUrl;
        if(image){
            //Upload to cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        };

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image:imageUrl,
        });

        await newMessage.save();

        // Realtime messaging
        const receiverSocketId = getReceiverSocketId(receiverId);
        // if user is online, send the message realtime
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", newMessage)
        }

        res.status(201).json(newMessage);
    }catch(error){
        console.log("Error in sendMessage Controller: ", error.message);
        res.status(500).json({error: "Internal Server Error"});
    };
};