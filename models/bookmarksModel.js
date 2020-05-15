//Define dependencies, import mongoose
const mongoose = require('mongoose');

//Bookmark structure!
/* const post = {
    id : uuid.v4(),
    title : String,
    description : String,
    url : String,
    rating : number
} */

//Define constant to connect the database to
//this constant will hold the schema of the collection.
//Remember that this is an object and is the "schematic" or "skeleton" 
const bookMarksSchema = mongoose.Schema({
    //This section expects an object as an attribute
    //Specify the conditions of the object
    id : {
        type : String,
        unique : true,
        required : true
    },
    title : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    url : {
        type : String,
        required : true
    },
    rating : {
        type : Number,
        required : true
    }
});

//This is gonna connect the schema defined with mongoose
//We are gonna be using mongoose's model method. We are gonna connect the bookmark schematic to
//the model itself. This function receives two parameters, the name of the collection in the database 
//and the schema's name. This finalizes the connection of the SCHEMA to the database (Makes a relationship only)
const bookMarksCollection = mongoose.model('bookmarks', bookMarksSchema);

//When pushing this collection to Mongo Atlas database remember the collection name
//For this lab I'll be using the recovered name in the config file
//whose name is "bookmarksdb" and the model's collection name is "bookmarks"
//Inside Mongo's input box place the "Database name" as "bookmarksdb" and
//in "Collection Name" as "bookmarks"

//This is the object or constant that is gonna be exported to do the queries
const Bookmarks = {
    //Refer to the original server.js file and see the parameters being sent from a POST
    //In this case, the server is receiving an id, title, description, url and a rating
    //Create a new bookmark
    createBookmark : function( newBookmark ){
        //Start of function declaration
        //The database will return the created bookmark with this element, no need to send a status with
        //the JSON of the created object in this case
        return bookMarksCollection
            //Execute the insert object, the way to insert a new object to the database
            //is with the .create keyword. In this case the create receives as a parameter
            //the newly created bookmark. 
            .create( newBookmark )
            //As we don't know how long the database will take in registering this data we must add a
            //promise and hold for the results. Use .then to wait for the result to come back.
            //The result will be then sent back to the server.js file as part of the response of the request
            .then( createdBookmark => {
                //Simply return the created bookmark
                return createdBookmark;
            })
            //If something went wrong then catch the error...
            .catch(err => {
                //and return it.
                return err;
            });
            //End of function declaration
    },

    //Retrieve all bookmarks
    getAllBookmarks : function(){
        //Return the whole database collection
        return bookMarksCollection
            //Use find() to return all elements
            .find()
            //Promise...
            .then(allBookmarks => {
                return allBookmarks;
            })
            //Error catch if something went wrong
            .catch(err => {
                return err;
            });
    },

    //Delete a bookmark
    deleteBookmark : function(IDparam){
        return bookMarksCollection
        //"Parameter \"filter\" to find() must be an object"
        //Use the object send by the server to find the required element
        .find(IDparam)
        //Delete the targeted object
        .deleteOne()
        //Send back the report of the deletion operation back to the server
        .then(deleteReport => {
            return deleteReport;
        })
        //Catchcan for errors
        .catch(err => {
            return err;
        });
    },

    //Find title of bookmark
    findBookmark : function(TITLEparam){
        return bookMarksCollection
        //Find a bookmark with the exact same title
        .find(TITLEparam)
        .then(foundBookmark =>{
            //Then returned the targeted bookmark
            return foundBookmark;
        })
        .catch(err => {
            return err;
        });
    },

    //Modify details of a bookmark
    modifyBookmark : function(IDparam, UPDATEparam, SETSparam){
        return bookMarksCollection
        //updateOne(filter, update, options, callback)
        //All parameters are objects, no need to add a filter
        //as this function has a find function built in itself
        .updateOne(IDparam, UPDATEparam, SETSparam)
        .then(updatedBookmark => {
            //Return the updated bookmarks
            return updatedBookmark;
        })
        .catch(err => {
            return err;
        });
    }
}

//EXPORT the whole object so other modules can import it
module.exports = { Bookmarks };