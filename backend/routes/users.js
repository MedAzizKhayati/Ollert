const { Router } = require('express');
const bcrypt = require('bcrypt');
const db = require('../database');
const { login, hashPassword } = require('../middleware')


router = Router();

/* MIDDLEWARES */

/* \MIDDLEWARES */


// This route, when called, will create a user in the database according to the body of the post request.
router.post('/create', hashPassword, async (req, res) => {
    const { username, email, password } = req.body;
    if (username && email && password) {
        try {
            db.promise().query(`
            INSERT INTO USERS (username, email, password) VALUES
             ('${username}', '${email}', '${password}')`
            );
            res.status(201).send({ msg: 'User Created' });
        } catch (err) {
            console.log(err);
            res.status(500).send(err.message);
        }
    } else {
        res.status(401).send({ msg: 'Please enter non empty fields.' });
    }
});

/* MIDDLEWARES */

router.use(login);

/* \MIDDLEWARES */

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
                SELECT * FROM users LIMIT ${count * (page - 1)},${count};
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
                INSERT INTO USERS (username, email, password) VALUES 
                ('${f()}', '${f() + "@" + f() + ".com"}', 'test123')`
            );
        }
        res.status(201).send({ msg: `The database has been bombarded with ${count} users.` });
    } else {
        res.status(404).json({ msg: 'Bad number' })
    }
});

// This route, is the login route.
router.post('/login', (req, res) => {
    res.send({ success: 'Login successfull.' });
})

//This route, is the logout route.
router.get('/logout', (req, res) => {
    req.session.isAuthenticated = false;
    req.session.user = null;
    res.status(201).send({ msg: 'Successfully logged out.' });
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
            res.status(500).send({ msg: 'Internal server error.'})
        }

    }else{
        res.json({ msg: 'Invalid ID' });
    }
})

// This function returns a random string used for testing.
function randomString() {
    return (Math.random() + 1).toString(36).substring(2);
};

// Exporting the router
module.exports = router;