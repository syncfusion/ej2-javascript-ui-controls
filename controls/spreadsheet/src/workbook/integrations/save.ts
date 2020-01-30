import { Workbook } from '../base/index';
import { executeTaskAsync } from '../common/worker';
import { SaveOptions } from '../common/index';
import * as events from '../common/event';
import { SaveWorker } from '../workers/save-worker';
import { SaveCompleteEventArgs } from '../common/index';
import { detach } from '@syncfusion/ej2-base';

/**
 * @hidden
 * The `WorkbookSave` module is used to handle the save action in Workbook library.
 */
export class WorkbookSave extends SaveWorker {
    private isProcessCompleted: boolean = false;
    private saveSettings: SaveOptions;
    private saveJSON: { [key: string]: object } = {};
    private isFullPost: boolean = false;
    private needBlobData: boolean = false;
    private customParams: Object = null;

    /**
     * Constructor for WorkbookSave module in Workbook library.
     * @private
     */
    constructor(parent: Workbook) {
        super(parent);
        this.addEventListener();
    }

    /**
     * Get the module name.
     * @returns string
     * @private
     */
    public getModuleName(): string {
        return 'workbookSave';
    }

    /**
     * To destroy the WorkbookSave module. 
     * @return {void}
     * @hidden
     */
    public destroy(): void {
        this.removeEventListener();
        this.parent = null;
    }

    /**
     * @hidden
     */
    public addEventListener(): void {
        this.parent.on(events.beginSave, this.initiateSave, this);
    }

    /**
     * @hidden
     */
    public removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(events.beginSave, this.initiateSave);
        }
    }

    /**
     * Initiate save process.
     * @hidden
     */
    private initiateSave(args: { [key: string]: Object }): void {
        let saveSettings: SaveOptions = args.saveSettings;
        this.saveSettings = {
            saveType: saveSettings.saveType,
            url: saveSettings.url,
            fileName: saveSettings.fileName || 'Sample'
        };
        this.isFullPost = args.isFullPost as boolean;
        this.needBlobData = args.needBlobData as boolean;
        if (this.needBlobData) { this.isFullPost = false; }
        this.customParams = args.customParams;
        this.updateBasicSettings();
        this.processSheets();
    }

    /**
     * Update save JSON with basic settings.
     * @hidden
     */
    private updateBasicSettings(): void {
        let jsonStr: string = this.getStringifyObject(this.parent, ['sheets', '_isScalar', 'observers', 'closed', 'isStopped', 'hasError',
            '__isAsync', 'beforeCellFormat', 'beforeCellRender', 'beforeDataBound', 'beforeOpen', 'beforeSave', 'beforeSelect',
            'beforeSort', 'cellEdit', 'cellEditing', 'cellSave', 'contextMenuItemSelect', 'contextMenuBeforeClose',
            'contextMenuBeforeOpen', 'created', 'dataBound', 'fileItemSelect', 'fileMenuBeforeClose', 'fileMenuBeforeOpen', 'openFailure',
            'saveComplete', 'sortComplete', 'select', 'actionBegin', 'actionComplete', 'afterHyperlinkClick', 'afterHyperlinkCreate',
            'beforeHyperlinkClick', 'beforeHyperlinkCreate', 'openComplete']);
        let basicSettings: { [key: string]: Object } = JSON.parse(jsonStr);
        let sheetCount: number = this.parent.sheets.length;
        let i: number = 0;
        if (sheetCount) { basicSettings.sheets = []; }
        this.saveJSON = basicSettings;
    }

    /**
     * Process sheets properties.
     * @hidden
     */
    private processSheets(): void {
        let i: number = 0;
        let sheetCount: number = this.parent.sheets.length;
        while (i < sheetCount) {
            executeTaskAsync(this, this.processSheet, this.updateSheet, [this.getStringifyObject(this.parent.sheets[i]), i]);
            i++;
        }
    }

    /**
     * Update processed sheet data.
     * @hidden
     */
    private updateSheet(data: Object[]): void {
        (this.saveJSON.sheets as { [key: string]: Object })[data[0] as string] = data[1];
        this.isProcessCompleted = this.getSheetLength(this.saveJSON.sheets as []) === this.parent.sheets.length;
        if (this.isProcessCompleted) {
            this.save(this.saveSettings);
        }
    }

    private getSheetLength(sheets: string[]): number {
        let len: number = 0;
        sheets.forEach((sheet: string) => {
            if (sheet) { len++; }
        });
        return len;
    }

    /**
     * Save process.
     * @hidden
     */
    private save(saveSettings: SaveOptions): void {
        let args: { cancel: boolean, jsonObject: object } = { cancel: false, jsonObject: this.saveJSON };
        this.parent.notify(events.onSave, args);
        if (!args.cancel) {
            if (this.isFullPost) {
                this.initiateFullPostSave();
            } else {
                executeTaskAsync(
                    this, { 'workerTask': this.processSave },
                    this.updateSaveResult, [this.saveJSON, saveSettings, this.customParams], true);
            }
        }
        this.saveJSON = {};
    }

    /**
     * Update final save data.
     * @hidden
     */
    private updateSaveResult(result: { [key: string]: Object } | Blob): void {
        let args: SaveCompleteEventArgs = {
            status: 'Success',
            message: '',
            url: this.saveSettings.url,
            fileName: this.saveSettings.fileName,
            saveType: this.saveSettings.saveType,
            blobData: null
        };
        if (typeof (result) === 'object' && (<{ [key: string]: Object }>result).error) {
            args.status = 'Failure';
            args.message = (<{ [key: string]: Object }>result).error.toString();
        } else {
            if (this.needBlobData) {
                args.blobData = result as Blob;
            } else {
                this.ClientFileDownload(result as Blob, this.saveSettings.fileName);
            }
        }
        this.parent.trigger('saveComplete', args);
        this.parent.notify(events.saveCompleted, args);
    }

    private ClientFileDownload(blobData: Blob, fileName: string): void {
        let anchor: HTMLAnchorElement = this.parent.createElement(
            'a', { attrs: { download: this.getFileNameWithExtension() } }) as HTMLAnchorElement;
        let url: string = URL.createObjectURL(blobData);
        anchor.href = url;
        document.body.appendChild(anchor);
        anchor.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(anchor);
    }

    private initiateFullPostSave(): void {
        let keys: string[] = Object.keys(this.saveSettings);
        let i: number;
        let formElem: HTMLFormElement = this.parent.createElement(
            'form', { attrs: { method: 'POST', action: this.saveSettings.url } }
        ) as HTMLFormElement;

        let inputElem: HTMLInputElement = this.parent.createElement(
            'input', { attrs: { type: 'hidden', name: 'JSONData' } }) as HTMLInputElement;
        inputElem.value = JSON.stringify(this.saveJSON);
        formElem.appendChild(inputElem);

        for (i = 0; i < keys.length; i++) {
            inputElem = this.parent.createElement(
                'input', { attrs: { type: 'hidden', name: keys[i] } }) as HTMLInputElement;
            inputElem.value = this.saveSettings[keys[i]];
            formElem.appendChild(inputElem);
        }

        keys = Object.keys(this.customParams);
        for (i = 0; i < keys.length; i++) {
            inputElem = this.parent.createElement(
                'input', { attrs: { type: 'hidden', name: keys[i] } }) as HTMLInputElement;
            inputElem.value = this.customParams[keys[i]];
            formElem.appendChild(inputElem);
        }

        document.body.appendChild(formElem);
        formElem.submit();
        detach(formElem);
        this.parent.notify(events.saveCompleted, {});
    }

    /**
     * Get stringified workbook object.
     * @hidden
     */
    private getStringifyObject(value: object, skipProp: string[] = []): string {
        return JSON.stringify(value, (key: string, value: { [key: string]: object }) => {
            if (skipProp.indexOf(key) > -1) {
                return undefined;
            } else {
                if (value && typeof value === 'object' && value.hasOwnProperty('properties')) {
                    return value.properties;
                } else if (value !== null) {
                    return value;
                } else {
                    return undefined;
                }
            }
        });
    }

    private getFileNameWithExtension(filename?: string): string {
        if (!filename) { filename = this.saveSettings.fileName; }
        let fileExt: string = this.getFileExtension();
        let idx: number = filename.lastIndexOf('.');

        if (idx > -1) {
            filename = filename.substr(0, idx);
        }
        return (filename + fileExt);
    }

    private getFileExtension(): string {
        return ('.' + this.saveSettings.saveType.toLowerCase());
    }
}