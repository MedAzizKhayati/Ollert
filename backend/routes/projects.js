const { Router } = require('express');
const db = require('../database');
const {nextIfManager} = require('../middleware');

router = Router();

// This route deletes a project from the database using the given id
router.delete('/:id', nextIfManager, async (req, res) => {
    const id  = parseInt(req.params.id);
    if(id >= 0){
        project = (await db.promise().query(`SELECT * FROM projects WHERE id = ${id}`))[0];
        if(project.length == 1){
            db.promise().query(`DELETE FROM projects WHERE id = ${id}`);
            res.json({'msg': 'Successfully deleted project '+ project[0].name});
        }else{
            res.json({'msg': 'Project not found' + id});
        }
    }else{
        res.json({'msg': 'The ID is invalid.'});
    }
});

// This route returns info about a project from the database using the given id
router.get('/:id', async (req,res,next) => {
    const id = parseInt(req.params.id) ;
    if(id){
        project = (await db.promise().query(`SELECT * FROM projects WHERE id = ${id}`))[0];
        if(project.length == 1){
            res.json({
                'id':id,
                'name' : project[0].name,
                'type' : project[0].type,
                'description' : project[0].description,
                'deadline' : project[0].deadline,
                'id_project_manager' : project[0].id_project_manager
            });
        }else{
            res.json({'msg': 'Project ${id} not found'});
        }
    }else{
        next() ;
    }
})

// This route will return all projects that a user is involved in
router.get('/user/:id', async (req,res) => {
    const id = parseInt(req.params.id) ;
    try {
        projects = (await db.promise().query(`SELECT * FROM projects p where 
            p.id IN (select id_project from project_member pm where pm.id_user = ${id} )
            or p.id_project_manager = ${id};`))[0];
        res.json(projects);
    } catch (err) {
        res.status(500).send(err.message);
    }
} )

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
    const count  = parseInt(req.params.count);
    const page = parseInt(req.params.page);
    if(count && page){
        try {
            projects = (await db.promise().query(`
                SELECT * FROM projects LIMIT ${count * (page - 1)},${count};
            `))[0];
            res.json(projects);
        } catch (err) {
            res.status(500).send(err.message);
        }
    }
});

// This route, when called, will create a project in the database according to the body of the post request.
router.post('/create', nextIfManager,async (req, res) => {
    const { name,type,description,deadline,id_project_manager } = req.body;
    if (name && type && id_project_manager) {
        try {
            db.promise().query(`
            INSERT INTO projects (name, type, description,deadline,id_project_manager) VALUES
             ('${name}', '${type}', '${description}', '${deadline}', '${id_project_manager}')`
            );
            res.status(201).send({ msg: 'Project Created' });
        } catch (err) {
            console.log(err);
            res.status(500).send(err.message);
        }
    } else {
        res.status(401).send({ msg: 'Please enter name and type and id_project_manager.' });
    }
});

//This route will look for project of similar name
router.get('/search', async (req, res) =>{
    const query = req.query.query;
    try {
        let projects = []
        if(query && query != '')
            projects = (await db.promise().query(
                `
                    SELECT * FROM PROJECTS WHERE NAME LIKE '${query}%'
                `
            ))[0];
        return res.status(200).send(projects);
    } catch (err) {
        return res.status(500).send({ msg: err.msg})
    }

})

//This route, when called will create random projects with a random project manager.
router.get('/create-random/:count', nextIfManager, (req, res) =>{
    const count = parseInt(req.params.count);
    if(count)
        for (let i = 0; i < count; i++)
            if(!createRandomProject())
                return res.status(500).send({msg: 'Internal error'})
    res.send({ msg: 'success'});
})

//This function is for creating a ranodom project 
const createRandomProject = async () => {
    let projectManager = 1;
    let users = (await db.promise().query(`SELECT id from users WHERE role = 'CHEF'`))[0];
    projectManager = users[Math.floor(Math.random() * users.length)].id
    const f = randomString;
    try {
        db.promise().query(`
        INSERT INTO PROJECTS (name, type, description, deadline, id_project_manager)
        VALUES ('${f()}', '${f()}', '${f()}', '${new Date(Date.now() + Math.floor(Math.random() * 15 + 1) * 24 * 3600 * 1000).toISOString().slice(0, 19).replace('T', ' ')}', ${projectManager})
        `)
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}

// This function returns a random string used for testing.
function randomString() {
    return (Math.random() + 1).toString(36).substring(2);
};


// Exporting the router
module.exports = router;