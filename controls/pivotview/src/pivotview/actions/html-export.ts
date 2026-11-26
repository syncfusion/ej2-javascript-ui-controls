/**
 * Rendered PivotView HTML and image export support.
 */
import { RenderedStyleUtil } from '../../base/rendered-style-util';
import { PivotView } from '../base/pivotview';
import { HtmlExportProperties, ImageExportProperties } from '../../common/base/interface';
import { ImageExportType } from '../../common/base/enum';
import { createElement, initializeTelemetryFeature } from '@syncfusion/ej2-base';
import * as events from '../../common/base/constant';

/** @hidden */
export class HtmlExport {
    private parent: PivotView;

    constructor(parent?: PivotView) {
        initializeTelemetryFeature('HtmlExport', 'PivotTable');
        this.parent = parent;
    }

    protected getModuleName(): string {
        return 'htmlExport';
    }

    /**
     * Exports the current PivotView composition as a safe standalone HTML document or Blob.
     *
     * @param {HtmlExportProperties} properties - HTML export options.
     * @param {boolean} isBlob - Whether to return output instead of downloading.
     * @returns {Promise<string | Blob>} The HTML content or Blob.
     * @hidden
     */
    public exportToHTML(properties?: HtmlExportProperties, isBlob?: boolean): Promise<string | Blob> {
        if (!this.parent) {
            return Promise.reject(new Error('Export module has been destroyed.'));
        }
        const content: HTMLElement = this.composition();
        if (properties && properties.includeStyles === false) {
            content.querySelectorAll('[style]').forEach((node: Element) => node.removeAttribute('style'));
        }
        if (!content.firstElementChild) {
            return Promise.reject(new Error('No rendered pivot table is available for HTML export.'));
        }
        return new Promise((resolve: (value: string | Blob) => void) => {
            const args: { type: string; cancel: boolean } = { type: 'HTML', cancel: false };
            this.parent.trigger(events.beforeExport, args, (observedArgs: { type: string; cancel: boolean }) => {
                if (observedArgs.cancel) {
                    resolve('');
                    return;
                }
                const title: string = properties && properties.title ? properties.title : this.parent.element.id;
                const html: string = '<!doctype html><html><head><meta charset="utf-8"><title>' + this.escape(title) +
                    '</title></head><body dir="' + (this.parent.enableRtl ? 'rtl' : 'ltr') + '">' +
                    content.innerHTML + '</body></html>';
                if (isBlob) {
                    const blob: Blob = new Blob([html], { type: 'text/html;charset=utf-8' });
                    this.parent.trigger(events.exportComplete, { type: 'HTML', promise: Promise.resolve({ blobData: blob }) });
                    resolve(blob);
                    return;
                }
                this.download(html, (properties && properties.fileName) || 'PivotView.html', 'text/html;charset=utf-8');
                this.parent.trigger(events.exportComplete, { type: 'HTML' });
                resolve(html);
            });
        });
    }

    /**
     * Exports the currently displayed PivotView composition as PNG, JPEG, or SVG.
     *
     * @param {ImageExportType} format - Image file format.
     * @param {ImageExportProperties} properties - Image rendering options.
     * @param {boolean} isBlob - Whether to return output instead of downloading.
     * @returns {Promise<Blob | string>} The image data.
     * @hidden
     */
    public exportToImage(format: ImageExportType, properties?: ImageExportProperties, isBlob?: boolean): Promise<Blob | string> {
        if (format !== 'PNG' && format !== 'JPEG' && format !== 'SVG') {
            return Promise.reject(new Error('Unsupported image export format.'));
        }
        if (!this.parent) {
            return Promise.reject(new Error('Export module has been destroyed.'));
        }
        const composition: HTMLElement = this.composition();
        if (!composition.firstElementChild) {
            return Promise.reject(new Error('No rendered pivot content is available for image export.'));
        }
        composition.style.position = 'fixed';
        composition.style.left = '-10000px';
        composition.style.top = '0';
        composition.style.width = this.parent.element.offsetWidth + 'px';
        document.body.appendChild(composition);
        return new Promise<Blob | string>((resolve: (value: Blob | string) => void, reject: (reason: Error) => void) => {
            const args: { type: string; cancel: boolean } = { type: format, cancel: false };
            this.parent.trigger(events.beforeExport, args, (observedArgs: { type: string; cancel: boolean }) => {
                if (observedArgs.cancel) {
                    composition.remove();
                    resolve('');
                    return;
                }
                if (format === 'SVG') {
                    resolve(this.exportSvg(composition, properties, isBlob));
                    return;
                }
                const target: HTMLElement = composition;
                const bounds: ClientRect = target.getBoundingClientRect();
                const scale: number = (properties && properties.scale) || 1;
                const canvas: HTMLCanvasElement = createElement('canvas', {
                    attrs: { width: String(Math.ceil(bounds.width * scale)), height: String(Math.ceil(bounds.height * scale)) }
                }) as HTMLCanvasElement;
                const context: CanvasRenderingContext2D = canvas.getContext('2d');
                if (!context) {
                    composition.remove();
                    reject(new Error('Canvas is not available for image export.'));
                    return;
                }
                // Paint semantic cells directly. HTML foreignObject images taint Chromium canvases.
                const table: HTMLTableElement = target.querySelector('table');
                const origin: ClientRect = target.getBoundingClientRect();
                const chart: SVGElement = target.querySelector('svg');
                let image: HTMLImageElement;
                let settled: boolean = false;
                const cleanup: () => void = () => {
                    composition.remove();
                    if (image) {
                        image.onload = null;
                        image.onerror = null;
                    }
                    this.pending = this.pending.filter((item: () => void) => item !== abort);
                };
                const abort: () => void = () => finish(new Error('Export module has been destroyed.'));
                const finish: (error?: Error, blob?: Blob) => void = (error?: Error, blob?: Blob) => {
                    if (settled) { return; }
                    settled = true;
                    cleanup();
                    if (error) { reject(error); return; }
                    try {
                        if (!isBlob) {
                            this.download(blob, (properties && properties.fileName) || ('PivotView.' + format.toLowerCase()), blob.type);
                        }
                        this.parent.trigger(events.exportComplete, { type: format, promise: Promise.resolve({ blobData: blob }) });
                        resolve(blob);
                    } catch (failure) { reject(failure); }
                };
                this.pending.push(abort);
                const encode: () => void = () => {
                    try {
                        canvas.toBlob((blob: Blob) => {
                            finish(blob ? undefined : new Error('Unable to create the requested image.'), blob);
                        }, format === 'JPEG' ? 'image/jpeg' : 'image/png', properties && properties.quality);
                    } catch (error) { finish(error); }
                };
                try {
                    context.fillStyle = (properties && properties.backgroundColor) || '#ffffff';
                    context.fillRect(0, 0, canvas.width, canvas.height);
                    context.scale(scale, scale);
                    if (table) {
                        // Use the same native SVG primitives as SVG export, without foreignObject.
                        const visual: SVGSVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                        visual.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
                        visual.setAttribute('width', String(bounds.width));
                        visual.setAttribute('height', String(bounds.height));
                        this.tableVisual(target, visual);
                        this.chartVisual(target, visual);
                        image = new Image();
                        image.onload = () => {
                            try {
                                context.drawImage(image, 0, 0);
                                encode();
                            } catch (error) { finish(error); }
                        };
                        image.onerror = () => finish(new Error('Unable to render the pivot table.'));
                        image.src = 'data:image/svg+xml;charset=utf-8,' +
                            encodeURIComponent(new XMLSerializer().serializeToString(visual));
                        return;
                    }
                    const rect: ClientRect = chart.getBoundingClientRect();
                    image = new Image();
                    image.onload = () => {
                        try {
                            context.drawImage(image, rect.left - origin.left, rect.top - origin.top, rect.width, rect.height);
                            encode();
                        } catch (error) { finish(error); }
                    };
                    image.onerror = () => finish(new Error('Unable to render the pivot image.'));
                    // Only allowlisted inline SVG primitives reach this self-contained data URL.
                    image.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(chart));
                } catch (error) { finish(error); }
            });
        }).catch((error: Error) => {
            composition.remove();
            throw error;
        });
    }

    private exportSvg(composition: HTMLElement, properties: ImageExportProperties, isBlob: boolean): Blob | string {
        const bounds: ClientRect = composition.getBoundingClientRect();
        const wrapper: SVGSVGElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        wrapper.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        wrapper.setAttribute('width', String(Math.ceil(bounds.width)));
        wrapper.setAttribute('height', String(Math.ceil(bounds.height)));
        this.tableVisual(composition, wrapper);
        this.chartVisual(composition, wrapper);
        const output: string = new XMLSerializer().serializeToString(wrapper);
        composition.remove();
        const result: Blob = new Blob([output], { type: 'image/svg+xml;charset=utf-8' });
        if (!isBlob) {
            this.download(result, (properties && properties.fileName) || 'PivotView.svg', result.type);
        }
        this.parent.trigger(events.exportComplete, { type: 'SVG', promise: Promise.resolve({ blobData: result }) });
        return isBlob ? result : output;
    }

    private pending: (() => void)[] = [];

    /** Releases pending raster work when PivotView destroys its injected module.
     *
     * @returns {void} Nothing.
     * @hidden
     */
    public destroy(): void {
        this.pending.slice().forEach((abort: () => void) => abort());
        this.parent = null;
    }

    private composition(): HTMLElement {
        const content: HTMLElement = createElement('div');
        const view: string = this.parent.displayOption.view;
        const current: string = this.parent.currentView;
        if (view === 'Table' || (view === 'Both' && current !== 'Chart')) {
            const table: HTMLElement = this.parent.element.querySelector('.e-gridcontent table');
            if (table) {
                const snapshot: HTMLElement = RenderedStyleUtil.table(table);
                const header: HTMLElement = this.parent.element.querySelector('.e-gridheader table');
                if (header) {
                    const safeHeader: HTMLElement = RenderedStyleUtil.table(header);
                    const heading: HTMLElement = document.createElement('thead');
                    safeHeader.querySelectorAll('thead > tr').forEach((row: Element) => heading.appendChild(row));
                    snapshot.insertBefore(heading, snapshot.firstChild);
                }
                const grid: HTMLElement = table.closest('.e-grid') as HTMLElement;
                if (grid) {
                    ['top', 'left', 'right', 'bottom'].forEach((side: string) => RenderedStyleUtil.boundary(snapshot, grid, side));
                    snapshot.style.width = grid.getBoundingClientRect().width + 'px';
                    snapshot.style.height = 'auto';
                    snapshot.style.tableLayout = 'fixed';
                    if (header) {
                        const boundary: Element = header.closest('.e-gridheader');
                        RenderedStyleUtil.boundary(snapshot, boundary, 'top');
                        const rows: NodeListOf<HTMLTableRowElement> = snapshot.querySelectorAll('thead tr');
                        if (rows.length) {
                            const separator: number = parseFloat(window.getComputedStyle(boundary).borderBottomWidth);
                            rows.forEach((row: HTMLTableRowElement, index: number) => {
                                Array.from(row.cells).forEach((cell: HTMLTableCellElement) => {
                                    if (index + cell.rowSpan === rows.length) {
                                        RenderedStyleUtil.boundary(cell, boundary, 'bottom');
                                        cell.style.height = (parseFloat(cell.style.height) + separator) + 'px';
                                    }
                                });
                            });
                        }
                    }
                }
                content.appendChild(snapshot);
            }
        }
        if (view === 'Chart' || (view === 'Both' && current !== 'Table')) {
            // The chart container can also contain a spinner SVG before the actual chart SVG.
            const chart: SVGElement = this.parent.chart && this.parent.chart.svgObject ? this.parent.chart.svgObject as SVGElement :
                this.parent.element.querySelector('.e-pivotchart svg');
            if (chart) { content.appendChild(this.safeChart(chart)); }
        }
        return content;
    }

    private chartVisual(content: HTMLElement, svg: SVGSVGElement): void {
        const chart: SVGElement = content.querySelector('svg');
        if (!chart) { return; }
        const bounds: ClientRect = content.getBoundingClientRect();
        const rect: ClientRect = chart.getBoundingClientRect();
        const clone: SVGElement = chart.cloneNode(true) as SVGElement;
        clone.setAttribute('x', String(rect.left - bounds.left));
        clone.setAttribute('y', String(rect.top - bounds.top));
        svg.appendChild(clone);
    }

    private tableVisual(content: HTMLElement, svg: SVGSVGElement): void {
        const origin: ClientRect = content.getBoundingClientRect();
        const append: (tag: string, attrs: { [key: string]: string | number }, text?: string) => void =
            (tag: string, attrs: { [key: string]: string | number }, text?: string) => {
                const element: Element = document.createElementNS('http://www.w3.org/2000/svg', tag);
                Object.keys(attrs).forEach((key: string) => element.setAttribute(key, String(attrs[key as string])));
                if (text) { element.textContent = text; }
                svg.appendChild(element);
            };
        content.querySelectorAll('table,th,td').forEach((cell: HTMLElement, index: number) => {
            const rect: ClientRect = cell.getBoundingClientRect();
            const style: CSSStyleDeclaration = window.getComputedStyle(cell);
            const x: number = rect.left - origin.left;
            const y: number = rect.top - origin.top;
            append('rect', { x: x, y: y, width: rect.width, height: rect.height, fill: style.backgroundColor });
            ['Top', 'Right', 'Bottom', 'Left'].forEach((side: string, index: number) => {
                const width: number = parseFloat(style.getPropertyValue('border-' + side.toLowerCase() + '-width'));
                if (width && style.getPropertyValue('border-' + side.toLowerCase() + '-style') !== 'none') {
                    append('line', { x1: x + (index === 1 ? rect.width - width / 2 : index === 3 ? width / 2 : 0),
                        y1: y + (index === 2 ? rect.height - width / 2 : index === 0 ? width / 2 : 0),
                        x2: x + (index === 3 ? width / 2 : index === 1 ? rect.width - width / 2 : rect.width),
                        y2: y + (index === 0 ? width / 2 : index === 2 ? rect.height - width / 2 : rect.height),
                        stroke: style.getPropertyValue('border-' + side.toLowerCase() + '-color'), 'stroke-width': width });
                }
            });
            if (cell.tagName === 'TABLE') { return; }
            const right: boolean = style.textAlign === 'right' || (style.textAlign === 'end' && style.direction !== 'rtl');
            const center: boolean = style.textAlign === 'center';
            const clip: Element = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
            clip.setAttribute('id', 'pivot-cell-' + index);
            const clipRect: Element = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            clipRect.setAttribute('x', String(x)); clipRect.setAttribute('y', String(y));
            clipRect.setAttribute('width', String(rect.width)); clipRect.setAttribute('height', String(rect.height));
            clip.appendChild(clipRect); svg.appendChild(clip);
            const lineHeight: number = parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.2;
            const lines: string[] = cell.textContent.split('\n');
            const top: number = style.verticalAlign === 'top' ? y + parseFloat(style.paddingTop) :
                style.verticalAlign === 'bottom' ? y + rect.height - parseFloat(style.paddingBottom) - lineHeight * lines.length :
                    y + (rect.height - lineHeight * lines.length) / 2;
            lines.forEach((line: string, lineIndex: number) => {
                append('text', { x: center ? x + rect.width / 2 : right ? x + rect.width - parseFloat(style.paddingRight) - parseFloat(style.borderRightWidth) :
                    x + parseFloat(style.paddingLeft) + parseFloat(style.borderLeftWidth),
                y: Math.floor(top + lineHeight * (lineIndex + 0.5)) - 0.5,
                fill: style.color, 'font-family': style.fontFamily, 'font-size': style.fontSize,
                'font-weight': style.fontWeight, 'font-style': style.fontStyle,
                'clip-path': 'url(#pivot-cell-' + index + ')',
                'text-anchor': center ? 'middle' : right ? 'end' : 'start', 'dominant-baseline': 'central' }, line);
            });
        });
    }

    private safeChart(chart: SVGElement): SVGElement {
        const clone: SVGElement = chart.cloneNode(true) as SVGElement;
        [clone as Element].concat(Array.from(clone.querySelectorAll('*'))).forEach((node: Element) => {
            if (!/^(svg|g|path|rect|circle|ellipse|line|polyline|polygon|text|tspan|defs|clipPath|linearGradient|radialGradient|stop|title|desc)$/.test(node.localName)) {
                node.remove();
                return;
            }
            Array.from(node.attributes).forEach((attribute: Attr) => {
                if (!/^(xmlns|id|width|height|viewBox|preserveAspectRatio|x|y|x1|x2|y1|y2|cx|cy|r|rx|ry|d|points|transform|fill|fill-opacity|fill-rule|stroke|stroke-width|stroke-opacity|stroke-dasharray|opacity|clip-path|offset|stop-color|stop-opacity|font-family|font-size|font-weight|font-style|text-anchor|dominant-baseline|dx|dy|gradientUnits|gradientTransform)$/.test(attribute.name) ||
                    /[<>\\]|[^\u0020-\uffff]|(?:javascript|data|https?|file):|url\(\s*(?!#[\w-]+\))/i.test(attribute.value)) {
                    node.removeAttribute(attribute.name);
                }
            });
        });
        return clone;
    }

    private escape(value: string): string {
        return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    private download(content: BlobPart, fileName: string, type: string): void {
        const url: string = URL.createObjectURL(new Blob([content], { type: type }));
        const link: HTMLAnchorElement = createElement('a', { attrs: { href: url, download: fileName } }) as HTMLAnchorElement;
        try {
            link.click();
        } finally {
            URL.revokeObjectURL(url);
        }
    }
}
