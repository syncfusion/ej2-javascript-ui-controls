/**
 * Open properties.
 */
import { isNullOrUndefined, isUndefined } from '@syncfusion/ej2-base';
import { OpenFailureArgs, BeforeOpenEventArgs, OpenArgs } from '../../spreadsheet/common/interface';
import { workbookOpen, openSuccess, openFailure, sheetsDestroyed, workbookFormulaOperation, getRangeIndexes } from '../common/index';
import { sheetCreated, getRangeAddress, beginAction, importModelUpdate } from '../common/index';
import { WorkbookModel, Workbook, initSheet, SheetModel, RangeModel, getSheet } from '../base/index';
import { clearUndoRedoCollection } from '../../spreadsheet/common/event';

export class WorkbookOpen {
    private parent: Workbook;
    private chunkList: string[];
    private loopIndex: number = 0;
    private processedLoopIndex: number = 0;
    private retryCount: number = 0;
    private currentDocumentId: string = null;
    private currentFailedChunkIndex: number;
    public preventFormatCheck: boolean;
    constructor(parent: Workbook) {
        this.parent = parent;
        this.addEventListener();
    }

    /**
     * To open the excel file stream or excel url into the spreadsheet.
     *
     * @param {OpenArgs} options - Options to open a excel file.
     * @returns {void} - To open the excel file stream or excel url into the spreadsheet.
     */
    public open(options: OpenArgs): void {
        this.load(options);
    }

    private load(options: OpenArgs, isRetryRequest?: boolean): void {
        if (!this.parent.allowOpen) {
            return;
        }
        if (options.jsonObject) {
            this.fetchSuccess(options.jsonObject, options, null, true, true);
            return;
        }
        const formData: FormData = new FormData();
        if (options.file) {
            formData.append('file', options.file as string);
        }
        else if (options.sheetIndex >= 0) {
            formData.append('sheetPassword', options.sheetPassword as string);
            formData.append('sheetIndex', options.sheetIndex.toString());
        }
        else {
            this.parent.isOpen = false;
            return;
        }
        const args: {passWord: string} = { passWord: '' };
        if (options.password && options.password.length) {
            args.passWord = options.password;
        }
        if (args.passWord && args.passWord.length) {
            options.password = args.passWord;
        }
        if (options.password) {
            formData.append('password', options.password as string);
        }
        const header: { chunkSize: string, documentId: string } = { chunkSize: null, documentId: null };
        if (this.parent.openSettings.chunkSize > 0 && isNullOrUndefined(options.sheetPassword)) {
            this.setToDefaults(isRetryRequest);
            if (!isNullOrUndefined(this.parent.openSettings.chunkSize) && this.parent.openSettings.chunkSize !== 0) {
                header.chunkSize = this.parent.openSettings.chunkSize.toString();
            }
            if (!isNullOrUndefined(this.currentDocumentId)) {
                header.documentId = this.currentDocumentId;
            }
            if (!isNullOrUndefined(header)) {
                formData.append('chunkPayload', JSON.stringify(header));
            }
        }
        formData.append('IsManualCalculationEnabled', (this.parent.calculationMode === 'Manual').toString());
        const eventArgs: BeforeOpenEventArgs = {
            file: options.file || null,
            cancel: false,
            requestData: {
                method: 'POST',
                body: formData
            },
            password: args.passWord,
            requestType: 'initial'
        };
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        const guid: string = (options as any).guid;
        if (isNullOrUndefined(options.sheetPassword) && !guid && isNullOrUndefined(isRetryRequest)) {
            this.parent.trigger('beforeOpen', eventArgs);
            this.parent.notify(beginAction, { eventArgs: eventArgs, action: 'beforeOpen' });
        } else if (guid) {
            formData.append('guid', guid);
            if (options.isThresholdLimitConfirmed) {
                eventArgs.requestType = 'thresholdLimitConfirmed';
                this.parent.trigger('beforeOpen', eventArgs);
            }
        }
        if (eventArgs.cancel) {
            this.parent.isOpen = false;
            return;
        }
        if (eventArgs.parseOptions) {
            formData.append('parseOptions', JSON.stringify(eventArgs.parseOptions));
        }
        fetch(this.parent.openUrl, eventArgs.requestData)
            .then((response: Response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    return Promise.reject({
                        status: response.status,
                        statusText: response.statusText,
                        url: response.url
                    });
                }
            })
            .then((data: string) => this.fetchSuccess(data, eventArgs, options.orginalFile, undefined, true))
            .catch((error: OpenFailureArgs) => {
                if (error.toString().indexOf('Unexpected end of JSON input') === -1 && this.parent.openSettings.chunkSize > 0 && this.retryCount < this.parent.openSettings.retryCount) {
                    setTimeout(() => {
                        this.retryCount++;
                        this.load(options, true);
                    }, this.parent.openSettings.retryAfterDelay);
                } else {
                    if (this.retryCount >= this.parent.openSettings.retryCount) {
                        this.retryCount = 0;
                    }
                    this.fetchFailure(error);
                }
            });
    }

    private fetchFailure(error: OpenFailureArgs): void {
        if (isUndefined(error.status) && isUndefined(error.statusText)) {
            error.statusText = 'Improper response';
        }
        this.parent.notify(openFailure, error);
        this.parent.isOpen = false;
    }

    private fetchSuccess(data: object | string, eventArgs: OpenArgs, file?: File, isOpenFromJson?: boolean, isImport?: boolean): void {
        const openError: string[] = ['UnsupportedFile', 'InvalidUrl', 'NeedPassword', 'InCorrectPassword', 'InCorrectSheetPassword',
            'CorrectSheetPassword', 'DataLimitExceeded', 'FileSizeLimitExceeded', 'ExternalWorkbook'];
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        const workbookData: any = typeof data === 'string' ? JSON.parse(data) : data;
        const impData: WorkbookModel = workbookData.Workbook;
        if (!isNullOrUndefined(impData)) {
            if (openError.indexOf(impData as string) > -1) {
                if (file) {
                    eventArgs.file = file;
                }
                this.parent.notify(
                    openSuccess, {
                        context: this, data: impData, guid: workbookData.Guid, eventArgs: eventArgs,
                        isOpenFromJson: isOpenFromJson
                    });
                if (<string>impData === openError[0]) {
                    this.parent.isOpen = false;
                }
                return;
            }
            this.updateModel(impData, isOpenFromJson, isImport);
            this.parent.notify(openSuccess, { context: this, data: impData, isOpenFromJson: isOpenFromJson, eventArgs: eventArgs });
            this.parent.isOpen = false;
            if (eventArgs && eventArgs.password && eventArgs.password.length > 0) {
                if (this.parent.showSheetTabs) {
                    this.parent.element.querySelector('.e-add-sheet-tab').removeAttribute('disabled');
                    this.parent.element.querySelector('.e-add-sheet-tab').classList.remove('e-disabled');
                }
                this.parent.password = '';
            }
        } else {
            const totalChunk: number = workbookData.chunkTotalCount;
            this.currentDocumentId = workbookData.documentId;
            this.chunkList = new Array (totalChunk);
            let processedChunkIndex: number = 0;
            let chunkLimit: number = totalChunk > this.parent.openSettings.chunkSize ? this.parent.openSettings.chunkSize : totalChunk;
            let processedLoopIndex: number = 0;
            this.processedLoopIndex = 0;
            const binaryString: string = '';
            /* eslint-disable-next-line @typescript-eslint/no-this-alias */
            const instance: WorkbookOpen = this;
            if (!isNullOrUndefined(totalChunk)) {
                while (processedChunkIndex < totalChunk) {
                    instance.processChunk(processedChunkIndex, chunkLimit, processedLoopIndex, binaryString, eventArgs, file,
                                          isOpenFromJson, isImport);
                    processedChunkIndex += instance.parent.openSettings.chunkSize;
                    chunkLimit = processedChunkIndex + instance.parent.openSettings.chunkSize < totalChunk ?
                        instance.parent.openSettings.chunkSize : totalChunk - processedChunkIndex;
                    processedLoopIndex++;
                    instance.processedLoopIndex++;
                }
            }
        }
    }

    private processChunk(processedChunkIndex: number, chunkLimit: number, processedLoopIndex: number, binaryString: string,
                         eventArgs: OpenArgs, file: File, isOpenFromJson: boolean, isImport: boolean): void {
        /* eslint-disable-next-line @typescript-eslint/no-this-alias */
        const instance: WorkbookOpen = this;
        const header: { currentChunk: string, chunkSize: string, loopIndex: string, documentId: string } =
        {
            currentChunk: processedChunkIndex.toString(), chunkSize: chunkLimit.toString(),
            loopIndex: processedLoopIndex.toString(), documentId: this.currentDocumentId
        };
        const formData: FormData = new FormData();
        formData.append('chunkPayload', JSON.stringify(header));
        const requestEventArgs: BeforeOpenEventArgs = {
            file: file || null,
            requestData: {
                method: 'POST',
                body: formData
            },
            password: eventArgs.password,
            requestType: 'chunk'
        };
        this.parent.trigger('beforeOpen', requestEventArgs);
        fetch(this.parent.openUrl, requestEventArgs.requestData)
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            .then((response: any) => {
                if (response.ok) {
                    return response.json();
                }
                else {
                    return Promise.reject({
                        status: response.status,
                        statusText: response.statusText,
                        url: response.url
                    });
                }
            })
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            .then((data: any) => {
                if (data !== '') {
                    let chunks: string = atob(data['chunk']);
                    const bytes: Uint8Array = new Uint8Array(chunks.length);
                    for (let i: number = 0; i < chunks.length; i++) {
                        bytes[i as number] = chunks.charCodeAt(i);
                    }
                    chunks = new TextDecoder('utf-8').decode(bytes);
                    instance.chunkList[data['loopIndex']] = chunks;
                    instance.loopIndex++;
                    if (instance.loopIndex === instance.processedLoopIndex) {
                        const splicedArray: string[] = instance.chunkList.splice(0, instance.loopIndex);
                        for (let k: number = 0; k < splicedArray.length; k++) {
                            binaryString += splicedArray.slice(k, k + 1).join('');
                        }
                        data = JSON.parse(binaryString);
                        instance.setToDefaults();
                        instance.fetchSuccess(data, eventArgs, file, isOpenFromJson, isImport);
                    }
                }
            })
            .catch((error: OpenFailureArgs) => {
                if (isNullOrUndefined(instance.currentFailedChunkIndex) || instance.currentFailedChunkIndex === processedChunkIndex) {
                    instance.currentFailedChunkIndex = processedChunkIndex;
                    if (instance.retryCount < instance.parent.openSettings.retryCount) {
                        setTimeout(() => {
                            instance.processedLoopIndex = processedLoopIndex;
                            instance.processChunk(processedChunkIndex, chunkLimit, processedLoopIndex, binaryString, eventArgs, file,
                                                  isOpenFromJson, isImport);
                            instance.retryCount++;
                        }, instance.parent.openSettings.retryAfterDelay);
                    } else {
                        instance.retryCount = 0;
                        return instance.fetchFailure(error);
                    }
                }
            });
    }

    private setToDefaults(isRetryRequest?: boolean): void {
        this.currentFailedChunkIndex = null;
        if (!isRetryRequest) {
            this.retryCount = 0;
        }
        this.loopIndex = 0;
        this.processedLoopIndex = 0;
        this.chunkList = [];
    }

    private updateModel(workbookModel: WorkbookModel, isOpenFromJson: boolean, isImport?: boolean): void {
        this.parent.notify(workbookFormulaOperation, { action: 'unRegisterSheet' });
        this.setSelectAllRange(workbookModel.sheets, isOpenFromJson);
        this.parent.sheetNameCount = 1;
        this.parent.sheets = [];
        this.parent.notify(sheetsDestroyed, {});
        this.parent.notify(clearUndoRedoCollection, null);
        workbookModel.activeSheetIndex = workbookModel.activeSheetIndex || workbookModel.sheets.findIndex((sheet: SheetModel) => sheet.state !== 'Hidden');
        this.parent.setProperties(
            {
                'isProtected': workbookModel.isProtected || false,
                'password': workbookModel.password || '',
                'sheets': workbookModel.sheets,
                'activeSheetIndex': workbookModel.activeSheetIndex,
                'definedNames': workbookModel.definedNames || [],
                'filterCollection': workbookModel.filterCollection || [],
                'sortCollection': workbookModel.sortCollection || [],
                'listSeparator': workbookModel.listSeparator || this.parent.listSeparator
            },
            true
        );
        if (!isNullOrUndefined(workbookModel.showSheetTabs)) {
            this.parent.showSheetTabs = workbookModel.showSheetTabs;
        }
        initSheet(this.parent, undefined, isImport);
        this.parent.notify(sheetCreated, null);
        this.parent.notify(importModelUpdate, null);
    }

    private setSelectAllRange(sheets: SheetModel[], isOpenFromJson: boolean): void {
        let curSheet: SheetModel; let curRange: RangeModel;
        sheets.forEach((sheet: SheetModel) => {
            if (sheet.selectedRange) {
                const selectedIndex: number[] = getRangeIndexes(sheet.selectedRange);
                const rowCount: number = (isUndefined(sheet.rowCount) ? 100 : sheet.rowCount) - 1;
                const colCount: number = (isUndefined(sheet.colCount) ? 100 : sheet.colCount) - 1;
                if (selectedIndex[2] === 65535) {
                    selectedIndex[2] = rowCount;
                }
                if (selectedIndex[3] === 255) {
                    selectedIndex[3] = colCount;
                }
                if (selectedIndex[0] === 65535) {
                    selectedIndex[0] = rowCount;
                }
                if (selectedIndex[1] === 255) {
                    selectedIndex[1] = colCount;
                }
                sheet.selectedRange = getRangeAddress(selectedIndex);
            }
            if (isOpenFromJson && this.parent.isAngular) {
                for (let i: number = 0; i < this.parent.sheets.length; i++) {
                    curSheet = getSheet(this.parent, i);
                    if (sheet.name === curSheet.name) {
                        if (sheet.ranges) {
                            sheet.ranges.forEach((range: RangeModel, index: number): void => {
                                curRange = curSheet.ranges[index as number];
                                if (curRange && curRange.template) { range.template = curRange.template; }
                            });
                        }
                        break;
                    }
                }
            }
        });
    }

    private sheetsDestroyHandler(args: { sheetIndex?: number }): void {
        if (isNullOrUndefined(args.sheetIndex)) {
            this.preventFormatCheck = null;
        }
    }

    /**
     * Adding event listener for workbook open.
     *
     * @returns {void} - Adding event listener for workbook open.
     */
    private addEventListener(): void {
        this.parent.on(workbookOpen, this.open.bind(this));
        this.parent.on(sheetsDestroyed, this.sheetsDestroyHandler, this);
    }

    /**
     * Removing event listener workbook open.
     *
     * @returns {void} - removing event listener workbook open.
     */
    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(workbookOpen, this.open.bind(this));
            this.parent.off(sheetsDestroyed, this.sheetsDestroyHandler);
        }
    }

    /**
     * To Remove the event listeners
     *
     * @returns {void} - To Remove the event listeners
     */
    public destroy(): void {
        this.removeEventListener();
        if (!(this.parent as unknown as { refreshing?: boolean }).refreshing) {
            this.preventFormatCheck = null;
        }
        this.parent = null;
    }

    /**
     * Get the workbook open module name.
     *
     * @returns {string} - Get the module name.
     */
    public getModuleName(): string {
        return 'workbookOpen';
    }
}
