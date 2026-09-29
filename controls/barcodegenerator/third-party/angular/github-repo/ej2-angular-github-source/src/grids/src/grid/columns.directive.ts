import { Directive, ViewContainerRef, ContentChildren, ContentChild } from '@angular/core';
import { ComplexBase, ArrayBase, setValue } from '@syncfusion/ej2-angular-base';
import { Template } from '@syncfusion/ej2-angular-base';
import { StackedColumnsDirective } from './stacked-column.directive';

let input: string[] = ['allowEditing', 'allowFiltering', 'allowFormula', 'allowGrouping', 'allowReordering', 'allowResizing', 'allowSearching', 'allowSorting', 'autoFit', 'clipMode', 'columns', 'commands', 'customAttributes', 'dataSource', 'defaultValue', 'disableHtmlEncode', 'displayAsCheckBox', 'edit', 'editTemplate', 'editType', 'enableColumnSpan', 'enableGroupByFormat', 'enableRowSpan', 'field', 'filter', 'filterBarTemplate', 'filterTemplate', 'foreignKeyField', 'foreignKeyValue', 'format', 'formatter', 'freeze', 'headerTemplate', 'headerText', 'headerTextAlign', 'headerValueAccessor', 'hideAtMedia', 'index', 'isFrozen', 'isIdentity', 'isPrimaryKey', 'lockColumn', 'maxWidth', 'minWidth', 'showColumnMenu', 'showInColumnChooser', 'sortComparer', 'template', 'templateOptions', 'textAlign', 'type', 'uid', 'validationRules', 'valueAccessor', 'visible', 'width'];
let outputs: string[] = [];
/**
 * `e-column` directive represent a column of the Angular Grid. 
 * It must be contained in a Grid component(`ejs-grid`). 
 * ```html
 * <ejs-grid [dataSource]='data' allowPaging='true' allowSorting='true'> 
 *   <e-columns>
 *    <e-column field='ID' width='100'></e-column>
 *    <e-column field='name' headerText='Name' width='100'></e-column>
 *   </e-columns>
 * </ejs-grid>
 * ```
 */
@Directive({
    selector: 'ejs-grid>e-columns>e-column',
    inputs: input,
    outputs: outputs,
    standalone: true,
    queries: {
        childColumns: new ContentChild(StackedColumnsDirective),
        template: new ContentChild('template'),
        headerTemplate: new ContentChild('headerTemplate'),
        commandsTemplate: new ContentChild('commandsTemplate'),
        filter_itemTemplate: new ContentChild('filterItemTemplate'),
        editTemplate: new ContentChild('editTemplate'),
        filterTemplate: new ContentChild('filterTemplate')
    }
})
export class ColumnDirective extends ComplexBase<ColumnDirective> {
    public directivePropList: any;
	
    public declare childColumns: any;
    public tags: string[] = ['columns'];
    /** 
     * Defines the column type.
     * 
     * The following values are supported:
     ** string
     ** number
     ** date
     ** datetime
     ** boolean
     ** CheckBox
     ** RowNumber
     *
     *- `CheckBox` renders a checkbox selection column.
     *- `RowNumber` renders a read-only column with automatically generated row numbers.
     *     
     * @default null
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
     * Enables formula entry and evaluation for the column. 
     * When enabled, users can enter formulas directly into the column cells.
     * @default false
     */
    public declare allowFormula: any;
    /** 
     * If `allowGrouping` set to false, then it disables grouping of a particular column. 
     * By default all columns are groupable.
     * @default true
     */
    public declare allowGrouping: any;
    /** 
     * If `allowReordering` set to false, then it disables reorder of a particular column. 
     * By default all columns can be reorder.
     * @default true
     */
    public declare allowReordering: any;
    /** 
     * If `allowResizing` set to false, it disables resize option of a particular column.
     * @default true
     */
    public declare allowResizing: any;
    /** 
     * If `allowSearching` set to false, then it disables Searching of a particular column. 
     * By default all columns allow Searching.
     * @default true
     */
    public declare allowSearching: any;
    /** 
     * If `allowSorting` set to false, then it disables sorting option of a particular column. 
     * By default all columns are sortable.
     * @default true
     */
    public declare allowSorting: any;
    /** 
     * If `autoFit` set to true, then the particular column content width will be 
     * adjusted based on its content in the initial rendering itself. 
     * Setting this property as true is equivalent to calling `autoFitColumns` method in the `dataBound` event.
     * @default false
     */
    public declare autoFit: any;
    /** 
     * Defines the cell content's overflow mode. The available modes are 
     * * `Clip` -  Truncates the cell content when it overflows its area. 
     * * `Ellipsis` -  Displays ellipsis when the cell content overflows its area. 
     * * `EllipsisWithTooltip` - Displays ellipsis when the cell content overflows its area 
     * also it will display tooltip while hover on ellipsis applied cell.
     * @default Ellipsis
     */
    public declare clipMode: any;
    /** 
     * Used to render multiple header rows(stacked headers) on the Grid header.
     * @default null
     */
    public declare columns: any;
    /** 
     * `commands` provides an option to display command buttons in every cell. 
     * The available built-in command buttons are 
     * * Edit - Edit the record. 
     * * Delete - Delete the record. 
     * * Save - Save the record. 
     * * Cancel - Cancel the edit state.
     * 
     * The following code example implements the custom command column.
     *```html
     *<style type="text/css" class="cssStyles">
     *.details-icon:before
     *{
     *   content:"\e74d";
     *}
     *</style>
     *<div id="Grid"></div>
     *```
     *```typescript
     *var gridObj = new Grid({
     *datasource: window.gridData,
     *columns : [
     * { field: 'CustomerID', headerText: 'Customer ID' },
     * { field: 'CustomerName', headerText: 'Customer Name' },
     * {commands: [{buttonOption:{content: 'Details', click: onClick, cssClass: details-icon}}], headerText: 'Customer Details'}
     *]
     *gridObj.appendTo("#Grid");
     *```
     *     
     * @default null
     */
    public declare commands: any;
    /** 
     * The CSS styles and attributes of the content cells of a particular column can be customized.
     * 
     * ```html
     *<div id="Grid"></div>
     *```
     *```typescript
     *let gridObj: Grid = new Grid({
     *dataSource: filterData,
     *columns: [
     *   { field: 'OrderID', headerText: 'Order ID' },
     *   {
     *       field: 'EmployeeID', headerText: 'Employee ID', customAttributes: {
     *          class: 'employeeid',
     *          type: 'employee-id-cell'
     *     }
     *  }]
     *});
     *gridObj.appendTo('#Grid');
     *```
     *     
     * @default null
     */
    public declare customAttributes: any;
    /** 
     * Defines the column data source  which will act as foreign data source.
     * @default null
     */
    public declare dataSource: any;
    /** 
     * Defines default values for the component when adding a new record to the Grid.
     * @default null
     * @asptype object
     */
    public declare defaultValue: any;
    /** 
     * If `disableHtmlEncode` is set to true, it encodes the HTML of the header and content cells.
     * @default true
     */
    public declare disableHtmlEncode: any;
    /** 
     * If `displayAsCheckBox` is set to true, it displays the column value as a check box instead of Boolean value.
     * @default false
     */
    public declare displayAsCheckBox: any;
    /** 
     * Defines the `IEditCell`(../../grid/edit/#cell-edit-template) object to customize default edit cell.
     * @default {}
     */
    public declare edit: any;
    /** 
     * Defines the type of component for editing.
     * @default 'stringedit'
     */
    public declare editType: any;
    /** 
     * Allows grid to perform column spanning on the specified column.
     * @default true
     */
    public declare enableColumnSpan: any;
    /** 
     * If `enableGroupByFormat` set to true, then it groups the particular column by formatted values. 
     * By default no columns are group by format.
     * @default true
     */
    public declare enableGroupByFormat: any;
    /** 
     * Allows grid to perform row spanning on the specified column.
     * @default true
     */
    public declare enableRowSpan: any;
    /** 
     * Defines the field name of column which is mapped with mapping name of DataSource. 
     * The bounded columns can be sort, filter and group etc., 
     * If the `field` name contains “dot”, then it is considered as complex binding. 
     * The `field` name must be a valid JavaScript identifier, 
     * the first character must be an alphabet and should not contain spaces and special characters.
     * @default ''
     */
    public declare field: any;
    /** 
     *  Defines the filter options to customize filtering for the particular column.
     * @default {}
     */
    public declare filter: any;
    /** 
     * The `filterBarTemplate` is used to add a custom component instead of default input component for filter bar. 
     * It have create and read functions. 
     * * create: It is used for creating custom components. 
     * * read: It is used to perform custom filter action.
     * 
     * ```html
     *<div id="Grid"></div>
     *```
     *```typescript
     *let gridObj: Grid = new Grid({
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
     * }],
     *  allowFiltering: true
     *});
     *gridObj.appendTo('#Grid');
     *```
     *     
     * @default null
     */
    public declare filterBarTemplate: any;
    /** 
     * Defines the mapping column name of the foreign data source. 
     * If it is not defined then the `columns.field` will be considered as mapping column name
     * @default null
     */
    public declare foreignKeyField: any;
    /** 
     * Defines the display column name from the foreign data source which will be obtained from comparing local and foreign data
     * @default null
     */
    public declare foreignKeyValue: any;
    /** 
     * It is used to change display value with the given format and does not affect the original data. 
     * Gets the format from the user which can be standard or custom 
     * [`number`](../../common/internationalization/#manipulating-numbers) 
     * and [`date`](../../common/internationalization/#manipulating-datetime) formats.
     * @default null
     * @asptype string
     */
    public declare format: any;
    /** 
     * Defines the method which is used to achieve custom formatting from an external function. 
     * This function triggers before rendering of each cell.
     * 
     * ```html
     *<div id="Grid"></div>
     *```
     *```typescript
     *class ExtendedFormatter implements ICellFormatter {
     *public getValue(column: Column, data: Object): Object {
     *  return '<span style="color:' + (data['Verified'] ? 'green' : 'red') + '"><i>' + data['Verified'] + '</i><span>';
     *}
     *}
     *let gridObj: Grid = new Grid({
     *    dataSource: filterData,
     *    columns: [
     *        { field: 'ShipName', headerText: 'Ship Name' },
     *        { field: 'Verified', headerText: 'Verified Status', formatter: ExtendedFormatter }]
     *});
     *gridObj.appendTo('#Grid');
     *```
     *     
     * @default null
     */
    public declare formatter: any;
    /** 
     * defines which side the column need to freeze 
     * The available built-in freeze directions are 
     * * Left - Freeze the column at left side. 
     * * Right - Freeze the column at right side. 
     * * Fixed - Freeze the column at Center. 
     * * None - Does not freeze the column.
     * @default None
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
     * @aspdefaultvalueignore 
     * @default null
     */
    public declare headerTextAlign: any;
    /** 
     * Defines the method used to apply custom header cell values from external function and display this on each cell rendered.
     * 
     * ```html
     *<div id="Grid"></div>
     *```
     *```typescript
     *let gridObj: Grid = new Grid({
     *dataSource: [{ EmployeeID: 1, EmployeeName: ['John', 'M'] }, { EmployeeID: 2, EmployeeName: ['Peter', 'A'] }],
     *columns: [
     *    { field: 'EmployeeID', headerText: 'Employee ID' },
     *    { field: 'EmployeeName', headerText: 'Employee First Name',
     *      headerValueAccessor: (field: string,column: Column) => {
     *            return "newheadername";
     *        },
     *    }]
     *});
     *```
     *     
     * @default null
     */
    public declare headerValueAccessor: any;
    /** 
     * column visibility can change based on its [`Media Queries`](http://cssmediaqueries.com/what-are-css-media-queries.html). 
     * `hideAtMedia` accepts only valid Media Queries.
     * @default ''
     */
    public declare hideAtMedia: any;
    /** 
     * Gets the unique identifier value of the column. It is used to get the object.
     * @default null
     */
    public declare index: any;
    /** 
     * You can use this property to freeze selected columns in grid.
     * @default false
     */
    public declare isFrozen: any;
    /** 
     * If `isIdentity` is set to true, then this column is considered as identity column.
     * @default false
     */
    public declare isIdentity: any;
    /** 
     * If `isPrimaryKey` is set to true, considers this column as the primary key constraint.
     * @default false
     */
    public declare isPrimaryKey: any;
    /** 
     * Defines the mapping column name of the foreign data source. 
     * If it is not defined then the `columns.field` will be considered as mapping column name
     * @default false
     */
    public declare lockColumn: any;
    /** 
     * Defines the maximum width of the column in pixel or percentage, which will restrict resizing beyond this pixel or percentage.
     * @default ''
     */
    public declare maxWidth: any;
    /** 
     * Defines the minimum width of the column in pixels or percentage.
     * @default ''
     */
    public declare minWidth: any;
    /** 
     * If `showColumnMenu` set to false, then it disable the column menu of a particular column. 
     * By default column menu will show for all columns
     * @default true
     */
    public declare showColumnMenu: any;
    /** 
     * If `showInColumnChooser` set to false, then hides the particular column in column chooser. 
     * By default all columns are displayed in column Chooser.
     * @default true
     */
    public declare showInColumnChooser: any;
    /** 
     * It defines the custom sort comparer function.
     */
    public declare sortComparer: any;
    /** 
     * Determines the behavior of the `aria-label` attribute for cells in template columns. 
     * If enableAriaLabel is set to false, the aria-label attribute is not applied to template column cells, which affects screen reader accessibility.
     * @default {}
     */
    public declare templateOptions: any;
    /** 
     * Defines the alignment of the column in both header and content cells.
     * @default Left
     */
    public declare textAlign: any;
    /** 
     * Gets the unique identifier value of the column. It is used to get the object.
     * @default ''
     */
    public declare uid: any;
    /** 
     * `editType`(../../grid/edit/#cell-edit-type-and-its-params) Defines rules to validate data before creating and updating.
     * @default null
     */
    public declare validationRules: any;
    /** 
     * Defines the method used to apply custom cell values from external function and display this on each cell rendered.
     * 
     * ```html
     *<div id="Grid"></div>
     *```
     *```typescript
     *let gridObj: Grid = new Grid({
     *dataSource: [{ EmployeeID: 1, EmployeeName: ['John', 'M'] }, { EmployeeID: 2, EmployeeName: ['Peter', 'A'] }],
     *columns: [
     *    { field: 'EmployeeID', headerText: 'Employee ID' },
     *    { field: 'EmployeeName', headerText: 'Employee First Name',
     *      valueAccessor: (field: string, data: Object, column: Column) => {
     *            return data['EmployeeName'][0];
     *        },
     *    }]
     *});
     *```
     *     
     * @default null
     */
    public declare valueAccessor: any;
    /** 
     * If `visible` is set to false, hides the particular column. By default, all columns are displayed.
     * @default true
     */
    public declare visible: any;
    /** 
     * Defines the width of the column in pixels or percentage.
     * @default ''
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
Template()(ColumnDirective.prototype, 'commandsTemplate');
Template()(ColumnDirective.prototype, 'filter_itemTemplate');
Template()(ColumnDirective.prototype, 'editTemplate');
Template()(ColumnDirective.prototype, 'filterTemplate');

/**
 * Column Array Directive
 * @private
 */
@Directive({
    selector: 'ejs-grid>e-columns',
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