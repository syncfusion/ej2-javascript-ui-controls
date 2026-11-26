/**
 * Owns the accessible live region used by the Workflow Designer.
 *
 * @private
 */
export class AriaLive {
    private readonly element: HTMLDivElement;
    private pending: number = 0;

    /**
     * Creates and appends an off-screen polite live region.
     *
     * @param {HTMLElement} host The component host that owns the live region.
     * @private
     */
    public constructor(host: HTMLElement) {
        this.element = document.createElement('div');
        this.element.className = 'e-wf-aria-live';
        this.element.setAttribute('aria-live', 'polite');
        this.element.setAttribute('aria-atomic', 'true');
        host.appendChild(this.element);
    }

    /**
     * Announces a message to assistive technology.
     *
     * @param {string} message The message to announce.
     * @returns {void}
     * @private
     */
    public announce(message: string): void {
        // Clear first so the same message announced twice in a row is still read out.
        this.element.textContent = '';
        window.clearTimeout(this.pending);
        this.pending = window.setTimeout(() => {
            this.element.textContent = message;
        }, 50);
    }

    /**
     * Removes the owned live region.
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
        window.clearTimeout(this.pending);
        this.element.remove();
    }
}
