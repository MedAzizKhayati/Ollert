// libs
const db = require('./database');
const bcrypt = require('bcrypt');

// login middleware
const login = async (req, res, next) => {
    // If the user is already authenticated, move on
    if( req.isAuthenticated )
        next();
    // otherwise, try to get the login details from the body
    else{
        let {email, password } = req.body;
        if (email && password) {
            try {
                const user = (await db.promise().query(`
                    SELECT * FROM USERS WHERE email = '${email}'
                `))[0];
                // Checking if the user exists and the password matches using the bcrypt.compare function
                if(user.length && await bcrypt.compare(password, user[0].password)){
                    req.session.isAuthenticated = true;
                    req.session.user = user[0];
                    next();
                    res.status(201).send({ msg: 'Successfully logged in.' });
                } 
                else
                    res.status(401).send({ msg: 'Wrong email or password.'})
            } catch (err) {
                console.log(err);
                res.status(500).send(err.message);
            }
        } else {
            res.status(401).send({ msg: 'Please enter non empty fields.' });
        }
    }
}

// Exporting the middlewares as a dictionary of middlewares
module.exports = {
    login
}