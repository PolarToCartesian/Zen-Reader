chrome.storage.sync.get(["fontSize"], (storage) => {
    if (!storage.fontSize) {
        chrome.storage.sync.set({ "fontSize": 19 });
    }
});