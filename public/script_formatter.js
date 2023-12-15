document.addEventListener('DOMContentLoaded', function () {
    var returnArrow = document.querySelector('#return_arrow');
    var lyricsBox = document.getElementById('lyrics_box');
    var textArea = document.getElementById('editor');
    var textarea = document.querySelector('.editor');
    var characterCounter = document.querySelector('.character_counter');
    const selector = document.querySelector('.language_selector');
    const selectedLanguage = document.querySelector('.selected_language');
    const languageList = document.querySelector('.language_list');
    const languageArrow = document.querySelector('.lang_expand_arrow');
    const langButtonContent = document.querySelector('.lang_selector_div');

    var refreshButton = document.getElementById('refresh_button');
    var loadingSpinner = document.getElementById('loading_spinner');

    const searchBtn = document.querySelector('#search_btn');
    const search_input = document.querySelector('#search_input');
    const loading_spinner = document.querySelector('#loading_spinner');
    const spotifyIframePreview = document.querySelector('#spotify_iframe_preview');

    const notification_div = document.getElementById("notification");
    const message = document.getElementById("notification-message");


    // Função para verificar o conteúdo do textarea e ajustar a visibilidade do botão
    function handleTextareaInput() {
        var textareaContent = document.getElementById('editor').value;
        var refreshButton = document.getElementById('refresh_button');

        if (textareaContent.trim() !== '') {
            refreshButton.style.display = 'inline-block'; // Mostrar o botão se o conteúdo não estiver vazio
        } else {
            refreshButton.style.display = 'none'; // Esconder o botão se o conteúdo estiver vazio
        }
    }
    
    // Add this function to your existing code
    function handleRefreshButtonClick() {
        // Get references to the elements

        // Hide the refresh button and show the loading spinner
        refreshButton.style.display = 'none';
        loadingSpinner.style.display = 'block';

        // Get the language code from the selected language element
        var selectedLanguageCode = localStorage.getItem('selectedLanguage');

        // Prepare the data to send to the API
        var requestData = {
            text: textArea.value,
        };

        fetch(`http://localhost:3000/formatter/${selectedLanguageCode}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        })
            .then(response => response.json())
            .then(data => {
                // Handle the API response here
                console.log('API Response:', data);
    
                // Remove existing HTML elements inside the improvements_containers
                const improvementsContainer = document.getElementById('improvements_containers');
                improvementsContainer.innerHTML = '';

                if (data.result.issues === false) {
                    // Create and append the "No issues found" div
                    const noIssuesDiv = document.createElement('div');
                    noIssuesDiv.className = 'container_no_issues';
                    noIssuesDiv.id = 'container_no_issues';
                    noIssuesDiv.style.display = 'block';
                
                    const contentDiv = document.createElement('div');
                    contentDiv.className = 'content_ok';
                
                    const h2 = document.createElement('h2');
                    h2.textContent = 'No issues found! ✨';
                
                    const copyBtn = document.createElement('div');
                    copyBtn.className = 'content_copy_btn';
                    copyBtn.textContent = 'Copy';
                    copyBtn.onclick = copyToClipboard;
                
                    contentDiv.appendChild(h2);
                    contentDiv.appendChild(copyBtn);
                    noIssuesDiv.appendChild(contentDiv);
                
                    improvementsContainer.appendChild(noIssuesDiv);
                } else {
                    // Adiciona os containers HTML ao contêiner "improvements_containers"
                    for (const alertaKey in data.result.containers.alerts) {
                        const alerta = data.result.containers.alerts[alertaKey];
                        const container = createContainer(alerta.container);
                        improvementsContainer.appendChild(container);
                    }
                }
    
            })
            .catch(error => {
                // Handle errors here
                console.error('Error sending data to API:', error);
                notification('We are experiencing internal issues, please try again later. 🔧');
            })
            .finally(() => {
                // Show the refresh button and hide the loading spinner after the request is complete
                refreshButton.style.display = 'block';
                loadingSpinner.style.display = 'none';
            });
    }

    refreshButton.addEventListener('click', handleRefreshButtonClick);

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


    textarea.addEventListener('input', updateCharacterCounter);
    textarea.addEventListener('scroll', syncScroll);

    function updateCharacterCounter() {
        
        var lines = textarea.value.split('\n');
        characterCounter.innerHTML = '';
    
        for (var i = 0; i < lines.length; i++) {
            var line = document.createElement('div');
            var lowercaseLine = lines[i].trim().toLowerCase();
            var lineLength = lines[i].trim().length;
    
            if (lowercaseLine === '' || /^#instrumental$/.test(lowercaseLine) || /^#intro$/.test(lowercaseLine) || /^#verse$/.test(lowercaseLine) || /^#pre-chorus$/.test(lowercaseLine) || /^#chorus$/.test(lowercaseLine) || /^#hook$/.test(lowercaseLine) || /^#bridge$/.test(lowercaseLine) || /^#outro$/.test(lowercaseLine)) {
                line.textContent = " ";            
            } else {
                line.textContent = lineLength;

                var selectedLanguageCode = localStorage.getItem('selectedLanguage');
                if (selectedLanguageCode === 'BR' || selectedLanguageCode === 'PT') {        
                    if (lineLength > 50) {
                        line.style.fontWeight = 'bold';
                        line.style.color = 'yellow';
                    }     
                    if (lineLength > 55) {
                        line.style.fontWeight = 'bold';
                        line.style.color = 'red';
                    }
                } else {
                    if (lineLength > 65) {
                        line.style.fontWeight = 'bold';
                        line.style.color = 'yellow';
                    }     
                    if (lineLength > 70) {
                        line.style.fontWeight = 'bold';
                        line.style.color = 'red';
                    }
                }

            }
    
            characterCounter.appendChild(line);
        }
    }
    

    function syncScroll() {
        characterCounter.scrollTop = textarea.scrollTop;
    }

    updateCharacterCounter();


   // Função para verificar e definir o idioma padrão ao carregar a página
    function setDefaultLanguage() {
        const storedLanguage = localStorage.getItem('selectedLanguage');

        if (storedLanguage) {
            // Se houver um idioma armazenado em cache, defina-o como padrão
            selectedLanguage.textContent = getLanguageFullName(storedLanguage);
            // Adicione integração do idioma aqui
        }
    }

    // Função para obter o nome completo do idioma com base no código
    function getLanguageFullName(code) {
        const languageMap = {
            'UK': 'English (UK)',
            'US': 'English (US)',
            'BR': 'Portuguese (BR)',
            'PT': 'Portuguese (PT)'
            // Adicione mais idiomas conforme necessário
        };

        return languageMap[code] || code; // Retorna o nome completo se estiver mapeado, senão retorna o código
    }

    // Adicione um evento de clique ao seletor de idioma
    languageList.addEventListener('click', function (e) {
        if (e.target.tagName === 'LI') {
            const selected = e.target.dataset.lang;
            selectedLanguage.textContent = getLanguageFullName(selected);
            languageList.style.display = 'none';

            // Adicione integração do idioma aqui

            // Armazene o idioma selecionado em cache
            localStorage.setItem('selectedLanguage', selected);
        }
    });

    // Evento de clique no seletor de idiomas
    selector.addEventListener('click', function (event) {
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

    // Evento de clique em qualquer lugar no documento para ocultar a lista de idiomas
    document.addEventListener('click', function (event) {
        if (!selector.contains(event.target)) {
            languageList.style.display = 'none';
            languageArrow.style.transform = "rotate(180deg)";
            langButtonContent.title = "Tap to edit the language";
        }
    });

    // Configurar o idioma padrão ao carregar a página
    setDefaultLanguage();
    
    // Adicione um evento de clique ao botão de cópia
    var copyButton = document.querySelector('.content_copy_btn');
    copyButton.addEventListener('click', copyToClipboard);

    function ignoreButton(button) {
        var container = button.closest('.container');
        container.style.display = 'none';
        checkAndShowPlaceholder();
    }
    
    var ignoreButtons = document.querySelectorAll('.content_ignore_btn');
    ignoreButtons.forEach(function (button) {
        button.addEventListener('click', function (event) {
            ignoreButton(event.target);
        });
    });

    function fixButton(button) {
        // Add if else para ocultar apenas se a correção for bem sucedida
        var container = button.closest('.container');
        container.style.display = 'none';
        checkAndShowPlaceholder();
    }
    
    var fixButtons = document.querySelectorAll('.content_fix_btn');
    fixButtons.forEach(function (button) {
        button.addEventListener('click', function (event) {
            fixButton(event.target);
        });
    });

    // Função auxiliar para criar um container HTML com base nos dados da API
    function createContainer(containerData) {
        // Content
        const container = document.createElement('div');
        container.classList.add('container');
        container.setAttribute('onclick', 'expandContainer(this)');

        const title = document.createElement('h2');
        title.textContent = containerData.title;

        const content = document.createElement('div');
        content.classList.add('content');

        const contentText = document.createElement('p');
        contentText.classList.add('content_text');
        contentText.textContent = containerData.description;

        const contentOptions = document.createElement('div');
        contentOptions.classList.add('content_options');

        // Learn More
        const contentLearnMore = document.createElement(containerData.learn_more && containerData.learn_more.type === 'url' ? 'a' : 'p');
        contentLearnMore.classList.add('content_learn_more');
        
        if (containerData.learn_more) {
            if (containerData.learn_more.type === 'url') {
                // Se o tipo for URL, adicione o atributo href ao link
                contentLearnMore.href = containerData.learn_more.url;
                contentLearnMore.target = '_blank'; // Abre o link em uma nova guia/janela
                contentLearnMore.textContent = containerData.learn_more.title || 'Saiba Mais';
            } else {
                // Se o tipo não for URL, use o texto como conteúdo do parágrafo
                contentLearnMore.textContent = containerData.learn_more.title || '';
            }
        } else {
            // Se learn_more não estiver presente, adicione uma string vazia como conteúdo
            contentLearnMore.textContent = '';
        }
        
        contentOptions.appendChild(contentLearnMore);


        // Ignore and Fix buttons
        const contentButtons = document.createElement('div');
        contentButtons.classList.add('content_buttons');

        if (containerData.placeholder_text) {
            const placeholderText = document.createElement('p');
            placeholderText.textContent = containerData.placeholder_text;
            contentButtons.appendChild(placeholderText);
        }

        if (containerData.fix_button) {
            const contentFixBtn = document.createElement('div');
            contentFixBtn.classList.add('content_fix_btn');
            contentFixBtn.textContent = 'Fix';
            contentFixBtn.onclick = function() {
                fixButton(container);
            };
            contentButtons.appendChild(contentFixBtn);
        }

        if (containerData.ignore_button) {
            const contentIgnoreBtn = document.createElement('div');
            contentIgnoreBtn.classList.add('content_ignore_btn');
            contentIgnoreBtn.textContent = 'Ignore';
            contentIgnoreBtn.onclick = function() {
                ignoreButton(container);
            };
            contentButtons.appendChild(contentIgnoreBtn);
        }

        contentOptions.appendChild(contentButtons);

        content.appendChild(contentText);
        content.appendChild(contentOptions);

        container.appendChild(title);
        container.appendChild(content);

        return container;
    }

    function copyToClipboard() {
        if (textArea.value.trim() === '') {
            notification("Well... there's no content to be copied here... 🤔");
            return;
        }
    
        textArea.select();
        
        try {
            // Copia o conteúdo para a área de transferência
            var successful = document.execCommand('copy');
            var message = successful ? 'Copied to your clipboard!' : 'Something went wrong, please try again.';
            notification(message);
        } catch (err) {
            console.error('An error occurred while copying the text: ', err);
            notification('An error occurred while copying the text.');
        }
    
        // Deseleciona a textarea
        window.getSelection().removeAllRanges();
    }

    // Função para verificar e exibir a div placeholder
    function checkAndShowPlaceholder() {
        var improvementsContainers = document.getElementById('improvements_containers');

        // Verificar se há containers visíveis
        var visibleContainers = Array.from(improvementsContainers.querySelectorAll('.container')).filter(container => container.style.display !== 'none');

        // Se já houver algum container visível, não faz nada
        if (visibleContainers.length > 0) {
            console.log('> 0');
            return;
        }

        // Create and append the "No issues found" div
        const noIssuesDiv = document.createElement('div');
        noIssuesDiv.className = 'container_no_issues';
        noIssuesDiv.id = 'container_no_issues';
        noIssuesDiv.style.display = 'block';

        const contentDiv = document.createElement('div');
        contentDiv.className = 'content_ok';

        const h2 = document.createElement('h2');
        h2.textContent = 'No issues found! ✨';

        const copyBtn = document.createElement('div');
        copyBtn.className = 'content_copy_btn';
        copyBtn.textContent = 'Copy';
        copyBtn.onclick = copyToClipboard;

        contentDiv.appendChild(h2);
        contentDiv.appendChild(copyBtn);
        noIssuesDiv.appendChild(contentDiv);

        improvementsContainers.appendChild(noIssuesDiv);
    }
    checkAndShowPlaceholder();
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
