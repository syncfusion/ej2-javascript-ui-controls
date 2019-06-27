import { TestHelper } from '@syncfusion/ej2-base/helpers/e2e';

/**
 * E2E test helpers for Chips to easily interact and the test the component
 */
export class ChipsHelper extends TestHelper {
    public id: string;
    public wrapperFn: Function;

    /**
     * Initialize the Chips E2E helpers
     * @param id Element id of the Chip element
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
     * Used to get root element of the Chip component
     */
    public getElement() {
        return this.selector('#' + this.id);
    }

    /**
     * Used to get the focused chip element from the chip list.
     */
    public getFocusedChip() {
        return this.selector(`#${this.id} > div.e-chip.e-focused`);
    }

    /**
     * Used to get the active chip element from the chip list.
     */
    public getActiveChip() {
        return this.selector(`#${this.id} > div.e-chip.e-active`);
    }

    /**
     * Used to get N'th chip item from the chip list.
     * N -> value count starts from 1.
     */
    public getNthChip(nthItem: number) {
        return this.selector(`#${this.id} > div:nth-child(${nthItem})`);
    }
}
