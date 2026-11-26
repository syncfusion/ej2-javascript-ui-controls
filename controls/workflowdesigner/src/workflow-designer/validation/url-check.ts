/**
 * Shared URL checks for steps that call out over HTTP.
 *
 * @private
 */

/**
 * Whether a URL is an absolute `http://` or `https://` URL. Other schemes (`javascript:`, `file:`,
 * `data:` and so on) are rejected so a workflow cannot send a request anywhere else.
 *
 * @param {string} url - The URL to check.
 * @returns {boolean} `true` when the URL can be requested.
 * @private
 */
export function isHttpUrl(url: string): boolean {
    const lowered: string = String(url || '').trim().toLowerCase();
    return /^https?:\/\/[^\s/?#]+/.test(lowered);
}
