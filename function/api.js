/**
 * Intéragit avec une API JSON
 * @param {string} url 
 * @param {RequestInit & {json?: object}} options 
 * @returns 
 */
export async function fetchJSON (url, options = {}) {
    const headers = {Accept : "application/json", ...options.headers}
    if (options.json) {
        options.body = JSON.stringify(options.json)
        headers['Content-Type'] = 'application/json'
    }
    const r = await fetch (url, {...options, headers})
    if (r.ok) {
        return r.json()
    }
    throw new Error ('Erreur serveur', {cause: r})
}

// Bugs corrected