/**
 * Open properties.
 */
import { isUndefined } from '@syncfusion/ej2-base';
import { OpenOptions, OpenFailureArgs, BeforeOpenEventArgs } from '../../spreadsheet/common/interface';
import { workbookOpen, openSuccess, openFailure, sheetsDestroyed, workbookFormulaOperation, getRangeIndexes, FilterCollectionModel, getCellAddress, sortImport, WorkbookAllModule } from '../common/index';
import { sheetCreated, protectSheetWorkBook, getRangeAddress } from '../common/index';
import { WorkbookModel, Workbook, initSheet, SheetModel } from '../base/index';
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
     * @returns {OpenOptions} - To open the excel file stream or excel url into the spreadsheet.
     */
    public open(options: OpenOptions): void {
        if (!this.parent.allowOpen) {
            return;
        }
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        if ((options as any).jsonObject) {
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            this.fetchSuccess((options as any).jsonObject as string, null);
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

    private fetchSuccess(data: string, eventArgs: OpenOptions): void {
        const openError: string[] = ['UnsupportedFile', 'InvalidUrl', 'NeedPassword', 'InCorrectPassword'];
        let workbookData: string = data;
        workbookData = (typeof data === 'string') ? JSON.parse(data) : data;
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        const impData: WorkbookModel = (<any>workbookData).Workbook;
        if (openError.indexOf(impData as string) > -1) {
            this.parent.notify(openSuccess, {
                context: this, data: impData as string, eventArgs: eventArgs
            });
            return;
        }
        this.updateModel(impData);
        this.parent.notify(openSuccess, {
            context: this, data: impData as string
        });
        this.parent.isOpen = false;
        if (eventArgs && eventArgs.password && eventArgs.password.length > 0) {
            if (this.parent.showSheetTabs) {
                this.parent.element.querySelector('.e-add-sheet-tab').removeAttribute('disabled');
                this.parent.element.querySelector('.e-add-sheet-tab').classList.remove('e-disabled');
            }
            this.parent.password = "";
        }
    }

    private updateModel(workbookModel: WorkbookModel): void {
        this.parent.notify(workbookFormulaOperation, { action: 'unRegisterSheet' });
        this.parent.sheetNameCount = 1;
        this.parent.sheets = [];
        this.parent.notify(sheetsDestroyed, {});
        workbookModel.activeSheetIndex  = workbookModel.activeSheetIndex  || 0;
        this.setSelectAllRange(workbookModel.sheets);
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
        if (this.parent.filterCollection) {
            this.updateFilter();
        }
    }
    private updateFilter(): void {
        for (let i: number = 0; i < this.parent.filterCollection.length; i++) {
            let filterCol: FilterCollectionModel = this.parent.filterCollection[i];
            let sIdx: number = filterCol.sheetIndex;
            if (i === 0) {
                sIdx = 0;
            }
            let predicates: PredicateModel[] = [];
            if (filterCol.column) {
                for (let j: number = 0; j < filterCol.column.length; j++) {
                    let predicateCol: PredicateModel = {
                        field: getCellAddress(0, filterCol.column[j]).charAt(0),
                        operator: this.getFilterOperator(filterCol.criteria[j]), value: filterCol.value[j].toString().split('*').join('')
                    };
                    predicates.push(predicateCol);
                }
            }
            for (let i: number = 0; i < predicates.length - 1; i++) {
                if (predicates[i].field === predicates[i + 1].field) {
                    if (!predicates[i].predicate) {
                        predicates[i].predicate = 'or';
                    }
                    predicates[i + 1].predicate = 'or';
                }
            }
            this.parent.notify(initiateFilterUI, { predicates: predicates !== [] ? predicates : null, range: filterCol.filterRange, sIdx: sIdx });
        }
        if (this.parent.sortCollection) {
            this.parent.notify(sortImport, null);
        }
    }

    private getFilterOperator(value: string)
        {
            switch (value)
            {
                case "BeginsWith":
                    value = "startswith";
                    break;
                case "Less":
                    value = "lessthan";
                    break;
                case "EndsWith":
                    value = "endswith";
                    break;
                case "Equal":
                    value = "equal";
                    break;
                case "Notequal":
                    value = "notEqual";
                    break;
                case "Greater":
                    value = "greaterthan";
                    break;
                case "Contains":
                    value = "contains";
                    break;
                case "LessOrEqual":
                    value = "lessthanorequal";
                    break;
                case "GreaterOrEqual":
                    value = "greaterthanorequal";
                    break;
            }
            return value;
        }

    private setSelectAllRange(sheets: SheetModel[]): void {
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
