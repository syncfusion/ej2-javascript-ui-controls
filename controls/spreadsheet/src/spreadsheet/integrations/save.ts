import { dialog, Spreadsheet, focus } from '../index';
import { beginSave, saveCompleted, saveError } from '../../workbook/common/event';
import { Dialog } from '../services/index';


/**
 * `Save` module is used to handle the save action in Spreadsheet.
 */
export class Save {
    private parent: Spreadsheet;

    /**
     * Constructor for Save module in Spreadsheet.
     *
     * @private
     * @param {Spreadsheet} parent - Specifies the Spreadsheet instance.
     */
    constructor(parent: Spreadsheet) {
        this.parent = parent;
        this.addEventListener();
        //Spreadsheet.Inject(WorkbookSave);
    }

    /**
     * To destroy the Save module.
     *
     * @returns {void}
     * @hidden
     */
    public destroy(): void {
        this.removeEventListener();
        this.parent = null;
    }

    private addEventListener(): void {
        this.parent.on(beginSave, this.initiateSave, this);
        this.parent.on(saveCompleted, this.saveCompleted, this);
        this.parent.on(saveError, this.showErrorDialog, this);
    }

    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(beginSave, this.initiateSave);
            this.parent.off(saveCompleted, this.saveCompleted);
            this.parent.off(saveError, this.showErrorDialog);
        }
    }

    /**
     * Get the module name.
     *
     * @returns {string} - Get the module name.
     * @private
     */
    public getModuleName(): string {
        return 'save';
    }

    /**
     * Initiate save process.
     *
     * @hidden
     * @returns {void} - Initiate save process.
     */
    private initiateSave(): void {
        this.parent.showSpinner();
    }

    /**
     * Save action completed.
     *
     * @hidden
     * @returns {void} - Save action completed.
     */
    private saveCompleted(): void {
        this.parent.hideSpinner();
    }

    private showErrorDialog(args: { content: string }): void {
        const dialogInst: Dialog = this.parent.serviceLocator.getService(dialog) as Dialog;
        dialogInst.show({
            target: this.parent.element, isModal: true, showCloseIcon: true, height: 180, width: 400, content: args.content,
            beforeOpen: (): void => focus(this.parent.element)
        });
    }
}
