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
  const lyrics = document.querySelector('#lyrics');
  const sync = document.querySelector('#sync');
  const durationInput = document.querySelector('#duration');
  const albumPosition = document.querySelector('#album_position');
  const songPreviewInput = document.querySelector('#song_preview');
  const countriesCounterInput = document.querySelector('#countries_counter');
  const audio = document.querySelector('#player');
  const trackIdInput = document.querySelector('#track-input');
  const isrcInput = document.querySelector('#isrc-input');

  // DOM elements - MUSIXMATCH
  const mxmTitle = document.querySelector('#song_name-mxm')
  const mxmAbstrack = document.querySelector('#mxm-abstrack')

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
          lyrics.textContent = "Pushed Lyrics: No";
          sync.textContent = "Pushed Sync: No";
        } else if (data.syncType === "UNSYNCED") {
          lyrics.textContent = "Pushed Lyrics: Yes";
          sync.textContent = "Pushed Sync: No";
        } else if (data.syncType === "LINE_SYNCED") {
          lyrics.textContent = "Pushed Lyrics: Yes";
          sync.textContent = "Pushed Sync: Yes";
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

      const url = `https://api.spotify.com/v1/tracks/${trackIdInput.value || isrcInput.value}`;

      fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => response.json())
      .then((data) => {
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
        const releaseDate = data.album.release_date.toString().padStart(2, '0');
        const songPreview = data.preview_url;

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
        songPreviewInput.src = songPreview;

        if (songPreview) {
          audio.load();
        } else {
          // Set an error message or disable the play button if no audio file is available.
        }

        const apiUrl = `http://localhost:3000/api/track?isrc=${isrc}`;
        fetch(apiUrl)
        .then((response) => response.json())
        .then((data) => {
          const mxm_title = data.track_name;
          const mxm_abstrack = data.commontrack_id;

          mxmTitle.textContent = mxm_title;
          mxmAbstrack.textContent = `Abstrack: ${mxm_abstrack}`;
        })
        .catch((error) => {
          console.error('Error in Musixmatch API request:', error);
        });
      })
      .catch((error) => {
        alert(`Error: ${error.message}`);
      });
    });
  })
  .catch((error) => {
    alert(`Error: ${error.message}`);
  });

  const copyButtons = document.querySelectorAll('.copy-btn');
  copyButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const inputField = button.parentElement.querySelector('input[type="text"]');
      const inputValue = inputField.value;

      navigator.clipboard.writeText(inputValue)
      .then(() => {
        button.textContent = 'Done';
        setTimeout(() => {
          button.textContent = 'Copy';
        }, 2000);
      })
      .catch((error) => {
        console.error('Error copying:', error);
      });
    });
  });

  spotifyLink.addEventListener('keydown', (event) => {
    if (event.keyCode === 13) {
      event.preventDefault();
      searchBtn.click();
    }
  });
});
