import { isNullOrUndefined, SanitizeHtmlHelper } from '@syncfusion/ej2-base';

/**
 * @private
 * `StaticHtmlRenderer` is the Category C native reimplementation of
 * `Common/StaticHtmlRenderer.tsx`.
 *
 * Renders raw HTML into a `div`. Calls `SanitizeHtmlHelper.sanitize`
 * **only when** `enableHtmlSanitizer` is true; otherwise renders the raw
 * content. Supports an optional `id`.
 *
 * Mirrors the React component's `useMemo([content])` memoization by
 * recomputing the rendered string only when `content` changes — the host
 * replaces the inner HTML directly via `update()`.
 */
export class StaticHtmlRenderer {
    private el: HTMLElement | null;
    private content: string;
    private enableHtmlSanitizer: boolean | undefined;
    private id?: string;

    constructor(options: {
        content: string;
        id?: string;
        enableHtmlSanitizer?: boolean;
        target?: HTMLElement;
    }) {
        this.content = options.content;
        this.id = options.id;
        this.enableHtmlSanitizer = isNullOrUndefined(options.enableHtmlSanitizer) ? true : options.enableHtmlSanitizer;
        this.el = options.target || null;
    }

    private resolveHtml(content: string): string {
        try {
            if (this.enableHtmlSanitizer) {
                return SanitizeHtmlHelper.sanitize(content);
            }
            return content;
        } catch (error) {
            return '';
        }
    }

    /**
     * Create and return the container element with the rendered HTML
     * already injected. The caller appends the returned element to the DOM.
     */
    public render(): HTMLElement {
        const div: HTMLElement = document.createElement('div');
        if (this.id) {
            div.id = this.id;
        }
        div.innerHTML = this.resolveHtml(this.content);
        this.el = div;
        return div;
    }

    /**
     * Update the rendered content in-place (re-runs the sanitization /
     * raw-pass-through). Used by the host when `content` changes.
     */
    public update(content: string): void {
        this.content = content;
        if (this.el) {
            this.el.innerHTML = this.resolveHtml(this.content);
        }
    }

    /**
     * Return the live host element (or null before `render()`).
     */
    public getElement(): HTMLElement | null {
        return this.el;
    }

    /**
     * @private
     */
    public destroy(): void {
        if (this.el && this.el.parentNode) {
            this.el.parentNode.removeChild(this.el);
        }
        this.el = null;
        this.content = '';
        this.enableHtmlSanitizer = false;
        this.id = undefined;
    }
}

export default StaticHtmlRenderer;
