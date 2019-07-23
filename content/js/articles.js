// Simple For Now

chrome.extension.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action == "Format Article") {
        sendResponse("5/5");

        let article = document.getElementsByTagName("article")[0];

        if (article != undefined) {
            article.style.width = "100%";
            article.style.height = "auto";
            article.style.padding = "0px";
            article.style.margin = "0px";

            document.body.innerHTML = "";
            document.body.appendChild(article);

            document.body.style.width = "75vw";
            document.body.style.height = "auto";
            document.body.style.margin = "0px auto";
            document.body.style.padding = "0px";
        }
    }
});