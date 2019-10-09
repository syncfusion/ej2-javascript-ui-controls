import { TestHelper } from '@syncfusion/ej2-base/helpers/e2e';

/**
 * E2E test helpers for Tooltip to easily interact and the test the component
 */
export class TooltipHelper extends TestHelper {
    id: string;
    wrapperFn: Function;

    /**
     * Initialize the Tooltip E2E helpers
     * @param id Element id of the tooltip element
     * @param wrapperFn Pass the wrapper function
     */
    constructor(id: string, wrapperFn: Function) {
        super();
        this.id = id;
        if (wrapperFn !== undefined) {
            this.wrapperFn = wrapperFn;
        }
        return this;
    }

    /**
     * Used to get root element of the Tooltip component
     */
    public getElement(): any {
        return this.selector('#' + this.id);
    }

    /**
     * Used to get the opened tooltip popup element
     */
    public getTooltipPopup(): any {
        return this.selector(`[id^="${this.id}_"]`);
    }

    /**
     * Used to get the opened tooltip close button.
     * Works only when `isSticky` is enabled
     */
    public getTooltipPopupCloseButton(): any {
        return this.selector(`[id^="${this.id}_"] > div.e-icons.e-tooltip-close`);
    }
}
