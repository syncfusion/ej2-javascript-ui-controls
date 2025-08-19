import { createElement, remove, isNullOrUndefined } from '@syncfusion/ej2-base';
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
     *
     * @param {Pager} pagerModule - specifies the pagermodule
     * @hidden
     */
    constructor(pagerModule?: Pager) {
        this.pagerModule = pagerModule;
    }

    /**
     * For internal use only - Get the module name.
     *
     * @returns {string} returns the module name
     * @private
     */
    protected getModuleName(): string {
        return 'externalMessage';
    }

    /**
     * The function is used to render pager externalMessage
     *
     * @returns {void}
     * @hidden
     */
    public render(): void {
        this.element = createElement('div', { className: 'e-pagerexternalmsg', attrs: { 'aria-label': this.pagerModule.getLocalizedLabel('ExternalMsg') } });
        this.pagerModule.element.appendChild(this.element);
        this.refresh();
    }

    /**
     * Refreshes the external message of Pager.
     *
     * @returns {void}
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
     *
     * @returns {void}
     */
    public hideMessage(): void {
        if (!isNullOrUndefined(this.element)) {
            this.element.style.display = 'none';
        }
    }

    /**
     * Shows the external message of the Pager.
     *
     * @returns {void}s
     */
    public showMessage(): void {
        this.element.style.display = '';
    }

    /**
     * To destroy the PagerMessage
     *
     * @function destroy
     * @returns {void}
     * @hidden
     */
    public destroy(): void {
        if (this.element && this.element.parentElement) {
            remove(this.element);
        }
    }
}
