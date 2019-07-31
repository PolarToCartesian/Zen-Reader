// Testing

function formatArticle() {
    let article = document.getElementsByTagName("article")[0];

    let title       = document.createElement("div");
    title.style.backgroundColor = "black";
    title.style.textAlign = "center";
    title.style.fontWeight = "bolder";
    let description = null;
    let category    = null;
    let author      = null;
    let content     = null;
    let date_time   = null;

    for (let element of article.getElementsByTagName("*")) {
        for (let className of element.classList) {
            className = className.toLowerCase();

            if (title == null && className.indexOf("title") != -1) {
                title.innerHTML = element.innerText;
            }
        }
    }

    document.body.innerHTML = "";
    document.body.style.margin = "0px auto";
    document.body.style.padding = "0px";
    document.body.style.width = "75vw";
    document.body.style.height = "auto";
    document.body.style.borderLeft = "3px solid white";
    document.body.style.borderRight = "3px solid white";

    document.body.appendChild(title);
}

executeOnMessage("Format Article", "5/5", formatArticle);