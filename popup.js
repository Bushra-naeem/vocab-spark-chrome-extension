document.addEventListener('DOMContentLoaded', function () {
    const wordElement = document.getElementById('word');
    const meaningElement = document.getElementById('meaning');
    const previousWordsElement = document.getElementById('previousWords');
    const newWordButton = document.getElementById('newWordButton');
    const pronounceButton = document.getElementById('pronounceButton');
    let previousWords = [];

    loadPreviousWords();

    // Fetch a new word when the "Get New Word" button is clicked
    newWordButton.addEventListener('click', async function () {
        const response = await fetchWord();
        const { word, meaning } = response;

        wordElement.textContent = word;
        meaningElement.textContent = meaning;

        // Add the word to the viewed words list
        if (!previousWords.includes(word)) {
            previousWords.push(word);
            savePreviousWords();
            const li = document.createElement('li');
            li.textContent = word;
            previousWordsElement.appendChild(li);
        }

        // Show pronunciation button and set its visibility to visible
        pronounceButton.classList.remove('hidden');
        pronounceButton.onclick = function () {
            pronounceWord(word);
        };
    });    

    async function fetchWord() {
        try {
            const wordResponse = await fetch("https://random-word-api.herokuapp.com/word?number=1");
            const wordData = await wordResponse.json();
            const word = wordData[0];

            const meaningResponse = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
            const meaningData = await meaningResponse.json();

            // Check if the API response has the meanings and definitions
            if (meaningData && Array.isArray(meaningData) && meaningData[0].meanings && meaningData[0].meanings[0].definitions) {
                const meaning = meaningData[0].meanings[0].definitions[0].definition;
                return { word, meaning };
            } else {
                // Fallback if no meaning is found
                return { word, meaning: "Definition not available." };
            }

        } catch (error) {
            console.error("Error fetching word:", error);
            return { word: "Error", meaning: "Could not fetch a word." };
        }
    }

    // to pronounce the word using Web Speech API
    function pronounceWord(word) {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(word);
        synth.speak(utterance);
    }

    // Load previous words from Chrome storage
    function loadPreviousWords() {
        chrome.storage.sync.get('previousWords', function (data) {
            if (data.previousWords) {
                previousWords = data.previousWords;
                previousWords.forEach(function (word) {
                    const li = document.createElement('li');
                    li.textContent = word;
                    previousWordsElement.appendChild(li);
                });
            }
        });
    }

    // Save previous words to Chrome storage
    function savePreviousWords() {
        chrome.storage.sync.set({ previousWords: previousWords }, function () {
            console.log("Previous words saved:", previousWords);
        });
    }
});




