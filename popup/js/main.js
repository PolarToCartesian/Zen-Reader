let currentFontSize = null;

async function updatePopup() {
    const storage = await getStorageItems(["fontSize"]);

    currentFontSize = storage.fontSize;

    document.getElementById("fontSizeIndicator").innerHTML = storage.fontSize;
}

window.addEventListener("load", (event) => {
    updatePopup();

    document.getElementById("fontSizeMinus").addEventListener("click", (event) => { setStorageItem("fontSize", currentFontSize-1); updatePopup(); });
    document.getElementById("fontSizePlus").addEventListener("click",  (event) => { setStorageItem("fontSize", currentFontSize+1); updatePopup(); });
});