/* declare global variables */
let artistArray = [];
let uniqueArtists = [];
const artistSection = document.getElementById("artistSection");
let artistButton; 
let artistButtonsList = [];
let backButton = document.createElement("button");
backButton.innerText = "Back";
backButton.className = "backButton";
let clicked;  
let artLink;
let artPiece;
const displayArt = document.getElementById("displayArt");
let selectArtistMessage = document.getElementById("selectArtistMessage");
let workByArtistMessage = document.getElementById("workByArtistMessage");
const backButtonSection = document.getElementById("backButtonSection")
backButtonSection.appendChild(backButton);

/* create get request for ARTIC API */
fetch('https://api.artic.edu/api/v1/artworks')
.then(response => {
    if (!response.ok) {
        throw new Error('Request failed');
      }
    return response.json();
})
.then(data => {
    /* create artist array */
    artists = [...data.data];
    console.log(artists);
    
    /* get artist names from array and create unique array to avoid duplicates */
    for (let i = 0; i < 10; i++) {
        let artist = artists[i].artist_title;
        artistArray.push(artist);
        uniqueArtists = artistArray.reduce(function(a, b) {
            if (a.indexOf(b) < 0) a.push(b);
            return a;
        }, []); 
    }
    //console.log("artists ", artistArray);
    //console.log("unique array", uniqueArtists);

    /* hide back button by default */
    backButton.hidden = true;

    /* call displayArtistSelection funcion initially */
    displayArtistSelection();    
})
.catch(error => {
    console.error('An error occurred:', error);
});

/* go back function to return to artist selection, and hides artist work previously selected */
function goBack() {
    /* hide back button when clicked */
    backButton.hidden = true;
    /* call function to clear artwork from previous selection */
    clearArt();
    /* call function to display artist selection again */
    displayArtistSelection();
    workByArtistMessage.style.display = 'none';
}

/* function creates a button for each artist */
function displayArtistSelection() {
    selectArtistMessage.style.display = '';
    for (let j = 0; j < uniqueArtists.length; j++) {
        artistButton = document.createElement("button");
        artistButton.className = "artistButton";
        artistButtonsList.push(artistButton);
        artistButton.innerHTML = uniqueArtists[j];
        artistSection.appendChild(artistButton);
        /* add event listener when artist button is clicked */
        artistButton.addEventListener("click", selectArtist);
        }
    }
 /* function clears art images from artist previosly selected */   
function clearArt () {     
    for (let y = 0; y < artwork.length; y++) {
        let image = displayArt.querySelector("a");
        displayArt.removeChild(image);
    }
}
/* function removes artist buttons when artist is selected, allowing artwork to be displayed instead */
function clearArtistsButtons() {
    //console.log("artistButtonsList", artistButtonsList)
    for (let x = 0; x < artistButtonsList.length; x++) { 
        let artistButton = artistSection.querySelector("button");
        console.log("artistButton", artistButton);
        artistSection.removeChild(artistButton); 
    }  
}

/* add event listener when back button is clicked to run goBack function */
backButton.addEventListener("click", goBack);

/* function runs when artist is selected */
function selectArtist() {
    selectArtistMessage.style.display = 'none';
    clicked = event.target.innerText;
    //console.log("clicked: ", clicked);
    /* message stating work by artist based on selection */ 
    workByArtistMessage.style.display = '';
    workByArtistMessage.innerHTML = `Work by ${clicked}`;
    /* back button will display */ 
    backButton.hidden = false;
    
    /* second fetch request retrieves artwork API links of the artist selected */
    fetch(`https://api.artic.edu/api/v1/artworks/search?q=${clicked}`)
    .then(response => {
    if (!response.ok) {
        throw new Error('Request failed');
      }
    return response.json();
    })
    .then(data => {
    /* create artwork array */
    artwork = [...data.data];
    //console.log("artwork: ", artwork);
    /* loop through previous fetch and retrieve api links */
    for(let m = 0; m < 10; m++) {
        /* displayArt section will show */
        displayArt.hidden = false;
        let apiLink = artwork[m].api_link;
        //console.log(artwork[m].api_link);

        /* third fetch pulls up artwork images of artist selected by user */
        fetch(`${apiLink}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Request failed');
            }
            return response.json();
        })
        .then(data => {
            let artData = data.data.image_id;
            console.log("artData", artData);
            /* create a element for each art piece */
            artLink = document.createElement("a");
            /* create image element for each art piece */ 
            artPiece = document.createElement("img");
            /* display unavailable message if image_id = null and hide img element */
            if (artData === null) {
                console.log("not found");
                artPiece.hidden = true;
            }
            /* assign src, alt text, and href to art pieces */
            artPiece.src = "https://www.artic.edu/iiif/2/" + artData + "/full/843,/0/default.jpg";
            artPiece.alt = data.data.title;
            artLink.href = "https://www.artic.edu/iiif/2/" + artData + "/full/843,/0/default.jpg";
            /* open art piece in new tab to zoom in */ 
            artLink.target = "_blank";
            /* add art pieces to displayArt section */
            artLink.appendChild(artPiece);
            displayArt.appendChild(artLink);            
        })
        .catch(error => {
            console.error('An error occurred:', error);
        });  
    }
    })
    .catch(error => {
    console.error('An error occurred:', error);
    });
    /* calls function to avoid artist button duplicates */ 
    clearArtistsButtons();
}