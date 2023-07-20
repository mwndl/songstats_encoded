window.addEventListener('load', () => {
  // Get DOM elements - SPOTIFY
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

  const lyrics = document.querySelector('#lyrics');
  const sync = document.querySelector('#sync');
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
  const mxm_abstrack = document.querySelector('#mxm_abstrack')
  const popularity_mxm = document.querySelector('#popularity_mxm')

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

    // Make API request to Spotify
    const url = `https://api.spotify.com/v1/tracks/${trackIdInput.value || isrcInput.value}`;

    fetch(url, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`, // Call the function to get the updated access token
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // Process the data as needed

        // Extract relevant data from API response
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

        // remove a quebra de linha para corrigir a ordem das chamadas de função
        const songPreview = data.preview_url;

        // Set input values
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
          // Se não houver arquivo de áudio, defina uma mensagem de erro ou desative o botão de reprodução.
        }

        const spotifyApiUrl = `/api/spotify-lyrics/${trackIdInput.value}`;
        axios.get(spotifyApiUrl)
          .then(response => response.data)
          .then(data => {
            if (data.error) {
              spotify_lyrics.className = "status-2 status-red";
              spotify_sync.className = "status-2 status-red";
            } else if (data.syncType === "UNSYNCED") {
              spotify_lyrics.className = "status-2 status-green";
              spotify_sync.className = "status-2 status-red";
            } else if (data.syncType === "LINE_SYNCED") {
              spotify_lyrics.className = "status-2 status-green";
              spotify_sync.className = "status-2 status-green";
            }
          })
          .catch(error => {
            console.error(error);
          });

        // Make API request to get the Musixmatch API key
        axios.get('/api/musixmatch-api-key')
          .then(response => response.data)
          .then(data => {
            const musixmatchApiKey = data.apiKey;

            // Musixmatch API
            const mxmDataApi = `https://api.musixmatch.com/ws/1.1/track.get?apikey=${musixmatchApiKey}&track_isrc=/${isrc}`;
            axios.get(mxmDataApi)
              .then(response => response.data)
              .then(data => {
                console.log(data); // Verifique a estrutura do objeto de dados
                const mxm_lyrics_id = data.body.track.track_id;
                const mxm_artist_id = data.body.track.artist_id;
                const mxm_album_id = data.body.track.album_id;
                const mxm_lyrics_rating = data.body.track.track_rating;
                const mxm_abstrack = data.body.track.commontrack_id;

                // Defina os valores de entrada
                mxm_lyrics_url.setAttribute("value", `mxmt.ch/t/${mxm_lyrics_id}`);
                mxm_artist_url.setAttribute("value", `mxmt.ch/r/${mxm_artist_id}`);
                mxm_album_url.setAttribute("value", `mxmt.ch/a/${mxm_album_id}`);
                mxm_abstrack.setAttribute("value", `${mxm_abstrac}`);
                popularity_mxm.textContent = `Last Update: ${mxm_lyrics_rating}`;
              })
              .catch(error => {
                console.error('Error retrieving data from mxmDataApi:', error);
              });
          })
          .catch(error => {
            console.error('Error retrieving Musixmatch API key:', error);
          });
      })
      .catch(error => {
        alert(`Error: ${error.message}`);
      });

  });

  // Adiciona event listener para o evento "keydown" na barra de pesquisa
  spotifyLink.addEventListener('keydown', (event) => {
    // Se a tecla pressionada for "Enter", envia a pesquisa
    if (event.keyCode === 13) {
      event.preventDefault();
      searchBtn.click();
    }
  });

});
