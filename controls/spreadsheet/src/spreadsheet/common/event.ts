/**
 * Specifies spreadsheet internal events
 */
/** @hidden */
export const ribbon: string = 'ribbon';
/** @hidden */
export const formulaBar: string = 'formulaBar';
/** @hidden */
export const sheetTabs: string = 'sheetTabs';
/** @hidden */
export const refreshSheetTabs: string = 'refreshSheetTabs';
/** @hidden */
export const isFormulaBarEdit: string = 'isFormulaBarEdit';
/** @hidden */
export const contentLoaded: string = 'contentLoaded';
/** @hidden */
export const mouseDown: string = 'mouseDown';
/** @hidden */
export const spreadsheetDestroyed: string = 'spreadsheetDestroyed';
/** @hidden */
export const editOperation: string = 'editOperation';
/** @hidden */
export const formulaOperation: string = 'formulaOperation';
/** @hidden */
export const formulaBarOperation: string = 'formulaBarOperation';
/** @hidden */
export const click: string = 'click';
/** @hidden */
export const keyUp: string = 'keyUp';
/** @hidden */
export const keyDown: string = 'keyDown';
/** @hidden */
export const formulaKeyUp: string = 'formulaKeyUp';
/** @hidden */
export const formulaBarUpdate: string = 'formulaBarUpdate';
/** @hidden */
export const onVerticalScroll: string = 'verticalScroll';
/** @hidden */
export const onHorizontalScroll: string = 'horizontalScroll';
/** @hidden */
export const beforeContentLoaded: string = 'beforeContentLoaded';
/** @hidden */
export const beforeVirtualContentLoaded: string = 'beforeVirtualContentLoaded';
/** @hidden */
export const virtualContentLoaded: string = 'virtualContentLoaded';
/** @hidden */
export const contextMenuOpen: string = 'contextMenuOpen';
/** @hidden */
export const cellNavigate: string = 'cellNavigate';
/** @hidden */
export const mouseUpAfterSelection: string = 'mouseUpAfterSelection';
/** @hidden */
export const cMenuBeforeOpen: string = 'contextmenuBeforeOpen';
/** @hidden */
export const insertSheetTab: string = 'insertSheetTab';
/** @hidden */
export const removeSheetTab: string = 'removeSheetTab';
/** @hidden */
export const renameSheetTab: string = 'renameSheetTab';
/** @hidden */
export const ribbonClick: string = 'ribboClick';
/** @hidden */
export const refreshRibbon: string = 'ribbonRefresh';
/** @hidden */
export const enableToolbarItems: string = 'enableToolbarItems';
/** @hidden */
export const tabSwitch: string = 'tabSwitch';
/** @hidden */
export const selectRange: string = 'selectRange';
/** @hidden */
export const rangeSelectionByKeydown: string = 'rangeSelectionByKeydown';
/** @hidden */
export const cut: string = 'cut';
/** @hidden */
export const copy: string = 'copy';
/** @hidden */
export const paste: string = 'paste';
/** @hidden */
export const clearCopy: string = 'clearCopy';
/** @hidden */
export const dataBound: string = 'dataBound';
/** @hidden */
export const beforeDataBound: string = 'beforeDataBound';
/** @hidden */
export const addContextMenuItems: string = 'addContextMenuItems';
/** @hidden */
export const removeContextMenuItems: string = 'removeContextMenuItems';
/** @hidden */
export const enableContextMenuItems: string = 'enableContextMenuItems';
/** @hidden */
export const enableFileMenuItems: string = 'enableFileMenuItems';
/** @hidden */
export const hideFileMenuItems: string = 'hideFileMenuItems';
/** @hidden */
export const addFileMenuItems: string = 'addFileMenuItems';
/** @hidden */
export const hideRibbonTabs: string = 'hideRibbonTabs';
/** @hidden */
export const enableRibbonTabs: string = 'enableRibbonTabs';
/** @hidden */
export const addRibbonTabs: string = 'addRibbonTabs';
/** @hidden */
export const addToolbarItems: string = 'addToolbarItems';
/** @hidden */
export const hideToolbarItems: string = 'hideToolbarItems';
/** @hidden */
export const beforeRibbonCreate: string = 'beforeRibbonCreate';
/** @hidden */
export const rowHeightChanged: string = 'rowHeightChanged';
/** @hidden */
export const colWidthChanged: string = 'colWidthChanged';
/** @hidden */
export const onContentScroll: string = 'onContentScroll';
/** @hidden */
export const deInitProperties: string = 'deInitProperties';
/** @hidden */
export const activeSheetChanged: string = 'activeSheetChanged';
/** @hidden */
export const initiateCustomSort: string = 'initiateCustomSort';
/** @hidden */
export const applySort: string = 'applySort';
/** @hidden */
export const collaborativeUpdate: string = 'collaborativeUpdate';
/** @hidden */
export const autoFit: string = 'autoFitRowsColumns';
/** @hidden */
export const refreshFilterCellsOnResize: string = 'refreshFilterCellsOnResize';
/** @hidden */
export const updateToggleItem: string = 'updateToggleItem';
/** @hidden */
export const initiateHyperlink: string = 'initiateHyperlink';
/** @hidden */
export const editHyperlink: string = 'editHyperlink';
/** @hidden */
export const openHyperlink: string = 'openHyperlink';
/** @hidden */
export const addNote: string = 'addNote';
/** @hidden */
export const editNote: string = 'editNote';
/** @hidden */
export const deleteNote: string = 'deleteNote';
/** @hidden */
export const showNote: string = 'showNote';
/** @hidden */
export const createNoteIndicator: string = 'createNoteIndicator';
/** @hidden */
export const updateNoteContainer: string = 'updateNoteContainer';
/** @hidden */
export const removeNoteContainer: string = 'removeNoteContainer';
/** @hidden */
export const removeHyperlink: string = 'removeHyperlink';
/** @hidden */
export const createHyperlinkElement: string = 'createHyperlinkElement';
/** @hidden */
export const sheetNameUpdate: string = 'sheetNameUpdate';
/** @hidden */
export const hideSheet: string = 'hideSheet';
/** @hidden */
export const performUndoRedo: string = 'performUndoRedo';
/** @hidden */
export const updateUndoRedoCollection: string = 'updateUndoRedoCollection';
/** @hidden */
export const setActionData: string = 'setActionData';
/** @hidden */
export const getBeforeActionData: string = 'getBeforeActionData';
/** @hidden */
export const clearUndoRedoCollection: string = 'clearUndoRedoCollection';
/** @hidden */
export const initiateFilterUI: string = 'initiateFilterUI';
/** @hidden */
export const renderFilterCell: string = 'renderFilterCell';
/** @hidden */
export const refreshFilterRange: string = 'refreshFilterRange';
/** @hidden */
export const updateSortCollection: string = 'updateSortCollection';
/** @hidden */
export const reapplyFilter: string = 'reapplyFilter';
/** @hidden */
export const filterByCellValue: string = 'filterByCellValue';
/** @hidden */
export const clearFilter: string = 'clearFilter';
/** @hidden */
export const getFilteredColumn: string = 'getFilteredColumn';
/** @hidden */
export const completeAction: string = 'actionComplete';
/** @hidden */
export const filterCellKeyDown: string = 'filterCellKeyDown';
/** @hidden */
export const getFilterRange: string = 'getFilterRange';
/** @hidden */
export const setAutoFit: string = 'setAutoFit';
/** @hidden */
export const refreshFormulaDatasource: string = 'refreshFormulaDatasource';
/** @hidden */
export const initiateDataValidation: string = 'initiatedatavalidation';
/** @hidden */
export const validationError: string = 'validationError';
/** @hidden */
export const startEdit: string = 'startEdit';
/** @hidden */
export const invalidData: string = 'invalidData';
/** @hidden */
export const clearInvalid: string = 'clearInvalid';
/** @hidden */
export const protectSheet: string = 'protectSheet';
/** @hidden */
export const applyProtect: string = 'applyProtect';
/** @hidden */
export const unprotectSheet: string = 'unprotectSheet';
/** @hidden */
export const protectCellFormat: string = 'protectCellFormat';
/** @hidden */
export const gotoDlg: string = 'renderGotoDlgt';
/** @hidden */
export const findDlg: string = 'renderFindDlg';
/** @hidden */
export const findHandler: string = 'findHandler';
/** @hidden */
export const created: string = 'created';
/** @hidden */
export const spreadsheetCreated: string = 'spreadsheetCreated';
/** @hidden */
export const editAlert: string = 'editAlert';
/** @hidden */
export const readonlyAlert: string = 'readonlyAlert';
/** @hidden */
export const setUndoRedo: string = 'setUndoRedo';
/** @hidden */
export const enableFormulaInput: string = 'enableFormulaInput';
/** @hidden */
export const protectSelection: string = 'protectSelection';
/** @hidden */
export const hiddenMerge: string = 'hiddenMerge';
/** @hidden */
export const checkPrevMerge: string = 'checkPrevMerge';
/** @hidden */
export const checkMerge: string = 'checkMerge';
/** @hidden */
export const removeDataValidation: string = 'removeDataValidation';
/** @hidden */
export const showAggregate: string = 'showAggregate';
/** @hidden */
export const goToSheet: string = 'goToSheet';
/** @hidden */
export const showSheet: string = 'showSheet';
/** @hidden */
export const renderCFDlg: string = 'renderCFDlg';
/** @hidden */
export const clearViewer: string = 'clearViewer';
/** @hidden */
export const initiateFormulaReference: string = 'initiateFormulaReference';
/** @hidden */
export const initiateCur: string = 'initiateCur';
/** @hidden */
export const clearCellRef: string = 'clearCellRef';
/** @hidden */
export const editValue: string = 'editValue';
/** @hidden */
export const addressHandle: string = 'addressHandle';
/** @hidden */
export const initiateEdit: string = 'initiateEdit';
/** @hidden */
export const forRefSelRender: string = 'forRefSelRender';
/** @hidden */
export const insertImage: string = 'insertImage';
/** @hidden */
export const refreshOverlayElem: string = 'refreshOverlayElem';
/** @hidden */
export const refreshImgCellObj: string = 'refreshImgCellObj';
/** @hidden */
export const getRowIdxFromClientY: string = 'getRowIdxFromClientY';
/** @hidden */
export const getColIdxFromClientX: string = 'getColIdxFromClientX';
/** @hidden */
export const createImageElement: string = 'createImageElement';
/** @hidden */
export const deleteImage: string = 'deleteImage';
/** @hidden */
export const deleteChart: string = 'deleteChart';
/** @hidden */
export const refreshChartCellObj: string = 'refreshChartCellObj';
/** @hidden */
export const refreshChartCellModel: string = 'refreshChartCellModel';
/** @hidden */
export const refreshImagePosition: string = 'refreshImagePosition';
/** @hidden */
export const updateTableWidth: string = 'updateTableWidth';
/** @hidden */
export const focusBorder: string = 'focusBorder';
/** @hidden */
export const clearChartBorder: string = 'clearChartBorder';
/** @hidden */
export const insertChart: string = 'insertChart';
/** @hidden */
export const chartRangeSelection: string = 'chartRangeSelection';
/** @hidden */
export const insertDesignChart: string = 'insertDesignChart';
/** @hidden */
export const removeDesignChart: string = 'removeDesignChart';
/** @hidden */
export const chartDesignTab: string = 'chartDesignTab';
/** @hidden */
export const addChartEle: string = 'addChartEle';
/** @hidden */
export const undoRedoForChartDesign: string = 'undoRedoForChartDesign';
/** @hidden */
export const protectWorkbook: string = 'protectWorkbook';
/** @hidden */
export const unProtectWorkbook: string = 'unProtectWorkbook';
/** @hidden */
export const getPassWord: string = 'getPassWord';
/** @hidden */
export const setProtectWorkbook: string = 'setProtectWorkbook';
/** @hidden */
export const removeWorkbookProtection: string = 'removeWorkbookProtection';
/** @hidden */
export const importProtectWorkbook: string = 'importProtectWorkbook';
/** @hidden */
export const selectionStatus: string = 'selectionStatus';
/** @hidden */
export const freeze: string = 'freeze';
/** @hidden */
export const overlayEleSize: string = 'overlayEleSize';
/** @hidden */
export const updateScroll: string = 'updateScroll';
/** @hidden */
export const positionAutoFillElement: string = 'positionAutoFillElement';
/** @hidden */
export const hideAutoFillOptions: string = 'hideAutoFillOptions';
/** @hidden */
export const performAutoFill: string = 'performAutoFill';
/** @hidden */
export const selectAutoFillRange: string = 'selectAutoFillRange';
/** @hidden */
export const autoFill: string = 'autoFill';
/** @hidden */
export const hideAutoFillElement: string = 'hideAutoFillElement';
/** @hidden */
export const unProtectSheetPassword: string = 'unProtectSheetPassword';
/** @hidden */
export const updateTranslate: string = 'updateTranslate';
/** @hidden */
export const getUpdatedScrollPosition: string = 'getUpdatedScrollPosition';
/** @hidden */
export const updateScrollValue: string = 'updateScrollValue';
/** @hidden */
export const beforeCheckboxRender: string = 'beforeCheckboxfilterRenderer';
/** @hidden */
export const refreshCheckbox: string = 'refreshCheckbox';
/** @hidden */
export const renderInsertDlg: string = 'renderInsertDlg';
/** @hidden */
export const toggleProtect: string = 'toggleProtect';
/** @hidden */
export const propertyChange: string = 'propertyChange';
