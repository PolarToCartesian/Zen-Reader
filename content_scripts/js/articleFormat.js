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

        document.body.setAttribute("style", "padding: 0px; margin: 0px; background-color: #171717 !important;");
        document.body.innerHTML = `
            <article style="max-width: 900px; margin: 0px auto; margin-top: 100px; background-color: #272727 !important;">
                <div style="max-width: 700px; margin: 0px auto; padding-top: 75px;">
                    <div style="width: 100%; font-size: 15px !important; overflow: hidden;">
                        <a    style="line-height: 20px; width: 33.33%; float: left; text-align: center !important;" href="` + parsedArticle.source + `">` + parsedArticle.source + `</a>
                        <span style="line-height: 20px; width: 33.33%; float: left; text-align: center !important;">` + parsedArticle.date_time + `</span>
                        <span style="line-height: 20px; width: 33.33%; float: left; text-align: center !important;">` + parsedArticle.author + `</span>
                    </div>

                    <div style="padding-top: 10px; text-align: justify; font-size: 44px !important; color: white; font-weight: bolder;">` + parsedArticle.title + `</div>
                
                    <div style="font-size: ` + fontSize + `px !important; text-align: justify;" id="content">` + parsedArticle.content + `</div>
                </div>
            </article>
        `;

        if (document.body.getElementsByTagName("main").length > 0) {
            for (let element of document.body.getElementsByTagName("main")[0].getElementsByTagName("*")) {
                element.setAttribute("style", "");
                element.setAttribute("class", "");
                element.setAttribute("id", "");
            }
        }

        for (let element of document.querySelectorAll("figure,img,figcaption")) {
            element.style.margin = "0px auto";
            element.style.textAlign = "center";
        }

        for (let element of document.getElementById("content").getElementsByTagName("*")) {
            element.setAttribute("style", "margin: 0px !important; padding: 0px !important;");
        }
    }
}

executeOnMessage("Format Article", "5/5", formatArticle);