import { fetchJSON } from "./functions/api.js";
import { cloneTemplate } from "./functions/dom.js";

try {
    const comments = fetchJSON('https://jsonplaceholder.typicode.com/comments?_limit=10')
    comments
} catch (e) {
    alert(e)
}

const target = document.querySelector('.spinner-border')

/**
 * @returns {NodeList}
 */
const loadMore = function () {
    document.querySelector('.spinner-border').before(cloneTemplate('comment'))
}

const options = {
    root : null,
    rootMargin : "0px",
    threshold: 1.0
}

const observer = new IntersectionObserver (loadMore, options)

observer.observe(target)