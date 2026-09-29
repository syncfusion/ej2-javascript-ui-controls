import { Directive, ViewContainerRef, ContentChildren, ContentChild } from '@angular/core';
import { ComplexBase, ArrayBase, setValue } from '@syncfusion/ej2-angular-base';
import { Template } from '@syncfusion/ej2-angular-base';


let input: string[] = ['allowEditing', 'allowFiltering', 'allowReordering', 'allowResizing', 'allowSorting', 'clipMode', 'customAttributes', 'disableHtmlEncode', 'displayAsCheckBox', 'edit', 'editType', 'field', 'filter', 'filterTemplate', 'format', 'formatter', 'freeze', 'headerTemplate', 'headerText', 'headerTextAlign', 'hideAtMedia', 'isFrozen', 'isPrimaryKey', 'lockColumn', 'maxWidth', 'minWidth', 'showCheckbox', 'showColumnMenu', 'sortComparer', 'template', 'textAlign', 'type', 'validationRules', 'valueAccessor', 'visible', 'width'];
let outputs: string[] = [];
/**
 * `e-column` directive represent a column of the Angular Gantt. 
 * It must be contained in a Gantt component(`ejs-gantt`). 
 * ```html
 * <ejs-gantt [dataSource]='data' allowSelection='true' allowSorting='true'> 
 *   <e-columns>
 *    <e-column field='ID' width='150'></e-column>
 *    <e-column field='taskName' headerText='Task Name' width='200'></e-column>
 *   </e-columns>
 * </ejs-gantt>
 * ```
 */
@Directive({
    selector: 'ejs-gantt>e-columns>e-column',
    inputs: input,
    outputs: outputs,
    standalone: true,
    queries: {
        template: new ContentChild('template'),
        toolbarTemplate: new ContentChild('toolbarTemplate'),
        headerTemplate: new ContentChild('headerTemplate'),
        editTemplate: new ContentChild('editTemplate'),
        filter_itemTemplate: new ContentChild('filterItemTemplate'),
        filterTemplate: new ContentChild('filterTemplate'),
        emptyRecordTemplate: new ContentChild('emptyRecordTemplate')
    }
})
export class ColumnDirective extends ComplexBase<ColumnDirective> {
    public directivePropList: any;
	


    /** 
     * To define column type.
     */
    public declare type: any;
    /** 
     * If `allowEditing` set to false, then it disables editing of a particular column. 
     * By default all columns are editable.
     * @default true
     */
    public declare allowEditing: any;
    /** 
     * If `allowFiltering` set to false, then it disables filtering option and filter bar element of a particular column. 
     * By default all columns are filterable.
     * @default true
     */
    public declare allowFiltering: any;
    /** 
     * If `allowReordering` set to false, then it disables reorder of a particular column. 
     * By default all columns can be reorder.
     * @default true
     */
    public declare allowReordering: any;
    /** 
     * If `allowResizing` is set to false, it disables resize option of a particular column. 
     * By default all the columns can be resized.
     * @default true
     */
    public declare allowResizing: any;
    /** 
     * If `allowSorting` set to false, then it disables sorting option of a particular column. 
     * By default all columns are sortable.
     * @default true
     */
    public declare allowSorting: any;
    /** 
     * Defines the overflow mode for cell content. The available modes are: 
     * * `Clip` -  Truncates the cell content when it overflows its area. 
     * * `Ellipsis` -  Displays an ellipsis when the cell content overflows its area. 
     * * `EllipsisWithTooltip` - Displays an ellipsis when the cell content overflows its area, and shows a tooltip on hover over the ellipsis.
     * @default Syncfusion.EJ2.Grids.ClipMode.EllipsisWithTooltip
     * @isenumeration true
     * @asptype Syncfusion.EJ2.Grids.ClipMode
     */
    public declare clipMode: any;
    /** 
     * The CSS styles and attributes of the content cells of a particular column can be customized.
     * @default null
     */
    public declare customAttributes: any;
    /** 
     * If `disableHtmlEncode` is set to true, it disables HTML encoding for the content of specific column.
     * @default false
     */
    public declare disableHtmlEncode: any;
    /** 
     * If `displayAsCheckBox` is set to true, it displays the column value as a check box instead of Boolean value.
     * @default false
     */
    public declare displayAsCheckBox: any;
    /** 
     * Defines the `IEditCell` object to customize default edit cell.
     * @default {}
     */
    public declare edit: any;
    /** 
     * Defines the type of component used for editing the field.
     * @default 'stringedit'
     */
    public declare editType: any;
    /** 
     * Defines the field name of column which is mapped with mapping name of DataSource. 
     * The `field` name must be a valid JavaScript identifier, 
     * the first character must be an alphabet and should not contain spaces and special characters.
     * @default null
     */
    public declare field: any;
    /** 
     * It is used to customize the default filter options for a specific columns. 
     * * ui - to render custom component for specific column. It has following functions: 
     * * ui.create - It is used for creating custom components. 
     * * ui.read - It is used for read the value from the component. 
     * * ui.write - It is used to apply component model as dynamically.
     * @default null
     */
    public declare filter: any;
    /** 
     * It is used to change display value with the given format and does not affect the original data. 
     * Gets the format from the user which can be standard or custom 
     * [`number`](https://ej2.syncfusion.com/documentation/common/internationalization#number-formatting) 
     * and [`date`](https://ej2.syncfusion.com/documentation/common/internationalization#date-formatting) formats.
     * @default null
     * @asptype string
     */
    public declare format: any;
    /** 
     * Defines the method which is used to achieve custom formatting from an external function. 
     * This function triggers before rendering of each cell.
     * @default null
     */
    public declare formatter: any;
    /** 
     * Determines which side (left, right, or fixed) the column should be frozen on.
     * @default Syncfusion.EJ2.Grids.FreezeDirection.None
     * @isenumeration true
     * @asptype Syncfusion.EJ2.Grids.FreezeDirection
     */
    public declare freeze: any;
    /** 
     * Defines the header text of column which is used to display in column header. 
     * If `headerText` is not defined, then field name value will be assigned to header text.
     * @default null
     */
    public declare headerText: any;
    /** 
     * Define the alignment of column header which is used to align the text of column header.
     * @default Syncfusion.EJ2.Grids.TextAlign.Left
     * @isenumeration true
     * @asptype Syncfusion.EJ2.Grids.TextAlign
     */
    public declare headerTextAlign: any;
    /** 
     * Column visibility can change based on [`Media Queries`](http://cssmediaqueries.com/what-are-css-media-queries.html). 
     * `hideAtMedia` accepts only valid Media Queries.
     * @default null
     */
    public declare hideAtMedia: any;
    /** 
     * Freezes the column if set to `true`.
     * @default false
     */
    public declare isFrozen: any;
    /** 
     * If `isPrimaryKey` is set to true, considers this column as the primary key constraint.
     * @default false
     */
    public declare isPrimaryKey: any;
    /** 
     * Prevents column reordering when set to true, locking the column into a set position.
     * @default false
     */
    public declare lockColumn: any;
    /** 
     * Defines the maximum width of the column in pixel or percentage, which will restrict resizing beyond this pixel or percentage.
     * @default null
     */
    public declare maxWidth: any;
    /** 
     * Defines the minimum width of the column in pixels or percentage.
     * @default null
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
     * Defines the sort comparer property.
     * @default null
     */
    public declare sortComparer: any;
    /** 
     * Defines the alignment of the column in both header and content cells.
     * @default Syncfusion.EJ2.Grids.TextAlign.Left
     * @isenumeration true
     * @asptype Syncfusion.EJ2.Grids.TextAlign
     */
    public declare textAlign: any;
    /** 
     * Defines validation rules for data before creating or updating records. 
     * The rules are used to ensure that data meets specific criteria before it is saved or updated.
     * @default null
     */
    public declare validationRules: any;
    /** 
     * Defines the method used to apply custom cell values from external function and display this on each cell rendered.
     * @default null
     */
    public declare valueAccessor: any;
    /** 
     * If `visible` is set to false, hides the particular column. By default, columns are displayed.
     * @default true
     */
    public declare visible: any;
    /** 
     * Defines the width of the column in pixels or percentage.
     * @default null
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
Template()(ColumnDirective.prototype, 'toolbarTemplate');
Template()(ColumnDirective.prototype, 'headerTemplate');
Template()(ColumnDirective.prototype, 'editTemplate');
Template()(ColumnDirective.prototype, 'filter_itemTemplate');
Template()(ColumnDirective.prototype, 'filterTemplate');
Template()(ColumnDirective.prototype, 'emptyRecordTemplate');

/**
 * Column Array Directive
 * @private
 */
@Directive({
    selector: 'ejs-gantt>e-columns',
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