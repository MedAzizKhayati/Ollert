/* LIBRARIES */
const express = require('express');
//NOTE: Add external libraries here...

/* \LIBRARIES */

const db = require('./database');

const port = 5000;

/* REQUIRING ROUTES */
const usersRoute = require('./routes/users');
/* \REQUIRING ROUTES */

const app = express();

/* MIDDLEWARES */ 

// Recognizes the incoming request object as a JSON Object
app.use(express.json());
// Recognizes the incoming request object as strings or arrays
app.use(express.urlencoded({ extended: false }));
//NOTE: Add other middlewares here...

/* \MIDDLEWARES */ 

/* ROUTES */
app.use('/users', usersRoute);
//NOTE: Add other routes here...

/* \ROUTES */


// Default route, used for testing if the application is reachable
// It should return OK to the client
app.get('/', (req, res) => {
    res.send(200);
})

// Starting the serving and listening on port
app.listen(port, () => 
    console.log("Server listening on port " + port)
);