import { Component, NumberFormatOptions, DateFormatOptions, EmitType, KeyboardEventArgs, L10n } from '@syncfusion/ej2-base';
import { Query, DataManager, Group } from '@syncfusion/ej2-data';
import { ItemModel, MenuItemModel, BeforeOpenCloseMenuEventArgs, MenuEventArgs } from '@syncfusion/ej2-navigations';
import { ButtonModel } from '@syncfusion/ej2-buttons';
import { Column, ColumnModel } from '../models/column';
import {
    SortSettingsModel, TextWrapSettingsModel, SelectionSettingsModel,
    FilterSettingsModel, SearchSettingsModel
} from './grid-model';
import { PageSettingsModel, AggregateRowModel } from '../models/models';
import { RowDropSettingsModel, GroupSettingsModel, GridModel, EditSettingsModel } from './grid-model';
import { Cell } from '../models/cell';
import { Row } from '../models/row';
import { GridLine, Action, CellType, SortDirection, PrintMode, ToolbarItems, CommandButtonType, ContextMenuItem } from './enum';
import { MultipleExportType, ExportType, ExcelHAlign, ExcelVAlign, BorderLineStyle, ToolbarItem } from './enum';
import { PredicateModel } from './grid-model';
import { SentinelType, Offsets } from './type';
import { CheckState, ColumnQueryModeType } from './enum';
import { Edit } from '../actions/edit';
import { Resize } from '../actions/resize';
import { DropDownListModel } from '@syncfusion/ej2-dropdowns';
import { NumericTextBoxModel } from '@syncfusion/ej2-inputs';
import { FormValidator } from '@syncfusion/ej2-inputs';
import { Data } from '../actions/data';
import { DatePickerModel } from '@syncfusion/ej2-calendars';
import { Matrix } from '../services/focus-strategy';
import { CheckBoxFilter } from '../actions/checkbox-filter';
import {
    PdfPageSize, PageOrientation, ContentType, PdfPageNumberType, PdfDashStyle,
    PdfHAlign, PdfVAlign
} from './enum';
import { FlMenuOptrUI } from '../renderer/filter-menu-operator';
import { Dialog, DialogModel } from '@syncfusion/ej2-popups';
import { Render } from '../renderer/render';

/**
 * Specifies grid interfaces.
 * @hidden
 */
export interface IGrid extends Component<HTMLElement> {

    //public properties    
    currentViewData?: Object[];

    /**
     * Specifies the columns for Grid.
     * @default []
     */
    columns?: Column[] | string[] | ColumnModel[];

    /**
     * Specifies whether the enableAltRow is enable or not.
     * @default null
     */
    enableAltRow?: boolean;

    /**
     * Specifies whether the enable row hover is enable or not.
     * @default null
     */
    enableHover?: boolean;

    /**
     * Specifies the allowKeyboard Navigation for the Grid.
     * @default null
     */
    allowKeyboard?: boolean;

    /**
     * Specifies whether the allowTextWrap is enabled or not.
     * @default null
     */
    allowTextWrap?: boolean;

    /**
     * Specifies the 'textWrapSettings' for Grid.
     * @default []
     */
    textWrapSettings?: TextWrapSettingsModel;

    /**
     * Specifies whether the paging is enable or not.
     * @default null
     */
    allowPaging?: boolean;

    /**
     * Specifies the pageSettings for Grid.
     * @default PageSettings
     */
    pageSettings?: PageSettingsModel;

    enableVirtualization: boolean;

    enableColumnVirtualization: boolean;

    /**
     * Specifies whether the sorting is enable or not.
     * @default null
     */
    allowSorting?: boolean;

    /**
     * Specifies whether the multi-sorting is enable or not.
     * @default null
     */
    allowMultiSorting?: boolean;

    /**
     * Specifies the sortSettings for Grid.
     * @default []
     */
    sortSettings?: SortSettingsModel;

    /**
     * Specifies whether the Excel exporting is enable or not.
     * @default null
     */
    allowExcelExport?: boolean;
    /**
     * Specifies whether the Pdf exporting is enable or not.
     * @default null
     */
    allowPdfExport?: boolean;

    /**
     * Specifies whether the selection is enable or not.
     * @default null
     */
    allowSelection?: boolean;

    /**   
     * It is used to select the row while initializing the grid.
     * @default -1       
     */
    selectedRowIndex?: number;

    /**
     * Specifies the selectionSettings for Grid.
     * @default []
     */
    selectionSettings?: SelectionSettingsModel;

    /**
     * Specifies whether the reordering is enable or not.
     * @default null
     */
    allowReordering?: boolean;

    /**    
     * If `allowResizing` set to true, then the Grid columns can be resized.      
     * @default false    
     */
    allowResizing?: boolean;

    /**
     * Specifies whether the filtering is enable or not.
     * @default null
     */
    allowFiltering?: boolean;

    /**
     * Specifies the filterSettings for Grid.
     * @default []
     */
    filterSettings?: FilterSettingsModel;

    /**
     * Specifies whether the grouping is enable or not.
     * @default null
     */
    allowGrouping?: boolean;

    /**
     * Specifies whether the column menu is show or not.
     * @default null
     */
    showColumnMenu?: boolean;

    /**
     * Specifies the groupSettings for Grid.
     * @default []
     */
    groupSettings?: GroupSettingsModel;

    /**
     * if showColumnChooser is true, then column chooser will be enabled in Grid.
     * @default false
     */
    showColumnChooser?: boolean;

    /**
     * Specifies the editSettings for Grid.
     * @default []
     */
    editSettings?: EditSettingsModel;

    /**
     * Specifies the summaryRows for Grid.
     * @default []
     */
    aggregates?: AggregateRowModel[];


    /**
     * Specifies scrollable height of the grid content.
     * @default auto
     */
    height?: string | number;
    /**
     * Specifies scrollable width of the grid content.
     * @default auto
     */
    width?: string | number;

    /**
     * Specifies the searchSettings for Grid.
     * @default []
     */
    searchSettings?: SearchSettingsModel;

    /**
     * Specifies the rowDropSettings for Grid.
     * @default []
     */
    rowDropSettings?: RowDropSettingsModel;

    /**
     * Specifies whether the allowRowDragAndDrop is enable or not.
     * @default false
     */
    allowRowDragAndDrop?: boolean;

    /**
     * Specifies whether the gridLines mode
     * @default null
     */
    gridLines?: GridLine;

    /**
     * Specifies rowTemplate     
     */
    rowTemplate?: string;

    /**
     * Specifies detailTemplate     
     */
    detailTemplate?: string;

    /**    
     * Defines the child Grid to add inside the data rows of the parent Grid with expand/collapse options.       
     */
    childGrid?: GridModel;


    /**    
     * Defines the relation between parent and child grid.       
     */
    queryString?: string;


    /**
     * Specifies the printMode
     */
    printMode?: PrintMode;


    /**
     * Specifies the dataSource for Grid.
     * @default []
     */
    dataSource?: Object | DataManager;

    /**
     * Defines the row height for Grid rows.
     * @default null
     */
    rowHeight?: number;

    /**
     * Specifies the query for Grid.
     * @default []
     */
    query?: Query;

    /**
     * @hidden
     * `columnQueryMode`provides options to retrive data from the datasource.
     * @default All
     */
    columnQueryMode?: ColumnQueryModeType;

    /**
     * @hidden
     * Specifies the toolbar for Grid.
     * @default null
     */
    toolbar?: (ToolbarItems | string | ItemModel | ToolbarItem)[];

    /**
     * Specifies the context menu items for Grid.
     * @default null
     */
    contextMenuItems?: ContextMenuItem[] | ContextMenuItemModel[];

    /**
     * Specifies the column menu items for Grid.
     * @default null
     */
    columnMenuItems?: string[] | ContextMenuItemModel[];

    /**
     * @hidden
     * It used to render toolbar template
     * @default null
     */
    toolbarTemplate?: string;

    /**
     * @hidden
     * It used to render pager template
     * @default null
     */
    pagerTemplate?: string;

    /**
     * Defines the frozen rows for the grid content
     * @default 0
     */
    frozenRows?: number;

    /**
     * Defines the frozen columns for the grid content
     * @default 0
     */
    frozenColumns?: number;

    isEdit?: boolean;

    commonQuery?: Query;

    isLastCellPrimaryKey?: boolean;

    editModule?: Edit;

    resizeModule: Resize;

    mergeCells?: { [key: string]: number };

    checkAllRows?: CheckState;

    isCheckBoxSelection?: boolean;

    isPersistSelection?: boolean;

    localeObj?: L10n;

    prevPageMoving?: boolean;

    renderModule?: Render;

    isPreventScrollEvent?: boolean;

    registeredTemplate?: Object;

    //public methods
    getHeaderContent?(): Element;
    setGridHeaderContent?(value: Element): void;
    getContentTable?(): Element;
    setGridContentTable?(value: Element): void;
    getContent?(): Element;
    setGridContent?(value: Element): void;
    getHeaderTable?(): Element;
    setGridHeaderTable?(value: Element): void;
    getFooterContent?(): Element;
    getFooterContentTable?(): Element;
    getPager?(): Element;
    setGridPager?(value: Element): void;
    getRowByIndex?(index: number): Element;
    getMovableRowByIndex?(index: number): Element;
    getRowInfo?(target: Element): RowInfo;
    selectRow?(index: number, isToggle?: boolean): void;
    getColumnHeaderByIndex?(index: number): Element;
    getColumnByField?(field: string): Column;
    getColumnIndexByField?(field: string): number;
    getColumnByUid?(uid: string): Column;
    getColumnIndexByUid?(uid: string): number;
    getColumnByIndex?(index: number): Column;
    getUidByColumnField?(field: string): string;
    getNormalizedColumnIndex?(uid: string): number;
    getColumnIndexesInView(): number[];
    setColumnIndexesInView(indexes?: number[]): void;
    getRows?(): Element[];
    getMovableRows?(): Element[];
    getCellFromIndex?(rowIndex: number, columnIndex: number): Element;
    getMovableCellFromIndex?(rowIndex: number, columnIndex: number): Element;
    getColumnFieldNames?(): string[];
    getSelectedRows?(): Element[];
    getSelectedRecords?(): Object[];
    getSelectedRowIndexes?(): number[];
    getSelectedRowCellIndexes(): ISelectedCell[];
    getCurrentViewRecords(): Object[];
    selectRows?(indexes: number[]): void;
    clearSelection?(): void;
    updateExternalMessage?(message: string): void;
    getColumns?(isRefresh?: boolean): Column[];
    getStackedHeaderColumnByHeaderText?(stackedHeader: string, col: Column[]): Column;
    getRowTemplate?(): Function;
    getDetailTemplate?(): Function;
    getEditTemplate?(): Function;
    getFilterTemplate?(): Function;
    sortColumn?(columnName: string, sortDirection: SortDirection, isMultiSort?: boolean): void;
    removeSortColumn?(field: string): void;
    getColumnHeaderByUid?(uid: string): Element;
    getColumnHeaderByField?(field: string): Element;
    showColumns?(keys: string | string[], showBy?: string): void;
    hideColumns?(keys: string | string[], hideBy?: string): void;
    showSpinner?(): void;
    hideSpinner?(): void;
    updateDefaultCursor?(): void;
    getVisibleColumns?(): Column[];
    refreshHeader?(): void;
    getDataRows?(): Element[];
    getMovableDataRows?(): Element[];
    addMovableRows?(fRows: HTMLElement[], mrows: HTMLElement[]): HTMLElement[];
    getPrimaryKeyFieldNames?(): string[];
    autoFitColumns(fieldNames?: string | string[]): void;
    groupColumn(columnName: string): void;
    ungroupColumn(columnName: string): void;
    ensureModuleInjected(module: Function): Boolean;
    isContextMenuOpen(): Boolean;
    goToPage(pageNo: number): void;
    getFrozenColumns(): number;
    getVisibleFrozenColumns(): number;
    print(): void;
    /* tslint:disable-next-line:no-any */
    excelExport(exportProperties?: any, isMultipleExport?: boolean, workbook?: any): Promise<any>;
    /* tslint:disable-next-line:no-any */
    csvExport(exportProperties?: any, isMultipleExport?: boolean, workbook?: any): Promise<any>;
    /* tslint:disable-next-line:no-any */
    pdfExport(exportProperties?: any, isMultipleExport?: boolean, pdfDoc?: Object): Promise<Object>;
    search(searchString: string): void;
    deleteRecord?(fieldname?: string, data?: Object): void;
    startEdit?(): void;
    endEdit?(): void;
    closeEdit?(): void;
    addRecord?(data?: Object): void;
    deleteRow?(tr: HTMLTableRowElement): void;
    getRowObjectFromUID?(uid: string): Row<Column>;
    addFreezeRows?(fRows: Row<Column>[], mRows?: Row<Column>[]): Row<Column>[];
    getRowsObject?(): Row<Column>[];
    getMovableRowsObject?(): Row<Column>[];
    createColumnchooser(x: number, y: number, target: Element): void;
    getDataModule?(): Data;
    refreshTooltip?(): void;
    copy?(withHeader?: boolean): void;
    getLocaleConstants?(): Object;
    getForeignKeyColumns?(): Column[];
    getRowHeight?(): number;
    setCellValue(key: string | number, field: string, value: string | number | boolean | Date): void;
    setRowData(key: string | number, rowData?: Object): void;
    getState?(): Object;
    //tslint:disable-next-line:no-any
    destroyTemplate?(templateName: string[], index?: any): void;
    getQuery?(): Query;
}

/** @hidden */
export interface IRenderer {
    renderPanel(): void;
    renderTable(): void;
    setPanel(panel: Element): void;
    setTable(table: Element): void;
    getPanel(): Element;
    getTable(): Element;
    getRows?(): Row<{}>[] | HTMLCollectionOf<HTMLTableRowElement>;
    getMovableRows?(): Row<{}>[] | HTMLCollectionOf<HTMLTableRowElement>;
    refreshUI?(): void;
    setVisible?(column?: Column[]): void;
    addEventListener?(): void;
    removeEventListener?(): void;
    getRowElements?(): Element[];
    getMovableRowElements?(): Element[];
    setSelection?(uid: string, set: boolean, clearAll: boolean): void;
    getRowByIndex?(index: number): Element;
    getVirtualRowIndex?(index: number): number;
    getMovableRowByIndex?(index: number): Element;
    getRowInfo?(target: Element): RowInfo;
    getState?(): Object;
    getMovableHeader?(): Element;
    destroyTemplate?(templateName: string[]): void;
}

/**
 * IAction interface
 * @hidden
 */
export interface IAction {
    updateModel?(): void;
    onActionBegin?(args?: Object, type?: string): void;
    onActionComplete?(args?: Object, type?: string): void;
    addEventListener?() : void;
    removeEventListener?(): void;
}
/**
 * @hidden
 */
export interface IDataProcessor {
    generateQuery(): Query;
    getData(args: Object, query: Query): Promise<Object>;
    processData?(): void;
}
/**
 * @hidden
 */
export interface IValueFormatter {
    fromView(value: string, format: Function, target?: string): string | number | Date;
    toView(value: number | Date, format: Function): string | Object;
    setCulture?(cultureName: string): void;
    getFormatFunction?(format: NumberFormatOptions | DateFormatOptions): Function;
    getParserFunction?(format: NumberFormatOptions | DateFormatOptions): Function;
}
/**
 * @hidden
 */
export interface ITemplateRender {
    compiled: { [x: string]: Function };
    compile(key: string, template: string): Function;
    render(key: string, data: Object, params?: { [p: string]: Object }): string;
}
/**
 * @hidden
 */
export interface IEditCell {
    create?: Element | Function | string;
    read?: Object | Function | string;
    write?: void | Function | string;
    params?: DatePickerModel | NumericTextBoxModel | DropDownListModel;
    destroy?: Function | string;
}
/**
 * @hidden
 */
export interface IFilterUI {
    create?: Element | Function | string;
    read?: Object | Function | string;
    write?: void | Function | string;
}
/**
 * @hidden
 */
export interface IFilterMUI {
    create?: void | Function | string;
    read?: Object | Function | string;
    write?: void | Function | string;
}

/**
 * @hidden
 */
export interface ICustomOptr {
    stringOperator?: { [key: string]: Object }[];
    numberOperator?: { [key: string]: Object }[];
    dateOperator?: { [key: string]: Object }[];
    dateTimeOperator?: { [key: string]: Object }[];
    booleanOperator?: { [key: string]: Object }[];
}
/**
 * @hidden
 */
export interface ICellRenderer<T> {
    element?: Element;
    getGui?(): string | Element;
    format?(column: T, value: Object, data: Object): string;
    evaluate?(node: Element, column: Cell<T>, data: Object, attributes?: Object): boolean;
    setStyleAndAttributes?(node: Element, attributes: { [key: string]: Object }): void;
    render(cell: Cell<T>, data: Object, attributes?: { [x: string]: string }): Element;
    appendHtml?(node: Element, innerHtml: string | Element): Element;
    refresh?(cell: Cell<T>, node: Element): Element;
}
/**
 * @hidden
 */
export interface IRowRenderer<T> {
    element?: Element;
    render(row: Row<T>, column: Column[], attributes?: { [x: string]: string }, rowTemplate?: string): Element;
}

/**
 * @hidden
 */
export interface ICellFormatter {
    getValue(column: Column, data: Object): Object;
}
/**
 * @hidden
 */
export interface IIndex {
    rowIndex?: number;
    cellIndex?: number;
}
/**
 * @hidden
 */
export interface ISelectedCell {
    rowIndex: number;
    cellIndexes: number[];
}

/**
 * @hidden
 */
export interface IFilterOperator {
    contains: string;
    endsWith: string;
    equal: string;
    greaterThan: string;
    greaterThanOrEqual: string;
    lessThan: string;
    lessThanOrEqual: string;
    notEqual: string;
    startsWith: string;
}

export interface NotifyArgs {
    records?: Object[];
    count?: number;
    requestType?: Action;
    module?: string;
    enable?: boolean;
    properties?: Object;
    virtualInfo?: VirtualInfo;
    cancel?: boolean;
    rows?: Row<Column>[];
    isFrozen?: boolean;
    args?: NotifyArgs;
    oldProperties?: string[];
    focusElement?: HTMLElement;
}

/**
 * @hidden
 */
export interface ICell<T> {
    colSpan?: number;

    rowSpan?: number;

    cellType?: CellType;

    visible?: boolean;

    isTemplate?: boolean;

    isDataCell?: boolean;

    column?: T;

    rowID?: string;

    index?: number;

    colIndex?: number;

    className?: string;

    commands?: CommandModel[];

    isForeignKey?: boolean;

    foreignKeyData?: Object;
}
/**
 * @hidden
 */
export interface IRow<T> {
    uid?: string;

    data?: Object;

    isSelected?: boolean;

    isReadOnly?: boolean;

    isAltRow?: boolean;

    isDataRow?: boolean;

    isExpand?: boolean;

    rowSpan?: number;

    cells?: Cell<T>[];

    index?: number;

    indent?: number;

    subRowDetails?: Object;

    height?: string;

    cssClass?: string;

    foreignKeyData?: Object;
}
/**
 * @hidden
 */
export interface IModelGenerator<T> {
    generateRows(data: Object, args?: Object): Row<T>[];
    refreshRows?(input?: Row<T>[]): Row<T>[];
}

export interface RowInfo {
    /** returns particular cell element */
    cell?: Element;
    /** returns particular cell index */
    cellIndex?: number;
    /** returns particular row element */
    row?: Element;
    /** returns particular rowIndex */
    rowIndex?: number;
    /** returns particular row data */
    rowData?: Object;
    /** return particular column information  */
    column?: Object;
}

export interface ActionEventArgs {
    /** Defines the current action. */
    requestType?: Action;
    /** Defines the type of event. */
    type?: string;
}

export interface FailureEventArgs {
    /** Defines the error information. */
    error?: Error;
}

export interface FilterEventArgs extends ActionEventArgs {
    /** Defines the object that is currently filtered. */
    currentFilterObject?: PredicateModel;
    /** Defines the column name that is currently filtered. */
    currentFilteringColumn?: string;
    /** Defines the collection of filtered columns. */
    columns?: PredicateModel[];
}

export interface GroupEventArgs extends ActionEventArgs {
    /** Defines the field name of the currently grouped columns. */
    columnName?: string;
}

export interface PageEventArgs extends ActionEventArgs {
    /** Defines the previous page number. */
    previousPage?: string;
    /** Defines the current page number. */
    currentPage?: string;
}

export interface SortEventArgs extends ActionEventArgs {
    /** Defines the field name of currently sorted column. */
    columnName?: string;
    /** Defines the direction of sort column. */
    direction?: SortDirection;
}

export interface SearchEventArgs extends ActionEventArgs {
    /** Defines the string value to search. */
    searchString?: string;
}

export interface PrintEventArgs extends ActionEventArgs {
    /** Defines the Grid element. */
    element?: Element;
    /** Defines the currently selected rows. */
    selectedRows?: NodeListOf<Element>;
    /** Cancel the print action */
    cancel?: boolean;
}

export interface DetailDataBoundEventArgs {
    /** Defines the details row element. */
    detailElement?: Element;
    /** Defines the selected row data. */
    data?: Object;
}

export interface ColumnChooserEventArgs {
    /** Defines the parent element. */
    element?: Element;
    /** Defines the display columns of column chooser. */
    columns?: Column[];
    /** Specifies the instance of column chooser dialog. */
    dialogInstance?: Object;
   /** Defines the operator for column chooser search request */
   searchOperator?: string;
}

export interface RowDeselectEventArgs {
    /** Defines the current selected/deselected row data. */
    data?: Object;
    /** Defines the selected/deselected row index. */
    rowIndex?: number;
    /** Defines the selected/deselected row. */
    row?: Element;
    /** Define the foreignKey row data associated with this column */
    foreignKeyData?: Object;
    /** Defines the cancel option value. */
    cancel?: boolean;
    /** Defines the target element for row deselect. */
    target?: Element;
}

export interface RowSelectEventArgs extends RowDeselectEventArgs {
    /** Defines the previously selected row index. */
    previousRowIndex?: number;
    /** Defines the previously selected row. */
    previousRow?: Element;
    /** Defines the target element for selection. */
    target?: Element;
    /** Define the foreignKey row data associated with this column */
    foreignKeyData?: Object;
}

export interface RecordDoubleClickEventArgs {
    /** Defines the target element. */
    target?: Element;
    /** Defines the cell element. */
    cell?: Element;
    /** Defines the cell index. */
    cellIndex?: number;
    /** Defines the column object. */
    column?: Column;
    /** Defines the name of the event. */
    name?: string;
    /** Defines the row element. */
    row?: Element;
    /** Defines the current row data. */
    rowData?: Object;
    /** Defines the row index. */
    rowIndex?: number;
    /** Define the foreignKey row data associated with this column */
    foreignKeyData?: Object;
}

export interface RowSelectingEventArgs extends RowSelectEventArgs {
    /** Defines whether CTRL key is pressed. */
    isCtrlPressed?: boolean;
    /** Defines whether SHIFT key is pressed. */
    isShiftPressed?: boolean;
}

export interface CellDeselectEventArgs {
    /** Defines the currently selected/deselected row data. */
    data?: Object;
    /** Defines the indexes of the current selected/deselected cells. */
    cellIndexes?: ISelectedCell[];
    /** Defines the currently selected/deselected cells. */
    cells?: Element[];
    /** Defines the cancel option value. */
    cancel?: boolean;
}

export interface CellSelectEventArgs extends CellDeselectEventArgs {
    /** Defines the index of the current selected cell. */
    cellIndex?: IIndex;
    /** Defines the previously selected cell index. */
    previousRowCellIndex?: number;
    /** Defines the element. */
    currentCell: Element;
    /** Defines the previously selected cell element. */
    previousRowCell?: Element;
}

export interface CellSelectingEventArgs extends CellSelectEventArgs {
    /** Defines whether the CTRL key is pressed or not. */
    isCtrlPressed?: boolean;
    /** Defines whether the SHIFT key is pressed or not. */
    isShiftPressed?: boolean;
}

export interface ColumnDragEventArgs {
    /** Defines the target element from which the drag starts. */
    target?: Element;
    /** Defines the type of the element dragged. */
    draggableType?: string;
    /** Defines the column object that is dragged. */
    column?: Column;
}
export interface RowDataBoundEventArgs {
    /** Defines the current row data. */
    data?: Object;
    /** Defines the row element. */
    row?: Element;
    /** Defines the row height */
    rowHeight?: number;
}

export interface HeaderCellInfoEventArgs {
    /** Defines the cell. */
    cell?: Cell<Column>;
    /** Defines the cell element. */
    node?: Element;
}

export interface QueryCellInfoEventArgs {
    /** Defines the row data associated with this cell. */
    data?: Object;
    /** Defines the cell element. */
    cell?: Element;
    /** Defines the column object associated with this cell. */
    column?: Column;
    /** Defines the no. of columns to be spanned */
    colSpan?: number;
    /** Define the foreignKey row data associated with this column */
    foreignKeyData?: Object;
}

export interface PdfQueryCellInfoEventArgs {
    /** Defines the column of the current cell. */
    column?: Column;
    /** Defines the style of the current cell. */
    /* tslint:disable:no-any */
    style?: PdfStyle;
    /** Defines the value of the current cell. */
    /* tslint:disable:no-any */
    value?: Date | string | number | boolean;
    /** Defines the no. of columns to be spanned */
    colSpan?: number;
}

export interface PdfHeaderQueryCellInfoEventArgs {
    /** Defines the PDF grid current cell. */
    cell?: object;
    /** Defines the style of the current cell. */
    /* tslint:disable:no-any */
    style?: PdfStyle;
    /** Defines the current cell with column */
    gridCell?: object;
}

export interface ExcelQueryCellInfoEventArgs {
    /** Defines the row data associated with this cell. */
    data?: Object;
    /** Defines the column of the current cell. */
    column: Column;
    /** Defines the value of the current cell. */
    value?: Date | string | number | boolean;
    /** Defines the style of the current cell. */
    style?: ExcelStyle;
    /** Defines the number of columns to be spanned */
    colSpan?: number;
    /** Defines the cell data */
    cell?: number | ExcelStyle | { name: string };
}
export interface ExcelHeaderQueryCellInfoEventArgs {
    /** Defines the cell that contains colspan. */
    cell?: Object;
    /** Defines the style of the current cell. */
    style?: ExcelStyle;
}

export interface FilterSearchBeginEventArgs {
    /** Defines the current action. */
    requestType?: string;
    /** Defines the filter model. */
    filterModel?: CheckBoxFilter;
    /** Defines the field name of current column */
    columnName?: string;
    /** Defines the current Column objects */
    column?: Column;
    /** Defines the operator for filter request */
    operator?: string;
    /** Defines the matchCase for filter request */
    matchCase?: boolean;
    /** Defines the ignoreAccent for filter request */
    ignoreAccent?: boolean;
    /** Defines the custom query in before execute */
    query: Query;
    /** Defines take number of data  */
    filterChoiceCount: number;

}

export interface MultipleExport {
    /** Indicates whether to append the multiple grid in same sheet or different sheet */
    type?: MultipleExportType;
    /**  Defines the number of blank rows between the multiple grid data */
    blankRows?: number;
}
export interface ExcelRow {
    /**  Defines the index for cells */
    index?: number;
    /**  Defines the cells in a row */
    cells?: ExcelCell[];

}
export interface Border {
    /**  Defines the color of border */
    color?: string;
    /**  Defines the line style of border */
    lineStyle?: BorderLineStyle;
}
export interface ExcelStyle {
    /** Defines the color of font */
    fontColor?: string;
    /** Defines the name of font */
    fontName?: string;
    /** Defines the size of font */
    fontSize?: number;
    /** Defines the horizontal alignment for cell style */
    hAlign?: ExcelHAlign;
    /** Defines the vertical alignment for cell style */
    vAlign?: ExcelVAlign;
    /** Defines the bold style for fonts  */
    bold?: boolean;
    /** Defines the indent for cell style */
    indent?: number;
    /** Defines the italic style for fonts */
    italic?: boolean;
    /** Defines the underline style for fonts */
    underline?: boolean;
    /** Defines the background color for cell style */
    backColor?: string;
    /** Defines the wrapText for cell style */
    wrapText?: boolean;
    /** Defines the borders for cell style */
    borders?: Border;
}
export interface PdfStyle {
    /** Defines the horizontal alignment */
    textAlignment?: PdfHAlign;
    /** Defines the brush color of font */
    textBrushColor?: string;
    /** Defines the pen color of font */
    textPenColor?: string;
    /** Defines the font family */
    fontFamily?: string;
    /** Defines the font size */
    fontSize?: number;
    /** Defines the font bold */
    bold?: boolean;
    /** Defines the indent alignment */
    indent?: PdfHAlign;
    /** Defines the italic font */
    italic?: boolean;
    /** Defines the underlined font */
    underline?: boolean;
    /** Defines the strike-out font */
    strikeout?: boolean;
    /** Defines the horizontal alignment */
    verticalAlignment?: PdfVAlign;
    /** Defines the background color */
    backgroundColor?: string;
    /** Defines the grid border */
    border?: PdfBorder;
    /** Defines the cell indent */
    paragraphIndent?: number;
}
export interface PdfBorder {
    /** Defines the border color */
    color?: string;
    /** Defines the border width */
    width?: number;
    /** Defines the border dash style */
    dashStyle?: PdfDashStyle;
}

export interface ExcelCell {
    /** Defines the index for the cell */
    index?: number;
    /** Defines the column span for the cell  */
    colSpan?: number;
    /** Defines the value of the cell */
    value?: string | boolean | number | Date;
    /** Defines the hyperlink of the cell */
    hyperlink?: Hyperlink;
    /** Defines the style of the cell */
    style?: ExcelStyle;
}

export interface Hyperlink {
    /** Defines the Url for hyperlink */
    target?: string;
    /** Defines the display text for hyperlink */
    displayText?: string;
}

export interface ExcelHeader {
    /** Defines the number of rows between the header and grid data */
    headerRows?: number;
    /** Defines the rows in header content */
    rows?: ExcelRow[];
}

export interface ExcelFooter {
    /** Defines the number of rows between the grid data and footer */
    footerRows?: number;
    /** Defines the rows in footer content */
    rows?: ExcelRow[];
}

export interface ExcelExportProperties {
    /** Defines the data source dynamically before exporting */
    dataSource?: Object | DataManager;
    /** Exports multiple grid into the excel document */
    multipleExport?: MultipleExport;
    /** Defines the header content for exported document  */
    header?: ExcelHeader;
    /** Defines the footer content for exported document */
    footer?: ExcelFooter;
    /** Indicates to export current page or all page */
    exportType?: ExportType;
    /** Indicates whether to show the hidden columns in exported excel */
    includeHiddenColumn?: boolean;
    /** Defines the theme for exported data  */
    theme?: Theme;
    /** Defines the file name for the exported file  */
    fileName?: string;
}

export interface RowDragEventArgs {
    /** Defines the selected row's element. */
    rows?: Element[];
    /** Defines the target element from which drag starts. */
    target?: Element;
    /** Defines the type of the element to be dragged.
     * @hidden
     */
    draggableType?: string;
    /** Defines the selected row data. */
    data?: Object[];
}

/**
 * @hidden
 */
export interface EJ2Intance extends HTMLElement {
    ej2_instances: Object | Object[];
}

/**
 * @hidden
 */
export interface IPosition {
    x: number;
    y: number;
}

/**
 * @hidden
 */
export interface ParentDetails {
    parentID?: string;
    parentPrimaryKeys?: string[];
    parentKeyField?: string;
    parentKeyFieldValue?: string;
    parentRowData?: Object;
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
export interface ICancel {
    /** Defines the cancel option value. */
    cancel?: boolean;
}

/**
 * @hidden
 */
export interface IPrimaryKey {
    /** Defines the primaryKey. */
    primaryKey?: string[];
}

/**
 * @hidden
 */
export interface BeforeBatchAddArgs extends ICancel, IPrimaryKey {
    /** Defines the default data object. */
    defaultData?: Object;

}

/**
 * @hidden
 */
export interface BatchCancelArgs {
    /** Defines the rows. */
    rows?: Row<Column>[];
    /** Defines the request type. */
    requestType?: string;
}

/**
 * @hidden
 */
export interface BatchDeleteArgs extends IPrimaryKey {
    /** Defines the deleted data. */
    rowData?: Object;
    /** Defines the row index. */
    rowIndex?: number;
}

/**
 * @hidden
 */
export interface BeforeBatchDeleteArgs extends BatchDeleteArgs, ICancel {
    /** Defines the row element. */
    row?: Element;
}

/**
 * @hidden
 */
export interface BeforeBatchSaveArgs extends ICancel {
    /** Defines the changed record object. */
    batchChanges?: Object;
}

/**
 * @hidden
 */
export interface ResizeArgs extends ICancel {
    /** Event argument of point or touch action. */
    e?: MouseEvent | TouchEvent;
    /** Defines the resizing column details */
    column?: Column;
}

/**
 * @hidden
 */
export interface BatchAddArgs extends ICancel, IPrimaryKey {
    /** Defines the added data. */
    defaultData?: Object;
    /** Defines the column index. */
    columnIndex?: number;
    /** Defines the row element. */
    row?: Element;
    /** Defines the cell element. */
    cell?: Element;
    /** Defines the column object. */
    columnObject?: Column;
}


/**
 * @hidden
 */
export interface BeginEditArgs extends ICancel, IPrimaryKey {
    /** Defines the edited data. */
    rowData?: Object;
    /** Defines the edited row index. */
    rowIndex?: number;
    /** Defines the current edited row. */
    row?: Element;
    /** Defines the name of the event. */
    type?: string;
    /** Defines the primary key value. */
    primaryKeyValue?: string[];
}

export interface DeleteEventArgs {
    /** Defines the cancel option value. */
    cancel?: boolean;
    /** Defines the request type. */
    requestType?: string;
    /** Defines the foreign key record object (JSON). @hidden */
    foreignKeyData?: Object;
    /** Defines the record objects. */
    data?: Object[];
    /** Defines the selected rows for delete. */
    tr?: Element[];
    /** Defines the name of the event. */
    type?: string;
}

export interface AddEventArgs {
    /** If `cancel` is set to true, then the current action will stopped. */
    cancel?: boolean;
    /** Defines the request type. */
    requestType?: string;
    /** Defines the foreign key record object. 
     * @hidden 
     */
    foreignKeyData?: Object;
    /** Defines the record objects. */
    data?: Object;
    /** Defines the event name. */
    type?: string;
    /** Defines the previous data. */
    previousData?: Object;
    /** Defines the added row. */
    row?: Object;
    /** Added row index */
    index?: number;
    /** 
     * @hidden 
     * Defines the record objects.
     */
    rowData?: Object;
    /** Define the target for dialog */
    target?: HTMLElement;
}

export interface SaveEventArgs extends AddEventArgs {
    /** Defines the previous data. */
    previousData?: Object;
    /** Defines the selected row index. */
    selectedRow?: number;
    /** Defines the current action. */
    action?: string;
    /** Added row index */
    index?: number;
}

export interface EditEventArgs extends BeginEditArgs {
    /** Defines the request type. */
    requestType?: string;
    /** Defines foreign data object. */
    foreignKeyData?: Object;
    addRecord?(data?: Object, index?: number): void;
    /** Define the form element */
    form?: HTMLFormElement;
    /** Define the movable table form element */
    movableForm?: HTMLFormElement;
    /** Defines the target for dialog */
    target?: HTMLElement;
}

export interface DialogEditEventArgs extends EditEventArgs {
    /** Defines the dialog object */
    dialog?: DialogModel;
}


/**
 * @hidden
 */
export interface CellEditSameArgs extends ICancel {
    /** Defines the row data object. */
    rowData?: Object;
    /** Defines the column name. */
    columnName?: string;
    /** Defines the cell object. */
    cell?: Element;
    /** Defines the column object. */
    columnObject?: Column;
    /** Defines the cell value. */
    value?: string;
    /** Defines isForeignKey option value. */
    isForeignKey?: boolean;

}
/**
 * @hidden
 */
export interface CellEditArgs extends CellEditSameArgs, IPrimaryKey {
    /** Defines the current row. */
    row?: Element;
    /** Defines the validation rules. */
    validationRules?: Object;
    /** Defines the name of the event. */
    type?: string;
    /** Defines foreign data object */
    foreignKeyData?: Object;
}

export interface IFilterCreate {
    column?: Column;
    target?: HTMLElement;
    getOptrInstance?: FlMenuOptrUI;
    localizeText?: L10n;
    dialogObj?: Dialog;
}

/**
 * @hidden
 */
export interface CellSaveArgs extends CellEditSameArgs {
    /** Defines the previous value of the cell. */
    previousValue?: string;
}

/**
 * @hidden
 */
export interface BeforeDataBoundArgs {
    /** Defines the data. */
    result?: Object[];
    /** Defines the data count. */
    count?: number;
}

/**
 * @hidden
 */
export interface IEdit {
    formObj?: FormValidator;
    destroy?: Function;
    closeEdit?(): void;
    deleteRecord?(fieldname?: string, data?: Object): void;
    startEdit?(tr?: Element): void;
    endEdit?(): void;
    closeEdit?(): void;
    addRecord?(data?: Object, index?: number): void;
    deleteRow?(tr: HTMLTableRowElement): void;
    endEdit?(data?: Object): void;
    batchSave?(): void;
    getBatchChanges?(): Object;
    removeRowObjectFromUID?(uid: string): void;
    addRowObject?(row: Row<Column>): void;
    editCell?(index: number, field: string, isAdd?: boolean): void;
    updateCell?(rowIndex: number, field: string, value: string | number | boolean | Date): void;
    updateRow?(index: number, data: Object): void;
    saveCell?(isForceSave?: boolean): void;
    addCancelWhilePaging?(): void;
}

/**
 * @hidden
 */
export interface CheckBoxChangeEventArgs extends ICancel {
    /** Defines the checked state. */
    checked?: boolean;
    /** Defines the selected row indexes. */
    selectedRowIndexes?: number[];
    /** Defines the target element for selection. */
    target?: Element;
}

/**
 * @hidden
 */
export interface BeforeCopyEventArgs extends ICancel {
    /** Defines the grid copied data. */
    data?: string;
}

/**
 * Defines options for custom command buttons.
 */
export interface CommandButtonOptions extends ButtonModel {
    /**
     * Defines handler for the click event.
     */
    click?: EmitType<Event>;
}

/**
 * Define options for custom command buttons.
 */
export interface CommandModel {
    /**
     * Define the command Button tooltip
     */
    title?: string;
    /**
     * Define the command Button type
     */
    type?: CommandButtonType;
    /**
     * Define the button model
     */
    buttonOption?: CommandButtonOptions;
}
/**
 * Defines the pending state for Custom Service Data
 */
export interface PendingState {
    /**
     * The function which resolves the current action's promise.
     */
    resolver?: Function;
    /**
     * Defines the current state of the action.
     */
    isPending?: Boolean;
    /**
     * Grouping property for Custom data service
     */
    group?: string[];
    /**
     * aggregate support for Custom data service
     */
    aggregates?: Object[];
    /**
     *  DataSource changed through set model
     */
    isDataChanged?: Boolean;
}

/**
 * Sorting property for Custom data Service
 */
export interface Sorts {
    /** Defines the field to be sorted */
    name?: string;
    /** Defines the direction of sorting */
    direction?: string;
}
/** Custom data service event types */
export interface DataStateChangeEventArgs {
    /** Defines the skip count in datasource record */
    skip?: number;
    /** Defines the page size */
    take?: number;
    /** Defines the filter criteria  */
    where?: PredicateModel[];
    /** Defines the sorted field and direction */
    sorted?: Sorts[];
    /** Defines the grouped field names */
    group?: string[];
    /** Defines the aggregates object */
    aggregates?: Object[];
    /** Defines the search criteria */
    search?: PredicateModel[];
    /** Defines the grid action details performed by paging, grouping, filtering, searching, sorting */
    action?: PageEventArgs | GroupEventArgs | FilterEventArgs | SearchEventArgs | SortEventArgs;
    /** Defines the remote table name */
    table?: string;
    /** Defines the selected field names */
    select?: string[];
    /** If `count` is set true, then the remote service needs to return records and count */
    count?: boolean;
    /** Defines the checkbox filter dataSource */
    dataSource?: Function;
}

export interface DataSourceChangedEventArgs {
    /** Defines the current action type. */
    requestType?: string;
    /** Defines the current action. */
    action?: string;
    /** Defines the primary column field */
    key?: string | string[];
    /** Defines the state of the performed action */
    state?: DataStateChangeEventArgs;
    /** Defines the selected row data. */
    data?: Object | Object[];
    /** Defines the primary key value */
    primaryKeyValues?: Object[];
    /** Defines the index value */
    index?: number;
    /** Defines the end of editing function. */
    endEdit?: Function;
    /** Defines the changes made in batch editing */
    changes?: Object;
    /** Defines the query */
    query?: Query;
}

/**
 * @hidden
 */
export interface CheckBoxChangeEventArgs extends ICancel {
    /** Defines the checked state. */
    checked?: boolean;
    /** Defines the selected row indexes. */
    selectedRowIndexes?: number[];
    /** Defines the target element for selection. */
    target?: Element;
}

/**
 * @hidden
 */
export interface BeforeCopyEventArgs extends ICancel {
    /** Defines the grid copied data. */
    data?: string;
}

/**
 * @hidden
 */
export interface IFocus {
    matrix: Matrix;
    onKeyPress?: Function;
    onClick?: Function;
    onFocus?: Function;
    jump?: (action: string, current: number[]) => SwapInfo;
    getFocusInfo?: () => FocusInfo;
    getFocusable?: (element: HTMLElement) => HTMLElement;
    selector?: (row: Row<Column>, cell: Cell<Column>) => boolean;
    generateRows?: (rows: Row<Column>[], optionals?: Object) => void;
    getInfo?: (e?: KeyboardEventArgs) => FocusedContainer;
    validator?: () => Function;
    getNextCurrent?: (previous: number[], swap?: SwapInfo, active?: IFocus, action?: string) => number[];
    preventDefault?: (e: KeyboardEventArgs, info: FocusInfo) => void;
}
/**
 * @hidden
 */
export interface FocusInfo {
    element?: HTMLElement;
    elementToFocus?: HTMLElement;
    outline?: boolean;
    class?: string;
    skipAction?: boolean;
    uid?: string;
}
/**
 * @hidden
 */
export interface CellFocusArgs {
    element?: HTMLElement;
    parent?: HTMLElement;
    indexes?: number[];
    byKey?: boolean;
    byClick?: boolean;
    keyArgs?: KeyboardEventArgs;
    clickArgs?: Event;
    isJump?: boolean;
    container?: FocusedContainer;
    outline?: boolean;
    cancel?: boolean;
}
/**
 * @hidden
 */
export interface FocusedContainer {
    isContent?: boolean;
    isHeader?: boolean;
    isDataCell?: boolean;
    isFrozen?: boolean;
    isStacked?: boolean;
    isSelectable?: boolean;
    indexes?: number[];
}

/**
 * @hidden
 */
export interface SwapInfo {
    swap?: boolean;
    toHeader?: boolean;
    toFrozen?: boolean;
    current?: number[];
}
/**
 * @hidden
 */
export interface SwapInfo {
    swap?: boolean;
    toHeader?: boolean;
    toFrozen?: boolean;
    current?: number[];
}

export interface ContextMenuItemModel extends MenuItemModel {
    target?: string;
}

/**
 * @hidden
 */
export interface IFilter {
    type?: string;
    dataSource?: Object[] | DataManager;
    hideSearchbox?: boolean;
    itemTemplate?: string;
    ui?: IFilterMUI;
}

/**
 * @hidden
 */
export interface IFilterArgs {
    type?: string;
    field?: string;
    displayName?: string;
    query?: Query;
    dataSource?: Object[] | DataManager;
    format?: string;
    filteredColumns?: Object[];
    sortedColumns?: string[];
    localizedStrings?: Object;
    localeObj?: L10n;
    position?: { X: number, Y: number };
    formatFn?: Function;
    parserFn?: Function;
    hideSearchbox?: boolean;
    allowCaseSensitive?: boolean;
    handler?: Function;
    template?: Function;
    target?: Element;
    foreignKeyValue?: string;
    column?: Column;
    actualPredicate?: { [key: string]: PredicateModel[] };
}

export interface PdfExportProperties {
    /** Defines the Pdf orientation. */
    pageOrientation?: PageOrientation;
    /** Defines the Pdf page size. */
    pageSize?: PdfPageSize;
    /** Defines the Pdf header. */
    header?: PdfHeader;
    /** Defines the Pdf footer. */
    footer?: PdfFooter;
    /** Indicates whether to show the hidden columns in exported Pdf */
    includeHiddenColumn?: boolean;
    /** Defines the data source dynamically before exporting */
    dataSource?: Object | DataManager;
    /** Indicates to export current page or all page */
    exportType?: ExportType;
    /** Defines the theme for exported data  */
    theme?: Theme;
    /** Defines the file name for the exported file  */
    fileName?: string;
}

export interface Theme {
    /** Defines the style of header content. */
    header?: ThemeStyle;
    /** Defines the theme style of record content. */
    record?: ThemeStyle;
    /** Defines the theme style of caption content. */
    caption?: ThemeStyle;
}

export interface ThemeStyle {
    /** Defines the font color of theme style. */
    fontColor?: string;
    /** Defines the font name of theme style. */
    fontName?: string;
    /** Defines the font size of theme style. */
    fontSize?: number;
    /** Defines the bold of theme style. */
    bold?: boolean;
    /** Defines the borders of theme style. */
    borders?: Border;
}

export interface PdfHeader {
    /** Defines the header content distance from top. */
    fromTop?: number;
    /** Defines the height of header content. */
    height?: number;
    /** Defines the header contents. */
    contents?: PdfHeaderFooterContent[];
}

export interface PdfFooter {
    /** Defines the footer content distance from bottom. */
    fromBottom?: number;
    /** Defines the height of footer content. */
    height?: number;
    /** Defines the footer contents */
    contents?: PdfHeaderFooterContent[];
}

export interface PdfHeaderFooterContent {
    /** Defines the content type */
    type: ContentType;
    /** Defines the page number type */
    pageNumberType?: PdfPageNumberType;
    /** Defines the style of content */
    style?: PdfContentStyle;
    /** Defines the pdf points for drawing line */
    points?: PdfPoints;
    /** Defines the format for customizing page number */
    format?: string;
    /** Defines the position of the content */
    position?: PdfPosition;
    /** Defines the size of content */
    size?: PdfSize;
    /** Defines the base64 string for image content type */
    src?: string;
    /** Defines the value for content */
    value?: any;
}

export interface PdfPosition {
    /** Defines the x position */
    x: number;
    /** Defines the y position */
    y: number;
}

export interface PdfSize {
    /** Defines the height */
    height: number;
    /** Defines the width */
    width: number;
}

export interface PdfPoints {
    /** Defines the x1 position */
    x1: number;
    /** Defines the y1 position */
    y1: number;
    /** Defines the x2 position */
    x2: number;
    /** Defines the y2 position */
    y2: number;
}

export interface PdfContentStyle {
    /** Defines the pen color. */
    penColor?: string;
    /** Defines the pen size. */
    penSize?: number;
    /** Defines the dash style. */
    dashStyle?: PdfDashStyle;
    /** Defines the text brush color. */
    textBrushColor?: string;
    /** Defines the text pen color. */
    textPenColor?: string;
    /** Defines the font size. */
    fontSize?: number;
    /** Defines the horizontal alignment. */
    hAlign?: PdfHAlign;
    /** Defines the vertical alignment. */
    vAlign?: PdfVAlign;
}
/**
 * Defines the context menu item model.
 */
export interface ContextMenuItemModel extends MenuItemModel {
    /**
     * Define the target to show the menu item.
     */
    target?: string;
}

export interface ColumnMenuItemModel extends MenuItemModel {
    hide?: boolean;
}

export interface ColumnMenuOpenEventArgs extends BeforeOpenCloseMenuEventArgs {
    column?: Column;
}

export interface ColumnMenuClickEventArgs extends MenuEventArgs {
    column?: Column;
}

export interface ContextMenuClickEventArgs extends MenuEventArgs {
    column?: Column;
}

export interface ContextMenuOpenEventArgs extends BeforeOpenCloseMenuEventArgs {
    column?: Column;
}

export interface ExcelExportCompleteArgs {
    /** Defines the promise object for blob data. */
    promise?: Promise<{ blobData: Blob }>;
}

export interface PdfExportCompleteArgs {
    /** Defines the promise object for blob data. */
    promise?: Promise<{ blobData: Blob }>;
}

export interface SelectionNotifyArgs extends NotifyArgs {
    row?: HTMLElement;
    CheckState?: boolean;
}

/**
 * @hidden
 */
export interface DataResult {
    result: Object[] | Group[];
    count: number;
    aggregates?: object;
}

export interface RowDropEventArgs extends RowDragEventArgs {
    cancel?: boolean;
}
