/**
 * Specifies Workbook internal events.
 */
/** @hidden */
export const workbookDestroyed: string = 'workbookDestroyed';
/** @hidden */
export const updateSheetFromDataSource: string = 'updateSheetFromDataSource';
/** @hidden */
export const dataSourceChanged: string = 'dataSourceChanged';
/** @hidden */
export const dataChanged: string = 'dataChanged';
/** @hidden */
export const triggerDataChange: string = 'triggerDataChange';
/** @hidden */
export const workbookOpen: string = 'workbookOpen';
/** @hidden */
export const beginSave: string = 'beginSave';
/** @hidden */
export const sortImport: string = 'sortImport';
/** @hidden */
export const ribbonFind: string = 'ribbonFind';
/** @hidden */
export const getFilteredCollection: string = 'getFilteredCollection';
/** @hidden */
export const saveCompleted: string = 'saveCompleted';
/** @hidden */
export const applyNumberFormatting: string = 'applyNumber';
/** @hidden */
export const getFormattedCellObject: string = 'getFormattedCell';
/** @hidden */
export const refreshCellElement: string = 'refreshCellElem';
/** @hidden */
export const setCellFormat: string = 'setCellFormat';
/** @hidden */
export const findAllValues: string = 'findAllValues';
/** @hidden */
export const textDecorationUpdate: string = 'textDecorationUpdate';
/** @hidden */
export const applyCellFormat: string = 'applyCellFormat';
/** @hidden */
export const updateUsedRange: string = 'updateUsedRange';
/** @hidden */
export const workbookFormulaOperation: string = 'workbookFormulaOperation';
/** @hidden */
export const workbookEditOperation: string = 'workbookEditOperation';
/** @hidden */
export const checkDateFormat: string = 'checkDateFormat';
/** @hidden */
export const getFormattedBarText: string = 'getFormattedBarText';
/** @hidden */
export const activeCellChanged: string = 'activeCellChanged';
/** @hidden */
export const openSuccess: string = 'openSuccess';
/** @hidden */
export const openFailure: string = 'openFailure';
/** @hidden */
export const sheetCreated: string = 'sheetCreated';
/** @hidden */
export const sheetsDestroyed: string = 'sheetsDestroyed';
/** @hidden */
export const aggregateComputation: string = 'aggregateComputation';
/** @hidden */
export const beforeSort: string = 'beforeSort';
/** @hidden */
export const initiateSort: string = 'initiateSort';
/** @hidden */
export const sortComplete: string = 'sortComplete';
/** @hidden */
export const sortRangeAlert: string = 'sortRangeAlert';
/** @hidden */
export const initiatelink: string = 'initiatelink';
/** @hidden */
export const beforeHyperlinkCreate: string = 'beforeHyperlinkCreate';
/** @hidden */
export const afterHyperlinkCreate: string = 'afterHyperlinkCreate';
/** @hidden */
export const beforeHyperlinkClick: string = 'beforeHyperlinkClick';
/** @hidden */
export const afterHyperlinkClick: string = 'afterHyperlinkClick';
/** @hidden */
export const addHyperlink: string = 'addHyperlink';
/** @hidden */
export const setLinkModel: string = 'setLinkModel';
/** @hidden */
export const beforeFilter: string = 'beforeFilter';
/** @hidden */
export const initiateFilter: string = 'initiateFilter';
/** @hidden */
export const filterComplete: string = 'filterComplete';
/** @hidden */
export const filterRangeAlert: string = 'filterRangeAlert';
/** @hidden */
export const clearAllFilter: string = 'clearAllFilter';
/** @hidden */
export const wrapEvent: string = 'wrapText';
/** @hidden */
export const onSave: string = 'onSave';
/** @hidden */
export const insert: string = 'insert';
/** @hidden */
export const deleteAction: string = 'delete';
/** @hidden */
export const insertModel: string = 'insertModel';
/** @hidden */
export const deleteModel: string = 'deleteModel';
/** @hidden */
export const isValidation: string = 'isValidation';
/** @hidden */
export const setValidation: string = 'setValidation';
/** @hidden */
export const addHighlight: string = 'addHighlight';
/** @hidden */
export const dataValidate: string = 'dataValidate';

/** @hidden */
export const findNext: string = 'findNext';
/** @hidden */
export const findPrevious: string = 'findPrevious';
/** @hidden */
export const goto: string = 'gotoHandler';
/** @hidden */
export const findWorkbookHandler: string = 'findHandler';
/** @hidden */
export const replaceHandler: string = 'replace';
/** @hidden */
export const replaceAllHandler: string = 'replaceAll';
/** @hidden */
export const showDialog: string = 'ShowDialog';
/** @hidden */
export const findUndoRedo: string = 'findUndoRedo';
/** @hidden */
export const findKeyUp: string = 'findKeyUp';
/** @hidden */
export const removeValidation: string = 'removeValidation';
/** @hidden */
export const removeHighlight: string = 'removeHighlight';
/** @hidden */
export const queryCellInfo: string = 'queryCellInfo';
/** @hidden */
export const count: string = 'count';
/** @hidden */
export const findCount: string = 'findCount';
/** @hidden */
export const protectSheetWorkBook: string = 'protectSheet';
/** @hidden */
export const updateToggle: string = 'updateToggleItem';
/** @hidden */
export const protectsheetHandler: string = 'protectsheetHandler';
/** @hidden */
export const replaceAllDialog: string = 'replaceAllDialog';
/** @hidden */
export const unprotectsheetHandler: string = 'unprotectsheetHandler';
/** @hidden */
export const workBookeditAlert: string = 'editAlert';
/** @hidden */
export const setLockCells: string = 'setLockCells';
/** @hidden */
export const applyLockCells: string = 'applyLockCells';
/** @hidden */
export const setMerge: string = 'setMerge';
/** @hidden */
export const applyMerge: string = 'applyMerge';
/** @hidden */
export const mergedRange: string = 'mergedRange';
/** @hidden */
export const activeCellMergedRange: string = 'activeCellMergedRange';
/** @hidden */
export const insertMerge: string = 'insertMerge';
/** @hidden */
export const pasteMerge: string = 'pasteMerge';
/** @hidden */
export const setCFRule: string = 'setCFRule';
/** @hidden */
export const cFInitialCheck: string = 'cFInitialCheck';
/** @hidden */
export const clearCFRule: string = 'clearCFRule';
/** @hidden */
export const initiateClearCFRule: string = 'initiateClearCFRule';
/** @hidden */
export const cFRender: string = 'cFRender';
/** @hidden */
export const cFDelete: string = 'cFDelete';
/** @hidden */
export const clear: string = 'clear';
/** @hidden */
export const clearCF: string = 'clearCF';
/** @hidden */
export const clearCells: string = 'clearCells';
/** @hidden */
export const setImage: string = 'setImage';
/** @hidden */
export const setChart: string = 'setChart';
/** @hidden */
export const initiateChart: string = 'initiateChart';
/** @hidden */
export const refreshRibbonIcons: string = 'refreshRibbonIcons';
/** @hidden */
export const refreshChart: string = 'refreshChart';
/** @hidden */
export const refreshChartSize: string = 'refreshChartSize';
/** @hidden */
export const updateChart: string = 'updateChart';
/** @hidden */
export const deleteChartColl: string = 'deleteChartColl';
/** @hidden */
export const initiateChartModel: string = 'initiateChartModel';
/** @hidden */
export const focusChartBorder: string = 'focusChartBorder';
/** @hidden */
export const saveError: string = 'saveError';
/** @hidden */
export const validationHighlight: string = 'validationHighlight';
/** @hidden */
export const dataRefresh: string = 'dataRefresh';
/** @hidden */
export const updateFilter: string = 'updateFilter';
/** @hidden */
export const beforeInsert: string = 'beforeInsert';
/** @hidden */
export const beforeDelete: string = 'beforeDelete';
/** @hidden */
export const deleteHyperlink: string = 'deleteHyperlink';
/** @hidden */
export const moveOrDuplicateSheet: string = 'moveOrDuplicateSheet';
/** @hidden */
export const cFUndo: string = 'cFUndo';
