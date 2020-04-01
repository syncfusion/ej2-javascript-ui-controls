/**
 * Open properties.
 */
import { isUndefined } from '@syncfusion/ej2-base';
import { OpenOptions, OpenFailureArgs, BeforeOpenEventArgs } from '../../spreadsheet/common/interface';
import { workbookOpen, openSuccess, openFailure, sheetsDestroyed, workbookFormulaOperation } from '../common/index';
import { sheetCreated, protectSheetWorkBook } from '../common/index';
import { WorkbookModel, Workbook, initSheet } from '../base/index';
import { beginAction } from '../../spreadsheet/common/event';

export class WorkbookOpen {
    private parent: Workbook;
    constructor(parent: Workbook) {
        this.parent = parent;
        this.addEventListener();
    }

    /**
     * To open the excel file stream or excel url into the spreadsheet.
     * @param {OpenOptions} options - Options to open a excel file.
     */
    public open(options: OpenOptions): void {
        if (!this.parent.allowOpen) {
            return;
        }
        /* tslint:disable-next-line:no-any */
        if ((options as any).jsonObject) {
            /* tslint:disable-next-line:no-any */
            this.fetchSuccess((options as any).jsonObject as string);
            return;
        }
        let formData: FormData = new FormData();
        if (options.file) {
            formData.append('file', options.file as string);
        } else {
            this.parent.isOpen = false;
            return;
        }
        let eventArgs: BeforeOpenEventArgs = {
            file: options.file || null,
            cancel: false,
            requestData: {
                method: 'POST',
                body: formData
            }
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
            .then((data: string) => this.fetchSuccess(data))
            .catch((error: OpenFailureArgs) => this.fetchFailure(error));
    }

    private fetchFailure(error: OpenFailureArgs): void {
        if (isUndefined(error.status) && isUndefined(error.statusText)) {
            error.statusText = 'Improper response';
        }
        this.parent.notify(openFailure, error);
        this.parent.isOpen = false;
    }

    private fetchSuccess(data: string): void {
        let openError: string[] = ['UnsupportedFile', 'InvalidUrl'];
        let workbookData: string = data;
        workbookData = (typeof data === 'string') ? JSON.parse(data) : data;
        /* tslint:disable-next-line:no-any */
        let impData: WorkbookModel = (<any>workbookData).Workbook;
        if (openError.indexOf(impData as string) > -1) {
            this.parent.notify(openSuccess, {
                context: this, data: impData as string
            });
            return;
        }
        this.updateModel(impData);
        this.parent.notify(openSuccess, {
            context: this, data: impData as string
        });
        this.parent.isOpen = false;
    }

    private updateModel(workbookModel: WorkbookModel): void {
        this.parent.notify(workbookFormulaOperation, { action: 'unRegisterSheet' });
        this.parent.sheetNameCount = 1;
        this.parent.sheets = [];
        this.parent.notify(sheetsDestroyed, {});
        workbookModel.activeSheetIndex  = workbookModel.activeSheetIndex  || 0;
        this.parent.setProperties(
            {
                'sheets': workbookModel.sheets,
                'activeSheetIndex': workbookModel.activeSheetIndex,
                'definedNames': workbookModel.definedNames || []
            },
            true
        );
        initSheet(this.parent);
        this.parent.notify(sheetCreated, null);
        this.parent.notify(workbookFormulaOperation, { action: 'registerSheet', isImport: true });
        this.parent.notify(workbookFormulaOperation, { action: 'initiateDefinedNames' });
        this.parent.notify(protectSheetWorkBook, null);
    }

    /**
     * Adding event listener for workbook open. 
     */
    public addEventListener(): void {
        this.parent.on(workbookOpen, this.open.bind(this));
    }

    /**
     * Removing event listener workbook open.
     */
    public removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(workbookOpen, this.open.bind(this));
        }
    }

    /**
     * To Remove the event listeners
     */
    public destroy(): void {
        this.removeEventListener();
        this.parent = null;
    }

    /**
     * Get the workbook open module name.
     */
    public getModuleName(): string {
        return 'workbookOpen';
    }
}
