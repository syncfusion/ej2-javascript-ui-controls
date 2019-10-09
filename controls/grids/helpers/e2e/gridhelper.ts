import { TestHelper } from '@syncfusion/ej2-base/helpers/e2e';
 
/** 
 * Represents the class which contains Helper functions to test Grid component.
 */
export class GridHelper extends TestHelper {
    public id: string;
    public wrapperFn: Function;
    constructor(id: string, wrapperFn: Function) {
        super();
        this.id = id;
        if (wrapperFn !== undefined) {
            this.wrapperFn = wrapperFn
        }
        return this;
    }
    /**     
     * Gets container element of the grid component.
     * @return {Element}
     */
    getDataGridElement() {
        return this.selector('#' + this.id);
    }
    /**     
     * Gets the header element of the grid component.
     * @return {Element}
     */
    getHeaderElement() {
        return this.selector('#' + this.id + '.e-gridheader');
    }
    /**     
     * Gets the content element of the grid component.
     * @return {Element}
     */
    getContentElement() {
        return this.selector('#' + this.id + '.e-gridcontent');
    }
    /**     
     * Gets the footer element of the grid component when [`aggregates`](./aggregates.html) functionality is configured in the grid.
     * @return {Element}
     */
    getFooterElement() {
        return this.selector('#' + this.id + '.e-gridfooter');
    }
    /**     
     * Gets the pager element of the grid component when [`allowPaging`](./api-grid.html#allowpaging) property is set to true.
     * @return {Element}
     */
    getPagerElement() {
        return this.selector('#' + this.id + '.e-gridpager');
    }
    /**     
     * Gets the dialog container of the grid component when edit mode is set as Dialog in the [`editSettings`](./api-grid.html#editSettings) property and grid is in edit state.
     * @return {Element}
     */
    getDialogElement() {
        return this.selector('#' + this.id + '_dialogEdit_wrapper');
   }
   /**     
     * Gets the filter container of the grid component when filter type is set as Menu or CheckBox or Excel in the [`filterSettings`](./api-grid.html#filterSettings) property and popup is in open state.
     * @return {Element}
     */
    getFilterPopupElement() {
        return this.selector('#' + this.id + '.e-filter-popup');
    }
    /**     
     * Gets the toolbar element of the grid component when [`toolbar`](./api-grid.html#toolbar) property is configured in the grid.
     * @return {Element}
     */
    getToolbarElement() {
        return this.selector('#' + this.id + '_toolbarItems');
    }
    /**     
     * Gets the active numeric items's element of pager when [`allowPaging`](./api-grid.html#allowPaging) property is set to true.
     * @return {Element}
     */
    getCurrentPagerElement() {
        return this.selector('#' + this.id + '.e-numericitem.e-currentitem');
    }
    /**     
     * Gets the dropdown element of the grid pager when [`pageSizes`](./api-grid.html#pageSettings) is set to true in [`pageSettings`](./api-grid.html#pageSettings) property of the grid.
     * @return {Element}
     */
    getPagerDropDownElement() {
        return this.selector('#' + this.id + '.e-pagerdropdown');
    }
 
}
