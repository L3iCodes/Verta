import User from '../models/user.model.js';
import bcrypt from 'bcrypt';

import { generateToken } from '../lib/utils.js';
import cloudinary from '../lib/cloudinary.js'

export const signup = async (req, res) => {
    const {fullName, email, password} = req.body;
    
    try{    
        //Check if all fields are filled up
        // if(!fullName || !email || password) {
        //     return res.status(400).json({ message: "All fields are required"});
        // }

        //Check if password length is valid
        if(password.lenght < 6) {
            return res.status(400).json({ message: "Password must be at least 6 caharacters"});
        };

        //Check is email already exists
        const user = await User.findOne({email});
        if(user) return res.status(400).json({ message: "Email already exists"});

        //Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        //Save new user
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        });

        if(newUser){
            // Generate JWT Token
            generateToken(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic
            });
        }else{
            return res.status(400).json({ message: "Invalid user data"});
        };

    }catch(error){
        console.log('Error in Signup Controller', error.message);
        return res.status(500).json({ message: "Internal Server Error"});
    };
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    
    try{
        //Search for user in the db
        const user = await User.findOne({email});
        if(!user) return res.status(400).json({ message: "User does not exists"});

        //Check if password matches
        const passwordMatch = await bcrypt.compare(password, user.password);
        if(!passwordMatch){
            return res.status(400).json({ message: "Incorrect password or email"});
        };

        //Generate token
        generateToken(user._id, res);

        res.status(201).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic
        });
    }catch(error){
        console.log('Error in Login Controller', error.message);
        return res.status(500).json({ message: "Internal Server Error"});
    };
};

export const logout = async (_req, res) => {
    try{
        //Clear the cookie
        res.cookie("jwt", "", {maxAge: 0});
        return res.status(200).json({ message: "Logout Succesfully"});
    }catch(error){
        console.log('Error in Logout Controller', error.message);
        return res.status(500).json({ message: "Internal Server Error"});
    }
};

export const updateProfile = async (req, res) => {
    try{
        const {profilePic} = req.body;
        const userId = req.user._id;

        if(!profilePic){
            return res.status(400).json({ message: "Profile picture is required"});
        };

        // Upload image in cloudinary
        const uploadResponse = await cloudinary.uploader(profilePic);
        
        // Update user profile picture
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {profilePic:uploadResponse.secure_url},
            {new: true},
        );

        res.status(200).json(updatedUser);
    }catch(error){
        console.log('Error in UpdateProfile Controller', error.message);
        return res.status(500).json({ message: "Internal Server Error"});
    }
};

export const checkAuth = (req, res) => {
    try{
        res.status(200).json(req.user);
    }catch(error){
        console.log('Error in CheckAuth Controller', error.message);
        return res.status(500).json({ message: "Internal Server Error"});
    };
};