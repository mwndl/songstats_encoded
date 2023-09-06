window.addEventListener('DOMContentLoaded', () => {
  const searchBtn = document.querySelector('#search-btn');
  const search_input = document.querySelector('#search_input');

  const div_country_local = document.querySelector('#div_country_local');
  const country_local_status = document.querySelector('#country_local_status');
  const country_local_text = document.querySelector('#country_local_text');

  const view_lyrics_button = document.querySelector('#view_lyrics_button');
  const view_lyrics_text = document.querySelector('#view_lyrics_text');
  const view_lyrics_arrow = document.querySelector('#view_lyrics_arrow');
  const lyrics_container = document.querySelector('#lyrics_container');
  const pusher_container = document.querySelector('#pusher_container');
  const lyrics_pusher = document.querySelector('#lyrics_pusher');
  const close_button_pusher = document.querySelector('#close_button_pusher');

  // DOM elements - SPOTIFY
  const imageInput = document.querySelector('#music_cover');
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
  const popularityInput = document.querySelector('#popularity');

  const player_button = document.querySelector('#player_button');
  const audio = document.querySelector('#player');

  const trackIdInput = document.querySelector('#track-input');
  const isrcInput = document.querySelector('#isrc-input');

  const spotifyPreview = document.querySelector('#spotify_iframe_preview')

  // Get DOM elements - MUSIXMATCH
  const mxm_lyrics_url = document.querySelector('#mxm_lyrics_url');
  const mxm_artist_url = document.querySelector('#mxm_artist_url');
  const mxm_album_url = document.querySelector('#mxm_album_url');
  const abstrack_mxm = document.querySelector('#mxm_abstrack');
  const popularity_mxm = document.querySelector('#popularity_mxm');

  const mxm_lyricsname = document.querySelector('#mxm_lyrics_url');
  const mxm_artistname = document.querySelector('#mxm_artist_url');
  const mxm_albumname = document.querySelector('#mxm_album_url');

  const stats_mxm_lyrics = document.querySelector('#has_lyrics');
  const stats_mxm_linesync = document.querySelector('#has_sync');
  const stats_mxm_wordsync = document.querySelector('#has_wordsync');
  const stats_mxm_explicit = document.querySelector('#is_explicit');
  const stats_mxm_instrumental = document.querySelector('#is_instrumental');

  const div_lyrics_preview = document.querySelector('#div_lyrics_preview');
  const mxm_lyrics_preview = document.querySelector('#lyrics_preview');

  // Função para salvar o país no navegador
  const saveCountry = (countryCode) => {
    if (countryCode && countryCode.length === 2) {
      localStorage.setItem('selected_country', countryCode);
      alert(`Your country was saved as ${countryCode}.`);
      search_input.value = ""
    } else {
      alert('Invalid command, try again');
      search_input.value = ""
    }
  };

  const accessToken = '8KuA9GwNbaJYvTD8U6h64beb6d6dd56c';

  // Function to handle search
  const handleSearch = () => {
    const inputVal = search_input.value.trim();

    const trackUrlRegex = /^(https?:\/\/open\.spotify\.com\/(?:intl-[a-z]{2}\/)?)?track\/(.+)$/;
    const studioUrlRegex = /(?:&|\?)player=spotify&(?:.*&)?track_id=([^&\s]+)/;
    const idRegex = /^[a-zA-Z0-9]{22}$/;
    const isrcRegex = /^[A-Z]{2}[A-Z0-9]{3}\d{2}\d{5}$/;
    const pushForm = "push";

    let trackId = '';
    let isrc = '';

   // Verificar se o comando "set_market_<country_code>" foi digitado
    const setCountryRegex = /^set_market_([A-Z]{2})$/;
    const setCountryMatch = inputVal.match(setCountryRegex);
    if (setCountryMatch) {
      const countryCode = setCountryMatch[1];
      saveCountry(countryCode);
      return;
    }

    if (trackUrlRegex.test(inputVal)) {
      const url = new URL(inputVal);
      trackId = url.pathname.split('/').pop();

    } else if (studioUrlRegex.test(inputVal)) {
      const match = inputVal.match(studioUrlRegex);
      if (match) {
        trackId = match[1];
      }

    } else if (idRegex.test(inputVal)) {
      trackId = inputVal;
    } else if (inputVal === pushForm) {
      pusher_container.style = "";
      lyrics_pusher.src = `https://musixmatch.typeform.com/to/tFQDvIsp?typeform-s`;
      lyrics_container.style = "display:none";
      search_input.value = "";

      lyrics_container.style.display = "none";
      view_lyrics_text.textContent = "View Lyrics";
      view_lyrics_text.id = "view_lyrics_button";
      view_lyrics_arrow.textContent = ">";
      return;
    } else if (isrcRegex.test(inputVal)) {
      alert("ISRC search isn't a feature at the moment.");
      return;
    } else {
      alert('Sorry! Please enter a valid Spotify track URL or ID. 🎶');
      return;
    }
    country_local_status.className = "status-3 status-gray"
    search_input.value = "";
    // Botão 'X' do container de push
    const close_lyricspusher = () => {
      pusher_container.style = "display:none";
    };

    close_button_pusher.addEventListener('click', close_lyricspusher);
    

    // Send request to server.js API for Spotify search
    fetch(`https://datamatch-sm.onrender.com/api/spotify/search/${trackId}?token=${accessToken}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        // Process and display Spotify data
        const title = data.name;
        const songURL = data.external_urls.spotify;
        const artist = data.artists[0].name;
        const artistURL = data.artists[0].external_urls.spotify;
        const album = data.album.name;
        const albumURL = data.album.external_urls.spotify;
        const image = data.album.images[0].url;
        const spotifyID = data.id;
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

        const spotifyPreviewSrc = `https://open.spotify.com/embed/track/${spotifyID}?utm_source=generator`

        // Collect all artist names and URLs
        const artists = data.artists.map((artist) => {
          return { name: artist.name, url: artist.external_urls.spotify };
        });

        // Função para verificar se o país está disponível na lista de países da faixa
        const checkCountryAvailability = (countryCode) => {
          const availableMarkets = data.available_markets;
          if (availableMarkets.includes(countryCode)) {
            country_local_status.className = "status-3 status-green";
            country_local_status.style = ""
            country_local_text.textContent = `${countryCode}`
            country_local_text.style = ""
            div_country_local.title = `This track is available in your country`
          } else {
            country_local_status.className = "status-3 status-red";
            country_local_status.style = ""
            country_local_text.textContent = `${countryCode}`
            country_local_text.style = ""
            div_country_local.title = `This track is available in your country`
          }
        };

        // Format artists as HTML anchor tags
        const artistsLinks = artists.map(
          (artist) => `<a href="${artist.url}" target="_blank">${artist.name}</a>`
        );

        // Update DOM elements with Spotify data
        titleInput.textContent = title;
        trackUrlInput.href = songURL;
        artistInput.innerHTML = artistsLinks.join(", ");
        albumInput.textContent = album;
        albumUrlInput.href = albumURL;
        imageInput.style.backgroundImage = `url(${image})`;
        trackIdInput.value = spotifyID;
        isrcInput.value = isrc;
        releaseDateInput.textContent = releaseDate;
        durationInput.textContent = duration;
        albumPosition.textContent = `Album Position: ${albumPositionN} of ${albumTotalN}`;
        countriesCounterInput.textContent = `Available in ${numMarkets} markets`;
        popularityInput.textContent = `Spotify Rating: ${popularity}%`;
        songPreviewInput.src = songPreview;
        player_button.className = "play-button";
        spotifyPreview.src = spotifyPreviewSrc;
        
        // Verificar se o país salvo está disponível para a faixa pesquisada
        const selectedCountry = localStorage.getItem('selected_country');
        if (selectedCountry) {
          checkCountryAvailability(selectedCountry);
        }

        if (songPreview) {
          songPreviewInput.src = songPreview;
          audio.volume = 0.5;
          player_button.style = ""
          audio.load();
        } else {
          songPreviewInput.removeAttribute("src");
          audio.removeAttribute("src");
          player_button.style = "display:none"
          audio.load();
        }

        // Send request to server.js API for Spotify Lyrics search
        fetch(`https://datamatch-sm.onrender.com/api/lyrics/search/${encodeURIComponent(songURL)}?token=${accessToken}`)
          .then((response) => response.json())
          .then(data => {
            if (data.error) {
              spotify_lyrics.className = "status-2 status-gray";
              spotify_sync.className = "status-2 status-gray";
            } else if (data.syncType === "UNSYNCED") {
              spotify_lyrics.className = "status-2 status-blue";
              spotify_sync.className = "status-2 status-gray";
            } else if (data.syncType === "LINE_SYNCED") {
              spotify_lyrics.className = "status-2 status-blue";
              spotify_sync.className = "status-2 status-blue";
            }
          })
          .catch(error => {
            console.error(error);
          });

        // Send request to server.js API for Musixmatch search
        fetch(`https://datamatch-sm.onrender.com/api/musixmatch/search/${isrc}?token=${accessToken}`)
          .then((response) => response.json())
          .then((data) => {
            console.log(data)
            const mxm_abstrack = data.message.body.track.commontrack_id;
            const mxm_lyrics_id = data.message.body.track.track_id;
            const mxm_artist_id = data.message.body.track.artist_id;
            const mxm_album_id = data.message.body.track.album_id;
            const mxm_lyrics_rating = data.message.body.track.track_rating;

            const mxm_lyrics_name = data.message.body.track.track_name;
            const mxm_artist_name = data.message.body.track.artist_name;
            const mxm_album_name = data.message.body.track.album_name;

            const mxm_has_lyrics = data.message.body.track.has_lyrics;
            const mxm_has_linesync = data.message.body.track.has_subtitles;
            const mxm_has_richsync = data.message.body.track.has_richsync;
            const mxm_instrumental = data.message.body.track.instrumental;
            const mxm_explicit = data.message.body.track.explicit;

            console.log(mxm_has_lyrics)

            // Defina os valores de entrada
            mxm_lyrics_url.setAttribute("value", `https://mxmt.ch/t/${mxm_lyrics_id}`);
            mxm_artist_url.setAttribute("value", `https://mxmt.ch/a/${mxm_artist_id}`);
            mxm_album_url.setAttribute("value", `https://mxmt.ch/r/${mxm_album_id}`);
            abstrack_mxm.setAttribute("value", `${mxm_abstrack}`);

            mxm_lyricsname.title = mxm_lyrics_name
            mxm_artistname.title = mxm_artist_name
            mxm_albumname.title = mxm_album_name

            popularity_mxm.textContent = `Musixmatch Rating: ${mxm_lyrics_rating}%`;

            if (mxm_has_lyrics === 0) {
              stats_mxm_lyrics.className = "status-1 status-gray";
            } else if (mxm_has_lyrics === 1) {
              stats_mxm_lyrics.className = "status-1 status-blue";
            } else {
              stats_mxm_lyrics.className = "status-1 status-red";
            }
            
            if (mxm_has_linesync === 0) {
              stats_mxm_linesync.className = "status-1 status-gray";
            } else if (mxm_has_linesync === 1) {
              stats_mxm_linesync.className = "status-1 status-blue";
            } else {
              stats_mxm_linesync.className = "status-1 status-red";
            }
            
            if (mxm_has_richsync === 0) {
              stats_mxm_wordsync.className = "status-1 status-gray";
            } else if (mxm_has_richsync === 1) {
              stats_mxm_wordsync.className = "status-1 status-blue";
            } else {
              stats_mxm_wordsync.className = "status-1 status-red";
            }
            
            if (mxm_explicit === 0) {
              stats_mxm_explicit.className = "status-1 status-gray";
            } else if (mxm_explicit === 1) {
              stats_mxm_explicit.className = "status-1 status-blue";
            } else {
              stats_mxm_explicit.className = "status-1 status-red";
            }
            
            if (mxm_instrumental === 0) {
              stats_mxm_instrumental.className = "status-1 status-gray";
            } else if (mxm_instrumental === 1) {
              stats_mxm_instrumental.className = "status-1 status-blue";
            } else {
              stats_mxm_instrumental.className = "status-1 status-red";
            }

            // Ativa ou desativa o preview das letras

            if (mxm_has_lyrics === 1) {
              div_lyrics_preview.style = ""
              mxm_lyrics_preview.src = `//musixmatch.com/lyrics/${mxm_artist_id}/${mxm_abstrack}/embed?theme=white`
              view_lyrics_button.style = ""
            } else {
              div_lyrics_preview.style = "display:none"
              view_lyrics.style = "display:none"
            }

            if (lyrics_container.style.display === 'none') {
              view_lyrics_text.id = "hide_lyrics_button";
            } else {
              view_lyrics_text.id = "view_lyrics_button";
            }

          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        alert(`Error: ${error.message}`);
      });
  };

    function toggleLyrics() {
      if (lyrics_container.style.display === 'none') {
          lyrics_container.style.display = '';
          view_lyrics_text.textContent = 'Hide Lyrics';
          view_lyrics_arrow.textContent = '<'
          pusher_container.style = "display:none";
      } else {
          lyrics_container.style.display = 'none';
          view_lyrics_text.textContent = 'View Lyrics';
          view_lyrics_arrow.textContent = '>'
      }
  }

  view_lyrics_button.addEventListener('click', toggleLyrics);


  // Add event listener for search button
  searchBtn.addEventListener('click', handleSearch);

  // Add event listener for Enter key press
  search_input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSearch();
    }
  });

  // ...
})
