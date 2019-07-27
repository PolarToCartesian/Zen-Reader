// Simple For Now

function formatArticle() {
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

executeOnMessage("Format Article", "5/5", formatArticle);