/**
 * Intéragit avec une API JSON
 * @param {string} url 
 * @param {RequestInit} options 
 * @returns 
 */
export async function fetchJSON (url, options = {}) {
    const headers = {Accept : "application/json", ...options.headers}
    const r = await fetch (url, {...options, headers})
    if (r.ok) {
        return r.json()
    }
    throw new Error ('Erreur serveur', {cause: r})
}

// Bugs corrected