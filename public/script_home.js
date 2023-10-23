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

                user_country_name = header.user_country_name;

                topTrackName1 = data.top_tracks.name[0];
                topTrackName2 = data.top_tracks.name[1];
                topTrackName3 = data.top_tracks.name[2];

                topCover1 = data.top_tracks.album_cover[0];
                topCover2 = data.top_tracks.album_cover[1];
                topCover3 = data.top_tracks.album_cover[2];
                
                newTrackName1 = data.new_releases.name[0];
                newTrackName2 = data.new_releases.name[1];
                newTrackName3 = data.new_releases.name[2];
                
                newCover1 = data.new_releases.album_cover[0];
                newCover2 = data.new_releases.album_cover[1];
                newCover3 = data.new_releases.album_cover[2];

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
});
getThumbs();
