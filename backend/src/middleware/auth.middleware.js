import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const authenticateJWT = async (req, res, next) => {
    try{
        //Check if token exists
        const token = req.cookies.jwt;
        if(!token) return res.status(401).json({ message: "Unauthorize - No Token Provided"});

        // Verify the token
        jwt.verify(token, process.env.JWT_SECRET, async (error, decoded) => {
            if(error){
                return res.status(401).json({ message: "Unauthorize - Invalid Token"});
            };

            //Get user info (except for the password)
            const user = await User.findById(decoded.userId).select("-password");
            if(!user) return res.status(404).json({ message: "User does not exists"});

            req.user=user;
            next();
        });

    }catch(error){
        console.log('Error in Middleware authenticateJWT', error.message)
        return res.status(500).json({ message: "Internal Server Error"});
    };
};