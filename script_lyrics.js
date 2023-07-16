window.addEventListener('load', () => {
  // DOM elements - SPOTIFY
  const searchBtn = document.querySelector('#search-btn');
  const imageInput = document.querySelector('#music_cover');
  const spotifyLink = document.querySelector('#spotify-link');
  const titleInput = document.querySelector('#song_name');
  const trackUrlInput = document.querySelector('#song_name');
  const artistInput = document.querySelector('#artist_name');
  const artistUrlInput = document.querySelector('#artist_name');
  const albumInput = document.querySelector('#album_name');
  const albumUrlInput = document.querySelector('#album_name');
  const releaseDateInput = document.querySelector('#release_date');

  const durationInput = document.querySelector('#duration');
  const albumPosition = document.querySelector('#album_position');
  const songPreviewInput = document.querySelector('#song_preview');
  const countriesCounterInput = document.querySelector('#countries_counter');
  const popularityInput = document.querySelector('#popularity')
  const audio = document.querySelector('#player');

  const trackIdInput = document.querySelector('#track-input');
  const isrcInput = document.querySelector('#isrc-input');

  // Get DOM elements - MUSIXMATCH
  const mxm_lyrics_url = document.querySelector('#mxm_lyrics_url')
  const mxm_artist_url = document.querySelector('#mxm_artist_url')
  const mxm_album_url = document.querySelector('#mxm_album_url')
  const abstrack_mxm = document.querySelector('#mxm_abstrack');
  const popularity_mxm = document.querySelector('#popularity_mxm')

  const stats_mxm_lyrics = document.querySelector('#has_lyrics')
  const stats_mxm_linesync = document.querySelector('#has_sync')
  const stats_mxm_wordsync = document.querySelector('#has_wordsync')
  const stats_mxm_explicit = document.querySelector('#is_explicit')
  const stats_mxm_instrumental = document.querySelector('#is_instrumental')

  // Add event listener for search button
  searchBtn.addEventListener('click', () => {
    const inputVal = spotifyLink.value.trim();

    const trackUrlRegex = /^(https?:\/\/)?open\.spotify\.com\/track\/(.+)$/;
    const idRegex = /^[a-zA-Z0-9]{22}$/;
    const isrcRegex = /^[A-Z]{2}[A-Z0-9]{3}\d{2}\d{5}$/;

    let trackId = '';
    let isrc = '';

    if (trackUrlRegex.test(inputVal)) {
      const url = new URL(inputVal);
      trackId = url.pathname.split('/').pop();
    } else if (idRegex.test(inputVal)) {
      trackId = inputVal;
    } else if (isrcRegex.test(inputVal)) {
      isrc = inputVal;
    } else {
      alert('Error: Please enter a valid Spotify song URL, ID, or ISRC.');
      return;
    }

    trackIdInput.value = trackId;
    isrcInput.value = isrc;

    // Send request to server.js API for Spotify search
    fetch(`/api/spotify/search/${trackId}`)
      .then((response) => response.json())
      .then((data) => {
        // Process and display Spotify data
        const title = data.name;
        const songURL = data.external_urls.spotify;
        const artist = data.artists[0].name;
        const artistURL = data.artists[0].external_urls.spotify;
        const album = data.album.name;
        const albumURL = data.album.external_urls.spotify;
        const image = data.album.images[0].url;
        const isrc = data.external_ids.isrc;
        const durationMs = data.duration_ms;

        const durationMinutes = Math.floor(durationMs / 60000);
        const durationSeconds = Math.floor((durationMs % 60000) / 1000);
        const duration = `Length: ${durationMinutes}:${durationSeconds.toString().padStart(2, '0')}`;

        const albumPositionN = data.track_number;
        const albumTotalN = data.album.total_tracks;
        const numMarkets = data.available_markets.length;
        const popularity = data.popularity;

        const releaseDate = data.album.release_date.toString().padStart(2, '0');

        const songPreview = data.preview_url;

        // Update DOM elements with Spotify data
        titleInput.textContent = title;
        trackUrlInput.href = songURL;
        artistInput.textContent = artist;
        artistUrlInput.href = artistURL;
        albumInput.textContent = album;
        albumUrlInput.href = albumURL;
        imageInput.style.backgroundImage = `url(${image})`;
        isrcInput.value = isrc;
        releaseDateInput.textContent = releaseDate;
        durationInput.textContent = duration;
        albumPosition.textContent = `Album Position: ${albumPositionN} of ${albumTotalN}`;
        countriesCounterInput.textContent = `Available in ${numMarkets} countries`;
        popularityInput.textContent = `Spotify Rating: ${popularity}%`;
        songPreviewInput.src = songPreview;

        if (songPreview) {
          audio.load();
        } else {
          // Set an error message or disable the play button if no audio file is available.
        }

        // Send request to server.js API for Spotify Lyrics search
        fetch(`/api/lyrics/search/${encodeURIComponent(spotifyLink.value)}`)
          .then((response) => response.json())
          .then(data => {
            if (data.error) {
              spotify_lyrics.className = "status-2 status-gray";
              spotify_sync.className = "status-2 status-gray";
            } else if (data.syncType === "UNSYNCED") {
              spotify_lyrics.className = "status-2 status-green";
              spotify_sync.className = "status-2 status-gray";
            } else if (data.syncType === "LINE_SYNCED") {
              spotify_lyrics.className = "status-2 status-green";
              spotify_sync.className = "status-2 status-green";
            }
          })
          .catch(error => {
            console.error(error);
          });

        // Send request to server.js API for Musixmatch search
        fetch(`/api/musixmatch/search/${isrc}`)
          .then((response) => response.json())
          .then((data) => {
            console.log(data)
            const mxm_abstrack = data.message.body.track.commontrack_id;
            const mxm_lyrics_id = data.message.body.track.track_id;
            const mxm_artist_id = data.message.body.track.artist_id;
            const mxm_album_id = data.message.body.track.album_id;
            const mxm_lyrics_rating = data.message.body.track.track_rating;

            const mxm_has_lyrics = data.message.body.track.has_lyrics;
            const mxm_has_linesync = data.message.body.track.has_subtitles;
            const mxm_has_richsync = data.message.body.track.has_richsync;
            const mxm_instrumental = data.message.body.track.explicit;
            const mxm_explicit = data.message.body.track.explicit;

            console.log(mxm_has_lyrics)

            // Defina os valores de entrada
            mxm_lyrics_url.setAttribute("value", `mxmt.ch/t/${mxm_lyrics_id}`);
            mxm_artist_url.setAttribute("value", `mxmt.ch/a/${mxm_artist_id}`);
            mxm_album_url.setAttribute("value", `mxmt.ch/r/${mxm_album_id}`);
            abstrack_mxm.setAttribute("value", `${mxm_abstrack}`);
            

            popularity_mxm.textContent = `Musixmatch Rating: ${mxm_lyrics_rating}%`;

            if (mxm_has_lyrics === 0) {
              stats_mxm_lyrics.className = "status-1 status-gray";
            } else if (mxm_has_lyrics === 1) {
              stats_mxm_lyrics.className = "status-1 status-green";
            } else {
              stats_mxm_lyrics.className = "status-1 status-red";
            }
            
            if (mxm_has_linesync === 0) {
              stats_mxm_sync.className = "status-1 status-gray";
            } else if (mxm_has_linesync === 1) {
              stats_mxm_linesync.className = "status-1 status-green";
            } else {
              stats_mxm_linesync.className = "status-1 status-red";
            }
            
            if (mxm_has_richsync === 0) {
              stats_mxm_richsync.className = "status-1 status-gray";
            } else if (mxm_has_richsync === 1) {
              stats_mxm_wordsync.className = "status-1 status-green";
            } else {
              stats_mxm_wordsync.className = "status-1 status-red";
            }
            
            if (mxm_instrumental === 0) {
              stats_mxm_instrumental.className = "status-1 status-gray";
            } else if (mxm_instrumental === 1) {
              stats_mxm_instrumental.className = "status-1 status-green";
            } else {
              stats_mxm_instrumental.className = "status-1 status-red";
            }
            
            if (mxm_explicit === 0) {
              stats_mxm_explicit.className = "status-1 status-gray";
            } else if (mxm_explicit === 1) {
              stats_mxm_explicit.className = "status-1 status-green";
            } else {
              stats_mxm_explicit.className = "status-1 status-red";
            }



  

          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        alert(`Error: ${error.message}`);
      });
  });

  // ...
});
