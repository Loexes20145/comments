/**
 * 
 * @param {string} id 
 * @returns {DocumentFragment}
 */
export function cloneTemplate (id) {
    return document.getElementById(id).content.cloneNode(true)
}