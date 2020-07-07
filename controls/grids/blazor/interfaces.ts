import { SfGrid } from './sf-grid-fn';
import { SentinelType, Offsets } from './virtual-scroll';
/**
 * contains interfaces
 */
export interface IGridOptions {
    enableRtl: boolean;
    height: string;
    width: string;
    columns: Column[],
    hasDetailTemplate: boolean,
    allowTextWrap: boolean,
    wrapMode: string;
    allowReordering: boolean;
    allowGrouping: boolean;
    groupCount: number;
    allowRowDragAndDrop: boolean;
    hasDropTarget: boolean;
    showDropArea: boolean;
    groupReordering: boolean;
    allowResizing: boolean;
    frozenRows: number;
    frozenColumns: number;
    aggregatesCount: number;
    enableVirtualization: boolean;
    enableColumnVirtualization: boolean;
    editMode: string;
    newRowPosition: string;
    allowPaging: boolean;
    currentPage: number;
    pageSize: number;
    rowHeight: number;
    showGroupedColumn: boolean;
    totalItemCount: number;
    needClientAction: boolean;
    requestType: string;
    enablePersistence: boolean;
    offline: boolean;
    url: string;
    visibleGroupedRowsCount: number;
    isEdit: boolean;
    allowEditing: boolean;
    selectionMode:string;
    cellSelectionMode: string; 
    isPrerendered: boolean;
    clipMode: string;
    rowDropTarget: string;
    selectionType: string;
}

export interface BlazorGridElement extends HTMLElement {
    blazor__instance: SfGrid;
}

export interface ISelectedCell {
    rowIndex: number;
    cellIndexes: number[];
}

export interface Column {

    /**    
     * Defines the field name of column which is mapped with mapping name of DataSource.  
     * The bounded columns can be sort, filter and group etc., 
     * If the `field` name contains “dot”, then it is considered as complex binding. 
     * The `field` name must be a valid JavaScript identifier, 
     * the first character must be an alphabet and should not contain spaces and special characters.
     * @default ''    
     */
    field?: string;

    /**    
     * Gets the unique identifier value of the column. It is used to get the object.   
     * @default ''    
     */
    uid?: string;

    /**    
     * Gets the unique identifier value of the column. It is used to get the object.   
     * @default null    
     */
    index?: number;

    /**    
     * Defines the header text of column which is used to display in column header.    
     * If `headerText` is not defined, then field name value will be assigned to header text.   
     * @default null  
     */
    headerText?: string;

    /**    
     * Defines the width of the column in pixels or percentage.    
     * @default ''    
     */
    width?: string | number;

    /**    
     * Defines the minimum width of the column in pixels or percentage.    
     * @default ''    
     */
    minWidth?: string | number;
    /**    
     * Defines the maximum width of the column in pixel or percentage, which will restrict resizing beyond this pixel or percentage.  
     * @default ''    
     */
    maxWidth?: string | number;
    /**   
     * Defines the alignment of the column in both header and content cells.    
     * @default Left 
     */
    textAlign?: string;

    /**   
     * Defines the cell content's overflow mode. The available modes are
     * * `Clip` -  Truncates the cell content when it overflows its area. 
     * * `Ellipsis` -  Displays ellipsis when the cell content overflows its area.
     * * `EllipsisWithTooltip` - Displays ellipsis when the cell content overflows its area 
     * also it will display tooltip while hover on ellipsis applied cell.
     * @default Ellipsis 
     */
    clipMode?: string;

    /**   
     * Define the alignment of column header which is used to align the text of column header.
     * @aspdefaultvalueignore
     * @blazorDefaultValueIgnore
     * @default null
     */
    headerTextAlign?: object;

    /**    
     * If `disableHtmlEncode` is set to true, it encodes the HTML of the header and content cells.  
     * @default true    
     */
    disableHtmlEncode?: boolean;

    /**    
     * Defines the data type of the column.    
     * @default null   
     * @blazorType ColumnType 
     */
    type?: string;

    /**    
     * It is used to change display value with the given format and does not affect the original data.   
     * Gets the format from the user which can be standard or custom 
     * [`number`](../../common/internationalization/#manipulating-numbers) 
     * and [`date`](../../common/internationalization/#manipulating-datetime) formats.  
     * @default null
     * @aspType string
     * @blazorType string
     */
    format?: string;

    /**    
     * If `visible` is set to false, hides the particular column. By default, all columns are displayed.      
     * @default true    
     */
    visible?: boolean;

    /**
     * Defines the column template that renders customized element in each cell of the column.
     * It accepts either [template string](../../common/template-engine/) or HTML element ID.   
     * @default null    
     */
    template?: string;

    /**        
     * Defines the column template as string or HTML element ID which is used to add customized element in the column header.      
     * @default null         
     */

    headerTemplate?: string;

    /**        
     * You can use this property to freeze selected columns in grid.
     * @default false
     */
    isFrozen?: boolean;

    /**    
     * If `allowSorting` set to false, then it disables sorting option of a particular column.  
     * By default all columns are sortable. 
     * @default true    
     */
    allowSorting?: boolean;

    /**         
     * If `allowResizing` set to false, it disables resize option of a particular column. 
     * @default true    
     */
    allowResizing?: boolean;

    /**         
     * If `showColumnMenu` set to false, then it disable the column menu of a particular column.  
     * By default column menu will show for all columns
     * @default true    
     */

    showColumnMenu?: boolean;

    /**    
     * If `allowFiltering` set to false, then it disables filtering option and filter bar element of a particular column. 
     * By default all columns are filterable.  
     * @default true    
     */
    allowFiltering?: boolean;

    /**    
     * If `allowGrouping` set to false, then it disables grouping of a particular column. 
     * By default all columns are groupable. 
     * @default true   
     */
    allowGrouping?: boolean;

    /**    
     * If `allowReordering` set to false, then it disables reorder of a particular column. 
     * By default all columns can be reorder. 
     * @default true   
     */
    allowReordering?: boolean;

    /**    
     * If `enableGroupByFormat` set to true, then it groups the particular column by formatted values. 
     * By default no columns are group by format.   
     * @default true   
     */
    enableGroupByFormat?: boolean;

    /**    
     * If `allowEditing` set to false, then it disables editing of a particular column. 
     * By default all columns are editable.   
     * @default true   
     */
    allowEditing?: boolean;

    /**
     * @hidden
     * Gets the current view foreign key data.
     * @default [] 
     */
    columnData?: Object[];

    /**   
     * The CSS styles and attributes of the content cells of a particular column can be customized.   
     * 
     * ```html
     * <div id="Grid"></div>
     * ```
     * ```typescript 
     * let gridObj: Grid = new Grid({
     * dataSource: filterData,
     * columns: [
     *    { field: 'OrderID', headerText: 'Order ID' },
     *    {
     *        field: 'EmployeeID', headerText: 'Employee ID', customAttributes: {
     *           class: 'employeeid',
     *           type: 'employee-id-cell'
     *      }
     *   }]
     * });
     * gridObj.appendTo('#Grid');
     * ```
     * 
     * @default null  
     */

    customAttributes?: { [x: string]: Object };

    /**    
     * If `displayAsCheckBox` is set to true, it displays the column value as a check box instead of Boolean value.    
     * @default false    
     */
    displayAsCheckBox?: boolean;

    /**    
     * Defines the column data source  which will act as foreign data source.
     * @default null 
     */
    dataSource?: Object;


    /**    
     * Defines the method used to apply custom cell values from external function and display this on each cell rendered.     
     *     
     * ```html
     * <div id="Grid"></div>
     * ```
     * ```typescript
     * let gridObj: Grid = new Grid({
     * dataSource: [{ EmployeeID: 1, EmployeeName: ['John', 'M'] }, { EmployeeID: 2, EmployeeName: ['Peter', 'A'] }],
     * columns: [
     *     { field: 'EmployeeID', headerText: 'Employee ID' },
     *     { field: 'EmployeeName', headerText: 'Employee First Name', 
     *       valueAccessor: (field: string, data: Object, column: Column) => {
     *             return data['EmployeeName'][0];
     *         },
     *     }]
     * }); 
     * ```
     *  
     * @default null    
     */
    valueAccessor?: object;

    /**    
     * Defines the method used to apply custom header cell values from external function and display this on each cell rendered.     
     *     
     * ```html
     * <div id="Grid"></div>
     * ```
     * ```typescript
     * let gridObj: Grid = new Grid({
     * dataSource: [{ EmployeeID: 1, EmployeeName: ['John', 'M'] }, { EmployeeID: 2, EmployeeName: ['Peter', 'A'] }],
     * columns: [
     *     { field: 'EmployeeID', headerText: 'Employee ID' },
     *     { field: 'EmployeeName', headerText: 'Employee First Name', 
     *       headerValueAccessor: (field: string,column: Column) => {
     *             return "newheadername";
     *         },
     *     }]
     * }); 
     * ```
     *  
     * @default null
     * @deprecated  
     */
    headerValueAccessor?: object;

    /**    
     * The `filterBarTemplate` is used to add a custom component instead of default input component for filter bar.   
     * It have create and read functions.  
     * * create: It is used for creating custom components.  
     * * read: It is used to perform custom filter action. 
     * 
     * ```html
     * <div id="Grid"></div>
     * ```
     * ```typescript 
     * let gridObj: Grid = new Grid({
     * dataSource: filterData,
     * columns: [
     *   { field: 'OrderID', headerText: 'Order ID' },
     *   {
     *      field: 'EmployeeID', filterBarTemplate: {
     *         create: (args: { element: Element, column: Column }) => {                    
     *              let input: HTMLInputElement = document.createElement('input');
     *              input.id = 'EmployeeID';
     *              input.type = 'text';
     *              return input;
     *         },
     *         write: (args: { element: Element, column: Column }) => {                    
     *             args.element.addEventListener('input', args.column.filterBarTemplate.read as EventListener);
     *         },
     *         read: (args: { element: HTMLInputElement, columnIndex: number, column: Column }) => {
     *             gridObj.filterByColumn(args.element.id, 'equal', args.element.value);
     *        }
     *     }
     *  }],
     *   allowFiltering: true
     * });
     * gridObj.appendTo('#Grid');
     * ```
     * 
     * @default null   
     */
    filterBarTemplate?: object;

    /**
     *  Defines the filter options to customize filtering for the particular column.
     *  @default null
     */

    filter?: object;

    /**    
     * Used to render multiple header rows(stacked headers) on the Grid header.          
     * @default null    
     */
    columns?: Column[];

    /**    
     * Defines the tool tip text for stacked headers.    
     * @hidden   
     * @default null    
     */
    toolTip?: string;

    /**    
     * If `isPrimaryKey` is set to true, considers this column as the primary key constraint.   
     * @default false         
     */
    isPrimaryKey?: boolean;

    /**    
     * Defines the type of component for editing.
     * @default 'stringedit'  
     * @blazorType EditType  
     * @blazorDefaultValue EditType.DefaultEdit
     */
    editType?: string;

    /**    
     * `editType`(../../grid/edit/#cell-edit-type-and-its-params) Defines rules to validate data before creating and updating.
     * @default null         
     */
    validationRules?: Object;

    /**    
     * Defines default values for the component when adding a new record to the Grid.
     * @default null      
     * @aspType object   
     * @blazorType object
     */
    defaultValue?: string;

    /**    
     * If `isIdentity` is set to true, then this column is considered as identity column.
     * @default false         
     */
    isIdentity?: boolean;

    /**    
     * Defines the mapping column name of the foreign data source.
     * If it is not defined then the `columns.field` will be considered as mapping column name 
     * @default null         
     */
    foreignKeyField?: string;

    /**    
     * Defines the display column name from the foreign data source which will be obtained from comparing local and foreign data 
     * @default null         
     */
    foreignKeyValue?: string;

    /**
     * column visibility can change based on its [`Media Queries`](http://cssmediaqueries.com/what-are-css-media-queries.html). 
     * `hideAtMedia` accepts only valid Media Queries.
     * @default ''
     */
    hideAtMedia?: string;

    /**    
     * If `showInColumnChooser` set to false, then hides the particular column in column chooser.
     * By default all columns are displayed in column Chooser.
     * @default true
     */
    showInColumnChooser?: boolean;

    /**
     * @hidden
     * Defines the commands column template as string or HTML element ID which is used to add
     * customized command buttons in each cells of the column.        
     */
    commandsTemplate?: string;

    /**
     * `commands` provides an option to display command buttons in every cell.
     * The available built-in command buttons are
     * * Edit - Edit the record.
     * * Delete - Delete the record.
     * * Save - Save the record.
     * * Cancel - Cancel the edit state.
     *
     * The following code example implements the custom command column.
     * ```html
     * <style type="text/css" class="cssStyles">
     * .details-icon:before
     * {
     *    content:"\e74d";
     * }
     * </style>
     * <div id="Grid"></div>
     * ```
     * ```typescript
     * var gridObj = new Grid({
     * datasource: window.gridData,
     * columns : [
     *  { field: 'CustomerID', headerText: 'Customer ID' },
     *  { field: 'CustomerName', headerText: 'Customer Name' },
     *  {commands: [{buttonOption:{content: 'Details', click: onClick, cssClass: details-icon}}], headerText: 'Customer Details'}
     * ]
     * gridObj.appendTo("#Grid");
     * ```
     * @default null
     */
    commands?: object


    /**
     * It defines the custom sort comparer function.
     */
    sortComparer?: object;

    /**
     * @hidden
     * It defines the column is foreign key column or not.
     */
    isForeignColumn?: () => boolean;

    /**
     * Defines the cell edit template that used as editor for a particular column.
     * It accepts either template string or HTML element ID.
     * @aspIgnore
     */
    editTemplate?: string;

    /**
     * Defines the filter template/UI that used as filter for a particular column.
     * It accepts either template string or HTML element ID.
     * @aspIgnore
     */
    filterTemplate?: string;

    /**
     * Defines the mapping column name of the foreign data source.
     * If it is not defined then the `columns.field` will be considered as mapping column name 
     * @default false         
     */
    lockColumn?: boolean;

    /**    
     * If `allowSearching` set to false, then it disables Searching of a particular column.
     * By default all columns allow Searching.
     * @default true   
     */
    allowSearching?: boolean;

    /**
     * If `autoFit` set to true, then the particular column content width will be
     * adjusted based on its content in the initial rendering itself.
     * Setting this property as true is equivalent to calling `autoFitColumns` method in the `dataBound` event.
     * @default false  
     */
    autoFit?: boolean;
}

export interface IPosition {
    x: number;
    y: number;
}

export interface OffsetPosition {
    left: number;
    top: number;
}

/**
 * @hidden
 */
export interface VirtualInfo {
    data?: boolean;
    event?: string;
    block?: number;
    page?: number;
    currentPage?: number;
    direction?: string;
    blockIndexes?: number[];
    columnIndexes?: number[];
    columnBlocks?: number[];
    loadSelf?: boolean;
    loadNext?: boolean;
    nextInfo?: { page?: number };
    sentinelInfo?: SentinelType;
    offsets?: Offsets;
    startIndex?: number;
    endIndex?: number;
}

/**
 * @hidden
 */
export interface InterSection {
    container?: HTMLElement;
    pageHeight?: number;
    debounceEvent?: boolean;
    axes?: string[];
}

/**
 * @hidden
 */
export interface ScrollPositionType {
    top?: number;
    left?: number;
}

export interface IPosition {
    x: number;
    y: number;
}