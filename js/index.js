/* create get request for ARTIC API */
fetch('https://api.artic.edu/api/v1/artworks')
.then(response => {
    if (!response.ok) {
        throw new Error('Request failed');
      }
    return response.json();
})
.then(data => {
    /* create artwork array */
    artwork = [...data.data];
    console.log(artwork);

    /* get artwork section and display art by creating img elements and appending to artwork section */ 
    const artSection = document.getElementById("artwork");

        for (let i = 0; i < artwork.length; i++) {
            var artContainer = document.createElement("p");
            artContainer.className = "artContainer";
            var artLink = document.createElement("a");
            var artPiece = document.createElement("img");

            /* display unavailable message if image_id = null and hide img element */
            if (artwork[i].image_id === null) {
                artContainer.innerText = "Image not available";
                artPiece.hidden = true;
            }

            artPiece.src = "https://www.artic.edu/iiif/2/" + artwork[i].image_id + "/full/843,/0/default.jpg";
            artPiece.alt = artwork[i].title;
            artLink.href = "https://www.artic.edu/iiif/2/" + artwork[i].image_id + "/full/843,/0/default.jpg";
        

            var title = document.createElement("h2");
            title.innerHTML = artwork[i].title;

            var artist = document.createElement("h3");
            artist.innerHTML = "by " + artwork[i].artist_title;

            if (artwork[i].artist_title === null) {
                artist.innerHTML = "by Unavailable";
            }

            artLink.appendChild(artPiece);
            artContainer.appendChild(artLink);
            artContainer.appendChild(title);
            artContainer.appendChild(artist);
            artSection.appendChild(artContainer);          
        }
})
.catch(error => {
    console.error('An error occurred:', error);
});
