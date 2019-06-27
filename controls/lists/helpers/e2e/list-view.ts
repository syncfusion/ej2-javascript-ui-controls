import { TestHelper } from '@syncfusion/ej2-base/helpers/e2e';

/**
 * E2E test helpers for Listview to easily interact and the test the component
 */
export class ListViewHelper extends TestHelper {
    id: string;
    wrapperFn: Function;

    /**
     * Initialize the Listview E2E helpers
     * @param id Element id of the Listview element
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
     * Used to get root element of the Listview component
     */
    public getElement(): any {
        return this.selector('#' + this.id);
    }

    /**
     * Used to get the child UL Element of the selected parent item (LI) using its `id` from dataSource.
     * **Note: Works only in Nested list.**
     * @param parentId Selected parent `id` from dataSource
     * @example
     * const dataSource = [{
     *   id: '1', text: 'parent',
     *   child: [
     *       { id: '1-1', text: 'child' }
     *   ]
     * }];
     * // After clicking the parent element we can call method like below to get child UL
     * getNestedULElement('1');
     */
    public getNestedULElement(parentId: string) {
        return this.selector(`[pid="${parentId}"]`);
    }

    /**
     * Used to get the root UL element of the listview
     * Works in Normal and Check list
     */
    public getULElement() {
        return this.selector(`#${this.id} > div.e-content > ul:nth-child(1)`);
    }
}
