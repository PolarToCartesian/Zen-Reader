function getStorage(keys) {
    return new Promise((resolve, reject) => {
        const storage = browser.storage.local.get();

        storage.then((storedSettings) => {
            let result = {};

            for (let key of keys) {
                result[key] = storedSettings[key];
            }

            resolve(result);
        }, (error) => { reject(error); });
    });
}

function setStorage(key, value) {
    browser.storage.local.set({[key]: value});
}

let currentFontSize = null;

async function updatePopup() {
    const storage = await getStorage(["fontSize"]);

    console.log(storage);

    currentFontSize = storage.fontSize;

    document.getElementById("fontSizeIndicator").innerHTML = storage.fontSize;
}

window.addEventListener("load", (event) => {
    updatePopup();

    document.getElementById("fontSizeMinus").addEventListener("click", (event) => { setStorage("fontSize", currentFontSize-1); updatePopup(); });
    document.getElementById("fontSizePlus").addEventListener("click",  (event) => { setStorage("fontSize", currentFontSize+1); updatePopup(); });
});