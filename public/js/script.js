
const API_TOKEN = '2abbf7c3-245b-404f-9473-ade729ed4653';


function addBookmarkFetch(bmTitle, bmDescription, bmURL, bmRating)
{
    let url = 'api/bookmarks';

    let data = {
        title : bmTitle,
        description : bmDescription,
        url : bmURL,
        rating : bmRating
    }

    console.log(data)
    let settings = {
        method : 'POST',
        headers : {
            Authorization : `Bearer ${API_TOKEN}`,
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify(data)
    }

    let results = document.querySelector('.results')

    fetch(url, settings)
        .then(response =>{
            if(response.ok){
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJSON => {
            console.log("OK, response received");
        })
        .catch( err => {
            results.innerHTML = `<div> ${err.message} </div>`;
        });

}


function showForm(sel){
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
            <button class="submit-button-bookmark bg-gray-700 text-white rounded p-3" type="submit">Get bookmarks</button>

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
            <h1 >
            Delete an existing bookmark
            </h1>
            <label>Bookmark ID</label><br>
            <input class="rounded" type="text" id=bm_id>
            <button class="submit-button-bookmark" type="submit">Delete</button>
        </form>  
        `
    }
}


// function loadBMSfetch(){
//     let url = 'api/bookmarks';
//     let settings = {
//         method : 'GET',
//         headers : {
//             Authorization : `Bearer ${API_TOKEN}`,
//             'Content-Type' : 'application/json'
//         }
//     }

//     let receivedBMS = document.querySelector('#input_box');

//     fetch(url, settings)
//         .then(response =>{
//             if(response.ok){
//                 return response.json();
//             }
//             throw new Error(response.statusText);
//         })
//         .then(responseJSON=>{
//             receivedBMS.innerHTML = "";
//             for(let i = 0; i < responseJSON.length; i++)
//             {
//                 receivedBMS.innerHTML += `<div> ${responseJSON[i].title} </div>`;
//             }
//         })
//         .catch( err => {
//             receivedBMS.innerHTML = `<div> ${err.message} </div>`;
//         });

//     // input_box.innerHTML = "";
//     // input_box.innerHTML +=`
//     //         <h1>
//     //         Bookmarks available in Database
//     //         </h1>`

//     console.log(url)
//     console.log(settings)


// }


function init(){
    loadBMSfetch();
}

init();

//function watchFormGlobal()
//}

//1st method - run event listener directly when appending
//Below this line initialize the query selector
