import { detach, EventHandler, Browser, extend, L10n } from '@syncfusion/ej2-base';
import { ClickEventArgs } from '@syncfusion/ej2-navigations';
import { Spreadsheet } from '../base/index';
import { SheetModel, getRangeIndexes, getCell, setCell, getSheet, CellModel, getSwapRange, wrapEvent } from '../../workbook/index';
import { CellStyleModel, getRangeAddress, workbookEditOperation } from '../../workbook/index';
import { RowModel, getFormattedCellObject, workbookFormulaOperation, applyCellFormat, checkIsFormula, Sheet } from '../../workbook/index';
import { ExtendedSheet, Cell } from '../../workbook/index';
import { ribbonClick, ICellRenderer, cut, copy, paste, PasteSpecialType, BeforePasteEventArgs, hasTemplate } from '../common/index';
import { enableToolbarItems, rowHeightChanged, completeAction, beginAction } from '../common/index';
import { clearCopy, locateElem, selectRange, dialog, contentLoaded, tabSwitch, cMenuBeforeOpen, locale } from '../common/index';
import { Dialog } from '../services/index';
import { Deferred } from '@syncfusion/ej2-data';

/**
 * Represents clipboard support for Spreadsheet.
 */
export class Clipboard {
    private parent: Spreadsheet;
    private copiedInfo: { range: number[], sId: number, isCut: boolean };

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
        if (args.activeTab === 0 && !this.copiedInfo) { this.hidePaste(); }
    }

    private cMenuBeforeOpenHandler(e: { target: string }): void {
        let sheet: SheetModel = this.parent.getActiveSheet();
        let l10n: L10n = this.parent.serviceLocator.getService(locale);
        if (e.target === 'Content' || e.target === 'RowHeader' || e.target === 'ColumnHeader') {
            this.parent.enableContextMenuItems(
                [l10n.getConstant('Paste'), l10n.getConstant('PasteSpecial')], (this.copiedInfo && !sheet.isProtected) ? true : false);
            this.parent.enableContextMenuItems([l10n.getConstant('Cut')], (!sheet.isProtected) ? true : false);
        }
        if ((e.target === 'Content') && sheet.isProtected) {
            this.parent.enableContextMenuItems (
                [l10n.getConstant('Cut'), l10n.getConstant('Filter'), l10n.getConstant('Sort')], false);
        }
        if ((e.target === 'Content') && (sheet.isProtected && !sheet.protectSettings.insertLink)) {
            this.parent.enableContextMenuItems([l10n.getConstant('Hyperlink')], false);
        }
    }

    private rowHeightChanged(args: { rowIdx: number, threshold: number }): void {
        if (this.copiedInfo && this.copiedInfo.range[0] > args.rowIdx) {
            let ele: HTMLElement = this.parent.element.getElementsByClassName('e-copy-indicator')[0] as HTMLElement;
            ele.style.top = `${parseInt(ele.style.top, 10) + args.threshold}px`;
        }
    }

    private cut(args?: CopyArgs & ClipboardEvent): void {
        this.setCopiedInfo(args, true);
    }

    private copy(args?: CopyArgs & ClipboardEvent): void {
        this.setCopiedInfo(args, false);
    }

    private paste(args?: {
        range: number[], sIdx: number, type: PasteSpecialType, isClick?: boolean,
        isAction?: boolean
    } & ClipboardEvent): void {
        if (this.parent.isEdit) {
            if (args as ClipboardEvent && (args as ClipboardEvent).type) {
                args.preventDefault();
                document.getElementById(this.parent.element.id + '_edit').focus();
                return;
            }
        }
        let rfshRange: number[];
        /* tslint:disable-next-line */
        let isExternal: DataTransfer = !this.copiedInfo && ((args && args.clipboardData) || window['clipboardData']);
        let copiedIdx: number = this.getCopiedIdx();
        let copyInfo: { range: number[], sId: number, isCut: boolean } = Object.assign({}, this.copiedInfo);
        if (this.copiedInfo || isExternal) {
            let cSIdx: number = (args && args.sIdx > -1) ? args.sIdx : this.parent.activeSheetTab - 1;
            let curSheet: SheetModel = getSheet(this.parent, cSIdx);
            let selIdx: number[] = getSwapRange(args && args.range || getRangeIndexes(curSheet.selectedRange));
            let rows: RowModel[] = isExternal && this.getExternalCells(args);
            if (isExternal && !rows.length) { // If image pasted
                return;
            }
            let rowIdx: number = selIdx[0]; let cIdx: number[] = isExternal
                ? [0, 0, rows.length - 1, rows[0].cells.length - 1] : getSwapRange(this.copiedInfo.range);
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
            if (args.isAction) {
                this.parent.notify(beginAction, { eventArgs: beginEventArgs, action: 'clipboard' });
            }
            if (beginEventArgs.cancel) {
                return;
            }
            let cell: CellModel;
            let isExtend: boolean;
            let prevSheet: SheetModel = getSheet(this.parent, isExternal ? cSIdx : copiedIdx);

            selIdx = getRangeIndexes(beginEventArgs.pastedRange);
            rowIdx = selIdx[0]; cIdx = isExternal
                ? [0, 0, rows.length - 1, rows[0].cells.length - 1] : getSwapRange(this.copiedInfo.range);
            isRepeative = (selIdx[2] - selIdx[0] + 1) % (cIdx[2] - cIdx[0] + 1) === 0
                && (selIdx[3] - selIdx[1] + 1) % (cIdx[3] - cIdx[1] + 1) === 0;
            rfshRange = isRepeative ? selIdx : [selIdx[0], selIdx[1]]
                .concat([selIdx[0] + cIdx[2] - cIdx[0], selIdx[1] + cIdx[3] - cIdx[1] || selIdx[1]]);
            for (let i: number = cIdx[0], l: number = 0; i <= cIdx[2]; i++ , l++) {
                for (let j: number = cIdx[1], k: number = 0; j <= cIdx[3]; j++ , k++) {
                    cell = isExternal ? rows[i].cells[j] : Object.assign({}, getCell(i, j, prevSheet));
                    if (cell && args && args.type) {
                        switch (args.type) {
                            case 'Formats':
                                cell = { format: cell.format, style: cell.style };
                                break;
                            case 'Values':
                                cell = { value: cell.value };
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
                                this.setCell(x + l, y + k, curSheet, cell, isExtend);
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
            if (cSIdx === this.parent.activeSheetTab - 1) {
                this.parent.serviceLocator.getService<ICellRenderer>('cell').refreshRange(rfshRange);
                this.parent.notify(selectRange, rfshRange);
            }
            if (!isExternal && this.copiedInfo.isCut) {
                if (copiedIdx === this.parent.activeSheetTab - 1) {
                    this.parent.serviceLocator.getService<ICellRenderer>('cell').refreshRange(cIdx);
                }
                this.clearCopiedInfo();
            }
            if (isExternal || (args && args.isAction)) {
                this.parent.element.focus();
            }
            if (args.isAction) {
                let cSID: number = copyInfo && copyInfo.sId ? copyInfo.sId : this.parent.activeSheetTab;
                let copyRange: number[] = copyInfo &&
                    copyInfo.range ? copyInfo.range : getRangeIndexes(this.parent.sheets[cSID - 1].selectedRange);
                let eventArgs: Object = {
                    requestType: 'paste',
                    copiedInfo: copyInfo,
                    pasteSheetIdx: this.parent.activeSheetTab,
                    copiedRange: this.parent.sheets[cSID - 1].name + '!' + getRangeAddress(copyRange),
                    pastedRange: this.parent.sheets[this.parent.activeSheetTab - 1].name + '!' + getRangeAddress(rfshRange),
                    type: (args && args.type) || 'All'
                };
                this.parent.notify(completeAction, { eventArgs: eventArgs, action: 'clipboard' });
            }
        } else {
            this.getClipboardEle().select();
        }

    }

    private setCell(rIdx: number, cIdx: number, sheet: SheetModel, cell: CellModel, isExtend?: boolean, isCut?: boolean): void {
        setCell(rIdx, cIdx, sheet, isCut ? null : cell, isExtend);
        if (cell && cell.formula) {
            this.parent.notify(workbookFormulaOperation, {
                action: 'refreshCalculate', value: isCut ? '' : cell.formula, rowIndex: rIdx,
                colIndex: cIdx, sheetIndex: this.parent.activeSheetTab, isFormula: true
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
        if (isCut && cell) {
            if (cell.style) {
                this.parent.notify(applyCellFormat, {
                    style: extend({}, this.getEmptyStyle(cell.style), this.parent.commonCellStyle), rowIdx: rIdx, colIdx: cIdx, cell: null,
                    lastCell: null, row: null, hRow: null, isHeightCheckNeeded: true, manualUpdate: false
                });
            }
            if (cell.wrap) {
                this.parent.notify(wrapEvent, { range: [rIdx, cIdx, rIdx, cIdx], wrap: false, sheet: sheet });
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
        if (sheet.isLocalData && !(args && args.clipboardData) && range[0] === 0 && range[2] === (sheet.rowCount - 1)) {
            this.parent.showSpinner();
            this.parent.notify('updateSheetFromDataSource', option);
        }
        option.promise.then(() => {
            if (!(args && args.clipboardData)) {
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

    private clearCopiedInfo(): void {
        if (this.copiedInfo) {
            if (this.parent.getActiveSheet().id === this.copiedInfo.sId) {
                detach(this.parent.getMainContent().getElementsByClassName('e-copy-indicator')[0]);
            }
            this.copiedInfo = null;
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
            locateElem(copyIndicator, this.copiedInfo.range, this.parent.getActiveSheet());
            this.parent.getMainContent().appendChild(copyIndicator);
        }
    }

    private showDialog(): void {
        (this.parent.serviceLocator.getService(dialog) as Dialog).show({
            header: 'Spreadsheet',
            target: this.parent.element,
            height: 205, width: 340, isModal: true, showCloseIcon: true,
            content: (this.parent.serviceLocator.getService(locale) as L10n).getConstant('PasteAlert')
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
        let data: string = '<html><body><table xmlns="http://www.w3.org/1999/xhtml"><tbody>';
        for (let i: number = range[0]; i <= range[2]; i++) {
            data += '<tr>';
            for (let j: number = range[1]; j <= range[3]; j++) {
                data += '<td style="white-space:nowrap;vertical-align:bottom;';
                cell = getCell(i, j, sheet);
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

    private getExternalCells(args: ClipboardEvent): RowModel[] {
        let html: string;
        let text: string;
        let rows: RowModel[] = [];
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
            ele.querySelectorAll('tr').forEach((tr: Element) => {
                tr.querySelectorAll('td').forEach((td: Element, j: number) => {
                    cells[j] = { value: td.textContent, style: this.getStyle(td, ele) };
                });
                rows.push({ cells: cells });
                cells = [];
            });
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
                    if (checkIsFormula(col)) {
                        cells[j].formula = col;
                    } else {
                        cells[j].value = col;
                    }
                });
                rows.push({ cells: cells });
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
                styles.push(ele.querySelector('style').innerHTML.split(td.classList[0])[1].split('{')[1].split('}')[0]);
            }
            if (td.getAttribute('style')) {
                styles.push(td.getAttribute('style'));
            }
            styles.forEach((styles: string) => {
                styles.split(';').forEach((style: string) => {
                    let char: string = style.split(':')[0].trim();
                    if (['font-family', 'vertical-align', 'text-align', 'text-indent', 'color', 'background', 'font-weight', 'font-style',
                        'font-size', 'text-decoration'].indexOf(char) > -1) {
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