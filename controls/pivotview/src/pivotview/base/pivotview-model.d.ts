import { Property, Browser, Component, ModuleDeclaration, createElement, setStyleAttribute, setCurrencyCode } from '@syncfusion/ej2-base';import { EmitType, EventHandler, Complex, extend, ChildProperty, Collection, isNullOrUndefined, remove } from '@syncfusion/ej2-base';import { Internationalization, L10n, NotifyPropertyChanges, INotifyPropertyChanged } from '@syncfusion/ej2-base';import { removeClass, addClass, Event } from '@syncfusion/ej2-base';import { PivotEngine, IPivotValues, IAxisSet, IDataOptions, IDataSet, IPageSettings } from '../../base/engine';import { IConditionalFormatSettings } from '../../base/engine';import { Tooltip, TooltipEventArgs, createSpinner, showSpinner, hideSpinner } from '@syncfusion/ej2-popups';import * as events from '../../common/base/constant';import * as cls from '../../common/base/css-constant';import { AxisFields } from '../../common/grouping-bar/axis-field-renderer';import { LoadEventArgs, EnginePopulatingEventArgs, DrillThroughEventArgs, PivotColumn } from '../../common/base/interface';import { ResizeInfo, ScrollInfo, BeforeColumnRenderEventArgs, PivotCellSelectedEventArgs } from '../../common/base/interface';import { CellClickEventArgs, FieldDroppedEventArgs, HyperCellClickEventArgs } from '../../common/base/interface';import { BeforeExportEventArgs, EnginePopulatedEventArgs } from '../../common/base/interface';import { Render } from '../renderer/render';import { PivotCommon } from '../../common/base/pivot-common';import { Common } from '../../common/actions/common';import { GroupingBar } from '../../common/grouping-bar/grouping-bar';import { DataSourceModel, DrillOptionsModel } from '../model/dataSource-model';import { DataSource } from '../model/dataSource';import { GridSettings } from '../model/gridsettings';import { GridSettingsModel } from '../model/gridsettings-model';import { PivotButton } from '../../common/actions/pivot-button';import { PivotFieldList } from '../../pivotfieldlist/base/field-list';import { Grid, Column, QueryCellInfoEventArgs, HeaderCellInfoEventArgs, ColumnModel, Reorder, Resize } from '@syncfusion/ej2-grids';import { CellSelectEventArgs, CellDeselectEventArgs, RowSelectEventArgs, ResizeArgs, RowDeselectEventArgs } from '@syncfusion/ej2-grids';import { EditSettingsModel } from '@syncfusion/ej2-grids';import { PdfExportProperties, ExcelExportProperties, ExcelQueryCellInfoEventArgs, ColumnDragEventArgs } from '@syncfusion/ej2-grids';import { ExcelHeaderQueryCellInfoEventArgs, PdfQueryCellInfoEventArgs, PdfHeaderQueryCellInfoEventArgs } from '@syncfusion/ej2-grids';import { ExcelExport } from '../actions/excel-export';import { PDFExport } from '../actions/pdf-export';import { CalculatedField } from '../../common/calculatedfield/calculated-field';import { KeyboardInteraction } from '../actions/keyboard';import { PivotContextMenu } from '../../common/popups/context-menu';import { DataManager, ReturnOption, Query } from '@syncfusion/ej2-data';import { ConditionalFormatting } from '../../common/conditionalformatting/conditional-formatting';import { cssClass } from '@syncfusion/ej2-lists';import { VirtualScroll } from '../actions/virtualscroll';import { DrillThrough } from '../actions/drill-through';import { Condition } from '../../base/types';import { EditMode } from '../../common';
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class GroupingBarSettings
 */
export interface GroupingBarSettingsModel {

    /**
     * It allows to set the visibility of filter icon in GroupingBar button
     * @default true     
     */
    showFilterIcon?: boolean;

    /**
     * It allows to set the visibility of sort icon in GroupingBar button
     * @default true     
     */
    showSortIcon?: boolean;

    /**
     * It allows to set the visibility of remove icon in GroupingBar button
     * @default true     
     */
    showRemoveIcon?: boolean;

    /**
     * It allows to set the visibility of drop down icon in GroupingBar button
     * @default true     
     */
    showValueTypeIcon?: boolean;

}

/**
 * Interface for a class CellEditSettings
 */
export interface CellEditSettingsModel {

    /**
     * If `allowAdding` is set to true, new records can be added to the Grid.
     * @default false
     */
    allowAdding?: boolean;

    /**
     * If `allowEditing` is set to true, values can be updated in the existing record.
     * @default false
     */
    allowEditing?: boolean;

    /**
     * If `allowDeleting` is set to true, existing record can be deleted from the Grid.
     * @default false
     */
    allowDeleting?: boolean;

    /**
     * If `allowCommandColumns` is set to true, an additional column appended to perform CRUD operations in Grid.
     * @default false
     */
    allowCommandColumns?: boolean;

    /**
     * Defines the mode to edit. The available editing modes are:
     * * Normal
     * * Dialog
     * * Batch
     * @default Normal
     */
    mode?: EditMode;

    /**
     * If `allowEditOnDblClick` is set to false, Grid will not allow editing of a record on double click.
     * @default true
     */
    allowEditOnDblClick?: boolean;

    /**
     * if `showConfirmDialog` is set to false, confirm dialog does not show when batch changes are saved or discarded.
     * @default true
     */
    showConfirmDialog?: boolean;

    /**
     * If `showDeleteConfirmDialog` is set to true, confirm dialog will show delete action. You can also cancel delete command.
     * @default false
     */
    showDeleteConfirmDialog?: boolean;

}

/**
 * Interface for a class ConditionalSettings
 */
export interface ConditionalSettingsModel {

    /**
     * It allows to set the field name to get visibility of hyperlink based on condition.
     */
    measure?: string;

    /**
     * It allows to set the label name to get visibility of hyperlink based on condition.
     */
    label?: string;

    /**
     * It allows to set the filter conditions to the field.
     * @default NotEquals
     */
    conditions?: Condition;

    /**
     * It allows to set the value1 get visibility of hyperlink.
     */
    value1?: number;

    /**
     * It allows to set the value2 to get visibility of hyperlink.
     */
    value2?: number;

}

/**
 * Interface for a class HyperlinkSettings
 */
export interface HyperlinkSettingsModel {

    /**
     * It allows to set the visibility of hyperlink in all cells
     * @default false     
     */
    showHyperlink?: boolean;

    /**
     * It allows to set the visibility of hyperlink in row headers
     * @default false     
     */
    showRowHeaderHyperlink?: boolean;

    /**
     * It allows to set the visibility of hyperlink in column headers
     * @default true     
     */
    showColumnHeaderHyperlink?: boolean;

    /**
     * It allows to set the visibility of hyperlink in value cells
     * @default false     
     */
    showValueCellHyperlink?: boolean;

    /**
     * It allows to set the visibility of hyperlink in summary cells
     * @default true     
     */
    showSummaryCellHyperlink?: boolean;

    /**
     * It allows to set the visibility of hyperlink based on condition
     * @default []
     */
    conditionalSettings?: ConditionalSettingsModel[];

    /**
     * It allows to set the visibility of hyperlink based on header text
     */
    headerText?: string;

    /**
     * It allows to set the custom class name for hyperlink options
     * @default ''
     */
    cssClass?: string;

}

/**
 * Interface for a class PivotView
 */
export interface PivotViewModel extends ComponentModel{

    /**
     * Defines the currencyCode format of the Pivot widget columns
     * @private
     */
    currencyCode?: string;

    /**
     * It allows to render pivotfieldlist.
     * @default false
     */
    showFieldList?: boolean;

    /**
     * Configures the features settings of Pivot widget. 
     */
    gridSettings?: GridSettingsModel;

    /**
     * Configures the settings of GroupingBar. 
     */
    groupingBarSettings?: GroupingBarSettingsModel;

    /**
     * Configures the settings of hyperlink settings. 
     */
    hyperlinkSettings?: HyperlinkSettingsModel;

    /**
     * It allows the user to configure the pivot report as per the user need.
     */
    dataSource?: DataSourceModel;

    /**
     * Configures the edit behavior of the Pivot Grid.
     * @default { allowAdding: false, allowEditing: false, allowDeleting: false, allowCommandColumns: false, 
     * mode:'Normal', allowEditOnDblClick: true, showConfirmDialog: true, showDeleteConfirmDialog: false }
     */
    editSettings?: CellEditSettingsModel;

    /**
     * It holds the pivot engine data which renders the Pivot widget.
     */
    pivotValues?: IPivotValues;

    /**
     * Enables the display of GroupingBar allowing you to filter, sort, and remove fields obtained from the datasource.
     * @default false
     */
    showGroupingBar?: boolean;

    /**
     * Allows to display the Tooltip on hovering value cells in pivot grid.
     * @default true
     */
    showTooltip?: boolean;

    /**
     * It shows a common button for value fields to move together in column or row axis
     * @default false
     */
    showValuesButton?: boolean;

    /**
     * It allows to enable calculated field in PivotView.
     * @default false
     */
    allowCalculatedField?: boolean;

    /**
     * It allows to enable Value Sorting in PivotView.
     * @default false
     */
    enableValueSorting?: boolean;

    /**
     * It allows to enable Conditional Formatting in PivotView.
     * @default false
     */
    allowConditionalFormatting?: boolean;

    /**
     * Pivot widget. (Note change all occurrences) 
     * @default auto
     */
    height?: string | number;

    /**
     * It allows to set the width of Pivot widget. 
     * @default auto
     */
    width?: string | number;

    /**
     * If `allowExcelExport` is set to true, then it will allow the user to export pivotview to Excel file.
     * @default false    
     */
    allowExcelExport?: boolean;

    /**
     * If `enableVirtualization` set to true, then the Grid will render only the rows and the columns visible within the view-port
     * and load subsequent rows and columns on vertical scrolling. This helps to load large dataset in Pivot Grid.
     * @default false
     */
    enableVirtualization?: boolean;

    /**
     * If `allowDrillThrough` set to true, then you can view the raw items that are used to create a 
     * specified value cell in the pivot grid.
     * @default false
     */
    allowDrillThrough?: boolean;

    /**
     * If `allowPdfExport` is set to true, then it will allow the user to export pivotview to Pdf file.
     * @default false    
     */
    allowPdfExport?: boolean;

    /**
     * If `allowDeferLayoutUpdate` is set to true, then it will enable defer layout update to pivotview.
     * @default false
     */
    allowDeferLayoutUpdate?: boolean;

    /**
     * It allows to set the maximum number of nodes to be displayed in the member editor.
     * @default 1000    
     */
    maxNodeLimitInMemberEditor?: number;

    /**
    queryCellInfo?: EmitType<QueryCellInfoEventArgs>;

    /**
    headerCellInfo?: EmitType<HeaderCellInfoEventArgs>;

    /**
    resizing?: EmitType<ResizeArgs>;

    /**
    resizeStop?: EmitType<ResizeArgs>;

    /**
    pdfHeaderQueryCellInfo?: EmitType<PdfHeaderQueryCellInfoEventArgs>;

    /**
    pdfQueryCellInfo?: EmitType<PdfQueryCellInfoEventArgs>;

    /**
    excelHeaderQueryCellInfo?: EmitType<ExcelHeaderQueryCellInfoEventArgs>;

    /**
    excelQueryCellInfo?: EmitType<ExcelQueryCellInfoEventArgs>;

    /**
    columnDragStart?: EmitType<ColumnDragEventArgs>;

    /**
    columnDrag?: EmitType<ColumnDragEventArgs>;

    /**
    columnDrop?: EmitType<ColumnDragEventArgs>;

    /**
    beforeColumnsRender?: EmitType<BeforeColumnRenderEventArgs>;

    /**
    selected?: EmitType<CellSelectEventArgs>;

    /**
    cellDeselected?: EmitType<CellDeselectEventArgs>;

    /**
    rowSelected?: EmitType<RowSelectEventArgs>;

    /**
    rowDeselected?: EmitType<RowDeselectEventArgs>;

    /**
     * This allows any customization of PivotView properties on initial rendering.
     * @event
     */
    load?: EmitType<LoadEventArgs>;

    /**
     * Triggers before the pivot engine starts to populate and allows to customize the pivot datasource settings. 
     * @event
     */
    enginePopulating?: EmitType<EnginePopulatingEventArgs>;

    /**
     * Triggers after the pivot engine populated and allows to customize the pivot widget.
     * @event
     */
    enginePopulated?: EmitType<EnginePopulatedEventArgs>;

    /**
     * Triggers when a field getting dropped into any axis.
     * @event
     */
    onFieldDropped?: EmitType<FieldDroppedEventArgs>;

    /**
     * Triggers when data source is populated in the Pivot View.
     * @event
     */
    dataBound?: EmitType<Object>;

    /**
     * Triggers when data source is created in the Pivot View.
     * @event 
     */
    created?: EmitType<Object>;

    /**
     * Triggers when data source is destroyed in the Pivot View.
     * @event 
     */
    destroyed?: EmitType<Object>;

    /**
     * This allows to set properties for exporting.
     * @event 
     */
    beforeExport?: EmitType<BeforeExportEventArgs>;

    /**
     * Triggers when cell is clicked in the Pivot widget.
     * @event 
     */
    cellClick?: EmitType<CellClickEventArgs>;

    /**
     * Triggers when value cell is clicked in the Pivot widget on Drill-Through.
     * @event 
     */
    drillThrough?: EmitType<DrillThroughEventArgs>;

    /**
     * Triggers when hyperlink cell is clicked in the Pivot widget.
     * @event 
     */
    hyperlinkCellClick?: EmitType<HyperCellClickEventArgs>;

    /**
     * Triggers when cell got selected in Pivot widget.
     * @event 
     */
    cellSelected?: EmitType<PivotCellSelectedEventArgs>;

}