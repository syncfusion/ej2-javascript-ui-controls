import { Property, Browser, Event, Component, ModuleDeclaration, createElement, setStyleAttribute } from '@syncfusion/ej2-base';import { EmitType, EventHandler, Complex, extend, ChildProperty } from '@syncfusion/ej2-base';import { Internationalization, L10n, NotifyPropertyChanges, INotifyPropertyChanged } from '@syncfusion/ej2-base';import { removeClass, addClass } from '@syncfusion/ej2-base';import { PivotEngine, IPivotValues, IAxisSet, IDataOptions, IDataSet, IPageSettings } from '../../base/engine';import { IConditionalFormatSettings } from '../../base/engine';import { Tooltip, TooltipEventArgs, createSpinner, showSpinner, hideSpinner } from '@syncfusion/ej2-popups';import * as events from '../../common/base/constant';import * as cls from '../../common/base/css-constant';import { AxisFields } from '../../common/grouping-bar/axis-field-renderer';import { LoadEventArgs, BeforeExportEventArgs, EnginePopulatingEventArgs } from '../../common/base/interface';import { EnginePopulatedEventArgs, ResizeInfo, ScrollInfo } from '../../common/base/interface';import { CellClickEventArgs, FieldDroppedEventArgs } from '../../common/base/interface';import { Render } from '../renderer/render';import { PivotCommon } from '../../common/base/pivot-common';import { Common } from '../../common/actions/common';import { GroupingBar } from '../../common/grouping-bar/grouping-bar';import { DataSourceModel, DrillOptionsModel } from '../model/dataSource-model';import { DataSource } from '../model/dataSource';import { GridSettings } from '../model/gridsettings';import { GridSettingsModel } from '../model/gridsettings-model';import { PivotButton } from '../../common/actions/pivot-button';import { PivotFieldList } from '../../pivotfieldlist/base/field-list';import { Grid, Column, QueryCellInfoEventArgs, HeaderCellInfoEventArgs, ResizeArgs } from '@syncfusion/ej2-grids';import { PdfExportProperties, ExcelExportProperties, ExcelQueryCellInfoEventArgs, ColumnDragEventArgs } from '@syncfusion/ej2-grids';import { ExcelHeaderQueryCellInfoEventArgs, PdfQueryCellInfoEventArgs, PdfHeaderQueryCellInfoEventArgs } from '@syncfusion/ej2-grids';import { ExcelExport } from '../actions/excel-export';import { PDFExport } from '../actions/pdf-export';import { CalculatedField } from '../../common/calculatedfield/calculated-field';import { KeyboardInteraction } from '../actions/keyboard';import { PivotContextMenu } from '../../common/popups/context-menu';import { DataManager, ReturnOption, Query } from '@syncfusion/ej2-data';import { ConditionalFormatting } from '../../common/conditionalformatting/conditional-formatting';import { cssClass } from '@syncfusion/ej2-lists';import { VirtualScroll } from '../actions/virtualscroll';
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
     * It allows the user to configure the pivot report as per the user need.
     */
    dataSource?: DataSourceModel;

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
     * If `allowPdfExport` is set to true, then it will allow the user to export pivotview to Pdf file.
     * @default false    
     */
    allowPdfExport?: boolean;

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

}