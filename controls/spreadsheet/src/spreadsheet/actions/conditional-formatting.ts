import { ConditionalFormatEventArgs, Spreadsheet, DialogBeforeOpenEventArgs } from '../index';
import { renderCFDlg, locale, dialog, focus, removeElements, readonlyAlert } from '../common/index';
import { CellModel, SheetModel, getCell, isHiddenRow, isHiddenCol, getRowHeight, skipDefaultValue } from '../../workbook/base/index';
import { getRangeIndexes, checkDateFormat, applyCF, isNumber, getCellIndexes, parseLocaleNumber } from '../../workbook/index';
import { CellFormatArgs, isDateTime, dateToInt, CellStyleModel, applyCellFormat, clearCF, getSwapRange, isReadOnlyCells } from '../../workbook/common/index';
import { setCFRule, getCellAddress, DateFormatCheckArgs, CFArgs, checkRange, getViewportIndexes } from '../../workbook/common/index';
import { extend, isNullOrUndefined, L10n, removeClass } from '@syncfusion/ej2-base';
import { Dialog } from '../services';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { HighlightCell, TopBottom, CFColor, ConditionalFormatModel, ApplyCFArgs, ConditionalFormat } from '../../workbook/common/index';
import { NumericTextBox } from '@syncfusion/ej2-inputs';
import { calculateFormula, rowFillHandler, getTypeFromFormat } from '../../workbook/index';
import { BeforeOpenEventArgs } from '@syncfusion/ej2-popups';

/**
 * Represents Conditional Formatting support for Spreadsheet.
 */
export class ConditionalFormatting {
    private parent: Spreadsheet;
    private dupData: { [key: string]: Object }[];
    private colorData: { [key: string]: Object }[];

    /**
     * Constructor for the Spreadsheet Conditional Formatting module.
     *
     * @param {Spreadsheet} parent - Constructor for the Spreadsheet Conditional Formatting module.
     */
    constructor(parent: Spreadsheet) {
        this.parent = parent;
        this.addEventListener();
    }

    /**
     * To destroy the Conditional Formatting module.
     *
     * @returns {void} - To destroy the Conditional Formatting module.
     */
    protected destroy(): void {
        this.removeEventListener();
        if (this.dupData) { this.dupData = []; }
        if (this.colorData) { this.colorData = []; }
        this.parent = null;
    }

    private addEventListener(): void {
        this.parent.on(applyCF, this.applyCF, this);
        this.parent.on(renderCFDlg, this.renderCFDlg, this);
        this.parent.on(clearCF, this.clearCF, this);
    }

    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(applyCF, this.applyCF);
            this.parent.off(renderCFDlg, this.renderCFDlg);
            this.parent.off(clearCF, this.clearCF);
        }
    }

    private clearCF(args: { indexes: number[] }): void {
        const sheet: SheetModel = this.parent.getActiveSheet();
        const clearFn: Function = (rIdx: number, cIdx: number, cell: CellModel, td: HTMLElement): void => {
            removeClass([td], ['e-redft', 'e-yellowft', 'e-greenft', 'e-redf', 'e-redt', 'e-iconset']);
            let styleVal: string; let style: CellStyleModel;
            ['backgroundColor', 'color'].forEach((styleProp: string): void => {
                if (td.style[`${styleProp}`]) {
                    td.style[`${styleProp}`] = '';
                    styleVal = cell && cell.style && cell.style[`${styleProp}`] || this.parent.commonCellStyle[`${styleProp}`];
                    if (styleVal) {
                        style = {};
                        style[`${styleProp}`] = styleVal;
                        this.parent.notify(applyCellFormat, <CellFormatArgs>{ style: style, rowIdx: rIdx, colIdx: cIdx, td: td });
                    }
                }
            });
            let cfEle: HTMLElement;
            ['.e-cf-databar', '.e-iconsetspan'].forEach((clsSelector: string): void => {
                cfEle = td.querySelector(clsSelector);
                const wrapElement: HTMLElement = td.querySelector('.e-wrap-content');
                if (cfEle) {
                    if (wrapElement) {
                        wrapElement.removeChild(cfEle);
                    } else {
                        td.removeChild(cfEle);
                    }
                    td.textContent = this.parent.getDisplayText(cell);
                }
            });
        };
        this.updateRange(
            sheet, args.indexes, this.parent.frozenRowCount(sheet), this.parent.frozenColCount(sheet), getCellIndexes(sheet.topLeftCell),
            clearFn);
    }

    private renderCFDlg(args: { action: string }): void {
        const l10n: L10n = this.parent.serviceLocator.getService(locale); let readonlyAlertThrow: boolean;
        const dialogInst: Dialog = this.parent.serviceLocator.getService(dialog) as Dialog;
        dialogInst.show({
            width: 375, showCloseIcon: true, isModal: true, cssClass: 'e-conditionalformatting-dlg',
            header: args.action.replace('...', ''),
            beforeOpen: (beforeOpenArgs: BeforeOpenEventArgs): void => {
                const dlgArgs: DialogBeforeOpenEventArgs = {
                    dialogName: 'ConditionalFormatDialog',
                    element: beforeOpenArgs.element, target: beforeOpenArgs.target, cancel: beforeOpenArgs.cancel
                };
                this.parent.trigger('dialogBeforeOpen', dlgArgs);
                if (dlgArgs.cancel) {
                    beforeOpenArgs.cancel = true;
                } else {
                    dialogInst.dialogInstance.content = this.cfDlgContent(args.action);
                    dialogInst.dialogInstance.dataBind();
                    focus(this.parent.element);
                }
            },
            beforeClose: this.dialogBeforeClose.bind(this),
            close: (): void => {
                if (readonlyAlertThrow) {
                    this.parent.notify(readonlyAlert, null);
                    readonlyAlertThrow = false;
                }
            },
            buttons: [{
                buttonModel: { content: l10n.getConstant('Ok'), isPrimary: true },
                click: (): void => {
                    const sheet: SheetModel = this.parent.getActiveSheet();
                    if (isReadOnlyCells(this.parent, getSwapRange(getRangeIndexes(sheet.selectedRange)))) {
                        readonlyAlertThrow = true;
                    } else {
                        this.dlgClickHandler(args.action);
                    }
                    dialogInst.hide();
                }
            }]
        });
    }

    private dialogBeforeClose(): void {
        const numeric: NumericTextBox = this.numericTBElements;
        if (numeric && numeric.element) {
            numeric.destroy();
            numeric.element.remove();
        }
        this.numericTBElements = null;

        this.dropDownListElements.forEach((dropDownList: DropDownList) => {
            if (dropDownList && dropDownList.element) {
                dropDownList.destroy();
                dropDownList.element.remove();
            }
        });
        this.dropDownListElements = [];

        if (this.value1Inp) {
            this.value1Inp.removeEventListener('input', this.validateCFInput.bind(this));
            if (this.value1Inp.parentNode) {
                this.value1Inp.parentNode.removeChild(this.value1Inp);
            }
            this.value1Inp = null;
        }
        if (this.value2Inp) {
            this.value2Inp.removeEventListener('input', this.validateCFInput.bind(this));
            if (this.value2Inp.parentNode) {
                this.value2Inp.parentNode.removeChild(this.value2Inp);
            }
            this.value2Inp = null;
        }
        removeElements(this.spanElements); this.spanElements = [];
        removeElements(this.inputElements); this.inputElements = [];
        removeElements(this.divElements); this.divElements = [];
    }

    private dlgClickHandler(action: string): void {
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        const cont: HTMLElement = this.parent.element.querySelector('.e-conditionalformatting-dlg .e-dlg-content .e-cf-dlg') as HTMLElement;
        const cf: ConditionalFormatModel = { cFColor: this.getCFColor((cont.querySelector('.e-cfsub .e-input') as HTMLInputElement).value),
            range: this.parent.getActiveSheet().selectedRange };
        const cfInputs: NodeListOf<HTMLInputElement>  = cont.querySelectorAll('.e-cfmain .e-input') as NodeListOf<HTMLInputElement>;
        if (action === l10n.getConstant('DuplicateValues') + '...') {
            cf.type = cfInputs[0].value === l10n.getConstant('Duplicate') ? 'Duplicate' : 'Unique';
        } else {
            cf.type = this.getType(action);
            const cfValues: string[] = [];
            if (cfInputs[0]) {
                cfValues.push(cfInputs[0].value);
            }
            if (cfInputs[1]) {
                cfValues.push(cfInputs[1].value);
            }
            parseLocaleNumber(cfValues, this.parent);
            cf.value = cfValues.join(',');
        }
        this.parent.notify(setCFRule, <CFArgs>{ cfModel: cf, isAction: true });
    }

    private getType(action: string): HighlightCell | TopBottom {
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        let result: HighlightCell | TopBottom;
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

    private getCFColor(value: string): CFColor {
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        let result: CFColor = 'RedFT';
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

    private divElements: HTMLElement[] = [];
    private spanElements: HTMLElement[] = [];
    private inputElements: HTMLElement[] = [];
    private dropDownListElements: DropDownList[] = [];
    private numericTBElements: NumericTextBox;
    private value1Inp: HTMLInputElement;
    private value2Inp: HTMLElement;

    private cfDlgContent(action: string): HTMLElement {
        const dlgText: string = this.getDlgText(action);
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        const dlgContent: HTMLElement = this.parent.createElement('div', { className: 'e-cf-dlg' });
        const mainDiv: HTMLElement = this.parent.createElement('div', { className: 'e-cfmain' });
        const subDiv: HTMLElement = this.parent.createElement('div', { className: 'e-cfsub' });
        this.divElements.push(dlgContent); this.divElements.push(mainDiv); this.divElements.push(subDiv);
        const value1Text: HTMLElement = this.parent.createElement('span', { className: 'e-header e-top-header' });
        value1Text.innerText = dlgText;
        this.value1Inp =
        this.parent.createElement('input', { className: 'e-input', id: 'valueInput', attrs: { type: 'text',
            'aria-label': dlgText } }) as HTMLInputElement;
        const duplicateSelectEle: HTMLElement = this.parent.createElement('input', { className: 'e-select' });
        const subDivText: HTMLElement = this.parent.createElement('span', { className: 'e-header' });
        subDivText.innerText = l10n.getConstant('With');
        const colorSelectEle: HTMLElement = this.parent.createElement('input', { className: 'e-select' });
        this.spanElements.push(value1Text); this.inputElements.push(duplicateSelectEle);
        this.spanElements.push(subDivText); this.inputElements.push(colorSelectEle);
        dlgContent.appendChild(mainDiv);
        dlgContent.appendChild(subDiv);

        mainDiv.appendChild(value1Text); let setValidation: boolean;
        if (action !== l10n.getConstant('DuplicateValues') + '...') {
            if (action !== l10n.getConstant('AboveAverage') + '...' && action !== l10n.getConstant('BelowAverage') + '...') {
                mainDiv.appendChild(this.value1Inp); setValidation = true;
                const percent: boolean = action === l10n.getConstant('Top10') + ' %...' || action === l10n.getConstant('Bottom10') + ' %...';
                if (action === l10n.getConstant('Top10Items') + '...' || action === l10n.getConstant('Bottom10Items') + '...' || percent) {
                    this.value1Inp.maxLength = percent ? 3 : 4;
                    const numeric: NumericTextBox = new NumericTextBox({ value: 10, min: 1, max: percent ? 100 : 1000, format: '###' });
                    this.numericTBElements = numeric;
                    numeric.appendTo(this.value1Inp);
                }
            }
        } else {
            mainDiv.appendChild(duplicateSelectEle);
            this.dupData = [
                { text: l10n.getConstant('Duplicate'), id: 'duplicate' },
                { text: l10n.getConstant('Unique'), id: 'unique' }
            ];
            const dupList: DropDownList = new DropDownList({
                dataSource: this.dupData,
                index: 0,
                popupHeight: '200px'
            });
            this.dropDownListElements.push(dupList);
            dupList.appendTo(duplicateSelectEle);
        }
        if (action === l10n.getConstant('Between') + '...') {
            const value2Text: HTMLElement = this.parent.createElement(
                'span', { className: 'e-header e-header-2' });
            value2Text.innerText = l10n.getConstant('And');
            this.value2Inp = this.parent.createElement('input', { className: 'e-input e-between' });
            this.spanElements.push(value2Text);
            mainDiv.appendChild(value2Text);
            mainDiv.appendChild(this.value2Inp);
            this.value2Inp.addEventListener('input', this.validateCFInput.bind(this));
        }
        if (setValidation) {
            this.validateCFInput({ target: this.value1Inp });
            this.value1Inp.addEventListener('input', this.validateCFInput.bind(this));
        }
        subDiv.appendChild(subDivText);
        subDiv.appendChild(colorSelectEle);
        this.colorData = [
            { text: l10n.getConstant('LightRedFillWithDarkRedText'), value: 'redft', id: 'redft' },
            { text: l10n.getConstant('YellowFillWithDarkYellowText'), id: 'yellowft' },
            { text: l10n.getConstant('GreenFillWithDarkGreenText'), id: 'greenft' },
            { text: l10n.getConstant('RedFill'), id: 'redf' },
            { text: l10n.getConstant('RedText'), id: 'redt' }
        ];
        const colorList: DropDownList = new DropDownList({
            dataSource: this.colorData,
            index: 0,
            popupHeight: '200px'
        });
        this.dropDownListElements.push(colorList);
        colorList.appendTo(colorSelectEle);
        return dlgContent;
    }

    private validateCFInput(e: { target: HTMLElement }): void {
        const dialogInst: Dialog = (this.parent.serviceLocator.getService(dialog) as Dialog);
        let text: string = (e.target as HTMLInputElement).value;
        const btn: HTMLButtonElement = dialogInst.dialogInstance.element.getElementsByClassName('e-primary')[0] as HTMLButtonElement;
        if (text && (e.target.classList.contains('e-between') || e.target.parentElement.querySelector('.e-between'))) {
            text = (e.target.parentElement.querySelector(
                (e.target.classList.contains('e-between') ? '.e-input' : '.e-between')) as HTMLInputElement).value;
        }
        btn.disabled = !(text.trim());
    }

    private checkCellHandler(rowIdx: number, colIdx: number, cf: ConditionalFormatModel): boolean {
        const ranges: string[] = cf.range.trim().split(',');
        return ranges.some((range: string) => {
            const indexes: number[] = getRangeIndexes(range.includes(':') ? range : `${range}:${range}`);
            return rowIdx >= indexes[0] && rowIdx <= indexes[2] && colIdx >= indexes[1] && colIdx <= indexes[3];
        });
    }

    private getDlgText(action: string): string {
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
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

    private updateResult(
        cf: ConditionalFormat, sheet: SheetModel, isDataBar: boolean, isColorScale: boolean, isAverage: boolean, isTopBottom: boolean,
        isIconSets: boolean, input: string): void {
        const valueObj: { [key: string]: boolean } = {}; const dupValueObj: { [key: string]: boolean } = {};
        const rangeArr: string[] = cf.range.split(','); let result: string[] | number[] = [];
        let rangeIndexes: number[]; let val: string; let cell: CellModel; let cellType: string;
        let updateFn: Function;
        if (isDataBar) {
            updateFn = (): void => {
                if (isNumber(val) && cellType !== 'Text') {
                    const intVal: number = parseFloat(val);
                    if (intVal >= 0) {
                        if (result[0] === undefined || intVal > result[0]) {
                            result[0] = intVal;
                        }
                    } else if (result[1] === undefined || intVal < result[1]) {
                        result[1] = intVal;
                    }
                }
            };
        } else if (isColorScale) {
            updateFn = (): void => {
                if (isNumber(val) && cellType !== 'Text') {
                    const intVal: number = parseFloat(val);
                    (<number[]>result).push(Number(intVal));
                }
            };
        } else if (isAverage) {
            result = [0, 0];
            updateFn = (): void => {
                if (isNumber(val) && cellType !== 'Text') {
                    (<number>result[0]) += parseFloat(val);
                    (<number>result[1])++;
                }
            };
        } else if (isTopBottom) {
            updateFn = (): void => {
                if (isNumber(val) && cellType !== 'Text') {
                    (<number[]>result).push(parseFloat(val));
                }
            };
        } else if (isIconSets) {
            updateFn = (): void => {
                if (isNumber(val) && cellType !== 'Text') {
                    const intVal: number = parseFloat(val);
                    if (result[0] === undefined || intVal < result[0]) {
                        result[0] = intVal;
                    }
                    if (result[1] === undefined || intVal > result[1]) {
                        result[1] = intVal;
                    }
                }
            };
        } else {
            updateFn = (): void => {
                if (valueObj[`${val}`]) {
                    if (val !== '') {
                        if (!dupValueObj[`${val}`]) {
                            dupValueObj[`${val}`] = true;
                            (<string[]>result).push(val);
                        }
                    }
                } else {
                    valueObj[`${val}`] = true;
                }
            };
        }
        for (let rangeIdx: number = 0; rangeIdx < rangeArr.length; rangeIdx++) {
            rangeIndexes = getRangeIndexes(rangeArr[rangeIdx as number]);
            for (let i: number = rangeIndexes[0]; i <= rangeIndexes[2]; i++) {
                for (let j: number = rangeIndexes[1]; j <= rangeIndexes[3]; j++) {
                    cell = getCell(i, j, sheet, false, true);
                    cellType = '';
                    if (!isNullOrUndefined(cell.value)) {
                        val = cell.value.toString().toLowerCase();
                        cellType = getTypeFromFormat(cell.format);
                        updateFn();
                    } else if (cell.formula) {
                        this.parent.notify(
                            calculateFormula, {
                                cell: cell, rowIdx: i, colIdx: j, sheetIndex: this.parent.activeSheetIndex
                            });
                        val = cell.value.toString().toLowerCase();
                        cellType = getTypeFromFormat(cell.format);
                        updateFn();
                    }
                }
            }
        }
        if (isColorScale || isTopBottom) {
            result = (<number[]>result).sort((n1: number, n2: number) => n1 - n2);
            if (!cf.type.includes('Bottom')) {
                result = result.reverse();
            }
            if (isTopBottom) {
                let endIdx: number = parseFloat(input);
                if (cf.type.includes('Percentage')) {
                    endIdx = endIdx / (100 / result.length);
                    endIdx = (endIdx < 1) ? 1 : endIdx;
                }
                result = result.slice(0, endIdx);
            }
        } else if (isAverage) {
            result = [<number>result[0] / <number>result[1]];
            if (!result[0]) {
                result = [];
            }
        }
        cf.result = result;
    }

    private applyCF(args: ApplyCFArgs): void {
        const rangeCheck: boolean = !args.cfModel;
        const sheet: SheetModel = this.parent.getActiveSheet();
        const cfRule: ConditionalFormatModel[] = args.cfModel || sheet.conditionalFormats;
        let indexes: number[][] = [args.indexes];
        if (args.refreshAll) {
            indexes = getViewportIndexes(this.parent, this.parent.viewport);
        }
        const updatedCFCellRef: { [key: string]: boolean } = {};
        for (let i: number = cfRule.length - 1; i >= 0; i--) {
            if (rangeCheck && (indexes[0].length === 2 ? !this.checkCellHandler(args.indexes[0], args.indexes[1], cfRule[i as number]) :
                !checkRange(indexes, cfRule[i as number].range))) {
                continue;
            }
            this.updateCF(args, sheet, <ConditionalFormat>cfRule[i as number], updatedCFCellRef);
        }
    }

    private updateCF(args: ApplyCFArgs, sheet: SheetModel, cf: ConditionalFormat, updatedCFCellRef: { [key: string]: boolean }): void {
        let value1: string; let value2: string = '';
        let isLongDate: boolean = false;
        if (cf.value) {
            let dateValues: string[] = [];
            let valueArr: string[] = [];
            if (cf.type === 'Between') {
                dateValues = cf.value.split('"').filter((date: string) => date.trim() && date.trim() !== ',');
                if (dateValues.length > 1) {
                    valueArr = dateValues;
                    isLongDate = true;
                } else {
                    valueArr = cf.value.split(',').filter((value: string) => !!value.trim());
                }
            } else {
                valueArr = [cf.value];
            }
            if (valueArr.length > 1) {
                if (valueArr[0].split('(').length > 1) {
                    let valueStr: string = '';
                    for (let idx: number = 0; idx < valueArr.length; idx++) {
                        valueStr += valueArr[idx as number] + ',';
                        if (valueStr.split('(').length === valueStr.split(')').length && value1 === undefined) {
                            value1 = valueStr.substring(0, valueStr.length - 1);
                            valueStr = '';
                        }
                    }
                    value2 = valueStr.substring(0, valueStr.length - 1);
                } else {
                    value1 = valueArr[0];
                    for (let idx: number = 1; idx < valueArr.length; idx++) {
                        value2 += idx + 1 === valueArr.length ? valueArr[idx as number] : valueArr[idx as number] + ',';
                    }
                }
            } else {
                value1 = valueArr[0] || cf.value;
            }
        }
        if (!cf.type) {
            cf.type = 'GreaterThan';
        }
        let style: CellStyleModel; let cfColor: string;
        if (cf.format && cf.format.style) {
            style = skipDefaultValue(cf.format.style, true);
            if (!Object.keys(style).length) {
                cfColor = cf.cFColor;
                if (!cfColor) {
                    cfColor = cf.cFColor = 'RedFT';
                }
            }
        } else {
            style = {};
            cfColor = cf.cFColor;
            if (!cfColor) {
                cfColor = cf.cFColor = 'RedFT';
            }
        }
        const isAverage: boolean = cf.type.includes('Average');
        const isTopBottom: boolean = cf.type.includes('10') && isNumber(value1);
        const isIconSets: boolean = (cf.type.includes('Three') || cf.type.includes('Four') || cf.type.includes('Five'));
        const isDataBar: boolean = cf.type.includes('DataBar');
        const isColorScale: boolean = cf.type.includes('ColorScale');
        if ((!args.isRender || !cf.result) && (cf.type === 'Duplicate' || cf.type === 'Unique' || isDataBar
            || isColorScale || isAverage || isTopBottom || isIconSets)) {
            this.updateResult(cf, sheet, isDataBar, isColorScale, isAverage, isTopBottom, isIconSets, value1);
        }
        const updateCF: Function = (rIdx: number, cIdx: number, cell: CellModel, td: HTMLElement, currentRowHeight?: number,
                                    isLongDate?: boolean): void => {
            const cellVal: string = cell && !isNullOrUndefined(cell.value) ? cell.value.toString() : '';
            let isApply: boolean; let dateEventArgs: DateFormatCheckArgs;
            let isValueCFRule: boolean = true;
            const cellType: string = cell ? getTypeFromFormat(cell.format) : '';
            switch (cf.type) {
            case 'GreaterThan':
            case 'LessThan':
                isApply = this.isGreaterThanLessThan(cf, cellVal, value1, cellType);
                break;
            case 'Between':
                isApply = isNumber(cellVal) && cellType !== 'Text' && this.isBetWeen(cf, cellVal, value1, value2, isLongDate);
                break;
            case 'EqualTo':
                isApply = this.isEqualTo(cf, cellVal, value1);
                break;
            case 'ContainsText':
                isApply = cellVal && value1 && this.isContainsText(cellVal, value1);
                break;
            case 'DateOccur':
                dateEventArgs = { value: value1, cell: {}, updatedVal: value1 };
                if (!isNumber(value1)) {
                    this.parent.notify(checkDateFormat, dateEventArgs);
                }
                isApply = cellVal === dateEventArgs.updatedVal;
                break;
            case 'Unique':
                isApply = cellVal !== '' && (<string[]>cf.result).indexOf(cellVal.toLowerCase()) === -1;
                break;
            case 'Duplicate':
                isApply = (<string[]>cf.result).indexOf(cellVal.toLowerCase()) > -1;
                break;
            case 'Top10Items':
            case 'Bottom10Items':
            case 'Top10Percentage':
            case 'Bottom10Percentage':
                if (cf.result) {
                    let value: number = parseFloat(cellVal);
                    if (isDateTime(cellVal)) {
                        value = dateToInt(cellVal);
                    }
                    isApply = (<number[]>cf.result).indexOf(value) > -1;
                }
                break;
            case 'AboveAverage':
                isApply = cf.result.length && isNumber(cellVal) && cellType !== 'Text' && parseFloat(cellVal) > <number>cf.result[0];
                break;
            case 'BelowAverage':
                isApply = cf.result.length && isNumber(cellVal) && cellType !== 'Text' && parseFloat(cellVal) < <number>cf.result[0];
                break;
            default:
                isValueCFRule = false;
                if (isDataBar) {
                    if (!updatedCFCellRef[`${rIdx}_${cIdx}_bars`]) {
                        updatedCFCellRef[`${rIdx}_${cIdx}_bars`] = true;
                        this.applyDataBars(cellVal, cf, td, rIdx, cellType, currentRowHeight);
                    }
                } else if (isColorScale) {
                    if (!updatedCFCellRef[`${rIdx}_${cIdx}`]) {
                        const value: number = isNumber(cellVal) ? parseFloat(cellVal) : NaN;
                        if (isNaN(value)) {
                            if (td.style.backgroundColor && !td.classList.contains('e-yellowft') && !td.classList.contains('e-greenft') && !td.classList.value.includes('e-redf')) {
                                td.style.backgroundColor = '';
                                const style: CellStyleModel = extend({}, this.parent.commonCellStyle, cell && cell.style);
                                if (style.backgroundColor) {
                                    this.parent.notify(
                                        applyCellFormat, <CellFormatArgs>{
                                            style: { backgroundColor: style.backgroundColor }, td: td, rowIdx: rIdx,
                                            colIdx: cIdx
                                        });
                                }
                            }
                        } else {
                            const valArr: number[] = <number[]>cf.result;
                            const idx: number = valArr.indexOf(value);
                            if (idx === -1) {
                                if (td.style.backgroundColor) {
                                    td.style.backgroundColor = '';
                                    const style: CellStyleModel = extend({}, this.parent.commonCellStyle, cell && cell.style);
                                    if (style.backgroundColor) {
                                        this.parent.notify(
                                            applyCellFormat, <CellFormatArgs>{
                                                style: { backgroundColor: style.backgroundColor }, td: td, rowIdx: rIdx,
                                                colIdx: cIdx
                                            });
                                    }
                                }
                            } else {
                                const colors: string[] = this.getColor(cf.type);
                                td.style.backgroundColor = idx === 0 ? colors[0] :
                                    (idx === valArr.length - 1 ? colors[colors.length - 1] : (valArr.length === 3 && idx === 1 ? colors[1] :
                                        this.getGradient(idx, colors[0], colors[1], colors[2], valArr.length)));
                                updatedCFCellRef[`${rIdx}_${cIdx}`] = true;
                            }
                        }
                    }
                } else {
                    if (!updatedCFCellRef[`${rIdx}_${cIdx}_icons`]) {
                        updatedCFCellRef[`${rIdx}_${cIdx}_icons`] = true;
                        const cfIcon: HTMLElement = this.parent.createElement('span', { className: 'e-icon e-iconsetspan' });
                        const iconSetUpdated: boolean = this.applyIconSet(cellVal, cf, td, cfIcon, cellType);
                        if (iconSetUpdated && cell && cell.format && cell.format.includes('*') &&
                            getTypeFromFormat(cell.format) !== 'Accounting') {
                            this.parent.notify(
                                rowFillHandler, { cell: cell, cellEle: td, rowIdx: rIdx, colIdx: cIdx, updateFillSize: true,
                                    iconSetSpan: cfIcon });
                        }
                    }
                }
                break;
            }
            if (args.isAction && isValueCFRule) {
                this.parent.trigger(
                    'beforeConditionalFormat', <ConditionalFormatEventArgs>{ conditionalFormat: cf, cell: cell, element: td, apply: isApply,
                        address: getCellAddress(rIdx, cIdx) });
                if (!isApply && args.isEdit && !updatedCFCellRef[`${rIdx}_${cIdx}`]) {
                    let style: CellStyleModel;
                    if (cfColor) {
                        if (td.className.includes('e-' + cfColor.toLowerCase())) {
                            td.classList.remove('e-' + cfColor.toLowerCase());
                            td.style.backgroundColor = '';
                            td.style.color = '';
                            style = extend({}, this.parent.commonCellStyle, cell && cell.style);
                            if (style.backgroundColor || style.color) {
                                this.parent.notify(
                                    applyCellFormat, <CellFormatArgs>{ rowIdx: rIdx, colIdx: cIdx, td: td,
                                        style: { backgroundColor: style.backgroundColor, color: style.color } });
                            }
                        }
                    } else {
                        td.removeAttribute('style');
                        style = extend({}, this.parent.commonCellStyle, cell && cell.style);
                        if (Object.keys(style).length) {
                            this.parent.notify(applyCellFormat, <CellFormatArgs>{ style: style, rowIdx: rIdx, colIdx: cIdx, td: td });
                        }
                    }
                }
            }
            if (isApply && !updatedCFCellRef[`${rIdx}_${cIdx}`]) {
                updatedCFCellRef[`${rIdx}_${cIdx}`] = true;
                removeClass([td], ['e-redft', 'e-yellowft', 'e-greenft', 'e-redf', 'e-redt']);
                if (cfColor) {
                    td.classList.add('e-' + cfColor.toLowerCase());
                    this.setCFStyle(style, cf);
                }
                Object.assign(td.style, style);
            }
        };
        if (args.ele) {
            updateCF(args.indexes[0], args.indexes[1], args.cell, args.ele, args.resizedRowHeight, isLongDate);
        } else {
            const rangeArr: string[] = cf.range.split(',');
            const frozenRow: number = this.parent.frozenRowCount(sheet); const frozenCol: number = this.parent.frozenColCount(sheet);
            const topLeftIdx: number[] = getCellIndexes(sheet.topLeftCell);
            for (let i: number = 0; i < rangeArr.length; i++) {
                this.updateRange(sheet, getRangeIndexes(rangeArr[i as number]), frozenRow, frozenCol, topLeftIdx, updateCF, isLongDate);
            }
        }
    }

    private updateRange(
        sheet: SheetModel, rangeIdx: number[], frozenRow: number, frozenCol: number, topLeftIdx: number[], invokeFn: Function,
        isLongDate?: boolean): void {
        rangeIdx[0] = rangeIdx[0] < frozenRow ? (rangeIdx[0] < topLeftIdx[0] ? topLeftIdx[0] : rangeIdx[0]) :
            (rangeIdx[0] < this.parent.viewport.topIndex + frozenRow ? this.parent.viewport.topIndex + frozenRow : rangeIdx[0]);
        rangeIdx[1] = rangeIdx[1] < frozenCol ? (rangeIdx[1] < topLeftIdx[1] ? topLeftIdx[1] : rangeIdx[1]) :
            (rangeIdx[1] < this.parent.viewport.leftIndex + frozenCol ? this.parent.viewport.leftIndex + frozenCol : rangeIdx[1]);
        rangeIdx[2] = rangeIdx[2] < frozenRow ? (rangeIdx[2] < topLeftIdx[0] ? topLeftIdx[0] - 1 :
            rangeIdx[2]) : (rangeIdx[2] > this.parent.viewport.bottomIndex ? this.parent.viewport.bottomIndex : rangeIdx[2]);
        rangeIdx[3] = rangeIdx[3] < frozenCol ? (rangeIdx[3] < topLeftIdx[1] ? topLeftIdx[1] - 1 : rangeIdx[3]) :
            (rangeIdx[3] > this.parent.viewport.rightIndex ? this.parent.viewport.rightIndex : rangeIdx[3]);
        let td: HTMLElement;
        for (let rowIdx: number = rangeIdx[0]; rowIdx <= rangeIdx[2]; rowIdx++) {
            if (frozenRow && rowIdx === frozenRow) {
                rowIdx = this.parent.viewport.topIndex + frozenRow;
            }
            if (isHiddenRow(sheet, rowIdx)) {
                continue;
            }
            for (let colIdx: number = rangeIdx[1]; colIdx <= rangeIdx[3]; colIdx++) {
                if (frozenCol && colIdx === frozenCol) {
                    colIdx = this.parent.viewport.leftIndex + frozenCol;
                }
                if (isHiddenCol(sheet, colIdx)) {
                    continue;
                }
                td = this.parent.getCell(rowIdx, colIdx);
                if (td) {
                    invokeFn(rowIdx, colIdx, getCell(rowIdx, colIdx, sheet), td, undefined, isLongDate);
                }
            }
        }
    }

    private applyIconSet(val: string, cf: ConditionalFormat, cellEle: HTMLElement, cfIcon: HTMLElement, cellType: string): boolean {
        const iconSetExist: boolean = cellEle.classList.contains('e-iconset');
        const wrapText: HTMLElement = cellEle.querySelector('.e-wrap-content');
        if (iconSetExist) {
            cellEle.classList.remove('e-iconset');
            const iconSpan: Element = cellEle.querySelector('.e-iconsetspan');
            if (iconSpan) {
                if (wrapText) {
                    wrapText.removeChild(iconSpan);
                } else {
                    cellEle.removeChild(iconSpan);
                }
            }
        }
        const value: number = isNumber(val) ? parseFloat(val) : NaN;
        const result: number[] = <number[]>cf.result;
        if (isNaN(value) || (result[0] === undefined && result[1] === undefined) || (isNumber(val) && cellType === 'Text')) {
            return iconSetExist;
        }
        const min: number = result[0];
        const max: number = result[1];
        const iconList: string[] = this.getIconList(cf.type).split(',');
        let currentSymbol: string;
        if (iconList.length === 3) {
            const maxPercent: number = min + (0.67 * ((max) - (min)));
            const minPercent: number = min + (0.33 * ((max) - (min)));
            currentSymbol =
                'e-' + (value >= maxPercent ? iconList[0].trim() : value >= minPercent ? iconList[1].trim() : iconList[2].trim());
        } else if (iconList.length === 4) {
            const percent1: number = min + (0.25 * ((max) - (min)));
            const percent2: number = min + (0.50 * ((max) - (min)));
            const percent3: number = min + (0.75 * ((max) - (min)));
            currentSymbol =
                'e-' + (value >= percent3 ? iconList[0].trim() : value >= percent2 ? iconList[1].trim() : value >= percent1 ?
                    iconList[2].trim() : iconList[3].trim());
        } else if (iconList.length === 5) {
            const percent1: number = min + (0.20 * ((max) - (min)));
            const percent2: number = min + (0.40 * ((max) - (min)));
            const percent3: number = min + (0.60 * ((max) - (min)));
            const percent4: number = min + (0.80 * ((max) - (min)));
            currentSymbol =
                'e-' + (value >= percent4 ? iconList[0].trim() : value >= percent3 ? iconList[1].trim() : value >= percent2 ?
                    iconList[2].trim() : value >= percent1 ? iconList[3].trim() : iconList[4].trim());
        }
        cfIcon.classList.add(currentSymbol);
        const dataBar: HTMLElement = cellEle.querySelector('.e-cf-databar');
        if (dataBar) {
            cfIcon.style.height = dataBar.style.height;
            cfIcon.classList.add(cellEle.style.verticalAlign === 'top' ? 'e-cf-icon-top' : cellEle.style.verticalAlign === 'middle' ?
                'e-cf-icon-middle' : 'e-cf-icon-end');
        }
        if (wrapText) {
            wrapText.insertBefore(cfIcon, wrapText.firstChild);
        } else {
            cellEle.insertBefore(cfIcon, cellEle.childNodes[0]);
        }
        cellEle.classList.add('e-iconset');
        return true;
    }

    private getIconList(iconName: string): string {
        const result: string = '3arrows-1,3arrows-2,3arrows-3';
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
            return '4rating-4,4rating-3,4rating-2,4rating-1';
        case 'FiveQuarters':
            return '5quarters-1,5quarters-2,5quarters-3,5quarters-4,5quarters-5';
        case 'FiveRating':
            return '5rating-5,5rating-4,5rating-3,5rating-2,5rating-1';
        case 'ThreeTriangles':
            return '3triangles-1,3triangles-2,3triangles-3';
        case 'ThreeStars':
            return '3stars-1,3stars-2,3stars-3';
        case 'FiveBoxes':
            return '5boxes-1,5boxes-2,5boxes-3,5boxes-4,5boxes-5';
        }
        return result;
    }

    private applyDataBars(
        val: string, cf: ConditionalFormat, td: HTMLElement, rIdx: number, cellType: string, currentRowHeight: number): void {
        const sheet: SheetModel = this.parent.getActiveSheet();
        const result: number[] = cf.result as number[]; let leftStandardWidth: number = 0;
        let topVal: number;
        let value: number;
        if (isNumber(val)) {
            value = parseFloat(val);
        }
        if ((result[0] === undefined && result[1] === undefined) || isNaN(value) || (isNumber(val) && cellType === 'Text')) {
            const dataBar: Element = td.getElementsByClassName('e-cf-databar')[0];
            if (dataBar) {
                const textContent: string = dataBar.getElementsByClassName('e-databar-value')[0].textContent;
                const hyperlink: Element = td.querySelector('.e-hyperlink');
                const noteIndicator: HTMLElement = td.querySelector('.e-addNoteIndicator');
                const wrapText: HTMLElement = td.querySelector('.e-wrap-content');
                if (wrapText) {
                    wrapText.textContent = '';
                    if (hyperlink) {
                        wrapText.appendChild(hyperlink);
                    } else {
                        wrapText.innerText = textContent;
                    }
                } else {
                    td.removeChild(dataBar);
                    if (hyperlink) {
                        td.appendChild(hyperlink);
                    } else {
                        td.innerText = textContent;
                    }
                }
                if (noteIndicator) {
                    td.appendChild(noteIndicator);
                }
            }
            return;
        }
        if (result[0] !== undefined && result[1] !== undefined) {
            topVal = result[0] + Math.abs(result[1]);
            leftStandardWidth = Math.abs((result[1] / topVal) * 100);
        } else if (result[0] !== undefined) {
            topVal = result[0];
        } else {
            topVal = result[1];
        }
        const databar: HTMLElement = this.parent.createElement('div', { id: 'spreadsheet-databar', className: 'e-cf-databar' });
        const leftSpan: HTMLElement = this.parent.createElement('span', { id: 'spreadsheet-leftspan', className: 'e-databar' });
        const rightSpan: HTMLElement = this.parent.createElement('span', { id: 'spreadsheet-rightspan', className: 'e-databar' });
        const dataSpan: HTMLElement = this.parent.createElement('span', { id: 'spreadsheet-dataspan', className: 'e-databar-value' });
        const iconSetSpan: HTMLElement = td.querySelector('.e-iconsetspan');
        const noteIndicator: HTMLElement = td.querySelector('.e-addNoteIndicator');
        const wrapText: HTMLElement = td.querySelector('.e-wrap-content');
        const rowHeight: number = currentRowHeight ? currentRowHeight : getRowHeight(sheet, rIdx, true);
        const currencySpan: HTMLElement = td.querySelector('#' + this.parent.element.id + '_currency');
        databar.style.height = rowHeight - 1 + 'px';
        if (iconSetSpan) {
            iconSetSpan.style.height = rowHeight - 1 + 'px';
            iconSetSpan.classList.add(td.style.verticalAlign === 'top' ? 'e-cf-icon-top' : td.style.verticalAlign === 'middle' ?
                'e-cf-icon-middle' : 'e-cf-icon-end');
        }
        if (currencySpan) {
            currencySpan.style.alignItems = td.style.verticalAlign === 'top' ? 'start' : td.style.verticalAlign === 'middle' ?
                'center' : 'end';
            currencySpan.classList.add('e-cf-currency');
        }
        let cfColor: string = cf.type[0];
        if (cfColor === 'L') {
            cfColor += 'B';
        }
        if (result[1] === undefined) {
            rightSpan.style.width = '' + Math.ceil(Math.abs((value / topVal) * 100)) + '%';
            rightSpan.style.height = rowHeight - 3 + 'px';
            rightSpan.style.backgroundColor = this.getColor(cfColor)[0];
            rightSpan.style.left = '0px';
        } else if (result[0] === undefined) {
            rightSpan.style.width = '' + Math.ceil(Math.abs((value / topVal) * 100)) + '%';
            rightSpan.style.height = rowHeight - 3 + 'px';
            rightSpan.style.backgroundColor = this.getColor('R')[0];
            rightSpan.style.left = '0px';
        } else  if (value >= 0) {
            leftSpan.style.width = leftStandardWidth + '%';
            leftSpan.style.height = rowHeight - 3 + 'px'; // -3 buffer of data bar.
            leftSpan.style.backgroundColor = 'transparent';
            leftSpan.style.left = '0px';
            rightSpan.style.width = '' + Math.ceil(Math.abs((value / topVal) * 100)) + '%';
            rightSpan.style.height = rowHeight - 3 + 'px';
            rightSpan.style.backgroundColor = this.getColor(cfColor)[0];
            rightSpan.style.left = leftStandardWidth + '%';
        } else {
            leftSpan.style.width = '' + Math.ceil(Math.abs((value / topVal) * 100)) + '%';
            leftSpan.style.height = rowHeight - 3 + 'px';
            leftSpan.style.backgroundColor = this.getColor('R')[0];
            if (leftSpan.style.width === leftStandardWidth + '%') {
                leftSpan.style.left = '0px';
            } else {
                leftSpan.style.right = (100 - leftStandardWidth) + '%';
            }
        }
        dataSpan.style.fontSize = td.style.fontSize || '11pt';
        dataSpan.style.alignItems = td.style.verticalAlign === 'top' ? 'start' : td.style.verticalAlign === 'middle' ?
            'center' : 'end';
        dataSpan.style.textDecoration = td.style.textDecoration;
        const curEle: HTMLElement = td.querySelector(`#${this.parent.element.id}_currency`);
        if (curEle) {
            databar.appendChild(curEle);
        }
        const hyperlink: Element = td.querySelector('.e-hyperlink');
        if (hyperlink) {
            dataSpan.appendChild(hyperlink);
        } else {
            const dataContent: string = td.querySelector('.e-validation-list') ? td.innerText : td.textContent;
            dataSpan.innerText = dataContent;
            if (dataContent === '') {
                dataSpan.appendChild(document.createTextNode(dataContent));
            }
        }
        databar.appendChild(leftSpan);
        databar.appendChild(rightSpan);
        databar.appendChild(dataSpan);
        td.textContent = '';
        if (wrapText) {
            wrapText.textContent = '';
            if (iconSetSpan) {
                wrapText.appendChild(iconSetSpan);
            }
            wrapText.appendChild(databar);
            td.appendChild(wrapText);
        } else {
            if (iconSetSpan) {
                td.insertBefore(iconSetSpan, td.firstElementChild);
            }
            td.appendChild(databar);
        }
        if (noteIndicator) {
            td.appendChild(noteIndicator);
        }
    }

    private getColor(cfColor: string): string[] {
        if (cfColor === 'LB') {
            return ['#008aef'];
        }
        const colorCodeArr: string[] = cfColor.split('');
        const colorArr: string[] = [];
        for (let i: number = 0; i < colorCodeArr.length; i++) {
            switch (colorCodeArr[i as number]) {
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
            const center: number = large / 2;
            return t >= center ? this.getLinear(middle, end, Math.abs((t - center) / center)) : this.getLinear(start, middle, t / center);
        }
    }

    private getLinear(s: string, e: string, x: number): string {
        const r: string = this.byteLinear(s[1] + s[2], e[1] + e[2], x);
        const g: string = this.byteLinear(s[3] + s[4], e[3] + e[4], x);
        const b: string = this.byteLinear(s[5] + s[6], e[5] + e[6], x);
        return '#' + r + g + b;
    }

    private byteLinear(a: string, b: string, x: number): string {
        const y: number = (parseInt(a, 16) * (1 - x) + parseInt(b, 16) * x) | 0;
        return Math.abs(y).toString(16);
    }

    private isGreaterThanLessThan(cf: ConditionalFormatModel, value: string, input: string, cellType: string): boolean {
        if (isNumber(value) && cellType !== 'Text') {
            if (isNumber(input)) {
                const txtRegx: RegExp = new RegExp(/[^.-a-zA-Z 0-9]+/g);
                return cf.type === 'GreaterThan' ? parseFloat(value) > parseFloat(input.replace(txtRegx, '')) : parseFloat(value) <
                    parseFloat(input.replace(txtRegx, ''));
            } else {
                const dateEventArgs: { [key: string]: string | number | boolean } = {
                    value: input, rowIndex: 0, colIndex: 0, sheetIndex: 0,
                    isDate: false, updatedVal: '', isTime: false
                };
                this.parent.notify(checkDateFormat, dateEventArgs);
                if (dateEventArgs.isDate || dateEventArgs.isTime) {
                    cf.value = dateEventArgs.updatedVal.toString();
                    return cf.type === 'GreaterThan' ? Number(value) > Number(dateEventArgs.updatedVal) :
                        Number(value) < Number(dateEventArgs.updatedVal);
                } else if (input) {
                    return cf.type === 'GreaterThan' ? value.toLowerCase() > input.toLowerCase() : value.toLowerCase() < input.toLowerCase();
                }
            }
        } else if (value === '' && Number(input) > 0 && cf.type === 'LessThan') {
            return true;
        }
        return false;
    }

    private isBetWeen(cf: ConditionalFormatModel, value: string, input1: string, input2: string, isLongDate?: boolean): boolean {
        if (!isLongDate) {
            const txtRegx: RegExp = new RegExp(/[^.-a-zA-Z 0-9]+/g);
            input1 = input1.replace(txtRegx, ''); input2 = input2.replace(txtRegx, '');
        }
        if (isNumber(input1)) {
            let firstVal: number = parseFloat(input1); let secondVal: number = parseFloat(input2);
            if (firstVal > secondVal) {
                [firstVal, secondVal] = [secondVal, firstVal];
            }
            return parseFloat(value) >= firstVal && parseFloat(value) <= secondVal;
        } else if (input1 && input2) {
            const dateEventArgs1: DateFormatCheckArgs = { value: input1, cell: {}, updatedVal: '' };
            const dateEventArgs2: DateFormatCheckArgs = { value: input2, cell: {}, updatedVal: '' };
            this.parent.notify(checkDateFormat, dateEventArgs1);
            this.parent.notify(checkDateFormat, dateEventArgs2);
            if ((dateEventArgs1.isDate || dateEventArgs1.isTime) && (dateEventArgs2.isDate || dateEventArgs2.isTime)) {
                cf.value = dateEventArgs1.updatedVal + ',' + dateEventArgs2.updatedVal;
                if (dateEventArgs1.updatedVal > dateEventArgs2.updatedVal) {
                    [dateEventArgs1.updatedVal, dateEventArgs2.updatedVal] = [dateEventArgs2.updatedVal, dateEventArgs1.updatedVal];
                }
                return value >= dateEventArgs1.updatedVal && value <= dateEventArgs2.updatedVal;
            } else {
                return value.toLowerCase() >= input1.toLowerCase() && value.toLowerCase() <= input2.toLowerCase();
            }
        }
        return false;
    }

    private isEqualTo(cf: ConditionalFormatModel, value: string, input: string): boolean {
        if (isNumber(input)) {
            if (value === '') {
                return parseFloat(input) === 0;
            }
            const txtRegx: RegExp = new RegExp(/[^.-a-zA-Z 0-9]+/g);
            return parseFloat(value) === parseFloat(input.replace(txtRegx, ''));
        } else if (!value || !input) {
            return false;
        } else {
            const dateTimeArgs: DateFormatCheckArgs = { value: input, cell: {}, updatedVal: '' };
            this.parent.notify(checkDateFormat, dateTimeArgs);
            if (dateTimeArgs.isTime || dateTimeArgs.isDate) {
                cf.value = dateTimeArgs.updatedVal;
                return value === dateTimeArgs.updatedVal;
            } else {
                return value.toLowerCase() === input.toLowerCase();
            }
        }
    }

    private isContainsText(value: string, input: string): boolean {
        const txtRegx: RegExp = new RegExp(/[^.-a-zA-Z 0-9]+/g);
        if (isNumber(input.replace(txtRegx, ''))) {
            input = input.replace(txtRegx, '');
            if (isDateTime(value)) {
                value = dateToInt(value).toString();
            }
            return value.indexOf(input) > -1;
        } else if (isDateTime(input)) {
            if (isDateTime(value)) {
                value = dateToInt(value).toString();
            }
            return value.indexOf(dateToInt(input).toString()) > -1;
        } else {
            return value.toLowerCase().indexOf(input.toLowerCase()) > -1;
        }
    }

    private setCFStyle(style: CellStyleModel, cf: ConditionalFormatModel): CellStyleModel {
        switch (cf.cFColor) {
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
     *
     * @returns {string} - Gets the module name.
     */
    protected getModuleName(): string {
        return 'conditionalFormatting';
    }
}
