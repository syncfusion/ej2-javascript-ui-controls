import { detach, EventHandler, Browser, L10n, isNullOrUndefined, extend } from '@syncfusion/ej2-base';
import { ClickEventArgs } from '@syncfusion/ej2-navigations';
import { Spreadsheet } from '../base/index';
import { SheetModel, getRangeIndexes, getCell, setCell, getSheet, CellModel, getSwapRange, inRange, Workbook } from '../../workbook/index';
import { CellStyleModel, getRangeAddress, workbookEditOperation, getSheetIndexFromId, getSheetName } from '../../workbook/index';
import { RowModel, getFormattedCellObject, workbookFormulaOperation, checkIsFormula, Sheet, mergedRange } from '../../workbook/index';
import { ExtendedSheet, Cell, pasteMerge, setMerge, MergeArgs, getCellIndexes, getCellAddress, ChartModel } from '../../workbook/index';
import { ribbonClick, ICellRenderer, copy, paste, PasteSpecialType, initiateFilterUI, setPosition, isLockedCells } from '../common/index';
import { BeforePasteEventArgs, hasTemplate, getTextHeightWithBorder, getLines, getExcludedColumnWidth, editAlert } from '../common/index';
import { enableToolbarItems, rowHeightChanged, completeAction, beginAction, DialogBeforeOpenEventArgs, insertImage } from '../common/index';
import { clearCopy, selectRange, dialog, contentLoaded, tabSwitch, cMenuBeforeOpen, createImageElement, setMaxHgt } from '../common/index';
import { getMaxHgt, setRowEleHeight, locale, deleteImage, getRowIdxFromClientY, getColIdxFromClientX, focus, cut } from '../common/index';
import { OpenOptions } from '../common/index';
import { Dialog } from '../services/index';
import { Deferred } from '@syncfusion/ej2-data';
import { BeforeOpenEventArgs } from '@syncfusion/ej2-popups';
import { refreshRibbonIcons, refreshClipboard, getColumn, isLocked as isCellLocked, FilterCollectionModel } from '../../workbook/index';
import { getFilteredCollection, setChart, parseIntValue, isSingleCell, activeCellMergedRange, getRowsHeight } from '../../workbook/index';
import { ConditionalFormatModel, getUpdatedFormula, ModelType, getRow, ExtendedRowModel, clearCFRule, checkUniqueRange, clearFormulaDependentCells } from '../../workbook/index';

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
        this.parent.element
            .appendChild(this.parent.createElement('input', { className: 'e-clipboard', attrs: { 'contenteditable': 'true' } }));
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
        focus(this.parent.element);
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
        if (e.target === 'Content' || e.target === 'RowHeader' || e.target === 'ColumnHeader' || e.target === 'SelectAll') {
            this.parent.enableContextMenuItems(
                [l10n.getConstant('Paste'), l10n.getConstant('PasteSpecial')], (this.copiedInfo ||
                    this.copiedShapeInfo && !isLocked) ? true : false);
            this.parent.enableContextMenuItems([l10n.getConstant('Cut')], (!isLocked) ? true : false);
        }
        if ((e.target === 'Content') && isLocked) {
            this.parent.enableContextMenuItems(
                [l10n.getConstant('Cut'), l10n.getConstant('Filter'), l10n.getConstant('Sort')], false);
        }
        if ((e.target === 'Content') && (isLocked && !sheet.protectSettings.insertLink)) {
            this.parent.enableContextMenuItems([l10n.getConstant('Hyperlink')], false);
        }
        if (e.target === 'ColumnHeader' && sheet.isProtected) {
            delColItems = [l10n.getConstant('DeleteColumn'), l10n.getConstant('DeleteColumns'),
                l10n.getConstant('InsertColumn'), l10n.getConstant('InsertColumns')];
            hideColItems = [l10n.getConstant('HideColumn'), l10n.getConstant('HideColumns'),
                l10n.getConstant('UnHideColumns')];
            this.parent.enableContextMenuItems(delColItems, false);
            this.parent.enableContextMenuItems(hideColItems, (sheet.protectSettings.formatColumns) ? true : false);
        }
        if (e.target === 'RowHeader' && sheet.isProtected) {
            delRowItems = [l10n.getConstant('DeleteRow'), l10n.getConstant('DeleteRows'),
                l10n.getConstant('InsertRow'), l10n.getConstant('InsertRows')];
            hideRowItems = [l10n.getConstant('HideRow'), l10n.getConstant('HideRows'), l10n.getConstant('UnHideRows')];
            this.parent.enableContextMenuItems(delRowItems, false);
            this.parent.enableContextMenuItems(hideRowItems, (sheet.protectSettings.formatRows) ? true : false);
        }
    }

    private rowHeightChanged(args: { rowIdx: number, threshold: number }): void {
        if (this.copiedInfo && this.copiedInfo.range[0] > args.rowIdx) {
            const ele: HTMLElement = this.parent.element.getElementsByClassName('e-copy-indicator')[0] as HTMLElement;
            if (ele) {
                ele.style.top = `${parseInt(ele.style.top, 10) + args.threshold}px`;
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
        isAction?: boolean, isInternal?: boolean
    } & ClipboardEvent): void {
        if (this.parent.isEdit || this.parent.element.getElementsByClassName('e-dlg-overlay').length > 0) {
            return;
        }
        let rfshRange: number[];
        let isExternal: DataTransfer | boolean = ((args && args.clipboardData) || window['clipboardData']);
        args.isInternal = !isExternal;
        if (isExternal && args.clipboardData && args.clipboardData.getData('isInternalCut').length) {
            return; // to prevent multiple cut paste action
        }
        if (isExternal || this.copiedShapeInfo || (args.isInternal && this.copiedInfo)) {
            let isCut: boolean;
            const copiedIdx: number = this.getCopiedIdx();
            const copyInfo: { range: number[], sId: number, isCut: boolean } = Object.assign({ isExternal: isExternal }, this.copiedInfo);
            args.isAction = !!isExternal || args.isAction;
            const cSIdx: number = (args && args.sIdx > -1) ? args.sIdx : this.parent.activeSheetIndex;
            const curSheet: SheetModel = getSheet(this.parent as Workbook, cSIdx);
            let selIdx: number[] = getSwapRange(args && args.range || getRangeIndexes(curSheet.selectedRange));
            const rows: RowModel[] | { internal: boolean } | { file: File } = isExternal && this.getExternalCells(args);
            if (!args.isInternal && (rows as { internal: boolean }) && (rows as { internal: boolean }).internal) {
                isExternal = false;
                if (!this.copiedInfo) { return; }
            }
            if (isExternal && !(rows as RowModel[]).length) { // If image pasted
                if ((rows as { file: File }).file) {
                    this.parent.notify(insertImage, <OpenOptions>{ file: (rows as { file: File }).file });
                }
                return;
            }
            let cellLength: number = 1;
            if (rows) {
                for (let i: number = 0; i < (rows as RowModel[]).length; i++) {
                    cellLength = rows[i].cells.length > cellLength ? rows[i].cells.length : cellLength;
                }
            }
            let rowIdx: number = selIdx[0]; let cIdx: number[] = isExternal
                ? [0, 0, (rows as RowModel[]).length - 1, cellLength - 1] : getSwapRange(this.copiedShapeInfo ?
                    getRangeIndexes(curSheet.selectedRange) : this.copiedInfo.range);
            let isRepeative: boolean = (selIdx[2] - selIdx[0] + 1) % (cIdx[2] - cIdx[0] + 1) === 0
                && (selIdx[3] - selIdx[1] + 1) % (cIdx[3] - cIdx[1] + 1) === 0;
            rfshRange = isRepeative ? selIdx : [selIdx[0], selIdx[1]]
                .concat([selIdx[0] + cIdx[2] - cIdx[0], selIdx[1] + cIdx[3] - cIdx[1] || selIdx[1]]);
            const beginEventArgs: BeforePasteEventArgs = {
                requestType: 'paste',
                copiedInfo: this.copiedInfo,
                copiedRange: getRangeAddress(cIdx),
                pastedRange: getRangeAddress(rfshRange),
                type: (args && args.type) || 'All',
                cancel: false
            };
            if (args.isAction && !this.copiedShapeInfo) {
                this.parent.notify(beginAction, { eventArgs: beginEventArgs, action: 'clipboard' });
            }
            if (beginEventArgs.cancel) {
                return;
            }
            let cell: CellModel;
            let isExtend: boolean; let prevCell: CellModel; const mergeCollection: MergeArgs[] = [];
            const prevSheet: SheetModel = getSheet(this.parent as Workbook, isExternal ? cSIdx : copiedIdx);
            const notRemoveMerge: boolean = isSingleCell(cIdx) && this.isRangeMerged(selIdx, curSheet);
            selIdx = getRangeIndexes(beginEventArgs.pastedRange);
            rowIdx = selIdx[0]; cIdx = isExternal
                ? [0, 0, (rows as RowModel[]).length - 1, cellLength - 1] : getSwapRange(this.copiedShapeInfo ?
                    getRangeIndexes(curSheet.selectedRange) : this.copiedInfo.range);
            isRepeative = (selIdx[2] - selIdx[0] + 1) % (cIdx[2] - cIdx[0] + 1) === 0 && (selIdx[3] - selIdx[1] + 1) %
                (cIdx[3] - cIdx[1] + 1) === 0 && !notRemoveMerge;
            rfshRange = isRepeative ? selIdx : [selIdx[0], selIdx[1]]
                .concat([selIdx[0] + cIdx[2] - cIdx[0], selIdx[1] + cIdx[3] - cIdx[1] || selIdx[1]]);
            const isLockCell: boolean = curSheet.isProtected && isLockedCells(this.parent, rfshRange);
            if (isLockCell) {
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
                        dataSheetIdx: this.copiedShapeInfo.sheetIdx, isCut: this.copiedShapeInfo.isCut,
                        range: args.range || curSheet.selectedRange, isIdAvailabe: false
                    });
                } else {
                    this.parent.notify(createImageElement, {
                        options: {
                            src: pictureElem.style.backgroundImage.replace(/url\((['"])?(.*?)\1\)/gi, '$2'),
                            height: this.copiedShapeInfo.height, width: this.copiedShapeInfo.width,
                            imageId: this.copiedShapeInfo.isCut ? pictureElem.id : ''
                        },
                        range: getRangeAddress([rowIdx, selIdx[1], rowIdx, selIdx[1]]), isPublic: false, isUndoRedo: true
                    });
                }
                const pastedCell: CellModel = getCell(rowIdx, selIdx[1], curSheet);
                if (pastedCell && !isNullOrUndefined(pastedCell.image)) {
                    const imgLen: number = pastedCell.image ? pastedCell.image.length - 1 : 0;
                    const eventArgs: Object = {
                        requestType: 'imagePaste',
                        copiedShapeInfo: this.copiedShapeInfo,
                        pasteSheetIndex: this.parent.activeSheetIndex,
                        pastedRange: getSheetName(this.parent as Workbook) + '!' + getRangeAddress([rowIdx, selIdx[1], rowIdx, selIdx[1]]),
                        pastedPictureElement: document.getElementById(pastedCell.image[imgLen].id)
                    };
                    this.parent.notify(completeAction, { eventArgs: eventArgs, action: 'clipboard' });
                }
            } else {
                let mergeArgs: { range: number[], prevSheet?: SheetModel, cancel?: boolean } = {
                    range: cIdx, prevSheet: prevSheet, cancel: false };
                this.parent.notify(pasteMerge, mergeArgs);
                if (mergeArgs.cancel) { return; }
                const pasteType: string = beginEventArgs.type || args.type;
                const cRows: RowModel[] = [];
                const isInRange: boolean = this.isInRange(cIdx, selIdx, copiedIdx);
                const isRowSelected: boolean = (selIdx[1] === 0 && selIdx[3] === curSheet.colCount - 1);
                const isColSelected: boolean = (selIdx[0] === 0 && selIdx[2] === curSheet.rowCount - 1);
                let isFullRowMerge: boolean = false;
                let isFullColMerge: boolean = false; let hiddenCount: number = 0;
                if (!isRepeative) { this.setCF(cIdx, rfshRange, prevSheet, curSheet); }
                let cFormats: ConditionalFormatModel[];
                for (let i: number = cIdx[0], l: number = 0; i <= cIdx[2]; i++, l++) {
                    if (!isExternal && !copyInfo.isCut && ((getRow(prevSheet, i) || {}) as ExtendedRowModel).isFiltered) {
                        l--; hiddenCount++; continue;
                    }
                    if (isInRange) {
                        cRows[selIdx[0] + l] = { cells: [] };
                    }
                    for (let j: number = cIdx[1], k: number = 0; j <= cIdx[3]; j++, k++) {
                        if (isInRange) {
                            cRows[selIdx[0] + l].cells[selIdx[1] + k] = getCell(selIdx[0] + l, selIdx[1] + k, prevSheet);
                        }
                        cell = isExternal ? rows[i].cells[j] : extend({}, (isInRange && cRows[i] && cRows[i].cells[j])
                            ? cRows[i].cells[j] : getCell(i, j, prevSheet), null, true);
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
                        if (cell && args && args.type || pasteType) {
                            switch (pasteType) {
                            case 'Formats':
                                cell = { format: cell.format, style: cell.style };
                                break;
                            case 'Values':
                                cell = { value: cell.value };
                                if (cell.value && cell.value.toString().indexOf('\n') > -1) {
                                    const ele: Element = this.parent.getCell(selIdx[0], selIdx[1]);
                                    ele.classList.add('e-alt-unwrap');
                                }
                                break;
                            }
                            isExtend = ['Formats', 'Values'].indexOf(args.type) > -1;
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
                                if (!copyInfo.isCut && !hiddenCount && ((getRow(curSheet, x + l) || {}) as ExtendedRowModel).isFiltered) {
                                    continue;
                                }
                                for (let y: number = selIdx[1]; y <= selIdx[3]; y += (cIdx[3] - cIdx[1] + 1)) {
                                    if (i === cIdx[0] && j === cIdx[1] && (cFormats === undefined || cFormats.length)) {
                                        cFormats = this.setCF(
                                            cIdx, [x, y, x + (cIdx[2] - cIdx[0]), y + (cIdx[3] - cIdx[1])], prevSheet, curSheet, cFormats);
                                    }
                                    prevCell = getCell(x + l, y + k, curSheet, false, true);
                                    if (!isExternal && (prevCell.colSpan !== undefined || prevCell.rowSpan !== undefined)) {
                                        if (isRowSelected || isColSelected) { continue; }
                                        mergeArgs = { range: [x + l, y + k, x + l, y + k] };
                                        const merge: MergeArgs = { range: mergeArgs.range, merge: false, isAction: false, type: 'All' };
                                        mergeCollection.push(merge);
                                        if (this.parent.activeSheetIndex === curSheet.index) {
                                            this.parent.notify(setMerge, merge);
                                        }
                                    }
                                    const colInd: number = y + k;
                                    cell = extend({}, cell ? cell : {}, null, true);
                                    if (!isExtend && this.copiedInfo && !this.copiedInfo.isCut) {
                                        const newFormula: string = getUpdatedFormula([x + l, colInd], [i, j], prevSheet);
                                        if (!isNullOrUndefined(newFormula)) {
                                            cell.formula = newFormula;
                                        }
                                    }
                                    if (curSheet.isProtected && cell && cell.isLocked !== false) {
                                        cell.isLocked = prevCell.isLocked;
                                    }
                                    this.setCell(
                                        x + l, colInd, curSheet, cell, isExtend, false, y === selIdx[3], <boolean>isExternal,
                                        !!(cFormats && cFormats.length));
                                    if (cell.formula && this.copiedInfo.isCut) {
                                        this.parent.notify(clearFormulaDependentCells, { cellRef: getRangeAddress([i, j, i, j]) });
                                    }
                                    const cellArgs: Object = {
                                        address: curSheet.name + '!' + getCellAddress(x + l, colInd),
                                        requestType: 'paste',
                                        value: getCell(x + l, colInd, curSheet) ? getCell(x + l, colInd, curSheet).value : '',
                                        oldValue: prevCell.value,
                                        element: this.parent.getCell(x + l, colInd),
                                        displayText: this.parent.getDisplayText(cell)
                                    };
                                    this.parent.trigger('cellSave', cellArgs);
                                    if (cell.formula && cell.formula.includes('UNIQUE')) {
                                        const args: { cellIdx: number[], isUnique: boolean, uniqueRange: string } = { cellIdx: rfshRange,
                                            isUnique: false, uniqueRange: '' };
                                        this.parent.notify(checkUniqueRange, args);
                                        rfshRange = getRangeIndexes(args.uniqueRange);
                                        break;
                                    }
                                }
                            }
                        } else {
                            if (isExternal || !hasTemplate(this.parent as Workbook, i, j, copiedIdx)) {
                                if (notRemoveMerge) {
                                    this.setCell(rowIdx, selIdx[1] + k, curSheet, { value: cell.value }, true, false, j === cIdx[3]);
                                } else {
                                    this.setCell(rowIdx, selIdx[1] + k, curSheet, cell, isExtend, false, j === cIdx[3]);
                                }
                            }
                        }
                        if (!isExternal && this.copiedInfo.isCut && !(inRange(selIdx, i, j) &&
                            copiedIdx === this.parent.activeSheetIndex)) {
                            let cell: CellModel = getCell(i, j, prevSheet);
                            if (cell) {
                                if (cell.isLocked || isNullOrUndefined(cell.isLocked)) {
                                    if ((isRowSelected || isColSelected) && (cell.rowSpan !== undefined || cell.colSpan !== undefined)) {
                                        continue;
                                    } else {
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
                            this.setCell(i, j, prevSheet, cell, false, true, j === cIdx[3]);
                            this.parent.trigger(
                                'cellSave', { address: prevSheet.name + '!' + getCellAddress(i, j), requestType: 'paste', value: '',
                                    oldValue: prevCell.value, displayText: this.parent.getDisplayText(cell) });
                        }
                    }
                    rowIdx++;
                }
                this.parent.notify(refreshRibbonIcons, null);
                rfshRange[2] -= hiddenCount;
                this.parent.setUsedRange(rfshRange[2], rfshRange[3]);
                if (cSIdx === this.parent.activeSheetIndex) {
                    this.parent.notify(selectRange, { address: getRangeAddress(rfshRange) });
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
                if (isExternal || (args && args.isAction)) {
                    focus(this.parent.element);
                }
                if (isCut) {
                    if (cFormats && cFormats.length && pasteType !== 'Values') {
                        this.parent.notify(
                            clearCFRule, { range: getRangeAddress(cIdx), sheetIdx: isExternal ? cSIdx : copiedIdx });
                    }
                    //this.updateFilter(copyInfo, rfshRange);
                    setMaxHgt(prevSheet, cIdx[0], cIdx[1], (this.parent.getRow(cIdx[0]) || { offsetHeight: 20 }).offsetHeight);
                    const hgt: number = getMaxHgt(prevSheet, cIdx[0]);
                    setRowEleHeight(this.parent, prevSheet, hgt, cIdx[0]);
                }
                const copySheet: SheetModel = getSheet(this.parent as Workbook, copiedIdx);
                if (!isExternal && cIdx[0] === cIdx[2] && (cIdx[3] - cIdx[1]) === copySheet.colCount - 1) {
                    const hgt: number = copySheet.rows[cIdx[0]].height;
                    for (let i: number = selIdx[0]; i <= selIdx[2]; i++) {
                        setRowEleHeight(this.parent, this.parent.getActiveSheet(), hgt, i);
                    }
                    if (isCut) {
                        setRowEleHeight(this.parent, copySheet, 20, cIdx[0]);
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
                        type: pasteType || 'All'
                    };
                    this.parent.notify(completeAction, { eventArgs: eventArgs, action: 'clipboard' });
                }
            }
        } else {
            this.getClipboardEle().select();
        }
    }

    private setCF(
        cRange: number[], pRange: number[], cSheet: SheetModel, pSheet: SheetModel,
        conditionalFormats?: ConditionalFormatModel[]): ConditionalFormatModel[] {
        let cFRange: number[]; let indexes: number[];
        const assignCF: Function = (conditionalFormat: ConditionalFormatModel): void => {
            cFRange = [pRange[0] + (indexes[0] <= cRange[0] ? 0 : indexes[0] - cRange[0]),
                pRange[1] + (indexes[1] <= cRange[1] ? 0 : indexes[1] - cRange[1]),
                pRange[2] - (indexes[2] >= cRange[2] ? 0 : cRange[2] - indexes[2]),
                pRange[3] - (indexes[3] >= cRange[3] ? 0 : cRange[3] - indexes[3])];
            pSheet.conditionalFormats.push(extend({}, conditionalFormat, { range: getRangeAddress(cFRange) }));
        };
        if (conditionalFormats) {
            for (let i: number = 0, len: number = conditionalFormats.length; i < len; i++) {
                indexes = getRangeIndexes(conditionalFormats[i].range);
                assignCF(conditionalFormats[i]);
            }
        } else {
            conditionalFormats = [];
            if (cSheet.conditionalFormats) {
                for (let i: number = 0, len: number = cSheet.conditionalFormats.length; i < len; i++) {
                    indexes = getRangeIndexes(cSheet.conditionalFormats[i].range);
                    if (((indexes[0] >= cRange[0] && indexes[0] <= cRange[2]) || (indexes[2] >= cRange[0] && indexes[2] <= cRange[2])) &&
                        ((indexes[1] >= cRange[1] && indexes[1] <= cRange[3]) || (indexes[3] >= cRange[1] && indexes[3] <= cRange[3]))) {
                        conditionalFormats.push(cSheet.conditionalFormats[i]);
                        assignCF(cSheet.conditionalFormats[i]);
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
        this.parent.notify(getFilteredCollection, null);
        for (let i: number = 0; i < this.parent.sheets.length; i++) {
            if (this.parent.filterCollection && this.parent.filterCollection[i] &&
                this.parent.filterCollection[i].sheetIndex === getSheetIndexFromId(this.parent as Workbook, copyInfo.sId)) {
                let range: number[] = copyInfo.range;
                const fRange: number[] = getRangeIndexes(this.parent.filterCollection[i].filterRange);
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
                const filterCol: FilterCollectionModel = this.parent.filterCollection[n];
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

    private setCell(
        rIdx: number, cIdx: number, sheet: SheetModel, cell: CellModel, isExtend?: boolean, isCut?: boolean,
        lastCell?: boolean, isExternal?: boolean, cFApplied?: boolean): void {
        const sheetIndex: number = sheet ? getSheetIndexFromId(this.parent, sheet.id) : null;
        setCell(rIdx, cIdx, sheet, cell, isExtend);
        if (cell && cell.formula) {
            this.parent.notify(workbookFormulaOperation, {
                action: 'refreshCalculate', value: isCut ? '' : cell.formula, rowIndex: rIdx,
                colIndex: cIdx, sheetIndex: this.parent.activeSheetIndex, isFormula: true, isClipboard: true
            });
        }
        if (cell && !cell.formula) {
            this.parent.notify(
                workbookEditOperation,
                {
                    action: 'updateCellValue', address: [rIdx, cIdx, rIdx,
                        cIdx], value: cell.value, sheetIndex: sheetIndex
                });
        }
        if (sheet.name === this.parent.getActiveSheet().name) {
            this.parent.serviceLocator.getService<ICellRenderer>('cell').refresh(rIdx, cIdx, lastCell, null, cFApplied);
        }
        if (cell && cell.style && isExternal) {
            let hgt: number =
                getTextHeightWithBorder(this.parent as Workbook, rIdx, cIdx, sheet, cell.style || this.parent.cellStyle, cell.wrap ?
                    getLines(this.parent.getDisplayText(cell),
                             getExcludedColumnWidth(sheet, rIdx, cIdx), cell.style, this.parent.cellStyle) : 1);
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
    }

    private getCopiedIdx(): number {
        if (this.copiedInfo) {
            for (let i: number = 0; i < this.parent.sheets.length; i++) {
                if (this.parent.sheets[i].id === this.copiedInfo.sId) {
                    return i;
                }
            }
            this.clearCopiedInfo();
        }
        return -1;
    }

    private setCopiedInfo(args?: ClipboardInfo & ClipboardEvent, isCut?: boolean): void {
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
        if (args && !args.isPublic && !args.clipboardData) {
            const eventArgs: { copiedRange: string, cancel: boolean, action: string } = { copiedRange:
                `${sheet.name}!${getRangeAddress(range)}`, cancel: false, action: isCut ? 'cut' : 'copy' };
            this.parent.notify(beginAction, eventArgs);
            if (eventArgs.cancel) { return; }
        }
        const option: { sheet: SheetModel, indexes: number[], promise?: Promise<Cell>, isFinite?: boolean } = {
            sheet: sheet, indexes: [0, 0, sheet.rowCount - 1, sheet.colCount - 1], isFinite: this.parent.scrollSettings.isFinite, promise:
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                new Promise((resolve: Function, reject: Function) => { resolve((() => { /** */ })()); })
        };
        const pictureElements: HTMLCollection = document.getElementsByClassName('e-ss-overlay-active');
        const pictureLen: number = pictureElements.length;
        if (sheet.isLocalData && !(args && args.clipboardData) && range[0] === 0 && range[2] === (sheet.rowCount - 1)) {
            this.parent.showSpinner();
            this.parent.notify('updateSheetFromDataSource', option);
        }
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
                this.initCopyIndicator();
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
            focus(this.parent.element);
        }
    }

    private getChartElemInfo(overlayEle: HTMLElement): ChartModel {
        const chartColl: ChartModel[] = this.parent.chartColl;
        if (overlayEle.classList.contains('e-datavisualization-chart')) {
            const chartId: string = overlayEle.getElementsByClassName('e-control')[0].id;
            for (let idx: number = 0; idx < chartColl.length; idx++) {
                if (chartColl[idx].id === chartId) {
                    const chart: ChartModel = chartColl[idx];
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
            const indicator: Element = ele.querySelector('.e-copy-indicator');
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
            target: this.parent.element,
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
        let cell: CellModel;
        let text: string = '';
        const range: number[] = getSwapRange(this.copiedInfo.range);
        const sheet: SheetModel = this.parent.getActiveSheet();
        let data: string = '<html><body><table class="e-spreadsheet" xmlns="http://www.w3.org/1999/xhtml"><tbody>';
        for (let i: number = range[0]; i <= range[2]; i++) {
            if (!isCut && ((getRow(sheet, i) || {}) as ExtendedRowModel).isFiltered) { continue; }
            data += '<tr>';
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
                data += ' style="white-space:' + (cell.wrap ? 'normal' : 'nowrap') + ';vertical-align:bottom;';
                if (cell.style) {
                    Object.keys(cell.style).forEach((style: string) => {
                        const regex: RegExpMatchArray = style.match(/[A-Z]/);
                        data += (style === 'backgroundColor' ? 'background' : (regex ? style.replace(regex[0], '-'
                            + regex[0].toLowerCase()) : style)) + ':' + ((style === 'backgroundColor' || style === 'color')
                            ? cell.style[style].slice(0, 7) : cell.style[style]) + ';';
                    });
                }
                data += '"';
                if (!isNullOrUndefined(cell.value)) {
                    const eventArgs: { [key: string]: string | number | boolean | CellModel } = {
                        formattedText: cell.value,
                        value: cell.value,
                        format: cell.format,
                        onLoad: true,
                        cell: cell,
                        rowIndex: i,
                        colIndex: j
                    };
                    if (cell.format && cell.format !== 'General') {
                        // eslint-disable-next-line
                        data += cell.value.toString().includes('"') ? " cell-value='" + cell.value + "'" : ' cell-value="' + cell.value +
                            '"';
                        this.parent.notify(getFormattedCellObject, eventArgs);
                    }
                    data += '>';
                    data += eventArgs.formattedText;
                    text += eventArgs.formattedText;
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

    private getExternalCells(args: ClipboardEvent): RowModel[] | { internal: boolean } | { file: File } {
        let html: string;
        let text: string;
        let rows: RowModel[] | { internal: boolean } = [];
        let cells: CellModel[] = [];
        let cellStyle: CellStyleModel;
        const ele: Element = this.parent.createElement('span');
        if (Browser.isIE) {
            text = window['clipboardData'].getData('text');
        } else {
            html = args.clipboardData.getData('text/html');
            text = args.clipboardData.getData('text/plain');
            ele.innerHTML = html;
        }
        if (ele.querySelector('table')) {let isFilteredRange: boolean = false;
            if (this.copiedInfo && !this.copiedInfo.isCut) {
                const filterCol: FilterCollectionModel[] = this.parent.filterCollection;
                if (filterCol) {
                    for (let i: number = 0; i < filterCol.length; i++) {
                        const indexes: number[] = getRangeIndexes(filterCol[i].filterRange);
                        const copyIndexes: number[] = this.copiedInfo.range;
                        if (indexes[0] === copyIndexes[0] && indexes[1] === copyIndexes[1] && indexes[2] === copyIndexes[2]
                            && indexes[3] === copyIndexes[3]) {
                            isFilteredRange = true;
                            break;
                        }
                    }
                }
            }
            if (ele.querySelector('.e-spreadsheet') && this.copiedInfo && !isFilteredRange) {
                rows = { internal: true };
            } else {
                const table: HTMLTableElement = ele.querySelector('table');
                let i: number = 0; let j: number;
                [].slice.call(table.rows || []).forEach((tr: HTMLTableRowElement) => {
                    if (!(rows as RowModel[])[i]) { (rows as RowModel[])[i] = { cells: [] }; }
                    cells = (rows as RowModel[])[i].cells;
                    j = 0;
                    [].slice.call(tr.cells || []).forEach((td: Element) => {
                        if (cells[j]) { j = this.getNewIndex(cells, j); }
                        cells[j] = {};
                        cellStyle = this.getStyle(td, ele);
                        td.textContent = td.textContent.replace(/(\r\n|\n|\r)/gm, '');
                        td.textContent = td.textContent.replace(/\s+/g, ' ');
                        if ((cellStyle as { whiteSpace: string }).whiteSpace &&
                        (cellStyle as { whiteSpace: string }).whiteSpace !== 'nowrap') {
                            cells[j].wrap = true; delete cellStyle['whiteSpace'];
                        }
                        if (Object.keys(cellStyle).length) {
                            if (cellStyle.border) {
                                ['borderBottom', 'borderTop', 'borderLeft', 'borderRight'].forEach((prop: string): void => {
                                    cellStyle[prop] = cellStyle.border;
                                });
                                delete cellStyle.border;
                            }
                            cells[j].style = cellStyle;
                        }
                        if (td.textContent) { cells[j].value = <string>parseIntValue(td.textContent.trim()); }
                        if (td.getAttribute('number-format')) {
                            cells[j].format = td.getAttribute('number-format');
                            if (cells[j].value && td.getAttribute('cell-value')) {
                                cells[j].value = <string>parseIntValue(td.getAttribute('cell-value').trim());
                            }
                        }
                        if (td.getAttribute('colspan') && parseInt(td.getAttribute('colspan'), 10) > 1) {
                            cells[j].colSpan = parseInt(td.getAttribute('colspan'), 10);
                        }
                        if (td.getAttribute('rowspan') && parseInt(td.getAttribute('rowspan'), 10) > 1) {
                            cells[j].rowSpan = parseInt(td.getAttribute('rowspan'), 10);
                        }
                        if (cells[j].colSpan > 1 && cells[j].rowSpan > 1) {
                            let cell: CellModel;
                            for (let k: number = i, len: number = i + cells[j].rowSpan; k < len; k++) {
                                for (let l: number = j, len: number = j + cells[j].colSpan; l < len; l++) {
                                    if (k === i && l === j) { continue; }
                                    cell = cells[j].style ? { style: extend({}, cells[j].style) } : {};
                                    if (k !== i) { cell.rowSpan = i - k; }
                                    if (l !== j) { cell.colSpan = j - l; }
                                    if (!(rows as RowModel[])[k]) { (rows as RowModel[])[k] = { cells: [] }; }
                                    (rows as RowModel[])[k].cells[l] = cell;
                                }
                            }
                        } else if (cells[j].colSpan > 1) {
                            for (let k: number = j + 1, len: number = j + cells[j].colSpan; k < len; k++) {
                                cells[k] =  { colSpan: j - k, style: extend({}, cellStyle) };
                            }
                        } else if (cells[j].rowSpan > 1) {
                            for (let k: number = i + 1, len: number = i + cells[j].rowSpan; k < len; k++) {
                                if (!(rows as RowModel[])[k]) { (rows as RowModel[])[k] = { cells: [] }; }
                                (rows as RowModel[])[k].cells[j] = { rowSpan: i - k, style: extend({}, cellStyle) };
                            }
                        }
                        j++;
                    });
                    i++;
                });
            }
        } else if (ele.querySelector('img')) {
            const img: HTMLImageElement = ele.querySelector('img');
            this.parent.notify(createImageElement, { options: { src: img.src, height: img.height, width: img.width }, isPublic: true });
        } else if (text) {
            let childArr: Element[]; let filteredChild: Element;
            if (html) { childArr = [].slice.call(ele.children); }
            text.split('\n').forEach((row: string) => {
                cellStyle = null;
                if (html) {
                    filteredChild = childArr.filter(
                        (elem: Element) => elem.textContent && elem.textContent.replace(/(\r\n|\n|\r|\s)/gm, ' ').trim() === row.trim())[0];
                    if (filteredChild) {
                        cellStyle = this.getStyle(filteredChild, ele); childArr.splice(childArr.indexOf(filteredChild), 1);
                    }
                }
                row.trim().split('\t').forEach((col: string, j: number) => {
                    if (col || cellStyle) {
                        cells[j] = {};
                        if (cellStyle) {
                            if ((cellStyle as { whiteSpace: string }).whiteSpace &&
                            (cellStyle as { whiteSpace: string }).whiteSpace !== 'nowrap') {
                                cells[j].wrap = true;
                                delete cellStyle['whiteSpace'];
                                if (Object.keys(cellStyle).length) { cells[j].style = cellStyle; }
                            } else {
                                cells[j].style = cellStyle;
                            }
                        }
                        if (col) {
                            if (checkIsFormula(col)) {
                                cells[j].formula = col;
                            } else {
                                cells[j].value = <string>parseIntValue(col.trim());
                            }
                        }
                    }
                });
                (rows as RowModel[]).push({ cells: cells });
                cells = [];
            });
        } else if (args.clipboardData.types.length === 1 && args.clipboardData.types[0] === 'Files' && args.clipboardData.files[0] &&
            args.clipboardData.files[0].type.includes('image')) {
            return { file: args.clipboardData.files[0] };
        }
        setTimeout(() => { this.getClipboardEle().innerHTML = ''; }, 0);
        return rows;
    }

    private getNewIndex(cells: CellModel[], index: number): number {
        if (cells[index]) {
            index++;
            index = this.getNewIndex(cells, index);
        }
        return index;
    }

    private getStyle(td: Element, ele: Element): CellStyleModel {
        const styles: string[] = [];
        const cellStyle: CellStyleModel = {};
        const keys: string[] = Object.keys(this.parent.commonCellStyle);
        if (ele.querySelector('style') && td.classList.length) {
            if (ele.querySelector('style').innerHTML.indexOf(td.classList[0]) > -1) {
                const styleTagCSS: string[] = ele.querySelector('style').innerHTML.split(td.classList[0]);
                styles.push(styleTagCSS[styleTagCSS.length - 1].split('{')[1].split('}')[0]);
            }
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
        if (keys.length) {
            if (ele.querySelector('style')) {
                let tdStyle: string = (ele.querySelector('style').innerHTML.includes('td') ?
                    ele.querySelector('style').innerHTML.split('td')[1] : ele.querySelector('style').innerHTML);
                tdStyle = tdStyle.includes('{') ? tdStyle.split('{')[1].split('}')[0] : tdStyle.split('}')[0];
                for (let i: number = 0; i < keys.length; i++) {
                    let key: string = keys[i];
                    const regex: RegExpMatchArray = key.match(/[A-Z]/);
                    if (regex) {
                        key = key.replace(regex[0], '-' + regex[0].toLowerCase());
                    }
                    if (tdStyle.indexOf(key) > -1) {
                        cellStyle[keys[i]] = tdStyle.split(key + ':')[1].split(';')[0].trim();
                    }
                }
            }
        }
        if (styles.length) {
            let index: number; let value: string; let splitValue: string[];
            // `styleAttr` holds the `CSS` property and `styleValue` holds its corresponding `JS` property in same order, common for border.
            const styleAttr: string[] = ['font-family', 'vertical-align', 'text-align', 'text-indent', 'color', 'white-space',
                'font-weight', 'font-style', 'font-size', 'text-decoration', 'background'];
            const styleValue: string[] = ['fontFamily', 'verticalAlign', 'textAlign', 'textIndent', 'color', 'whiteSpace', 'fontWeight',
                'fontStyle', 'fontSize', 'textDecoration', 'backgroundColor'];
            const borderAttr: string[] = ['border-bottom', 'border-top', 'border-right', 'border-left', 'border'];
            const borderValue: string[] = ['borderBottom', 'borderTop', 'borderRight', 'borderLeft', 'border'];
            styles.forEach((styles: string) => {
                styles.split(';').forEach((style: string) => {
                    value = style.split(':')[0].trim();
                    index = styleAttr.indexOf(value);
                    if (index > -1) {
                        value = style.split(':')[1].trim();
                        cellStyle[styleValue[index]] = value;
                    } else {
                        index = borderAttr.indexOf(value);
                        if (index > -1) {
                            value = style.split(':')[1].trim();
                            if (value === 'none') {
                                value = '';
                            } else if (value.includes('pt')) {
                                splitValue = value.split('pt');
                                splitValue[0] = (parseFloat(splitValue[0]) / 0.75).toFixed(2) + 'px';
                                value = splitValue.join('');
                            }
                            cellStyle[borderValue[index]] = value;
                        }
                    }
                });
            });
        }
        if (td.innerHTML.indexOf('<s>') > -1) { cellStyle.textDecoration = 'line-through'; }
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
                (cellStyle.fontSize.indexOf('px') > -1) ? (parseFloat(cellStyle.fontSize) * 0.75).toString() : cellStyle.fontSize)) + 'pt';
        }
        if (cellStyle.fontWeight && ['bold', 'normal'].indexOf(cellStyle.fontWeight) === -1) {
            cellStyle.fontWeight = cellStyle.fontWeight > '599' ? 'bold' : 'normal';
        }
        return cellStyle;
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
        const copyIndicator: HTMLElement = this.parent.element.querySelector('.e-copy-indicator');
        if (copyIndicator) {
            setPosition(this.parent, copyIndicator, this.copiedInfo.range, 'e-copy-indicator');
        }
    }

    private getClipboardEle(): HTMLInputElement {
        return this.parent.element.getElementsByClassName('e-clipboard')[0] as HTMLInputElement;
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
