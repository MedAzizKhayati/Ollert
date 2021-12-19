const mysql = require('mysql2');

// Connecting to the database, and exporting it.
db = module.exports = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ollert'
});

const initialQueries = () => {
    // WARNING: DO NOT CHANGE WHAT HAS BEEN ALREADY PUSHED
    // INSTEAD, ADD OTHER QUERIES THAT CANCEL WHAT IS ALREADY
    // EXECUTED.
    db.promise().query(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER NOT NULL AUTO_INCREMENT,
            username VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL,
            first_name VARCHAR(255),
            last_name VARCHAR(255),
            PRIMARY KEY(id)
        )`
    );
    // EXAMPLE: I figured that the users table needs to be dropped,
    // let's not delete the above query, but rather add this query 
    /* db.query(`DROP TABLE USERS`); */

    // NOTE: Add other queries below.

};


// NOTE: Do not change, rather change initialQueries
try{
    initialQueries();
}catch(err){
    console.error(err);
}