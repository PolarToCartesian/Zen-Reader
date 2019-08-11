function parseArticle(article) {
    let result = {
        title: "",
        source: window.location.hostname,
        description: "",
        author: "",
        date_time: "",
        content: "",
        icon_url: ""
    };

    for (let element of document.head.getElementsByTagName("*")) {
        if (element.tagName == "LINK") {
            if (element.getAttribute("rel") == "icon" || element.getAttribute("rel") == "shortcut icon") {
                result.icon_url = element.getAttribute("href");
                break;
            }
        }
    }

    for (let element of article.getElementsByTagName("*")) {
        // Can't use "element.className.toLowerCase();" because of svg elements
        // https://developer.mozilla.org/en-US/docs/Web/API/Element/className
        let classNames = element.getAttribute("class");

        if (classNames != null) {
            classNames = classNames.toLowerCase();

            if (result.title == "" && classNames.includes("title")) {
                if (window.location.hostname == "www.theverge.com" && element.id.indexOf("heading-label") != -1) {
                    continue;
                }

                result.title = element.innerText;
            } else if (result.description == "" && (classNames.includes("desc") || classNames.includes("summary"))) {
                result.description = element.innerText;
            } else if (result.author == "" && (classNames.includes("author") || classNames.includes("auteur") || classNames.includes("writer"))) {
                result.author = element.innerText;
            } else if (result.date_time == "" && (classNames.includes("date"))) {
                result.date_time = element.innerText;
            } else if (result.content == "" && (element.tagName == "MAIN" || classNames.includes("content"))) { // LAST THING TO RESOLVE
                result.content += element.innerHTML;
            }
        }
    }

    return result;
}

function getLargestArticle() {
    let largestArticleIndex = -1;
    let largestArticleSize = 0;

    const articles = document.getElementsByTagName("article");

    if (articles.length == 0) return undefined;

    for (let i = 0; i < articles.length; i++) {
        const articleSize = articles[i].innerText.length;

        if (articleSize > largestArticleSize) {
            largestArticleIndex = i;
            largestArticleSize = articleSize;
        }
    }

    return articles[largestArticleIndex];
}

function createWebpage(parsedArticle, fontSize) {
    document.body.setAttribute("style", "padding: 0px; margin: 0px;");
    document.body.innerHTML = `
        <article style="max-width: 900px; margin: 0px auto; margin-top: 100px; margin-bottom: 100px; border: 3px solid white !important;">
            <div style="max-width: 700px; margin: 0px auto; padding-top: 75px; padding-bottom: 75px;">
                    <div style="width: 100%; font-size: 15px !important; overflow: hidden;">
                        <a    style="line-height: 15px; width: 33.33%; float: left; text-align: center !important;" href="${parsedArticle.source}">
                            <img src="${parsedArticle.icon_url}" style="vertical-align: middle;" width="15" height="15">
                            ${parsedArticle.source}
                        </a>
                        <span style="line-height: 15px; width: 33.33%; float: left; text-align: center !important;">${parsedArticle.date_time}</span>
                        <span style="line-height: 15px; width: 33.33%; float: left; text-align: center !important;">${parsedArticle.author}</span>
                    </div>

                    <div style="padding-top: 10px; text-align: justify; font-size: 44px !important; font-weight: bolder;">${parsedArticle.title}</div>

                <div style="font-size: ${fontSize}px !important; text-align: justify; padding-top: 30px;" id="zen-reader-content">${parsedArticle.content}</div>
            </div>
        </article>
    `;

    async function addFiles() {
        document.head.innerHTML = `<title>${parsedArticle.title}</title>`;

        const addCssVariablesJSContents = await readFileInExtension("content_scripts/js/addCssVariables.js");

        eval(addCssVariablesJSContents);

        const addGeneralCssContents = await readFileInExtension("content_scripts/css/general.css");

        document.head.innerHTML += `<style type="text/css">${addGeneralCssContents}</style>`;
    }

    addFiles();
}

function addExtraStylingToWebpage() {
    for (let element of document.getElementById("zen-reader-content").getElementsByTagName("*")) {
        element.setAttribute("id", "");
        element.setAttribute("class", "");

        const baseStyle = "margin: 0px !important; padding: 0px !important; width: 100% !important;";

        if (element.tagName == "FIGURE" || element.tagName == "IFRAME") {
            element.setAttribute("style", `${baseStyle} margin-top: 15px !important; margin-bottom: 15px !important;`);
        } else if (element.tagName == "IMG") {
            element.setAttribute("style", `${baseStyle} height: 100% !important; width: 100%; object-fit: contain; margin-top: 15px !important; margin-bottom: 15px !important;`);
        } else if (element.tagName == "FIGCAPTION") {
            element.setAttribute("style", `${baseStyle} color: rgb(189, 195, 199) !important;`);
        } else {
            element.setAttribute("style", baseStyle);
        }
    }
}

async function formatArticle() {
    let article = getLargestArticle();

    if (article == undefined) return;

    let storage = await getStorageItems(["fontSize"]);
    const fontSize = storage.fontSize;

    createWebpage(parseArticle(article), fontSize);

    addExtraStylingToWebpage();
}

executeOnMessage("Format Article", "5/5", formatArticle);