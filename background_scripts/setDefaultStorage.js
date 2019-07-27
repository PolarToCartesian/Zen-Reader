async function setDefaultStorage() {
    if(await getStorageItems(["fontSize"]).fontSize == undefined) {
        setStorageItem("fontSize", 19);
    }
}

setDefaultStorage();