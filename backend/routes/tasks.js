const { Router } = require('express');
const db = require('../database');
const { nextIfManager } = require('../middleware');

router = Router();

// This route deletes a task from the database using the given id
router.delete('/:id', nextIfManager, async (req, res) => {
    const id = parseInt(req.params.id);
    if (id >= 0) {
        task = (await db.promise().query(`SELECT * FROM tasks WHERE id = ${id}`))[0];
        if (task.length == 1) {
            db.promise().query(`DELETE FROM tasks WHERE id = ${id}`);
            res.json({ 'msg': 'Successfully deleted task ' + task[0].name });
        } else {
            res.json({ 'msg': 'task not found' + id });
        }
    } else {
        res.json({ 'msg': 'The ID is invalid.' });
    }
});


// This route will return all tasks from all projects that a user is involved in
router.get('/user/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        tasks = (await db.promise().query(`SELECT * FROM tasks where id_project IN (
             SELECT id FROM tasks p where p.id IN 
             (select id_task from task_member pm where pm.id_user = ${id} ) ) ;`))[0];
        res.json(tasks);
    } catch (err) {
        res.status(500).send(err.message);
    }
})

// This route will return all tasks from a project given by id
router.get('/project/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        tasks = (await db.promise().query(`SELECT * FROM tasks where id_project = ${id} ;`))[0];
        res.json(tasks);
    } catch (err) {
        res.status(500).send(err.message);
    }
})

// This route will return all todo tasks from a project given by id
router.get('/project/todo/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        tasks = (await db.promise().query(`SELECT * FROM tasks where id_project = ${id} AND state = 'TODO' ;`))[0];
        res.json(tasks);
    } catch (err) {
        res.status(500).send(err.message);
    }
})

// This route will return all doing tasks from a project given by id
router.get('/project/doing/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        tasks = (await db.promise().query(`SELECT * FROM tasks where id_project = ${id} AND state = 'DOING' ;`))[0];
        res.json(tasks);
    } catch (err) {
        res.status(500).send(err.message);
    }
})

// This route will return all done tasks from a project given by id
router.get('/project/done/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        tasks = (await db.promise().query(`SELECT * FROM tasks where id_project = ${id} AND state = 'DONE' ;`))[0];
        res.json(tasks);
    } catch (err) {
        res.status(500).send(err.message);
    }
})



// This route, when called, will return the list of the all tasks in the database
router.get('/list', async (req, res) => {
    try {
        tasks = (await db.promise().query(`SELECT * FROM tasks;`))[0];
        res.json(tasks);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Paginate the tasks list
router.get('/list/:count/:page', async (req, res) => {
    const count = parseInt(req.params.count);
    const page = parseInt(req.params.page);
    if (count && page) {
        try {
            tasks = (await db.promise().query(`
                SELECT * FROM tasks LIMIT ${count * (page - 1)},${count};
            `))[0];
            res.json(tasks);
        } catch (err) {
            res.status(500).send(err.message);
        }
    }
});

// This route, when called, will create a task in the database according to the body of the post request.
router.post('/create', nextIfManager, async (req, res) => {
    const { state, title, description, deadline, id_project, id_user } = req.body;
    if (title && id_project && ['TODO', 'DOING', 'DONE'].includes(state)) {
        try {
            db.promise().query(`
            INSERT INTO tasks (state, title, description,deadline,id_project , id_user) VALUES
             ('${state}', '${title}', '${description}', '${deadline}', ${id_project}, '${id_user}')`
            );
            res.status(201).send({ msg: 'task Created' });
        } catch (err) {
            console.log(err);
            res.status(500).send(err.message);
        }
    } else {
        res.status(401).send({ msg: 'Please enter title and id_project and state.' });
    }
});

router.put('/updateuser', nextIfManager, async (req, res) => {
    let { id_task , id_user } = req.body;
    if(!id_user)
        id_user = null ;
    if (id_task) {
        try {
            verification = (await db.promise().query(`
            select * from project_member WHERE id_user = '${id_user}' AND
                id_project IN ( select id_project FROM tasks WHERE id =  '${id_task}' ) ;
             `
            ))[0];
            if(verification.length == 0 && id_user != null)
            {
                res.status(401).send({ msg: 'user is not in project.' });

            }
            else{
                if(id_user == null)
                    db.promise().query(`
                        UPDATE tasks set id_user = NULL WHERE id =  '${id_task}' `
                    );
                else
                    db.promise().query(`
                    UPDATE tasks set id_user = '${id_user}' WHERE id =  '${id_task}' `
                    );
            res.status(201).send({ msg: 'task user updated' });
        }
            
        } catch (err) {
            console.log(err);
            res.status(500).send(err.message);
        }
    } else {
        res.status(401).send({ msg: 'Please enter id_task and id_user.' });
    }
});

router.put('/updatestate', nextIfManager, async (req, res) => {
    const { id_task , state } = req.body;
    if (id_task && ['TODO', 'DOING', 'DONE'].includes(state)) {
        try {
            db.promise().query(`
            UPDATE tasks set state = '${state}' WHERE id =  '${id_task}' `
            );
            res.status(201).send({ msg: 'task state updated' });
        } catch (err) {
            console.log(err);
            res.status(500).send(err.message);
        }
    } else {
        res.status(401).send({ msg: 'Please enter id_task and state.' });
    }
});


// This route returns info about a project from the database using the given id
router.get('/:id', async (req, res, next) => {
    const id = parseInt(req.params.id);
    if (id) {
        task = (await db.promise().query(`SELECT * FROM tasks WHERE id = ${id}`))[0];
        if (task.length == 1) {
            res.json({
                'id': id,
                'state': task[0].state,
                'title': task[0].title,
                'description': task[0].description,
                'deadline': task[0].deadline,
                'id_task_manager': task[0].id_task_manager,
                'id_user': task[0].id_user
            });
        } else {
            res.json({ 'msg': 'task ${id} not found' });
        }
    } else {
        next();
    }
});

// Exporting the router
module.exports = router;