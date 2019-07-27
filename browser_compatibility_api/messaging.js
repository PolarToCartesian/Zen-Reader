function sendMessageToCurrentTab(message) {
    if (typeof browser != 'undefined') { // Firefox
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
        }).catch(onError);
    } else { // Chromium
        chrome.tabs.query({active: true, currentWindow: true}, 
            (tabs) => {
              chrome.tabs.sendMessage(tabs[0].id, { action: message}, 
                                      (response) => {})
            });
    }
}

function executeOnMessage(message_to_exec_on, response, callback) {
    if (typeof browser != 'undefined') { // Firefox
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