import { getColIdxFromClientX, getClientY, getClientX, selectAutoFillRange, setPosition, completeAction, showAggregate, dialog, locale, hideAutoFillOptions, performUndoRedo, hideAutoFillElement } from '../../spreadsheet/index';
import { Spreadsheet, contentLoaded, positionAutoFillElement, getCellPosition, getRowIdxFromClientY } from '../../spreadsheet/index';
import { performAutoFill, isLockedCells } from '../../spreadsheet/index';
import { ICellRenderer, editAlert, AutoFillEventArgs, FillRangeInfo } from '../common/index';
import { updateSelectedRange, isHiddenRow, setAutoFill, AutoFillType, AutoFillDirection, refreshCell, getFillInfo, getautofillDDB } from '../../workbook/index';
import { getRangeIndexes, getSwapRange, Workbook, getRowsHeight, getColumnsWidth, isInRange } from '../../workbook/index';
import { getCell, CellModel, SheetModel, getRangeAddress, isHiddenCol, beginAction } from '../../workbook/index';
import { addClass, isNullOrUndefined, L10n, removeClass } from '@syncfusion/ej2-base';
import { Dialog } from '../services';
import { ItemModel, MenuEventArgs } from '@syncfusion/ej2-navigations';
import { DropDownButton } from '@syncfusion/ej2-splitbuttons';

/**
 * AutoFill module allows to perform auto fill functionalities.
 */
export class AutoFill {
    private parent: Spreadsheet;
    private autoFillElement: HTMLElement;
    private autoFillElementPosition: { left: number, top: number };
    private autoFillCell: { rowIndex: number, colIndex: number };
    public autoFillDropDown: DropDownButton;
    private isVerticalFill: boolean;
    private fillOptionIndex: number = 0;
    constructor(parent: Spreadsheet) {
        this.parent = parent;
        this.addEventListener();
    }
    private getfillItems(): ItemModel[] {
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        return [
            { text: l10n.getConstant('CopyCells') },
            { text: l10n.getConstant('FillSeries') },
            { text: l10n.getConstant('FillFormattingOnly') },
            { text: l10n.getConstant('FillWithoutFormatting') }];
    }

    private createAutoFillElement(): void {
        if (this.parent.allowAutoFill) {
            const element: HTMLElement = this.parent.getMainContent();
            const ele: HTMLElement = this.parent.createElement('div', { className: 'e-autofill' });
            if (element.lastElementChild && element.lastElementChild.classList.contains('e-ss-overlay')) {
                element.insertBefore(ele, element.getElementsByClassName('e-ss-overlay')[0]);
            } else {
                element.appendChild(ele);
            }
            this.autoFillElement = ele;
            this.getautofillDDB({ id: this.parent.element.id + '_autofilloptionbtn', appendElem: element });
        }
    }

    private getautofillDDB(args: { id: string, appendElem: HTMLElement }): DropDownButton {
        const splitBtnElem: HTMLElement = this.parent.createElement('button', { id: args.id, className: 'e-filloption', attrs: { 'type': 'button' } });
        splitBtnElem.appendChild(this.parent.createElement('span', { className: 'e-tbar-btn-text' }));
        this.autoFillDropDown = new DropDownButton({
            cssClass: 'e-dragfill-ddb',
            iconCss: 'e-icons e-dragfill-icon',
            items: this.getfillItems(),
            createPopupOnClick: true,
            enableRtl: this.parent.enableRtl,
            select: (args: MenuEventArgs): void => {
                this.autoFillOptionClick({ type: this.getFillType(args.item.text) });
            },
            beforeOpen: (): void => this.autoFillClick()
        });
        this.autoFillDropDown.createElement = this.parent.createElement;
        this.autoFillDropDown.appendTo(splitBtnElem);
        args.appendElem.appendChild(splitBtnElem);
        return this.autoFillDropDown;
    }

    private getFillType(text: string): AutoFillType {
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        let type: AutoFillType;
        if (text === l10n.getConstant('CopyCells')) { type = 'CopyCells'; }
        else if (text === l10n.getConstant('FillSeries')) { type = 'FillSeries'; }
        else if (text === l10n.getConstant('FillFormattingOnly')) { type = 'FillFormattingOnly'; }
        else { type = 'FillWithoutFormatting'; }
        return type;
    }

    private autoFillClick(): void {
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        const fillInfo: { fillType: AutoFillType, disableItems: string[] } = { fillType: 'FillSeries', disableItems: [''] };
        this.parent.notify(getFillInfo, fillInfo);
        this.autoFillDropDown.setProperties({ 'items': this.getfillItems() }, true);
        this.autoFillDropDown.removeItems(fillInfo.disableItems);
        this.refreshAutoFillOption(l10n.getConstant(fillInfo.fillType));
    }

    private getFillRange(pStartCell: { rowIndex: number, colIndex: number }, pEndCell: { rowIndex: number, colIndex: number },
                         pFillCell: { rowIndex: number, colIndex: number }, direction: AutoFillDirection): number[] {
        switch (direction) {
        case 'Up':
            return [pFillCell.rowIndex, pStartCell.colIndex, pStartCell.rowIndex - 1, pEndCell.colIndex];
        case 'Right':
            return [pStartCell.rowIndex, pEndCell.colIndex + 1, pEndCell.rowIndex, pFillCell.colIndex];
        case 'Down':
            return [pEndCell.rowIndex + 1, pStartCell.colIndex, pFillCell.rowIndex, pEndCell.colIndex];
        case 'Left':
            return [pStartCell.rowIndex, pFillCell.colIndex, pEndCell.rowIndex, pStartCell.colIndex - 1];
        }
    }

    private autoFillOptionClick(args: { type: AutoFillType }): void {
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        const sheet: SheetModel = this.parent.getActiveSheet();
        const range: number[] = getSwapRange(getRangeIndexes(this.parent.selectionModule.dAutoFillCell));
        const currcell: number[] = getRangeIndexes(sheet.selectedRange);
        const minr: number = range[0]; const minc: number = range[1]; const maxr: number = range[2]; const maxc: number = range[3];
        const dir: AutoFillDirection = this.getDirection({ rowIndex: maxr, colIndex: maxc }, { rowIndex: currcell[2],
            colIndex: currcell[3] });
        const dataRange: number[] = [minr, minc, maxr, maxc];
        const fillRange: number[] = this.getFillRange({ rowIndex: minr, colIndex: minc }, { rowIndex: maxr, colIndex: maxc },
                                                      { rowIndex: currcell[2], colIndex: currcell[3] }, dir);
        this.refreshAutoFillOption(l10n.getConstant(args.type));
        this.parent.notify(performUndoRedo, { isUndo: true, isPublic: true, preventEvt: args.type === 'FillWithoutFormatting', preventReSelect: true });
        const eventArgs: { dataRange: string, fillRange: string, direction: AutoFillDirection, fillType: AutoFillType,
            isFillOptClick: boolean } = { dataRange: sheet.name + '!' + getRangeAddress(dataRange), fillRange:
            sheet.name + '!' + getRangeAddress(fillRange), direction: dir, fillType: args.type, isFillOptClick: true };
        this.isVerticalFill = eventArgs.direction === 'Down' || eventArgs.direction === 'Up';
        this.parent.notify(setAutoFill, eventArgs);
        this.positionAutoFillElement({ isautofill: true });
        const autoFillArgs: {
            dataRange: string,
            fillRange: string,
            direction: AutoFillDirection,
            fillType: AutoFillType,
            selectedRange: string
        } = { dataRange: eventArgs.dataRange, fillRange: eventArgs.fillRange, fillType: eventArgs.fillType, direction: eventArgs.direction, selectedRange: sheet.name + '!' + getRangeAddress(currcell) };
        this.parent.notify(completeAction, { eventArgs: autoFillArgs, action: 'autofill' });
        if (this.parent.showAggregate) {
            this.parent.notify(showAggregate, {});
        }
        this.autoFillClick();
    }

    private refreshAutoFillOption(type: string): void {
        for (let i: number = 0; i < this.autoFillDropDown.items.length; i++) {
            this.autoFillDropDown.items[i as number].iconCss = '';
        }
        for (let i: number = 0; i < this.autoFillDropDown.items.length; i++) {
            if (this.autoFillDropDown.items[i as number].text === type) {
                this.autoFillDropDown.items[i as number].iconCss = 'e-icons e-selected-icon';
            }
        }
        if (['Copy Cells', 'Fill Series', 'Fill Formatting Only', 'Fill Without Formatting'].indexOf(type) < 0) {
            this.autoFillDropDown.items[this.fillOptionIndex].iconCss = '';
        }
        this.autoFillDropDown.dataBind();
    }
    private positionAutoFillElement(args?: { isautofill?: boolean, preventAnimation?: boolean }): void {
        let top: number = 0; let left: number = 0;
        const sheet: SheetModel = this.parent.getActiveSheet();
        const indexes: number[] = getSwapRange(getRangeIndexes(sheet.selectedRange));
        let tdiff: number = -5;
        let ldiff: number = -5;
        let otdiff: number = 6;
        let oldiff: number = 6;
        const isRowSelected: boolean = (indexes[1] === 0 && indexes[3] === sheet.colCount - 1);
        const isColSelected: boolean = (indexes[0] === 0 && indexes[2] === sheet.rowCount - 1);
        let rowIdx: number = indexes[2];
        let colIdx: number = indexes[3];
        let height: number; let width: number;
        let pos: { top: number, left: number };
        const isRtl: boolean = this.parent.enableRtl;
        const cell: HTMLElement = this.parent.getCell(rowIdx, colIdx);
        if (isHiddenCol(sheet, indexes[3]) || isHiddenRow(sheet, indexes[2]) ||
            (cell && cell.classList.contains('e-formularef-selection')) || (sheet.isProtected && sheet.protectSettings.selectUnLockedCells
                && isLockedCells(this.parent, indexes))) {
            this.hideAutoFillElement();
            return;
        }
        if ((sheet.isProtected && (sheet.protectSettings.selectCells || sheet.protectSettings.selectUnLockedCells)) || !sheet.isProtected) {
            if (isRowSelected) {
                tdiff = -5;
                ldiff = -1;
                otdiff = 6;
                oldiff = 2;
                rowIdx = indexes[2];
                colIdx = indexes[1];
            }
            else if (isColSelected) {
                ldiff = -5;
                tdiff = 0;
                otdiff = 1;
                oldiff = 6;
                rowIdx = indexes[0];
                colIdx = indexes[3];
            }
            if (sheet.frozenColumns || sheet.frozenRows) {
                if (isColSelected || isRowSelected) {
                    setPosition(this.parent, this.autoFillElement, indexes, 'e-autofill', args && args.preventAnimation);
                    if (this.parent.autoFillSettings.showFillOptions && args && args.isautofill) {
                        setPosition(this.parent, this.autoFillDropDown.element, indexes, 'e-filloption');
                    }
                }
                else {
                    setPosition(
                        this.parent, this.autoFillElement, [rowIdx, colIdx, rowIdx, colIdx], 'e-autofill', args && args.preventAnimation);
                    if (this.parent.autoFillSettings.showFillOptions && args && args.isautofill) {
                        setPosition(this.parent, this.autoFillDropDown.element, [rowIdx, colIdx, rowIdx, colIdx], 'e-filloption');
                    }
                }
                if (this.autoFillElement) {
                    this.autoFillCell = { rowIndex: rowIdx, colIndex: colIdx };
                    const element: Element = this.parent.element.querySelectorAll('.e-autofill')[0];
                    if (element) {
                        const clientRect: ClientRect = element.getBoundingClientRect();
                        this.autoFillElementPosition = {
                            left: clientRect.left, top: clientRect.top
                        };

                    }
                }
            }
            else {
                pos = getCellPosition(
                    sheet, [rowIdx, colIdx, rowIdx, colIdx], this.parent.frozenRowCount(sheet), this.parent.frozenColCount(sheet),
                    this.parent.viewport.beforeFreezeHeight, this.parent.viewport.beforeFreezeWidth, this.parent.sheetModule.colGroupWidth);
                height = getRowsHeight(sheet, rowIdx, rowIdx, true);
                width = getColumnsWidth(sheet, colIdx, colIdx, true);
                if (!isColSelected) { top += height; }
                if (!isRowSelected) { left += width; }
                top += Math.round(pos.top) + tdiff;
                left += Math.round(pos.left) + ldiff;
                if (this.autoFillElement) {
                    removeClass([this.autoFillElement], 'e-hide');
                    this.autoFillElement.style.top = top + 'px';
                    if (isRtl) {
                        this.autoFillElement.style.right = left + 'px';
                    } else {
                        this.autoFillElement.style.left = left + 'px';
                    }
                    this.autoFillCell = { rowIndex: rowIdx, colIndex: colIdx };
                    const clientRect: ClientRect = this.autoFillElement.getBoundingClientRect();
                    this.autoFillElementPosition = {
                        left: clientRect.left, top: clientRect.top
                    };
                    if (this.parent.autoFillSettings.showFillOptions && args && args.isautofill) {
                        removeClass([this.autoFillDropDown.element], 'e-hide');
                        this.autoFillDropDown.element.style.top = top + otdiff + 'px';
                        if (isRtl) {
                            this.autoFillDropDown.element.style.right = left + oldiff + 'px';
                        } else {
                            this.autoFillDropDown.element.style.left = left + oldiff + 'px';
                        }
                    }
                }
            }
        }
    }

    private hideAutoFillElement(): void {
        const elem: Element = this.parent.element;
        [].slice.call(elem.querySelectorAll('.e-autofill')).forEach((optElem: Element) => {
            if (elem) {
                addClass([optElem], 'e-hide');
            }
        });
    }

    private hideAutoFillOptions(): void {
        const elem: Element = this.parent.element;
        [].slice.call(elem.querySelectorAll('.e-filloption')).forEach((optElem: Element) => {
            if (elem) {
                addClass([optElem], 'e-hide');
            }
        });
    }



    private selectAutoFillRange(args: { e: MouseEvent & TouchEvent, indexes?: number[] }): number[] {
        const rowObj: { clientY: number; target: Element; } = { clientY: getClientY(args.e), target: args.e.target as Element };
        const colObj: { clientX: number; target: Element; } = { clientX: getClientX(args.e), target: args.e.target as Element };
        const sheet: SheetModel = this.parent.getActiveSheet();
        this.parent.notify(getRowIdxFromClientY, rowObj);
        this.parent.notify(getColIdxFromClientX, colObj);
        let rangeIndexes: number[];
        const autofillRange: FillRangeInfo = this.getAutoFillRange({ rowIndex: rowObj.clientY, colIndex: colObj.clientX });
        if (autofillRange && autofillRange.fillRange) {
            rangeIndexes = [autofillRange.startCell.rowIndex, autofillRange.startCell.colIndex, autofillRange.endCell.rowIndex,
                autofillRange.endCell.colIndex];
        } else {
            rangeIndexes = getRangeIndexes(sheet.selectedRange);
        }
        args.indexes = rangeIndexes;
        return rangeIndexes;
    }

    private getAutoFillRange(idx: { colIndex: number, rowIndex: number }): FillRangeInfo {
        const sheet: SheetModel = this.parent.getActiveSheet();
        const aCell: { rowIndex: number; colIndex: number; } = this.autoFillCell;
        const range: number[] = getSwapRange(getRangeIndexes(sheet.selectedRange));
        const minr: number = range[0];
        const minc: number = range[1];
        const maxr: number = range[2];
        const maxc: number = range[3];
        const inRange: boolean = isInRange(range, [idx.rowIndex, idx.colIndex, idx.rowIndex, idx.colIndex], true);
        const minIdx: { colIndex: number, rowIndex: number } = { rowIndex: minr, colIndex: minc };
        const scell: { colIndex: number, rowIndex: number } = { rowIndex: range[0], colIndex: range[1] };
        const ecell: { colIndex: number, rowIndex: number } = { rowIndex: range[2], colIndex: range[3] };
        const maxIdx: { colIndex: number, rowIndex: number } = { rowIndex: maxr, colIndex: maxc };
        const modifiedIdx: { colIndex: number, rowIndex: number } = this.modifyRangeForMerge(
            idx.rowIndex, idx.colIndex, aCell.rowIndex, aCell.colIndex, range);
        if (idx.rowIndex < aCell.rowIndex) {// up
            if ((minr - idx.rowIndex > idx.colIndex - maxc) && (minr - idx.rowIndex > minc - idx.colIndex))
            {
                return inRange ? { startCell: minIdx, endCell: { rowIndex: idx.rowIndex, colIndex: maxc } } : { startCell: maxIdx, endCell:
                    { rowIndex: modifiedIdx.rowIndex, colIndex: minc }, fillRange: [modifiedIdx.rowIndex, minc, minr - 1, maxc], direction: 'Up' };
            }
            else if (idx.colIndex > aCell.colIndex) {
                return { startCell: minIdx, endCell: { rowIndex: maxr, colIndex: idx.colIndex },
                    fillRange: [minr, maxc + 1, maxr, idx.colIndex], direction: 'Right' };
            }
            else if (idx.colIndex < aCell.colIndex) {
                return inRange ? { startCell: minIdx, endCell: maxIdx } : { startCell: maxIdx, endCell:
                    { rowIndex: minr, colIndex: idx.colIndex }, fillRange: [minr, idx.colIndex, maxr, minc - 1], direction: 'Left' };
            }
            else { return { startCell: scell, endCell: ecell }; }
        }
        else if (idx.colIndex > aCell.colIndex) {// right
            if ((idx.rowIndex - maxr > idx.colIndex - maxc)) {
                return { startCell: minIdx, endCell: { rowIndex: idx.rowIndex, colIndex: maxc },
                    fillRange: [maxr + 1, minc, idx.rowIndex, maxc], direction: 'Down' };
            }
            else {
                return { startCell: minIdx, endCell: { rowIndex: maxr, colIndex: modifiedIdx.colIndex },
                    fillRange: [minr, maxc + 1, maxr, modifiedIdx.colIndex], direction: 'Right' };
            }
        }

        else if (idx.colIndex < aCell.colIndex) { // left
            if ((idx.rowIndex - maxr > maxc - idx.colIndex) || ((idx.rowIndex - minr > maxc - idx.colIndex) && idx.rowIndex !== maxr)) {
                return { startCell: minIdx, endCell: { rowIndex: idx.rowIndex, colIndex: maxc },
                    fillRange: [maxr + 1, minc, idx.rowIndex, maxc], direction: 'Down' };
            }
            else {
                return inRange ? { startCell: minIdx, endCell: maxIdx } : { startCell: maxIdx, endCell:
                    { rowIndex: minr, colIndex: modifiedIdx.colIndex }, fillRange: [minr, modifiedIdx.colIndex, maxr, minc - 1], direction: 'Left' };
            }
        }
        else if (idx.rowIndex > aCell.rowIndex) {// down
            return { startCell: minIdx, endCell: { rowIndex: modifiedIdx.rowIndex, colIndex: maxc },
                fillRange: [maxr + 1, minc, modifiedIdx.rowIndex, maxc], direction: 'Down' };
        }
        else if (idx.rowIndex === aCell.rowIndex && idx.colIndex === aCell.colIndex) {
            return { startCell: scell, endCell: ecell };
        }
        else {
            return { startCell: scell, endCell: ecell };
        }
    }

    private modifyRangeForMerge(
        rowIdx: number, colIdx: number, autoFillRowIdx: number, autoFillColIdx: number,
        selRange: number[]): { colIndex: number, rowIndex: number } {
        const modifiedIdx: { colIndex: number, rowIndex: number } = { rowIndex: rowIdx, colIndex: colIdx };
        if (this.isMergedRange(selRange)) {
            const selRowCount: number = selRange[2] - selRange[0] + 1;
            const selColCount: number = selRange[3] - selRange[1] + 1;
            let remainder: number;
            if (rowIdx < autoFillRowIdx) { // up
                remainder = (selRange[2] - rowIdx + 1) % selRowCount;
                if (remainder && rowIdx - (selRowCount - remainder) >= 0) {
                    modifiedIdx.rowIndex = rowIdx - (selRowCount - remainder);
                }
            }
            else if (colIdx > autoFillColIdx) { // right
                remainder = (colIdx - selRange[1] + 1) % selColCount;
                if (remainder) {
                    modifiedIdx.colIndex = colIdx + (selColCount - remainder);
                }
            }
            else if (colIdx < autoFillColIdx) { // left
                remainder = (selRange[3] - colIdx + 1) % selColCount;
                if (remainder && colIdx - (selColCount - remainder) >= 0) {
                    modifiedIdx.colIndex = colIdx - (selColCount - remainder);
                }
            }
            else if (rowIdx > autoFillRowIdx) { // down
                remainder = (rowIdx - selRange[0] + 1) % selRowCount;
                if (remainder) {
                    modifiedIdx.rowIndex = rowIdx + (selRowCount - remainder);
                }
            }
        }
        return modifiedIdx;
    }

    private performAutoFill(
        args: { event?: MouseEvent & TouchEvent, dAutoFillCell: string, fillType?: AutoFillType, rangeInfo?: FillRangeInfo }): void {
        if (args.rangeInfo || !(args.event.clientX > this.autoFillElementPosition.left && args.event.clientX < this.autoFillElementPosition.left + 10) ||
            !(args.event.clientY > this.autoFillElementPosition.top && args.event.clientY < this.autoFillElementPosition.top + 10)) {
            let autofillRange: FillRangeInfo;
            if (args.rangeInfo) {
                autofillRange = args.rangeInfo;
            } else {
                const rowObj: { clientY: number; target: Element; } = { clientY: getClientY(args.event), target: args.event.target as Element };
                const colObj: { clientX: number; target: Element; } = { clientX: getClientX(args.event), target: args.event.target as Element };
                this.parent.notify(getRowIdxFromClientY, rowObj);
                this.parent.notify(getColIdxFromClientX, colObj);
                autofillRange = this.getAutoFillRange({ rowIndex: rowObj.clientY, colIndex: colObj.clientX });
            }
            const sheet: SheetModel = this.parent.getActiveSheet();
            if (autofillRange && autofillRange.fillRange) {
                const eventArgs: AutoFillEventArgs = {
                    dataRange: sheet.name + '!' + args.dAutoFillCell,
                    fillRange: sheet.name + '!' + getRangeAddress(autofillRange.fillRange), direction: autofillRange.direction,
                    fillType: args.fillType || this.parent.autoFillSettings.fillType, cancel: false
                };
                this.parent.notify(beginAction, { eventArgs: eventArgs, action: 'autofill' });
                if (eventArgs.cancel) {
                    return;
                }
                const isLockedCell: boolean = isLockedCells(this.parent, autofillRange.fillRange);
                if (sheet.isProtected && isLockedCell) {
                    this.parent.notify(editAlert, null);
                    return;
                }
                if (args.rangeInfo) {
                    this.performAutoFillAction(eventArgs, null, isLockedCell);
                } else {
                    this.performAutoFillAction(eventArgs, autofillRange, isLockedCell);
                    this.positionAutoFillElement({ isautofill: true });
                }
            }
        } else {
            this.positionAutoFillElement({ isautofill: false });
        }
    }

    private refreshCell(options: { rowIndex: number, colIndex: number }): void {
        this.parent.serviceLocator.getService<ICellRenderer>('cell').refreshRange([options.rowIndex, options.colIndex, options.rowIndex, options.colIndex]);
    }

    private getDirection(endCell: { rowIndex: number, colIndex: number }, currcell: { rowIndex: number, colIndex: number },
                         isVerticalFill?: boolean): AutoFillDirection {
        isVerticalFill = isNullOrUndefined(isVerticalFill) ? this.isVerticalFill : isVerticalFill;
        if (isVerticalFill) {
            if (currcell.rowIndex < endCell.rowIndex) { // up
                return 'Up';
            }
            else if (currcell.rowIndex > endCell.rowIndex) {// down
                return 'Down';
            }
            else if (currcell.colIndex > endCell.colIndex) {// right
                return 'Right';
            }
            else if (currcell.colIndex < endCell.colIndex) {// left
                return 'Left';
            }
        }
        else {
            if (currcell.colIndex > endCell.colIndex) {// right
                return 'Right';
            }
            else if (currcell.colIndex < endCell.colIndex) {// left
                return 'Left';
            }
            else if (currcell.rowIndex < endCell.rowIndex) {// up
                return 'Up';
            }
            else if (currcell.rowIndex > endCell.rowIndex) {// down
                return 'Down';
            }
        }
        return null;
    }

    private performAutoFillAction(args: AutoFillEventArgs, autoFillRange?: FillRangeInfo, isLockedCell?: boolean): void {
        const sheet: SheetModel = this.parent.getActiveSheet();
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        if (this.isMergedRange(getRangeIndexes(args.fillRange))) {
            const dialogInst: Dialog = this.parent.serviceLocator.getService(dialog) as Dialog;
            dialogInst.show({
                isModal: true, showCloseIcon: true, height: 180, width: 400, content: l10n.getConstant('AutoFillMergeAlertMsg'),
                buttons: [{
                    buttonModel: { content: (this.parent.serviceLocator.getService(locale) as L10n).getConstant('Ok'), isPrimary: true },
                    click: (): void => { dialogInst.hide(); this.parent.selectRange(args.dataRange); }
                }],
                close: (): void => { dialogInst.hide(); this.parent.selectRange(args.dataRange); }
            }, false);
            return;
        }
        this.isVerticalFill = args.direction === 'Down' || args.direction === 'Up';
        this.parent.notify(setAutoFill, {
            dataRange: args.dataRange,
            fillRange: args.fillRange, direction: args.direction, fillType: args.fillType, isLockedCell: isLockedCell
        });
        const selRange: string = autoFillRange ? getRangeAddress([autoFillRange.startCell.rowIndex, autoFillRange.startCell.colIndex,
            autoFillRange.endCell.rowIndex, autoFillRange.endCell.colIndex]) : sheet.selectedRange;
        updateSelectedRange(this.parent as Workbook, selRange, sheet);
        const autoFillArgs: {
            dataRange: string,
            fillRange: string,
            direction: AutoFillDirection,
            fillType: AutoFillType,
            selectedRange: string
        } = { dataRange: args.dataRange, fillRange: args.fillRange, fillType: args.fillType, direction: args.direction,
            selectedRange: selRange };
        this.parent.notify(completeAction, { eventArgs: autoFillArgs, action: 'autofill' });
        if (this.parent.showAggregate) {
            this.parent.notify(showAggregate, {});
        }
    }

    private getRangeData(options: { range: number[], sheetIdx: number }): CellModel[] {
        const arr: CellModel[] = [];
        const sheet: SheetModel = this.parent.getActiveSheet();
        let minr: number = options.range[0];
        let minc: number = options.range[1];
        const maxr: number = options.range[2];
        const maxc: number = options.range[3];
        const minCol: number = minc;
        let cell: CellModel;
        while (minr <= maxr) {
            if (isHiddenRow(sheet, minr)) { minr++; continue; }
            minc = minCol;
            while (minc <= maxc) {
                if (isHiddenCol(sheet, minc)) { minc++; continue; }
                cell = getCell(minr, minc, sheet);
                arr.push(cell);
                minc++;
            }
            minr++;
        }
        return arr;
    }

    private isMergedRange(range: number[]): boolean {
        let i: number = 0;
        const data: CellModel[] = this.getRangeData({ range: range, sheetIdx: this.parent.activeSheetIndex });
        for (i = 0; i < data.length; i++) {
            if (data[i as number] && (data[i as number].rowSpan || data[i as number].colSpan)) {
                return true;
            }
        }
        return false;
    }

    private addEventListener(): void {
        this.parent.on(contentLoaded, this.createAutoFillElement, this);
        this.parent.on(positionAutoFillElement, this.positionAutoFillElement, this);
        this.parent.on(hideAutoFillOptions, this.hideAutoFillOptions, this);
        this.parent.on(hideAutoFillElement, this.hideAutoFillElement, this);
        this.parent.on(performAutoFill, this.performAutoFill, this);
        this.parent.on(selectAutoFillRange, this.selectAutoFillRange, this);
        this.parent.on(refreshCell, this.refreshCell, this);
        this.parent.on(getautofillDDB, this.getautofillDDB, this);
    }

    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(contentLoaded, this.createAutoFillElement);
            this.parent.off(positionAutoFillElement, this.positionAutoFillElement);
            this.parent.off(hideAutoFillOptions, this.hideAutoFillOptions);
            this.parent.off(hideAutoFillElement, this.hideAutoFillElement);
            this.parent.off(performAutoFill, this.performAutoFill);
            this.parent.off(selectAutoFillRange, this.selectAutoFillRange);
            this.parent.off(refreshCell, this.refreshCell);
            this.parent.off(getautofillDDB, this.getautofillDDB);
        }
    }

    /**
     * Destroy AutoFill module.
     *
     * @returns {void} - Destroy auto fill module.
     */

    public destroy(): void {
        this.removeEventListener();
        this.autoFillElement = null;
        this.autoFillElementPosition = null;
        this.autoFillCell = null;
        this.autoFillDropDown = null;
        this.isVerticalFill = null;
        this.fillOptionIndex = null;
        this.parent = null;
    }
    /**
     * Get the AutoFill module name.
     *
     * @returns {string} - Get the auto fill module name.
     */
    public getModuleName(): string {
        return 'autofill';
    }
}
