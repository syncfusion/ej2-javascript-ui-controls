import { ChildProperty, Complex, Property, EmitType } from '@syncfusion/ej2-base';
import { GridModel, ColumnChooserSettingsModel, QueryCellInfoEventArgs, HeaderCellInfoEventArgs } from '@syncfusion/ej2-grids';
import { ColumnModel, AggregateRowModel, SortSettings, SortSettingsModel, FilterSettings, FilterSettingsModel } from '@syncfusion/ej2-grids';
import { SearchSettings, SearchSettingsModel, AdvancedFilterSettings, AdvancedFilterSettingsModel } from '@syncfusion/ej2-grids';
import { SelectionSettings, SelectionSettingsModel as GridSelectionSettingsModel, TextWrapSettings, TextWrapSettingsModel } from '@syncfusion/ej2-grids';
import { PageSettingsModel as GridPageSettingsModel, ColumnMenuItem, ColumnMenuItemModel, GridLine, ClipMode } from '@syncfusion/ej2-grids';
import { FlatTotalsPosition } from '../../common/base/enum';

/** Private runtime adapter for the public Grid paging contract. @hidden */
export class FlatPageSettings extends ChildProperty<FlatPageSettings> implements GridPageSettingsModel {
    /**
     * Record page size.
     *
     * @hidden
     * @default 12
     */
    @Property(12)
    public pageSize: number;
    /**
     * Current record page.
     *
     * @hidden
     * @default 1
     */
    @Property(1)
    public currentPage: number;
    /**
     * Visible page buttons.
     *
     * @hidden
     * @default 8
     */
    @Property(8)
    public pageCount: number;
    /**
     * Page size choices.
     *
     * @hidden
     * @default false
     */
    @Property(false)
    public pageSizes: boolean | (number | string)[];
}

/** Private runtime adapter; Grid exports the chooser interface but not its runtime class. @hidden */
export class FlatColumnChooserSettings extends ChildProperty<FlatColumnChooserSettings> implements ColumnChooserSettingsModel {
    /**
     * Search operator.
     *
     * @hidden
     * @default startsWith
     */
    @Property('startsWith')
    public operator: string;
    /**
     * Ignore search accents.
     *
     * @hidden
     * @default false
     */
    @Property(false)
    public ignoreAccent: boolean;
    /**
     * Show native search.
     *
     * @hidden
     * @default true
     */
    @Property(true)
    public enableSearching: boolean;
    /**
     * Native commit mode.
     *
     * @hidden
     * @default Default
     */
    @Property('Default')
    public mode: 'Default' | 'Immediate';
    /**
     * Immediate commit delay.
     *
     * @hidden
     * @default 0
     */
    @Property(0)
    public immediateModeDelay: number;
}

/** Defines public settings for the read-only Flat record view, independently of the saved pivot report. */
export class FlatSettings extends ChildProperty<FlatSettings> {
    /**
     * Invokes the native Grid callback before a row is selected in the Flat view.
     * Supplies detached physical record data using the native Grid event contract.
     *
     * @public
     * @default undefined
     */
    @Property(undefined)
    public rowSelecting: GridModel['rowSelecting'];
    /**
     * Invokes the native Grid callback after a row is selected in the Flat view.
     * Supplies detached physical record data using the native Grid event contract.
     *
     * @public
     * @default undefined
     */
    @Property(undefined)
    public rowSelected: GridModel['rowSelected'];
    /**
     * Invokes the native Grid callback before a row is deselected in the Flat view.
     * Supplies detached physical record data using the native Grid event contract.
     *
     * @public
     * @default undefined
     */
    @Property(undefined)
    public rowDeselecting: GridModel['rowDeselecting'];
    /**
     * Invokes the native Grid callback after a row is deselected in the Flat view.
     * Supplies detached physical record data using the native Grid event contract.
     *
     * @public
     * @default undefined
     */
    @Property(undefined)
    public rowDeselected: GridModel['rowDeselected'];
    /**
     * Invokes the native Grid callback before a cell is selected in the Flat view.
     * Supplies detached physical record data using the native Grid event contract.
     *
     * @public
     * @default undefined
     */
    @Property(undefined)
    public cellSelecting: GridModel['cellSelecting'];
    /**
     * Invokes the native Grid callback after a cell is selected in the Flat view.
     * Supplies detached physical record data using the native Grid event contract.
     *
     * @public
     * @default undefined
     */
    @Property(undefined)
    public cellSelected: GridModel['cellSelected'];
    /**
     * Invokes the native Grid callback before a cell is deselected in the Flat view.
     * Supplies detached physical record data using the native Grid event contract.
     *
     * @public
     * @default undefined
     */
    @Property(undefined)
    public cellDeselecting: GridModel['cellDeselecting'];
    /**
     * Invokes the native Grid callback after a cell is deselected in the Flat view.
     * Supplies detached physical record data using the native Grid event contract.
     *
     * @public
     * @default undefined
     */
    @Property(undefined)
    public cellDeselected: GridModel['cellDeselected'];

    /**
     * Native read-only Grid toolbar commands, independent of the Pivot toolbar.
     *
     * @public
     * @default []
     */
    @Property([])
    public toolbar: GridModel['toolbar'];
    /**
     * Enables the native Grid column chooser independently of the Pivot FieldList.
     *
     * @public
     * @default false
     */
    @Property(false)
    public showColumnChooser: boolean;
    /**
     * Native column chooser search and staged presentation settings.
     *
     * @public
     * @default {}
     */
    @Complex<ColumnChooserSettingsModel>({}, FlatColumnChooserSettings)
    public columnChooserSettings: ColumnChooserSettingsModel;
    /**
     * Customizes a raw record cell using physical fields and detached record data.
     *
     * @public
     * @default undefined
     */
    @Property(undefined)
    public queryCellInfo: EmitType<QueryCellInfoEventArgs>;
    /**
     * Customizes a Flat column header using its physical column descriptor.
     *
     * @public
     * @default undefined
     */
    @Property(undefined)
    public headerCellInfo: EmitType<HeaderCellInfoEventArgs>;
    /**
     * Defines the selected physical source columns using native Grid column descriptors.
     * An undefined value derives the initial fields once from the report; an empty array displays no fields.
     *
     * @public
     * @default undefined
     */
    @Property(undefined)
    public columns: ColumnModel[];
    /**
     * Enable user sorting.
     *
     * @public
     * @default false
     */
    @Property(false)
    public allowSorting: boolean;
    /**
     * Enable user multi-sorting.
     *
     * @public
     * @default false
     */
    @Property(false)
    public allowMultiSorting: boolean;
    /**
     * Enable column filter UI.
     *
     * @public
     * @default false
     */
    @Property(false)
    public allowFiltering: boolean;
    /**
     * Specifies stable sorting of the complete selected record set using native Grid sort descriptors.
     * Sorting applies before aggregate calculation, paging and virtualization and does not modify pivot report sorts.
     *
     * @public
     * @default {}
     */
    @Complex<SortSettingsModel>({}, SortSettings)
    public sortSettings: SortSettingsModel;
    /**
     * Configures column predicates and the native Menu or Excel filter presentation for Flat records.
     * Column predicates combine with advanced filtering and search without changing pivot report filters.
     *
     * @public
     * @default {type: 'Menu'}
     */
    @Complex<FilterSettingsModel>({ type: 'Menu' }, FilterSettings)
    public filterSettings: FilterSettingsModel;
    /**
     * Configures record search using native Grid search settings.
     * Empty search fields use the selected visible columns whose allowSearching property is not false.
     *
     * @public
     * @default {}
     */
    @Complex<SearchSettingsModel>({}, SearchSettings)
    public searchSettings: SearchSettingsModel;
    /**
     * Enable advanced filter UI.
     *
     * @public
     * @default false
     */
    @Property(false)
    public allowAdvancedFiltering: boolean;
    /**
     * Advanced nested rules and presentation.
     *
     * @public
     * @default {}
     */
    @Complex<AdvancedFilterSettingsModel>({}, AdvancedFilterSettings)
    public advancedFilterSettings: AdvancedFilterSettingsModel;
    /**
     * Number of visible columns frozen at the start.
     *
     * @public
     * @default 0
     */
    @Property(0)
    public frozenColumns: number;
    /**
     * Enable column header menus.
     *
     * @public
     * @default false
     */
    @Property(false)
    public showColumnMenu: boolean;
    /**
     * Supported header menu commands.
     *
     * @public
     * @default undefined
     */
    @Property(undefined)
    public columnMenuItems: ColumnMenuItem[] | ColumnMenuItemModel[];
    /**
     * Configures one optional aggregate row using native Grid aggregate descriptors and calculation semantics.
     * Each eligible physical field supports one aggregate type, retained when the field is absent from the columns.
     * Only visible selected columns render totals. Results include the complete filtered record set,
     * independently of paging and virtualization. Grouped aggregates and multiple aggregate rows are unsupported.
     *
     * @public
     * @default []
     */
    @Property([])
    public aggregates: AggregateRowModel[];
    /**
     * Specifies whether the aggregate row is hidden or displayed above or below the Flat records.
     * This setting does not change the saved pivot report's grand total position.
     *
     * @public
     * @default None
     */
    @Property('None')
    public totalsPosition: FlatTotalsPosition;
    /**
     * Enable record paging.
     *
     * @public
     * @default false
     */
    @Property(false)
    public allowPaging: boolean;
    /**
     * Independent record paging settings.
     *
     * @public
     * @default {}
     */
    @Complex<GridPageSettingsModel>({}, FlatPageSettings)
    public pageSettings: GridPageSettingsModel;
    /**
     * Enable record virtualization.
     *
     * @public
     * @default false
     */
    @Property(false)
    public enableVirtualization: boolean;
    /**
     * Enable column virtualization.
     *
     * @public
     * @default false
     */
    @Property(false)
    public enableColumnVirtualization: boolean;
    /**
     * Enable record selection.
     *
     * @public
     * @default false
     */
    @Property(false)
    public allowSelection: boolean;
    /**
     * Independent Grid selection settings.
     *
     * @public
     * @default {}
     */
    @Complex<GridSelectionSettingsModel>({}, SelectionSettings)
    public selectionSettings: GridSelectionSettingsModel;
    /**
     * Enable user column resizing.
     *
     * @public
     * @default false
     */
    @Property(false)
    public allowResizing: boolean;
    /**
     * Enable user column reordering.
     *
     * @public
     * @default false
     */
    @Property(false)
    public allowReordering: boolean;
    /**
     * Enable text wrapping.
     *
     * @public
     * @default false
     */
    @Property(false)
    public allowTextWrap: boolean;
    /**
     * Independent text wrapping settings.
     *
     * @public
     * @default {}
     */
    @Complex<TextWrapSettingsModel>({}, TextWrapSettings)
    public textWrapSettings: TextWrapSettingsModel;
    /**
     * Record row height; omitted uses Grid theme defaults.
     *
     * @public
     * @default undefined
     */
    @Property(undefined)
    public rowHeight: number;
    /**
     * Grid border presentation.
     *
     * @public
     * @default Default
     */
    @Property('Default')
    public gridLines: GridLine;
    /**
     * Cell overflow presentation.
     *
     * @public
     * @default Ellipsis
     */
    @Property('Ellipsis')
    public clipMode: ClipMode;
    /**
     * Enable Flat Excel/CSV output.
     *
     * @public
     * @default false
     */
    @Property(false)
    public allowExcelExport: boolean;
    /**
     * Enable Flat PDF output.
     *
     * @public
     * @default false
     */
    @Property(false)
    public allowPdfExport: boolean;
}
