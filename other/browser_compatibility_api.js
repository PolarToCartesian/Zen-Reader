const firefox  = (typeof browser != "undefined");
const chromium = !firefox;

let extension_api = firefox ? browser : chrome;

function createContextMenuItem(params) {
    extension_api.contextMenus.create(params);
}

function execWhenContextMenuItemIsClicked(contextMenuItemId, callback) {
    extension_api.contextMenus.onClicked.addListener((data) => {
        if (data.menuItemId == contextMenuItemId) {
            callback();
        }
    });
}

function sendMessageToCurrentTab(message) {
    if (firefox) {
        browser.tabs.query({
            currentWindow: true,
            active: true
        }).then((tabs) => {
            for (let tab of tabs) {
                browser.tabs.sendMessage(
                  tab.id,
                  {greeting: message}
                ).then(response => {}).catch((error) => {console.error(`Error: ${error}`);});
              }
        }).catch((error) => {console.error(error);});
    } else { // Chromium
        chrome.tabs.query({active: true, currentWindow: true}, 
            (tabs) => {
              chrome.tabs.sendMessage(tabs[0].id, { action: message}, 
                                      (response) => {})
            });
    }
}

function executeOnMessage(message_to_exec_on, response, callback) {
    if (firefox) {
        browser.runtime.onMessage.addListener(request => {
            if (request.greeting == message_to_exec_on) {
                callback();
            }
            
            return Promise.resolve({response: response});
        });
    } else { // Chromium
        chrome.extension.onMessage.addListener((message, sender, sendResponse) => {
            if (message.action == message_to_exec_on) {
                callback();
            }
            sendResponse(response);
        });
    }
}

function getStorageItems(keys) {
    return new Promise((resolve, reject) => {        
        extension_api.storage.sync.get(keys, (storage) => {
            resolve(storage);
        });
    });
}

function setStorageItems(keyValuePairs) {
    extension_api.storage.sync.set(keyValuePairs);
}

function setStorageItem(key, value) {
    setStorageItems({ [key]: value });
}

function execOnStorageValueChange(key, callback) {
    extension_api.storage.onChanged.addListener((changes, namespace) => {
        const index = Object.keys(changes).findIndex((testKey) => { return testKey == key; });

        if (index != -1) {
            callback(changes[key]);
        }
    });
}

function openTab(url) {
    extension_api.tabs.create({url: url}, (tab) => { return tab; });
}

function execOnInstall(callback) {
    extension_api.runtime.onInstalled.addListener((event) => {
        callback();
    });
}

function getUrlOfFileInExtension(path) {
    return extension_api.runtime.getURL(path);
}

function readFileInExtension(path) {
    const url = getUrlOfFileInExtension(path);

    return new Promise((resolve, reject) => {
        fetch(url)
            .then((response) => { 
                if (response.status == 200) return response.text();

                reject(response.statusText);
            })
            .then((fileContents) => { resolve(fileContents); });
    });
}