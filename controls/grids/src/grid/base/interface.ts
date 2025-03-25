import { Component, NumberFormatOptions, DateFormatOptions, EmitType } from '@syncfusion/ej2-base';
import { KeyboardEventArgs as BaseKeyboardEventArgs, L10n } from '@syncfusion/ej2-base';
import { Query, DataManager, Group, Predicate } from '@syncfusion/ej2-data';
import { ItemModel, MenuItemModel, BeforeOpenCloseMenuEventArgs, MenuEventArgs } from '@syncfusion/ej2-navigations';
import { ButtonModel, CheckBoxModel, SwitchModel } from '@syncfusion/ej2-buttons';
import { Column, ColumnModel } from '../models/column';
import {
    SortSettingsModel, TextWrapSettingsModel, SelectionSettingsModel,
    FilterSettingsModel, SearchSettingsModel, InfiniteScrollSettingsModel, ResizeSettingsModel
} from './grid-model';
import { PageSettingsModel, AggregateRowModel, ColumnChooserSettingsModel } from '../models/models';
import { RowDropSettingsModel, GroupSettingsModel, GridModel, EditSettingsModel, LoadingIndicatorModel } from './grid-model';
import { Cell } from '../models/cell';
import { Row } from '../models/row';
import { GridLine, Action, CellType, SortDirection, PrintMode, ToolbarItems, CommandButtonType, ContextMenuItem, ExcelBorderLineStyle, FocusType } from './enum';
import { MultipleExportType, MultiplePdfExportType, ExportType, ExcelHAlign, ExcelVAlign, BorderLineStyle, ToolbarItem, AggregateTemplateType } from './enum';
import { PredicateModel } from './grid-model';
import { SentinelType, Offsets } from './type';
import { CheckState, ColumnQueryModeType, HierarchyGridPrintMode, ClipMode, freezeMode } from './enum';
import { ResponsiveDialogAction, RowRenderingDirection } from './enum';
import { Edit } from '../actions/edit';
import { Selection } from '../actions/selection';
import { Resize } from '../actions/resize';
import { DropDownListModel, MultiSelectModel, ComboBoxModel } from '@syncfusion/ej2-dropdowns';
import { NumericTextBoxModel, MaskedTextBoxModel, TextBoxModel } from '@syncfusion/ej2-inputs';
import { FormValidator } from '@syncfusion/ej2-inputs';
import { Data } from '../actions/data';
import { DatePickerModel, DateTimePickerModel, TimePickerModel } from '@syncfusion/ej2-calendars';
import { PdfStandardFont, PdfTrueTypeFont, PdfGridCell, PdfTextWebLink, PdfImage, PdfStringFormat, PdfGridRow } from '@syncfusion/ej2-pdf-export';
import { Matrix, FocusStrategy } from '../services/focus-strategy';
import { CheckBoxFilterBase } from '../common/checkbox-filter-base';
import {
    PdfPageSize, PageOrientation, ContentType, PdfPageNumberType, PdfDashStyle,
    PdfHAlign, PdfVAlign
} from './enum';
import { FlMenuOptrUI } from '../renderer/filter-menu-operator';
import { Dialog, DialogModel } from '@syncfusion/ej2-popups';
import { Render } from '../renderer/render';
import { DetailRow } from '../actions/detail-row';
import { Print } from '../actions/print';
import { Clipboard } from '../actions/clipboard';
import { PdfPaddings } from '@syncfusion/ej2-pdf-export';
import { AutoCompleteModel } from '@syncfusion/ej2-dropdowns';
import { Page } from '../actions/page';
import { Scroll } from '../actions/scroll';
import { Aggregate } from '../actions/aggregate';
import { InfiniteScroll } from '../actions/infinite-scroll';
import { Filter } from '../actions/filter';
import { ContextMenu } from '../actions/context-menu';
import { FilterMenuRenderer } from '../renderer/filter-menu-renderer';
import { ColumnChooser, Search } from '../..';

/**
 * Specifies grid interfaces.
 *
 * @hidden
 */
export interface IGrid extends Component<HTMLElement> {

    //public properties
    currentViewData?: Object[];
    currentAction?: ActionArgs;
    /**
     * @hidden
     * Specifies whether the inline edit form widgets are destroyed or not.
     * @default false
     */
    isWidgetsDestroyed: boolean;

    /**
     * Specifies the columns for Grid.
     *
     * @default []
     */
    columns?: Column[] | string[] | ColumnModel[];

    /**
     * Specifies whether the enableAltRow is enable or not.
     *
     * @default null
     */
    enableAltRow?: boolean;

    /**
     * Specifies whether the enable row hover is enable or not.
     *
     * @default null
     */
    enableHover?: boolean;

    /**
     * Specifies the allowKeyboard Navigation for the Grid.
     *
     * @default null
     */
    allowKeyboard?: boolean;

    /**
     * If 'enableStickyHeader' set to true, then the user can able to make the column headers visible when the document is scrolled.
     *
     * @default null
     */
    enableStickyHeader?: boolean;

    /**
     * If 'enableHtmlSanitizer' set to true, then it will sanitize any suspected untrusted strings and scripts before rendering them.
     *
     * @default null
     */
    enableHtmlSanitizer?: boolean;

    /**
     * Specifies whether the allowTextWrap is enabled or not.
     *
     * @default null
     */
    allowTextWrap?: boolean;

    /**
     * Specifies the 'textWrapSettings' for Grid.
     *
     * @default []
     */
    textWrapSettings?: TextWrapSettingsModel;

    /**
     * Specifies whether the paging is enable or not.
     *
     * @default null
     */
    allowPaging?: boolean;

    /**
     * Specifies the 'enableAutoFill' for Grid.
     *
     * @default []
     */
    enableAutoFill?: boolean;

    /**
     * Specifies the pageSettings for Grid.
     *
     * @default PageSettings
     */
    pageSettings?: PageSettingsModel;

    /**
     * Configures the Loading Indicator of the Grid.
     *
     * @default LoadingIndicator
     */
    loadingIndicator?: LoadingIndicatorModel;

    /**
     * Specifies the shimmer effect for Grid virtual and infinite scrolling.
     *
     * @default true
     */
    enableVirtualMaskRow?: boolean;

    /**
     * Specifies whether the Virtualization is enable or not.
     *
     */
    enableVirtualization: boolean;

    /**
     * Specifies whether the ColumnVirtualization is enable or not.
     *
     */
    enableColumnVirtualization: boolean;

    /**
     * Specifies whether the InfiniteScrolling is enable or not.
     *
     */
    enableInfiniteScrolling: boolean;

    /**
     * Specifies whether the sorting is enable or not.
     *
     * @default null
     */
    allowSorting?: boolean;

    /**
     *  Defines the mode of clip. The available modes are,
     * `Clip`: Truncates the cell content when it overflows its area.
     * `Ellipsis`: Displays ellipsis when the cell content overflows its area.
     * `EllipsisWithTooltip`:  Displays ellipsis when the cell content overflows its area,
     *  also it will display the tooltip while hover on ellipsis is applied.
     *
     * @default Ellipsis
     */
    clipMode?: ClipMode;

    /**
     * Defines the resizing behavior of the Grid.
     *
     * @default []
     */
    resizeSettings?: ResizeSettingsModel;

    /**
     * Specifies whether the multi-sorting is enable or not.
     *
     * @default null
     */
    allowMultiSorting?: boolean;

    /**
     * Specifies the sortSettings for Grid.
     *
     * @default []
     */
    sortSettings?: SortSettingsModel;

    /**
     * Specifies the infinite scroll settings for Grid.
     *
     * @default []
     */
    infiniteScrollSettings?: InfiniteScrollSettingsModel;

    /**
     * Specifies whether the Excel exporting is enable or not.
     *
     * @default null
     */
    allowExcelExport?: boolean;
    /**
     * Specifies whether the Pdf exporting is enable or not.
     *
     * @default null
     */
    allowPdfExport?: boolean;

    /**
     * Specifies whether the selection is enable or not.
     *
     * @default null
     */
    allowSelection?: boolean;

    /**
     * It is used to select the row while initializing the grid.
     *
     * @default -1
     */
    selectedRowIndex?: number;

    /**
     * Specifies the selectionSettings for Grid.
     *
     * @default []
     */
    selectionSettings?: SelectionSettingsModel;

    /**
     * Specifies whether the reordering is enable or not.
     *
     * @default null
     */
    allowReordering?: boolean;

    /**
     * If `allowResizing` set to true, then the Grid columns can be resized.
     *
     * @default false
     */
    allowResizing?: boolean;

    /**
     * Specifies whether the filtering is enable or not.
     *
     * @default null
     */
    allowFiltering?: boolean;

    /**
     * Specifies the filterSettings for Grid.
     *
     * @default []
     */
    filterSettings?: FilterSettingsModel;

    /**
     * Specifies whether the grouping is enable or not.
     *
     * @default null
     */
    allowGrouping?: boolean;

    /**
     * Specifies whether the immutable mode is enable or not.
     *
     * @default null
     */
    enableImmutableMode?: boolean;

    /**
     * Specifies whether the column menu is show or not.
     *
     * @default null
     */
    showColumnMenu?: boolean;

    /**
     * Specifies whether to auto fit the columns based on given width.
     *
     * @default null
     */
    autoFit?: boolean;

    /**
     * Specifies the groupSettings for Grid.
     *
     * @default []
     */
    groupSettings?: GroupSettingsModel;

    /**
     * if showColumnChooser is true, then column chooser will be enabled in Grid.
     *
     * @default false
     */
    showColumnChooser?: boolean;

    /**
     * Specifies the 'columnChooserSettings' for Grid.
     *
     * @default []
     */
    columnChooserSettings?: ColumnChooserSettingsModel;

    /**
     * Specifies the editSettings for Grid.
     *
     * @default []
     */
    editSettings?: EditSettingsModel;

    /**
     * Specifies the summaryRows for Grid.
     *
     * @default []
     */
    aggregates?: AggregateRowModel[];


    /**
     * Specifies scrollable height of the grid content.
     *
     * @default 'auto'
     */
    height?: string | number;
    /**
     * Specifies scrollable width of the grid content.
     *
     * @default 'auto'
     */
    width?: string | number;

    /**
     * Specifies the searchSettings for Grid.
     *
     * @default []
     */
    searchSettings?: SearchSettingsModel;

    /**
     * Specifies the rowDropSettings for Grid.
     *
     * @default []
     */
    rowDropSettings?: RowDropSettingsModel;

    /**
     * Specifies whether the allowRowDragAndDrop is enable or not.
     *
     * @default false
     */
    allowRowDragAndDrop?: boolean;

    /**
     * Specifies whether the gridLines mode
     *
     * @default null
     */
    gridLines?: GridLine;

    /**
     * Specifies rowTemplate
     */
    rowTemplate?: string | Function;

    /**
     * Specifies the template for rendering a customized element or text instead of displaying the empty record message.
     */
    emptyRecordTemplate?: string | Function;

    /**
     * Specifies detailTemplate
     */
    detailTemplate?: string | Function;

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
     *
     * @default []
     */
    dataSource?: Object | DataManager;

    /**
     * Defines the row height for Grid rows.
     *
     * @default null
     */
    rowHeight?: number;

    /**
     * Specifies the query for Grid.
     *
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
     * `vGroupOffsets`provides options to store the whole data objects block heights.
     * @default false
     */
    isVirtualAdaptive?: boolean;

    /**
     * @hidden
     * `isColumnMenuFilterClosing`used to handle the closing of the column menu filter on esc key.
     * @default false
     */
    isColumnMenuFilterClosing?: boolean;


    /**
     * @hidden
     * `vGroupOffsets`provides options to store the whole data objects block heights.
     * @default {}
     */
    vGroupOffsets?: { [x: number]: number };

    /**
     * @hidden
     * `vRows`provides options to store the whole row objects from the datasource.
     * @default []
     */
    vRows?: Row<Column>[];

    /**
     * @hidden
     * `vcRows`provides options to store the whole row objects from the datasource.
     * @default []
     */
    vcRows?: Row<Column>[];

    /**
     * @hidden
     * Specifies the toolbar for Grid.
     * @default null
     */
    toolbar?: (ToolbarItems | string | ItemModel | ToolbarItem)[];

    /**
     * Specifies the context menu items for Grid.
     *
     * @default null
     */
    contextMenuItems?: ContextMenuItem[] | ContextMenuItemModel[];

    /**
     * Specifies the column menu items for Grid.
     *
     * @default null
     */
    columnMenuItems?: string[] | ContextMenuItemModel[];

    /**
     * @hidden
     * It used to render toolbar template
     * @default null
     */
    toolbarTemplate?: string | Function;

    /**
     * @hidden
     * It used to render pager template
     * @default null
     */
    pagerTemplate?: string | Function;

    /**
     * @hidden
     * It used to indicate initial loading
     * @default false
     */
    isInitialLoad?: boolean;

    /**
     * Defines the frozen rows for the grid content
     *
     * @default 0
     */
    frozenRows?: number;

    /**
     * Defines the grid rows displaying direction.
     *
     * @default 'Horizontal'
     */
    rowRenderingMode?: RowRenderingDirection;

    /**
     * If `enableAdaptiveUI` set to true the grid dialogs will be displayed at fullscreen.
     *
     * @default false
     */
    enableAdaptiveUI?: boolean;

    /**
     * One of the adaptiveUIMode enumeration that specifies the Adaptive Mode. The default value is Both.
     *
     * @default 'Both'
     */
    adaptiveUIMode?: string;

    /**
     * Defines the frozen columns for the grid content
     *
     * @default 0
     */
    frozenColumns?: number;

    /**
     * Specifies whether the Searching for columns is enable or not.
     *
     * @default true
     */
    allowSearching?: boolean;

    /**
     * Defines the own class for the grid element.
     *
     * @default ''
     */
    cssClass?: string;

    isEdit?: boolean;

    commonQuery?: Query;

    scrollPosition: ScrollPositionType;

    isLastCellPrimaryKey?: boolean;

    editModule?: Edit;

    selectionModule?: Selection;

    aggregateModule?: Aggregate;

    scrollModule?: Scroll;

    infiniteScrollModule?: InfiniteScroll;

    resizeModule: Resize;

    searchModule: Search;

    focusModule?: FocusStrategy;

    mergeCells?: { [key: string]: number };

    checkAllRows?: CheckState;

    isCheckBoxSelection?: boolean;

    isPersistSelection?: boolean;

    pageRequireRefresh?: boolean;

    localeObj?: L10n;

    isManualRefresh?: boolean;

    translateX?: number;

    leftrightColumnWidth?: Function;

    isAutoFitColumns?: boolean;

    enableDeepCompare?: boolean;

    totalDataRecordsCount?: number;

    disableSelectedRecords?: Object[];

    partialSelectedRecords?: Object[];

    lazyLoadRender?: IRenderer;

    isSpan?: boolean;

    islazyloadRequest?: boolean;

    isAddNewRow?: boolean;

    addNewRowFocus?: boolean;

    prevPageMoving?: boolean;

    renderModule?: Render;

    headerModule?: IRenderer;

    contentModule?: IRenderer;

    isPreventScrollEvent?: boolean;

    hierarchyPrintMode?: HierarchyGridPrintMode;

    detailRowModule?: DetailRow;

    printModule?: Print;

    clipboardModule?: Clipboard;

    filterModule?: Filter;

    columnChooserModule?: ColumnChooser;

    requestTypeAction?: string;

    expandedRows?: { [index: number]: IExpandedRow };
    registeredTemplate?: Object;
    lockcolPositionCount?: number;
    commandDelIndex?: number;
    isFocusFirstCell?: boolean;
    preventAutoFit?: boolean;
    isPrinting?: boolean;
    id?: string;
    isSelectedRowIndexUpdating?: boolean;
    pagerModule?: Page;
    invokedFromMedia?: boolean;
    isAutoGen?: boolean;
    pageTemplateChange?: boolean;
    enableHeaderFocus?: boolean;
    renderTemplates?: Function;
    requireTemplateRef?: boolean;
    tableIndex?: number;
    isVue3?: boolean;
    adaptiveDlgTarget?: HTMLElement;
    parentDetails?: ParentDetails;
    printGridParent?: IGrid;

    /**
     * @hidden
     * It used to render pager template
     * @default null
     */
    contextMenuModule?: ContextMenu;

    //public methods
    getHeaderContent?(): Element;
    isRowDragable(): boolean;
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
    getFrozenRightRowByIndex?(index: number): Element;
    getFrozenRowByIndex?(index: number): Element;
    showResponsiveCustomFilter?(): void;
    showResponsiveCustomSort?(): void;
    showResponsiveCustomColumnChooser?(): void;
    getRowInfo?(target: Element): RowInfo;
    selectRow?(index: number, isToggle?: boolean): void;
    getColumnHeaderByIndex?(index: number): Element;
    getColumnByField?(field: string): Column;
    getColumnIndexByField?(field: string): number;
    getColumnByUid?(uid: string, isColumn?: boolean): Column;
    getColumnIndexByUid?(uid: string): number;
    getColumnByIndex?(index: number): Column;
    getUidByColumnField?(field: string): string;
    getNormalizedColumnIndex?(uid: string): number;
    getIndentCount?(): number;
    getColumnIndexesInView(): number[];
    setColumnIndexesInView(indexes?: number[]): void;
    getRows?(): Element[];
    getCellFromIndex?(rowIndex: number, columnIndex: number): Element;
    getMovableCellFromIndex?(rowIndex: number, columnIndex: number): Element;
    getFrozenRightCellFromIndex?(rowIndex: number, columnIndex: number): Element;
    getColumnFieldNames?(): string[];
    getSelectedRows?(): Element[];
    getSelectedRecords?(): Object[];
    getSelectedRowIndexes?(): number[];
    getSelectedRowCellIndexes(): ISelectedCell[];
    getCurrentViewRecords(): Object[];
    selectRows?(indexes: number[]): void;
    clearSelection?(): void;
    clearRowSelection?(): void;
    updateExternalMessage?(message: string): void;
    getColumns?(isRefresh?: boolean): Column[];
    getStackedHeaderColumnByHeaderText?(stackedHeader: string, col: Column[]): Column;
    getStackedColumns?(column: Column[]): Column[];
    getRowTemplate?(): Function;
    getEmptyRecordTemplate?(): Function;
    getDetailTemplate?(): Function;
    getEditTemplate?(): Function;
    getEditFooterTemplate?(): Function;
    getEditHeaderTemplate?(): Function;
    getColumnChooserTemplate?(): Function;
    getColumnChooserHeaderTemplate?(): Function;
    getColumnChooserFooterTemplate?(): Function;
    getFilterTemplate?(): Function;
    sortColumn?(columnName: string, sortDirection: SortDirection, isMultiSort?: boolean): void;
    changeDataSource?(columns?: Column[] | string[] | ColumnModel[], data?: Object | DataManager | DataResult): void;
    clearSorting?(): void;
    removeSortColumn?(field: string): void;
    clearGridActions?(): void;
    getColumnHeaderByUid?(uid: string): Element;
    getColumnHeaderByField?(field: string): Element;
    showColumns?(keys: string | string[], showBy?: string): void;
    hideColumns?(keys: string | string[], hideBy?: string): void;
    showSpinner?(): void;
    hideSpinner?(): void;
    showMaskRow?(axisDirection?: string, dialogElement?: Element): void;
    removeMaskRow?(): void;
    addShimmerEffect?(): void;
    updateDefaultCursor?(): void;
    getVisibleColumns?(): Column[];
    refreshHeader?(): void;
    getDataRows?(): Element[];
    getMovableDataRows?(): Element[];
    getFrozenRightDataRows?(): Element[];
    getFrozenDataRows?(): Element[];
    addMovableRows?(fRows: HTMLElement[], mrows: HTMLElement[]): HTMLElement[];
    getPrimaryKeyFieldNames?(): string[];
    autoFitColumns(fieldNames?: string | string[]): void;
    preventAdjustColumns?(): void;
    groupColumn(columnName: string): void;
    ungroupColumn(columnName: string): void;
    ensureModuleInjected(module: Function): boolean;
    isContextMenuOpen(): boolean;
    goToPage(pageNo: number): void;
    updateVisibleExpandCollapseRows?(): void;
    sanitize?(value: string): string;
    getFrozenColumns(): number;
    getFrozenRightColumnsCount?(): number;
    getFrozenLeftColumnsCount?(): number;
    getFrozenLeftCount?(): number;
    getMovableColumnsCount?(): number;
    isFrozenGrid?(): boolean;
    getFrozenMode?(): freezeMode;
    getTablesCount?(): number;
    setFrozenCount?(): void;
    getVisibleFrozenLeftCount?(): number;
    getVisibleFrozenRightCount?(): number;
    getVisibleMovableCount?(): number;
    getFrozenRightColumns?(): Column[];
    getFrozenLeftColumns?(): Column[];
    getMovableColumns?(): Column[];
    refreshReactColumnTemplateByUid?(columnUid: string, renderTemplates?: boolean): void;
    refreshReactHeaderTemplateByUid?(columnUid: string): void;
    refreshGroupCaptionFooterTemplate?(): void;
    getAllDataRows?(includeBatch: boolean): Element[];
    getAllMovableDataRows?(includeBatch: boolean): Element[];
    getAllFrozenDataRows?(includeBatch: boolean): Element[];
    getAllFrozenRightDataRows?(includeBatch: boolean): Element[];
    getMovableColumnHeaderByIndex?(index: number): Element;
    getFrozenRightColumnHeaderByIndex?(index: number): Element;
    getFrozenLeftColumnHeaderByIndex?(index: number): Element;
    applyBiggerTheme(args: Element): void;
    getVisibleFrozenColumns(): number;
    print(): void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    excelExport(exportProperties?: any, isMultipleExport?: boolean, workbook?: any): Promise<any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    csvExport(exportProperties?: any, isMultipleExport?: boolean, workbook?: any): Promise<any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pdfExport(exportProperties?: any, isMultipleExport?: boolean, pdfDoc?: Object): Promise<Object>;
    search(searchString: string): void;
    deleteRecord?(fieldname?: string, data?: Object): void;
    startEdit?(): void;
    endEdit?(): void;
    closeEdit?(): void;
    addRecord?(data?: Object): void;
    deleteRow?(tr: HTMLTableRowElement): void;
    getRowObjectFromUID?(uid: string, isMovable?: boolean, isFrozenRight?: boolean): Row<Column>;
    addFreezeRows?(fRows: Row<Column>[], mRows?: Row<Column>[]): Row<Column>[];
    getRowsObject?(): Row<Column>[];
    getMovableRowsObject?(): Row<Column>[];
    getFrozenRightRowsObject?(): Row<Column>[];
    getFrozenRightContent?(): Element;
    getFrozenRightHeader?(): Element;
    getMovableHeaderTbody?(): Element;
    getMovableContentTbody?(): Element;
    getFrozenHeaderTbody?(): Element;
    getFrozenLeftContentTbody?(): Element;
    getFrozenRightHeaderTbody?(): Element;
    getFrozenRightContentTbody?(): Element;
    createColumnchooser(x: number, y: number, target: Element): void;
    getDataModule?(): Data;
    refreshTooltip?(): void;
    copy?(withHeader?: boolean): void;
    getLocaleConstants?(): Object;
    getForeignKeyColumns?(): Column[];
    getRowHeight?(): number;
    setCellValue(key: string | number, field: string, value: string | number | boolean | Date | null): void;
    setRowData(key: string | number, rowData?: Object): void;
    getState?(): Object;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    destroyTemplate?(templateName: string[], index?: any): void;
    getQuery?(): Query;
    log?(type: string | string[], args?: Object): void;
    isDetail?(): boolean;
    updateMediaColumns?(col: Column): void;
    hideScroll?(): void;
    grabColumnByFieldFromAllCols(field: string, isForeignKey?: boolean): Column;
    grabColumnByUidFromAllCols(uid: string): Column;
    getRowUid(prefix: string): string;
    getFilteredRecords(): Object[] | Promise<Object>;
    getRowElementByUID?(uid: string): Element;
    getMediaColumns?(): void;
    isCollapseStateEnabled?(): boolean;
    mergePersistGridData?(setData?: Object): void;
    setForeignKeyData?(args: DataResult): void;
    getSelectedColumnsUid?(): string[];
    serverExcelExport?(url: string): void;
    serverPdfExport?(url: string): void;
    getCurrentVisibleColumns?(isColVirtualization?: boolean): Column[];
    // public Events
    dataStateChange?: EmitType<DataStateChangeEventArgs>;
    exportGroupCaption?: EmitType<ExportGroupCaptionEventArgs>;
    columnDataStateChange?: EmitType<ColumnDataStateChangeEventArgs>;
}

/** @hidden */

export interface IExpandedRow {
    index?: number;
    gridModel?: Object;
    isExpand?: boolean;
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
    getFrozenRightRows?(): Row<{}>[] | HTMLCollectionOf<HTMLTableRowElement>;
    refreshUI?(): void;
    setVisible?(column?: Column[]): void;
    addEventListener?(): void;
    removeEventListener?(): void;
    getRowElements?(): Element[];
    setSelection?(uid: string, set: boolean, clearAll: boolean): void;
    getRowByIndex?(index: number): Element;
    getVirtualRowIndex?(index: number): number;
    getRowInfo?(target: Element): RowInfo;
    getState?(): Object;

    getMovableContent?(): Element;
    destroyTemplate?(templateName: string[]): void;
    emptyVcRows?(): void;
    getBlockSize?(): number;
    getGroupedTotalBlocks?(): number;
    isEndBlock?(block: number): boolean;
}

/**
 * IAction interface
 *
 * @hidden
 */
export interface IAction {
    updateModel?(): void;
    onActionBegin?(args?: Object, type?: string): void;
    onActionComplete?(args?: Object, type?: string): void;
    addEventListener?(): void;
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
export interface CustomOperators {
    stringOperator?: { value: string; text: string }[];
    numberOperator?: { value: string; text: string }[];
    dateOperator?: { value: string; text: string }[];
    datetimeOperator?: { value: string; text: string }[];
    dateonlyOperator?: { value: string; text: string }[];
    booleanOperator?: { value: string; text: string }[];
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
    params?: DatePickerModel | NumericTextBoxModel | DropDownListModel |
    CheckBoxModel | MultiSelectModel | AutoCompleteModel | ComboBoxModel | SwitchModel |
    TimePickerModel | MaskedTextBoxModel | TextBoxModel | DateTimePickerModel;
    destroy?: Function | string;
}
/**
 * @hidden
 */
export interface IDialogUI {
    params?: DialogModel;
}
/**
 * @hidden
 */
export interface IFilterUI {
    create?: Element | Function | string;
    read?: Object | Function | string;
    write?: void | Function | string;
    destroy?: Function | string;
}
/**
 * @hidden
 */
export interface IFilterMUI {
    create?: void | Function | string;
    read?: Object | Function | string;
    write?: void | Function | string;
    destroy?: void | Function | string;
}

/**
 * @hidden
 */
export interface ICustomOptr {
    stringOperator?: { [key: string]: Object }[];
    numberOperator?: { [key: string]: Object }[];
    dateOperator?: { [key: string]: Object }[];
    datetimeOperator?: { [key: string]: Object }[];
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
    render(cell: Cell<T>, data: Object, attributes?: { [x: string]: string }, isExpand?: boolean, isEdit?: boolean): Element;
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
    isNull: string;
    notNull: string;
    wildCard: string;
    like: string;
}

export interface NotifyArgs {
    /** Defines the total records. */
    records?: Object[];
    /** Defines the record count. */
    count?: number;
    /** Defines the request type. */
    requestType?: Action;
    /** Defines the target. */
    target?: HTMLElement;
    /** Defines the module. */
    module?: string;
    /** Defines the enable property. */
    enable?: boolean;
    /** Defines the properties. */
    properties?: Object;
    /** Defines the virtualization info like block, event name and next page need to be loaded. */
    virtualInfo?: VirtualInfo;
    /** Defines whether the action needs to be cancel or not. */
    cancel?: boolean;
    /** Defines the rows. */
    rows?: Row<Column>[];
    /** Defines whether the grid is frozen or not. */
    isFrozen?: boolean;
    /** Defines the arguments. */
    args?: NotifyArgs;
    /** Defines the scroll top value. */
    scrollTop?: Object;
    /** Defines the old properties. */
    oldProperties?: string[];
    /** Defines the focus element. */
    focusElement?: HTMLElement;
    /** Defines the row object. */
    rowObject?: Row<Column>;
    /** Defines the movable content to be rendered. */
    renderMovableContent?: boolean;
    /** Defines the frozen right content. */
    renderFrozenRightContent?: boolean;
    /** Defines the promise. */
    promise?: Promise<Object>;
    /** Defines the frozen rows are rendered or not. */
    isFrozenRowsRender?: boolean;
    /** Defines the action. */
    action?: string;
    /** Defines the searched value. */
    searchString?: string;
    /** Defines the focus on Group. */
    preventFocusOnGroup?: boolean;
}

export interface LoadEventArgs {
    /**
     * * If `requireTemplateRef` is set to false in the load event, then the template element can't be accessed in grid queryCellInfo, and rowDataBound events.
     * * By default, React's grid queryCellInfo and rowDataBound events allow access to the template element.
     * * Avoid accessing the template elements in the grid queryCellInfo and rowDataBound events to improve rendering performance by setting this value as false.
     *
     * @default true
     */
    requireTemplateRef?: boolean;
}

export interface LazyLoadArgs {
    /** Defines expand/collapse caption row details. */
    groupInfo?: Row<Column>;
    /** Defines whether get rows from group cache or make a request. */
    enableCaching?: boolean;
    /** Cancel the expand/collapse action. */
    cancel?: boolean;
    /** Defines the caption row element. */
    captionRowElement?: HTMLTableRowElement;
}

export interface LazyLoadGroupArgs extends LazyLoadArgs {
    /** Defines the makeRequest. */
    makeRequest?: boolean;
    /** Defines the no of records to skip. */
    skip?: number;
    /** Defines the no of records to take. */
    take?: number;
    /** Defines the fields. */
    fields?: string[];
    /** Defines the keys. */
    keys?: string[];
    /** Defines whether the caption row is expanded. */
    isExpand?: boolean;
    /** Defines the virtual scroll action */
    isScroll?: boolean;
    /** Defines the scroll direction. */
    scrollUp?: boolean;
    /** Defines the cached row index. */
    cachedRowIndex?: number;
    /** Defines the row index. */
    rowIndex?: number;
    /** Defines the expand row query. */
    lazyLoadQuery?: object;
    /** Defines the row index. */
    requestType?: string;
}

export interface InfiniteScrollArgs {
    /** Defines the request type. */
    requestType?: Action;
    /** Defines the current page. */
    currentPage?: number;
    /** Defines the previous page. */
    prevPage?: number;
    /** Defines the row start index. */
    startIndex?: number;
    /** Defines the scroll direction. */
    direction?: string;
    /** Defines whether the grid is frozen or not. */
    isFrozen?: boolean;
    /** Defines whether the caption collapse. */
    isCaptionCollapse?: boolean;
    /** Defines the ParentUid. */
    parentUid?: string;
}

export interface ReorderEventArgs extends GridActionEventArgs {
    /** Defines the index of the column being dragged. */
    fromIndex?: number;
    /** Defines the index of the column where the dragged column is dropped. */
    toIndex?: number;
    /** Defines the Uid of the column where the dragged column is dropped. */
    toColumnUid?: string;
}

/**
 * @hidden
 */
export interface FrozenReorderArgs {
    column?: Column;
    destIndex?: number;
    columns?: Column[];
    parent?: Column;
    cancel?: boolean;
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
    parentGid?: number;
    childGid?: number;
    data?: Object;
    gSummary?: number;
    aggregatesCount?: number;
    tIndex?: number;
    collapseRows?: Object[];
    isSelected?: boolean;

    isFreezeRow? : boolean;

    isReadOnly?: boolean;

    isCaptionRow?: boolean;

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
    parentUid?: string;
    isSelectable?: boolean;
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

export interface GridActionEventArgs {
    /** Defines the current action. */
    requestType?: Action;
    /** Defines the type of event. */
    type?: string;
    /** Cancel the print action */
    cancel?: boolean;

}

export interface FailureEventArgs {
    /** Defines the error information. */
    error?: Error;
}

export interface FilterEventArgs extends GridActionEventArgs {
    /** Defines the object that is currently filtered. */
    currentFilterObject?: PredicateModel;
    /** Defines the column name that is currently filtered. */
    currentFilteringColumn?: string;
    /** Defines the collection of filtered columns. */
    columns?: PredicateModel[];
}

export interface GroupEventArgs extends GridActionEventArgs {
    /** Defines the field name of the currently grouped columns. */
    columnName?: string;
}

export interface PageEventArgs extends GridActionEventArgs {
    /** Defines the previous page number. */
    previousPage?: string;
    /** Defines the current page number. */
    currentPage?: string;
    /** Defines the number of records displayed per page. */
    pageSize?: string;
    /** Defines the row information of the current page. */
    rows?: Row<Column>[];
}

export interface SortEventArgs extends GridActionEventArgs {
    /** Defines the field name of currently sorted column. */
    columnName?: string;
    /** Defines the direction of sort column. */
    direction?: SortDirection;
}

export interface SearchEventArgs extends GridActionEventArgs {
    /** Defines the string value to search. */
    searchString?: string;
}

export interface PrintEventArgs extends GridActionEventArgs {
    /** Defines the Grid element. */
    element?: Element;
    /** Defines the currently selected rows. */
    selectedRows?: NodeListOf<Element>;
    /** Cancel the print action */
    cancel?: boolean;
    /** Hierarchy Grid print mode */
    hierarchyPrintMode?: HierarchyGridPrintMode;
}

export interface DetailDataBoundEventArgs {
    /** Defines the details row element. */
    detailElement?: Element;
    /** Defines the selected row data.
     *
     * @isGenericType true
     */
    data?: Object;
    /** Defines the child grid of the current row. */
    childGrid?: IGrid;
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

export interface AdaptiveDialogEventArgs {
    /** Defines the cancel option value. */
    cancel?: boolean;
    /** Defines the instance of adaptive dialog. */
    dialogObj?: Dialog;
    /** Defines the current action. */
    requestType?: string;
}

export interface RowDeselectEventArgs {
    /** Defines the current selected/deselected row data.
     *
     * @isGenericType true
     */
    data?: Object | Object[];
    /** Defines the selected/deselected row index. */
    rowIndex?: number;
    /** Defines the selected/deselected row indexes. */
    rowIndexes?: number[];
    /** Defines the selected/deselected row. */
    row?: Element | Element[];
    /** Define the foreignKey row data associated with this column */
    foreignKeyData?: Object | Object[];
    /** Defines the target element for row deselect. */
    target?: Element;
    /** Defines whether event is triggered by interaction or not. */
    isInteracted?: boolean;
    /** Defines whether header checkbox is clicked or not */
    isHeaderCheckboxClicked ?: boolean;
}

export interface RowSelectEventArgs extends RowDeselectEventArgs {
    /** Defines the previously selected row index. */
    previousRowIndex?: number;
    /** Defines the previously selected row. */
    previousRow?: Element;
    /** Defines the target element for selection. */
    target?: Element;
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
    /** Defines the current row data.
     *
     * @isGenericType true
     */
    rowData?: Object;
    /** Defines the row index. */
    rowIndex?: number;
    /** Define the foreignKey row data associated with this column */
    foreignKeyData?: Object;
}

export interface RecordClickEventArgs {
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
    /** Defines the current row data.
     *
     * @isGenericType true
     */
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
    /** Defines the cancel option value. */
    cancel?: boolean;
}

export interface RowDeselectingEventArgs extends RowDeselectEventArgs {
    /** Defines the cancel option value. */
    cancel?: boolean;
}

export interface CellDeselectEventArgs {
    /** Defines the currently selected/deselected row data.
     *
     * @isGenericType true
     */
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
    /** Defines the current row data.
     *
     * @isGenericType true
     */
    data?: Object;
    /** Defines the row element.
     *
     * @blazorType CellDOM
     */
    row?: Element;
    /** Defines the row height */
    rowHeight?: number;

    /** Defines whether the row should be select or not */
    isSelectable?: boolean;
}

export interface HeaderCellInfoEventArgs {
    /** Defines the cell. */
    cell?: Cell<Column>;
    /** Defines the cell element. */
    node?: Element;
}

export interface ExportGroupCaptionEventArgs {
    /** Defines the group caption text. */
    captionText?: string;
    /** Defines the export type. */
    type?: string;
    /** Defines the grouped data items. */
    data?: Object;
    /** Defines the style of the grouped cell. */
    style?: PdfStyle;
}

export interface QueryCellInfoEventArgs {
    /** Defines the row data associated with this cell.
     *
     * @isGenericType true
     */
    data?: Object;
    /** Defines the cell element.
     *
     * @blazorType CellDOM
     */
    cell?: Element;
    /** Defines the column object associated with this cell.
     *
     * @blazorType GridColumn
     */
    column?: Column;
    /** Defines the no. of columns to be spanned */
    colSpan?: number;
    /** Defines the no. of rows to be spanned */
    rowSpan?: number;
    /** Defines the current action. */
    requestType?: string;

    /** Define the foreignKey row data associated with this column */
    foreignKeyData?: Object;
}

export interface PdfQueryCellInfoEventArgs {
    /** Defines the column of the current cell. */
    column?: Column;
    /** Defines the style of the current cell. */
    style?: PdfStyle;
    /** Defines the value of the current cell. */
    value?: Date | string | number | boolean | PdfTextWebLink | PdfImage;
    /** Defines the no. of columns to be spanned */
    colSpan?: number;
    /** Defines the data of the cell
     *
     * @isGenericType true
     */
    data?: Object;
    /** Defines the current PDF cell */
    cell?: PdfGridCell;
    /** Defines the image details */
    image?: { base64: string};
    /** Defines the hyperlink of the cell */
    hyperLink?: Hyperlink;
}

export interface ExportDetailDataBoundEventArgs {
    /** Defines the child grid of the current row. */
    childGrid?: IGrid;
    /** Defines the row object of the current data. */
    row?: Row<Column>;
    /** Defines the PDF grid current cell. */
    cell?: PdfGridCell;
    /** Defines the export properties */
    exportProperties?: PdfExportProperties | ExcelExportProperties;
}


export interface ExportDetailTemplateEventArgs {
    /** Defines the details of parent row. */
    parentRow?: Row<Column>;
    /** Defines the details of excel/pdf row */
    row?: ExcelRow | PdfGridRow;
    /** Define the detail template values. */
    value?: DetailTemplateProperties;
    /** Defines the action */
    action?: string;
    /** Defines the grid object */
    gridInstance?: IGrid,
}

export interface DetailTemplateProperties {
    /** Defines the total columns length of the detail pdf grid */
    columnCount?: number;
    /** Defines the base 64 for the cell */
    image?: { base64: string, height?: number, width?: number };
    /** Defines the text for the cell */
    text?: string;
    /** Defines the header content for detail row */
    columnHeader?: DetailTemplateRow[];
    /** Defines the content content for detail row */
    rows?: DetailTemplateRow[];
    /** Defines the hyperlink of the cell */
    hyperLink?: Hyperlink;
}

export interface DetailTemplateRow {
    /**  Defines the index of the row */
    index?: number;
    /**  Defines the cells in a row */
    cells?: DetailTemplateCell[];
    /** Defines the group of rows to expand and collapse */
    grouping?: Object;
}

export interface DetailTemplateCell {
    /** Defines the index for the cell */
    index?: number;
    /** Defines the column span for the cell  */
    colSpan?: number;
    /** Defines the value of the cell */
    value?: string | boolean | number | Date | PdfTextWebLink | PdfImage;
    /** Defines the hyperlink of the cell */
    hyperLink?: Hyperlink;
    /** Defines the style of the cell */
    style?: DetailTemplateCellStyle;
    /** Defines the row span for the cell */
    rowSpan?: number;
    /** Defines the base 64 for the cell */
    image?: { base64: string, height?: number, width?: number };
}

export interface DetailTemplateCellStyle {
    /** Defines the color of font */
    fontColor?: string;
    /** Defines the name of font */
    fontName?: string;
    /** Defines the size of font */
    fontSize?: number;
    /** Defines the horizontal alignment for excel cell style */
    excelHAlign?: ExcelHAlign;
    /** Defines the vertical alignment for excel cell style */
    excelVAlign?: ExcelVAlign;
    /** Defines the rotation degree for excel cell style */
    excelRotation?: number;
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
    /** Defines the borders for excel cell style */
    excelBorders?: ExcelBorder;
    /** Defines the format of the excel cell */
    excelNumberFormat?: string;
    /** Defines the type of the excel cell */
    excelType?: string;
    /** Defines the strike through of the cell */
    strikeThrough?: boolean;
    /** Defines the text pen color for the pdf cell */
    pdfTextPenColor?: string;
    /** Defines the horizontal alignment for the pdf cell */
    pdfTextAlignment?: PdfHAlign;
    /** Defines the vertical alignment for the pdf cell */
    pdfVerticalAlignment?: PdfVAlign;
    /** Defines the font family for the pdf cell */
    pdfFontFamily?: string;
    /** Defines the indent alignment for the pdf cell */
    pdfIndent?: PdfHAlign;
    /** Defines the grid border for the pdf cell */
    pdfBorder?: PdfBorder;
    /** Defines the indent for the pdf cell*/
    pdfParagraphIndent?: number;
    /*Defines the padding of the pdf cell */
    pdfCellPadding?: PdfPaddings;
}

export interface AggregateQueryCellInfoEventArgs {
    /** Defines the row data associated with this cell. */
    row?: Object ;
    /** Defines the cell. */
    cell?: Object ;
    /** Defines the type of the cell */
    type?: AggregateTemplateType ;
    /** Defines the data of the current cell */
    data?: object ;
    /** Defines the style of the current cell. */
    style?: object;
    /** Defines the cell value. */
    value?: string;
}


export interface PdfHeaderQueryCellInfoEventArgs {
    /** Defines the PDF grid current cell. */
    cell?: object;
    /** Defines the style of the current cell. */
    /* tslint:disable:no-any */
    style?: PdfStyle;
    /** Defines the current cell with column */
    gridCell?: object;
    /** Defines the image details */
    image?: { base64: string};
    /** Defines the hyperlink of the cell */
    hyperLink?: Hyperlink;

}

export interface Image {
    /**  Defines the base 64 string for image */
    base64: string;
    /**  Defines the height for the image */
    height: number;
    /**  Defines the height for the image */
    width: number;
}

export interface ExcelQueryCellInfoEventArgs {
    /** Defines the row data associated with this cell.
     *
     * @isGenericType true
     */
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
    cell?: number | ExcelStyle | { name: string } | ExcelCell;
    /** Defines the image details */
    image?: Image;
    /** Defines the hyperlink */
    hyperLink?: Hyperlink;
}
export interface ExcelHeaderQueryCellInfoEventArgs {
    /** Defines the cell that contains colspan. */
    cell?: Object;
    /** Defines the style of the current cell. */
    style?: ExcelStyle;
    /** Defines the Grid cell instance */
    gridCell?: Cell<Column> | ExcelCell;
    /** Defines the image details */
    image?: Image;
    /** Defines the hyperlink */
    hyperLink?: Hyperlink;
}

export interface FilterMenuRendererArgs {
    /** Defines the filter model */
    filterModel?: FilterMenuRenderer;
    /** Defines the current action */
    requestType?: string;
    /** Defines the field name of current column */
    columnName?: string;
    /** Defines the field type of current column */
    columnType?: string;
}

export interface FilterSearchBeginEventArgs {
    /** Defines the current action. */
    requestType?: string;
    /** Defines the filter model. */
    filterModel?: CheckBoxFilterBase;
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
    /** Defines the datasource for filter request */
    dataSource?: Object[];
    /** Defines the value of the current search */
    value?: Date | string | number | boolean;
}

export interface FilterUI {
    /** Defines the field */
    field?: string;
    /** Defines the Operator */
    operator?: string;
    /** Defines the first operator for excel filter */
    firstOperator?: string;
    /** Defines the second Operator for excel filter */
    secondOperator?: string;
}

export interface MultipleExport {
    /** Indicates whether to append the multiple grid in same sheet or different sheet */
    type?: MultipleExportType;
    /**  Defines the number of blank rows between the multiple grid data */
    blankRows?: number;
}
export interface MultiplePdfExport {
    /** Indicates whether to append the multiple grid in same sheet or different sheet */
    type?: MultiplePdfExportType;
    /**  Defines the blank space between the multiple grid data */
    blankSpace?: number;
}
export interface ExcelRow {
    /**  Defines the index for cells */
    index?: number;
    /**  Defines the cells in a row */
    cells?: ExcelCell[];
    /** Defines the group of rows to expand and collapse */
    grouping?: Object;
}
export interface ExcelBorder {
    /**  Defines the color of border */
    color?: string;
    /**  Defines the line style of border */
    lineStyle?: ExcelBorderLineStyle;
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
    /** Defines the rotation degree for cell style */
    rotation?: number;
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
    borders?: ExcelBorder;
    /** Defines the format of the cell */
    numberFormat?: string;
    /** Defines the type of the cell */
    type?: string;
    /** Defines the strike through of the cell */
    strikeThrough?: boolean;
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
    /*Defines the padding of cell */
    cellPadding?: PdfPaddings;

}
export interface PdfBorder {
    /** Defines the border color */
    color?: string;
    /** Defines the border width */
    width?: number;
    /** Defines the border dash style */
    dashStyle?: PdfDashStyle;
    /**  Defines the line style of border */
    lineStyle?: BorderLineStyle;
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
    /** Defines the row span for the cell */
    rowSpan?: number;
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
    /** Defined the query dynamically before exporting */
    query?: Query;
    /** Exports multiple grid into the excel document */
    multipleExport?: MultipleExport;
    /** Defines the header content for exported document  */
    header?: ExcelHeader;
    /** Defines the footer content for exported document */
    footer?: ExcelFooter;
    /** Defines the columns which are to be customized for Export alone.
     *
     * @blazorType List<GridColumn>
     */
    columns?: Column[];
    /** Indicates to export current page or all page */
    exportType?: ExportType;
    /** Indicates whether to show the hidden columns in exported excel */
    includeHiddenColumn?: boolean;
    /** Defines the theme for exported data  */
    theme?: ExcelTheme;
    /** Defines the file name for the exported file  */
    fileName?: string;
    /** Defines the hierarchy export mode for the pdf grid */
    hierarchyExportMode?: 'Expanded' | 'All' | 'None';
    /** Defines the delimiter for CSV file export */
    separator?: string;
    /** Defines filter icons while exporting */
    enableFilter?: boolean;
}

export interface RowDragEventArgs {
    /** Defines the selected row's element. */
    rows?: Element[];
    /** Defines the target element from which drag starts. */
    target?: Element;
    /** Defines the type of the element to be dragged.
     *
     * @hidden
     */
    draggableType?: string;
    /** Defines the selected row data.
     *
     * @isGenericType true
     */
    data?: Object[];
    /** Defines the drag element from index. */
    fromIndex?: number;
    /** Defines the target element from index. */
    dropIndex?: number;
    /** Define the mouse event */
    originalEvent?: object;
    cancel?: boolean;

}

/**
 * @hidden
 */
export interface EJ2Intance extends HTMLElement {
    // eslint-disable-next-line
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
    parentInstObj?: IGrid
}

/**
 * @hidden
 */
export interface ScrollPositionType {
    top?: number;
    left?: number;
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
    scrollbar?: Element;
    movableContainer?: Element;
    prevTop?: number;
    prevLeft?: number;
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

export interface BeforeBatchAddArgs extends ICancel, IPrimaryKey {
    /** Defines the default data object.
     *
     * @isGenericType true
     */
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
    /** Defines the deleted data.
     *
     * @isGenericType true
     */
    rowData?: Object;
    /** Defines the row index. */
    rowIndex?: number;
}

export interface BeforeBatchDeleteArgs extends BatchDeleteArgs, ICancel {
    /** Defines the row element. */
    row?: Element | Element[];
}

export interface BeforeBatchSaveArgs extends ICancel {
    /** Defines the changed record object. */
    batchChanges?: Object;
}


export interface ResizeArgs extends ICancel {
    /** Event argument of point or touch action.
     *
     * @hidden
     */
    e?: MouseEvent | TouchEvent;
    /** Defines the resizing column details */
    column?: Column;
}

/**
 * @hidden
 */
export interface BatchAddArgs extends ICancel, IPrimaryKey {
    /** Defines the added data.
     *
     * @isGenericType true
     */
    defaultData?: Object;
    /** Defines the column index. */
    columnIndex?: number;
    /** Defines the row element. */
    row?: Element | Element[];
    /** Defines the cell element. */
    cell?: Element | Element[] | HTMLCollection[];
    /** Defines the column object. */
    columnObject?: Column;
}

export interface BeginEditArgs extends ICancel, IPrimaryKey {
    /** Defines the edited data.
     *
     * @isGenericType true
     */
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
    /** Defines the record objects.
     *
     * @isGenericType true
     */
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
     *
     * @hidden
     */
    foreignKeyData?: Object;
    /** Define the form element */
    form?: HTMLFormElement;
    /** Defines the record objects.
     *
     * @isGenericType true
     */
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
    /** Defines the target for dialog */
    target?: HTMLElement;
}

export interface SaveEventArgs extends AddEventArgs {
    /** Defines the previous data.
     *
     * @isGenericType true
     */
    previousData?: Object;
    /** Defines the selected row index. */
    selectedRow?: number;
    /** Defines the current action. */
    action?: string;
    /** Added row index */
    index?: number;
    /** Defines the promise. */
    promise?: Promise<Object>;
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
    /** Define the target for dialog */
    target?: HTMLElement;
    /** Define frozen right table form element */
    frozenRightForm?: HTMLFormElement;
}

export interface DialogEditEventArgs extends EditEventArgs {
    /** Defines the dialog object */
    dialog?: DialogModel;
}

/** @hidden */
export interface CustomEditEventArgs extends EditEventArgs {
    /** Defines the virtual scroll action */
    isScroll?: boolean;
    /** Defines custom virtualization form validation */
    isCustomFormValidation?: boolean;
}

/** @hidden */
export interface CustomAddEventArgs extends AddEventArgs {
    /** Defines the virtual scroll x axis */
    isScroll?: boolean;
}

/**
 * @hidden
 */
export interface CellEditSameArgs extends ICancel {
    /** Defines the row data object.
     *
     * @isGenericType true
     */
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
    /** Defines the Column Object */
    column?: Column;

}

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

export interface CommandClickEventArgs {
    /** Defines the current target element. */
    target?: HTMLElement;
    /** cancel the CRUD action. */
    cancel?: boolean;
    /** Defines the current command column . */
    commandColumn?: CommandModel;
    /** returns particular row data
     *
     * @isGenericType true
     */
    rowData?: Object;
}

export interface IFilterCreate {
    column?: Column;
    target?: HTMLElement;
    getOptrInstance?: FlMenuOptrUI;
    localizeText?: L10n;
    dialogObj?: Dialog;
}

export interface CellSaveArgs extends CellEditSameArgs {
    /** Defines the previous value of the cell. */
    previousValue?: string;
}

export interface BeforeDataBoundArgs {
    /** Defines the data.
     *
     * @isGenericType true
     */
    result?: Object[];
    /** Defines the data count. */
    count?: number;
    /** Defines the cancel option value. */
    cancel?: boolean;
    /** Defines the aggregate values*/
    aggregates?: Object[];
    /** Defines the action of the argument*/
    actionArgs?: Object;
    /** Defines the query for data*/
    query?: Query;
    /** Defines the name of the event*/
    name?: string;
    /**Defines the actual result and count of the data */
    actual?: Object;
    /**Defines the request type */
    request?: string;
    /**Defines the selected records */
    virtualSelectRecords?: VirtualInfo;
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
    escapeCellEdit?() : void;
    addCancelWhilePaging?(): void;
    args?: { requestType?: string };
    isAdded?: boolean;
    previousData?: object;
    addBatchRow?: boolean;
}

export interface CheckBoxChangeEventArgs extends ICancel {
    /** Defines the checked state. */
    checked?: boolean;
    /** Defines the selected row indexes. */
    selectedRowIndexes?: number[];
    /** Defines the target element for selection. */
    target?: Element;
}

export interface BeforeCopyEventArgs extends ICancel {
    /** Defines the grid copied data. */
    data?: string;
}

export interface BeforePasteEventArgs {
    /** Defines the grid pasted data. */
    column?: Column;
    data?: string | number | boolean | Date;
    cancel?: boolean;
    rowIndex?: number;
}

export interface BeforeAutoFillEventArgs {
    /** Defines the grid autofill data. */
    column?: Column;
    value?: string;
    cancel?: boolean;
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
     *
     * @blazorDefaultValue none
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
    isPending?: boolean;
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
    isDataChanged?: boolean;
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

export interface ColumnDataStateChangeEventArgs {
    /** Defines the filter query  */
    where?: PredicateModel[];
    /** Defines the search query */
    search?: PredicateModel[];
    /** Defines the grid action details performed by paging, grouping, filtering, searching, sorting */
    action?: PageEventArgs | GroupEventArgs | FilterEventArgs | SearchEventArgs | SortEventArgs;
    /** Defines the function to be called to refresh column dataSource */
    setColumnData?: Function;
}

/** Custom data service event types */
export interface DataStateChangeEventArgs {
    /** Defines the skip count in datasource record */
    skip?: number;
    /** Defines the page size */
    take?: number;
    /** Defines the filter criteria  */
    where?: Predicate[];
    /** Defines the sorted field and direction */
    sorted?: Sorts[];
    /** Defines the grouped field names */
    group?: string[];
    /** Defines the aggregates object */
    aggregates?: Object[];
    /** Defines the search criteria */
    search?: SearchSettingsModel[];
    /** Defines the grid action details performed by paging, grouping, filtering, searching, sorting */
    action?: PageEventArgs | GroupEventArgs | FilterEventArgs | SearchEventArgs | SortEventArgs | LazyLoadGroupArgs;
    /** Defines the remote table name */
    table?: string;
    /** Defines the selected field names */
    select?: string[];
    /** If `count` is set true, then the remote service needs to return records and count */
    requiresCounts?: boolean;
    /** Defines the checkbox filter dataSource */
    dataSource?: Function;
    /** defines the lazy load group */
    isLazyLoad?: boolean;
    /** defines the lazy load group expand action */
    onDemandGroupInfo?: boolean;
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
    /** Defines the selected row data.
     *
     * @isGenericType true
     */
    data?: Object | Object[];
    /** Defines the primary key value */
    primaryKeyValues?: Object[];
    /** Defines the index value */
    index?: number;
    /** Defines the end of editing function. */
    endEdit?: Function;
    /** Defines the Cancel of editing process */
    cancelEdit?: Function;
    /** Defines the changes made in batch editing */
    changes?: Object;
    /** Defines the query */
    query?: Query;
}

/**
 * @hidden
 */
export interface IFocus {
    matrix: Matrix;
    onKeyPress?: Function;
    onClick?: Function;
    onFocus?: Function;
    lastIdxCell: boolean;
    target?: HTMLElement;
    keyActions?: Object;
    focusType?: FocusType;
    currentTarget?: HTMLElement;
    action?: string;
    jump?: (action: string, current: number[]) => SwapInfo;
    getFocusInfo?: () => FocusInfo;
    getFocusable?: (element: HTMLElement) => HTMLElement;
    getTable?: () => HTMLTableElement;
    selector?: (row: Row<Column>, cell: Cell<Column>) => boolean;
    generateRows?: (rows: Row<Column>[], optionals?: Object) => void;
    getInfo?: (e?: BaseKeyboardEventArgs) => FocusedContainer;
    validator?: () => Function;
    getNextCurrent?: (previous: number[], swap?: SwapInfo, active?: IFocus, action?: string) => number[];
    preventDefault?: (e: BaseKeyboardEventArgs, info: FocusInfo) => void;
    nextRowFocusValidate?: (index: number) => number;
    previousRowFocusValidate?: (index: number) => number;
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
    keyArgs?: BaseKeyboardEventArgs;
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
    toFrozenRight?: boolean;
}

/**
 * @hidden
 */
export interface KeyboardEventArgs extends KeyboardEvent {
    cancel?: boolean;
    action?: string;
}

/**
 * @hidden
 */
export interface IFilter {
    type?: string;
    dataSource?: Object[] | DataManager;
    hideSearchbox?: boolean;
    itemTemplate?: string | Function;
    ui?: IFilterMUI;
    operator?: string;
    params?: DatePickerModel | NumericTextBoxModel | DropDownListModel | AutoCompleteModel | DateTimePickerModel;
}

/**
 * @hidden
 */
export interface IFilterArgs {
    type?: string;
    height: number;
    columns?: ColumnModel[];
    field?: string;
    displayName?: string;
    query?: Query;
    dataSource?: Object[] | DataManager; // for column datasource or grid datasource
    dataManager?: DataManager;  // grid data manager
    format?: string;
    filteredColumns?: Object[];
    parentFilteredLocalRecords?: Object[]; // for on demand local data proper distinct
    parentTotalDataCount?: number; // for on demand parent total data count
    parentCurrentViewDataCount? : number; // for on demand parent current view data count
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
    column?: ColumnModel;
    actualPredicate?: { [key: string]: PredicateModel[] };
    uid?: string;
    isForeignKey?: boolean;
    ignoreAccent?: boolean;
    isRemote?: boolean;
    isResponsiveFilter?: boolean;
    operator?: string;
    cancel?: boolean;
    disableHtmlEncode?: boolean;
}

export interface PdfExportProperties {
    /** Defines the Pdf orientation. */
    pageOrientation?: PageOrientation;
    /** Defines the Pdf page size. */
    pageSize?: PdfPageSize;
    /** Defines the Pdf header. */
    header?: PdfHeader;
    /** Defines the columns which are to be customized for Export alone.
     *
     * @blazorType List<GridColumn>
     */
    columns?: Column[];
    /** Defines the Pdf footer. */
    footer?: PdfFooter;
    /** Indicates whether to show the hidden columns in exported Pdf */
    includeHiddenColumn?: boolean;
    /** Defines the data source dynamically before exporting */
    dataSource?: Object | DataManager | Object[];
    /** Indicates to export current page or all page */
    exportType?: ExportType;
    /** Defines the theme for exported data  */
    theme?: PdfTheme;
    /** Defines the file name for the exported file  */
    fileName?: string;
    /** Defines the hierarchy export mode for the pdf grid */
    hierarchyExportMode?: 'Expanded' | 'All' | 'None';
    /** Defines the overflow of columns for the pdf grid */
    allowHorizontalOverflow?: boolean;
    /** Defined the query dynamically before exporting */
    query?: Query;
    /** Exports multiple grid into the pdf document */
    multipleExport?: MultiplePdfExport;
}

export interface PdfTheme {
    /** Defines the style of header content. */
    header?: PdfThemeStyle;
    /** Defines the theme style of record content. */
    record?: PdfThemeStyle;
    /** Defines the theme style of caption content. */
    caption?: PdfThemeStyle;
}

export interface ExcelTheme {
    /** Defines the style of header content. */
    header?: ExcelStyle;
    /** Defines the theme style of record content. */
    record?: ExcelStyle;
    /** Defines the theme style of caption content. */
    caption?: ExcelStyle;
}

export interface PdfThemeStyle {
    /** Defines the font color of theme style. */
    fontColor?: string;
    /** Defines the font name of theme style. */
    fontName?: string;
    /** Defines the font size of theme style. */
    fontSize?: number;
    /** Defines the bold of theme style. */
    bold?: boolean;
    /** Defines the borders of theme style. */
    border?: PdfBorder;
    /** Defines the font of the theme.
     *
     * @blazorType PdfGridFont
     */
    font?: PdfStandardFont | PdfTrueTypeFont ;
    /** Defines the italic of theme style. */
    italic?: boolean;
    /** Defines the underline of theme style. */
    underline?: boolean;
    /** Defines the strikeout of theme style. */
    strikeout?: boolean;
}

export interface PdfGridFont {
    /** Defines the  fontFamily of font content. */
    fontFamily?: object;
    /** Defines the fontSize of font content. */
    fontSize?: number;
    /** Defines the trueTypeFont is enabled or not for font content.
     *
     * @default false
     */
    isTrueType: boolean;
    /** Defines the fontStyle of font content. */
    fontStyle?: object;
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value?: any;
    /** Defines the font for the content */
    font?: PdfStandardFont | PdfTrueTypeFont;
    /** Defines the alignment of header */
    stringFormat?: PdfStringFormat;
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

export interface ContextMenuClickEventArgs {
    column?: Column;
    rowInfo?: RowInfo;
    element: HTMLElement;
    /** Defines the Menu Items.
     *
     * @blazorType Syncfusion.Blazor.Navigations.MenuItemModel
     */
    item: MenuItemModel;
    event?: Event;
    name?: string;
}

export interface ContextMenuOpenEventArgs extends BeforeOpenCloseMenuEventArgs {
    column?: Column;
    rowInfo?: RowInfo;
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

export interface AggregateTemplateContext {
    /** Gets sum aggregate value */
    sum: string;
    /** Gets average aggregate value */
    average: string;
    /** Gets maximum aggregate value */
    max: string;
    /** Gets minimum aggregate value */
    min: string;
    /** Gets count aggregate value */
    count: string;
    /** Gets true count aggregate value */
    trueCount: string;
    /** Specifies false count aggregate value */
    falseCount: string;
    /** Gets custom aggregate value */
    custom: string;
    /** Gets the current group field name */
    field?: string;
    /** Gets header text of the grouped column */
    headerText?: string;
    /** Gets grouped data key value */
    key?: string;
    /** Gets corresponding grouped foreign key value */
    foreignKey?: string;
}

export interface PagerTemplateContext {
    /** Gets the current page number */
    currentPage?: number;
    /** Gets the page size number */
    pageSize?: number;
    /** Gets the page count */
    pageCount?: number;
    /** Gets the total records count */
    totalRecordsCount?: number;
    /** Gets the total number of pages */
    totalPages?: number;
}

export interface CaptionTemplateContext {
    GroupGuid?: string;
    /** Gets the current group field name */
    field?: string;
    /** Gets depth or level in which the group caption is present. */
    level?: number;
    /** Gets grouped data key value */
    key?: string;
    /** Gets corresponding grouped foreign key value */
    foreignKey?: string;
    /** Gets count value which specified the number of records in the group */
    count?: number;
    /** Gets header text of the grouped column */
    headerText?: string;
}

/**
 * @hidden
 */
export interface ActionArgs {
    /**
     * @blazorType string
     */
    requestType?: Action | string;
    type?: string;
    fromIndex?: number;
    toIndex?: number;
    toColumnUid?: string;
    fromColumnUid?: string[];
    isMultipleReorder?: boolean;
    virtualStartIndex?: number;
    virtualEndIndex?: number;
    startColumnIndex?: number;
    endColumnIndex?: number;
    axis?: string;
    translateX?: number;
    rHeight?: number;
    vTableWidth?: number;
}

export interface CheckBoxBeforeRenderer {
    /** Defines the checkbox datasource. */
    dataSource?: object[];
    /** Defines the checkbox field property. */
    field?: string;
    /** Defines whether the execute query is executed or not. */
    executeQuery?: boolean;
}

export interface ColumnDeselectEventArgs {
    /** Defines the selected/deselected column index. */
    columnIndex?: number;
    /** Defines the selected/deselected column indexes. */
    columnIndexes?: number[];
    /** Defines the selected/deselected column. */
    headerCell?: Element | Element[];
    /** Defines the selected/deselected column */
    column?: Column;
    /** Defines the cancel option value. */
    cancel?: boolean;
    /** Defines the target element for column deselect. */
    target?: Element;
    /** Defines whether event is triggered by interaction or not. */
    isInteracted?: boolean;
}

export interface ColumnSelectEventArgs extends ColumnDeselectEventArgs {
    /** Defines the previously selected column index. */
    previousColumnIndex?: number;
    /** Defines the target element for column selection. */
    target?: Element;
}

export interface ColumnSelectingEventArgs extends ColumnSelectEventArgs {
    /** Defines whether CTRL key is pressed. */
    isCtrlPressed?: boolean;
    /** Defines whether SHIFT key is pressed. */
    isShiftPressed?: boolean;
}

/**
 * @hidden
 */
export interface ResponsiveDialogArgs {
    primaryKeyValue?: string[];
    rowData?: Object;
    dialog?: DialogModel;
    target?: HTMLElement;
    col?: Column;
    action?: ResponsiveDialogAction;
}

/**
 * @hidden
 */
export interface ExportHelperArgs extends PdfQueryCellInfoEventArgs {
    isForeignKey?: boolean;
}

/**
 * @hidden
 */
export interface ForeignKeyFormat {
    [key: string]: Object[]
}

/**
 * @hidden
 */
export interface ExportHeaders {
    headers?: { [key: string]: string }[];
}

/**
 * @hidden
 */
export interface VirtualSelectionInfo {
    isPending?: boolean;
    direction?: string;
    event?: KeyboardEventArgs;
}

export interface ColumnTemplateArgs {
    /** Defines the current row data.
     *
     * @isGenericType true
     */
    data?: Object;
    /** Defines the column of the current cell. */
    column?: Column;
    /** Defines the row index. */
    index?: string;
}

export interface ItemTemplateArgs {
    /** Defines the column */
    column?: Column;
    /** Defines the parent */
    parent?: IGrid;
}

/**
 * @hidden
 */
export interface DistributeColWidth {
    columns?: Column[];
    usedWidth?: number;
}

/**
 * @hidden
 */
export interface RefreshToolbarItemsArgs {
    editSettings?: EditSettingsModel;
    name?: string;
}

export interface ColumnChooserActionArgs {
    /** If `cancel` is set to true, then the current action will be stopped. */
    cancel?: boolean;
    /** Defines the request type*/
    requestType?: string;
    /** Defines the display columns of column chooser. */
    columns?: Column[];
}

export interface DetailTemplateDetach {
    /** The detail row element that is being removed from the DOM. */
    detailRow: HTMLElement;
    /** Contains information about the corresponding detail row. */
    detailRowObject:  Row<Column>;
    /** Contains information about the corresponding parent row. */
    parentRowObject:  Row<Column>;
}

export type DetailTemplateDetachArgs = DetailTemplateDetach[]
