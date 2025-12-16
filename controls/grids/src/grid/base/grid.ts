import { isNullOrUndefined, setValue, getValue, defaultCurrencyCode, updateCSSText } from '@syncfusion/ej2-base';
import { Component, ModuleDeclaration, ChildProperty, Browser, closest, extend, TouchEventArgs } from '@syncfusion/ej2-base';
import { addClass, removeClass, append, remove, classList, setStyleAttribute } from '@syncfusion/ej2-base';
import { Property, Collection, Complex, Event, NotifyPropertyChanges, INotifyPropertyChanged, L10n } from '@syncfusion/ej2-base';
import { EventHandler, KeyboardEvents, KeyboardEventArgs as KeyArg, EmitType } from '@syncfusion/ej2-base';
import { Query, DataManager, DataUtil, DataOptions, UrlAdaptor } from '@syncfusion/ej2-data';
import { ItemModel, ClickEventArgs } from '@syncfusion/ej2-navigations';
import { createSpinner, hideSpinner, showSpinner, Tooltip } from '@syncfusion/ej2-popups';
import { GridModel, ResizeSettingsModel } from './grid-model';
import { iterateArrayOrObject, prepareColumns, parentsUntil, wrap, templateCompiler, isGroupAdaptive, refreshForeignData, getScrollBarWidth } from './util';
import { getRowHeight, setColumnIndex, Global, ispercentageWidth, getNumberFormat, getTransformValues } from './util';
import { setRowElements, resetRowIndex, compareChanges, getCellByColAndRowIndex, performComplexDataOperation } from './util';
import * as events from '../base/constant';
import { ReturnType, BatchChanges, RowSelectable, PinRow } from '../base/type';
import { IDialogUI, ScrollPositionType, ActionArgs, ExportGroupCaptionEventArgs, FilterUI, LazyLoadArgs, LoadEventArgs, ContextMenuClickEventArgs, ContextMenuOpenEventArgs, NotifyArgs, ExportHeaders, DetailTemplateDetachArgs, BeforeCustomFilterOpenEventArgs } from './interface';
import {AggregateQueryCellInfoEventArgs, IGrid } from './interface';
import { IRenderer, IValueFormatter, IFilterOperator, IIndex, RowDataBoundEventArgs, QueryCellInfoEventArgs } from './interface';
import { CellDeselectEventArgs, CellSelectEventArgs, CellSelectingEventArgs, ParentDetails, ContextMenuItemModel } from './interface';
import { PdfQueryCellInfoEventArgs, ExcelQueryCellInfoEventArgs, ExcelExportProperties, PdfExportProperties } from './interface';
import { PdfHeaderQueryCellInfoEventArgs, ExcelHeaderQueryCellInfoEventArgs, ExportDetailDataBoundEventArgs, ExportDetailTemplateEventArgs } from './interface';
import { ColumnMenuOpenEventArgs, BatchCancelArgs, RecordDoubleClickEventArgs, DataResult, PendingState } from './interface';
import { HeaderCellInfoEventArgs, KeyboardEventArgs, RecordClickEventArgs, AdaptiveDialogEventArgs } from './interface';
import { FailureEventArgs, FilterEventArgs, ColumnDragEventArgs, GroupEventArgs, PrintEventArgs, ICustomOptr, ReorderEventArgs } from './interface';
import { RowDeselectEventArgs, RowSelectEventArgs, RowSelectingEventArgs, RowDeselectingEventArgs, PageEventArgs, RowDragEventArgs } from './interface';
import { BeforeBatchAddArgs, BeforeBatchDeleteArgs, BeforeBatchSaveArgs, ResizeArgs, ColumnMenuItemModel } from './interface';
import { BatchAddArgs, BatchDeleteArgs, BeginEditArgs, CellEditArgs, CellSaveArgs, BeforeDataBoundArgs, RowInfo } from './interface';
import { DetailDataBoundEventArgs, ColumnChooserEventArgs, AddEventArgs, SaveEventArgs, EditEventArgs, DeleteEventArgs } from './interface';
import { DetailExpandCollapseArgs } from './interface';
import { ExcelExportCompleteArgs, PdfExportCompleteArgs, DataStateChangeEventArgs, DataSourceChangedEventArgs } from './interface';
import { SearchEventArgs, SortEventArgs, ISelectedCell, EJ2Intance, BeforeCopyEventArgs, ColumnDataStateChangeEventArgs} from './interface';
import {BeforePasteEventArgs, CheckBoxChangeEventArgs, CommandClickEventArgs, BeforeAutoFillEventArgs } from './interface';
import { Render } from '../renderer/render';
import { Column, ColumnModel, ActionEventArgs } from '../models/column';
import { SelectionType, GridLine, RenderType, SortDirection, SelectionMode, PrintMode, FilterType, FilterBarMode } from './enum';
import { CheckboxSelectionType, HierarchyGridPrintMode, NewRowPosition, ClipMode, freezeMode, IndicatorType } from './enum';
import { WrapMode, ToolbarItems, ContextMenuItem, ColumnMenuItem, ToolbarItem, CellSelectionMode, EditMode, ResizeMode } from './enum';
import { ColumnQueryModeType, RowRenderingDirection, AdaptiveMode  } from './enum';
import { Data } from '../actions/data';
import { Cell } from '../models/cell';
import { RowRenderer } from '../renderer/row-renderer';
import { CellRenderer } from '../renderer/cell-renderer';
import { CellRendererFactory } from '../services/cell-render-factory';
import { ServiceLocator } from '../services/service-locator';
import { ValueFormatter } from '../services/value-formatter';
import { RendererFactory } from '../services/renderer-factory';
import { ColumnWidthService } from '../services/width-controller';
import { AriaService } from '../services/aria-service';
import { FocusStrategy } from '../services/focus-strategy';
import { SortSettingsModel, SelectionSettingsModel, FilterSettingsModel, SearchSettingsModel, EditSettingsModel } from './grid-model';
import { SortDescriptorModel, PredicateModel, RowDropSettingsModel, GroupSettingsModel, TextWrapSettingsModel, LoadingIndicatorModel } from './grid-model';
import { InfiniteScrollSettingsModel } from './grid-model';
import { PageSettingsModel, AggregateRowModel, AggregateColumnModel, ColumnChooserSettingsModel } from '../models/models';
import { PageSettings } from '../models/page-settings';
import { ColumnChooserSettings } from '../models/column-chooser-settings';
import { Sort } from '../actions/sort';
import { Page } from '../actions/page';
import { Selection } from '../actions/selection';
import { Filter } from '../actions/filter';
import { Search } from '../actions/search';
import { Resize } from '../actions/resize';
import { Reorder } from '../actions/reorder';
import { RowDD } from '../actions/row-reorder';
import { ShowHide } from '../actions/show-hide';
import { Scroll } from '../actions/scroll';
import { InfiniteScroll } from '../actions/infinite-scroll';
import { Group } from '../actions/group';
import { Print } from '../actions/print';
import { DetailRow } from '../actions/detail-row';
import { Toolbar } from '../actions/toolbar';
import { AggregateRow } from '../models/aggregate';
import { Edit } from '../actions/edit';
import { Row } from '../models/row';
import { ColumnChooser } from '../actions/column-chooser';
import { ExcelExport } from '../actions/excel-export';
import { PdfExport } from '../actions/pdf-export';
import { Clipboard } from '../actions/clipboard';
import { ContextMenu } from '../actions/context-menu';
import { MenuEventArgs } from '@syncfusion/ej2-navigations';
import { ColumnMenu } from '../actions/column-menu';
import { CheckState } from './enum';
import { Aggregate } from '../actions/aggregate';
import { ILogger, Logger } from '../actions/logger';
import { IModelGenerator } from '../base/interface';
import { RowModelGenerator } from '../services/row-model-generator';
import { ColumnDeselectEventArgs, ColumnSelectEventArgs, ColumnSelectingEventArgs } from './interface';
import { DateFormatOptions, NumberFormatOptions, SanitizeHtmlHelper } from '@syncfusion/ej2-base';
import * as literals from '../base/string-literals';
import { Workbook } from '@syncfusion/ej2-excel-export';
import { HeaderCellRenderer } from '../renderer/header-cell-renderer';
import { VirtualContentRenderer } from '../renderer/virtual-content-renderer';

/**
 * Represents the field name and direction of sort column.
 */
export class SortDescriptor extends ChildProperty<SortDescriptor> {
    /**
     * Defines the field name of sort column.
     *
     * @default ''
     */
    @Property()
    public field: string;

    /**
     * Defines the direction of sort column.
     *
     * @default ''
     */
    @Property()
    public direction: SortDirection;

    /**
     * @hidden
     * Defines the sorted column whether or from grouping operation.
     *
     * @default false
     */
    @Property(false)
    public isFromGroup: boolean;
}

/**
 * Configures the sorting behavior of Grid.
 */
export class SortSettings extends ChildProperty<SortSettings> {
    /**
     * Specifies the columns to sort at initial rendering of Grid.
     * Also user can get current sorted columns.
     *
     * @default []
     */
    @Collection<SortDescriptorModel>([], SortDescriptor)
    public columns: SortDescriptorModel[];

    /**
     * If `allowUnsort` set to false the user can not get the grid in unsorted state by clicking the sorted column header.
     *
     * @default true
     */
    @Property(true)
    public allowUnsort: boolean;
}

/**
 * Represents the predicate for the filter column.
 */
export class Predicate extends ChildProperty<Predicate> {

    /**
     * Defines the field name of the filter column.
     *
     * @default ''
     */
    @Property()
    public field: string;

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
    @Property()
    public operator: string;

    /**
     * Defines the value used to filter records.
     *
     * @default ''
     */
    @Property()
    public value: string | number | Date | boolean | (string | number | Date | boolean)[];

    /**
     * If match case set to true, then filter records with exact match or else
     * filter records with case insensitive(uppercase and lowercase letters treated as same).
     *
     * @default null
     */
    @Property()
    public matchCase: boolean;

    /**
     * If ignoreAccent is set to true, then filter ignores the diacritic characters or accents while filtering.
     *
     * @default false
     */
    @Property(false)
    public ignoreAccent: boolean;

    /**
     * Defines the relationship between one filter query and another by using AND or OR predicate.
     *
     * @default null
     */
    @Property()
    public predicate: string;

    /**
     * @hidden
     * Defines the actual filter value for the filter column.
     */
    @Property({})
    public actualFilterValue: Object;

    /**
     * @hidden
     * Defines the actual filter operator for the filter column.
     */
    @Property({})
    public actualOperator: Object;

    /**
     * @hidden
     * Defines the type of the filter column.
     */
    @Property()
    public type: string;

    /**
     * @hidden
     * Defines the predicate of filter column.
     */
    @Property()
    public ejpredicate: Object;

    /**
     * Defines the UID of filter column.
     *
     * @default ''
     */
    @Property()
    public uid: string;

    /**
     * @hidden
     * Defines the foreignKey availability in filtered columns.
     */
    @Property()
    public isForeignKey: boolean;

    /**
     * Defines the condition to add the new predicates on existing predicate with "and"/"or" operator.
     *
     * @default ''
     */
    @Property()
    public condition: string;
}

/**
 * Configures the infinite scroll behavior of Grid.
 */
export class InfiniteScrollSettings extends ChildProperty<InfiniteScrollSettings> {
    /**
     * If `enableCache` is set to true, the Grid will cache the loaded data to be reused next time it is needed.
     *
     * @default false
     */
    @Property(false)
    public enableCache: boolean;

    /**
     * Defines the number of blocks to be maintained in Grid while settings enableCache as true.
     *
     * @default 3
     */
    @Property(3)
    public maxBlocks: number;

    /**
     * Defines the number of blocks that will render at the initial Grid rendering.
     *
     * @default 3
     */
    @Property(3)
    public initialBlocks: number;
}

/**
 * Configures the filtering behavior of the Grid.
 */
export class FilterSettings extends ChildProperty<FilterSettings> {
    /**
     * Specifies the columns to be filtered at initial rendering of the Grid. You can also get the columns that were currently filtered.
     *
     * @default []
     */
    @Collection<PredicateModel[]>([], Predicate)
    public columns: PredicateModel[];

    /**
     * Defines options for filtering type. The available options are
     * * `Menu` - Specifies the filter type as menu.
     * * `CheckBox` - Specifies the filter type as checkbox.
     * * `FilterBar` - Specifies the filter type as filterbar.
     * * `Excel` - Specifies the filter type as checkbox.
     *
     * @default FilterBar
     */
    @Property('FilterBar')
    public type: FilterType;

    /**
     * Defines the filter bar modes. The available options are,
     * * `OnEnter`: Initiates filter operation after Enter key is pressed.
     * * `Immediate`: Initiates filter operation after a certain time interval. By default, time interval is 1500 ms.
     *
     * @default OnEnter
     */
    @Property('OnEnter')
    public mode: FilterBarMode;

    /**
     * Shows or hides the filtered status message on the pager.
     *
     * @default true
     */
    @Property(true)
    public showFilterBarStatus: boolean;

    /**
     * Defines the time delay (in milliseconds) in filtering records when the `Immediate` mode of filter bar is set.
     *
     * @default 1500
     */
    @Property(1500)
    public immediateModeDelay: number;

    /**
     * The `operators` is used to override the default operators in filter menu. This should be defined by type wise
     * (string, number, date and boolean). Based on the column type, this customize operator list will render in filter menu.
     *
     * > Check the [`Filter Menu Operator`](../../grid/filtering/filter-menu#customizing-filter-menu-operators-list) customization.
     *
     * @default null
     */
    @Property()
    public operators: ICustomOptr;

    /**
     * If ignoreAccent set to true, then filter ignores the diacritic characters or accents while filtering.
     *
     * > Check the [`Diacritics`](../../grid/filtering/#diacritics/) filtering.
     *
     * @default false
     */
    @Property(false)
    public ignoreAccent: boolean;

    /**
     * If `enableInfiniteScrolling` set to true, then the data will be loaded in Checkbox filter `Popup` content, when the scrollbar reaches the end.
     * This helps to load large dataset in Checkbox filter `Popup` content.
     * {% codeBlock src='grid/enableInfiniteScrolling/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    @Property(false)
    public enableInfiniteScrolling: boolean;

    /**
     * If `enableInfiniteScrolling` set to true, For on demand request, Gets data from the parent data source based on given number of records count.
     *
     * @default 100
     */
    @Property(50)
    public itemsCount: number;

    /**
     * Defines the loading indicator. The available loading indicator are:
     * * Spinner
     * * Shimmer
     *
     * @default Shimmer
     */
    @Property('Shimmer')
    public loadingIndicator: IndicatorType;

    /**
     * If `enableCaseSensitivity` is set to true then searches grid records with exact match based on the filter
     * operator. It will have no effect on number, boolean and Date fields.
     *
     * @default false
     */
    @Property(false)
    public enableCaseSensitivity: boolean;

    /**
     * If 'showFilterBarOperator' is set to true, then it renders the dropdownlist component to select the operator
     * in filterbar input
     *
     * @default false
     */
    @Property(false)
    public showFilterBarOperator: boolean;
}

/**
 * Configures the selection behavior of the Grid.
 */
export class SelectionSettings extends ChildProperty<SelectionSettings> {
    /**
     * Grid supports row, cell, and both (row and cell) selection mode.
     *
     * @default Row
     */
    @Property('Row')
    public mode: SelectionMode;

    /**
     * The cell selection modes are flow and box. It requires the selection
     * [`mode`](./selectionmode/) to be either cell or both.
     * * `Flow`: Selects the range of cells between start index and end index that also includes the other cells of the selected rows.
     * * `Box`: Selects the range of cells within the start and end column indexes that includes in between cells of rows within the range.
     * * `BoxWithBorder`: Selects the range of cells as like Box mode with borders.
     *
     * @default Flow
     */
    @Property('Flow')
    public cellSelectionMode: CellSelectionMode;

    /**
     * Defines options for selection type. They are
     * * `Single`: Allows selection of only a row or a cell.
     * * `Multiple`: Allows selection of multiple rows or cells.
     *
     * @default Single
     */
    @Property('Single')
    public type: SelectionType;

    /**
     * If 'checkboxOnly' set to true, then the Grid selection is allowed only through checkbox.
     *
     * > To enable checkboxOnly selection, should specify the column type as`checkbox`.
     *
     * @default false
     */
    @Property(false)
    public checkboxOnly: boolean;

    /**
     * If 'persistSelection' set to true, then the Grid selection is persisted on all operations.
     * For persisting selection in the Grid, any one of the column should be enabled as a primary key.
     *
     * @default false
     */
    @Property(false)
    public persistSelection: boolean;

    /**
     * Defines options for checkbox selection Mode. They are
     * * `Default`: This is the default value of the checkboxMode. In this mode, user can select multiple rows by clicking rows one by one.
     * * `ResetOnRowClick`: In ResetOnRowClick mode, on clicking a row it will reset previously selected row and also multiple
     *  rows can be selected by using CTRL or SHIFT key.
     *
     * @default Default
     */
    @Property('Default')
    public checkboxMode: CheckboxSelectionType;

    /**
     * If 'enableSimpleMultiRowSelection' set to true, then the user can able to perform multiple row selection with single clicks.
     *
     * @default false
     */
    @Property(false)
    public enableSimpleMultiRowSelection: boolean;

    /**
     * If 'enableToggle' set to true, then the user can able to perform toggle for the selected row.
     *
     * @default true
     */
    @Property(true)
    public enableToggle: boolean;

    /**
     * If 'allowColumnSelection' set to true, then the user can able to select the columns.
     *
     * @default false
     */
    @Property(false)
    public allowColumnSelection: boolean;
}

/**
 * Configures the search behavior of the Grid.
 */
export class SearchSettings extends ChildProperty<SearchSettings> {
    /**
     * Specifies the collection of fields included in search operation. By default, bounded columns of the Grid are included.
     *
     * @default []
     */
    @Property([])
    public fields: string[];

    /**
     * Specifies the key value to search Grid records at initial rendering.
     * You can also get the current search key.
     *
     * @default ''
     */
    @Property('')
    public key: string;

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
    @Property('contains')
    public operator: string;

    /**
     * If `ignoreCase` is set to false, searches records that match exactly, else
     * searches records that are case insensitive(uppercase and lowercase letters treated the same).
     *
     * @default true
     */
    @Property(true)
    public ignoreCase: boolean;

    /**
     * If ignoreAccent set to true, then filter ignores the diacritic characters or accents while filtering.
     *
     * > Check the [`Diacritics`](../../grid/filtering/#diacritics/) filtering.
     *
     * @default false
     */
    @Property(false)
    public ignoreAccent: boolean;
}

/**
 * Configures the row drop settings of the Grid.
 */
export class RowDropSettings extends ChildProperty<RowDropSettings> {
    /**
     * Defines the ID of droppable component on which row drop should occur.
     *
     * @default null
     */
    @Property()
    public targetID: string;
}

/**
 * Configures the text wrap settings of the Grid.
 */
export class TextWrapSettings extends ChildProperty<TextWrapSettings> {
    /**
     * The `wrapMode` property defines how the text in the grid cells should be wrapped. The available modes are:
     * * `Both`: Wraps text in both the header and content cells.
     * * `Content`: Wraps text in the content cells only.
     * * `Header`: Wraps texts in the header cells only.
     *
     * @default Both
     */
    @Property('Both')
    public wrapMode: WrapMode;
}

/**
 * Configures the resize behavior of the Grid.
 */
export class ResizeSettings extends ChildProperty<ResizeSettings> {
    /**
     * Defines the mode of Grid column resizing. The available modes are:
     * `Normal`: Columns will not be adjusted to fit the remaining space.
     * `Auto`: Resized column width will be adjusted by other columns automatically.
     *
     * @default Normal
     */
    @Property('Normal')
    public mode: ResizeMode;
}

/**
 * Configures the group behavior of the Grid.
 */
export class GroupSettings extends ChildProperty<GroupSettings> {
    /**
     * If `showDropArea` is set to true, the group drop area element will be visible at the top of the Grid.
     *
     * @default true
     */
    @Property(true)
    public showDropArea: boolean;
    /**
     * If `allowReordering` is set to true, Grid allows the grouped elements to be reordered.
     *
     * @default false
     */
    @Property(false)
    public allowReordering: boolean;
    /**
     * If `showToggleButton` set to true, then the toggle button will be showed in the column headers which can be used to group
     * or ungroup columns by clicking them.
     *
     * @default false
     */
    @Property(false)
    public showToggleButton: boolean;

    /**
     * If `showGroupedColumn` is set to false, it hides the grouped column after grouping.
     *
     * @default false
     */
    @Property(false)
    public showGroupedColumn: boolean;

    /**
     * If `showUngroupButton` set to false, then ungroup button is hidden in dropped element.
     * It can be used to ungroup the grouped column when click on ungroup button.
     *
     * @default true
     */
    @Property(true)
    public showUngroupButton: boolean;

    /**
     * If `disablePageWiseAggregates` set to true, then the group aggregate value will
     * be calculated from the whole data instead of paged data and two requests will be made for each page
     * when Grid bound with remote service.
     *
     * @default false
     */
    @Property(false)
    public disablePageWiseAggregates: boolean;

    /**
     * Specifies the column names to group at initial rendering of the Grid.
     * You can also get the currently grouped columns.
     *
     * @default []
     */
    @Property([])
    public columns: string[];

    /**
     * The Caption Template allows user to display the string or HTML element in group caption.
     * > It accepts either the
     * [template string](https://ej2.syncfusion.com/documentation/common/template-engine/) or the HTML element ID.
     *
     * @default null
     * @aspType string
     */
    @Property()
    public captionTemplate: string | Object | Function;

    /**
     * The Lazy load grouping, allows the Grid to render only the initial level caption rows in collapsed state while grouping.
     * The child rows of each caption will render only when we expand the captions.
     *
     * @default false
     */
    @Property(false)
    public enableLazyLoading: boolean;
}

/**
 * Configures the edit behavior of the Grid.
 */
export class EditSettings extends ChildProperty<EditSettings> {
    /**
     * If `allowAdding` is set to true, new records can be added to the Grid.
     *
     * @default false
     */
    @Property(false)
    public allowAdding: boolean;

    /**
     * If `allowEditing` is set to true, values can be updated in the existing record.
     *
     * @default false
     */
    @Property(false)
    public allowEditing: boolean;

    /**
     * If `allowDeleting` is set to true, existing record can be deleted from the Grid.
     *
     * @default false
     */
    @Property(false)
    public allowDeleting: boolean;

    /**
     * Defines the mode to edit. The available editing modes are:
     * * Normal
     * * Dialog
     * * Batch
     *
     * @default Normal
     */
    @Property('Normal')
    public mode: EditMode;

    /**
     * If `allowEditOnDblClick` is set to false, Grid will not allow editing of a record on double click.
     *
     * @default true
     */
    @Property(true)
    public allowEditOnDblClick: boolean;

    /**
     * if `showConfirmDialog` is set to false, confirm dialog does not show when batch changes are saved or discarded.
     *
     * @default true
     */
    @Property(true)
    public showConfirmDialog: boolean;

    /**
     * If `showDeleteConfirmDialog` is set to true, confirm dialog will show delete action. You can also cancel delete command.
     *
     * @default false
     */
    @Property(false)
    public showDeleteConfirmDialog: boolean;

    /**
     * Defines the custom edit elements for the dialog template.
     *
     * @default null
     * @aspType string
     */
    @Property()
    public template: string | Object | Function;

    /**
     * Defines the custom edit elements for the dialog header template.
     *
     * @default null
     * @aspType string
     */
    @Property()
    public headerTemplate: string | Object | Function;

    /**
     * Defines the custom edit elements for the dialog footer template.
     *
     * @default null
     * @aspType string
     */
    @Property()
    public footerTemplate: string | Object | Function;

    /**
     * Defines the position of adding a new row. The available position are:
     * * Top
     * * Bottom
     *
     * @default Top
     */
    @Property('Top')
    public newRowPosition: NewRowPosition;

    /**
     * Defines the dialog params to edit.
     *
     * @default {}
     */
    @Property({})
    public dialog: IDialogUI;

    /**
     * If allowNextRowEdit is set to true, editing is done to next row. By default allowNextRowEdit is set to false.
     *
     * @default false
     */
    @Property(false)
    public allowNextRowEdit: boolean;

    /**
     * If `showAddNewRow` is set to true, it indicates whether to display the add new form by default in the grid.
     *
     * @default false
     */
    @Property(false)
    public showAddNewRow: boolean;
}

/**
 * Configures the Loading Indicator of the Grid.
 */
export class LoadingIndicator extends ChildProperty<LoadingIndicator> {
    /**
     * Defines the loading indicator. The available loading indicator are:
     * * Spinner
     * * Shimmer
     *
     * @default Spinner
     */
    @Property('Spinner')
    public indicatorType: IndicatorType;
}

/**
 * Represents the Grid component.
 * ```html
 * <div id="grid"></div>
 * <script>
 *  var gridObj = new Grid({ allowPaging: true });
 *  gridObj.appendTo("#grid");
 * </script>
 * ```
 */
@NotifyPropertyChanges
export class Grid extends Component<HTMLElement> implements INotifyPropertyChanged {
    // Internal variables
    private gridPager: Element;
    private isInitial: boolean;
    public isPreventScrollEvent: boolean = false;
    private columnModel: Column[];
    private rowTemplateFn: Function;
    private emptyRecordTemplateFn: Function;
    private editTemplateFn: Function;
    private editHeaderTemplateFn: Function;
    private editFooterTemplateFn: Function;
    private columnChooserTemplateFn: Function;
    private columnChooserHeaderTemplateFn: Function;
    private columnChooserFooterTemplateFn: Function;
    private detailTemplateFn: Function;
    private sortedColumns: string[];
    private footerElement: Element;
    private inViewIndexes: number[] = [];
    private mediaCol: Column[];
    private getShowHideService: ShowHide;
    private keyA: boolean = false;
    private frozenRightCount: number = 0;
    private freezeColumnRefresh: boolean = true;
    private rightcount: number = 0;
    private frozenLeftCount: number = 0;
    private leftcount: number = 0;
    private tablesCount: number = 1;
    private movableCount: number = 0;
    private movablecount: number = 0;
    private fixedcount: number = 0;
    private fixedCount: number = 0;
    private visibleFrozenLeft: number = 0;
    private visibleFrozenFixed: number = 0;
    private frozenName: freezeMode;
    private isPreparedFrozenColumns: boolean = false;
    private visibleFrozenRight: number = 0;
    private visibleMovable: number = 0;
    private frozenLeftColumns: Column[] = [];
    private frozenRightColumns: Column[] = [];
    private movableColumns: Column[] = [];
    private fixedColumns: Column[] = [];
    private stackedLeft: string[][] = [];
    private stackedRight: string[][] = [];
    private stackedFixed: string[][] = [];
    private stackedMovable: string[][] = [];
    private stackedarrayLeft: Column[] = [];
    private stackedarrayRight: Column[] = [];
    private stackedarrayFixed: Column[] = [];
    private stackedarrayMovable: Column[] = [];
    private media: { [key: string]: MediaQueryList } = {};
    private headerMaskTable: Element;
    private contentMaskTable: Element;
    private footerContentMaskTable: Element;
    private maskRowContentScroll: boolean;
    private autoFitColumnsResize: boolean = false;
    private isTreeGrid: boolean;
    /** @hidden */
    public invokedFromMedia: boolean;
    /** @hidden */
    public tableIndex: number = 0;
    private dataBoundFunction: Function;
    private dataToBeUpdated: BatchChanges;
    private componentRefresh: Function = Component.prototype.refresh;
    private isChangeDataSourceCall: boolean = false;
    private mergedColumns: boolean = false;
    /** @hidden */
    public recordsCount: number;
    /** @hidden */
    public isVirtualAdaptive: boolean = false;
    /** @hidden */
    /**
     * * If `requireTemplateRef` is set to false in the load event, then the template element can't be accessed in grid queryCellInfo, and rowDataBound events.
     * * By default, React's grid queryCellInfo and rowDataBound events allow access to the template element.
     * * Avoid accessing the template elements in the grid queryCellInfo and rowDataBound events to improve rendering performance by setting this value as false.
     *
     * @default true
     */
    public requireTemplateRef: boolean = true;
    /** @hidden */
    public vRows: Row<Column>[] = [];
    /** @hidden */
    public vcRows: Row<Column>[] = [];
    /** @hidden */
    public vGroupOffsets: { [x: number]: number } = {};
    /** @hidden */
    public isInitialLoad: boolean;
    /** @hidden */
    private rowUid: number = 0;
    /**
     * @hidden
     */
    public mergeCells: { [key: string]: number };
    /**
     * @hidden
     */
    public checkAllRows: CheckState;
    /**
     * @hidden
     */
    public isCheckBoxSelection: boolean;
    /**
     * @hidden
     */
    public isPersistSelection: boolean;
    /**
     * Gets the currently visible records of the Grid.
     *
     * @default []
     */
    @Property([])
    public currentViewData: Object[];
    /** @hidden */
    /**
     * Gets the parent Grid details.
     *
     * @default {}
     */
    @Property()
    public parentDetails: ParentDetails;
    /** @hidden */
    public printGridParent: IGrid;
    /** @hidden */
    public isEdit: boolean;
    /** @hidden */
    public commonQuery: Query;
    /** @hidden */
    public scrollPosition: ScrollPositionType;
    /** @hidden */
    public isLastCellPrimaryKey: boolean;
    /** @hidden */
    public translateX: number = 0;
    /** @hidden */
    public filterOperators: IFilterOperator;
    /** @hidden */
    public localeObj: L10n;
    /** @hidden */
    public isManualRefresh: boolean = false;
    /** @hidden */
    public isAutoFitColumns: boolean = false;
    /** @hidden */
    public enableDeepCompare: boolean = false;
    /** @hidden */
    public totalDataRecordsCount: number = 0;
    /** @hidden */
    public disableSelectedRecords: Object[] = [];
    /** @hidden */
    public partialSelectedRecords: Object[] = [];
    /** @hidden */
    public partialSelectedIndexes: number[] = [];
    /** @hidden */
    public pinnedTopRowModels: Row<Column>[] = [];
    /** @hidden */
    public pinnedTopRecords: Object[] = [];
    /** @hidden */
    public pinnedTopRowKeys: { [key: number]: boolean } = {};
    /** @hidden */
    public pinnedRowIndexes: { [key: number]: {pinnedIndex: number, contentIndex: number} } = {};
    /** @hidden */
    public contentRowIndexes: { [key: number]: {pinnedIndex: number, contentIndex: number} } = {};
    /** @hidden */
    public lazyLoadRender: IRenderer;
    /** @hidden */
    public isSpan: boolean = false;
    /** @hidden */
    public islazyloadRequest: boolean = false;
    /** @hidden */
    public isAddNewRow: boolean = false;
    /** @hidden */
    public addNewRowFocus: boolean = true;
    /** @hidden */
    public selectVirtualRowOnAdd: boolean = false;
    public isSelectedRowIndexUpdating: boolean;
    private defaultLocale: Object;
    /** @hidden */
    public defaultChartLocale: Object;
    private keyConfigs: { [key: string]: string };
    private keyPress: boolean;
    private toolTipObj: Tooltip;
    private prevElement: HTMLElement;
    private stackedColumn: Column;
    private isExcel: boolean;
    /** @hidden */
    public lockcolPositionCount: number = 0;
    /** @hidden */
    public prevPageMoving: boolean = false;
    /** @hidden */
    public pageTemplateChange: boolean = false;
    /** @hidden */
    public isAutoGen: boolean = false;
    /** @hidden */
    public isAutoGenerateColumns: boolean = false;
    /** @hidden */
    public pageRequireRefresh: boolean = true;
    private mediaBindInstance: Object = {};
    /** @hidden */
    public commandDelIndex: number = undefined;
    /** @hidden */
    public preventAutoFit: boolean = false;
    /** @hidden */
    public asyncTimeOut: number = 50;
    /** @hidden */
    public isExportGrid: boolean = false;
    /** @hidden */
    public isWidgetsDestroyed: boolean = false;

    //Module Declarations
    /**
     * @hidden
     */
    public renderModule: Render;
    /**
     * @hidden
     */
    public headerModule: IRenderer;
    /**
     * @hidden
     */
    public contentModule: IRenderer;
    /**
     * @hidden
     */
    public valueFormatterService: IValueFormatter;
    /**
     * @hidden
     */
    public serviceLocator: ServiceLocator;
    /**
     * @hidden
     */
    public ariaService: AriaService;
    /**
     * The `keyboardModule` is used to manipulate keyboard interactions in the Grid.
     */
    public keyboardModule: KeyboardEvents;
    /**
     * @hidden
     */
    public widthService: ColumnWidthService;

    /**
     * The `rowDragAndDropModule` is used to manipulate row reordering in the Grid.
     */
    public rowDragAndDropModule: RowDD;
    /**
     * The `pagerModule` is used to manipulate paging in the Grid.
     */
    public pagerModule: Page;
    /**
     * The `sortModule` is used to manipulate sorting in the Grid.
     */
    public sortModule: Sort;
    /**
     * The `filterModule` is used to manipulate filtering in the Grid.
     */
    public filterModule: Filter;
    /**
     * The `selectionModule` is used to manipulate selection behavior in the Grid.
     */
    public selectionModule: Selection;
    /**
     * The `showHider` is used to manipulate column's show/hide operation in the Grid.
     *
     * @default ''
     */
    @Property ()
    public showHider: ShowHide;
    /**
     * The `searchModule` is used to manipulate searching in the Grid.
     */
    public searchModule: Search;
    /**
     * The `scrollModule` is used to manipulate scrolling in the Grid.
     */
    public scrollModule: Scroll;
    /**
     * The `infiniteScrollModule` is used to manipulate infinite scrolling in the Grid.
     */
    public infiniteScrollModule: InfiniteScroll;
    /**
     * The `reorderModule` is used to manipulate reordering in the Grid.
     */
    public reorderModule: Reorder;
    /**
     * `resizeModule` is used to manipulate resizing in the Grid.
     *
     * @hidden
     */
    public resizeModule: Resize;
    /**
     * The `groupModule` is used to manipulate grouping behavior in the Grid.
     */
    public groupModule: Group;
    /**
     * The `printModule` is used to handle the printing feature of the Grid.
     */
    public printModule: Print;
    /**
     * The `excelExportModule` is used to handle Excel exporting feature in the Grid.
     */
    public excelExportModule: ExcelExport;
    /**
     * The `pdfExportModule` is used to handle PDF exporting feature in the Grid.
     */
    public pdfExportModule: PdfExport;

    /**
     * `detailRowModule` is used to handle detail rows rendering in the Grid.
     *
     * @hidden
     */
    public detailRowModule: DetailRow;

    /**
     * The `toolbarModule` is used to manipulate ToolBar items and its action in the Grid.
     */
    public toolbarModule: Toolbar;

    /**
     * The `contextMenuModule` is used to handle context menu items and its action in the Grid.
     */
    public contextMenuModule: ContextMenu;

    /**
     * The `columnMenuModule` is used to manipulate column menu items and its action in the Grid.
     */
    public columnMenuModule: ColumnMenu;

    /**
     * The `editModule` is used to handle Grid content manipulation.
     */
    public editModule: Edit;

    /**
     * `clipboardModule` is used to handle Grid copy action.
     */
    public clipboardModule: Clipboard;


    /**
     * `columnchooserModule` is used to dynamically show or hide the Grid columns.
     *
     * @hidden
     */
    public columnChooserModule: ColumnChooser;

    /**
     * The `aggregateModule` is used to manipulate aggregate functionality in the Grid.
     *
     * @hidden
     */
    public aggregateModule: Aggregate;

    private loggerModule: ILogger;
    private enableLogger: boolean = false;
    /** @hidden */
    public focusModule: FocusStrategy;

    // Change the target of the adaptive dialogs
    public adaptiveDlgTarget: HTMLElement;

    protected needsID: boolean = true;

    //Grid Options

    /**
     * Defines the schema of dataSource.
     * If the `columns` declaration is empty or undefined then the `columns` are automatically generated from data source.
     * {% codeBlock src='grid/columns/index.md' %}{% endcodeBlock %}
     *
     * @default []
     */
    @Property([])
    public columns: Column[] | string[] | ColumnModel[];

    /**
     * If `enableAltRow` is set to true, the grid will render with `e-altrow` CSS class to the alternative tr elements.
     * > Check the [`AltRow`](../../grid/row/#styling-alternate-rows/) to customize the styles of alternative rows.
     * {% codeBlock src='grid/enableAltRow/index.md' %}{% endcodeBlock %}
     *
     * @default true
     */
    @Property(true)
    public enableAltRow: boolean;

    /**
     * If `enableHover` is set to true, the row hover is enabled in the Grid.
     * {% codeBlock src='grid/enableHover/index.md' %}{% endcodeBlock %}
     *
     * @default true
     */
    @Property(true)
    public enableHover: boolean;

    /**
     * If `enableAutoFill` is set to true, then the auto fill icon will displayed on cell selection for copy cells.
     * It requires the selection `mode` to be Cell and `cellSelectionMode` to be `Box`.
     * {% codeBlock src='grid/enableAutoFill/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    @Property(false)
    public enableAutoFill: boolean;

    /**
     * Enables or disables the key board interaction of Grid.
     *
     * @default true
     */
    @Property(true)
    public allowKeyboard: boolean;

    /**
     * If 'enableStickyHeader' set to true, then the user can able to make the column headers visible when the document is scrolled.
     *
     * @default false
     */
    @Property(false)
    public enableStickyHeader: boolean;


    /**
     * Specifies whether to display or remove the untrusted HTML values in the Grid component.
     * If 'enableHtmlSanitizer' set to true, the component will sanitize any suspected untrusted strings and scripts before rendering them.
     *
     * @default false
     */
    @Property(false)
    public enableHtmlSanitizer: boolean;

    /**
     * If `allowTextWrap` set to true,
     * then text content will wrap to the next line when its text content exceeds the width of the Column Cells.
     * {% codeBlock src='grid/allowTextWrap/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    @Property(false)
    public allowTextWrap: boolean;

    /**
     * Configures the text wrap in the Grid.
     * {% codeBlock src='grid/textWrapSettings/index.md' %}{% endcodeBlock %}
     *
     * @default {wrapMode:"Both"}
     */
    @Complex<TextWrapSettingsModel>({}, TextWrapSettings)
    public textWrapSettings: TextWrapSettingsModel;

    /**
     * Defines the resizing behavior of the Grid.
     *
     * @default {mode:"Normal"}
     */
    @Complex<ResizeSettingsModel>({}, ResizeSettings)
    public resizeSettings: ResizeSettingsModel;

    /**
     * If `allowPaging` is set to true, the pager renders at the footer of the Grid. It is used to handle page navigation in the Grid.
     *
     * > Check the [`Paging`](../../grid/paging/) to configure the grid pager.
     * {% codeBlock src='grid/allowPaging/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    @Property(false)
    public allowPaging: boolean;

    /**
     * Configures the pager in the Grid.
     * {% codeBlock src='grid/pageSettings/index.md' %}{% endcodeBlock %}
     *
     * @default {currentPage: 1, pageSize: 12, pageCount: 8, enableQueryString: false, pageSizes: false, template: null}
     */
    @Complex<PageSettingsModel>({}, PageSettings)
    public pageSettings: PageSettingsModel;

    /**
     * Configures the Loading Indicator of the Grid.
     *
     * @default {indicatorType: 'Spinner'}
     */
    @Complex<LoadingIndicatorModel>({}, LoadingIndicator)
    public loadingIndicator: LoadingIndicatorModel;

    /**
     * Specifies the shimmer effect for Grid virtual and infinite scrolling.
     *
     * @default true
     */
    @Property(true)
    public enableVirtualMaskRow: boolean;

    /**
     * If `enableVirtualization` set to true, then the Grid will render only the rows visible within the view-port
     * and load subsequent rows on vertical scrolling. This helps to load large dataset in Grid.
     * {% codeBlock src='grid/enableVirtualization/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    @Property(false)
    public enableVirtualization: boolean;

    /**
     * If `enableColumnVirtualization` set to true, then the Grid will render only the columns visible within the view-port
     * and load subsequent columns on horizontal scrolling. This helps to load large dataset of columns in Grid.
     * {% codeBlock src='grid/enableColumnVirtualization/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    @Property(false)
    public enableColumnVirtualization: boolean;

    /**
     * If `enableInfiniteScrolling` set to true, then the data will be loaded in Grid when the scrollbar reaches the end.
     * This helps to load large dataset in Grid.
     * {% codeBlock src='grid/enableInfiniteScrolling/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    @Property(false)
    public enableInfiniteScrolling: boolean;

    /**
     * Configures the search behavior in the Grid.
     * {% codeBlock src='grid/searchSettings/index.md' %}{% endcodeBlock %}
     *
     * @default { ignoreCase: true, fields: [], operator: 'contains', key: '' }
     */
    @Complex<SearchSettingsModel>({}, SearchSettings)
    public searchSettings: SearchSettingsModel;

    /**
     * If `allowSorting` is set to true, it allows sorting of grid records when column header is clicked.
     *
     * > Check the [`Sorting`](../../grid/sorting/) to customize its default behavior.
     * {% codeBlock src='grid/allowSorting/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    @Property(false)
    public allowSorting: boolean;

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
    @Property('Ellipsis')
    public clipMode: ClipMode;

    /**
     * If `allowMultiSorting` set to true, then it will allow the user to sort multiple column in the grid.
     * > `allowSorting` should be true.
     * {% codeBlock src='grid/allowMultiSorting/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    @Property(true)
    public allowMultiSorting: boolean;

    /**
     * If `allowExcelExport` set to true, then it will allow the user to export grid to Excel file.
     *
     * > Check the [`ExcelExport`](../../grid/excel-exporting/) to configure exporting document.
     * {% codeBlock src='grid/allowExcelExport/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    @Property(false)
    public allowExcelExport: boolean;
    /**
     * If `allowPdfExport` set to true, then it will allow the user to export grid to Pdf file.
     *
     * > Check the [`Pdfexport`](../../grid/pdf-export/) to configure the exporting document.
     * {% codeBlock src='grid/allowPdfExport/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    @Property(false)
    public allowPdfExport: boolean;
    /**
     * Configures the sort settings.
     * {% codeBlock src='grid/sortSettings/index.md' %}{% endcodeBlock %}
     *
     * @default {columns:[]}
     */
    @Complex<SortSettingsModel>({}, SortSettings)
    public sortSettings: SortSettingsModel;

    /**
     * Configures the infinite scroll settings.
     * {% codeBlock src='grid/infiniteScrollSettings/index.md' %}{% endcodeBlock %}
     *
     * @default { enableCache: false, maxBlocks: 5, initialBlocks: 5 }
     */
    @Complex<InfiniteScrollSettingsModel>({}, InfiniteScrollSettings)
    public infiniteScrollSettings: InfiniteScrollSettingsModel;

    /**
     * If `allowSelection` is set to true, it allows selection of (highlight row) Grid records by clicking it.
     * {% codeBlock src='grid/allowSelection/index.md' %}{% endcodeBlock %}
     *
     * @default true
     */
    @Property(true)
    public allowSelection: boolean;

    /**
     * The `selectedRowIndex` allows you to select a row at initial rendering.
     * You can also get the currently selected row index.
     * {% codeBlock src='grid/selectedRowIndex/index.md' %}{% endcodeBlock %}
     *
     * @default -1
     */
    @Property(-1)
    public selectedRowIndex: number;

    /**
     * Configures the selection settings.
     * {% codeBlock src='grid/selectionSettings/index.md' %}{% endcodeBlock %}
     *
     * @default {mode: 'Row', cellSelectionMode: 'Flow', type: 'Single'}
     */
    @Complex<SelectionSettingsModel>({}, SelectionSettings)
    public selectionSettings: SelectionSettingsModel;

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
    @Property(false)
    public allowFiltering: boolean;

    /**
     * Defines the grid row elements rendering direction. The available directions are,
     * * `Horizontal`: Renders the grid row elements in the horizontal direction
     * * `Vertical`: Renders the grid row elements in the vertical direction
     *
     * @default Horizontal
     */
    @Property('Horizontal')
    public rowRenderingMode: RowRenderingDirection;

    /**
     * If `enableAdaptiveUI` set to true the grid filter, sort, and edit dialogs render adaptively.
     *
     * @default false
     */
    @Property(false)
    public enableAdaptiveUI: boolean;

    /**
     * One of the adaptiveUIMode enumeration that specifies the Adaptive Mode. The default value is Both.
     *
     * @default Both
     */
    @Property('Both')
    public adaptiveUIMode: AdaptiveMode;

    /**
     * If `allowReordering` is set to true, Grid columns can be reordered.
     * Reordering can be done by drag and drop of a particular column from one index to another index.
     * > If Grid is rendered with stacked headers, reordering is allowed only at the same level as the column headers.
     * {% codeBlock src='grid/allowReordering/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    @Property(false)
    public allowReordering: boolean;

    /**
     * Enables or disables row spanning for adjacent cells with similar data.
     * When enabled, the grid merges adjacent cells with identical data between rows into a single cell, spanning multiple rows to improve readability.
     * {% codeBlock src='grid/enableRowSpan/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    @Property(false)
    public enableRowSpan: boolean;

    /**
     * Enables or disables column spanning for adjacent cells with similar data.
     * When enabled, the grid merges adjacent cells with identical data between columns into a single cell, spanning multiple columns to enhance data presentation.
     * {% codeBlock src='grid/enableColumnSpan/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    @Property(false)
    public enableColumnSpan: boolean;

    /**
     * If `allowResizing` is set to true, Grid columns can be resized.
     * {% codeBlock src='grid/allowResizing/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    @Property(false)
    public allowResizing: boolean;

    /**
     * If `allowRowDragAndDrop` is set to true, you can drag and drop grid rows at another grid.
     * {% codeBlock src='grid/allowRowDragAndDrop/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    @Property(false)
    public allowRowDragAndDrop: boolean;

    /**
     * Configures the row drop settings.
     *
     * @default {targetID: ''}
     */
    @Complex<RowDropSettingsModel>({}, RowDropSettings)
    public rowDropSettings: RowDropSettingsModel;

    /**
     * Configures the filter settings of the Grid.
     * {% codeBlock src='grid/filterSettings/index.md' %}{% endcodeBlock %}
     *
     * @default {columns: [], type: 'FilterBar', mode: 'Immediate', showFilterBarStatus: true, immediateModeDelay: 1500 , operators: {}}
     */
    @Complex<FilterSettingsModel>({}, FilterSettings)
    public filterSettings: FilterSettingsModel;

    /**
     * If `allowGrouping` set to true, then it will allow the user to dynamically group or ungroup columns.
     * Grouping can be done by drag and drop columns from column header to group drop area.
     *
     * > Check the [`Grouping`](../../grid/grouping/) to customize its default behavior.
     * {% codeBlock src='grid/allowGrouping/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    @Property(false)
    public allowGrouping: boolean;

    /**
     * If `enableImmutableMode`  is set to true, the grid will reuse old rows if it exists in the new result instead of
     * full refresh while performing the grid actions.
     *
     * @default false
     */
    @Property(false)
    public enableImmutableMode: boolean;

    /**
     * If `showColumnMenu` set to true, then it will enable the column menu options in each columns.
     *
     * > Check the [`Column menu`](../../grid/columns/#column-menu/) for its configuration.
     * {% codeBlock src='grid/showColumnMenu/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    @Property(false)
    public showColumnMenu: boolean;

    /**
     * If `autoFit` set to true, then it will auto fit the columns based on given width.
     *
     * @default false
     */
    @Property(false)
    public autoFit: boolean;

    /**
     * Configures the group settings.
     * {% codeBlock src='grid/groupSettings/index.md' %}{% endcodeBlock %}
     *
     * @default {showDropArea: true, showToggleButton: false, showGroupedColumn: false, showUngroupButton: true, columns: []}
     */
    @Complex<GroupSettingsModel>({}, GroupSettings)
    public groupSettings: GroupSettingsModel;

    /**
     * Configures the edit settings.
     * {% codeBlock src='grid/editSettings/index.md' %}{% endcodeBlock %}
     *
     * @default { allowAdding: false, allowEditing: false, allowDeleting: false, mode:'Normal',
     * allowEditOnDblClick: true, showConfirmDialog: true, showDeleteConfirmDialog: false }
     */
    @Complex<EditSettingsModel>({}, EditSettings)
    public editSettings: EditSettingsModel;

    /**
     * Configures the Grid aggregate rows.
     * {% codeBlock src='grid/aggregates/index.md' %}{% endcodeBlock %}
     * > Check the [`Aggregates`](../../grid/aggregates/) for its configuration.
     *
     * @default []
     */
    @Collection<AggregateRowModel>([], AggregateRow)
    public aggregates: AggregateRowModel[];

    /**
     * If `showColumnChooser` is set to true, it allows you to dynamically show or hide columns.
     *
     * > Check the [`ColumnChooser`](../../grid/columns/#column-chooser/) for its configuration.
     * {% codeBlock src='grid/showColumnChooser/index.md' %}{% endcodeBlock %}
     *
     * @default false
     */
    @Property(false)
    public showColumnChooser: boolean;
    /**
     * Configures the column chooser in the Grid.
     *
     * @default { columnChooserOperator: 'startsWith' }
     */
    @Complex<ColumnChooserSettingsModel>({}, ColumnChooserSettings)
    public columnChooserSettings: ColumnChooserSettingsModel;

    /**
     * If `enableHeaderFocus` set to true, then header element will be focused when focus moves to grid.
     *
     * @default false
     */
    @Property(false)
    public enableHeaderFocus: boolean;

    /**
     * Defines the scrollable height of the grid content.
     * {% codeBlock src='grid/height/index.md' %}{% endcodeBlock %}
     *
     * @default 'auto'
     */
    @Property('auto')
    public height: string | number;

    /**
     * Defines the Grid width.
     * {% codeBlock src='grid/width/index.md' %}{% endcodeBlock %}
     *
     * @default 'auto'
     */
    @Property('auto')
    public width: string | number;

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
    @Property('Default')
    public gridLines: GridLine;

    /**
     * The row template that renders customized rows from the given template.
     * By default, Grid renders a table row for every data source item.
     * > * It accepts either [template string](../../common/template-engine/) or HTML element ID.
     * > * The row template must be a table row.
     *
     * > Check the [`Row Template`](../../grid/row/) customization.
     *
     * @default null
     * @aspType string
     */
    @Property()
    public rowTemplate: string | Function;

    /**
     * The empty record template that renders customized element or text or image instead of displaying the empty record message in the grid.
     * > It accepts either the [template string](../../common/template-engine/) or the HTML element ID.
     *
     * @default null
     * @aspType string
     */
    @Property()
    public emptyRecordTemplate: string | Function;

    /**
     * The detail template allows you to show or hide additional information about a particular row.
     *
     * > It accepts either the [template string](../../common/template-engine/) or the HTML element ID.
     *
     * {% codeBlock src="grid/detail-template-api/index.ts" %}{% endcodeBlock %}
     *
     * @default null
     * @aspType string
     */
    @Property()
    public detailTemplate: string | Function;

    /**
     * Defines Grid options to render child Grid.
     * It requires the [`queryString`](./#querystring) for parent
     * and child relationship.
     *
     * > Check the [`Child Grid`](../../grid/hierarchy-grid/) for its configuration.
     *
     * @default ''
     *
     */
    @Property()
    public childGrid: GridModel;

    /**
     * Defines the relationship between parent and child datasource. It acts as the foreign key for parent datasource.
     *
     * @default ''
     */
    @Property()
    public queryString: string;

    /**
     * Defines the print modes. The available print modes are
     * * `AllPages`: Prints all pages of the Grid.
     * * `CurrentPage`: Prints the current page of the Grid.
     * {% codeBlock src='grid/printMode/index.md' %}{% endcodeBlock %}
     *
     * @default AllPages
     */
    @Property('AllPages')
    public printMode: PrintMode;

    /**
     * Defines the hierarchy grid print modes. The available modes are
     * * `Expanded` - Prints the master grid with expanded child grids.
     * * `All` - Prints the master grid with all the child grids.
     * * `None` - Prints the master grid alone.
     *
     * @default Expanded
     */
    @Property('Expanded')
    public hierarchyPrintMode: HierarchyGridPrintMode;

    /**
     * It is used to render grid table rows.
     * If the `dataSource` is an array of JavaScript objects,
     * then Grid will create instance of [`DataManager`](https://ej2.syncfusion.com/documentation/api/data/dataManager/)
     * from this `dataSource`.
     * If the `dataSource` is an existing [`DataManager`](https://ej2.syncfusion.com/documentation/api/data/dataManager/),
     *  the Grid will not initialize a new one.
     *
     * > Check the available [`Adaptors`](https://ej2.syncfusion.com/documentation/data/adaptors) to customize the data operation.
     * {% codeBlock src='grid/dataSource/index.md' %}{% endcodeBlock %}
     *
     * @default []
     * @isGenericType true
     */
    @Property([])
    public dataSource: Object | DataManager | DataResult;

    /**
     * Defines the height of Grid rows.
     * {% codeBlock src='grid/rowHeight/index.md' %}{% endcodeBlock %}
     *
     * @default null
     */
    @Property(null)
    public rowHeight: number;

    /**
     * Defines the external [`Query`](https://ej2.syncfusion.com/documentation/data/api-query.html)
     * that will be executed along with data processing.
     * {% codeBlock src='grid/query/index.md' %}{% endcodeBlock %}
     *
     * @default null
     */
    @Property()
    public query: Query;

    /**
     * Defines the currencyCode format of the Grid columns
     *
     * @private
     */
    @Property('USD')
    private currencyCode: string;

    /**
     * Defines the id of the grids that needs to be exported
     *
     * @default null
     */
    @Property()
    public exportGrids: string[];

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
    @Property()
    public toolbar: (ToolbarItems | string | ItemModel | ToolbarItem)[];

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
    @Property()
    public contextMenuItems: ContextMenuItem[] | ContextMenuItemModel[];

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
    @Property()
    public columnMenuItems: ColumnMenuItem[] | ColumnMenuItemModel[];

    /**
     * It used to render toolbar template
     *
     * @default null
     * @aspType string
     */
    @Property()
    public toolbarTemplate: string | Function;

    /**
     * It used to render pager template
     *
     * @default null
     * @aspType string
     */
    @Property()
    public pagerTemplate: string | Function;

    /**
     * Gets or sets the number of frozen rows.
     * {% codeBlock src='grid/frozenRows/index.md' %}{% endcodeBlock %}
     *
     * @default 0
     */
    @Property(0)
    public frozenRows: number;

    /**
     * Gets or sets the number of frozen columns.
     * {% codeBlock src='grid/frozenColumns/index.md' %}{% endcodeBlock %}
     *
     * @default 0
     */
    @Property(0)
    public frozenColumns: number;

    /**
     * Defines the own class for the grid element.
     *
     * @default ''
     */
    @Property('')
    public cssClass: string;

    /**
     * `columnQueryMode`provides options to retrive data from the datasource.Their types are
     * * `All`: It Retrives whole datasource.
     * * `Schema`: Retrives data for all the defined columns in grid from the datasource.
     * * `ExcludeHidden`: Retrives data only for visible columns of grid from the dataSource.
     *
     * @default All
     */
    @Property('All')
    public columnQueryMode: ColumnQueryModeType;

    /**
     * Gets or sets the current action details.
     *
     * @default {}
     */
    @Property({})
    public currentAction: ActionArgs;

    /**
     * Defines the version for Grid persistence.
     *
     * @default ''
     */
    @Property('')
    public ej2StatePersistenceVersion: string;

    /**
     * Determines whether a row can be selected.
     * When not set, all rows are considered selectable.
     * @default null
     * @example
     * const grid = new Grid({
     *   dataSource: data,
     *   columns: [
     *     { field: 'OrderID', type: 'number' },
     *     { field: 'Status', type: 'string' }
     *   ],
     *   isRowSelectable: function(data, columns) {
     *     // prevent selection for locked rows
     *     return data['Status'] !== 'Locked';
     *   }
     * });
     */
    @Property(null)
    public isRowSelectable: RowSelectable | string;

    /**
     * Determines if a row should be pinned at the top. When not set, no rows are pinned.
     * Pinned rows remain visible across paging, scrolling and other data actions.
     * @default null
     * @example
     * const grid = new Grid({
     *   dataSource: data,
     *   columns: [
     *     { field: 'OrderID', isPrimaryKey: true },
     *     { field: 'Status' }
     *   ],
     *   isRowPinned: function(data, columns) {
     *     // Allows the rows to make frozen
     *     return data['Status'] === 'In Queue';
     *   }
     * });
     */
    @Event()
    public isRowPinned: PinRow | Function;

    /**
     * Triggers when the component is created.
     *
     * @event created
     */
    @Event()
    public created: EmitType<Object>;
    /**
     * Triggers when the component is destroyed.
     *
     * @event destroyed
     */
    @Event()
    public destroyed: EmitType<Object>;

    /**
     * This event allows customization of Grid properties before rendering.
     *
     * @event load
     */
    @Event()
    public load: EmitType<Object>;
    /**
     * Triggered every time a request is made to access row information, element, or data.
     * This will be triggered before the row element is appended to the Grid element.
     *
     * @event rowDataBound
     */
    @Event()
    public rowDataBound: EmitType<RowDataBoundEventArgs>;

    /**
     * Triggered every time a request is made to access cell information, element, or data.
     * This will be triggered before the cell element is appended to the Grid element.
     *
     * @event queryCellInfo
     */
    @Event()
    public queryCellInfo: EmitType<QueryCellInfoEventArgs>;

    /**
     * Triggered for stacked header.
     *
     * @event headerCellInfo
     */
    @Event()
    public headerCellInfo: EmitType<HeaderCellInfoEventArgs>;

    /* eslint-disable */
    /**
     * Triggers when Grid actions such as sorting, filtering, paging, grouping etc., starts.
     * 
     * {% codeBlock src='grid/actionBegin/index.md' %}{% endcodeBlock %}
     *
     * @event actionBegin
     */
    @Event()
    public actionBegin: EmitType<PageEventArgs | GroupEventArgs | FilterEventArgs | SearchEventArgs | SortEventArgs | AddEventArgs | SaveEventArgs | EditEventArgs | DeleteEventArgs | ActionEventArgs | NotifyArgs | ReorderEventArgs>;

    /**
     * Triggers when Grid actions such as sorting, filtering, paging, grouping etc. are completed.
     *
     * @event actionComplete
     */
    @Event()
    public actionComplete: EmitType<PageEventArgs | GroupEventArgs | FilterEventArgs | SearchEventArgs | SortEventArgs | AddEventArgs | SaveEventArgs | EditEventArgs | DeleteEventArgs | ActionEventArgs | NotifyArgs | ReorderEventArgs>;
    /* eslint-enable */

    /**
     * Triggers when any Grid action failed to achieve the desired results.
     *
     * @event actionFailure
     */
    @Event()
    public actionFailure: EmitType<FailureEventArgs>;

    /**
     * Triggers when data source is populated in the Grid.
     *
     * @event dataBound
     */
    @Event()
    public dataBound: EmitType<Object>;

    /**
     * Triggers when record is double clicked.
     *
     * @event recordDoubleClick
     */
    @Event()
    public recordDoubleClick: EmitType<RecordDoubleClickEventArgs>;

    /**
     * Triggers when record is clicked.
     *
     * @event recordClick
     */
    @Event()
    public recordClick: EmitType<RecordClickEventArgs>;

    /**
     * Triggers before row selection occurs.
     *
     * @event rowSelecting
     */
    @Event()
    public rowSelecting: EmitType<RowSelectingEventArgs>;

    /**
     * Triggers after a row is selected.
     *
     * @event rowSelected
     */
    @Event()
    public rowSelected: EmitType<RowSelectEventArgs>;

    /**
     * Triggers before deselecting the selected row.
     *
     * @event rowDeselecting
     */
    @Event()
    public rowDeselecting: EmitType<RowDeselectingEventArgs>;

    /**
     * Triggers when a selected row is deselected.
     *
     * @event rowDeselected
     */
    @Event()
    public rowDeselected: EmitType<RowDeselectEventArgs>;

    /**
     * Triggers before any cell selection occurs.
     *
     * @event cellSelecting
     */
    @Event()
    public cellSelecting: EmitType<CellSelectingEventArgs>;

    /**
     * Triggers after a cell is selected.
     *
     * @event cellSelected
     */
    @Event()
    public cellSelected: EmitType<CellSelectEventArgs>;

    /**
     * Triggers before the selected cell is deselecting.
     *
     * @event cellDeselecting
     */
    @Event()
    public cellDeselecting: EmitType<CellDeselectEventArgs>;

    /**
     * Triggers when a particular selected cell is deselected.
     *
     * @event cellDeselected
     */
    @Event()
    public cellDeselected: EmitType<CellDeselectEventArgs>;

    /**
     * Triggers before column selection occurs.
     *
     * @event columnSelecting
     */
    @Event()
    public columnSelecting: EmitType<ColumnSelectingEventArgs>;

    /**
     * Triggers after a column is selected.
     *
     * @event columnSelected
     */
    @Event()
    public columnSelected: EmitType<ColumnSelectEventArgs>;

    /**
     * Triggers before deselecting the selected column.
     *
     * @event columnDeselecting
     */
    @Event()
    public columnDeselecting: EmitType<ColumnDeselectEventArgs>;

    /**
     * Triggers when a selected column is deselected.
     *
     * @event columnDeselected
     */
    @Event()
    public columnDeselected: EmitType<ColumnDeselectEventArgs>;

    /**
     * Triggers when column header element drag (move) starts.
     *
     * @event columnDragStart
     */
    @Event()
    public columnDragStart: EmitType<ColumnDragEventArgs>;

    /**
     * Triggers when column header element is dragged (moved) continuously.
     *
     * @event columnDrag
     */
    @Event()
    public columnDrag: EmitType<ColumnDragEventArgs>;

    /**
     * Triggers when a column header element is dropped on the target column.
     *
     * @event columnDrop
     */
    @Event()
    public columnDrop: EmitType<ColumnDragEventArgs>;

    /**
     * Triggers after print action is completed.
     *
     * @event printComplete
     */
    @Event()
    public printComplete: EmitType<PrintEventArgs>;

    /**
     * Triggers before the print action starts.
     *
     * @event beforePrint
     */
    @Event()
    public beforePrint: EmitType<PrintEventArgs>;

    /**
     * Triggers before exporting each cell to PDF document. You can also customize the PDF cells.
     *
     * @event pdfQueryCellInfo
     */
    @Event()
    public pdfQueryCellInfo: EmitType<PdfQueryCellInfoEventArgs>;

    /**
     * Triggers before exporting each header cell to PDF document. You can also customize the PDF cells.
     *
     * @event pdfHeaderQueryCellInfo
     */
    @Event()
    public pdfHeaderQueryCellInfo: EmitType<PdfHeaderQueryCellInfoEventArgs>;

    /**
     * Triggers before exporting aggregate cell to PDF document. You can also customize the PDF cells.
     *
     * @event pdfAggregateQueryCellInfo
     */
    @Event()
    public pdfAggregateQueryCellInfo: EmitType<AggregateQueryCellInfoEventArgs>;

    /**
     * Triggers before exporting aggregate cell to Excel document. You can also customize the PDF cells.
     *
     * @event excelAggregateQueryCellInfo
     */
    @Event()
    public excelAggregateQueryCellInfo: EmitType<AggregateQueryCellInfoEventArgs>;

    /**
     * Triggers before exporting each detail Grid to PDF document.
     *
     * @event exportDetailDataBound
     */
    @Event()
    public exportDetailDataBound: EmitType<ExportDetailDataBoundEventArgs>;

    /**
     * Triggers before exporting each detail template.
     *
     * @event exportDetailTemplate
     */
    @Event()
    public exportDetailTemplate: EmitType<ExportDetailTemplateEventArgs>;

    /**
     * Triggers before exporting each cell to Excel file.
     * You can also customize the Excel cells.
     *
     * @event excelQueryCellInfo
     */
    @Event()
    public excelQueryCellInfo: EmitType<ExcelQueryCellInfoEventArgs>;

    /**
     * Triggers before exporting each header cell to Excel file.
     * You can also customize the Excel cells.
     *
     * @event excelHeaderQueryCellInfo
     */
    @Event()
    public excelHeaderQueryCellInfo: EmitType<ExcelHeaderQueryCellInfoEventArgs>;

    /**
     * Triggers before Grid data is exported to Excel file.
     *
     * @event beforeExcelExport
     */
    @Event()
    public beforeExcelExport: EmitType<Object>;

    /**
     * Triggers after Grid data is exported to Excel file.
     *
     * @event excelExportComplete
     */
    @Event()
    public excelExportComplete: EmitType<ExcelExportCompleteArgs>;

    /**
     * Triggers before Grid data is exported to PDF document.
     *
     * @event beforePdfExport
     */
    @Event()
    public beforePdfExport: EmitType<Object>;

    /**
     * Triggers after Grid data is exported to PDF document.
     *
     * @event pdfExportComplete
     */
    @Event()
    public pdfExportComplete: EmitType<PdfExportCompleteArgs>;

    /**
     * Triggers when row element's before drag(move).
     *
     * @event rowDragStartHelper
     */
    @Event()
    public rowDragStartHelper: EmitType<RowDragEventArgs>;

    /**
     * Triggers after detail row expands.
     * > This event triggers at initial expand.
     *
     * @event detailDataBound
     */
    @Event()
    public detailDataBound: EmitType<DetailDataBoundEventArgs>;

    /**
     * Triggers before expanding the detail row.
     * This event allows to perform customize actions or cancel the expansion of the detail row.
     * @event detailExpand
     */
    @Event()
    public detailExpand: EmitType<DetailExpandCollapseArgs>;

    /**
     * Triggers before collapsing the detail row.
     * This event allows to perform customize actions or cancel the collapse of the detail row.
     * @event detailCollapse
     */
    @Event()
    public detailCollapse: EmitType<DetailExpandCollapseArgs>;


    /**
     * Triggers when row element's drag(move) starts.
     *
     * @event rowDragStart
     */
    @Event()
    public rowDragStart: EmitType<RowDragEventArgs>;

    /**
     * Triggers when row elements are dragged (moved) continuously.
     *
     * @event rowDrag
     */
    @Event()
    public rowDrag: EmitType<RowDragEventArgs>;

    /**
     * Triggers when row elements are dropped on the target row.
     *
     * @event rowDrop
     */
    @Event()
    public rowDrop: EmitType<RowDragEventArgs>;

    /**
     * Triggers when toolbar item is clicked.
     *
     * @event toolbarClick
     */
    @Event()
    public toolbarClick: EmitType<ClickEventArgs>;

    /**
     * Triggers before the columnChooser open.
     *
     * @event beforeOpenColumnChooser
     */
    @Event()
    public beforeOpenColumnChooser: EmitType<ColumnChooserEventArgs>;

    /**
     * Triggers before adaptive filter and sort dialogs open.
     *
     * @event beforeOpenAdaptiveDialog
     */
    @Event()
    public beforeOpenAdaptiveDialog: EmitType<AdaptiveDialogEventArgs>;

    /**
     * Triggers when records are added in batch mode.
     *
     * @event batchAdd
     */
    @Event()
    public batchAdd: EmitType<BatchAddArgs>;

    /**
     * Triggers when records are deleted in batch mode.
     *
     * @event batchDelete
     */
    @Event()
    public batchDelete: EmitType<BatchDeleteArgs>;

    /**
     * Triggers when cancel the batch edit changes batch mode.
     *
     * @event batchCancel
     */
    @Event()
    public batchCancel: EmitType<BatchCancelArgs>;

    /**
     * Triggers before records are added in batch mode.
     *
     * @event beforeBatchAdd
     */
    @Event()
    public beforeBatchAdd: EmitType<BeforeBatchAddArgs>;

    /**
     * Triggers before records are deleted in batch mode.
     *
     * @event beforeBatchDelete
     */
    @Event()
    public beforeBatchDelete: EmitType<BeforeBatchDeleteArgs>;

    /**
     * Triggers before records are saved in batch mode.
     *
     * @event beforeBatchSave
     */
    @Event()
    public beforeBatchSave: EmitType<BeforeBatchSaveArgs>;

    /**
     * Triggers before the record is to be edit.
     *
     * @event beginEdit
     */
    @Event()
    public beginEdit: EmitType<BeginEditArgs>;

    /**
     * Triggers when command button is clicked.
     *
     * @event commandClick
     */
    @Event()
    public commandClick: EmitType<CommandClickEventArgs>;

    /**
     * Triggers when the cell is being edited.
     *
     * @event cellEdit
     */
    @Event()
    public cellEdit: EmitType<CellEditArgs>;

    /**
     * Triggers when the cell is being saved.
     *
     * @event cellSave
     */
    @Event()
    public cellSave: EmitType<CellSaveArgs>;

    /**
     * Triggers after the cell is saved.
     *
     * @event cellSaved
     */
    @Event()
    public cellSaved: EmitType<CellSaveArgs>;

    /**
     * Triggers when column resize starts.
     *
     * @event resizeStart
     */
    @Event()
    public resizeStart: EmitType<ResizeArgs>;

    /**
     * Triggers on column resizing.
     *
     * @event resizing
     */
    @Event()
    public resizing: EmitType<ResizeArgs>;

    /**
     * Triggers when column resize ends.
     *
     * @event resizeStop
     */
    @Event()
    public resizeStop: EmitType<ResizeArgs>;

    /**
     * Triggers when any keyboard keys are pressed inside the grid.
     *
     * @event keyPressed
     */
    @Event()
    public keyPressed: EmitType<KeyboardEventArgs>;

    /**
     * Triggers before data is bound to Grid.
     *
     * @event beforeDataBound
     */
    @Event()
    public beforeDataBound: EmitType<BeforeDataBoundArgs>;

    /**
     * Triggers before context menu opens.
     *
     * @event contextMenuOpen
     */
    @Event()
    public contextMenuOpen: EmitType<ContextMenuOpenEventArgs>;

    /**
     * Triggers when click on context menu.
     *
     * @event contextMenuClick
     */
    @Event()
    public contextMenuClick: EmitType<ContextMenuClickEventArgs>;

    /**
     * Triggers before the context menu closes.
     *
     * This event allows you to perform custom actions or cancel the closing of the context menu.
     *
     * @event contextMenuClose
     */
    @Event()
    public contextMenuClose: EmitType<ContextMenuOpenEventArgs>;

    /**
     * Triggers before column menu opens.
     *
     * @event columnMenuOpen
     */
    @Event()
    public columnMenuOpen: EmitType<ColumnMenuOpenEventArgs>;

    /**
     * Triggers when click on column menu.
     *
     * @event columnMenuClick
     */
    @Event()
    public columnMenuClick: EmitType<MenuEventArgs>;

    /**
     * Triggers before the column menu closes.
     *
     * This event allows you to perform custom actions or cancel the closing of the column menu.
     *
     * @event columnMenuClose
     */
    @Event()
    public columnMenuClose: EmitType<ColumnMenuOpenEventArgs>;

    /**
     * Triggers when the check box state change in checkbox column.
     *
     * @event checkBoxChange
     */
    @Event()
    public checkBoxChange: EmitType<CheckBoxChangeEventArgs>;

    /**
     * Triggers before Grid copy action.
     *
     * @event beforeCopy
     */
    @Event()
    public beforeCopy: EmitType<BeforeCopyEventArgs>;

    /**
     * Triggers before Grid paste action.
     *
     * @event beforePaste
     */
    @Event()
    public beforePaste: EmitType<BeforePasteEventArgs>;

    /**
     * Triggers before Grid autoFill action.
     *
     * @event beforeAutoFill
     */
    @Event()
    public beforeAutoFill: EmitType<BeforeAutoFillEventArgs>;

    /**
     * Triggers when the grid actions such as Sorting, Paging, Grouping etc., are done to get column `dataSource`.
     * In this event,the current view column data and total record count should be assigned to the column `dataSource` based
     * on the action performed.
     *
     * @event columnDataStateChange
     */
    @Event()
    public columnDataStateChange: EmitType<ColumnDataStateChangeEventArgs>;

    /**
     * Triggers when the grid actions such as Sorting, Paging, Grouping etc., are done.
     * In this event,the current view data and total record count should be assigned to the `dataSource` based on the action performed.
     *
     * @event dataStateChange
     */
    @Event()
    public dataStateChange: EmitType<DataStateChangeEventArgs>;

    /**
     * Triggers when the grid data is added, deleted and updated.
     * Invoke the done method from the argument to start render after edit operation.
     *
     * @event dataSourceChanged
     */
    @Event()
    public dataSourceChanged: EmitType<DataSourceChangedEventArgs>;

    /**
     * Triggers before exporting each caption row to PDF/Excel/CSV document. You can also customize the export caption row values.
     *
     * @event exportGroupCaption
     */
    @Event()
    public exportGroupCaption: EmitType<ExportGroupCaptionEventArgs>;

    /**
     * Triggers when expand the caption row in lazy load grouping.
     *
     * @event lazyLoadGroupExpand
     */
    @Event()
    public lazyLoadGroupExpand: EmitType<LazyLoadArgs>;

    /**
     * Triggers when collapse the caption row in lazy load grouping.
     *
     * @event lazyLoadGroupCollapse
     */
    @Event()
    public lazyLoadGroupCollapse: EmitType<LazyLoadArgs>;

    /**
     * Event triggered before a detail template row is removed from the DOM.
     *
     * This event allows executing necessary cleanup operations or additional actions before the detail row is detached.
     *
     * @event beforeDetailTemplateDetach
     */
    @Event()
    public beforeDetailTemplateDetach: EmitType<DetailTemplateDetachArgs>;

    /**
     * Event triggered before the custom filter dialog is opened.
     *
     * @event beforeCustomFilterOpen
     */
    @Event()
    public beforeCustomFilterOpen: EmitType<BeforeCustomFilterOpenEventArgs>;

    /**
     * Constructor for creating the component
     *
     * @param {GridModel} options - specifies the options
     * @param {string | HTMLElement} element - specifies the element
     * @hidden
     */
    constructor(options?: GridModel, element?: string | HTMLElement) {
        super(options, <HTMLElement | string>element);
        Grid.Inject(Selection);
        setValue('mergePersistData', this.mergePersistGridData, this);
    }

    /**
     * Get the properties to be maintained in the persisted state.
     *
     * @returns {string} returns the persist data
     */
    public getPersistData(): string {
        const keyEntity: string[] = ['pageSettings', 'sortSettings',
            'filterSettings', 'groupSettings', 'columns', 'searchSettings', 'selectedRowIndex', 'scrollPosition'];
        const ignoreOnPersist: { [x: string]: string[] } = {
            pageSettings: ['template', 'pageSizes', 'enableQueryString', 'totalRecordsCount', 'pageCount'],
            filterSettings: ['type', 'mode', 'showFilterBarStatus', 'immediateModeDelay', 'ignoreAccent'],
            groupSettings: ['showDropArea', 'showToggleButton', 'showGroupedColumn', 'showUngroupButton',
                'disablePageWiseAggregates', 'hideCaptionCount'],
            searchSettings: ['fields', 'operator', 'ignoreCase'],
            sortSettings: [], columns: [], selectedRowIndex: [], scrollPosition: []
        };
        for (let i: number = 0; i < keyEntity.length; i++) {
            const currentObject: Object = this[keyEntity[parseInt(i.toString(), 10)]];
            for (const val of ignoreOnPersist[keyEntity[parseInt(i.toString(), 10)]]) {
                delete currentObject[`${val}`];
            }
        }
        const temp: string | Function = this.pageSettings.template;
        const settings: PageSettingsModel = Object.assign({template: undefined}, this.pageSettings);
        if (this.enableVirtualization && this.enablePersistence && this.contentModule &&
            (this.contentModule as VirtualContentRenderer).getPageFromTop && !isNullOrUndefined(this.scrollPosition) &&
            !isNullOrUndefined(this.scrollPosition.top)) {
            settings['properties']['currentPage'] = (this.contentModule as VirtualContentRenderer).getPageFromTop(this.scrollPosition.top, { block: 1});
        }
        this.setProperties({pageSettings: settings}, true);
        const captionTemplateRef: string | Object | Function = this.groupSettings.captionTemplate;
        const isAngularCaptionTemplate: boolean = captionTemplateRef && this.isAngular;
        if (isAngularCaptionTemplate) {
            delete this.groupSettings['properties']['captionTemplate'];
        }
        this.pageTemplateChange = !isNullOrUndefined(this.pagerTemplate);
        const persistData: string = this.addOnPersist(keyEntity);
        settings.template = temp;
        this.setProperties({pageSettings: settings}, true);
        if (isAngularCaptionTemplate) {
            this.groupSettings.captionTemplate = captionTemplateRef;
        }
        return persistData;
    }

    /**
     * To provide the array of modules needed for component rendering
     *
     * @returns {ModuleDeclaration[]} Returns the module Declaration
     * @hidden
     */
    public requiredModules(): ModuleDeclaration[] {
        this.setFrozenCount(); this.enableInfiniteAggrgate();
        const modules: ModuleDeclaration[] = [];
        if (this.isDestroyed) { return modules; }
        if (this.allowFiltering) {
            modules.push({
                member: 'filter',
                args: [this, this.filterSettings, this.serviceLocator],
                name: 'Filter'
            });
        }
        if (this.allowExcelExport) {
            modules.push({
                member: 'ExcelExport',
                args: [this, this.serviceLocator],
                name: 'ExcelExport'
            });
        }
        if (this.allowPdfExport) {
            modules.push({
                member: 'PdfExport',
                args: [this],
                name: 'PdfExport'
            });
        }
        if (this.allowSorting) {
            modules.push({
                member: 'sort',
                args: [this, this.sortSettings, this.sortedColumns, this.serviceLocator],
                name: 'Sort'
            });
        }
        if (this.allowPaging) {
            modules.push({
                member: 'pager',
                args: [this, this.pageSettings],
                name: 'Page'
            });
        }
        if (this.allowSelection) {
            modules.push({
                member: 'selection',
                args: [this, this.selectionSettings, this.serviceLocator],
                name: 'Selection'
            });
        }
        if (this.resizeCheck()) {
            modules.push({
                member: 'resize',
                args: [this],
                name: 'Resize'
            });
        }

        if (this.allowReordering) {
            modules.push({
                member: 'reorder',
                args: [this],
                name: 'Reorder'
            });
        }
        if (this.allowRowDragAndDrop) {
            modules.push({
                member: 'rowDragAndDrop',
                args: [this],
                name: 'RowDD'
            });
        }
        if (this.allowGrouping) {
            modules.push({
                member: 'group',
                args: [this, this.groupSettings, this.sortedColumns, this.serviceLocator],
                name: 'Group'
            });
        }
        if (this.aggregates.length) {
            modules.push({ member: 'aggregate', args: [this, this.serviceLocator], name: 'Aggregate' });
        }
        if (this.isDetail()) {
            modules.push({
                member: 'detailRow',
                args: [this, this.serviceLocator],
                name: 'DetailRow'
            });
        }
        if (this.toolbar || this.toolbarTemplate) {
            modules.push({
                member: 'toolbar',
                args: [this, this.serviceLocator],
                name: 'Toolbar'
            });
        }
        if (this.enableVirtualization || this.enableColumnVirtualization) {
            modules.push({
                member: 'virtualscroll',
                args: [this, this.serviceLocator],
                name: 'VirtualScroll'
            });
        }
        if (this.getFrozenColumns() || this.frozenRows || this.frozenRightCount || this.frozenLeftCount) {
            modules.push({ member: 'freeze', args: [this, this.serviceLocator], name: 'Freeze' });
        }
        if (!isNullOrUndefined(<Column[]>this.columns) && this.isCommandColumn(<Column[]>this.columns)) {
            modules.push({
                member: 'commandColumn',
                args: [this, this.serviceLocator],
                name: 'CommandColumn'
            });
        }
        if (this.editSettings.allowAdding || this.editSettings.allowDeleting || this.editSettings.allowEditing) {
            modules.push({
                member: 'edit',
                args: [this, this.serviceLocator],
                name: 'Edit'
            });
        }
        this.extendRequiredModules(modules);
        return modules;
    }

    public extendRequiredModules(modules: ModuleDeclaration[]): void {
        if (this.enableInfiniteScrolling) {
            modules.push({
                member: 'infiniteScroll',
                args: [this, this.serviceLocator],
                name: 'InfiniteScroll'
            });
        }

        if (this.groupSettings.enableLazyLoading) {
            modules.push({
                member: 'lazyLoadGroup',
                args: [this, this.serviceLocator],
                name: 'LazyLoadGroup'
            });
        }

        if (this.contextMenuItems) {
            modules.push({
                member: 'contextMenu',
                args: [this, this.serviceLocator],
                name: 'ContextMenu'
            });
        }

        if (this.showColumnMenu) {
            modules.push({
                member: 'columnMenu',
                args: [this, this.serviceLocator],
                name: 'ColumnMenu'
            });
        }

        if (this.showColumnChooser) {
            modules.push({
                member: 'columnChooser',
                args: [this, this.serviceLocator],
                name: 'ColumnChooser'
            });
        }
        if (!isNullOrUndefined(this.columns as Column[]) && this.isForeignKeyEnabled(this.columns as Column[])) {
            modules.push({ member: 'foreignKey', args: [this, this.serviceLocator], name: 'ForeignKey' });
        }
        if (this.enableLogger) {
            modules.push({ member: 'logger', args: [this], name: 'Logger' });
        }
    }

    private resizeCheck(): boolean {
        const autoFitColumns: boolean = this.getColumns().filter((c: Column) => c.autoFit === true).length ? true : false;
        if (!isNullOrUndefined(this.columnModel) && this.columnModel.length && !(this.columnModel[0] instanceof Column)) {
            this.columnModel = [];
        }
        const columnMenu: boolean = this.showColumnMenu && (!this.columnMenuItems || (this.columnMenuItems as ColumnMenuItem[])
            .filter((c: ColumnMenuItem) => c === 'AutoFit' || c === 'AutoFitAll').length) ? true : false;
        const contextMenu: boolean = this.contextMenuItems && (this.contextMenuItems as ContextMenuItem[])
            .filter((c: ContextMenuItem) => c === 'AutoFit' || c === 'AutoFitAll').length ? true : false;
        return this.allowResizing || this.autoFitColumnsResize || autoFitColumns || columnMenu || contextMenu;
    }

    /**
     * For internal use only - Initialize the event handler;
     *
     * @returns {void}
     * @private
     */
    protected preRender(): void {
        this.serviceLocator = new ServiceLocator;
        this.initProperties();
        this.initializeServices();
    }

    private initProperties(): void {
        this.isInitial = true;
        this.sortedColumns = [];
        this.inViewIndexes = [];
        this.mediaCol = [];
        this.isInitialLoad = false;
        this.allowServerDataBinding = false;
        this.ignoreCollectionWatch = true;
        this.mergeCells = {};
        this.isEdit = false;
        this.checkAllRows = 'None';
        this.isCheckBoxSelection = false;
        this.isPersistSelection = false;
        this.componentRefresh = Component.prototype.refresh;
        this.freezeColumnRefresh = true;
        this.filterOperators = {
            contains: 'contains', endsWith: 'endswith', equal: 'equal', greaterThan: 'greaterthan', greaterThanOrEqual: 'greaterthanorequal',
            lessThan: 'lessthan', lessThanOrEqual: 'lessthanorequal', notEqual: 'notequal', startsWith: 'startswith', wildCard: 'wildcard',
            isNull: 'isnull', notNull: 'notnull', like: 'like'
        };
        this.defaultChartLocale = {
            Chart: 'Chart',
            BarChart: 'Bar Chart',
            Bar: 'Bar',
            StackingBar: 'Stacked Bar',
            StackingBar100: '100% Stacked Bar',
            Pie: 'Pie Chart',
            ColumnChart: 'Column Chart',
            Column: 'Column',
            StackingColumn: 'Stacked Column',
            StackingColumn100: '100% Stacked Column',
            LineChart: 'Line Chart',
            Line: 'Line',
            StackingLine: 'Stacked Line',
            StackingLine100: '100% Stacked Line',
            AreaChart: 'Area Chart',
            Area: 'Area',
            StackingArea: 'Stacked Area',
            StackingArea100: '100% Stacked Area',
            Scatter: 'Scatter Chart'
        };
        this.defaultLocale = {
            EmptyRecord: 'No records to display',
            True: 'true',
            False: 'false',
            InvalidFilterMessage: 'Invalid Filter Data',
            GroupDropArea: 'Drag a column header here to group its column',
            UnGroup: 'Click here to ungroup',
            UnGroupButton: 'Click here to ungroup',
            GroupDisable: 'Grouping is disabled for this column',
            FilterbarTitle: '\'s filter bar cell',
            EmptyDataSourceError:
                'DataSource must not be empty at initial load since columns are generated from dataSource in AutoGenerate Column Grid',
            // Toolbar Items
            Add: 'Add',
            Edit: 'Edit',
            Cancel: 'Cancel',
            Update: 'Update',
            Delete: 'Delete',
            Print: 'Print',
            Pdfexport: 'PDF Export',
            Excelexport: 'Excel Export',
            Wordexport: 'Word Export',
            Csvexport: 'CSV Export',
            Search: 'Search',
            Columnchooser: 'Columns',
            Save: 'Save',
            Item: 'item',
            Items: 'items',
            EditOperationAlert: 'No records selected for edit operation',
            DeleteOperationAlert: 'No records selected for delete operation',
            SaveButton: 'Save',
            OKButton: 'OK',
            CancelButton: 'Cancel',
            EditFormTitle: 'Details of ',
            AddFormTitle: 'Add New Record',
            BatchSaveConfirm: 'Are you sure you want to save changes?',
            BatchSaveLostChanges: 'Unsaved changes will be lost. Are you sure you want to continue?',
            ConfirmDelete: 'Are you sure you want to Delete Record?',
            CancelEdit: 'Are you sure you want to Cancel the changes?',
            ChooseColumns: 'Choose Column',
            ColumnMenu: 'Column Menu',
            SearchColumns: 'search columns',
            Matchs: 'No matches found',
            FilterButton: 'Filter',
            FilterTitle: 'Filter',
            FilterIcon: 'Filter',
            ClearButton: 'Clear',
            StartsWith: 'Starts With',
            NotStartsWith: 'Does Not Start With',
            Like: 'Like',
            EndsWith: 'Ends With',
            NotEndsWith: 'Does Not End With',
            Contains: 'Contains',
            NotContains: 'Does Not Contain',
            IsNull: 'Null',
            NotNull: 'Not Null',
            IsEmpty: 'Empty',
            IsNotEmpty: 'Not Empty',
            Equal: 'Equal',
            NotEqual: 'Not Equal',
            LessThan: 'Less Than',
            LessThanOrEqual: 'Less Than Or Equal',
            GreaterThan: 'Greater Than',
            GreaterThanOrEqual: 'Greater Than Or Equal',
            In: 'In',
            NotIn: 'Not In',
            ChooseDate: 'Choose a Date',
            EnterValue: 'Enter the value',
            Copy: 'Copy',
            Group: 'Group by this column',
            Ungroup: 'Ungroup by this column',
            GroupButton: 'Group button',
            UnGroupAria: 'ungroup button',
            GroupSeperator: 'Separator for the grouped columns',
            UnGroupIcon: 'ungroup the grouped column ',
            GroupedSortIcon: 'sort the grouped column ',
            GroupedDrag: 'Drag the grouped column',
            GroupCaption: ' is groupcaption cell',
            CheckBoxLabel: 'checkbox',
            SelectAllCheckbox: 'Select all checkbox',
            SelectRow: 'Select row',
            autoFitAll: 'Autofit all columns',
            autoFit: 'Autofit this column',
            AutoFitAll: 'Autofit all columns',
            AutoFit: 'Autofit this column',
            Export: 'Export',
            FirstPage: 'First Page',
            LastPage: 'Last Page',
            PreviousPage: 'Previous Page',
            NextPage: 'Next Page',
            SortAscending: 'Sort Ascending',
            SortDescending: 'Sort Descending',
            EditRecord: 'Edit Record',
            DeleteRecord: 'Delete Record',
            FilterMenu: 'Filter',
            SelectAll: 'Select All',
            AddCurrentSelection: 'Add current selection to filter',
            Blanks: 'Blanks',
            FilterTrue: 'True',
            FilterFalse: 'False',
            NoResult: 'No matches found',
            ClearFilter: 'Clear Filter',
            Clear: 'Clear',
            NumberFilter: 'Number Filters',
            TextFilter: 'Text Filters',
            DateFilter: 'Date Filters',
            DateTimeFilter: 'DateTime Filters',
            MatchCase: 'Match Case',
            Between: 'Between',
            CustomFilter: 'Custom Filter',
            CustomFilterPlaceHolder: 'Enter the value',
            CustomFilterDatePlaceHolder: 'Choose a date',
            AND: 'AND',
            OR: 'OR',
            ShowRowsWhere: 'Show rows where:',
            ToolbarMenuDialogARIA: 'Toolbar menu dialog',
            FilterMenuDialogARIA: 'Filter menu',
            ExcelFilterDialogARIA: 'Excel filter',
            CheckBoxFilterDialogARIA: 'Checkbox filter',
            DialogEditARIA: 'Edit dialog',
            ColumnMenuDialogARIA: 'Column menu dialog',
            CustomFilterDialogARIA: 'Customer filter dialog',
            SortAtoZ: 'Sort A to Z',
            SortZtoA: 'Sort Z to A',
            SortByOldest: 'Sort by Oldest',
            SortByNewest: 'Sort by Newest',
            SortSmallestToLargest: 'Sort Smallest to Largest',
            SortLargestToSmallest: 'Sort Largest to Smallest',
            Sort: 'Sort',
            SortIcon: 'Sort',
            FilterDescription: 'Press Alt Down to open filter Menu',
            SortDescription: 'Press Enter to sort',
            ColumnMenuDescription: 'Press Alt Down to open Column Menu',
            GroupDescription: 'Press Ctrl space to group',
            ColumnHeader: ' column header ',
            TemplateCell: ' is template cell',
            CommandColumnAria: 'is Command column column header ',
            DialogEdit: 'Dialog edit',
            ClipBoard: 'clipboard',
            AscendingText: 'Ascending',
            DescendingText: 'Descending',
            NoneText: 'None',
            Expanded: 'Expanded',
            Collapsed: 'Collapsed',
            PinRow: 'Pin Row',
            UnpinRow: 'Unpin Row',
            ...this.defaultChartLocale
        };
        this.keyConfigs = {
            downArrow: 'downarrow',
            upArrow: 'uparrow',
            rightArrow: 'rightarrow',
            leftArrow: 'leftarrow',
            shiftDown: 'shift+downarrow',
            shiftUp: 'shift+uparrow',
            shiftRight: 'shift+rightarrow',
            shiftLeft: 'shift+leftarrow',
            home: 'home',
            end: 'end',
            escape: 'escape',
            ctrlHome: 'ctrl+home',
            ctrlEnd: 'ctrl+end',
            pageUp: 'pageup',
            pageDown: 'pagedown',
            ctrlAltPageUp: 'ctrl+alt+pageup',
            ctrlAltPageDown: 'ctrl+alt+pagedown',
            altPageUp: 'alt+pageup',
            altPageDown: 'alt+pagedown',
            altDownArrow: 'alt+downarrow',
            altUpArrow: 'alt+uparrow',
            ctrlDownArrow: 'ctrl+downarrow',
            ctrlUpArrow: 'ctrl+uparrow',
            ctrlPlusA: 'ctrl+A',
            ctrlPlusP: 'ctrl+P',
            insert: 'insert',
            delete: 'delete',
            f2: 'f2',
            enter: 'enter',
            ctrlEnter: 'ctrl+enter',
            shiftEnter: 'shift+enter',
            tab: 'tab',
            shiftTab: 'shift+tab',
            space: 'space',
            ctrlPlusC: 'ctrl+C',
            ctrlShiftPlusH: 'ctrl+shift+H',
            ctrlSpace: 'ctrl+space',
            ctrlLeftArrow: 'ctrl+leftarrow',
            ctrlRightArrow: 'ctrl+rightarrow'
        };
    }

    /**
     * For internal use only - To Initialize the component rendering.
     *
     * @returns {void}
     * @private
     */
    protected render(): void {
        this.log(['module_missing', 'promise_enabled', 'locale_missing', 'check_datasource_columns']);
        this.ariaService.setOptions(this.element, { role: 'grid' });
        createSpinner({ target: this.element, cssClass: this.cssClass ? this.cssClass : null }, this.createElement);
        this.renderModule = new Render(this, this.serviceLocator);
        this.searchModule = new Search(this);
        this.scrollModule = new Scroll(this);
        this.notify(events.initialLoad, {});
        if (this.pageSettings.enableQueryString) {
            const pageValue: string = new URL(window.location.href).searchParams.get('page');
            if (!isNullOrUndefined(pageValue) && window.location.href.indexOf('?page=') > 0) {
                const currentPageValue: number = parseInt(pageValue, 10);
                this.setProperties({ pageSettings: { currentPage: currentPageValue } }, true);
                this.pageSettings.currentPage = currentPageValue;
            }
        }
        if ((this.getDataModule().dataManager.dataSource.offline === true || this.getDataModule().dataManager.dataSource.url === undefined)
            && !(!isNullOrUndefined(this.dataSource) && (<DataResult>this.dataSource).result)) {
            this.isVirtualAdaptive = true;
        }
        if (this.aggregateModule && this.aggregates.length) {
            for (let i: number = 0; i < this.aggregates.length; i++) {
                for (let j: number = 0; j < this.aggregates[parseInt(i.toString(), 10)].columns.length; j++) {
                    const column: AggregateColumnModel = this.aggregates[parseInt(i.toString(), 10)].columns[parseInt(j.toString(), 10)];
                    if (column['types']) {
                        column.type = column['types'];
                    }
                }
            }
        }
        if (this.isReact) {
            const args: LoadEventArgs = {requireTemplateRef: this.requireTemplateRef};
            this.trigger(events.load, args);
            if (!args.requireTemplateRef) {
                this.requireTemplateRef = args.requireTemplateRef;
            }
        }
        else {
            this.trigger(events.load);
        }
        if (typeof this.isRowSelectable === 'string') {
            this.isRowSelectable = getValue(this.isRowSelectable, window);
        }
        if (typeof this.isRowPinned === 'string') {
            this.isRowPinned = getValue(this.isRowPinned, window);
        }
        if (this.isRowPinned) {
            if (this.allowSelection) {
                this.selectionSettings.persistSelection = true;
                this.selectionSettings.type = 'Multiple';
            }
        }
        prepareColumns(this.columns as Column[], this.enableColumnVirtualization, this);
        if (this.enableColumnVirtualization && this.isChangeDataSourceCall && this.columnModel) {
            this.columnModel = [];
            this.updateColumnModel(this.columns as Column[]);
        }
        this.isPreparedFrozenColumns = true;
        if (this.enablePersistence) {
            this.notify(events.columnsPrepared, {});
        }
        this.getMediaColumns();
        setColumnIndex(this.columns as Column[]);
        if (this.isFrozenGrid() && !this.mergedColumns) {
            this.setInitialFrozenColumnIndex(this.columns as Column[]);
        }
        this.checkLockColumns(this.columns as Column[]);
        this.getColumns();
        this.processModel();
        this.gridRender();
        this.wireEvents();
        this.addListener();
        this.updateDefaultCursor();
        this.updateStackedFilter();
        if (this.loadingIndicator.indicatorType === 'Spinner') {
            this.showSpinner();
        }
        this.notify(events.initialEnd, {});
        if (this.loadingIndicator.indicatorType === 'Shimmer') {
            this.refreshMaskRow();
        }
        if (this.refreshing) {
            this.trigger('created');
        }
    }

    private setInitialFrozenColumnIndex(columns: Column[]): void {
        for (let i: number = 0; i < columns.length; i++) {
            const column: Column = columns[parseInt(i.toString(), 10)];
            column[`${literals.initialFrozenColumnIndex}`] = column.index;
            if (column.columns) {
                this.setInitialFrozenColumnIndex(column.columns as Column[]);
            }
        }
    }

    /**
     * By default, grid shows the spinner for all its actions. You can use this method to show spinner at your needed time.
     *
     * @returns {void}
     */
    public showSpinner(): void {
        if (!this.isExportGrid) {
            showSpinner(this.element);
        }
    }
    /**
     * By default, grid shows the spinner for all its actions. You can use this method to show spinner at your needed time.
     *
     * @returns {void}
     */
    public hideSpinner(): void {
        if (!this.isExportGrid) {
            hideSpinner(this.element);
        }
    }

    public showMaskRow(axisDirection?: string, dialogElement?: Element): void {
        if (isNullOrUndefined(this.headerModule) || isNullOrUndefined(this.contentModule)) {
            return;
        }
        const gridHeader: Element = this.getHeaderContent().firstChild as Element;
        const gridContent: Element = this.getContent().firstChild as Element;
        const gridFooter: Element = this.getFooterContent() as Element;
        if (dialogElement) {
            const dialogHolder: Element = dialogElement.querySelector('.e-checkboxlist');
            if (!isNullOrUndefined(dialogHolder)) {
                const maskRowCount: number = Math.floor(dialogHolder.getBoundingClientRect().height / this.getRowHeight());
                const maskTemplate: string = '<div class="e-ftrchk e-mask-ftrchk">'
                    + '<div class="e-checkbox-wrapper"><input class="e-chk-hidden">'
                    + this.getShimmerTemplate() + this.getShimmerTemplate() + '</div></div>';
                dialogHolder.innerHTML = '';
                for (let i: number = 0; i < maskRowCount; i++) {
                    dialogHolder.innerHTML += maskTemplate;
                    (dialogHolder.querySelector('.e-ftrchk.e-mask-ftrchk') as HTMLElement).style.width = '100%';
                    (dialogHolder.querySelector('.e-checkbox-wrapper') as HTMLElement).style.width = '100%';
                    const maskSpan: Element[] = [].slice.call(dialogHolder
                        .querySelectorAll('.e-mask:not(.e-mask-checkbox-filter-intent):not(.e-mask-checkbox-filter-span-intent)'));
                    maskSpan[0].classList.add('e-mask-checkbox-filter-intent');
                    maskSpan[1].classList.add('e-mask-checkbox-filter-span-intent');
                }
            }
            return;
        }
        if ((!this.enableRtl && !(this.getHeaderContent() as HTMLElement).style.paddingRight)
            || (this.enableRtl && !(this.getHeaderContent() as HTMLElement).style.paddingLeft)) {
            (gridContent as HTMLElement).style.overflowY = 'hidden';
        }
        if (!this.isInitialLoad && !this.getColumns().length) {
            const contentHeight: number = gridContent.getBoundingClientRect().height;
            const maskTableHeight: number = contentHeight === 0 ? this.allowPaging ? this.pageSettings.pageSize * this.getRowHeight()
                : window.innerHeight : contentHeight;
            const contentRowCount: number = Math.ceil(maskTableHeight / this.getRowHeight());
            if (this.rowRenderingMode !== 'Vertical') {
                this.headerMaskTable = this.createEmptyMaskTable(gridHeader, 1);
            }
            this.contentMaskTable = this.createEmptyMaskTable(gridContent, contentRowCount);
            return;
        }
        this.maskRowContentScroll = (this.enableVirtualization || this.enableColumnVirtualization) && axisDirection ? true : false;
        if (!this.contentMaskTable) {
            let content: Element = gridContent;
            if (this.enableVirtualization || this.enableColumnVirtualization) {
                content = content.querySelector('.e-virtualtable');
            }
            if (!isNullOrUndefined(content.querySelector('tbody'))) {
                this.contentMaskTable = this.createMaskTable(content, this.getContentMaskColumns(), axisDirection);
            }
        }
        if (!this.headerMaskTable && ((this.isFrozenGrid() && !this.isRowPinned && !this.pinnedTopRowModels.length) || (this.enableColumnVirtualization && axisDirection === 'X'))) {
            let content: Element = gridHeader;
            if (this.enableColumnVirtualization && axisDirection === 'X') {
                content = content.querySelector('.e-virtualtable');
            }
            this.headerMaskTable = this.createMaskTable(content, this.getContentMaskColumns(), axisDirection);
        }
        if (gridFooter && gridFooter.querySelector('.e-summaryrow')) {
            const gridFooterContent: Element = gridFooter.firstChild as Element;
            if (!this.footerContentMaskTable) {
                const footerContent: Element = gridFooterContent;
                this.footerContentMaskTable = this.createMaskTable(footerContent);
            }
        }
        if (!(this.enableVirtualization && axisDirection)) {
            EventHandler.add(gridContent, 'scroll', this.translateMaskRow, this);
        }
    }

    private getContentMaskColumns(): Column[] {
        return this.getColumns() as Column[];
    }

    private createEmptyMaskTable(maskElement: Element, rowCount: number): Element {
        const table: Element = this.createElement('table', { className: 'e-table e-masked-table'});
        const tbody: Element = this.createElement('tbody', { className: 'e-masked-tbody'});
        const row: Element = this.createElement('tr', { className: 'e-masked-row e-row' });
        (row as HTMLElement).style.height = `${this.getRowHeight()}px`;
        const cell: Element = this.createElement('td', { className: 'e-masked-cell e-rowcell' });
        cell.innerHTML = this.getShimmerTemplate();
        row.appendChild(cell);
        for (let i: number = 0; i < rowCount; i++) {
            tbody.appendChild(row.cloneNode(true));
        }
        table.appendChild(tbody);
        maskElement.appendChild(table);
        return table;
    }

    private createFrozenMaskRow(td: HTMLElement[], columns: Column[]): void {
        for (let i: number = 0; i < td.length; i++) {
            if (i < this.frozenLeftCount) {
                if (this.frozenLeftCount - 1 === i) {
                    td[parseInt(i.toString(), 10)].classList.add('e-freezeleftborder');
                }
                td[parseInt(i.toString(), 10)].classList.add('e-leftfreeze');
                td[parseInt(i.toString(), 10)].setAttribute('aria-colindex', (i + 1).toString());
                td[parseInt(i.toString(), 10)].style.left  = ((<{ valueX?: number }>columns[parseInt(i.toString(), 10)]).valueX -
                    this.translateX) + 'px';
            } else if ((td.length - this.frozenRightCount) <= i && columns[parseInt(i.toString(), 10)]) {
                if ((td.length - this.frozenRightCount) === i) {
                    td[parseInt(i.toString(), 10)].classList.add('e-freezerightborder');
                }
                td[parseInt(i.toString(), 10)].classList.add('e-rightfreeze');
                td[parseInt(i.toString(), 10)].setAttribute('aria-colindex', (i + 1).toString());
                td[parseInt(i.toString(), 10)].style.right  = (this.translateX +
                    (<{ valueX?: number }>columns[parseInt(i.toString(), 10)]).valueX) + 'px';
            }
        }
    }

    private createMaskTable(element: Element, columns?: Column[], axisDirection?: string): Element {
        const parentElement: Element = element;
        const header: boolean = closest(parentElement, '.e-gridheader') ? true : false;
        const content: boolean = closest(parentElement, '.e-gridcontent') ? true : false;
        const footer: boolean = closest(parentElement, '.e-gridfooter') ? true : false;
        const gridContent: Element = this.getContent().firstChild as Element;
        const gridContentScrollHeight: number = gridContent.scrollHeight;
        const table: Element = parentElement.querySelector('table') as Element;
        const maskTable: Element = table.cloneNode() as Element;
        maskTable.removeAttribute('role');
        maskTable.removeAttribute('id');
        updateCSSText(maskTable as HTMLElement, `position: absolute; z-index: 5; width: ${table.getBoundingClientRect().width}px;`);
        if (header && !(this.enableColumnVirtualization && axisDirection === 'X')) {
            (maskTable as HTMLElement).style.transform = 'translate(0px,'
                + table.querySelector('thead').getBoundingClientRect().height + 'px)';
        }
        maskTable.setAttribute('class', 'e-table e-masked-table');
        const maskColgroup: Element = table.querySelector('colgroup').cloneNode(true) as Element;
        maskColgroup.removeAttribute('id');
        maskColgroup.setAttribute('class', 'e-masked-colgroup');
        maskTable.appendChild(maskColgroup);
        if (header && this.enableColumnVirtualization && axisDirection === 'X') {
            const row: Element = this.createMaskRow(maskColgroup, columns);
            if (this.isFrozenGrid()) {
                const frozenTd: HTMLElement[] = [].slice.call(row.querySelectorAll('.e-rowcell'));
                this.createFrozenMaskRow(frozenTd, columns);
            }
            const thead: Element = table.querySelector('thead');
            const rows: Element[] = [].slice.call(thead.querySelectorAll('tr'));
            const maskTHead: Element = thead.cloneNode() as Element;
            maskTHead.removeAttribute('role');
            maskTHead.setAttribute('class', 'e-masked-thead');
            const rowCount: number = rows.length;
            for (let i: number = 0; i < rowCount; i++) {
                maskTHead.appendChild(row.cloneNode(true));
                (maskTHead.childNodes[parseInt(i.toString(), 10)] as HTMLElement).style
                    .height = rows[parseInt(i.toString(), 10)].getBoundingClientRect().height + 'px';
            }
            maskTable.appendChild(maskTHead);
        }
        const maskTBody: Element = table.querySelector('tbody').cloneNode() as Element;
        maskTBody.removeAttribute('role');
        maskTBody.setAttribute('class', 'e-masked-tbody');
        const tbody: Element = table.querySelector('tbody');
        if (content || header) {
            const rowCountElement: Element = gridContent;
            let rowCount: number = Math.ceil(rowCountElement.getBoundingClientRect().height / this.getRowHeight());
            if (this.allowPaging && this.pageSettings.pageSize !== this.currentViewData.length &&
                this.pagerModule.pagerObj.totalPages !== this.pageSettings.currentPage) {
                const row: Element = this.createMaskRow(maskColgroup, columns);
                const altRow: Element = row.cloneNode(true) as Element;
                altRow.classList.add('e-altrow');
                for (let i: number = 0; i < this.pageSettings.pageSize - this.currentViewData.length; i++) {
                    maskTBody.appendChild((i % 2 === 1) ? altRow.cloneNode(true) : row.cloneNode(true));
                }
            }
            if (tbody.querySelector('.e-emptyrow') || !tbody.childNodes.length || (content && this.childGrid)) {
                const row: Element = this.createMaskRow(maskColgroup, columns);
                const altRow: Element = row.cloneNode(true) as Element;
                altRow.classList.add('e-altrow');
                for (let i: number = 0; i < rowCount; i++) {
                    const altNumber: number = 1;
                    maskTBody.appendChild((i + altNumber) % 2 === 0 ? altRow.cloneNode(true) : row.cloneNode(true));
                }
            } else {
                let rowsQuery: string = 'tr:not(.e-hide):not([style*="display:none"]):not([style*="display: none"])';
                if (this.isTreeGrid) {
                    rowsQuery = 'tr:not(.e-hide):not([style*="display:none"]):not([style*="display: none"]):not(.e-childrow-hidden)';
                }
                const rows: Element[] = [].slice.call(tbody.querySelectorAll(rowsQuery));
                const addEditRow: Element = tbody.querySelector('.e-addedrow, .e-editedrow');
                let addEditRowIndex: number;
                if (addEditRow) {
                    addEditRowIndex = rows.indexOf(addEditRow);
                    if (this.isFrozenGrid() && this.enableColumnVirtualization) {
                        const frzTd: HTMLElement[] = [].slice.call(rows[addEditRowIndex + 1].querySelectorAll('.e-rowcell'));
                        for (let i: number = 0; i < frzTd.length; i++) {
                            if (i < this.frozenLeftCount) {
                                frzTd[parseInt(i.toString(), 10)].classList.add('e-leftfreeze');
                                frzTd[parseInt(i.toString(), 10)].setAttribute('aria-colindex', (i + 1).toString());
                                frzTd[parseInt(i.toString(), 10)].style.left = (
                                    (<{ valueX?: number }>columns[parseInt(i.toString(), 10)]).valueX - this.translateX) + 'px';
                            } else if ((frzTd.length - this.frozenRightCount) <= i && columns[parseInt(i.toString(), 10)]) {
                                frzTd[parseInt(i.toString(), 10)].classList.add('e-rightfreeze');
                                frzTd[parseInt(i.toString(), 10)].setAttribute('aria-colindex', (i + 1).toString());
                                frzTd[parseInt(i.toString(), 10)].style.right = (this.translateX +
                                    (<{ valueX?: number }>columns[parseInt(i.toString(), 10)]).valueX) + 'px';
                            }
                        }
                    }
                    if (addEditRow.classList.contains('e-addedrow')) {
                        rows.splice(addEditRowIndex, 2);
                    } else {
                        rows.splice(addEditRowIndex, 1);
                    }
                }
                rowCount = (this.enableVirtualization || this.enableColumnVirtualization) && axisDirection ? rows.length
                    : rowCount <= rows.length ? rowCount : rows.length;
                for (let i: number = 0; i < rowCount; i++) {
                    const maskTBodyRow: Element = this.applyMaskRow(rows[parseInt(i.toString(), 10)].cloneNode(true) as Element,
                                                                    rows[parseInt(i.toString(), 10)].getBoundingClientRect().height);
                    if (this.enableColumnVirtualization && axisDirection === 'X' && this.isFrozenGrid()) {
                        const frozenTd: HTMLElement[] = [].slice.call(maskTBodyRow.querySelectorAll('.e-masked-cell'));
                        this.createFrozenMaskRow(frozenTd, columns);
                    }
                    maskTBody.appendChild(maskTBodyRow);
                }
                if (addEditRow && addEditRow.classList.contains('e-editedrow') && addEditRowIndex < rowCount) {
                    const addEditMaskRow: HTMLElement = maskTBody.childNodes[parseInt(addEditRowIndex.toString(), 10)] as HTMLElement;
                    addEditMaskRow.style.height = this.getRowHeight() + 'px';
                    addEditMaskRow.classList.add('e-row');
                    if (addEditRow.classList.contains('e-altrow')) {
                        addEditMaskRow.classList.add('e-altrow');
                    }
                }
            }
        }
        maskTable.appendChild(maskTBody);
        if (footer) {
            const tfoot: Element = table.querySelector('tfoot');
            const maskTFoot: Element = tfoot.cloneNode() as Element;
            maskTFoot.setAttribute('class', 'e-masked-tfoot');
            const rows: Element[] = [].slice.call(tfoot.querySelectorAll('tr'));
            for (let i: number = 0; i < rows.length; i++) {
                maskTFoot.appendChild(
                    this.applyMaskRow(
                        rows[parseInt(i.toString(), 10)].cloneNode(true) as Element,
                        rows[parseInt(i.toString(), 10)].getBoundingClientRect().height));
            }
            maskTable.appendChild(maskTFoot);
        }
        if (header && this.isFrozenGrid() && !this.enableColumnVirtualization) {
            (this.getHeaderContent().querySelector('.' + literals.headerContent) as HTMLElement).style.position = 'relative';
        }
        parentElement.insertBefore(maskTable, parentElement.firstChild);
        if (content && !(this.enableVirtualization && axisDirection)) {
            let minScrollTop: number = gridContentScrollHeight - maskTable.getBoundingClientRect().height;
            minScrollTop = minScrollTop < 0 ? 0 : minScrollTop;
            let scrollTop: number = gridContent.scrollTop <= minScrollTop ? gridContent.scrollTop : minScrollTop;
            if (this.enableVirtualization) {
                scrollTop -= getTransformValues(closest(parentElement, '.e-virtualtable')).height;
            }
            (maskTable as HTMLElement).style.transform = 'translate(0px,' + scrollTop + 'px)';
        }
        return maskTable;
    }

    private applyMaskRow(row: Element, rowHeight: number): Element {
        const maskRow: Element = row;
        maskRow.removeAttribute('role');
        maskRow.removeAttribute('aria-rowindex');
        maskRow.removeAttribute('data-uid');
        maskRow.classList.add('e-masked-row');
        (maskRow as HTMLElement).style.height = rowHeight + 'px';
        const maskCells: Element[] = [].slice.call(maskRow.childNodes);
        for (let i: number = 0; i < maskCells.length; i++) {
            const maskCell: Element = maskCells[parseInt(i.toString(), 10)];
            const displayAsCheckBoxCell: boolean = maskCell.firstChild && (maskCell.firstChild as Element).classList
                && (maskCell.firstChild as Element).classList.contains('e-checkbox-wrapper');
            maskCell.removeAttribute('role');
            maskCell.removeAttribute('tabindex');
            maskCell.removeAttribute('aria-label');
            if (this.enableColumnVirtualization && maskCell.classList.contains('e-fixedfreeze')) {
                removeClass([maskCell], ['e-fixedfreeze', 'e-freezeleftborder', 'e-freezerightborder']);
                addClass([maskCell], ['e-unfreeze']);
            }
            maskCell.removeAttribute('aria-colindex');
            maskCell.removeAttribute('data-index');
            maskCell.removeAttribute('data-mappingname');
            maskCell.removeAttribute('data-mappingvalue');
            maskCell.removeAttribute('data-mappinguid');
            maskCell.removeAttribute('aria-expanded');
            maskCell.classList.add('e-masked-cell');
            maskCell.innerHTML = this.getShimmerTemplate();
            if (maskCell.classList.contains('e-recordplusexpand') || maskCell.classList.contains('e-recordpluscollapse')) {
                (maskCell.firstChild as HTMLElement).classList.add('e-mask-group-intent');
            } else if (maskCell.classList.contains('e-gridchkbox') || displayAsCheckBoxCell) {
                (maskCell.firstChild as HTMLElement).classList.add('e-mask-checkbox-intent');
            } else if (maskCell.classList.contains('e-rowdragdrop')) {
                (maskCell.firstChild as HTMLElement).classList.add('e-mask-drag-intent');
            } else if (maskCell.classList.contains('e-indentcell')) {
                maskCell.innerHTML = '';
            }
        }
        return maskRow;
    }

    private createMaskRow(refColgroup: Element, refColumns: Column[]): Element {
        const colgroup: Element = refColgroup;
        const columns: Column[] = refColumns;
        const row: Element = this.createElement('tr', { className: 'e-masked-row e-row' });
        if (this.rowRenderingMode !== 'Vertical') {
            (row as HTMLElement).style.height = this.getRowHeight() + 'px';
        }
        const td: Element = this.createElement('td', { className: 'e-masked-cell e-rowcell' });
        for (let i: number = 0, colIndex: number = 0; i < colgroup.childNodes.length; i++) {
            const col: HTMLElement = colgroup.childNodes[parseInt(i.toString(), 10)] as HTMLElement;
            const localTD: HTMLElement = td.cloneNode() as HTMLElement;
            localTD.innerHTML = this.getShimmerTemplate();
            if (!(col.classList.contains('e-group-intent') || col.classList.contains('e-detail-intent')
                || col.classList.contains('e-drag-intent'))) {
                if (this.rowRenderingMode === 'Vertical' && columns[parseInt(colIndex.toString(), 10)]) {
                    localTD.setAttribute('data-cell', columns[parseInt(colIndex.toString(), 10)].headerText ?
                        columns[parseInt(colIndex.toString(), 10)].headerText : columns[parseInt(colIndex.toString(), 10)].field);
                }
                if (col.style.display === 'none') {
                    localTD.classList.add('e-hide');
                } else {
                    localTD.style.textAlign = columns[parseInt(colIndex.toString(), 10)]
                        && columns[parseInt(colIndex.toString(), 10)].textAlign ?
                        columns[parseInt(colIndex.toString(), 10)].textAlign.toLowerCase()
                        : this.enableRtl ? 'right' : 'left';
                    if (columns[parseInt(colIndex.toString(), 10)] && (columns[parseInt(colIndex.toString(), 10)].type === 'checkbox'
                        || columns[parseInt(colIndex.toString(), 10)].displayAsCheckBox)) {
                        (localTD.firstChild as HTMLElement).classList.add('e-mask-checkbox-intent');
                    }
                }
                colIndex++;
            } else {
                if (col.classList.contains('e-group-intent')) {
                    (localTD.firstChild as HTMLElement).classList.add('e-mask-group-intent');
                } else if (col.classList.contains('e-detail-intent')) {
                    (localTD.firstChild as HTMLElement).classList.add('e-mask-detail-intent');
                } else if (col.classList.contains('e-drag-intent')) {
                    (localTD.firstChild as HTMLElement).classList.add('e-mask-drag-intent');
                }
            }
            row.appendChild(localTD);
        }
        return row;
    }

    private getShimmerTemplate(): string {
        if (this.maskRowContentScroll) {
            return '<span class="e-mask e-skeleton e-skeleton-text"></span>';
        }
        return '<span class="e-mask e-skeleton e-skeleton-text e-shimmer-wave"></span>';
    }

    public addShimmerEffect(): void {
        this.maskRowContentScroll = false;
        const maskSpan: Element[] = [].slice.call(this.element.querySelectorAll('.e-mask:not(.e-shimmer-wave)'));
        for (let i: number = 0; i < maskSpan.length; i++) {
            if (maskSpan[parseInt(i.toString(), 10)]) {
                maskSpan[parseInt(i.toString(), 10)].classList.add('e-shimmer-wave');
            }
        }
    }

    private translateMaskRow(e: MouseEvent): void {
        const target: Element = e.target as Element;
        const maskTables: NodeListOf<Element> = target.querySelectorAll('.e-masked-table');
        for (let i: number = 0; i < maskTables.length; i++) {
            const maskTable: Element = maskTables[parseInt(i.toString(), 10)];
            if (maskTable) {
                let minScrollTop: number = target.scrollHeight - maskTable.getBoundingClientRect().height;
                minScrollTop = minScrollTop < 0 ? 0 : minScrollTop;
                let scrollTop: number = target.scrollTop <= minScrollTop ? target.scrollTop : minScrollTop;
                if (this.enableVirtualization) {
                    scrollTop -= getTransformValues(closest(maskTable, '.e-virtualtable')).height;
                }
                (maskTable as HTMLElement).style.transform = 'translate(0px,' + scrollTop + 'px)';
            }
        }
    }

    public removeMaskRow(): void {
        if (!isNullOrUndefined(this.contentModule)) {
            const gridContent: Element = this.getContent().firstChild as Element;
            EventHandler.remove(gridContent, 'scroll', this.translateMaskRow);
        }
        if (this.headerMaskTable && this.isFrozenGrid() && !this.enableColumnVirtualization) {
            (this.getHeaderContent().querySelector('.' + literals.headerContent) as HTMLElement).style.position = '';
        }
        const maskTables: Element[] = [this.headerMaskTable,
            this.contentMaskTable, this.footerContentMaskTable];
        for (let i: number = 0; i < maskTables.length; i++) {
            const maskTable: Element = maskTables[parseInt(i.toString(), 10)];
            if (maskTable) {
                remove(maskTable);
            }
        }
        this.headerMaskTable = null;
        this.contentMaskTable = null;
        this.footerContentMaskTable = null;
    }

    private refreshMaskRow(): void {
        const gridContent: Element = this.getContent().firstChild as Element;
        if (!this.isInitialLoad && !this.getColumns().length) {
            return;
        }
        if (this.contentMaskTable && gridContent.querySelector('.e-masked-table')) {
            let content: Element = gridContent;
            if (this.enableVirtualization) {
                content = content.querySelector('.e-virtualtable');
            }
            this.refreshMaskRowColgroupWidth(content);
        }
    }

    private refreshMaskRowColgroupWidth(content: Element): void {
        const table: Element = content.querySelector('table:not(.e-masked-table)');
        const colgroup: Element = table.querySelector(literals.colGroup).cloneNode(true) as Element;
        const maskTable: Element = content.querySelector('.e-masked-table');
        colgroup.removeAttribute('id');
        colgroup.setAttribute('class', 'e-masked-colgroup');
        for (let i: number = 0; i < colgroup.childNodes.length; i++) {
            (colgroup.childNodes[parseInt(i.toString(), 10)] as Element).removeAttribute('class');
        }
        remove(maskTable.querySelector('.e-masked-colgroup'));
        maskTable.insertBefore(colgroup, maskTable.firstChild);
        (maskTable as HTMLElement).style.width = (table as Element).getBoundingClientRect().width + 'px';
    }

    private updateStackedFilter(): void {
        if (this.allowFiltering && this.filterSettings.type === 'FilterBar' &&
            this.getHeaderContent().getElementsByClassName('e-stackedheadercell').length) {
            this.getHeaderContent().classList.add('e-stackedfilter');
        } else {
            this.getHeaderContent().classList.remove('e-stackedfilter');
        }
    }

    public getMediaColumns(): void {
        if (!this.enableColumnVirtualization) {
            const gcol: Column[] = this.getColumns();
            this.getShowHideService = this.serviceLocator.getService<ShowHide>('showHideService');
            if (!isNullOrUndefined(gcol)) {
                for (let index: number = 0; index < gcol.length; index++) {
                    if (!isNullOrUndefined(gcol[parseInt(index.toString(), 10)].hideAtMedia)
                        && (isNullOrUndefined(gcol[parseInt(index.toString(), 10)].visible)
                        || gcol[parseInt(index.toString(), 10)].visible)) {
                        this.pushMediaColumn(gcol[parseInt(index.toString(), 10)], index);
                    }
                }
            }
        }
        this.updateFrozenColumnsWidth();
    }

    private pushMediaColumn(col: Column, index: number): void {
        this.mediaCol.push(col);
        this.media[col.uid] = window.matchMedia(col.hideAtMedia);
        this.mediaQueryUpdate(index, this.media[col.uid]);
        this.mediaBindInstance[parseInt(index.toString(), 10)] = this.mediaQueryUpdate.bind(this, index);
        this.media[col.uid].addListener(this.mediaBindInstance[parseInt(index.toString(), 10)] as null);
    }

    /**
     * @param {Column} col - specifies the column
     * @returns {void}
     * @hidden
     */
    public updateMediaColumns(col: Column): void {
        if (!this.enableColumnVirtualization) {
            const index: number = this.getColumnIndexByUid(col.uid);
            for (let i: number = 0; i < this.mediaCol.length; i++) {
                if (col.uid === this.mediaCol[parseInt(i.toString(), 10)].uid) {
                    this.mediaCol.splice(i, 1);
                    return;
                }
            }
            this.pushMediaColumn(col, index);
        }
    }

    /**
     * @param {number} columnIndex - specifies the column index
     * @param {MediaQueryList} e - specifies the MediaQueryList
     * @returns {void}
     * @hidden
     */
    public mediaQueryUpdate(columnIndex: number, e?: MediaQueryList): void {
        const col: Column = this.getColumns()[parseInt(columnIndex.toString(), 10)];
        if (this.mediaCol.some((mediaColumn: Column) => mediaColumn.uid === col.uid)) {
            col.visible = e.matches;
            if (this.isInitialLoad) {
                this.invokedFromMedia = true;
                if (col.visible) {
                    this.showHider.show(col.headerText, 'headerText');
                } else {
                    this.showHider.hide(col.headerText, 'headerText');
                }
            }
        }
    }
    private refreshMediaCol(): void {
        this.isInitialLoad = true;
        const footerContent: Element = this.element.querySelector('.' + literals.gridFooter);
        if (this.aggregates.length && this.element.scrollHeight > parseInt(this.height.toString(), 10) && footerContent) {
            addClass([footerContent], ['e-footerpadding']);
        }
        const columns: Column[] = this.enableColumnVirtualization ? (this.columns as Column[]) : this.getColumns();
        const checkboxColumn: Column[] = columns.filter((col: Column) => col.type === 'checkbox');
        if (checkboxColumn.length === 0 || checkboxColumn.length && this.selectionSettings.checkboxMode === 'ResetOnRowClick') {
            this.isCheckBoxSelection = false;
        }
        if (this.rowRenderingMode === 'Vertical') {
            if (this.enableHover) {
                this.setProperties({ enableAdaptiveUI: true, enableHover: false }, true);
                removeClass([this.element], 'e-gridhover');
            }
        }
        if (this.enableAdaptiveUI && this.scrollModule) {
            this.scrollModule.refresh();
        }
        if (this.isFrozenGrid() && this.isAutoGenerateColumns) {
            this.widthService.setWidthToColumns();
            this.isAutoGenerateColumns = false;
        }
    }

    private removeMediaListener(): void {
        for (let i: number = 0; i < this.mediaCol.length; i++) {
            this.media[this.mediaCol[parseInt(i.toString(), 10)].uid]
                .removeListener(this.mediaBindInstance[this.mediaCol[parseInt(i.toString(), 10)].index] as null);
        }
    }

    /**
     * For internal use only - Initialize the event handler
     *
     * @returns {void}
     * @private
     */
    protected eventInitializer(): void {
        //eventInitializer
    }

    /**
     * Destroys the component (detaches/removes all event handlers, attributes, classes, and empties the component element).
     *
     * @function destroy
     * @returns {void}
     */
    public destroy(): void {
        const gridElement: Element = this.element;
        if (!gridElement) { return; }
        const hasGridChild: boolean = gridElement.querySelector('.' + literals.gridHeader) &&
            gridElement.querySelector( '.' + literals.gridContent) ? true : false;
        if (hasGridChild) { this.unwireEvents(); }
        this.removeListener();
        this.removeMediaListener();
        this.notify(events.destroy, {});
        this.destroyDependentModules();
        if (this.isReact) {
            this.destroyTemplate(['template']);
        }
        if (this.isVue) {
            this.destroyTemplate();
        }
        if (hasGridChild) { super.destroy(); }
        this.toolTipObj.destroy();
        if (this.isReact && !Browser.isIE) {
            this.element.innerHTML = '';
        }
        const modules: string[] = ['renderModule', 'headerModule', 'contentModule', 'valueFormatterService',
            'serviceLocator', 'ariaService', 'keyboardModule', 'widthService', 'searchModule', 'showHider',
            'scrollModule', 'printModule', 'clipboardModule', 'focusModule'];
        for (let i: number = 0; i < modules.length; i++) {
            if (this[modules[parseInt(i.toString(), 10)]]) {
                this[modules[parseInt(i.toString(), 10)]] = null;
            }
        }
        this.element.innerHTML = '';
        classList(this.element, [], ['e-rtl', 'e-gridhover', 'e-responsive', 'e-default', 'e-device', 'e-grid-min-height']);
    }

    private destroyDependentModules(): void {
        const gridElement: Element = this.element;
        if (!gridElement || (!gridElement.querySelector('.' + literals.gridHeader) && !gridElement.querySelector( '.' + literals.gridContent))) { return; }
        this.scrollModule.destroy();
        this.keyboardModule.destroy();
        this.focusModule.destroy();
        this.clipboardModule.destroy();
        this.printModule.destroy();
    }

    /**
     * For internal use only - Get the module name.
     *
     * @returns {string} returns the module name
     * @private
     */
    protected getModuleName(): string {
        return 'grid';
    }

    private enableBoxSelection(): void {
        if (this.enableAutoFill) {
            this.selectionSettings.cellSelectionMode = 'BoxWithBorder';
            this.element.classList.add('e-afenabled');
        } else {
            this.element.classList.remove('e-afenabled');
            this.notify(events.destroyAutoFillElements, {});
        }
    }

    private setCSSClass(oldCSSClass: string): void {
        if (this.cssClass) {
            addClass([this.element], this.cssClass.split(' '));
        }
        if (oldCSSClass) {
            removeClass([this.element], oldCSSClass.split(' '));
        }
    }

    /**
     * Called internally if any of the property value changed.
     *
     * @param {GridModel} newProp - Defines new properties
     * @param {GridModel} oldProp - Defines old properties
     * @returns {void}
     * @hidden
     */
    public onPropertyChanged(newProp: GridModel, oldProp: GridModel): void {
        let requireRefresh: boolean = false;
        let requireGridRefresh: boolean = false;
        let freezeRefresh: boolean = false;
        let checkCursor: boolean; const args: Object = { requestType: 'refresh' };
        let childGridParent: Element = null;
        let parentInstance: IGrid = null;
        if (this.isDestroyed) { return; }
        this.log('module_missing');
        if (this.isEllipsisTooltip()) {
            this.toolTipObj.close();
        }
        const properties: string[] = Object.keys(newProp);
        if (properties.indexOf('columns') > -1) {
            if (this.enableColumnVirtualization) { this.columnModel = []; }
            this.updateColumnObject(); requireGridRefresh = true;
        }
        for (const prop of properties) {
            switch (prop) {
            case 'allowPaging':
                this.notify(events.uiUpdate, { module: 'pager', enable: this.allowPaging });
                requireRefresh = true;
                if (this.height === '100%') {
                    this.scrollModule.refresh();
                }
                this.getDataModule().clearCache();
                break;
            case 'pageSettings':
                if (this.pageTemplateChange) {
                    this.pageTemplateChange = false;
                    this.notify(events.inBoundModelChanged, { module: 'pager', properties: newProp.pageSettings });
                    break;
                }
                if (this.pagerModule && this.pagerModule.isCancel) {
                    this.pagerModule.isCancel = false;
                    return;
                }
                this.notify(events.inBoundModelChanged, { module: 'pager', properties: newProp.pageSettings });
                if (isNullOrUndefined(newProp.pageSettings.currentPage) && isNullOrUndefined(newProp.pageSettings.pageSize)
                    && isNullOrUndefined(newProp.pageSettings.totalRecordsCount)
                    || !isNullOrUndefined(oldProp.pageSettings) &&
                    ((newProp.pageSettings.currentPage !== oldProp.pageSettings.currentPage)
                        && !this.enableColumnVirtualization && !this.enableVirtualization && this.pageRequireRefresh
                        && this.pageSettings.totalRecordsCount <= this.pageSettings.pageSize)) { requireRefresh = true; }
                if (!this.pageRequireRefresh) { this.pageRequireRefresh = true; }
                if (this.pagerModule && this.pagerModule.isCancel) {
                    this.pagerModule.isCancel = false;
                }
                break;
            case 'allowSorting':
                this.notify(events.uiUpdate, { module: 'sort', enable: this.allowSorting });
                requireRefresh = true;
                checkCursor = true; break;
            case 'allowFiltering':
                this.updateStackedFilter();
                this.notify(events.uiUpdate, { module: 'filter', enable: this.allowFiltering });
                requireRefresh = true;
                if (this.filterSettings.type !== 'FilterBar' || (this.editSettings.showAddNewRow && this.filterSettings.type === 'FilterBar')) {
                    this.refreshHeader();
                } else {
                    if (this.height === '100%') {
                        this.scrollModule.refresh();
                    }
                } break;
            case 'height':
            case 'width':
                this.notify(events.uiUpdate, { module: 'scroll', properties: { width: newProp.width, height: newProp.height } });
                if (this.allowPaging) {
                    this.pagerModule.refresh();
                }
                break;
            case 'allowReordering':
                this.headerModule.refreshUI();
                checkCursor = true;
                break;
            case 'allowRowDragAndDrop':
                this.notify(events.uiUpdate, { module: 'rowDragAndDrop', enable: this.allowRowDragAndDrop });
                this.renderModule.refresh();
                this.headerModule.refreshUI();
                break;
            case 'allowSelection':
                this.notify(events.uiUpdate, { module: 'selection', enable: this.allowSelection });
                this.renderModule.refresh();
                break;
            case 'cssClass':
                this.setCSSClass(oldProp.cssClass);
                break;
            case 'enableAutoFill':
                if (this.selectionModule) {
                    this.enableBoxSelection();
                    this.selectionModule.updateAutoFillPosition();
                }
                break;
            case 'rowTemplate':
                this.rowTemplateFn = templateCompiler(this.rowTemplate);
                requireRefresh = true; break;
            case 'emptyRecordTemplate':
                this.emptyRecordTemplateFn = templateCompiler(this.emptyRecordTemplate);
                requireRefresh = true; break;
            case 'detailTemplate':
                this.detailTemplateFn = templateCompiler(this.detailTemplate);
                requireRefresh = true; break;
            case 'allowGrouping':
                this.notify(events.uiUpdate, { module: 'group', enable: this.allowGrouping });
                this.headerModule.refreshUI();
                requireRefresh = true;
                checkCursor = true;
                if (this.height === '100%') {
                    this.scrollModule.refresh();
                } break;
            case 'enableInfiniteScrolling':
            case 'childGrid':
                requireRefresh = true;
                childGridParent = this.parentDetails ? document.querySelector(`#${this.parentDetails.parentID}`) : null;
                parentInstance = childGridParent ? (childGridParent as EJ2Intance).ej2_instances[0] : null;
                if (this.childGrid  && parentInstance && isNullOrUndefined(parentInstance.childGrid.childGrid)) {
                    const childGridObject: GridModel = Object.assign({}, parentInstance.childGrid, { childGrid: newProp.childGrid });
                    parentInstance.setProperties({ childGrid: childGridObject }, true);
                    while (!isNullOrUndefined(parentInstance.parentDetails)) {
                        const currentParent: Element = document.querySelector(`#${parentInstance.parentDetails.parentID}`);
                        const currentParentInstance: IGrid = currentParent ? (currentParent as EJ2Intance).ej2_instances[0] : null;
                        if (currentParentInstance) {
                            const currentChildObject: GridModel = Object.assign({}, currentParentInstance.childGrid);
                            currentChildObject.childGrid = parentInstance.childGrid;
                            currentParentInstance.setProperties({ childGrid: currentChildObject }, true);
                        }
                        parentInstance = currentParentInstance;
                    }
                }
                this.headerModule.refreshUI();
                break;
            case 'toolbar':
                this.notify(events.uiUpdate, { module: 'toolbar' });
                if (this.height === '100%') {
                    this.scrollModule.refresh();
                } break;
            case 'groupSettings':
                this.notify(events.inBoundModelChanged, {
                    module: 'group', properties: newProp.groupSettings,
                    oldProperties: oldProp.groupSettings
                }); break;
            case 'aggregates':
                if (!this.aggregates.length && this.allowGrouping && this.groupSettings.columns.length) {
                    requireRefresh = true;
                }
                this.notify(events.uiUpdate, { module: 'aggregate', properties: newProp });
                if (this.height === '100%') {
                    this.scrollModule.refresh();
                } break;
            case 'frozenColumns':
            case 'frozenRows':
            case 'enableVirtualization':
            case 'enableColumnVirtualization':
            case 'currencyCode':
            case 'locale':
                if (this.isFrozenGrid()) {
                    this.log('frozen_rows_columns');
                }
                freezeRefresh = true;
                requireGridRefresh = true;
                this.addNewRowFocus = true;
                break;
            case 'query':
                if (!this.getDataModule().isQueryInvokedFromData) {
                    requireRefresh = true;
                }
                this.getDataModule().isQueryInvokedFromData = false;
                break;
            case 'autoFit':
                if (this.autoFit) {
                    this.preventAdjustColumns();
                } else {
                    this.restoreAdjustColumns();
                }
                break;
            default:
                this.extendedPropertyChange(prop, newProp, requireGridRefresh);
            }
        }
        if (checkCursor) { this.updateDefaultCursor(); }
        if (requireGridRefresh) {
            if (freezeRefresh || this.getFrozenColumns() || this.frozenRows
                || (this.frozenLeftColumns.length || this.frozenRightColumns.length)) {
                this.freezeRefresh();
            } else {
                this.refresh();
            }
        } else if (requireRefresh) {
            this.notify(events.modelChanged, args);
            requireRefresh = false;
            this.maintainSelection(newProp.selectedRowIndex);
        }
    }

    private extendedPropertyChange(prop: string, newProp: GridModel, requireGridRefresh: boolean): void {
        switch (prop) {
        case 'enableRtl':
            this.updateRTL();
            if (this.allowPaging) {
                (<EJ2Intance>this.element.querySelector('.e-gridpager')).ej2_instances[0].enableRtl = newProp.enableRtl;
                (<EJ2Intance>this.element.querySelector('.e-gridpager')).ej2_instances[0].dataBind();
            }
            if (this.height !== 'auto') {
                this.scrollModule.removePadding(!newProp.enableRtl);
                this.scrollModule.setPadding();
            }
            if (this.toolbar && this.toolbarModule) {
                (<EJ2Intance>this.toolbarModule.getToolbar()).ej2_instances[0].enableRtl = newProp.enableRtl;
                (<EJ2Intance>this.toolbarModule.getToolbar()).ej2_instances[0].dataBind();
            }
            if (this.contextMenuItems && this.contextMenuModule) {
                (<EJ2Intance>this.contextMenuModule.getContextMenu()).ej2_instances[0].enableRtl = newProp.enableRtl;
                (<EJ2Intance>this.contextMenuModule.getContextMenu()).ej2_instances[0].dataBind();
            }
            if (this.showColumnMenu && this.columnMenuModule && !this.enableAdaptiveUI) {
                (<EJ2Intance>this.columnMenuModule.getColumnMenu()).ej2_instances[0].enableRtl = newProp.enableRtl;
                (<EJ2Intance>this.columnMenuModule.getColumnMenu()).ej2_instances[0].dataBind();
            }
            if (this.filterSettings.type === 'FilterBar' && this.filterSettings.showFilterBarOperator) {
                this.refreshHeader();
            }
            this.notify(events.rtlUpdated, {}); break;
        case 'enableAltRow':
            this.renderModule.refresh(); break;
        case 'allowResizing':
            if (this.resizeModule) {
                this.resizeModule.render();
            }
            this.headerModule.refreshUI();
            this.updateResizeLines(); break;
        case 'rowHeight':
            if (this.rowHeight) {
                addClass([this.element], 'e-grid-min-height');
            } else {
                removeClass([this.element], 'e-grid-min-height');
            }
            this.renderModule.refresh();
            this.headerModule.refreshUI(); break;
        case 'gridLines':
            this.updateGridLines(); break;
        case 'showColumnMenu':
            this.headerModule.refreshUI();
            this.notify(events.uiUpdate, { module: 'columnMenu', enable: true }); break;
        case 'columnMenuItems':
            this.notify(events.uiUpdate, { module: 'columnMenu', enable: this.columnMenuItems }); break;
        case 'contextMenuItems':
            this.notify(events.uiUpdate, { module: 'contextMenu', enable: this.contextMenuItems }); break;
        case 'showColumnChooser':
            if (this.toolbarModule) {
                this.toolbarModule.refreshToolbarItems();
            }
            this.notify(events.uiUpdate, { module: 'columnChooser', enable: this.showColumnChooser }); break;
        case 'columnChooserSettings':
            this.notify(events.inBoundModelChanged, { module: 'columnChooser' }); break;
        case 'filterSettings':
            this.updateStackedFilter();
            this.notify(events.inBoundModelChanged, { module: 'filter', properties: newProp.filterSettings }); break;
        case 'searchSettings':
            this.notify(events.inBoundModelChanged, { module: 'search', properties: newProp.searchSettings }); break;
        case 'sortSettings':
            this.notify(events.inBoundModelChanged, { module: 'sort' }); break;
        case 'selectionSettings':
            this.notify(events.inBoundModelChanged, { module: 'selection', properties: newProp.selectionSettings }); break;
        case 'editSettings':
            this.notify(events.inBoundModelChanged, { module: 'edit', properties: newProp.editSettings }); break;
        case 'allowTextWrap':
        case 'textWrapSettings':
            if (this.allowTextWrap) {
                this.applyTextWrap();
            } else {
                this.removeTextWrap();
            }
            this.notify(events.freezeRender, { case: 'textwrap', isModeChg: (prop === 'textWrapSettings') });
            this.refreshHeader();
            if (this.height === '100%') {
                this.scrollModule.refresh();
            }
            break;
        case 'dataSource':
            // eslint-disable-next-line no-case-declarations
            const requestPendingState: PendingState = this.getDataModule().getState();
            if (this.allowPaging && this.pageSettings.pageSizes && !this.getDataModule().isRemote()
                && !(requestPendingState && requestPendingState.isPending)) {
                if (this.pagerModule.pagerObj.isAllPage) {
                    const count: number = this.dataSource instanceof DataManager ? (this.dataSource as DataManager).dataSource.json.length :
                        'result' in this.dataSource ? this.dataSource.count : (this.dataSource as Object[]).length;
                    const isAllPage: boolean = Array.isArray(this.pageSettings.pageSizes) &&
                        (this.pageSettings.pageSizes as Object[]).indexOf('All') > -1 ? true : (this.pageSettings.pageSizes as boolean);
                    if (!isAllPage && this.pageSettings.pageSize !== count) {
                        this.pagerModule.pagerObj.isAllPage = false;
                    } else {
                        this.setProperties({ pageSettings: { pageSize: count } }, true);
                        this.pagerModule.pagerObj.setProperties({ pageSize: count }, true);
                    }
                }
            }
            if (this.allowSelection && this.isPersistSelection && !(requestPendingState && requestPendingState.isPending)) {
                this.clearSelection();
            }
            this.partialSelectedRecords = [];
            this.partialSelectedIndexes = [];
            this.disableSelectedRecords = [];
            this.renderModule.selectableDataKey = {};
            this.renderModule.nonselectableDataKey = {};
            if (!isNullOrUndefined(this.dataSource) && (<DataResult>this.dataSource).result) {
                this.isVirtualAdaptive = false;
            }
            if (Object.getPrototypeOf(newProp).deepWatch) {
                const pKeyField: string = this.getPrimaryKeyFieldNames()[0];
                for (let i: number = 0, props: string[] = Object.keys(newProp.dataSource); i < props.length; i++) {
                    this.setRowData(
                        getValue(pKeyField, this.dataSource[props[parseInt(i.toString(), 10)]]),
                        this.dataSource[props[parseInt(i.toString(), 10)]]);
                }
            } else if (requestPendingState.isPending) {
                let gResult: Object = !isNullOrUndefined(this.dataSource) ? (<DataResult>this.dataSource).result : [];
                const names: string[] = (requestPendingState.group || []);
                if (names.length && !this.groupSettings.enableLazyLoading && !((gResult as Object[]).length && gResult[0].field)) {
                    for (let i: number = 0; i < names.length; i++) {
                        gResult = DataUtil.group(<Object[]>gResult, names[parseInt(i.toString(), 10)], requestPendingState.aggregates
                            || []);
                    }
                }
                this.dataSource = {
                    result: gResult as Object[] | Group[], count: (<DataResult>this.dataSource).count,
                    aggregates: (<DataResult>this.dataSource).aggregates
                };
                this.getDataModule().setState({});
                requestPendingState.resolver(this.dataSource);
            } else {
                if ((!isNullOrUndefined(this.dataSource) && (<DataResult>this.dataSource).result
                 && (<DataResult>this.dataSource).count && this.groupSettings.columns.length)) {
                    let gResult: Object = (<DataResult>this.dataSource).result;
                    const names: string[] = this.groupSettings.columns;
                    if (names.length && !((gResult as Object[]).length && gResult[0].field)) {
                        for (let i: number = 0; i < names.length; i++) {
                            gResult = DataUtil.group(<Object[]>gResult, names[parseInt(i.toString(), 10)]);
                        }
                    }
                    this.dataSource = {
                        result: gResult as Object[] | Group[], count: (<DataResult>this.dataSource).count
                    };
                }
                this.getDataModule().setState({ isDataChanged: false });
                this.notify(events.dataSourceModified, {});
                if (!requireGridRefresh) {
                    if (this.isRowSelectable && !this.isRemote()) {
                        const data: Object[] = this.getDataModule().dataManager.executeLocal(this.getDataModule().generateQuery(true));
                        this.renderModule.setPartialRecord(data);
                    }
                    this.renderModule.refresh();
                    if (this.isCheckBoxSelection) {
                        this.notify(events.beforeRefreshOnDataChange, {});
                    }
                }
            }
            this.scrollRefresh();
            break;
        case 'enableHover':
            // eslint-disable-next-line no-case-declarations
            const action: Function = newProp.enableHover ? addClass : removeClass;
            (<Function>action)([this.element], 'e-gridhover');
            break;
        case 'selectedRowIndex':
            if (!this.isSelectedRowIndexUpdating) {
                this.selectRow(newProp.selectedRowIndex);
            }
            this.isSelectedRowIndexUpdating = false; break;
        case 'resizeSettings':
            this.widthService.setWidthToTable(); break;
        case 'enableAdaptiveUI':
            this.notify(events.setFullScreenDialog, {});
            break;
        case 'rowRenderingMode':
            this.enableVerticalRendering();
            this.notify(events.rowModeChange, {});
            this.refresh();
            break;
        case 'enableStickyHeader':
            this.scrollModule.addStickyListener(newProp.enableStickyHeader);
            break;
        case 'allowPdfExport':
            if (this.toolbarModule) {
                this.toolbarModule.refreshToolbarItems();
            }
            break;
        case 'allowExcelExport':
            if (this.toolbarModule) {
                this.toolbarModule.refreshToolbarItems();
            }
            break;
        case 'enableRowSpan':
        case 'enableColumnSpan':
            this.refreshColumns();
            break;
        }
    }

    private maintainSelection(index: number): void {
        if (index !== -1) {
            const fn: Function = () => {
                this.selectRow(index);
                this.off(events.contentReady, fn);
            };
            this.on(events.contentReady, fn, this);
        }
    }

    /**
     * @param {Object} prop - Defines the property
     * @param {boolean} muteOnChange - Defines the mute on change
     * @returns {void}
     * @private
     */
    public setProperties(prop: Object, muteOnChange?: boolean): void {
        const previousGroupColumns: string[] = this.groupSettings.columns;
        super.setProperties(prop, muteOnChange);
        const filterSettings: string = 'filterSettings';
        const groupSettings: string = 'groupSettings';
        if (prop[`${filterSettings}`] && this.filterModule && muteOnChange) {
            this.filterModule.refreshFilter();
        }
        if (prop[`${groupSettings}`] && prop[`${groupSettings}`].columns && this.groupModule && muteOnChange) {
            if (!this.groupSettings.showGroupedColumn) {
                for (let i: number = 0; i < previousGroupColumns.length; i++) {
                    const column: Column = this.getColumnByField(previousGroupColumns[parseInt(i.toString(), 10)]);
                    column.visible = true;
                }
            }
            for (let i: number = 0; i < this.sortSettings.columns.length; i++) {
                const idx: number = previousGroupColumns.indexOf(this.sortSettings.columns[parseInt(i.toString(), 10)].field);
                if ( idx !== -1 && this.sortSettings.columns[parseInt(i.toString(), 10)].isFromGroup) {
                    this.sortSettings.columns.splice(i, 1);
                    i--;
                }
            }
            for (let i: number = 0; i < prop[`${groupSettings}`].columns.length; i++) {
                this.groupModule.groupAddSortingQuery(prop[`${groupSettings}`].columns[parseInt(i.toString(), 10)]);
                const column: Column = this.getColumnByField(prop[`${groupSettings}`].columns[parseInt(i.toString(), 10)]);
                column.visible = this.groupSettings.showGroupedColumn;
            }
        }
    }

    /**
     * @hidden
     * @returns {number} - Returns the tables count
     */
    public getTablesCount(): number {
        return this.tablesCount;
    }

    /**
     * @returns {boolean} - Returns whether the data source is remote or not
     * @hidden
     */
    public isRemote(): boolean {
        return (this.getDataModule().isRemote() || (!isNullOrUndefined(this.dataSource)
            && !isNullOrUndefined((<{result: object[]}>this.dataSource).result)));
    }

    /**
     * @hidden
     * @returns {void}
     */
    public updateDefaultCursor(): void {
        const headerCells: Element[] = [].slice.call(this.getHeaderContent().querySelectorAll('.e-headercell:not(.e-stackedheadercell)'));
        const stdHdrCell: Element[] = [].slice.call(this.getHeaderContent().getElementsByClassName('e-stackedheadercell'));
        const cols: Column[] = this.getColumns();
        for (let i: number = 0; i < headerCells.length; i++) {
            const cell: Element = headerCells[parseInt(i.toString(), 10)];
            const column: ColumnModel = cols[parseInt(i.toString(), 10)];
            if ((this.allowGrouping && column.allowGrouping) || (this.allowReordering && column.allowReordering)
                || (this.allowSorting && column.allowSorting)) {
                cell.classList.add('e-mousepointer');
            }
            else {
                cell.classList.add('e-defaultcursor');
            }
        }
        for (let count: number = 0; count < stdHdrCell.length; count++) {
            if (this.allowReordering) {
                stdHdrCell[parseInt(count.toString(), 10)].classList.add('e-mousepointer');
            }
        }
    }

    private updateColumnModel(columns: Column[], isRecursion?: boolean): void {
        for (let i: number = 0, len: number = (!isNullOrUndefined(columns) ? columns.length : 0); i < len; i++) {
            if (columns[parseInt(i.toString(), 10)].columns) {
                this.updateColumnModel(columns[parseInt(i.toString(), 10)].columns as Column[], true);
            } else {
                this.columnModel.push(columns[parseInt(i.toString(), 10)] as Column);
            }
        }
        if (isNullOrUndefined(isRecursion) || !isRecursion) {
            this.updateLockableColumns();
        }
    }

    public getFrozenLeftCount(): number {
        return this.getFrozenColumns() || this.getFrozenLeftColumnsCount();
    }

    public isFrozenGrid(): boolean {
        return this.getFrozenColumns() !== 0 || this.frozenLeftColumns.length !== 0 || this.frozenRightColumns.length !== 0 ||
            this.fixedColumns.length !== 0;
    }

    public getFrozenMode(): freezeMode {
        return this.frozenName;
    }

    private updateLockableColumns(): void {
        const cols: Column[] = this.columnModel;
        let frozenCount: number = 0;
        let movableCount: number = 0;
        const frozenColumns: number = this.getFrozenColumns();
        for (let i: number = 0; i < cols.length; i++) {
            if (cols[parseInt(i.toString(), 10)].lockColumn) {
                if (i < frozenColumns) {
                    cols.splice(frozenCount, 0, cols.splice(i, 1)[0]);
                    frozenCount++;
                } else {
                    cols.splice(frozenColumns + movableCount, 0, cols.splice(i, 1)[0]);
                    movableCount++;
                }
            }
        }
    }

    private checkLockColumns(cols: Column[]): void {
        for (let i: number = 0; i < cols.length; i++) {
            if (cols[parseInt(i.toString(), 10)].columns) {
                this.checkLockColumns(cols[parseInt(i.toString(), 10)].columns as Column[]);
            } else if (cols[parseInt(i.toString(), 10)].lockColumn) {
                this.lockcolPositionCount++;
            }
        }
    }

    /**
     * @param {string} position - specifies position
     * @returns {number} returns the width
     * @hidden
     */
    public leftrightColumnWidth(position?: string): number {
        const cols: Column[] = position === 'left' ? this.getFrozenLeftColumns() : position === 'right' ? this.getFrozenRightColumns() : [];
        let width: number = 0;
        cols.filter((col: Column) => {
            if (col.visible) {
                width += parseInt(col.width.toString(), 10);
            }
        });
        return width;
    }

    /**
     * Gets the columns from the Grid.
     *
     * @param {boolean} isRefresh - Defines the boolean whether to refresh
     * @returns {Column[]} - returns the column
     */
    public getColumns(isRefresh?: boolean): Column[] {
        const inview: number[] = this.inViewIndexes.map((v: number) => v - this.groupSettings.columns.length).filter((v: number) => v > -1);
        const vLen: number = inview.length;
        if (!this.enableColumnVirtualization || isNullOrUndefined(this.columnModel) || this.columnModel.length === 0 || isRefresh) {
            this.columnModel = [];
            this.updateColumnModel(this.columns as Column[]);
        }
        const columns: Column[] = vLen === 0 ? this.columnModel :
            this.getVisibleColumns().slice(inview[0], inview[vLen - 1] + 1);
        let left : Column[] = [];
        let right: Column[] = [];
        const movable: Column[] = [];
        const isLeftRightFrozen: boolean = this.enableColumnVirtualization && this.isPreparedFrozenColumns && vLen === 0;
        if (isLeftRightFrozen) {
            this.frozenRightColumns = [];
            this.frozenLeftColumns = [];
        }
        for (let i: number = 0; i < columns.length; i++) {
            if (columns[parseInt(i.toString(), 10)].freeze === 'Left' || columns[parseInt(i.toString(), 10)].isFrozen ) {
                left.push(columns[parseInt(i.toString(), 10)]);
                if (isLeftRightFrozen) {
                    this.frozenLeftColumns.push(columns[parseInt(i.toString(), 10)]);
                }
            }
            else if (columns[parseInt(i.toString(), 10)].freeze === 'Right') {
                right.push(columns[parseInt(i.toString(), 10)]);
                if (isLeftRightFrozen) {
                    this.frozenRightColumns.push(columns[parseInt(i.toString(), 10)]);
                }
            } else {
                movable.push(columns[parseInt(i.toString(), 10)]);
            }
        }
        if (this.enableColumnVirtualization && this.isFrozenGrid()) {
            if (this.frozenLeftColumns.length) {
                left = this.frozenLeftColumns;
            }
            if (this.frozenRightColumns.length) {
                right = this.frozenRightColumns;
            }
        }
        return left.concat(movable).concat(right);
    }

    /**
     * @private
     * @param {string} stackedHeader - Defines the stacked header
     * @param {Column[]} col - Defines the column
     * @returns {Column} Returns the Column
     */
    public getStackedHeaderColumnByHeaderText(stackedHeader: string, col: Column[]): Column {
        for (let i: number = 0; i < col.length; i++) {
            const individualColumn: Column = col[parseInt(i.toString(), 10)];
            if (individualColumn.field === stackedHeader || individualColumn.headerText === stackedHeader) {
                this.stackedColumn = individualColumn;
                break;
            } else if (individualColumn.columns) {
                this.getStackedHeaderColumnByHeaderText(stackedHeader, <Column[]>individualColumn.columns);
            }
        }
        return this.stackedColumn;
    }

    /**
     * @private
     * @returns {number[]} Returns the column indexes
     */
    public getColumnIndexesInView(): number[] {
        return this.inViewIndexes;
    }

    /**
     * @private
     * @returns {Query} - returns the query
     */
    public getQuery(): Query {
        return this.query;
    }

    /**
     * @private
     * @returns {object} - returns the locale constants
     */
    public getLocaleConstants(): Object {
        return this.defaultLocale;
    }


    /**
     * @param {number[]} indexes - specifies the indexes
     * @returns {void}
     * @private
     */
    public setColumnIndexesInView(indexes: number[]): void {
        this.inViewIndexes = indexes;
    }

    /**
     * Gets the visible columns from the Grid.
     *
     * @returns {Column[]} returns the column
     */
    public getVisibleColumns(): Column[] {
        return this.getCurrentVisibleColumns();
    }

    /**
     * Gets the header div of the Grid.
     *
     * @returns {Element} - Returns the element
     */
    public getHeaderContent(): Element {
        return this.headerModule.getPanel();
    }

    /**
     * Sets the header div of the Grid to replace the old header.
     *
     * @param  {Element} element - Specifies the Grid header.
     *
     * @returns {void}
     */
    public setGridHeaderContent(element: Element): void {
        this.headerModule.setPanel(element);
    }

    /**
     * Gets the content table of the Grid.
     *
     * @returns {Element} - Returns the element
     */
    public getContentTable(): Element {
        return this.contentModule.getTable();
    }

    /**
     * Sets the content table of the Grid to replace the old content table.
     *
     * @param  {Element} element - Specifies the Grid content table.
     *
     * @returns {void}
     */
    public setGridContentTable(element: Element): void {
        this.contentModule.setTable(element);
    }

    /**
     * Gets the content div of the Grid.
     *
     * @returns {Element} Returns the element
     */
    public getContent(): Element {
        return this.contentModule.getPanel();
    }

    /**
     * Sets the content div of the Grid to replace the old Grid content.
     *
     * @param  {Element} element - Specifies the Grid content.
     *
     * @returns {void}
     */
    public setGridContent(element: Element): void {
        this.contentModule.setPanel(element);
    }

    /**
     * Gets the header table element of the Grid.
     *
     * @returns {Element} returns the element
     */
    public getHeaderTable(): Element {
        return this.headerModule.getTable();
    }

    /**
     * Sets the header table of the Grid to replace the old one.
     *
     * @param  {Element} element - Specifies the Grid header table.
     *
     * @returns {void}
     */
    public setGridHeaderTable(element: Element): void {
        this.headerModule.setTable(element);
    }

    /**
     * Gets the footer div of the Grid.
     *
     * @returns {Element} returns the element
     */
    public getFooterContent(): Element {
        this.footerElement = this.element.getElementsByClassName(literals.gridFooter)[0];
        return this.footerElement;
    }

    /**
     * Gets the footer table element of the Grid.
     *
     * @returns {Element} returns the element
     */
    public getFooterContentTable(): Element {
        this.footerElement = this.element.getElementsByClassName(literals.gridFooter)[0];
        return <Element>this.footerElement.firstChild.firstChild;
    }


    /**
     * Gets the pager of the Grid.
     *
     * @returns {Element} returns the element
     */
    public getPager(): Element {
        return this.gridPager; //get element from pager
    }

    /**
     * Sets the pager of the Grid to replace the old pager.
     *
     * @param  {Element} element - Specifies the Grid pager.
     *
     * @returns {void}
     */
    public setGridPager(element: Element): void {
        this.gridPager = element;
    }

    /**
     * Gets a row by index.
     *
     * @param  {number} index - Specifies the row index.
     *
     * @returns {Element} returns the element
     */
    public getRowByIndex(index: number): Element {
        if (this.enableVirtualization && this.groupSettings.enableLazyLoading) {
            return this.lazyLoadRender.getRowByIndex(index);
        } else {
            return this.contentModule.getRowByIndex(index);
        }
    }

    /**
     * Gets a movable tables row by index.
     *
     * @param  {number} index - Specifies the row index.
     *
     * @returns {Element} returns the element
     * @deprecated This method has been marked as deprecated. It is recommended to utilize the `getRowByIndex()` method instead, and apply the `e-unfreeze` class to select the movable cell within the tr element.
     */
    public getMovableRowByIndex(index: number): Element {
        return this.contentModule.getRowByIndex(index);
    }

    /**
     * Gets a frozen tables row by index.
     *
     * @param  {number} index - Specifies the row index.
     * @returns {Element} returns the element
     * @deprecated This method has been marked as deprecated. It is recommended to utilize the `getRowByIndex()` method instead, and apply the `e-leftfreeze` class to select the frozen cell within the tr element.
     */
    public getFrozenRowByIndex(index: number): Element {
        return this.contentModule.getRowByIndex(index);
    }

    /**
     * Gets all the data rows of the Grid.
     *
     * @returns {Element[]} returns the element
     */
    public getRows(): Element[] {
        return this.contentModule.getRowElements();
    }

    /**
     * Gets a frozen right tables row element by index.
     *
     * @param  {number} index - Specifies the row index.
     * @returns {Element} returns the element
     * @deprecated This method has been marked as deprecated. It is recommended to utilize the `getRowByIndex()` method instead, and apply the `e-rightfreeze` class to select the frozen right cell within the tr element.
     */
    public getFrozenRightRowByIndex(index: number): Element {
        return this.contentModule.getRowByIndex(index);
    }

    /**
     * Get a row information based on cell
     *
     * @param {Element | EventTarget} target - specifies the element
     *
     * @returns {RowInfo} returns the row info
     */
    public getRowInfo(target: Element | EventTarget): RowInfo {
        const ele: Element = target as Element;
        let args: Object = { target: target };
        if (!isNullOrUndefined(target) && isNullOrUndefined(parentsUntil(ele, 'e-detailrowcollapse')
            && isNullOrUndefined(parentsUntil(ele, 'e-recordplusexpand')))) {
            const cell: Element = closest(ele, '.' + literals.rowCell);
            if (!cell) {
                const row: Element = closest(ele, '.' + literals.row);
                if (!isNullOrUndefined(row) && !row.classList.contains('e-addedrow')) {
                    const rowObj: Row<Column> = this.getRowObjectFromUID(row.getAttribute('data-uid'));
                    const rowIndex: number = parseInt(row.getAttribute(literals.ariaRowIndex), 10) - 1;
                    args = { row: row, rowData: rowObj.data, rowIndex: rowIndex };
                }
                return args;
            }
            const cellIndex: number = parseInt(cell.getAttribute(literals.ariaColIndex), 10) - 1;
            const row: Element = closest(cell, '.' + literals.row);
            if (!isNullOrUndefined(cell) && !isNaN(cellIndex) && !isNullOrUndefined(row)) {
                const rowIndex: number = parseInt(row.getAttribute(literals.ariaRowIndex), 10) - 1;
                const rows: Row<{}>[] = <Row<{}>[]>this.contentModule.getRows();
                const index: number = cellIndex + this.getIndentCount();
                let rowsObject: Object = rows.filter((r: Row<{}>) => r.uid === row.getAttribute('data-uid'));
                if (this.pinnedTopRowModels.length && !isNullOrUndefined(target) && parentsUntil(ele, 'e-headercontent')) {
                    rowsObject = this.pinnedTopRowModels.filter((r: Row<{}>) => r.uid === row.getAttribute('data-uid'));
                }
                let rowData: Object = {};
                let column: Column;
                if (Object.keys(rowsObject).length) {
                    rowData = rowsObject[0].data;
                    column = rowsObject[0].cells[parseInt(index.toString(), 10)].column as Column;
                }
                args = { cell: cell, cellIndex: cellIndex, row: row, rowIndex: rowIndex, rowData: rowData, column: column, target: target };
            }
        }
        return args;
    }

    /**
     * Gets the Grid's movable content rows from frozen grid.
     *
     * @returns {Element[]} returns the element
     * @deprecated This method has been marked as deprecated. It is recommended to utilize the `getRows()` method instead, and apply the `e-unfreeze` class to select the movable cell within the tr element.
     */
    public getMovableRows(): Element[] {
        return this.contentModule.getRowElements();
    }

    /**
     * Gets the Grid's frozen right content rows from frozen grid.
     *
     * @returns {Element[]} returns the element
     * @deprecated This method has been marked as deprecated. It is recommended to utilize the `getRows()` method instead, and apply the `e-rightfreeze` class to select the frozen right cell within the tr element.
     */
    public getFrozenRightRows(): Element[] {
        return this.contentModule.getRowElements();
    }

    /**
     * Gets all the Grid's data rows.
     *
     * @returns {Element[]} returns the element
     */
    public getDataRows(): Element[] {
        return this.getAllDataRows();
    }

    /**
     * @param {boolean} includeAdd - specifies includeAdd
     * @returns {Element[]} returns the element
     * @hidden
     */
    public getAllDataRows(includeAdd?: boolean): Element[] {
        if (isNullOrUndefined(this.getContentTable().querySelector( literals.tbody))) { return []; }
        const tbody: Element = this.getContentTable().querySelector(literals.tbody);
        let rows: HTMLElement[] = [].slice.call(tbody.children);
        if (this.editSettings.showAddNewRow) {
            if (rows[0].classList.contains('e-addedrow')) {
                rows.shift();
            } else if (rows[rows.length - 1].classList.contains('e-addedrow')) {
                rows.pop();
            }
        }
        if (this.frozenRows || this.pinnedTopRowModels.length) {
            const hdrTbody: Element = this.getHeaderTable().querySelector( literals.tbody);
            const freezeRows: HTMLElement[] = [].slice.call(hdrTbody.children);
            rows = this.addMovableRows(freezeRows, rows);
            if (this.editSettings.showAddNewRow && freezeRows[0].classList.contains('e-addedrow')) {
                freezeRows.shift();
            }
        }
        const dataRows: Element[] = this.generateDataRows(rows, includeAdd);
        return dataRows;
    }

    /**
     * @param {HTMLElement[]} fRows - Defines the frozen Rows
     * @param {HTMLElement[]} mrows - Defines the movable Rows
     * @returns {HTMLElement[]} Returns the element
     * @hidden
     */
    public addMovableRows(fRows: HTMLElement[], mrows: HTMLElement[]): HTMLElement[] {
        for (let i: number = 0, len: number = mrows.length; i < len; i++) {
            fRows.push(mrows[parseInt(i.toString(), 10)]);
        }
        return fRows;
    }

    private generateDataRows(rows: HTMLElement[], includAdd?: boolean): Element[] {
        const dRows: Element[] = [];
        for (let i: number = 0, len: number = rows.length; i < len; i++) {
            if (rows[parseInt(i.toString(), 10)].classList.contains(literals.row)
                && (!rows[parseInt(i.toString(), 10)].classList.contains('e-hiddenrow') || includAdd)) {
                if (this.isCollapseStateEnabled()) {
                    dRows[parseInt(rows[parseInt(i.toString(), 10)].getAttribute('aria-rowindex'), 10) - 1] = rows[parseInt(i.toString(), 10)];
                } else {
                    dRows.push(rows[parseInt(i.toString(), 10)] as Element);
                }
            }
        }
        return dRows;
    }

    /**
     * Gets all the Grid's movable table data rows.
     *
     * @returns {Element[]} Returns the element
     * @deprecated This method has been marked as deprecated. It is recommended to utilize the `getDataRows()` method instead, and apply the `e-unfreeze` class to select the movable cell within the tr element.
     */
    public getMovableDataRows(): Element[] {
        return this.getAllMovableDataRows();
    }

    /**
     * @param {boolean} includeAdd Defines the include add in boolean
     * @returns {Element[]} Returns the element
     * @deprecated This method has been marked as deprecated. It is recommended to utilize the `getAllDataRows()` method instead, and apply the `e-unfreeze` class to select the movable cell within the tr element.
     * @hidden
     */
    public getAllMovableDataRows(includeAdd?: boolean): Element[] {
        return this.getAllDataRows(includeAdd);
    }

    /**
     * Gets all the Grid's frozen table data rows.
     *
     * @returns {Element[]} returns the element
     * @deprecated This method has been marked as deprecated. It is recommended to utilize the `getDataRows()` method instead, and apply the `e-leftfreeze` class to select the frozen cell within the tr element.
     */
    public getFrozenDataRows(): Element[] {
        return this.getAllFrozenDataRows();
    }

    /**
     * @param {boolean} includeAdd Defines the include add in boolean
     * @returns {Element[]} Returns the element
     * @deprecated This method has been marked as deprecated. It is recommended to utilize the `getAllDataRows()` method instead, and apply the `e-leftfreeze` class to select the frozen cell within the tr element.
     * @hidden
     */
    public getAllFrozenDataRows(includeAdd?: boolean): Element[] {
        return this.getAllDataRows(includeAdd);
    }

    /**
     * Gets all the Grid's frozen right table data rows.
     *
     * @returns {Element[]} Returns the Element
     * @deprecated This method has been marked as deprecated. It is recommended to utilize the `getDataRows()` method instead, and apply the `e-rightfreeze` class to select the frozen right cell within the tr element.
     */
    public getFrozenRightDataRows(): Element[] {
        return this.getAllFrozenRightDataRows();
    }

    /**
     * @param {boolean} includeAdd Defines the include add in boolean
     * @returns {Element[]} Returns the element
     * @deprecated This method has been marked as deprecated. It is recommended to utilize the `getAllDataRows()` method instead, and apply the `e-rightfreeze` class to select the frozen right cell within the tr element.
     * @hidden
     */
    public getAllFrozenRightDataRows(includeAdd?: boolean): Element[] {
        return this.getAllDataRows(includeAdd);
    }

    /**
     * Updates particular cell value based on the given primary key value.
     * > Primary key column must be specified using `columns.isPrimaryKey` property.
     *
     * @param {string| number} key - Specifies the PrimaryKey value of dataSource.
     * @param {string } field - Specifies the field name which you want to update.
     * @param {string | number | boolean | Date} value - To update new value for the particular cell.
     *
     * @returns {void}
     */
    public setCellValue(key: string | number, field: string, value: string | number | boolean | Date | null): void {
        const cells: string = 'cells';
        const rowData: string = 'data';
        const rowIdx: string = 'index';
        const rowuID: string = 'uid';
        const pkName: string = this.getPrimaryKeyFieldNames()[0];
        const cell: CellRenderer = new CellRenderer(this, this.serviceLocator);
        let fieldIdx: number = this.getColumnIndexByField(field);
        const col: Column = this.getColumnByField(field);
        const rowObjects: Object = this.contentModule.getRows();
        const selectedRow: Object = (<Row<{}>[]>rowObjects).filter((r: Row<{}>) =>
            getValue(pkName, r.data) === key)[0];
        const tr: Element = selectedRow ? this.element.querySelector('[data-uid=' + selectedRow[`${rowuID}`] + ']') : null;
        if (!isNullOrUndefined(tr)) {
            if (typeof value === 'string') {
                value = this.sanitize(value);
            }
            setValue(field, value, selectedRow[`${rowData}`]);
            let td: Element = this.enableVirtualization ? tr.children[parseInt(fieldIdx.toString(), 10)]
                : this.getCellFromIndex(selectedRow[`${rowIdx}`], fieldIdx);
            if (!isNullOrUndefined(td)) {
                const Idx: number = 0;
                if (this.groupSettings.columns.length) {
                    fieldIdx = fieldIdx + this.groupSettings.columns.length;
                }
                if (this.childGrid || this.detailTemplate) {
                    fieldIdx++;
                }
                if (this.isRowDragable()) {
                    fieldIdx++;
                }
                const sRow: Cell<Column> = selectedRow[`${cells}`][fieldIdx - Idx];
                cell.refreshTD(td, sRow, selectedRow[`${rowData}`], { index: selectedRow[`${rowIdx}`] });
                if (this.isReact) {
                    td = this.enableVirtualization ? tr.children[parseInt(fieldIdx.toString(), 10)]
                        : this.getCellFromIndex(selectedRow[`${rowIdx}`], fieldIdx);
                }
                if (this.aggregates.length > 0) {
                    this.notify(events.refreshFooterRenderer, {});
                    if (this.groupSettings.columns.length > 0) {
                        this.notify(events.groupAggregates, {});
                    }
                }
                /* tslint:disable:no-string-literal */
                if (!isNullOrUndefined(selectedRow) && !isNullOrUndefined(selectedRow['changes'])) {
                    selectedRow['changes'][`${field}`] = value;
                }
                /* tslint:disable:no-string-literal */
                this.trigger(events.queryCellInfo, {
                    cell: td, column: col, data: selectedRow[`${rowData}`]
                });
                if (this.isReact && td.getAttribute('tabindex') === '0' && td.classList.contains('e-focused')) {
                    (td as HTMLElement).focus();
                }
            }
        } else {
            return;
        }
    }

    /**
     * @param {string} columnUid - Defines column uid
     * @param {boolean} renderTemplates - Defines renderTemplates need to invoke
     * @returns {void}
     * @hidden
     */
    public refreshReactColumnTemplateByUid(columnUid: string, renderTemplates?: boolean): void {
        if (this.isReact) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (this as any).clearTemplate(['columnTemplate'], undefined, () => {
                const isChildGrid: boolean = this.childGrid && this.element.querySelectorAll('.e-childgrid').length ? true : false;
                const rows: Element[] | NodeListOf<Element> = isChildGrid ? this.getContentTable().querySelectorAll('.e-row') :
                    this.getDataRows();
                this.refreshReactTemplateTD(rows, isChildGrid);
                if (renderTemplates) {
                    this.renderTemplates();
                }
            });
        }
    }

    /**
     * @param {Element[] | NodeListOf<Element>} rows - Defines the rows
     * @param {boolean} isChildGrid - Defines whether it is a Hierarchy Grid.
     * @param {boolean} isFrozen - Defines whether it is a Frozen Grid
     * @returns {void}
     * @hidden
     */
    public refreshReactTemplateTD (rows?: Element[] | NodeListOf<Element>, isChildGrid?: boolean, isFrozen?: boolean): void {
        const cells: string = 'cells';
        const rowIdx: string = 'index';
        const indent: number = this.getIndentCount();
        let childIndent: number = 0;
        let isChildRow: boolean =  false;
        for (let j: number = 0; j < rows.length; j++) {
            let rowsObj: Row<Column> = this.getRowObjectFromUID(rows[parseInt(j.toString(), 10)].getAttribute('data-uid'));
            if (isChildGrid && !rowsObj && parentsUntil(rows[parseInt(j.toString(), 10)], 'e-childgrid')) {
                const gridObj: IGrid = (parentsUntil(rows[parseInt(j.toString(), 10)], 'e-childgrid') as EJ2Intance).ej2_instances[0];
                rowsObj = gridObj.getRowObjectFromUID(rows[parseInt(j.toString(), 10)].getAttribute('data-uid'));
                childIndent  = gridObj.getIndentCount();
                isChildRow = true;
            }
            if (rowsObj && rowsObj.isDataRow && !isNullOrUndefined(rowsObj.index) &&
                !rows[parseInt(j.toString(), 10)].classList.contains('e-editedrow')) {
                for (let i: number = 0; i < rowsObj[`${cells}`].length; i++) {
                    const cell: Cell<Column> = rowsObj[`${cells}`][parseInt(i.toString(), 10)];
                    if (cell.isTemplate) {
                        const cellRenderer: CellRenderer = new CellRenderer(this as IGrid, this.serviceLocator);
                        const td: Element = isChildGrid ? rows[parseInt(j.toString(), 10)]
                            .children[cell.index + (isChildRow ? childIndent : indent)] : this.getCellFromIndex(
                            j, isFrozen ? cell.index : i - indent);
                        cellRenderer.refreshTD(td, cell, rowsObj.data, { index: rowsObj[`${rowIdx}`] });
                    }
                }
            }
            isChildRow = false;
        }
    }

    /**
     * @returns {void}
     * @hidden
     */
    public refreshGroupCaptionFooterTemplate(): void {
        const isChildGrid: boolean = this.childGrid && this.element.querySelectorAll('.e-childgrid').length ? true : false;
        const rows: NodeListOf<Element> = this.getContentTable().querySelectorAll('.e-groupcaptionrow, .e-groupfooterrow');
        for (let i: number = 0; i < rows.length; i++) {
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            let gridObj: IGrid = this;
            let rowsObj: Row<Column> = this.getRowObjectFromUID(rows[parseInt(i.toString(), 10)].getAttribute('data-uid'));
            if (isChildGrid && !rowsObj && parentsUntil(rows[parseInt(i.toString(), 10)], 'e-childgrid')) {
                gridObj = (parentsUntil(rows[parseInt(i.toString(), 10)], 'e-childgrid') as EJ2Intance).ej2_instances[0];
                rowsObj = gridObj.getRowObjectFromUID(rows[parseInt(i.toString(), 10)].getAttribute('data-uid'));
            }
            if (rowsObj) {
                const cells: Object[] = rowsObj.cells.filter((cell: Cell<{}>) => cell.isDataCell);
                const args: Object = { cells: cells, data: rowsObj.data, dataUid: rowsObj.uid };
                gridObj.notify(events.refreshAggregateCell, args);
            }
        }
    }

    /**
     * @param {string} columnUid - Defines column uid
     * @returns {void}
     * @hidden
     */
    public refreshReactHeaderTemplateByUid(columnUid: string): void {
        if (this.isReact) {
            const cells: string = 'cells';
            const rowsObj: Row<Column>[] = (<{ rows?: Row<Column>[] }>this.headerModule).rows;
            const cellIndex: number = this.getNormalizedColumnIndex(columnUid);
            for (let j: number = 0; j < rowsObj.length; j++) {
                const cell: Cell<Column> = rowsObj[parseInt(j.toString(), 10)][`${cells}`][parseInt(cellIndex.toString(), 10)];
                if (cell && cell.column.uid === columnUid) {
                    const headerCellRenderer: HeaderCellRenderer = new HeaderCellRenderer(this, this.serviceLocator);
                    const td: Element = parentsUntil(this.element.querySelectorAll('[data-mappinguid=' + columnUid + ']')[0], 'e-templatecell');
                    headerCellRenderer.refresh(cell, td);
                    const cols: SortDescriptorModel[] = this.sortSettings.columns;
                    const columnIndex: number = cols.findIndex(function (col: SortDescriptorModel): boolean { return col.field === cell
                        .column.field; });
                    if (columnIndex !== -1) {
                        const header: Element = this.getColumnHeaderByField(cell.column.field);
                        this.ariaService.setSort(<HTMLElement>header,
                                                 (cols[parseInt(columnIndex.toString(), 10)].direction).toLowerCase() as SortDirection);
                        if (cols.length > 1) {
                            header.querySelector('.e-headercelldiv').insertBefore(
                                this.createElement('span', { className: 'e-sortnumber', innerHTML: (columnIndex + 1).toString() }),
                                header.querySelector('.e-headertext'));
                        }
                        const filterElement: Element = header.querySelector('.e-sortfilterdiv');
                        if (cols[parseInt(columnIndex.toString(), 10)].direction === 'Ascending') {
                            classList(filterElement, ['e-ascending', 'e-icon-ascending'], []);
                        } else {
                            classList(filterElement, ['e-descending', 'e-icon-descending'], []);
                        }
                    }
                }
            }
        }
    }

    /**
     * Updates and refresh the particular row values based on the given primary key value.
     * > Primary key column must be specified using `columns.isPrimaryKey` property.
     *
     * @param {string| number} key - Specifies the PrimaryKey value of dataSource.
     * @param {Object} rowData - To update new data for the particular row.
     *
     * @returns {void}
     */
    public setRowData(key: string | number, rowData?: Object): void {
        const rowuID: string = 'uid';
        let rowObjects: Object = this.contentModule.getRows();
        const pkName: string = this.getPrimaryKeyFieldNames()[0];
        if (this.groupSettings.columns.length > 0 && this.aggregates.length > 0) {
            rowObjects = (<Row<{}>[]>rowObjects).filter((row: Row<{}>) => row.isDataRow);
        }
        const selectedRow: Row<Column> = (<Row<{}>[]>rowObjects).filter((r: Row<{}>) =>
            getValue(pkName, r.data) === key)[0] as Row<Column>;
        const selectRowEle: Element[] = selectedRow ? [].slice.call(
            this.element.querySelectorAll('[data-uid=' + selectedRow[`${rowuID}`] + ']')) : undefined;
        if (!isNullOrUndefined(selectedRow) && selectRowEle.length) {
            selectedRow.changes = rowData;
            if (this.frozenRows) {
                const fRowTr: Row<Column> = this.getRowsObject()[selectedRow.index];
                this.setFrozenRowData(fRowTr, rowData);
            }
            else{
                const rowElement: Element = this.getRowElementByUID(selectedRow.uid);
                const isLastRowCell: boolean = rowElement && rowElement.querySelector('.e-lastrowcell') ? true : false;
                this.setFrozenRowData(selectedRow, rowData);
                if (isLastRowCell) {
                    this.scrollModule.setLastRowCell();
                }
            }
            if (this.aggregates.length > 0) {
                this.notify(events.refreshFooterRenderer, {});
                if (this.groupSettings.columns.length > 0) {
                    this.notify(events.groupAggregates, {});
                }
            }
        } else {
            return;
        }
    }

    private setFrozenRowData(fTr: Row<Column>, rowData: Object): void {
        const rowRenderer: RowRenderer<Column> = new RowRenderer<Column>(this.serviceLocator, null, this);
        fTr.changes = rowData;
        refreshForeignData(fTr, this.getForeignKeyColumns(), fTr.changes);
        rowRenderer.refresh(fTr, this.getColumns() as Column[], true);
    }

    /**
     * Gets a cell by row and column index.
     *
     * @param  {number} rowIndex - Specifies the row index.
     * @param  {number} columnIndex - Specifies the column index.
     *
     * @returns {Element} Returns the Element
     */
    public getCellFromIndex(rowIndex: number, columnIndex: number): Element {
        const col: Column = this.getColumnByIndex(columnIndex);
        return getCellByColAndRowIndex(this, col, rowIndex, columnIndex);
    }

    /**
     * Gets a movable table cell by row and column index.
     *
     * @param  {number} rowIndex - Specifies the row index.
     * @param  {number} columnIndex - Specifies the column index.
     *
     * @returns {Element} Returns the Element
     * @deprecated This method is deprecated. Use `getCellFromIndex()` method instead
     */
    public getMovableCellFromIndex(rowIndex: number, columnIndex: number): Element {
        return this.getCellFromIndex(rowIndex, columnIndex);
    }

    /**
     * Gets a frozen right table cell by row and column index.
     *
     * @param  {number} rowIndex - Specifies the row index.
     * @param  {number} columnIndex - Specifies the column index.
     * @returns {Element} Returns the Element
     * @deprecated This method is deprecated. Use `getCellFromIndex()` method instead.
     */
    public getFrozenRightCellFromIndex(rowIndex: number, columnIndex: number): Element {
        return this.getCellFromIndex(rowIndex, columnIndex);
    }


    /**
     * Gets a column header by column index.
     *
     * @param  {number} index - Specifies the column index.
     *
     * @returns {Element} Returns the Element
     */
    public getColumnHeaderByIndex(index: number): Element {
        return this.getHeaderTable().getElementsByClassName('e-headercell')[parseInt(index.toString(), 10)];
    }

    /**
     * Gets a movable column header by column index.
     *
     * @param  {number} index - Specifies the column index.
     * @returns {Element} Returns the Element
     * @deprecated This method is deprecated. Use `getColumnHeaderByIndex()` method instead.
     */
    public getMovableColumnHeaderByIndex(index: number): Element {
        return this.getColumnHeaderByIndex(index);
    }

    /**
     * Gets a frozen right column header by column index.
     *
     * @param  {number} index - Specifies the column index.
     * @returns {Element} Returns the Element
     * @deprecated This method is deprecated. Use `getColumnHeaderByIndex()` method instead.
     */
    public getFrozenRightColumnHeaderByIndex(index: number): Element {
        return this.getColumnHeaderByIndex(index);
    }

    /**
     * Gets a frozen left column header by column index.
     *
     * @param  {number} index - Specifies the column index.
     * @returns {Element} Returns the Element
     * @deprecated This method is deprecated. Use `getColumnHeaderByIndex()` method instead.
     */
    public getFrozenLeftColumnHeaderByIndex(index: number): Element {
        return this.getColumnHeaderByIndex(index);
    }

    /**
     * @param {string} uid - Defines the uid
     * @returns {Row<Column>} Returns the row object
     * @hidden
     */
    public getRowObjectFromUID(uid: string): Row<Column> {
        const rows: Row<Column>[] = this.contentModule.getRows() as Row<Column>[];
        let row: Row<Column> = this.rowObject(rows, uid);
        if (isNullOrUndefined(row) && this.pinnedTopRowModels.length) {
            const rows: Row<Column>[] = this.pinnedTopRowModels;
            row = this.rowObject(rows, uid);
            if (!isNullOrUndefined(row)) {
                return row;
            }
        }
        if (isNullOrUndefined(row) && this.enableVirtualization && this.groupSettings.columns.length > 0) {
            row = this.rowObject(this.vRows as Row<Column>[], uid);
            return row;
        }
        return row;
    }

    private rowObject(rows: Row<Column>[], uid: string): Row<Column> {
        if (rows) {
            for (const row of rows) {
                if (row.uid === uid) {
                    return row;
                }
            }
        }
        return null;
    }

    /**
     * Get an array of row objects.
     *
     * @returns {Row<Column>[]} Returns the Row object
     */
    public getRowsObject(): Row<Column>[] {
        return this.contentModule.getRows() as Row<Column>[];
    }

    /**
     * @hidden
     * @returns {Row<Column>[]} Returns the Row object
     * @deprecated  This method is deprecated. Use `getRowsObject()` method instead.
     */
    public getMovableRowsObject(): Row<Column>[] {
        return this.contentModule.getRows() as Row<Column>[];
    }

    /**
     * @hidden
     * @returns {Row<Column>[]} Returns the Row object
     * @deprecated This method is deprecated. Use `getRowsObject()` method instead.
     */
    public getFrozenRightRowsObject(): Row<Column>[] {
        return this.contentModule.getRows() as Row<Column>[];
    }

    /**
     * Gets a column header by column name.
     *
     * @param  {string} field - Specifies the column name.
     *
     * @returns {Element} - Returns the element
     */
    public getColumnHeaderByField(field: string): Element {
        const column: Column = this.getColumnByField(field);
        return column ? this.getColumnHeaderByUid(column.uid) : undefined;
    }

    /**
     * Gets a column header by UID.
     *
     * @param {string} uid - Specifies the column uid.
     *
     * @returns {Element} - Returns the element
     */
    public getColumnHeaderByUid(uid: string): Element {
        const element: Element = this.getHeaderContent().querySelector('[data-mappinguid=' + uid + ']');
        return element ? closest(element, 'th') : undefined;
    }

    /**
     * @hidden
     * @param {number} index - Defines the index
     * @returns {Column} Returns the column
     */
    public getColumnByIndex(index: number): Column {
        let column: Column;
        this.getColumns().some((col: Column, i: number) => {
            column = col;
            return i === index;
        });
        return column;
    }

    /**
     * Gets a Column by column name.
     *
     * @param  {string} field - Specifies the column name.
     *
     * @returns {Column} Returns the column
     */
    public getColumnByField(field: string): Column {
        return iterateArrayOrObject<Column, Column>(<Column[]>this.getColumns(), (item: Column) => {
            if (item.field === field) {
                return item;
            }
            return undefined;
        })[0];
    }

    /**
     * Gets a column index by column name.
     *
     * @param  {string} field - Specifies the column name.
     *
     * @returns {number} Returns the index by field
     */
    public getColumnIndexByField(field: string): number {
        const cols: Column[] = this.getColumns();
        for (let i: number = 0; i < cols.length; i++) {
            if (cols[parseInt(i.toString(), 10)].field === field) {
                return i;
            }
        }
        return -1;
    }

    /**
     * Gets a column by UID.
     *
     * @param  {string} uid - Specifies the column UID.
     * @param  {boolean} isColumns - Defines the all columns.
     *
     * @returns {Column} Returns the column
     */
    public getColumnByUid(uid: string, isColumns?: boolean): Column {
        const cols: Column[] | string[] | ColumnModel[] = isColumns ? this.columns : this.getColumns();
        return iterateArrayOrObject<Column, Column>(
            [...<Column[]>cols, ...this.getStackedColumns(this.columns as Column[])],
            (item: Column) => {
                if (item.uid === uid) {
                    return item;
                }
                return undefined;
            })[0];
    }

    /**
     * @param {Column[]} columns - Defines the columns
     * @param {Column[]} stackedColumn - Defines the stacked columns
     * @returns {Column[]} Returns the columns
     * @hidden
     */
    public getStackedColumns(columns: Column[], stackedColumn: Column[] = []): Column[] {
        for (const column of columns) {
            if (column.columns) {
                stackedColumn.push(column);
                this.getStackedColumns(column.columns as Column[], stackedColumn);
            }
        }
        return stackedColumn;
    }

    /**
     * Gets a column index by UID.
     *
     * @param  {string} uid - Specifies the column UID.
     *
     * @returns {number} Returns the column by index
     */
    public getColumnIndexByUid(uid: string): number {
        const index: number = iterateArrayOrObject<number, Column>
        (<Column[]>this.getColumns(), (item: Column, index: number) => {
            if (item.uid === uid) {
                return index;
            }
            return undefined;
        })[0];

        return !isNullOrUndefined(index) ? index : -1;
    }

    /**
     * Gets UID by column name.
     *
     * @param  {string} field - Specifies the column name.
     *
     * @returns {string} Returns the column by field
     */
    public getUidByColumnField(field: string): string {
        return iterateArrayOrObject<string, Column>(<Column[]>this.getColumns(), (item: Column) => {
            if (item.field === field) {
                return item.uid;
            }
            return undefined;
        })[0];
    }

    /**
     * Gets column index by column uid value.
     *
     * @private
     * @param  {string} uid - Specifies the column uid.
     * @returns {number} Returns the column by field
     */
    public getNormalizedColumnIndex(uid: string): number {
        const index: number = this.getColumnIndexByUid(uid);
        return index + this.getIndentCount();
    }

    /**
     * Gets indent cell count.
     *
     * @private
     * @returns {number} Returns the indent count
     */
    public getIndentCount(): number {
        let index: number = 0;
        if (this.allowGrouping) {
            index += this.groupSettings.columns.length;
        }
        if (this.isDetail()) {
            index++;
        }
        if (this.isRowDragable() && isNullOrUndefined(this.rowDropSettings.targetID)) {
            index++;
        }
        /**
         * TODO: index normalization based on the stacked header, grouping and detailTemplate
         * and frozen should be handled here
         */
        return index;
    }
    /**
     * Gets the collection of column fields.
     *
     * @returns {string[]} Returns the Field names
     */
    public getColumnFieldNames(): string[] {
        const columnNames: string[] = [];
        let column: Column;
        for (let i: number = 0, len: number = this.getColumns().length; i < len; i++) {
            column = this.getColumns()[parseInt(i.toString(), 10)] as Column;
            if (column.visible) {
                columnNames.push(column.field);
            }
        }
        return columnNames;
    }

    /**
     * Gets a compiled row template.
     *
     * @returns {Function} Returns the row TEmplate
     * @private
     */
    public getRowTemplate(): Function {
        return this.rowTemplateFn;
    }

    /**
     * Gets a compiled empty Record template.
     *
     * @returns {Function} Returns the empty Record template
     * @private
     */
    public getEmptyRecordTemplate(): Function {
        return this.emptyRecordTemplateFn;
    }

    /**
     * Gets a compiled detail row template.
     *
     * @private
     * @returns {Function} Returns the Detail template
     */
    public getDetailTemplate(): Function {
        return this.detailTemplateFn;
    }

    /**
     * Gets a compiled dialog edit template.
     *
     * @private
     * @returns {Function} Returns the Edit template
     */
    public getEditTemplate(): Function {
        return this.editTemplateFn;
    }

    /**
     * Gets a compiled dialog edit header template.
     *
     * @private
     * @returns {Function} returns template function
     */
    public getEditHeaderTemplate(): Function {
        return this.editHeaderTemplateFn;
    }

    /**
     * Gets a compiled dialog edit footer template.
     *
     * @private
     * @returns {Function} Returns the Footer template
     */
    public getEditFooterTemplate(): Function {
        return this.editFooterTemplateFn;
    }

    /**
     * Gets a compiled column chooser template.
     *
     * @private
     * @returns {Function} Returns the template
     */
    public getColumnChooserTemplate(): Function {
        return this.columnChooserTemplateFn;
    }

    /**
     * Gets a compiled column chooser header template.
     *
     * @private
     * @returns {Function} returns the header template
     */
    public getColumnChooserHeaderTemplate(): Function {
        return this.columnChooserHeaderTemplateFn;
    }

    /**
     * Gets a compiled column chooser footer template.
     *
     * @private
     * @returns {Function} Returns the Footer template
     */
    public getColumnChooserFooterTemplate(): Function {
        return this.columnChooserFooterTemplateFn;
    }

    /**
     * Get the names of the primary key columns of the Grid.
     *
     * @returns {string[]} Returns the field names
     */
    public getPrimaryKeyFieldNames(): string[] {
        const keys: string[] = [];
        for (let k: number = 0; k < this.columnModel.length; k++) {
            if ((this.columnModel[parseInt(k.toString(), 10)] as Column).isPrimaryKey) {
                keys.push((this.columnModel[parseInt(k.toString(), 10)] as Column).field);
            }
        }
        return keys;
    }

    /**
     * Refreshes the Grid header and content.
     *
     * @returns {void}
     */
    public refresh(): void {
        if (!this.isDestroyed) {
            this.isManualRefresh = true;
            if (this.allowGrouping && this.groupModule && this.groupSettings.showDropArea) {
                this.groupModule.refreshDropArea();
            }
            this.headerModule.refreshUI();
            this.updateStackedFilter();
            this.renderModule.refresh();
        }
    }

    /**
     * Refreshes the Grid header.
     *
     * @returns {void}
     */
    public refreshHeader(): void {
        this.headerModule.refreshUI();
    }

    /**
     * Gets the collection of selected rows.
     *
     * @returns {Element[]} Returns the element
     */
    public getSelectedRows(): Element[] {
        return this.selectionModule ? this.selectionModule.selectedRecords : [];
    }

    /**
     * Gets the collection of selected row indexes.
     *
     * @returns {number[]} Returns the Selected row indexes
     */
    public getSelectedRowIndexes(): number[] {
        return this.selectionModule ? this.selectionModule.selectedRowIndexes : [];
    }

    /**
     * Gets the collection of selected row and cell indexes.
     *
     * @returns {number[]} Returns the Selected row cell indexes
     */
    public getSelectedRowCellIndexes(): ISelectedCell[] {
        return this.selectionModule ? this.selectionModule.selectedRowCellIndexes : [];
    }

    /**
     * Gets the collection of selected records.
     *
     * @returns {Object[]} Returns the selected records
     * @isGenericType true
     */
    public getSelectedRecords(): Object[] {
        return this.selectionModule ? this.selectionModule.getSelectedRecords() : [];
    }

    /**
     * Gets the collection of selected columns uid.
     *
     * @returns {string[]} Returns the selected column uid
     * @isGenericType true
     */
    public getSelectedColumnsUid(): string[] {
        const uid: string[] = [];
        if (this.selectionModule) {
            this.selectionModule.selectedColumnsIndexes.filter((i: number) => uid.push(this.getColumns()[parseInt(i.toString(), 10)].uid));
        }
        return uid;
    }

    /**
     * Returns the data module used by the grid.
     *
     * Use this to access the current applied queries and data related configuration settings for the grid.
     *
     * @returns {Data} The data module currently used by the grid.
     */
    public getDataModule(): Data {
        return this.renderModule.data;
    }

    /**
     * Shows a column by its column name.
     *
     * @param  {string|string[]} keys - Defines a single or collection of column names.
     * @param  {string} showBy - Defines the column key either as field name or header text.
     *
     * @returns {void}
     */
    public showColumns(keys: string | string[], showBy?: string): void {
        showBy = showBy ? showBy : 'headerText';
        this.showHider.show(keys, showBy);
    }

    /**
     * Hides a column by column name.
     *
     * @param  {string|string[]} keys - Defines a single or collection of column names.
     * @param  {string} hideBy - Defines the column key either as field name or header text.
     *
     * @returns {void}
     */
    public hideColumns(keys: string | string[], hideBy?: string): void {
        hideBy = hideBy ? hideBy : 'headerText';
        this.showHider.hide(keys, hideBy);
    }

    /**
     * @hidden
     * @returns {number} Returns the Frozen column
     */
    public getFrozenColumns(): number {
        return this.frozenColumns + this.getFrozenCount(this.columns as Column[], 0, 0);
    }

    /**
     * @hidden
     * @returns {number} Returns the Frozen Right column count
     */
    public getFrozenRightColumnsCount(): number {
        return this.frozenRightCount || this.rightcount;
    }

    /**
     * @hidden
     * @returns {number} Returns the Frozen Left column
     */
    public getFrozenLeftColumnsCount(): number {
        return this.frozenLeftCount || this.leftcount;
    }

    /**
     * @hidden
     * @returns {number} Returns the movable column count
     */
    public getMovableColumnsCount(): number {
        return this.movableCount || this.movablecount;
    }

    private updateFrozenColumnsWidth(): void {
        if (this.isFrozenGrid() && !this.enableColumnVirtualization) {
            const gcol: Column[] = this.getColumns();
            let isAutoWidth: boolean = true;
            let autoCol: number = 0;
            let difference: number = 0;
            let autoWidth: number = 0;
            const isFrozenAuto: boolean = gcol.some((data: Column) => { return (data.freeze === 'Left' || data.freeze === 'Right'
                || data.freeze === 'Fixed' || data.isFrozen) && data.width === 'auto'; });
            for (let i: number = 0; i < gcol.length; i++) {
                const col: Column = gcol[parseInt(i.toString(), 10)];
                if (isNullOrUndefined(col.width) && (col.freeze === 'Left' || col.freeze === 'Right' || col.freeze === 'Fixed' || col.isFrozen)) {
                    col.width = Math.max(200, col.minWidth ? parseFloat(col.minWidth.toString()) : 0);
                    if (!isNullOrUndefined(col.maxWidth) &&  parseFloat(col.maxWidth.toString()) < col.width) {
                        col.width = col.maxWidth;
                    }
                }
                if (col.width === 'auto' && isFrozenAuto) {
                    let tWidth: number = 0;
                    if (isAutoWidth) {
                        gcol.filter((cols: Column) => {
                            if (cols.visible) {
                                if (cols.width === 'auto') {
                                    autoCol++;
                                }
                                if (cols.width !== 'auto') {
                                    const width: number = !isNullOrUndefined(cols.width) ? parseFloat(cols.width.toString()) :
                                        Math.max(200, cols.minWidth ? parseFloat(cols.minWidth.toString()) : 0);
                                    tWidth += width;
                                }
                            }
                        });
                        const gWidth: number = this.isPercentageWidthGrid() || this.width === 'auto' ? this.element.getBoundingClientRect().width :
                            parseFloat(this.width.toString());
                        difference = this.height === 'auto' ? gWidth - tWidth : ((gWidth - tWidth) - getScrollBarWidth());
                        if (difference < 0) {
                            difference = 0;
                        }
                        autoWidth = parseFloat((difference / autoCol).toString());
                        gcol.filter((col: Column) => {
                            if (col.visible) {
                                if (col.minWidth && parseFloat(col.minWidth.toString()) > autoWidth) {
                                    difference = difference - parseFloat(col.minWidth.toString());
                                    autoCol--;
                                }
                            }
                        });
                        isAutoWidth = false;
                    }
                    if (col.minWidth && parseFloat(col.minWidth.toString()) > autoWidth) {
                        col.width = parseFloat(col.minWidth.toString());
                    } else {
                        col.width = difference / autoCol;
                    }
                }
            }
        }
    }

    private refreshSplitFrozenColumn(): void {
        this.splitFrozenCount(this.columns as Column[]);
        this.updateFrozenColumnsWidth();
        this.isAutoGenerateColumns = true;
    }

    /**
     * @hidden
     * @returns {void}
     */
    public setFrozenCount(): void {
        this.frozenLeftCount = this.frozenRightCount = this.movableCount = 0;
        this.visibleFrozenLeft = this.visibleFrozenRight = this.visibleMovable = 0;
        this.frozenLeftColumns = []; this.frozenRightColumns = []; this.movableColumns = []; this.fixedColumns = [];
        this.splitFrozenCount(this.columns as Column[]);
        this.leftcount = this.frozenLeftCount;
        this.rightcount = this.frozenRightCount;
        this.movablecount = this.movableCount;
        // if (this.frozenColumns && (this.frozenLeftCount || this.frozenRightCount)) {
        //     this.setProperties({ frozenColumns: 0 }, true);
        // }
        if (this.frozenLeftCount && !this.frozenRightCount) {
            this.frozenName = 'Left';
        } else if (this.frozenRightCount && !this.frozenLeftCount) {
            this.frozenName = 'Right';
        } else if (this.frozenLeftCount && this.frozenRightCount) {
            this.frozenName = 'Left-Right';
        } else if (this.frozenColumns || this.frozenRows) {
            this.frozenName = 'Left';
        } else {
            this.frozenName = undefined;
        }
    }

    /**
     * @hidden
     * @returns {number} Returns the visible Frozen left count
     */
    public getVisibleFrozenLeftCount(): number {
        return this.visibleFrozenLeft;
    }

    /**
     * @hidden
     * @returns {number} Returns the visible Frozen Right count
     */
    public getVisibleFrozenRightCount(): number {
        return this.visibleFrozenRight;
    }

    /**
     * @hidden
     * @returns {number} Returns the visible movable count
     */
    public getVisibleMovableCount(): number {
        return this.visibleMovable;
    }

    /**
     * @hidden
     * @returns {Column[]} Returns the column
     */
    public getFrozenRightColumns(): Column[] {
        return this.frozenRightColumns;
    }

    /**
     * @hidden
     * @returns {Column[]} Returns the column
     */
    public getFrozenLeftColumns(): Column[] {
        return this.frozenLeftColumns;
    }

    /**
     * @hidden
     * @returns {Column[]} Returns the column
     */
    public getMovableColumns(): Column[] {
        return this.movableColumns;
    }

    private splitStackedColumns(columns: Column[]): void {
        for (let i: number = 0; i < columns.length; i++) {
            if (columns[parseInt(i.toString(), 10)].columns) {
                this.splitStackedColumns(columns[parseInt(i.toString(), 10)].columns as Column[]);
            } else {
                if (columns[parseInt(i.toString(), 10)].freeze === 'Left' || columns[parseInt(i.toString(), 10)].isFrozen) {
                    if (columns[parseInt(i.toString(), 10)].visible !== false) {
                        this.visibleFrozenLeft++;
                    }
                    this.leftcount++;
                }
                else if (columns[parseInt(i.toString(), 10)].freeze === 'Right') {
                    if (columns[parseInt(i.toString(), 10)].visible !== false) {
                        this.visibleFrozenRight++;
                    }
                    this.rightcount++;
                }
                else if (columns[parseInt(i.toString(), 10)].freeze === 'Fixed') {
                    if (columns[parseInt(i.toString(), 10)].visible !== false) {
                        this.visibleFrozenFixed++;
                    }
                    this.fixedcount++;
                }
                else {
                    if (columns[parseInt(i.toString(), 10)].visible !== false) {
                        this.visibleMovable++;
                    }
                    this.movablecount++;
                }
            }
        }
    }

    private pushStackedColumns(columns?: Column[], index?: number, arr?: frozenStackedColumn[], col?: Column, stackedcol?: Object): void {
        arr[parseInt(index.toString(), 10)] = { headerText: col.headerText };
        if (col.textAlign) {
            arr[parseInt(index.toString(), 10)].textAlign = col.textAlign;
        }
        if (col.customAttributes) {
            arr[parseInt(index.toString(), 10)].customAttributes = col.customAttributes;
        }
        for (let i: number = 0; i < columns.length; i++) {
            if (columns[parseInt(i.toString(), 10)].columns) {
                index = index + 1;
                this.pushStackedColumns(
                    columns[parseInt(i.toString(), 10)].columns as Column[], index, arr, columns[parseInt(i.toString(), 10)], stackedcol);
                index = index - 1;
            } else {
                let stockCol: string[] = [];
                stockCol = [...arr].slice(0, index + 1) as string[];
                if (columns[parseInt(i.toString(), 10)].freeze === 'Left' || columns[parseInt(i.toString(), 10)].isFrozen) {
                    this.stackedLeft.push(stockCol);
                    this.stackedarrayLeft.push(columns[parseInt(i.toString(), 10)] as Column);
                } else if (columns[parseInt(i.toString(), 10)].freeze === 'Right'){
                    this.stackedRight.push(stockCol);
                    this.stackedarrayRight.push(columns[parseInt(i.toString(), 10)]);
                } else if (columns[parseInt(i.toString(), 10)].freeze === 'Fixed') {
                    this.stackedFixed.push(stockCol);
                    this.stackedarrayFixed.push(columns[parseInt(i.toString(), 10)]);
                } else {
                    this.stackedMovable.push(stockCol);
                    this.stackedarrayMovable.push(columns[parseInt(i.toString(), 10)]);
                }
            }
        }
    }

    private pushallcol(text?: frozenStackedColumn, text1?: string, col?: frozenStackedColumn, columns?: Column, isTrue?: boolean): void {
        if (col.headerText === (text1 as frozenStackedColumn).headerText) {
            if (isTrue) {
                col.columns.push(columns as Column);
            } else {
                const newColumn: frozenStackedColumn = { headerText: text.headerText, columns: [] };
                if (text.textAlign) {
                    newColumn.textAlign = text.textAlign;
                }
                if (text.customAttributes) {
                    newColumn.customAttributes = text.customAttributes;
                }
                col.columns.push(newColumn as Column);
            }
        } else {
            if (col.columns && col.columns.length) {
                for (let i: number = 0; i < col.columns.length; i++) {
                    this.pushallcol(text, text1, col.columns[parseInt(i.toString(), 10)] as Object, columns, isTrue);
                }
            }
        }
    }

    private resetStackedColumns(headercol?: string[][], gridcolumns?: Column[], freeze?: string): void {
        let col: frozenStackedColumn = {};
        const tempHead: string[] = [];
        for (let i: number = 1; i <= headercol.length; i++) {
            const firstcol: string[] = headercol[i - 1];
            for (let j: number = 0; j < firstcol.length; j++) {
                if (!(<{ columns?: Column[] }>col).columns && i === 1) {
                    col = { headerText: (firstcol[parseInt(j.toString(), 10)] as frozenStackedColumn).headerText,
                        textAlign: (firstcol[parseInt(j.toString(), 10)] as frozenStackedColumn).textAlign,
                        customAttributes: (firstcol[parseInt(j.toString(), 10)] as frozenStackedColumn).customAttributes, columns: [] };
                    tempHead.push(firstcol[parseInt(j.toString(), 10)]);
                } else {
                    if (tempHead.indexOf(firstcol[parseInt(j.toString(), 10)]) === -1) {
                        this.pushallcol(firstcol[parseInt(j.toString(), 10)] as frozenStackedColumn, firstcol[j - 1], col);
                        tempHead.push(firstcol[parseInt(j.toString(), 10)]);
                    }
                }
                if (j === firstcol.length - 1) {
                    this.pushallcol(null, firstcol[parseInt(j.toString(), 10)], col, gridcolumns[i - 1], true);
                    let count: number = 0;
                    while (count !== headercol.length - 1 && i !== headercol.length) {
                        const firstColHeaders: string = (firstcol as frozenStackedColumn[]).map((col: frozenStackedColumn) =>
                            col.headerText).join(', ');
                        const headerColHeaders: string = (headercol[parseInt(i.toString(), 10)] as frozenStackedColumn[]).map(
                            (item: frozenStackedColumn) => item.headerText).join(', ');
                        if (firstColHeaders === headerColHeaders) {
                            i++;
                            this.pushallcol(null, firstcol[parseInt(j.toString(), 10)], col, gridcolumns[i - 1], true);
                        }
                        count++;
                    }
                }

            }
        }
        if (freeze === 'Left') {
            this.frozenLeftColumns.push(col as Column);
        } else if (freeze === 'Right') {
            this.frozenRightColumns.push(col as Column);
        } else {
            this.movableColumns.push(col as Column);
        }
    }


    private splitFrozenCount(columns: Column[]): void {
        if (this.frozenColumns || (this.changedProperties && this.changedProperties.frozenColumns === 0)) {
            const cols: Column[] = !this.enableColumnVirtualization || (this.enableColumnVirtualization && this.isPreparedFrozenColumns) ?
                this.enableColumnVirtualization && this.columnModel && this.columnModel.length ? this.columnModel :
                    this.getColumns() : this.columns as Column[];
            if (!this.changedProperties || (this.changedProperties && !this.changedProperties.frozenColumns)) {
                for (let i: number = 0; i < cols.length; i++) {
                    if (this.frozenColumns > i) {
                        cols[parseInt(i.toString(), 10)].freeze = 'Left';
                    } else if (cols[parseInt(i.toString(), 10)].freeze === 'Right' || cols[parseInt(i.toString(), 10)].freeze === 'Fixed') {
                        cols[parseInt(i.toString(), 10)].freeze = cols[parseInt(i.toString(), 10)].freeze;
                    } else {
                        cols[parseInt(i.toString(), 10)].freeze = undefined;
                    }
                }
            }
        }
        for (let i: number = 0; i < (!isNullOrUndefined(columns) ? columns.length : 0); i++) {
            if (columns[parseInt(i.toString(), 10)].columns) {
                this.leftcount = 0;
                this.rightcount = 0;
                this.movablecount = 0;
                this.fixedcount = 0;
                const arr: frozenStackedColumn[] = [];
                this.splitStackedColumns(columns[parseInt(i.toString(), 10)].columns as Column[]);
                if (this.leftcount && !this.rightcount && !this.movablecount && !this.fixedcount) {
                    this.frozenLeftCount += this.leftcount;
                    this.frozenLeftColumns.push(columns[parseInt(i.toString(), 10)]);
                }
                else if (this.rightcount && !this.leftcount && !this.movablecount && !this.fixedcount) {
                    this.frozenRightCount += this.rightcount;
                    this.frozenRightColumns.push(columns[parseInt(i.toString(), 10)]);
                } else if (this.movablecount && !this.leftcount && !this.rightcount && !this.fixedcount) {
                    this.movableCount += this.movablecount;
                    this.movableColumns.push(columns[parseInt(i.toString(), 10)]);
                } else if (this.fixedcount && !this.leftcount && !this.rightcount && !this.movablecount) {
                    this.fixedCount += this.fixedcount;
                    this.fixedColumns.push(columns[parseInt(i.toString(), 10)]);
                    this.movableCount += this.movablecount;
                    this.movableColumns.push(columns[parseInt(i.toString(), 10)]);
                } else {
                    this.frozenLeftCount += this.leftcount;
                    this.frozenRightCount += this.rightcount;
                    this.movableCount += this.movablecount;
                    this.fixedCount += this.fixedcount;
                    this.leftcount = 0;
                    this.rightcount = 0;
                    this.movablecount = 0;
                    this.fixedcount = 0;
                    this.stackedLeft = [];
                    this.stackedRight = [];
                    this.stackedFixed = [];
                    this.stackedMovable = [];
                    this.stackedarrayLeft = [];
                    this.stackedarrayRight = [];
                    this.stackedarrayFixed = [];
                    this.stackedarrayMovable = [];
                    this.pushStackedColumns(columns[parseInt(i.toString(), 10)].columns as Column[], 0, arr,
                                            columns[parseInt(i.toString(), 10)],
                                            { headerText: columns[parseInt(i.toString(), 10)].headerText,
                                                textAlign: columns[parseInt(i.toString(), 10)].textAlign,
                                                customAttributes: columns[parseInt(i.toString(), 10)].customAttributes, columns: [] });
                    if (this.stackedarrayLeft.length) {
                        this.resetStackedColumns(this.stackedLeft, this.stackedarrayLeft, 'Left');
                    }
                    if (this.stackedarrayRight.length) {
                        this.resetStackedColumns(this.stackedRight, this.stackedarrayRight, 'Right');
                    }
                    if (this.stackedarrayFixed.length) {
                        this.resetStackedColumns(this.stackedFixed, this.stackedarrayFixed, 'Fixed');
                    }
                    if (this.stackedarrayMovable.length) {
                        this.resetStackedColumns(this.stackedMovable, this.stackedarrayMovable, 'Movable');
                    }
                    this.stackedLeft = [];
                    this.stackedRight = [];
                    this.stackedMovable = [];
                    this.stackedFixed = [];
                    this.stackedarrayLeft = [];
                    this.stackedarrayRight = [];
                    this.stackedarrayMovable = [];
                    this.stackedarrayFixed = [];
                }
            } else {
                if (columns[parseInt(i.toString(), 10)].freeze === 'Right') {
                    if (columns[parseInt(i.toString(), 10)].visible !== false) { this.visibleFrozenRight++; }
                    this.frozenRightColumns.push(columns[parseInt(i.toString(), 10)]);
                    this.frozenRightCount++;
                } else if (columns[parseInt(i.toString(), 10)].freeze === 'Left' || columns[parseInt(i.toString(), 10)].isFrozen) {
                    if (columns[parseInt(i.toString(), 10)].visible !== false) { this.visibleFrozenLeft++; }
                    this.frozenLeftColumns.push(columns[parseInt(i.toString(), 10)]);
                    this.frozenLeftCount++;
                } else if (columns[parseInt(i.toString(), 10)].freeze === 'Fixed') {
                    this.fixedColumns.push(columns[parseInt(i.toString(), 10)]);
                    this.fixedCount++;
                    this.movableColumns.push(columns[parseInt(i.toString(), 10)]);
                    this.movableCount++;
                } else {
                    if (columns[parseInt(i.toString(), 10)].visible !== false) { this.visibleMovable++; }
                    this.movableColumns.push(columns[parseInt(i.toString(), 10)]);
                    this.movableCount++;
                }
            }
        }
        if (this.frozenLeftColumns.length) {
            const cols: Column = this.frozenLeftColumns[this.frozenLeftColumns.length - 1];
            this.removeBorder(this.frozenLeftColumns);
            this.frozenLeftBorderColumns(
                cols instanceof Column ? this.lastVisibleLeftCol(this.frozenLeftColumns) : cols);
        }
        if (this.frozenRightColumns.length) {
            const cols: Column = this.frozenRightColumns[0];
            this.removeBorder(this.frozenRightColumns);
            this.frozenRightBorderColumns(
                cols instanceof Column ? this.firstVisibleRightCol(this.frozenRightColumns) : cols);
        }
        if ((this.frozenLeftColumns.length || this.frozenRightColumns.length) && this.freezeColumnRefresh) {
            const cols: Column[] = (this.frozenLeftColumns.concat(this.movableColumns)).concat(this.frozenRightColumns);
            this.setProperties({ columns: cols }, true);
            this.freezeColumnRefresh = false;
        }
    }

    private removeBorder(columns?: Column[]): void {
        for (let i: number = 0; i < columns.length; i++) {
            if (columns[parseInt(i.toString(), 10)].columns && columns[parseInt(i.toString(), 10)].columns.length) {
                if ((<{ border?: string }>columns[parseInt(i.toString(), 10)]).border === 'Right' ||
                    (<{ border?: string }>columns[parseInt(i.toString(), 10)]).border === 'Left') {
                    (<{ border?: string }>columns[parseInt(i.toString(), 10)]).border = undefined;
                }
                this.removeBorder(columns[parseInt(i.toString(), 10)].columns as Column[]);
            } else {
                if ((<{ border?: string }>columns[parseInt(i.toString(), 10)]).border === 'Right' ||
                    (<{ border?: string }>columns[parseInt(i.toString(), 10)]).border === 'Left') {
                    (<{ border?: string }>columns[parseInt(i.toString(), 10)]).border = undefined;
                }
            }
        }
    }

    private isVisibleColumns(column?: Column, arr?: string[]): void {
        if (column.columns && column.columns.length) {
            for (let i: number = 0; i < column.columns.length; i++) {
                this.isVisibleColumns(column.columns[parseInt(i.toString(), 10)] as Column, arr);
                if ((column.columns[parseInt(i.toString(), 10)] as Column).visible &&
                    isNullOrUndefined((column.columns[parseInt(i.toString(), 10)] as Column).columns) &&
                    (!isNullOrUndefined((column.columns[parseInt(i.toString(), 10)] as Column).freeze) ||
                    (column.columns[parseInt(i.toString(), 10)] as Column).isFrozen)) {
                    arr.push('true');
                }
            }
        } else {
            if (column.visible && (!isNullOrUndefined(column.freeze) || column.isFrozen)) {
                arr.push('true');
            }
        }
    }

    private lastVisibleLeftCol(columns?: Column[]): Column {
        let column: Column;
        for (let i: number = columns.length - 1; i >= 0; i--) {
            const arr: string[] = [];
            this.isVisibleColumns(columns[parseInt(i.toString(), 10)], arr);
            if (columns[parseInt(i.toString(), 10)].visible && arr.indexOf('true') !== -1) {
                column = columns[parseInt(i.toString(), 10)];
                break;
            }
        }
        return column;
    }

    private firstVisibleRightCol(columns?: Column[]): Column {
        let column: Column;
        for (let i: number = 0; i < columns.length; i++) {
            const arr: string[] = [];
            this.isVisibleColumns(columns[parseInt(i.toString(), 10)], arr);
            if (columns[parseInt(i.toString(), 10)].visible && arr.indexOf('true') !== -1) {
                column = columns[parseInt(i.toString(), 10)];
                break;
            }
        }
        return column;
    }

    private frozenLeftBorderColumns(columns?: Column): void {
        if (isNullOrUndefined(columns)) { return; }
        if (columns.columns && columns.columns.length) {
            (<{ border?: string }>columns).border = 'Left';
            const cols: Column = columns.columns[columns.columns.length - 1] as Column;
            this.frozenLeftBorderColumns(
                cols instanceof Column && cols.columns ? this.lastVisibleLeftCol(columns.columns as Column[]) : cols);
        } else {
            (<{ border?: string }>columns).border = 'Left';
        }
    }
    private frozenRightBorderColumns(columns?: Column): void {
        if (isNullOrUndefined(columns)) { return; }
        if (columns.columns && columns.columns.length) {
            (<{ border?: string }>columns).border = 'Right';
            const cols: Column = columns.columns[0] as Column;
            this.frozenRightBorderColumns(
                cols instanceof Column && cols.columns ? this.firstVisibleRightCol(columns.columns as Column[]) : cols);
        } else {
            (<{ border?: string }>columns).border = 'Right';
        }
    }

    /**
     * @hidden
     * @returns {number} Returns the visible frozen columns count
     */
    public getVisibleFrozenColumns(): number {
        return this.getVisibleFrozenColumnsCount() + this.getVisibleFrozenCount(this.columns as Column[], 0);
    }

    /**
     * Pin the rows using the data
     *
     * @param  {Object[]} data - Defines the row data for frozen row.
     *
     * @returns {void}
     */
    public pinRows(data: Object[]): void {
        const primaryKey: string = this.getPrimaryKeyFieldNames()[0];
        let isRefresh: boolean = false;
        for (let i: number = 0; i < data.length; i++) {
            const rowData: Object = data[parseInt(i.toString(), 10)];
            if (!this.pinnedTopRowKeys[rowData[`${primaryKey}`]]) {
                this.pinnedTopRecords.push(rowData);
                this.pinnedTopRowKeys[rowData[`${primaryKey}`]] = true;
                isRefresh = true;
            }
        }
        if (isRefresh) {
            this.notify(events.modelChanged, {requestType: 'pin-row'});
        }
    }

    /**
     * Unpin the rows using data
     *
     * @param  {Object[]} data - Defines the row data for frozen row.
     *
     * @returns {void}
     */
    public unpinRows(data: Object[]): void {
        const primaryKey: string = this.getPrimaryKeyFieldNames()[0];
        let isRefresh: boolean = false;
        for (let i: number = 0; i < data.length; i++) {
            const rowData: Object = data[parseInt(i.toString(), 10)];
            const primaryKeyValue: string = rowData[`${primaryKey}`];
            const index: number = this.pinnedTopRecords.findIndex( (row: Object) => row[`${primaryKey}`] === primaryKeyValue);
            if (this.pinnedTopRowKeys[rowData[`${primaryKey}`]]) {
                this.pinnedTopRecords.splice(index, 1);
                this.pinnedTopRowKeys[rowData[`${primaryKey}`]] = false;
                isRefresh = true;
            }
        }
        if (isRefresh) {
            this.notify(events.modelChanged, {requestType: 'unpin-row'});
        }
    }

    /**
     * Get the current Filter operator and field.
     *
     * @returns {FilterUI} Returns the filter UI
     */
    public getFilterUIInfo(): FilterUI {
        return this.filterModule ? this.filterModule.getFilterUIInfo() : {};
    }

    private getVisibleFrozenColumnsCount(): number {
        let visibleFrozenColumns: number = 0;
        const columns: Column[] = this.columnModel;
        for (let i: number = 0; i < this.frozenColumns; i++) {
            if (columns[parseInt(i.toString(), 10)].visible) {
                visibleFrozenColumns++;
            }
        }
        if ((this.frozenLeftCount || this.leftcount) || (this.frozenRightCount || this.rightcount)) {
            for (let i: number = 0; i < columns.length; i++) {
                if (columns[parseInt(i.toString(), 10)].visible && (columns[parseInt(i.toString(), 10)].freeze === 'Left'
                    || columns[parseInt(i.toString(), 10)].freeze === 'Right')) {
                    visibleFrozenColumns++;
                }
            }
        }
        return visibleFrozenColumns;
    }

    private getVisibleFrozenCount(cols: Column[], cnt: number): number {
        if ((!this.frozenLeftCount && !this.leftcount) && (!this.frozenRightCount || !this.rightcount)) {
            for (let i: number = 0, len: number = cols.length; i < len; i++) {
                if (cols[parseInt(i.toString(), 10)].columns) {
                    cnt = this.getVisibleFrozenCount(cols[parseInt(i.toString(), 10)].columns as Column[], cnt);
                } else {
                    if (cols[parseInt(i.toString(), 10)].isFrozen && cols[parseInt(i.toString(), 10)].visible) {
                        cnt++;
                    }
                }
            }
        }
        return cnt;
    }

    private getFrozenCount(cols: Column[], cnt: number, index?: number): number {
        for (let i: number = 0, len: number = (!isNullOrUndefined(cols) ? cols.length : 0); i < len; i++) {
            if (cols[parseInt(i.toString(), 10)].columns) {
                cnt = this.getFrozenCount(cols[parseInt(i.toString(), 10)].columns as Column[], cnt, index);
            } else {
                if (cols[parseInt(i.toString(), 10)].isFrozen && index > this.frozenColumns - 1) {
                    cnt++;
                }
                index++;
            }
        }
        return cnt;
    }

    /**
     * Navigates to the specified target page.
     *
     * @param  {number} pageNo - Defines the page number to navigate.
     *
     * @returns {void}
     */
    public goToPage(pageNo: number): void {
        if (this.pagerModule) {
            this.pagerModule.goToPage(pageNo);
        }
    }

    /**
     * Defines the text of external message.
     *
     * @param  {string} message - Defines the message to update.
     *
     * @returns {void}
     */
    public updateExternalMessage(message: string): void {
        if (this.pagerModule && !this.pagerTemplate) {
            this.pagerModule.updateExternalMessage(message);
        }
    }

    /**
     * Sorts a column with the given options.
     *
     * @param {string} columnName - Defines the column name to be sorted.
     * @param {SortDirection} direction - Defines the direction of sorting field.
     * @param {boolean} isMultiSort - Specifies whether the previous sorted columns are to be maintained.
     *
     * @returns {void}
     */
    public sortColumn(columnName: string, direction: SortDirection, isMultiSort?: boolean): void {
        if (this.sortModule) {
            this.sortModule.sortColumn(columnName, direction, isMultiSort);
        }
    }

    /**
     * Remove the existing columns along with the grid actions like sorting, filtering, searching, grouping, aggregate, etc., and grid will refresh with new columns based on the updated new data source.
     * > * If no columns are specified while changing the data source, then the columns are auto generated in the Grid based on the list of columns in the updated data source.
     *
     * @param {Object | DataManager | DataResult} dataSource -  Assign the new datasource.
     * @param {Column[] | string[] | ColumnModel[]} columns - Defines columns.
     * @returns {void}
     *
     *
     * ```typescript
     * <button id="btn">change dataSource </button>
     * <div id="Grid"></div>
     * <script>
     * let gridObj: Grid = new Grid({
     *     dataSource: employeeData,  // you can define the datamanager here if you are binding a data through datamanager
     *     columns: [
     *         { field: 'OrderID', headerText: 'Order ID', width:100 },
     *         { field: 'EmployeeID', headerText: 'Employee ID' }],
     * });
     * gridObj.appendTo('#Grid');
     * document.getElementById('btn').addEventListener("click", function(){
     * let newColumn: [
     *     { field: 'CustomerID', headerText: 'Customer ID', width:100 },
     *     { field: 'FirstName', headerText: 'Name' }];
     * gridObj.changeDataSource(customerData, newColumn);
     * });
     * </script>
     * ```
     *
     */
    public changeDataSource(dataSource?: Object | DataManager | DataResult, columns?: Column[] | string[] | ColumnModel[]): void {
        this.isChangeDataSourceCall = true;
        this.setProperties({ sortSettings: { columns: [] } }, true);
        this.setProperties({ filterSettings: { columns: [] } }, true);
        this.setProperties({ searchSettings: { key: '' } }, true);
        if (this.allowGrouping) {
            this.setProperties({ groupSettings: { columns: [] } }, true);
        }
        if (columns && columns.length) {
            this.setProperties({ columns: columns }, true);
        }
        if (dataSource) {
            if (isNullOrUndefined(columns)) {
                this.setProperties({ columns: [] }, true);
            }
            this.setProperties({ dataSource: dataSource }, true);
        }
        this.freezeRefresh();
        this.isChangeDataSourceCall = false;
    }

    /**
     * Clears all the sorted columns of the Grid.
     *
     * @returns {void}
     */
    public clearSorting(): void {
        if (this.sortModule) {
            this.sortModule.clearSorting();
        }
    }

    /**
     * Remove sorted column by field name.
     *
     * @param {string} field - Defines the column field name to remove sort.
     * @returns {void}
     * @hidden
     */
    public removeSortColumn(field: string): void {
        if (this.sortModule) {
            this.sortModule.removeSortColumn(field);
        }
    }

    /**
     * @hidden
     * @returns {void}
     */
    public clearGridActions(): void {
        this.setProperties({ sortSettings: { columns: [] } }, true);
        this.setProperties({ filterSettings: { columns: [] } }, true);
        this.setProperties({ searchSettings: { key: '' } }, true);
        if (this.allowGrouping) {
            this.setProperties({ groupSettings: { columns: [] } }, false);
        } else {
            this.freezeRefresh();
        }
    }

    /**
     * Filters grid row by column name with the given options.
     *
     * @param  {string} fieldName - Defines the field name of the column.
     * @param  {string} filterOperator - Defines the operator to filter records.
     * @param  {string | number | Date | boolean} filterValue - Defines the value used to filter records.
     * @param  {string} predicate - Defines the relationship between one filter query and another by using AND or OR predicate.
     * @param  {boolean} matchCase - If match case is set to true, the grid filters the records with exact match. if false, it filters case
     * insensitive records (uppercase and lowercase letters treated the same).
     * @param  {boolean} ignoreAccent - If ignoreAccent set to true,
     * then filter ignores the diacritic characters or accents while filtering.
     * @param  {string} actualFilterValue - Defines the actual filter value for the filter column.
     * @param  {string} actualOperator - Defines the actual filter operator for the filter column.
     *
     * @returns {void}
     */
    public filterByColumn(fieldName: string, filterOperator: string,
                          filterValue: string | number | Date | boolean| number[]| string[]| Date[]| boolean[]| null,
                          predicate?: string, matchCase?: boolean,
                          ignoreAccent?: boolean, actualFilterValue?: string, actualOperator?: string): void {
        if (this.filterModule) {
            this.filterModule.filterByColumn(
                fieldName, filterOperator, filterValue, predicate, matchCase, ignoreAccent,
                actualFilterValue, actualOperator
            );
        }
    }

    /**
     * Clears all the filtered rows of the Grid.
     *
     * @param {string[]} fields - Defines the Fields
     * @returns {void}
     */
    public clearFiltering(fields?: string[]): void {
        if (this.filterModule) {
            this.filterModule.clearFiltering(fields);
        }
    }

    /**
     * Removes filtered column by field name.
     *
     * @param  {string} field - Defines column field name to remove filter.
     * @param  {boolean} isClearFilterBar -  Specifies whether the filter bar value needs to be cleared.
     * @returns {void}
     * @hidden
     */
    public removeFilteredColsByField(field: string, isClearFilterBar?: boolean): void {
        if (this.filterModule) {
            this.filterModule.removeFilteredColsByField(field, isClearFilterBar);
        }
    }

    /**
     * Selects a row by given index.
     *
     * @param  {number} index - Defines the row index.
     * @param  {boolean} isToggle - If set to true, then it toggles the selection.
     *
     * @returns {void}
     */
    public selectRow(index: number, isToggle?: boolean): void {
        if (this.selectionModule) {
            this.selectionModule.selectRow(index, isToggle);
        }
    }

    /**
     * Selects a collection of rows by indexes.
     *
     * @param  {number[]} rowIndexes - Specifies the row indexes.
     *
     * @returns {void}
     */
    public selectRows(rowIndexes: number[]): void {
        if (this.selectionModule) {
            this.selectionModule.selectRows(rowIndexes);
        }
    }

    /**
     * Deselects the current selected rows and cells.
     *
     * @returns {void}
     */
    public clearSelection(): void {
        if (this.selectionModule) {
            this.selectionModule.clearSelection();
        }
    }

    /**
     * Selects a cell by the given index.
     *
     * @param  {IIndex} cellIndex - Defines the row and column indexes.
     * @param  {boolean} isToggle - If set to true, then it toggles the selection.
     *
     * @returns {void}
     */
    public selectCell(cellIndex: IIndex, isToggle?: boolean): void {
        if (this.selectionModule) {
            this.selectionModule.selectCell(cellIndex, isToggle);
        }
    }

    /**
     * Selects a range of cells from start and end indexes.
     *
     * @param  {IIndex} startIndex - Specifies the row and column's start index.
     * @param  {IIndex} endIndex - Specifies the row and column's end index.
     *
     * @returns {void}
     */
    public selectCellsByRange(startIndex: IIndex, endIndex?: IIndex): void {
        this.selectionModule.selectCellsByRange(startIndex, endIndex);
    }

    /**
     * Searches Grid records using the given key.
     * You can customize the default search option by using the
     * [`searchSettings`](./#searchsettings/).
     *
     * @param  {string} searchString - Defines the key.
     *
     * @returns {void}
     */
    public search(searchString: string): void {
        if (this.searchModule) {
            this.searchModule.search(searchString);
        }
    }

    /**
     * By default, prints all the pages of the Grid and hides the pager.
     * > You can customize print options using the
     * [`printMode`](./#printmode).
     *
     * @returns {void}
     */
    public print(): void {
        if (this.printModule) {
            this.printModule.print();
        }
    }

    /**
     * Delete a record with Given options. If fieldname and data is not given then grid will delete the selected record.
     * > `editSettings.allowDeleting` should be true.
     *
     * @param {string} fieldname - Defines the primary key field, 'Name of the column'.
     * @param {Object} data - Defines the JSON data of the record to be deleted.
     * @returns {void}
     */
    public deleteRecord(fieldname?: string, data?: Object): void {
        if (this.editModule) {
            this.editModule.deleteRecord(fieldname, data);
        }
    }

    /**
     * Starts edit the selected row. At least one row must be selected before invoking this method.
     * `editSettings.allowEditing` should be true.
     * {% codeBlock src='grid/startEdit/index.md' %}{% endcodeBlock %}
     *
     * @returns {void}
     */
    public startEdit(): void {
        if (this.editModule) {
            this.editModule.startEdit();
        }
    }

    /**
     * If Grid is in editable state, you can save a record by invoking endEdit.
     *
     * @returns {void}
     */
    public endEdit(): void {
        if (this.editModule) {
            this.editModule.endEdit();
        }
    }

    /**
     * Cancels edited state.
     *
     * @returns {void}
     */
    public closeEdit(): void {
        if (this.editModule) {
            this.editModule.closeEdit();
        }
    }

    /**
     * Adds a new record to the Grid. Without passing parameters, it adds empty rows.
     * > `editSettings.allowEditing` should be true.
     *
     * @param {Object} data - Defines the new add record data.
     * @param {number} index - Defines the row index to be added
     * @returns {void}
     */
    public addRecord(data?: Object, index?: number): void {
        if (this.editModule) {
            this.editModule.addRecord(data, index);
        }
    }

    /**
     * Delete any visible row by TR element.
     *
     * @param {HTMLTableRowElement} tr - Defines the table row element.
     * @returns {void}
     */
    public deleteRow(tr: HTMLTableRowElement): void {
        if (this.editModule) {
            this.editModule.deleteRow(tr);
        }
    }

    /**
     * Changes a particular cell into edited state based on the row index and field name provided in the `batch` mode.
     *
     * @param {number} index - Defines row index to edit a particular cell.
     * @param {string} field - Defines the field name of the column to perform batch edit.
     *
     * @returns {void}
     */
    public editCell(index: number, field: string): void {
        if (this.editModule) {
            this.editModule.editCell(index, field);
        }
    }

    /**
     * Saves the cell that is currently edited. It does not save the value to the DataSource.
     *
     * @returns {void}
     * {% codeBlock src='grid/saveCell/index.md' %}{% endcodeBlock %}
     */
    public saveCell(): void {
        if (this.editModule) {
            this.editModule.saveCell();
        }
    }

    /**
     * To update the specified cell by given value without changing into edited state.
     *
     * @param {number} rowIndex Defines the row index.
     * @param {string} field Defines the column field.
     * @param {string | number | boolean | Date} value - Defines the value to be changed.
     *
     * @returns {void}
     */
    public updateCell(rowIndex: number, field: string, value: string | number | boolean | Date): void {
        if (this.editModule) {
            this.editModule.updateCell(rowIndex, field, value);
        }
    }

    /**
     * To update the specified row by given values without changing into edited state.
     *
     * {% codeBlock src='grid/updateRow/index.md' %}{% endcodeBlock %}
     *
     * @param {number} index Defines the row index.
     * @param {Object} data Defines the data object to be updated.
     *
     * @returns {void}
     */
    public updateRow(index: number, data: Object): void {
        if (this.editModule) {
            this.editModule.updateRow(index, data);
        }
    }

    /**
     * Gets the added, edited,and deleted data before bulk save to the DataSource in batch mode.
     *
     * @returns {Object} Returns the batch changes
     */
    public getBatchChanges(): Object {
        if (this.editModule) {
            return this.editModule.getBatchChanges();
        }
        return {};
    }

    /**
     * Enables or disables ToolBar items.
     *
     * @param {string[]} items - Defines the collection of itemID of ToolBar items.
     * @param {boolean} isEnable - Defines the items to be enabled or disabled.
     *
     * @returns {void}
     */
    public enableToolbarItems(items: string[], isEnable: boolean): void {
        if (this.toolbarModule) {
            this.toolbarModule.enableItems(items, isEnable);
        }
    }

    /**
     * Copy the selected rows or cells data into clipboard.
     *
     * @param {boolean} withHeader - Specifies whether the column header text needs to be copied along with rows or cells.
     * @returns {void}
     */
    public copy(withHeader?: boolean): void {
        if (this.clipboardModule) {
            this.clipboardModule.copy(withHeader);
        }
    }

    /**
     * @hidden
     * @returns {void}
     */
    public recalcIndentWidth(): void {
        if (!this.getHeaderTable().querySelector('.e-emptycell')) {
            return;
        }
        if ((!this.groupSettings.columns.length && !this.isDetail() && !this.isRowDragable()) ||
            this.getHeaderTable().querySelector('.e-emptycell.e-indentRefreshed') ||
            !this.getContentTable()) {
            return;
        }
        let indentWidth: number = (this.getHeaderTable().querySelector('.e-emptycell').parentElement as HTMLElement).offsetWidth;
        const headerCol: HTMLElement[] = [].slice.call(this.getHeaderTable().querySelector(literals.colGroup).childNodes);
        const contentCol: HTMLElement[] = [].slice.call(this.getContentTable().querySelector(literals.colGroup).childNodes);
        const perPixel: number = indentWidth / 30;
        let i: number = this.getFrozenMode() === 'Right' ? this.groupSettings.columns.length + this.getColumns().length : 0;
        const parentOffset: number =  this.element.offsetWidth;
        const applyWidth: Function = (index: number, width: number) => {
            if (ispercentageWidth(this)) {
                const newWidth: string = (width / parentOffset * 100).toFixed(1) + '%';
                headerCol[parseInt(index.toString(), 10)].style.width = newWidth;
                contentCol[parseInt(index.toString(), 10)].style.width = newWidth;
            } else {
                headerCol[parseInt(index.toString(), 10)].style.width = width + 'px';
                contentCol[parseInt(index.toString(), 10)].style.width = width + 'px';
            }
            this.notify(events.columnWidthChanged, { index: index, width: width });
        };
        if (perPixel >= 1) {
            indentWidth = (30 / perPixel);
        }
        if (indentWidth < 1) {
            indentWidth = 1;
        }
        if (this.enableColumnVirtualization || this.isAutoGen || (this.columns.length === this.groupSettings.columns.length)) {
            indentWidth = 30;
        }
        while (i < this.groupSettings.columns.length) {
            applyWidth(i, indentWidth);
            i++;
        }
        if (this.isDetail()) {
            applyWidth(i, indentWidth);
            i++;
        }
        if (this.isRowDragable()) {
            applyWidth(i, indentWidth);
        }
        this.isAutoGen = false;
        this.getHeaderTable().querySelector('.e-emptycell').classList.add('e-indentRefreshed');
    }

    /**
     * @hidden
     * @returns {void}
     */
    public resetIndentWidth(): void {
        if (this.isDestroyed) { return; }
        if (ispercentageWidth(this)) {
            this.getHeaderTable().querySelector('.e-emptycell').classList.remove('e-indentRefreshed');
            this.widthService.setWidthToColumns();
            this.recalcIndentWidth();
            if (this.autoFit) {
                this.preventAdjustColumns();
            }
        }
        if ((this.width === 'auto' || typeof (this.width) === 'string' && this.width.indexOf('%') !== -1)
            && this.getColumns().filter((col: Column) => (!col.width || col.width === 'auto') && col.minWidth).length > 0) {
            const tgridWidth: number | string = this.widthService.getTableWidth(this.getColumns(), true);
            this.widthService.setMinwidthBycalculation(tgridWidth as number);
        }
        if (this.isFrozenGrid() && this.enableColumnVirtualization && this.widthService) {
            this.widthService.refreshFrozenScrollbar();
        }
        if (this.allowTextWrap && this.textWrapSettings.wrapMode !== 'Content') {
            this.notify(events.refreshHandlers, {});
        }
        if ((this.frozenRows || this.pinnedTopRowModels.length) && this.scrollModule) {
            this.scrollModule.resizeFrozenRowBorder();
        }
        if (this.enableStickyHeader){
            this.scrollModule.makeStickyHeader();
        }
        if (this.enableAutoFill && this.selectionSettings.type === 'Multiple' &&
            this.selectionSettings.mode === 'Cell' && this.selectionModule.selectedRowCellIndexes.length) {
            this.selectionModule.updateAutoFillPosition();
            this.selectionModule.drawBorders();
        }
    }

    /**
     * @hidden
     * @returns {boolean} Returns isRowDragable
     */
    public isRowDragable(): boolean {
        return this.allowRowDragAndDrop && !this.rowDropSettings.targetID;
    }


    /**
     * Changes the Grid column positions by field names.
     *
     * @param  {string} fromFName - Defines the origin field name.
     * @param  {string} toFName - Defines the destination field name.
     *
     * @returns {void}
     */
    public reorderColumns(fromFName: string | string[], toFName: string): void {
        if (this.reorderModule) {
            this.reorderModule.reorderColumns(fromFName, toFName);
        }
    }

    /**
     * Reorders a column in the Grid using column models.
     *
     * Moves the specified column (fromColumn) before the target column (toColumn),
     * supporting both standard and stacked header columns.
     *
     * @param {Column} fromColumn - The column model to be moved.
     * @param {Column} toColumn - The target column model before which the source column will be placed.
     *
     * @returns {void}
     */
    public reorderColumnByModel(fromColumn: Column, toColumn: Column): void {
        if (this.reorderModule) {
            this.reorderModule.reorderColumnByModel(fromColumn, toColumn);
        }
    }

    /**
     * Changes the Grid column positions by field index. If you invoke reorderColumnByIndex multiple times,
     * then you won't get the same results every time.
     *
     * @param  {number} fromIndex - Defines the origin field index.
     * @param  {number} toIndex - Defines the destination field index.
     *
     * @returns {void}
     */
    public reorderColumnByIndex(fromIndex: number, toIndex: number): void {
        if (this.reorderModule) {
            this.reorderModule.reorderColumnByIndex(fromIndex, toIndex);
        }
    }

    /**
     * Changes the Grid column positions by field index. If you invoke reorderColumnByTargetIndex multiple times,
     * then you will get the same results every time.
     *
     * @param  {string} fieldName - Defines the field name.
     * @param  {number} toIndex - Defines the destination field index.
     *
     * @returns {void}
     */
    public reorderColumnByTargetIndex(fieldName: string | string[], toIndex: number): void {
        if (this.reorderModule) {
            this.reorderModule.reorderColumnByTargetIndex(fieldName, toIndex);
        }
    }

    /**
     * Changes the Grid Row position with given indexes.
     *
     * @param  {number} fromIndexes - Defines the origin Indexes.
     * @param  {number} toIndex - Defines the destination Index.
     *
     * @returns {void}
     */
    public reorderRows(fromIndexes: number[], toIndex: number): void {
        if (this.rowDragAndDropModule) {
            this.rowDragAndDropModule.reorderRows(fromIndexes, toIndex);
        }
    }

    /**
     * @param {ReturnType} e - Defines the Return type
     * @returns {void}
     * @hidden
     */
    public refreshDataSource(e: ReturnType): void {
        this.notify('refreshdataSource', e);
    }

    /**
     * @param {boolean} enable -Defines the enable
     * @returns {void}
     * @hidden
     */
    public disableRowDD(enable: boolean): void {
        const headerTable: Element = this.getHeaderTable();
        const contentTable: Element = this.getContentTable();
        const headerRows: NodeListOf<Element> = headerTable.querySelectorAll('th.e-rowdragheader, th.e-mastercell');
        const rows: Element[] = this.getRows();
        const disValue: string = enable ? 'none' : '';
        setStyleAttribute(<HTMLElement>headerTable.querySelector(literals.colGroup).childNodes[0], { 'display': disValue });
        setStyleAttribute(<HTMLElement>contentTable.querySelector(literals.colGroup).childNodes[0], { 'display': disValue });
        for (let i: number = 0; i < this.getRows().length; i++) {
            const ele: Element = rows[parseInt(i.toString(), 10)].firstElementChild;
            if (enable) {
                addClass([ele], 'e-hide');
            } else {
                removeClass([ele], ['e-hide']);
            }
        }
        for (let j: number = 0; j < headerTable.querySelectorAll('th.e-rowdragheader, th.e-mastercell').length; j++) {
            const ele: Element = headerRows[parseInt(j.toString(), 10)];
            if (enable) {
                addClass([ele], 'e-hide');
            } else {
                removeClass([ele], ['e-hide']);
            }
        }
    }

    /**
     * Changes the column width to automatically fit its content to ensure that the width shows the content without wrapping/hiding.
     * > * This method ignores the hidden columns.
     * > * Uses the `autoFitColumns` method in the `dataBound` event to resize at initial rendering.
     * > * By specifying the start row index and end row index, providing the range within which the maximum width for that column should be considered when applying `autoFitColumns`.
     * > * The width of header rows is always calculated. If the width of a header row exceeds the specified range, its width will be allocated to the specific content rows.
     *
     * @param  {string |string[]} fieldNames - Defines the column names.
     * @param  {number} startRowIndex - Specifies the start index of the content row.
     * @param  {number} endRowIndex - Specifies the end index of content row.
     * @returns {void}
     *
     *
     * ```typescript
     * <div id="Grid"></div>
     * <script>
     * let gridObj: Grid = new Grid({
     *     dataSource: employeeData,
     *     columns: [
     *         { field: 'OrderID', headerText: 'Order ID', width:100 },
     *         { field: 'EmployeeID', headerText: 'Employee ID' }],
     *     dataBound: () => gridObj.autoFitColumns('EmployeeID');
     * });
     * gridObj.appendTo('#Grid');
     * </script>
     * ```
     *
     */
    public autoFitColumns(fieldNames?: string | string[], startRowIndex?: number, endRowIndex?: number): void {
        const injectedModules: Function[] = this.getInjectedModules();
        const resize: Function = injectedModules.find(function (item: Function): boolean {
            if (typeof item === 'function' && !isNullOrUndefined(item.prototype)) {
                return item.prototype.getModuleName() === 'resize';
            } else {
                return item.name === 'Resize';
            }
        });
        if (!this.resizeModule && resize) {
            this.autoFitColumnsResize = true;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (this as any).injectModules();
        }
        if (this.resizeModule) {
            this.resizeModule.autoFitColumns(fieldNames, startRowIndex, endRowIndex);
        }
    }

    /**
     * @returns {void}
     * @hidden
     */
    public preventAdjustColumns(): void {
        if ((this.enableAdaptiveUI && this.rowRenderingMode === 'Vertical')
            || (this.allowResizing && this.resizeSettings.mode === 'Auto')) { return; }
        const columns: Column[] = this.getColumns();
        const headerTable: HTMLElement = this.getHeaderTable() as HTMLElement;
        let tableWidth: number = 0;
        for (let i: number = 0; i < columns.length; i++) {
            if (columns[parseInt(i.toString(), 10)].visible) {
                if (this.groupSettings.columns.length
                    && this.groupSettings.columns.indexOf(columns[parseInt(i.toString(), 10)].field) > -1) {
                    const headerCol: HTMLElement[] = [].slice.call(headerTable.querySelector('colgroup')
                        .querySelectorAll(':not(.e-group-intent):not(.e-detail-intent):not(.e-drag-intent)'));
                    if (headerCol[parseInt(i.toString(), 10)].style.display === 'none') {
                        continue;
                    }
                }
                if (columns[parseInt(i.toString(), 10)].width) {
                    tableWidth += parseFloat(columns[parseInt(i.toString(), 10)].width.toString());
                } else {
                    tableWidth = 0;
                    break;
                }
            }
        }
        if (tableWidth) {
            const percentageWidth: boolean = this.isPercentageWidthGrid();
            const unit: string = this.widthUnit(percentageWidth);
            const contentTable: HTMLElement = this.getContentTable() as HTMLElement;
            if (this.groupSettings.columns.length || this.isDetail() || this.isRowDragable()) {
                const indentWidth: number = this.defaultIndentWidth(percentageWidth);
                const indentWidthUnitFormat: string = indentWidth.toString() + unit;
                const headerIndentCol: HTMLElement[] = [].slice.call(headerTable.querySelector('colgroup')
                    .querySelectorAll('.e-group-intent, .e-detail-intent, .e-drag-intent'));
                const contentIndentCol: HTMLElement[] = [].slice.call(contentTable.querySelector('colgroup')
                    .querySelectorAll('.e-group-intent, .e-detail-intent, .e-drag-intent'));
                for (let i: number = 0; i < headerIndentCol.length; i++) {
                    headerIndentCol[parseInt(i.toString(), 10)].style.setProperty('width', indentWidthUnitFormat);
                    contentIndentCol[parseInt(i.toString(), 10)].style.setProperty('width', indentWidthUnitFormat);
                    tableWidth += indentWidth;
                }
            }
            if ((percentageWidth && tableWidth < 100)
                || (!percentageWidth && tableWidth < contentTable.parentElement.clientWidth)) {
                if (!isNullOrUndefined(contentTable.querySelector('.e-emptyrow'))) {
                    addClass([headerTable], ['e-tableborder']);
                    removeClass([contentTable], ['e-tableborder']);
                }
                else {
                    addClass([headerTable, contentTable], ['e-tableborder']);
                }
            }
            const tableWidthUnitFormat: string = tableWidth.toString() + unit;
            headerTable.style.setProperty('width', tableWidthUnitFormat);
            contentTable.style.setProperty('width', tableWidthUnitFormat);
        } else {
            this.restoreAdjustColumns();
        }
    }

    private restoreAdjustColumns(): void {
        if ((this.enableAdaptiveUI && this.rowRenderingMode === 'Vertical')
            || (this.allowResizing && this.resizeSettings.mode === 'Auto')) { return; }
        const headerTable: HTMLElement = this.getHeaderTable() as HTMLElement;
        const contentTable: HTMLElement = this.getContentTable() as HTMLElement;
        removeClass([headerTable, contentTable], ['e-tableborder']);
        headerTable.style.removeProperty('width');
        contentTable.style.removeProperty('width');
        if (this.groupSettings.columns.length || this.isDetail() || this.isRowDragable()) {
            const percentageWidth: boolean = this.isPercentageWidthGrid();
            const indentWidthUnitFormat: string = this.defaultIndentWidth(percentageWidth).toString() + this.widthUnit(percentageWidth);
            const headerIndentCol: HTMLElement[] = [].slice.call(headerTable.querySelector('colgroup')
                .querySelectorAll('.e-group-intent, .e-detail-intent, .e-drag-intent'));
            headerIndentCol.forEach((element: HTMLElement) => {
                element.style.setProperty('width', indentWidthUnitFormat);
            });
            headerTable.querySelector('.e-emptycell').classList.remove('e-indentRefreshed');
            this.recalcIndentWidth();
        }
    }

    private widthUnit(percentageWidth: boolean): string {
        return percentageWidth ? '%' : 'px';
    }

    private defaultIndentWidth(percentageWidth: boolean): number {
        return percentageWidth ? parseFloat((30 / this.element.offsetWidth * 100).toFixed(1)) : 30;
    }

    private isPercentageWidthGrid(): boolean {
        const column: Column = this.getColumns().find((col: Column) => { return !isNullOrUndefined(col.width); });
        return column ? column.width.toString().indexOf('%') > -1 : false;
    }

    /**
     * @param {number} x - Defines the number
     * @param {number} y - Defines the number
     * @param {Element} target - Defines the Element
     * @returns {void}
     * @hidden
     */
    public createColumnchooser(x: number, y: number, target: Element): void {
        if (this.columnChooserModule) {
            this.columnChooserModule.renderColumnChooser(x, y, target);
        }
    }

    private initializeServices(): void {
        this.serviceLocator.register('widthService', this.widthService = new ColumnWidthService(this));
        this.serviceLocator.register('cellRendererFactory', new CellRendererFactory);
        this.serviceLocator.register('rendererFactory', new RendererFactory);
        this.serviceLocator.register('localization', this.localeObj = new L10n(this.getModuleName(), this.defaultLocale, this.locale));
        this.serviceLocator.register('valueFormatter', this.valueFormatterService = new ValueFormatter(this.locale));
        this.serviceLocator.register('showHideService', this.showHider = new ShowHide(this));
        this.serviceLocator.register('ariaService', this.ariaService = new AriaService());
        this.serviceLocator.register('focus', this.focusModule = new FocusStrategy(this));
    }

    private processModel(): void {
        const gCols: string[] = this.groupSettings.columns;
        const sCols: SortDescriptorModel[] = this.sortSettings.columns;
        let flag: boolean;
        let j: number;
        if (this.allowGrouping) {
            for (let i: number = 0, len: number = gCols.length; i < len; i++) {
                flag = false;
                j = 0;
                for (let sLen: number = sCols.length; j < sLen; j++) {
                    if (sCols[parseInt(j.toString(), 10)].field === gCols[parseInt(i.toString(), 10)]) {
                        flag = true;
                        break;
                    }
                }
                if (!flag) {
                    sCols.push({ field: gCols[parseInt(i.toString(), 10)], direction: 'Ascending', isFromGroup: true });
                } else {
                    if (this.allowSorting) {
                        this.sortedColumns.push(sCols[parseInt(j.toString(), 10)].field);
                    } else {
                        sCols[parseInt(j.toString(), 10)].direction = 'Ascending';
                    }
                }
                if (!this.groupSettings.showGroupedColumn) {
                    const column: Column = this.enableColumnVirtualization ?
                        (<Column[]>this.columns).filter((c: Column) => c.field === gCols[parseInt(i.toString(), 10)])[0]
                        : this.getColumnByField(gCols[parseInt(i.toString(), 10)]);
                    if (column) {
                        column.visible = false;
                    } else {
                        this.log('initial_action', { moduleName: 'group', columnName: gCols[parseInt(i.toString(), 10)] });
                    }
                }
            }
        }
        if (!gCols.length) {
            for (let i: number = 0; i < sCols.length; i++) {
                this.sortedColumns.push(sCols[parseInt(i.toString(), 10)].field);
            }
        }
        this.rowTemplateFn = templateCompiler(this.rowTemplate);
        this.emptyRecordTemplateFn = templateCompiler(this.emptyRecordTemplate);
        this.detailTemplateFn = templateCompiler(this.detailTemplate);
        this.editTemplateFn = templateCompiler(this.editSettings.template as string);
        this.editHeaderTemplateFn = templateCompiler(this.editSettings.headerTemplate as string);
        this.editFooterTemplateFn = templateCompiler(this.editSettings.footerTemplate as string);
        this.columnChooserTemplateFn = templateCompiler(this.columnChooserSettings.template as string);
        this.columnChooserHeaderTemplateFn = templateCompiler(this.columnChooserSettings.headerTemplate as string);
        this.columnChooserFooterTemplateFn = templateCompiler(this.columnChooserSettings.footerTemplate as string);
        if (!isNullOrUndefined(this.parentDetails)) {
            const value: string = isNullOrUndefined(this.parentDetails.parentKeyFieldValue) ? 'undefined' :
                this.parentDetails.parentKeyFieldValue;
            this.query.where(this.queryString, 'equal', value, true);
        }
        this.initForeignColumn();
    }

    private initForeignColumn(): void {
        if (this.isForeignKeyEnabled(this.getColumns())) {
            this.notify(events.initForeignKeyColumn, this.getForeignKeyColumns());
        }
    }

    private enableVerticalRendering(): void {
        if (this.rowRenderingMode === 'Vertical') {
            this.element.classList.add('e-row-responsive');
        } else {
            this.element.classList.remove('e-row-responsive');
        }
    }

    private gridRender(): void {
        this.updateRTL();
        if (this.rowRenderingMode === 'Vertical') {
            this.element.classList.add('e-row-responsive');
        }
        if (this.enableHover) {
            this.element.classList.add('e-gridhover');
        }
        if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent) || Browser.isSafari()) {
            this.element.classList.add('e-mac-safari');
        }
        if (Browser.isDevice) {
            this.element.classList.add('e-device');
            if (this.adaptiveUIMode === 'Desktop' && !(this.rowRenderingMode === 'Vertical')) {
                this.enableAdaptiveUI = false;
            }
        }
        if (this.adaptiveUIMode === 'Mobile' && !(Browser.isDevice || this.rowRenderingMode === 'Vertical')) {
            this.enableAdaptiveUI = false;
        }
        if (this.rowHeight) {
            this.element.classList.add('e-grid-min-height');
        }
        if (this.cssClass) {
            if (this.cssClass.indexOf(' ') !== -1) {
                this.element.classList.add(...this.cssClass.split(' '));
            } else {
                this.element.classList.add(this.cssClass);
            }
        }
        // If the below if statement is removed, then drag and drop between grids will not work in firefox browser.
        if (this.allowRowDragAndDrop && this.rowDropSettings.targetID && Browser.info.name === 'mozilla') {
            this.element.classList.add('e-disableuserselect');
        }
        if (this.editSettings.showAddNewRow && (this.enableVirtualization || this.enableInfiniteScrolling)) {
            this.editSettings.newRowPosition = 'Top';
        }
        classList(this.element, ['e-responsive', 'e-default'], []);
        const rendererFactory: RendererFactory = this.serviceLocator.getService<RendererFactory>('rendererFactory');
        this.headerModule = rendererFactory.getRenderer(RenderType.Header);
        this.contentModule = rendererFactory.getRenderer(RenderType.Content);
        this.printModule = new Print(this, this.scrollModule);
        this.clipboardModule = new Clipboard(this, this.serviceLocator);
        this.renderModule.render();
        this.eventInitializer();
        this.createGridPopUpElement();
        this.widthService.setWidthToColumns();
        this.updateGridLines();
        this.applyTextWrap();
        this.createTooltip(); //for clip mode ellipsis
        this.enableBoxSelection();
    }

    public dataReady(): void {
        this.scrollModule.setWidth();
        this.scrollModule.setHeight();
        if (this.height !== 'auto') {
            this.scrollModule.setPadding();
        }
    }

    private updateRTL(): void {
        if (this.enableRtl) {
            this.element.classList.add('e-rtl');
        } else {
            this.element.classList.remove('e-rtl');
        }
    }

    private createGridPopUpElement(): void {
        const popup: HTMLElement = this.createElement('div', { className: 'e-gridpopup' });
        popup.style.display = 'none';
        const content: Element = this.createElement('div', { className: literals.content, attrs: { tabIndex: '-1' } });
        append([content, this.createElement('div', { className: 'e-uptail e-tail' })], popup);
        content.appendChild(this.createElement('span'));
        append([content, this.createElement('div', { className: 'e-downtail e-tail' })], popup);
        this.element.appendChild(popup);
    }

    private updateGridLines(): void {
        classList(this.element, [], ['e-verticallines', 'e-horizontallines', 'e-hidelines', 'e-bothlines']);
        switch (this.gridLines) {
        case 'Horizontal':
            this.element.classList.add('e-horizontallines');
            break;
        case 'Vertical':
            this.element.classList.add('e-verticallines');
            break;
        case 'None':
            this.element.classList.add('e-hidelines');
            break;
        case 'Both':
            this.element.classList.add('e-bothlines');
            break;
        }
        this.updateResizeLines();
    }

    private updateResizeLines(): void {
        if (this.allowResizing &&
            !(this.gridLines === 'Vertical' || this.gridLines === 'Both')) {
            this.element.classList.add('e-resize-lines');
        } else {
            this.element.classList.remove('e-resize-lines');
        }
    }

    /**
     * The function is used to apply text wrap
     *
     * @returns {void}
     * @hidden
     */
    public applyTextWrap(): void {
        if (this.allowTextWrap) {
            const headerRows: Element[] = [].slice.call(this.element.getElementsByClassName('e-columnheader'));
            switch (this.textWrapSettings.wrapMode) {
            case 'Header':
                wrap(this.element, false);
                wrap(this.getContent(), false);
                wrap(headerRows, true);
                break;
            case 'Content':
                wrap(this.getContent(), true);
                wrap(this.element, false);
                wrap(headerRows, false);
                break;
            default:
                wrap(this.element, true);
                wrap(this.getContent(), false);
                wrap(headerRows, false);
            }
            if (this.textWrapSettings.wrapMode !== 'Content') {
                this.notify(events.refreshHandlers, {});
            }
        }
    }

    /**
     * The function is used to remove text wrap
     *
     * @returns {void}
     * @hidden
     */
    public removeTextWrap(): void {
        wrap(this.element, false);
        const headerRows: Element[] = [].slice.call(this.element.getElementsByClassName('e-columnheader'));
        wrap(headerRows, false);
        wrap(this.getContent(), false);
        if (this.textWrapSettings.wrapMode !== 'Content') {
            this.notify(events.refreshHandlers, {});
        }
    }

    /**
     * The function is used to add Tooltip to the grid cell that has ellipsiswithtooltip clip mode.
     *
     * @returns {void}
     * @hidden
     */
    public createTooltip(): void {
        this.toolTipObj = new Tooltip({
            opensOn: 'custom',
            content: '',
            cssClass: this.cssClass ? this.cssClass : null
        }, this.element);
    }

    /**
     * Initiates a complete refresh of the Grid's column and layout.
     *
     * This method forces a full re-render of the Grid, ensuring that any dynamic
     * changes to columns or layout are immediately reflected.
     *
     * @returns {void}
     */
    public freezeRefresh(): void {
        if (this.enableVirtualization || this.enableInfiniteScrolling) {
            this.pageSettings.currentPage = 1;
        }
        this.componentRefresh();
    }

    private getTooltipStatus(element: HTMLElement): boolean {
        const headerTable: Element = this.getHeaderTable();
        const headerDivTag: string = this.enableAdaptiveUI && this.rowRenderingMode === 'Vertical' ? 'e-gridcontent' : 'e-gridheader';
        const htable: HTMLDivElement = this.createTable(headerTable, headerDivTag, 'header');
        const ctable: HTMLDivElement = this.createTable(headerTable, headerDivTag, 'content');
        const table: HTMLDivElement = element.classList.contains('e-headercell') ? htable : ctable;
        const ele: string = element.classList.contains('e-headercell') ? 'th' : 'tr';
        table.querySelector(ele).className = element.className;
        const targetElement: HTMLElement = table.querySelector(ele);
        targetElement.innerHTML = '';
        Array.from(element.childNodes).forEach((child: ChildNode) => {
            targetElement.appendChild(child.cloneNode(true));
        });
        const width: number = table.querySelector(ele).getBoundingClientRect().width;
        document.body.removeChild(htable);
        document.body.removeChild(ctable);
        if ((width > element.getBoundingClientRect().width && !element.classList.contains('e-editedbatchcell')) ||
            (this.enableAdaptiveUI && this.rowRenderingMode === 'Vertical' &&
                width > (element.getBoundingClientRect().width * 0.55) - (this.height !== 'auto' ? 16 : 0))) {
            // 0.55 - defines the width of adaptive content cell, 16 - defines the scrollbar width
            return true;
        }
        return false;
    }

    private mouseMoveHandler(e: MouseEvent): void {
        if (this.isEllipsisTooltip()) {
            const element: HTMLElement = parentsUntil((e.target as Element), 'e-ellipsistooltip') as HTMLElement;
            if (e.type === 'mouseout' && (this.prevElement !== element || element !== parentsUntil((e.relatedTarget as Element), 'e-ellipsistooltip') as HTMLElement)) {
                this.toolTipObj.close();
                this.toolTipObj['clear']();
                this.prevElement = null;
            }
            const tagName: string = (e.target as Element).tagName;
            const elemNames: string[] = ['A', 'BUTTON', 'INPUT'];
            if (element && e.type !== 'mouseout' && !(Browser.isDevice && elemNames.indexOf(tagName) !== -1)) {
                if (this.getTooltipStatus(element)) {
                    const col: Column = this.getColumns()[parseInt(element.getAttribute(literals.ariaColIndex), 10) - 1] as Column;
                    const domSetter: string = col && col.disableHtmlEncode ? 'innerText' : 'innerHTML';
                    const contentDiv: HTMLDivElement = this.createElement('div');
                    if (element.getElementsByClassName('e-headertext').length) {
                        const innerElement: HTMLElement = element.getElementsByClassName('e-headertext')[0] as HTMLElement;
                        contentDiv[`${domSetter}`] = this.sanitize(innerElement.innerText);
                        this.toolTipObj.content = contentDiv;
                    } else {
                        contentDiv[`${domSetter}`] = this.sanitize(element.innerText);
                        this.toolTipObj.content = contentDiv;
                    }
                    if (this.enableHtmlSanitizer) {
                        this.toolTipObj.enableHtmlSanitizer = true;
                    }
                    if (col && col.disableHtmlEncode) {
                        (<{ enableHtmlParse?: boolean }>this.toolTipObj).enableHtmlParse = false;
                    }
                    if (element !== this.prevElement) {
                        this.toolTipObj['open'](element);
                    }
                    this.prevElement = element;
                }
            }
        }
    }

    private isEllipsisTooltip(): boolean {
        const cols: Column[] = this.getColumns();
        if (this.clipMode === 'EllipsisWithTooltip') {
            return true;
        }
        for (let i: number = 0; i < cols.length; i++) {
            if (cols[parseInt(i.toString(), 10)].clipMode === 'EllipsisWithTooltip') {
                return true;
            }
        }
        return false;
    }

    private scrollHandler(): void {
        if (this.isEllipsisTooltip()) {
            this.toolTipObj.close();
        }
    }
    /**
     * To create table for ellipsiswithtooltip
     *
     * @param {Element} table - Defines the table
     * @param {string} tag - Defines the tag
     * @param {string} type - Defines the type
     * @returns {HTMLDivElement} Returns the HTML div ELement
     * @hidden
     */
    protected createTable(table: Element, tag: string, type: string): HTMLDivElement {
        const myTableDiv: HTMLDivElement = this.createElement('div') as HTMLDivElement;
        myTableDiv.className = this.element.className;
        myTableDiv.style.cssText = 'display: inline-block;visibility:hidden;position:absolute';
        const mySubDiv: HTMLDivElement = this.createElement('div') as HTMLDivElement;
        mySubDiv.className = tag;
        const myTable: HTMLTableElement = this.createElement('table') as HTMLTableElement;
        myTable.className = table.className;
        myTable.style.cssText = 'table-layout: auto;width: auto';
        const ele: string = (type === 'header') ? 'th' : 'td';
        const myTr: HTMLTableRowElement = this.createElement('tr', { attrs: { role: 'row' } }) as HTMLTableRowElement;
        const mytd: HTMLElement = this.createElement(ele) as HTMLElement;
        myTr.appendChild(mytd);
        myTable.appendChild(myTr);
        mySubDiv.appendChild(myTable);
        myTableDiv.appendChild(mySubDiv);
        document.body.appendChild(myTableDiv);
        return myTableDiv;
    }

    private onKeyPressed(e: KeyArg): void {
        if (e.action === 'tab' || e.action === 'shiftTab') {
            this.toolTipObj.close();
        }
    }

    /**
     * Binding events to the element while component creation.
     *
     * @hidden
     * @returns {void}
     */
    public wireEvents(): void {
        EventHandler.add(this.element, 'click', this.mouseClickHandler, this);
        EventHandler.add(this.element, 'touchend', this.mouseClickHandler, this);
        EventHandler.add(this.element, 'focusout', this.focusOutHandler, this);
        EventHandler.add(this.element, 'dblclick', this.dblClickHandler, this);
        EventHandler.add(this.element, 'keydown', this.keyPressHandler, this);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        EventHandler.add(window as any, 'resize', this.resetIndentWidth, this);
        if (this.allowKeyboard) {
            this.element.tabIndex = this.element.tabIndex === -1 ? 0 : this.element.tabIndex;
        }
        this.keyboardModule = new KeyboardEvents(
            this.element,
            {
                keyAction: this.keyActionHandler.bind(this),
                keyConfigs: this.keyConfigs,
                eventName: 'keydown'
            });
        EventHandler.add(this.getContent().firstElementChild, 'scroll', this.scrollHandler, this);
        EventHandler.add(this.element, 'mouseover', this.mouseMoveHandler, this);
        EventHandler.add(this.element, 'mouseout', this.mouseMoveHandler, this);
        EventHandler.add(this.getContent(), 'touchstart', this.tapEvent, this);
        EventHandler.add(document.body, 'keydown', this.keyDownHandler, this);
    }

    /**
     * Unbinding events from the element while component destroy.
     *
     * @hidden
     * @returns {void}
     */
    public unwireEvents(): void {
        EventHandler.remove(this.element, 'click', this.mouseClickHandler);
        EventHandler.remove(this.element, 'touchend', this.mouseClickHandler);
        EventHandler.remove(this.element, 'focusout', this.focusOutHandler);
        EventHandler.remove(this.element, 'dblclick', this.dblClickHandler);
        EventHandler.remove(this.getContent().firstElementChild, 'scroll', this.scrollHandler);
        EventHandler.remove(this.element, 'mouseover', this.mouseMoveHandler);
        EventHandler.remove(this.element, 'mouseout', this.mouseMoveHandler);
        EventHandler.remove(this.element, 'keydown', this.keyPressHandler);
        EventHandler.remove(this.getContent(), 'touchstart', this.tapEvent);
        EventHandler.remove(document.body, 'keydown', this.keyDownHandler);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        EventHandler.remove(window as any, 'resize', this.resetIndentWidth);
    }
    /**
     * @hidden
     * @returns {void}
     */
    public addListener(): void {
        if (this.isDestroyed) { return; }
        this.on(events.dataReady, this.dataReady, this);
        this.on(events.contentReady, this.recalcIndentWidth, this);
        this.on(events.headerRefreshed, this.recalcIndentWidth, this);
        this.on(events.refreshFrozenPosition, this.refreshFrozenPosition, this);
        this.on(events.refreshSplitFrozenColumn, this.refreshSplitFrozenColumn, this);
        this.dataBoundFunction = this.refreshMediaCol.bind(this);
        this.addEventListener(events.dataBound, this.dataBoundFunction);
        this.on(events.keyPressed, this.onKeyPressed, this);
    }
    /**
     * @hidden
     * @returns {void}
     */
    public removeListener(): void {
        if (this.isDestroyed) { return; }
        this.off(events.dataReady, this.dataReady);
        this.off(events.contentReady, this.recalcIndentWidth);
        this.off(events.headerRefreshed, this.recalcIndentWidth);
        this.on(events.refreshFrozenPosition, this.refreshFrozenPosition, this);
        this.on(events.refreshSplitFrozenColumn, this.refreshSplitFrozenColumn, this);
        this.removeEventListener(events.dataBound, this.dataBoundFunction);
        this.off(events.keyPressed, this.onKeyPressed);
    }

    /**
     * Get current visible data of grid.
     *
     * @returns {Object[]} Returns the current view records
     *
     * @isGenericType true
     */
    public getCurrentViewRecords(): Object[] {
        if (isGroupAdaptive(this)) {
            return isNullOrUndefined((this.currentViewData as Object[] & { records: Object[] }).records) ?
                this.currentViewData : (this.currentViewData as Object[] & { records: Object[] }).records;
        }
        if (this.groupSettings.enableLazyLoading) { return this.currentViewData; }
        return (this.allowGrouping && this.groupSettings.columns.length && this.currentViewData.length
            && (<{ records?: Object[] }>this.currentViewData).records) ? (this.currentViewData as Object[] & { records: Object[] }).records
            : this.currentViewData;
    }

    private mouseClickHandler(e: MouseEvent & TouchEvent): void {
        if (this.isChildGrid(e) || (parentsUntil(e.target as Element, 'e-gridpopup') && e.touches) ||
            this.element.getElementsByClassName('e-cloneproperties').length || this.checkEdit(e)) {
            return;
        }
        if (((!this.allowRowDragAndDrop && (parentsUntil(e.target as Element, literals.gridContent) ||
            (e.target as Element).tagName === 'TD')) || (parentsUntil(e.target as Element, 'e-headercell') &&
                parentsUntil(e.target as Element, 'e-headercell').querySelector('.e-checkselectall')) ||
            (!(this.allowGrouping || this.allowReordering) && parentsUntil(e.target as Element, 'e-gridheader'))) &&
            e.touches) {
            return;
        }
        if (parentsUntil(e.target as Element, 'e-gridheader') && this.allowRowDragAndDrop &&
            !(parentsUntil(e.target as Element, 'e-filterbarcell')) && (e.target &&
            ['A', 'BUTTON', 'INPUT'].indexOf((e.target  as Element).tagName) === -1)) {
            e.preventDefault();
        }
        if (this.allowRowDragAndDrop && parentsUntil(e.target as Element, 'e-rowcell')
            && !parentsUntil(e.target as Element, 'e-rowdragdrop') && e.touches) {
            return;
        }
        const args: RecordClickEventArgs = this.getRowInfo(e.target as Element) as RecordClickEventArgs;
        args.event = e;
        const cancel: string = 'cancel';
        args[`${cancel}`] = false;
        let isDataRow: boolean = false;
        const tr: Element = closest(<Node>e.target, 'tr');
        if (tr && tr.getAttribute('data-uid')) {
            const rowObj: Row<Column> = this.getRowObjectFromUID(tr.getAttribute('data-uid'));
            isDataRow = rowObj ? rowObj.isDataRow : false;
        }
        if (isDataRow) {
            this.trigger(events.recordClick, args);
        }
        this.notify(events.click, e);
    }

    private checkEdit(e: MouseEvent): boolean {
        const tr: Element = parentsUntil(e.target as Element, literals.row);
        const isEdit: boolean = this.editSettings.mode !== 'Batch' &&
            this.isEdit && tr && (tr.classList.contains(literals.editedRow) || (tr.classList.contains(literals.addedRow)) &&
            !this.editSettings.showAddNewRow);
        return !parentsUntil(e.target as Element, 'e-unboundcelldiv') && (isEdit || (parentsUntil(e.target as Element, literals.rowCell) &&
            parentsUntil(e.target as Element, literals.rowCell).classList.contains('e-editedbatchcell')));
    }

    private dblClickHandler(e: MouseEvent | TouchEventArgs): void {
        const grid: Element = parentsUntil(e.target as Element, 'e-grid');
        if (isNullOrUndefined(grid) || grid.id !== this.element.id || closest(<Node>e.target, '.e-unboundcelldiv')) {
            return;
        }
        let dataRow: boolean = false;
        const tr: Element = closest(<Node>e.target, 'tr');
        if (tr && tr.getAttribute('data-uid')) {
            const rowObj: Row<Column> = this.getRowObjectFromUID(tr.getAttribute('data-uid'));
            dataRow = rowObj ? rowObj.isDataRow : false;
        }
        const args: RecordDoubleClickEventArgs = this.getRowInfo(e.target as Element) as RecordDoubleClickEventArgs;
        args.target = e.target as Element;
        args.event = e;
        if (dataRow) {
            this.trigger(events.recordDoubleClick, args);
        }
        this.notify(events.dblclick, e);
    }

    private focusOutHandler(e: MouseEvent): void {
        if (this.isChildGrid(e)) {
            return;
        }
        if (!parentsUntil(e.target as Element, 'e-grid')) {
            (this.element.querySelector('.e-gridpopup') as HTMLElement).style.display = 'None';
        }
        const filterClear: Element = this.element.querySelector('.e-cancel:not(.e-hide)');
        if (filterClear && !filterClear.parentElement.classList.contains('e-tbar-btn')) {
            filterClear.classList.add('e-hide');
        }
        const relatedTarget: HTMLElement = e.relatedTarget as HTMLElement;
        const ariaOwns: string = relatedTarget ? relatedTarget.getAttribute('aria-owns') : null;
        if ((!relatedTarget || (!parentsUntil(relatedTarget, 'e-grid') &&
            (!isNullOrUndefined(ariaOwns) &&
                (ariaOwns)) !== (e.target as Element).getAttribute('aria-owns')))
            && !this.keyPress && this.isEdit && !Browser.isDevice) {
            if (this.editSettings.mode === 'Batch' && !(((parentsUntil(relatedTarget, 'e-ddl') || parentsUntil(relatedTarget, 'e-ddt')) &&
                (parentsUntil(relatedTarget, 'e-multi-select-list-wrapper') || parentsUntil(relatedTarget, 'e-input-filter'))) &&
                parentsUntil(relatedTarget, 'e-input-group')) && (parentsUntil(relatedTarget, 'e-uploader') || (!(relatedTarget &&
                isNullOrUndefined(parentsUntil(relatedTarget, 'e-input-group'))) && !parentsUntil((e.target as Element), 'edit-custom-template')))) {
                this.editModule.saveCell();
                this.notify(events.editNextValCell, {});
            }
            if (this.editSettings.mode === 'Normal' && !this.isWidgetsDestroyed) {
                this.editModule.editFormValidate();
            }
        }
        if (this.editSettings.showAddNewRow) {
            this.editModule.isShowAddedRowValidate = false;
        }
        this.keyPress = false;
    }

    private isChildGrid(e: MouseEvent | KeyboardEvent | TouchEvent): boolean {
        const gridElement: Element = parentsUntil((e.target as HTMLElement), 'e-grid');
        if ((gridElement && gridElement.id !== this.element.id) || (parentsUntil(e.target as Element, 'e-unboundcelldiv') &&
            isNullOrUndefined(gridElement))) {
            return true;
        }
        return false;
    }

    /**
     * @param {Object} persistedData - Defines the persisted data
     * @returns {void}
     * @hidden
     */
    public mergePersistGridData(persistedData?: Object): void {
        const data: string = this.getLocalData();
        if (!(isNullOrUndefined(data) || (data === '')) || !isNullOrUndefined(persistedData)) {
            const dataObj: Grid = !isNullOrUndefined(persistedData) ? persistedData : JSON.parse(data);
            const keys: string[] = Object.keys(dataObj);
            this.isProtectedOnChange = true;
            for (const key of keys) {
                if ((typeof this[`${key}`] === 'object') && !isNullOrUndefined(this[`${key}`])) {
                    if (Array.isArray(this[`${key}`]) && key === 'columns') {
                        this.setFrozenCount();
                        setColumnIndex(<Column[]>this[`${key}`]);
                        this.mergeColumns(<Column[]>dataObj[`${key}`], <Column[]>this[`${key}`]);
                        this.mergedColumns = true;
                        this[`${key}`] = dataObj[`${key}`];
                    } else {
                        extend(this[`${key}`], dataObj[`${key}`]);
                    }
                } else {
                    this[`${key}`] = dataObj[`${key}`];
                }
            }
            this.isProtectedOnChange = false;
        }
    }

    private mergeColumns(storedColumn: Column[], columns: Column[]): void {
        const storedColumns: Column[] = (<Column[]>storedColumn);
        const isFrozenGrid: boolean = this.isFrozenGrid();
        for (let i: number = 0; i < storedColumns.length; i++) {
            let localCol: Column = columns.filter((tCol: Column) => isFrozenGrid ?
                tCol.index === storedColumns[parseInt(i.toString(), 10)][`${literals.initialFrozenColumnIndex}`] :
                tCol.index === storedColumns[parseInt(i.toString(), 10)].index)[0];
            if (!isNullOrUndefined(localCol)) {
                if (isFrozenGrid) {
                    localCol = <Column>extend({}, localCol, {}, true);
                    localCol.freeze = storedColumns[parseInt(i.toString(), 10)].freeze;
                }
                if (localCol.columns && localCol.columns.length) {
                    this.mergeColumns(<Column[]>storedColumns[parseInt(i.toString(), 10)].columns, <Column[]>localCol.columns);
                    storedColumns[parseInt(i.toString(), 10)] = <Column>extend(
                        localCol, storedColumns[parseInt(i.toString(), 10)], {}, true);
                } else {
                    storedColumns[parseInt(i.toString(), 10)] = <Column>extend(
                        localCol, storedColumns[parseInt(i.toString(), 10)], {}, true);
                }
            }
        }
    }

    /**
     * @hidden
     * @returns {boolean} Returns the isDetail
     */
    public isDetail(): boolean {
        return !isNullOrUndefined(this.detailTemplate) || !isNullOrUndefined(this.childGrid);
    }

    private isCommandColumn(columns: Column[]): boolean {
        return columns.some((col: Column) => {
            if (col.columns) {
                return this.isCommandColumn(col.columns as Column[]);
            }
            return !!(col.commands || col.commandsTemplate);
        });
    }

    private isForeignKeyEnabled(columns: Column[]): boolean {
        return columns.some((col: Column) => {
            if (col.columns) {
                return this.isForeignKeyEnabled(col.columns as Column[]);
            }
            return !!(col.dataSource && col.foreignKeyValue);
        });
    }

    private keyPressHandler(e: KeyboardEventArgs): void {
        const presskey: KeyboardEventArgs = <KeyboardEventArgs>extend(e, { cancel: false });
        this.trigger('keyPressed', presskey);
        if (presskey.cancel === true || (this.isEdit && e && parentsUntil((e.target as Element), 'e-gridform') &&
            parentsUntil((e.target as Element), 'e-ddl') && e.action === 'open' && e.altKey === true && e.code === 'ArrowDown')) {
            e.stopImmediatePropagation();
        }
    }

    private keyDownHandler(e: KeyboardEventArgs): void {
        if (e.altKey) {
            if (e.keyCode === 74) {//alt j
                if (this.keyA) {//alt A J
                    this.notify(events.groupCollapse, { target: e.target, collapse: false });
                    this.keyA = false;
                } else {
                    if (this.focusModule && this.focusModule.currentInfo && this.focusModule.currentInfo.element) {
                        removeClass([this.focusModule.currentInfo.element, this.focusModule.currentInfo.elementToFocus],
                                    ['e-focused', 'e-focus']);
                        this.focusModule.currentInfo.element.tabIndex = -1;
                    }
                    if (!this.element.classList.contains('e-childgrid')) {
                        this.element.focus();
                    }
                }
            }
            if (e.keyCode === 87) {//alt w
                const focusModule: FocusStrategy = this.focusModule;
                if (focusModule) {
                    if (!this.currentViewData.length) { return; }
                    if (this.element.getBoundingClientRect().width !== 0) {
                        focusModule.focusContent();
                    }
                    focusModule.addOutline();
                }
            }
            if (e.keyCode === 65) {//alt A
                this.keyA = true;
            }
            if (e.keyCode === 72 && this.keyA) {//alt A H
                this.notify(events.groupCollapse, { target: e.target, collapse: true });
                this.keyA = false;
            }
        }
        if (e.keyCode === 13) {
            this.notify(events.enterKeyHandler, e);
        }
    }

    private keyActionHandler(e: KeyArg): void {
        if (this.isChildGrid(e) ||
            (this.editModule && ((this.editModule.alertDObj && this.editModule.alertDObj.visible) ||
                (this.editModule.dialogObj && this.editModule.dialogObj.visible))) ||
                    ((this.isEdit && (!this.editSettings.showAddNewRow || (this.editSettings.showAddNewRow &&
                        this.element.querySelector(literals.editedRow)))) && e.action !== 'escape' && e.action !== 'enter'
                            && e.action !== 'shiftEnter' && e.action !== 'tab' && e.action !== 'shiftTab')) {
            return;
        } else {
            this.keyPress = true;
        }
        if (this.allowKeyboard) {
            if (e.action === 'ctrlPlusP') {
                e.preventDefault();
                this.print();
            }
            this.notify(events.keyPressed, e);
        }
    }
    /**
     * @param {Function[]} modules - Defines the modules
     * @returns {void}
     * @hidden
     */
    public setInjectedModules(modules: Function[]): void {
        this.injectedModules = modules;
    }

    private updateColumnObject(): void {
        prepareColumns(this.columns, this.enableColumnVirtualization, this);
        setColumnIndex(this.columns as Column[]);
        this.initForeignColumn();
        this.notify(events.autoCol, {});
    }

    private refreshFrozenPosition(obj: { isModeChg?: boolean }): void {
        if (obj && obj.isModeChg) {
            this.refreshColumns();
            this.notify(events.refreshResizePosition, {});
        } else {
            this.refreshColumns();
        }
    }
    /**
     * Gets the foreign columns from Grid.
     *
     * @returns {Column[]} Returns Foreign key column
     */
    public getForeignKeyColumns(): Column[] {
        const cols: Column[] | string[] | ColumnModel[] = this.enableColumnVirtualization ? this.columns : this.getColumns();
        return (cols as Column[]).filter((col: Column) => {
            return  col instanceof Column && col.isForeignColumn();
        });
    }

    /**
     * @hidden
     * @param {boolean} accurateHeight - Defines the accurate row height
     * @returns {number} Returns row height
     */
    public getRowHeight(accurateHeight?: boolean): number {
        return this.rowHeight ? this.rowHeight : getRowHeight(this.element, accurateHeight);
    }

    /**
     * Refreshes the Grid column changes.
     *
     * @returns {void}
     */
    public refreshColumns(): void {
        this.freezeColumnRefresh = true;
        this.setFrozenCount();
        this.updateFrozenColumnsWidth();
        if (this.isFrozenGrid()) {
            this.isPreventScrollEvent = true;
        }
        this.updateColumnObject();
        this.checkLockColumns(this.getColumns());
        this.refresh();
        if (this.isFrozenGrid() && this.enableColumnVirtualization) {
            const left: number = this.getContent().querySelector('.e-movablescrollbar').scrollLeft;
            this.getHeaderContent().querySelector('.' + literals.headerContent).scrollLeft = left;
            this.getContent().querySelector('.' + literals.content).scrollLeft = left;
        }
    }
    /**
     * Export Grid data to Excel file(.xlsx).
     *
     * @param  {ExcelExportProperties} excelExportProperties - Defines the export properties of the Grid.
     * @param  {boolean} isMultipleExport - Define to enable multiple export.
     * @param  {Workbook} workbook - Defines the Workbook if multiple export is enabled.
     * @param  {boolean} isBlob - If 'isBlob' set to true, then it will be returned as blob data.
     * @returns {Promise<any>} Returns the excelexport
     */
    public excelExport(
        excelExportProperties?: ExcelExportProperties, isMultipleExport?: boolean,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        workbook?: Workbook, isBlob?: boolean): Promise<any> {
        if (this.exportGrids && this.exportGrids.length) {
            const gridIds: string[] = this.exportGrids.slice();
            return this.exportMultipleExcelGrids(gridIds, excelExportProperties, isMultipleExport, workbook, isBlob);
        }
        else {
            return this.excelExportModule ?
                this.excelExportModule.Map(this, excelExportProperties, isMultipleExport, workbook, false, isBlob) : null;
        }
    }

    /**
     * Export Grid data to CSV file.
     *
     * @param  {ExcelExportProperties} excelExportProperties - Defines the export properties of the Grid.
     * @param  {boolean} isMultipleExport - Define to enable multiple export.
     * @param  {Workbook} workbook - Defines the Workbook if multiple export is enabled.
     * @param  {boolean} isBlob - If 'isBlob' set to true, then it will be returned as blob data.
     * @returns {Promise<any>} Returns csv export
     */
    public csvExport(
        excelExportProperties?: ExcelExportProperties,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        isMultipleExport?: boolean, workbook?: Workbook, isBlob?: boolean): Promise<any> {
        return this.excelExportModule ?
            this.excelExportModule.Map(this, excelExportProperties, isMultipleExport, workbook, true, isBlob) : null;
    }
    /**
     * Export Grid data to PDF document.
     *
     * @param {pdfExportProperties} pdfExportProperties - Defines the export properties of the Grid.
     * @param {isMultipleExport} isMultipleExport - Define to enable multiple export.
     * @param {pdfDoc} pdfDoc - Defined the Pdf Document if multiple export is enabled.
     * @param {boolean} isBlob - If 'isBlob' set to true, then it will be returned as blob data.
     *
     * @returns {Promise<any>} Returns pdfexport
     */
    public pdfExport(
        pdfExportProperties?: PdfExportProperties,
        isMultipleExport?: boolean, pdfDoc?: Object, isBlob?: boolean): Promise<Object> {
        if (this.exportGrids && this.exportGrids.length) {
            const gridIds: string[] = this.exportGrids.slice();
            return this.exportMultiplePdfGrids(gridIds, pdfExportProperties, isMultipleExport, pdfDoc, isBlob);
        }
        else {
            return this.pdfExportModule ? this.pdfExportModule.Map(this, pdfExportProperties, isMultipleExport, pdfDoc, isBlob) : null;
        }
    }

    private exportMultiplePdfGrids(gridIds: string[], pdfExportProperties?: PdfExportProperties, isMultipleExport?: boolean,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                   pdfDoc?: Object, isBlob?: boolean): Promise<any> {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const _this: Grid = this;
        if (gridIds.length !== 0) {
            const currentGridId: string = gridIds.shift();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const currentGridInstance: Grid = (document.getElementById(currentGridId) as any).ej2_instances[0];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const exportPromise: any = currentGridInstance.pdfExportModule ?
                currentGridInstance.pdfExportModule.Map(currentGridInstance, pdfExportProperties, isMultipleExport, pdfDoc, isBlob)
                : Promise.resolve();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return exportPromise.then(function (exportedGridResults: object): Promise<any> {
                isMultipleExport = gridIds.length === 1 ? false : true;
                return _this.exportMultiplePdfGrids(gridIds, pdfExportProperties, isMultipleExport, exportedGridResults, isBlob);
            });
        }
        return null;
    }

    private exportMultipleExcelGrids(gridIds: string[], excelExportProperties?: ExcelExportProperties, isMultipleExport?: boolean,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                     workbook?: Workbook, isBlob?: boolean): Promise<any> {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const _this: Grid = this;
        if (gridIds.length !== 0) {
            const currentGridId: string = gridIds.shift();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const currentGridInstance: Grid = (document.getElementById(currentGridId) as any).ej2_instances[0];
            const exportPromise: Promise<object> = currentGridInstance.excelExportModule ?
                currentGridInstance.excelExportModule.Map(currentGridInstance, excelExportProperties,
                                                          isMultipleExport, workbook, false, isBlob) : null;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return exportPromise.then(function (exportedGridResults: Workbook) : Promise<any> {
                isMultipleExport = gridIds.length === 1 ? false : true;
                return _this.exportMultipleExcelGrids(gridIds, excelExportProperties, isMultipleExport, exportedGridResults, isBlob);
            });
        }
        return null;
    }

    /**
     * Groups a column by column name.
     *
     * @param  {string} columnName - Defines the column name to group.
     *
     * @returns {void}
     */
    public groupColumn(columnName: string): void {
        if (this.groupModule) {
            this.groupModule.groupColumn(columnName);
        }
    }
    /**
     * Expands all the grouped rows of the Grid.
     *
     * @returns {void}
     */
    public groupExpandAll(): void {
        if (this.groupModule) {
            this.groupModule.expandAll();
        }
    }
    /**
     * Collapses all the grouped rows of the Grid.
     *
     * @returns {void}
     */
    public groupCollapseAll(): void {
        if (this.groupModule) {
            this.groupModule.collapseAll();
        }
    }

    /**
     * Expands or collapses grouped rows by target element.
     *
     * @param  {Element} target - Defines the target element of the grouped row.
     * @returns {void}
     */
    // public expandCollapseRows(target: Element): void {
    //     if (this.groupModule) {
    //         this.groupModule.expandCollapseRows(target);
    //     }
    // }

    /**
     * Clears all the grouped columns of the Grid.
     *
     * @returns {void}
     */
    public clearGrouping(): void {
        if (this.groupModule) {
            this.groupModule.clearGrouping();
        }
    }
    /**
     * Ungroups a column by column name.
     *
     * {% codeBlock src='grid/ungroupColumn/index.md' %}{% endcodeBlock %}
     *
     * @param  {string} columnName - Defines the column name to ungroup.
     *
     * @returns {void}
     */
    public ungroupColumn(columnName: string): void {
        if (this.groupModule) {
            this.groupModule.ungroupColumn(columnName);
        }
    }

    /**
     * Column chooser can be displayed on screen by given position(X and Y axis).
     *
     * @param {number} x - Defines the X axis.
     * @param {number} y - Defines the Y axis.
     *
     * @returns {void}
     */
    public openColumnChooser(x?: number, y?: number): void {
        if (this.columnChooserModule) {
            this.columnChooserModule.openColumnChooser(x, y);
        }
    }

    private scrollRefresh(): void {
        const refresh: Function = () => {
            this.scrollModule.refresh();
            this.off(events.contentReady, refresh);
        };
        this.on(events.contentReady, refresh, this);
    }

    /**
     * Collapses a detail row with the given target.
     *
     * @param  {Element} target - Defines the expanded element to collapse.
     * @returns {void}
     */
    // public detailCollapse(target: number | Element): void {
    //     if (this.detailRowModule) {
    //         this.detailRowModule.collapse(target);
    //     }
    // }

    /**
     * Collapses all the detail rows of the Grid.
     *
     * @returns {void}
     */
    public detailCollapseAll(): void {
        if (this.detailRowModule) {
            this.detailRowModule.collapseAll();
        }
    }

    /**
     * Expands a detail row with the given target.
     *
     * @param  {Element} target - Defines the collapsed element to expand.
     * @returns {void}
     */
    // public detailExpand(target: number | Element): void {
    //     if (this.detailRowModule) {
    //         this.detailRowModule.expand(target);
    //     }
    // }

    /**
     * Expands all the detail rows of the Grid.
     *
     * @returns {void}
     */
    public detailExpandAll(): void {
        if (this.detailRowModule) {
            this.detailRowModule.expandAll();
        }
    }

    /**
     * Deselects the currently selected cells.
     *
     * @returns {void}
     */
    public clearCellSelection(): void {
        if (this.selectionModule) {
            this.selectionModule.clearCellSelection();
        }
    }

    /**
     * Deselects the currently selected rows.
     *
     * @returns {void}
     */
    public clearRowSelection(): void {
        if (this.selectionModule) {
            this.selectionModule.clearRowSelection();
        }
    }

    /**
     * Selects a collection of cells by row and column indexes.
     *
     * @param  {ISelectedCell[]} rowCellIndexes - Specifies the row and column indexes.
     *
     * @returns {void}
     */
    public selectCells(rowCellIndexes: ISelectedCell[]): void {
        if (this.selectionModule) {
            this.selectionModule.selectCells(rowCellIndexes);
        }
    }

    /**
     * Selects a range of rows from start and end row indexes.
     *
     * @param  {number} startIndex - Specifies the start row index.
     * @param  {number} endIndex - Specifies the end row index.
     *
     * @returns {void}
     */
    public selectRowsByRange(startIndex: number, endIndex?: number): void {
        if (this.selectionModule) {
            this.selectionModule.selectRowsByRange(startIndex, endIndex);
        }
    }

    /**
     * @hidden
     * @returns {boolean} Returns whether context menu is open or not
     */
    public isContextMenuOpen(): boolean {
        return this.contextMenuModule && this.contextMenuModule.isOpen;
    }

    /**
     * @param {Function} module - Defines the module
     * @returns {boolean} return the injected modules
     * @hidden
     */
    public ensureModuleInjected(module: Function): boolean {
        return this.getInjectedModules().indexOf(module) >= 0;
    }

    /**
     * Destroys the given template reference.
     *
     * @param {string[]} propertyNames - Defines the collection of template name.
     * @param {any} index - specifies the index
     * @param {Function} callback - Defines the callback function that is triggered after the template is cleared
     *
     * @returns {void}
     */
    // eslint-disable-next-line
    public destroyTemplate(propertyNames?: string[], index?: any, callback?: Function): void {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (this as any).clearTemplate(propertyNames, index, callback);
    }

    /**
     * @param {string | string[]} type - Defines the type
     * @param {Object} args - Defines the arguments
     * @returns {void}
     * @hidden
     * @private
     */
    public log(type: string | string[], args?: Object): void {
        const injectedModules: Function[] = this.getInjectedModules();
        const logger: Function = injectedModules.find((item: Function) => item.name === 'Logger');
        if (!logger) {
            Grid.Inject(Logger);
            this.enableLogger = true;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (this as any).injectModules();
        }
        // eslint-disable-next-line
        this.loggerModule ? this.loggerModule.log(type, args) : (() => 0)();
    }

    /**
     * @param {Element} element - Defines the element
     * @returns {void}
     * @hidden
     */
    public applyBiggerTheme(element: Element): void {
        if (this.element.classList.contains('e-bigger')) {
            element.classList.add('e-bigger');
        }
    }

    /**
     * @hidden
     * @returns {Object} Returns the previous row data
     */
    public getPreviousRowData(): Object {
        const previousRowData: Object = this.getRowsObject()[this.getRows().length - 1].data;
        return previousRowData;
    }

    /**
     * Hides the scrollbar placeholder of Grid content when grid content is not overflown.
     *
     * @returns {void}
     */
    public hideScroll(): void {
        const content: HTMLElement = this.getContent().querySelector('.' + literals.content);
        if (content.scrollHeight <= content.clientHeight) {
            this.scrollModule.removePadding();
            content.style.overflowY = 'auto';
        }
    }

    /**
     * Get row index by primary key or row data.
     *
     * @param  {string | Object} value - Defines the primary key value.
     *
     * @returns {number} Returns the index
     */
    public getRowIndexByPrimaryKey(value: string | Object | number): number {
        const pkName: string = this.getPrimaryKeyFieldNames()[0];
        value = typeof value === 'object' ? value[`${pkName}`] : value;
        const rows: Row<Column>[] = this.getRowsObject();
        for (let i: number = 0; i < rows.length; i++) {
            if (rows[parseInt(i.toString(), 10)].isDetailRow || rows[parseInt(i.toString(), 10)].isCaptionRow) {
                continue;
            }
            let pKvalue: object | string = rows[parseInt(i.toString(), 10)].data[`${pkName}`];
            if (pkName.split('.').length > 1) {
                pKvalue = performComplexDataOperation(pkName, rows[parseInt(i.toString(), 10)].data);
            }
            if (pKvalue === value) {
                return rows[parseInt(i.toString(), 10)].index;
            }
        }
        return -1;
    }

    /**
     * Get row index by primary key or row data.
     *
     * @param  {string | Object} value - Defines the primary key value.
     *
     * @returns {number} Returns the row object
     * @hidden
     */
    public getPinnedRowObjectByKey(value: string | Object): Row<Column> | undefined {
        const primarykey: string = this.getPrimaryKeyFieldNames()[0];
        value = typeof value === 'object' ? value[`${primarykey}`] : value;
        const rows: Row<Column>[] = this.pinnedTopRowModels;
        for (let i: number = 0; i < rows.length; i++) {
            if (rows[parseInt(i.toString(), 10)].isDetailRow || rows[parseInt(i.toString(), 10)].isCaptionRow) {
                continue;
            }
            let primarykeyValue: object | string = rows[parseInt(i.toString(), 10)].data[`${primarykey}`];
            if (primarykey.split('.').length > 1) {
                primarykeyValue = performComplexDataOperation(primarykey, rows[parseInt(i.toString(), 10)].data);
            }
            if (primarykeyValue === value) {
                return rows[parseInt(i.toString(), 10)];
            }
        }
        return null;
    }

    /**
     * @param {string} field - Defines the field name
     * @param {boolean} isForeignKey - Defines the foreign key
     * @returns {Column} returns the column
     * @hidden
     */
    // Need to have all columns while filtering with ColumnVirtualization.
    public grabColumnByFieldFromAllCols(field: string, isForeignKey?: boolean): Column {
        let column: Column;
        this.columnModel = [];
        this.updateColumnModel(this.columns as Column[]);
        const gCols: Column[] = this.columnModel;
        for (let i: number = 0; i < gCols.length; i++) {
            if ((!isForeignKey && field === gCols[parseInt(i.toString(), 10)].field) ||
                (isForeignKey && gCols[parseInt(i.toString(), 10)].isForeignColumn() &&
                    field === gCols[parseInt(i.toString(), 10)].foreignKeyValue)) {
                column = gCols[parseInt(i.toString(), 10)];
                break;
            }
        }
        return column;
    }
    /**
     * @param {string} uid - Defines the uid
     * @returns {Column} returns the column
     * @hidden
     */
    // Need to have all columns while filtering with ColumnVirtualization.
    public grabColumnByUidFromAllCols(uid: string): Column {
        let column: Column;
        this.columnModel = [];
        this.updateColumnModel(this.columns as Column[]);
        const gCols: Column[] = this.columnModel;
        for (let i: number = 0; i < gCols.length; i++) {
            if (uid === gCols[parseInt(i.toString(), 10)].uid) {
                column = gCols[parseInt(i.toString(), 10)];
            }
        }
        return column;
    }

    /**
     * Get all filtered records from the Grid and it returns array of objects for the local dataSource, returns a promise object if the Grid has remote data.
     *
     * @returns {Object[] | Promise<Object>} Returns the filtered records
     */
    public getFilteredRecords(): Object[] | Promise<Object> {
        if ((this.allowFiltering && this.filterSettings.columns.length) || this.searchSettings.key.length) {
            const query: Query = this.renderModule.data.generateQuery(true);
            if (this.dataSource && this.renderModule.data.isRemote() && this.dataSource instanceof DataManager) {
                return this.renderModule.data.getData(this.dataSource as DataOptions, query);
            } else {
                if (this.dataSource instanceof DataManager) {
                    return (this.dataSource as DataManager).executeLocal(query);
                } else {
                    return new DataManager(this.dataSource as object[], query).executeLocal(query);
                }
            }
        }
        return [];
    }

    private getUserAgent(): boolean {
        const userAgent: string = Browser.userAgent.toLowerCase();
        return (/iphone|ipod|ipad|macintosh/ as RegExp).test(userAgent);
    }

    /**
     * @param {TouchEventArgs} e - Defines the TouchEventArgs
     * @returns {void}
     * @hidden
     */
    // Need to have all columns while filtering with ColumnVirtualization.
    // eslint-disable-next-line
    public tapEvent(e: TouchEventArgs) {
        if (this.getUserAgent()) {
            if (!Global.timer) {
                Global.timer = (setTimeout(
                    () => {
                        Global.timer = null;
                    },
                    300) as Object);
            } else {
                clearTimeout(Global.timer as number);
                Global.timer = null;
                this.dblClickHandler(e);
                this.notify(events.doubleTap, e);
            }
        }
    }

    /**
     * @param {string} prefix - specifies the prefix
     * @returns {string} returns the row uid
     * @hidden
     */
    public getRowUid(prefix: string): string {
        return `${prefix}${this.rowUid++}`;
    }

    /**
     * @param {string} uid - specifies the uid
     * @returns {Element} returns the element
     * @hidden
     */
    public getRowElementByUID(uid: string): Element {
        let rowEle: Element;
        let rows: Element[] = [];
        const cntRows: Element[] = [].slice.call(this.getContent().querySelector(literals.tbody).children);
        if (this.frozenRows || this.pinnedTopRowModels.length) {
            rows = [].slice.call(this.getHeaderContent().querySelector(literals.tbody).children);
            rows = rows.concat(cntRows);
        } else {
            rows = cntRows;
        }
        for (const row of rows) {
            if (row.getAttribute('data-uid') === uid) {
                rowEle = row;
                break;
            }
        }
        return rowEle;
    }
    /**
     * Gets the hidden columns from the Grid.
     *
     * @returns {Column[]} Returns the Column
     */
    public getHiddenColumns(): Column[] {
        const cols: Column[] = [];
        for (const col of this.columnModel) {
            if (col.visible === false) {
                cols.push(col);
            }
        }
        return cols;
    }

    /**
     * Calculates the page size by parent element height
     *
     * @param {number | string } containerHeight - specifies the container height
     * @returns {number} returns the page size
     */
    public calculatePageSizeByParentHeight(containerHeight: number | string): number {
        if (this.allowPaging) {
            if ((this.allowTextWrap && this.textWrapSettings.wrapMode === 'Header') || (!this.allowTextWrap)) {
                let pagesize: number = 0;
                if (typeof containerHeight === 'string' && (containerHeight as string).indexOf('%') !== -1) {
                    containerHeight = parseInt(containerHeight as string, 10) / 100 * this.element.clientHeight;
                }
                const nonContentHeight: number = this.getNoncontentHeight() + this.getRowHeight();
                if (containerHeight > nonContentHeight) {
                    let contentHeight: number = 0;
                    contentHeight = (containerHeight as number) - this.getNoncontentHeight();
                    pagesize = (contentHeight / this.getRowHeight());
                }
                if (pagesize > 0) {
                    return Math.floor(pagesize);
                }
            }
        }
        return 0;
    }

    private getNoncontentHeight(): number {
        let height: number = 0;
        if (this.getHeaderContent() && !isNullOrUndefined(this.getHeaderContent().clientHeight)) {
            height += this.getHeaderContent().clientHeight;
        }
        if (this.toolbar && !isNullOrUndefined(this.element.querySelector('.e-toolbar').clientHeight))
        { height += this.element.querySelector('.e-toolbar').clientHeight; }
        if (this.allowPaging && !isNullOrUndefined(this.element.querySelector('.e-gridpager').clientHeight))
        { height += this.element.querySelector('.e-gridpager').clientHeight; }
        if (this.showColumnChooser && !isNullOrUndefined(this.element.querySelector('.e-columnheader').clientHeight))
        { height += this.element.querySelector('.e-columnheader').clientHeight; }
        if (this.allowGrouping && this.groupSettings.showDropArea && !isNullOrUndefined(this.element.querySelector('.e-groupdroparea').clientHeight))
        { height += this.element.querySelector('.e-groupdroparea').clientHeight; }
        if (this.aggregates.length > 0 && !isNullOrUndefined(this.element.querySelector('.e-summaryrow').clientHeight))
        {  for (let i: number = 0; i < this.element.getElementsByClassName('e-summaryrow').length; i++) {
            height += this.element.getElementsByClassName('e-summaryrow')[parseInt(i.toString(), 10)].clientHeight;
        }
        }
        return height;
    }

    /**
     *To perform aggregate operation on a column.
     *
     * @param  {AggregateColumnModel} summaryCol - Pass Aggregate Column details.
     * @param  {Object} summaryData - Pass JSON Array for which its field values to be calculated.
     *
     * @returns {number} returns the summary values
     */
    public getSummaryValues(summaryCol: AggregateColumnModel, summaryData: Object): number {
        return DataUtil.aggregates[(summaryCol.type as string).toLowerCase()](summaryData, summaryCol.field);

    }

    /**
     * Sends a Post request to export Grid to Excel file in server side.
     *
     * @param  {string} url - Pass Url for server side excel export action.
     *
     * @param  {ExportHeaders} headers - The headers to include in the export request.
     *
     * @returns {void}
     */
    public serverExcelExport(url: string, headers?: ExportHeaders): void {
        this.isExcel = true;
        this.exportGrid(url, headers);
    }
    /**
     * Sends a Post request to export Grid to Pdf file in server side.
     *
     * @param  {string} url - Pass Url for server side pdf export action.
     *
     * @param  {ExportHeaders} headers - The headers to include in the export request.
     *
     * @returns {void}
     */
    public serverPdfExport(url: string, headers?: ExportHeaders): void {
        this.isExcel = false;
        this.exportGrid(url, headers);
    }

    /**
     * Sends a Post request to export Grid to CSV file in server side.
     *
     * @param  {string} url - Pass Url for server side csv export action.
     *
     * @param  {ExportHeaders} headers - The headers to include in the export request.
     *
     * @returns {void}
     */
    public serverCsvExport(url: string, headers?: ExportHeaders): void {
        this.isExcel = true;
        this.exportGrid(url, headers);
    }

    /**
     * @param {string} url - Defines exporting url
     * @param {ExportHeaders} headers - The optional headers for the export request.
     * @returns {void}
     * @hidden
     */
    public exportGrid(url: string, headers?: ExportHeaders): void {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const grid: IGrid = this;
        const query: Query = grid.getDataModule().generateQuery(true);
        const state: { data?: string, pvtData?: Object[] } = new UrlAdaptor().processQuery(new DataManager({ url: '' }), query);
        const queries: {where: object, search: Object[], sorted: object} = JSON.parse(state.data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const gridModel: any = JSON.parse(this.addOnPersist(['allowGrouping', 'allowPaging', 'pageSettings', 'sortSettings', 'allowPdfExport', 'allowExcelExport', 'aggregates',
            'filterSettings', 'groupSettings', 'columns', 'locale', 'searchSettings']));
        const include: string[] = ['field', 'headerText', 'type', 'format', 'visible', 'foreignKeyValue', 'foreignKeyField',
            'template', 'index', 'width', 'textAlign', 'headerTextAlign', 'columns'];
        gridModel.filterSettings.columns = queries.where;
        gridModel.searchSettings.fields = queries.search && queries.search[0]['fields'] || [];
        gridModel.sortSettings.columns = queries.sorted;
        gridModel.columns = this.setHeaderText(gridModel.columns as Column[], include);
        const form: HTMLFormElement = this.createElement('form', { id: 'ExportForm' });
        form.style.display = 'none';
        const gridInput: HTMLInputElement = this.createElement('input', { id: 'gridInput', attrs: { name: 'gridModel' } });
        gridInput.value = JSON.stringify(gridModel);
        form.method = 'POST';
        form.action = url;
        form.appendChild(gridInput);
        if (headers && headers.headers && Array.isArray(headers.headers)) {
            headers.headers.forEach((header: { [key: string]: string }) => {
                Object.keys(header).forEach((key: string) => {
                    const value: string = typeof header[`${key}`] === 'string' ? header[`${key}`] : JSON.stringify(header[`${key}`]);
                    const headerInput: HTMLInputElement = this.createElement('input', { attrs: { name: key, value: value, type: 'hidden' }});
                    form.appendChild(headerInput);
                });
            });
        }
        document.body.appendChild(form);
        form.submit();
        form.remove();
    }

    /**
     * @param {Column[]} columns - Defines array of columns
     * @param {string[]} include - Defines array of sting
     * @returns {Column[]} returns array of columns
     * @hidden
     */
    public setHeaderText(columns: Column[], include: string[]): Column[] {
        for (let i: number = 0; i < columns.length; i++) {
            const column: Column = this.getColumnByUid(columns[parseInt(i.toString(), 10)].uid);
            columns[parseInt(i.toString(), 10)].headerText = column.headerText;
            if (!isNullOrUndefined(column.template)) {
                columns[parseInt(i.toString(), 10)].template = 'true';
            }
            if (columns[parseInt(i.toString(), 10)].format) {
                columns[parseInt(i.toString(), 10)].format = getNumberFormat(
                    this.getFormat(columns[parseInt(i.toString(), 10)].format),
                    columns[parseInt(i.toString(), 10)].type, false, defaultCurrencyCode);
                if (column.type === 'datetime' || column.type === 'date' || column.type === 'time') {
                    columns[parseInt(i.toString(), 10)].format = columns[parseInt(i.toString(), 10)].format.toString().replace('AM/PM', 'tt');
                }
            }
            if (columns[parseInt(i.toString(), 10)].columns) {
                this.setHeaderText(columns[parseInt(i.toString(), 10)].columns as Column[], include);
            }
            const keys: string[] = Object.keys(columns[parseInt(i.toString(), 10)]);
            for (let j: number = 0; j < keys.length; j++) {
                if (include.indexOf(keys[parseInt(j.toString(), 10)]) < 0) {
                    delete columns[parseInt(i.toString(), 10)][keys[parseInt(j.toString(), 10)]];
                }
            }
        }
        return columns;
    }

    private getFormat(format: string | NumberFormatOptions | DateFormatOptions): string {
        return typeof (format) === 'object' ? !isNullOrUndefined(format.format) ?
            format.format : format.skeleton : format;
    }

    /**
     * @hidden
     * @returns {boolean} returns the isCollapseStateEnabled
     */
    public isCollapseStateEnabled(): boolean {
        const isExpanded: string = 'isExpanded';
        return this[`${isExpanded}`] === false;
    }

    /**
     * @param {number} key - Defines the primary key value.
     * @param {Object} rowData - Defines the rowData
     * @returns {void}
     */
    public updateRowValue(key: number, rowData: Object): void {
        const args: SaveEventArgs = {
            requestType: 'save', data: rowData
        };
        this.showSpinner();
        this.notify(events.updateData, args);
        this.refresh();
    }

    /**
     * @hidden
     * @returns {void}
     */
    public setForeignKeyData(): void {
        this.dataBind();
        const colpending: PendingState = this.getDataModule().getForeignKeyDataState();
        if (colpending.isPending) {
            this.getDataModule().setForeignKeyDataState({});
            colpending.resolver();
        } else {
            this.getDataModule().setForeignKeyDataState({ isDataChanged: false });
            if (this.contentModule || this.headerModule) {
                this.renderModule.render();
            }
        }
    }

    /**
     * @param {string} field - specifies the field
     * @returns {void}
     * @hidden
     */
    public resetFilterDlgPosition(field: string): void {
        const header: Element = this.getColumnHeaderByField(field);
        if (header) {
            const target: Element = header.querySelector('.e-filtermenudiv');
            const filterDlg: HTMLElement = this.element.querySelector('.e-filter-popup');
            if (target) {
                const gClient: ClientRect = this.element.getBoundingClientRect();
                const fClient: ClientRect = target.getBoundingClientRect();
                if (filterDlg) {
                    if ((filterDlg.offsetWidth + fClient.right) > gClient.right) {
                        filterDlg.style.left = ((fClient.right - filterDlg.offsetWidth) - gClient.left).toString() + 'px';
                    } else {
                        filterDlg.style.left = (fClient.right - gClient.left).toString() + 'px';
                    }
                }
            }
        }
    }

    /**
     * @param {any} callBack - specifies the callBack method
     * @returns {void}
     * @hidden
     */
    // eslint-disable-next-line
    public renderTemplates(callBack?: any): void {
        const isReactChild: boolean = this.parentDetails && this.parentDetails.parentInstObj && this.parentDetails.parentInstObj.isReact;
        const isReactPrintGrid: boolean = this.printGridParent && this.printGridParent.isReact;
        if ((isReactChild || isReactPrintGrid) && this['portals']) {
            const parentInstObj: IGrid = isReactPrintGrid ? this.printGridParent : this.parentDetails.parentInstObj;
            parentInstObj['portals'] = parentInstObj['portals'].concat(this['portals']);
            parentInstObj.renderTemplates(callBack);
            this['portals'] = undefined;
        }
        else {
            const portals: string = 'portals';
            this.notify('reactTemplateRender', this[`${portals}`]);
            this.renderReactTemplates(callBack);
        }
    }

    /**
     * Apply the changes to the Grid without refreshing the rows.
     *
     * @param  {BatchChanges} changes - Defines changes to be updated.
     * @returns {void}
     */
    public batchUpdate(changes: BatchChanges): void {
        this.processRowChanges(changes);
    }

    /**
     * Apply the changes to the Grid in one batch after 50ms without refreshing the rows.
     *
     * @param  {BatchChanges} changes - Defines changes to be updated.
     * @returns {void}
     */
    public batchAsyncUpdate(changes: BatchChanges): void {
        this.processBulkRowChanges(changes);
    }

    private processBulkRowChanges(changes: BatchChanges): void {
        if (!this.dataToBeUpdated) {
            this.dataToBeUpdated = Object.assign({ addedRecords: [], changedRecords: [], deletedRecords: [] }, changes);
            setTimeout(
                () => {
                    this.processRowChanges(this.dataToBeUpdated);
                    this.dataToBeUpdated = null;
                },
                this.asyncTimeOut);
        } else {
            const loopstring: string[] = [literals.addedRecords, literals.changedRecords, literals.deletedRecords];
            const keyField: string = this.getPrimaryKeyFieldNames()[0];
            for (let i: number = 0; i < loopstring.length; i++) {
                if (changes[loopstring[parseInt(i.toString(), 10)]]) {
                    compareChanges(this, changes, loopstring[parseInt(i.toString(), 10)], keyField);
                }
            }
        }
    }

    private processRowChanges(changes: BatchChanges): void {
        const keyField: string = this.getPrimaryKeyFieldNames()[0];
        changes = Object.assign({ addedRecords: [], changedRecords: [], deletedRecords: [] }, changes);
        const promise: Promise<Object> = this.getDataModule().saveChanges(
            changes, keyField, {}, this.getDataModule().generateQuery().requiresCount()
        );
        if (this.getDataModule().isRemote()) {
            promise.then(() => {
                this.setNewData();
            });
        } else {
            this.setNewData();
        }
    }

    private setNewData(): void {
        const oldValues: Object[] = JSON.parse(JSON.stringify(this.getCurrentViewRecords()));
        const getData: Promise<Object> = this.getDataModule().getData({}, this.getDataModule().generateQuery().requiresCount());
        getData.then((e: ReturnType) => {
            this.bulkRefresh(e.result, oldValues, e.count);
        });
    }

    private deleteRowElement(row: Row<Column>): void {
        const tr: Element = this.getRowElementByUID(row.uid);
        remove(tr);
    }

    private bulkRefresh(result: Object[], oldValues: Object[], count: number): void {
        const rowObj: Row<Column>[] = this.getRowsObject();
        const keyField: string = this.getPrimaryKeyFieldNames()[0];
        for (let i: number = 0; i < rowObj.length; i++) {
            if (!result.filter((e: Object) => { return e[`${keyField}`] === rowObj[parseInt(i.toString(), 10)].data[`${keyField}`]; }).length) {
                this.deleteRowElement(rowObj[parseInt(i.toString(), 10)]);
                rowObj.splice(i, 1);
                i--;
            }
        }
        for (let i: number = 0; i < result.length; i++) {
            let isRowExist: boolean;
            oldValues.filter((e: Object) => {
                if (e[`${keyField}`] === result[parseInt(i.toString(), 10)][`${keyField}`]) {
                    if (e !== result[parseInt(i.toString(), 10)]) {
                        this.setRowData(result[parseInt(i.toString(), 10)][`${keyField}`], result[parseInt(i.toString(), 10)]);
                    }
                    isRowExist = true;
                }
            });
            if (!isRowExist) {
                this.renderRowElement(result[parseInt(i.toString(), 10)], i);
            }
        }
        this.currentViewData = result;
        const rows: HTMLTableRowElement[] = [].slice.call(this.getContentTable().getElementsByClassName(literals.row));
        resetRowIndex(this, this.getRowsObject(), rows);
        setRowElements(this);
        if (this.allowPaging) {
            this.notify(events.inBoundModelChanged, { module: 'pager', properties: { totalRecordsCount: count } });
        }
    }

    private renderRowElement(data: Object, index: number): void {
        const row: RowRenderer<Column> = new RowRenderer<Column>(this.serviceLocator, null, this);
        const model: IModelGenerator<Column> = new RowModelGenerator(this);
        const modelData: Row<Column>[] = model.generateRows([data]);
        const tr: HTMLTableRowElement = row.render(modelData[0], this.getColumns()) as HTMLTableRowElement;
        this.addRowObject(modelData[0], index);
        let tbody: Element = this.getContentTable().querySelector( literals.tbody);
        if (tbody.querySelector('.e-emptyrow')) {
            const emptyRow: Element = tbody.querySelector('.e-emptyrow');
            emptyRow.parentNode.removeChild(emptyRow);
            if (this.frozenRows && this.element.querySelector('.e-frozenrow-empty')) {
                this.element.querySelector('.e-frozenrow-empty').classList.remove('e-frozenrow-empty');
            }
        }
        if (this.frozenRows && index < this.frozenRows) {
            tbody = this.getHeaderContent().querySelector( literals.tbody);
        } else {
            tbody = this.getContent().querySelector( literals.tbody);
        }
        tbody = this.getContent().querySelector( literals.tbody);
        tbody.appendChild(tr);
    }

    private addRowObject(row: Row<Column>, index: number): void {
        this.getRowsObject().splice(index, 1, row);
    }

    /**
     * @hidden
     * @returns {void}
     */
    public updateVisibleExpandCollapseRows(): void {
        const rows: Row<Column>[] = this.getRowsObject();
        for (let i: number = 0, len: number = rows.length; i < len; i++) {
            if ((rows[parseInt(i.toString(), 10)].isDataRow || rows[parseInt(i.toString(), 10)].isAggregateRow)
                && this.getRowElementByUID(rows[parseInt(i.toString(), 10)].uid)
                && (this.getRowElementByUID(rows[parseInt(i.toString(), 10)].uid) as HTMLTableRowElement).style.display === 'none') {
                (<{ visible?: boolean }>rows[parseInt(i.toString(), 10)]).visible = false;
            } else {
                (<{ visible?: boolean }>rows[parseInt(i.toString(), 10)]).visible = true;
            }
        }
    }

    /**
     * Method to sanitize any suspected untrusted strings and scripts before rendering them.
     *
     * @param {string} value - Specifies the html value to sanitize
     * @returns {string} Returns the sanitized html string
     * @hidden
     */
    public sanitize(value: string): string {
        if (this.enableHtmlSanitizer) {
            return SanitizeHtmlHelper.sanitize(value);
        }
        return value;
    }

    /**
     * @param {string | number} height - specifies the height
     * @returns {number | string} - specifies the height number
     * @hidden
     */
    public getHeight(height: string | number): number | string {
        if (!Number.isInteger(height as number) && (height as string).indexOf('%') !== -1) {
            height = parseInt(height as string, 10) / 100 * this.element.clientHeight;
        }
        else if (!Number.isInteger(height as number) && this.height !== 'auto') {
            height = parseInt(height as string, 10);
        }
        else {
            height = this.height;
        }
        return height;
    }

    /**
     * @hidden
     * @returns {Element} - returns frozen right content
     * @deprecated This method is deprecated. Use `getContent()` method instead.
     */
    public getFrozenRightContent(): Element {
        return this.contentModule.getPanel();
    }

    /**
     * @hidden
     * @returns {Element} - returns frozen right header
     * @deprecated This method is deprecated. Use `getHeaderContent()` method instead.
     */
    public getFrozenRightHeader(): Element {
        return this.headerModule.getPanel();
    }

    /**
     * @hidden
     * @returns {Element} - returns movable header tbody
     * @deprecated This method is deprecated. Use `getHeaderContent().querySelector('tbody')` method instead.
     */
    public getMovableHeaderTbody(): Element {
        return this.getHeaderContent().querySelector(literals.tbody);
    }

    /**
     * @hidden
     * @returns {Element} - returns movable content tbody
     * @deprecated This method is deprecated. Use `getContent().querySelector('tbody')` method instead.
     */
    public getMovableContentTbody(): Element {
        return this.getContent().querySelector(literals.tbody);
    }

    /**
     * @hidden
     * @returns {Element} - returns frozen header tbody
     * @deprecated This method is deprecated. Use `getHeaderContent().querySelector('tbody')` method instead.
     */
    public getFrozenHeaderTbody(): Element {
        return this.getHeaderContent().querySelector( literals.tbody);
    }

    /**
     * @hidden
     * @returns {Element} - returns frozen left content tbody
     * @deprecated This method is deprecated. Use `getContent().querySelector('tbody')` method instead.
     */
    public getFrozenLeftContentTbody(): Element {
        return this.getContent().querySelector( literals.tbody);
    }

    /**
     * @hidden
     * @returns {Element} - returns frozen right header tbody
     * @deprecated This method is deprecated. Use `getHeaderContent().querySelector('tbody')` method instead.
     */
    public getFrozenRightHeaderTbody(): Element {
        return this.getHeaderContent().querySelector( literals.tbody);
    }

    /**
     * @returns {Element} returns frozen right content tbody
     * @deprecated This method is deprecated. Use `getContent().querySelector('tbody')` method instead.
     * @hidden
     */
    public getFrozenRightContentTbody(): Element {
        return this.getContent().querySelector(literals.tbody);
    }


    /**
     * @param {boolean} isCustom - Defines custom filter dialog open
     * @returns {void}
     * @hidden
     */
    public showResponsiveCustomFilter(isCustom?: boolean): void {
        if (this.filterModule) {
            this.filterModule.showCustomFilter(isCustom || this.rowRenderingMode === 'Vertical');
        }
    }

    /**
     * @param {boolean} isCustom - Defines custom sort dialog open
     * @returns {void}
     * @hidden
     */
    public showResponsiveCustomSort(isCustom?: boolean): void {
        if (this.sortModule) {
            this.sortModule.showCustomSort(isCustom || this.rowRenderingMode === 'Vertical');
        }
    }

    /**
     * @param {boolean} isCustom - Defines custom column chooser dialog open
     * @returns {void}
     * @hidden
     */
    public showResponsiveCustomColumnChooser(isCustom?: boolean): void {
        if (this.columnChooserModule) {
            this.columnChooserModule.showCustomColumnChooser(isCustom || this.rowRenderingMode === 'Vertical');
        }
    }

    /**
     * To manually show the vertical row mode filter dialog
     *
     * @returns {void}
     */
    public showAdaptiveFilterDialog(): void {
        if (this.enableAdaptiveUI) {
            this.showResponsiveCustomFilter(true);
        }
    }

    /**
     * To manually show the vertical row sort filter dialog
     *
     * @returns {void}
     */
    public showAdaptiveSortDialog(): void {
        if (this.enableAdaptiveUI) {
            this.showResponsiveCustomSort(true);
        }
    }

    /**
     * @param {boolean} isColVirtualization - Defines column virtualization
     * @returns {Column[]} returns array of column models
     * @hidden
     */
    public getCurrentVisibleColumns(isColVirtualization?: boolean): Column[] {
        const cols: Column[] = [];
        const gridCols: Column[] = isColVirtualization ? this.getColumns() : this.columnModel;
        for (const col of gridCols) {
            if (col.visible) {
                cols.push(col);
            }
        }
        return cols;
    }

    private enableInfiniteAggrgate(): void {
        if (this.enableInfiniteScrolling && this.groupSettings.columns.length && !this.groupSettings.disablePageWiseAggregates
            && !this.groupSettings.enableLazyLoading) {
            this.setProperties({ groupSettings: { disablePageWiseAggregates: true } }, true);
        }
    }
}

interface frozenStackedColumn{
    headerText?: string;
    textAlign?: string;
    customAttributes?: Object;
    columns?: Column[]
}
