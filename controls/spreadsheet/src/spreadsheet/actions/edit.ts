import { Spreadsheet } from '../index';
import { EventHandler, KeyboardEventArgs, Browser, closest, isUndefined, isNullOrUndefined, select, detach } from '@syncfusion/ej2-base';
import { getRangeIndexes, getRangeFromAddress, getIndexesFromAddress, getRangeAddress, isSingleCell } from '../../workbook/common/address';
import { keyDown, editOperation, clearCopy, mouseDown, enableToolbarItems, completeAction } from '../common/event';
import { formulaBarOperation, formulaOperation, setActionData, keyUp, getCellPosition, deleteImage, focus, isLockedCells } from '../common/index';
import { workbookEditOperation, getFormattedBarText, getFormattedCellObject, wrapEvent, isValidation, activeCellMergedRange, activeCellChanged, getUniqueRange, removeUniquecol, checkUniqueRange, reApplyFormula, refreshChart } from '../../workbook/common/event';
import { CellModel, SheetModel, getSheetName, getSheetIndex, getCell, getColumn, ColumnModel, getRowsHeight, getColumnsWidth, Workbook, checkColumnValidation, skipDefaultValue } from '../../workbook/base/index';
import { getSheetNameFromAddress, getSheet, selectionComplete, isHiddenRow, isHiddenCol, applyCF, ApplyCFArgs, setVisibleMergeIndex } from '../../workbook/index';
import { beginAction, updateCell, checkCellValid, NumberFormatArgs, parseLocaleNumber, getViewportIndexes } from '../../workbook/index';
import { RefreshValueArgs } from '../integrations/index';
import { CellEditEventArgs, CellSaveEventArgs, ICellRenderer, hasTemplate, editAlert, FormulaBarEdit, getTextWidth } from '../common/index';
import { getSwapRange, getCellIndexes, wrap as wrapText, checkIsFormula, isNumber, isLocked, MergeArgs, isCellReference, workbookFormulaOperation } from '../../workbook/index';
import { initiateFormulaReference, initiateCur, clearCellRef, addressHandle, clearRange, dialog, locale } from '../common/index';
import { editValue, initiateEdit, forRefSelRender, isFormulaBarEdit, deleteChart, activeSheetChanged } from '../common/event';
import { checkFormulaRef, getData, VisibleMergeIndexArgs } from '../../workbook/index';
import { L10n } from '@syncfusion/ej2-base';
import { Dialog } from '../services/dialog';

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
    private validCharacters: string[] = ['+', '-', '*', '/', ',', '(', '=', '&', ':'];
    private formulaBarCurStartPos: number = null;
    private curEndPos: number = null;
    private curStartPos: number = null;
    private selectionStart: number = null;
    private selectionEnd: number = null;
    private endFormulaRef: boolean;
    private uniqueColl: string = '';
    private uniqueCell: boolean;
    private uniqueActCell: string = '';
    private isSpill: boolean = false;
    private tapedTwice: boolean;
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
     * Constructor for edit module in Spreadsheet.
     *
     * @param {Spreadsheet} parent - Constructor for edit module in Spreadsheet.
     * @private
     */
    constructor(parent: Spreadsheet) {
        this.parent = parent;
        this.addEventListener();
        //Spreadsheet.Inject(WorkbookEdit);
    }

    /**
     * To destroy the edit module.
     *
     * @returns {void} - To destroy the edit module.
     * @hidden
     */
    public destroy(): void {
        if (this.isEdit) {
            this.cancelEdit(true, false);
        }
        this.removeEventListener();
        this.parent = null;
        this.editorElem = null;
    }

    private addEventListener(): void {
        if (Browser.isDevice && Browser.info.name === 'safari' && (Browser.isIos || Browser.isIos7)) {
            EventHandler.add(this.parent.element, 'touchend', this.tapHandler, this);
        } else {
            EventHandler.add(this.parent.element, 'dblclick', this.dblClickHandler, this);
        }
        this.parent.on(mouseDown, this.mouseDownHandler, this);
        this.parent.on(keyUp, this.keyUpHandler, this);
        this.parent.on(keyDown, this.keyDownHandler, this);
        this.parent.on(editOperation, this.performEditOperation, this);
        this.parent.on(initiateCur, this.initiateCurPosition, this);
        this.parent.on(editValue, this.updateFormulaBarValue, this);
        this.parent.on(addressHandle, this.addressHandler, this);
        this.parent.on(initiateEdit, this.initiateRefSelection, this);
        this.parent.on(forRefSelRender, this.refSelectionRender, this);
        this.parent.on(checkUniqueRange, this.checkUniqueRange, this);
        this.parent.on(reApplyFormula, this.reApplyFormula, this);
        this.parent.on(activeSheetChanged, this.sheetChangeHandler, this);
    }

    private removeEventListener(): void {
        if (Browser.isDevice && Browser.info.name === 'safari' && (Browser.isIos || Browser.isIos7)) {
            EventHandler.remove(this.parent.element, 'touchend', this.tapHandler);
        } else {
            EventHandler.remove(this.parent.element, 'dblclick', this.dblClickHandler);
        }
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
            this.parent.off(checkUniqueRange, this.checkUniqueRange);
            this.parent.off(reApplyFormula, this.reApplyFormula);
            this.parent.off(activeSheetChanged, this.sheetChangeHandler);
        }
    }

    /**
     * Get the module name.
     *
     * @returns {string} - Get the module name.
     * @private
     */
    public getModuleName(): string {
        return 'edit';
    }

    private performEditOperation(args: { [key: string]: Object }): void {
        const action: string = <string>args.action;
        switch (action) {
        case 'renderEditor':
            this.renderEditor();
            if (args.initLoad && Browser.isDevice && Browser.info.name === 'safari' && (Browser.isIos || Browser.isIos7)) {
                const focusEditEle: HTMLElement = this.parent.createElement(
                    'div', { className: 'e-ss-focus-edit', attrs: { 'contentEditable': 'true', 'inputmode': 'none', 'tabindex': '-1' } });
                const sheetPanel: HTMLElement = this.parent.element.querySelector('.e-sheet-panel');
                if (sheetPanel) {
                    sheetPanel.style.position = 'relative';
                    sheetPanel.appendChild(focusEditEle);
                }
                this.parent.element.onfocus = () => {
                    focus(focusEditEle);
                };
            }
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
                const isEdit: boolean = false;
                const arg: FormulaBarEdit = { isEdit: isEdit };
                this.parent.notify(isFormulaBarEdit, arg);
                if (arg.isEdit) {
                    this.isNewValueEdit = <boolean>args.isNewValueEdit;
                    this.startEdit(<string>args.address, <string>args.value, <boolean>args.refreshCurPos);
                }
            }
            break;
        case 'endEdit':
            if (this.isEdit) {
                this.endEdit(<boolean>args.refreshFormulaBar, null, <boolean>args.isPublic);
            }
            break;
        case 'cancelEdit':
            if (this.isEdit) {
                this.cancelEdit(<boolean>args.refreshFormulaBar);
            }
            break;
        case 'getCurrentEditValue':
            args.editedValue = this.editCellData.value;
            if (args.endFormulaRef !== undefined) { args.endFormulaRef = this.endFormulaRef; }
            break;
        case 'refreshDependentCellValue':
            this.refreshDependentCellValue(
                <number>args.rowIdx, <number>args.colIdx, <number>args.sheetIdx);
            break;
        case 'getElement':
            args.element = this.getEditElement(this.parent.getActiveSheet());
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
            const editElement: HTMLElement = this.getEditElement(this.parent.getActiveSheet());
            if (e.altKey && e.keyCode === 13) {
                editElement.focus();
                this.altEnter();
                this.isAltEnter = true;
            } else if (this.isCellEdit && this.editCellData.value !== editElement.textContent && e.keyCode !== 16) {
                this.refreshEditor(editElement.textContent, this.isCellEdit);
            }
            const isFormulaEdit: boolean = checkIsFormula(this.editCellData.value, true);
            if (isFormulaEdit && (!e || e.keyCode !== 16)) {
                this.updateFormulaReference(editElement);
                if (this.endFormulaRef) {
                    const curOffset: { start?: number, end?: number } = this.getCurPosition();
                    if (curOffset.end && this.validCharacters.indexOf(this.editCellData.value[curOffset.end - 1]) > -1) {
                        this.endFormulaRef = false;
                    }
                }
            }
        }
    }

    private updateFormulaReference(editElement: HTMLElement): void {
        const formulaRefIndicator: HTMLElement = this.parent.element.querySelector('.e-formularef-indicator');
        if (formulaRefIndicator) { formulaRefIndicator.parentElement.removeChild(formulaRefIndicator); }
        if (this.editCellData.value !== editElement.textContent) { this.refreshEditor(editElement.textContent, true); }
        const sheetIdx: number = this.editCellData.sheetIndex;
        const editValue: string = this.editCellData.value;
        this.parent.notify(initiateFormulaReference, { range: editValue, formulaSheetIdx: sheetIdx });
    }

    private keyDownHandler(e: KeyboardEventArgs): void | boolean {
        const trgtElem: HTMLElement = <HTMLElement>e.target;
        const keyCode: number = e.keyCode;
        const sheet: SheetModel = this.parent.getActiveSheet();
        const actCell: number[] = getCellIndexes(sheet.activeCell);
        const cell: CellModel = getCell(actCell[0], actCell[1], sheet, false, true);
        if (!closest(trgtElem, '.e-dialog')) {
            if (!sheet.isProtected || trgtElem.classList.contains('e-sheet-rename') || !isLocked(cell, getColumn(sheet, actCell[1]))) {
                if (this.isEdit) {
                    const editorElem: HTMLElement = this.getEditElement(sheet);
                    const isFormulaEdit: boolean = checkIsFormula(this.editCellData.value, true);
                    if (this.isCellEdit || (isFormulaEdit && this.editCellData.value !== editorElem.textContent && e.keyCode !== 16)) {
                        if (actCell[1] < this.parent.frozenColCount(sheet) && (!sheet.frozenRows || actCell[0] >=
                            this.parent.frozenRowCount(sheet)) && editorElem && editorElem.style.height !== 'auto') {
                            if (getTextWidth(editorElem.textContent, cell.style, this.parent.cellStyle) > parseInt(
                                editorElem.style.maxWidth, 10)) {
                                editorElem.style.height = 'auto';
                            }
                        }
                        if (getTextWidth(editorElem.textContent, cell.style, this.parent.cellStyle) > parseInt(
                            editorElem.style.maxWidth, 10) - 5) { // 5 decreased for padding.
                            editorElem.style.height = 'auto';
                        }
                        if (actCell[0] < this.parent.frozenRowCount(sheet) && editorElem && !editorElem.style.overflow && getTextWidth(
                            editorElem.textContent, cell.style, this.parent.cellStyle) > parseInt(editorElem.style.maxWidth, 10)) {
                            editorElem.style.overflow = 'auto';
                        }
                        this.refreshEditor(editorElem.textContent, this.isCellEdit, false, false, false);
                    }
                    if (!e.altKey) {
                        switch (keyCode) {
                        case this.keyCodes.ENTER:
                            if (Browser.isWindows) {
                                e.preventDefault();
                            }
                            if (this.isAltEnter) {
                                const text: string = editorElem.textContent;
                                if (text && text.indexOf('\n') > -1) {
                                    wrapText(this.parent.getActiveSheet().selectedRange, true, this.parent as Workbook, true);
                                    this.refreshEditor(editorElem.textContent, this.isCellEdit, false, false, false);
                                    this.isAltEnter = false;
                                }
                            }
                            if (!isFormulaEdit) {
                                this.endEdit(false, e);
                            } else {
                                const formulaRefIndicator: HTMLElement = this.parent.element.querySelector('.e-formularef-indicator');
                                if (formulaRefIndicator) {
                                    formulaRefIndicator.parentElement.removeChild(formulaRefIndicator);
                                }
                                if (getSheet(this.parent, this.editCellData.sheetIndex).id === sheet.id) {
                                    this.endEdit(false, e);
                                } else {
                                    this.parent.goTo(this.editCellData.fullAddr);
                                    this.endEdit(false, e);
                                }
                            }
                            break;
                        case this.keyCodes.TAB:
                            if (!this.hasFormulaSuggSelected()) { this.endEdit(false, e); }
                            break;
                        case this.keyCodes.ESC:
                            this.cancelEdit(true, true, e);
                            break;
                        }
                    }
                } else if (trgtElem.classList.contains('e-spreadsheet') || closest(trgtElem, '.e-sheet-panel')) {
                    if (keyCode === 13 && trgtElem.contentEditable === 'true') {
                        e.preventDefault();
                    }
                    const key: string = String.fromCharCode(keyCode);
                    const isAlphabet: boolean = (keyCode >= this.keyCodes.FIRSTALPHABET && keyCode <= this.keyCodes.LASTALPHABET) ||
                        (key.toLowerCase() !== key.toUpperCase() && !(keyCode >= 112 && keyCode <= 123));
                    const isNumeric: boolean = (keyCode >= this.keyCodes.FIRSTNUMBER && keyCode <= this.keyCodes.LASTNUMBER);
                    const isNumpadKeys: boolean = (keyCode >= this.keyCodes.FIRSTNUMPAD && keyCode <= this.keyCodes.LASTNUMPAD);
                    let isSymbolkeys: boolean = (keyCode >= this.keyCodes.SYMBOLSETONESTART &&
                        keyCode <= this.keyCodes.SYMBOLSETONEEND);
                    if (!isSymbolkeys) {
                        isSymbolkeys = (keyCode >= this.keyCodes.SYMBOLSETTWOSTART && keyCode <= this.keyCodes.SYMBOLSETTWOEND);
                    }
                    const isFirefoxExceptionkeys: boolean = (keyCode === this.keyCodes.FIREFOXEQUALPLUS) ||
                        (keyCode === this.keyCodes.FIREFOXMINUS);
                    const isF2Edit: boolean = (!e.shiftKey && !e.ctrlKey && !e.metaKey && keyCode === this.keyCodes.F2);
                    const isBackSpace: boolean = keyCode === this.keyCodes.BACKSPACE;
                    const isMacDelete: boolean = /(Macintosh|MacIntel|MacPPC|Mac68K|Mac|Mac OS|iPod|iPad)/i.test(navigator.userAgent) && isBackSpace;
                    if ((!e.ctrlKey && !e.metaKey && !e.altKey && (
                        (!e.shiftKey && keyCode === this.keyCodes.SPACE) || isAlphabet || isNumeric ||
                        isNumpadKeys || isSymbolkeys || (Browser.info.name === 'mozilla' && isFirefoxExceptionkeys)
                    )) || isF2Edit || isBackSpace) {
                        if (isF2Edit) { this.isNewValueEdit = false; }
                        const overlayElements: HTMLCollection = this.parent.element.getElementsByClassName('e-ss-overlay-active');
                        if (overlayElements.length) {
                            if (isBackSpace && !isMacDelete) {
                                this.editingHandler('delete');
                            }
                        } else {
                            this.startEdit(null, null, true, true);
                            focus(this.getEditElement(sheet));
                        }
                    }
                    if (keyCode === this.keyCodes.DELETE || isMacDelete) {
                        const islockcell: boolean = sheet.isProtected && isLockedCells(this.parent);
                        if (!islockcell) {
                            this.editingHandler('delete');
                            this.parent.notify(activeCellChanged, null);
                        } else {
                            this.parent.notify(editAlert, null);
                        }
                    }
                }
            } else if (((keyCode >= this.keyCodes.FIRSTALPHABET && keyCode <= this.keyCodes.LASTALPHABET) ||
                (keyCode >= this.keyCodes.FIRSTNUMBER && keyCode <= this.keyCodes.LASTNUMBER)
                || (keyCode === this.keyCodes.DELETE) || (keyCode === this.keyCodes.BACKSPACE) || (keyCode === this.keyCodes.SPACE)
                || (keyCode >= this.keyCodes.FIRSTNUMPAD && keyCode <= this.keyCodes.LASTNUMPAD) ||
                (keyCode >= this.keyCodes.SYMBOLSETONESTART && keyCode <= this.keyCodes.SYMBOLSETONEEND)
                || (keyCode >= 219 && keyCode <= 222) || (!e.shiftKey && !e.ctrlKey && !e.metaKey && keyCode === this.keyCodes.F2))
                && (keyCode !== 67) && (keyCode !== 89) && (keyCode !== 90)) {
                if (sheet.protectSettings.insertLink && keyCode === 75) {
                    return;
                }
                if (!e.ctrlKey && e.keyCode !== 70 && !this.parent.element.querySelector('.e-editAlert-dlg') &&
                    !trgtElem.parentElement.classList.contains('e-unprotectpwd-content') &&
                    !trgtElem.parentElement.classList.contains('e-password-content') &&
                    !trgtElem.parentElement.classList.contains('e-sheet-password-content') &&
                    !trgtElem.parentElement.classList.contains('e-unprotectsheetpwd-content') &&
                    !trgtElem.parentElement.classList.contains('e-reenterpwd-content')) {
                    this.parent.notify(editAlert, null);
                }
            }
        }
    }

    private renderEditor(): void {
        if (!this.editorElem || !select('#' + this.parent.element.id + '_edit', this.parent.element)) {
            const editor: HTMLElement = this.parent.createElement(
                'div', { id: this.parent.element.id + '_edit', className: 'e-spreadsheet-edit', attrs: { 'contentEditable': 'true',
                    'role': 'textbox', 'spellcheck': 'false', 'aria-multiline': 'true' } });
            if (this.parent.element.getElementsByClassName('e-spreadsheet-edit')[0]) {
                this.parent.element.getElementsByClassName('e-spreadsheet-edit')[0].remove();
            }
            const sheetContentElem: Element = this.parent.element.querySelector('.e-sheet-content');
            if (!sheetContentElem) {
                return;
            }
            sheetContentElem.appendChild(editor);
            this.editorElem = editor;
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
        const editorElem: HTMLElement = this.getEditElement(this.parent.getActiveSheet());
        if (refreshEditorElem && editorElem) {
            editorElem.textContent = value;
        }
        if (refreshFormulaBar) {
            this.parent.notify(
                formulaBarOperation, { action: 'refreshFormulabar', value: value });
        }
        if (this.parent.isEdit && editorElem && trigEvent && this.editCellData.value === editorElem.textContent) {
            if (this.triggerEvent('cellEditing').cancel) {
                this.cancelEdit();
            }
        }
        // if (this.editorElem.scrollHeight + 2 <= this.editCellData.element.offsetHeight) {
        //     this.editorElem.style.height = (this.editCellData.element.offsetHeight + 1) + 'px';
        // } else {
        //     this.editorElem.style.removeProperty('height');
        // }
    }

    private startEdit(address?: string, value?: string, refreshCurPos: boolean = true, preventFormulaReference?: boolean): void {
        if (this.parent.showSheetTabs) { this.parent.element.querySelector('.e-add-sheet-tab').setAttribute('disabled', 'true'); }
        const sheet: SheetModel = this.parent.getActiveSheet();
        const range: number[] = getCellIndexes(sheet.activeCell);
        const cell: CellModel = getCell(range[0], range[1], sheet, false, true);
        if (hasTemplate(this.parent as Workbook, range[0], range[1], this.parent.activeSheetIndex)) {
            const cellEle: HTMLTableCellElement = this.parent.getCell(range[0], range[1]) as HTMLTableCellElement;
            let isDelTemplate: boolean = false; const value: string = cellEle.innerHTML;
            if (cellEle) {
                if (value.indexOf('<') > -1 && value.indexOf('>') > -1 && value.indexOf('input') > -1) {
                    isDelTemplate = true;
                }
            }
            if (isDelTemplate) {
                return;
            }
        }
        const isMergedHiddenCell: boolean = this.updateEditCellDetail(address, value);
        this.initiateEditor(refreshCurPos, isMergedHiddenCell);
        this.positionEditor();
        this.parent.isEdit = this.isEdit = true;
        this.parent.notify(clearCopy, null);
        this.parent.notify(enableToolbarItems, [{ enable: false }]);
        if (cell.formula && !preventFormulaReference) {
            this.parent.notify(initiateFormulaReference, { range: cell.formula, formulaSheetIdx: this.editCellData.sheetIndex });
        }
    }

    private setCursorPosition(): void {
        const elem: HTMLElement = this.getEditElement(this.parent.getActiveSheet());
        const textLen: number = elem.textContent.length;
        if (textLen) {
            const selection: Selection = document.getSelection();
            const range: Range = document.createRange();
            range.setStart(elem.firstChild, textLen);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
        }
        elem.focus();
    }

    private hasFormulaSuggSelected(): boolean {
        const suggDdlElem: HTMLElement = document.getElementById(this.parent.element.id + '_ac_popup');
        return suggDdlElem && suggDdlElem.style.visibility === 'visible' &&
            suggDdlElem.querySelectorAll('.e-item-focus').length > 0;
    }

    private editingHandler(action: string): void {
        const pictureElements: HTMLCollection = document.getElementsByClassName('e-ss-overlay-active');
        const pictureLen: number = pictureElements.length; let isSpill: boolean;
        switch (action) {
        case 'delete':
            if (pictureLen > 0) {
                if (pictureElements[0].classList.contains('e-datavisualization-chart')) {
                    this.parent.notify(deleteChart, {
                        id: pictureElements[0].id, sheetIdx: this.parent.activeSheetIndex + 1
                    });
                } else {
                    this.parent.notify(deleteImage, {
                        id: pictureElements[0].id, sheetIdx: this.parent.activeSheetIndex + 1
                    });
                }
            } else {
                const sheet: SheetModel = this.parent.getActiveSheet();
                let address: string = sheet.selectedRange;
                let range: number[] = getIndexesFromAddress(address);
                range = range[0] > range[2] ? getSwapRange(range) : range;
                address = getRangeAddress(range);
                const cellDeleteArgs: { address: string, cancel: boolean } = { address: sheet.name + '!' + address, cancel: false };
                this.parent.notify(beginAction, { action: 'cellDelete', eventArgs: cellDeleteArgs });
                if (cellDeleteArgs.cancel) {
                    return;
                }
                address = getRangeFromAddress(cellDeleteArgs.address); range = getRangeIndexes(address);
                clearRange(this.parent, range, this.parent.activeSheetIndex);
                this.parent.notify(selectionComplete, {});
                if (range[0] === 0 && range[1] === 0 && range[2] >= sheet.usedRange.rowIndex  && range[3] >= sheet.usedRange.colIndex) {
                    (this.parent as Workbook).setUsedRange(0, 0, sheet, false, true);
                }
                const args: { cellIdx: number[], isUnique: boolean } = { cellIdx: range, isUnique: false };
                this.checkUniqueRange(args);
                if (args.isUnique) {
                    const indexes: number[] = getRangeIndexes(this.uniqueColl);
                    const cell: CellModel = getCell(indexes[0], indexes[1], this.parent.getActiveSheet());
                    if (cell && cell.value) {
                        isSpill = cell.value.toString().indexOf('#SPILL!') > - 1;
                    }
                }
                if (args.isUnique && this.uniqueColl.split(':')[0] === address.split(':')[0]) {
                    const index: number[] = getRangeIndexes(this.uniqueColl);
                    for (let i: number = index[0]; i <= index[2]; i++) {
                        for (let j: number = index[1]; j <= index[3]; j++) {
                            this.parent.updateCell({value: '', formula: ''}, getRangeAddress([i, j]));
                        }
                    }
                    this.parent.notify(removeUniquecol, null);
                    this.uniqueColl = '';
                } else if (args.isUnique) {
                    const uniqueRange: number[] = getRangeIndexes(this.uniqueColl);
                    if (getCell(uniqueRange[0], uniqueRange[1], sheet).value === '#SPILL!') {
                        let skip: boolean = false;
                        for (let j: number = uniqueRange[0]; j <= uniqueRange[2]; j++) {
                            for (let k: number = uniqueRange[1]; k <= uniqueRange[3]; k++) {
                                const cell: CellModel = getCell(j, k, sheet);
                                if (j === uniqueRange[0] && k === uniqueRange[1]) {
                                    skip = false;
                                } else if (!isNullOrUndefined(cell.value) && cell.value !== '') {
                                    skip = true;
                                }
                            }
                        }
                        if (!skip) { this.reApplyFormula(); }
                    }
                }
                if (args.isUnique) {
                    this.parent.notify(completeAction, { action: 'cellDelete',
                        eventArgs: { address: sheet.name + '!' + address, isSpill: isSpill }});
                } else {
                    this.parent.notify(completeAction, { action: 'cellDelete', eventArgs: { address: sheet.name + '!' + address }});
                }
            }
            break;
        }
    }
    private getCurPosition(): { start?: number, end?: number } {
        const cursorOffset: { start?: number, end?: number } = {};
        const selection: Selection = window.getSelection();
        if (this.editorElem.textContent === this.editCellData.value) {
            cursorOffset.start = selection.anchorOffset;
            cursorOffset.end = selection.focusOffset;
            if (cursorOffset.start > cursorOffset.end) {
                const x: number = cursorOffset.start;
                cursorOffset.start = cursorOffset.end;
                cursorOffset.end = x;
            }
        }
        if (selection && selection.focusNode && (selection.focusNode as Element).classList &&
            (selection.focusNode as Element).classList.contains('e-formula-bar-panel') &&
            this.editorElem.textContent === this.editCellData.value) {
            const formulaBar: Element = (selection.focusNode as Element).getElementsByClassName('e-formula-bar e-css')[0];
            cursorOffset.start = (formulaBar as HTMLTextAreaElement).selectionStart;
            cursorOffset.end = (formulaBar as HTMLTextAreaElement).selectionEnd;
        }
        return cursorOffset;
    }
    private mouseDownHandler(e: MouseEvent & TouchEvent): void {
        if (!closest(e.target as Element, '.e-findtool-dlg') && !closest(e.target as Element, '.e-validation-error-dlg')) {
            if (this.isEdit) {
                const curOffset: { start?: number, end?: number } = this.getCurPosition();
                if (curOffset.start) { this.curStartPos = this.selectionStart = curOffset.start; }
                if (curOffset.end) { this.curEndPos = this.selectionEnd = curOffset.end; }
                const trgtElem: HTMLElement = <HTMLElement>e.target;
                const sheet: SheetModel = this.parent.getActiveSheet();
                const formulaRefIndicator : HTMLElement = this.parent.element.querySelector('.e-formularef-indicator');
                this.isCellEdit = trgtElem.classList.contains('e-spreadsheet-edit');
                let isFormula: boolean = checkIsFormula(this.editCellData.value, true);
                const editorElem: HTMLElement = this.getEditElement(sheet);
                if (trgtElem.classList.contains('e-cell') || trgtElem.classList.contains('e-header-cell') ||
                    trgtElem.classList.contains('e-selectall') || closest(trgtElem, '.e-toolbar-item.e-active') || closest(trgtElem, '.e-table')) {
                    if (this.isAltEnter) {
                        const editText: string = editorElem.textContent;
                        if (editText && editText.indexOf('\n') > -1) {
                            this.isAltEnter = false;
                            wrapText(this.parent.getActiveSheet().selectedRange, true, this.parent as Workbook);
                            this.refreshEditor(editorElem.textContent, this.isCellEdit);
                        }
                    }
                    if (!isFormula || this.endFormulaRef) {
                        this.endFormulaRef = false;
                        this.endEdit(false, e);
                    } else {
                        const curPos: number = this.selectionEnd;
                        const actCellIdx: number[] = getCellIndexes(sheet.activeCell);
                        const cell: CellModel = getCell(actCellIdx[0], actCellIdx[1], sheet);
                        if (this.selectionStart !== this.selectionEnd && this.editCellData.value === editorElem.textContent &&
                            this.validCharacters.indexOf(editorElem.textContent.substring((this.selectionStart - 1),
                                                                                          this.selectionStart)) !== -1) {
                            if (isCellReference(editorElem.textContent.substring(this.selectionStart, this.selectionEnd)) &&
                                editorElem.textContent.indexOf(':') !== this.selectionEnd) {
                                this.editCellData.value = editorElem.textContent.substring(0, this.selectionStart) +
                                    editorElem.textContent.substring(this.selectionEnd, editorElem.textContent.length);
                            }
                        }
                        if (this.editCellData.value === editorElem.textContent && (editorElem.textContent.indexOf('(') !==
                            editorElem.textContent.length - 1 && editorElem.textContent.indexOf('(') !== -1) &&
                            this.selectionStart === this.selectionEnd) {
                            if (this.editCellData.sheetIndex !== getSheetIndex(this.parent, sheet.name)) {
                                const elem: HTMLTextAreaElement =
                                    this.parent.element.querySelector('.e-formula-bar') as HTMLTextAreaElement;
                                if (editorElem.textContent.substring(elem.selectionEnd - 1, elem.selectionEnd) !== ',' &&
                                    !e.shiftKey) {
                                    if (formulaRefIndicator) {
                                        formulaRefIndicator.parentElement.removeChild(formulaRefIndicator);
                                    }
                                    this.parent.goTo(this.editCellData.fullAddr);
                                    this.endEdit(false, e);
                                    return;
                                }
                            } else {
                                if (this.validCharacters.indexOf(editorElem.textContent.substring(curPos - 1, curPos)) === -1) {
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
                        if (isFormula && this.parent.isEdit) {
                            const curPos: number = this.selectionEnd;
                            if (this.editCellData.value.length === curPos) {
                                if (this.editCellData.value.substring(this.editCellData.value.length - 1) === ')' ||
                                    isNumber(this.editCellData.value.substring(this.editCellData.value.length - 1))) {
                                    if (formulaRefIndicator) {
                                        formulaRefIndicator.parentElement.removeChild(formulaRefIndicator);
                                    }
                                    this.endEdit(false, e);
                                }
                            } else if (this.editCellData.value === editorElem.textContent) {
                                if (this.validCharacters.indexOf((this.editCellData.value +
                                    sheet.selectedRange).substring(curPos - 1, curPos)) === -1) {
                                    if (formulaRefIndicator) {
                                        formulaRefIndicator.parentElement.removeChild(formulaRefIndicator);
                                    }
                                    this.endEdit(false, e);
                                } else
                                if (this.validCharacters.indexOf(editorElem.textContent.substring(curPos - 1, curPos)) === -1 ||
                                        (editorElem.textContent.substring(curPos, curPos + 1) !== ')' &&
                                            this.validCharacters.indexOf(editorElem.textContent.substring(curPos, curPos + 1)) === -1)) {
                                    if (formulaRefIndicator) {
                                        formulaRefIndicator.parentElement.removeChild(formulaRefIndicator);
                                    }
                                    this.endEdit(false, e);
                                }
                            }
                        }
                    }
                } else {
                    if (isFormula && this.editCellData.value === editorElem.textContent && editorElem.textContent.indexOf('(') !==
                        editorElem.textContent.length - 1 && !this.isCellEdit &&
                        this.validCharacters.indexOf(this.editCellData.value.substring(this.selectionStart - 1,
                                                                                       this.selectionStart)) === -1) {
                        if (getSheet(this.parent, this.editCellData.sheetIndex).id === sheet.id) {
                            const curPos: number = window.getSelection().focusOffset;
                            if (this.validCharacters.indexOf(editorElem.textContent.substring(curPos - 1, curPos)) === -1) {
                                if (formulaRefIndicator) {
                                    formulaRefIndicator.parentElement.removeChild(formulaRefIndicator);
                                }
                                this.parent.goTo(this.editCellData.fullAddr);
                                if (this.isEdit) {
                                    this.endEdit(false, e);
                                }
                                return;
                            }
                        }
                    }
                }
            }
        }
    }

    private tapHandler(e: TouchEvent): void {
        if (!this.tapedTwice) {
            this.tapedTwice = true;
            /* eslint-disable */
            setTimeout((): void => {
                this.tapedTwice = false;
                if (!this.parent.isEdit && (e.target as Element).classList.contains('e-cell')) {
                    const focusEditEle: HTMLElement = this.parent.element.querySelector('.e-ss-focus-edit') as HTMLElement;
                    if (focusEditEle) {
                        focus(focusEditEle);
                    }
                }
            }, 300);
            /* eslint-enable */
            return;
        }
        e.preventDefault();
        this.dblClickHandler(e);
    }

    private dblClickHandler(e: MouseEvent | TouchEvent): void {
        const trgtElem: HTMLElement = <HTMLElement>e.target;
        const sheet: SheetModel = this.parent.getActiveSheet();
        const actCell: number[] = getCellIndexes(sheet.activeCell);
        const cell: CellModel = getCell(actCell[0], actCell[1], sheet) || {};
        if (closest(trgtElem, '.e-datavisualization-chart')) {
            return;
        }
        if (!sheet.isProtected || !isLocked(cell, getColumn(sheet, actCell[1]))) {
            if ((trgtElem.className.indexOf('e-ss-overlay') < 0) &&
                (trgtElem.classList.contains('e-active-cell') || trgtElem.classList.contains('e-cell')
                    || closest(trgtElem, '.e-sheet-content') || trgtElem.classList.contains('e-table'))) {
                if (this.isEdit) {
                    if (checkIsFormula(this.editCellData.value)) {
                        const sheetName: string = this.editCellData.fullAddr.substring(0, this.editCellData.fullAddr.indexOf('!'));
                        if (this.parent.getActiveSheet().name === sheetName) {
                            this.endEdit();
                        }
                    } else {
                        if (trgtElem.className.indexOf('e-spreadsheet-edit') < 0) {
                            this.endEdit();
                        }
                    }
                } else {
                    this.isNewValueEdit = false;
                    this.startEdit();
                    focus(this.getEditElement(sheet));
                }
            }
        } else {
            if (trgtElem.classList.contains('e-active-cell') || trgtElem.classList.contains('e-cell')) {
                this.parent.notify(editAlert, null);
            }
        }
    }

    private updateEditCellDetail(addr?: string, value?: string): boolean {
        let sheetIdx: number;
        let sheet: SheetModel; let isMergedHiddenCell: boolean;
        if (isNullOrUndefined(this.editCellData.sheetIndex)) {
            if (addr && addr.split('!').length > 1) {
                sheetIdx = getSheetIndex(this.parent as Workbook, getSheetNameFromAddress(addr));
            } else {
                sheetIdx = this.parent.activeSheetIndex;
            }
        } else {
            sheetIdx = this.editCellData.sheetIndex;
        }
        if (!this.editCellData.addr) {
            sheet = getSheet(this.parent as Workbook, sheetIdx);
            if (addr) {
                addr = getRangeFromAddress(addr);
            } else {
                addr = sheet.activeCell;
            }
        } else if (checkIsFormula(this.editCellData.value, true)) {
            sheet = getSheet(this.parent as Workbook, sheetIdx);
            this.isNewValueEdit = false;
        }
        if (addr) {
            const range: number[] = getRangeIndexes(addr);
            let rowIdx: number = range[0];
            let colIdx: number = range[1];
            const model: CellModel = getCell(rowIdx, colIdx, sheet, false, true);
            if (model.colSpan > 1 || model.rowSpan > 1) {
                const mergeArgs: VisibleMergeIndexArgs = { sheet: sheet, cell: model, rowIdx: rowIdx, colIdx: colIdx };
                setVisibleMergeIndex(mergeArgs);
                rowIdx = mergeArgs.rowIdx; colIdx = mergeArgs.colIdx; isMergedHiddenCell = mergeArgs.isMergedHiddenCell;
            }
            const cellElem: HTMLElement = this.parent.getCell(rowIdx, colIdx);
            const cellPosition: { top: number, left: number } = getCellPosition(
                sheet, range, this.parent.frozenRowCount(sheet), this.parent.frozenColCount(sheet),
                this.parent.viewport.beforeFreezeHeight, this.parent.viewport.beforeFreezeWidth, this.parent.sheetModule.colGroupWidth);
            this.editCellData = {
                addr: addr,
                fullAddr: getSheetName(this.parent as Workbook, sheetIdx) + '!' + addr,
                rowIndex: rowIdx,
                colIndex: colIdx,
                sheetIndex: sheetIdx,
                element: cellElem,
                value: value || '',
                position: cellPosition
            };
        }
        return isMergedHiddenCell;
    }

    private initiateEditor(refreshCurPos: boolean, isMergedHiddenCell: boolean): void {
        getData(this.parent, this.editCellData.fullAddr, false, isMergedHiddenCell).then((values: Map<string, CellModel>): void => {
            if (!this.parent) { return; }
            (values as Map<string, CellModel>).forEach((cell: CellModel): void => {
                const args: { [key: string]: CellModel | string } = { cell: cell, value: cell ? cell.value : '' };
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
                if (this.triggerEvent('cellEdit').cancel) {
                    this.cancelEdit(true, false);
                }
            });
        });
    }

    private positionEditor(isWrap?: boolean): void {
        let tdElem: HTMLElement = this.editCellData.element;
        const isEdit: boolean = false; let cellEle: HTMLTableCellElement;
        const arg: FormulaBarEdit = { isEdit: isEdit };
        this.parent.notify(isFormulaBarEdit, arg);
        if (arg.isEdit && isNullOrUndefined(tdElem)) {
            cellEle = this.parent.getCell(this.editCellData.rowIndex, this.editCellData.colIndex) as HTMLTableCellElement;
            tdElem = cellEle;
            this.editCellData.element = cellEle;
        }
        if (tdElem) {
            tdElem.classList.add('e-ss-edited');
            const sheet: SheetModel = this.parent.getActiveSheet();
            const cell: CellModel = getCell(this.editCellData.rowIndex, this.editCellData.colIndex, sheet, false, true);
            const left: number = this.editCellData.position.left + 1;
            const top: number = this.editCellData.position.top + 1;
            const args: MergeArgs = { range: [this.editCellData.rowIndex, this.editCellData.colIndex, this.editCellData.rowIndex,
                this.editCellData.colIndex] };
            this.parent.notify(activeCellMergedRange, args);
            const minHeight: number = getRowsHeight(sheet, <number>args.range[0], <number>args.range[2]) - 3;
            const minWidth: number = getColumnsWidth(sheet, <number>args.range[1], <number>args.range[3]) - 3;
            const cont: Element = this.parent.getMainContent();
            const mainContElement: HTMLElement = <HTMLElement>cont.parentElement;
            let editWidth: number;
            const frozenCol: number = this.parent.frozenColCount(sheet); let zIndex: string; let preventWrap: boolean;
            const frozenRow: number = this.parent.frozenRowCount(sheet); let addWrap: boolean;
            if (this.editCellData.colIndex < frozenCol) {
                editWidth = Math.abs(this.parent.getRowHeaderContent().getBoundingClientRect()[this.parent.enableRtl ? 'left' : 'right'] -
                    tdElem.getBoundingClientRect()[this.parent.enableRtl ? 'right' : 'left']) - 1;
                if (this.editCellData.rowIndex < frozenRow) {
                    if (this.parent.getRowHeaderContent().style.zIndex === '2') { zIndex = '3'; }
                } else {
                    if (getTextWidth(cell.value, cell.style, this.parent.cellStyle) > editWidth) { addWrap = true; }
                }
            } else {
                editWidth = (mainContElement.offsetWidth - (left - cont.scrollLeft) - 28) - this.parent.sheetModule.getRowHeaderWidth(sheet);
                const tdEleInf: ClientRect = tdElem.getBoundingClientRect();
                const mainContEleInf: ClientRect = mainContElement.getBoundingClientRect();
                const getCellRight: number = this.parent.enableRtl ? tdEleInf.left : tdEleInf.right;
                const getMainConEleRight: number = this.parent.enableRtl ? mainContEleInf.left : mainContEleInf.right;
                const horizontalScrollBar: Element = this.parent.getScrollElement();
                const verticalScrollBarWidth: number = this.parent.sheetModule.getScrollSize();
                if (this.parent.enableRtl) {
                    if ((getMainConEleRight + verticalScrollBarWidth) > getCellRight) {
                        horizontalScrollBar.scrollLeft -= tdEleInf.width;
                    }
                } else {
                    if ((getMainConEleRight - verticalScrollBarWidth) < getCellRight) {
                        horizontalScrollBar.scrollLeft += tdEleInf.width;
                    }
                }
            }
            if (this.editCellData.rowIndex < frozenRow) { preventWrap = true; }
            const height: string = !preventWrap && ((cell && cell.wrap) || (tdElem && isWrap) || addWrap) ? 'auto;' : minHeight + 'px;';
            // let editHeight: number = mainContElement.offsetHeight - top - 28;
            let inlineStyles: string = 'display:block;top:' + top + 'px;' + (this.parent.enableRtl ? 'right:' : 'left:') + left + 'px;' +
                'min-width:' + minWidth + 'px;max-width:' + (cell && cell.wrap ? minWidth : editWidth) + 'px;' +
                'height:' + height + (cell && cell.wrap ? ('width:' + minWidth + 'px;') : '') + 'min-height:' + minHeight + 'px;' +
                (zIndex ? 'z-index: ' + zIndex + ';' : '') + (preventWrap && ((cell && !cell.wrap) || (tdElem && isWrap)) && (getTextWidth(
                cell.value, cell.style, this.parent.cellStyle) > editWidth || (tdElem && isWrap)) ? 'overflow: auto;' : '');
            inlineStyles += tdElem.style.cssText;
            const editorElem: HTMLElement = this.getEditElement(sheet, true);
            editorElem.setAttribute('style', inlineStyles);
            if (getTextWidth(editorElem.textContent, cell.style, this.parent.cellStyle) > editWidth) {
                editorElem.style.height = 'auto';
            }
            // we using edit div height as auto , while editing div enlarges and hide active cell bottom border for that
            // we increasing 1px height to active cell.
            const actCell: HTMLElement = this.parent.element.querySelector('.e-active-cell') as HTMLElement;
            if (actCell) { actCell.style.height = (minHeight + 4) + 'px'; }
            if (tdElem.classList.contains('e-right-align')) {
                editorElem.classList.add('e-right-align');
            } else if (tdElem.classList.contains('e-center-align')) {
                editorElem.classList.add('e-center-align');
            }
        }
    }

    private updateEditedValue(tdRefresh: boolean, value: string, e: MouseEvent & TouchEvent | KeyboardEventArgs, isPublic: boolean): void {
        const oldCellValue: string = this.editCellData.oldValue;
        if (value) {
            this.editCellData.value = value;
        }
        const newVal: string = this.editCellData.value;
        /* To set the before cell details for undo redo. */
        this.parent.notify(setActionData, { args: { action: 'beforeCellSave', eventArgs: { address: this.editCellData.addr } } });
        let isValidCellValue: boolean = true;
        if (this.parent.allowDataValidation) {
            const sheet: SheetModel = this.parent.getActiveSheet();
            const cellIndex: number[] = getRangeIndexes(sheet.activeCell);
            const cell: CellModel = getCell(cellIndex[0], cellIndex[1], sheet, false, true);
            const column: ColumnModel = getColumn(sheet, cellIndex[1]);
            if (cell.validation || checkColumnValidation(column, cellIndex[0], cellIndex[1])) {
                const value: string = parseLocaleNumber(
                    [this.editCellData.value || this.getEditElement(sheet).innerText], this.parent.locale)[0];
                const isCell: boolean = true;
                const sheetIdx: number = this.parent.activeSheetIndex;
                const range: number[] = typeof this.editCellData.addr === 'string' ? getRangeIndexes(this.editCellData.addr) :
                    this.editCellData.addr;
                const validEventArgs: checkCellValid = { value, range, sheetIdx, isCell, td: null, isValid: true };
                this.parent.notify(isValidation, validEventArgs);
                isValidCellValue = validEventArgs.isValid;
                if (isValidCellValue) {
                    this.editCellData.value = value;
                } else {
                    this.isCellEdit = true;
                }
            }
        }
        if (!isPublic && checkIsFormula(this.editCellData.value)) {
            const eventArgs: { formula: string, isInvalid?: boolean } = { formula: this.editCellData.value };
            this.parent.notify(checkFormulaRef, eventArgs);
            if (eventArgs.isInvalid) {
                let isYesBtnClick: boolean;
                this.isCellEdit = true;
                isValidCellValue = false;
                const l10n: L10n = this.parent.serviceLocator.getService(locale);
                const erroDialogInst: Dialog = this.parent.serviceLocator.getService(dialog) as Dialog;
                erroDialogInst.show({
                    width: 400, isModal: true, showCloseIcon: true, target: this.parent.element, cssClass: 'e-validation-error-dlg',
                    content: `${l10n.getConstant('CellReferenceTypoError')}<br>${eventArgs.formula}`,
                    beforeOpen: (): void => this.editCellData.element.focus(),
                    buttons: [{
                        buttonModel: { content: l10n.getConstant('Yes'), isPrimary: true },
                        click: (): void => {
                            isYesBtnClick = true;
                            erroDialogInst.hide();
                            value = this.editCellData.value = eventArgs.formula;
                            this.updateCell(oldCellValue, tdRefresh, value, newVal, e);
                            this.parent.notify(formulaBarOperation, { action: 'refreshFormulabar', value: eventArgs.formula });
                        }
                    },
                    {
                        buttonModel: { content: l10n.getConstant('No') },
                        click: (): void => erroDialogInst.hide()
                    }],
                    close: (): void => {
                        const editorElem: HTMLElement = this.getEditElement(this.parent.getActiveSheet());
                        if (!isYesBtnClick && editorElem.innerText) {
                            window.getSelection().selectAllChildren(editorElem);
                        }
                    }
                }, false);
            }
        }
        if (isValidCellValue) {
            this.updateCell(oldCellValue, tdRefresh, value, newVal, e);
        } else if (e) {
            e.preventDefault();
        }
    }

    private updateCell(
        oldCellValue: string, tdRefresh: boolean, value: string, newVal: string, e?: MouseEvent & TouchEvent | KeyboardEventArgs): void {
        const oldValue: string = oldCellValue ? oldCellValue.toString().toUpperCase() : '';
        if (oldCellValue !== this.editCellData.value || oldValue.indexOf('=NOW()') > -1 || oldValue.indexOf('=RAND()') > -1 ||
            oldValue.indexOf('RAND()') > -1 || oldValue.indexOf('=RANDBETWEEN(') > -1 || oldValue.indexOf('RANDBETWEEN(') > -1) {
            const sheet: SheetModel = this.parent.getActiveSheet();
            const cellIndex: number[] = getRangeIndexes(sheet.activeCell);
            if (oldCellValue && oldCellValue.toString().indexOf('=UNIQUE(') > - 1 && this.editCellData.value === '') {
                this.parent.notify(removeUniquecol, null);
            }
            const args: { cellIdx: number[], isUnique: boolean } = { cellIdx: cellIndex, isUnique: false };
            this.checkUniqueRange(args);
            const isUniqueRange: boolean = args.isUnique;
            if (isUniqueRange && oldCellValue !== '' && this.editCellData.value === '') {
                const rangeIdx: number[] = getRangeIndexes(this.uniqueColl);
                if (getCell(rangeIdx[0], rangeIdx[1], sheet).value.toString().indexOf('#SPILL!') === - 1) {
                    return;
                }
            }
            if (oldCellValue && oldCellValue.toString().indexOf('UNIQUE') > - 1 &&
                this.editCellData.value && this.editCellData.value.toString().indexOf('UNIQUE') > - 1 && isUniqueRange) {
                this.updateUniqueRange('');
            }
            const evtArgs: { [key: string]: string | boolean | number[] | number } = {
                action: 'updateCellValue',
                address: this.editCellData.addr, value: this.editCellData.value
            };
            this.parent.notify(workbookEditOperation, evtArgs);
            let indexes: number[][];
            if (<boolean>evtArgs.isFormulaDependent) {
                indexes = getViewportIndexes(this.parent, this.parent.viewport);
            }
            this.parent.notify(
                refreshChart, { cell: null, rIdx: this.editCellData.rowIndex, cIdx: this.editCellData.colIndex, viewportIndexes: indexes });
            if (sheet.conditionalFormats && sheet.conditionalFormats.length) {
                this.parent.notify(
                    applyCF, <ApplyCFArgs>{
                        indexes: [this.editCellData.rowIndex, this.editCellData.colIndex], isAction: true,
                        refreshAll: evtArgs.isFormulaDependent, isEdit: true
                    });
            }
            const cell: CellModel = getCell(cellIndex[0], cellIndex[1], sheet, true);
            const eventArgs: RefreshValueArgs = this.getRefreshNodeArgs(
                cell, this.editCellData.element, this.editCellData.rowIndex, this.editCellData.colIndex);
            this.editCellData.value = <string>eventArgs.value;
            if (cell && cell.formula) {
                this.editCellData.formula = cell.formula;
            }
            if (cell && cell.wrap) {
                this.parent.notify(wrapEvent, { range: cellIndex, wrap: true, sheet: sheet });
            }
            if (tdRefresh) {
                this.parent.refreshNode(this.editCellData.element, eventArgs);
            }
            if (cell && cell.hyperlink) {
                this.parent.serviceLocator.getService<ICellRenderer>('cell').refreshRange(cellIndex);
            }
            if (isUniqueRange) {
                const rangeIdx: number[] = getRangeIndexes(this.uniqueColl);
                if (getCell(rangeIdx[0], rangeIdx[1], sheet).value.toString().indexOf('#SPILL!') > - 1) { this.isSpill = true; }
                if ((oldCellValue !== '' && this.editCellData.value === '') ||
                    (this.editCellData.formula && this.editCellData.formula.length > 1 && oldCellValue !== this.editCellData.formula)) {
                    let skip: boolean = false;
                    for (let j: number = rangeIdx[0]; j <= rangeIdx[2]; j++) {
                        for (let k: number = rangeIdx[1]; k <= rangeIdx[3]; k++) {
                            const cell: CellModel = getCell(j, k, sheet);
                            if (j === rangeIdx[0] && k === rangeIdx[1]) {
                                skip = false;
                            } else if (cell && !isNullOrUndefined(cell.value) && cell.value !== '') {
                                skip = true;
                            }
                        }
                    }
                    if (!skip) { this.reApplyFormula(); }
                } else {
                    this.updateUniqueRange(newVal);
                }
            }
        }
        this.triggerEvent('cellSave', e, value);
        this.resetEditState();
        this.focusElement();
        if (this.parent.showSheetTabs && !this.parent.isProtected) {
            this.parent.element.querySelector('.e-add-sheet-tab').removeAttribute('disabled');
        }
    }

    private checkUniqueRange(uniquArgs: {cellIdx: number[], isUnique: boolean, uniqueRange?: string, sheetName?: string}): void {
        const args: {range: string[]} = {range : []};
        this.parent.notify(getUniqueRange, args);
        const collection: string[] = args.range;
        if (!uniquArgs.sheetName) {
            uniquArgs.sheetName = this.parent.getActiveSheet().name;
        }
        for (let i: number = 0; i < collection.length; i++) {
            if (collection[i as number].split('!')[0] === uniquArgs.sheetName) {
                const rangeIdx: number[] = getRangeIndexes(collection[i as number]);
                for (let j: number = rangeIdx[0]; j <= rangeIdx[2]; j++) {
                    for (let k: number = rangeIdx[1]; k <= rangeIdx[3]; k++) {
                        if (uniquArgs.cellIdx[0] === j && uniquArgs.cellIdx[1] === k) {
                            uniquArgs.isUnique = true; this.uniqueCell = true;
                            const uniqueIndex: number[] = this.uniqueColl !== '' ? getRangeIndexes(this.uniqueColl) : [0, 0, 0, 0];
                            const collectionIndex: number[] = getRangeIndexes(collection[i as number]);
                            if (uniqueIndex[0] === collectionIndex[0] && uniqueIndex[1] === collectionIndex[1]) {
                                const index: number[] = [uniqueIndex[0], collectionIndex[1], uniqueIndex[0], collectionIndex[1]];
                                index[2] = uniqueIndex[2] > collectionIndex[2] ? uniqueIndex[2] : collectionIndex[2];
                                index[3] = uniqueIndex[3] > collectionIndex[3] ? uniqueIndex[3] : collectionIndex[3];
                                this.uniqueColl = getRangeAddress(index);
                                uniquArgs.uniqueRange = getRangeAddress(index);
                            } else {
                                this.uniqueColl = collection[i as number];
                                uniquArgs.uniqueRange = collection[i as number];
                            }
                        }
                    }
                }
            }
        }
    }

    private updateUniqueRange(value: string): void {
        const rangeIdx: number[] = getRangeIndexes(this.uniqueColl); let skip: boolean = false;
        if (getCell(rangeIdx[0], rangeIdx[1], this.parent.getActiveSheet()).value !== '#SPILL!') {
            skip = true;
        }
        for (let j: number = rangeIdx[0]; j <= rangeIdx[2]; j++) {
            for (let k: number = rangeIdx[1]; k <= rangeIdx[3]; k++) {
                if (skip) {
                    if (j === rangeIdx[0] && k === rangeIdx[1]) {
                        this.parent.updateCell({value: '#SPILL!'}, getRangeAddress([j, k]));
                    } else {
                        if (getRangeAddress([j, k]).split(':')[0] === this.editCellData.addr) {
                            this.parent.updateCell({value: value}, getRangeAddress([j, k]));
                        } else {
                            this.parent.updateCell({value: ''}, getRangeAddress([j, k]));
                        }
                    }
                }
            }
        }
    }

    private reApplyFormula(): void {
        const cellIdx: number[] = getRangeIndexes(this.uniqueColl);
        const cell: CellModel = getCell(cellIdx[0], cellIdx[1], this.parent.getActiveSheet());
        this.parent.updateCell({value: ''}, getRangeAddress([cellIdx[0], cellIdx[1]]));
        const sheets: SheetModel[] = this.parent.sheets; let formula: string = cell.formula;
        for (let i: number = 0; i < sheets.length; i++) {
            if (formula.indexOf(sheets[i as number].name) > - 1) {
                formula = formula.replace(sheets[i as number].name, '!' + i);
            }
        }
        this.parent.notify(workbookFormulaOperation, { action: 'computeExpression', formula: formula });
        this.uniqueCell = false;
        if (this.uniqueActCell !== '') {
            this.editCellData.value = this.uniqueActCell;
            this.uniqueActCell = '';
        }
    }
    private refreshDependentCellValue(rowIdx: number, colIdx: number, sheetIdx: number): void {
        if (rowIdx && colIdx) {
            rowIdx--; colIdx--;
            if (((this.editCellData.rowIndex !== rowIdx || this.editCellData.colIndex !== colIdx)
                && this.parent.activeSheetIndex === sheetIdx) || (this.uniqueCell && this.parent.activeSheetIndex === sheetIdx)) {
                const sheet: SheetModel = getSheet(this.parent as Workbook, sheetIdx);
                let td: HTMLElement;
                if (!isHiddenRow(sheet, rowIdx) && !isHiddenCol(sheet, colIdx)) {
                    td = this.parent.getCell(rowIdx, colIdx);
                }
                if (td) {
                    if (td.parentElement) {
                        const curRowIdx: string = td.parentElement.getAttribute('aria-rowindex');
                        if (curRowIdx && Number(curRowIdx) - 1 !== rowIdx) { return; }
                    }
                    const cell: CellModel = getCell(rowIdx, colIdx, sheet);
                    const actCell: number[] = getRangeIndexes(sheet.activeCell);
                    if (actCell[0] === rowIdx && actCell[1] === colIdx) {
                        this.uniqueActCell = cell.value;
                    }
                    const eventArgs: RefreshValueArgs = this.getRefreshNodeArgs(cell, td, rowIdx, colIdx);
                    this.parent.refreshNode(td, eventArgs);
                }
            }
        }
    }

    private getRefreshNodeArgs(cell: CellModel, tdEle: HTMLElement, rowIdx: number, colIdx: number): RefreshValueArgs {
        cell = cell || {};
        const eventArgs: NumberFormatArgs = { value: cell.value, format: cell.format, formattedText: '', isRightAlign: false,
            type: 'General', cell: cell, rowIndex: rowIdx, td: tdEle, colIndex: colIdx, refresh: true, isEdit: true };
        this.parent.notify(getFormattedCellObject, eventArgs);
        return <RefreshValueArgs>{ isRightAlign: eventArgs.isRightAlign, type: eventArgs.type, value: <string>eventArgs.value,
            result: this.parent.allowNumberFormatting ? eventArgs.formattedText : <string>eventArgs.value, curSymbol: eventArgs.curSymbol,
            isRowFill: eventArgs.isRowFill };
    }

    public endEdit(refreshFormulaBar: boolean = false, event?: MouseEvent & TouchEvent | KeyboardEventArgs, isPublic?: boolean): void {
        if (refreshFormulaBar) { this.refreshEditor(this.editCellData.oldValue, false, true, false, false); }
        const triggerEventArgs: CellEditEventArgs = this.triggerEvent('beforeCellSave');
        if (triggerEventArgs.cancel) {
            if (this.parent.isEdit && event) {
                event.preventDefault();
            }
            return;
        }
        if (triggerEventArgs.value && triggerEventArgs.value.toString().indexOf('\n') > -1) {
            wrapText(this.parent.getActiveSheet().selectedRange, true, this.parent as Workbook);
            this.refreshEditor(triggerEventArgs.value, this.isCellEdit, false, false, false);
        }
        this.updateEditedValue(true, triggerEventArgs.value, event, isPublic);
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
        focus(this.parent.element);
        this.parent.notify(enableToolbarItems, [{ enable: true }]);
    }

    private triggerEvent(eventName: string, event?: MouseEvent & TouchEvent | KeyboardEventArgs, value?: string): CellEditEventArgs {
        const sheet: SheetModel = this.parent.getActiveSheet();
        let cell : CellModel = getCell(this.editCellData.rowIndex, this.editCellData.colIndex, sheet);
        const eventArgs: CellEditEventArgs | CellSaveEventArgs = {
            element: this.editCellData.element,
            value: value ? value : this.editCellData.value,
            oldValue: this.editCellData.oldValue,
            address: this.editCellData.fullAddr,
            displayText: this.parent.getDisplayText(cell)
        };
        if (eventArgs.address) {
            const indexes: number[] = getRangeIndexes(eventArgs.address);
            const args: { cellIdx: number[], isUnique: boolean } = { cellIdx: indexes, isUnique: false };
            this.checkUniqueRange(args);
            if (args.isUnique) { eventArgs.isSpill = this.isSpill; }
        }
        if (eventArgs.value !== eventArgs.oldValue) {
            if (eventName !== 'cellSave') { (<CellEditEventArgs>eventArgs).cancel = false; }
            if (eventName === 'beforeCellSave') {
                this.parent.notify(beginAction, { eventArgs: eventArgs, action: 'cellSave', preventAction: true });
                cell = checkIsFormula(eventArgs.value) ? { formula: eventArgs.value } : { value: eventArgs.value };
                const cancel: boolean = updateCell(
                    this.parent, sheet, { cell: cell, rowIdx: this.editCellData.rowIndex, colIdx: this.editCellData.colIndex,
                        eventOnly: true });
                if (cancel) {
                    this.cancelEdit(false, false);
                    (<CellEditEventArgs>eventArgs).cancel = true;
                    return <CellEditEventArgs>eventArgs;
                }
            }
            this.parent.trigger(eventName, eventArgs);
            if (eventName === 'cellSave') {
                if (this.editCellData.formula) { eventArgs.formula = this.editCellData.formula; }
                eventArgs.originalEvent = event;
                this.parent.notify(completeAction, { eventArgs: eventArgs, action: 'cellSave' });
            }
        } else if (eventName !== 'cellSave' && eventName !== 'beforeCellSave') {
            this.parent.trigger(eventName, eventArgs);
        }
        return { value: eventArgs.value, oldValue: null, element: null, address: null, cancel: (<CellEditEventArgs>eventArgs).cancel };
    }

    private altEnter(): void {
        this.positionEditor(true);
        const selection: Selection = window.getSelection(); const node: Node = selection.anchorNode;
        let offset: number; let range: Range = document.createRange();
        offset = (node.nodeType === 3) ? selection.anchorOffset : node.textContent.length;
        if (offset === 0 && node.textContent.length > 0) {
            offset = node.textContent.length;
        }
        const text: string = node.textContent;
        const textBefore: string = text.slice(0, offset);
        const textAfter: string = text.slice(offset) || ' ';
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
            const editorElem: HTMLElement = this.getEditElement(this.parent.getActiveSheet());
            if (checkIsFormula(editorElem.textContent) || editorElem.textContent === '') {
                this.parent.notify(clearCellRef, null);
            }
            if (this.editCellData.element) {
                this.editCellData.element.classList.remove('e-ss-edited');
                this.editorElem.textContent = '';
                if (editorElem === this.editorElem) {
                    this.editorElem.removeAttribute('style'); this.editorElem.classList.remove('e-right-align');
                } else {
                    detach(editorElem);
                }
            }
        }
        this.editCellData = {};
        this.parent.isEdit = this.isEdit = false;
        this.isCellEdit = true;
        this.parent.notify(formulaOperation, { action: 'endEdit' });
    }

    private refSelectionRender(): void {
        const editorElem: HTMLElement = this.getEditElement(this.parent.getActiveSheet());
        if (editorElem) {
            if (checkIsFormula(editorElem.textContent)) {
                this.parent.notify(initiateFormulaReference, {
                    range: editorElem.textContent, formulaSheetIdx: this.editCellData.sheetIndex
                });
            }
        }
    }

    // Start edit the formula cell and set cursor position
    private initiateRefSelection(): void {
        const sheetName: string = this.editCellData.fullAddr.substring(0, this.editCellData.fullAddr.indexOf('!'));
        const value: string = this.editCellData.value;
        if (this.parent.getActiveSheet().name === sheetName && checkIsFormula(this.editCellData.value, true)) {
            this.startEdit(this.editCellData.addr, value, false);
            this.parent.notify(initiateFormulaReference, {
                range: this.editCellData.value, formulaSheetIdx: this.editCellData.sheetIndex
            });
            this.getEditElement(this.parent.getActiveSheet()).textContent = value;
            this.initiateCurPosition();
        } else {
            this.initiateCurPosition();
        }
    }

    private addressHandler(args: { range: string, isSelect: boolean, isMultiple: boolean }): void {
        const selection: Selection = window.getSelection();
        this.selectionStart = selection.anchorOffset;
        this.selectionEnd = selection.focusOffset;
        if (this.selectionStart > this.selectionEnd) {
            const x : number = this.selectionStart;
            this.selectionStart = this.selectionEnd;
            this.selectionEnd = x;
        }
        if ((selection && selection.focusNode && (selection.focusNode as Element).classList &&
            (selection.focusNode as Element).classList.contains('e-formula-bar-panel'))) {
            const formulaBar: Element = (selection.focusNode as Element).getElementsByClassName('e-formula-bar e-css')[0];
            this.selectionStart = (formulaBar as HTMLTextAreaElement).selectionStart;
            this.selectionEnd = (formulaBar as HTMLTextAreaElement).selectionEnd;
        }
        const eventArgs: { action: string, editedValue: string } = { action: 'getCurrentEditValue', editedValue: '' };
        this.parent.notify(editOperation, eventArgs);
        let address: string = args.range;
        const sheetName: string = this.editCellData.fullAddr.substring(0, this.editCellData.fullAddr.indexOf('!'));
        const sheetIdx: number = this.editCellData.sheetIndex;
        const editorEle: HTMLElement = this.getEditElement(this.parent.getActiveSheet());
        if (this.parent.getActiveSheet().name !== sheetName) {
            address = '\'' + this.parent.getActiveSheet().name + '\'' + '!' + address;
        }
        if (args.isSelect) {
            this.parent.notify(initiateFormulaReference, { range: eventArgs.editedValue + address, formulaSheetIdx: sheetIdx });
        } else {
            const sheetName: string = this.editCellData.fullAddr.substring(0, this.editCellData.fullAddr.indexOf('!'));
            if (this.parent.getActiveSheet().name === sheetName) {
                const editedValue: string = eventArgs.editedValue;
                if (this.selectionStart !== this.selectionEnd) {
                    this.formulaBarCurStartPos = this.selectionStart;
                    this.curStartPos = this.selectionStart;
                    this.curEndPos = this.selectionStart + address.length;
                    editorEle.textContent = editedValue.substring(0, this.selectionStart)
                    + address + editedValue.substring(this.selectionStart);
                }
                else if (editedValue.indexOf(')') === editedValue.length - 1 && this.selectionEnd === editedValue.length) {
                    editorEle.textContent = editedValue.substring(0, editedValue.length - 1)
                    + address + editedValue.substring(editedValue.length - 1);
                    this.curEndPos = editorEle.textContent.length - 1;
                } else if (editedValue.indexOf(')') !== editedValue.length - 1) {
                    editorEle.textContent = editedValue + address;
                    this.curEndPos = editorEle.textContent.length;
                } else if (editorEle.textContent !== editedValue) {
                    editorEle.textContent = editedValue.substring(0, this.curStartPos)
                    + address + editedValue.substring(this.curStartPos);
                    this.curEndPos = this.curStartPos + address.length;
                } else if (this.selectionStart === this.selectionEnd &&
                this.validCharacters.indexOf(editedValue.substring(this.selectionStart - 1, this.selectionEnd)) !== -1 &&
                (this.validCharacters.indexOf(editedValue.substring(this.selectionStart, this.selectionEnd + 1)) !== -1 ||
                    editedValue.substring(this.selectionStart, this.selectionEnd + 1) === ')')) {
                    editorEle.textContent = editedValue.substring(0, this.selectionStart)
                    + address + editedValue.substring(this.selectionEnd);
                    this.curStartPos = this.selectionStart;
                    this.curEndPos = this.selectionStart + address.length;
                    this.formulaBarCurStartPos = this.curStartPos;
                }
            }
        }
    }

    private updateFormulaBarValue(): void {
        const selection: Selection = window.getSelection();
        const value: string = this.editCellData.value;
        let address: string = this.parent.getActiveSheet().selectedRange;
        address = isSingleCell(getIndexesFromAddress(address)) ? address.split(':')[0] : address;
        const formulaBar: HTMLTextAreaElement = this.parent.element.querySelector('.e-formula-bar') as HTMLTextAreaElement;
        if (value && checkIsFormula(value, true)) {
            const sheetName: string = this.editCellData.fullAddr.substring(0, this.editCellData.fullAddr.indexOf('!'));
            if (this.parent.getActiveSheet().name !== sheetName) {
                address = '\'' + this.parent.getActiveSheet().name + '\'' + '!' + address;
            }
            if (!isNullOrUndefined(this.formulaBarCurStartPos)) {
                formulaBar.value = value.substring(0, this.formulaBarCurStartPos)
                    + address + value.substring(this.formulaBarCurStartPos);
            }
            else if (value.indexOf(')') === value.length - 1 && selection.focusOffset === value.length) {
                formulaBar.value = value.substring(0, value.length - 1) + address + value.substring(value.length - 1);
            } else if (value.indexOf(')') !== value.length - 1) {
                formulaBar.value = value + address;
            } else if ( formulaBar.value !== value){
                formulaBar.value = value.substring(0, this.curStartPos)
                    + address + value.substring(this.curStartPos);
            }
            this.curEndPos = this.curStartPos + address.length;
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

    private initiateCurPosition(args: { isCellEdit: boolean } = { isCellEdit: false }): void {
        const el: HTMLElement = this.getEditElement(this.parent.getActiveSheet(), true);
        if (args.isCellEdit) {
            const curOffset: { start?: number, end?: number } = this.getCurPosition();
            if (!this.endFormulaRef && curOffset.start === curOffset.end) {
                this.updateFormulaReference(el);
                if (curOffset.end && this.validCharacters.indexOf(this.editCellData.value[curOffset.end - 1]) === -1) {
                    this.endFormulaRef = true;
                }
            }
            return;
        }
        const value: string = el.innerText;
        const selection: Selection = window.getSelection();
        if ((selection && selection.focusNode && (selection.focusNode as Element).classList &&
            (selection.focusNode as Element).classList.contains('e-formula-bar-panel'))) {
            const formulaBar: HTMLTextAreaElement =
                this.parent.element.querySelector('.e-formula-bar') as HTMLTextAreaElement;
            this.setFormulaBarCurPosition(formulaBar, this.curEndPos, this.curEndPos);
            return;
        }
        if (value) {
            const range: Range = document.createRange();
            if (value.indexOf(')') === value.length - 1) {
                range.setStart(el.childNodes[0], this.curEndPos);
                range.setEnd(el.childNodes[0], this.curEndPos);
            } else {
                range.setStart(el.childNodes[0], this.curEndPos);
                range.setEnd(el.childNodes[0], this.curEndPos);
            }
            selection.removeAllRanges();
            selection.addRange(range);
        }
        const sheetIdx: number = this.editCellData.sheetIndex;
        if (sheetIdx !== this.parent.getActiveSheet().id - 1) {
            const elem: HTMLTextAreaElement = this.parent.element.querySelector('.e-formula-bar') as HTMLTextAreaElement;
            if (elem.value) {
                const valueLength: number = elem.value.length;
                if (elem.value.indexOf(')') === valueLength - 1) {
                    this.setFormulaBarCurPosition(elem, valueLength - 1, valueLength - 1);
                } else {
                    this.setFormulaBarCurPosition(elem, valueLength, valueLength);
                }
            }
        }
    }

    private getEditElement(sheet: SheetModel, isEdit?: boolean): HTMLElement {
        if ((this.isEdit || isEdit) && (sheet.frozenRows || sheet.frozenColumns)) {
            const frozenRow: number = this.parent.frozenRowCount(sheet); const frozenCol: number = this.parent.frozenColCount(sheet);
            const range: number[] = getCellIndexes(sheet.activeCell); let content: Element;
            if (range[0] < frozenRow && range[1] < frozenCol) {
                content = this.parent.getSelectAllContent();
            } else if (range[0] < frozenRow) {
                content = this.parent.getColumnHeaderContent();
            } else if (range[1] < frozenCol) {
                content = this.parent.getRowHeaderContent();
            } else {
                return this.editorElem;
            }
            let editEle: HTMLElement = content.getElementsByClassName('e-spreadsheet-edit')[0] as HTMLElement;
            if (!editEle && isEdit) { editEle = content.appendChild(this.editorElem.cloneNode()) as HTMLElement; }
            return editEle;
        }
        return this.editorElem;
    }

    private sheetChangeHandler(): void {
        if (!this.isEdit) {
            this.editCellData.value = null;
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
