chrome.storage.sync.get(["fontSize"], (result) => {
    document.body.style.fontSize = result.fontSize + "px";
});