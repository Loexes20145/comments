import { fetchJSON } from "./function/api.js"
import { alertElement } from "./function/alert.js"

class InfinitePagination {

    /** @type {string} */
    #endpoint
    /** @type {HTMLTemplateElement} */
    #template
    /** @type {HTMLElement} */
    #target
    /** @type {HTMLElement} */
    #loader
    /** @type {object} */
    #elements
    /** @type {IntersectionObserver} */
    #observer
    /** @type {boolean} */
    #loading = false
    /** @type {number} */
    #page = 1

    /**
     * 
     * @param {HTMLElement} element 
     */
    constructor (element) {
        this.#loader = element
        this.#endpoint = element.dataset.endpoint
        this.#template = document.querySelector(element.dataset.template)
        this.#target = document.querySelector(element.dataset.target)
        this.#elements = JSON.parse(element.dataset.elements)
        this.#observer = new IntersectionObserver((entries) => {
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    this.#loadMore()
                }
            }
        })
    this.#observer.observe(element)
    }

    async #loadMore() {
        if (this.#loading) {
            return
        }
            this.#loading = true
        try {
            const url = new URL(this.#endpoint)
            url.searchParams.set('_page', this.#page)

            const comments = await fetchJSON(url.toString())
            if (/*comments.length === 0*/ this.#page === 3) {
                this.#observer.disconnect()
                this.#loader.remove()
                return
            }
            for (const comment of comments) {
                const commentElement= this.#template.content.cloneNode(true)
                for (const [key, selector] of Object.entries(this.#elements)) {
                    commentElement.querySelector(selector).innerText = comment[key]
                    console.log({key, selector})
                }
                this.#target.append(commentElement)
            }
            this.#page++
            this.#loading = false
        } catch (e) {
            this.#loader.style.display = 'none'
            const error = alertElement('Impossible de charger les contenus')
            error.addEventListener('close', () => {
                this.#loader.style.removeProperty('display')
                this.#loading = false
            })
            this.#target.append(error)
        }
    }
}

class FetchForm {

    /** @type {string} */
    #endpoint
    /** @type {HTMLTemplateElement} */
    #template
    /** @type {HTMLElement} */
    #target
    /** @type {HTMLElement} */
    #loader
    /** @type {object} */
    #elements

    /**
     * 
     * @param {HTMLFormElement} form 
     */
    constructor (form) {
        form.addEventListener('submit', e => {
            e.preventDefault()
            this.#submitForm(e.currentTarget)
        })
    }

    /**
     * 
     * @param {HTMLFormElement} form 
     */
    async #submitForm (form) {
        this.#loader = form
        this.#endpoint = form.dataset.endpoint
        this.#template = document.querySelector(form.dataset.template)
        this.#target = document.querySelector(form.dataset.target)
        this.#elements = JSON.parse(form.dataset.elements)
        const button = form.querySelector('button')
        button.setAttribute('disabled', '')
        try {
            const data = new FormData(form)
            const comment = await fetchJSON(this.#endpoint, {
                method: 'POST',
                json: Object.fromEntries(data)
            })


            const commentElement= this.#template.content.cloneNode(true)
            for (const [key, selector] of Object.entries(this.#elements)) {
                commentElement.querySelector(selector).innerText = comment[key]
                console.log({key, selector})
            }
            this.#target.prepend(commentElement)

            form.reset()
            button.removeAttribute('disabled')
            form.insertAdjacentElement(
                'beforebegin',
                alertElement('Merci pour votre commentaire', 'success')
            )
        } catch (e) {
            const errorElement = alertElement('Erreur serveur')

            form.insertAdjacentElement(
                'beforebegin',
                errorElement
            )
            errorElement.addEventListener('close', () => {
                button.removeAttribute('disabled')
            })
        }
    }
}

document
    .querySelectorAll('.js-infinite-pagination')
    .forEach(el => new InfinitePagination(el))

document
    .querySelectorAll('.js-form-fetch')
    .forEach(form => new FetchForm(form))