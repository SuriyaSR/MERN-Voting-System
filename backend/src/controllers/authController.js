import bcrypt from "bcryptjs"
import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const registerUser = async(req, res) => {
    const {name, email, password} = req.body;
    const hashedPwd = await bcrypt.hash(password, 10);
    await User.create({name, email, password: hashedPwd});
    res.json({message: "User Registered Successfully..!!"})
}

export const loginUser = async(req, res) => {
    const {email, password} = req.body;
    
    const user = await User.findOne({email});
    if(!user) return res.json({message: "Invalid Email ID"});

    const checkPwd = await bcrypt.compare(password, user.password);
    if(!checkPwd) return res.json({message: "Invalid password"});

    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {
        expiresIn: "1d"
    })
    res.json(token);
}