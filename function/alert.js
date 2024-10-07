/**
 * Renvoie un élément  HTML représentant une alerte
 * @param {string} message
 * @returns {HTMLElement} 
 */
export function alertElement(message) {
    const el = document.querySelector('#alert').content.firstElementChild.cloneNode(true)
    el.querySelector('.js-text').innerText = message
    el.querySelector('button').addEventListener('click', e => {
        e.preventDefault()
        el.remove()
    })
    return el
}