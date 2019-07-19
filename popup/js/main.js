function getStorage(keys) {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(keys, (result) => {
            resolve(result);
        });
    });
}

function setStorage(key, value) { chrome.storage.sync.set({[key]: value}); }

async function updatePopup() {
    const storage = await getStorage(["language", "isActive"]);

    // Set Language selection background color

    for (let element of document.getElementsByClassName("en-fr")) { 
        element.style.backgroundColor = ""; 
    }

    document.getElementById(storage["language"]).style.backgroundColor = "green";

    // On-Off

    document.getElementById("on-off").innerHTML = (storage.isActive == true ? (storage["language"] == "en" ? "Desactivate" : "Désactiver") : (storage["language"] == "en" ? "Activate" : "Activer"));
    document.getElementById("on-off").style.backgroundColor = (storage.isActive == true ? "red" : "green");
}

window.addEventListener("load", (event) => {
    updatePopup();

    // Set Event Listeners

    document.getElementById("en").addEventListener("click", () => {setStorage("language", "en"); updatePopup();});
    document.getElementById("fr").addEventListener("click", () => {setStorage("language", "fr"); updatePopup();});
    document.getElementById("on-off").addEventListener("click", async () => {
        const storage = await getStorage(["isActive"]);
        
        setStorage("isActive", !storage.isActive);
        updatePopup();
    });
});