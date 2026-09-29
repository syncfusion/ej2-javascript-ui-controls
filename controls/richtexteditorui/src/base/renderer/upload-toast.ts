import { Toast } from '@syncfusion/ej2-notifications';
import { isNullOrUndefined as isNOU } from '@syncfusion/ej2-base';

/**
 * Options accepted by {@link UploadToast}.
 *
 * Mirrors a small subset of the EJ2 {@link Toast} configuration that the
 * editor's image module actually needs: a top-right anchored toast that
 * auto-dismisses after `timeOut` ms.
 *
 * @hidden
 */
export interface UploadToastOptions {
    /** Ms before auto-dismiss. Default `4000`. */
    timeOut?: number;
    /** Optional CSS class added to the rendered toast. */
    cssClass?: string;
    /** Static id for the underlying toast container. Default auto. */
    id?: string;
}

/**
 * UploadToast — top-right toast used by the image module to surface
 * per-file upload failures. The constructor lazily instantiates the
 * underlying EJ2 `Toast` component; `show(message)` is fire-and-forget
 * and `destroy()` tears down the toast and removes its DOM root.
 *
 * Lives alongside {@link EditorDialog} and {@link EditorUploadPopup} in
 * the renderer folder; follows the same sub-component conventions
 * (three-string ctor not required — just `new UploadToast(options)`).
 *
 * @hidden
 */
export class UploadToast {
    private toast: Toast | null;
    private container: HTMLElement | null;
    private options: UploadToastOptions;
    private isDestroyed: boolean;

    constructor(options?: UploadToastOptions) {
        this.options = options || {};
        this.toast = null;
        this.container = null;
        this.isDestroyed = false;
        this.render();
    }

    /**
     * Builds (or re-uses) the toast's container element and the
     * underlying `Toast` instance. Idempotent: re-entry creates only
     * one DOM container + one component.
     *
     * @returns {void}
     */
    private render(): void {
        if (this.isDestroyed || typeof document === 'undefined') { return; }
        if (this.container) { return; }
        const id: string = this.options.id || 'rte-upload-toast-' +
            Math.floor(Math.random() * 0xffffff).toString(36);
        let host: HTMLElement | null = document.getElementById(id);
        if (!host) {
            host = document.createElement('div');
            host.id = id;
            document.body.appendChild(host);
        }
        this.container = host;
        this.toast = new Toast({
            target: host,
            position: { X: 'Right', Y: 'Top' },
            timeOut: typeof this.options.timeOut === 'number' ? this.options.timeOut : 4000,
            cssClass: (this.options.cssClass || 'e-rte-upload-toast') + (this.options.cssClass ? '' : ''),
            showCloseButton: true,
            newestOnTop: true,
            animation: {
                show: { effect: 'SlideRightIn', duration: 200, easing: 'ease' },
                hide: { effect: 'SlideRightOut', duration: 200, easing: 'ease' }
            }
        });
        try {
            this.toast.appendTo(host);
        } catch (e) {
            // Toast.appendTo may already have wired when target=
            // attribute matches the auto-created root — swallow.
        }
    }

    /**
     * Shows the provided message at the top-right of the editor's
     * body. Subsequent calls within `timeOut` stack on top of each
     * other (`newestOnTop: true`).
     *
     * @param {string} message - Plain-text error message.
     * @returns {void}
     */
    public show(message: string): void {
        if (this.isDestroyed || isNOU(this.toast) || !this.toast) { return; }
        if (typeof message !== 'string' || message.length === 0) { return; }
        const ToastCtor: { content?: string; show(content: unknown): void } = this.toast as unknown as {
            content?: string;
            show(content: unknown): void;
        };
        // Toast.show accepts a string template (the EJ2 primitive
        // expects an object with `title`, `content`, or a string). The
        // simplest cross-version path is `show(string)`.
        try {
            if (typeof ToastCtor.content !== 'undefined') {
                ToastCtor.content = message;
            }
            ToastCtor.show(message);
        } catch (_e) {
            /* swallow — toast is non-critical */
        }
    }

    /**
     * Destroys the underlying EJ2 toast and removes its container.
     * Idempotent.
     *
     * @returns {void}
     */
    public destroy(): void {
        if (this.isDestroyed) { return; }
        this.isDestroyed = true;
        if (this.toast && typeof (this.toast as { destroy?: () => void }).destroy === 'function') {
            try { (this.toast as { destroy: () => void }).destroy(); } catch (_e) { /* swallow */ }
        }
        this.toast = null;
        if (this.container && this.container.parentElement) {
            this.container.parentElement.removeChild(this.container);
        }
        this.container = null;
    }
}
