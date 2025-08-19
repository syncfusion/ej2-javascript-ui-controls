import { TextAlign, ClipMode, ValueAccessor, IFilter, IFilterUI, IEditCell, CommandModel, freezeDirection } from '@syncfusion/ej2-grids';
import { NumberFormatOptions, DateFormatOptions, merge, Property } from '@syncfusion/ej2-base';
import { ITreeGridCellFormatter } from '../base/interface';
import { SortComparer} from '@syncfusion/ej2-grids';
import { TreeGrid } from '..';

/**
 * Represents the "Column" model class for TreeGrid, defining essential properties and functionalities of a column.
 */
export class Column {

    /**
     * Maps the column to a specific field name in the data source.
     * Columns with a defined `field` can be used for sorting, filtering, etc.
     * The `field` name should conform to valid JavaScript identifiers - starting with an alphabet, avoiding spaces and special characters.
     *
     * @default 'undefined'
     */
    public field: string;

    /**
     * Specifies the text displayed in the column header. If not provided, the `field` value will be used.
     *
     * @default 'undefined'
     */
    public headerText: string;

    /**
     * Unique identifier for the column, used to reference the column object.
     *
     * @default 'undefined'
     */
    public uid: string;

    /**
     * Allows or disallows editing of the column. Set to `false` to make a column non-editable.
     * By default, all columns are editable.
     *
     * @default true
     */
    public allowEditing: boolean = true;

    /**
     * When set to `true`, checkboxes are displayed within the column.
     *
     * @default false
     */
    public showCheckbox: boolean;

    /**
     * Custom sort comparer function for the column. Similar to the `Array.sort` comparer function.
     */
    public sortComparer: SortComparer | string;

    /**
     * Designates this column as a primary key if set to `true`.
     *
     * @default false
     */
    public isPrimaryKey: boolean;

    /**
     * @hidden
     * Specifies a template for command buttons in column cells, either as an HTML element ID or a string.
     *
     * @aspType string
     */
    public commandsTemplate: string | Function;

    /**
     * Options for displaying command buttons in each column cell.
     * Built-in options include:
     * * Edit - Modify the record.
     * * Delete - Remove the record.
     * * Save - Preserve changes to the record.
     * * Cancel - Undo changes.
     *
     * @default null
     */
    public commands: CommandModel[];

    /**
     * Specifies the column width in pixels or percentage.
     *
     * @default 'undefined'
     */
    public width: string | number;

    /**
     * Defines the editor type for the column.
     *
     * @default 'stringedit'
     */
    public editType: string;

    /**
     * Rules for validating data during creation and updation.
     *
     * @default null
     */
    public validationRules: Object;

    /**
     * Default value to use when adding a new record to the TreeGrid.
     *
     * @default null
     */
    public defaultValue: string;

    /**
     * Customization options for the edit cell.
     *
     * @default {}
     */
    public edit: IEditCell = {};

    /**
     * Template for the cell editor of this column, either as a string or an HTML element ID.
     *
     * @default null
     * @aspIgnore
     */
    public editTemplate: string | Function;

    /**
     * Filter template/UI for the column, either as a string or an HTML element ID.
     *
     * @default null
     * @aspIgnore
     */
    public filterTemplate: string | Function;

    /**
     * Marks the column as an identity column if set to `true`.
     *
     * @default false
     */
    public isIdentity: boolean;

    /**
     * Minimum width of the column in pixels or percentage.
     *
     * @default 'undefined'
     */
    public minWidth: string | number;

    /**
     * Maximum width of the column in pixels or percentage, preventing resizing beyond this value.
     *
     * @default 'undefined'
     */
    public maxWidth: string | number;

    /**
     * Alignment for the text in both header and content cells.
     *
     * @default Left
     */
    public textAlign: TextAlign;

    /**
     * Sets how cell content should overflow:
     * * `Clip` - Truncates overflow content.
     * * `Ellipsis` - Shows ellipsis for overflow content.
     * * `EllipsisWithTooltip` - Shows ellipsis with a tooltip on hover when content overflows.
     *
     * @default Ellipsis
     */
    public clipMode: ClipMode;

    /**
     * Text alignment specifically for the column header.
     *
     * @default null
     */
    public headerTextAlign: TextAlign;

    /**
     * When set to `true`, encodes HTML content in headers and cells to prevent HTML injection.
     *
     * @default true
     */
    public disableHtmlEncode: boolean = true;

    /**
     * Specifies the data type of the column.
     *
     * @default null
     */
    public type: string;

    /**
     * Allows display format customization, affecting only the display, not the actual data.
     * Supported format options for numbers and dates can be provided.
     *
     * References for [number](https://ej2.syncfusion.com/documentation/common/internationalization/#supported-format-string)
     * and [date](https://ej2.syncfusion.com/documentation/common/internationalization#date-formatting) formats.
     *
     * @default null
     * @aspType string
     */
    public format: string | NumberFormatOptions | DateFormatOptions;

    /**
     * Determines column visibility. When set to `false`, the column is hidden. By default, columns are visible.
     *
     * @default true
     */
    public visible: boolean;

    /**
     * Custom element rendering in each column cell. Accepts template strings or HTML element IDs.
     *
     * @default null
     * @aspType string
     */
    public template: string | Function;

    /**
     * Template for a customized header element, either as a string or an HTML element ID.
     *
     * @default null
     * @aspType string
     */
    public headerTemplate: string | Function;

    /**
     * Freezes the column if set to `true`.
     *
     * @default false
     */
    public isFrozen: boolean;

    /**
     * Custom styles and attributes for the content cells of the column.
     *
     * @default null
     */
    public customAttributes: { [x: string]: Object };

    /**
     * Displays column values as checkboxes if set to `true`, instead of Boolean values.
     *
     * @default false
     */
    public displayAsCheckBox: boolean;

    /**
     * Disables column reordering if set to `false`. By default, columns can be reordered.
     *
     * @default true
     */
    public allowReordering: boolean = true;

    /**
     * Disables column menu for the column if set to `false`. By default, column menus are enabled for all columns.
     *
     * @default true
     */
    public showColumnMenu: boolean = true;

    /**
     * Disables filtering for the column if set to `false`. By default, columns are filterable.
     *
     * @default true
     */
    public allowFiltering: boolean = true;

    /**
     * Disables sorting for the column if set to `false`. By default, columns are sortable.
     *
     * @default true
     */
    public allowSorting: boolean = true;

    /**
     * Disables resizing for the column if set to `false`. By default, columns can be resized.
     *
     * @default true
     */
    public allowResizing: boolean = true;

    /**
     * Method for applying custom formatting to cell content prior to rendering.
     *
     * @default null
     */
    public formatter: { new(): ITreeGridCellFormatter } | ITreeGridCellFormatter | Function;

    /**
     * Method for customizing cell values using an external function, applied during cell rendering.
     *
     * @default null
     */
    public valueAccessor: ValueAccessor | string;

    /**
     * Facilitates multiple header rows (stacked headers) in the TreeGrid header.
     *
     * @default null
     */
    public columns: Column[] | string[] | ColumnModel[];

    /**
     * Adjusts column visibility based on [Media Queries](http://cssmediaqueries.com/what-are-css-media-queries.html). Accepts valid media query strings.
     *
     * @default 'undefined'
     */
    public hideAtMedia: string;

    /**
     * Excludes the column from the column chooser if set to `false`. By default, columns are included.
     *
     * @default true
     */
    public showInColumnChooser?: boolean;

    /**
     * Replaces the default input component for the filter bar with a custom component. Contains `create` and `read` functions for component management.
     *
     * @default null
     */
    public filterBarTemplate: IFilterUI;

    /**
     * Customize default filter options for a specific column, providing types and UI definitions for custom components.
     *
     * @default null
     */
    public filter: IFilter = {};

    /**
     * Locks the column to its position, preventing reordering, if set to `true`. Locked columns appear first.
     *
     * @default false
     */
    public lockColumn: boolean;

    /**
     * Dictates the column freeze position. Options include:
     * * `Left` - Freeze the column on the left.
     * * `Right` - Freeze the column on the right.
     * * `Fixed` - Freeze the column in the center.
     *
     * @default null
     */
    public freeze: freezeDirection;

    private parent: TreeGrid;

    constructor(options: ColumnModel) {
        merge(this, options);
    }

    /**
     * Reflects state changes for TreeGrid column directives, particularly in React.
     *
     * @param {Column} column - The column to update.
     * @returns {void}
     * @hidden
     */
    private setProperties(column: Column): void {
        const keys: string[] = Object.keys(column);
        for (let i: number = 0; i < keys.length; i++) {
            this[keys[parseInt(i.toString(), 10)]] = column[keys[parseInt(i.toString(), 10)]];
            if (this.parent && this.parent['isReact'] && keys[parseInt(i.toString(), 10)] === 'template') {
                const refreshReactColumnTemplateByUid: string = 'refreshReactColumnTemplateByUid';
                this.parent.clipboardModule['treeGridParent'].renderModule[`${refreshReactColumnTemplateByUid}`](this.uid);
            }
        }
    }
}

/**
 * Interface for a TreeGrid class Column
 */
export interface ColumnModel {

    /**
     * Specifies the field name in the data source to which the column is bound. This field is used for operations like sorting and filtering.
     * The field name must be a valid JavaScript identifier, beginning with a letter and avoiding spaces and special characters.
     *
     * @default 'undefined'
     */
    field?: string;

    /**
     * Retrieves the unique identifier for the column. This UID is used internally to reference and manipulate the column.
     *
     * @default 'undefined'
     */
    uid?: string;

    /**
     * Specifies the text displayed in the column header. If omitted, the `field` value is used as the header text.
     *
     * @default 'undefined'
     */
    headerText?: string;

    /**
     * Sets the column's width in pixels or as a percentage. This defines how the column will occupy space in the grid.
     *
     * @default 'undefined'
     */
    width?: string | number;

    /**
     * Determines the minimum width of the column in pixels or percentage. This ensures the column does not shrink below this size.
     *
     * @default 'undefined'
     */
    minWidth?: string | number;

    /**
     * Provides a custom sort comparer property to control how sorting is handled for this column's data.
     *
     * @default 'undefined'
     */
    sortComparer?: SortComparer | string;

    /**
     * Defines the maximum allowable width of the column in pixels or as a percentage, preventing resizing beyond this limit.
     *
     * @default 'undefined'
     */
    maxWidth?: string | number;

    /**
     * Specifies the horizontal alignment for the column content and header. Options include alignment to the left, center, or right.
     *
     * @default Syncfusion.EJ2.Grids.TextAlign.Left
     * @isEnumeration true
     * @aspType Syncfusion.EJ2.Grids.TextAlign
     */
    textAlign?: TextAlign;

    /**
     * Allows for the creation of stacked headers by using multiple rows in the grid's header.
     *
     * @default null
     */
    columns?: Column[] | string[] | ColumnModel[];

    /**
     * Determines how overflow content is handled within a cell. Options include:
     * * `Clip`: Truncates the content.
     * * `Ellipsis`: Shows ellipsis for overflow.
     * * `EllipsisWithTooltip`: Shows ellipsis and tooltip on hover.
     *
     * @default Syncfusion.EJ2.Grids.ClipMode.Ellipsis
     * @isEnumeration true
     * @aspType Syncfusion.EJ2.Grids.ClipMode
     */
    clipMode?: ClipMode;

    /**
     * Aligns the text in the column header. By default, the alignment corresponds to other content alignments.
     *
     * @default null
     * @aspDefaultValueIgnore
     * @isEnumeration true
     * @aspType Syncfusion.EJ2.Grids.TextAlign
     */
    headerTextAlign?: TextAlign;

    /**
     * If set to `true`, the HTML content within header and content cells is encoded to prevent injection attacks.
     *
     * @default true
     */
    disableHtmlEncode?: boolean;

    /**
     * Defines the type of data stored in the column, which may be string, number, date, or other types.
     *
     * @default null
     */
    type?: string;

    /**
     * Enables or disables the reordering of this column via drag-and-drop. Allows for dynamic column adjustments.
     *
     * @default true
     */
    allowReordering?: boolean;

    /**
     * Controls whether the column supports filtering. If set to false, users cannot filter data by this column.
     *
     * @default true
     */
    allowFiltering?: boolean;

    /**
     * Specifies whether sorting is enabled for this column. Set to false to prevent sort actions.
     *
     * @default true
     */
    allowSorting?: boolean;

    /**
     * Decides if the column menu should be available, providing options for column customization.
     *
     * @default true
     */
    showColumnMenu?: boolean;

    /**
     * Determines if this column can be resized. If false, the column size is fixed.
     *
     * @default true
     */
    allowResizing?: boolean;

    /**
     * Formats the displayed value of the column without affecting the underlying data. Supports standard and custom formats for numbers and dates.
     *
     * References for [number](https://ej2.syncfusion.com/documentation/common/internationalization/#supported-format-string)
     * and [date](https://ej2.syncfusion.com/documentation/common/internationalization#date-formatting) formats.
     * @default null
     * @aspType string
     */
    format?: string | NumberFormatOptions | DateFormatOptions;

    /**
     * Toggles the visibility of the column. Set to false to hide the column from view. Columns are visible by default.
     *
     * @default true
     */
    visible?: boolean;

    /**
     * @hidden
     * Specifies a string or HTML element ID for templates to add custom command buttons within cells.
     *
     * @aspType string
     */
    commandsTemplate?: string | Function;

    /**
     * Provides built-in command button options for cells. Options include Edit, Delete, Save, and Cancel.
     * Custom command button implementations are possible.
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
     *
     * @default null
     */
    commands?: CommandModel[];

    /**
     * Customizes the rendering of cell content using either a template string or HTML element ID.
     *
     * @default null
     * @aspType string
     */
    template?: string | Function;

    /**
     * Customizes the header content with a template, defined as a string or an HTML element ID.
     *
     * @default null
     * @aspType string
     */
    headerTemplate?: string | Function;

    /**
     * Allows the column to be frozen, keeping it stationary while scrolling horizontally through the grid.
     *
     * @default false
     */
    isFrozen?: boolean;

    /**
     * Enables the addition of CSS styles and attributes for the content cells in a particular column.
     *
     * @default null
     */
    customAttributes?: { [x: string]: Object };

    /**
     * Displays the column value as a checkbox instead of a Boolean value when set to `true`.
     *
     * @default false
     */
    displayAsCheckBox?: boolean;

    /**
     * Allows for custom cell content formatting using an external method, executed prior to rendering.
     *
     * @default null
     */
    formatter?: { new(): ITreeGridCellFormatter } | ITreeGridCellFormatter | Function;

    /**
     * Determines whether the column should appear in the Column Chooser. Set to false to exclude it.
     *
     * @default true
     */
    showInColumnChooser?: boolean;

    /**
     * Applies custom cell values using an external function, allowing for dynamic display adjustments.
     *
     * @default null
     */
    valueAccessor?: ValueAccessor | string;

    /**
     * Adjusts column visibility based on [Media Queries](http://cssmediaqueries.com/what-are-css-media-queries.html). Accepts valid CSS media query strings for responsive adjustments.
     *
     * @default 'undefined'
     */
    hideAtMedia?: string;

    /**
     * Allows for a custom component within the filter bar, facilitating advanced filter interfaces.
     * Includes create and read functions for custom component management.
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
     * }],
     *   allowFiltering: true
     * });
     * gridObj.appendTo('#TreeGrid');
     * ```
     *
     * @default null
     */
    filterBarTemplate?: IFilterUI;

    /**
     * Customizes filter options for the column, enabling specialized filtering functionality.
     *
     * @default null
     */
    filter?: IFilter;

    /**
     * Identifies the column as a primary key if set to `true`, enforcing uniqueness.
     *
     * @default false
     */
    isPrimaryKey?: boolean;

    /**
     * Displays checkboxes in the column when enabled, allowing for selections and certain operations.
     *
     * @default false
     */
    showCheckbox?: boolean;

    /**
     * Specifies the component type used for editing cells within this column.
     *
     * @default 'stringedit'
     */
    editType?: string;

    /**
     * Sets default values when new records are added to the TreeGrid involving this column.
     *
     * @default null
     */
    defaultValue?: string;

    /**
     * Allows customizing the default edit cell through the `IEditCell` object for more control over editing.
     *
     * @default {}
     */
    edit?: IEditCell;

    /**
     * Provides a template for editing cells in this column, supporting either a template string or an HTML element ID.
     *
     * @aspIgnore
     */
    editTemplate?: string | Function;

    /**
     * Specifies a custom template or UI for filtering within this column, utilizing either string templates or HTML element IDs.
     *
     * @aspIgnore
     */
    filterTemplate?: string | Function;

    /**
     * Identifies the column as an identity column in database terms, if set to `true`.
     *
     * @default false
     */
    isIdentity?: boolean;

    /**
     * Establishes validation rules to ensure data integrity during creation and updates.
     *
     * @default null
     */
    validationRules?: Object;

    /**
     * Controls whether editing is permitted for the column. By default, all columns are editable.
     *
     * @default true
     */
    allowEditing?: boolean;

    /**
     * Prevents column reordering when set to true, locking the column into a set position.
     *
     * @default false
     */
    lockColumn?: boolean;

    /**
     * Determines which side (left, right, or center) the column should be frozen on.
     *
     * @default Syncfusion.EJ2.Grids.FreezeDirection.None
     * @isEnumeration true
     * @aspType Syncfusion.EJ2.Grids.FreezeDirection
     */
    freeze?: freezeDirection;
}

/**
 * Defines TreeGrid column
 */
export class TreeGridColumn extends Column {
    /**
     * Defines stacked columns
     *
     * @default null
     */
    @Property(null)
    public columns: string[] | ColumnModel[];
}

/**
 * Interface for a class TreeGridColumn
 */
export interface TreeGridColumnModel extends ColumnModel {
    /**
     * Defines stacked columns
     *
     * @default null
     */
    columns?: string[] | ColumnModel[];
}

/**
 * Defines stacked tree grid column
 */
export class StackedColumn extends TreeGridColumn {}

/**
 * Interface for a class stacked tree grid column
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface StackedColumnModel extends TreeGridColumnModel {}
