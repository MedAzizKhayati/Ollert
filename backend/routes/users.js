const { Router } = require('express');
const db = require('../database');

router = Router();

// This route, when called, will return the list of the all the users in the database
router.get('/list', async (req, res) => {
    try {
        users = (await db.promise().query(`SELECT * FROM users;`))[0];
        console.log(users);
        res.json(users);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Paginate the users' list
router.get('/list/:count/:page', async (req, res) => {
    const count  = parseInt(req.params.count);
    const page = parseInt(req.params.page);
    if(count && page){
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

// This route, when called, will create a user in the database according to the body of the post request.
router.post('/create', (req, res) => {
    const { username, email, password } = req.body;
    if (username && email && password) {
        try {
            db.promise().query(`
                INSERT INTO USERS VALUES(NULL, "${username}", "${email}", "${password}", NULL, NULL)`
            );
            res.status(201).send({ msg: 'User Created' });
        } catch (err) {
            console.log(err);
            res.status(500).send(err.message);
        }
    } else {
        res.status(200).send({ msg: 'Please enter non empty fields.' });
    }
});

// This route, when called, will bombard the users' table with random users
router.get('/create-random/:count', (req, res) => {
    const count  = parseInt(req.params.count);
    if(count && 0 < count && count < 1000) {
        for (let i = 0; i < count; i++) {
            const f = randomString;
            db.promise().query(`
                INSERT INTO USERS VALUES(NULL, '${f()}', '${f()+"@"+f() + ".com"}', '${f()}', NULL, NULL)`
            );
        }
        res.status(201).send({ msg: `The database has been bombarded with ${count} users.` });
    }else{
        res.status(404).json({ msg: 'Bad number'})
    }
    
});

// This function returns a random string used for testing.
function randomString() {
    return (Math.random() + 1).toString(36).substring(2);
};

// Exporting the router
module.exports = router;