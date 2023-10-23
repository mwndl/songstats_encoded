window.addEventListener('load', () => {
    const top_tracks_title = document.querySelector('#top_tracks_title');
    const new_releases_title = document.querySelector('#new_releases_title');

    const top_img_div = document.querySelector('#top_img_div');
    const new_img_div = document.querySelector('#new_img_div');

    const top_cover1 = document.querySelector('#top_cover1');
    const top_cover2 = document.querySelector('#top_cover2');
    const top_cover3 = document.querySelector('#top_cover3');

    const new_cover1 = document.querySelector('#new_cover1');
    const new_cover2 = document.querySelector('#new_cover2');
    const new_cover3 = document.querySelector('#new_cover3');

    function getThumbs() {
        const apiUrl = "https://datamatch-backend.onrender.com/charts/thumbs/?token=8KuA9GwNbaJYvTD8U6h64beb6d6dd56c";

        // Fazer a solicitação à API usando fetch
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {

                user_country_name = data.header.user_country_name;
            
                if (data.data.top_tracks && data.data.top_tracks.length >= 3) {
                    topTrackName1 = data.data.top_tracks[0].name;
                    topTrackName2 = data.data.top_tracks[1].name;
                    topTrackName3 = data.data.top_tracks[2].name;
            
                    topCover1 = data.data.top_tracks[0].album_cover;
                    topCover2 = data.data.top_tracks[1].album_cover;
                    topCover3 = data.data.top_tracks[2].album_cover;
                }
            
                if (data.data.new_releases && data.data.new_releases.length >= 3) {
                    newTrackName1 = data.data.new_releases[0].name;
                    newTrackName2 = data.data.new_releases[1].name;
                    newTrackName3 = data.data.new_releases[2].name;
            
                    newCover1 = data.data.new_releases[0].album_cover;
                    newCover2 = data.data.new_releases[1].album_cover;
                    newCover3 = data.data.new_releases[2].album_cover;
                }

                top_img_div.style = "";
                new_img_div.style = "";

                top_tracks_title = `Top Tracks - ${user_country_name}`
                new_releases_title = `New Releases - ${user_country_name}`
                
                top_cover1.title = topTrackName1;
                top_cover1.alt = topTrackName1;
                top_cover1.src = topCover1;

                top_cover2.title = topTrackName2;
                top_cover2.alt = topTrackName2;
                top_cover2.src = topCover2;

                top_cover3.title = topTrackName3;
                top_cover3.alt = topTrackName3;
                top_cover3.src = topCover3;

                new_cover1.title = newTrackName1;
                new_cover1.alt = newTrackName1;
                new_cover1.src = newCover1;

                new_cover2.title = newTrackName2;
                new_cover2.alt = newTrackName2;
                new_cover2.src = newCover2;

                new_cover3.title = newTrackName3;
                new_cover3.alt = newTrackName3;
                new_cover3.src = newCover3;

            })
            .catch(error => {
                console.error("Something went wrong: " + error);
            });
    }
    getThumbs(); 
});
