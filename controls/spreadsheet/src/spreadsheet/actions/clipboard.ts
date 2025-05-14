import { detach, EventHandler, Browser, L10n, isNullOrUndefined, extend, isUndefined } from '@syncfusion/ej2-base';
import { ClickEventArgs } from '@syncfusion/ej2-navigations';
import { Spreadsheet } from '../base/index';
import { SheetModel, getRangeIndexes, getCell, getSheet, CellModel, getSwapRange, inRange, Workbook, isReadOnly, getRow, isReadOnlyCells, setCell, ValidationModel, checkColumnValidation, getRowHeight, getColumnWidth } from '../../workbook/index';
import { CellStyleModel, getRangeAddress, getSheetIndexFromId, getSheetName, NumberFormatArgs } from '../../workbook/index';
import { RowModel, getFormattedCellObject, workbookFormulaOperation, checkIsFormula, Sheet, mergedRange } from '../../workbook/index';
import { ExtendedSheet, Cell, setMerge, MergeArgs, getCellIndexes, ChartModel } from '../../workbook/index';
import { ribbonClick, ICellRenderer, copy, paste, PasteSpecialType, initiateFilterUI, setPosition, isLockedCells, focus, readonlyAlert, BeforeActionData } from '../common/index';
import { BeforePasteEventArgs, hasTemplate, getTextHeightWithBorder, getLines, getExcludedColumnWidth, editAlert } from '../common/index';
import { enableToolbarItems, rowHeightChanged, completeAction, DialogBeforeOpenEventArgs, insertImage } from '../common/index';
import { clearCopy, selectRange, dialog, contentLoaded, tabSwitch, cMenuBeforeOpen, createImageElement, setMaxHgt } from '../common/index';
import { getMaxHgt, setRowEleHeight, locale, deleteImage, getRowIdxFromClientY, getColIdxFromClientX, cut } from '../common/index';
import { colWidthChanged, PasteModelArgs, getFilterRange, FilterInfoArgs } from '../common/index';
import { Dialog } from '../services/index';
import { Deferred } from '@syncfusion/ej2-data';
import { BeforeOpenEventArgs } from '@syncfusion/ej2-popups';
import { refreshRibbonIcons, refreshClipboard, getColumn, isLocked as isCellLocked, FilterCollectionModel } from '../../workbook/index';
import { setFilteredCollection, setChart, parseIntValue, isSingleCell, activeCellMergedRange, getRowsHeight } from '../../workbook/index';
import { ConditionalFormatModel, getUpdatedFormula, clearCFRule, checkUniqueRange, clearFormulaDependentCells } from '../../workbook/index';
import { updateCell, ModelType, beginAction, isFilterHidden, applyCF, CFArgs, ApplyCFArgs, checkRange } from '../../workbook/index';
import { cellValidation, removeUniquecol } from '../../workbook/common/event';
import { ColumnModel } from '../../workbook/base/column-model';

/**
 * Represents clipboard support for Spreadsheet.
 */
export class Clipboard {
    private parent: Spreadsheet;
    private copiedInfo: { range: number[], sId: number, isCut: boolean };
    private copiedShapeInfo: {
        pictureElem: HTMLElement, sId: number, sheetIdx: number, isCut: boolean,
        copiedRange: string, height: number, width: number, chartInfo: ChartModel
    };
    constructor(parent: Spreadsheet) {
        this.parent = parent;
        this.init();
        this.addEventListener();
    }

    private init(): void {
        this.parent.element.appendChild(
            this.parent.createElement(
                'input', { className: 'e-clipboard', attrs: { 'contenteditable': 'true', 'tabindex': '-1', 'aria-hidden': 'true' } }));
    }

    private addEventListener(): void {
        const ele: Element = this.getClipboardEle();
        this.parent.on(cut, this.cut, this);
        this.parent.on(copy, this.copy, this);
        this.parent.on(paste, this.paste, this);
        this.parent.on(clearCopy, this.clearCopiedInfo, this);
        this.parent.on(tabSwitch, this.tabSwitchHandler, this);
        this.parent.on(cMenuBeforeOpen, this.cMenuBeforeOpenHandler, this);
        this.parent.on(ribbonClick, this.ribbonClickHandler, this);
        this.parent.on(contentLoaded, this.initCopyIndicator, this);
        this.parent.on(rowHeightChanged, this.rowHeightChanged, this);
        this.parent.on(colWidthChanged, this.colWidthChanged, this);
        this.parent.on(refreshClipboard, this.refreshOnInsertDelete, this);
        EventHandler.add(ele, 'cut', this.cut, this);
        EventHandler.add(ele, 'copy', this.copy, this);
        EventHandler.add(ele, 'paste', this.paste, this);
    }

    private removeEventListener(): void {
        const ele: Element = this.getClipboardEle();
        if (!this.parent.isDestroyed) {
            this.parent.off(cut, this.cut);
            this.parent.off(copy, this.copy);
            this.parent.off(paste, this.paste);
            this.parent.off(clearCopy, this.clearCopiedInfo);
            this.parent.off(tabSwitch, this.tabSwitchHandler);
            this.parent.off(cMenuBeforeOpen, this.cMenuBeforeOpenHandler);
            this.parent.off(ribbonClick, this.ribbonClickHandler);
            this.parent.off(contentLoaded, this.initCopyIndicator);
            this.parent.off(rowHeightChanged, this.rowHeightChanged);
            this.parent.off(colWidthChanged, this.colWidthChanged);
            this.parent.off(refreshClipboard, this.refreshOnInsertDelete);
        }
        EventHandler.remove(ele, 'cut', this.cut);
        EventHandler.remove(ele, 'copy', this.copy);
        EventHandler.remove(ele, 'paste', this.paste);
    }

    private ribbonClickHandler(args: ClickEventArgs): void {
        const parentId: string = this.parent.element.id;
        switch (args.item.id) {
        case parentId + '_cut':
            this.cut(<ClipboardInfo>{ invokeCopy: true });
            break;
        case parentId + '_copy':
            this.copy(<ClipboardInfo>{ invokeCopy: true });
            break;
        }
    }

    private tabSwitchHandler(args: { activeTab: number }): void {
        if (args.activeTab === 0 && !this.copiedInfo && !this.copiedShapeInfo) { this.hidePaste(); }
    }

    private cMenuBeforeOpenHandler(e: { target: string }): void {
        const sheet: SheetModel = this.parent.getActiveSheet();
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        let delRowItems: string[] = []; let hideRowItems: string[] = [];
        let delColItems: string[] = []; let hideColItems: string[] = [];
        const actCell: string = sheet.activeCell;
        const actCellIndex: number[] = getCellIndexes(actCell);
        const cellObj: CellModel = getCell(actCellIndex[0], actCellIndex[1], sheet);
        const isLocked: boolean = sheet.isProtected && isCellLocked(cellObj, getColumn(sheet, actCellIndex[1]));
        const isReadonlyCell: boolean = isReadOnly(cellObj, getColumn(sheet, actCellIndex[1]), getRow(sheet, actCellIndex[0]));
        if (e.target === 'Content' || e.target === 'RowHeader' || e.target === 'ColumnHeader' || e.target === 'SelectAll') {
            this.parent.enableContextMenuItems(
                [l10n.getConstant('Paste'), l10n.getConstant('PasteSpecial')], (this.copiedInfo ||
                    this.copiedShapeInfo && !isLocked) ? true : false);
            this.parent.enableContextMenuItems([l10n.getConstant('Cut')], !isLocked);
        }
        if (e.target === 'Content') {
            if (sheet.isProtected) {
                this.parent.enableContextMenuItems([l10n.getConstant('Filter'), l10n.getConstant('Sort'),
                    l10n.getConstant('AddNote')], false);
            }
            if (isLocked) {
                this.parent.enableContextMenuItems([l10n.getConstant('Cut'), l10n.getConstant('Hyperlink'),
                    l10n.getConstant('EditNote'), l10n.getConstant('DeleteNote')], false);
            } else if (isReadonlyCell) {
                this.parent.enableContextMenuItems([l10n.getConstant('Cut'), l10n.getConstant('Paste'), l10n.getConstant('PasteSpecial'),
                    l10n.getConstant('Filter'), l10n.getConstant('Sort'), l10n.getConstant('Hyperlink'), l10n.getConstant('EditHyperlink'),
                    l10n.getConstant('OpenHyperlink'), l10n.getConstant('RemoveHyperlink'), l10n.getConstant('AddNote')], false);
            } else if (sheet.isProtected && !sheet.protectSettings.insertLink) {
                this.parent.enableContextMenuItems([l10n.getConstant('Hyperlink')], false);
            }
        }
        if (sheet.isProtected) {
            if (e.target === 'ColumnHeader') {
                delColItems = [l10n.getConstant('DeleteColumn'), l10n.getConstant('DeleteColumns'),
                    l10n.getConstant('InsertColumn'), l10n.getConstant('InsertColumns')];
                hideColItems = [l10n.getConstant('HideColumn'), l10n.getConstant('HideColumns'), l10n.getConstant('UnhideColumns')];
                this.parent.enableContextMenuItems(delColItems, false);
                this.parent.enableContextMenuItems(hideColItems, sheet.protectSettings.formatColumns);
            }
            if (e.target === 'RowHeader') {
                delRowItems = [l10n.getConstant('DeleteRow'), l10n.getConstant('DeleteRows'),
                    l10n.getConstant('InsertRow'), l10n.getConstant('InsertRows')];
                hideRowItems = [l10n.getConstant('HideRow'), l10n.getConstant('HideRows'), l10n.getConstant('UnhideRows')];
                this.parent.enableContextMenuItems(delRowItems, false);
                this.parent.enableContextMenuItems(hideRowItems, sheet.protectSettings.formatRows);
            }
        }
    }

    private rowHeightChanged(args: { rowIdx: number, threshold: number }): void {
        if (this.copiedInfo) {
            const ele: HTMLElement = this.getCopyIndicator();
            if (ele) {
                if (this.copiedInfo.range[0] > args.rowIdx) {
                    ele.style.top = `${parseFloat(ele.style.top) + args.threshold}px`;
                } else if (inRange(this.copiedInfo.range, args.rowIdx, this.copiedInfo.range[1])) {
                    ele.style.height = `${parseFloat(ele.style.height) + args.threshold}px`;
                }
            }
        }
    }

    private colWidthChanged(args: { colIdx: number, threshold: number }): void {
        if (this.copiedInfo) {
            const ele: HTMLElement = this.getCopyIndicator();
            if (ele) {
                if (this.copiedInfo.range[1] > args.colIdx) {
                    ele.style.left = `${parseFloat(ele.style.left) + args.threshold}px`;
                } else if (inRange(this.copiedInfo.range, this.copiedInfo.range[0], args.colIdx)) {
                    ele.style.width = `${parseFloat(ele.style.width) + args.threshold}px`;
                }
            }
        }
    }

    private cut(args?: ClipboardInfo | ClipboardEvent): void {
        this.setCopiedInfo(<ClipboardInfo & ClipboardEvent>args, true);
    }

    private copy(args?: ClipboardInfo | ClipboardEvent): void {
        this.setCopiedInfo(<ClipboardInfo & ClipboardEvent>args, false);
    }

    private paste(args?: {
        range: number[], sIdx: number, type: PasteSpecialType, isClick?: boolean,
        isAction?: boolean, isInternal?: boolean, isFromUpdateAction?: boolean, focus?: boolean, beforeActionData: BeforeActionData,
        isUndo?: boolean
    } & ClipboardEvent): void {
        if (this.parent.isEdit || this.parent.element.getElementsByClassName('e-dlg-overlay').length > 0) {
            const editEle: HTMLElement = this.parent.element.getElementsByClassName('e-spreadsheet-edit')[0] as HTMLElement;
            editEle.style.height = 'auto';
            return;
        }
        let rfshRange: number[];
        let isExternal: DataTransfer | boolean = ((args && args.clipboardData) || window['clipboardData']);
        if (isExternal && args.clipboardData && args.clipboardData.getData('isInternalCut').length && !this.copiedInfo) {
            return; // to prevent multiple cut paste action
        }
        if (isExternal || this.copiedShapeInfo || (args.isInternal && this.copiedInfo)) {
            args.isInternal = !isExternal;
            let isCut: boolean;
            const copiedIdx: number = this.getCopiedIdx();
            args.isAction = !!isExternal || args.isAction;
            const cSIdx: number = args && args.sIdx > -1 ? args.sIdx : this.parent.activeSheetIndex;
            const curSheet: SheetModel = getSheet(this.parent, cSIdx);
            let selIdx: number[] = getSwapRange(args && args.range || getRangeIndexes(curSheet.selectedRange));
            let pasteModelArgs: PasteModelArgs | { internal: boolean } | { file: File }; let rows: RowModel[];
            if (isExternal) {
                pasteModelArgs = this.getExternalCells(args);
                rows = (pasteModelArgs as PasteModelArgs).model;
                if (!args.isInternal && (pasteModelArgs as { internal: boolean }).internal) {
                    isExternal = false;
                    if (!this.copiedInfo) {
                        return;
                    }
                }
                if (!rows || !rows.length) { // If image pasted
                    if ((pasteModelArgs as { file: File }).file) {
                        this.parent.notify(insertImage, { file: (pasteModelArgs as { file: File }).file });
                        return;
                    } else if (this.copiedInfo) {
                        isExternal = false;
                    } else {
                        return;
                    }
                }
            }
            pasteModelArgs = pasteModelArgs as PasteModelArgs;
            const copyInfo: { range: number[], sId: number, isCut: boolean } = Object.assign({ isExternal: isExternal }, this.copiedInfo);
            let cIdx: number[]; let pSheetIdx: number; let column: ColumnModel; let notRemoveMerge: boolean; let isRepeative: boolean;
            let cSheetSel: string; let prevSheet: SheetModel; let isRowSelected: boolean; let isColSelected: boolean;
            if (isExternal) {
                pSheetIdx = cSIdx;
                prevSheet = getSheet(this.parent, pSheetIdx);
                column = {};
                cSheetSel = pasteModelArgs.selection;
                isRepeative = cSheetSel !== 'Sheet' && (selIdx[2] - selIdx[0] + 1) % pasteModelArgs.rowCount === 0 &&
                    (selIdx[3] - selIdx[1] + 1) % pasteModelArgs.colCount === 0;
                cIdx = [0, 0, pasteModelArgs.usedRowIndex, pasteModelArgs.usedColIndex];
            } else {
                cIdx = getSwapRange(this.copiedShapeInfo ? getRangeIndexes(curSheet.selectedRange) : this.copiedInfo.range);
                pSheetIdx = copiedIdx;
                column = getColumn(curSheet, cIdx[1]);
                notRemoveMerge = isSingleCell(cIdx) && this.isRangeMerged(selIdx, curSheet);
                prevSheet = getSheet(this.parent, pSheetIdx);
                isRepeative = !notRemoveMerge && (selIdx[2] - selIdx[0] + 1) % (cIdx[2] - cIdx[0] + 1) === 0 &&
                    (selIdx[3] - selIdx[1] + 1) % (cIdx[3] - cIdx[1] + 1) === 0;
                if (prevSheet) {
                    isRowSelected = cIdx[1] === 0 && cIdx[3] === prevSheet.colCount - 1;
                    isColSelected = cIdx[0] === 0 && cIdx[2] === prevSheet.rowCount - 1;
                    if (isRowSelected) {
                        if (isColSelected) {
                            cSheetSel = 'Sheet';
                            cIdx[2] = prevSheet.usedRange.rowIndex;
                            cIdx[3] = prevSheet.usedRange.colIndex;
                        } else {
                            cSheetSel = 'Row';
                            cIdx[3] = prevSheet.usedRange.colIndex;
                        }
                    } else if (isColSelected) {
                        cSheetSel = 'Column';
                        cIdx[2] = prevSheet.usedRange.rowIndex;
                    }
                }
            }
            rfshRange = isRepeative ? selIdx : [selIdx[0], selIdx[1]]
                .concat([selIdx[0] + cIdx[2] - cIdx[0], selIdx[1] + cIdx[3] - cIdx[1] || selIdx[1]]);
            if (cSheetSel) {
                if ((cSheetSel === 'Sheet' || cSheetSel === 'Column') && rfshRange[2] < curSheet.usedRange.rowIndex) {
                    rfshRange[2] = curSheet.usedRange.rowIndex;
                }
                if ((cSheetSel === 'Sheet' || cSheetSel === 'Row') && rfshRange[3] < curSheet.usedRange.colIndex) {
                    rfshRange[3] = curSheet.usedRange.colIndex;
                }
            }
            let pasteType: string = (args && args.type) || 'All';
            if (isReadOnlyCells(this.parent, rfshRange)) {
                this.parent.notify(readonlyAlert, null);
                return;
            } else if (curSheet.isProtected && isLockedCells(this.parent, rfshRange)) {
                this.parent.notify(editAlert, null);
                return;
            }
            if (args.isAction && !this.copiedShapeInfo) {
                const beginEventArgs: BeforePasteEventArgs = { requestType: 'paste', copiedInfo: this.copiedInfo,
                    copiedRange: getRangeAddress(cIdx), pastedRange: getRangeAddress(rfshRange), type: pasteType, cancel: false };
                this.parent.notify(beginAction, { eventArgs: beginEventArgs, action: 'clipboard' });
                if (beginEventArgs.cancel) {
                    return;
                }
                selIdx = getRangeIndexes(beginEventArgs.pastedRange);
                if (isExternal) {
                    isRepeative = pasteModelArgs.selection !== 'Sheet' && (selIdx[2] - selIdx[0] + 1) % pasteModelArgs.rowCount === 0 &&
                        (selIdx[3] - selIdx[1] + 1) % pasteModelArgs.colCount === 0;
                } else {
                    isRepeative = !notRemoveMerge && !isRowSelected && (selIdx[2] - selIdx[0] + 1) % (cIdx[2] - cIdx[0] + 1) === 0
                        && !isColSelected && (selIdx[3] - selIdx[1] + 1) % (cIdx[3] - cIdx[1] + 1) === 0;
                }
                rfshRange = isRepeative ? selIdx : [selIdx[0], selIdx[1]].concat(
                    [selIdx[0] + cIdx[2] - cIdx[0], selIdx[1] + cIdx[3] - cIdx[1] || selIdx[1]]);
                pasteType = beginEventArgs.type;
            }
            let selectionRange: number[];
            if (cSheetSel) {
                selectionRange = [].concat(rfshRange);
                if (cSheetSel === 'Sheet' || cSheetSel === 'Column') {
                    if (rfshRange[2] < curSheet.usedRange.rowIndex) {
                        rfshRange[2] = curSheet.usedRange.rowIndex;
                    }
                    if (cIdx[2] < curSheet.usedRange.rowIndex) {
                        cIdx[2] += curSheet.usedRange.rowIndex - cIdx[2];
                    }
                    if (selectionRange[2] < curSheet.rowCount) {
                        selectionRange[2] = curSheet.rowCount - 1;
                    }
                }
                if (cSheetSel === 'Sheet' || cSheetSel === 'Row') {
                    if (rfshRange[3] < curSheet.usedRange.colIndex) {
                        cIdx[3] += curSheet.usedRange.colIndex - rfshRange[3];
                        rfshRange[3] = curSheet.usedRange.colIndex;
                    }
                    if (cIdx[3] < curSheet.usedRange.colIndex) {
                        cIdx[3] += curSheet.usedRange.colIndex - cIdx[3];
                    }
                    if (selectionRange[3] < curSheet.colCount) {
                        selectionRange[3] = curSheet.colCount - 1;
                    }
                }
            } else {
                selectionRange = rfshRange;
            }
            let cell: CellModel; let isExtend: boolean; let prevCell: CellModel;
            let rowIdx: number = selIdx[0]; const mergeCollection: MergeArgs[] = [];
            if (curSheet.isProtected && isLockedCells(this.parent, rfshRange)) {
                this.parent.notify(editAlert, null);
                return;
            }
            if (this.copiedShapeInfo && !this.copiedInfo) {
                const pictureElem: HTMLElement = this.copiedShapeInfo.pictureElem as HTMLElement;
                if (pictureElem.classList.contains('e-datavisualization-chart')) {
                    this.copiedShapeInfo.chartInfo.top = null;
                    this.copiedShapeInfo.chartInfo.left = null;
                    this.parent.notify(setChart, {
                        chart: [this.copiedShapeInfo.chartInfo], isInitCell: true, isUndoRedo: true, isPaste: true,
                        dataSheetIdx: this.copiedShapeInfo.sheetIdx, isCut: this.copiedShapeInfo.isCut, sheetId: curSheet.id,
                        range: args.range || `${curSheet.name}!${curSheet.selectedRange}`
                    });
                } else {
                    this.parent.notify(createImageElement, {
                        options: {
                            src: pictureElem.style.backgroundImage.replace(/url\((['"])?(.*?)\1\)/gi, '$2'),
                            height: this.copiedShapeInfo.height, width: this.copiedShapeInfo.width,
                            id: this.copiedShapeInfo.isCut ? pictureElem.id : ''
                        },
                        range: getRangeAddress([rowIdx, selIdx[1], rowIdx, selIdx[1]]), isPublic: false, isUndoRedo: true
                    });
                }
                const pastedCell: CellModel = getCell(rowIdx, selIdx[1], curSheet);
                if (pastedCell && !isNullOrUndefined(pastedCell.image) && pastedCell.image.length > 0) {
                    const eventArgs: Object = {
                        requestType: 'imagePaste',
                        copiedShapeInfo: this.copiedShapeInfo,
                        pasteSheetIndex: this.parent.activeSheetIndex,
                        pastedRange: getSheetName(this.parent as Workbook) + '!' + getRangeAddress([rowIdx, selIdx[1], rowIdx, selIdx[1]]),
                        pastedPictureElement: document.getElementById(pastedCell.image[pastedCell.image.length - 1].id)
                    };
                    this.parent.notify(completeAction, { eventArgs: eventArgs, action: 'clipboard' });
                }
            } else {
                const cRows: RowModel[] = [];
                const isInRange: boolean = this.isInRange(cIdx, selIdx, copiedIdx);
                let isFullRowMerge: boolean = false;
                let isFullColMerge: boolean = false; let hiddenCount: number = 0;
                const cf: ConditionalFormatModel[] = [];
                let cfRule: ConditionalFormatModel[]; let cancel: boolean;
                if (!isRepeative && pasteType !== 'Values') {
                    cfRule = this.setCF(cIdx, rfshRange, prevSheet, curSheet, cf, cfRule);
                }
                let isUniqueCell: boolean = false;
                const uniqueCellColl: number[][] = [];
                const copyCellArgs: { sheet: SheetModel, isExternal?: boolean, isRandFormula?: boolean } = {
                    sheet: curSheet, isExternal: !!isExternal
                };
                const pasteSetCell: Function = this.setCell(copyCellArgs);
                const cutSetCell: Function = !isExternal && this.copiedInfo.isCut && this.setCell({ sheet: prevSheet });
                const prevSheetMergeCollection: { range: number[], rowSpan: number, colSpan: number }[] = [];
                const colValidationCollection: number[] = [];
                for (let i: number = cIdx[0], l: number = 0; i <= cIdx[2]; i++, l++) {
                    if (!isExternal && !copyInfo.isCut && isFilterHidden(prevSheet, i)) {
                        l--; hiddenCount++; continue;
                    }
                    if (isInRange) {
                        cRows[selIdx[0] + l] = { cells: [] };
                    }
                    for (let j: number = cIdx[1], k: number = 0; j <= cIdx[3]; j++, k++) {
                        if (isInRange) {
                            cRows[selIdx[0] + l].cells[selIdx[1] + k] = getCell(selIdx[0] + l, selIdx[1] + k, prevSheet, false, true);
                        }
                        cell = isExternal ? (rows[i as number] && rows[i as number].cells[j as number]) || {} :
                            extend({}, (isInRange && cRows[i as number] && cRows[i as number].cells[j as number]) ?
                                cRows[i as number].cells[j as number] : getCell(i, j, prevSheet), null, true);
                        column = getColumn(prevSheet, j);
                        if (!cell.validation && checkColumnValidation(column, i, j)) {
                            const validation: ValidationModel = Object.assign({}, column.validation);
                            const prevIdx: number[] = [0, cIdx[1], 0, cIdx[3]];
                            const value1: string = validation.value1;
                            const value2: string = validation.value2;
                            if (checkIsFormula(value1)) {
                                validation.value1 = getUpdatedFormula([i, j], prevIdx, prevSheet, this.parent, { formula: value1 });
                            }
                            if (checkIsFormula(value2)) {
                                validation.value2 = getUpdatedFormula([i, j], prevIdx, prevSheet, this.parent, { formula: value2 });
                            }
                            cell.validation = validation;
                        }
                        if (cell && cell.isReadOnly) { delete cell.isReadOnly; }
                        if (isRowSelected || isColSelected) {
                            if (cell && cell.rowSpan) {
                                if (cell.rowSpan > 0) {
                                    if ((cell.rowSpan + i) - 1 <= cIdx[2]) {
                                        isFullRowMerge = true;
                                    } else {
                                        cell = {};
                                    }
                                } else if (!isFullRowMerge) {
                                    cell = {};
                                } else if (cell.rowSpan < 0) {
                                    const rowSpan: number = cell.rowSpan;
                                    const colSpan: number = cell.colSpan ? cell.colSpan : 0;
                                    const spanCell: CellModel = getCell(rowIdx + rowSpan, (selIdx[1] + k) + colSpan, curSheet);
                                    if (spanCell && !spanCell.rowSpan) {
                                        cell = {};
                                    }
                                }
                            }
                            if (cell && cell.colSpan) {
                                if (cell.colSpan > 0) {
                                    if ((cell.colSpan + j) - 1 <= cIdx[3]) {
                                        isFullColMerge = true;
                                    } else {
                                        cell = {};
                                    }
                                } else if (!isFullColMerge) {
                                    cell = {};
                                }
                            }
                        }
                        if (cell && pasteType) {
                            let model: CellModel;
                            switch (pasteType) {
                            case 'Formats':
                                model = { format: cell.format, style: cell.style };
                                if (this.copiedInfo && !this.copiedInfo.isCut) {
                                    if (cell.rowSpan) {
                                        model.rowSpan = cell.rowSpan;
                                    }
                                    if (cell.colSpan) {
                                        model.colSpan = cell.colSpan;
                                    }
                                }
                                cell = model;
                                break;
                            case 'Values':
                                cell = { value: cell.value };
                                if (cell.value && cell.value.toString().indexOf('\n') > -1) {
                                    const ele: Element = this.parent.getCell(selIdx[0], selIdx[1]);
                                    ele.classList.add('e-alt-unwrap');
                                }
                                break;
                            }
                            isExtend = ['Formats', 'Values'].indexOf(pasteType) > -1;
                        }
                        if ((!this.parent.scrollSettings.isFinite && (cIdx[2] - cIdx[0] > (1048575 - selIdx[0])
                            || cIdx[3] - cIdx[1] > (16383 - selIdx[1])))
                            || (this.parent.scrollSettings.isFinite && (cIdx[2] - cIdx[0] > (curSheet.rowCount - 1 - selIdx[0])
                                || cIdx[3] - cIdx[1] > (curSheet.colCount - 1 - selIdx[1])))) {
                            this.showDialog();
                            return;
                        }
                        if (isRepeative) {
                            for (let x: number = selIdx[0]; x <= selIdx[2]; x += (cIdx[2] - cIdx[0]) + 1) {
                                if (!copyInfo.isCut && !hiddenCount && isFilterHidden(curSheet, x + l)) {
                                    continue;
                                }
                                for (let y: number = selIdx[1]; y <= selIdx[3]; y += (cIdx[3] - cIdx[1] + 1)) {
                                    if (i === cIdx[0] && j === cIdx[1] && (cfRule === undefined || cfRule.length) &&
                                        pasteType !== 'Values') {
                                        cfRule = this.setCF(
                                            cIdx, [x, y, x + (cIdx[2] - cIdx[0]), y + (cIdx[3] - cIdx[1])], prevSheet, curSheet, cf,
                                            cfRule);
                                    }
                                    prevCell = getCell(x + l, y + k, curSheet, false, true);
                                    if (!isExternal && (!isNullOrUndefined(prevCell.colSpan) || !isNullOrUndefined(prevCell.rowSpan))) {
                                        if (isRowSelected || isColSelected) { continue; }
                                        const merge: MergeArgs = { range: [x + l, y + k, x + l, y + k], merge: false, isAction: false, type: 'All',
                                            sheetIndex: cSIdx, preventRefresh: cSIdx !== this.parent.activeSheetIndex };
                                        mergeCollection.push(merge);
                                        this.parent.notify(setMerge, merge);
                                    }
                                    const colInd: number = y + k;
                                    cell = extend({}, cell ? cell : {}, null, true);
                                    if (!isExtend && this.copiedInfo && !this.copiedInfo.isCut && cell.formula) {
                                        const newFormula: string = getUpdatedFormula([x + l, colInd], [i, j], prevSheet,
                                                                                     this.parent, isInRange ? cell : null);
                                        if (!isNullOrUndefined(newFormula)) {
                                            cell.formula = newFormula;
                                        }
                                    }
                                    if (this.copiedInfo && !this.copiedInfo.isCut && cell.validation) {
                                        const currIdx: number[] = selIdx;
                                        const prevIdx: number[] = cIdx;
                                        let updatedVal: string = getUpdatedFormula(currIdx, prevIdx, prevSheet,
                                                                                   this.parent, { formula: cell.validation.value1 });
                                        cell.validation.value1 = updatedVal;
                                        if (cell.validation.value2 !== '') {
                                            updatedVal = getUpdatedFormula(currIdx, prevIdx, prevSheet, this.parent,
                                                                           { formula: cell.validation.value2 });
                                            cell.validation.value2 = updatedVal;
                                        }
                                    }
                                    if (curSheet.isProtected && cell && cell.isLocked !== false) {
                                        cell.isLocked = prevCell.isLocked;
                                    }
                                    if (prevCell && prevCell.formula && prevCell.formula.indexOf('=UNIQUE(') > -1) {
                                        this.parent.notify(removeUniquecol, null);
                                    }
                                    const uniqueFormulaArgs: {
                                        cellIdx: number[], isUnique: boolean, uniqueRange: string,
                                        sheetName: string } = {
                                        cellIdx: [i, j], isUnique: false, uniqueRange: '', sheetName: prevSheet.name
                                    };
                                    this.parent.notify(checkUniqueRange, uniqueFormulaArgs);
                                    if (uniqueFormulaArgs.isUnique) {
                                        cell.value = null;
                                    }
                                    isUniqueCell = false;
                                    if (cell && cell.formula && cell.formula.indexOf('=UNIQUE(') > -1) {
                                        isUniqueCell = true;
                                        uniqueCellColl.push([x, colInd]);
                                        cell.value = null;
                                    }
                                    cancel = pasteSetCell(x + l, colInd, cell, colInd === selIdx[3], isExtend, isUniqueCell,
                                                          args.beforeActionData, args.isUndo);
                                    if (cancel) {
                                        continue;
                                    }
                                    if (cell.formula && this.copiedInfo && this.copiedInfo.isCut) {
                                        this.parent.notify(clearFormulaDependentCells, { cellRef: getRangeAddress([i, j, i, j]) });
                                    }
                                }
                            }
                        } else {
                            if (isExternal || !hasTemplate(this.parent as Workbook, i, j, copiedIdx)) {
                                if (notRemoveMerge) {
                                    pasteSetCell(rowIdx, selIdx[1] + k, { value: cell.value }, j === cIdx[3], true);
                                } else {
                                    pasteSetCell(rowIdx, selIdx[1] + k, cell, j === cIdx[3], isExtend);
                                }
                            }
                        }
                        if (!isExternal && this.copiedInfo.isCut && !(inRange(selIdx, i, j) &&
                            copiedIdx === this.parent.activeSheetIndex)) {
                            let cell: CellModel = getCell(i, j, prevSheet);
                            if (cell) {
                                if (cell.isReadOnly) {
                                    continue;
                                }
                                if (cell.isLocked || isNullOrUndefined(cell.isLocked)) {
                                    if ((isRowSelected || isColSelected) && (cell.rowSpan !== undefined || cell.colSpan !== undefined)) {
                                        if (cell.rowSpan > 1 || cell.colSpan > 1) {
                                            prevSheetMergeCollection.push(
                                                { range: [i, j, i, j], rowSpan: cell.rowSpan, colSpan: cell.colSpan });
                                            cell = null;
                                        } else {
                                            continue;
                                        }
                                    } else {
                                        if (!cell.validation && prevSheet.columns[j as number] && prevSheet.columns[j as number].validation
                                            && colValidationCollection.indexOf(j) === -1) {
                                            colValidationCollection.push(j);
                                        }
                                        cell = null;
                                    }
                                } else if (cell.isLocked === false) {
                                    if (prevSheet.isProtected) {
                                        cell = { isLocked: false };
                                    } else {
                                        cell = null;
                                    }
                                }
                            }
                            cutSetCell(i, j, cell, j === cIdx[3]);
                        }
                    }
                    rowIdx++;
                }
                if (prevSheetMergeCollection.length) {
                    prevSheetMergeCollection.forEach((mergeInfo: { range: number[]; rowSpan: number; colSpan: number; }) => {
                        setCell(mergeInfo.range[0], mergeInfo.range[1], prevSheet, {
                            rowSpan: mergeInfo.rowSpan, colSpan: mergeInfo.colSpan
                        });
                        const mergeArgs: MergeArgs = { range: mergeInfo.range };
                        this.parent.notify(mergedRange, mergeArgs);
                        this.parent.notify(setMerge, <MergeArgs>{
                            merge: false, range: mergeArgs.range, type: 'All',
                            sheetIndex: pSheetIdx, preventRefresh: pSheetIdx !== this.parent.activeSheetIndex
                        });
                        mergeArgs.range = mergeArgs.range as number[];
                        for (let sRowIdx: number = mergeArgs.range[0]; sRowIdx <= mergeArgs.range[2]; sRowIdx++) {
                            for (let sColIdx: number = mergeArgs.range[1]; sColIdx <= mergeArgs.range[3]; sColIdx++) {
                                cutSetCell(sRowIdx, sColIdx, null);
                            }
                        }
                    });
                }
                if (colValidationCollection.length) {
                    colValidationCollection.forEach((colIdx: number) => {
                        this.parent.notify(cellValidation, { range: prevSheet.name + '!' + getRangeAddress([cIdx[0], colIdx, cIdx[2], colIdx]), isRemoveValidation: true });
                    });
                }
                if (uniqueCellColl.length) {
                    for (let i: number = 0; i < uniqueCellColl.length; i++) {
                        this.parent.serviceLocator.getService<ICellRenderer>('cell').refresh(
                            uniqueCellColl[i as number][0], uniqueCellColl[i as number][1]);
                    }
                }
                if (copyCellArgs.isRandFormula && this.parent.calculationMode === 'Automatic') {
                    this.parent.notify(workbookFormulaOperation, { action: 'refreshRandomFormula' });
                }
                this.parent.notify(refreshRibbonIcons, null);
                const hiddenDiff: number = rfshRange[2] - hiddenCount;
                const selHiddenDiff: number = selectionRange[2] - hiddenCount;
                rfshRange[2] = hiddenDiff;
                selectionRange[2] = selHiddenDiff;
                this.parent.setUsedRange(rfshRange[2], rfshRange[3]);
                const selRange: string = getRangeAddress(selectionRange);
                if (cSIdx === this.parent.activeSheetIndex && !args.isFromUpdateAction) {
                    this.parent.notify(selectRange, { address: selRange });
                }
                if (!isExternal && this.copiedInfo.isCut) {
                    isCut = this.copiedInfo.isCut;
                    if (copiedIdx === this.parent.activeSheetIndex) {
                        this.parent.serviceLocator.getService<ICellRenderer>('cell').refreshRange(cIdx);
                    }
                    this.clearCopiedInfo();
                }
                if ((isExternal || isInRange) && this.copiedInfo) {
                    this.clearCopiedInfo();
                }
                let clearCFArgs: CFArgs;
                if (isCut) {
                    if (cfRule && cfRule.length && pasteType !== 'Values') {
                        clearCFArgs = { range: cIdx, sheetIdx: pSheetIdx, isClear: true };
                        this.parent.notify(clearCFRule, clearCFArgs);
                    }
                    //this.updateFilter(copyInfo, rfshRange);
                    setMaxHgt(
                        prevSheet, cIdx[0], cIdx[1], (this.parent.getRow(
                            cIdx[0], null, this.parent.frozenColCount(prevSheet)) || { offsetHeight: 20 }).offsetHeight);
                    const hgt: number = getMaxHgt(prevSheet, cIdx[0]);
                    setRowEleHeight(this.parent, prevSheet, hgt, cIdx[0]);
                }
                if (cf.length && cSIdx === this.parent.activeSheetIndex) {
                    this.parent.notify(applyCF, <ApplyCFArgs>{ cfModel: cf, isAction: true });
                }
                const copySheet: SheetModel = getSheet(this.parent as Workbook, copiedIdx);
                if (!isExternal && cIdx[0] === cIdx[2] && cSheetSel === 'Row') {
                    const hgt: number = copySheet.rows[cIdx[0]].height;
                    for (let i: number = selIdx[0]; i <= selIdx[2]; i++) {
                        setRowEleHeight(this.parent, this.parent.getActiveSheet(), hgt, i);
                    }
                    if (isCut) {
                        const defaultHeight: number = copySheet && copySheet.standardHeight ? copySheet.standardHeight : 20;
                        setRowEleHeight(this.parent, copySheet, defaultHeight, cIdx[0]);
                    }
                }
                if (args.isAction) {
                    const eventArgs: Object = {
                        requestType: 'paste',
                        copiedInfo: copyInfo,
                        mergeCollection: mergeCollection,
                        pasteSheetIndex: this.parent.activeSheetIndex,
                        copiedRange: prevSheet.name + '!' + (copyInfo.range ? getRangeAddress(copyInfo.range) : prevSheet.selectedRange),
                        pastedRange: curSheet.name + '!' + getRangeAddress(rfshRange),
                        type: pasteType || 'All',
                        selectedRange: selRange
                    };
                    if (hiddenCount) { eventArgs['skipFilterCheck'] = true; }
                    if (clearCFArgs && clearCFArgs.cfClearActionArgs) {
                        eventArgs['cfClearActionArgs'] = clearCFArgs.cfClearActionArgs;
                    }
                    if (cf.length) {
                        eventArgs['cfActionArgs'] = { cfModel: cf, sheetIdx: cSIdx };
                    }
                    this.parent.notify(completeAction, { eventArgs: eventArgs, action: 'clipboard' });
                }
                if (args.focus) {
                    focus(this.parent.element);
                }
            }
        } else {
            this.getClipboardEle().select();
        }
    }

    private setCF(
        cRange: number[], pRange: number[], cSheet: SheetModel, pSheet: SheetModel, cf: ConditionalFormatModel[],
        conditionalFormats?: ConditionalFormatModel[]): ConditionalFormatModel[] {
        let cfRange: number[]; let indexes: number[];
        const assignCF: Function = (conditionalFormat: ConditionalFormatModel): void => {
            cfRange = [pRange[0] + (indexes[0] <= cRange[0] ? 0 : indexes[0] - cRange[0]),
                pRange[1] + (indexes[1] <= cRange[1] ? 0 : indexes[1] - cRange[1]),
                pRange[2] - (indexes[2] >= cRange[2] ? 0 : cRange[2] - indexes[2]),
                pRange[3] - (indexes[3] >= cRange[3] ? 0 : cRange[3] - indexes[3])];
            if (!pSheet.conditionalFormats) {
                this.parent.setSheetPropertyOnMute(pSheet, 'conditionalFormats', []);
            }
            const cfRule: ConditionalFormatModel = {
                range: getRangeAddress(cfRange), type: conditionalFormat.type,
                cFColor: conditionalFormat.cFColor, value: conditionalFormat.value, format: conditionalFormat.format
            };
            pSheet.conditionalFormats.push(cfRule);
            cf.push(cfRule);
        };
        if (conditionalFormats) {
            for (let i: number = 0, len: number = conditionalFormats.length; i < len; i++) {
                indexes = getRangeIndexes(conditionalFormats[i as number].range);
                assignCF(conditionalFormats[i as number]);
            }
        } else {
            conditionalFormats = [];
            if (cSheet.conditionalFormats) {
                for (let i: number = 0, len: number = cSheet.conditionalFormats.length; i < len; i++) {
                    indexes = getRangeIndexes(cSheet.conditionalFormats[i as number].range);
                    if (checkRange([cRange], cSheet.conditionalFormats[i as number].range)) {
                        conditionalFormats.push(cSheet.conditionalFormats[i as number]);
                        assignCF(cSheet.conditionalFormats[i as number]);
                    }
                }
            }
        }
        return conditionalFormats;
    }

    private isRangeMerged(range: number[], sheet: SheetModel): boolean {
        const cell: CellModel = getCell(range[0], range[1], sheet);
        if (cell && (cell.colSpan > 1 || cell.rowSpan > 1)) {
            const args: { range: number[] } = { range: range.slice(2, 4).concat(range.slice(2, 4)) };
            this.parent.notify(activeCellMergedRange, args);
            return args.range[0] === range[0] && args.range[1] === range[1] && args.range[2] === range[2] && args.range[3] === range[3];
        }
        return false;
    }

    private updateFilter(copyInfo: { range: number[], sId: number, isCut: boolean }, pastedRange: number[]): void {
        let isFilterCut: boolean; let diff: number[];
        this.parent.notify(setFilteredCollection, null);
        for (let i: number = 0; i < this.parent.sheets.length; i++) {
            if (this.parent.filterCollection && this.parent.filterCollection[i as number] &&
                this.parent.filterCollection[i as number].sheetIndex === getSheetIndexFromId(this.parent as Workbook, copyInfo.sId)) {
                let range: number[] = copyInfo.range;
                const fRange: number[] = getRangeIndexes(this.parent.filterCollection[i as number].filterRange);
                range = getSwapRange(range);
                if (fRange[0] === range[0] && fRange[2] === range[2] && fRange[1] === range[1] && fRange[3] === range[3]) {
                    isFilterCut = true;
                    diff = [Math.abs(range[0] - fRange[0]), Math.abs(range[1] - fRange[1]),
                        Math.abs(range[2] - fRange[2]), Math.abs(range[3] - fRange[3])];
                }
            }
        }
        let cell: HTMLElement = this.parent.getCell(copyInfo.range[0], copyInfo.range[1]);
        cell = cell ? (cell.querySelector('.e-filter-icon') ? cell : this.parent.getCell(copyInfo.range[2], copyInfo.range[3])) : cell;
        const asc: HTMLElement = cell ? cell.querySelector('.e-sortasc-filter') : cell;
        const desc: HTMLElement = cell ? cell.querySelector('.e-sortdesc-filter') : cell;
        if (isFilterCut) {
            for (let n: number = 0; n < this.parent.filterCollection.length; n++) {
                const filterCol: FilterCollectionModel = this.parent.filterCollection[n as number];
                const sheetIndex: number = copyInfo && copyInfo.sId ? getSheetIndexFromId(this.parent as Workbook, copyInfo.sId) :
                    this.parent.activeSheetIndex;
                if (filterCol.sheetIndex === sheetIndex) {
                    this.parent.notify(initiateFilterUI, { predicates: null, range: filterCol.filterRange, sIdx: sheetIndex, isCut: true });
                }
                if (filterCol.sheetIndex === sheetIndex && sheetIndex === this.parent.activeSheetIndex) {
                    diff = [pastedRange[0] + diff[0], pastedRange[1] + diff[1],
                        Math.abs(pastedRange[2] - diff[2]), Math.abs(pastedRange[3] - diff[3])];
                    this.parent.notify(initiateFilterUI, { predicates: null, range: getRangeAddress(diff), sIdx: null, isCut: true });
                    if (copyInfo.range[3] === copyInfo.range[1]) { // To update sorted icon after pasting.
                        const filteredCell: HTMLElement = this.parent.getCell(pastedRange[0], pastedRange[1]);
                        if (asc && filteredCell) {
                            filteredCell.querySelector('.e-filter-icon').classList.add('e-sortasc-filter');
                        }
                        if (desc && filteredCell) {
                            filteredCell.querySelector('.e-filter-icon').classList.add('e-sortdesc-filter');
                        }
                    }
                }
            }
        }
    }

    private isInRange(cRng: number[], pRng: number[], sIdx: number): boolean {
        const activeSheetIndex: number = this.parent.activeSheetIndex;
        return (inRange(cRng, pRng[0], pRng[1]) && sIdx === activeSheetIndex) ||
            (inRange(cRng, pRng[2], pRng[3]) && sIdx === activeSheetIndex);
    }

    private setCell(args: { sheet: SheetModel, isExternal?: boolean, isRandFormula?: boolean }): Function {
        const sheet: SheetModel = args.sheet;
        const uiRefresh: boolean = sheet.name === this.parent.getActiveSheet().name;
        return (rIdx: number, cIdx: number, cell: CellModel, lastCell?: boolean, isExtend?: boolean, isUniqueCell?: boolean,
                actionData?: BeforeActionData, isUndo?: boolean): boolean => {
            if (cell && cell.formula && (cell.formula.indexOf('RANDBETWEEN(') > - 1 || cell.formula.indexOf('RAND(') > - 1 ||
                cell.formula.indexOf('NOW(') > - 1)) {
                args.isRandFormula = true;
            }
            const cancel: boolean = updateCell(
                this.parent, sheet, {
                    cell: cell, rowIdx: rIdx, colIdx: cIdx, pvtExtend: !isExtend, valChange: !isUniqueCell, lastCell: lastCell,
                    uiRefresh: uiRefresh, requestType: 'paste', skipFormatCheck: !args.isExternal, isRandomFormula: args.isRandFormula
                }, actionData, isUndo);
            if (!cancel && cell && cell.style && args.isExternal) {
                let hgt: number = getTextHeightWithBorder(
                    this.parent, rIdx, cIdx, sheet, cell.style || this.parent.cellStyle, cell.wrap ? getLines(
                        this.parent.getDisplayText(cell), getExcludedColumnWidth(
                            sheet, rIdx, cIdx, cell.colSpan > 1 ? cIdx + cell.colSpan - 1 : cIdx), cell.style, this.parent.cellStyle) : 1);
                hgt = Math.round(hgt);
                if (hgt < 20) {
                    hgt = 20; // default height
                }
                setMaxHgt(sheet, rIdx, cIdx, hgt);
                const prevHeight: number = getRowsHeight(sheet, rIdx);
                const maxHgt: number = getMaxHgt(sheet, rIdx);
                const heightChanged: boolean = maxHgt > prevHeight;
                if (heightChanged) {
                    setRowEleHeight(this.parent, sheet, maxHgt, rIdx);
                }
            }
            return cancel;
        };
    }

    private getCopiedIdx(): number {
        if (this.copiedInfo) {
            for (let i: number = 0; i < this.parent.sheets.length; i++) {
                if (this.parent.sheets[i as number].id === this.copiedInfo.sId) {
                    return i;
                }
            }
            this.clearCopiedInfo();
        }
        return -1;
    }

    private setCopiedInfo(args?: ClipboardInfo & ClipboardEvent & { isFromUpdateAction?: boolean }, isCut?: boolean): void {
        if (this.parent.isEdit) { return; }
        const deferred: Deferred = new Deferred();
        args.promise = deferred.promise;
        const sheet: ExtendedSheet = this.parent.getActiveSheet() as Sheet;
        let range: number[];
        if (args && args.range) {
            const isRowSelected: boolean = (args.range[1] === 0 && args.range[3] === sheet.colCount - 1);
            const isColSelected: boolean = (args.range[0] === 0 && args.range[2] === sheet.rowCount - 1);
            const mergeArgs: MergeArgs = { range: args.range };
            if (!(isRowSelected || isColSelected)) {
                this.parent.notify(mergedRange, mergeArgs);
            }
            range = mergeArgs.range as number[];
        } else {
            range = getRangeIndexes(sheet.selectedRange);
        }
        if (isCut && isReadOnlyCells(this.parent, range)) {
            this.parent.notify(readonlyAlert, null);
            return;
        }
        if (args && !args.isPublic && !args.clipboardData) {
            const eventArgs: { copiedRange: string, cancel: boolean, action: string } = { copiedRange:
                `${sheet.name}!${getRangeAddress(range)}`, cancel: false, action: isCut ? 'cut' : 'copy' };
            this.parent.notify(beginAction, eventArgs);
            if (eventArgs.cancel) { return; }
        }
        const option: { sheet: SheetModel, indexes: number[], promise?: Promise<Cell>, isFinite?: boolean } = {
            sheet: sheet, indexes: [0, 0, sheet.rowCount - 1, sheet.colCount - 1], isFinite: this.parent.scrollSettings.isFinite,
            promise: new Promise((resolve: Function) => { resolve((() => { /** */ })()); })
        };
        const pictureElements: HTMLCollection = document.getElementsByClassName('e-ss-overlay-active');
        const pictureLen: number = pictureElements.length;
        if (sheet.isLocalData && !(args && args.clipboardData) && range[0] === 0 && range[2] === (sheet.rowCount - 1) && !pictureLen) {
            this.parent.showSpinner();
            this.parent.notify('updateSheetFromDataSource', option);
        }
        this.checkForUncalculatedFormula(range, (args && args.sId) ? args.sId : sheet.id);
        option.promise.then(() => {
            if (pictureLen > 0) {
                const imgRowIdx: { clientY: number, isImage: boolean } = {
                    clientY: (pictureElements[0] as HTMLElement).offsetTop,
                    isImage: true
                };
                this.parent.notify(getRowIdxFromClientY, imgRowIdx);
                const imgColIdx: { clientX: number, isImage: boolean } = {
                    clientX: (pictureElements[0] as HTMLElement).offsetLeft,
                    isImage: true
                };
                this.parent.notify(getColIdxFromClientX, imgColIdx);
                this.copiedShapeInfo = {
                    sId: (args && args.sId) ? args.sId : sheet.id, sheetIdx: sheet.index, isCut: isCut, pictureElem:
                        pictureElements[0] as HTMLElement, copiedRange: getRangeAddress([imgRowIdx.clientY, imgColIdx.clientX,
                        imgRowIdx.clientY, imgColIdx.clientX]), height: (pictureElements[0] as HTMLElement).offsetHeight,
                    width: (pictureElements[0] as HTMLElement).offsetWidth,
                    chartInfo: this.getChartElemInfo(pictureElements[0] as HTMLElement)
                };
                if (!pictureElements[0].classList.contains('e-datavisualization-chart')) {
                    const imgURL: string = window.getComputedStyle(pictureElements[0]).backgroundImage.slice(5, -2);
                    this.addImgToClipboard(imgURL, this.copiedShapeInfo.height, this.copiedShapeInfo.width);
                }
                this.hidePaste(true);
                if (isCut) {
                    if (pictureElements[0].classList.contains('e-datavisualization-chart')) {
                        this.parent.deleteChart(this.copiedShapeInfo.chartInfo.id);
                    } else {
                        this.parent.notify(deleteImage, {
                            id: this.copiedShapeInfo.pictureElem.id, sheetIdx: this.copiedShapeInfo.sId,
                            range: this.copiedShapeInfo.copiedRange
                        });
                    }
                }
            } else if (!(args && args.clipboardData)) {
                if (this.copiedInfo) {
                    this.clearCopiedInfo();
                }
                this.copiedInfo = {
                    range: range, sId: (args && args.sId) ? args.sId : sheet.id, isCut: isCut
                };
                this.hidePaste(true);
                if (!args.isFromUpdateAction) {
                    this.initCopyIndicator();
                }
                if (!Browser.isIE) {
                    this.getClipboardEle().select();
                }
                if (args && args.invokeCopy) {
                    document.execCommand(isCut ? 'cut' : 'copy');
                }
                this.parent.hideSpinner();
            }
            if (Browser.isIE) {
                this.setExternalCells(args, isCut);
            }
            deferred.resolve();
        });
        if (args && args.clipboardData) {
            this.setExternalCells(args, isCut);
            this.getClipboardEle().setAttribute(
                'aria-label', `${sheet.selectedRange} ${this.parent.serviceLocator.getService<L10n>(locale).getConstant(
                    isCut ? 'Cut' : 'Copy')}`);
        }
    }

    private imageToCanvas(src: string, height: number, width: number): Promise<Blob> {
        return new Promise((res: (value: Blob | PromiseLike<Blob>) => void) => {
            const canvas: HTMLCanvasElement = document.createElement('canvas');
            const canvasCtx: CanvasRenderingContext2D = canvas.getContext('2d');
            const img: HTMLImageElement = new Image();
            img.src = src;
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                canvas.width = width;
                canvas.height = height;
                canvasCtx.drawImage(img, 0, 0, width, height);
                canvas.toBlob((blob: Blob) => {
                    res(blob);
                }, 'image/png');
            };
        });
    }

    private async addImgToClipboard(src: string, height: number, width: number): Promise<void> {
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        const navigator: any = window.navigator;
        const imageBlob: Blob = await this.imageToCanvas(src, height, width);
        await navigator.clipboard.write([new ClipboardItem({ [imageBlob.type]: imageBlob })]);
    }

    private checkForUncalculatedFormula(range: number[], sheetId: number): void {
        let cell: CellModel;
        const sheetIdx: number = getSheetIndexFromId(this.parent, sheetId);
        const sheet: SheetModel = getSheet(this.parent, sheetIdx);
        for (let i: number = range[0]; i <= range[2]; i++) {
            for (let j: number = range[1]; j <= range[3]; j++) {
                cell = getCell(i, j, sheet, null, true);
                if (cell.formula && isUndefined(cell.value)) {
                    this.parent.notify(workbookFormulaOperation, {
                        action: 'refreshCalculate', value: cell.formula, rowIndex:
                            i, colIndex: j, isFormula: checkIsFormula(cell.formula), sheetIndex: sheetIdx
                    });
                }
            }
        }
    }

    private getChartElemInfo(overlayEle: HTMLElement): ChartModel {
        const chartColl: ChartModel[] = this.parent.chartColl;
        if (overlayEle.classList.contains('e-datavisualization-chart')) {
            const chartId: string = overlayEle.getElementsByClassName('e-control')[0].id;
            for (let idx: number = 0; idx < chartColl.length; idx++) {
                if (chartColl[idx as number].id === chartId) {
                    const chart: ChartModel = chartColl[idx as number];
                    return chart;
                }
            }
        }
        return null;
    }

    private clearCopiedInfo(): void {
        if (this.copiedInfo) {
            if (this.parent.getActiveSheet().id === this.copiedInfo.sId) {
                this.removeIndicator(this.parent.getSelectAllContent()); this.removeIndicator(this.parent.getColumnHeaderContent());
                this.removeIndicator(this.parent.getRowHeaderContent()); this.removeIndicator(this.parent.getMainContent());
            }
            this.copiedInfo = null;
            this.hidePaste();
        }
        if (this.copiedShapeInfo) {
            this.copiedShapeInfo = null;
            this.hidePaste();
        }
    }

    private removeIndicator(ele: Element): void {
        if (ele) {
            const indicator: Element = ele.getElementsByClassName('e-copy-indicator')[0];
            if (indicator) { detach(indicator); }
        }
    }

    private initCopyIndicator(): void {
        if (this.copiedInfo && this.parent.getActiveSheet().id === this.copiedInfo.sId) {
            const copyIndicator: HTMLElement = this.parent.createElement('div', { className: 'e-copy-indicator' });
            copyIndicator.appendChild(this.parent.createElement('div', { className: 'e-top' }));
            copyIndicator.appendChild(this.parent.createElement('div', { className: 'e-bottom' }));
            copyIndicator.appendChild(this.parent.createElement('div', { className: 'e-left' }));
            copyIndicator.appendChild(this.parent.createElement('div', { className: 'e-right' }));
            setPosition(this.parent, copyIndicator, this.copiedInfo.range, 'e-copy-indicator');
        }
    }

    private showDialog(): void {
        (this.parent.serviceLocator.getService(dialog) as Dialog).show({
            header: 'Spreadsheet',
            height: 205, width: 340, isModal: true, showCloseIcon: true,
            content: (this.parent.serviceLocator.getService(locale) as L10n).getConstant('PasteAlert'),
            beforeOpen: (args: BeforeOpenEventArgs): void => {
                const dlgArgs: DialogBeforeOpenEventArgs = {
                    dialogName: 'PasteDialog',
                    element: args.element, target: args.target, cancel: args.cancel
                };
                this.parent.trigger('dialogBeforeOpen', dlgArgs);
                if (dlgArgs.cancel) {
                    args.cancel = true;
                }
            }
        });
    }

    private hidePaste(isShow?: boolean): void {
        if (this.parent.getActiveSheet().isProtected) {
            isShow = false;
        }
        this.parent.notify(enableToolbarItems, [{ items: [this.parent.element.id + '_paste'], enable: isShow || false }]);
    }

    private setExternalCells(args: ClipboardEvent, isCut?: boolean): void {
        let cell: CellModel; let val: string; let text: string = ''; let cellStyle: string;
        const sheet: SheetModel = this.parent.getActiveSheet();
        const range: number[] = getSwapRange(this.copiedInfo.range);
        const isRowSelected: boolean = range[1] === 0 && range[3] === sheet.colCount - 1;
        const isColSelected: boolean = range[0] === 0 && range[2] === sheet.rowCount - 1;
        let rowHeight: number; let colWidth: number;
        let data: string = '<html><body><table class="e-spreadsheet" xmlns="http://www.w3.org/1999/xhtml" style="border-collapse:collapse;"';
        if (isRowSelected || isColSelected) {
            data += ` aria-rowcount="${sheet.usedRange.rowIndex}" aria-colcount="${sheet.usedRange.colIndex}"`;
            data += ` aria-label="${isRowSelected && isColSelected ? 'Sheet' : isRowSelected ? 'Row' : 'Column'}"`;
        }
        data += '><tbody>';
        for (let i: number = range[0]; i <= range[2]; i++) {
            if (!isCut && isFilterHidden(sheet, i)) {
                continue;
            }
            rowHeight = getRowHeight(sheet, i);
            data += `<tr style="height:${rowHeight}px;">`;
            for (let j: number = range[1]; j <= range[3]; j++) {
                cell = getCell(i, j, sheet, false, true);
                if (cell.colSpan < 0 || cell.rowSpan < 0) {
                    continue;
                }
                data += '<td';
                if (cell.colSpan) {
                    data += ' colspan="' + cell.colSpan + '"';
                }
                if (cell.rowSpan) {
                    data += ' rowspan="' + cell.rowSpan + '"';
                }
                colWidth = getColumnWidth(sheet, j);
                data += ` style="width:${colWidth}px;`;
                if (cell.style) {
                    cellStyle = '';
                    if (!cell.style['whiteSpace' as string]) {
                        cellStyle += 'white-space:' + (cell.wrap ? 'normal' : 'nowrap') + ';';
                    }
                    if (!cell.style.verticalAlign) {
                        cellStyle += 'vertical-align:bottom;';
                    }
                    if (!cell.style.fontFamily) {
                        cellStyle += 'font-family:Calibri;';
                    }
                    if (!cell.style.fontSize) {
                        cellStyle += 'font-size:11pt;';
                    }
                    Object.keys(cell.style).forEach((style: string) => {
                        let cellStyleValue: string = cell.style[`${style}`];
                        if (style.includes('border') && cellStyleValue.includes('dashed') && cellStyleValue.includes('1px')) {
                            cellStyleValue = cellStyleValue.replace('1px', 'thin');
                        }
                        const regex: RegExpMatchArray = style.match(/[A-Z]/);
                        cellStyle += (style === 'backgroundColor' ? 'background' : (regex ? style.replace(regex[0], '-'
                            + regex[0].toLowerCase()) : style)) + ':' + ((style === 'backgroundColor' || style === 'color')
                            ? cell.style[`${style}`].slice(0, 7) : cellStyleValue) + ';';
                    });
                    data += cellStyle.includes('"') ? `'${cellStyle}'` : `${cellStyle}"`;
                } else {
                    data += 'white-space:' + (cell.wrap ? 'normal' : 'nowrap') +
                        ';vertical-align:bottom;font-family:Calibri;font-size:11pt;"';
                }
                if (!isNullOrUndefined(cell.value)) {
                    val = cell.value;
                    if (cell.format && cell.format !== 'General') {
                        data += cell.value.toString().includes('"') ? ' cell-value=\'' + val + '\'' : ' cell-value="' + cell.value + '"';
                        data += cell.format.includes('"') ? ' num-format=\'' + cell.format + '\'' : ' num-format="' + cell.format + '"';
                        const eventArgs: NumberFormatArgs = { formattedText: val, value: val, format: cell.format, cell: cell, rowIndex: i,
                            colIndex: j, dataUpdate: true };
                        this.parent.notify(getFormattedCellObject, eventArgs);
                        val = <string>eventArgs.formattedText;
                    }
                    data += '>';
                    if (typeof val === 'string' && val.includes('\n')) {
                        data += val.split('\n').join('<br>');
                    } else {
                        data += val;
                    }
                    text += val;
                    data += '</td>';
                } else {
                    data += '></td>';
                }
                text += j === range[3] ? '' : '\t';
            }
            data += '</tr>';
            text += i === range[2] ? '' : '\n';
        }
        data += '</tbody></table></body></html>';
        if (Browser.isIE) {
            window['clipboardData'].setData('text', text);
            if (isCut) {
                window['clipboardData'].setData('isInternalCut', text);
            }
        } else {
            args.clipboardData.setData('text/html', data);
            args.clipboardData.setData('text/plain', text);
            if (isCut) {
                args.clipboardData.setData('isInternalCut', text);
            }
            args.preventDefault();
        }
    }

    private getExternalCells(args: ClipboardEvent): PasteModelArgs | { internal: boolean } | { file: File } {
        let html: string;
        let text: string;
        const rows: RowModel[] = [];
        const pasteModelArgs: PasteModelArgs = { model: rows };
        const ele: Element = this.parent.createElement('span');
        const clearClipboard: Function = () => setTimeout(() => { this.getClipboardEle().innerHTML = ''; }, 0);
        if (Browser.isIE) {
            text = window['clipboardData'].getData('text');
        } else {
            html = args.clipboardData.getData('text/html');
            text = args.clipboardData.getData('text/plain');
            if (this.copiedInfo && html.includes('<table class="e-spreadsheet"')) {
                let isFilteredRange: boolean = false;
                if (!this.copiedInfo.isCut) {
                    const filterArgs: FilterInfoArgs = { sheetIdx: getSheetIndexFromId(this.parent as Workbook, this.copiedInfo.sId) };
                    this.parent.notify(getFilterRange, filterArgs);
                    if (filterArgs.isFiltered) {
                        const indexes: number[] = filterArgs.filterRange;
                        const copyIndexes: number[] = this.copiedInfo.range;
                        isFilteredRange = indexes[0] === copyIndexes[0] && indexes[1] === copyIndexes[1] && indexes[2] === copyIndexes[2] &&
                            indexes[3] === copyIndexes[3];
                    }
                }
                if (!isFilteredRange) {
                    clearClipboard();
                    return { internal: true };
                }
            }
            ele.innerHTML = html;
        }
        if (ele.querySelector('table')) {
            this.generateCells(ele, pasteModelArgs);
        } else if (ele.querySelector('img')) {
            const img: HTMLImageElement = ele.querySelector('img');
            this.parent.notify(createImageElement, { options: { src: img.src, height: img.height, width: img.width }, isPublic: true });
        } else if (text) {
            let cells: CellModel[] = [];
            let cellStyle: CellStyleModel;
            let childArr: Element[]; let filteredChild: Element;
            if (html) { childArr = [].slice.call(ele.children); }
            const getStyle: Function = this.cellStyle(ele);
            pasteModelArgs.colCount = 1;
            text.split('\n').forEach((row: string) => {
                cellStyle = null;
                if (html) {
                    filteredChild = childArr.filter(
                        (elem: Element) => elem.textContent && elem.textContent.replace(/(\r\n|\n|\r|\s)/gm, ' ').trim() === row.trim())[0];
                    if (filteredChild) {
                        cellStyle = getStyle(filteredChild);
                        childArr.splice(childArr.indexOf(filteredChild), 1);
                    }
                }
                row.split('\t').forEach((col: string, j: number) => {
                    if (col || cellStyle) {
                        cells[j as number] = {};
                        if (cellStyle) {
                            if ((cellStyle as { whiteSpace: string }).whiteSpace &&
                            (cellStyle as { whiteSpace: string }).whiteSpace !== 'nowrap') {
                                cells[j as number].wrap = true;
                                delete cellStyle['whiteSpace'];
                                if (Object.keys(cellStyle).length) { cells[j as number].style = cellStyle; }
                            } else {
                                cells[j as number].style = cellStyle;
                            }
                        }
                        if (col) {
                            if (checkIsFormula(col)) {
                                cells[j as number].formula = col;
                            } else {
                                cells[j as number].value = <string>parseIntValue(col.trim(), true, true);
                            }
                        }
                    }
                });
                rows.push({ cells: cells });
                pasteModelArgs.colCount = Math.max(pasteModelArgs.colCount, cells.length);
                cells = [];
            });
            pasteModelArgs.rowCount = rows.length;
            pasteModelArgs.usedRowIndex = rows.length - 1;
            pasteModelArgs.usedColIndex = pasteModelArgs.colCount - 1;
        } else if (args.clipboardData.files && args.clipboardData.files[0] && args.clipboardData.files[0].type.includes('image')) {
            clearClipboard();
            return { file: args.clipboardData.files[0] };
        }
        clearClipboard();
        return pasteModelArgs;
    }

    private generateCells(ele: Element, pasteModelArgs: PasteModelArgs): void {
        const rows: RowModel[] = pasteModelArgs.model;
        const table: HTMLTableElement = ele.querySelector('table');
        const isSpreadsheet: boolean = table.classList.contains('e-spreadsheet');
        const tableStyleObj: CellStyleModel = {}; const rowStyleObj: CellStyleModel = {};
        pasteModelArgs.usedRowIndex = table.rows.length - 1;
        pasteModelArgs.rowCount = table.rows.length;
        if (isSpreadsheet) {
            pasteModelArgs.selection = table.getAttribute('aria-label');
            if (pasteModelArgs.selection) {
                if (pasteModelArgs.selection === 'Sheet') {
                    pasteModelArgs.usedRowIndex = Number(table.getAttribute('aria-rowcount'));
                    pasteModelArgs.usedColIndex = Number(table.getAttribute('aria-colcount'));
                } else if (pasteModelArgs.selection === 'Row') {
                    pasteModelArgs.usedColIndex = Number(table.getAttribute('aria-colcount'));
                } else {
                    pasteModelArgs.usedRowIndex = Number(table.getAttribute('aria-rowcount'));
                }
            }
        }
        const tableStyles: string[] = [];
        if (!isNullOrUndefined(table)) {
            if (!isNullOrUndefined(table.getAttribute('style'))) {
                tableStyles.push(table.getAttribute('style'));
                this.generateStyles(tableStyles, tableStyleObj);
            }
        }
        const getStyle: Function = this.cellStyle(ele, isSpreadsheet);
        let tr: HTMLTableRowElement; let cells: CellModel[]; let cellStyle: CellStyleModel; let td: HTMLTableCellElement;
        let cellCount: number = 1; let colLen: number; let formatStr: string; let curColIdx: number;
        pasteModelArgs.colCount = 1;
        const rowStyles: string[] = [];
        for (let rowIdx: number = 0, rowLen: number = pasteModelArgs.usedRowIndex; rowIdx <= rowLen; rowIdx++) {
            tr = table.rows[rowIdx as number];
            if (!isNullOrUndefined(tr.getAttribute('style'))) {
                rowStyles.push(tr.getAttribute('style'));
                this.generateStyles(rowStyles, rowStyleObj);
            }
            if (!rows[rowIdx as number]) {
                rows[rowIdx as number] = { cells: [] };
            }
            cells = rows[rowIdx as number].cells;
            pasteModelArgs.colCount = Math.max(pasteModelArgs.colCount, tr.cells.length);
            colLen = pasteModelArgs.usedColIndex < tr.cells.length ? pasteModelArgs.usedColIndex : tr.cells.length - 1;
            for (let colIdx: number = 0; colIdx <= colLen; colIdx++) {
                td = tr.cells[colIdx as number];
                curColIdx = colIdx;
                if (cells[colIdx as number]) {
                    colIdx = this.getNewIndex(cells, colIdx);
                }
                cells[colIdx as number] = {};
                cellStyle = getStyle(td, rowStyleObj, tableStyleObj);
                td.textContent = td.textContent.replace(/(\r\n|\n|\r)/gm, '');
                td.textContent = td.textContent.replace(/\s+/g, ' ');
                if ((cellStyle as { whiteSpace: string }).whiteSpace &&
                    (cellStyle as { whiteSpace: string }).whiteSpace !== 'nowrap') {
                    cells[colIdx as number].wrap = true;
                    delete cellStyle['whiteSpace'];
                }
                if (Object.keys(cellStyle).length) {
                    if (cellStyle.border) {
                        ['borderBottom', 'borderTop', 'borderLeft', 'borderRight'].forEach((prop: string): void => {
                            cellStyle[`${prop}`] = cellStyle.border;
                        });
                        delete cellStyle.border;
                    }
                    cells[colIdx as number].style = cellStyle;
                }
                if (td.textContent) {
                    cells[colIdx as number].value = <string>parseIntValue(td.textContent.trim(), true, true);
                }
                formatStr = isSpreadsheet ? 'num-format' : 'number-format';
                if (td.getAttribute(formatStr)) {
                    cells[colIdx as number].format = td.getAttribute(formatStr);
                    if (cells[colIdx as number].value && td.getAttribute('cell-value')) {
                        cells[colIdx as number].value = <string>parseIntValue(td.getAttribute('cell-value').trim(), true, true);
                    }
                }
                if (td.getAttribute('colspan') && parseInt(td.getAttribute('colspan'), 10) > 1) {
                    cells[colIdx as number].colSpan = parseInt(td.getAttribute('colspan'), 10);
                }
                if (td.getAttribute('rowspan') && parseInt(td.getAttribute('rowspan'), 10) > 1) {
                    cells[colIdx as number].rowSpan = parseInt(td.getAttribute('rowspan'), 10);
                }
                if (cells[colIdx as number].colSpan > 1 && cells[colIdx as number].rowSpan > 1) {
                    let cell: CellModel;
                    for (let k: number = rowIdx, len: number = rowIdx + cells[colIdx as number].rowSpan; k < len; k++) {
                        for (let l: number = colIdx, len: number = colIdx + cells[colIdx as number].colSpan; l < len; l++) {
                            if (k === rowIdx && l === colIdx) { continue; }
                            cell = cells[colIdx as number].style ? { style: extend({}, cells[colIdx as number].style) } : {};
                            if (k !== rowIdx) { cell.rowSpan = rowIdx - k; }
                            if (l !== colIdx) { cell.colSpan = colIdx - l; }
                            if (!(rows as RowModel[])[k as number]) {
                                (rows as RowModel[])[k as number] = { cells: [] };
                            }
                            (rows as RowModel[])[k as number].cells[l as number] = cell;
                        }
                    }
                } else if (cells[colIdx as number].colSpan > 1) {
                    for (let k: number = colIdx + 1, len: number = colIdx + cells[colIdx as number].colSpan; k < len; k++) {
                        cells[k as number] = { colSpan: colIdx - k, style: extend({}, cellStyle) };
                    }
                } else if (cells[colIdx as number].rowSpan > 1) {
                    for (let k: number = rowIdx + 1, len: number = rowIdx + cells[colIdx as number].rowSpan; k < len; k++) {
                        if (!(rows as RowModel[])[k as number]) {
                            (rows as RowModel[])[k as number] = { cells: [] };
                        }
                        (rows as RowModel[])[k as number].cells[colIdx as number] = { rowSpan: rowIdx - k, style: extend({}, cellStyle) };
                    }
                }
                colIdx = curColIdx;
            }
            cellCount = Math.max(cellCount, cells.length);
        }
        pasteModelArgs.usedColIndex = cellCount - 1;
    }

    private getNewIndex(cells: CellModel[], index: number): number {
        if (cells[index as number]) {
            index++;
            index = this.getNewIndex(cells, index);
        }
        return index;
    }

    private cellStyle(ele: Element, isSpreadsheet?: boolean): Function {
        let eleStyle: string; let commonStyle: object;
        if (!isSpreadsheet) {
            eleStyle = ele.querySelector('style') && ele.querySelector('style').innerHTML;
            const keys: string[] = Object.keys(this.parent.commonCellStyle);
            if (keys && keys.length && eleStyle) {
                let tdStyle: string = eleStyle.includes('td') ? eleStyle.split('td')[1] : eleStyle;
                tdStyle = tdStyle.includes('{') ? tdStyle.split('{')[1].split('}')[0] : tdStyle.split('}')[0];
                commonStyle = {};
                for (let i: number = 0; i < keys.length; i++) {
                    let key: string = keys[i as number];
                    const regex: RegExpMatchArray = key.match(/[A-Z]/);
                    if (regex) {
                        key = key.replace(regex[0], '-' + regex[0].toLowerCase());
                    }
                    if (tdStyle.indexOf(key) > -1) {
                        commonStyle[keys[i as number]] = tdStyle.split(key + ':')[1].split(';')[0].trim();
                    }
                }
            }
        }
        return (td: Element, rowStyleObj: CellStyleModel, tableStyleObj: CellStyleModel): CellStyleModel => {
            const cellStyle: CellStyleModel = {};
            let styles: string[];
            if (isSpreadsheet) {
                if (td.getAttribute('style')) {
                    styles = td.getAttribute('style').split(';');
                } else {
                    return cellStyle;
                }
            } else {
                styles = [];
                if (eleStyle && td.className && eleStyle.includes(td.classList[0])) {
                    const styleTagCSS: string[] = eleStyle.split(td.classList[0]);
                    styles.push(styleTagCSS[styleTagCSS.length - 1].split('{')[1].split('}')[0]);
                }
                const nodeList: Element[] = [].slice.call(td.querySelectorAll('*'));
                nodeList.unshift(td);
                nodeList.forEach((node: Element) => {
                    if (node.getAttribute('style')) {
                        styles.push(node.getAttribute('style'));
                    }
                    if (node.tagName === 'B') {
                        styles.push('font-weight:bold');
                    }
                    if (node.tagName === 'I') {
                        styles.push('font-style:italic');
                    }
                    if (node.tagName === 'U') {
                        styles.push('text-decoration:underline');
                    }
                });
                Object.assign(cellStyle, tableStyleObj, rowStyleObj, commonStyle);
            }
            if (styles.length) {
                this.generateStyles(styles, cellStyle);
            }
            if (td.querySelector('S')) {
                cellStyle.textDecoration = cellStyle.textDecoration ? 'underline line-through' : 'line-through';
            }
            if (cellStyle.textDecoration &&
                ['underline', 'line-through', 'underline line-through', 'none'].indexOf(cellStyle.textDecoration) === -1) {
                cellStyle.textDecoration = 'none';
            }
            if (cellStyle.textAlign && ['left', 'center', 'right'].indexOf(cellStyle.textAlign) === -1) { cellStyle.textAlign = 'left'; }
            if (cellStyle.verticalAlign && ['bottom', 'middle', 'top'].indexOf(cellStyle.verticalAlign) === -1) {
                cellStyle.verticalAlign = 'bottom';
            }
            if (cellStyle.fontSize) {
                cellStyle.fontSize = Math.round(parseFloat(
                    (cellStyle.fontSize.indexOf('px') > -1) ? (parseFloat(cellStyle.fontSize) * 0.75).toString() :
                        ((cellStyle.fontSize.indexOf('em') > -1) ? (parseFloat(cellStyle.fontSize) * 16 / 1.3333).toString() : cellStyle.fontSize))) + 'pt';
            }
            if (cellStyle.fontWeight && ['bold', 'normal'].indexOf(cellStyle.fontWeight) === -1) {
                cellStyle.fontWeight = cellStyle.fontWeight > '599' ? 'bold' : 'normal';
            }
            return cellStyle;
        };
    }

    private generateStyles(styles: string[], styleObj: CellStyleModel): void {
        let index: number; let value: string; let splitValue: string[]; let splitBorder: string[]; let borderSize: number;
        // `styleAttr` holds the `CSS` property and `styleValue` holds its corresponding `JS` property in same order, common for border.
        const styleAttr: string[] = ['font-family', 'vertical-align', 'text-align', 'text-indent', 'color', 'white-space',
            'font-weight', 'font-style', 'font-size', 'text-decoration', 'background', 'background-color'];
        const styleValue: string[] = ['fontFamily', 'verticalAlign', 'textAlign', 'textIndent', 'color', 'whiteSpace', 'fontWeight',
            'fontStyle', 'fontSize', 'textDecoration', 'backgroundColor', 'backgroundColor'];
        const borderAttr: string[] = ['border-bottom', 'border-top', 'border-right', 'border-left', 'border'];
        const borderValue: string[] = ['borderBottom', 'borderTop', 'borderRight', 'borderLeft', 'border'];
        if (styles && styles.length) {
            styles.forEach((styles: string) => {
                styles.split(';').forEach((style: string) => {
                    value = style.split(':')[0].trim();
                    index = styleAttr.indexOf(value);
                    if (index > -1) {
                        value = style.split(':')[1].trim();
                        styleObj[styleValue[index as number]] = value;
                    } else {
                        index = borderAttr.indexOf(value);
                        if (index > -1) {
                            value = style.split(':')[1].trim();
                            if (value === 'none') {
                                value = undefined;
                            } else if (value.includes('pt')) {
                                splitValue = value.split('pt');
                                splitBorder = splitValue[0].split(' ');
                                for (let i: number = 0; i < splitBorder.length; i++) {
                                    borderSize = parseFloat(splitBorder[i as number]);
                                    if (borderSize) {
                                        splitBorder.splice(i, 1);
                                        splitBorder.unshift((borderSize / 0.75).toFixed(2) + 'px');
                                        splitValue[0] = splitBorder.join(' ');
                                        break;
                                    }
                                }
                                value = splitValue.join('');
                            }
                            styleObj[borderValue[index as number]] = value;
                        }
                    }
                });
            });
        }
    }

    private refreshOnInsertDelete(args: { model: SheetModel, start: number, end: number, modelType: ModelType, isInsert?: boolean }): void {
        if (this.copiedInfo) {
            if (args.model.id !== this.copiedInfo.sId) { return; }
            const range: number[] = this.copiedInfo.range;
            if (args.isInsert) {
                if (args.modelType === 'Column') {
                    if (args.start <= range[3]) {
                        if (args.start <= range[1]) {
                            const len: number = args.end - args.start + 1;
                            range[1] += len; range[3] += len;
                        } else {
                            range[3] = range[1] + (args.start - range[1] - 1);
                        }
                        this.performAction();
                    }
                } else {
                    if (args.start <= range[2]) {
                        if (args.start <= range[0]) {
                            const len: number = args.end - args.start + 1;
                            range[0] += len; range[2] += len;
                        } else {
                            range[2] = range[1] + (args.start - range[1] - 1);
                        }
                        this.performAction();
                    }
                }
            } else {
                this.clearCopiedInfo();
            }
        }
    }

    private performAction(): void {
        const copyIndicator: HTMLElement = this.getCopyIndicator();
        if (copyIndicator) {
            setPosition(this.parent, copyIndicator, this.copiedInfo.range, 'e-copy-indicator');
        }
    }

    private getClipboardEle(): HTMLInputElement {
        return this.parent.element.getElementsByClassName('e-clipboard')[0] as HTMLInputElement;
    }

    private getCopyIndicator(): HTMLElement {
        return this.parent.element.getElementsByClassName('e-copy-indicator')[0] as HTMLElement;
    }

    protected getModuleName(): string {
        return 'clipboard';
    }

    public destroy(): void {
        this.removeEventListener();
        const ele: HTMLInputElement = this.getClipboardEle();
        detach(ele);
        this.parent = null;
    }
}

interface ClipboardInfo {
    range?: number[];
    sId?: number;
    invokeCopy?: boolean;
    isPublic?: boolean;
    promise?: Promise<Object>;
}

/**
 * @hidden
 */
declare class ClipboardItem {
    constructor(data: { [mimeType: string]: Blob | string | ArrayBuffer });
}
