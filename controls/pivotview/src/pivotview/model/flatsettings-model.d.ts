import { ChildProperty, Complex, Property, EmitType } from '@syncfusion/ej2-base';import { GridModel, ColumnChooserSettingsModel, QueryCellInfoEventArgs, HeaderCellInfoEventArgs } from '@syncfusion/ej2-grids';import { ColumnModel, AggregateRowModel, SortSettings, SortSettingsModel, FilterSettings, FilterSettingsModel } from '@syncfusion/ej2-grids';import { SearchSettings, SearchSettingsModel, AdvancedFilterSettings, AdvancedFilterSettingsModel } from '@syncfusion/ej2-grids';import { SelectionSettings, SelectionSettingsModel as GridSelectionSettingsModel, TextWrapSettings, TextWrapSettingsModel } from '@syncfusion/ej2-grids';import { PageSettingsModel as GridPageSettingsModel, ColumnMenuItem, ColumnMenuItemModel, GridLine, ClipMode } from '@syncfusion/ej2-grids';import { FlatTotalsPosition } from '../../common/base/enum';

/**
 * Interface for a class FlatPageSettings
 */
export interface FlatPageSettingsModel {

    /**
     * Record page size.
     *
     * @hidden
     * @default 12
     */
    pageSize?: number;

    /**
     * Current record page.
     *
     * @hidden
     * @default 1
     */
    currentPage?: number;

    /**
     * Visible page buttons.
     *
     * @hidden
     * @default 8
     */
    pageCount?: number;

    /**
     * Page size choices.
     *
     * @hidden
     * @default false
     */
    pageSizes?: boolean | (number | string)[];

}

/**
 * Interface for a class FlatColumnChooserSettings
 */
export interface FlatColumnChooserSettingsModel {

    /**
     * Search operator.
     *
     * @hidden
     * @default startsWith
     */
    operator?: string;

    /**
     * Ignore search accents.
     *
     * @hidden
     * @default false
     */
    ignoreAccent?: boolean;

    /**
     * Show native search.
     *
     * @hidden
     * @default true
     */
    enableSearching?: boolean;

    /**
     * Native commit mode.
     *
     * @hidden
     * @default Default
     */
    mode?: 'Default' | 'Immediate';

    /**
     * Immediate commit delay.
     *
     * @hidden
     * @default 0
     */
    immediateModeDelay?: number;

}

/**
 * Interface for a class FlatSettings
 */
export interface FlatSettingsModel {

    /**
     * Invokes the native Grid callback before a row is selected in the Flat view.
     * Supplies detached physical record data using the native Grid event contract.
     *
     * @public
     * @default undefined
     */
    rowSelecting?: GridModel['rowSelecting'];

    /**
     * Invokes the native Grid callback after a row is selected in the Flat view.
     * Supplies detached physical record data using the native Grid event contract.
     *
     * @public
     * @default undefined
     */
    rowSelected?: GridModel['rowSelected'];

    /**
     * Invokes the native Grid callback before a row is deselected in the Flat view.
     * Supplies detached physical record data using the native Grid event contract.
     *
     * @public
     * @default undefined
     */
    rowDeselecting?: GridModel['rowDeselecting'];

    /**
     * Invokes the native Grid callback after a row is deselected in the Flat view.
     * Supplies detached physical record data using the native Grid event contract.
     *
     * @public
     * @default undefined
     */
    rowDeselected?: GridModel['rowDeselected'];

    /**
     * Invokes the native Grid callback before a cell is selected in the Flat view.
     * Supplies detached physical record data using the native Grid event contract.
     *
     * @public
     * @default undefined
     */
    cellSelecting?: GridModel['cellSelecting'];

    /**
     * Invokes the native Grid callback after a cell is selected in the Flat view.
     * Supplies detached physical record data using the native Grid event contract.
     *
     * @public
     * @default undefined
     */
    cellSelected?: GridModel['cellSelected'];

    /**
     * Invokes the native Grid callback before a cell is deselected in the Flat view.
     * Supplies detached physical record data using the native Grid event contract.
     *
     * @public
     * @default undefined
     */
    cellDeselecting?: GridModel['cellDeselecting'];

    /**
     * Invokes the native Grid callback after a cell is deselected in the Flat view.
     * Supplies detached physical record data using the native Grid event contract.
     *
     * @public
     * @default undefined
     */
    cellDeselected?: GridModel['cellDeselected'];

    /**
     * Native read-only Grid toolbar commands, independent of the Pivot toolbar.
     *
     * @public
     * @default []
     */
    toolbar?: GridModel['toolbar'];

    /**
     * Enables the native Grid column chooser independently of the Pivot FieldList.
     *
     * @public
     * @default false
     */
    showColumnChooser?: boolean;

    /**
     * Native column chooser search and staged presentation settings.
     *
     * @public
     * @default {}
     */
    columnChooserSettings?: ColumnChooserSettingsModel;

    /**
     * Customizes a raw record cell using physical fields and detached record data.
     *
     * @public
     * @default undefined
     */
    queryCellInfo?: EmitType<QueryCellInfoEventArgs>;

    /**
     * Customizes a Flat column header using its physical column descriptor.
     *
     * @public
     * @default undefined
     */
    headerCellInfo?: EmitType<HeaderCellInfoEventArgs>;

    /**
     * Defines the selected physical source columns using native Grid column descriptors.
     * An undefined value derives the initial fields once from the report; an empty array displays no fields.
     *
     * @public
     * @default undefined
     */
    columns?: ColumnModel[];

    /**
     * Enable user sorting.
     *
     * @public
     * @default false
     */
    allowSorting?: boolean;

    /**
     * Enable user multi-sorting.
     *
     * @public
     * @default false
     */
    allowMultiSorting?: boolean;

    /**
     * Enable column filter UI.
     *
     * @public
     * @default false
     */
    allowFiltering?: boolean;

    /**
     * Specifies stable sorting of the complete selected record set using native Grid sort descriptors.
     * Sorting applies before aggregate calculation, paging and virtualization and does not modify pivot report sorts.
     *
     * @public
     * @default {}
     */
    sortSettings?: SortSettingsModel;

    /**
     * Configures column predicates and the native Menu or Excel filter presentation for Flat records.
     * Column predicates combine with advanced filtering and search without changing pivot report filters.
     *
     * @public
     * @default {type: 'Menu'}
     */
    filterSettings?: FilterSettingsModel;

    /**
     * Configures record search using native Grid search settings.
     * Empty search fields use the selected visible columns whose allowSearching property is not false.
     *
     * @public
     * @default {}
     */
    searchSettings?: SearchSettingsModel;

    /**
     * Enable advanced filter UI.
     *
     * @public
     * @default false
     */
    allowAdvancedFiltering?: boolean;

    /**
     * Advanced nested rules and presentation.
     *
     * @public
     * @default {}
     */
    advancedFilterSettings?: AdvancedFilterSettingsModel;

    /**
     * Number of visible columns frozen at the start.
     *
     * @public
     * @default 0
     */
    frozenColumns?: number;

    /**
     * Enable column header menus.
     *
     * @public
     * @default false
     */
    showColumnMenu?: boolean;

    /**
     * Supported header menu commands.
     *
     * @public
     * @default undefined
     */
    columnMenuItems?: ColumnMenuItem[] | ColumnMenuItemModel[];

    /**
     * Configures one optional aggregate row using native Grid aggregate descriptors and calculation semantics.
     * Each eligible physical field supports one aggregate type, retained when the field is absent from the columns.
     * Only visible selected columns render totals. Results include the complete filtered record set,
     * independently of paging and virtualization. Grouped aggregates and multiple aggregate rows are unsupported.
     *
     * @public
     * @default []
     */
    aggregates?: AggregateRowModel[];

    /**
     * Specifies whether the aggregate row is hidden or displayed above or below the Flat records.
     * This setting does not change the saved pivot report's grand total position.
     *
     * @public
     * @default None
     */
    totalsPosition?: FlatTotalsPosition;

    /**
     * Enable record paging.
     *
     * @public
     * @default false
     */
    allowPaging?: boolean;

    /**
     * Independent record paging settings.
     *
     * @public
     * @default {}
     */
    pageSettings?: GridPageSettingsModel;

    /**
     * Enable record virtualization.
     *
     * @public
     * @default false
     */
    enableVirtualization?: boolean;

    /**
     * Enable column virtualization.
     *
     * @public
     * @default false
     */
    enableColumnVirtualization?: boolean;

    /**
     * Enable record selection.
     *
     * @public
     * @default false
     */
    allowSelection?: boolean;

    /**
     * Independent Grid selection settings.
     *
     * @public
     * @default {}
     */
    selectionSettings?: GridSelectionSettingsModel;

    /**
     * Enable user column resizing.
     *
     * @public
     * @default false
     */
    allowResizing?: boolean;

    /**
     * Enable user column reordering.
     *
     * @public
     * @default false
     */
    allowReordering?: boolean;

    /**
     * Enable text wrapping.
     *
     * @public
     * @default false
     */
    allowTextWrap?: boolean;

    /**
     * Independent text wrapping settings.
     *
     * @public
     * @default {}
     */
    textWrapSettings?: TextWrapSettingsModel;

    /**
     * Record row height; omitted uses Grid theme defaults.
     *
     * @public
     * @default undefined
     */
    rowHeight?: number;

    /**
     * Grid border presentation.
     *
     * @public
     * @default Default
     */
    gridLines?: GridLine;

    /**
     * Cell overflow presentation.
     *
     * @public
     * @default Ellipsis
     */
    clipMode?: ClipMode;

    /**
     * Enable Flat Excel/CSV output.
     *
     * @public
     * @default false
     */
    allowExcelExport?: boolean;

    /**
     * Enable Flat PDF output.
     *
     * @public
     * @default false
     */
    allowPdfExport?: boolean;

}