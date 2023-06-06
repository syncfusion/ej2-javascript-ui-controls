/**
 * Open properties.
 */
import { Spreadsheet, DialogBeforeOpenEventArgs } from '../index';
import { OpenOptions, OpenFailureArgs } from '../common/interface';
import { refreshSheetTabs, completeAction, unProtectSheetPassword } from '../common/event';
import { dialog, importProtectWorkbook, locale, OpenArgs } from '../common/index';
import { Dialog } from '../services/index';
import { openSuccess, openFailure, clearFormulaDependentCells } from '../../workbook/index';
import { L10n } from '@syncfusion/ej2-base';
import { BeforeOpenEventArgs } from '@syncfusion/ej2-popups';

export class Open {
    private parent: Spreadsheet;
    public isImportedFile: boolean = false;
    public preventFormatCheck: boolean;
    public unProtectSheetIdx: number[] = [];
    constructor(parent: Spreadsheet) {
        this.parent = parent;
        this.addEventListener();
        this.renderFileUpload();
        //Spreadsheet.Inject(WorkbookOpen);
    }

    /**
     * Adding event listener for success and failure
     *
     * @returns {void} - Adding event listener for success and failure
     */
    private addEventListener(): void {
        this.parent.on(openSuccess, this.openSuccess, this);
        this.parent.on(openFailure, this.openFailed, this);
    }

    /**
     * Removing event listener for success and failure
     *
     * @returns {void} - Removing event listener for success and failure
     */
    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(openSuccess, this.openSuccess);
            this.parent.off(openFailure, this.openFailed);
        }
    }

    /**
     * Rendering upload component for importing files.
     *
     * @returns {void} - Rendering upload component for importing files.
     */
    private renderFileUpload(): void {
        const uploadID: string = this.parent.element.id + '_fileUpload';
        this.parent.element.appendChild(this.parent.createElement('input', {
            id: uploadID,
            attrs: { type: 'file', accept: '.xls, .xlsx, .csv, .xlsm, .xlsb', name: 'fileUpload' }
        }));
        const uploadBox: HTMLElement = document.getElementById(uploadID);
        uploadBox.onchange = this.fileSelect.bind(this);
        uploadBox.onerror = this.openFailed.bind(this);
        uploadBox.style.display = 'none';
    }

    /**
     * Process after select the excel and image file.
     *
     * @param {Event} args - File select native event.
     * @returns {void} - Process after select the excel and image file.
     */
    private fileSelect(args: Event): void {
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        const filesData: FileList = (args.target as any).files[0];
        if (filesData && filesData.length < 1) {
            return;
        }
        const impArgs: OpenOptions = {
            file: filesData
        };
        this.parent.open(impArgs);
        (document.getElementById(this.parent.element.id + '_fileUpload') as HTMLInputElement).value = '';
    }

    /**
     * File open success event declaration.
     *
     * @param {string} response - File open success response text.
     * @returns {void} - File open success event declaration.
     */
    private openSuccess(response: JsonData): void {
        const openError: string[] = ['UnsupportedFile', 'InvalidUrl', 'NeedPassword', 'InCorrectPassword', 'InCorrectSheetPassword',
            'CorrectSheetPassword', 'DataLimitExceeded', 'FileSizeLimitExceeded'];
        const openCancelFn: Function = (action: string): void => {
            (this.parent.serviceLocator.getService(dialog) as Dialog).hide(true);
            const file: File = new File([], response.guid, { type: action.toLowerCase() });
            this.parent.open(
                <OpenArgs>{ file: file, guid: response.guid, password: response.eventArgs.password, orginalFile: response.eventArgs.file });
        };
        if (openError.indexOf(response.data) > -1) {
            const l10n: L10n = this.parent.serviceLocator.getService(locale);
            if (openError[2] === response.data) {
                if (!this.parent.element.querySelector('.e-importprotectworkbook-dlg')) {
                    this.parent.notify(importProtectWorkbook, response.eventArgs);
                }
            } else if (openError[3] === response.data) {
                const alertSpan: HTMLElement = this.parent.createElement('span', { className: 'e-importprotectpwd-alert-span' });
                alertSpan.innerText = l10n.getConstant('IncorrectPassword');
                (this.parent.element.querySelector('.e-importprotectworkbook-dlg').querySelector('.e-dlg-content')).appendChild(alertSpan);
            } else if (openError[4] === response.data) {
                const alertSpan: HTMLElement = this.parent.createElement('span', { className: 'e-unprotectsheetpwd-alert-span' });
                alertSpan.innerText = l10n.getConstant('IncorrectPassword');
                (this.parent.element.querySelector('.e-unprotectworksheet-dlg').querySelector('.e-dlg-content')).appendChild(alertSpan);
            } else if (openError[5] === response.data){
                this.parent.isOpen = false;
                this.parent.notify(unProtectSheetPassword, null);
                const dialogInst: Dialog = (this.parent.serviceLocator.getService(dialog) as Dialog);
                dialogInst.hide();
                this.parent.hideSpinner();
            }
            else  {
                const dialogInst: Dialog = (this.parent.serviceLocator.getService(dialog) as Dialog);
                dialogInst.hide(true);
                const sizeLimitAlert: boolean = response.data.includes('LimitExceeded');
                (this.parent.serviceLocator.getService(dialog) as Dialog).show({
                    content: (this.parent.serviceLocator.getService('spreadsheetLocale') as L10n)
                        .getConstant(response.data as string),
                    width: '300', buttons: sizeLimitAlert ? [
                        { click: openCancelFn.bind(this, `${response.data}Open`),
                            buttonModel: { content: l10n.getConstant('Ok'), isPrimary: true } },
                        { click: openCancelFn.bind(this, `${response.data}Cancel`),
                            buttonModel: { content: l10n.getConstant('Cancel') } }] : [],
                    beforeOpen: (args: BeforeOpenEventArgs): void => {
                        const dlgArgs: DialogBeforeOpenEventArgs = {
                            dialogName: 'OpenDialog',
                            element: args.element, target: args.target, cancel: args.cancel
                        };
                        this.parent.trigger('dialogBeforeOpen', dlgArgs);
                        if (dlgArgs.cancel) {
                            args.cancel = true;
                        }
                    }
                }, sizeLimitAlert ? true : null);
                this.parent.hideSpinner();
                return;
            }
        } else {
            const dialogInst: Dialog = (this.parent.serviceLocator.getService(dialog) as Dialog);
            dialogInst.hide();
            this.parent.showSpinner();
        }
        if (!this.parent.element) {
            return;
        }
        if (openError[5] !== response.data) {
            if (!response.isOpenFromJson) {
                this.parent.trigger('openComplete', { response: response });
                this.parent.notify(completeAction, { response: response, action: 'import' });
            }
            this.parent.notify(clearFormulaDependentCells, { cellRef: null, isOpen: true });
            if (this.parent.isProtected && this.parent.showSheetTabs && response.isOpenFromJson) {
                this.parent.element.querySelector('.e-add-sheet-tab').setAttribute('disabled', 'true');
                this.parent.element.querySelector('.e-add-sheet-tab').classList.add('e-disabled');
            }
            this.parent.renderModule.refreshSheet(response.isOpenFromJson);
            this.parent.notify(refreshSheetTabs, null);
            this.isImportedFile = true;
            this.preventFormatCheck = response.eventArgs && response.eventArgs.file && (response.eventArgs.file as File).name &&
                !(response.eventArgs.file as File).name.includes('.csv');
            this.unProtectSheetIdx = [];
            this.parent.hideSpinner();
        }
    }

    /**
     * File open failure event declaration.
     *
     * @param {object} args - Open failure arguments.
     * @returns {void} - File open failure event declaration.
     */
    private openFailed(args: OpenFailureArgs): void {
        this.parent.trigger('openFailure', args);
        this.parent.hideSpinner();
        /* Need to Implement */
    }

    /**
     * To Remove the event listeners.
     *
     * @returns {void} - To Remove the event listeners.
     */
    public destroy(): void {
        this.removeEventListener();
        this.parent = null;
    }

    /**
     * Get the sheet open module name.
     *
     * @returns {string} - Get the sheet open module name.
     */
    public getModuleName(): string {
        return 'open';
    }
}

interface JsonData {
    data: string;
    eventArgs: OpenOptions;
    isOpenFromJson: boolean;
    guid?: string;
}
