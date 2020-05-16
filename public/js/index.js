const API_TOKEN = '2abbf7c3-245b-404f-9473-ade729ed4653';


function GetBookmarkFetch(bmTitle)
{
    let url = `/api/bookmark?title=${bmTitle}`;

    let settings = {
        method : 'GET',
        headers : {
            Authorization : `Bearer ${API_TOKEN}`
        }
    }

    console.log(url);
    let receivedBMS = document.querySelector('#input_box');

    fetch(url, settings)
        .then(response => {
            console.log(response);
            if(response.ok)
            {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJSON => {
            console.log(responseJSON);
            receivedBMS.innerHTML = "";
            for(let i = 0; i < responseJSON.length; i++)
            {
                receivedBMS.innerHTML += `<h2>Found Bookmark<h2>`
                receivedBMS.innerHTML += `<h2>Bookmark ID<h2>`
                receivedBMS.innerHTML += `<div> ${responseJSON[i].id} </div>`;
                receivedBMS.innerHTML += `<h2>Bookmark Title<h2>`
                receivedBMS.innerHTML += `<div> ${responseJSON[i].title} </div>`;
                receivedBMS.innerHTML += `<h2>Bookmark Description<h2>`
                receivedBMS.innerHTML += `<div> ${responseJSON[i].description} </div>`;
                receivedBMS.innerHTML += `<h2>Bookmark URL<h2>`
                receivedBMS.innerHTML += `<div> ${responseJSON[i].url} </div>`;
                receivedBMS.innerHTML += `<h2>Bookmark Rating<h2>`
                receivedBMS.innerHTML += `<div> ${responseJSON[i].rating} </div>`;
            }
        })
        .catch( err => {
            let errorMsg = "Couldn't fetch bookmarks - Reason: "
            errorMsg += err.message
            alert(errorMsg);
        });

}


//Not working
function UpdateBookmarkFetch(bmID, bmTitle, bmDescription, bmURL, bmRating)
{
    let url = `/api/bookmarks/${bmID}`;

    let data = {
        title : bmTitle,
        description : bmDescription,
        url : bmURL,
        rating : bmRating
    }
    let settings = {
        method : 'PATCH',
        headers : {
            Authorization : `Bearer ${API_TOKEN}`,
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify( data )
    }

    let results = document.querySelector('.results')
    fetch(url, settings)
        .then(response =>{
            if(response.ok){
                loadBMSfetch();
            }
            throw new Error(response.statusText);
        })
        .catch( err => {
            let errorMsg = "Couldn't update bookmark - Reason: "
            errorMsg += err.message
            alert(errorMsg);
        });

}

//DELETE OK!
function deleteBookmarkFetch(bmID)
{
    let url = `/api/bookmarks/${bmID}`;

    let settings = {
        method : 'DELETE',
        headers : {
            Authorization : `Bearer ${API_TOKEN}`,
        }
    }
    
    fetch(url, settings)
        .then(response =>{
            if(response.ok){
                loadBMSfetch();
            }
            throw new Error(response.statusText);
        })
        .catch( err => {
            let errorMsg = "Couldn't remove bookmark - Reason: "
            errorMsg += err.message
            alert(errorMsg);
        })
}


//I'm skipping comments because I'm running out of time
function addBookmarkFetch(bmTitle, bmDescription, bmURL, bmRating)
{
    let url = '/api/bookmarks';

    let data = {
        title : bmTitle,
        description : bmDescription,
        url : bmURL,
        rating : bmRating
    }
    let settings = {
        method : 'POST',
        headers : {
            Authorization : `Bearer ${API_TOKEN}`,
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify( data )
    }

    let results = document.querySelector('.results')
    fetch(url, settings)
        .then(response =>{
            if(response.ok){
                loadBMSfetch();
            }
            throw new Error(response.statusText);
        })
        .catch( err => {
            let errorMsg = "Couldn't add bookmark - Reason: "
            errorMsg += err.message
            alert(errorMsg);
        });

}

function showForm(sel){
    loadBMSfetch();
    var sel = document.getElementById(sel);
    form_input.innerHTML = "";
    if(sel.value == "post_method")
    {
        form_input.innerHTML +=`
        <form class="flex flex-col items-center space-y-3 text-gray-800">
            <h1>
            Post a new bookmark
            </h1>
            <div class="space-y-1">
            <label>Bookmark Title</label><br>
            <input class="rounded" type="text" id=bm_title>
            </div>
            <div class="space-y-1">
            <label>Bookmark Description</label><br>
            <input class="rounded" type="text" id=bm_description>
            </div>
            <div class="space-y-1">
            <label>Bookmark URL</label><br>
            <input class="rounded" type="text" id=bm_url>
            </div>
            <div class="space-y-1">
            <label>Bookmark Rating</label><br>
            <input class="rounded" type="text" id=bm_rating>
            </div>
            <button class="submit-button-bookmark bg-gray-700 text-white rounded p-3" type="submit">Post bookmark</button>
        </form>  
        `
            let submitBoton = document.querySelector('.submit-button-bookmark');
            submitBoton.addEventListener('click', (event) =>{
                event.preventDefault();
                let bmTitle = bm_title.value;
                let bmDescription = bm_description.value;
                let bmURL = bm_url.value;
                let bmRating = bm_rating.value;
                addBookmarkFetch(bmTitle, bmDescription, bmURL, bmRating);
            });
    }
    else if(sel.value == "delete_method")
    {
        form_input.innerHTML +=`
        <form class="flex flex-col items-center space-y-3 text-gray-800">
            <h1>
            Delete a bookmark
            </h1>
            <div class="space-y-1">
            <label>Bookmark ID</label><br>
            <input class="rounded" class="class="rounded"" type="text" id=bm_id>
            </div>
            <button class="submit-button-bookmark bg-gray-700 text-white rounded p-3" type="submit">Delete this bookmark</button>
        </form>  
        `
        let submitBoton = document.querySelector('.submit-button-bookmark');
        submitBoton.addEventListener('click', (event) =>{
            event.preventDefault();
            let bmID = bm_id.value;
            deleteBookmarkFetch(bmID);
        });
    }
    else if(sel.value == "update_method")
    {
        form_input.innerHTML +=`
        <form class="flex flex-col items-center space-y-3 text-gray-800">
            <h1>
            Update an existing bookmark
            </h1>
            <div class="space-y-1">
            <label>Bookmark ID</label><br>
            <input class="rounded" class="class="rounded"" type="text" id=bm_id>
            </div>
            <div class="space-y-1">
            <label>Bookmark Title</label><br>
            <input class="rounded" class="class="rounded"" type="text" id=bm_title>
            </div>
            <div class="space-y-1">
            <label>Bookmark Description</label><br>
            <input class="rounded" type="text" id=bm_description>
            </div>
            <div class="space-y-1">
            <label>Bookmark URL</label><br>
            <input class="rounded" type="text" id=bm_url>
            </div>
            <div class="space-y-1">
            <label>Bookmark Rating</label><br>
            <input class="rounded" type="text" id=bm_rating>
            </div>
            <button class="submit-button-bookmark bg-gray-700 text-white rounded p-3" type="submit">Update bookmark</button>
        </form>  
        `
        let submitBoton = document.querySelector('.submit-button-bookmark');
        submitBoton.addEventListener('click', (event) =>{
            event.preventDefault();
            let bmID = bm_id.value;
            let bmTitle = bm_title.value;
            let bmDescription = bm_description.value;
            let bmURL = bm_url.value;
            let bmRating = bm_rating.value;
            UpdateBookmarkFetch(bmID, bmTitle, bmDescription, bmURL, bmRating);
        });
    }
    else if(sel.value == "get_method")
    {
        form_input.innerHTML +=`
        <form class="flex flex-col items-center space-y-3 text-gray-800">
            <h1>
            Find a bookmark
            </h1>
            <div class="space-y-1">
            <label>Bookmark Title</label><br>
            <input class="rounded" class="class="rounded"" type="text" id=bm_title>
            </div>
            <button class="submit-button-bookmark bg-gray-700 text-white rounded p-3" type="submit">Find bookmark</button>
        </form>  
        `
        let submitBoton = document.querySelector('.submit-button-bookmark');
        submitBoton.addEventListener('click', (event) =>{
            event.preventDefault();
            let bmTitle = bm_title.value;
            GetBookmarkFetch(bmTitle);
        });
    }
}

function loadBMSfetch(){
    let url = '/api/bookmarks';
    let settings = {
        method : 'GET',
        headers : {
            Authorization : `Bearer ${API_TOKEN}`,
            'Content-Type' : 'application/json'
        }
    }
    let receivedBMS = document.querySelector('#input_box');
    fetch(url, settings)
        .then(response =>{
            if(response.ok){
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJSON=>{
            receivedBMS.innerHTML = "";
            for(let i = 0; i < responseJSON.length; i++)
            {
                receivedBMS.innerHTML += `<h2 class="font-bold">Bookmark ID</h2>`
                receivedBMS.innerHTML += `<div class="text-green-800"> ${responseJSON[i].id} </div>`;
                receivedBMS.innerHTML += `<h2 class="font-bold">Bookmark Title</h2>`
                receivedBMS.innerHTML += `<div class="text-green-800"> ${responseJSON[i].title} </div>`;
                receivedBMS.innerHTML += `<h2 class="font-bold">Bookmark Description</h2>`
                receivedBMS.innerHTML += `<div class="text-green-800"> ${responseJSON[i].description} </div>`;
                receivedBMS.innerHTML += `<h2 class="font-bold">Bookmark URL</h2>`
                receivedBMS.innerHTML += `<div class="text-green-800"> ${responseJSON[i].url} </div>`;
                receivedBMS.innerHTML += `<h2 class="font-bold">Bookmark Rating</h2>`
                receivedBMS.innerHTML += `<div class="text-green-800"> ${responseJSON[i].rating} </div>`;
            }
        })
        .catch( err => {
            let errorMsg = "Couldn't fetch bookmarks - Reason: "
            errorMsg += err.message
            alert(errorMsg);
        });
}


function init(){
    loadBMSfetch();
}

init();



//function watchFormGlobal()
//1st method - run event listener directly when appending
//Below this line initialize the query selector
