async function addCssVariables() {
    let var_css = document.createElement("style");
    var_css.id  = "zen-reader_css_variables";

    const storage = await getStorageItems(["fontSize", "bgColorNavigation", "bgColorContent", "textColor", "linkColor"]);
    
    var_css.innerHTML = `
        :root {
            --bg-color-navigation: ${storage.bgColorNavigation};
            --bg-color-content: ${storage.bgColorContent};
            --text-color: ${storage.textColor};
            --link-color: ${storage.linkColor};
        }`;
    
    if (document.getElementById("zen-reader_css_variables")) {
        document.getElementById("zen-reader_css_variables").innerHTML = var_css.innerHTML;
    } else {
        document.head.insertBefore(var_css, document.head.getElementsByTagName("*")[0]);
    }
}

addCssVariables();
execOnStorageValueChange("bgColorNavigation", addCssVariables);
execOnStorageValueChange("bgColorContent", addCssVariables);
execOnStorageValueChange("textColor", addCssVariables);
execOnStorageValueChange("linkColor", addCssVariables);