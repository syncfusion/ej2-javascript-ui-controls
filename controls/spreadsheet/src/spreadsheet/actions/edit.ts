import { Spreadsheet } from '../index';
import { EventHandler, KeyboardEventArgs, Browser, closest } from '@syncfusion/ej2-base';
import { getRangeIndexes, getRangeFromAddress, getIndexesFromAddress } from '../../workbook/common/address';
import { keyDown, editOperation, clearCopy, keyUp, mouseDown, selectionComplete, enableToolbar } from '../common/event';
import { formulaBarOperation, formulaOperation } from '../common/event';
import { workbookEditOperation, getFormattedBarText, getFormattedCellObject } from '../../workbook/common/event';
import { CellModel, SheetModel, getSheetName, getSheetIndex, getCell } from '../../workbook/base/index';
import { getSheetNameFromAddress, getCellPosition, getSheet } from '../../workbook/base/index';
import { RefreshValueArgs } from '../integrations/index';
import { NumberFormatType } from '../../workbook/index';
import { CellEditEventArgs, CellSaveEventArgs, ICellRenderer } from '../common/index';

/**
 * The `Edit` module is used to handle the editing functionalities in Spreadsheet.
 */
export class Edit {
    private parent: Spreadsheet;
    private editorElem: HTMLElement = null;
    private editCellData: IEditCellData = {};
    private isEdit: boolean = false;
    private isCellEdit: boolean = true;
    private isNewValueEdit: boolean = true;
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
    }

    private removeEventListener(): void {
        EventHandler.remove(this.parent.element, 'dblclick', this.dblClickHandler);
        if (!this.parent.isDestroyed) {
            this.parent.off(mouseDown, this.mouseDownHandler);
            this.parent.off(keyUp, this.keyUpHandler);
            this.parent.off(keyDown, this.keyDownHandler);
            this.parent.off(editOperation, this.performEditOperation);
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
        }
    }

    private keyUpHandler(e: KeyboardEventArgs): void {
        if (this.isEdit) {
            if (this.isCellEdit && this.editCellData.value !== this.editorElem.textContent) {
                this.refreshEditor(this.editorElem.textContent, this.isCellEdit);
            }
        }
    }

    private keyDownHandler(e: KeyboardEventArgs): void {
        let trgtElem: HTMLElement = <HTMLElement>e.target;
        let keyCode: number = e.keyCode;

        if (this.isEdit) {
            if (this.isCellEdit) {
                this.refreshEditor(this.editorElem.textContent, this.isCellEdit);
            }

            switch (keyCode) {
                case this.keyCodes.ENTER:
                    if (Browser.isWindows) {
                        e.preventDefault();
                    }
                    this.endEdit();
                    break;
                case this.keyCodes.TAB:
                    if (!this.hasFormulaSuggSelected()) {
                        this.endEdit();
                    }
                    break;
                case this.keyCodes.ESC:
                    this.cancelEdit();
                    break;
            }
        } else {
            if (!this.isEdit && (trgtElem.classList.contains('e-spreadsheet') || closest(trgtElem, '.e-sheet-panel'))) {
                let isAlphabet: boolean = (keyCode >= this.keyCodes.FIRSTALPHABET && keyCode <= this.keyCodes.LASTALPHABET);
                let isNumeric: boolean = (keyCode >= this.keyCodes.FIRSTNUMBER && keyCode <= this.keyCodes.LASTNUMBER);
                let isNumpadKeys: boolean = (keyCode >= this.keyCodes.FIRSTNUMPAD && keyCode <= this.keyCodes.LASTNUMPAD);
                let isSymbolkeys: boolean = (keyCode >= this.keyCodes.SYMBOLSETONESTART && keyCode <= this.keyCodes.SYMBOLSETONEEND);
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
                    this.startEdit();
                }
                if (keyCode === this.keyCodes.DELETE) {
                    this.editingHandler('delete');
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
            this.parent.element.querySelector('.e-main-content').appendChild(this.editorElem);
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
        this.updateEditCellDetail(address, value);
        this.initiateEditor(refreshCurPos);
        this.positionEditor();
        this.parent.isEdit = this.isEdit = true;
        this.parent.notify(clearCopy, null);
        this.parent.notify(enableToolbar, { enable: false });
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
        switch (action) {
            case 'delete':
                let address: string = this.parent.getActiveSheet().selectedRange;
                let range: number[] = getIndexesFromAddress(address);
                this.parent.clearRange(address, null, true);
                this.parent.serviceLocator.getService<ICellRenderer>('cell').refreshRange(range);
                this.parent.notify(selectionComplete, {});
                break;
        }
    }

    private mouseDownHandler(e: MouseEvent & TouchEvent): void {
        if (this.isEdit) {
            let trgtElem: HTMLElement = <HTMLElement>e.target;
            this.isCellEdit = trgtElem.classList.contains('e-spreadsheet-edit');
            if (trgtElem.classList.contains('e-cell') || trgtElem.classList.contains('e-header-cell') ||
                trgtElem.classList.contains('e-virtualtrack') || trgtElem.classList.contains('e-selectall')) {
                this.endEdit();
            }
        }
    }

    private dblClickHandler(e: MouseEvent & TouchEvent): void {
        let trgtElem: HTMLElement = <HTMLElement>e.target;

        if (trgtElem.classList.contains('e-active-cell') || trgtElem.classList.contains('e-cell')
            || closest(trgtElem, '.e-main-content')) {
            if (this.isEdit) {
                this.endEdit();
            } else {
                this.isNewValueEdit = false;
                this.startEdit();
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
                sheetIdx = this.parent.activeSheetTab;
            }
        }

        if (!this.editCellData.addr) {
            sheet = getSheet(this.parent, sheetIdx - 1);
            if (addr) {
                addr = getRangeFromAddress(addr);
            } else {
                addr = sheet.activeCell;
            }
        }

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
                if (value) { this.refreshEditor(value, false, true, false, false); }
                if (refreshCurPos) { this.setCursorPosition(); }
                if (this.triggerEvent('cellEdit')) {
                    this.cancelEdit(true, false);
                }
            });
        });
    }

    private positionEditor(): void {
        let tdElem: HTMLElement = this.editCellData.element;
        tdElem.classList.add('e-ss-edited');

        let left: number = this.editCellData.position.left + 1;
        let top: number = this.editCellData.position.top + 1;
        let minHeight: number = this.editCellData.element.offsetHeight - 3;
        let minWidth: number = this.editCellData.element.offsetWidth - 3;
        let mainContElement: HTMLElement = <HTMLElement>this.parent.getMainContent();
        let editWidth: number = mainContElement.offsetWidth - left - 28;
        //let editHeight: number = mainContElement.offsetHeight - top - 28;
        let inlineStyles: string = 'display:block;top:' + top + 'px;left:' + left + 'px;' +
            'min-width:' + minWidth + 'px;max-width:' + editWidth + 'px;height:' +
            minHeight + 'px;';
        inlineStyles += tdElem.style.cssText;

        this.editorElem.setAttribute('style', inlineStyles);

        if (tdElem.classList.contains('e-right-align')) {
            this.editorElem.classList.add('e-right-align');
        } else if (tdElem.classList.contains('e-center-align')) {
            this.editorElem.classList.add('e-center-align');
        }
    }

    private updateEditedValue(tdRefresh: boolean = true): void {
        if (this.editCellData.oldValue !== this.editCellData.value) {
            let cellIndex: number[] = getRangeIndexes(this.parent.getActiveSheet().activeCell);
            this.parent.notify(
                workbookEditOperation,
                { action: 'updateCellValue', address: this.editCellData.addr, value: this.editCellData.value });
            let cell: CellModel = getCell(cellIndex[0], cellIndex[1], this.parent.getActiveSheet(), true);
            let eventArgs: RefreshValueArgs = this.getRefreshNodeArgs(cell);
            this.editCellData.value = <string>eventArgs.result;
            if (tdRefresh) { this.parent.refreshNode(this.editCellData.element, eventArgs); }
        }
    }

    private refreshDependentCellValue(rowIdx: number, colIdx: number, sheetIdx: number): void {
        if (rowIdx && colIdx) {
            rowIdx--; colIdx--;
            if ((this.editCellData.rowIndex !== rowIdx || this.editCellData.colIndex !== colIdx)
                && this.parent.activeSheetTab === sheetIdx) {
                let td: HTMLElement = this.parent.getCell(rowIdx, colIdx);
                if (td) {
                    let sheet: SheetModel = getSheet(this.parent, sheetIdx - 1);
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
            formattedText: '', isRightAlign: false, type: NumberFormatType.General
        };
        let args: RefreshValueArgs;
        this.parent.notify(getFormattedCellObject, eventArgs);
        args = {
            isRightAlign: <boolean>eventArgs.isRightAlign,
            result: <string>eventArgs.formattedText,
            type: <string>eventArgs.type,
            value: <string>eventArgs.value,
            curSymbol: <string>eventArgs.curSymbol
        };
        return args;
    }

    public endEdit(refreshFormulaBar: boolean = false): void {
        if (refreshFormulaBar) { this.refreshEditor(this.editCellData.oldValue, false, true, false, false); }
        this.updateEditedValue();
        this.triggerEvent('cellSave');
        this.resetEditState();
        this.focusElement();
    }

    public cancelEdit(refreshFormulaBar: boolean = true, trigEvent: boolean = true): void {
        this.refreshEditor(this.editCellData.oldValue, refreshFormulaBar, false, false, false);
        if (trigEvent) {
            this.triggerEvent('cellSave');
        }
        this.resetEditState();
        this.focusElement();
    }

    private focusElement(): void {
        this.parent.element.focus();
        this.parent.notify(enableToolbar, { enable: true });
    }

    private triggerEvent(eventName: string): boolean {
        let eventArgs: CellEditEventArgs | CellSaveEventArgs = {
            element: this.editCellData.element,
            value: this.editCellData.value,
            oldValue: this.editCellData.oldValue,
            address: this.editCellData.fullAddr
        };
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
            this.editCellData.element.classList.remove('e-ss-edited');
            this.editorElem.textContent = '';
            this.editorElem.removeAttribute('style');
            this.editorElem.classList.remove('e-right-align');
        }
        this.editCellData = {};
        this.parent.isEdit = this.isEdit = false;
        this.isCellEdit = true;
        this.parent.notify(formulaOperation, { action: 'endEdit' });
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
}