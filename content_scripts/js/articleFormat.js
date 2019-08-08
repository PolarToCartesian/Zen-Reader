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
    document.head.innerHTML = `<title>${parsedArticle.title}</title>`;

    document.body.setAttribute("style", "padding: 0px; margin: 0px; background-color: #171717 !important;");
    document.body.innerHTML = `
        <article style="max-width: 900px; margin: 0px auto; margin-top: 100px; margin-bottom: 100px; background-color: #272727 !important;">
            <div style="max-width: 700px; margin: 0px auto; padding-top: 75px; padding-bottom: 75px;">
                <div style="width: 100%; font-size: 15px !important; overflow: hidden;">
                    <a    style="line-height: 20px; width: 33.33%; float: left; text-align: center !important;" href="${parsedArticle.source}">${parsedArticle.source}</a>
                    <span style="line-height: 20px; width: 33.33%; float: left; text-align: center !important;">${parsedArticle.date_time}</span>
                    <span style="line-height: 20px; width: 33.33%; float: left; text-align: center !important;">${parsedArticle.author}</span>
                </div>

                <div style="padding-top: 10px; text-align: justify; font-size: 44px !important; color: white; font-weight: bolder;">${parsedArticle.title}</div>
                
                <div style="font-size: ${fontSize}px !important; text-align: justify; padding-top: 30px;" id="zen-reader-content">${parsedArticle.content}</div>
            </div>
        </article>
    `;
}

function addExtraStylingToWebpage() {
    for (let element of document.getElementById("zen-reader-content").getElementsByTagName("*")) {
        element.setAttribute("id", "");
        element.setAttribute("class", "");

        const baseStyle = "margin: 0px !important; padding: 0px !important; width: 100% !important;";

        if (element.tagName == "FIGURE" || element.tagName == "IFRAME") {
            element.setAttribute("style", `${baseStyle} margin-top: 15px !important; margin-bottom: 15px !important;`);
        } else if (element.tagName == "IMG") {
            const oldImageWidth = element.width, oldImageHeight = element.height;
            
            element.setAttribute("style", `${baseStyle} margin-top: 15px !important; margin-bottom: 15px !important;`);

            // Scale The Image
            const newImageWidth  = element.width;
            const newImageHeight = (newImageWidth * oldImageHeight) / oldImageWidth;

            element.setAttribute("style", `${baseStyle} height: ${newImageHeight}px !important; margin-top: 15px !important; margin-bottom: 15px !important;`);
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