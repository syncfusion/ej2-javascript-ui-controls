import { detach, EventHandler, Browser, extend, L10n, isNullOrUndefined } from '@syncfusion/ej2-base';
import { ClickEventArgs } from '@syncfusion/ej2-navigations';
import { Spreadsheet } from '../base/index';
import { SheetModel, getRangeIndexes, getCell, setCell, getSheet, CellModel, getSwapRange, wrapEvent, inRange } from '../../workbook/index';
import { CellStyleModel, getRangeAddress, workbookEditOperation, getSheetIndexFromId, getSheetName } from '../../workbook/index';
import { RowModel, getFormattedCellObject, workbookFormulaOperation, applyCellFormat, checkIsFormula, Sheet } from '../../workbook/index';
import { ExtendedSheet, Cell, pasteMerge, setMerge, MergeArgs, getCellIndexes, getCellAddress, ChartModel } from '../../workbook/index';
import { ribbonClick, ICellRenderer, cut, copy, paste, PasteSpecialType, initiateFilterUI } from '../common/index';
import { BeforePasteEventArgs, hasTemplate, createImageElement } from '../common/index';
import { enableToolbarItems, rowHeightChanged, completeAction, beginAction, DialogBeforeOpenEventArgs } from '../common/index';
import { clearCopy, locateElem, selectRange, dialog, contentLoaded, tabSwitch, cMenuBeforeOpen, locale } from '../common/index';
import { getMaxHgt, setMaxHgt, setRowEleHeight, deleteImage, getRowIdxFromClientY, getColIdxFromClientX } from '../common/index';
import { Dialog } from '../services/index';
import { Deferred } from '@syncfusion/ej2-data';
import { BeforeOpenEventArgs } from '@syncfusion/ej2-popups';
import { refreshRibbonIcons, isCellReference, getColumn, isLocked as isCellLocked, FilterCollectionModel } from '../../workbook/index';
import {CellStyleExtendedModel, skipDefaultValue, getFilteredCollection, getColumnHeaderText, setChart } from '../../workbook/index';

/**
 * Represents clipboard support for Spreadsheet.
 */
export class Clipboard {
    private parent: Spreadsheet;
    private cutInfo: boolean;
    private externalMerge: boolean = false;
    private externalMergeRow: number;
    private copiedInfo: { range: number[], sId: number, isCut: boolean };
    private copiedShapeInfo: {
        pictureElem: HTMLElement, sId: number, sheetIdx: number, isCut: boolean,
        copiedRange: string, height: number, width: number, chartInfo: ChartModel
    };
    private copiedSheet: SheetModel;
    private copiedCell: number[];
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
        let ele: Element = this.getClipboardEle();
        this.parent.on(cut, this.cut, this);
        this.parent.on(copy, this.copy, this);
        this.parent.on(paste, this.paste, this);
        this.parent.on(clearCopy, this.clearCopiedInfo, this);
        this.parent.on(tabSwitch, this.tabSwitchHandler, this);
        this.parent.on(cMenuBeforeOpen, this.cMenuBeforeOpenHandler, this);
        this.parent.on(ribbonClick, this.ribbonClickHandler, this);
        this.parent.on(contentLoaded, this.initCopyIndicator, this);
        this.parent.on(rowHeightChanged, this.rowHeightChanged, this);
        EventHandler.add(ele, 'cut', this.cut, this);
        EventHandler.add(ele, 'copy', this.copy, this);
        EventHandler.add(ele, 'paste', this.paste, this);
    }

    private removeEventListener(): void {
        let ele: Element = this.getClipboardEle();
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
        }
        EventHandler.remove(ele, 'cut', this.cut);
        EventHandler.remove(ele, 'copy', this.copy);
        EventHandler.remove(ele, 'paste', this.paste);
    }

    private ribbonClickHandler(args: ClickEventArgs): void {
        let parentId: string = this.parent.element.id;
        switch (args.item.id) {
            case parentId + '_cut':
                this.cut({ isAction: true } as CopyArgs & ClipboardEvent);
                break;
            case parentId + '_copy':
                this.copy({ isAction: true } as CopyArgs & ClipboardEvent);
                break;
        }
        this.parent.element.focus();
    }

    private tabSwitchHandler(args: { activeTab: number }): void {
        if (args.activeTab === 0 && !this.copiedInfo && !this.copiedShapeInfo) { this.hidePaste(); }
    }

    private cMenuBeforeOpenHandler(e: { target: string }): void {
        let sheet: SheetModel = this.parent.getActiveSheet();
        let l10n: L10n = this.parent.serviceLocator.getService(locale);
        let delRowItems: string[] = []; let hideRowItems: string[] = [];
        let delColItems: string[] = []; let hideColItems: string[] = [];
        let actCell: string = sheet.activeCell;
        let actCellIndex: number[] = getCellIndexes(actCell);
        let cellObj: CellModel = getCell(actCellIndex[0], actCellIndex[1], sheet);
        let isLocked: boolean = sheet.isProtected && isCellLocked(cellObj, getColumn(sheet, actCellIndex[1]));
        if (e.target === 'Content' || e.target === 'RowHeader' || e.target === 'ColumnHeader') {
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
            let ele: HTMLElement = this.parent.element.getElementsByClassName('e-copy-indicator')[0] as HTMLElement;
            if (ele) {
                ele.style.top = `${parseInt(ele.style.top, 10) + args.threshold}px`;
            }
        }
    }

    private cut(args?: CopyArgs & ClipboardEvent): void {
        this.setCopiedInfo(args, true);
    }

    private copy(args?: CopyArgs & ClipboardEvent): void {
        this.copiedSheet = this.parent.getActiveSheet();
        this.setCopiedInfo(args, false);
    }

    private paste(args?: {
        range: number[], sIdx: number, type: PasteSpecialType, isClick?: boolean,
        isAction?: boolean, isInternal?: boolean
    } & ClipboardEvent): void {
        if (this.parent.isEdit) {
            return;
        }
        let rfshRange: number[];
        args.isAction = true;
        /* tslint:disable-next-line */
        let isExternal: DataTransfer | boolean = ((args && args.clipboardData) || window['clipboardData']);
        let copiedIdx: number = this.getCopiedIdx();
        let isCut: boolean;
        let copyInfo: { range: number[], sId: number, isCut: boolean } = Object.assign({}, this.copiedInfo);
        if (isExternal || this.copiedShapeInfo || (args.isInternal && this.copiedInfo)) {
            let cSIdx: number = (args && args.sIdx > -1) ? args.sIdx : this.parent.activeSheetIndex;
            let curSheet: SheetModel = getSheet(this.parent, cSIdx);
            let selIdx: number[] = getSwapRange(args && args.range || getRangeIndexes(curSheet.selectedRange));
            let rows: RowModel[] | { internal: boolean } = isExternal && this.getExternalCells(args);
            if (!args.isInternal && (rows as { internal: boolean }) && (rows as { internal: boolean }).internal) {
                isExternal = false;
                if (!this.copiedInfo) { return; }
            }
            if (isExternal && !(rows as RowModel[]).length) { // If image pasted
                return;
            }
            let cellLength: number = 0;
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
            let beginEventArgs: BeforePasteEventArgs = {
                requestType: 'paste',
                copiedInfo: this.copiedInfo,
                copiedRange: getRangeAddress(cIdx),
                pastedRange: getRangeAddress(rfshRange),
                type: (args && args.type) || 'All',
                cancel: false
            };
            if (args.isAction && !this.copiedShapeInfo && this.copiedInfo) {
                this.parent.notify(beginAction, { eventArgs: beginEventArgs, action: 'clipboard' });
            }
            if (beginEventArgs.cancel) {
                return;
            }
            let cell: CellModel;
            let isExtend: boolean; let prevCell: CellModel; let mergeCollection: MergeArgs[] = [];
            let prevSheet: SheetModel = getSheet(this.parent, isExternal ? cSIdx : copiedIdx);
            selIdx = getRangeIndexes(beginEventArgs.pastedRange);
            rowIdx = selIdx[0]; cIdx = isExternal
                ? [0, 0, (rows as RowModel[]).length - 1, cellLength - 1] : getSwapRange(this.copiedShapeInfo ?
                    getRangeIndexes(curSheet.selectedRange) : this.copiedInfo.range);
            isRepeative = (selIdx[2] - selIdx[0] + 1) % (cIdx[2] - cIdx[0] + 1) === 0 && (selIdx[3] - selIdx[1] + 1) %
                (cIdx[3] - cIdx[1] + 1) === 0;
            let mergeArgs: { range: number[], prevSheet?: SheetModel, cancel?: boolean } = {
                range: cIdx, prevSheet: prevSheet, cancel: false
            };
            rfshRange = isRepeative ? selIdx : [selIdx[0], selIdx[1]]
                .concat([selIdx[0] + cIdx[2] - cIdx[0], selIdx[1] + cIdx[3] - cIdx[1] || selIdx[1]]);
            let copiedAddress: string = getCellAddress(cIdx[0], cIdx[1]);
            let copiedIndex: number[] = getCellIndexes(copiedAddress);
            this.parent.notify(refreshRibbonIcons, copiedIndex);
            if (this.copiedShapeInfo && !this.copiedInfo) {
                let pictureElem: HTMLElement = this.copiedShapeInfo.pictureElem as HTMLElement;
                if (pictureElem.classList.contains('e-datavisualization-chart')) {
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
                let pastedCell: CellModel = getCell(rowIdx, selIdx[1], curSheet);
                if (pastedCell && !isNullOrUndefined(pastedCell.image)) {
                    let imgLen: number = pastedCell.image ? pastedCell.image.length - 1 : 0;
                    let eventArgs: Object = {
                        requestType: 'imagePaste',
                        copiedShapeInfo: this.copiedShapeInfo,
                        pasteSheetIndex: this.parent.activeSheetIndex,
                        pastedRange: getSheetName(this.parent) + '!' + getRangeAddress([rowIdx, selIdx[1], rowIdx, selIdx[1]]),
                        pastedPictureElement: document.getElementById(pastedCell.image[imgLen].id)
                    };
                    this.parent.notify(completeAction, { eventArgs: eventArgs, action: 'clipboard' });
                }
            } else {
                this.parent.notify(pasteMerge, mergeArgs);
                if (mergeArgs.cancel) { return; }
                let pasteType: string = beginEventArgs.type ? beginEventArgs.type : args.type;
                let cRows: RowModel[] = [];
                let inRange: boolean = this.isInRange(cIdx, selIdx);
                for (let i: number = cIdx[0], l: number = 0;  i <= cIdx[2]; i++, l++) {
                    if (inRange) {
                        cRows[selIdx[0] + l] = { cells: [] };
                    }
                    for (let j: number = cIdx[1], k: number = 0; j <= cIdx[3]; j++, k++) {
                        if (inRange) {
                            cRows[selIdx[0] + l].cells[selIdx[1] + k] = getCell(selIdx[0] + l, selIdx[1] + k, prevSheet);
                        }
                        cell = isExternal ? rows[i].cells[j] : Object.assign({}, (inRange && cRows[i] && cRows[i].cells[j])
                            ? cRows[i].cells[j] : getCell(i, j, prevSheet));
                        this.copiedCell = [i, j];
                        if (cell && args && args.type || pasteType) {
                            switch (pasteType) {
                                case 'Formats':
                                    cell = { format: cell.format, style: cell.style };
                                    break;
                                case 'Values':
                                    cell = { value: cell.value };
                                    if (cell.value && cell.value.toString().indexOf('\n') > -1) {
                                        let ele: Element = this.parent.getCell(selIdx[0], selIdx[1]);
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
                                for (let y: number = selIdx[1]; y <= selIdx[3]; y += (cIdx[3] - cIdx[1] + 1)) {
                                    prevCell = getCell(x + l, y + k, curSheet) || {};
                                    if (!this.externalMerge && prevCell.colSpan !== undefined || prevCell.rowSpan !== undefined) {
                                        mergeArgs = { range: [x + l, y + k, x + l, y + k] };
                                        let merge: MergeArgs = { range: mergeArgs.range, merge: false, isAction: false, type: 'All' };
                                        mergeCollection.push(merge);
                                        if (this.parent.activeSheetIndex === curSheet.index) {
                                            this.parent.notify(setMerge, merge);
                                        }
                                    }
                                    let colInd: number = y + k;
                                    if (this.externalMerge && this.externalMergeRow === x + l) {
                                        colInd = colInd + 1;
                                    } else {
                                        this.externalMerge = false;
                                    }
                                    let newFormula: string = this.isFormula([x + l, colInd]);
                                    if (!isNullOrUndefined(newFormula)) {
                                        cell.formula = newFormula;
                                    }
                                    this.setCell(x + l, colInd, curSheet, cell, isExtend);
                                    let sId : number = this.parent.activeSheetIndex;
                                    let cellElem: HTMLTableCellElement = this.parent.getCell(x + l, colInd) as HTMLTableCellElement;
                                    let address: string = getCellAddress(x + l, colInd);
                                    let cellArgs: Object = {
                                        address: this.parent.sheets[sId].name + '!' + address,
                                        requestType: 'paste',
                                        value : getCell(x + l, colInd, curSheet ) ? getCell(x + l, colInd, curSheet ).value : '',
                                        oldValue:  prevCell.value,
                                        element: cellElem,
                                        displayText: this.parent.getDisplayText(cell)
                                    };
                                    this.parent.trigger('cellSave', cellArgs);
                                }
                            }
                        } else {
                            if (!hasTemplate(this.parent, i, j, copiedIdx)) {
                                this.setCell(rowIdx, selIdx[1] + k, curSheet, cell, isExtend);
                            }
                        }
                        if (!isExternal && this.copiedInfo.isCut) {
                            this.setCell(i, j, prevSheet, null, false, true);
                        }
                    }
                    rowIdx++;
                }
                this.parent.setUsedRange(rfshRange[2] + 1, rfshRange[3]);
                if (cSIdx === this.parent.activeSheetIndex) {
                    this.parent.serviceLocator.getService<ICellRenderer>('cell').refreshRange(rfshRange);
                    this.parent.notify(selectRange, { indexes: rfshRange });
                }
                if (!isExternal && this.copiedInfo.isCut) {
                    isCut = this.copiedInfo.isCut;
                    if (copiedIdx === this.parent.activeSheetIndex) {
                        this.parent.serviceLocator.getService<ICellRenderer>('cell').refreshRange(cIdx);
                    }
                    this.clearCopiedInfo();
                    this.cutInfo = isCut;
                }
                if ((isExternal || inRange) && this.copiedInfo) {
                    this.clearCopiedInfo();
                }
                if (isExternal || (args && args.isAction)) {
                    this.parent.element.focus();
                }
                if (args.isAction) {
                    let sheetIndex: number = copyInfo && copyInfo.sId ? getSheetIndexFromId(this.parent, copyInfo.sId) :
                        this.parent.activeSheetIndex;
                    let eventArgs: Object = {
                        requestType: 'paste',
                        copiedInfo: copyInfo,
                        mergeCollection: mergeCollection,
                        pasteSheetIndex: this.parent.activeSheetIndex,
                        copiedRange: this.parent.sheets[sheetIndex].name + '!' + getRangeAddress(copyInfo && copyInfo.range ?
                            copyInfo.range : getRangeIndexes(this.parent.sheets[sheetIndex].selectedRange)),
                        pastedRange: getSheetName(this.parent) + '!' + getRangeAddress(rfshRange),
                        type: pasteType || 'All'
                    };
                    this.parent.notify(completeAction, { eventArgs: eventArgs, action: 'clipboard' });
                }
                if (isCut) {
                    this.updateFilter(copyInfo, rfshRange);
                    setMaxHgt(prevSheet, cIdx[0], cIdx[1], 20);
                    let hgt: number = getMaxHgt(prevSheet, cIdx[0]);
                    setRowEleHeight(this.parent, prevSheet, hgt, cIdx[0]);
                }
            }
        } else {
            this.getClipboardEle().select();
        }
    }

    private updateFilter(copyInfo: { range: number[], sId: number, isCut: boolean }, pastedRange: number[]): void {
        let isFilterCut: boolean;
        this.parent.notify(getFilteredCollection, null);
        for (let i: number = 0; i < this.parent.sheets.length; i++) {
            if (this.parent.filterCollection && this.parent.filterCollection[i] &&
                this.parent.filterCollection[i].sheetIdx === getSheetIndexFromId(this.parent, copyInfo.sId)) {
                let range: number[] = copyInfo.range;
                let fRange: number[] = getRangeIndexes(this.parent.filterCollection[i].filterRange);
                let endCol: string = getColumnHeaderText(range[3]);
                let fEndCol: string = getColumnHeaderText(fRange[3]);
                if ((fRange[0] === range[0] && fRange[1] === range[1] && endCol === fEndCol) ||
                    (fRange[0] === range[2] && fRange[1] === range[3] && endCol === fEndCol)) {
                    isFilterCut = true;
                }
            }
        }
        let cell: HTMLElement = this.parent.getCell(copyInfo.range[0], copyInfo.range[1]);
        cell = cell.querySelector('.e-filter-icon') ? cell : this.parent.getCell(copyInfo.range[2], copyInfo.range[3]);
        let asc: HTMLElement = cell.querySelector('.e-sortasc-filter');
        let desc: HTMLElement = cell.querySelector('.e-sortdesc-filter');
        if (isFilterCut) {
            for (let n: number = 0; n < this.parent.filterCollection.length; n++) {
                let filterCol: FilterCollectionModel = this.parent.filterCollection[n];
                let sheetIndex: number = copyInfo && copyInfo.sId ? getSheetIndexFromId(this.parent, copyInfo.sId) :
                    this.parent.activeSheetIndex;
                if (filterCol.sheetIdx === sheetIndex) {
                    this.parent.notify(initiateFilterUI, { predicates: null, range: filterCol.filterRange, sIdx: sheetIndex, isCut: true });
                }
                if (filterCol.sheetIdx === sheetIndex && sheetIndex === this.parent.activeSheetIndex) {
                    this.parent.notify(initiateFilterUI, { predicates: null, range: null, sIdx: null, isCut: true });
                    if (copyInfo.range[3] === copyInfo.range[1]) { // To update sorted icon after pasting.
                        let filteredCell: HTMLElement = this.parent.getCell(pastedRange[0], pastedRange[1]);
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

    private isInRange(cRng: number[], pRng: number[]): boolean {
        return inRange(cRng, pRng[0], pRng[1]) || inRange(cRng, pRng[2], pRng[3]);
    }

    private isFormula(selIdx: number[]): string {
        let cIdxValue: string; let cell: CellModel; let sheet: SheetModel;
        if (!isNullOrUndefined(this.copiedCell)) {
            sheet = !isNullOrUndefined(this.copiedSheet) ? this.copiedSheet : this.parent.getActiveSheet();
            cell = getCell(this.copiedCell[0], this.copiedCell[1], sheet);
            if (!isNullOrUndefined(cell)) {
                cIdxValue = cell.formula ? cell.formula.toUpperCase() : '';
            }
        }
        if (cIdxValue !== '' && !isNullOrUndefined(cIdxValue)) {
            if (cIdxValue.indexOf('=') === 0) {
                cIdxValue = cIdxValue.slice(1);
            }
            let start : number = cIdxValue.indexOf('(');
            let end: number =  cIdxValue.indexOf(')');
            if (start > -1 && end > -1) {
                cIdxValue = cIdxValue.slice(start + 1, end);
            }
            let difIndex: number[] = [];
            let formulaOperators: string[] = ['+', '-', '*', '/']; let splitArray: string[];
            let value: string = cIdxValue;
            for (let i: number = 0; i < formulaOperators.length; i++) {
                splitArray = value.split(formulaOperators[i]);
                value = splitArray.join(',');
            }
            splitArray = value.split(',');
            for (let j: number = 0; j < splitArray.length; j++) {
                if (isCellReference(splitArray[j])) {
                    let range: number[] = getCellIndexes(splitArray[j]);
                    let diff: number[] = [this.copiedCell[0] - range[0], this.copiedCell[1] - range[1]];
                    difIndex.push(diff[0]);
                    difIndex.push(diff[1]);
                }
            }
            let newAddress: string[] = [];
            for (let j: number = 0; j < difIndex.length; j++) {
                let address: string = getCellAddress(selIdx[0] - difIndex[0 + j], selIdx[1] - difIndex[1 + j]);
                newAddress.push(address);
                j++;
            }
            for (let a: number = 0; a < newAddress.length; a++) {
                if (isCellReference(newAddress[a])) {
                    let range: number[] = getRangeIndexes(newAddress[a]);
                    if (range[0] < 0 || range[1] < 0) {
                        newAddress[a] = '#REF!';
                    }
                } else {
                    newAddress[a] = '#REF!';
                }
            }
            cIdxValue = cell.formula.toUpperCase();
            for (let i: number = 0; i < splitArray.length; i++) {
                for (let j: number = 0; j < newAddress.length; j++) {
                    cIdxValue = cIdxValue.replace(splitArray[i].toUpperCase(), newAddress[j].toUpperCase());
                    i++;
                }
            }
            return cIdxValue;
        } else {
            return null;
        }
    }
    private setCell(rIdx: number, cIdx: number, sheet: SheetModel, cell: CellModel, isExtend?: boolean, isCut?: boolean): void {
        setCell(rIdx, cIdx, sheet, isCut ? null : cell, isExtend);
        if (cell && cell.formula) {
            this.parent.notify(workbookFormulaOperation, {
                action: 'refreshCalculate', value: isCut ? '' : cell.formula, rowIndex: rIdx,
                colIndex: cIdx, sheetIndex: this.parent.activeSheetIndex, isFormula: true
            });
        }
        if (cell && !cell.formula) {
            this.parent.notify(
                workbookEditOperation,
                {
                    action: 'updateCellValue', address: [rIdx, cIdx, rIdx,
                        cIdx], value: cell.value
                });
        }
        if (cell) {
            if (cell.style) {
                let style: CellStyleModel = {};
                if ((cell.style as CellStyleExtendedModel).properties) {
                    style = skipDefaultValue(cell.style, true);
                } else { style = cell.style; }
                this.parent.notify(applyCellFormat, {
                    style: extend({}, this.parent.commonCellStyle, style), rowIdx: rIdx, colIdx: cIdx, cell: null,
                    lastCell: null, row: null, hRow: null, isHeightCheckNeeded: true, manualUpdate: false
                });
            }
            if (cell.wrap) {
                this.parent.notify(wrapEvent, { range: [rIdx, cIdx, rIdx, cIdx], wrap: false, sheet: sheet });
            }
            if (cell.colSpan > 1) {
                setCell(rIdx, cIdx + cell.colSpan - 1, sheet, isCut ? null : {colSpan: -1}, isExtend);
                this.externalMerge = true;
                this.externalMergeRow = rIdx;
                this.parent.notify(setMerge, <MergeArgs>{ merge: true, range: [rIdx, cIdx, rIdx, cIdx + cell.colSpan - 1],
                    type: 'All', isAction: true, refreshRibbon: true });
            }
        }
    }

    private getEmptyStyle(cellStyle: CellStyleModel): CellStyleModel {
        let style: CellStyleModel = {};
        Object.keys(cellStyle).forEach((key: string) => {
            style[key] = '';
        });
        return style;
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

    private setCopiedInfo(args?: SetClipboardInfo & ClipboardEvent, isCut?: boolean): void {
        if (this.parent.isEdit) {
            return;
        }
        let deferred: Deferred = new Deferred();
        args.promise = deferred.promise;
        let sheet: ExtendedSheet = this.parent.getActiveSheet() as Sheet;
        let range: number[] = (args && args.range) || getRangeIndexes(sheet.selectedRange);
        let option: { sheet: SheetModel, indexes: number[], promise?: Promise<Cell> } = {
            sheet: sheet, indexes: [0, 0, sheet.rowCount - 1, sheet.colCount - 1], promise:
                new Promise((resolve: Function, reject: Function) => { resolve((() => { /** */ })()); })
        };
        let pictureElements: HTMLCollection = document.getElementsByClassName('e-ss-overlay-active');
        let pictureLen: number = pictureElements.length;
        if (sheet.isLocalData && !(args && args.clipboardData) && range[0] === 0 && range[2] === (sheet.rowCount - 1)) {
            this.parent.showSpinner();
            this.parent.notify('updateSheetFromDataSource', option);
        }
        option.promise.then(() => {
            if (pictureLen > 0) {
                let imgRowIdx: { clientY: number, isImage: Boolean } = {
                    clientY: (pictureElements[0] as HTMLElement).offsetTop,
                    isImage: true
                };
                this.parent.notify(getRowIdxFromClientY, imgRowIdx);
                let imgColIdx: { clientX: number, isImage: Boolean } = {
                    clientX: (pictureElements[0] as HTMLElement).offsetLeft,
                    isImage: true
                };
                this.parent.notify(getColIdxFromClientX, imgColIdx);
                this.copiedShapeInfo = {
                    sId: (args && args.sId) ? args.sId : sheet.id, sheetIdx: sheet.index, isCut: isCut, pictureElem:
                        pictureElements[0] as HTMLElement, copiedRange: getRangeAddress([imgRowIdx.clientY, imgColIdx.clientX,
                        imgRowIdx.clientY, imgColIdx.clientX]), height: (pictureElements[0] as HTMLElement).offsetHeight,
                        width: (pictureElements[0] as HTMLElement).offsetWidth,
                         chartInfo: this.getChartElemInfo(pictureElements[0] as HTMLElement, isCut)
                };
                this.hidePaste(true);
                if (isCut) {
                    if (pictureElements[0].classList.contains('e-datavisualization-chart')) {
                        this.parent.deleteChart(this.copiedShapeInfo.chartInfo.id);
                    } else {
                    this.parent.notify(deleteImage, {
                        id: this.copiedShapeInfo.pictureElem.id, sheetIdx: this.copiedShapeInfo.sId, range: this.copiedShapeInfo.copiedRange
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
                if (args && args.isAction) {
                    document.execCommand(isCut ? 'cut' : 'copy');
                }
                this.parent.hideSpinner();
            }
            if (Browser.isIE) {
                this.setExternalCells(args);
            }
            deferred.resolve();
        });
        if (args && args.clipboardData) {
            this.setExternalCells(args);
            this.parent.element.focus();
        }
    }

    private getChartElemInfo(overlayEle: HTMLElement, isCut: boolean): ChartModel {
        let chartColl: ChartModel[] = this.parent.chartColl;
        if (overlayEle.classList.contains('e-datavisualization-chart')) {
            let chartId: string = overlayEle.getElementsByClassName('e-control')[0].id;
            for (let idx: number = 0; idx < chartColl.length; idx++) {
                if (chartColl[idx].id === chartId) {
                    let chart: ChartModel = chartColl[idx];
                    return chart;
                }
            }
        }
        return null;
    }

    private clearCopiedInfo(): void {
        if (this.copiedInfo) {
            if (this.parent.getActiveSheet().id === this.copiedInfo.sId) {
                detach(this.parent.getMainContent().getElementsByClassName('e-copy-indicator')[0]);
            }
            this.copiedInfo = null;
            this.hidePaste();
        }
        if (this.copiedShapeInfo) {
            this.copiedShapeInfo = null;
            this.hidePaste();
        }
    }

    private initCopyIndicator(): void {
        if (this.copiedInfo && this.parent.getActiveSheet().id === this.copiedInfo.sId) {
            let copyIndicator: HTMLElement = this.parent.createElement('div', { className: 'e-copy-indicator' });
            copyIndicator.appendChild(this.parent.createElement('div', { className: 'e-top' }));
            copyIndicator.appendChild(this.parent.createElement('div', { className: 'e-bottom' }));
            copyIndicator.appendChild(this.parent.createElement('div', { className: 'e-left' }));
            copyIndicator.appendChild(this.parent.createElement('div', { className: 'e-right' }));
            locateElem(copyIndicator, this.copiedInfo.range, this.parent.getActiveSheet(), false);
            this.parent.getMainContent().appendChild(copyIndicator);
        }
    }

    private showDialog(): void {
        (this.parent.serviceLocator.getService(dialog) as Dialog).show({
            header: 'Spreadsheet',
            target: this.parent.element,
            height: 205, width: 340, isModal: true, showCloseIcon: true,
            content: (this.parent.serviceLocator.getService(locale) as L10n).getConstant('PasteAlert'),
            beforeOpen: (args: BeforeOpenEventArgs): void => {
                let dlgArgs: DialogBeforeOpenEventArgs = {
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

    private setExternalCells(args: ClipboardEvent): void {
        let cell: CellModel;
        let text: string = '';
        let range: number[] = this.copiedInfo.range;
        let sheet: SheetModel = this.parent.getActiveSheet();
        let data: string = '<html><body><table class="e-spreadsheet" xmlns="http://www.w3.org/1999/xhtml"><tbody>';
        for (let i: number = range[0]; i <= range[2]; i++) {
            data += '<tr>';
            for (let j: number = range[1]; j <= range[3]; j++) {
                cell = getCell(i, j, sheet);
                data += '<td style="white-space:' + ((cell && cell.wrap) ? 'normal' : 'nowrap') + ';vertical-align:bottom;';
                if (cell && cell.style) {
                    Object.keys(cell.style).forEach((style: string) => {
                        let regex: RegExpMatchArray = style.match(/[A-Z]/);
                        data += (style === 'backgroundColor' ? 'background' : (regex ? style.replace(regex[0], '-'
                            + regex[0].toLowerCase()) : style)) + ':' + ((style === 'backgroundColor' || style === 'color')
                                ? cell.style[style].slice(0, 7) : cell.style[style]) + ';';
                    });
                }
                data += '">';
                if (cell && cell.value) {
                    let eventArgs: { [key: string]: string | number | boolean } = {
                        formattedText: cell.value,
                        value: cell.value,
                        format: cell.format,
                        onLoad: true
                    };
                    if (cell.format) {
                        this.parent.notify(getFormattedCellObject, eventArgs);
                    }
                    data += eventArgs.formattedText;
                    text += eventArgs.formattedText;
                }
                data += '</td>';
                text += j === range[3] ? '' : '\t';
            }
            data += '</tr>';
            text += i === range[2] ? '' : '\n';
        }
        data += '</tbody></table></body></html>';
        if (Browser.isIE) {
            /* tslint:disable-next-line */
            window['clipboardData'].setData('text', text);
        } else {
            args.clipboardData.setData('text/html', data);
            args.clipboardData.setData('text/plain', text);
            args.preventDefault();
        }
    }

    private getExternalCells(args: ClipboardEvent): RowModel[] | { internal: boolean } {
        let html: string;
        let text: string;
        let rows: RowModel[] | { internal: boolean } = [];
        let cells: CellModel[] = [];
        let cellStyle: CellStyleModel;
        let ele: Element = this.parent.createElement('span');
        if (Browser.isIE) {
            /* tslint:disable-next-line */
            text = window['clipboardData'].getData('text');
        } else {
            html = args.clipboardData.getData('text/html');
            text = args.clipboardData.getData('text/plain');
            ele.innerHTML = html;
        }
        if (ele.querySelector('table')) {
            if (ele.querySelector('.e-spreadsheet')) {
                rows = { internal: true };
            } else {
                ele.querySelectorAll('tr').forEach((tr: Element) => {
                    tr.querySelectorAll('td').forEach((td: Element, j: number) => {
                        td.textContent = td.textContent.replace(/(\r\n|\n|\r)/gm, '');
                        let cSpan: number = isNaN(parseInt(td.getAttribute('colspan'), 10)) ? 1 : parseInt(td.getAttribute('colspan'), 10);
                        let rSpan: number = isNaN(parseInt(td.getAttribute('rowspan'), 10)) ? 1 : parseInt(td.getAttribute('rowspan'), 10);
                        cellStyle = this.getStyle(td, ele);
                        cells[j] = { value: td.textContent, style: cellStyle, colSpan: cSpan, rowSpan: rSpan };
                        if ((cellStyle as { whiteSpace: string }).whiteSpace) {
                            cells[j].wrap = true;
                        }
                    });
                    (rows as RowModel[]).push({ cells: cells });
                    cells = [];
                });
            }
        } else if (text) {
            if (html) {
                [].slice.call(ele.children).forEach((child: Element) => {
                    if (child.getAttribute('style')) {
                        cellStyle = this.getStyle(child, ele);
                    }
                });
            }
            text.trim().split('\n').forEach((row: string) => {
                row.split('\t').forEach((col: string, j: number) => {
                    cells[j] = { style: cellStyle };
                    if ((cellStyle as { whiteSpace: string }).whiteSpace) {
                        cells[j].wrap = true;
                    }
                    if (checkIsFormula(col)) {
                        cells[j].formula = col;
                    } else {
                        cells[j].value = col;
                    }
                });
                (rows as RowModel[]).push({ cells: cells });
                cells = [];
            });
        }
        setTimeout(() => { this.getClipboardEle().innerHTML = ''; }, 0);
        return rows;
    }

    private getStyle(td: Element, ele: Element): CellStyleModel {
        let styles: string[] = [];
        let cellStyle: CellStyleModel = {};
        if (td.classList.length || td.getAttribute('style')) {
            if (td.classList.length) {
                if (ele.querySelector('style').innerHTML.indexOf(td.classList[0]) > -1) {
                    styles.push(ele.querySelector('style').innerHTML.split(td.classList[0])[1].split('{')[1].split('}')[0]);
                }
            }
            if (td.getAttribute('style')) {
                styles.push(td.getAttribute('style'));
            }
            styles.forEach((styles: string) => {
                styles.split(';').forEach((style: string) => {
                    let char: string = style.split(':')[0].trim();
                    if (['font-family', 'vertical-align', 'text-align', 'text-indent', 'color', 'background', 'font-weight', 'font-style',
                        'font-size', 'text-decoration', 'border-bottom', 'border-top', 'border-right', 'border-left',
                        'border', 'white-space'].indexOf(char) > -1) {
                        char = char === 'background' ? 'backgroundColor' : char;
                        let regex: RegExpMatchArray = char.match(/-[a-z]/);
                        cellStyle[regex ? char.replace(regex[0], regex[0].charAt(1).toUpperCase()) : char] = style.split(':')[1];
                    }
                });
            });
        }
        return cellStyle;
    }

    private getClipboardEle(): HTMLInputElement {
        return this.parent.element.getElementsByClassName('e-clipboard')[0] as HTMLInputElement;
    }

    protected getModuleName(): string {
        return 'clipboard';
    }

    public destroy(): void {
        this.removeEventListener();
        let ele: HTMLInputElement = this.getClipboardEle();
        detach(ele);
        this.parent = null;
    }
}

interface CopyArgs {
    range?: number[];
    sIdx?: number;
    isAction?: boolean;
}

interface SetClipboardInfo {
    range?: number[];
    sId?: number;
    isAction?: boolean;
    promise?: Promise<Object>;
}