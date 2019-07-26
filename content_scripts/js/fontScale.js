window.addEventListener("load", (event) => {
    chrome.storage.sync.get(["fontSize"], (storage) => {
        document.body.style.fontSize = storage.fontSize + "px";
    });
});