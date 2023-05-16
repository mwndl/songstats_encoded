window.addEventListener('load', () => {
    // Get DOM elements
  const searchBtn = document.getElementById('search-btn');
  const spotifyLink = document.getElementById('spotify-link');
  const titleInput = document.querySelector('#song_name');
  const trackUrlInput = document.querySelector('#song_name')
  const artistInput = document.querySelector('#artist_name');
  const artistUrlInput = document.querySelector('#artist_name');
  const albumInput = document.querySelector('#album_name');
  const albumUrlInput = document.querySelector('#album_name')
  const imageInput = document.querySelector('#music_cover');
  const releaseDateInput = document.querySelector('#release_date')
  
  const lyrics = document.querySelector('#lyrics')
  const sync = document.querySelector('#sync')
  const durationInput = document.querySelector('#duration')
  const albumPosition = document.querySelector('#album_position');
  const songPreviewInput = document.querySelector('#song_preview')
  const countriesCounterInput = document.querySelector('#countries_counter')
  const audio = document.querySelector('#player')
  
  const trackIdInput = document.querySelector('#track-input');
  const isrcInput = document.querySelector('#isrc-input');
  
  // Spotify API credentials
  const clientId = '51a45f01c96645e386611edf4a345b50';
  const clientSecret = '263caac23eab4b49bc7f46a94124c75f';
  const authEndpoint = 'https://accounts.spotify.com/api/token';
  
  // Make API request to get access token
  fetch(authEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
      },
      body: 'grant_type=client_credentials',
    })
      .then((response) => response.json())
      .then((data) => {
        const accessToken = data.access_token;
        
      // Add event listener for search button
      searchBtn.addEventListener('click', () => {
        const inputVal = spotifyLink.value.trim();
  
        const trackUrlRegex = /^(https?:\/\/)?open\.spotify\.com\/track\/(.+)$/;
  
        const apiUrl = `https://spotify-lyric-api.herokuapp.com/?url=${spotifyLink.value}`;
        fetch(apiUrl)
          .then(response => response.json())
          .then(data => {
            if (data.error) {
              lyrics.textContent = "Has Lyrics: No";
              sync.textContent = "Has Sync: No";
            } else if (data.syncType === "UNSYNCED") {
              lyrics.textContent = "Has Lyrics: Yes";
              sync.textContent = "Has Sync: No";
            } else if (data.syncType === "LINE_SYNCED") {
              lyrics.textContent = "Has Lyrics: Yes";
              sync.textContent = "Has Sync: Yes";
            }
          })
          .catch(error => {
            console.error(error);
          });       
  
        if (trackUrlRegex.test(inputVal)) {
          const url = new URL(inputVal);
          const trackId = url.pathname.split('/').pop();
          trackIdInput.value = trackId;
          spotifyLink.value = '';
        } else {
          alert('Error: Please enter a Spotify song URL.');
          return;
        }      
  
        // Make API request to Spotify
        const url = `https://api.spotify.com/v1/tracks/${trackIdInput.value || isrcInput.value}`;
  
        fetch(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            // Extract relevant data from API response
            const title = data.name;
            const songURL = data.external_urls.spotify
            const artist = data.artists[0].name;
            const artistURL = data.artists[0].external_urls.spotify;
            const album = data.album.name;
            const albumURL = data.album.external_urls.spotify;
            const image = data.album.images[0].url;
            const isrc = data.external_ids.isrc;
            const durationMs = data.duration_ms;
            
            const durationMinutes = Math.floor(durationMs / 60000);
            const durationSeconds = Math.floor((durationMs % 60000) / 1000);
            const duration = `Length: ${durationMinutes}:${durationSeconds.toString().padStart(2, '0')}`
  
            const albumPositionN = data.track_number
            const albumTotalN = data.album.total_tracks
            const numMarkets = data.available_markets.length;
  
            const releaseDate = data.album.release_date.toString().padStart(2, '0');
  
            // remove a quebra de linha para corrigir a ordem das chamadas de função
            const songPreview = data.preview_url;
            
            // Set input values
            titleInput.textContent = title;
            trackUrlInput.href = songURL;
            artistInput.textContent = artist;
            artistUrlInput.href = artistURL;
            albumInput.textContent = album;
            albumUrlInput.href = albumURL
            imageInput.style.backgroundImage = `url(${image})`;
            isrcInput.value = isrc;
            releaseDateInput.textContent = releaseDate;
            durationInput.textContent = duration;
            albumPosition.textContent = `Album Position: ${albumPositionN} of ${albumTotalN}`;
            countriesCounterInput.textContent = `Available in ${numMarkets} contries`;
            songPreviewInput.src = songPreview;
  
            if (songPreview) {
              audio.load();
            } else {
              // Se não houver arquivo de áudio, defina uma mensagem de erro ou desative o botão de reprodução.
            }
  
          })
          .catch((error) => {
            alert(`Error: ${error.message}`);
          }); 
      });
    })
  
    .catch((error) => {
      alert(`Error: ${error.message}`);
    });
  
  // Seleciona os botões de cópia
  const copyButtons = document.querySelectorAll('.copy-btn');
  
  // Adiciona um evento de clique a cada botão de cópia
  copyButtons.forEach((button) => {
    button.addEventListener('click', () => {
      // Obtém o valor do campo de entrada correspondente
      const inputField = button.parentElement.querySelector('input[type="text"]');
      const inputValue = inputField.value;
      
      // Copia o valor para a área de transferência do navegador
      navigator.clipboard.writeText(inputValue)
        .then(() => {
          // Define o texto do botão como "Copiado!" por 2 segundos
          button.textContent = 'Done';
          setTimeout(() => {
            button.textContent = 'Copy';
          }, 2000);
        })
        .catch((error) => {
          console.error('Erro ao copiar:', error);
        });
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