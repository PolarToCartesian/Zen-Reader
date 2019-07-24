function getStorage(keys) {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(keys, (result) => {
            resolve(result);
        });
    });
}

function setStorage(key, value) { chrome.storage.sync.set({[key]: value}); }

let currentFontSize = null;

async function updatePopup() {
    const storage = await getStorage(["fontSize"]);

    currentFontSize = storage.fontSize;

    document.getElementById("fontSizeIndicator").innerHTML = storage.fontSize;
}

window.addEventListener("load", (event) => {
    updatePopup();

    document.getElementById("fontSizeMinus").addEventListener("click", (event) => { setStorage("fontSize", currentFontSize-1); updatePopup(); });
    document.getElementById("fontSizePlus").addEventListener("click",  (event) => { setStorage("fontSize", currentFontSize+1); updatePopup(); });
});