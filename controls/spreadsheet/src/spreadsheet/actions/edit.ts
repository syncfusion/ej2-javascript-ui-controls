import { Spreadsheet } from '../index';
import { EventHandler, KeyboardEventArgs, Browser, closest, isUndefined, isNullOrUndefined } from '@syncfusion/ej2-base';
import { getRangeIndexes, getRangeFromAddress, getIndexesFromAddress, getRangeAddress, isSingleCell } from '../../workbook/common/address';
import { keyDown, editOperation, clearCopy, mouseDown, selectionComplete, enableToolbarItems, completeAction } from '../common/event';
import { formulaBarOperation, formulaOperation, setActionData, keyUp, getCellPosition, deleteImage } from '../common/index';
import { workbookEditOperation, getFormattedBarText, getFormattedCellObject, wrapEvent, isValidation } from '../../workbook/common/event';
import { CellModel, SheetModel, getSheetName, getSheetIndex, getCell } from '../../workbook/base/index';
import { getSheetNameFromAddress, getSheet } from '../../workbook/base/index';
import { RefreshValueArgs } from '../integrations/index';
import { CellEditEventArgs, CellSaveEventArgs, ICellRenderer, hasTemplate, editAlert, FormulaBarEdit } from '../common/index';
import { getSwapRange, getCellIndexes, wrap as wrapText, checkIsFormula, isNumber } from '../../workbook/index';
import { checkConditionalFormat, initiateFormulaReference, initiateCur, clearCellRef, addressHandle } from '../common/event';
import { editValue, initiateEdit, forRefSelRender, isFormulaBarEdit } from '../common/event';

/**
 * The `Protect-Sheet` module is used to handle the Protecting functionalities in Spreadsheet.
 */
export class Edit {
    private parent: Spreadsheet;
    private editorElem: HTMLElement = null;
    private editCellData: IEditCellData = {};
    private isEdit: boolean = false;
    private isCellEdit: boolean = true;
    private isNewValueEdit: boolean = true;
    private isAltEnter: boolean = false;
    private validCharacters: string[] = ['+', '-', '*', '/', ',', '(', '=', '&'];

    private keyCodes: { [key: string]: number } = {
        BACKSPACE: 8,
        SPACE: 32,
        TAB: 9,
        DELETE: 46,
        ESC: 27,
        ENTER: 13,
        FIRSTALPHABET: 65,
        LASTALPHABET: 90,
        FIRSTNUMBER: 48,
        LASTNUMBER: 59,
        FIRSTNUMPAD: 96,
        LASTNUMPAD: 111,
        SYMBOLSETONESTART: 186,
        SYMBOLSETONEEND: 192,
        SYMBOLSETTWOSTART: 219,
        SYMBOLSETTWOEND: 222,
        FIREFOXEQUALPLUS: 61,
        FIREFOXMINUS: 173,
        F2: 113
    };

    /**
     * Constructor for protect-sheet module in Spreadsheet.
     * @private
     */
    constructor(parent: Spreadsheet) {
        this.parent = parent;
        this.init();
        //Spreadsheet.Inject(WorkbookEdit);
    }

    private init(): void {
        this.addEventListener();
    }

    /**
     * To destroy the edit module. 
     * @return {void}
     * @hidden
     */
    public destroy(): void {
        this.removeEventListener();
        this.parent = null;
        this.editorElem = null;
    }

    private addEventListener(): void {
        EventHandler.add(this.parent.element, 'dblclick', this.dblClickHandler, this);
        this.parent.on(mouseDown, this.mouseDownHandler, this);
        this.parent.on(keyUp, this.keyUpHandler, this);
        this.parent.on(keyDown, this.keyDownHandler, this);
        this.parent.on(editOperation, this.performEditOperation, this);
        this.parent.on(initiateCur, this.initiateCurPosition, this);
        this.parent.on(editValue, this.updateFormulaBarValue, this);
        this.parent.on(addressHandle, this.addressHandler, this);
        this.parent.on(initiateEdit, this.initiateRefSelection, this);
        this.parent.on( forRefSelRender, this.refSelectionRender, this);
    }

    private removeEventListener(): void {
        EventHandler.remove(this.parent.element, 'dblclick', this.dblClickHandler);
        if (!this.parent.isDestroyed) {
            this.parent.off(mouseDown, this.mouseDownHandler);
            this.parent.off(keyUp, this.keyUpHandler);
            this.parent.off(keyDown, this.keyDownHandler);
            this.parent.off(editOperation, this.performEditOperation);
            this.parent.off(initiateCur, this.initiateCurPosition);
            this.parent.off(editValue, this.updateFormulaBarValue);
            this.parent.off(addressHandle, this.addressHandler);
            this.parent.off(initiateEdit, this.initiateRefSelection);
            this.parent.off(forRefSelRender, this.refSelectionRender);
        }
    }

    /**
     * Get the module name.
     * @returns string
     * @private
     */
    public getModuleName(): string {
        return 'edit';
    }

    private performEditOperation(args: { [key: string]: Object }): void {
        let action: string = <string>args.action;
        switch (action) {
            case 'renderEditor':
                this.renderEditor();
                break;
            case 'refreshEditor':
                this.refreshEditor(
                    <string>args.value, <boolean>args.refreshFormulaBar, <boolean>args.refreshEditorElem,
                    <boolean>args.isAppend, <boolean>args.trigEvent);
                if (args.refreshCurPos) {
                    this.setCursorPosition();
                }
                break;
            case 'startEdit':
                if (!this.isEdit) {
                    this.isNewValueEdit = <boolean>args.isNewValueEdit;
                    this.startEdit(<string>args.address, <string>args.value, <boolean>args.refreshCurPos);
                } else {
                    let isEdit: boolean = false;
                    let arg: FormulaBarEdit = { isEdit: isEdit };
                    this.parent.notify(isFormulaBarEdit, arg);
                    if (arg.isEdit) {
                        this.isNewValueEdit = <boolean>args.isNewValueEdit;
                        this.startEdit(<string>args.address, <string>args.value, <boolean>args.refreshCurPos);
                    }
                }
                break;
            case 'endEdit':
                if (this.isEdit) {
                    this.endEdit(<boolean>args.refreshFormulaBar);
                }
                break;
            case 'cancelEdit':
                if (this.isEdit) {
                    this.cancelEdit(<boolean>args.refreshFormulaBar);
                }
                break;
            case 'getCurrentEditValue':
                args.editedValue = this.editCellData.value;
                break;
            case 'refreshDependentCellValue':
                this.refreshDependentCellValue(
                    <number>args.rowIdx, <number>args.colIdx, <number>args.sheetIdx);
                break;
            case 'getPosition':
                args.position = this.editorElem.getBoundingClientRect();
                break;
            case 'focusEditorElem':
                this.editorElem.focus();
                break;
            case 'getCurrentEditSheetIdx':
                args.sheetIndex = this.editCellData.sheetIndex;
                break;
        }
    }

    private keyUpHandler(e: KeyboardEventArgs): void {
        if (this.isEdit) {
            if (e.altKey && e.keyCode === 13) {
                let editElement: HTMLElement = this.parent.element.querySelector('.e-spreadsheet-edit');
                editElement.focus();
                this.altEnter();
                this.isAltEnter = true;
            } else if (this.isCellEdit && this.editCellData.value !== this.editorElem.textContent && e.keyCode !== 16) {
                this.refreshEditor(this.editorElem.textContent, this.isCellEdit);
            }
            let isFormulaEdit: boolean = checkIsFormula(this.editCellData.value) ||
                (this.editCellData.value && this.editCellData.value.toString().indexOf('=') === 0);
            if (isFormulaEdit && e.keyCode !== 16) {
                let formulaRefIndicator: HTMLElement = this.parent.element.querySelector('.e-formularef-indicator');
                if (formulaRefIndicator) {
                    formulaRefIndicator.parentElement.removeChild(formulaRefIndicator);
                }
                if (this.editCellData.value !== this.editorElem.textContent) {
                    this.refreshEditor(this.editorElem.textContent, true);
                }
                let sheetIdx: number = this.editCellData.sheetIndex;
                let editValue: string = this.editCellData.value;
                this.parent.notify(initiateFormulaReference, { range: editValue, formulaSheetIdx: sheetIdx });
            }
        }
    }

    private keyDownHandler(e: KeyboardEventArgs): void {
        let trgtElem: HTMLElement = <HTMLElement>e.target; let keyCode: number = e.keyCode;
        let sheet: SheetModel = this.parent.getActiveSheet(); let actCell: number[] = getCellIndexes(sheet.activeCell);
        let cell: CellModel = getCell(actCell[0], actCell[1], sheet) || {};
        if (!closest(e.target as Element, '.e-findtool-dlg') && !closest(e.target as Element, '.e-validationerror-dlg')) {
            if (!sheet.isProtected || closest(e.target as Element, '.e-sheet-rename') || (cell.isLocked === false)) {
                if (this.isEdit) {
                    let isFormulaEdit: boolean = checkIsFormula(this.editCellData.value) ||
                        (this.editCellData.value && this.editCellData.value.toString().indexOf('=') === 0);
                    if (this.isCellEdit || (isFormulaEdit && this.editCellData.value !== this.editorElem.textContent && e.keyCode !== 16)) {
                        this.refreshEditor(this.editorElem.textContent, this.isCellEdit);
                    }
                    if (!e.altKey) {
                        switch (keyCode) {
                            case this.keyCodes.ENTER:
                                if (Browser.isWindows) {
                                    e.preventDefault();
                                }
                                if (this.isAltEnter) {
                                    let text: string = this.parent.element.querySelector('.e-spreadsheet-edit').textContent;
                                    if (text && text.indexOf('\n') > -1) {
                                        wrapText(this.parent.getActiveSheet().selectedRange, true, this.parent);
                                        this.refreshEditor(this.editorElem.textContent, this.isCellEdit);
                                        this.isAltEnter = false;
                                    }
                                }
                                if (!isFormulaEdit) {
                                    this.endEdit(false, e);
                                } else {
                                    let formulaRefIndicator: HTMLElement = this.parent.element.querySelector('.e-formularef-indicator');
                                    if (formulaRefIndicator) {
                                        formulaRefIndicator.parentElement.removeChild(formulaRefIndicator);
                                    }
                                    if (this.editCellData.sheetIndex === sheet.id - 1) {
                                        this.endEdit(false, e);
                                    } else {
                                        this.parent.goTo(this.editCellData.fullAddr);
                                        this.endEdit(false, e);
                                    }
                                }
                                break;
                            case this.keyCodes.TAB:
                                if (!this.hasFormulaSuggSelected()) {
                                    this.endEdit(false, e);
                                }
                                break;
                            case this.keyCodes.ESC:
                                this.cancelEdit(true, true, e);
                                break;
                        }
                    }
                } else {
                    if (!this.isEdit && (trgtElem.classList.contains('e-spreadsheet') || closest(trgtElem, '.e-sheet-panel'))) {
                        let isAlphabet: boolean = (keyCode >= this.keyCodes.FIRSTALPHABET && keyCode <= this.keyCodes.LASTALPHABET);
                        let isNumeric: boolean = (keyCode >= this.keyCodes.FIRSTNUMBER && keyCode <= this.keyCodes.LASTNUMBER);
                        let isNumpadKeys: boolean = (keyCode >= this.keyCodes.FIRSTNUMPAD && keyCode <= this.keyCodes.LASTNUMPAD);
                        let isSymbolkeys: boolean = (keyCode >= this.keyCodes.SYMBOLSETONESTART &&
                            keyCode <= this.keyCodes.SYMBOLSETONEEND);
                        if (!isSymbolkeys) {
                            isSymbolkeys = (keyCode >= this.keyCodes.SYMBOLSETTWOSTART && keyCode <= this.keyCodes.SYMBOLSETTWOEND);
                        }
                        let isFirefoxExceptionkeys: boolean = (keyCode === this.keyCodes.FIREFOXEQUALPLUS) ||
                            (keyCode === this.keyCodes.FIREFOXMINUS);
                        let isF2Edit: boolean = (!e.shiftKey && !e.ctrlKey && keyCode === this.keyCodes.F2);
                        let isBackSpace: boolean = keyCode === this.keyCodes.BACKSPACE;
                        if ((!e.ctrlKey && !e.altKey && (
                            (!e.shiftKey && keyCode === this.keyCodes.SPACE) || isAlphabet || isNumeric ||
                            isNumpadKeys || isSymbolkeys || (Browser.info.name === 'mozilla' && isFirefoxExceptionkeys)
                        )) || isF2Edit || isBackSpace) {
                            if (isF2Edit) { this.isNewValueEdit = false; }
                            let pictureElements: HTMLCollection = document.getElementsByClassName('e-ss-overlay-active');
                            let pictureLen: number = pictureElements.length;
                            if (pictureLen > 0) {
                                this.parent.notify(deleteImage, {
                                    id: pictureElements[0].id, sheetIdx: this.parent.activeSheetIndex + 1
                                });
                            } else { this.startEdit(); }
                        }
                        if (keyCode === this.keyCodes.DELETE) {
                            this.editingHandler('delete');
                        }
                    }
                }
            } else {
                if (((keyCode >= this.keyCodes.FIRSTALPHABET && keyCode <= this.keyCodes.LASTALPHABET) ||
                    (keyCode >= this.keyCodes.FIRSTNUMBER && keyCode <= this.keyCodes.LASTNUMBER)
                    || (keyCode === this.keyCodes.DELETE) || (keyCode === this.keyCodes.BACKSPACE) || (keyCode === this.keyCodes.SPACE)
                    || (keyCode >= this.keyCodes.FIRSTNUMPAD && keyCode <= this.keyCodes.LASTNUMPAD) ||
                    (keyCode >= this.keyCodes.SYMBOLSETONESTART && keyCode <= this.keyCodes.SYMBOLSETONEEND)
                    || (keyCode >= 219 && keyCode <= 222) || (!e.shiftKey && !e.ctrlKey && keyCode === this.keyCodes.F2))
                    && (keyCode !== 67) && (keyCode !== 89) && (keyCode !== 90)) {
                    if (sheet.protectSettings.insertLink && keyCode === 75) {
                        return;
                    }
                    if (!this.parent.element.querySelector('.e-editAlert-dlg')) {
                        this.parent.notify(editAlert, null);
                    }
                }
            }
        }
    }
    private renderEditor(): void {
        if (!this.editorElem || !this.parent.element.querySelector('#' + this.parent.element.id + '_edit')) {
            let editor: HTMLElement;
            editor = this.parent.createElement(
                'div', { id: this.parent.element.id + '_edit', className: 'e-spreadsheet-edit' });
            editor.contentEditable = 'true';
            editor.spellcheck = false;
            this.editorElem = editor;
            if (this.parent.element.getElementsByClassName('e-spreadsheet-edit')[0]) {
                this.parent.element.getElementsByClassName('e-spreadsheet-edit')[0].remove();
            }
            this.parent.element.querySelector('.e-sheet-content').appendChild(this.editorElem);
        }
        this.parent.notify(formulaOperation, { action: 'renderAutoComplete' });
    }

    private refreshEditor(
        value: string, refreshFormulaBar?: boolean, refreshEditorElem?: boolean, isAppend?: boolean,
        trigEvent: boolean = true): void {
        if (isAppend) {
            value = this.editCellData.value = this.editCellData.value + value;
        } else {
            this.editCellData.value = value;
        }
        if (refreshEditorElem) {
            this.editorElem.textContent = value;
        }
        if (refreshFormulaBar) {
            this.parent.notify(
                formulaBarOperation, { action: 'refreshFormulabar', value: value });
        }
        if (trigEvent && this.editCellData.value === this.editorElem.textContent) {
            if (this.triggerEvent('cellEditing')) {
                this.cancelEdit();
            }
        }
        // if (this.editorElem.scrollHeight + 2 <= this.editCellData.element.offsetHeight) {
        //     this.editorElem.style.height = (this.editCellData.element.offsetHeight + 1) + 'px';
        // } else {
        //     this.editorElem.style.removeProperty('height');
        // }
    }

    private startEdit(address?: string, value?: string, refreshCurPos: boolean = true): void {
        let sheet: SheetModel = this.parent.getActiveSheet();
        let actCell: number[] = getCellIndexes(sheet.activeCell);
        let cell: CellModel = getCell(actCell[0], actCell[1], sheet) || {};
        let range: number[] = getRangeIndexes(this.parent.getActiveSheet().activeCell);
        if (hasTemplate(this.parent, range[0], range[1], this.parent.activeSheetIndex)) {
            return;
        }
        this.updateEditCellDetail(address, value);
        this.initiateEditor(refreshCurPos);
        this.positionEditor();
        this.parent.isEdit = this.isEdit = true;
        this.parent.notify(clearCopy, null);
        this.parent.notify(enableToolbarItems, [{ enable: false }]);
        if (cell.formula) {
            let sheetIdx: number = this.editCellData.sheetIndex;
            this.parent.notify(initiateFormulaReference, { range: cell.formula, formulaSheetIdx: sheetIdx });
        }
    }

    private setCursorPosition(): void {
        let elem: HTMLElement = this.editorElem;
        let textLen: number = elem.textContent.length;
        if (textLen) {
            let selection: Selection = document.getSelection();
            let range: Range = document.createRange();
            range.setStart(elem.firstChild, textLen);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
        }
        elem.focus();
    }

    private hasFormulaSuggSelected(): boolean {
        let suggDdlElem: HTMLElement = document.getElementById(this.parent.element.id + '_ac_popup');
        return suggDdlElem && suggDdlElem.style.visibility === 'visible' &&
            suggDdlElem.querySelectorAll('.e-item-focus').length > 0;
    }

    private editingHandler(action: string): void {
        let pictureElements: HTMLCollection = document.getElementsByClassName('e-ss-overlay-active');
        let pictureLen: number = pictureElements.length;
        switch (action) {
            case 'delete':
                if (pictureLen > 0) {
                    this.parent.notify(deleteImage, {
                        id: pictureElements[0].id, sheetIdx: this.parent.activeSheetIndex + 1
                    });
                } else {
                    let address: string = this.parent.getActiveSheet().selectedRange;
                    let range: number[] = getIndexesFromAddress(address);
                    range = range[0] > range[2] ? getSwapRange(range) : range;
                    address = getRangeAddress(range);
                    this.parent.clearRange(address, null, true);
                    this.parent.serviceLocator.getService<ICellRenderer>('cell').refreshRange(range);
                    this.parent.notify(selectionComplete, {});
                }
                break;
        }
    }
    private mouseDownHandler(e: MouseEvent & TouchEvent): void {
        if (!closest(e.target as Element, '.e-findtool-dlg')) {
            if (this.isEdit) {
                let trgtElem: HTMLElement = <HTMLElement>e.target;
                let sheet: SheetModel = this.parent.getActiveSheet();
                let formulaRefIndicator : HTMLElement = this.parent.element.querySelector('.e-formularef-indicator');
                this.isCellEdit = trgtElem.classList.contains('e-spreadsheet-edit');
                if (trgtElem.classList.contains('e-cell') || trgtElem.classList.contains('e-header-cell') ||
                    trgtElem.classList.contains('e-selectall') || closest(trgtElem, '.e-toolbar-item.e-active')) {
                    if (this.isAltEnter) {
                        let editText: string = this.parent.element.querySelector('.e-spreadsheet-edit').textContent;
                        if (editText && editText.indexOf('\n') > -1) {
                            this.isAltEnter = false;
                            wrapText(this.parent.getActiveSheet().selectedRange, true, this.parent);
                            this.refreshEditor(this.editorElem.textContent, this.isCellEdit);
                        }
                    }
                    let isFormula: boolean = checkIsFormula(this.editCellData.value) ||
                        (this.editCellData.value && this.editCellData.value.toString().indexOf('=') === 0);
                    if (!isFormula) {
                        this.endEdit(false, e);
                    } else {
                        let curPos: number = window.getSelection().focusOffset;
                        let actCellIdx: number[] = getCellIndexes(sheet.activeCell);
                        let cell: CellModel = getCell(actCellIdx[0], actCellIdx[1], sheet);
                        if (this.editCellData.value === this.editorElem.textContent && (this.editorElem.textContent.indexOf('(') !==
                            this.editorElem.textContent.length - 1 && this.editorElem.textContent.indexOf('(') !== -1)) {
                            if (this.editCellData.sheetIndex !== sheet.id - 1) {
                                let elem: HTMLTextAreaElement =
                                    this.parent.element.querySelector('.e-formula-bar') as HTMLTextAreaElement;
                                if (this.editorElem.textContent.substring(elem.selectionEnd - 1, elem.selectionEnd) !== ',' &&
                                    !e.shiftKey) {
                                    if (formulaRefIndicator) {
                                        formulaRefIndicator.parentElement.removeChild(formulaRefIndicator);
                                    }
                                    this.parent.goTo(this.editCellData.fullAddr);
                                    this.endEdit(false, e);
                                    return;
                                }
                            } else {
                                if (this.validCharacters.indexOf(this.editorElem.textContent.substring(curPos - 1, curPos)) === -1) {
                                    if (formulaRefIndicator) {
                                        formulaRefIndicator.parentElement.removeChild(formulaRefIndicator);
                                    }
                                    this.endEdit(false, e);
                                    return;
                                }
                            }
                        }
                        if (!cell) {
                            return;
                        }
                        isFormula = cell.formula ?
                            checkIsFormula(getCell(actCellIdx[0], actCellIdx[1], sheet).formula) ||
                            (this.editCellData.value && this.editCellData.value.toString().indexOf('=') === 0) : false;
                        if (isFormula) {
                            let curPos: number = window.getSelection().focusOffset;
                            if (this.editCellData.value.length === curPos) {
                                if (this.editCellData.value.substring(this.editCellData.value.length - 1) === ')' ||
                                    isNumber(this.editCellData.value.substring(this.editCellData.value.length - 1))) {
                                    if (formulaRefIndicator) {
                                        formulaRefIndicator.parentElement.removeChild(formulaRefIndicator);
                                    }
                                    this.endEdit(false, e);
                                }
                            } else if (this.editCellData.value === this.editorElem.textContent) {
                                if ((this.editCellData.value + sheet.selectedRange).substring(curPos - 1, curPos) !== ',') {
                                    if (formulaRefIndicator) {
                                        formulaRefIndicator.parentElement.removeChild(formulaRefIndicator);
                                    }
                                    this.endEdit(false, e);
                                } else if (this.editCellData.value.substring(curPos) !== ')') {
                                    if (formulaRefIndicator) {
                                        formulaRefIndicator.parentElement.removeChild(formulaRefIndicator);
                                    }
                                    this.endEdit(false, e);
                                }
                            }
                        }
                    }
                } else {
                    if (this.editCellData.value === this.editorElem.textContent && this.editorElem.textContent.indexOf('(') !==
                        this.editorElem.textContent.length - 1) {
                        if (this.editCellData.sheetIndex === sheet.id - 1) {
                            let curPos: number = window.getSelection().focusOffset;
                            if (this.validCharacters.indexOf(this.editorElem.textContent.substring(curPos - 1, curPos)) === -1) {
                                if (formulaRefIndicator) {
                                    formulaRefIndicator.parentElement.removeChild(formulaRefIndicator);
                                }
                                this.parent.goTo(this.editCellData.fullAddr);
                                this.endEdit(false, e);
                                return;
                            }
                        }
                    }
                }
            }
        }
    }

    private dblClickHandler(e: MouseEvent & TouchEvent): void {
        let trgtElem: HTMLElement = <HTMLElement>e.target;
        let sheet: SheetModel = this.parent.getActiveSheet();
        let actCell: number[] = getCellIndexes(sheet.activeCell);
        let cell: CellModel = getCell(actCell[0], actCell[1], sheet) || {};
        if (!sheet.isProtected || (cell.isLocked === false)) {
            if ((trgtElem.className.indexOf('e-ss-overlay') < 0) &&
                (trgtElem.classList.contains('e-active-cell') || trgtElem.classList.contains('e-cell')
                    || closest(trgtElem, '.e-sheet-content'))) {
                if (this.isEdit) {
                    if (checkIsFormula(this.editCellData.value)) {
                        let sheetName: string = this.editCellData.fullAddr.substring(0, this.editCellData.fullAddr.indexOf('!'));
                        if (this.parent.getActiveSheet().name === sheetName) {
                            this.endEdit();
                        }
                    } else {
                    this.endEdit();
                    }
                } else {
                    this.isNewValueEdit = false;
                    this.startEdit();
                }
            }
        } else {
            if (trgtElem.classList.contains('e-active-cell') || trgtElem.classList.contains('e-cell')) {
                this.parent.notify(editAlert, null);
            }
        }
    }
    private updateEditCellDetail(addr?: string, value?: string): void {
        let sheetIdx: number;
        let sheet: SheetModel;
        if (!this.editCellData.sheetIndex) {
            if (addr && addr.split('!').length > 1) {
                sheetIdx = getSheetIndex(this.parent, getSheetNameFromAddress(addr));
            } else {
                sheetIdx = this.parent.activeSheetIndex;
            }
        }
        if (!this.editCellData.addr) {
            sheet = getSheet(this.parent, sheetIdx);
            if (addr) {
                addr = getRangeFromAddress(addr);
            } else {
                addr = sheet.activeCell;
            }
        } else if (checkIsFormula(this.editCellData.value)) {
            sheet = getSheet(this.parent, sheetIdx);
            this.isNewValueEdit = false;
        }
        if (addr) {
            let range: number[] = getRangeIndexes(addr);
            let rowIdx: number = range[0];
            let colIdx: number = range[1];
            let cellElem: HTMLElement = this.parent.getCell(rowIdx, colIdx);
            let cellPosition: { top: number, left: number } = getCellPosition(sheet, range);

            this.editCellData = {
                addr: addr,
                fullAddr: getSheetName(this.parent, sheetIdx) + '!' + addr,
                rowIndex: rowIdx,
                colIndex: colIdx,
                sheetIndex: sheetIdx,
                element: cellElem,
                value: value || '',
                position: cellPosition
            };
        }
    }

    private initiateEditor(refreshCurPos: boolean): void {
        let data: Promise<Map<string, CellModel>> = this.parent.getData(this.editCellData.fullAddr);
        data.then((values: Map<string, CellModel>): void => {
            (values as Map<string, CellModel>).forEach((cell: CellModel, key: string): void => {
                let args: { [key: string]: CellModel | string } = { cell: cell, value: cell ? cell.value : '' };
                this.parent.notify(getFormattedBarText, args);
                let value: string = cell ? <string>args.value : '';
                if (cell && cell.formula) {
                    value = cell.formula;
                }
                this.editCellData.oldValue = value;
                if (this.editCellData.value) {
                    value = this.editCellData.value;
                } else {
                    this.editCellData.value = value;
                }
                if (this.isNewValueEdit) {
                    value = '';
                } else {
                    this.isNewValueEdit = true;
                }
                if (!isUndefined(value)) { this.refreshEditor(value, false, true, false, false); }
                if (refreshCurPos) { this.setCursorPosition(); }
                if (this.triggerEvent('cellEdit')) {
                    this.cancelEdit(true, false);
                }
            });
        });
    }

    private positionEditor(): void {
        let tdElem: HTMLElement = this.editCellData.element;
        let isEdit: boolean = false; let cellEle: HTMLTableCellElement;
        let arg: FormulaBarEdit = { isEdit: isEdit };
        this.parent.notify(isFormulaBarEdit, arg);
        if (arg.isEdit && isNullOrUndefined(tdElem)) {
            cellEle = this.parent.getCell(this.editCellData.rowIndex, this.editCellData.colIndex) as HTMLTableCellElement;
            tdElem = cellEle;
            this.editCellData.element = cellEle;
        }
        if (tdElem) {
            tdElem.classList.add('e-ss-edited');

            let cell: CellModel = getCell(this.editCellData.rowIndex, this.editCellData.colIndex, this.parent.getActiveSheet());
            let left: number = this.editCellData.position.left + 1;
            let top: number = this.editCellData.position.top + 1;
            let minHeight: number = this.parent.getRow(this.editCellData.rowIndex).offsetHeight - 3;
            let minWidth: number = this.editCellData.element.offsetWidth - 3;
            let mainContElement: HTMLElement = <HTMLElement>this.parent.getMainContent();
            let editWidth: number = mainContElement.offsetWidth - left - 28;
            // let editHeight: number = mainContElement.offsetHeight - top - 28;
            let inlineStyles: string = 'display:block;top:' + top + 'px;' + (this.parent.enableRtl ? 'right:' : 'left:') + left + 'px;' +
                'min-width:' + minWidth + 'px;max-width:' + editWidth + 'px;' + ((cell && cell.wrap) ? 'height:' + 'auto;' : '') +
                ((cell && cell.wrap) ? ('width:' + minWidth + 'px;') : '') + 'min-height:' + minHeight + 'px;';
            inlineStyles += tdElem.style.cssText;
            this.editorElem.setAttribute('style', inlineStyles);
            (this.parent.element.querySelector('.e-active-cell') as HTMLElement).style.height =
                (this.editCellData.element.offsetHeight + 2) + 'px'; // we using edit div height as auto , while editing div enlarges and 
            // hide active cell bottom border for that we increasing 2px height to active cell.
            if (tdElem.classList.contains('e-right-align')) {
                this.editorElem.classList.add('e-right-align');
            } else if (tdElem.classList.contains('e-center-align')) {
                this.editorElem.classList.add('e-center-align');
            }
        }
    }

    private updateEditedValue(tdRefresh: boolean = true): boolean {
        let oldCellValue: string = this.editCellData.oldValue;
        let oldValue: string = oldCellValue ? oldCellValue.toString().toUpperCase() : '';
        let isValidate: boolean = true;
        let address: string | number[] = this.editCellData.addr;
        let cellIndex: number[] = getRangeIndexes(this.parent.getActiveSheet().activeCell);
        let sheet: SheetModel = this.parent.getActiveSheet();
        let cell: CellModel = getCell(cellIndex[0], cellIndex[1], sheet);
        /* To set the before cell details for undo redo. */
        this.parent.notify(setActionData, { args: { action: 'beforeCellSave', eventArgs: { address: this.editCellData.addr } } });
        if (this.parent.allowDataValidation && cell && cell.validation) {
            let value: string =
                (this.parent.element.getElementsByClassName('e-spreadsheet-edit')[0] as HTMLElement).innerText;
            let isCell: boolean = true;
            let sheetIdx: number = this.parent.activeSheetIndex;
            let range: number[];
            if (typeof address === 'string') {
                range = getRangeIndexes(address);
            } else {
                range = address;
            }
            this.parent.notify(isValidation, { value, range, sheetIdx, isCell });
            isValidate = this.parent.allowDataValidation;
            this.editCellData.value = isValidate ? value : this.editCellData.value;
            this.parent.allowDataValidation = true;
        }
        if ((oldCellValue !== this.editCellData.value || oldValue.indexOf('=RAND()') > -1 || oldValue.indexOf('RAND()') > -1 ||
            oldValue.indexOf('=RANDBETWEEN(') > -1 || oldValue.indexOf('RANDBETWEEN(') > -1) && isValidate) {
            let sheet: SheetModel = this.parent.getActiveSheet();
            let cellIndex: number[] = getRangeIndexes(sheet.activeCell);
            this.parent.notify(
                workbookEditOperation,
                { action: 'updateCellValue', address: this.editCellData.addr, value: this.editCellData.value });
            let cell: CellModel = getCell(cellIndex[0], cellIndex[1], sheet, true);
            let eventArgs: RefreshValueArgs = this.getRefreshNodeArgs(cell);
            this.editCellData.value = <string>eventArgs.value;
            if (cell && cell.formula) { this.editCellData.formula = cell.formula; }
            if (cell.wrap) {
                this.parent.notify(wrapEvent, { range: cellIndex, wrap: true, sheet: sheet });
            }
            if (tdRefresh) { this.parent.refreshNode(this.editCellData.element, eventArgs); }
        }
        if (this.parent.allowConditionalFormat) {
            this.parent.notify(checkConditionalFormat, { rowIdx: cellIndex[0], colIdx: cellIndex[1], cell: cell });
        }
        return isValidate;
    }

    private refreshDependentCellValue(rowIdx: number, colIdx: number, sheetIdx: number): void {
        if (rowIdx && colIdx) {
            rowIdx--; colIdx--;
            if ((this.editCellData.rowIndex !== rowIdx || this.editCellData.colIndex !== colIdx)
                && this.parent.activeSheetIndex === sheetIdx) {
                let td: HTMLElement = this.parent.getCell(rowIdx, colIdx);
                if (td) {
                    let sheet: SheetModel = getSheet(this.parent, sheetIdx);
                    let cell: CellModel = getCell(rowIdx, colIdx, sheet);
                    let eventArgs: RefreshValueArgs = this.getRefreshNodeArgs(cell);
                    this.parent.refreshNode(td, eventArgs);
                }
            }
        }
    }

    private getRefreshNodeArgs(cell: CellModel): RefreshValueArgs {
        cell = cell ? cell : {};
        let fCode: string = (cell && cell.format) ? cell.format : '';
        let eventArgs: { [key: string]: string | number | boolean } = {
            value: cell.value, format: fCode, onLoad: true,
            formattedText: '', isRightAlign: false, type: 'General'
        };
        let args: RefreshValueArgs;
        this.parent.notify(getFormattedCellObject, eventArgs);
        eventArgs.formattedText = this.parent.allowNumberFormatting ? eventArgs.formattedText : eventArgs.value;
        args = {
            isRightAlign: <boolean>eventArgs.isRightAlign,
            result: <string>eventArgs.formattedText,
            type: <string>eventArgs.type,
            value: <string>eventArgs.value,
            curSymbol: <string>eventArgs.curSymbol
        };
        return args;
    }

    public endEdit(refreshFormulaBar: boolean = false, event?: MouseEvent & TouchEvent | KeyboardEventArgs): void {
        if (refreshFormulaBar) { this.refreshEditor(this.editCellData.oldValue, false, true, false, false); }
        if (this.triggerEvent('beforeCellSave')) {
            event.preventDefault();
            return;
        }
        let isValidate: boolean = this.updateEditedValue();
        if (isValidate) {
            this.triggerEvent('cellSave', event);
            this.resetEditState();
            this.focusElement();
        } else if (event) {
            event.preventDefault();
        }
    }

    public cancelEdit(refreshFormulaBar: boolean = true, trigEvent: boolean = true, event?: MouseEvent & TouchEvent |
        KeyboardEventArgs): void {
        this.refreshEditor(this.editCellData.oldValue, refreshFormulaBar, false, false, false);
        if (trigEvent) {
            this.triggerEvent('cellSave', event);
        }
        this.resetEditState();
        this.focusElement();
    }

    private focusElement(): void {
        this.parent.element.focus();
        this.parent.notify(enableToolbarItems, [{ enable: true }]);
    }

    private triggerEvent(eventName: string, event?: MouseEvent & TouchEvent | KeyboardEventArgs): boolean {
        let eventArgs: CellEditEventArgs | CellSaveEventArgs = {
            element: this.editCellData.element,
            value: this.editCellData.value,
            oldValue: this.editCellData.oldValue,
            address: this.editCellData.fullAddr
        };
        if (eventName === 'cellSave') {
            if (this.editCellData.formula) {
                eventArgs.formula = this.editCellData.formula;
            }
            eventArgs.originalEvent = event;
            this.parent.notify(completeAction, { eventArgs: eventArgs, action: 'cellSave' });
        }
        if (eventName !== 'cellSave') {
            (<CellEditEventArgs>eventArgs).cancel = false;
        }
        this.parent.trigger(eventName, eventArgs);
        return (<CellEditEventArgs>eventArgs).cancel;
    }

    private altEnter(): void {
        let text: string; let textBefore: string; let textAfter: string;
        let selection: Selection = window.getSelection(); let node: Node = selection.anchorNode;
        let offset: number; let range: Range = document.createRange();
        offset = (node.nodeType === 3) ? selection.anchorOffset : node.textContent.length;
        if (offset === 0 && node.textContent.length > 0) {
            offset = node.textContent.length;
        }
        text = node.textContent;
        textBefore = text.slice(0, offset);
        textAfter = text.slice(offset) || ' ';
        node.textContent = textBefore + '\n' + textAfter;
        range = document.createRange();
        if (node.nodeType === 3) {
            range.setStart(node, offset + 1);
            range.setEnd(node, offset + 1);
        } else if (node.nodeType === 1) {
            range.setStart(node.firstChild, offset + 1);
            range.setEnd(node.firstChild, offset + 1);
        }
        selection.removeAllRanges();
        selection.addRange(range);
    }

    private resetEditState(elemRefresh: boolean = true): void {
        if (elemRefresh) {
            if (checkIsFormula(this.editorElem.textContent)) {
                this.parent.notify(clearCellRef, null);
            }
            if (this.editCellData.element) {
                this.editCellData.element.classList.remove('e-ss-edited');
                this.editorElem.textContent = '';
                this.editorElem.removeAttribute('style');
                this.editorElem.classList.remove('e-right-align');
            }
        }
        this.editCellData = {};
        this.parent.isEdit = this.isEdit = false;
        this.isCellEdit = true;
        this.parent.notify(formulaOperation, { action: 'endEdit' });
    }

    private refSelectionRender(): void {
        if (checkIsFormula(this.editorElem.textContent)) {
            this.parent.notify(initiateFormulaReference, {
                range: this.editorElem.textContent, formulaSheetIdx: this.editCellData.sheetIndex
            });
        }
    }

    // Start edit the formula cell and set cursor position
    private initiateRefSelection(): void {
        let sheetName: string = this.editCellData.fullAddr.substring(0, this.editCellData.fullAddr.indexOf('!'));
        let value: string = (this.parent.element.querySelector('.e-formula-bar') as HTMLTextAreaElement).value;
        if (this.parent.getActiveSheet().name === sheetName && checkIsFormula(this.editCellData.value)) {
            this.startEdit(this.editCellData.addr, value, false);
            this.parent.notify(initiateFormulaReference, {
                range: this.editCellData.value, formulaSheetIdx: this.editCellData.sheetIndex
            });
            this.parent.element.querySelector('.e-spreadsheet-edit').innerHTML = value;
            this.initiateCurPosition();
        } else {
            this.initiateCurPosition();
        }
    }

    private addressHandler(args: { range: string, isSelect: boolean }): void {
        let eventArgs: { action: string, editedValue: string } = { action: 'getCurrentEditValue', editedValue: '' };
        this.parent.notify(editOperation, eventArgs);
        let address: string = args.range;
        let sheetName: string = this.editCellData.fullAddr.substring(0, this.editCellData.fullAddr.indexOf('!'));
        let sheetIdx: number = this.editCellData.sheetIndex;
        let editorEle: HTMLElement = this.parent.element.querySelector('.e-spreadsheet-edit');
        if (this.parent.getActiveSheet().name !== sheetName) {
            address = '\'' + this.parent.getActiveSheet().name + '\'' + '!' + address;
        }
        if (args.isSelect) {
            this.parent.notify(initiateFormulaReference, { range: eventArgs.editedValue + address, formulaSheetIdx: sheetIdx });
        } else {
            let editedValue: string = eventArgs.editedValue;
            if (editedValue.indexOf(')') === editedValue.length - 1) {
                editorEle.textContent = editedValue.substring(0, editedValue.length - 1)
                    + address + editedValue.substring(editedValue.length - 1);
            } else {
                editorEle.textContent = editedValue + address;
            }
        }
    }

    private updateFormulaBarValue(): void {
        let value: string = this.editCellData.value;
        let address: string = this.parent.getActiveSheet().selectedRange;
        address = isSingleCell(getIndexesFromAddress(address)) ? address.split(':')[0] : address;
        let formulaBar: HTMLTextAreaElement = this.parent.element.querySelector('.e-formula-bar') as HTMLTextAreaElement;
        if (value && checkIsFormula(value)) {
            let sheetName: string = this.editCellData.fullAddr.substring(0, this.editCellData.fullAddr.indexOf('!'));
            if (this.parent.getActiveSheet().name !== sheetName) {
                address = '\'' + this.parent.getActiveSheet().name + '\'' + '!' + address;
            }
            if (value.indexOf(')') === value.length - 1) {
                formulaBar.value = value.substring(0, value.length - 1) + address + value.substring(value.length - 1);
            } else {
                formulaBar.value = value + address;
            }
        }
    }

    private setFormulaBarCurPosition(input: HTMLTextAreaElement, selectionStart: number, selectionEnd: number): void {
        if (input.setSelectionRange) {
          input.focus();
          input.selectionStart = selectionStart;
          input.selectionEnd = selectionStart;
          input.setSelectionRange(selectionStart, selectionEnd);
        }
      }

    private initiateCurPosition(): void {
        let el: HTMLElement = this.parent.element.querySelector('.e-spreadsheet-edit') as HTMLElement;
        if (el.innerText) {
            let range: Range = document.createRange();
            if (el.innerText.indexOf(')') === el.innerText.length - 1) {
                range.setStart(el.childNodes[0], el.innerText.length - 1);
                range.setEnd(el.childNodes[0], el.innerText.length - 1);
            } else {
                range.setStart(el.childNodes[0], el.innerText.length);
                range.setEnd(el.childNodes[0], el.innerText.length);
            }
            let selection: Selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
        }
        let sheetIdx: number = this.editCellData.sheetIndex;
        if (sheetIdx !== this.parent.getActiveSheet().id - 1) {
            let elem: HTMLTextAreaElement = this.parent.element.querySelector('.e-formula-bar') as HTMLTextAreaElement;
            if (elem.value) {
                let valueLength: number = elem.value.length;
                if (elem.value.indexOf(')') === valueLength - 1) {
                    this.setFormulaBarCurPosition(elem, valueLength - 1, valueLength - 1);
                } else {
                    this.setFormulaBarCurPosition(elem, valueLength, valueLength);
                }
            }
        }
    }
}

interface IEditCellData {
    value?: string;
    oldValue?: string;
    element?: HTMLElement;
    rowIndex?: number;
    colIndex?: number;
    sheetIndex?: number;
    addr?: string;
    fullAddr?: string;
    position?: { top: number, left: number };
    formula?: string;
}