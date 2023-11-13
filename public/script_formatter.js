window.addEventListener('load', () => {
    var returnArrow = document.querySelector('#return_arrow');
    var lyricsBox = document.getElementById('lyrics_box');
    var textArea = document.getElementById('editor');
    var textarea = document.querySelector('.editor');
    var lineNumbers = document.querySelector('.line_numbers');
    const selector = document.querySelector('.language_selector');
    const selectedLanguage = document.querySelector('.selected_language');
    const languageList = document.querySelector('.language_list');
    const languageArrow = document.querySelector('.lang_expand_arrow');
    const langButtonContent = document.querySelector('.lang_selector_div');

    const searchBtn = document.querySelector('#search_btn');
    const search_input = document.querySelector('#search_input');
    const loading_spinner = document.querySelector('#loading_spinner');
    const spotifyIframePreview = document.querySelector('#spotify_iframe_preview');

    const notification_div = document.getElementById("notification");
    const message = document.getElementById("notification-message");

    // Função para lidar com a pesquisa
    const handleSearch = () => {

        const inputVal = search_input.value.trim();
        const trackUrlRegex = /^(https?:\/\/open\.spotify\.com\/(?:intl-[a-z]{2}\/)?)?track\/(.+)$/;
        const studioUrlRegex = /(?:&|\?)player=spotify&(?:.*&)?track_id=([^&\s]+)/;
        const idRegex = /^[a-zA-Z0-9]{22}$/;

        let trackId = '';

        if (trackUrlRegex.test(inputVal)) {
            const url = new URL(inputVal);
            search_value = url.pathname.split('/').pop();
            trackId = search_value;
        } else if (idRegex.test(inputVal)) {
            search_value = inputVal;
            trackId = search_value;
        } else if (studioUrlRegex.test(inputVal)) {
            const match = inputVal.match(studioUrlRegex);
            if (match) {
                search_value = match[1];
                trackId = search_value;
            } else if (idRegex.test(inputVal)) {
                search_value = inputVal;
                trackId = search_value;
            } else {
                notification("Please enter Studio or Spotify track URL");
                search_input.value = "";
                return;
            }
        } else {
            notification("Please enter Studio or Spotify track URL");
            search_input.value = "";
            return;
        }

        search_input.value = "";
        spotifyIframePreview.src = `https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`;
    }

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

    // Add event listener for search button
    searchBtn.addEventListener('click', handleSearch);

    // Add event listener for Enter key press
    search_input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
        event.preventDefault();
        handleSearch();
        }
    });


    var returnArrow = document.querySelector('#return_arrow');

    returnArrow.addEventListener('click', function() {
        window.location.href = 'index.html';
    });


    var lyricsBox = document.getElementById('lyrics_box');
    var textArea = document.getElementById('editor');

    lyricsBox.addEventListener('click', function() {
        textArea.focus();
    });


    textarea.addEventListener('input', updateLineNumbers);
    textarea.addEventListener('scroll', syncScroll);

    function updateLineNumbers() {
        var lines = textarea.value.split('\n');
        lineNumbers.innerHTML = '';

        for (var i = 0; i < lines.length; i++) {
            var line = document.createElement('div');
            var lowercaseLine = lines[i].trim().toLowerCase();

            if (lowercaseLine === '' || lowercaseLine.includes("#instrumental") || lowercaseLine.includes("#intro") || lowercaseLine.includes("#verse") || lowercaseLine.includes("#pre-chorus") || lowercaseLine.includes("#chorus") || lowercaseLine.includes("#hook") || lowercaseLine.includes("#bridge") || lowercaseLine.includes("#outro")) {
                line.textContent = " ";
            } else {
                line.textContent = lines[i].trim().length;
            }

            lineNumbers.appendChild(line);
        }
    }

    function syncScroll() {
        lineNumbers.scrollTop = textarea.scrollTop;
    }

    updateLineNumbers();

    selector.addEventListener('click', function(event) {
        event.stopPropagation(); 
        
        if (languageList.style.display === 'block') {
            languageList.style.display = 'none';
            languageArrow.style.transform = "rotate(180deg)";
            langButtonContent.title = "Tap to edit the language";
        } else {
            languageList.style.display = 'block';
            languageArrow.style.transform = "rotate(0)";
            langButtonContent.title = "Tap to hide the list of supported languages";
        }
    });

    languageList.addEventListener('click', function(e) {
        if (e.target.tagName === 'LI') {
            const selected = e.target.dataset.lang;
            selectedLanguage.textContent = e.target.textContent;
            languageList.style.display = 'none';
            // Add language change logic here based on the "selected" value
        }
    });

    document.addEventListener('click', function(event) {
        if (!selector.contains(event.target)) {
            languageList.style.display = 'none';
            languageArrow.style.transform = "rotate(180deg)";
            langButtonContent.title = "Tap to edit the language";
        }
    });
});

function expandContainer(container) {
    const content = container.querySelector('.content');

    if (container.classList.contains('expanded')) {
        // The div is already expanded, do nothing.
    } else {
        const allContainers = document.querySelectorAll('.container');
        allContainers.forEach((c) => {
            if (c !== container) {
                c.classList.remove('expanded');
                c.querySelector('.content').style.display = 'none';
            }
        });

        container.classList.add('expanded');
        content.style.display = 'block';
    }
}
