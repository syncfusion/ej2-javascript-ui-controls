import { IRichTextEditor } from '../base/interface';
import * as events from '../base/constant';
import { SuccessEventArgs, Uploader, UploadingEventArgs } from '@syncfusion/ej2-inputs';
import { RichTextEditor } from '../base';
import { NotifyArgs, ActionBeginEventArgs, ExportingEventArgs } from '../../common/interface';
import { EXPORT_STYLES } from '../../common/export-styles';
import { getComponent, isNullOrUndefined, initializeTelemetryFeature  } from '@syncfusion/ej2-base';
import { ExportDocumentType } from '../../common/types';
import { ProgressButton } from '@syncfusion/ej2-splitbuttons';
/**
 * ImportExport module called when import and export content in RichTextEditor
 */
export class ImportExport {
    private rteID: string;
    private parent: IRichTextEditor;
    private uploaderObj: Uploader;
    public constructor(parent?: IRichTextEditor) {
        initializeTelemetryFeature('ImportExport', 'RichTextEditor');
        this.parent = parent;
        this.addEventListener();
    }
    private addEventListener(): void {
        this.parent.on(events.onImport, this.onImport, this);
        this.parent.on(events.onExport, this.onExport, this);
        this.parent.on(events.destroy, this.destroy, this);
    }
    private onImport(): void {
        const actionBegin: ActionBeginEventArgs = {
            cancel: false,
            requestType: 'Import'
        };
        this.parent.trigger(events.actionBegin, actionBegin, (actionBeginArgs: ActionBeginEventArgs) => {
            if (!actionBeginArgs.cancel) {
                if (isNullOrUndefined(this.uploaderObj)) {
                    this.uploaderObj = new Uploader({
                        allowedExtensions: '.doc,.docx,.rtf,.dot,.dotx,.docm,.dotm',
                        asyncSettings: {
                            saveUrl: this.parent.importWord.serviceUrl
                        },
                        uploading: (e: UploadingEventArgs) => {
                            if (!this.parent.isServerRendered) {
                                this.parent.trigger(events.wordImporting, e);
                            }
                        },
                        success: (args: SuccessEventArgs) => {
                            const wordHtml: string = ((args.e as MouseEvent).currentTarget as XMLHttpRequest).response;
                            // Prepare Word import
                            const importContainer: HTMLElement = this.parent.createElement('div');
                            importContainer.innerHTML = wordHtml;
                            const tableElement: NodeListOf<HTMLElement> = importContainer.querySelectorAll('table:not(.e-rte-table):not(.e-rte-paste-table)');
                            for (let i: number = 0; i < tableElement.length; i++) {
                                tableElement[i as number].classList.add('e-rte-paste-table');
                            }
                            const preparedHtml: string = importContainer.innerHTML;
                            importContainer.remove();
                            // Apply Word cleanup
                            this.applyWordCleanupOnImport(preparedHtml);
                            this.parent.trigger(events.actionComplete, { requestType: 'Import' });
                            this.parent.notify(events.count, {});
                        }
                    });
                }
                this.parent.setProperties({ enableXhtml: true }, true);
                const uploadParentEle: HTMLElement = this.parent.createElement('div', { className: 'e-import-uploadwrap e-droparea' + this.parent.getCssClass(true) });
                const uploadEle: HTMLInputElement | HTMLElement = this.parent.createElement('input', {
                    id: this.rteID + '_upload', attrs: { type: 'File', name: 'UploadFiles' }, className: this.parent.getCssClass()
                });
                uploadParentEle.appendChild(uploadEle);
                this.uploaderObj.appendTo(uploadEle);
                this.uploaderObj.element.click();
                (this.uploaderObj.element.closest('.e-upload') as HTMLElement).style.display = 'none';
            }
        });

    }

    private getExportProgressButton(member: string): ProgressButton {
        const toolbarItem: HTMLElement = this.parent.element.querySelector(
            `#${this.parent.element.id}_toolbar_${member}`
        ) as HTMLElement;
        if (!isNullOrUndefined(toolbarItem)) {
            return getComponent(toolbarItem, ProgressButton) as ProgressButton;
        }
        return null;
    }
    private onExport(args: NotifyArgs): void {
        let filename: string;
        let serviceUrl: string;
        this.parent.setProperties({ enableXhtml: true }, true);
        const rteHtmlData: string = (this.parent as RichTextEditor).getHtml();
        let html: string;
        if (args.member === 'ExportWord') {
            filename = this.parent.exportWord.fileName;
            serviceUrl = this.parent.exportWord.serviceUrl;
            html = `<html><head><style>${this.parent.exportWord.stylesheet + EXPORT_STYLES}</style></head><body><div class="e-content">${rteHtmlData}</div></body></html>`;
        }
        else if (args.member === 'ExportPdf') {
            filename = this.parent.exportPdf.fileName;
            serviceUrl = this.parent.exportPdf.serviceUrl;
            html = `<html><head><style>${this.parent.exportPdf.stylesheet + EXPORT_STYLES}</style></head><body><div class="e-content">${rteHtmlData}</div></body></html>`;
        }
        const actionBegin: ActionBeginEventArgs = {
            requestType: args.member,
            exportValue: html,
            cancel: false
        };
        this.parent.trigger(events.actionBegin, actionBegin, (actionBeginArgs: ActionBeginEventArgs) => {
            if (!actionBeginArgs.cancel) {
                const exportArgs: ExportingEventArgs = {
                    exportType: (args.member === 'ExportPdf' ? 'PDF' : 'Word') as ExportDocumentType
                };
                this.parent.trigger(events.documentExporting, exportArgs);
                const headers: { [key: string]: string; } = {
                    'Content-Type': 'application/json'
                };
                if (exportArgs.currentRequest) {
                    for (const h of exportArgs.currentRequest) {
                        Object.assign(headers, h);
                    }
                }
                const payload: { html: string; formData?: { [key: string]: Object; }[] } = exportArgs.customFormData
                    ? { html: actionBeginArgs.exportValue, formData: exportArgs.customFormData }
                    : { html: actionBeginArgs.exportValue };
                fetch(serviceUrl, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(payload)
                })
                    .then((response: Response) => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        return response.blob().then((blob: Blob) => ({ blob, filename }));
                    })
                    .then(({ blob, filename }: { blob: Blob; filename: string }) => {
                        const url: string = window.URL.createObjectURL(blob);
                        const a: HTMLAnchorElement = document.createElement('a');
                        a.href = url;
                        a.download = filename;
                        document.body.appendChild(a);
                        const btn: ProgressButton = this.getExportProgressButton(args.member);
                        if (!isNullOrUndefined(btn)) {
                            btn.progressComplete();
                        }
                        a.click();
                        document.body.removeChild(a);
                        window.URL.revokeObjectURL(url);
                        this.parent.trigger(events.actionComplete, { requestType: args.member });
                        (this.parent.contentModule.getEditPanel() as HTMLElement).focus();
                    })
                    .catch((error: Error) => {
                        const btn: ProgressButton = this.getExportProgressButton(args.member);
                        if (!isNullOrUndefined(btn)) {
                            btn.progressComplete();
                        }
                        console.error('Fetch error:', error);
                        (this.parent.contentModule.getEditPanel() as HTMLElement).focus();
                    });
            }
        });
    }
    private destroy(): void {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(events.onImport, this.onImport);
        this.parent.off(events.onExport, this.onExport);
        this.parent.off(events.destroy, this.destroy);
        if (this.uploaderObj && !this.uploaderObj.isDestroyed) {
            this.uploaderObj.destroy();
            this.uploaderObj = null;
        }
    }

    private applyWordCleanupOnImport(html: string): void {
        // Parse HTML to work with elements directly
        const container: HTMLElement = this.parent.createElement('div');
        container.innerHTML = html;
        // STEP 1: Convert <p> to <li> inside lists
        const lists: NodeListOf<Element> = container.querySelectorAll('ol, ul');
        lists.forEach((listElement: Element) => {
            const paragraphs: Element[] = [];
            for (let i: number = 0; i < listElement.children.length; i++) {
                const child: Element = listElement.children[i as number];
                if (child.tagName.toLowerCase() === 'p') {
                    paragraphs.push(child);
                }
            }
            paragraphs.forEach((p: Element) => {
                const li: HTMLElement = this.parent.createElement('li');
                for (let i: number = 0; i < p.attributes.length; i++) {
                    const attr: Attr = p.attributes[i as number];
                    li.setAttribute(attr.name, attr.value);
                }
                while (p.firstChild) {
                    li.appendChild(p.firstChild);
                }
                p.parentElement!.replaceChild(li, p);
            });
        });
        // STEP 2: Build nested structure using margin-left
        const processedContainer: HTMLElement = this.buildNestedListStructure(container);
        // STEP 3: Extract bullet markers from list items
        this.extractBulletMarkersFromLists(processedContainer);
        // STEP 4: Clean RTL-specific styles if in RTL mode
        this.cleanupRtlStyles(processedContainer);
        const processedHtml: string = processedContainer.innerHTML;
        // STEP 5: Insert cleaned HTML
        (this.parent as RichTextEditor).executeCommand('insertHTML', processedHtml);
    }

    private cleanupRtlStyles(container: HTMLElement): void {
        // Check if RTL mode is enabled
        const isRtlMode: boolean = this.parent.element && this.parent.element.classList.contains('e-rtl');
        if (!isRtlMode) {
            return;  // Only cleanup in RTL mode
        }
        // Find all elements with text-align or text-indent styles
        const allElements: NodeListOf<Element> = container.querySelectorAll('*[style*="text-align"], *[style*="text-indent"]');
        for (let i: number = 0; i < allElements.length; i++) {
            const element: Element = allElements[i as number];
            const styleAttr: string = element.getAttribute('style') || '';
            let newStyle: string = styleAttr;
            // Remove text-align: left, text-align:left, text-align: start, text-align:start
            newStyle = newStyle.replace(/text-align:\s*left\s*;?/gi, '');
            newStyle = newStyle.replace(/text-align:\s*start\s*;?/gi, '');
            // Remove negative text-indent (used by Word for hanging indents)
            newStyle = newStyle.replace(/text-indent:\s*-[^;]*;?/gi, '');
            // Clean up extra semicolons and whitespace
            newStyle = newStyle.replace(/;\s*;/g, ';').replace(/;\s*$/, '').trim();
            // Update or remove style attribute
            if (newStyle && newStyle !== styleAttr) {
                element.setAttribute('style', newStyle);
            } else if (!newStyle && styleAttr) {
                element.removeAttribute('style');
            }
        }
    }

    private buildNestedListStructure(container: HTMLElement): HTMLElement {
        const lists: NodeListOf<Element> = container.querySelectorAll('ol, ul');
        lists.forEach((list: Element) => {
            const items: HTMLElement[] = [];
            for (let i: number = 0; i < list.children.length; i++) {
                const child: Element = list.children[i as number];
                if (child.tagName.toLowerCase() === 'li') {
                    items.push(child as HTMLElement);
                }
            }
            // Build nested structure
            for (let i: number = 0; i < items.length; i++) {
                const currentItem: HTMLElement = items[i as number];
                const currentMargin: number = this.getMarginValue(currentItem);
                // Look ahead for nested items (higher margin)
                const nestedItems: HTMLElement[] = [];
                let j: number = i + 1;
                while (j < items.length) {
                    const nextItem: HTMLElement = items[j as number];
                    const nextMargin: number = this.getMarginValue(nextItem);
                    // Stop if margin is same or less (same level or parent level)
                    if (nextMargin <= currentMargin) {
                        break;
                    }
                    // This is a nested item
                    if (nextMargin > currentMargin) {
                        nestedItems.push(nextItem);
                        j++;
                    }
                }
                // If we found nested items, create nested list and move them
                if (nestedItems.length > 0) {
                    const nestedList: HTMLElement = this.parent.createElement(list.tagName.toLowerCase() as 'ol' | 'ul');
                    nestedItems.forEach((nestedItem: HTMLElement) => {
                        nestedList.appendChild(nestedItem);
                    });
                    currentItem.appendChild(nestedList);
                }
            }
        });
        return container;
    }

    private getMarginValue(element: HTMLElement): number {
        const style: string = element.getAttribute('style') || '';
        const marginMatch: RegExpMatchArray | null = style.match(/margin-left:\s*([0-9.]+)pt/);
        return marginMatch ? parseFloat(marginMatch[1]) : 0;
    }

    private extractBulletMarkersFromLists(container: HTMLElement): void {
        const listItems: NodeListOf<Element> = container.querySelectorAll('li');
        listItems.forEach((item: Element) => {
            const spans: Element[] = [];
            const markerSpans: Element[] = [];
            // Collect all span children and identify markers by lang attribute
            for (let i: number = 0; i < item.children.length; i++) {
                const child: Element = item.children[i as number];
                if (child.tagName.toLowerCase() === 'span') {
                    spans.push(child);
                    // Span WITHOUT lang attribute = marker
                    if (!child.hasAttribute('lang')) {
                        markerSpans.push(child);
                    }
                }
            }
            // Remove all marker spans
            markerSpans.forEach((span: Element) => {
                if (span.remove) {
                    span.remove();
                }
            });
        });
    }

    /**
     * For internal use only - Get the module name.
     *
     * @returns {void}
     * @hidden
     */
    private getModuleName(): string {
        return 'importExport';
    }
}
