function createContextMenuItem(params) {
    if (typeof browser != 'undefined') { // Firefox
        browser.contextMenus.create(params);
    } else { // Chromium
        chrome.contextMenus.create(params);
    }
}