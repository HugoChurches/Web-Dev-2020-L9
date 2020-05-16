console.log("OK! Server's up!");
const cors = require('./middleware/cors');
//API KEY on record
const API_TOKEN = "2abbf7c3-245b-404f-9473-ade729ed4653"
//Require the following dependencies
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const {uuid} = require('uuidv4');
const {DATABASE_URL, PORT} = require('./config');
//Require mongoose to be able to CONNECT to the database itself
const mongoose = require ('mongoose');

//IMPORT the created object in bookmarksModel so that it can interact with the endpoints
//No need to add the .js extension as it is a package
const {Bookmarks} = require ('./models/bookmarksModel');

const jsonParser = bodyParser.json();

//Bookmark structure!
/* const post = {
    id : uuid.v4(),
    title : String,
    description : String,
    url : String,
    rating : number
} */


//Start dependencies

const bookMApp = express();
bookMApp.use(morgan('dev'));
bookMApp.use(cors);
bookMApp.use( express.static( "public" ) );

//Define Middleware for authentification checks
function validateKey(req, res, next){
    let token = req.headers.authorization;

    //Prevent further access if no API KEY was provided
    if(!token){
        res.statusMessage = "No API KEY found in header/bearer";
        return res.status(401).end();
    }

    //Prevent further access if the API KEY provided doesn't match to the one on records
    if(token !== `Bearer ${API_TOKEN}`){
        res.statusMessage = "The API KEY you provided doesn't match to my records";
        return res.status(401).end();
    }

    //Place next() otherwise the server will indefinitely be stuck on this function
    next();
}

//Indicate the script to make the endpoints always use the validateKey middleware
bookMApp.use(validateKey);

//Endpoint for /bookmarks PATCH
//Added interaction of patching an existing bookmark
bookMApp.patch('/api/bookmark/:id', jsonParser, (req, res) =>{
    
    let JSONdata = ('body', req.body);

    //Test if the body's ID was sent through 
    if(!req.body.id){
        res.statusMessage = "Patch unsuccessful, body is missing ID parameter";
        return res.status(406).end();
    }

    //Test if body and parameters are matching
    if(req.body.id != req.params.id){
        res.statusMessage = "Patch unsuccessful, ID mismatch on body and parameter fields"
        return res.status(409).end();
    }

    //As we don't want to generate a new ID on the patch, we'll just keep it
    let modBookmarkID = {
        id : JSONdata.id
    }

    //Build up another JSON for the find parameter
    let modBookmark = {
        title : JSONdata.title,
        description : JSONdata.description,
        url : JSONdata.url,
        rating : JSONdata.rating
    }

    //Pass the settings for the function
    let uOsettings = {
        //This setting indicates to not create a new entry in the
        //bookmark database if no result was found in the query
        upsert : false
    }

    //Call the function from the object in bookmarksModel
    Bookmarks
        //Summon the specific function by calling its name and send
        //the original id and the recovered data as parameters
        .modifyBookmark(modBookmarkID, modBookmark, uOsettings)
        .then(result => {
            if(result.nModified === 0)
            {
                //If it is, it means that no bookmark was found
                res.statusMessage = "No bookmark was found or no changes were made, patch unsuccessful";
                return res.status(404).json(result);
            }
            //If it is not zero then there was a bookmark with a matching title
            res.statusMessage = "Changed bookmark details";
            return res.status(200).end();
        })

        //Catchcan for errors
        .catch(err => {
            res.statusMessage = err;
            return res.status(500).end();
        })        

});

//Endpoint for /bookmarks delete
//Added interaction of deleting a bookmark using Models OK!
bookMApp.delete('/api/bookmarks/:id', (req, res) =>{
    //Get the id sent by Postman
    let idObj = {
        //Build an object for the .find function
        id : req.params.id
    }

    //Call the function for deleting a bookmark and send the object through the
    //parameter field
    Bookmarks
        .deleteBookmark(idObj)
        .then(result => {
            //The .deleteOne function sends back a small report of the action taken
            //if the deletion count is 1 then we know that the bookmark was deleted
            if(result.deletedCount === 1)
            {
                //Confirm the user that the operation was completed
                res.statusMessage = "Deletion complete"
                return res.status(200).end();
            }
            //If the deletion count remained 0 then we know the bookmark id wasn't stored
            //in the server to begin with. Stop the execution and drop an error
            res.statusMessage = "ID provided was not found, stopping deletion"
            return res.status(404).end();
        })
        //Catchcan for errors
        .catch(err => {
            res.statusMessage = err;
            return res.status(500).end();
        })
});

//Endpoint for /bookmarks POST
//Remember to parse the body with jsonParser otherwise it will look wrong
//Added interaction of posting a bookmark using Models OK!
bookMApp.post('/api/bookmarks', jsonParser, (req, res) =>{
    //Give the JSON body to a variable, keep this as it will be used to give the parameters
    //to the database schema
    let JSONdata = ('body', req.body);

    //Verify that the JSON is not empty, if it is stop the execution and send error message & code
    if(Object.keys(JSONdata).length === 0)
    {
        res.statusMessage = "No parameters were sent, stopping";
        return res.status(406).end();
    }

    //Elements of the body parsed by POSTMAN, these will be passed onto the schema
    let bmId = uuid();
    let bmTitle = JSONdata.title;
    let bmDescription = JSONdata.description;
    let bmUrl = JSONdata.url;
    let bmRating = JSONdata.rating;

    //Generate a new JSON before appending it into the bookmark schema
    let post_new = {
        id : bmId,
        title : bmTitle,
        description : bmDescription,
        url : bmUrl,
        rating : bmRating
    }

    //Call the function from the object in bookmarksModel
    Bookmarks
        //Summon the specific function by calling its name and send the recovered parameters
        .createBookmark(post_new)
        //Remember that we don't know how long will the server will take to respond, so we add a promise
        .then(result => {
            //The syntax error drops a different body if an error occured
            if(result.errors){
                //Address the error by accessing its keys and send it to the user
                res.statusMessage = "Error - " + result.message;
                //End the function
                return res.status(406).end();
            }
            //If all went well append the result to the database
            return res.status(200).json(result)
        })
        //If something wrong were to happen during the transmission or reception drop an error
        .catch( err=>{
            res.statusMessage = err;
            return res.status(500).end();
        })
})

//Endpoint for /bookmark?title=value GET query 
//Added interaction of getting a bookmark using Models OK!
bookMApp.get('/api/bookmark', jsonParser,(req, res)=>{
    //Assign the title's query name to variable
    let titleQuery = req.query.title;
    let idQuery = req.query.id;

    //Verify that the user has actually inserted a value into the query, otherwise
    //send a 406, unaceptable request
    if(titleQuery === '' || idQuery === '')
    {   
        res.statusMessage = "Cannot accept an empty title or id string"
        return res.status(406).end();
    }

    //Revised version, check if the query has the allowed parameters!
    if(titleQuery === undefined && idQuery === undefined)
    {   
        res.statusMessage = "Query doesn't match any stored parameters I can check for"
        return res.status(406).end();
    }

    //Generate new JSON body to send via parameters
    let titleObj = {
        'title' : req.query.title
    }

    //Call the function from the object in bookmarksModel
    Bookmarks
        //Summon the specific function by calling its name and send the recovered parameters
        .findBookmark(titleObj)
        .then(result => {
            //Check if the result of the function call is zero...
            if(Object.keys(result).length === 0)
            {
                //If it is, it means that no bookmark was found
                res.statusMessage = "No bookmark was found";
                return res.status(404).end();
            }
            //If it is not zero then there was a bookmark with a matching title
            res.statusMessage = "Here's a bookmark with matching title";
            return res.status(200).json(result);
        })
        //Catchcan for errors
        .catch(err => {
            res.statusMessage = err;
            return res.status(500).end();
        })
});

//Endpoint to return all bookmarks available GET
//Added interaction of getting all bookmarks using Models OK!
bookMApp.get('/api/bookmarks',(req, res)=>{
    //Summon the specific function by calling its name
    Bookmarks
        .getAllBookmarks()
        .then(result => {
            //Return and display in a JSON body the retrieved bookmarks
            return res.status(200).json(result);
        })
        //Add a catchcan for errors during the execution
        .catch(err => {
            res.statusMessage = err;
            return res.status(500).end();
        })
});

//Initialize server
bookMApp.listen(PORT, () =>{
    console.log("Server is running on port 8080");
    //Since we don't know when will the server send me a response we
    //need to add a promise. If something goes wrong we will trigger a reject.
    //The first parameter receives the location (URL) of mongoose's database, only local hosts for now
    //The second parameter receives the settings, these settings specify the following
        //useNewUrlParser: true <- used for the URL's string parsing, to ensure proper connection to the db. 
                                //This is to prevent warnings and to parse (escape) special characters in the URL
        //useUnifiedTopology: <- this goes in hand with the previous element
        //useCreateIndex <- this needs to be here if the task needs a unique property. Mongo will validate
                                //and create a new ID for the task
    //The third parameter is just an error parameter to hold the error object. If everything is correct
    //then the error parameter will be undefined, noting that everything went fine.
    new Promise((resolve, reject) => {
        
        const settings = {
            useNewUrlParser : true,
            useUnifiedTopology : true,
            useCreateIndex : true
        };
        mongoose.connect(DATABASE_URL, settings, (err) =>{
            if(err){
                return reject(err);
            }
            else{
                console.log("Database is connected");
                return resolve();
            }
        })
    })

});