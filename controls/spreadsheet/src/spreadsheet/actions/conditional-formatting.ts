import { Spreadsheet } from '../index';
import { checkConditionalFormat, initiateConditionalFormat, locale, dialog, setCF, CFormattingEventArgs } from '../common/index';
import { beginAction, completeAction } from '../common/index';
import { CellModel, SheetModel, getCell, setRow, setCell } from '../../workbook/base/index';
import { getRangeIndexes, checkDateFormat, cFInitialCheck, isNumber, cFRender, cFDelete, DataBar } from '../../workbook/common/index';
import { CellFormatArgs, isDateTime, dateToInt, CellStyleModel, applyCellFormat, clearCF } from '../../workbook/common/index';
import { setCFRule, clearCells } from '../../workbook/common/index';
import { isNullOrUndefined, L10n } from '@syncfusion/ej2-base';
import { Dialog } from '../services';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { ColorScale, IconSet, HighlightCell, TopBottom, CFColor, ConditionalFormatModel } from '../../workbook/common/index';
import { NumericTextBox } from '@syncfusion/ej2-inputs';

/**
 * Represents Conditional Formatting support for Spreadsheet.
 */
export class ConditionalFormatting {
    private parent: Spreadsheet;
    private typeData: { [key: string]: Object }[];

    /**
     * Constructor for the Spreadsheet Conditional Formatting module.
     */
    constructor(parent: Spreadsheet) {
        this.parent = parent;
        this.addEventListener();
    }

    /**
     * To destroy the Conditional Formatting module.
     * @return {void}
     */
    protected destroy(): void {
        this.removeEventListener();
    }

    private addEventListener(): void {
        this.parent.on(cFRender, this.cFInitialRender, this);
        this.parent.on(cFInitialCheck, this.cFInitialCheckHandler, this);
        this.parent.on(checkConditionalFormat, this.checkConditionalFormatHandler, this);
        this.parent.on(initiateConditionalFormat, this.initiateCFHandler, this);
        this.parent.on(setCF, this.setCFHandler, this);
        this.parent.on(cFDelete, this.cFDeleteHandler, this);
        this.parent.on(clearCF, this.clearCFHandler, this);
        this.parent.on(clearCells, this.addClearCFHandler, this);
    }

    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(cFRender, this.cFInitialRender);
            this.parent.off(cFInitialCheck, this.cFInitialCheckHandler);
            this.parent.off(checkConditionalFormat, this.checkConditionalFormatHandler);
            this.parent.off(initiateConditionalFormat, this.initiateCFHandler);
            this.parent.off(setCF, this.setCFHandler);
            this.parent.off(cFDelete, this.cFDeleteHandler);
            this.parent.off(clearCF, this.clearCFHandler);
        }
    }

    private setCF(conditionalFormat: ConditionalFormatModel): void {
        conditionalFormat.range = conditionalFormat.range || this.parent.getActiveSheet().selectedRange;
        let eventArgs: CFormattingEventArgs = {
            range: conditionalFormat.range, type: conditionalFormat.type, cFColor: conditionalFormat.cFColor,
            value: conditionalFormat.value, cancel: false
        };
        this.parent.notify(beginAction, { eventArgs: eventArgs, action: 'conditionalFormat' });
        if (!eventArgs.cancel) {
            conditionalFormat.type = eventArgs.type;
            conditionalFormat.cFColor = eventArgs.cFColor;
            conditionalFormat.value = eventArgs.value;
            conditionalFormat.range = eventArgs.range;
            this.parent.notify(setCFRule, { conditionalFormat: conditionalFormat });
            delete eventArgs.cancel;
            this.parent.notify(completeAction, { eventArgs: eventArgs, action: 'conditionalFormat' });
        }
    }

    private addClearCFHandler(args: { conditionalFormats: ConditionalFormatModel[], oldRange: string[], selectedRange: string }): void {
        let sheet: SheetModel = this.parent.getActiveSheet();
        let clearCFormats: ConditionalFormatModel[] = args.conditionalFormats;
        let oldRange: string[] = args.oldRange;
        let selectedRange: string = args.selectedRange;
        let conditionalFormats: ConditionalFormatModel[] = sheet.conditionalFormats;
        for (let cCFIdx: number = 0; cCFIdx < clearCFormats.length; cCFIdx++) {
            let isApply: boolean = false;
            for (let cFIdx: number = 0; cFIdx < conditionalFormats.length; cFIdx++) {
                if (conditionalFormats[cFIdx].type === clearCFormats[cCFIdx].type &&
                    conditionalFormats[cFIdx].range === clearCFormats[cCFIdx].range) {
                    isApply = true;
                    conditionalFormats[cFIdx].range = oldRange[cCFIdx];
                    sheet.conditionalFormats[cFIdx].range = oldRange[cCFIdx];
                    let sRangeIdx: number[] = getRangeIndexes(selectedRange);
                    let cFRanges: string[] = oldRange[cCFIdx].split(',');
                    for (let cFRangeIdx: number = 0; cFRangeIdx < cFRanges.length; cFRangeIdx++) {
                        let newRangeIdxs: number[] = getRangeIndexes(cFRanges[cFRangeIdx]);
                        for (let cFRowIdx: number = newRangeIdxs[0]; cFRowIdx <= newRangeIdxs[2]; cFRowIdx++) {
                            for (let cFColIdx: number = newRangeIdxs[1]; cFColIdx <= newRangeIdxs[3]; cFColIdx++) {
                                for (let sRRowIdx: number = sRangeIdx[0]; sRRowIdx <= sRangeIdx[2]; sRRowIdx++) {
                                    for (let sRColIdx: number = sRangeIdx[1]; sRColIdx <= sRangeIdx[3]; sRColIdx++) {
                                        if (sRRowIdx === cFRowIdx && sRColIdx === cFColIdx) {
                                            let td: HTMLElement = this.parent.getCell(cFRowIdx, cFColIdx);
                                            let cell: CellModel = sheet.rows[cFRowIdx] ? sheet.rows[cFRowIdx].cells[cFColIdx] ?
                                                sheet.rows[cFRowIdx].cells[cFColIdx] : null : null;
                                            if (cell) {
                                                this.cFInitialCheckHandler({
                                                    rowIdx: cFRowIdx, colIdx: cFColIdx,
                                                    cell: cell, td: td, conditionalFormat: conditionalFormats[cFIdx]
                                                });
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if (!isApply) {
                let conditionalFormat: ConditionalFormatModel = clearCFormats[cCFIdx];
                conditionalFormat.range = oldRange[cCFIdx];
                this.parent.notify(setCFRule, { conditionalFormat: conditionalFormat });
            }
        }
    }

    private cFDeleteHandler(args: { rowIdx: number, colIdx: number }): void {
        let td: HTMLElement = this.parent.getCell(args.rowIdx, args.colIdx);
        if (td) {
            if (td.querySelector('.e-cf-databar')) {
                td.removeChild(td.querySelector('.e-cf-databar'));
            }
            if (td.querySelector('.e-iconsetspan')) {
                td.removeChild(td.querySelector('.e-iconsetspan'));
            }
        }
    }

    private clearCFHandler(args: { rIdx: number, cIdx: number }): void {
        let sheet: SheetModel = this.parent.getActiveSheet();
        let tdEle: HTMLElement = this.parent.getCell(args.rIdx, args.cIdx);
        let cell: CellModel = getCell(args.rIdx, args.cIdx, sheet);
        if (!tdEle) {
            return;
        }
        tdEle.classList.remove('e-redft');
        tdEle.classList.remove('e-yellowft');
        tdEle.classList.remove('e-greenft');
        tdEle.classList.remove('e-redf');
        tdEle.classList.remove('e-redt');
        tdEle.classList.remove('e-iconset');
        if (tdEle.style) {
            if (tdEle.style.backgroundColor) {
                tdEle.style.backgroundColor = '';
                let style: CellStyleModel = this.parent.getCellStyleValue(['backgroundColor'], [args.rIdx, args.cIdx]);
                this.parent.notify(applyCellFormat, <CellFormatArgs>{
                    style: style, rowIdx: args.rIdx, colIdx: args.cIdx
                });
            }
            if (tdEle.style.color) {
                tdEle.style.color = '';
                let style: CellStyleModel = this.parent.getCellStyleValue(['color'], [args.rIdx, args.cIdx]);
                this.parent.notify(applyCellFormat, <CellFormatArgs>{
                    style: style, rowIdx: args.rIdx, colIdx: args.cIdx
                });
            }
        }
        if (tdEle.querySelector('.e-cf-databar')) {
            tdEle.removeChild(tdEle.querySelector('.e-cf-databar'));
            tdEle.textContent = this.parent.getDisplayText(cell);
        }
        if (tdEle.querySelector('.e-iconsetspan')) {
            tdEle.removeChild(tdEle.querySelector('.e-iconsetspan'));
            tdEle.textContent = this.parent.getDisplayText(cell);
        }
    }

    private setCFHandler(args: { action: string, id: string }): void {
        if (args.action === 'cf_databars') {
            this.setCF({ type: args.id as DataBar });
        } else if (args.action === 'cf_colorscales') {
            this.setCF({ type: args.id as ColorScale });
        } else if (args.action === 'cf_iconsets') {
            this.setCF({ type: args.id as IconSet });
        }
    }


    private initiateCFHandler(args: { action: string }): void {
        let l10n: L10n = this.parent.serviceLocator.getService(locale);

        let dialogInst: Dialog = (this.parent.serviceLocator.getService(dialog) as Dialog);
        dialogInst.show({
            width: 375, showCloseIcon: true, isModal: true, cssClass: 'e-conditionalformatting-dlg',
            header: args.action.replace('...', ''),
            target: document.querySelector('.e-control.e-spreadsheet') as HTMLElement,
            beforeOpen: (): void => {
                dialogInst.dialogInstance.content = this.cFDlgContent(args.action);
                dialogInst.dialogInstance.dataBind();
                this.parent.element.focus();
            },
            buttons: [{
                buttonModel: {
                    content: l10n.getConstant('Ok'),
                    isPrimary: true,
                    cssClass: 'e-btn e-clearall-btn e-flat'
                },
                click: (): void => {
                    this.dlgClickHandler(args.action);
                    dialogInst.hide();
                }
            }]
        });
        dialogInst.dialogInstance.refresh();
    }

    private dlgClickHandler(action: string): void {
        let value1: string = '';
        let value2: string = '';
        let dlgCont: HTMLElement = this.parent.element.querySelector('.e-conditionalformatting-dlg').
            getElementsByClassName('e-dlg-content')[0].querySelector('.e-cf-dlg') as HTMLElement;
        let mainCont: HTMLElement = dlgCont.querySelector('.e-cfmain');
        if (mainCont) {
            let inpEle: HTMLElement = mainCont.getElementsByTagName('input')[0];
            if (inpEle && inpEle.parentElement.classList.contains('e-cfmain')) {
                value1 = mainCont.getElementsByTagName('input')[0].value;
            }
            value2 = mainCont.getElementsByTagName('input')[1] ?
                dlgCont.querySelector('.e-cfmain').getElementsByTagName('input')[1].value : '';
        }
        let cFColor: string = this.getCFColor(dlgCont.querySelector('.e-cfsub').getElementsByTagName('input')[0].value);
        let cFType: string = action === 'Duplicate Values...' ?
            dlgCont.querySelector('.e-cfmain').getElementsByTagName('input')[0].value : this.getType(action);
        if (value1 !== '' && value2 !== '') {
            this.setCF({
                type: cFType as HighlightCell | TopBottom,
                cFColor: cFColor as CFColor, value: value1 + ',' + value2
            });
        } else if (value1 !== '') {
            this.setCF({
                type: cFType as HighlightCell | TopBottom,
                cFColor: cFColor as CFColor, value: value1
            });
        } else {
            this.setCF({
                type: cFType as HighlightCell | TopBottom,
                cFColor: cFColor as CFColor, value: value2
            });
        }
    }

    private getType(action: string): string {
        let l10n: L10n = this.parent.serviceLocator.getService(locale);
        let result: string = '';
        switch (action) {
            case l10n.getConstant('GreaterThan') + '...':
                result = 'GreaterThan';
                break;
            case l10n.getConstant('LessThan') + '...':
                result = 'LessThan';
                break;
            case l10n.getConstant('Between') + '...':
                result = 'Between';
                break;
            case l10n.getConstant('CFEqualTo') + '...':
                result = 'EqualTo';
                break;
            case l10n.getConstant('TextThatContains') + '...':
                result = 'ContainsText';
                break;
            case l10n.getConstant('ADateOccuring') + '...':
                result = 'DateOccur';
                break;
            case l10n.getConstant('Top10Items') + '...':
                result = 'Top10Items';
                break;
            case l10n.getConstant('Bottom10Items') + '...':
                result = 'Bottom10Items';
                break;
            case l10n.getConstant('Top10') + ' %...':
                result = 'Top10Percentage';
                break;
            case l10n.getConstant('Bottom10') + ' %...':
                result = 'Bottom10Percentage';
                break;
            case l10n.getConstant('AboveAverage') + '...':
                result = 'AboveAverage';
                break;
            case l10n.getConstant('BelowAverage') + '...':
                result = 'BelowAverage';
                break;
        }
        return result;
    }

    private getCFColor(value: string): string {
        let l10n: L10n = this.parent.serviceLocator.getService(locale);
        let result: string = 'RedFT';
        switch (value) {
            case l10n.getConstant('LightRedFillWithDarkRedText'):
                result = 'RedFT';
                break;
            case l10n.getConstant('YellowFillWithDarkYellowText'):
                result = 'YellowFT';
                break;
            case l10n.getConstant('GreenFillWithDarkGreenText'):
                result = 'GreenFT';
                break;
            case l10n.getConstant('RedFill'):
                result = 'RedF';
                break;
            case l10n.getConstant('RedText'):
                result = 'RedT';
                break;
        }
        return result;
    }

    private cFDlgContent(action: string): HTMLElement {
        let dlgText: string = this.getDlgText(action);
        let l10n: L10n = this.parent.serviceLocator.getService(locale);
        let dlgContent: HTMLElement = this.parent.createElement('div', { className: 'e-cf-dlg' });
        let mainDiv: HTMLElement = this.parent.createElement('div', { className: 'e-cfmain' });
        let subDiv: HTMLElement = this.parent.createElement('div', { className: 'e-cfsub' });

        let value1Text: HTMLElement = this.parent.createElement('span', { className: 'e-header e-top-header', innerHTML: dlgText });
        let value1Inp: HTMLElement =
            this.parent.createElement('input', { className: 'e-input', id: 'valueInput', attrs: { type: 'text' } });
        let duplicateSelectEle: HTMLElement = this.parent.createElement('input', { className: 'e-select' });

        let subDivText: HTMLElement = this.parent.createElement('span', { className: 'e-header', innerHTML: 'with' });
        let colorSelectEle: HTMLElement = this.parent.createElement('input', { className: 'e-select' });
        dlgContent.appendChild(mainDiv);
        dlgContent.appendChild(subDiv);

        mainDiv.appendChild(value1Text);
        if (action !== l10n.getConstant('DuplicateValues') + '...') {
            if (action !== l10n.getConstant('AboveAverage') + '...' && action !== l10n.getConstant('BelowAverage') + '...') {
                mainDiv.appendChild(value1Inp);
                if (action === l10n.getConstant('Top10Items') + '...' || action === l10n.getConstant('Top10') + ' %...' ||
                    action === l10n.getConstant('Bottom10Items') + '...' || action === l10n.getConstant('Bottom10') + ' %...') {
                    let numeric: NumericTextBox = new NumericTextBox({
                        value: 10
                    });
                    numeric.appendTo(value1Inp);
                }
            }
        } else {
            mainDiv.appendChild(duplicateSelectEle);
            let dupData: { [key: string]: Object }[] = [
                { text: l10n.getConstant('Duplicate'), id: 'duplicate' },
                { text: l10n.getConstant('Unique'), id: 'unique' },
            ];
            let dupList: DropDownList = new DropDownList({
                dataSource: dupData,
                index: 0,
                popupHeight: '200px'
            });
            dupList.appendTo(duplicateSelectEle);
        }
        if (action === l10n.getConstant('Between') + '...') {
            let value2Text: HTMLElement = this.parent.createElement(
                'span', { className: 'e-header e-header-2', innerHTML: l10n.getConstant('And') });
            let value2Inp: HTMLElement = this.parent.createElement('input', { className: 'e-input' });
            mainDiv.appendChild(value2Text);
            mainDiv.appendChild(value2Inp);
        }
        subDiv.appendChild(subDivText);
        subDiv.appendChild(colorSelectEle);

        let colorData: { [key: string]: Object }[] = [
            { text: l10n.getConstant('LightRedFillWithDarkRedText'), value: 'redft', id: 'redft' },
            { text: l10n.getConstant('YellowFillWithDarkYellowText'), id: 'yellowft' },
            { text: l10n.getConstant('GreenFillWithDarkGreenText'), id: 'greenft' },
            { text: l10n.getConstant('RedFill'), id: 'redf' },
            { text: l10n.getConstant('RedText'), id: 'redt' },
        ];
        let colorList: DropDownList = new DropDownList({
            dataSource: colorData,
            index: 0,
            popupHeight: '200px'
        });
        colorList.appendTo(colorSelectEle);
        return dlgContent;
    }

    private checkCellHandler(rowIdx: number, colIdx: number, conditionalFormat: ConditionalFormatModel): boolean {
        let isApply: boolean = false;
        let ranges: string[] = conditionalFormat.range.trim().split(',');
        for (let rangeIdx: number = 0; rangeIdx < ranges.length; rangeIdx++) {
            let cFrange: string = ranges[rangeIdx];
            cFrange = cFrange.indexOf(':') > -1 ? cFrange : cFrange + ':' + cFrange;
            let indexes: number[] = getRangeIndexes(cFrange);
            if (rowIdx >= indexes[0] && rowIdx <= indexes[2] && colIdx >= indexes[1] && colIdx <= indexes[3]) {
                isApply = true;
                break;
            }
        }
        return isApply;
    }

    private getDlgText(action: string): string {
        let l10n: L10n = this.parent.serviceLocator.getService(locale);
        let result: string = '';
        switch (action) {
            case l10n.getConstant('GreaterThan') + '...':
                result = l10n.getConstant('FormatCellsGreaterThan');
                break;
            case l10n.getConstant('LessThan') + '...':
                result = l10n.getConstant('FormatCellsLessThan');
                break;
            case l10n.getConstant('Between') + '...':
                result = l10n.getConstant('FormatCellsBetween');
                break;
            case l10n.getConstant('CFEqualTo') + '...':
                result = l10n.getConstant('FormatCellsEqualTo');
                break;
            case l10n.getConstant('TextThatContains') + '...':
                result = l10n.getConstant('FormatCellsThatContainTheText');
                break;
            case l10n.getConstant('ADateOccuring') + '...':
                result = l10n.getConstant('FormatCellsThatContainADateOccurring');
                break;
            case l10n.getConstant('DuplicateValues') + '...':
                result = l10n.getConstant('FormatCellsDuplicate');
                break;
            case l10n.getConstant('Top10Items') + '...':
                result = l10n.getConstant('FormatCellsTop');
                break;
            case l10n.getConstant('Top10') + ' %...':
                result = l10n.getConstant('FormatCellsTop');
                break;
            case l10n.getConstant('Bottom10Items') + '...':
                result = l10n.getConstant('FormatCellsBottom');
                break;
            case l10n.getConstant('Bottom10') + ' %...':
                result = l10n.getConstant('FormatCellsBottom');
                break;
            case l10n.getConstant('AboveAverage') + '...':
                result = l10n.getConstant('FormatCellsAbove');
                break;
            case l10n.getConstant('BelowAverage') + '...':
                result = l10n.getConstant('FormatCellsBelow');
                break;
        }
        return result;
    }

    private cFInitialRender(args: { rowIdx: number, colIdx: number, cell: CellModel, td?: HTMLElement }): void {
        let cFRules: ConditionalFormatModel[] = this.parent.getActiveSheet().conditionalFormats;
        if (cFRules) {
            for (let cFRIdx: number = 0; cFRIdx < cFRules.length; cFRIdx++) {
                let isApply: boolean = false;
                isApply = this.checkCellHandler(args.rowIdx, args.colIdx, cFRules[cFRIdx]);
                if (isApply) {
                    this.cFInitialCheckHandler({
                        rowIdx: args.rowIdx, colIdx: args.colIdx,
                        cell: args.cell, td: args.td, conditionalFormat: cFRules[cFRIdx]
                    });
                }
            }
        }
    }

    private cFInitialCheckHandler(
        args: {
            rowIdx: number, colIdx: number, cell: CellModel, td?: HTMLElement,
            conditionalFormat: ConditionalFormatModel
        }): void {
        let sheet: SheetModel = this.parent.getActiveSheet();
        let formatStyle: CellStyleModel;
        let isApply: boolean = false;
        let cFColors: string[] = ['e-redft', 'e-yellowft', 'e-greenft', 'e-redf', 'e-redt'];
        let value: string = args.cell.value || '';
        let cFRule: ConditionalFormatModel = args.conditionalFormat;
        let td: HTMLElement = args.td || this.parent.getCell(args.rowIdx, args.colIdx);
        if (!td) {
            return;
        }
        cFRule.type = cFRule.type || 'GreaterThan';
        cFRule.cFColor = cFRule.cFColor ? cFRule.cFColor : cFRule.format ? cFRule.cFColor : 'RedFT';
        isApply = this.cFRCheck(cFRule, value, td, args.rowIdx, args.colIdx, true);
        if (isApply) {
            for (let idx: number = 0; idx < cFColors.length; idx++) {
                if (td.classList.contains(cFColors[idx])) {
                    td.classList.remove(cFColors[idx]);
                    break;
                }
            }
            if (cFRule.format && cFRule.format.style) {
                formatStyle = cFRule.format.style;
            }
            let style: CellStyleModel = {};
            if (cFRule.cFColor) {
                td.classList.add('e-' + cFRule.cFColor.toLowerCase());
                style = this.setFormat(style, cFRule);
            } else {
                style = formatStyle;
            }
            if (style.backgroundColor) {
                td.style.setProperty('background-color', style.backgroundColor);
            }
            if (style.color) {
                td.style.setProperty('color', style.color);
            }
            if (style.fontWeight) {
                td.style.setProperty('font-weight', style.fontWeight);
            }
            if (style.fontStyle) {
                td.style.setProperty('font-style', style.fontStyle);
            }
            if (style.textDecoration) {
                td.style.setProperty('text-decoration', style.textDecoration);
            }
            }
        }

    private checkConditionalFormatHandler(args: { rowIdx: number, colIdx: number, cell: CellModel }): void {
        let indexes: number[];
        let isApply: boolean = false;
        let result: boolean = false;
        let sheet: SheetModel = this.parent.getActiveSheet();
        let cell: CellModel = args.cell;
        let td: HTMLElement;
        let cFRules: ConditionalFormatModel[] = sheet.conditionalFormats as ConditionalFormatModel[];
        let mainCnt: Element = this.parent.getMainContent();
        let value: string = !cell ? '' : !isNullOrUndefined(cell.value) ? cell.value : '';
        let cFColors: string[] = ['e-redft', 'e-yellowft', 'e-greenft', 'e-redf', 'e-redt'];
        let cFRIdx: number;
        td = this.parent.getCell(args.rowIdx, args.colIdx);
        if (!cFRules || cFRules.length < 1) {
            return;
        }
        for (let cFRuleIdx: number = 0; cFRuleIdx < cFRules.length; cFRuleIdx++) {
            let cFRanges: string[] = cFRules[cFRuleIdx].range.trim().split(',');
            for (let rangeIdx: number = 0; rangeIdx < cFRanges.length; rangeIdx++) {
                let range: string = cFRanges[rangeIdx];
                range = range.indexOf(':') > -1 ? range : range + ':' + range;
                indexes = getRangeIndexes(range);
                if (args.rowIdx >= indexes[0] && args.colIdx >= indexes[1] && args.rowIdx <= indexes[2] && args.colIdx <= indexes[3]) {
                    cFRIdx = cFRuleIdx;
                    result = true;
                    break;
                }
            }
            if (result) {
                if (('GreaterThan' + 'LessThan' + 'EqualTo' + 'Between' + 'ContainsText' +
                    'DateOccur').includes(sheet.conditionalFormats[cFRuleIdx].type)) {
                    let cellVal: string = getCell(args.rowIdx, args.colIdx, sheet) && getCell(args.rowIdx, args.colIdx, sheet).value ?
                        getCell(args.rowIdx, args.colIdx, sheet).value : '';
                    if (isNullOrUndefined(cellVal) && cellVal === '') {
                        isApply = false;
                    } else {
                        isApply = this.cFRCheck(sheet.conditionalFormats[cFRuleIdx], cellVal, td);
                    }
                    this.setColor(td, args.rowIdx, args.colIdx, cFRuleIdx, isApply);
                } else if (('Top10Items' + 'Bottom10Items' + 'Top10%' + 'Bottom10%' + 'AboveAverage' +
                    'BelowAverage' + 'Duplicate' + 'Unique').includes(sheet.conditionalFormats[cFRuleIdx].type)) {
                    for (let rangeIdx: number = 0; rangeIdx < cFRanges.length; rangeIdx++) {
                        let range: string = cFRanges[rangeIdx];
                        range = range.indexOf(':') > -1 ? range : range + ':' + range;
                        indexes = getRangeIndexes(range);
                        for (let rIdx: number = indexes[0]; rIdx <= indexes[2]; rIdx++) {
                            if (!sheet.rows[rIdx]) { setRow(sheet, rIdx, {}); }
                            for (let cIdx: number = indexes[1]; cIdx <= indexes[3]; cIdx++) {
                                if (!sheet.rows[rIdx].cells || !sheet.rows[rIdx].cells[cIdx]) { setCell(rIdx, cIdx, sheet, {}); }
                                let cellVal: string = getCell(rIdx, cIdx, sheet) && getCell(rIdx, cIdx, sheet).value ?
                                    getCell(rIdx, cIdx, sheet).value : '';
                                isApply = this.cFRCheck(sheet.conditionalFormats[cFRuleIdx], cellVal, td, rIdx, cIdx, false);
                                td = this.parent.getCell(rIdx, cIdx);
                                this.setColor(td, rIdx, cIdx, cFRuleIdx, isApply);
                            }
                        }
                    }
                } else if (('BlueDataBar' + 'GreenDataBar' + 'RedDataBar' + 'OrangeDataBar' + 'LightBlueDataBar' + 'PurpleColorScale' +
                    'GYRColorScale' + 'RYGColorScale' + 'GWRColorScale' + 'RWGColorScale' + 'BWRColorScale' + 'RWBColorScale' +
                    'WRColorScale' + 'RWColorScale' + 'GWColorScale' + 'WGColorScale' + 'GYColorScale' + 'YGColorScale' + 'ThreeArrows' +
                    'ThreeArrowsGray' + 'FourArrowsGray' + 'FourArrows' + 'FiveArrowsGray' + 'FiveArrows' + 'ThreeTrafficLights1' +
                    'ThreeTrafficLights2' + 'ThreeSigns' + 'FourTrafficLights' + 'FourRedToBlack' + 'ThreeSymbols' + 'ThreeSymbols2' +
                    'ThreeFlags' + 'FourRating' + 'FiveQuarters' + 'FiveRating' + 'ThreeTriangles' + 'ThreeStars' + 'FiveBoxes').
                    includes(sheet.conditionalFormats[cFRuleIdx].type)) {
                    for (let idx: number = 0; idx < cFColors.length; idx++) {
                        if (td.classList.contains(cFColors[idx])) {
                            td.classList.remove(cFColors[idx]);
                        }
                    }
                    isApply = this.cFRCheck(sheet.conditionalFormats[cFRuleIdx], value, td, args.rowIdx, args.colIdx, false);
                }
                result = false;
            }
        }
    }

    private setColor(td: HTMLElement, rIdx: number, cIdx: number, cFRuleIdx: number, isApply: boolean): void {
        let sheet: SheetModel = this.parent.getActiveSheet();
        let cFRules: ConditionalFormatModel[] = sheet.conditionalFormats as ConditionalFormatModel[];
        let cFColors: string[] = ['e-redft', 'e-yellowft', 'e-greenft', 'e-redf', 'e-redt'];
        let isActiveCF: boolean = false;
        if (cFRules[cFRuleIdx].cFColor) {
            if (td && td.classList.contains('e-' + cFRules[cFRuleIdx].cFColor.toLowerCase())) {
                isActiveCF = true;
            }
        } else if (cFRules[cFRuleIdx].format.style.backgroundColor && td.style.backgroundColor) {
            let rgb: { r: number, g: number, b: number } = this.hexToRgb(cFRules[cFRuleIdx].format.style.backgroundColor);
            if ('rgb(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ')' === td.style.backgroundColor) {
                isActiveCF = true;
            }
        }
        if (isApply) {
            if (isActiveCF) {
                for (let idx: number = 0; idx < cFColors.length; idx++) {
                    if (td.classList.contains(cFColors[idx])) {
                        td.classList.remove(cFColors[idx]);
                        break;
                    }
                }
            }
            let style: CellStyleModel = {};
            if (cFRules[cFRuleIdx].cFColor) {
                td.classList.add('e-' + cFRules[cFRuleIdx].cFColor.toLowerCase());
                style = this.setFormat(style, cFRules[cFRuleIdx]);
            } else {
                style = cFRules[cFRuleIdx].format.style;
            }
            this.parent.notify(applyCellFormat, <CellFormatArgs>{
                style: style, rowIdx: rIdx, colIdx: cIdx,
                lastCell: true, isHeightCheckNeeded: true, manualUpdate: true
            });
        } else {
            if (isActiveCF) {
                for (let idx: number = 0; idx < cFColors.length; idx++) {
                    if (td.classList.contains(cFColors[idx])) {
                        td.classList.remove(cFColors[idx]);
                        break;
                    }
                }
                td.removeAttribute('style');
            }
            let cell: CellModel = getCell(rIdx, cIdx, this.parent.getActiveSheet());
            let style: CellStyleModel = cell.style ? cell.style : {};
            this.parent.notify(applyCellFormat, <CellFormatArgs>{
                style: style, rowIdx: rIdx, colIdx: cIdx
            });
        }
    }

    private hexToRgb(hex: string): { r: number, g: number, b: number } {
        let result: RegExpExecArray = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    // tslint:disable-next-line:max-func-body-length
    private cFRCheck(
        cFRule: ConditionalFormatModel, value: string, td: HTMLElement, rIdx?: number, cIdx?: number, isInitial?: boolean): boolean {
        let cFRuleValue1: string = '';
        let cFRuleValue2: string = '';
        let cellValue: string = value.toString();
        if (cFRule.value) {
            let valueArr: string[] = cFRule.value.split(',');
            if (valueArr.length > 1) {
                if (valueArr[0].split('(').length > 1) {
                    let valueStr: string = '';
                    for (let idx: number = 0; idx < valueArr.length; idx++) {
                        valueStr += valueArr[idx] + ',';
                        if (valueStr.split('(').length === valueStr.split(')').length && cFRuleValue1 === '') {
                            cFRuleValue1 = valueStr.substring(0, valueStr.length - 1);
                            valueStr = '';
                        }
                    }
                    cFRuleValue2 = valueStr.substring(0, valueStr.length - 1);
                } else {
                    cFRuleValue1 = valueArr[0];
                    for (let idx: number = 1; idx < valueArr.length; idx++) {
                        cFRuleValue2 += idx + 1 === valueArr.length ? valueArr[idx] : valueArr[idx] + ',';
                    }
                }
            } else {
                cFRuleValue1 = cFRule.value;
            }
        }
        let isApply: boolean = false;
        let type: string = cFRule.type;
        if (('BlueDataBar' + 'GreenDataBar' + 'RedDataBar' + 'OrangeDataBar' + 'LightBlueDataBar' + 'PurpleDataBar').includes(type)) {
            type = 'DataBar';
        }
        if (('GYRColorScale' + 'RYGColorScale' + 'GWRColorScale' + 'RWGColorScale' + 'BWRColorScale' + 'RWBColorScale' + 'WRColorScale' +
            'RWColorScale' + 'GWColorScale' + 'WGColorScale' + 'GYColorScale' + 'YGColorScale').includes(type)) {
            type = 'ColorScale';
        }
        if (('ThreeArrows' + 'ThreeArrowsGray' + 'FourArrowsGray' + 'FourArrows' + 'FiveArrowsGray' +
            'FiveArrows' + 'ThreeTrafficLights1' + 'ThreeTrafficLights2' + 'ThreeSigns' + 'FourTrafficLights' +
                'FourRedToBlack' + 'ThreeSymbols' + 'ThreeSymbols2' + 'ThreeFlags' + 'FourRating' + 'FiveQuarters' +
                'FiveRating' + 'ThreeTriangles' + 'ThreeStars' + 'FiveBoxes').includes(type)) {
                type = 'IconSet';
            }
        switch (type) {
            case 'GreaterThan':
                isApply = this.isGreaterThanLessThan(cFRule, cellValue as string, cFRuleValue1 as string, true);
                break;
            case 'LessThan':
                isApply = this.isGreaterThanLessThan(cFRule, cellValue as string, cFRuleValue1 as string, false);
                break;
            case 'Between':
                isApply = this.isBetWeen(cFRule, cellValue as string, cFRuleValue1 as string, cFRuleValue2 as string);
                break;
            case 'EqualTo':
                isApply = this.isEqualTo(cFRule, cellValue as string, cFRuleValue1 as string);
                break;
            case 'ContainsText':
                isApply = this.isContainsText(cellValue as string, cFRuleValue1);
                break;
            case 'DateOccur':
                let dateEventArgs: { [key: string]: string | number } = {
                    value: cFRuleValue1,
                    rowIndex: 0,
                    colIndex: 0,
                    sheetIndex: 0,
                    updatedVal: ''
                };
                this.parent.notify(checkDateFormat, dateEventArgs);
                if (cellValue === dateEventArgs.updatedVal) {
                    isApply = true;
                }
                break;
            case 'Unique':
            case 'Duplicate':
                isApply = this.isDuplicateUnique(cellValue, cFRule, false);
                break;
            case 'Top10Items':
                isApply = this.isTopBottomTenValue(cellValue, cFRuleValue1, cFRule, true);
                break;
            case 'Bottom10Items':
                isApply = this.isTopBottomTenValue(cellValue, cFRuleValue1, cFRule, false);
                break;
            case 'Top10Percentage':
                isApply = this.isTopBottomTenPercentage(cellValue, cFRuleValue1, cFRule, true);
                break;
            case 'Bottom10Percentage':
                isApply = this.isTopBottomTenPercentage(cellValue, cFRuleValue1, cFRule, false);
                break;
            case 'AboveAverage':
                isApply = this.isAboveBelowAverage(cellValue, cFRuleValue1, cFRule, true);
                break;
            case 'BelowAverage':
                isApply = this.isAboveBelowAverage(cellValue, cFRuleValue1, cFRule, false);
                break;
            case 'DataBar':
                this.isDataBarColorScalesIconSets(type, cellValue, cFRule, td, rIdx, cIdx, isInitial);
                break;
            case 'ColorScale':
                this.isDataBarColorScalesIconSets(type, cellValue, cFRule, td, rIdx, cIdx, isInitial);
                break;
            case 'IconSet':
                this.isDataBarColorScalesIconSets(type, cellValue, cFRule, td, rIdx, cIdx, isInitial);
                break;
        }
        return isApply;
    }

    private isDataBarColorScalesIconSets(
        type: string, cellValue: string, cFRule: ConditionalFormatModel, td: HTMLElement,
        rIdx: number, cIdx: number, isInitial: boolean): void {
        let sheet: SheetModel = this.parent.getActiveSheet();
        if (isInitial) {
            type === 'DataBar' ? this.applyDataBars(cellValue, cFRule, td, rIdx, cIdx) : type === 'ColorScale' ?
                this.applyColorScale(cellValue, cFRule, td, rIdx, cIdx, isInitial) :
                this.applyIconSet(cellValue, cFRule, td, rIdx, cIdx, isInitial);
        } else {
            td = null;
            let rangeArr: string[] = cFRule.range.split(',');
            for (let rangeIdx: number = 0; rangeIdx < rangeArr.length; rangeIdx++) {
                let selIndexes: number[] = getRangeIndexes(rangeArr[rangeIdx]);
                for (let rIdx: number = selIndexes[0]; rIdx <= selIndexes[2]; rIdx++) {
                    for (let cIdx: number = selIndexes[1]; cIdx <= selIndexes[3]; cIdx++) {
                        if (getCell(rIdx, cIdx, sheet)) {
                            let cellVal: string = getCell(rIdx, cIdx, sheet).value;
                            td = this.parent.getCell(rIdx, cIdx);
                            type === 'DataBar' ? this.applyDataBars(cellVal, cFRule, td, rIdx, cIdx) :
                                type === 'ColorScale' ?
                                    this.applyColorScale(cellVal, cFRule, td, rIdx, cIdx, isInitial) :
                                    this.applyIconSet(cellVal, cFRule, td, rIdx, cIdx, isInitial);
                        }
                    }
                }
            }
        }
    }

    private applyIconSet(
        val: string, cFRule: ConditionalFormatModel, tdEle: HTMLElement, rIdx: number,
        cIdx: number, isInitial: boolean): void {
        let value: number = parseInt(val, 10);
        let rowIdx: number;
        let colIdx: number;
        let iconList: string[] = this.getIconList(cFRule.type).split(',');
        let min: number;
        let max: number;
        let valArr: number[] = [];
        let sheet: SheetModel = this.parent.getActiveSheet();
        let actCell: CellModel = sheet.rows[rIdx] && sheet.rows[rIdx].cells[cIdx] ? sheet.rows[rIdx].cells[cIdx] : null;
        if (!actCell) {
            return;
        }
        let td: HTMLElement = tdEle ||
            this.parent.getMainContent().getElementsByClassName('e-row')[rIdx].getElementsByClassName('e-cell')[cIdx] as HTMLElement;
        let rangeArr: string[] = cFRule.range.split(',');
        for (let rIdx: number = 0; rIdx < rangeArr.length; rIdx++) {
            let selIndexes: number[] = getRangeIndexes(rangeArr[rIdx]);
            valArr = this.getNumericArray(selIndexes, valArr);
        }
        valArr = valArr.sort((n1: number, n2: number) => n1 - n2);
        min = valArr[0];
        max = valArr[valArr.length - 1];
        let currentSymbol: string;
        if (iconList.length === 3) {
            let maxPercent: number = min + (0.67 * ((max) - (min)));
            let minPercent: number = min + (0.33 * ((max) - (min)));
            currentSymbol =
                'e-' + (value >= maxPercent ? iconList[0].trim() : value >= minPercent ? iconList[1].trim() : iconList[2].trim());
        } else if (iconList.length === 4) {
            let percent1: number = min + (0.25 * ((max) - (min)));
            let percent2: number = min + (0.50 * ((max) - (min)));
            let percent3: number = min + (0.75 * ((max) - (min)));
            currentSymbol =
                'e-' + (value >= percent3 ? iconList[0].trim() : value >= percent2 ? iconList[1].trim() : value >= percent1 ?
                    iconList[2].trim() : iconList[3].trim());
        } else if (iconList.length === 5) {
            let percent1: number = min + (0.20 * ((max) - (min)));
            let percent2: number = min + (0.40 * ((max) - (min)));
            let percent3: number = min + (0.60 * ((max) - (min)));
            let percent4: number = min + (0.80 * ((max) - (min)));
            currentSymbol =
                'e-' + (value >= percent4 ? iconList[0].trim() : value >= percent3 ? iconList[1].trim() : value >= percent2 ?
                    iconList[2].trim() : value >= percent1 ? iconList[3].trim() : iconList[4].trim());
        }
        if (!isNullOrUndefined(actCell)) {
            let cfIcon: HTMLElement = this.parent.createElement('span', { className: 'e-icon' });
            cfIcon.classList.add('e-iconsetspan');
            cfIcon.classList.add(currentSymbol);
            this.applyIconSetIcon({ rowIndex: rIdx, colIndex: cIdx }, cfIcon, td);
        }
    }

    private applyIconSetIcon(activeObj: { rowIndex: number, colIndex: number }, cfIcon: Element, td: Element): void {
        let sheet: SheetModel = this.parent.getActiveSheet();
        let rowIdx: number = activeObj.rowIndex;
        let colIdx: number = activeObj.colIndex;
        let cellVal: string = getCell(rowIdx, colIdx, sheet).value;
        let activeEle: HTMLElement = td as HTMLElement;
        let sheetIdx: number = sheet.index;
        if (activeEle.classList.contains('e-iconset') && activeEle.querySelector('.e-iconsetspan')) {
            activeEle.removeChild(activeEle.querySelector('.e-iconsetspan'));
        }
        if (isNumber(cellVal)) {
            activeEle.insertBefore(cfIcon, activeEle.childNodes[0]);
            activeEle.classList.add('e-iconset');
        }
    }

    private getIconList(iconName: string): string {
        let result: string = '3arrows-1,3arrows-2,3arrows-3';
        switch (iconName) {
            case 'ThreeArrows':
                return '3arrows-1,3arrows-2,3arrows-3';
            case 'ThreeArrowsGray':
                return '3arrowsgray-1,3arrowsgray-2,3arrowsgray-3';
            case 'FourArrowsGray':
                return '4arrowsgray-1,4arrowsgray-2,4arrowsgray-3,4arrowsgray-4';
            case 'FourArrows':
                return '4arrows-1,4arrows-2,4arrows-3,4arrows-4';
            case 'FiveArrowsGray':
                return '5arrowsgray-1,5arrowsgray-2,5arrowsgray-3,5arrowsgray-4,5arrowsgray-5';
            case 'FiveArrows':
                return '5arrows-1,5arrows-2,5arrows-3,5arrows-4,5arrows-5';
            case 'ThreeTrafficLights1':
                return '3trafficlights-1,3trafficlights-2,3trafficlights-3';
            case 'ThreeTrafficLights2':
                return '3rafficlights2-1,3rafficlights2-2,3rafficlights2-3';
            case 'ThreeSigns':
                return '3signs-1,3signs-2,3signs-3';
            case 'FourTrafficLights':
                return '4trafficlights-1,4trafficlights-2,4trafficlights-3,4trafficlights-4';
            case 'FourRedToBlack':
                return '4redtoblack-1,4redtoblack-2,4redtoblack-3,4redtoblack-4';
            case 'ThreeSymbols':
                return '3symbols-1,3symbols-2,3symbols-3';
            case 'ThreeSymbols2':
                return '3symbols2-1,3symbols2-2,3symbols2-3';
            case 'ThreeFlags':
                return '3flags-1,3flags-2,3flags-3';
            case 'FourRating':
                return '4rating-1,4rating-2,4rating-3,4rating-4';
            case 'FiveQuarters':
                return '5quarters-1,5quarters-2,5quarters-3,5quarters-4,5quarters-5';
            case 'FiveRating':
                return '5rating-1,5rating-2,5rating-3,5rating-4,5rating-5';
            case 'ThreeTriangles':
                return '3triangles-1,3triangles-2,3triangles-3';
            case 'ThreeStars':
                return '3stars-1,3stars-2,3stars-3';
            case 'FiveBoxes':
                return '5boxes-1,5boxes-2,5boxes-3,5boxes-4,5boxes-5';
        }
        return result;
    }

    private applyColorScale(
        val: string, cFRule: ConditionalFormatModel, tdEle: HTMLElement, rIdx: number, cIdx: number, isInitial: boolean): void {
        let sheet: SheetModel = this.parent.getActiveSheet();
        let value: number = parseInt(val, 10);
        let rowIdx: number;
        let colIdx: number;
        let id: number;
        let valArr: number[] = [];
        let colors: string[] = this.getColor(cFRule.type);
        let actCell: CellModel = sheet.rows[rIdx] && sheet.rows[rIdx].cells[cIdx] ? sheet.rows[rIdx].cells[cIdx] : null;
        if (!actCell) {
            return;
        }
        let rangeArr: string[] = cFRule.range.split(',');
        let td: HTMLElement = tdEle ||
            this.parent.getMainContent().getElementsByClassName('e-row')[rIdx].getElementsByClassName('e-cell')[cIdx] as HTMLElement;
        for (let rIdx: number = 0; rIdx < rangeArr.length; rIdx++) {
            let selIndexes: number[] = getRangeIndexes(rangeArr[rIdx]);
            valArr = this.getNumericArray(selIndexes, valArr);
        }
        valArr = valArr.sort((n1: number, n2: number) => n1 - n2).reverse();
        for (let i: number = 0; i < valArr.length; i++) {
            if (valArr[i] === value) {
                id = i;
                break;
            }
        }
        let hexcode: string = (id === 0) ? colors[0] : (id === valArr.length - 1) ? colors[colors.length - 1] :
            (valArr.length === 3 && id === 1) ? colors[1] : this.getGradient(id, colors[0], colors[1], colors[2], valArr.length);
        if (!isNullOrUndefined(actCell)) {
            let style: CellStyleModel = {};
            if (!isNullOrUndefined(id)) {
                style = { backgroundColor: hexcode };
                td.style.backgroundColor = hexcode;
            } else {
                style = this.parent.getCellStyleValue(['backgroundColor'], [rIdx, cIdx]);
                td.style.backgroundColor = style.backgroundColor;
            }
        }
    }

    // tslint:disable-next-line:max-func-body-length
    private applyDataBars(val: string, cFRule: ConditionalFormatModel, tdEle: HTMLElement, rIdx: number, cIdx: number): void {
        let value: number;
        let rowIdx: number;
        let colIdx: number;
        let sheet: SheetModel = this.parent.getActiveSheet();
        let left: CSSStyleDeclaration = {} as CSSStyleDeclaration;
        let right: CSSStyleDeclaration = {} as CSSStyleDeclaration;
        let posColor: string = '';
        let negColor: string = '';
        let cFColor: string = cFRule.type;
        let actCell: CellModel = sheet.rows[rIdx] && sheet.rows[rIdx].cells[cIdx] ? sheet.rows[rIdx].cells[cIdx] : null;
        if (!actCell) {
            return;
        }
        let valArr: number[] = [];
        let row: HTMLElement = this.parent.getMainContent().getElementsByClassName('e-row')[rIdx] as HTMLElement;
        let td: HTMLElement = tdEle ||
            this.parent.getMainContent().getElementsByClassName('e-row')[rIdx].getElementsByClassName('e-cell')[cIdx] as HTMLElement;
        let rowHeight: number = !row ? 20 : row.style ? parseInt(row.style.height, 10) : 20;
        let posArr: number[] = [];
        let negArr: number[] = [];
        let topVal: number;
        let leftStandardWidth: number = 0;
        value = parseInt(val, 10);
        let rangeArr: string[] = cFRule.range.split(',');
        for (let rIdx: number = 0; rIdx < rangeArr.length; rIdx++) {
            let selIndexes: number[] = getRangeIndexes(rangeArr[rIdx]);
            valArr = this.getNumericArray(selIndexes, valArr);
        }
        for (let idx: number = 0; idx < valArr.length; idx++) {
            valArr[idx] > 0 ? posArr.push(valArr[idx]) : negArr.push(valArr[idx]);
        }
        cFColor = cFColor === 'BlueDataBar' ? 'B' : cFColor === 'GreenDataBar' ? 'G' : cFColor === 'RedDataBar' ? 'R' :
            cFColor === 'OrangeDataBar' ? 'O' : cFColor === 'LightBlueDataBar' ? 'LB' : cFColor === 'PurpleDataBar' ? 'P' : '';
        posColor = this.getColor(cFColor)[0];
        negColor = this.getColor('R')[0];
        posArr = posArr.sort((n1: number, n2: number) => n1 - n2).reverse();
        negArr = negArr.sort((n1: number, n2: number) => n1 - n2);
        if (negArr.length && posArr.length) {
            topVal = posArr[0] + Math.abs(negArr[0]);
            leftStandardWidth = (Math.abs((negArr[0] / topVal) * 100));
        } else if (negArr.length || posArr.length) {
            topVal = negArr.length ? negArr[0] : posArr[0];
        } else {
            return;
        }
        if (td) {
            if (isNullOrUndefined(value) || val === '') {
                if (td.getElementsByClassName('e-cf-databar')[0]) {
                    td.removeChild(td.getElementsByClassName('e-cf-databar')[0]);
                }
            }
        }
        if (isNumber(value)) {
            let databar: HTMLElement = this.parent.createElement('div', { id: 'spreadsheet-databar', className: 'e-cf-databar' });
            let leftSpan: HTMLElement = this.parent.createElement('span', { id: 'spreadsheet-leftspan', className: 'e-databar' });
            let rightSpan: HTMLElement = this.parent.createElement('span', { id: 'spreadsheet-rightspan', className: 'e-databar' });
            let dataSpan: HTMLElement = this.parent.createElement('span', { id: 'spreadsheet-dataspan', className: 'e-databar-value' });
            let iconSetSpan: HTMLElement;
            left = leftSpan.style;
            right = rightSpan.style;
            databar.appendChild(dataSpan);
            databar.insertBefore(rightSpan, dataSpan);
            databar.insertBefore(leftSpan, rightSpan);
            if (td.querySelector('.e-iconsetspan')) {
                iconSetSpan = td.querySelector('.e-iconsetspan');
            }
            td.textContent = '';
            td.appendChild(databar);
            if (iconSetSpan) {
                td.insertBefore(iconSetSpan, td.firstElementChild);
            }
            dataSpan.innerHTML = this.parent.getDisplayText(actCell);
            databar.style.height = rowHeight - 1 + 'px';
            dataSpan.style.fontSize = '11pt';
            if (!negArr.length) {
                right.width = '' + Math.ceil(Math.abs((value / topVal) * 100)) + '%';
                right.height = rowHeight - 3 + 'px';
                right.backgroundColor = cFColor = posColor;
                right.left = '0px';
            } else if (!posArr.length) {
                right.width = '' + Math.ceil(Math.abs((value / topVal) * 100)) + '%';
                right.height = rowHeight - 3 + 'px';
                right.backgroundColor = cFColor = negColor;
                right.left = '0px';
            } else {
                if (value > -1) {
                    left.width = leftStandardWidth + '%';
                    left.height = rowHeight - 3 + 'px'; // -3 buffer of data bar.
                    left.backgroundColor = 'transparent';
                    left.left = '0px';
                    right.width = '' + Math.ceil(Math.abs((value / topVal) * 100)) + '%';
                    right.height = rowHeight - 3 + 'px';
                    right.backgroundColor = cFColor = posColor;
                    right.left = leftStandardWidth + '%';
                } else if (value < 0) {
                    left.width = '' + Math.ceil(Math.abs((value / topVal) * 100)) + '%';
                    left.height = rowHeight - 3 + 'px';
                    left.backgroundColor = negColor;
                    if (left.width === leftStandardWidth + '%') {
                        left.left = '0px';
                    } else {
                        left.right = (100 - leftStandardWidth) + '%';
                    }
                }
            }
        }
    }

    private getNumericArray(selIndexes: number[], valArr: number[]): number[] {
        let sheet: SheetModel = this.parent.getActiveSheet();
        for (let rIdx: number = selIndexes[0]; rIdx <= selIndexes[2]; rIdx++) {
            for (let cIdx: number = selIndexes[1]; cIdx <= selIndexes[3]; cIdx++) {
                let cellVal: string =
                    getCell(rIdx, cIdx, sheet) && getCell(rIdx, cIdx, sheet).value ? getCell(rIdx, cIdx, sheet).value : '';
                if (!isNullOrUndefined(cellVal) && !isNumber(cellVal) && !isDateTime(cellVal)) {
                    continue;
                } else {
                    let cellValue: number = parseInt(cellVal, 10);
                    if (!isNullOrUndefined(cellVal) && cellVal !== '') {
                        valArr.push(cellValue);
                    }
                }
            }
        }
        return valArr;
    }

    private getColor(cfColor: string): string[] {
        if (cfColor === 'LB') {
            return ['#008aef'];
        }
        let colorCodeArr: string[] = cfColor.split('');
        let colorArr: string[] = [];
        for (let i: number = 0; i < colorCodeArr.length; i++) {
            switch (colorCodeArr[i]) {
                case 'G':
                    colorArr.push('#63be7b');
                    break;
                case 'Y':
                    colorArr.push('#ffeb84');
                    break;
                case 'R':
                    colorArr.push('#f8696b');
                    break;
                case 'W':
                    colorArr.push('#ffffff');
                    break;
                case 'B':
                    colorArr.push('#5a8ac6');
                    break;
                case 'O':
                    colorArr.push('#ffb628');
                    break;
                case 'LB':
                    colorArr.push('#008aef');
                    break;
                case 'P':
                    colorArr.push('#d6007b');
                    break;
            }
        }
        return colorArr;
    }

    private getGradient(t: number, start: string, middle: string, end: string, large: number): string {
        if (isNullOrUndefined(end)) {
            return this.getLinear(start, middle, t / large);
        } else {
            let center: number = large / 2;
            return t >= center ? this.getLinear(middle, end, Math.abs((t - center) / center)) : this.getLinear(start, middle, t / center);
        }
    }

    private getLinear(s: string, e: string, x: number): string {
        let r: String = this.byteLinear(s[1] + s[2], e[1] + e[2], x);
        let g: string = this.byteLinear(s[3] + s[4], e[3] + e[4], x);
        let b: string = this.byteLinear(s[5] + s[6], e[5] + e[6], x);
        return '#' + r + g + b;
    }

    private byteLinear(a: string, b: string, x: number): string {
        let y: number = (parseInt(a, 16) * (1 - x) + parseInt(b, 16) * x) | 0;
        return Math.abs(y).toString(16);
    }

    private isGreaterThanLessThan(cFRule: ConditionalFormatModel, value: string, input: string, isGrearThan: boolean): boolean {
        let numRegx: RegExp = new RegExp(/[^.0-9]+/g);
        let txtRegx: RegExp = new RegExp(/[^.-a-zA-Z 0-9]+/g);
        let isApply: boolean = false;
        if (isNumber(value)) {
            if (isNumber(input)) {
                isApply = isGrearThan ? parseFloat(value) > parseFloat(input.replace(txtRegx, '')) :
                    parseFloat(value) < parseFloat(input.replace(txtRegx, ''));
            } else {
                let dateEventArgs: { [key: string]: string | number | boolean } = {
                    value: input,
                    rowIndex: 0,
                    colIndex: 0,
                    sheetIndex: 0,
                    isDate: false,
                    updatedVal: '',
                    isTime: false
                };
                this.parent.notify(checkDateFormat, dateEventArgs);
                if (dateEventArgs.isDate || dateEventArgs.isTime) {
                    isApply = isGrearThan ? value > dateEventArgs.updatedVal : value < dateEventArgs.updatedVal;
                    cFRule.value = dateEventArgs.updatedVal.toString();
                } else {
                    isApply = isGrearThan ? value.toLowerCase() > input.toLowerCase() : value.toLowerCase() < input.toLowerCase();
                }
            }
        } else if (value === '' && !isGrearThan) {
            isApply = true;
        }
        return isApply;
    }

    private isBetWeen(cFRule: ConditionalFormatModel, value: string, input1: string, input2: string): boolean {
        let numRegx: RegExp = new RegExp(/[^.0-9]+/g);
        let txtRegx: RegExp = new RegExp(/[^.-a-zA-Z 0-9]+/g);
        let isApply: boolean = false;
        input1 = input1.replace(txtRegx, '');
        input2 = input2.replace(txtRegx, '');
        if (isNumber(value)) {
            if (isNumber(input1)) {
                isApply = parseFloat(value) >= parseFloat(input1) && parseFloat(value) <= parseFloat(input2);
            } else {
                if (input1 && input2) {
                    let dateEventArgs1: { [key: string]: string | number | boolean } = {
                        value: input1,
                        rowIndex: 0,
                        colIndex: 0,
                        sheetIndex: 0,
                        isDate: false,
                        updatedVal: '',
                        isTime: false
                    };
                    let dateEventArgs2: { [key: string]: string | number | boolean } = {
                        value: input2,
                        rowIndex: 0,
                        colIndex: 0,
                        sheetIndex: 0,
                        isDate: false,
                        updatedVal: '',
                        isTime: false
                    };
                    this.parent.notify(checkDateFormat, dateEventArgs1);
                    this.parent.notify(checkDateFormat, dateEventArgs2);
                    if ((dateEventArgs1.isDate || dateEventArgs1.isTime) && (dateEventArgs2.isDate || dateEventArgs2.isTime)) {
                        isApply = value >= dateEventArgs1.updatedVal && value <= dateEventArgs2.updatedVal;
                        cFRule.value = dateEventArgs1.updatedVal.toString() + ',' + dateEventArgs2.updatedVal.toString();
                    } else {
                        isApply = value.toLowerCase() >= input1.toLowerCase() && value.toLowerCase() <= input2.toLowerCase();
                    }
                }
            }
        }
        return isApply;
    }

    private isEqualTo(cFRule: ConditionalFormatModel, value: string, input: string): boolean {
        let numRegx: RegExp = new RegExp(/[^.0-9]+/g);
        let txtRegx: RegExp = new RegExp(/[^.-a-zA-Z 0-9]+/g);
        let isApply: boolean = false;
        if (isNumber(value)) {
            if (isNumber(input)) {
                isApply = parseFloat(value) === parseFloat(input.replace(txtRegx, ''));
            } else {
                let dateTimeArgs: { [key: string]: string | number | boolean } = {
                    value: input,
                    rowIndex: 0,
                    colIndex: 0,
                    sheetIndex: 0,
                    isDate: false,
                    updatedVal: '',
                    isTime: false
                };
                this.parent.notify(checkDateFormat, dateTimeArgs);
                if (dateTimeArgs.isTime || dateTimeArgs.isDate) {
                    isApply = value === dateTimeArgs.updatedVal;
                    cFRule.value = dateTimeArgs.updatedVal.toString();
                } else {
                    isApply = value.toLowerCase() === input.toLowerCase();
                }
            }
        }
        return isApply;
    }

    private isContainsText(value: string, input: string): boolean {
        let numRegx: RegExp = new RegExp(/[^.0-9]+/g);
        let txtRegx: RegExp = new RegExp(/[^.-a-zA-Z 0-9]+/g);
        let isApply: boolean = false;
        if (isNullOrUndefined(value) || !value.length) {
            isApply = false;
        } else if (isNumber(input.replace(txtRegx, ''))) {
            input = input.replace(txtRegx, '');
            if (isDateTime(value)) {
                value = ((dateToInt(value))).toString();
            }
            isApply = value.indexOf(input) > -1;
        } else if (isDateTime(input)) {
            if (isDateTime(value)) {
                value = dateToInt(value).toString();
            }
            isApply = value.indexOf(dateToInt(input).toString()) > -1;
        } else {
            isApply = value.toLowerCase().indexOf(input.toLowerCase()) > -1;
        }
        return isApply;
    }

    private isTopBottomTenValue(cellValue: string, inp: string, cFRule: ConditionalFormatModel, isTop: boolean): boolean {
        let sheet: SheetModel = this.parent.getActiveSheet();
        let numRegx: RegExp = new RegExp(/[^.0-9]+/g);
        let txtRegx: RegExp = new RegExp(/[^.-a-zA-Z 0-9]+/g);
        let value: number = parseInt(cellValue, 10);
        let input: number = parseInt(inp, 10);
        let result: boolean = false;
        if (isNumber(inp)) {
            if (isNumber(cellValue)) {
                value = parseFloat(cellValue);
                input = parseFloat(inp.replace(txtRegx, ''));
            } else if (isDateTime(cellValue)) {
                value = dateToInt(cellValue);
                input = parseFloat(inp);
            }
            let dataArray: number[] = []; let cellVal: number | string;
            let rangeArr: string[] = cFRule.range.split(',');
            for (let rangeIdx: number = 0; rangeIdx < rangeArr.length; rangeIdx++) {
                let cFRuleIndexes: number[] = getRangeIndexes(rangeArr[rangeIdx]);
                for (let rowIdx: number = cFRuleIndexes[0]; rowIdx <= cFRuleIndexes[2]; rowIdx++) {
                    for (let colIdx: number = cFRuleIndexes[1]; colIdx <= cFRuleIndexes[3]; colIdx++) {
                        cellVal = getCell(rowIdx, colIdx, sheet) && getCell(rowIdx, colIdx, sheet).value ?
                            getCell(rowIdx, colIdx, sheet).value : '';
                        if (cellVal && isNumber(cellVal)) {
                            cellVal = parseFloat(cellVal);
                            dataArray.push(cellVal);
                        }
                    }
                }
            }
            dataArray =
                isTop ? dataArray.sort((n1: number, n2: number) => n1 - n2).reverse() : dataArray.sort((n1: number, n2: number) => n1 - n2);
            dataArray = dataArray.slice(0, input);
            result = (dataArray.indexOf(value) > -1);
        }
        return result;
    }

    private isTopBottomTenPercentage(val: string, inp: string, cFRule: ConditionalFormatModel, isTop: boolean): boolean {
        let sheet: SheetModel = this.parent.getActiveSheet();
        let numRegx: RegExp = new RegExp(/[^.0-9]+/g);
        let txtRegx: RegExp = new RegExp(/[^.-a-zA-Z 0-9]+/g);
        let value: number = parseInt(val, 10);
        let input: number = parseInt(inp, 10);
        let result: boolean = false;
        if (isNumber(inp)) {
            if (isNumber(val)) {
                value = parseFloat(val);
                input = parseFloat(inp.replace(txtRegx, ''));
            } else if (isDateTime(val)) {
                value = dateToInt(val);
                input = parseFloat(inp);
            }
            let dataArr: number[] = []; let cellVal: string | number; let diff: number; let count: number = 0; let considerCount: number;
            let rangeArr: string[] = cFRule.range.split(',');
            for (let rangeIdx: number = 0; rangeIdx < rangeArr.length; rangeIdx++) {
                let cFRuleIndexes: number[] = getRangeIndexes(rangeArr[rangeIdx]);
                for (let rIdx: number = cFRuleIndexes[0]; rIdx <= cFRuleIndexes[2]; rIdx++) {
                    for (let cIdx: number = cFRuleIndexes[1]; cIdx <= cFRuleIndexes[3]; cIdx++) {
                        cellVal = getCell(rIdx, cIdx, sheet) && getCell(rIdx, cIdx, sheet).value ? getCell(rIdx, cIdx, sheet).value : '';
                        if (cellVal && isNumber(cellVal)) {
                            cellVal = parseFloat(cellVal);
                            dataArr.push(cellVal);
                        }
                        count++;
                    }
                }
            }
            diff = 100 / count;
            considerCount = input / diff;
            considerCount = Math.ceil(considerCount);
            dataArr =
                isTop ? dataArr.sort((n1: number, n2: number) => n1 - n2).reverse() : dataArr.sort((n1: number, n2: number) => n1 - n2);
            dataArr = dataArr.slice(0, considerCount ? considerCount : 1);
            result = (dataArr.indexOf(value) > -1);
        }
        return result;
    }

    private isAboveBelowAverage(val: string, inp: string, cFRule: ConditionalFormatModel, isAbove: boolean): boolean {
        let sheet: SheetModel = this.parent.getActiveSheet();
        let value: number = parseFloat(val);
        let rangeColl: string[] = cFRule.range.split(',');
        let result: boolean = false;
        let dataArr: number[] = []; let cellValue: string | number; let average: number = 0;
        for (let rangeIdx: number = 0; rangeIdx < rangeColl.length; rangeIdx++) {
            let cFRuleIndexes: number[] = getRangeIndexes(rangeColl[rangeIdx]);
            for (let rIdx: number = cFRuleIndexes[0]; rIdx <= cFRuleIndexes[2]; rIdx++) {
                for (let cIdx: number = cFRuleIndexes[1]; cIdx <= cFRuleIndexes[3]; cIdx++) {
                    cellValue = getCell(rIdx, cIdx, sheet) && getCell(rIdx, cIdx, sheet).value ? getCell(rIdx, cIdx, sheet).value : '';
                    if (cellValue && isNumber(cellValue)) {
                        cellValue = parseFloat(cellValue);
                        dataArr.push(cellValue);
                    }
                }
            }
        }
        for (let idx: number = 0; idx < dataArr.length; idx++) {
            average += dataArr[idx];
        }
        average = average / dataArr.length;
        result = isAbove ? (value > average) : (value < average);
        return result;
    }

    private isDuplicateUnique(val: string, cFRule: ConditionalFormatModel, isAbove: boolean): boolean {
        let type: string = cFRule.type;
        let count: number = 0;
        let sheet: SheetModel = this.parent.getActiveSheet();
        let value: string = val;
        let rangeColl: string[] = cFRule.range.split(',');
        let cellValue: string;
        if (isNullOrUndefined(value) || value === '') {
            return false;
        }
        for (let rIdx: number = 0; rIdx < rangeColl.length; rIdx++) {
            let cFRuleIndexes: number[] = getRangeIndexes(rangeColl[rIdx]);
            for (let rowIdx: number = cFRuleIndexes[0]; rowIdx <= cFRuleIndexes[2]; rowIdx++) {
                for (let colIdx: number = cFRuleIndexes[1]; colIdx <= cFRuleIndexes[3]; colIdx++) {
                    cellValue = getCell(rowIdx, colIdx, sheet) && getCell(rowIdx, colIdx, sheet).value ?
                        getCell(rowIdx, colIdx, sheet).value.toString() : '';
                    if (cellValue && cellValue !== '') {
                        count = value.toLowerCase() === cellValue.toLowerCase() ? count + 1 : count;
                        if (count === 2) {
                            return type === 'Duplicate' ? true : false;
                        }
                    }
                }
            }
        }
        return type === 'Duplicate' ? false : true;
    }

    private setFormat(style: CellStyleModel, cFRule: ConditionalFormatModel): CellStyleModel {
        switch (cFRule.cFColor) {
            case 'RedFT':
                style.backgroundColor = '#ffc7ce';
                style.color = '#9c0055';
                break;
            case 'YellowFT':
                style.backgroundColor = '#ffeb9c';
                style.color = '#9c6500';
                break;
            case 'GreenFT':
                style.backgroundColor = '#c6efce';
                style.color = '#006100';
                break;
            case 'RedF':
                style.backgroundColor = '#ffc7ce';
                break;
            case 'RedT':
                style.color = '#9c0055';
                break;
        }
        return style;
    }

    /**
     * Gets the module name.
     * @returns string
     */
    protected getModuleName(): string {
        return 'conditionalFormatting';
    }
}
