const {Router} = require('express');
const userModel = require('../models/user');
const {generateToken} = require('../services/authentication'); // Assuming you have a utility to generate tokens
const jwt = require('jsonwebtoken');


const router = Router();

// routes to check authentication
router.get('/check-auth', async(req,res)=>{
    const token = req.cookie;
    if(!token){
        return res.status(401).json({message: "user not authenticated"});
    }   
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id).select('-password'); // Exclude password from the response
        if(!user){
            return res.status(404).json({message: 'User not found'});
        }
        res.status(200).json({user});
    }
    catch(err){
        console.error('Authentication error:', err);
        res.status(401).json({message: 'Invalid token'});
    }
})


// signup page
router.post('/signup', async(req, res )=>{
    const {name, email,phone, password, role} = req.body;
    if(!name || (!email && !phone) || !password || !role){
        return res.status(400).json({message: 'All fields are required'});
    }
    // Check if user already exists
    try{
        const existingUser = await userModel.findOne({
        $or: [
            email ? {email} : undefined,
            phone ? {phone} : undefined
        ].filter(Boolean)
    });
    if(existingUser){
        return res.status(400).json({message: 'User already exists'});
    }
    // Create new user
    const user = await userModel.create({
        name,
        email : email || undefined, // Allow email to be null if not provided
        phone: phone || undefined, // Allow phone to be null if not provided
        password,
        role
    })
    // generate token and send response
    const token = generateToken(user);
    res.cookie('token', token, {
        httpOnly: true, // Prevents client-side JavaScript from accessing the cookie    
        secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
        sameSite: 'Strict', // Helps prevent CSRF attacks
        maxAge: 7*24 * 60 * 60 * 1000 // Cookie expires in 1 day
    });
    res.status(201).json({
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
    });
    }
    catch(err){
        console.error('Signup error:', err);
        res.status(500).json({message: 'Internal server error'});
    }
})
// login page
router.post('/login', async(req, res)=>{
    const {identifier, password} = req.body;
    if(!identifier || !password){
        return res.status(400).json({message: 'All fields are required'});
    }
    try{
        // Check if user exists
        const user = await userModel.findOne({
        $or:[
            {email: identifier},
            {phone: identifier}
        ]
       })
       if(!user){
         return res.status(400).json({message: 'user not found'});
       }
        // Match password
        const email = user.email;
        const phone = user.phone;
        const token = await userModel.matchpassword({email,phone, password});
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
            sameSite: 'Strict', // Helps prevent CSRF attacks   
            maxAge: 7*24 * 60 * 60 * 1000 // Cookie expires in 7 day
        })
        res.status(200).json({
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
        });
    }
    catch(err){
        console.error('Login error:', err);
        res.status(401).json({message: 'Invalid email or password'});
    }
})

module.exports = router;