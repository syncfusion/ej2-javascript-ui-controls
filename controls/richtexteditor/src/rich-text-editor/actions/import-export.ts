import { ActionBeginEventArgs, IRichTextEditor } from '../base/interface';
import * as events from '../base/constant';
import { SuccessEventArgs, Uploader } from '@syncfusion/ej2-inputs';
import { RichTextEditor } from '../base';
import { NotifyArgs } from '../base/interface';
/**
 * ImportExport module called when import and export content in RichTextEditor
 */
export class ImportExport {
    private rteID: string;
    private parent: IRichTextEditor;
    private uploaderObj: Uploader;
    public constructor(parent?: IRichTextEditor) {
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
                this.uploaderObj = new Uploader({
                    allowedExtensions: '.doc,.docx,.rtf,.dot,.dotx,.docm,.dotm',
                    asyncSettings: {
                        saveUrl: this.parent.importWord.serviceUrl
                    },
                    success: (args: SuccessEventArgs) => {
                        (this.parent as RichTextEditor).executeCommand('importWord', ((args.e as MouseEvent).currentTarget as XMLHttpRequest).response, { undo: true });
                        this.parent.trigger(events.actionComplete, { requestType: 'Import' });
                    }
                });
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
    private onExport(args: NotifyArgs): void {
        let filename: string;
        let serviceUrl: string;
        this.parent.setProperties({ enableXhtml: true }, true);
        const rteHtmlData: string = (this.parent as RichTextEditor).getHtml();
        let html: string;
        if (args.member === 'ExportWord') {
            filename = this.parent.exportWord.fileName;
            serviceUrl = this.parent.exportWord.serviceUrl;
            html = `<html><head><style>${this.parent.exportWord.stylesheet}</style></head><body>${rteHtmlData}</body></html>`;
        }
        else if (args.member === 'ExportPdf') {
            filename = this.parent.exportPdf.fileName;
            serviceUrl = this.parent.exportPdf.serviceUrl;
            html = `<html><head><style>${this.parent.exportPdf.stylesheet}</style></head><body>${rteHtmlData}</body></html>`;
        }
        const actionBegin: ActionBeginEventArgs = {
            requestType: args.member,
            exportValue: html,
            cancel: false
        };
        this.parent.trigger(events.actionBegin, actionBegin, (actionBeginArgs: ActionBeginEventArgs) => {
            if (!actionBeginArgs.cancel) {
                fetch(serviceUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ html: actionBeginArgs.exportValue })
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
                        a.click();
                        document.body.removeChild(a);
                        window.URL.revokeObjectURL(url);
                        this.parent.trigger(events.actionComplete, { requestType: args.member });
                    })
                    .catch((error: Error) => {
                        console.error('Fetch error:', error);
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
