import { createElement, remove } from '@syncfusion/ej2-base';
import { Pager, IRender } from './pager';

/**
 * `ExternalMessage` module is used to display user provided message.
 */
export class ExternalMessage implements IRender {
    //Internal variables  
    private element: HTMLElement;

    //Module declarations
    private pagerModule: Pager;

    /**
     * Constructor for externalMessage module
     * @param  {Pager} pagerModule?
     * @returns defaultType
     * @hidden
     */
    constructor(pagerModule?: Pager) {
        this.pagerModule = pagerModule;
    }

    /**
     * For internal use only - Get the module name. 
     * @private
     */
    protected getModuleName(): string {
        return 'externalMessage';
    }

    /**
     * The function is used to render pager externalMessage
     * @hidden
     */
    public render(): void {
        this.element = createElement('div', { className: 'e-pagerexternalmsg', attrs: { 'aria-label': 'Pager external message' } });
        this.pagerModule.element.appendChild(this.element);
        this.refresh();
    }

    /**
     * Refreshes the external message of Pager. 
     */
    public refresh(): void {
        if (this.pagerModule.externalMessage && this.pagerModule.externalMessage.toString().length) {
            this.showMessage();
            this.element.innerHTML = this.pagerModule.externalMessage;
        } else {
            this.hideMessage();
        }
    }

    /**
     * Hides the external message of Pager. 
     */
    public hideMessage(): void {
        this.element.style.display = 'none';
    }

    /**
     * Shows the external message of the Pager. 
     */
    public showMessage(): void {
        this.element.style.display = '';
    }

    /**
     * To destroy the PagerMessage
     * @method destroy
     * @return {void} 
     * @hidden 
     */
    public destroy(): void {
        remove(this.element);
    }

}