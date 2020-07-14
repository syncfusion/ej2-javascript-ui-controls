/**
 * Open properties.
 */
import { Spreadsheet, DialogBeforeOpenEventArgs } from '../index';
import { OpenOptions, OpenFailureArgs } from '../common/interface';
import { refreshSheetTabs, completeAction } from '../common/event';
import { dialog } from '../common/index';
import { Dialog } from '../services/index';
import { openSuccess, openFailure } from '../../workbook/index';
import { L10n } from '@syncfusion/ej2-base';
import { BeforeOpenEventArgs } from '@syncfusion/ej2-popups';

export class Open {
    private parent: Spreadsheet;
    constructor(parent: Spreadsheet) {
        this.parent = parent;
        this.addEventListener();
        this.renderFileUpload();
        //Spreadsheet.Inject(WorkbookOpen);
    }

    /**
     * Adding event listener for success and failure 
     */
    private addEventListener(): void {
        this.parent.on(openSuccess, this.openSuccess, this);
        this.parent.on(openFailure, this.openFailed, this);
    }

    /**
     * Removing event listener for success and failure 
     */
    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(openSuccess, this.openSuccess);
            this.parent.off(openFailure, this.openFailed);
        }
    }

    /**
     * Rendering upload component for importing files.
     */
    private renderFileUpload(): void {
        let uploadID: string = this.parent.element.id + '_fileUpload';
        this.parent.element.appendChild(this.parent.createElement('input', {
            id: uploadID,
            attrs: { type: 'file', accept: '.xls, .xlsx, .csv', name: 'fileUpload' }
        }));
        let uploadBox: HTMLElement = document.getElementById(uploadID);
        uploadBox.onchange = this.fileSelect.bind(this);
        uploadBox.onerror = this.openFailed.bind(this);
        uploadBox.style.display = 'none';
    }

    /**
     * Process after select the excel and image file.
     * @param {Event} args - File select native event.
     */
    private fileSelect(args: Event): void {
        /* tslint:disable-next-line:no-any */
        let filesData: FileList = (args.target as any).files[0];
        if (filesData && filesData.length < 1) {
            return;
        }
        let impArgs: OpenOptions = {
            file: filesData
        };
        this.parent.open(impArgs);
        (document.getElementById(this.parent.element.id + '_fileUpload') as HTMLInputElement).value = '';
    }

    /**
     * File open success event declaration.
     * @param {string} response - File open success response text. 
     */
    private openSuccess(response: JsonData): void {
        let openError: string[] = ['UnsupportedFile', 'InvalidUrl'];
        if (openError.indexOf(response.data) > -1) {
            (this.parent.serviceLocator.getService(dialog) as Dialog).show({
                content: (this.parent.serviceLocator.getService('spreadsheetLocale') as L10n)
                    .getConstant(response.data as string),
                width: '300',
                beforeOpen: (args: BeforeOpenEventArgs): void => {
                    let dlgArgs: DialogBeforeOpenEventArgs = {
                        dialogName: 'OpenDialog',
                        element: args.element, target: args.target, cancel: args.cancel
                    };
                    this.parent.trigger('dialogBeforeOpen', dlgArgs);
                    if (dlgArgs.cancel) {
                        args.cancel = true;
                    }
                },
            });
            this.parent.hideSpinner();
            return;
        }
        if (!this.parent.element) {
            return;
        }
        this.parent.trigger('openComplete', { response: response });
        this.parent.notify(completeAction, {response: response, action: 'import'});
        this.parent.renderModule.refreshSheet();
        this.parent.notify(refreshSheetTabs, this);
        this.parent.hideSpinner();
    }

    /**
     * File open failure event declaration.
     * @param {object} args - Open failure arguments. 
     */
    private openFailed(args: OpenFailureArgs): void {
        this.parent.trigger('openFailure', args);
        this.parent.hideSpinner();
        /* Need to Implement */
    }

    /**
     * To Remove the event listeners.
     */
    public destroy(): void {
        this.removeEventListener();
        this.parent = null;
    }

    /**
     * Get the sheet open module name.
     */
    public getModuleName(): string {
        return 'open';
    }
}

interface JsonData {
    data: string;
}
