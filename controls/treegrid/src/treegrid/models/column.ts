import { TextAlign, ClipMode, ValueAccessor, IFilter, IFilterUI, IEditCell, CommandModel  } from '@syncfusion/ej2-grids';
import { NumberFormatOptions, DateFormatOptions, merge } from '@syncfusion/ej2-base';
import { ITreeGridCellFormatter } from '../base/interface';
import { SortComparer} from '@syncfusion/ej2-grids';

/**
 * Represents TreeGrid `Column` model class.
 */
export class Column {
  /**
   * Defines the field name of column which is mapped with mapping name of DataSource.
   * The bounded columns can be sort, filter etc.,
   * The `field` name must be a valid JavaScript identifier,
   * the first character must be an alphabet and should not contain spaces and special characters.
   * @default 'undefined'
   * @blazorDefaultValue ''
   */

    public field: string;
  /**
   * Defines the header text of column which is used to display in column header.
   * If `headerText` is not defined, then field name value will be assigned to header text.
   * @default 'undefined'
   */

  public headerText: string;

    /**    
     * Gets the unique identifier value of the column. It is used to get the column object.   
     * @default 'undefined'    
     */

    public uid: string;


    /**    
     * If `allowEditing` set to false, then it disables editing of a particular column. 
     * By default all columns are editable. 
     * @default true   
     */

    public allowEditing: boolean = true;

    /**    
     * If `showCheckbox` set to true, then the checkboxes will be displayed in particular column. 
     * @default false   
     */

    public showCheckbox: boolean;

    /**
     * Defines the custom sort comparer function.
     * The sort comparer function has the same functionality like 
     * [`Array.sort`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) sort comparer.
     * {% codeBlock src="grid/sort-comparer-api/index.ts" %}{% endcodeBlock %}
     */

    public sortComparer: SortComparer | string;

    /**    
     * If `isPrimaryKey` is set to true, considers this column as the primary key constraint.   
     * @default false         
     */
    public isPrimaryKey: boolean;
    /**
     * @hidden
     * Defines the commands column template as string or HTML element ID which is used to add
     * customized command buttons in each cells of the column.        
     */
    public commandsTemplate: string;

    /**
     * `commands` provides an option to display command buttons in every cell.
     * The available built-in command buttons are
     * * Edit - Edit the record.
     * * Delete - Delete the record.
     * * Save - Save the record.
     * * Cancel - Cancel the edit state.
     * @default null
     */
    public commands: CommandModel[];
    /**
     * Defines the width of the column in pixels or percentage.
     * @default 'undefined'
     */
    public width: string | number;
    /**    
     * Defines the type of component for editable.
     * @default 'stringedit'
     * @blazorType Syncfusion.Blazor.Grids.EditType
     * @blazorDefaultValue Syncfusion.Blazor.Grids.EditType.DefaultEdit
     */
    public editType: string;

    /**    
     * Defines rules to validate data before creating and updating.
     * @default null         
     */
    public validationRules: Object;

    /**    
     * Defines default values for the component when adding a new record to the TreeGrid.
     * @default null
     * @blazorType object
     */
    public defaultValue: string;

    /**    
     * Defines the `IEditCell` object to customize default edit cell.
     * @default {}         
     */
    public edit: IEditCell = {};
    /**
     * Defines the cell edit template that used as editor for a particular column.
     * It accepts either template string or HTML element ID.
     * @default null
     * @aspIgnore
     */
    public editTemplate: string;
    /**
     * Defines the filter template/UI that used as filter for a particular column.
     * It accepts either template string or HTML element ID.
     * @default null
     * @aspIgnore
     */
    public filterTemplate: string;
    /**    
     * If `isIdentity` is set to true, then this column is considered as identity column.
     * @default false         
     */
    public isIdentity: boolean;

    /**    
     * Defines the minimum Width of the column in pixels or percentage.    
     * @default 'undefined'    
     */
    public minWidth: string | number;

    /**    
     * Defines the maximum width of the column in pixel or percentage, which will restrict resizing beyond this pixel or percentage.   
     * @default 'undefined'    
     */
    public maxWidth: string | number;

    /**
     * Defines the alignment of the column in both header and content cells.    
     * @default Left  
     */

    public textAlign: TextAlign;

    /**
     * Defines the cell content's overflow mode. The available modes are
     * * `Clip` -  Truncates the cell content when it overflows its area. 
     * * `Ellipsis` -  Displays ellipsis when the cell content overflows its area.
     * * `EllipsisWithTooltip` - Displays ellipsis when the cell content overflows its area 
     * also it will display tooltip while hover on ellipsis applied cell.
     * @default Ellipsis
     */
    public clipMode: ClipMode;

    /**   
     * Define the alignment of column header which is used to align the text of column header.       
     * @default null
     */
    public headerTextAlign: TextAlign;

    /**    
     * If `disableHtmlEncode` is set to true, it encodes the HTML of the header and content cells.  
     * @default true    
     */

    public disableHtmlEncode: boolean = true;

    /**    
     * Defines the data type of the column.    
     * @default null
     * @blazorDefaultValueIgnore
     * @blazorType Syncfusion.Blazor.Grids.ColumnType
     */

    public type: string;

    /**    
     * It is used to change display value with the given format and does not affect the original data.  
     * Gets the format from the user which can be standard or custom 
     * [`number`](../../../common/internationalization/#supported-format-string) 
     * and [`date`](../../../common/internationalization/#supported-format-string-1) formats.  
     * @default null  
     * @aspType string
     * @blazorType string  
     */

    public format: string | NumberFormatOptions | DateFormatOptions;

    /**
     * If `visible` is set to false, hides the particular column. By default, columns are displayed.
     * @default true
     */
    public visible: boolean;

    /**
     * Defines the column template that renders customized element in each cell of the column.
     * It accepts either [template string](../../../common/template-engine/) or HTML element ID.
     * @default null
     */

    public template: string;

    /**
     * Defines the header template as string or HTML element ID which is used to add customized element in the column header.
     * @default null
     */

    public headerTemplate: string;

    /**   
     * You can use this property to freeze selected columns in treegrid
     * @default false
     */

    public isFrozen: boolean;

    /**    
     * The CSS styles and attributes of the content cells of a particular column can be customized. 
     * @default null   
     */

    public customAttributes: { [x: string]: Object };

    /**
     * If `displayAsCheckBox` is set to true, it displays the column value as a check box instead of Boolean value.
     * @default false
     */

    public displayAsCheckBox: boolean;

    /**    
     * If `allowReordering` set to false, then it disables reorder of a particular column. 
     * By default all columns can be reorder.   
     * @default true   
     */
    public allowReordering: boolean = true;
    /**         
     * If `showColumnMenu` set to false, then it disable the column menu of a particular column.  
     * By default column menu will show for all columns
     * @default true    
     */

    public showColumnMenu: boolean = true;

    /**
     * If `allowFiltering` set to false, then it disables filtering option and filter bar element of a particular column. 
     * By default all columns are filterable.      
     * @default true    
     */

    public allowFiltering: boolean = true;
    /**    
     * If `allowSorting` set to false, then it disables sorting option of a particular column.    
     * By default all columns are sortable. 
     * @default true    
     */
    public allowSorting: boolean = true;

    /**         
     * If `allowResizing` is set to false, it disables resize option of a particular column.  
     * By default all the columns can be resized. 
     * @default true    
     */

    public allowResizing: boolean = true;

    /**
     * Defines the method which is used to achieve custom formatting from an external function.
     * This function triggers before rendering of each cell.
     * @default null
     */
    public formatter: { new(): ITreeGridCellFormatter } | ITreeGridCellFormatter | Function;

    /**
     * Defines the method used to apply custom cell values from external function and display this on each cell rendered.
     * @default null
     */

    public valueAccessor: ValueAccessor | string;

    /**    
     * Used to render multiple header rows(stacked headers) on the TreeGrid header.     
     * @default null    
     */

    public columns: Column[] | string[] | ColumnModel[];

    /**
     * Column visibility can change based on [`Media Queries`](http://cssmediaqueries.com/what-are-css-media-queries.html).
     * `hideAtMedia` accepts only valid Media Queries.
     * @default 'undefined'
     */
    public hideAtMedia: string;

   /**
    * If `showInColumnChooser` set to false, then hide the particular column in column chooser.
    *  By default all columns are displayed in column Chooser.
    * @default true
    */
   public showInColumnChooser?: boolean;

    /**
     * The `filterBarTemplate` is used to add a custom component instead of default input component for filter bar.   
     * It have create and read functions.  
     * * create: It is used for creating custom components.  
     * * read: It is used to perform custom filter action. 
     *  
     * @default null    
     */

    public filterBarTemplate: IFilterUI;
    /**
     *  It is used to customize the default filter options for a specific columns. 
     * * type -  Specifies the filter type as menu.
     * * ui - to render custom component for specific column it has following functions.
     * * ui.create – It is used for creating custom components. 
     * * ui.read -  It is used for read the value from the component.
     * * ui.write - It is used to apply component model as dynamically.
     * 
     *  @default null
     */

    public filter: IFilter = {};
    /**    
     * If `lockColumn` set to true, then it disables Reordering of a particular column.
     * The locked column will be moved to first position.
     * @default false         
     */
    public lockColumn: boolean;

    constructor(options: ColumnModel) {
      merge(this, options);
    }
}

/**
 * Interface for a TreeGrid class Column
 */
export interface ColumnModel {
  /**
   * Defines the field name of column which is mapped with mapping name of DataSource.
   * The bounded columns can be sort, filter etc.,
   * The `field` name must be a valid JavaScript identifier,
   * the first character must be an alphabet and should not contain spaces and special characters.
   * @default 'undefined'
   * @blazorDefaultValue ''
   */

  field?: string;
    /**    
     * Gets the unique identifier value of the column. It is used to get the object.   
     * @default 'undefined'    
     */
    uid?: string;
/**
 * Defines the header text of column which is used to display in column header.
 * If `headerText` is not defined, then field name value will be assigned to header text.
 * @default 'undefined'
 */

  headerText?: string;

  /**    
   * Defines the width of the column in pixels or percentage.    
   * @default 'undefined'    
   */

  width?: string | number;

  /**    
   * Defines the minimum width of the column in pixels or percentage.    
   * @default 'undefined'    
   */
  minWidth?: string | number;

  /**    
   * Defines the sort comparer property.    
   * @default 'undefined'
   */

  sortComparer?: SortComparer | string;

  /**    
   * Defines the maximum width of the column in pixels or percentage, which will restrict resizing beyond this pixels or percentage.   
   * @default 'undefined'    
   */
  maxWidth?: string | number;

  /**
   * Defines the alignment of the column in both header and content cells.    
   * @default Syncfusion.EJ2.Grids.TextAlign.Left
   * @isEnumeration true
   * @aspType Syncfusion.EJ2.Grids.TextAlign
   * @blazorType Syncfusion.Blazor.Grids.TextAlign
   */

  textAlign?: TextAlign;

  /**    
   * Used to render multiple header rows(stacked headers) on TreeGrid header.          
   * @default null    
   */
  columns?: Column[] | string[] | ColumnModel[];

  /**
   * Defines the cell content's overflow mode. The available modes are
   * * `Clip` -  Truncates the cell content when it overflows its area. 
   * * `Ellipsis` -  Displays ellipsis when the cell content overflows its area.
   * * `EllipsisWithTooltip` - Displays ellipsis when the cell content overflows its area 
   * also it will display tooltip while hover on ellipsis applied cell.
   * @default Syncfusion.EJ2.Grids.ClipMode.Ellipsis
   * @isEnumeration true
   * @aspType Syncfusion.EJ2.Grids.ClipMode
   * @blazorType Syncfusion.Blazor.Grids.ClipMode
   */
  clipMode?: ClipMode;

  /**   
   * Define the alignment of column header which is used to align the text of column header.       
   * @default null
   * @aspDefaultValueIgnore
   * @blazorDefaultValueIgnore
   * @isEnumeration true
   * @aspType Syncfusion.EJ2.Grids.TextAlign
   * @blazorType Syncfusion.Blazor.Grids.TextAlign
   */
  headerTextAlign?: TextAlign;

  /**    
   * If `disableHtmlEncode` is set to true, it encodes the HTML of the header and content cells.  
   * @default true    
   */

  disableHtmlEncode?: boolean;

  /**    
   * Defines the data type of the column.    
   * @default null
   * @blazorType Syncfusion.Blazor.Grids.ColumnType
   * @blazorDefaultValueIgnore
   */

  type?: string;

  /**    
   * If `allowReordering` set to false, then it disables reorder of a particular column. 
   * By default all columns can be reorder. 
   * @default true   
   */
  allowReordering?: boolean;
  /**
   * If `allowFiltering` set to false, then it disables filtering option and filter bar element of a particular column. 
   * By default all columns are filterable.      
   * @default true    
   */
  allowFiltering?: boolean;
    /**    
     * If `allowSorting` set to false, then it disables sorting option of a particular column.  
     * By default all columns are sortable. 
     * @default true    
     */
    allowSorting?: boolean;
    /**         
     * If `showColumnMenu` set to false, then it disable the column menu of a particular column.  
     * By default column menu will show for all columns
     * @default true    
     */
    showColumnMenu?: boolean;

   /**         
    * If `allowResizing` set to false, it disables resize option of a particular column. 
    * @default true    
    */
  allowResizing?: boolean;

  /**    
   * It is used to change display value with the given format and does not affect the original data.  
   * Gets the format from the user which can be standard or custom 
   * [`number`](../../../common/internationalization/#supported-format-string) 
   * and [`date`](../../../common/internationalization/#supported-format-string-1) formats.  
   * @default null  
   * @aspType string
   * @blazorType string  
   */

  format?: string | NumberFormatOptions | DateFormatOptions;

  /**
   * If `visible` is set to false, hides the particular column. By default, columns are displayed.
   * @default true
   */
  visible?: boolean;
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
     * <div id="TreeGrid"></div>
     * ```
     * ```typescript
     * var gridObj = new TreeGrid({
     * datasource: window.gridData,
     * columns : [
     *  { field: 'CustomerID', headerText: 'Customer ID' },
     *  { field: 'CustomerName', headerText: 'Customer Name' },
     *  {commands: [{buttonOption:{content: 'Details', click: onClick, cssClass: details-icon}}], headerText: 'Customer Details'}
     * ]
     * gridObj.appendTo("#TreeGrid");
     * ```
     * @default null
     */
    commands?: CommandModel[];
  /**
   * Defines the column template that renders customized element in each cell of the column.
   * It accepts either [template string](../../../common/template-engine/) or HTML element ID.   
   * @default null    
   */

  template?: string;

  /**        
   * Defines the header template as string or HTML element ID which is used to add customized element in the column header.     
   * @default null
   */

  headerTemplate?: string;

  /**        
   * You can use this property to freeze selected columns in grid.
   * @default false
   */

  isFrozen?: boolean;

  /**    
   * The CSS styles and attributes of the content cells of a particular column can be customized.
   * @default null   
   */

  customAttributes?: { [x: string]: Object };

  /**    
   * If `displayAsCheckBox` is set to true, it displays the column value as a check box instead of Boolean value.    
   * @default false    
   */

  displayAsCheckBox?: boolean;

  /**
   * If `showInColumnChooser` set to false, then hide the particular column in column chooser.
   *  By default all columns are displayed in column Chooser.
   * @default true
   */
  showInColumnChooser?: boolean;

  /**
   * Defines the method which is used to achieve custom formatting from an external function.
   * This function triggers before rendering of each cell.
   * @default null
   */
  formatter?: { new(): ITreeGridCellFormatter } | ITreeGridCellFormatter | Function;

  /**
   * Defines the method used to apply custom cell values from external function and display this on each cell rendered.
   *
   * @default null
   */

  valueAccessor?: ValueAccessor | string;

  /**
   * Column visibility can change based on [`Media Queries`](http://cssmediaqueries.com/what-are-css-media-queries.html).
   * `hideAtMedia` accepts only valid Media Queries.
   * @default 'undefined'
   */
  hideAtMedia?: string;
    /**    
     * The `filterBarTemplate` is used to add a custom component instead of default input component for filter bar.   
     * It have create and read functions.  
     * * create: It is used for creating custom components.  
     * * read: It is used to perform custom filter action. 
     * 
     * ```html
     * <div id="TreeGrid"></div>
     * ```
     * ```typescript 
     * let gridObj: TreeGrid = new TreeGrid({
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
     * gridObj.appendTo('#TreeGrid');
     * ```
     * 
     * @default null   
     */
    filterBarTemplate?: IFilterUI;
    /**
     *  Defines the filter options to customize filtering for the particular column.
     *  @default null
     */
    filter?: IFilter;
    /**    
     * If `isPrimaryKey` is set to true, considers this column as the primary key constraint.   
     * @default false         
     */
    isPrimaryKey?: boolean;
    /**    
     * If `showCheckbox` set to true, then the checkboxes will be displayed in particular column. 
     * @default false   
     */
    showCheckbox?: boolean;
    /**    
     * Defines the type of component for editing.
     * @default 'stringedit'
     * @blazorType Syncfusion.Blazor.Grids.EditType
     * @blazorDefaultValue Syncfusion.Blazor.Grids.EditType.DefaultEdit
     */
    editType?: string;
    /**    
     * Defines default values for the component when adding a new record to the TreeGrid.
     * @default null
     * @blazorType object
     */
    defaultValue?: string;

    /**    
     * Defines the `IEditCell` object to customize default edit cell.
     * @default {}         
     */
    edit?: IEditCell;
    /**
     * Defines the cell edit template that used as editor for a particular column.
     * It accepts either template string or HTML element ID.
     * @aspIgnore
     */
    editTemplate?: string;

    /**
     * Defines the filter template/UI that is used as filter for a particular column.
     * It accepts either template string or HTML element ID.
     * @aspIgnore
     */
    filterTemplate?: string;

    /**    
     * If `isIdentity` is set to true, then this column is considered as identity column.
     * @default false         
     */
    isIdentity?: boolean;

    /**    
     * Defines rules to validate data before creating and updating.
     * @default null         
     */
    validationRules?: Object;
    /**    
     * If `allowEditing` set to false, then it disables editing of a particular column. 
     * By default all columns are editable.   
     * @default true   
     */
    allowEditing?: boolean;
    /**
     * If `lockColumn` set to true, then it disables Reordering of a particular column.
     * The locked column will be moved to first position.
     * @default false         
     */
    lockColumn?: boolean;
}
