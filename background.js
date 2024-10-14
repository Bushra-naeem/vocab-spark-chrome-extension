chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "fetchWord") {
        fetchRandomWord().then(sendResponse);
        return true; 
    }
});

async function fetchRandomWord() {
    try {
        // Fetch a random word
        const wordResponse = await fetch("https://random-word-api.herokuapp.com/word?number=1");
        const wordData = await wordResponse.json();
        const word = wordData[0];

        // Fetch meaning from the Dictionary API
        const meaningResponse = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        const meaningData = await meaningResponse.json();

        // Check if meaning data exists
        if (meaningData.length > 0 && meaningData[0].meanings && meaningData[0].meanings.length > 0) {
            const meaning = meaningData[0].meanings[0].definitions[0].definition;
            return { word, meaning };
        } else {
            // If no meaning is found, return a default message
            return { word, meaning: "Meaning not found." };
        }
    } catch (error) {
        console.error("Error fetching word:", error);
        return { word: "Error", meaning: "Could not fetch a word." };
    }
}
