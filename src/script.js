// if a list element is shorter than 70 characters, we shrink the margin by giving it an additional class
var elements = document.getElementsByTagName('li')
for (var i = 0; i < elements.length; i++) {
    if (elements[i].textContent.length < 70) {
        elements[i].classList.add("article-content-list")
    }
}