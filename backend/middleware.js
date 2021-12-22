// libs
const db = require('./database');
const bcrypt = require('bcrypt');

// DO NOT CHANGE, UNLESS YOU KNOW WHAT YOU'RE DOING !!!
const SALT_ROUNDS = 10;
const PATHS_NO_AUTHENTICATION = ['/api/users/login', '/api/users/create']

// login middleware
const nextIfAuthenticated = async (req, res, next) => {
    // If the user is already authenticated, move on
    if( req.session.isAuthenticated || PATHS_NO_AUTHENTICATION.includes(req.path) ) 
        next();
    else{
        res.status(401).send({msg: 'You are not authenticated'})
    }
    
}

const hashPassword = async (req, res, next) => {
    // Hashing the password with salt 0 - No need for great security here
    if(req.body.password){
        const salt = await bcrypt.genSalt(SALT_ROUNDS);
        req.body.password = await bcrypt.hash(req.body.password, salt);
        next();
    }else{
        console.log(req.body);
        res.json({msg: 'Missing information.'})
    }
}

const nextIfManager = async (req, res, next) => {
    if(req.session.user.role == 'CHEF')
        next();
    else
        res.json({msg: "Insufficient permissions."})
}

// Exporting the middlewares as a dictionary of middlewares
module.exports = {
    nextIfAuthenticated, 
    hashPassword,
    nextIfManager
}