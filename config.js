
//Original configuration
//exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/bookmarksdb';
//exports.TOKEN = process.env.API_TOKEN || 'myAPITokenThatIsReal';
//exports.PORT = process.env.PORT || '8080';

//Modified & actual configuration
//In this part the "process.env.DATABASE_URL" will be replaced to do
//cloud based database testing. This will only remain like this briefly
//as tests are run while coding, once everything has been confirmed
//as working then the string should be reverted to its original name
//Three parameters will be modified in the new string such as username created
//the password created and finally the name of the database (Replace "test" with the name of the db)
//Original Mongo URL mongodb+srv://<username>:<password>@cluster0-crivh.mongodb.net/test?retryWrites=true&w=majority
//exports.DATABASE_URL = "mongodb+srv://mySuperRealUsername:myMostSecurePasswordEver!@cluster0-crivh.mongodb.net/bookmarksdb?retryWrites=true&w=majority" || 'mongodb://localhost/bookmarksdb';
//exports.TOKEN = process.env.API_TOKEN || 'myAPITokenThatIsReal';
//exports.PORT = process.env.PORT || '8080';

//Once everything is correct, REMOVE the database URL details as they can be used
//by other users who can view the configuration files
//All the details such as process.env.DATABASE_URL, process.env.API_TOKEN, process.env.PORT
//will be provided at server level (Hidden from plain view)
exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/bookmarksdb';
exports.API_TOKEN = process.env.API_TOKEN || '2abbf7c3-245b-404f-9473-ade729ed4653';
exports.PORT = process.env.PORT || '8080';

//Just note that the logical operator || is to be used when 
//working locally (Switches between the process.env and the local stuffs)

//To ask tomorrow
//Should we push the config.js?
//Database access?
//Network access?


//START of Setup to push this webpage/database combo to the Internet...

//STEP 1
//When pushing this collection to Mongo Atlas database remember the collection name
//For this lab I'll be using the recovered name in the config file
//whose name is "bookmarksdb" and the model's collection name is "bookmarks"
//Inside Mongo's input box place the "Database name" as "bookmarksdb" and
//in "Collection Name" as "bookmarks"

//STEP 2
//In "Database access" at Mongo Atlas website add a new user
//The username and password are the fields that are gonna be used to access
//the database itself once it is deployed
//In this case is admin & admins
//Configure the "Database User Privileges" as "Read and Write to any database" so that
//read and write methods can be performed correctly.

//STEP 3
//In "Network Access" we will allow other applications access the database itself
//Clicking "Add IP address" reveals an input box with fields
//ideally for a deployed application we would place the IP address
//from that deployed application in the "Whitelist Entry" field. 
//But the IP address of, in this case Heroku, is not known. And it's gonna
//be difficult using a single IP address for this section due to the fact that
//the IP addresses managed by Heroku are dynamic (They are always changing). 
//On the meantime we can add the IP address as a public one (Access from anywhere). This will
//get rid of any problems when linking the application from Heroku into the database

//END of Setup to push this webpage/database combo to the Internet...

//Once everything is done I need to replace the DATABASE_URL string to connect the database
//exports.DATABASE_URL = process.env.DATABASE_URL || >>>>>'mongodb://localhost/bookmarksdb';<<<<<
//The selected portion of this string is pointing towards the local database, we need the string
//pointing towards the online database. To get the "real deal" string for the database
//head back to clusters and click "Connect" and from the multiple ways to connect the database
//select the 2nd one, "Connect your application". A URL string will be given

//This is the URL given by Mongo
//mongodb+srv://admin:<password>@cluster0-crivh.mongodb.net/test?retryWrites=true&w=majority


//In Heroku CLI it is time to login to finally push the application
//Type in the console window "heroku login" to start a new session
//Then type "heroku create" so that Heroku creates the space for the 
//application and a public URL (This is gonna be the URL for when the server
//is deployed to Heroku this is the way its gonna be accesed with.)