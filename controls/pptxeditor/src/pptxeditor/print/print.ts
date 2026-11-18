/**
 * Injectable Print feature module for the EJ2 PowerPoint Editor.
 *
 * @module @syncfusion/ej2-pptxeditor/print
 *
 * Follows the Syncfusion injectable-module pattern: the application injects
 * the feature once per class, and every editor instance mounts it during
 * `render()`:
 *
 * ```typescript
 * import { PptxEditor, Print } from '@syncfusion/ej2-pptxeditor';
 *
 * PptxEditor.Inject(Print); // inject the optional feature
 * const editor = new PptxEditor({ enablePrint: true }, '#editor');
 * ```
 *
 * The print feature (HTML/CSS/SVG slide print workflow used by the Print
 * action and {@link PptxEditor.print}) is active only when this module is
 * injected **and** {@link PptxEditor.enablePrint} is `true` (its default).
 * When not injected, the module code is tree-shaken out of the application
 * bundle and `print()` is a no-op. When injected but disabled at runtime,
 * the print workflow stays inert.
 */

import { PptxEditor } from '../pptxeditor';
import { localize, escapeLocaleHtml } from '../localization/localization';

/**
 * Injectable module that owns the print feature.
 *
 * The EJ2 `ModuleLoader` matches {@link getModuleName} against the editor's
 * `requiredModules()` declaration (`member: 'print'`), instantiates this
 * class with the editor as its single constructor argument, and attaches the
 * instance to the editor as `printModule`. `ModuleLoader.clean()` calls
 * {@link destroy} during `refresh()` and component destruction.
 *
 * @constructor
 */
export class Print {
    /** Editor host that owns the print property gate. */
    private readonly parent: PptxEditor;
    /** Window currently used for printing, if any. */
    private windowPrint: Window | undefined;

    /**
     * Creates the Print module instance.
     *
     * @param {PptxEditor} parent - Editor instance injecting the feature
     */
    public constructor(parent: PptxEditor) {
        this.parent = parent;
    }

    /**
     * Module name used by the EJ2 `ModuleLoader` for matching and validation.
     *
     * @returns {string} Module name `'print'`
     */
    public getModuleName(): string {
        return 'print';
    }

    /**
     * Whether the print feature is currently active on the host editor.
     *
     * @returns {boolean} True while `print()` opens the browser workflow
     */
    public isEnabled(): boolean {
        return this.parent.enablePrint;
    }

    /**
     * Opens a print window containing every slide and prints it.
     *
     * Each slide is rendered through the HTML/CSS/SVG pipeline (never canvas),
     * serialized into a print document with one slide per page, and printed
     * once the document has finished loading. No-op while
     * {@link PptxEditor.enablePrint} is false or no presentation is loaded.
     *
     * @param {Window} printWindow - Optional pre-opened window; a new one is opened when omitted
     * @returns {void}
     */
    public print(printWindow?: Window): void {
        if (!this.parent.enablePrint || !this.parent.hasLoadedPresentation) {
            return;
        }
        // Open synchronously so popup blockers treat it as user initiated.
        const target: Window | null = printWindow || window.open('', 'print', 'height=452,width=1024,tabbar=no');
        if (!target) {
            return;
        }
        this.windowPrint = target;
        window.addEventListener('beforeunload', this.closePrintWindow);
        void this.generateAndPrint(target);
    }

    /**
     * Replaces `blob:` URLs (revoked once the off-screen slide is released and
     * unreachable from the print window) with self-contained data URLs.
     *
     * @param {string} html - Serialized slide markup
     * @returns {Promise<string>} Markup with embedded images
     */
    private async inlineBlobUrls(html: string): Promise<string> {
        const urls: string[] = [];
        (html.match(/blob:[^"'()\s<>&]+/g) || []).forEach((url: string): void => {
            if (urls.indexOf(url) < 0) {
                urls.push(url);
            }
        });
        let result: string = html;
        for (const url of urls) {
            try {
                const blob: Blob = await (await fetch(url)).blob();
                const dataUrl: string = await this.readAsDataUrl(blob);
                result = result.split(url).join(dataUrl);
            } catch (error) {
                // Leave the picture blank rather than failing the whole print job.
            }
        }
        return result;
    }

    private readAsDataUrl(blob: Blob): Promise<string> {
        return new Promise<string>((resolve: (value: string) => void, reject: (reason?: Error) => void): void => {
            const reader: FileReader = new FileReader();
            reader.onload = (): void => resolve(String(reader.result));
            reader.onerror = (): void => reject(new Error('read failed'));
            reader.readAsDataURL(blob);
        });
    }

    private async generateAndPrint(target: Window): Promise<void> {
        const host: HTMLElement = document.createElement('div');
        host.style.cssText = 'position:fixed;left:-100000px;top:0;visibility:hidden;pointer-events:none;';
        host.setAttribute('aria-hidden', 'true');
        document.body.appendChild(host);
        const pages: string[] = [];
        let width: number = 0;
        let height: number = 0;
        try {
            for (let i: number = 0; i < this.parent.slideCount; i++) {
                const surface: HTMLElement | null = await this.parent.renderSlideSurface(i, host);
                if (!surface) {
                    break;
                }
                width = Math.max(width, parseFloat(surface.style.width));
                height = Math.max(height, parseFloat(surface.style.height));
                this.protectInlineStyles(surface);
                pages.push(await this.inlineBlobUrls(surface.outerHTML));
            }
        } finally {
            this.parent.releasePrintSurfaces();
            host.remove();
        }
        if (pages.length === 0 || target.closed) {
            this.closePrintWindow();
            return;
        }
        this.writeDocument(target, pages, width, height);
        this.printWhenReady(target);
    }

    /**
     * Re-applies every inline slide style with `!important` priority.
     *
     * The print window copies the host page's stylesheets, and many of those carry print rules such as
     * `@media print { * { background: transparent !important; color: #000 !important; } }`. Those rules
     * would strip table-style fills, gridlines and text colours from the printout. An inline `!important`
     * declaration outranks a stylesheet `!important` one, so slide styling wins regardless of host CSS.
     *
     * @param {HTMLElement} surface - Painted slide surface about to be serialized
     * @returns {void}
     */
    private protectInlineStyles(surface: HTMLElement): void {
        surface.querySelectorAll<HTMLElement | SVGElement>('[style]').forEach((element: HTMLElement | SVGElement): void => {
            const style: CSSStyleDeclaration = element.style;
            const names: string[] = [];
            for (let i: number = 0; i < style.length; i++) {
                names.push(style.item(i));
            }
            names.forEach((name: string): void => {
                if (style.getPropertyPriority(name) !== 'important') {
                    style.setProperty(name, style.getPropertyValue(name), 'important');
                }
            });
        });
    }

    private writeDocument(target: Window, pages: string[], width: number, height: number): void {
        const title: string = (this.parent.fileName || localize(this.parent.locale, 'Presentation'))
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        const styles: string = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
            .map((node: Element): string => node.outerHTML).join('');
        // Static page styles live in the theme (`.ej2-pptx-print-page`); only size is dynamic.
        const css: string = '@page{margin:0;size:' + width + 'px ' + height + 'px;}'
            + 'html,body{margin:0;padding:0;background:#fff;}'
            + '.ej2-pptx-print-page{width:' + width + 'px;height:' + height + 'px;}'
            + '*{-webkit-print-color-adjust:exact;print-color-adjust:exact;}';
        const body: string = pages
            .map((html: string): string => '<div class="ej2-pptx-print-page">' + html + '</div>').join('');
        target.document.open();
        target.document.write('<!DOCTYPE html><html><head><meta charset="utf-8"><title>' + title + '</title>'
            + styles + '<style>' + css + '</style></head><body>' + body + '</body></html>');
        target.document.close();
        target.focus();
    }

    private printWhenReady(target: Window): void {
        let attempts: number = 0;
        const interval: number = Number(setInterval((): void => {
            attempts++;
            if (target.closed) {
                clearInterval(interval);
                return;
            }
            if (target.document.readyState === 'complete' || attempts > 40) {
                clearInterval(interval);
                target.print();
                target.close();
            }
        }, 250));
    }

    private readonly closePrintWindow = (): void => {
        if (this.windowPrint && !this.windowPrint.closed) {
            this.windowPrint.close();
        }
    };

    /**
     * Tears down the print feature. Idempotent.
     *
     * Called by `ModuleLoader.clean()` on `refresh()` and component destroy,
     * and by the editor when `enablePrint` flips to `false`.
     *
     * @returns {void}
     */
    public destroy(): void {
        window.removeEventListener('beforeunload', this.closePrintWindow);
        this.windowPrint = undefined;
    }
}
