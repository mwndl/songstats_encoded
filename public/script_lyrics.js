<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Song Stats</title>
    <link rel="stylesheet" href="style.css">
    <link rel="icon" href="/images/favicon.ico" type="image/x-icon">
    <script src="axios.min.js"></script>
    <script src="script_lyrics.js"></script>
  </head>
  <body>
    <div class="context">
      <style id="background_animation_starter"></style>
      <p id="countries_available"></p>
      <div class="containers">
        <div class="container_1">
          <div class="search-container">
            <input type="text" placeholder="Paste a Spotify track URL or ID" id="search_input">
            <button type="submit" id="search-btn">Search</button>
          </div>   
          <div class="top">
            <div class="spotify_preview" style="border-radius: 12px; overflow: hidden;"> 
              <iframe id="spotify_iframe_preview" border-radius: 12px user-select: none src="" width="100%" height="100%" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
            </div>   
          </div>   
          <div class="top_bottom">
            
          </div>
          <div class="main-container">
            <div class="main">
              <div class="track-info">
                <div class="track-id">
                  <p style="user-select: none;">Spotify ID:</p>
                  <div class="input-group-ids">
                    <input type="text" placeholder="Not Available" class="track-input" id="track-input" value="" readonly>
                  </div>
                </div>
                <div class="isrc">
                  <p style="user-select: none;">ISRC:</p>
                  <div class="input-group-ids">
                    <input type="text" placeholder="Not Available" class="isrc-input" id="isrc-input" value="" readonly>
                  </div>
                </div>
              </div>
            </div>         
            <div class="main_1-right">
              <p id="duration"></p>
              <p id="album_position"></p>
              <p id="countries_counter"></p>
              <p id="popularity"></p>
              <p id="popularity_mxm"></p>
            </div>        
          </div>  
          <div class="main_2-div">
            <div class="all-stats">
              <div class="song-stats-div-1">
                <div class="song-stats">
                  <div class="main_2-1-group">
                    <div class="main_2-1">
                      <div class="title-status-pair">
                        <p class="title">Lyrics</p>
                        <p class="status-1 status-gray" id="has_lyrics"></p>
                      </div>
                      <div class="title-status-pair">
                        <p class="title">Line-Sync</p>
                        <p class="status-1 status-gray" id="has_sync"></p>
                      </div>
                      <div class="title-status-pair">
                        <p class="title">Word-Sync</p>
                        <p class="status-1 status-gray" id="has_wordsync"></p>
                      </div>
                      <div class="title-status-pair">
                        <p class="title">Explicit</p>
                        <p class="status-1 status-gray" id="is_explicit"></p>
                      </div>
                      <div class="title-status-pair">
                        <p class="title">Instrumental</p>
                        <p class="status-1 status-gray" id="is_instrumental"></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>  
              <div class="song-stats-div">
                <div class="song-stats">
                  <div class="main_2-2-group">
                    <div class="main_2-1">
                      <div class="title-status-pair">
                        <p class="title">Lyrics on Spotify</p>
                        <p id="spotify_lyrics" class="status-2 status-gray"></p>
                      </div>
                      <div class="title-status-pair">
                        <p class="title">Sync on Spotify</p>
                        <p id="spotify_sync" class="status-2 status-gray"></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>  
            </div>
            <div class="main_2-right">
              <div class="track-info">
                <div class="track-id">
                  <p style="user-select: none;">Lyrics:</p>
                  <div class="input-group-urls">
                    <input type="text" placeholder="Not Available" class="lyrics-url-track-input" id="mxm_lyrics_url" value="" readonly title="">
                  </div>
                </div>
                <div class="isrc">
                  <p style="user-select: none;">Artist:</p>
                  <div class="input-group-urls">
                    <input type="text" placeholder="Not Available" class="artist-url-isrc-input" id="mxm_artist_url" value="" readonly title="">
                  </div>
                </div>
                <div class="isrc">
                  <p style="user-select: none;">Album:</p>
                  <div class="input-group-urls">
                    <input type="text" placeholder="Not Available" class="album-url-input" id="mxm_album_url" value="" readonly title="">
                  </div>
                </div>
                <div class="isrc">
                  <p style="user-select: none;">Abstrack:</p>
                  <div class="input-group-urls">
                    <input type="text" placeholder="Not Available" class="abstrack-input" id="mxm_abstrack" value="" readonly>
                  </div>
                </div>
                <div class="last-update">
                  <p id="last_update"></p>
                </div>
              </div>
            </div> 
          </div>
        </div>
        <div class="container_2" style="display:none" id="lyrics_container">
          <div id="div-lyrics-preview">
            <div class="iframe-mxm">
              <iframe class="lyrics_preview" id="lyrics_preview" src="" style="border:none;background:transparent;" width="100%" height="680px" style="font-size: 20px"></iframe>
            </div>
          </div>
        </div>
        <div class="container_3" style="display:none" id="pusher_container">
          <iframe class="lyrics_pusher" id="lyrics_pusher" src="" style="border:none;background:transparent;border-radius:20px;" width="100%" height="730px" style="font-size: 20px"></iframe>
          <button class="close_button" id="close_button_pusher"></button>
          <button class="refresh_button" id="refresh_button">
            <div class="refresh_symbol"></div>
          </button>
        </div>
      </div>
    </div>
    <div class="area" >
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
    </div >
  </body>
    <script>

      /* disabled
      
      var playButton = document.getElementById('player_button');
      var audioPlayer = document.getElementById('player');

      playButton.addEventListener('click', function() {
          if (audioPlayer.paused) {
              audioPlayer.play();
              playButton.classList.remove('play-button');
              playButton.classList.add('pause-button');
          } else {
              audioPlayer.pause();
              playButton.classList.remove('pause-button');
              playButton.classList.add('play-button');
          }
      });
      audioPlayer.addEventListener('ended', function() {
        playButton.classList.remove('pause-button');
        playButton.classList.add('play-button');
      });

      */

      // Botão close_button_pusher 
      const closeButtonPusher = document.getElementById('close_button_pusher');
      const pusher_container = document.getElementById('pusher_container');
      
      const hideLyricsPusher = () => {
        pusher_container.style = "display:none";
      };
      closeButtonPusher.addEventListener('click', hideLyricsPusher);

      // Botão refresh pusher
      const lyricsPusher = document.getElementById('lyrics_pusher');
      const refreshButton = document.getElementById('refresh_button');

      const restartIframe = () => {
        lyricsPusher.src = lyricsPusher.src;
      };

      // Adiciona um ouvinte de evento de clique ao botão de refresh
      refreshButton.addEventListener('click', restartIframe);

      // Animação de fundo //
      // Função para gerar números aleatórios entre 0 e 1
      function getRandom() {
          return Math.random();
      }

      // Seleciona todos os elementos .circles li e adiciona a classe .random-position com valores aleatórios
      const circles = document.querySelectorAll('.circles li');
      circles.forEach((circle) => {
          circle.style.setProperty('--random-x', getRandom());
          circle.style.setProperty('--random-delay', getRandom() * 10 + 's');
          circle.classList.add('random-position');
      });
  </script>
</html>
