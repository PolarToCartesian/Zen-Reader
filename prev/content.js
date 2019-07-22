const colors = {
    "nav/header": "#212121",
    "textInputs": "white",
    "content":    "rgb(50, 50, 50)"
}

function getStorage(keys) {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(keys, (result) => {
            resolve(result);
        });
    });
}

function getElementInfo(element) {
    let tagName = element.tagName, style = element.style;

    let is = {
        "image":       tagName == "IMG"   || style.backgroundImage != "", "link":           tagName == "A",
        "textInput":   tagName == "INPUT" && element.type != "submit",    "buttonOrSubmit": tagName == "BUTTON" || element.type == "submit",
        "navOrHeader": tagName == "NAV"   || tagName == "HEADER",        
       
        "inLink": false, "inNavOrHeader": false,
    };

    // Website Specific

    // ...

    // Keep Track Of Parent Nodes

    let parentElement = element.parentNode;

    while (parentElement != undefined) {
        const parentTagName = parentElement.tagName;

        // General

        if (parentTagName == "A") { is.inLink = true; }
        else if (parentTagName == "NAV" || parentTagName == "HEADER") { is.inNavOrHeader = true; }

        // Website Specific
        if (window.location.href.startsWith("https://www.google.")) {        
            if (window.location.href.includes("search")) {
                if ((parentElement.id == "searchform" && parentElement.classList.length == 2) || parentElement.id == "hdtb") is.inNavOrHeader = true;
            }
        } else if (window.location.href.startsWith("https://www.youtube.com")) {
            if (parentElement.id == "contentContainer" || parentElement.id == "masthead-container") is.inNavOrHeader = true;
        }

        if (is.inLink && is.inNavOrHeader) break;

        parentElement = parentElement.parentNode;
    }

    return is;
}

function setBackgroundColor(is, style) {
    let backgroundColor = "";

    if (!is.image && !is.link && !is.buttonOrSubmit && !is.inLink) {
        backgroundColor = colors.content;
            
        if (is.textInput) { backgroundColor = colors.textInputs; }
        else if (is.navOrHeader || is.inNavOrHeader) { backgroundColor = colors["nav/header"]; } 
    }

    style.background      = "";
    style.backgroundColor = backgroundColor;
}

function setTextColor(is, style) {
    let textColor = "black";

    if (!is.textInput) {
        if      (is.link || is.inLink)                     { textColor = "yellow"; } 
        else if (!is.buttonOrSubmit && !is.buttonOrSubmit) { textColor = "white";  }
    }

    style.color = textColor;
}

function setFontSize(element, textSizeFactor) {
    const prevComputedStyle = window.getComputedStyle(element, null);
   
    const prevFontSize = parseFloat(prevComputedStyle.getPropertyValue('font-size'));
    const newFontSize  = prevFontSize * textSizeFactor + "px";

    element.style.fontSize = newFontSize;
}

function setWebsiteSpecificStyling(element, is, style) {
    if (window.location.href.startsWith("https://www.google.")) {
        if (element.classList[0] == "RNNXgb") {
            style.border = "none";
        } else if (element.tagName == "INPUT" && element.type == "text") {
            style.borderRadius = "20px";
            style.textIndent = "7px";
        }

        if (window.location.href.includes("search")) {
            if (element.classList[0] == "gb_z" && element.classList[1] == "gb_pc") { style.backgroundColor = "#FFFFFF"; }
            else if (element.classList[0] == "gb_F" && element.classList[1] == "gb_9f") { style.backgroundColor = colors["nav/header"]; }
        } else {

        }
    }
}

async function run() {
    let storage = await getStorage(["isActive", "textSizeFactor"]);

    if (!storage.isActive) return;

    for (let element of document.getElementsByTagName("*")) {
        const is = getElementInfo(element);
        
        setBackgroundColor(is, element.style);

        setTextColor(is, element.style);
        
        setFontSize(element, storage.textSizeFactor);

        setWebsiteSpecificStyling(element, is, element.style);
    }
}

window.addEventListener("load", run);

// Format Article

chrome.extension.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action == "Format Article") {
        sendResponse("5/5");

        let article = document.getElementsByTagName("article")[0];

        if (article != undefined) {
        }
    }
});