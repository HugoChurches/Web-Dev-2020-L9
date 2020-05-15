const {TOKEN} = require ('./../config');

//Define Middleware for authentification checks
function validateKey(req, res, next){
    let token = req.headers.authorization;

    //Prevent further access if no API KEY was provided
    if(!token){
        res.statusMessage = "No API KEY found in header/bearer";
        return res.status(401).end();
    }

    //Prevent further access if the API KEY provided doesn't match to the one on records
    if(token !== `Bearer ${TOKEN}`){
        res.statusMessage = "The API KEY you provided doesn't match to my records";
        return res.status(401).end();
    }

    //Place next() otherwise the server will indefinitely be stuck on this function
    next();
}

module.exports = validateKey;