import { fetchJSON } from "./functions/api.js";

try {
    const comments = fetchJSON('https://jsonplaceholder.typicode.com/comments?_limit=10')
    comments
} catch (e) {
    alert(e)
}