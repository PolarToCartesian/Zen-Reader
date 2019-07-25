const storage = browser.storage.local.get();
    
storage.then((storedSettings) => {
    if (!storedSettings.fontSize) {
        browser.storage.local.set({"fontSize": 10});
    }
}, (err) => {console.error(err);});