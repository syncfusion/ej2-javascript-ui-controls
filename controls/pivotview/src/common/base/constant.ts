/**
 * Specifies pivot external events
 *
 * @hidden
 */

/** @hidden */
export const load: string = 'load';
/** @hidden */
export const enginePopulating: string = 'enginePopulating';
/** @hidden */
export const enginePopulated: string = 'enginePopulated';
/** @hidden */
export const onFieldDropped: string = 'onFieldDropped';
/** @hidden */
export const fieldDrop: string = 'fieldDrop';
/** @hidden */
export const beforePivotTableRender: string = 'beforePivotTableRender';
/** @hidden */
export const afterPivotTableRender: string = 'afterPivotTableRender';
/** @hidden */
export const beforeExport: string = 'beforeExport';
/** @hidden */
export const exportComplete: string = 'exportComplete';
/** @hidden */
export const excelHeaderQueryCellInfo: string = 'excelHeaderQueryCellInfo';
/** @hidden */
export const pdfHeaderQueryCellInfo: string = 'pdfHeaderQueryCellInfo';
/** @hidden */
export const excelQueryCellInfo: string = 'excelQueryCellInfo';
/** @hidden */
export const pdfQueryCellInfo: string = 'pdfQueryCellInfo';
/** @hidden */
export const onPdfCellRender: string = 'onPdfCellRender';
/** @hidden */
export const dataBound: string = 'dataBound';
/** @hidden */
export const queryCellInfo: string = 'queryCellInfo';
/** @hidden */
export const headerCellInfo: string = 'headerCellInfo';
/** @hidden */
export const hyperlinkCellClick: string = 'hyperlinkCellClick';
/** @hidden */
export const resizing: string = 'resizing';
/** @hidden */
export const resizeStop: string = 'resizeStop';
/** @hidden */
export const cellClick: string = 'cellClick';
/** @hidden */
export const drillThrough: string = 'drillThrough';
/** @hidden */
export const beforeColumnsRender: string = 'beforeColumnsRender';
/** @hidden */
export const selected: string = 'selected';
/** @hidden */
export const cellSelecting: string = 'cellSelecting';
/** @hidden */
export const drill: string = 'drill';
/** @hidden */
export const cellSelected: string = 'cellSelected';
/** @hidden */
export const cellDeselected: string = 'cellDeselected';
/** @hidden */
export const rowSelected: string = 'rowSelected';
/** @hidden */
export const rowDeselected: string = 'rowDeselected';
/** @hidden */
export const beginDrillThrough: string = 'beginDrillThrough';
/** @hidden */
export const editCompleted: string = 'editCompleted';
/** @hidden */
export const multiLevelLabelClick: string = 'multiLevelLabelClick';
/** @hidden */
export const saveReport: string = 'saveReport';
/** @hidden */
export const fetchReport: string = 'fetchReport';
/** @hidden */
export const loadReport: string = 'loadReport';
/** @hidden */
export const renameReport: string = 'renameReport';
/** @hidden */
export const removeReport: string = 'removeReport';
/** @hidden */
export const newReport: string = 'newReport';
/** @hidden */
export const toolbarRender: string = 'toolbarRender';
/** @hidden */
export const toolbarClick: string = 'toolbarClick';
/** @hidden */
export const chartTooltipRender: string = 'chartTooltipRender';
/** @hidden */
export const chartLegendClick: string = 'chartLegendClick';
/** @hidden */
export const chartLoaded: string = 'chartLoaded';
/** @hidden */
export const multiLevelLabelRender: string = 'multiLevelLabelRender';
/** @hidden */
export const beforePrint: string = 'beforePrint';
/** @hidden */
export const animationComplete: string = 'animationComplete';
/** @hidden */
export const legendRender: string = 'legendRender';
/** @hidden */
export const textRender: string = 'textRender';
/** @hidden */
export const pointRender: string = 'pointRender';
/** @hidden */
export const seriesRender: string = 'seriesRender';
/** @hidden */
export const chartMouseMove: string = 'chartMouseMove';
/** @hidden */
export const chartMouseClick: string = 'chartMouseClick';
/** @hidden */
export const pointMove: string = 'pointMove';
/** @hidden */
export const chartMouseLeave: string = 'chartMouseLeave';
/** @hidden */
export const chartMouseDown: string = 'chartMouseDown';
/** @hidden */
export const chartMouseUp: string = 'chartMouseUp';
/** @hidden */
export const dragComplete: string = 'dragComplete';
/** @hidden */
export const zoomComplete: string = 'zoomComplete';
/** @hidden */
export const scrollStart: string = 'scrollStart';
/** @hidden */
export const scrollEnd: string = 'scrollEnd';
/** @hidden */
export const scrollChanged: string = 'scrollChanged';
/** @hidden */
export const chartLoad: string = 'chartLoad';
/** @hidden */
export const chartResized: string = 'chartResized';
/** @hidden */
export const chartAxisLabelRender: string = 'chartAxisLabelRender';
/** @hidden */
export const chartSeriesCreated: string = 'chartSeriesCreated';
/** @hidden */
export const aggregateCellInfo: string = 'aggregateCellInfo';
/** @hidden */
export const onHeadersSort: string = 'onHeadersSort';
/** @hidden */
export const contextMenuClick: string = 'contextMenuClick';
/** @hidden */
export const contextMenuOpen: string = 'contextMenuOpen';
/** @hidden */
export const fieldListRefreshed: string = 'fieldListRefreshed';
/** @hidden */
export const conditionalFormatting: string = 'conditionalFormatting';
/** @hidden */
export const beforePdfExport: string = 'beforePdfExport';
/** @hidden */
export const beforeExcelExport: string = 'beforeExcelExport';
/** @hidden */
export const memberFiltering: string = 'memberFiltering';
/** @hidden */
export const calculatedFieldCreate: string = 'calculatedFieldCreate';
/** @hidden */
export const memberEditorOpen: string = 'memberEditorOpen';
/** @hidden */
export const fieldRemove: string = 'fieldRemove';
/** @hidden */
export const numberFormatting: string = 'numberFormatting';
/** @hidden */
export const aggregateMenuOpen: string = 'aggregateMenuOpen';
/** @hidden */
export const fieldDragStart: string = 'fieldDragStart';
/** @hidden */
export const chartPointClick: string = 'chartPointClick';
/** @hidden */
export const beforeServiceInvoke: string = 'beforeServiceInvoke';
/** @hidden */
export const afterServiceInvoke: string = 'afterServiceInvoke';
/** @hidden */
export const actionBegin: string = 'actionBegin';
/** @hidden */
export const actionComplete: string = 'actionComplete';
/** @hidden */
export const actionFailure: string = 'actionFailure';

/**
 * Specifies pivot internal events
 */

/** @hidden */
export const initialLoad: string = 'initial-load';
/** @hidden */
export const uiUpdate: string = 'ui-update';
/** @hidden */
export const scroll: string = 'scroll';
/** @hidden */
export const verticalScroll: string = 'vertical-scroll';
/** @hidden */
export const horizontalScroll: string = 'horizontal-scroll';
/** @hidden */
export const contentReady: string = 'content-ready';
/** @hidden */
export const dataReady: string = 'data-ready';
/** @hidden */
export const initSubComponent: string = 'init-groupingbar';
/** @hidden */
export const treeViewUpdate: string = 'tree-view-update';
/** @hidden */
export const pivotButtonUpdate: string = 'pivot-button-update';
/** @hidden */
export const initCalculatedField: string = 'init-calculatedfield';
/** @hidden */
export const click: string = 'click';
/** @hidden */
export const initToolbar: string = 'init-toolbar';
/** @hidden */
export const initPivotPager: string = 'init-pivotPager';
/** @hidden */
export const initFormatting: string = 'init-formatting';
/** @hidden */
export const initGrouping: string = 'init-grouping';

/**
 * Specifies action names of actionBegin events
 */

/** @hidden */
export const sortValue: string = 'Sort value';
/** @hidden */
export const drillUp: string = 'Drill up';
/** @hidden */
export const drillDown: string = 'Drill down';
/** @hidden */
export const addNewReport: string = 'Add new report';
/** @hidden */
export const saveCurrentReport: string = 'Save current report';
/** @hidden */
export const saveAsCurrentReport: string = 'Save as current report';
/** @hidden */
export const renameCurrentReport: string = 'Rename current report';
/** @hidden */
export const removeCurrentReport: string = 'Remove current report';
/** @hidden */
export const loadReports: string = 'Load report';
/** @hidden */
export const openConditionalFormatting: string = 'Open conditional formatting dialog';
/** @hidden */
export const openNumberFormatting: string = 'Open number formatting dialog';
/** @hidden */
export const MdxQuery: string = 'MdxQuery';
/** @hidden */
export const showFieldList: string = 'Open field list';
/** @hidden */
export const tableView: string = 'Show table view';
/** @hidden */
export const chartView: string = 'Show chart view';
/** @hidden */
export const multipleAxis: string = 'Multiple Axis';
/** @hidden */
export const showLegend: string = 'Show legend';
/** @hidden */
export const pdfExport: string = 'PDF export';
/** @hidden */
export const pngExport: string = 'PNG export';
/** @hidden */
export const excelExport: string = 'Excel export';
/** @hidden */
export const csvExport: string = 'CSV export';
/** @hidden */
export const jpegExport: string = 'JPEG export';
/** @hidden */
export const svgExport: string = 'SVG export';
/** @hidden */
export const hideSubTotals: string = 'Hide sub-totals';
/** @hidden */
export const subTotalsRow: string = 'Show row sub-totals';
/** @hidden */
export const subTotalsColumn: string = 'Show column sub-totals';
/** @hidden */
export const showSubTotals: string = 'Show sub-totals';
/** @hidden */
export const hideGrandTotals: string = 'Hide grand totals';
/** @hidden */
export const grandTotalsRow: string = 'Show row grand totals';
/** @hidden */
export const grandTotalsColumn: string = 'Show column grand totals';
/** @hidden */
export const showGrandTotals: string = 'Show grand totals';
/** @hidden */
export const numberFormattingMenu: string = 'Number Formatting menu';
/** @hidden */
export const conditionalFormattingMenu: string = 'Conditional Formatting menu';
/** @hidden */
export const reportChange: string = 'Report change';
/** @hidden */
export const sortFieldTree: string = 'Sort field tree';
/** @hidden */
export const editCalculatedField: string = 'Edit calculated field';
/** @hidden */
export const sortField: string = 'Sort field';
/** @hidden */
export const filterField: string = 'Filter field';
/** @hidden */
export const removeField: string = 'Remove field';
/** @hidden */
export const openCalculatedField: string = 'Open calculated field dialog';
/** @hidden */
export const editRecord: string = 'Edit record';
/** @hidden */
export const saveEditedRecords: string = 'Save edited records';
/** @hidden */
export const addNewRecord: string = 'Add new record';
/** @hidden */
export const removeRecord: string = 'Remove record';
/** @hidden */
export const aggregateField: string = 'Aggregate field';
/** @hidden */
export const contextMenuCalculatedField: string = 'CalculatedField Context menu';
/** @hidden */
export const windowResize: string = 'Window resize';
/** @hidden */
export const rowPageNavigation: string = 'Navigate row page';
/** @hidden */
export const columnPageNavigation: string = 'Navigate column page';

/**
 * Specifies action names of actionComplete events
 */

/** @hidden */
export const calculatedFieldApplied: string = 'Calculated field applied';
/** @hidden */
export const editedRecordsSaved: string = 'Edited records saved';
/** @hidden */
export const newRecordAdded: string = 'New record added';
/** @hidden */
export const recordRemoved: string = 'Record removed';
/** @hidden */
export const closeFieldlist: string = 'Field list closed';
/** @hidden */
export const fieldTreeSorted: string = 'Field tree sorted';
/** @hidden */
export const reportSaved: string = 'Report saved';
/** @hidden */
export const newReportAdded: string = 'New report added';
/** @hidden */
export const reportReSaved: string = 'Report re-saved';
/** @hidden */
export const reportRenamed: string = 'Report renamed';
/** @hidden */
export const reportRemoved: string = 'Report removed';
/** @hidden */
export const excelExported: string = 'Excel exported';
/** @hidden */
export const csvExported: string = 'CSV exported';
/** @hidden */
export const pdfExported: string = 'PDF exported';
/** @hidden */
export const pngExported: string = 'PNG exported';
/** @hidden */
export const jpegExported: string = 'JPEG exported';
/** @hidden */
export const svgExported: string = 'SVG exported';
/** @hidden */
export const conditionallyFormatted: string = 'Conditional formatting applied';
/** @hidden */
export const numberFormatted: string = 'Number formatting applied';
/** @hidden */
export const tableViewed: string = 'Table view shown';
/** @hidden */
export const chartViewed: string = 'Chart view shown';
/** @hidden */
export const subTotalsHidden: string = 'Sub-totals hidden';
/** @hidden */
export const subTotalsRowShown: string = 'Row sub-totals shown';
/** @hidden */
export const subTotalsColumnShown: string = 'Column sub-totals shown';
/** @hidden */
export const subTotalsShown: string = 'Sub-totals shown';
/** @hidden */
export const grandTotalsHidden: string = 'Grand totals hidden';
/** @hidden */
export const grandTotalsRowShown: string = 'Row grand totals shown';
/** @hidden */
export const grandTotalsColumnShown: string = 'Column grand totals shown';
/** @hidden */
export const grandTotalsShown: string = 'Grand totals shown';
/** @hidden */
export const valueSorted: string = 'Value sorted';
/** @hidden */
export const calculatedFieldEdited: string = 'Calculated field edited';
/** @hidden */
export const fieldSorted: string = 'Field sorted';
/** @hidden */
export const fieldFiltered: string = 'Field filtered';
/** @hidden */
export const fieldRemoved: string = 'Field removed';
/** @hidden */
export const fieldAggregated: string = 'Field aggregated';
/** @hidden */
export const recordEdited: string = 'Record edited';
/** @hidden */
export const reportChanged: string = 'Report changed';
/** @hidden */
export const windowResized: string = 'Window resized';
/** @hidden */
export const recordUpdated: string = 'Records updated';
/** @hidden */
export const drillThroughClosed: string = 'Drill-through closed';
/** @hidden */
export const verticalScrolled: string = 'Vertically scrolled';
/** @hidden */
export const horizontalScrolled: string = 'Horizontally scrolled';
/** @hidden */
export const rowPageNavigated: string = 'Row page navigated';
/** @hidden */
export const columnPageNavigated: string = 'Column page navigated';
/** @hidden */
export const actionDropped: string = 'Action dropped';
