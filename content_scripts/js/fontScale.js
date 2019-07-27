window.addEventListener("load", async (event) => {
    const storage = await getStorageItems(["fontSize"]);
    document.body.style.fontSize = storage.fontSize + "px";
});