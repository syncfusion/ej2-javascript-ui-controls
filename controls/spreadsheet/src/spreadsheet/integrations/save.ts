import { Spreadsheet } from '../index';
import { beginSave, saveCompleted } from '../../workbook/common/event';


/**
 * `Save` module is used to handle the save action in Spreadsheet.
 */
export class Save {
    private parent: Spreadsheet;

    /**
     * Constructor for Save module in Spreadsheet.
     * @private
     */
    constructor(parent: Spreadsheet) {
        this.parent = parent;
        this.addEventListener();
        //Spreadsheet.Inject(WorkbookSave);
    }

    /**
     * To destroy the Save module. 
     * @return {void}
     * @hidden
     */
    public destroy(): void {
        this.removeEventListener();
        this.parent = null;
    }

    private addEventListener(): void {
        this.parent.on(beginSave, this.initiateSave, this);
        this.parent.on(saveCompleted, this.saveCompleted, this);
    }

    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(beginSave, this.initiateSave);
            this.parent.off(saveCompleted, this.saveCompleted);
        }
    }

    /**
     * Get the module name.
     * @returns string
     * @private
     */
    public getModuleName(): string {
        return 'save';
    }

    /**
     * Initiate save process.
     * @hidden
     */
    private initiateSave(args: { [key: string]: Object }): void {
        this.parent.showSpinner();
    }

    /**
     * Save action completed.
     * @hidden
     */
    private saveCompleted(args: { [key: string]: Object }): void {
        this.parent.hideSpinner();
    }
}