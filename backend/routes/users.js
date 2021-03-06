const { Router } = require('express');
const bcrypt = require('bcrypt');
const db = require('../database');
const { hashPassword } = require('../middleware')
const { isEmail } = require('validator');
const path = require('path');
var fs = require('fs');
const { route } = require('express/lib/application');
const { send } = require('process');
const res = require('express/lib/response');

router = Router();

/* MIDDLEWARES */

const updateUserSession = async (req, res, next) => {
    try {
        user = (await db.promise().query(`SELECT 
        id, username, email, first_name, last_name, picture, role FROM USERS
        WHERE id = '${req.session.user.id}'
        `))[0][0];
        req.session.user = user;
        return next();
    } catch (err) {
        return res.status(500).send(err.msg);
    }
}

/* \MIDDLEWARES */


// This route, when called, will create a user in the database according to the body of the post request.
router.post('/create', hashPassword, async (req, res) => {
    const { username, email, password } = req.body;
    if (username && username.length >= 3 && isEmail(email) && password) {
        try {
            users = (await db.promise().query(`
                SELECT id from users where email = '${email}' or username = '${username}'
            `))[0];
            if (users.length == 0) {
                db.promise().query(`
                INSERT INTO USERS (username, email, password, picture) VALUES
                ('${username}', '${email}', '${password}', '${process.env.DEFAULT_PROFILE_PICTURE}')`
                );
                res.status(201).send({ success: 'User Created' });
            } else {
                res.send({ error: 'Email/username already in use. Please use another information.' });
            }
        } catch (err) {
            console.log(err);
            res.status(500).send(err.message);
        }
    } else {
        res.status(401).send({ msg: 'Make sure you entered all the fields correctly.' });
    }
});

// This route updates the user information in the database
router.put('/update', async (req, res) => {
    const { email, first_name, last_name } = req.body;
    if (email && isEmail(email) && first_name != undefined && last_name != undefined) {
        let user = []
        if (email != req.session.user.email)
            user = (await db.promise().query(`SELECT id FROM USERS WHERE email = '${email}'`))[0];
        if (user.length == 0) {
            try {
                (await db.promise().query(`UPDATE USERS SET 
                email = '${email}', first_name = '${first_name}', last_name = '${last_name}' WHERE id = ${req.session.user.id}
                `));
                res.status(201).json({ msg: 'User has been updater' })
            } catch (err) {
                res.status(500).json({ 'msg': err.message });
            }
        } else {
            res.status(401).json({ 'msg': 'Email already in use.' });
        }
    } else {
        res.status(401).json({ 'msg': 'Empty fields/wrong email.' });
    }
})

// This route deletes a user from the database using the given id
router.delete('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    if (id >= 0) {
        user = (await db.promise().query(`SELECT * FROM USERS WHERE id = ${id}`))[0];
        if (user.length == 1) {
            db.promise().query(`DELETE FROM USERS WHERE id = ${id}`);
            res.json({ 'msg': 'Successfully deleted user ' + user[0].username });
        } else {
            res.json({ 'msg': 'User not found for ID ' + id });
        }
    } else {
        res.json({ 'msg': 'The ID is invalid.' });
    }
});



// This route deletes users with ID's greater than the given ID
router.delete('/delete-greater/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    if (id >= 0) {
        try {
            db.promise().query(`DELETE FROM USERS WHERE id >= ${id}`);
            res.json({ 'msg': 'Successfully deleted' });
        } catch (err) {
            console.log(err);
            res.json({ 'msg': err.message });
        }
    } else {
        res.json({ 'msg': 'The ID is invalid.' });
    }
});

// This route will query users with their username
router.get('/search/:query', async (req, res) => {
    const query = req.params.query;
    try {
        let users = [];
        if (query && query != ''){
            users = (await db.promise().query(`
            SELECT id, username FROM users 
            WHERE username LIKE "${query}%"
            LIMIT 7;`))[0];
        }
        return res.send(users);
    } catch (err) {
        res.status(500).json({ 'msg': err});
    }
})


// This route, when called, will return the list of the all the users in the database
router.get('/list', async (req, res) => {
    try {
        users = (await db.promise().query(`SELECT * FROM users;`))[0];
        res.send(users);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Paginate the users' list
router.get('/list/:count/:page', async (req, res) => {
    const count = parseInt(req.params.count);
    const page = parseInt(req.params.page);
    if (count && page) {
        try {
            users = (await db.promise().query(`
                SELECT 
                id, username, email, first_name, last_name, role
                FROM users LIMIT ${count * (page - 1)},${count};
            `))[0];
            res.json(users);
        } catch (err) {
            res.status(500).send(err.message);
        }
    }
});

// This route, when called, will bombard the users' table with random users
router.get('/create-random/:count', (req, res) => {
    const count = parseInt(req.params.count);
    if (count && 0 < count && count < 1000) {
        for (let i = 0; i < count; i++) {
            const f = randomString;
            db.promise().query(`
                INSERT INTO USERS (username, email, password, picture) VALUES 
                ('${f()}', '${f() + "@" + f() + ".com"}', 'test123', '${process.env.DEFAULT_PROFILE_PICTURE}')`
            );
        }
        res.status(201).send({ msg: `The database has been bombarded with ${count} users.` });
    } else {
        res.status(404).json({ msg: 'Bad number' })
    }
});

// This route, is the login route.
router.post('/login', async (req, res) => {
    let { email, password } = req.body;
    if (email && password) {
        try {
            const user = (await db.promise().query(`
                SELECT * FROM USERS WHERE email = '${email}'
            `))[0];
            // Checking if the user exists and the password matches using the bcrypt.compare function
            if (user.length && await bcrypt.compare(password, user[0].password)) {
                req.session.isAuthenticated = true;
                req.session.user = user[0];
                res.status(201).send({ success: 'Successfully logged in.' });
            }
            else
                res.send({ error: 'Wrong email or password.' })
        } catch (err) {
            console.log(err);
            res.status(500).send(err.message);
        }
    } else {
        res.send({ error: 'Please enter non empty fields.' });
    }
})

// This route, will return the user stored in session
router.get('/getUser', updateUserSession, async (req, res) => {
    user = req.session.user;
    res.status(201).send({
        user: {
            id: user.id,
            username: user.username,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            role: user.role
        }
    });
})


//This route, is the logout route.
router.get('/logout', (req, res) => {
    req.session.isAuthenticated = false;
    req.session.user = null;
    res.status(201).send({ msg: 'Successfully logged out.' });
})

// this route, will return the current user's profile picture
router.get('/profilePicture', async (req, res) => {
    res.sendFile(path.resolve(req.session.user.picture));
})

// this router will return the profile picture for a specific user, by id
router.get('/profilePicture/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    if(id >= 0)
        db.promise().query(`
            SELECT * FROM USERS WHERE id = ${id}
        `).then((response) => {
            const user = response[0];
            if(user.length)
                return res.sendFile(path.resolve(user[0].picture))

            return res.send({ error: 'User id is not existant'});
        }).catch(err => res.send({ msg: err.msg}))
})


// This route will take care of uploading the image to the server and saving it to the database
router.post('/updateImage', async (req, res) => {
    let sampleFile, uploadPath;
    if (!req.files || !Object.keys(req.files).includes('image')) {
        return res.status(400).send({ msg: 'No picture was uploaded' });
    }
    sampleFile = req.files.image;

    if (!sampleFile.mimetype.startsWith('image')) {
        return res.status(400).send({ msg: 'The uploaded file is not a picture' });
    }
    const fileName = process.env.FILE_UPLOAD_PATH + '/' + Date.now() + sampleFile.name;
    uploadPath = path.resolve(fileName);

    // use mv() to place file on the server
    sampleFile.mv(uploadPath, async err => {
        if (err) return res.status(500).send(err);
    })
    console.log(req.session.user);
    if (req.session.user.picture != process.env.DEFAULT_PROFILE_PICTURE)
        try {
            fs.unlinkSync(req.session.user.picture);
        } catch (err) {
            console.log(err);
        }
    const id = req.session.user.id;
    try {
        await db.promise().query(`
            UPDATE USERS SET picture = '${fileName}' WHERE id = ${id}
            `);
    } catch (err) {
        console.log(err);
        return res.status(500).send(err);
    }
    return res.send('Image uploaded.');
})

// This route will return information about the user using a given id
router.get('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    if (id >= 0) {
        try {
            user = (await db.promise().query(`SELECT id, username, email, first_name, last_name, role FROM
            users WHERE id =${id};
            `))[0];
            if (user.length == 1) {
                res.json(user);
            } else {
                res.json({ msg: 'Invalid ID' });
            }
        } catch (error) {
            res.status(500).send({ msg: 'Internal server error.' })
        }

    } else {
        res.json({ msg: 'Invalid ID' });
    }
})

// This function returns a random string used for testing.
function randomString() {
    return (Math.random() + 1).toString(36).substring(2);
};


// Exporting the router
module.exports = router;