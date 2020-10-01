import { SfTreeGrid } from './sf-treegrid-fn';

/**
 * Specifies interfaces for native blazor rendering.
 * @hidden
 */

export interface ITreeGridOptions {
    height: string;
    width: string;
    columns: Column[];
    currentViewData: ITreeData[];
    treeColumnIndex: number;
    idMapping: string;
    parentIdMapping: string;
    childMapping: string;
    hasRowTemplate: boolean;
    hasDetailTemplate: boolean;
    copyHierarchyMode: string;
    allowTextWrap: boolean;
    toolbar: string[];
    rowDropTargetID: string;
    allowRowDragAndDrop: boolean;
    allowPaging: boolean;
    pageSize: number;
    currentPage: number;
}

export interface BlazorTreeGridElement extends HTMLElement {
    blazor_instance: SfTreeGrid;
}

export interface ITreeData {
    /**
     * Specifies the childRecords of a parentData
     */
    childRecords?: ITreeData[];
    /**
     * Specifies whether the record contains child records
     */
    hasChildRecords?: boolean;
   /**
    * Specifies whether the record contains filtered child records
    */
   hasFilteredChildRecords?: boolean;
    /**
     * Specifies whether the child records are expanded
     */
    expanded?: boolean;
    /**
     * Specifies the parentItem of childRecords
     */
    parentRecord?: ITreeData;
    /**
     * Specifies the index of current record
     */
    index?: number;
    /**
     * Specifies the hierarchy level of record
     */
    level?: number;
    /**
     * Specifies the hierarchy level of filtered record
     */
    filterLevel?: number;
    /**
     * Specifies the parentID
     */
    //parentIdMapping?: number;
    /**
     * Specifies the unique ID of a record
     */
    uniqueID?: string;
    /**
     * Specifies the parent Unique ID of a record
     */
    parentUniqueID?: string;
    /**
     * Specifies the checkbox state of a record
     */
    checkboxState?: string;
    /**
     * Specifies the summary of a record
     */
    isSummaryRow?: boolean;
    /**
     * Specifies the main data
     */
    taskData?: ITreeData;
    /**
     * Specifies the Primary data
     */
    primaryParent?: ITreeData;
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
     * @default null    
     */
    valueAccessor?: object;

    /**    
     * Defines the method used to apply custom header cell values from external function and display this on each cell rendered.       
     * @default null
     * @deprecated  
     */
    headerValueAccessor?: object;

    /**    
     * The `filterBarTemplate` is used to add a custom component instead of default input component for filter bar.   
     * It have create and read functions.  
     * * create: It is used for creating custom components.  
     * * read: It is used to perform custom filter action.
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
     * @default null
     */
    commands?: object;


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
