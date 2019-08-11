async function setDefaultStorage() {
    if(await getStorageItems(["fontSize"]).fontSize == undefined) {
        const defaultStorage = await readFileInExtension("other/defaultStorage.json");
        const parsedDefaultStorage = JSON.parse(defaultStorage);

        setStorageItems(parsedDefaultStorage);
    } 
}

setDefaultStorage();