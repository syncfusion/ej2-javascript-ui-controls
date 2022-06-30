import { isNullOrUndefined, setValue, getValue } from '@syncfusion/ej2-base';import { Component, ModuleDeclaration, ChildProperty, Browser, closest, extend, TouchEventArgs } from '@syncfusion/ej2-base';import { addClass, removeClass, append, remove, classList, setStyleAttribute } from '@syncfusion/ej2-base';import { Property, Collection, Complex, Event, NotifyPropertyChanges, INotifyPropertyChanged, L10n } from '@syncfusion/ej2-base';import { EventHandler, KeyboardEvents, KeyboardEventArgs as KeyArg, EmitType } from '@syncfusion/ej2-base';import { Query, DataManager, DataUtil, DataOptions, UrlAdaptor } from '@syncfusion/ej2-data';import { ItemModel, ClickEventArgs } from '@syncfusion/ej2-navigations';import { createSpinner, hideSpinner, showSpinner, Tooltip } from '@syncfusion/ej2-popups';import { iterateArrayOrObject, prepareColumns, parentsUntil, wrap, templateCompiler, isGroupAdaptive, refreshForeignData } from './util';import { getRowHeight, setColumnIndex, Global, ispercentageWidth, renderMovable, getNumberFormat } from './util';import { setRowElements, resetRowIndex, compareChanges, getCellByColAndRowIndex, performComplexDataOperation } from './util';import * as events from '../base/constant';import { ReturnType, BatchChanges } from '../base/type';import { IDialogUI, ScrollPositionType, ActionArgs, ExportGroupCaptionEventArgs, FilterUI, LazyLoadArgs } from './interface';import {AggregateQueryCellInfoEventArgs, IGrid } from './interface';import { IRenderer, IValueFormatter, IFilterOperator, IIndex, RowDataBoundEventArgs, QueryCellInfoEventArgs } from './interface';import { CellDeselectEventArgs, CellSelectEventArgs, CellSelectingEventArgs, ParentDetails, ContextMenuItemModel } from './interface';import { PdfQueryCellInfoEventArgs, ExcelQueryCellInfoEventArgs, ExcelExportProperties, PdfExportProperties } from './interface';import { PdfHeaderQueryCellInfoEventArgs, ExcelHeaderQueryCellInfoEventArgs, ExportDetailDataBoundEventArgs } from './interface';import { ColumnMenuOpenEventArgs, BatchCancelArgs, RecordDoubleClickEventArgs, DataResult, PendingState } from './interface';import { HeaderCellInfoEventArgs, KeyboardEventArgs, RecordClickEventArgs, AdaptiveDialogEventArgs } from './interface';import { FailureEventArgs, FilterEventArgs, ColumnDragEventArgs, GroupEventArgs, PrintEventArgs, ICustomOptr } from './interface';import { RowDeselectEventArgs, RowSelectEventArgs, RowSelectingEventArgs, PageEventArgs, RowDragEventArgs } from './interface';import { BeforeBatchAddArgs, BeforeBatchDeleteArgs, BeforeBatchSaveArgs, ResizeArgs, ColumnMenuItemModel } from './interface';import { BatchAddArgs, BatchDeleteArgs, BeginEditArgs, CellEditArgs, CellSaveArgs, BeforeDataBoundArgs, RowInfo } from './interface';import { DetailDataBoundEventArgs, ColumnChooserEventArgs, AddEventArgs, SaveEventArgs, EditEventArgs, DeleteEventArgs } from './interface';import { ExcelExportCompleteArgs, PdfExportCompleteArgs, DataStateChangeEventArgs, DataSourceChangedEventArgs } from './interface';import { SearchEventArgs, SortEventArgs, ISelectedCell, EJ2Intance, BeforeCopyEventArgs, ColumnDataStateChangeEventArgs} from './interface';import {BeforePasteEventArgs, CheckBoxChangeEventArgs, CommandClickEventArgs, BeforeAutoFillEventArgs } from './interface';import { Render } from '../renderer/render';import { Column, ColumnModel, ActionEventArgs } from '../models/column';import { SelectionType, GridLine, RenderType, SortDirection, SelectionMode, PrintMode, FilterType, FilterBarMode } from './enum';import { CheckboxSelectionType, HierarchyGridPrintMode, NewRowPosition, freezeTable, ClipMode, freezeMode } from './enum';import { WrapMode, ToolbarItems, ContextMenuItem, ColumnMenuItem, ToolbarItem, CellSelectionMode, EditMode, ResizeMode } from './enum';import { ColumnQueryModeType, RowRenderingDirection } from './enum';import { Data } from '../actions/data';import { Cell } from '../models/cell';import { RowRenderer } from '../renderer/row-renderer';import { CellRenderer } from '../renderer/cell-renderer';import { CellRendererFactory } from '../services/cell-render-factory';import { ServiceLocator } from '../services/service-locator';import { ValueFormatter } from '../services/value-formatter';import { RendererFactory } from '../services/renderer-factory';import { ColumnWidthService } from '../services/width-controller';import { AriaService } from '../services/aria-service';import { FocusStrategy } from '../services/focus-strategy';import { PageSettingsModel, AggregateRowModel, AggregateColumnModel, ColumnChooserSettingsModel } from '../models/models';import { PageSettings } from '../models/page-settings';import { ColumnChooserSettings } from '../models/column-chooser-settings';import { Sort } from '../actions/sort';import { Page } from '../actions/page';import { Selection } from '../actions/selection';import { Filter } from '../actions/filter';import { Search } from '../actions/search';import { Resize } from '../actions/resize';import { Reorder } from '../actions/reorder';import { RowDD } from '../actions/row-reorder';import { ShowHide } from '../actions/show-hide';import { Scroll } from '../actions/scroll';import { InfiniteScroll } from '../actions/infinite-scroll';import { Group } from '../actions/group';import { Print } from '../actions/print';import { DetailRow } from '../actions/detail-row';import { Toolbar } from '../actions/toolbar';import { AggregateRow } from '../models/aggregate';import { Edit } from '../actions/edit';import { Row } from '../models/row';import { ColumnChooser } from '../actions/column-chooser';import { ExcelExport } from '../actions/excel-export';import { PdfExport } from '../actions/pdf-export';import { Clipboard } from '../actions/clipboard';import { CommandColumn } from '../actions/command-column';import { ContextMenu } from '../actions/context-menu';import { BeforeOpenCloseMenuEventArgs, MenuEventArgs } from '@syncfusion/ej2-navigations';import { ColumnMenu } from '../actions/column-menu';import { CheckState } from './enum';import { Aggregate } from '../actions/aggregate';import { ILogger } from '../actions/logger';import { IModelGenerator } from '../base/interface';import { RowModelGenerator } from '../services/row-model-generator';import { ColumnDeselectEventArgs, ColumnSelectEventArgs, ColumnSelectingEventArgs } from './interface';import { DateFormatOptions, NumberFormatOptions } from '@syncfusion/ej2-base';import * as literals from '../base/string-literals';import { Workbook } from '@syncfusion/ej2-excel-export';import { HeaderCellRenderer } from '../renderer/header-cell-renderer';
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class SortDescriptor
 */
export interface SortDescriptorModel {

    /**
     * Defines the field name of sort column.
     *
     * @default ''
     */
    field?: string;

    /**
     * Defines the direction of sort column.
     *
     * @default ''
     */
    direction?: SortDirection;

    /**
     * @hidden
     * Defines the sorted column whether or from grouping operation.
     *
     * @default false
     */
    isFromGroup?: boolean;

}

/**
 * Interface for a class SortSettings
 */
export interface SortSettingsModel {

    /**
     * Specifies the columns to sort at initial rendering of Grid.
     * Also user can get current sorted columns.
     *
     * @default []
     */
    columns?: SortDescriptorModel[];

    /**
     * If `allowUnsort` set to false the user can not get the grid in unsorted state by clicking the sorted column header.
     *
     * @default true
     */
    allowUnsort?: boolean;

}

/**
 * Interface for a class Predicate
 */
export interface PredicateModel {

    /**
     * Defines the field name of the filter column.
     *
     * @default ''
     */
    field?: string;

    /**
     * Defines the operator to filter records. The available operators and its supported data types are:
     * <table>
     * <tr>
     * <td colspan=1 rowspan=1>
     * Operator<br/></td><td colspan=1 rowspan=1>
     * Description<br/></td><td colspan=1 rowspan=1>
     * Supported Types<br/></td></tr>
     * <tr>
     * <td colspan=1 rowspan=1>
     * startswith<br/></td><td colspan=1 rowspan=1>
     * Checks whether the value begins with the specified value.<br/></td><td colspan=1 rowspan=1>
     * String<br/></td></tr>
     * <tr>
     * <td colspan=1 rowspan=1>
     * endswith<br/></td><td colspan=1 rowspan=1>
     * Checks whether the value ends with the specified value.<br/><br/></td><td colspan=1 rowspan=1>
     * <br/>String<br/></td></tr>
     * <tr>
     * <td colspan=1 rowspan=1>
     * contains<br/></td><td colspan=1 rowspan=1>
     * Checks whether the value contains the specified value.<br/><br/></td><td colspan=1 rowspan=1>
     * <br/>String<br/></td></tr>
     * <tr>
     * <td colspan=1 rowspan=1>
     * equal<br/></td><td colspan=1 rowspan=1>
     * Checks whether the value is equal to the specified value.<br/><br/></td><td colspan=1 rowspan=1>
     * <br/>String | Number | Boolean | Date<br/></td></tr>
     * <tr>
     * <td colspan=1 rowspan=1>
     * notequal<br/></td><td colspan=1 rowspan=1>
     * Checks for values that are not equal to the specified value.<br/><br/></td><td colspan=1 rowspan=1>
     * <br/>String | Number | Boolean | Date<br/></td></tr>
     * <tr>
     * <td colspan=1 rowspan=1>
     * greaterthan<br/></td><td colspan=1 rowspan=1>
     * Checks whether the value is greater than the specified value.<br/><br/></td><td colspan=1 rowspan=1>
     * Number | Date<br/></td></tr>
     * <tr>
     * <td colspan=1 rowspan=1>
     * greaterthanorequal<br/></td><td colspan=1 rowspan=1>
     * Checks whether the value is greater than or equal to the specified value.<br/><br/></td><td colspan=1 rowspan=1>
     * <br/>Number | Date<br/></td></tr>
     * <tr>
     * <td colspan=1 rowspan=1>
     * lessthan<br/></td><td colspan=1 rowspan=1>
     * Checks whether the value is less than the specified value.<br/><br/></td><td colspan=1 rowspan=1>
     * <br/>Number | Date<br/></td></tr>
     * <tr>
     * <td colspan=1 rowspan=1>
     * lessthanorequal<br/></td><td colspan=1 rowspan=1>
     * Checks whether the value is less than or equal to the specified value.<br/><br/></td><td colspan=1 rowspan=1>
     * <br/>Number | Date<br/></td></tr>
     * </table>
     *
     * @default null
     */
    operator?: string;

    /**
     * Defines the value used to filter records.
     *
     * @default ''
     */
    value?: string | number | Date | boolean;

    /**
     * If match case set to true, then filter records with exact match or else
     * filter records with case insensitive(uppercase and lowercase letters treated as same).
     *
     * @default null
     */
    matchCase?: boolean;

    /**
     * If ignoreAccent is set to true, then filter ignores the diacritic characters or accents while filtering.
     *
     * @default false
     */
    ignoreAccent?: boolean;

    /**
     * Defines the relationship between one filter query and another by using AND or OR predicate.
     *
     * @default null
     */
    predicate?: string;

    /**
     * @hidden
     * Defines the actual filter value for the filter column.
     */
    actualFilterValue?: Object;

    /**
     * @hidden
     * Defines the actual filter operator for the filter column.
     */
    actualOperator?: Object;

    /**
     * @hidden
     * Defines the type of the filter column.
     */
    type?: string;

    /**
     * @hidden
     * Defines the predicate of filter column.
     */
    ejpredicate?: Object;

    /**
     * Defines the UID of filter column.
     */
    uid?: string;

    /**
     * @hidden
     * Defines the foreignKey availability in filtered columns.
     */
    isForeignKey?: boolean;

}

/**
 * Interface for a class InfiniteScrollSettings
 */
export interface InfiniteScrollSettingsModel {

    /**
     * If `enableCache` is set to true, the Grid will cache the loaded data to be reused next time it is needed.
     *
     * @default false
     */
    enableCache?: boolean;

    /**
     * Defines the number of blocks to be maintained in Grid while settings enableCache as true.
     *
     * @default 3
     */
    maxBlocks?: number;

    /**
     * Defines the number of blocks will render at the initial Grid rendering while enableCache is enabled.
     *
     * @default 3
     */
    initialBlocks?: number;

}

/**
 * Interface for a class FilterSettings
 */
export interface FilterSettingsModel {

    /**
     * Specifies the columns to be filtered at initial rendering of the Grid. You can also get the columns that were currently filtered.
     *
     * @default []
     */
    columns?: PredicateModel[];

    /**
     * Defines options for filtering type. The available options are
     * * `Menu` - Specifies the filter type as menu.
     * * `CheckBox` - Specifies the filter type as checkbox.
     * * `FilterBar` - Specifies the filter type as filterbar.
     * * `Excel` - Specifies the filter type as checkbox.
     *
     * @default FilterBar
     */
    type?: FilterType;

    /**
     * Defines the filter bar modes. The available options are,
     * * `OnEnter`: Initiates filter operation after Enter key is pressed.
     * * `Immediate`: Initiates filter operation after a certain time interval. By default, time interval is 1500 ms.
     *
     * @default OnEnter
     */
    mode?: FilterBarMode;

    /**
     * Shows or hides the filtered status message on the pager.
     *
     * @default true
     */
    showFilterBarStatus?: boolean;

    /**
     * Defines the time delay (in milliseconds) in filtering records when the `Immediate` mode of filter bar is set.
     *
     * @default 1500
     */
    immediateModeDelay?: number;

    /**
     * The `operators` is used to override the default operators in filter menu. This should be defined by type wise
     * (string, number, date and boolean). Based on the column type, this customize operator list will render in filter menu.
     *
     * > Check the [`Filter Menu Operator`](../../grid/how-to/#customizing-filter-menu-operators-list/) customization.
     *
     * @default null
     */
    operators?: ICustomOptr;

    /**
     * If ignoreAccent set to true, then filter ignores the diacritic characters or accents while filtering.
     *
     * > Check the [`Diacritics`](../../grid/filtering/#diacritics/) filtering.
     *
     * @default false
     */
    ignoreAccent?: boolean;

    /**
     * If `enableCaseSensitivity` is set to true then searches grid records with exact match based on the filter
     * operator. It will have no effect on number, boolean and Date fields.
     *
     * @default false
     */
    enableCaseSensitivity?: boolean;

    /**
     * If 'showFilterBarOperator' is set to true, then it renders the dropdownlist component to select the operator
     * in filterbar input
     *
     * @default false
     */
    showFilterBarOperator?: boolean;

}

/**
 * Interface for a class SelectionSettings
 */
export interface SelectionSettingsModel {

    /**
     * Grid supports row, cell, and both (row and cell) selection mode.
     *
     * @default Row
     */
    mode?: SelectionMode;

    /**
     * The cell selection modes are flow and box. It requires the selection
     * [`mode`](grid/#mode-selectionmode/) to be either cell or both.
     * * `Flow`: Selects the range of cells between start index and end index that also includes the other cells of the selected rows.
     * * `Box`: Selects the range of cells within the start and end column indexes that includes in between cells of rows within the range.
     * * `BoxWithBorder`: Selects the range of cells as like Box mode with borders.
     *
     * @default Flow
     */
    cellSelectionMode?: CellSelectionMode;

    /**
     * Defines options for selection type. They are
     * * `Single`: Allows selection of only a row or a cell.
     * * `Multiple`: Allows selection of multiple rows or cells.
     *
     * @default Single
     */
    type?: SelectionType;

    /**
     * If 'checkboxOnly' set to true, then the Grid selection is allowed only through checkbox.
     *
     * > To enable checkboxOnly selection, should specify the column type as`checkbox`.
     *
     * @default false
     */
    checkboxOnly?: boolean;

    /**
     * If 'persistSelection' set to true, then the Grid selection is persisted on all operations.
     * For persisting selection in the Grid, any one of the column should be enabled as a primary key.
     *
     * @default false
     */
    persistSelection?: boolean;

    /**
     * Defines options for checkbox selection Mode. They are
     * * `Default`: This is the default value of the checkboxMode. In this mode, user can select multiple rows by clicking rows one by one.
     * * `ResetOnRowClick`: In ResetOnRowClick mode, on clicking a row it will reset previously selected row and also multiple
     *  rows can be selected by using CTRL or SHIFT key.
     *
     * @default Default
     */
    checkboxMode?: CheckboxSelectionType;

    /**
     * If 'enableSimpleMultiRowSelection' set to true, then the user can able to perform multiple row selection with single clicks.
     *
     * @default false
     */
    enableSimpleMultiRowSelection?: boolean;

    /**
     * If 'enableToggle' set to true, then the user can able to perform toggle for the selected row.
     *
     * @default true
     */
    enableToggle?: boolean;

    /**
     * If 'allowColumnSelection' set to true, then the user can able to select the columns.
     *
     * @default false
     */
    allowColumnSelection?: boolean;

}

/**
 * Interface for a class SearchSettings
 */
export interface SearchSettingsModel {

    /**
     * Specifies the collection of fields included in search operation. By default, bounded columns of the Grid are included.
     *
     * @default []
     */
    fields?: string[];

    /**
     * Specifies the key value to search Grid records at initial rendering.
     * You can also get the current search key.
     *
     * @default ''
     */
    key?: string;

    /**
     * Defines the operator to search records. The available operators are:
     * <table>
     * <tr>
     * <td colspan=1 rowspan=1>
     * Operator<br/></td><td colspan=1 rowspan=1>
     * Description<br/></td></tr>
     * <tr>
     * <td colspan=1 rowspan=1>
     * startswith<br/></td><td colspan=1 rowspan=1>
     * Checks whether the string begins with the specified string.<br/></td></tr>
     * <tr>
     * <td colspan=1 rowspan=1>
     * endswith<br/></td><td colspan=1 rowspan=1>
     * Checks whether the string ends with the specified string.<br/></td></tr>
     * <tr>
     * <td colspan=1 rowspan=1>
     * contains<br/></td><td colspan=1 rowspan=1>
     * Checks whether the string contains the specified string. <br/></td></tr>
     * <tr>
     * <td colspan=1 rowspan=1>
     * equal<br/></td><td colspan=1 rowspan=1>
     * Checks whether the string is equal to the specified string.<br/></td></tr>
     * <tr>
     * <td colspan=1 rowspan=1>
     * notequal<br/></td><td colspan=1 rowspan=1>
     * Checks for strings not equal to the specified string. <br/></td></tr>
     * </table>
     *
     * @default 'contains'
     */
    operator?: string;

    /**
     * If `ignoreCase` is set to false, searches records that match exactly, else
     * searches records that are case insensitive(uppercase and lowercase letters treated the same).
     *
     * @default true
     */
    ignoreCase?: boolean;

    /**
     * If ignoreAccent set to true, then filter ignores the diacritic characters or accents while filtering.
     *
     * > Check the [`Diacritics`](../../grid/filtering/#diacritics/) filtering.
     *
     * @default false
     */
    ignoreAccent?: boolean;

}

/**
 * Interface for a class RowDropSettings
 */
export interface RowDropSettingsModel {

    /**
     * Defines the ID of droppable component on which row drop should occur.
     *
     * @default null
     */
    targetID?: string;

}

/**
 * Interface for a class TextWrapSettings
 */
export interface TextWrapSettingsModel {

    /**
     * Defines the `wrapMode` of the Grid. The available modes are:
     * * `Both`: Wraps both the header and content.
     * * `Content`: Wraps the header alone.
     * * `Header`: Wraps the content alone.
     *
     * @default Both
     */
    wrapMode?: WrapMode;

}

/**
 * Interface for a class ResizeSettings
 */
export interface ResizeSettingsModel {

    /**
     * Defines the mode of Grid column resizing. The available modes are:
     * `Normal`: Columns will not be adjusted to fit the remaining space.
     * `Auto`: Resized column width will be adjusted by other columns automatically.
     *
     * @default Normal
     */
    mode?: ResizeMode;

}

/**
 * Interface for a class GroupSettings
 */
export interface GroupSettingsModel {

    /**
     * If `showDropArea` is set to true, the group drop area element will be visible at the top of the Grid.
     *
     * @default true
     */
    showDropArea?: boolean;

    /**
     * If `allowReordering` is set to true, Grid allows the grouped elements to be reordered.
     *
     * @default false
     */
    allowReordering?: boolean;

    /**
     * If `showToggleButton` set to true, then the toggle button will be showed in the column headers which can be used to group
     * or ungroup columns by clicking them.
     *
     * @default false
     */
    showToggleButton?: boolean;

    /**
     * If `showGroupedColumn` is set to false, it hides the grouped column after grouping.
     *
     * @default false
     */
    showGroupedColumn?: boolean;

    /**
     * If `showUngroupButton` set to false, then ungroup button is hidden in dropped element.
     * It can be used to ungroup the grouped column when click on ungroup button.
     *
     * @default true
     */
    showUngroupButton?: boolean;

    /**
     * If `disablePageWiseAggregates` set to true, then the group aggregate value will
     * be calculated from the whole data instead of paged data and two requests will be made for each page
     * when Grid bound with remote service.
     *
     * @default false
     */
    disablePageWiseAggregates?: boolean;

    /**
     * Specifies the column names to group at initial rendering of the Grid.
     * You can also get the currently grouped columns.
     *
     * @default []
     */
    columns?: string[];

    /**
     * The Caption Template allows user to display the string or HTML element in group caption.
     * > It accepts either the
     * [template string](https://ej2.syncfusion.com/documentation/common/template-engine/) or the HTML element ID.
     *
     * @default ''
     */
    captionTemplate?: string | Object;

    /**
     * The Lazy load grouping, allows the Grid to render only the initial level caption rows in collapsed state while grouping.
     * The child rows of each caption will render only when we expand the captions.
     *
     * @default false
     */
    enableLazyLoading?: boolean;

}

/**
 * Interface for a class EditSettings
 */
export interface EditSettingsModel {

    /**
     * If `allowAdding` is set to true, new records can be added to the Grid.
     *
     * @default false
     */
    allowAdding?: boolean;

    /**
     * If `allowEditing` is set to true, values can be updated in the existing record.
     *
     * @default false
     */
    allowEditing?: boolean;

    /**
     * If `allowDeleting` is set to true, existing record can be deleted from the Grid.
     *
     * @default false
     */
    allowDeleting?: boolean;

    /**
     * Defines the mode to edit. The available editing modes are:
     * * Normal
     * * Dialog
     * * Batch
     *
     * @default Normal
     */
    mode?: EditMode;

    /**
     * If `allowEditOnDblClick` is set to false, Grid will not allow editing of a record on double click.
     *
     * @default true
     */
    allowEditOnDblClick?: boolean;

    /**
     * if `showConfirmDialog` is set to false, confirm dialog does not show when batch changes are saved or discarded.
     *
     * @default true
     */
    showConfirmDialog?: boolean;

    /**
     * If `showDeleteConfirmDialog` is set to true, confirm dialog will show delete action. You can also cancel delete command.
     *
     * @default false
     */
    showDeleteConfirmDialog?: boolean;

    /**
     * Defines the custom edit elements for the dialog template.
     *
     * @default ''
     * @aspType string
     */
    template?: string | Object;

    /**
     * Defines the custom edit elements for the dialog header template.
     *
     * @default ''
     * @aspType string
     */
    headerTemplate?: string | Object;

    /**
     * Defines the custom edit elements for the dialog footer template.
     *
     * @default ''
     * @aspType string
     */
    footerTemplate?: string | Object;

    /**
     * Defines the position of adding a new row. The available position are:
     * * Top
     * * Bottom
     *
     * @default Top
     */
    newRowPosition?: NewRowPosition;

    /**
     * Defines the dialog params to edit.
     *
     * @default {}
     */
    dialog?: IDialogUI;

    /**
     * If allowNextRowEdit is set to true, editing is done to next row. By default allowNextRowEdit is set to false.
     *
     * @default false
     */
    allowNextRowEdit?: boolean;

}

/**
 * Interface for a class Grid
 */
export interface GridModel extends ComponentModel{

    /**
     * Gets the parent Grid details.
     */
    parentDetails?: ParentDetails;

    /**
     * Defines the schema of dataSource.
     * If the `columns` declaration is empty or undefined then the `columns` are automatically generated from data source.
     * {% codeBlock src='grid/columns/index.md' %}{% endcodeBlock %}
     *
     * @default []
     */
    columns?: Column[] | string[] | ColumnModel[];

    /**
     * If `enableAltRow` is set to true, the grid will render with `e-altrow` CSS class to the alternative tr elements.
     * > Check the [`AltRow`](../../grid/row/#styling-alternate-rows/) to customize the styles of alternative rows.
     * {% codeBlock src='grid/enableAltRow/index.md' %}{% endcodeBlock %}
     *
     * @default true
     */
    enableAltRow?: boolean;

    /**
     * If `enableHover` is set to true, the row hover is enabled in the Grid.
     * {% codeBlock src='grid/enableHover/index.md' %}{% endcodeBlock %}
     *
     * @default true
     */
    enableHover?: boolean;

    /**
     * If `enableAutoFill` is set to true, then the auto fill icon will displayed on cell selection for copy cells.
     * It requires the selection `mode` to be Cell and `cellSelectionMode` to be `Box`.
     * {% codeBlock src='grid/enableAutoFill/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    enableAutoFill?: boolean;

    /**
     * Enables or disables the key board interaction of Grid.
     *
     * @default true
     */
    allowKeyboard?: boolean;

    /**
     * If 'enableStickyHeader' set to true, then the user can able to make the column headers visible when the document is scrolled.
     *
     * @default false
     */
    enableStickyHeader?: boolean;

    /**
     * If `allowTextWrap` set to true,
     * then text content will wrap to the next line when its text content exceeds the width of the Column Cells.
     * {% codeBlock src='grid/allowTextWrap/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    allowTextWrap?: boolean;

    /**
     * Configures the text wrap in the Grid.
     * {% codeBlock src='grid/textWrapSettings/index.md' %}{% endcodeBlock %}
     *
     * @default {wrapMode:"Both"}
     */
    textWrapSettings?: TextWrapSettingsModel;

    /**
     * Defines the resizing behavior of the Grid.
     *
     * @default {mode:"Normal"}
     */
    resizeSettings?: ResizeSettingsModel;

    /**
     * If `allowPaging` is set to true, the pager renders at the footer of the Grid. It is used to handle page navigation in the Grid.
     *
     * > Check the [`Paging`](../../grid/paging/) to configure the grid pager.
     * {% codeBlock src='grid/allowPaging/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    allowPaging?: boolean;

    /**
     * Configures the pager in the Grid.
     * {% codeBlock src='grid/pageSettings/index.md' %}{% endcodeBlock %}
     *
     * @default {currentPage: 1, pageSize: 12, pageCount: 8, enableQueryString: false, pageSizes: false, template: null}
     */
    pageSettings?: PageSettingsModel;

    /**
     * If `enableVirtualization` set to true, then the Grid will render only the rows visible within the view-port
     * and load subsequent rows on vertical scrolling. This helps to load large dataset in Grid.
     * {% codeBlock src='grid/enableVirtualization/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    enableVirtualization?: boolean;

    /**
     * If `enableColumnVirtualization` set to true, then the Grid will render only the columns visible within the view-port
     * and load subsequent columns on horizontal scrolling. This helps to load large dataset of columns in Grid.
     * {% codeBlock src='grid/enableColumnVirtualization/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    enableColumnVirtualization?: boolean;

    /**
     * If `enableInfiniteScrolling` set to true, then the data will be loaded in Grid when the scrollbar reaches the end.
     * This helps to load large dataset in Grid.
     * {% codeBlock src='grid/enableInfiniteScrolling/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    enableInfiniteScrolling?: boolean;

    /**
     * Configures the search behavior in the Grid.
     * {% codeBlock src='grid/searchSettings/index.md' %}{% endcodeBlock %}
     *
     * @default { ignoreCase: true, fields: [], operator: 'contains', key: '' }
     */
    searchSettings?: SearchSettingsModel;

    /**
     * If `allowSorting` is set to true, it allows sorting of grid records when column header is clicked.
     *
     * > Check the [`Sorting`](../../grid/sorting/) to customize its default behavior.
     * {% codeBlock src='grid/allowSorting/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    allowSorting?: boolean;

    /**
     *  Defines the mode of clip. The available modes are,
     * `Clip`: Truncates the cell content when it overflows its area.
     * `Ellipsis`: Displays ellipsis when the cell content overflows its area.
     * `EllipsisWithTooltip`:  Displays ellipsis when the cell content overflows its area,
     *  also it will display the tooltip while hover on ellipsis is applied.
     * {% codeBlock src='grid/clipMode/index.md' %}{% endcodeBlock %}
     *
     * @default Ellipsis
     */
    clipMode?: ClipMode;

    /**
     * If `allowMultiSorting` set to true, then it will allow the user to sort multiple column in the grid.
     * > `allowSorting` should be true.
     * {% codeBlock src='grid/allowMultiSorting/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    allowMultiSorting?: boolean;

    /**
     * If `allowExcelExport` set to true, then it will allow the user to export grid to Excel file.
     *
     * > Check the [`ExcelExport`](../../grid/excel-exporting/) to configure exporting document.
     * {% codeBlock src='grid/allowExcelExport/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    allowExcelExport?: boolean;

    /**
     * If `allowPdfExport` set to true, then it will allow the user to export grid to Pdf file.
     *
     * > Check the [`Pdfexport`](../../grid/pdf-export/) to configure the exporting document.
     * {% codeBlock src='grid/allowPdfExport/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    allowPdfExport?: boolean;

    /**
     * Configures the sort settings.
     * {% codeBlock src='grid/sortSettings/index.md' %}{% endcodeBlock %}
     *
     * @default {columns:[]}
     */
    sortSettings?: SortSettingsModel;

    /**
     * Configures the infinite scroll settings.
     * {% codeBlock src='grid/infiniteScrollSettings/index.md' %}{% endcodeBlock %}
     *
     * @default { enableCache: false, maxBlocks: 5, initialBlocks: 5 }
     */
    infiniteScrollSettings?: InfiniteScrollSettingsModel;

    /**
     * If `allowSelection` is set to true, it allows selection of (highlight row) Grid records by clicking it.
     * {% codeBlock src='grid/allowSelection/index.md' %}{% endcodeBlock %}
     *
     * @default true
     */
    allowSelection?: boolean;

    /**
     * The `selectedRowIndex` allows you to select a row at initial rendering.
     * You can also get the currently selected row index.
     * {% codeBlock src='grid/selectedRowIndex/index.md' %}{% endcodeBlock %}
     *
     * @default -1
     */
    selectedRowIndex?: number;

    /**
     * Configures the selection settings.
     * {% codeBlock src='grid/selectionSettings/index.md' %}{% endcodeBlock %}
     *
     * @default {mode: 'Row', cellSelectionMode: 'Flow', type: 'Single'}
     */
    selectionSettings?: SelectionSettingsModel;

    /**
     * If `allowFiltering` set to true the filter bar will be displayed.
     * If set to false the filter bar will not be displayed.
     * Filter bar allows the user to filter grid records with required criteria.
     *
     * > Check the [`Filtering`](../../grid/filtering/) to customize its default behavior.
     * {% codeBlock src='grid/allowFiltering/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    allowFiltering?: boolean;

    /**
     * Defines the grid row elements rendering direction. The available directions are,
     * * `Horizontal`: Renders the grid row elements in the horizontal direction
     * * `Vertical`: Renders the grid row elements in the vertical direction
     *
     * @default Horizontal
     */
    rowRenderingMode?: RowRenderingDirection;

    /**
     * If `enableAdaptiveUI` set to true the grid filter, sort, and edit dialogs render adaptively.
     *
     * @default false
     */
    enableAdaptiveUI?: boolean;

    /**
     * If `allowReordering` is set to true, Grid columns can be reordered.
     * Reordering can be done by drag and drop of a particular column from one index to another index.
     * > If Grid is rendered with stacked headers, reordering is allowed only at the same level as the column headers.
     * {% codeBlock src='grid/allowReordering/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    allowReordering?: boolean;

    /**
     * If `allowResizing` is set to true, Grid columns can be resized.
     * {% codeBlock src='grid/allowResizing/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    allowResizing?: boolean;

    /**
     * If `allowRowDragAndDrop` is set to true, you can drag and drop grid rows at another grid.
     * {% codeBlock src='grid/allowRowDragAndDrop/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    allowRowDragAndDrop?: boolean;

    /**
     * Configures the row drop settings.
     *
     * @default {targetID: ''}
     */
    rowDropSettings?: RowDropSettingsModel;

    /**
     * Configures the filter settings of the Grid.
     * {% codeBlock src='grid/filterSettings/index.md' %}{% endcodeBlock %}
     *
     * @default {columns: [], type: 'FilterBar', mode: 'Immediate', showFilterBarStatus: true, immediateModeDelay: 1500 , operators: {}}
     */
    filterSettings?: FilterSettingsModel;

    /**
     * If `allowGrouping` set to true, then it will allow the user to dynamically group or ungroup columns.
     * Grouping can be done by drag and drop columns from column header to group drop area.
     *
     * > Check the [`Grouping`](../../grid/grouping/) to customize its default behavior.
     * {% codeBlock src='grid/allowGrouping/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    allowGrouping?: boolean;

    /**
     * If `enableImmutableMode`  is set to true, the grid will reuse old rows if it exists in the new result instead of
     * full refresh while performing the grid actions.
     *
     * @default false
     */
    enableImmutableMode?: boolean;

    /**
     * If `showColumnMenu` set to true, then it will enable the column menu options in each columns.
     *
     * > Check the [`Column menu`](../../grid/columns/#column-menu/) for its configuration.
     * {% codeBlock src='grid/showColumnMenu/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    showColumnMenu?: boolean;

    /**
     * Configures the group settings.
     * {% codeBlock src='grid/groupSettings/index.md' %}{% endcodeBlock %}
     *
     * @default {showDropArea: true, showToggleButton: false, showGroupedColumn: false, showUngroupButton: true, columns: []}
     */
    groupSettings?: GroupSettingsModel;

    /**
     * Configures the edit settings.
     * {% codeBlock src='grid/editSettings/index.md' %}{% endcodeBlock %}
     *
     * @default { allowAdding: false, allowEditing: false, allowDeleting: false, mode:'Normal',
     * allowEditOnDblClick: true, showConfirmDialog: true, showDeleteConfirmDialog: false }
     */
    editSettings?: EditSettingsModel;

    /**
     * Configures the Grid aggregate rows.
     * {% codeBlock src='grid/aggregates/index.md' %}{% endcodeBlock %}
     * > Check the [`Aggregates`](../../grid/aggregates/) for its configuration.
     *
     * @default []
     */
    aggregates?: AggregateRowModel[];

    /**
     * If `showColumnChooser` is set to true, it allows you to dynamically show or hide columns.
     *
     * > Check the [`ColumnChooser`](../../grid/columns/#column-chooser/) for its configuration.
     * {% codeBlock src='grid/showColumnChooser/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    showColumnChooser?: boolean;

    /**
     * Configures the column chooser in the Grid.
     *
     * @default { columnChooserOperator: 'startsWith' }
     */
    columnChooserSettings?: ColumnChooserSettingsModel;

    /**
     * If `enableHeaderFocus` set to true, then header element will be focused when focus moves to grid.
     *
     * @default false
     */
    enableHeaderFocus?: boolean;

    /**
     * Defines the scrollable height of the grid content.
     * {% codeBlock src='grid/height/index.md' %}{% endcodeBlock %}
     *
     * @default 'auto'
     */
    height?: string | number;

    /**
     * Defines the Grid width.
     * {% codeBlock src='grid/width/index.md' %}{% endcodeBlock %}
     *
     * @default 'auto'
     */
    width?: string | number;

    /**
     * Defines the mode of grid lines. The available modes are,
     * * `Both`: Displays both horizontal and vertical grid lines.
     * * `None`: No grid lines are displayed.
     * * `Horizontal`: Displays the horizontal grid lines only.
     * * `Vertical`: Displays the vertical grid lines only.
     * * `Default`: Displays grid lines based on the theme.
     * {% codeBlock src='grid/gridLines/index.md' %}{% endcodeBlock %}
     *
     * @default Default
     */
    gridLines?: GridLine;

    /**
     * The row template that renders customized rows from the given template.
     * By default, Grid renders a table row for every data source item.
     * > * It accepts either [template string](../../common/template-engine/) or HTML element ID.
     * > * The row template must be a table row.
     *
     * > Check the [`Row Template`](../../grid/row/) customization.
     */
    rowTemplate?: string;

    /**
     * The detail template allows you to show or hide additional information about a particular row.
     *
     * > It accepts either the [template string](../../common/template-engine/) or the HTML element ID.
     *
     * {% codeBlock src="grid/detail-template-api/index.ts" %}{% endcodeBlock %}
     */
    detailTemplate?: string;

    /**
     * Defines Grid options to render child Grid.
     * It requires the [`queryString`](/#querystring) for parent
     * and child relationship.
     *
     * > Check the [`Child Grid`](../../grid/hierarchy-grid/) for its configuration.
     */
    childGrid?: GridModel;

    /**
     * Defines the relationship between parent and child datasource. It acts as the foreign key for parent datasource.
     */
    queryString?: string;

    /**
     * Defines the print modes. The available print modes are
     * * `AllPages`: Prints all pages of the Grid.
     * * `CurrentPage`: Prints the current page of the Grid.
     * {% codeBlock src='grid/printMode/index.md' %}{% endcodeBlock %}
     *
     * @default AllPages
     */
    printMode?: PrintMode;

    /**
     * Defines the hierarchy grid print modes. The available modes are
     * * `Expanded` - Prints the master grid with expanded child grids.
     * * `All` - Prints the master grid with all the child grids.
     * * `None` - Prints the master grid alone.
     *
     * @default Expanded
     */
    hierarchyPrintMode?: HierarchyGridPrintMode;

    /**
     * It is used to render grid table rows.
     * If the `dataSource` is an array of JavaScript objects,
     * then Grid will create instance of [`DataManager`](https://ej2.syncfusion.com/documentation/api/data/dataManager/)
     * from this `dataSource`.
     * If the `dataSource` is an existing [`DataManager`](https://ej2.syncfusion.com/documentation/api/data/dataManager/),
     *  the Grid will not initialize a new one.
     *
     * > Check the available [`Adaptors`](../../data/adaptors/) to customize the data operation.
     * {% codeBlock src='grid/dataSource/index.md' %}{% endcodeBlock %}
     *
     * @default []
     * @isGenericType true
     */
    dataSource?: Object | DataManager | DataResult;

    /**
     * Defines the height of Grid rows.
     * {% codeBlock src='grid/rowHeight/index.md' %}{% endcodeBlock %}
     *
     * @default null
     */
    rowHeight?: number;

    /**
     * Defines the external [`Query`](https://ej2.syncfusion.com/documentation/data/api-query.html)
     * that will be executed along with data processing.
     * {% codeBlock src='grid/query/index.md' %}{% endcodeBlock %}
     *
     * @default null
     */
    query?: Query;

    /**
     * Defines the currencyCode format of the Grid columns
     *
     * @private
     */
    currencyCode?: string;

    /**
     * `toolbar` defines the ToolBar items of the Grid.
     * It contains built-in and custom toolbar items.
     * If a string value is assigned to the `toolbar` option, it is considered as the template for the whole Grid ToolBar.
     * If an array value is assigned, it is considered as the list of built-in and custom toolbar items in the Grid's Toolbar.
     * <br><br>
     * The available built-in ToolBar items are:
     * * Add: Adds a new record.
     * * Edit: Edits the selected record.
     * * Update: Updates the edited record.
     * * Delete: Deletes the selected record.
     * * Cancel: Cancels the edit state.
     * * Search: Searches records by the given key.
     * * Print: Prints the Grid.
     * * ExcelExport - Export the Grid to Excel(excelExport() method manually to make export.)
     * * PdfExport - Export the Grid to PDF(pdfExport() method manually to make export.)
     * * CsvExport - Export the Grid to CSV(csvExport() method manually to make export.)<br><br>
     * The following code example implements the custom toolbar items.
     *
     *  > Check the [`Toolbar`](../../grid/tool-bar/#custom-toolbar-items/) to customize its default items.
     *
     * {% codeBlock src="grid/toolbar-api/index.ts" %}{% endcodeBlock %}
     * {% codeBlock src='grid/toolbar/index.md' %}{% endcodeBlock %}
     *
     * @default null
     */
    toolbar?: (ToolbarItems | string | ItemModel | ToolbarItem)[];

    /**
     * `contextMenuItems` defines both built-in and custom context menu items.
     * <br><br>
     * The available built-in items are,
     * * `AutoFitAll` - Auto fit the size of all columns.
     * * `AutoFit` - Auto fit the current column.
     * * `Group` - Group by current column.
     * * `Ungroup` - Ungroup by current column.
     * * `Edit` - Edit the current record.
     * * `Delete` - Delete the current record.
     * * `Save` - Save the edited record.
     * * `Cancel` - Cancel the edited state.
     * * `Copy` - Copy the selected records.
     * * `PdfExport` - Export the grid as Pdf format.
     * * `ExcelExport` - Export the grid as Excel format.
     * * `CsvExport` - Export the grid as CSV format.
     * * `SortAscending` - Sort the current column in ascending order.
     * * `SortDescending` - Sort the current column in descending order.
     * * `FirstPage` - Go to the first page.
     * * `PrevPage` - Go to the previous page.
     * * `LastPage` - Go to the last page.
     * * `NextPage` - Go to the next page.
     *
     * @default null
     */
    contextMenuItems?: ContextMenuItem[] | ContextMenuItemModel[];

    /**
     * `columnMenuItems` defines both built-in and custom column menu items.
     * <br><br>
     * The available built-in items are,
     * * `AutoFitAll` - Auto fit the size of all columns.
     * * `AutoFit` - Auto fit the current column.
     * * `Group` - Group by current column.
     * * `Ungroup` - Ungroup by current column.
     * * `SortAscending` - Sort the current column in ascending order.
     * * `SortDescending` - Sort the current column in descending order.
     * * `Filter` - Filter options will show based on filterSettings property like checkbox filter, excel filter, menu filter.
     *
     * @default null
     */
    columnMenuItems?: ColumnMenuItem[] | ColumnMenuItemModel[];

    /**
     * It used to render toolbar template
     *
     * @default null
     */
    toolbarTemplate?: string;

    /**
     * It used to render pager template
     *
     * @default null
     */
    pagerTemplate?: string;

    /**
     * Gets or sets the number of frozen rows.
     * {% codeBlock src='grid/frozenRows/index.md' %}{% endcodeBlock %}
     *
     * @default 0
     */
    frozenRows?: number;

    /**
     * Gets or sets the number of frozen columns.
     * {% codeBlock src='grid/frozenColumns/index.md' %}{% endcodeBlock %}
     *
     * @default 0
     */
    frozenColumns?: number;

    /**
     * Defines the own class for the grid element.
     *
     * @default ''
     */
    cssClass?: string;

    /**
     * `columnQueryMode`provides options to retrive data from the datasource.Their types are
     * * `All`: It Retrives whole datasource.
     * * `Schema`: Retrives data for all the defined columns in grid from the datasource.
     * * `ExcludeHidden`: Retrives data only for visible columns of grid from the dataSource.
     *
     * @default All
     */
    columnQueryMode?: ColumnQueryModeType;

    /**
     * Gets or sets the current action details.
     *
     * @default {}
     */
    currentAction?: ActionArgs;

    /**
     * Defines the version for Grid persistence.
     */
    ej2StatePersistenceVersion?: string;

    /**
     * Triggers when the component is created.
     *
     * @event created
     */
    created?: EmitType<Object>;

    /**
     * Triggers when the component is destroyed.
     *
     * @event destroyed
     */
    destroyed?: EmitType<Object>;

    /**
     * This event allows customization of Grid properties before rendering.
     *
     * @event load
     */
    load?: EmitType<Object>;

    /**
     * Triggered every time a request is made to access row information, element, or data.
     * This will be triggered before the row element is appended to the Grid element.
     *
     * @event rowDataBound
     */
    rowDataBound?: EmitType<RowDataBoundEventArgs>;

    /**
     * Triggered every time a request is made to access cell information, element, or data.
     * This will be triggered before the cell element is appended to the Grid element.
     *
     * @event queryCellInfo
     */
    queryCellInfo?: EmitType<QueryCellInfoEventArgs>;

    /**
     * Triggered for stacked header.
     *
     * @event headerCellInfo
     */
    headerCellInfo?: EmitType<HeaderCellInfoEventArgs>;

    /**
     * Triggers when Grid actions such as sorting, filtering, paging, grouping etc., starts.
     * 
     * {% codeBlock src='grid/actionBegin/index.md' %}{% endcodeBlock %}
     *
     * @event actionBegin
     */
    actionBegin?: EmitType<PageEventArgs | GroupEventArgs | FilterEventArgs | SearchEventArgs | SortEventArgs | AddEventArgs | SaveEventArgs | EditEventArgs | DeleteEventArgs | ActionEventArgs>;

    /**
     * Triggers when Grid actions such as sorting, filtering, paging, grouping etc. are completed.
     *
     * @event actionComplete
     */
    actionComplete?: EmitType<PageEventArgs | GroupEventArgs | FilterEventArgs | SearchEventArgs | SortEventArgs | AddEventArgs | SaveEventArgs | EditEventArgs | DeleteEventArgs | ActionEventArgs>;

    /**
     * Triggers when any Grid action failed to achieve the desired results.
     *
     * @event actionFailure
     */
    actionFailure?: EmitType<FailureEventArgs>;

    /**
     * Triggers when data source is populated in the Grid.
     *
     * @event dataBound
     */
    dataBound?: EmitType<Object>;

    /**
     * Triggers when record is double clicked.
     *
     * @event recordDoubleClick
     */
    recordDoubleClick?: EmitType<RecordDoubleClickEventArgs>;

    /**
     * Triggers when record is clicked.
     *
     * @event recordClick
     */
    recordClick?: EmitType<RecordClickEventArgs>;

    /**
     * Triggers before row selection occurs.
     *
     * @event rowSelecting
     */
    rowSelecting?: EmitType<RowSelectingEventArgs>;

    /**
     * Triggers after a row is selected.
     *
     * @event rowSelected
     */
    rowSelected?: EmitType<RowSelectEventArgs>;

    /**
     * Triggers before deselecting the selected row.
     *
     * @event rowDeselecting
     */
    rowDeselecting?: EmitType<RowDeselectEventArgs>;

    /**
     * Triggers when a selected row is deselected.
     *
     * @event rowDeselected
     */
    rowDeselected?: EmitType<RowDeselectEventArgs>;

    /**
     * Triggers before any cell selection occurs.
     *
     * @event cellSelecting
     */
    cellSelecting?: EmitType<CellSelectingEventArgs>;

    /**
     * Triggers after a cell is selected.
     *
     * @event cellSelected
     */
    cellSelected?: EmitType<CellSelectEventArgs>;

    /**
     * Triggers before the selected cell is deselecting.
     *
     * @event cellDeselecting
     */
    cellDeselecting?: EmitType<CellDeselectEventArgs>;

    /**
     * Triggers when a particular selected cell is deselected.
     *
     * @event cellDeselected
     */
    cellDeselected?: EmitType<CellDeselectEventArgs>;

    /**
     * Triggers before column selection occurs.
     *
     * @event columnSelecting
     */
    columnSelecting?: EmitType<ColumnSelectingEventArgs>;

    /**
     * Triggers after a column is selected.
     *
     * @event columnSelected
     */
    columnSelected?: EmitType<ColumnSelectEventArgs>;

    /**
     * Triggers before deselecting the selected column.
     *
     * @event columnDeselecting
     */
    columnDeselecting?: EmitType<ColumnDeselectEventArgs>;

    /**
     * Triggers when a selected column is deselected.
     *
     * @event columnDeselected
     */
    columnDeselected?: EmitType<ColumnDeselectEventArgs>;

    /**
     * Triggers when column header element drag (move) starts.
     *
     * @event columnDragStart
     */
    columnDragStart?: EmitType<ColumnDragEventArgs>;

    /**
     * Triggers when column header element is dragged (moved) continuously.
     *
     * @event columnDrag
     */
    columnDrag?: EmitType<ColumnDragEventArgs>;

    /**
     * Triggers when a column header element is dropped on the target column.
     *
     * @event columnDrop
     */
    columnDrop?: EmitType<ColumnDragEventArgs>;

    /**
     * Triggers after print action is completed.
     *
     * @event printComplete
     */
    printComplete?: EmitType<PrintEventArgs>;

    /**
     * Triggers before the print action starts.
     *
     * @event beforePrint
     */
    beforePrint?: EmitType<PrintEventArgs>;

    /**
     * Triggers before exporting each cell to PDF document. You can also customize the PDF cells.
     *
     * @event pdfQueryCellInfo
     */
    pdfQueryCellInfo?: EmitType<PdfQueryCellInfoEventArgs>;

    /**
     * Triggers before exporting each header cell to PDF document. You can also customize the PDF cells.
     *
     * @event pdfHeaderQueryCellInfo
     */
    pdfHeaderQueryCellInfo?: EmitType<PdfHeaderQueryCellInfoEventArgs>;

    /**
     * Triggers before exporting aggregate cell to PDF document. You can also customize the PDF cells.
     *
     * @event pdfAggregateQueryCellInfo
     */
    pdfAggregateQueryCellInfo?: EmitType<AggregateQueryCellInfoEventArgs>;

    /**
     * Triggers before exporting aggregate cell to Excel document. You can also customize the PDF cells.
     *
     * @event excelAggregateQueryCellInfo
     */
    excelAggregateQueryCellInfo?: EmitType<AggregateQueryCellInfoEventArgs>;

    /**
     * Triggers before exporting each detail Grid to PDF document.
     *
     * @event exportDetailDataBound
     */
    exportDetailDataBound?: EmitType<ExportDetailDataBoundEventArgs>;

    /**
     * Triggers before exporting each cell to Excel file.
     * You can also customize the Excel cells.
     *
     * @event excelQueryCellInfo
     */
    excelQueryCellInfo?: EmitType<ExcelQueryCellInfoEventArgs>;

    /**
     * Triggers before exporting each header cell to Excel file.
     * You can also customize the Excel cells.
     *
     * @event excelHeaderQueryCellInfo
     */
    excelHeaderQueryCellInfo?: EmitType<ExcelHeaderQueryCellInfoEventArgs>;

    /**
     * Triggers before Grid data is exported to Excel file.
     *
     * @event beforeExcelExport
     */
    beforeExcelExport?: EmitType<Object>;

    /**
     * Triggers after Grid data is exported to Excel file.
     *
     * @event excelExportComplete
     */
    excelExportComplete?: EmitType<ExcelExportCompleteArgs>;

    /**
     * Triggers before Grid data is exported to PDF document.
     *
     * @event beforePdfExport
     */
    beforePdfExport?: EmitType<Object>;

    /**
     * Triggers after Grid data is exported to PDF document.
     *
     * @event pdfExportComplete
     */
    pdfExportComplete?: EmitType<PdfExportCompleteArgs>;

    /**
     * Triggers when row element's before drag(move).
     *
     * @event rowDragStartHelper
     */
    rowDragStartHelper?: EmitType<RowDragEventArgs>;

    /**
     * Triggers after detail row expands.
     * > This event triggers at initial expand.
     *
     * @event detailDataBound
     */
    detailDataBound?: EmitType<DetailDataBoundEventArgs>;

    /**
     * Triggers when row element's drag(move) starts.
     *
     * @event rowDragStart
     */
    rowDragStart?: EmitType<RowDragEventArgs>;

    /**
     * Triggers when row elements are dragged (moved) continuously.
     *
     * @event rowDrag
     */
    rowDrag?: EmitType<RowDragEventArgs>;

    /**
     * Triggers when row elements are dropped on the target row.
     *
     * @event rowDrop
     */
    rowDrop?: EmitType<RowDragEventArgs>;

    /**
     * Triggers when toolbar item is clicked.
     *
     * @event toolbarClick
     */
    toolbarClick?: EmitType<ClickEventArgs>;

    /**
     * Triggers before the columnChooser open.
     *
     * @event beforeOpenColumnChooser
     */
    beforeOpenColumnChooser?: EmitType<ColumnChooserEventArgs>;

    /**
     * Triggers before adaptive filter and sort dialogs open.
     *
     * @event beforeOpenAdaptiveDialog
     */
    beforeOpenAdaptiveDialog?: EmitType<AdaptiveDialogEventArgs>;

    /**
     * Triggers when records are added in batch mode.
     *
     * @event batchAdd
     */
    batchAdd?: EmitType<BatchAddArgs>;

    /**
     * Triggers when records are deleted in batch mode.
     *
     * @event batchDelete
     */
    batchDelete?: EmitType<BatchDeleteArgs>;

    /**
     * Triggers when cancel the batch edit changes batch mode.
     *
     * @event batchCancel
     */
    batchCancel?: EmitType<BatchCancelArgs>;

    /**
     * Triggers before records are added in batch mode.
     *
     * @event beforeBatchAdd
     */
    beforeBatchAdd?: EmitType<BeforeBatchAddArgs>;

    /**
     * Triggers before records are deleted in batch mode.
     *
     * @event beforeBatchDelete
     */
    beforeBatchDelete?: EmitType<BeforeBatchDeleteArgs>;

    /**
     * Triggers before records are saved in batch mode.
     *
     * @event beforeBatchSave
     */
    beforeBatchSave?: EmitType<BeforeBatchSaveArgs>;

    /**
     * Triggers before the record is to be edit.
     *
     * @event beginEdit
     */
    beginEdit?: EmitType<BeginEditArgs>;

    /**
     * Triggers when command button is clicked.
     *
     * @event commandClick
     */
    commandClick?: EmitType<CommandClickEventArgs>;

    /**
     * Triggers when the cell is being edited.
     *
     * @event cellEdit
     */
    cellEdit?: EmitType<CellEditArgs>;

    /**
     * Triggers when cell is saved.
     *
     * @event cellSave
     */
    cellSave?: EmitType<CellSaveArgs>;

    /**
     * Triggers when cell is saved.
     *
     * @event cellSaved
     */
    cellSaved?: EmitType<CellSaveArgs>;

    /**
     * Triggers when column resize starts.
     *
     * @event resizeStart
     */
    resizeStart?: EmitType<ResizeArgs>;

    /**
     * Triggers on column resizing.
     *
     * @event resizing
     */
    resizing?: EmitType<ResizeArgs>;

    /**
     * Triggers when column resize ends.
     *
     * @event resizeStop
     */
    resizeStop?: EmitType<ResizeArgs>;

    /**
     * Triggers when any keyboard keys are pressed inside the grid.
     *
     * @event keyPressed
     */
    keyPressed?: EmitType<KeyboardEventArgs>;

    /**
     * Triggers before data is bound to Grid.
     *
     * @event beforeDataBound
     */
    beforeDataBound?: EmitType<BeforeDataBoundArgs>;

    /**
     * Triggers before context menu opens.
     *
     * @event contextMenuOpen
     */
    contextMenuOpen?: EmitType<BeforeOpenCloseMenuEventArgs>;

    /**
     * Triggers when click on context menu.
     *
     * @event contextMenuClick
     */
    contextMenuClick?: EmitType<MenuEventArgs>;

    /**
     * Triggers before column menu opens.
     *
     * @event columnMenuOpen
     */
    columnMenuOpen?: EmitType<ColumnMenuOpenEventArgs>;

    /**
     * Triggers when click on column menu.
     *
     * @event columnMenuClick
     */
    columnMenuClick?: EmitType<MenuEventArgs>;

    /**
     * Triggers when the check box state change in checkbox column.
     *
     * @event checkBoxChange
     */
    checkBoxChange?: EmitType<CheckBoxChangeEventArgs>;

    /**
     * Triggers before Grid copy action.
     *
     * @event beforeCopy
     */
    beforeCopy?: EmitType<BeforeCopyEventArgs>;

    /**
     * Triggers before Grid paste action.
     *
     * @event beforePaste
     */
    beforePaste?: EmitType<BeforePasteEventArgs>;

    /**
     * Triggers before Grid autoFill action.
     *
     * @event beforeAutoFill
     */
    beforeAutoFill?: EmitType<BeforeAutoFillEventArgs>;

    /**
     * Triggers when the grid actions such as Sorting, Paging, Grouping etc., are done to get column `dataSource`.
     * In this event,the current view column data and total record count should be assigned to the column `dataSource` based
     * on the action performed.
     *
     * @event columnDataStateChange
     */
    columnDataStateChange?: EmitType<ColumnDataStateChangeEventArgs>;

    /**
     * Triggers when the grid actions such as Sorting, Paging, Grouping etc., are done.
     * In this event,the current view data and total record count should be assigned to the `dataSource` based on the action performed.
     *
     * @event dataStateChange
     */
    dataStateChange?: EmitType<DataStateChangeEventArgs>;

    /**
     * Triggers when the grid data is added, deleted and updated.
     * Invoke the done method from the argument to start render after edit operation.
     *
     * @event dataSourceChanged
     */
    dataSourceChanged?: EmitType<DataSourceChangedEventArgs>;

    /**
     * Triggers before exporting each caption row to PDF/Excel/CSV document. You can also customize the export caption row values.
     *
     * @event exportGroupCaption
     */
    exportGroupCaption?: EmitType<ExportGroupCaptionEventArgs>;

    /**
     * Triggers when expand the caption row in lazy load grouping.
     *
     * @event lazyLoadGroupExpand
     */
    lazyLoadGroupExpand?: EmitType<LazyLoadArgs>;

    /**
     * Triggers when collapse the caption row in lazy load grouping.
     *
     * @event lazyLoadGroupCollapse
     */
    lazyLoadGroupCollapse?: EmitType<LazyLoadArgs>;

}