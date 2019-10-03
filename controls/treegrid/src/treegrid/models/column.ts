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

   */

    public field: string;
  /**
   * Defines the header text of column which is used to display in column header.
   * If `headerText` is not defined, then field name value will be assigned to header text.

   */

  public headerText: string;

    /**    
     * Gets the unique identifier value of the column. It is used to get the column object.   

     */

    public uid: string;


    /**    
     * If `allowEditing` set to false, then it disables editing of a particular column. 
     * By default all columns are editable. 

     */

    public allowEditing: boolean = true;

    /**    
     * If `showCheckbox` set to true, then the checkboxes will be displayed in particular column. 

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

     */
    public isPrimaryKey: boolean;
    /**

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

     */
    public commands: CommandModel[];
    /**
     * Defines the width of the column in pixels or percentage.

     */
    public width: string | number;
    /**    
     * Defines the type of component for editable.



     */
    public editType: string;

    /**    
     * Defines rules to validate data before creating and updating.

     */
    public validationRules: Object;

    /**    
     * Defines default values for the component when adding a new record to the TreeGrid.


     */
    public defaultValue: string;

    /**    
     * Defines the `IEditCell` object to customize default edit cell.

     */
    public edit: IEditCell = {};
    /**
     * Defines the cell edit template that used as editor for a particular column.
     * It accepts either template string or HTML element ID.


     */
    public editTemplate: string;
    /**
     * Defines the filter template/UI that used as filter for a particular column.
     * It accepts either template string or HTML element ID.


     */
    public filterTemplate: string;
    /**    
     * If `isIdentity` is set to true, then this column is considered as identity column.

     */
    public isIdentity: boolean;

    /**    
     * Defines the minimum Width of the column in pixels or percentage.    

     */
    public minWidth: string | number;

    /**    
     * Defines the maximum width of the column in pixel or percentage, which will restrict resizing beyond this pixel or percentage.   

     */
    public maxWidth: string | number;

    /**
     * Defines the alignment of the column in both header and content cells.    

     */

    public textAlign: TextAlign;

    /**
     * Defines the cell content's overflow mode. The available modes are
     * * `Clip` -  Truncates the cell content when it overflows its area. 
     * * `Ellipsis` -  Displays ellipsis when the cell content overflows its area.
     * * `EllipsisWithTooltip` - Displays ellipsis when the cell content overflows its area 
     * also it will display tooltip while hover on ellipsis applied cell.

     */
    public clipMode: ClipMode;

    /**   
     * Define the alignment of column header which is used to align the text of column header.       

     */
    public headerTextAlign: TextAlign;

    /**    
     * If `disableHtmlEncode` is set to true, it encodes the HTML of the header and content cells.  

     */

    public disableHtmlEncode: boolean;

    /**    
     * Defines the data type of the column.    



     */

    public type: string;

    /**    
     * It is used to change display value with the given format and does not affect the original data.  
     * Gets the format from the user which can be standard or custom 
     * [`number`](../../../common/internationalization/#supported-format-string) 
     * and [`date`](../../../common/internationalization/#supported-format-string-1) formats.  



     */

    public format: string | NumberFormatOptions | DateFormatOptions;

    /**
     * If `visible` is set to false, hides the particular column. By default, columns are displayed.

     */
    public visible: boolean;

    /**
     * Defines the column template that renders customized element in each cell of the column.
     * It accepts either [template string](../../../common/template-engine/) or HTML element ID.

     */

    public template: string;

    /**
     * Defines the header template as string or HTML element ID which is used to add customized element in the column header.

     */

    public headerTemplate: string;

    /**   
     * You can use this property to freeze selected columns in treegrid

     */

    public isFrozen: boolean;

    /**    
     * The CSS styles and attributes of the content cells of a particular column can be customized. 

     */

    public customAttributes: { [x: string]: Object };

    /**
     * If `displayAsCheckBox` is set to true, it displays the column value as a check box instead of Boolean value.

     */

    public displayAsCheckBox: boolean;

    /**    
     * If `allowReordering` set to false, then it disables reorder of a particular column. 
     * By default all columns can be reorder.   

     */
    public allowReordering: boolean = true;
    /**         
     * If `showColumnMenu` set to false, then it disable the column menu of a particular column.  
     * By default column menu will show for all columns

     */

    public showColumnMenu: boolean = true;

    /**
     * If `allowFiltering` set to false, then it disables filtering option and filter bar element of a particular column. 
     * By default all columns are filterable.      

     */

    public allowFiltering: boolean = true;
    /**    
     * If `allowSorting` set to false, then it disables sorting option of a particular column.    
     * By default all columns are sortable. 

     */
    public allowSorting: boolean = true;

    /**         
     * If `allowResizing` is set to false, it disables resize option of a particular column.  
     * By default all the columns can be resized. 

     */

    public allowResizing: boolean = true;

    /**
     * Defines the method which is used to achieve custom formatting from an external function.
     * This function triggers before rendering of each cell.

     */
    public formatter: { new(): ITreeGridCellFormatter } | ITreeGridCellFormatter | Function;

    /**
     * Defines the method used to apply custom cell values from external function and display this on each cell rendered.

     */

    public valueAccessor: ValueAccessor | string;

    /**    
     * Used to render multiple header rows(stacked headers) on the TreeGrid header.     

     */

    public columns: Column[] | string[] | ColumnModel[];

    /**
     * Column visibility can change based on [`Media Queries`](http://cssmediaqueries.com/what-are-css-media-queries.html).
     * `hideAtMedia` accepts only valid Media Queries.

     */
    public hideAtMedia: string;

    /**
     * The `filterBarTemplate` is used to add a custom component instead of default input component for filter bar.   
     * It have create and read functions.  
     * * create: It is used for creating custom components.  
     * * read: It is used to perform custom filter action. 
     *  

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

     */

    public filter: IFilter = {};
    /**    
     * If `lockColumn` set to true, then it disables Reordering of a particular column.
     * The locked column will be moved to first position.

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

   */

  field?: string;
    /**    
     * Gets the unique identifier value of the column. It is used to get the object.   

     */
    uid?: string;
/**
 * Defines the header text of column which is used to display in column header.
 * If `headerText` is not defined, then field name value will be assigned to header text.

 */

  headerText?: string;

  /**    
   * Defines the width of the column in pixels or percentage.    

   */

  width?: string | number;

  /**    
   * Defines the minimum width of the column in pixels or percentage.    

   */
  minWidth?: string | number;

  /**    
   * Defines the sort comparer property.    

   */

  sortComparer?: SortComparer | string;

  /**    
   * Defines the maximum width of the column in pixels or percentage, which will restrict resizing beyond this pixels or percentage.   

   */
  maxWidth?: string | number;

  /**
   * Defines the alignment of the column in both header and content cells.    




   */

  textAlign?: TextAlign;

  /**    
   * Used to render multiple header rows(stacked headers) on TreeGrid header.          

   */
  columns?: Column[] | string[] | ColumnModel[];

  /**
   * Defines the cell content's overflow mode. The available modes are
   * * `Clip` -  Truncates the cell content when it overflows its area. 
   * * `Ellipsis` -  Displays ellipsis when the cell content overflows its area.
   * * `EllipsisWithTooltip` - Displays ellipsis when the cell content overflows its area 
   * also it will display tooltip while hover on ellipsis applied cell.




   */
  clipMode?: ClipMode;

  /**   
   * Define the alignment of column header which is used to align the text of column header.       






   */
  headerTextAlign?: TextAlign;

  /**    
   * If `disableHtmlEncode` is set to true, it encodes the HTML of the header and content cells.  

   */

  disableHtmlEncode?: boolean;

  /**    
   * Defines the data type of the column.    



   */

  type?: string;

  /**    
   * If `allowReordering` set to false, then it disables reorder of a particular column. 
   * By default all columns can be reorder. 

   */
  allowReordering?: boolean;
  /**
   * If `allowFiltering` set to false, then it disables filtering option and filter bar element of a particular column. 
   * By default all columns are filterable.      

   */
  allowFiltering?: boolean;
    /**    
     * If `allowSorting` set to false, then it disables sorting option of a particular column.  
     * By default all columns are sortable. 

     */
    allowSorting?: boolean;
    /**         
     * If `showColumnMenu` set to false, then it disable the column menu of a particular column.  
     * By default column menu will show for all columns

     */
    showColumnMenu?: boolean;

   /**         
    * If `allowResizing` set to false, it disables resize option of a particular column. 

    */
  allowResizing?: boolean;

  /**    
   * It is used to change display value with the given format and does not affect the original data.  
   * Gets the format from the user which can be standard or custom 
   * [`number`](../../../common/internationalization/#supported-format-string) 
   * and [`date`](../../../common/internationalization/#supported-format-string-1) formats.  



   */

  format?: string | NumberFormatOptions | DateFormatOptions;

  /**
   * If `visible` is set to false, hides the particular column. By default, columns are displayed.

   */
  visible?: boolean;
    /**

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

     */
    commands?: CommandModel[];
  /**
   * Defines the column template that renders customized element in each cell of the column.
   * It accepts either [template string](../../../common/template-engine/) or HTML element ID.   

   */

  template?: string;

  /**        
   * Defines the header template as string or HTML element ID which is used to add customized element in the column header.     

   */

  headerTemplate?: string;

  /**        
   * You can use this property to freeze selected columns in grid.

   */

  isFrozen?: boolean;

  /**    
   * The CSS styles and attributes of the content cells of a particular column can be customized.

   */

  customAttributes?: { [x: string]: Object };

  /**    
   * If `displayAsCheckBox` is set to true, it displays the column value as a check box instead of Boolean value.    

   */

  displayAsCheckBox?: boolean;

  /**
   * Defines the method which is used to achieve custom formatting from an external function.
   * This function triggers before rendering of each cell.

   */
  formatter?: { new(): ITreeGridCellFormatter } | ITreeGridCellFormatter | Function;

  /**
   * Defines the method used to apply custom cell values from external function and display this on each cell rendered.
   *

   */

  valueAccessor?: ValueAccessor | string;

  /**
   * Column visibility can change based on [`Media Queries`](http://cssmediaqueries.com/what-are-css-media-queries.html).
   * `hideAtMedia` accepts only valid Media Queries.

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

     */
    filterBarTemplate?: IFilterUI;
    /**
     *  Defines the filter options to customize filtering for the particular column.

     */
    filter?: IFilter;
    /**    
     * If `isPrimaryKey` is set to true, considers this column as the primary key constraint.   

     */
    isPrimaryKey?: boolean;
    /**    
     * If `showCheckbox` set to true, then the checkboxes will be displayed in particular column. 

     */
    showCheckbox?: boolean;
    /**    
     * Defines the type of component for editing.



     */
    editType?: string;
    /**    
     * Defines default values for the component when adding a new record to the TreeGrid.


     */
    defaultValue?: string;

    /**    
     * Defines the `IEditCell` object to customize default edit cell.

     */
    edit?: IEditCell;
    /**
     * Defines the cell edit template that used as editor for a particular column.
     * It accepts either template string or HTML element ID.

     */
    editTemplate?: string;

    /**
     * Defines the filter template/UI that is used as filter for a particular column.
     * It accepts either template string or HTML element ID.

     */
    filterTemplate?: string;

    /**    
     * If `isIdentity` is set to true, then this column is considered as identity column.

     */
    isIdentity?: boolean;

    /**    
     * Defines rules to validate data before creating and updating.

     */
    validationRules?: Object;
    /**    
     * If `allowEditing` set to false, then it disables editing of a particular column. 
     * By default all columns are editable.   

     */
    allowEditing?: boolean;
    /**
     * If `lockColumn` set to true, then it disables Reordering of a particular column.
     * The locked column will be moved to first position.

     */
    lockColumn?: boolean;
}
