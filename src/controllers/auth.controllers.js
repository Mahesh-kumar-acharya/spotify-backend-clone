const userModel = require('../models/user.model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

async function registerUsers(req, res) {
    const { username, email, password, role = "user" } = req.body ?? {}

    if (!username || !email || !password) {
        return res.status(400).json({
            message: "Username, email, and password are required."
        })
    }

    const isUserAlreadyExist = await userModel.findOne({
        $or: [
            { username },
            { email }
        ]
    })

    if(isUserAlreadyExist){
        return res.status(409).json({
            message: "User Already Exists .. "
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await userModel.create({
        username,
        email,
        password: hashedPassword,
        role
    })

    const token = jwt.sign({
        _id: user._id,
        role: user.role
    }, process.env.JWT_SECRET)

    res.cookie("token", token)

    res.status(201).json({
        message: "User created successfully .. ",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        }
    })

}

async function loginUsers(req, res) {

    const {username, email, password} = req.body

    const user = await userModel.findOne({
        $or: [
            {username},
            {email}
        ]
    })

    if(!user){
        return res.status(401).json({
            message: "Invalid credentials .. "
        })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if(!isPasswordValid){
        return res.status(401).json({
            message: "Invalid credentials ... "
        })
    }

    const token = jwt.sign({
        _id: user._id,
        role: user.role
    }, process.env.JWT_SECRET)
    
    res.cookie("token", token)

    res.status(200).json({
        message: "User logged in successfully .. ",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        }
    })

}

module.exports = {registerUsers, loginUsers}
