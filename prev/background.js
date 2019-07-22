function getStorage(keys) {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(keys, (result) => {
            resolve(result);
        });
    });
}

function setStorage(key, value) { chrome.storage.sync.set({[key]: value}); }

const defaultStorage = {
    "language": "en",
    "isActive": true, 
    "textSizeFactor": 1
};

chrome.storage.sync.set(defaultStorage);

// Right Click On Page

chrome.contextMenus.create({
    "id": "On/Off",
    "title": "On/Off",
    "contexts": ["page"],
});

chrome.contextMenus.create({
    "id": "Format Article",
    "title": "Article",
    "contexts": ["page"]
});

chrome.contextMenus.onClicked.addListener(async (data) => {
    switch (data.menuItemId) {
        case "On/Off":
            const storage = await getStorage(["isActive"]);
        
            setStorage("isActive", !storage.isActive);
            break;
        case "Format Article":
            chrome.tabs.query({
                    active: true,
                    currentWindow: true
                }, (tabs) => {
                    chrome.tabs.sendMessage(tabs[0].id, { action: "Format Article"}, 
                                            (response) => {})
                });
            break;
    }
});