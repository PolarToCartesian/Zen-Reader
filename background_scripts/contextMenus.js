chrome.contextMenus.create({
    "id": "Format Article",
    "title": "Format Article",
    "contexts": ["page"]
});

chrome.contextMenus.onClicked.addListener(async (data) => {
    if (data.menuItemId == "Format Article") {
        chrome.tabs.query({active: true, currentWindow: true}, 
                          (tabs) => {
                            chrome.tabs.sendMessage(tabs[0].id, { action: "Format Article"}, 
                                                    (response) => {})
                          });
    }
});