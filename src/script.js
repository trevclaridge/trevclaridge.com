const addWritOfRulersDownloadLink = async () => {
    let url = "https://api.github.com/repos/trevclaridge/Writ-of-Rulers/releases/latest";

    const response = await fetch(url);
    const myJson = await response.json();

    const link = myJson["assets"][0]["browser_download_url"];
    const element = document.getElementById("writ-of-rulers-download");
    element.href = link;
}

// if a list element is shorter than 70 characters, we shrink the margin by giving it an additional class
const fixListElementSpacing = () => {
    var elements = document.getElementsByTagName('li')
    for (var i = 0; i < elements.length; i++) {
        if (elements[i].textContent.length < 70) {
            elements[i].classList.add("article-content-list")
        }
    }
}

let path = window.location.pathname;
if (path == '/writ/') {
    addWritOfRulersDownloadLink();
}
else if (path.includes("/posts/")) {
    fixListElementSpacing();
}

