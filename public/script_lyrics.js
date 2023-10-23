window.addEventListener('load', () => {
  const animationStarter = document.querySelector('#background_animation_starter');
  const backgroundGradient = document.querySelector('.area');

  const searchBtn = document.querySelector('#search-btn');
  const search_input = document.querySelector('#search_input');
  const loading_spinner = document.querySelector('#loading_spinner');


  /* DESATIVADO MOMENTANEAMENTE
  const div_country_local = document.querySelector('#div_country_local');
  const country_local_status = document.querySelector('#country_local_status');
  const country_local_text = document.querySelector('#country_local_text');

  const view_lyrics_button = document.querySelector('#view_lyrics_button');
  const view_lyrics_text = document.querySelector('#view_lyrics_text');
  const view_lyrics_arrow = document.querySelector('#view_lyrics_arrow');
  const lyrics_container = document.querySelector('#lyrics_container');
  */

  const pusher_container = document.querySelector('#pusher_container');
  const lyrics_pusher = document.querySelector('#lyrics_pusher');
  const close_button_pusher = document.querySelector('#close_button_pusher');

  // DOM elements - SPOTIFY
  /* DESATIVADO APÓS INTEGRAÇÃO COM PLAYER DO SPOTIFY
  const imageInput = document.querySelector('#music_cover');
  const titleInput = document.querySelector('#song_name');
  const trackUrlInput = document.querySelector('#song_name');
  const artistInput = document.querySelector('#artist_name');
  const artistUrlInput = document.querySelector('#artist_name');
  const albumInput = document.querySelector('#album_name');
  const albumUrlInput = document.querySelector('#album_name');
  const durationInput = document.querySelector('#duration');
  */

  const spotifyPreview = document.querySelector('#spotify_iframe_preview');

  const releaseDateInput = document.querySelector('#release_date');
  const albumPosition = document.querySelector('#album_position');
  const songPreviewInput = document.querySelector('#song_preview');
  const countriesCounterInput = document.querySelector('#countries_counter');
  const popularityInput = document.querySelector('#popularity');

  const spotLyricsDiv = document.querySelector('#spotify_lyrics_div')
  const spotLyricsTitle = document.querySelector('#spot_lyrics_title');
  const spotSyncTitle = document.querySelector('#spot_sync_title');

  /* DESATIVADO APÓS INTEGRAÇÃO COM PLAYER DO SPOTIFY
  const player_button = document.querySelector('#player_button');
  const audio = document.querySelector('#player');
  */

  const trackIdInput = document.querySelector('#track-input');
  const isrcInput = document.querySelector('#isrc-input');

  // Get DOM elements - MUSIXMATCH

  const mxm_links_content = document.querySelector('#mxm_links_content');
  const not_imported_message = document.querySelector('#not_imported_message');
  const loading_spinner_mxm = document.querySelector('#loading_spinner_mxm');

  const mxm_lyrics_title = document.querySelector('#mxm_lyrics_title');
  const mxm_artist_title = document.querySelector('#mxm_artist_title');
  const mxm_album_title = document.querySelector('#mxm_album_title');
  const mxm_abstrack_title = document.querySelector('#mxm_abstrack_title');

  const mxm_lyrics_url = document.querySelector('#mxm_lyrics_url');
  const mxm_artist_url = document.querySelector('#mxm_artist_url');
  const mxm_album_url = document.querySelector('#mxm_album_url');
  const abstrack_mxm = document.querySelector('#mxm_abstrack');
  const popularity_mxm = document.querySelector('#popularity_mxm');

  const mxm_lyricsname = document.querySelector('#mxm_lyrics_url');
  const mxm_artistname = document.querySelector('#mxm_artist_url');
  const mxm_albumname = document.querySelector('#mxm_album_url');

  const mxm_stats_div = document.querySelector('#mxm_stats_div');
  const stats_mxm_lyrics_title = document.querySelector('#has_lyrics_title');
  const stats_mxm_linesync_title = document.querySelector('#has_sync_title');
  const stats_mxm_wordsync_title = document.querySelector('#has_wordsync_title');
  const stats_mxm_explicit_title = document.querySelector('#is_explicit_title');
  const stats_mxm_instrumental_title = document.querySelector('#is_instrumental_title');

  const stats_mxm_lyrics = document.querySelector('#has_lyrics');
  const stats_mxm_linesync = document.querySelector('#has_sync');
  const stats_mxm_wordsync = document.querySelector('#has_wordsync');
  const stats_mxm_explicit = document.querySelector('#is_explicit');
  const stats_mxm_instrumental = document.querySelector('#is_instrumental');

  // Get Notification Pop-Up elements
  const notification_div = document.getElementById("notification");
  const message = document.getElementById("notification-message");

  const request_counter_div = document.getElementById("requests_conter")
  const requests_counter_text = document.getElementById("requests_counter_text");
  const requests_counter_light = document.getElementById("requests_counter_status");

  /* DESATIVADO MOMENTANEAMENTE
  const div_lyrics_preview = document.querySelector('#div_lyrics_preview');
  const mxm_lyrics_preview = document.querySelector('#lyrics_preview');
  */

  // Função para salvar o país no navegador
  const saveCountry = (countryCode) => {
    if (countryCode && countryCode.length === 2) {
      localStorage.setItem('selected_country', countryCode);
      notification("Perfect! Your country is now local saved 🌍");
      search_input.value = ""
    } else {
      notification('Invalid command, try again');
      search_input.value = ""
    }
  };

  // Notifications

  function notification(customMessage) {
    message.textContent = customMessage;
    notification_div.style.opacity = 1;
    notification_div.classList.remove("hidden");
    setTimeout(() => {
      notification_div.style.opacity = 0;
      setTimeout(() => {
        notification_div.classList.add("hidden");
      }, 500);
    }, 4000); // Tempo de exibição
  };

  // Função para salvar background_mode localmente
  function saveBackgroundMode(mode) {
    localStorage.setItem('background_mode', mode);
  }
  
  // Função para recuperar background_mode localmente
  function getBackgroundMode() {
    const mode = localStorage.getItem('background_mode');
    return mode ? parseInt(mode, 10) : 1; // Valor padrão de 1 se não houver um valor armazenado
  }

  let background_mode = getBackgroundMode();

  // Função para salvar o token localmente
  function saveCustomToken(token) {
    localStorage.setItem('token', token);
  }
  
  // Função para recuperar o token localmente
  function getCustomToken() {
    const token = localStorage.getItem('token');
    return token ? token : '8KuA9GwNbaJYvTD8U6h64beb6d6dd56c'; // Get custom token or use the public one as a string
  }

  let accessToken = getCustomToken();

  // Function to handle search
  const handleSearch = () => {
    searchBtn.style = "display:none";
    loading_spinner.style = "";

    const inputVal = search_input.value.trim();

    const trackUrlRegex = /^(https?:\/\/open\.spotify\.com\/(?:intl-[a-z]{2}\/)?)?track\/(.+)$/;
    const shortSpotifyregex = /https?:\/\/spotify\.link\/[\w-]+/;
    const studioUrlRegex = /(?:&|\?)player=spotify&(?:.*&)?track_id=([^&\s]+)/;
    const idRegex = /^[a-zA-Z0-9]{22}$/;
    const isrcRegex = /^[A-Z]{2}[A-Z0-9]{3}\d{2}\d{5}$/;

    const pushForm = "/push";
    const lyricsIframe = "/lyrics"
    const openStudio = "/studio"
    let trackId = '';
    let isrc = '';
    const search_mode = "spotify_id="

    const setTokenRegex = /^\/set_token=([A-Za-z0-9_]+)$/;

    const background1Regex = /^\/background=1$/;
    const background2Regex = /^\/background=2$/;

    // Verificar se o comando "set_market_<country_code>" foi digitado
    const setCountryRegex = /^\/set_country\/([A-Z]{2})$/;
    const setCountryMatch = inputVal.match(setCountryRegex);
    if (setCountryMatch) {
      const countryCode = setCountryMatch[1];
      saveCountry(countryCode);
      loading_spinner.style = "display:none";
      searchBtn.style = "";
      return;
    }

    if (trackUrlRegex.test(inputVal)) {
      const url = new URL(inputVal);
      trackId = url.pathname.split('/').pop();

    } else if (shortSpotifyregex.test(inputVal)) {
      // Envie a URL encurtada para a API
      const apiUrl = `https://datamatch-backend.onrender.com/unshort?token=${accessToken}url=${inputVal}`;
    
      fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
          if (data.url) {
            inputVal = data.url;
            loading_spinner.style = "";
            searchBtn.style = "";
            search_input.value = "";
          } else {
            notification("The URL provided could not be unshortened");
            loading_spinner.style = "";
            searchBtn.style = "";
            search_input.value = "";
          }
        })
        .catch(error => {
          console.error("Error unshortening the URL:", error);
          notification("An error occurred while unshortening this URL. Please use a 'open.spotify.com' link.");
          loading_spinner.style = "";
          searchBtn.style = "";
          search_input.value = "";
        });
  
    } else if (studioUrlRegex.test(inputVal)) {
      const match = inputVal.match(studioUrlRegex);
      if (match) {
        inputVal = match[1];
      }
    } else if (idRegex.test(inputVal)) {
      search_mode = `spotify_id=`;
    } else if (inputVal === pushForm) {
      pusher_container.style = "";
      lyrics_pusher.src = `https://musixmatch.typeform.com/to/tFQDvIsp?typeform-s`;
      lyrics_container.style = "display:none";
      search_input.value = "";
      loading_spinner.style = "display:none";
      searchBtn.style = "";
      return;
    } else if (inputVal === lyricsIframe) {
      loading_spinner.style = "display:none";
      searchBtn.style = "";
      lyrics_container.style = "";
      lyrics_preview.src = mxm_preview;
      pusher_container.style = "display:none";
      search_input.value = "";
      return;
    } else if (inputVal === openStudio) {
      loading_spinner.style = "display:none";
      searchBtn.style = "";
      var studio_url = mxm_edit_lyrics;
      window.open(studio_url, '_blank');
      search_input.value = "";
      return;
    } else if (isrcRegex.test(inputVal)) {
      search_mode = `track_isrc=`;
      loading_spinner.style = "display:none";
      searchBtn.style = "";
      search_input.value = "";

    } else if (setTokenRegex.test(inputVal)) {
      const setTokenMatch = inputVal.match(setTokenRegex); // Defina setTokenMatch aqui
      if (setTokenMatch) {
        notification("Personal token registered successfully 🔑");
        const accessToken = setTokenMatch[1];
        loading_spinner.style = "display:none";
        searchBtn.style = "";
        search_input.value = "";
        saveCustomToken(accessToken);
        return;
      }
      
    } else if (background1Regex.test(inputVal)) {
      notification("Background theme set successfully 🖌️");
      background_mode = 1;
      saveBackgroundMode(background_mode); // Salve localmente
      loading_spinner.style = "display:none";
      searchBtn.style = "";
      search_input.value = "";
      return;
    } else if (background2Regex.test(inputVal)) {
      notification("Background theme set successfully 🖌️");
      background_mode = 2;
      saveBackgroundMode(background_mode); // Salve localmente
      loading_spinner.style = "display:none";
      searchBtn.style = "";
      search_input.value = "";
      return;
      
    } else {
      notification("Please enter a valid Spotify track URL or ID 🎶")
      loading_spinner.style = "display:none";
      searchBtn.style = "";
      search_input.value = "";
      return;
    }

    /* DESATIVADO MOMENTANEAMENTE
    country_local_status.className = "status-3 status-gray"
    */

    search_input.value = "";
    // Botão 'X' do container de push
    const close_lyricspusher = () => {
      pusher_container.style = "display:none";
    };
    close_button_pusher.addEventListener('click', close_lyricspusher);

    // Send a Lyrics request to the internal API
    fetch(`https://datamatch-backend.onrender.com/lyricsfinder/search?${search_mode}${inputVal}&token=${accessToken}&background_mode=${background_mode}&spotify_lyrics=1&mxm_data=1`)
      .then((response) => {
        if (!response.ok) {
          if (response.status === 500) {
            notification("Sorry, we can't process your request at the moment 😥");
            console.log("Internal Server Error (500)");
            loading_spinner.style = "display:none";
            searchBtn.style = "";
            requests_counter_light.className = "requests_counter_status status-red";
            requests_counter_text.textContent = "Server error";
            request_counter_div.style = ""
          } else if (response.status === 503) {
            notification("Starting the server, please wait a moment");
            console.log("Dynamic Hibernate Error (503)");
            loading_spinner.style = "display:none";
            searchBtn.style = "";
            requests_counter_light.className = "requests_counter_status status-yellow";
            requests_counter_text.textContent = "Starting the server";
            request_counter_div.style = ""
          } else if (response.status === 403) {
            notification("The token you're using is invalid or has expired 🔑");
            console.log("Access denied (403)");
            loading_spinner.style = "display:none";
            searchBtn.style = "";
            requests_counter_light.className = "requests_counter_status status-red";
            requests_counter_text.textContent = "Unauthorized";
            request_counter_div.style = ""
          } else if (response.status === 404) {
            notification("We couldn't find the track you are looking for 😥");
            console.log("Resource not found (404)");
            loading_spinner.style = "display:none";
            searchBtn.style = "";
            requests_counter_light.className = "requests_counter_status status-red";
            requests_counter_text.textContent = "Not found";
            request_counter_div.style = ""
          } else if (response.status === 429) {
            notification("Too many requests, please try again later ⛔");
            console.log("Too many requests (429)");
            loading_spinner.style = "display:none";
            searchBtn.style = "";
            requests_counter_light.className = "requests_counter_status status-red";
            requests_counter_text.textContent = "Too many requests";
            request_counter_div.style = ""
          } else {
            notification("Sorry, we can't process your request at the moment 😥");
            console.log(`Unknown error: ${response.status}`);
            loading_spinner.style = "display:none";
            searchBtn.style = "";
            requests_counter_light.className = "requests_counter_status status-red";
            requests_counter_text.textContent = "Unknown error";
            request_counter_div.style = ""
          }
        }
        return response.json();
      })
      .then((data) => {

        loading_spinner.style = "display:none";
        searchBtn.style = "";
        let spotifyData, mxmData;
        headerData = data.message.header;
        spotifyData = data.message.body.spotify;
        mxmData = data.message.body.musixmatch;
        spLyricsData = data.message.body.spotify_lyrics;
        customizationData = data.message.body.customization

        // Spotify data
        const title = spotifyData.track_data.track_name;
        const artist = spotifyData.artists_data.artists[0].name;

        /* DESATIVADO APÓS INTEGRAÇÃO COM PLAYER DO SPOTIFY
        const songURL = `https://open.spotify.com/track/${spotifyID}`;
        const artistID = spotifyData.artists_data.artists[0].artist_id;
        const artistURL = `https://open.spotify.com/artist/${artistID}`;
        const album = spotifyData.album_data.album_id;
        const albumID = spotifyData.album_data.album_id;
        const albumURL = `https://open.spotify.com/album/${albumID}`;
        const image = spotifyData.album_data.images.url;
        const songPreview = spotifyData.track_data.preview_url;
        */

        const image_area = spotifyData.album_data.images[1].url;

        const spotifyID = spotifyData.track_data.track_id;
        const isrc = spotifyData.track_data.isrc;
        const releaseDate = spotifyData.album_data.release_date.toString();

        let formattedReleaseDate = '';

        if (releaseDate.includes('-')) {
          // Data completa (ano, mês, dia)
          const dateParts = releaseDate.split('-');
          formattedReleaseDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
          release_date_line = `Released on ${formattedReleaseDate}`;
        } else {
          // Formato desconhecido ou inválido
          formattedReleaseDate = releaseDate;
          release_date_line = `Released in ${formattedReleaseDate}`;
        }


        /* DESATIVADO APÓS INTEGRAÇÃO COM PLAYER DO SPOTIFY
        const durationMs = spotifyData.track_data.duration_ms;
        const durationMinutes = Math.floor(durationMs / 60000);
        const durationSeconds = Math.floor((durationMs % 60000) / 1000);
        const duration = `Length: ${durationMinutes}:${durationSeconds.toString().padStart(2, '0')}`;
        */
        const albumPositionN = spotifyData.track_data.disc_position;
        const albumTotalN = spotifyData.album_data.total_tracks;
        const numMarkets = spotifyData.track_data.available_markets.length;
        const popularity = spotifyData.track_data.popularity;

        const spot_lyrics_status = spLyricsData.status_code;
        const spot_lyrics = spLyricsData.has_lyrics;
        const spot_sync = spotifyData.has_sync;

        const background_mode = customizationData.background;

        // Musixmatch Data

        const mxm_status = mxmData.mxm_header.status_code;

        if (mxm_status === 200) {
          const mxm_abstrack = mxmData.track_data.commontrack_id;
          const mxm_lyrics_id = mxmData.track_data.lyrics_id;
          const mxm_artist_id = mxmData.artist_data.artist_id;
          const mxm_album_id = mxmData.album_data.album_id;
          const mxm_lyrics_rating = mxmData.track_data.track_rating;
          mxm_preview = mxmData.track_data.lyrics_preview_dark;
          mxm_edit_lyrics = mxmData.track_data.studio_url;
  
          const mxm_lyrics_name = mxmData.track_data.track_name;
          const mxm_artist_name = mxmData.artist_data.artist_name;
          const mxm_album_name = mxmData.album_data.album_name;
  
          const mxm_has_lyrics = mxmData.track_data.stats.has_lyrics;
          const mxm_has_linesync = mxmData.track_data.stats.has_line_sync;
          const mxm_has_richsync = mxmData.track_data.stats.has_word_sync;
          const mxm_instrumental = mxmData.track_data.stats.instrumental;
          const mxm_explicit = mxmData.track_data.stats.explicit;
          const mxm_restricted = mxmData.track_data.stats.restricted;

          mxm_lyrics_url.setAttribute("value", `mxmt.ch/t/${mxm_lyrics_id}`);
          mxm_artist_url.setAttribute("value", `mxmt.ch/a/${mxm_artist_id}`);
          mxm_album_url.setAttribute("value", `mxmt.ch/r/${mxm_album_id}`);
          abstrack_mxm.setAttribute("value", `${mxm_abstrack}`);
  
          mxm_lyricsname.title = mxm_lyrics_name + ' | Musixmatch'
          mxm_artistname.title = mxm_artist_name + ' | Musixmatch'
          mxm_albumname.title = mxm_album_name + ' | Musixmatch'
  
          popularity_mxm.textContent = `Musixmatch Rating: ${mxm_lyrics_rating}%`;

          mxm_stats_div.title = ""
          stats_mxm_lyrics_title.style = ""
          stats_mxm_linesync_title.style = ""
          stats_mxm_wordsync_title.style = ""
          stats_mxm_explicit_title.style = ""
          stats_mxm_instrumental_title.style = ""

          mxm_lyrics_title.style = ""
          mxm_artist_title.style = ""
          mxm_album_title.style = ""
          mxm_abstrack_title.style = ""

          mxm_links_content.style = ""
          loading_spinner_mxm.style = "display:none"
  
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
        } else if (mxm_status === 404) {
          mxm_stats_div.title = "This track is not available on Musixmatch"
          stats_mxm_lyrics_title.style = "color: #ffffff45"
          stats_mxm_linesync_title.style = "color: #ffffff45"
          stats_mxm_wordsync_title.style = "color: #ffffff45"
          stats_mxm_explicit_title.style = "color: #ffffff45"
          stats_mxm_instrumental_title.style = "color: #ffffff45"
          stats_mxm_lyrics.className = "status-1 status-gray";
          stats_mxm_linesync.className = "status-1 status-gray";
          stats_mxm_wordsync.className = "status-1 status-gray";
          stats_mxm_explicit.className = "status-1 status-gray";
          stats_mxm_instrumental.className = "status-1 status-gray";

          mxm_links_content.style = "display:none"
          loading_spinner_mxm.style = ""
        } else {
          notification("An error occurred when fetching data from Musixmatch")
          mxm_stats_div.title = "This track is not available on Musixmatch"
          stats_mxm_lyrics_title.style = "color: #ffffff45"
          stats_mxm_linesync_title.style = "color: #ffffff45"
          stats_mxm_wordsync_title.style = "color: #ffffff45"
          stats_mxm_explicit_title.style = "color: #ffffff45"
          stats_mxm_instrumental_title.style = "color: #ffffff45"
          stats_mxm_lyrics.className = "status-1 status-gray";
          stats_mxm_linesync.className = "status-1 status-gray";
          stats_mxm_wordsync.className = "status-1 status-gray";
          stats_mxm_explicit.className = "status-1 status-gray";
          stats_mxm_instrumental.className = "status-1 status-gray";

          mxm_lyrics_title.style = "color: #ffffff45"
          mxm_artist_title.style = "color: #ffffff45"
          mxm_album_title.style = "color: #ffffff45"
          mxm_abstrack_title.style = "color: #ffffff45"
        }
          

        document.title = `${title} by ${artist} | Songstats`;

        if (spot_lyrics_status === 200) {
          // Definição de valores
          if (spot_lyrics === false) {
            spotify_lyrics.className = "status-2 status-gray";
          } else if (spot_lyrics === true) {
            spotify_lyrics.className = "status-2 status-blue";
          } else {
            spotLyricsDiv.title = "Feature disabled for this song due to restrictions"
            spotify_lyrics.className = "status-2 status-gray";
            spotLyricsTitle.style = "color: #ffffff45"
          }

          if (spot_sync === false) {
            spotify_sync.className = "status-2 status-gray";
          } else if (spot_sync === true) {
            spotify_sync.className = "status-2 status-blue";
          } else {
            spotLyricsDiv.title = "Feature disabled for this song due to restrictions"
            spotify_sync.className = "status-2 status-gray";
            spotSyncTitle.style = "color: #ffffff45"
          }
        } else {
          spotLyricsDiv.title = "Feature disabled for this song due to restrictions"
          spotify_lyrics.className = "status-2 status-gray";
          spotLyricsTitle.style = "color: #ffffff45"
          spotify_sync.className = "status-2 status-gray";
          spotSyncTitle.style = "color: #ffffff45"
        }

        // Background mode
        if (background_mode === "1") {
          const backgroundDiv = document.getElementById("background_div");
        
          // Crie um novo elemento div para a nova imagem de fundo
          const newBackgroundDiv = document.createElement("div");
          newBackgroundDiv.className = "blur-background";
          newBackgroundDiv.style.backgroundImage = `url('${image_area}')`;
        
          // Adicione o novo elemento ao DOM
          backgroundDiv.appendChild(newBackgroundDiv);
        
          // Gradualmente ajuste a opacidade do novo fundo
          let opacity = 0;
          const fadeInterval = 30; // Intervalo de tempo em milissegundos
          const fadeDuration = 3000; // Duração total da transição (3 segundos)
        
          const fadeOut = () => {
            opacity += (fadeInterval / fadeDuration);
            if (opacity < 1) {
              // Continue a ajustar a opacidade
              newBackgroundDiv.style.opacity = opacity;
              setTimeout(fadeOut, fadeInterval);
            }
          };
        
          // Inicie a transição
          fadeOut();
        } else if (background_mode === "2") {
          const backgroundDiv = document.getElementById("background_div");
          backgroundDiv.innerHTML = `
            <ul class="circles">
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
              <li></li>
            </ul>
          `;

          const album_color_1 = `rgb(${customizationData.album_colors.color_1.join(', ')})`;
          const album_color_2 = `rgb(${customizationData.album_colors.color_2.join(', ')})`;
  
          backgroundGradient.style.backgroundImage = `linear-gradient(45deg, ${album_color_1}, ${album_color_2})`;
        } else {
          const backgroundDiv = document.getElementById("background_div");
          backgroundDiv.innerHTML = `
            <div class="blur-overlay"></div>
            <div class="blur-background" style="background-image: url('${image_area}');"></div>
          `;
        }

        const requestsCounter = data.message.header.user.requests_counter;
        const requestsLimit = data.message.header.user.requests_limit;

        /* DESATIVADO MOMENTANEAMENTE!
        
        // Ativa ou desativa o preview das letras
        if (mxm_has_lyrics === 1) {
            div_lyrics_preview.style = ""
            mxm_lyrics_preview.src = mxm_preview
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
        */

        /* DESATIVADO APÓS INTEGRAÇÃO COM PLAYER DO SPOTIFY
        
        // Collect all artist names and URLs
        const artists = data.artists.map((artist) => {
          return { name: artist.name, url: artist.external_urls.spotify };
        });

        */

        /* DESATIVADO MOMENTANEAMENTE

        // Função para verificar se o país está disponível na lista de países da faixa
        const checkCountryAvailability = (countryCode) => {
          const availableMarkets = spotifyData.track_data.available_markets;
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

        */

        /* DESATIVADO APÓS INTEGRAÇÃO COM PLAYER DO SPOTIFY
        // Format artists as HTML anchor tags
        const artistsLinks = artists.map(
          (artist) => `<a href="${artist.url}" target="_blank">${artist.name}</a>`
        );
        */

        // Update DOM elements with Spotify data

        /* DESATIVADO APÓS INTEGRAÇÃO COM PLAYER DO SPOTIFY
        
        titleInput.textContent = title;
        trackUrlInput.href = songURL;
        artistInput.innerHTML = artistsLinks.join(", ");
        albumInput.textContent = album;
        albumUrlInput.href = albumURL;
        imageInput.style.backgroundImage = `url(${image})`;
        releaseDateInput.textContent = releaseDate;
        songPreviewInput.src = songPreview;
        player_button.className = "play-button"
        */

        spotifyPreview.src = `https://open.spotify.com/embed/track/${spotifyID}?utm_source=generator&theme=0`;
        trackIdInput.value = spotifyID;
        isrcInput.value = isrc;
        releaseDateInput.textContent = release_date_line;
        albumPosition.textContent = `Album Position: ${albumPositionN} of ${albumTotalN}`;
        countriesCounterInput.textContent = `Available in ${numMarkets} markets`;
        popularityInput.textContent = `Spotify Rating: ${popularity}%`;

        requests_counter_light.className = "requests_counter_status status-green";
        request_counter_div.style = ""
        requests_counter_text.textContent = `${requestsCounter} of ${requestsLimit}`;

        /* DESATIVADO MOMENTANEAMENTE!
        // Verificar se o país salvo está disponível para a faixa pesquisada
        const selectedCountry = localStorage.getItem('selected_country');
        if (selectedCountry) {
          checkCountryAvailability(selectedCountry);
        }

        */

        /* DESATIVADO APÓS INTEGRAÇÃO COM PLAYER DO SPOTIFY
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
        */

        animationStarter.innerHTML = `
        @keyframes animate {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
            border-radius: 0;
          }
          100% {
            transform: translateY(-1000px) rotate(720deg);
            opacity: 0;
            border-radius: 50%;
          }
        }
      `;
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // Função para iniciar a pesquisa com base na URL atual
  const startSearchFromURL = () => {
    // Obtenha a parte da URL após o domínio (por exemplo, "/s/trackId")
    const currentPathname = window.location.pathname;

    // Verifique se a URL atual corresponde ao padrão "/s/trackId"
    const urlRegex = /^\/s\/(.+)$/;
    const match = currentPathname.match(urlRegex);

    if (match) {
      // Extrai o trackId da URL atual
      const trackId = match[1];

      // Chama a função handleSearch() com o trackId como argumento
      handleSearch(trackId);
    }
  };

  window.addEventListener('load', startSearchFromURL);

  /* DESATIVADO MOMENTANEAMENTE!
  
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

 */

  // Add event listener for search button
  searchBtn.addEventListener('click', handleSearch);

  // Add event listener for Enter key press
  search_input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSearch();
    }
  });

  // Scripts para copiar IDs

  document.getElementById('spotify_id_input').addEventListener('click', function () {
    var inputElement = document.getElementById('track-input');
    var inputValue = inputElement.value;

    if (inputValue.trim() !== "") {
      inputElement.select();
      document.execCommand('copy');
      notification("Copied to your clipboard ✨");
    }
  });

  document.getElementById('isrc_value_input').addEventListener('click', function () {
    var inputElement = document.getElementById('isrc-input');
    var inputValue = inputElement.value;

    if (inputValue.trim() !== "") {
      inputElement.select();
      document.execCommand('copy');
      notification("Copied to your clipboard ✨");
    }
  });

  document.getElementById('mxm_abstrack_input').addEventListener('click', function () {
    var inputElement = document.getElementById('mxm_abstrack');
    var inputValue = inputElement.value;

    if (inputValue.trim() !== "") {
      inputElement.select();
      document.execCommand('copy');
      notification("Copied to your clipboard ✨");
    }
  });

  // Scripts para abrir links da mxm em nova aba

  document.getElementById('mxm_lyrics_input').addEventListener('click', function () {
    var inputElement = document.getElementById('mxm_lyrics_url');
    var url = inputElement.value;

    if (url.trim() !== "") {
      inputElement.select();
      var fullUrl = 'http://' + url;
      window.open(fullUrl, '_blank');
    }
  });

  document.getElementById('mxm_artist_input').addEventListener('click', function () {
    var inputElement = document.getElementById('mxm_artist_url');
    var url = inputElement.value;

    if (url.trim() !== "") {
      inputElement.select();
      var fullUrl = 'http://' + url;
      window.open(fullUrl, '_blank');
    }
  });

  document.getElementById('mxm_album_input').addEventListener('click', function () {
    var inputElement = document.getElementById('mxm_album_url');
    var url = inputElement.value;

    if (url.trim() !== "") {
      inputElement.select();
      var fullUrl = 'http://' + url;
      window.open(fullUrl, '_blank');
    }
  });

  let clickCounter = 0;
  let devMode = false;

  const modoDevButton = document.getElementById("modo_dev");

  requests_counter_light.addEventListener("click", () => {
    if (devMode) {
      notification("Developer mode disabled 🔧")
      console.log("Developer mode has been disabled by the user");
      devMode = false;
    } else {
      clickCounter++;
      if (clickCounter === 5) {
        notification("Developer mode enabled 🔧")
        console.log("Developer mode has been enabled by the user");
        clickCounter = 0;
        devMode = true;
      }
    }
  });

  modoDevButton.addEventListener("click", () => {
    if (devMode) {
      console.log("Developer mode has been disabled by the user");
      devMode = false;
    }
  });
});
