function getStorageItems(keys) {
    return new Promise((resolve, reject) => {
        if (typeof browser != 'undefined') { // Firefox
            browser.storage.sync.get(keys, (storage) => {
                resolve(storage);
            });
        } else { // Chrome
            chrome.storage.sync.get(keys, (storage) => {
                resolve(storage);
            });
        }
    });
}

function setStorageItems(keyValuePairs) {
    if (typeof browser != 'undefined') { // Firefox
        browser.storage.sync.set(keyValuePairs);
    } else { // Chrome
        chrome.storage.sync.set(keyValuePairs);
    }
}

function setStorageItem(key, value) {
    setStorageItems({ [key]: value });
}