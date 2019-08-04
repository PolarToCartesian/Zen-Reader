// Testing

function parseArticle(article) {
    let result = {
        title: "",
        source: window.location.hostname,
        description: "",
        author: "",
        date_time: "",
        content: ""
    };

    for (let element of article.getElementsByTagName("*")) {
        for (let className of element.classList) {
            className = className.toLowerCase();

            if (result.title == "" && className.indexOf("title") != -1) {
                if (window.location.hostname == "www.theverge.com" && element.id.indexOf("heading-label") != -1) {
                    continue;
                }

                result.title = element.innerText;
            } else if (result.description == "" && (className.indexOf("desc") != -1 || className.indexOf("summary") != -1)) {
                result.description = element.innerText;
            } else if (result.author == "" && (className.indexOf("author") != -1 || className.indexOf("auteur") != -1 || className.indexOf("writer") != -1)) {
                result.author = element.innerText;
            } else if (result.date_time == "" && (className.indexOf("date") != -1)) {
                result.date_time = element.innerText;
            } else if (result.content == "" && (element.tagName == "MAIN" || className.indexOf("content") != -1)) { // LAST THING TO RESOLVE
                result.content += element.innerHTML;
            }
        }
    }

    return result;
}

async function formatArticle() {
    let storage  = await getStorageItems(["fontSize"]);
    let fontSize = storage.fontSize;

    let article = document.getElementsByTagName("article")[0];

    if (article != undefined) {
        const parsedArticle = parseArticle(article);

        document.head.innerHTML = "<title>" + parsedArticle.title + "</title>";

        document.body.setAttribute("style", "padding: 0px; margin: 0px;");
        document.body.innerHTML = `
            <article style="width: 100%;">
                <header style="width: 100%; float: left; background-color: #212121 !important;">
                    <div style="width: 100%; float: left;">
                        <div style="font-size: ` + fontSize + `px !important; width: 33.33%; float: left; text-align: center;"><a href="`+ parsedArticle.source +`">` + parsedArticle.source + `</a></div>
                        <div style="font-size: ` + fontSize + `px !important; width: 33.33%; float: middle; text-align: center;">` + parsedArticle.author + `</div>
                        <div style="font-size: ` + fontSize + `px !important; width: 33.33%; float: right; text-align: center;">` + parsedArticle.date_time + `</div>
                    </div>
                    <div style="width: 100%; float: left; text-align: center; font-size: ` + (fontSize * 1.5) + `px !important; font-weight: bolder !important;">` + parsedArticle.title + `</div>
                    <div style="border-bottom: 3px solid white; width: 100%; float: left; text-align: center; font-size: ` + (fontSize * 1.25) + `px !important; font-weight: normal !important; color: #ecf0f1 !important;">` + parsedArticle.description + `</div>
                </header>

                <main style="width: 75vw; height: auto; margin: 0px auto; font-size: ` + fontSize * 1.25 + `px !important; text-align: justify !important;">
                    ` + parsedArticle.content + `
                </main>
            </article>
        `;

        for (let element of document.body.getElementsByTagName("main")[0].getElementsByTagName("*")) {
            element.setAttribute("style", "");
            element.setAttribute("class", "");
            element.setAttribute("id", "");
        }

        for (let element of document.querySelectorAll("figure,img,figcaption")) {
            element.style.margin = "0px auto";
            element.style.textAlign = "center";
        }
    }
}

executeOnMessage("Format Article", "5/5", formatArticle);