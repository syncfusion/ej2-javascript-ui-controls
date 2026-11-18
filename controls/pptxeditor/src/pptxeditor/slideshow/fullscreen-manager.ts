/**
 * Cross-browser Fullscreen API wrapper for the slideshow.
 *
 * @module @syncfusion/ej2-pptxeditor/slideshow/fullscreen-manager
 */

interface FullscreenElement extends HTMLElement {
    webkitRequestFullscreen?: () => void | Promise<void>;
}

interface FullscreenDocument extends Document {
    webkitFullscreenElement?: Element | null;
    webkitExitFullscreen?: () => void | Promise<void>;
}

/**
 * Enters/leaves fullscreen for one element and reports when the browser
 * leaves fullscreen on its own (for example the user pressing Escape).
 * When fullscreen is unavailable or denied the slideshow still works as a
 * viewport-filling overlay.
 */
export class FullscreenManager {
    private readonly target: HTMLElement;
    private readonly onExternalExit: () => void;
    private entered: boolean = false;
    private readonly changeHandler: () => void;

    /**
     * @param {HTMLElement} target - Element to present fullscreen
     * @param {Function} onExternalExit - Called when the browser exits fullscreen without {@link exit}
     */
    public constructor(target: HTMLElement, onExternalExit: () => void) {
        this.target = target;
        this.onExternalExit = onExternalExit;
        this.changeHandler = (): void => this.onChange();
    }

    /**
     * Whether the target is the current fullscreen element.
     *
     * @returns {boolean} True when fullscreen
     */
    public isActive(): boolean {
        const doc: FullscreenDocument = document;
        return (doc.fullscreenElement || doc.webkitFullscreenElement) === this.target;
    }

    /**
     * Requests fullscreen. Never throws or rejects.
     *
     * @returns {void}
     */
    public enter(): void {
        document.addEventListener('fullscreenchange', this.changeHandler);
        document.addEventListener('webkitfullscreenchange', this.changeHandler);
        if (this.isActive()) {
            return;
        }
        const el: FullscreenElement = this.target;
        try {
            const result: void | Promise<void> = typeof el.requestFullscreen === 'function' ?
                el.requestFullscreen() : (el.webkitRequestFullscreen ? el.webkitRequestFullscreen() : undefined);
            if (result && typeof (result as Promise<void>).then === 'function') {
                (result as Promise<void>).then(undefined, (): void => { this.entered = false; });
            }
            this.entered = true;
        } catch (e) {
            this.entered = false;
        }
    }

    /**
     * Leaves fullscreen if this manager entered it and stops listening.
     *
     * @returns {void}
     */
    public exit(): void {
        document.removeEventListener('fullscreenchange', this.changeHandler);
        document.removeEventListener('webkitfullscreenchange', this.changeHandler);
        const wasEntered: boolean = this.entered;
        this.entered = false;
        if (!wasEntered || !this.isActive()) {
            return;
        }
        const doc: FullscreenDocument = document;
        try {
            const result: void | Promise<void> = typeof doc.exitFullscreen === 'function' ?
                doc.exitFullscreen() : (doc.webkitExitFullscreen ? doc.webkitExitFullscreen() : undefined);
            if (result && typeof (result as Promise<void>).then === 'function') {
                (result as Promise<void>).then(undefined, (): void => undefined);
            }
        } catch (e) {
            // State is reconciled via fullscreenchange.
        }
    }

    private onChange(): void {
        if (this.entered && !this.isActive()) {
            this.entered = false;
            this.onExternalExit();
        }
    }
}
