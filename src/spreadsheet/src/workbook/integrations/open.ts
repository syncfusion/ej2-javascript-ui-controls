/**
 * Open properties.
 */
import { isNullOrUndefined, isUndefined } from '@syncfusion/ej2-base';
import { OpenFailureArgs, BeforeOpenEventArgs, OpenArgs } from '../../spreadsheet/common/interface';
import { workbookOpen, openSuccess, openFailure, sheetsDestroyed, workbookFormulaOperation, getRangeIndexes } from '../common/index';
import { sheetCreated, protectSheetWorkBook, getRangeAddress, beginAction } from '../common/index';
import { WorkbookModel, Workbook, initSheet, SheetModel, RangeModel, getSheet } from '../base/index';

export class WorkbookOpen {
    private parent: Workbook;
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
        const eventArgs: BeforeOpenEventArgs = {
            file: options.file || null,
            cancel: false,
            requestData: {
                method: 'POST',
                body: formData
            },
            password: args.passWord
        };
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        const guid: string = (options as any).guid;
        if (isNullOrUndefined(options.sheetPassword) && !guid) {
            this.parent.trigger('beforeOpen', eventArgs);
            this.parent.notify(beginAction, { eventArgs: eventArgs, action: 'beforeOpen' });
        } else if (guid) {
            formData.append('guid', guid);
        }
        if (eventArgs.cancel) {
            this.parent.isOpen = false;
            return;
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
            .catch((error: OpenFailureArgs) => this.fetchFailure(error));
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
        const workbookData: { Workbook?: WorkbookModel, Guid?: string } = typeof data === 'string' ? JSON.parse(data) : data;
        const impData: WorkbookModel = workbookData.Workbook;
        if (openError.indexOf(impData as string) > -1) {
            if (file) {
                eventArgs.file = file;
            }
            this.parent.notify(
                openSuccess, { context: this, data: impData, guid: workbookData.Guid, eventArgs: eventArgs,
                    isOpenFromJson: isOpenFromJson });
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
    }

    private updateModel(workbookModel: WorkbookModel, isOpenFromJson: boolean, isImport?: boolean): void {
        this.parent.notify(workbookFormulaOperation, { action: 'unRegisterSheet' });
        this.setSelectAllRange(workbookModel.sheets, isOpenFromJson);
        this.parent.sheetNameCount = 1;
        this.parent.sheets = [];
        this.parent.notify(sheetsDestroyed, {});
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
        this.parent.notify(workbookFormulaOperation, { action: 'registerSheet', isImport: true });
        this.parent.notify(workbookFormulaOperation, { action: 'initiateDefinedNames' });
        this.parent.notify(protectSheetWorkBook, null);
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
