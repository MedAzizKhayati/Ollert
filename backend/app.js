/* LIBRARIES */
const express = require('express');
const session = require('express-session');
//NOTE: Add external libraries here...

/* \LIBRARIES */

const db = require('./database');
const middleware = require('./middleware');

const port = 5000;

/* REQUIRING ROUTES */
const usersRoute = require('./routes/users');
const projectsRoute = require('./routes/projects');
const tasksRoute = require('./routes/tasks');
/* \REQUIRING ROUTES */

const app = express();
const mainRouter = express.Router();

/* MIDDLEWARES */ 
app.use(session({
    secret: 'somesecret',
    cookie: {maxAge: 9999999},
    saveUninitialized: false,
    resave: false
}))
// Recognizes the incoming request object as a JSON Object
app.use(express.json());
// Recognizes the incoming request object as strings or arrays
app.use(express.urlencoded({ extended: false }));
//NOTE: Add other middlewares here...

/* \MIDDLEWARES */ 

/* ROUTES */
// Make everything accessible via /api first
app.use('/api', mainRouter);
mainRouter.use('/users', usersRoute);
mainRouter.use('/projects', projectsRoute);
mainRouter.use('/tasks', tasksRoute);

//NOTE: Add other routes here...

/* \ROUTES */


// Default route, used for testing if the application is reachable
// It should return OK to the client
mainRouter.get('/', (req, res) => {
    res.send(200);
})

// Starting the serving and listening on port
app.listen(port, () => 
    console.log("Server listening on port " + port)
);