let currentFontSize = null;

function rgbToHexSingleValue(rgb) {
    let hex = Number(rgb).toString(16);

    if (hex.length < 2) {
        hex = "0" + hex;
    }

    return hex;
};

function rgbToHex(rgb) {
    rgb = rgb.substr(4, rgb.length - 5);

    const r = rgbToHexSingleValue(rgb.split(",")[0]);
    const g = rgbToHexSingleValue(rgb.split(",")[1]);
    const b = rgbToHexSingleValue(rgb.split(",")[2]);

    return "#" + r + g + b;
}

async function updatePopup() {
    const storage = await getStorageItems(["fontSize", "bgColorNavigation", "bgColorContent", "textColor", "linkColor"]);

    currentFontSize = storage.fontSize;

    document.getElementById("fontSizeIndicator").innerHTML = storage.fontSize;
    document.getElementById("bgNavColor").value     = (storage.bgColorNavigation.indexOf("rgb") == -1) ? storage.bgColorNavigation : rgbToHex(storage.bgColorNavigation);
    document.getElementById("bgContentColor").value = (storage.bgColorContent.indexOf("rgb") == -1) ? storage.bgColorContent : rgbToHex(storage.bgColorContent);
    document.getElementById("textColor").value = (storage.textColor.indexOf("rgb") == -1) ? storage.textColor : rgbToHex(storage.textColor);
    document.getElementById("linkColor").value = (storage.linkColor.indexOf("rgb") == -1) ? storage.linkColor : rgbToHex(storage.linkColor);
}

window.addEventListener("load", (event) => {
    updatePopup();

    document.getElementById("fontSizeMinus").addEventListener("click", (event) => { setStorageItem("fontSize", currentFontSize-1); updatePopup(); });
    document.getElementById("fontSizePlus").addEventListener("click",  (event) => { setStorageItem("fontSize", currentFontSize+1); updatePopup(); });

    document.getElementById("bgNavColor").addEventListener("change",     (event) => { event.preventDefault(); setStorageItem("bgColorNavigation", event.target.value); updatePopup(); });
    document.getElementById("bgContentColor").addEventListener("change", (event) => { event.preventDefault(); setStorageItem("bgColorContent", event.target.value); updatePopup(); });
    document.getElementById("textColor").addEventListener("change",      (event) => { event.preventDefault(); setStorageItem("textColor", event.target.value); updatePopup(); });
    document.getElementById("linkColor").addEventListener("change",      (event) => { event.preventDefault(); setStorageItem("linkColor", event.target.value); updatePopup(); });

    document.getElementById("colorReset").addEventListener("click", async (event) => {
        const defaultStorage = await readFileInExtension("other/defaultStorage.json");
        const parsedDefaultStorage = JSON.parse(defaultStorage);

        setStorageItems({
            "bgColorNavigation": parsedDefaultStorage.bgColorNavigation,
            "bgColorContent": parsedDefaultStorage.bgColorContent,
            "textColor": parsedDefaultStorage.textColor,
            "linkColor": parsedDefaultStorage.linkColor
        });

        updatePopup();
    });
});