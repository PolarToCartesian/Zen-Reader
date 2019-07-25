console.log("A");

window.addEventListener("load", (event) => {
    const storage = browser.storage.local.get();
    
    console.log("B");

    storage.then((storedSettings) => {
        document.body.style.fontSize = storedSettings.fontSize + "px";
    }, (err) => {console.error(err);});
});