chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "fetchWord") {
        fetchRandomWord().then(sendResponse);
        return true;  
    }
});

async function fetchRandomWord() {
    try {
        const wordResponse = await fetch("https://random-word-api.herokuapp.com/word?number=1");
        const wordData = await wordResponse.json();
        const word = wordData[0];

        const meaningResponse = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        const meaningData = await meaningResponse.json();

        if (meaningData.length > 0 && meaningData[0].meanings.length > 0) {
            const meaning = meaningData[0].meanings[0].definitions[0].definition;
            return { word, meaning };
        } else {
            return { word, meaning: "Meaning not found." };
        }
    } catch (error) {
        console.error("Error fetching word:", error);
        return { word: "Error", meaning: "Could not fetch a word." };
    }
}

