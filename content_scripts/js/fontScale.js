async function fontScale() {
    const storage = await getStorageItems(["fontSize"]);

    document.body.style.fontSize = storage.fontSize + "px";
}

window.addEventListener("load", fontScale);
execOnStorageValueChange("fontSize", fontScale);