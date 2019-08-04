const firefox  = (typeof browser != "undefined");
const chromium = !firefox;

let extension_api = firefox ? browser : chrome;

function createContextMenuItem(params) {
    extension_api.contextMenus.create(params);
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