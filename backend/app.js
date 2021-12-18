const express = require('express');
const app = express();
const port = 5000;

app.get('/', (req, res) => {
    res.send(200);
})

app.listen(5000, () => 
    console.log("Server listening on port " + port
));