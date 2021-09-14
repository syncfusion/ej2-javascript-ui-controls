/**
 * Open properties.
 */
import { isUndefined } from '@syncfusion/ej2-base';
import { OpenOptions, OpenFailureArgs, BeforeOpenEventArgs } from '../../spreadsheet/common/interface';
import { workbookOpen, openSuccess, openFailure, sheetsDestroyed, workbookFormulaOperation, getRangeIndexes, FilterCollectionModel, getCellAddress, sortImport } from '../common/index';
import { sheetCreated, protectSheetWorkBook, getRangeAddress, updateFilter } from '../common/index';
import { WorkbookModel, Workbook, initSheet, SheetModel, RangeModel } from '../base/index';
import { beginAction, initiateFilterUI } from '../../spreadsheet/common/event';
import { PredicateModel } from '@syncfusion/ej2-grids';

export class WorkbookOpen {
    private parent: Workbook;
    constructor(parent: Workbook) {
        this.parent = parent;
        this.addEventListener();
    }

    /**
     * To open the excel file stream or excel url into the spreadsheet.
     *
     * @param {OpenOptions} options - Options to open a excel file.
     * @returns {void} - To open the excel file stream or excel url into the spreadsheet.
     */
    public open(options: OpenOptions): void {
        if (!this.parent.allowOpen) {
            return;
        }
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        if ((options as any).jsonObject) {
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            this.fetchSuccess((options as any).jsonObject as string, null, true);
            return;
        }
        const formData: FormData = new FormData();
        if (options.file) {
            formData.append('file', options.file as string);
        } else {
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
        this.parent.trigger('beforeOpen', eventArgs);
        this.parent.notify(beginAction, { eventArgs: eventArgs, action: 'beforeOpen' });
        if (eventArgs.cancel) {
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
            .then((data: string) => this.fetchSuccess(data, eventArgs))
            .catch((error: OpenFailureArgs) => this.fetchFailure(error));
    }

    private fetchFailure(error: OpenFailureArgs): void {
        if (isUndefined(error.status) && isUndefined(error.statusText)) {
            error.statusText = 'Improper response';
        }
        this.parent.notify(openFailure, error);
        this.parent.isOpen = false;
    }

    private fetchSuccess(data: string, eventArgs: OpenOptions, isOpenFromJson?: boolean): void {
        const openError: string[] = ['UnsupportedFile', 'InvalidUrl', 'NeedPassword', 'InCorrectPassword'];
        let workbookData: string = data;
        workbookData = (typeof data === 'string') ? JSON.parse(data) : data;
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        const impData: WorkbookModel = (<any>workbookData).Workbook;
        if (openError.indexOf(impData as string) > -1) {
            this.parent.notify(openSuccess, { context: this, data: <string>impData, eventArgs: eventArgs, isOpenFromJson: isOpenFromJson });
            return;
        }
        this.updateModel(impData, isOpenFromJson);
        this.parent.notify(openSuccess, { context: this, data: <string>impData, isOpenFromJson: isOpenFromJson });
        this.parent.isOpen = false;
        if (eventArgs && eventArgs.password && eventArgs.password.length > 0) {
            if (this.parent.showSheetTabs) {
                this.parent.element.querySelector('.e-add-sheet-tab').removeAttribute('disabled');
                this.parent.element.querySelector('.e-add-sheet-tab').classList.remove('e-disabled');
            }
            this.parent.password = '';
        }
    }

    private updateModel(workbookModel: WorkbookModel, isOpenFromJson: boolean): void {
        this.parent.notify(workbookFormulaOperation, { action: 'unRegisterSheet' });
        this.setSelectAllRange(workbookModel.sheets, isOpenFromJson);
        this.parent.sheetNameCount = 1;
        this.parent.sheets = [];
        this.parent.notify(sheetsDestroyed, {});
        workbookModel.activeSheetIndex  = workbookModel.activeSheetIndex  || 0;
        this.parent.setProperties(
            {
                'sheets': workbookModel.sheets,
                'activeSheetIndex': workbookModel.activeSheetIndex,
                'definedNames': workbookModel.definedNames || [],
                'filterCollection': workbookModel.filterCollection || [],
                'sortCollection': workbookModel.sortCollection || []
            },
            true
        );
        initSheet(this.parent);
        this.parent.notify(sheetCreated, null);
        this.parent.notify(workbookFormulaOperation, { action: 'registerSheet', isImport: true });
        this.parent.notify(workbookFormulaOperation, { action: 'initiateDefinedNames' });
        this.parent.notify(protectSheetWorkBook, null);
        this.parent.notify(updateFilter, { isOpen: true });
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
            // eslint-disable-next-line
            if (isOpenFromJson && (this.parent as any).isAngular) {
                for (let i: number = 0; i < this.parent.sheets.length; i++) {
                    curSheet = this.parent.sheets[i];
                    if (sheet.name === curSheet.name) {
                        if (sheet.ranges) {
                            sheet.ranges.forEach((range: RangeModel, index: number): void => {
                                curRange = curSheet.ranges[index];
                                if (curRange && curRange.template) { range.template = curRange.template; }
                            });
                        }
                        break;
                    }
                }
            }
        });
    }

    /**
     * Adding event listener for workbook open.
     *
     * @returns {void} - Adding event listener for workbook open.
     */
    private addEventListener(): void {
        this.parent.on(workbookOpen, this.open.bind(this));
    }

    /**
     * Removing event listener workbook open.
     *
     * @returns {void} - removing event listener workbook open.
     */
    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(workbookOpen, this.open.bind(this));
        }
    }

    /**
     * To Remove the event listeners
     *
     * @returns {void} - To Remove the event listeners
     */
    public destroy(): void {
        this.removeEventListener();
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
