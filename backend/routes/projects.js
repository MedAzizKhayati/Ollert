const { Router } = require('express');
const db = require('../database');
const { nextIfManager } = require('../middleware');

router = Router();

// This route deletes a project from the database using the given id
router.delete('/:id', nextIfManager, async (req, res) => {
    const id = parseInt(req.params.id);
    if (id >= 0) {
        project = (await db.promise().query(`SELECT * FROM projects WHERE id = ${id}`))[0];
        if (project.length == 1) {
            db.promise().query(`DELETE FROM projects WHERE id = ${id}`);
            res.json({ 'msg': 'Successfully deleted project ' + project[0].name });
        } else {
            res.json({ 'msg': 'Project not found' + id });
        }
    } else {
        res.json({ 'msg': 'The ID is invalid.' });
    }
});


// This route returns info about a project from the database using the given id
router.get('/:id', async (req, res, next) => {
    const id = parseInt(req.params.id);
    if (id) {
        project = (await db.promise().query(`SELECT * FROM projects WHERE id = ${id}`))[0];
        if (project.length == 1) {
            res.json({
                'id': id,
                'name': project[0].name,
                'type': project[0].type,
                'description': project[0].description,
                'deadline': project[0].deadline,
                'id_project_manager': project[0].id_project_manager
            });
        } else {
            res.json({ 'msg': 'Project ${id} not found' });
        }
    } else {
        next();
    }
})

// This route will return all projects that a user is involved in
router.get('/user/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        projects = (await db.promise().query(`SELECT * FROM projects p where 
            p.id IN (select id_project from project_member pm where pm.id_user = ${id} )
            or p.id_project_manager = ${id};`))[0];
        res.json(projects);
    } catch (err) {
        res.status(500).send(err.message);
    }
})

//This router will return all the members involved in a certain project
router.get('/:id/users', async (req, res) => {
    const id = parseInt(req.params.id);
    if (id && id > 0) {
        return db.promise().query(`
            SELECT id, username FROM USERS WHERE id in (
                SELECT id_project_manager FROM PROJECTS p WHERE p.id = ${id}
                UNION
                SELECT id_user FROM PROJECT_MEMBER pm WHERE pm.id_project = ${id}
            )
        `).then(response => res.json(response[0]))
            .catch(err => res.status(500).send(err.message))
    } else {
        return res.sent.status(401).send({ error: "Invalid id." })
    }
})

// This route, when called, will return the list of the all projects in the database
router.get('/list', async (req, res) => {
    try {
        projects = (await db.promise().query(`SELECT * FROM projects;`))[0];
        res.json(projects);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Paginate the projects list
router.get('/list/:count/:page', async (req, res) => {
    const count = parseInt(req.params.count);
    const page = parseInt(req.params.page);
    if (count && page) {
        try {
            projects = (await db.promise().query(`
                SELECT * FROM projects ORDER BY id DESC LIMIT ${count * (page - 1)},${count};
            `))[0];
            res.json(projects);
        } catch (err) {
            res.status(500).send(err.message);
        }
    }
});

// This route, when called, will create a project in the database according to the body of the post request.
router.post('/create', nextIfManager, async (req, res) => {
    const { name, type, description, deadline, id_project_manager, users } = req.body;
    if (name && type && id_project_manager) {
        try {
            db.promise().query(`
            INSERT INTO projects (name, type, description,deadline,id_project_manager) VALUES
             ('${name.charAt(0).toUpperCase() + name.slice(1)}', '${type}', '${description}', '${getSQLDate(deadline)}', '${id_project_manager}')`
            );
            const projectID = (await db.promise().query(`select id from projects ORDER BY id DESC LIMIT 1`))[0][0].id;
            if (users.length) {
                users.forEach(id => {
                    db.promise().query(`
                        INSERT INTO project_member VALUES (${id}, ${projectID})
                    `)
                });
            }
            return res.status(201).send({ success: 'Project Created' });
        } catch (err) {
            console.log(err);
            res.status(500).send(err.message);
        }
    } else {
        res.status(203).send({ error: 'Please enter name and type.' });
    }
});

//This route will look for project of similar name
router.get('/search', async (req, res) => {
    const query = req.query.query;
    try {
        let projects = []
        if (query && query != '')
            projects = (await db.promise().query(
                `
                    SELECT id, name FROM PROJECTS WHERE NAME LIKE '${query}%'
                    LIMIT 7
                `
            ))[0];
        return res.status(200).send(projects);
    } catch (err) {
        return res.status(500).send({ msg: err.msg })
    }

})

//This route, when called will create random projects with a random project manager.
router.get('/create-random/:count', nextIfManager, (req, res) => {
    const count = parseInt(req.params.count);
    if (count)
        for (let i = 0; i < count; i++)
            if (!createRandomProject())
                return res.status(500).send({ msg: 'Internal error' })
    res.send({ msg: 'success' });
})

//This function is for creating a ranodom project 
const createRandomProject = async () => {
    let projectManager = 1;
    let managers = (await db.promise().query(`SELECT id from users WHERE role = 'CHEF'`))[0];
    let members = (await db.promise().query(`SELECT id from users WHERE role = 'MEMBRE'`))[0];
    projectManager = managers[Math.floor(Math.random() * managers.length)].id;
    const numberOfMembers = Math.floor(Math.random() * 5) + 3;
    members = Array(numberOfMembers).fill(0).map(() => members[Math.floor(Math.random() * members.length)].id)
    const f = randomString;
    const states = ['TODO', 'DONE', 'DOING', 'DONE']
    try {
        const deadline = randomDateFromNow();
        const name = f();
        db.promise().query(`
        INSERT INTO PROJECTS (name, type, description, deadline, id_project_manager)
        VALUES ('${name.charAt(0).toUpperCase() + name.slice(1)}', '${f()}', '${f()}', '${deadline}', ${projectManager})
        `)
        const projectID = (await db.promise().query(`select id from projects ORDER BY id DESC LIMIT 1`))[0][0].id;
        members.map(id => {
            db.promise().query(`
                INSERT INTO project_member VALUES (${id}, ${projectID})
            `)
            let count = Math.random() * 5
            for (let i = 0; i < count; i++) {
                db.promise().query(`
                INSERT INTO tasks (state, title, description,deadline,id_project, id_user) VALUES
                ('${states[Math.floor(Math.random() * 4)]}', '${f()}', '${f()}', '${deadline}', ${projectID}, ${id})`
                );
            }
            return 0
        })

        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}

// This will transform a string into a date to pass to the database
function getSQLDate(date) {
    return new Date(date).toISOString().slice(0, 19).replace('T', ' ');
}


// This function will make a random Date
function randomDateFromNow() {
    return new Date(Date.now() + Math.floor(Math.random() * 30 + 3) * 24 * 3600 * 1000).toISOString().slice(0, 19).replace('T', ' ');
}

// This function returns a random string used for testing.
function randomString() {
    return (Math.random() + 1).toString(36).substring(2);
};

// Exporting the router
module.exports = router;