import { Workbook, CellModel, getCell } from '../base/index';
import { executeTaskAsync } from '../common/worker';
import { pdfLayoutSettings, SaveOptions, checkIsFormula, workbookFormulaOperation, removeUniquecol } from '../common/index';
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
    private pdfLayoutSettings: pdfLayoutSettings = {fitSheetOnOnePage: false};

    /**
     * Constructor for WorkbookSave module in Workbook library.
     *
     * @private
     * @param {Workbook} parent - Specifies the workbook.
     */
    constructor(parent: Workbook) {
        super(parent);
        this.addEventListener();
    }

    /**
     * Get the module name.
     *
     * @returns {string} - To Get the module name.
     * @private
     */
    public getModuleName(): string {
        return 'workbookSave';
    }

    /**
     * To destroy the WorkbookSave module.
     *
     * @returns {void} - To destroy the WorkbookSave module.
     * @hidden
     */
    public destroy(): void {
        this.removeEventListener();
        this.parent = null;
    }

    /**
     * @hidden
     * @returns {void} - add Event Listener
     */
    private addEventListener(): void {
        this.parent.on(events.beginSave, this.initiateSave, this);
    }

    /**
     * @hidden
     * @returns {void} - remove Event Listener.
     */
    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(events.beginSave, this.initiateSave);
        }
    }

    /**
     * Initiate save process.
     *
     * @hidden
     * @param {Object} args - Specify the args.
     * @returns {void} - Initiate save process.
     */
    private initiateSave(args: { [key: string]: Object }): void {
        const saveSettings: SaveOptions = args.saveSettings;
        this.parent.notify(events.getFilteredCollection, null);
        this.saveSettings = {
            saveType: saveSettings.saveType,
            url: saveSettings.url,
            fileName: saveSettings.fileName || 'Sample'
            //passWord: saveSettings.passWord
        };
        this.isFullPost = args.isFullPost as boolean;
        this.needBlobData = args.needBlobData as boolean;
        if (this.needBlobData) { this.isFullPost = false; }
        this.customParams = args.customParams;
        this.pdfLayoutSettings = args.pdfLayoutSettings;
        this.updateBasicSettings();
        this.processSheets();
    }

    /**
     * Update save JSON with basic settings.
     *
     * @hidden
     * @returns {void} - Update save JSON with basic settings.
     */
    private updateBasicSettings(): void {
        const jsonStr: string = this.getStringifyObject(this.parent, ['sheets', '_isScalar', 'observers', 'closed', 'isStopped', 'hasError',
            '__isAsync', 'beforeCellFormat', 'beforeCellRender', 'beforeDataBound', 'beforeOpen', 'beforeSave', 'beforeSelect',
            'beforeSort', 'cellEdit', 'cellEditing', 'cellSave', 'beforeCellSave', 'contextMenuItemSelect', 'contextMenuBeforeClose',
            'contextMenuBeforeOpen', 'created', 'dataBound', 'fileMenuItemSelect', 'fileMenuBeforeClose', 'fileMenuBeforeOpen',
            'saveComplete', 'sortComplete', 'select', 'actionBegin', 'actionComplete', 'afterHyperlinkClick', 'afterHyperlinkCreate',
            'beforeHyperlinkClick', 'beforeHyperlinkCreate', 'openComplete', 'openFailure', 'queryCellInfo', 'dialogBeforeOpen',
            'dataSourceChanged', 'beforeConditionalFormat', 'beforeCellUpdate']);
        const basicSettings: { [key: string]: Object } = JSON.parse(jsonStr);
        const sheetCount: number = this.parent.sheets.length;
        if (sheetCount) {
            basicSettings.sheets = [];
        }
        this.saveJSON = basicSettings;
    }

    /**
     * Process sheets properties.
     *
     * @hidden
     * @returns {void} - Process sheets properties.
     */
    private processSheets(): void {
        const skipProps: string[] = ['dataSource', 'startCell', 'query', 'showFieldAsHeader', 'result'];
        // eslint-disable-next-line
        if ((this.parent as any).isAngular) {
            skipProps.push('template');
        }
        for (let i: number = 0, sheetCount: number = this.parent.sheets.length; i < sheetCount; i++) {
            executeTaskAsync(this, this.processSheet, this.updateSheet, [this.getStringifyObject(this.parent.sheets[i], skipProps, i), i]);
        }
    }

    /**
     * Update processed sheet data.
     *
     * @hidden
     * @param {Object[]} data - Specifies the data.
     * @returns {void} - Update processed sheet data.
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
     *
     * @hidden
     * @param {SaveOptions} saveSettings - Specifies the save settings props.
     * @returns {void} - Save process.
     */
    private save(saveSettings: SaveOptions): void {
        const args: { cancel: boolean, jsonObject: object } = { cancel: false, jsonObject: this.saveJSON };
        this.parent.notify(events.onSave, args);
        if (!args.cancel) {
            if (this.isFullPost) {
                this.initiateFullPostSave();
            } else {
                executeTaskAsync(
                    this, { 'workerTask': this.processSave },
                    this.updateSaveResult, [this.saveJSON, saveSettings, this.customParams, this.pdfLayoutSettings], true);
            }
        }
        this.saveJSON = {};
    }

    /**
     * Update final save data.
     *
     * @hidden
     * @param {Object | Blob} result - specify the sve result.
     * @returns {void} - Update final save data.
     */
    private updateSaveResult(result: { [key: string]: Object } | Blob): void {
        const args: SaveCompleteEventArgs = {
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
        } else if (typeof (result) === 'object' && (<{ [key: string]: Object }>result).dialog) {
            this.parent.notify(events.saveError, { content: (<{ [key: string]: Object }>result).dialog });
        } else {
            if (this.needBlobData) {
                args.blobData = result as Blob;
            } else {
                this.ClientFileDownload(result as Blob);
            }
        }
        this.parent.trigger('saveComplete', args);
        this.parent.notify(events.saveCompleted, args);
    }

    private ClientFileDownload(blobData: Blob): void {
        const anchor: HTMLAnchorElement = this.parent.createElement(
            'a', { attrs: { download: this.getFileNameWithExtension() } }) as HTMLAnchorElement;
        const url: string = URL.createObjectURL(blobData);
        anchor.href = url;
        document.body.appendChild(anchor);
        anchor.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(anchor);
    }

    private initiateFullPostSave(): void {
        let keys: string[] = Object.keys(this.saveSettings);
        let i: number;
        const formElem: HTMLFormElement = this.parent.createElement(
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

        inputElem = this.parent.createElement(
            'input', { attrs: { type: 'hidden', name: 'pdfLayoutSettings' } }) as HTMLInputElement;
        inputElem.value = JSON.stringify(this.pdfLayoutSettings);
        formElem.appendChild(inputElem);

        document.body.appendChild(formElem);
        formElem.submit();
        detach(formElem);
        this.parent.notify(events.saveCompleted, {});
    }

    /**
     * Get stringified workbook object.
     *
     * @hidden
     * @param {object} model - Specifies the workbook or sheet model.
     * @param {string[]} skipProp - specifies the skipprop.
     * @returns {string} - Get stringified workbook object.
     */
    private getStringifyObject(model: object, skipProp: string[] = [], sheetIdx?: number): string {
        if (sheetIdx === 0) {
            this.parent.notify(removeUniquecol, { clearAll: true });
        }
        return JSON.stringify(model, (key: string, value: { [key: string]: object }) => {
            if (skipProp.indexOf(key) > -1) {
                return undefined;
            } else {
                if (value && value.cells) {
                    for (let i: number = 0, len: number = (value.cells as CellModel[]).length; i < len; i++) {
                        const cell: CellModel = value.cells[i];
                        const cellIdx: number[] = [Number(key), i];
                        if (cell && !cell.value && cell.formula && cell.formula.indexOf('=UNIQUE(') < 0) {
                            this.parent.notify(
                                workbookFormulaOperation, {
                                    action: 'refreshCalculate', value: cell.formula, rowIndex: cellIdx[0],
                                colIndex: i, isFormula: checkIsFormula(cell.formula), sheetIndex: sheetIdx, isRefreshing: true
                            });
                            cell.value = getCell(cellIdx[0], i, model).value;
                        }
                    }
                }
                // eslint-disable-next-line no-prototype-builtins
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
        const fileExt: string = this.getFileExtension();
        const idx: number = filename.lastIndexOf('.');

        if (idx > -1) {
            filename = filename.substr(0, idx);
        }
        return (filename + fileExt);
    }

    private getFileExtension(): string {
        return ('.' + this.saveSettings.saveType.toLowerCase());
    }
}
