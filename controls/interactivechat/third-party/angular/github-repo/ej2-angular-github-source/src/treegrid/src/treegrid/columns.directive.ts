import { Directive, ViewContainerRef, ContentChildren, ContentChild } from '@angular/core';
import { ComplexBase, ArrayBase, setValue } from '@syncfusion/ej2-angular-base';
import { Template } from '@syncfusion/ej2-angular-base';
import { StackedColumnsDirective } from './stacked-column.directive';

let input: string[] = ['allowEditing', 'allowFiltering', 'allowReordering', 'allowResizing', 'allowSorting', 'clipMode', 'columns', 'commands', 'customAttributes', 'defaultValue', 'disableHtmlEncode', 'displayAsCheckBox', 'edit', 'editTemplate', 'editType', 'enableColumnSpan', 'enableRowSpan', 'field', 'filter', 'filterBarTemplate', 'filterTemplate', 'format', 'formatter', 'freeze', 'headerTemplate', 'headerText', 'headerTextAlign', 'hideAtMedia', 'isFrozen', 'isIdentity', 'isPrimaryKey', 'lockColumn', 'maxWidth', 'minWidth', 'showCheckbox', 'showColumnMenu', 'showInColumnChooser', 'sortComparer', 'template', 'textAlign', 'type', 'uid', 'validationRules', 'valueAccessor', 'visible', 'width'];
let outputs: string[] = [];
/**
 * `e-column` directive represent a column of the Angular TreeGrid. 
 * It must be contained in a TreeGrid component(`ejs-treegrid`). 
 * ```html
 * <ejs-treegrid [dataSource]='data' allowPaging='true' allowSorting='true'> 
 *   <e-columns>
 *    <e-column field='ID' width='100'></e-column>
 *    <e-column field='name' headerText='Name' width='100'></e-column>
 *   </e-columns>
 * </ejs-treegrid>
 * ```
 */
@Directive({
    selector: 'ejs-treegrid>e-columns>e-column',
    inputs: input,
    outputs: outputs,
    standalone: true,
    queries: {
        childColumns: new ContentChild(StackedColumnsDirective),
        template: new ContentChild('template'),
        headerTemplate: new ContentChild('headerTemplate'),
        filter_itemTemplate: new ContentChild('filterItemTemplate'),
        filterTemplate: new ContentChild('filterTemplate'),
        commandsTemplate: new ContentChild('commandsTemplate'),
        editTemplate: new ContentChild('editTemplate')
    }
})
export class ColumnDirective extends ComplexBase<ColumnDirective> {
    public directivePropList: any;
	
    public declare childColumns: any;
    public tags: string[] = ['columns'];
    /** 
     * Defines the type of data stored in the column, which may be string, number, date, or other types.
     * @default null
     */
    public declare type: any;
    /** 
     * Controls whether editing is permitted for the column. By default, all columns are editable.
     * @default true
     */
    public declare allowEditing: any;
    /** 
     * Controls whether the column supports filtering. If set to false, users cannot filter data by this column.
     * @default true
     */
    public declare allowFiltering: any;
    /** 
     * Enables or disables the reordering of this column via drag-and-drop. Allows for dynamic column adjustments.
     * @default true
     */
    public declare allowReordering: any;
    /** 
     * Determines if this column can be resized. If false, the column size is fixed.
     * @default true
     */
    public declare allowResizing: any;
    /** 
     * Specifies whether sorting is enabled for this column. Set to false to prevent sort actions.
     * @default true
     */
    public declare allowSorting: any;
    /** 
     * Determines how overflow content is handled within a cell. Options include: 
     * * `Clip`: Truncates the content. 
     * * `Ellipsis`: Shows ellipsis for overflow. 
     * * `EllipsisWithTooltip`: Shows ellipsis and tooltip on hover.
     * @default Syncfusion.EJ2.Grids.ClipMode.Ellipsis
     * @isenumeration true
     * @asptype Syncfusion.EJ2.Grids.ClipMode
     */
    public declare clipMode: any;
    /** 
     * Allows for the creation of stacked headers by using multiple rows in the grid's header.
     * @default null
     */
    public declare columns: any;
    /** 
     * Provides built-in command button options for cells. Options include Edit, Delete, Save, and Cancel. 
     * Custom command button implementations are possible.
     * 
     * The following code example implements the custom command column.
     *```html
     *<style type="text/css" class="cssStyles">
     *.details-icon:before
     *{
     *   content:"\e74d";
     *}
     *</style>
     *<div id="TreeGrid"></div>
     *```
     *```typescript
     *var gridObj = new TreeGrid({
     *datasource: window.gridData,
     *columns : [
     * { field: 'CustomerID', headerText: 'Customer ID' },
     * { field: 'CustomerName', headerText: 'Customer Name' },
     * {commands: [{buttonOption:{content: 'Details', click: onClick, cssClass: details-icon}}], headerText: 'Customer Details'}
     *]
     *gridObj.appendTo("#TreeGrid");
     *```
     *     
     * @default null
     */
    public declare commands: any;
    /** 
     * Enables the addition of CSS styles and attributes for the content cells in a particular column.
     * @default null
     */
    public declare customAttributes: any;
    /** 
     * Sets default values when new records are added to the TreeGrid involving this column.
     * @default null
     */
    public declare defaultValue: any;
    /** 
     * If set to `true`, the HTML content within header and content cells is encoded to prevent injection attacks.
     * @default true
     */
    public declare disableHtmlEncode: any;
    /** 
     * Displays the column value as a checkbox instead of a Boolean value when set to `true`.
     * @default false
     */
    public declare displayAsCheckBox: any;
    /** 
     * Allows customizing the default edit cell through the `IEditCell` object for more control over editing.
     * @default {}
     */
    public declare edit: any;
    /** 
     * Specifies the component type used for editing cells within this column.
     * @default 'stringedit'
     */
    public declare editType: any;
    /** 
     * Allows treegrid to perform column spanning on the specified column.
     * @default true
     */
    public declare enableColumnSpan: any;
    /** 
     * Allows treegrid to perform row spanning on the specified column.
     * @default true
     */
    public declare enableRowSpan: any;
    /** 
     * Specifies the field name in the data source to which the column is bound. This field is used for operations like sorting and filtering. 
     * The field name must be a valid JavaScript identifier, beginning with a letter and avoiding spaces and special characters.
     * @default 'undefined'
     */
    public declare field: any;
    /** 
     * Customizes filter options for the column, enabling specialized filtering functionality.
     * @default null
     */
    public declare filter: any;
    /** 
     * Allows for a custom component within the filter bar, facilitating advanced filter interfaces. 
     * Includes create and read functions for custom component management.
     * 
     * ```html
     *<div id="TreeGrid"></div>
     *```
     *```typescript
     *let gridObj: TreeGrid = new TreeGrid({
     *dataSource: filterData,
     *columns: [
     *  { field: 'OrderID', headerText: 'Order ID' },
     *  {
     *     field: 'EmployeeID', filterBarTemplate: {
     *        create: (args: { element: Element, column: Column }) => {
     *             let input: HTMLInputElement = document.createElement('input');
     *             input.id = 'EmployeeID';
     *             input.type = 'text';
     *             return input;
     *        },
     *        write: (args: { element: Element, column: Column }) => {
     *            args.element.addEventListener('input', args.column.filterBarTemplate.read as EventListener);
     *        },
     *        read: (args: { element: HTMLInputElement, columnIndex: number, column: Column }) => {
     *            gridObj.filterByColumn(args.element.id, 'equal', args.element.value);
     *       }
     *    }
     *}],
     *  allowFiltering: true
     *});
     *gridObj.appendTo('#TreeGrid');
     *```
     *     
     * @default null
     */
    public declare filterBarTemplate: any;
    /** 
     * Formats the displayed value of the column without affecting the underlying data. Supports standard and custom formats for numbers and dates.
     * 
     * References for [number](https://ej2.syncfusion.com/documentation/common/internationalization#supported-format-string)
     *and [date](https://ej2.syncfusion.com/documentation/common/internationalization#date-formatting) formats.     
     * @default null
     * @asptype string
     */
    public declare format: any;
    /** 
     * Allows for custom cell content formatting using an external method, executed prior to rendering.
     * @default null
     */
    public declare formatter: any;
    /** 
     * Determines which side (left, right, or center) the column should be frozen on.
     * @default Syncfusion.EJ2.Grids.FreezeDirection.None
     * @isenumeration true
     * @asptype Syncfusion.EJ2.Grids.FreezeDirection
     */
    public declare freeze: any;
    /** 
     * Specifies the text displayed in the column header. If omitted, the `field` value is used as the header text.
     * @default 'undefined'
     */
    public declare headerText: any;
    /** 
     * Aligns the text in the column header. By default, the alignment corresponds to other content alignments.
     * @default null
     * @aspdefaultvalueignore 
     * @isenumeration true
     * @asptype Syncfusion.EJ2.Grids.TextAlign
     */
    public declare headerTextAlign: any;
    /** 
     * Adjusts column visibility based on [Media Queries](http://cssmediaqueries.com/what-are-css-media-queries.html). Accepts valid CSS media query strings for responsive adjustments.
     * @default 'undefined'
     */
    public declare hideAtMedia: any;
    /** 
     * Allows the column to be frozen, keeping it stationary while scrolling horizontally through the grid.
     * @default false
     */
    public declare isFrozen: any;
    /** 
     * Identifies the column as an identity column in database terms, if set to `true`.
     * @default false
     */
    public declare isIdentity: any;
    /** 
     * Identifies the column as a primary key if set to `true`, enforcing uniqueness.
     * @default false
     */
    public declare isPrimaryKey: any;
    /** 
     * Prevents column reordering when set to true, locking the column into a set position.
     * @default false
     */
    public declare lockColumn: any;
    /** 
     * Defines the maximum allowable width of the column in pixels or as a percentage, preventing resizing beyond this limit.
     * @default 'undefined'
     */
    public declare maxWidth: any;
    /** 
     * Determines the minimum width of the column in pixels or percentage. This ensures the column does not shrink below this size.
     * @default 'undefined'
     */
    public declare minWidth: any;
    /** 
     * Displays checkboxes in the column when enabled, allowing for selections and certain operations.
     * @default false
     */
    public declare showCheckbox: any;
    /** 
     * Decides if the column menu should be available, providing options for column customization.
     * @default true
     */
    public declare showColumnMenu: any;
    /** 
     * Determines whether the column should appear in the Column Chooser. Set to false to exclude it.
     * @default true
     */
    public declare showInColumnChooser: any;
    /** 
     * Provides a custom sort comparer property to control how sorting is handled for this column's data.
     * @default 'undefined'
     */
    public declare sortComparer: any;
    /** 
     * Specifies the horizontal alignment for the column content and header. Options include alignment to the left, center, or right.
     * @default Syncfusion.EJ2.Grids.TextAlign.Left
     * @isenumeration true
     * @asptype Syncfusion.EJ2.Grids.TextAlign
     */
    public declare textAlign: any;
    /** 
     * Retrieves the unique identifier for the column. This UID is used internally to reference and manipulate the column.
     * @default 'undefined'
     */
    public declare uid: any;
    /** 
     * Establishes validation rules to ensure data integrity during creation and updates.
     * @default null
     */
    public declare validationRules: any;
    /** 
     * Applies custom cell values using an external function, allowing for dynamic display adjustments.
     * @default null
     */
    public declare valueAccessor: any;
    /** 
     * Toggles the visibility of the column. Set to false to hide the column from view. Columns are visible by default.
     * @default true
     */
    public declare visible: any;
    /** 
     * Sets the column's width in pixels or as a percentage. This defines how the column will occupy space in the grid.
     * @default 'undefined'
     */
    public declare width: any;

    constructor(private viewContainerRef:ViewContainerRef) {
        super();
        setValue('currentInstance', this, this.viewContainerRef);
        this.registerEvents(outputs);
        this.directivePropList = input;
    }
}
Template()(ColumnDirective.prototype, 'template');
Template()(ColumnDirective.prototype, 'headerTemplate');
Template()(ColumnDirective.prototype, 'filter_itemTemplate');
Template()(ColumnDirective.prototype, 'filterTemplate');
Template()(ColumnDirective.prototype, 'commandsTemplate');
Template()(ColumnDirective.prototype, 'editTemplate');

/**
 * Column Array Directive
 * @private
 */
@Directive({
    selector: 'ejs-treegrid>e-columns',
    standalone: true,
    queries: {
        children: new ContentChildren(ColumnDirective)
    },
})
export class ColumnsDirective extends ArrayBase<ColumnsDirective> {
    constructor() {
        super('columns');
    }
}