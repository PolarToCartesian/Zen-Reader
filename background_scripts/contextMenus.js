createContextMenuItem({
    "id": "Format Article",
    "title": "Format Article",
    "contexts": ["page"]
});

chrome.contextMenus.onClicked.addListener(async (data) => {
    if (data.menuItemId == "Format Article") {
        sendMessageToCurrentTab("Format Article");
    }
});