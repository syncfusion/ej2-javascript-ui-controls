import { Spreadsheet } from '../base/index';
import { keyDown, cut, paste, copy, clearCopy, performUndoRedo, initiateHyperlink, editHyperlink, fillRange, HideShowEventArgs, renderInsertDlg, toggleFormulaBar } from '../common/index';
import { findDlg, gotoDlg, initiateFilterUI, getFilterRange, FilterInfoArgs } from '../common/index';
import { setCellFormat, textDecorationUpdate, FontWeight, getCellIndexes, FontStyle, ribbonFind, getRangeIndexes, InsertDeleteModelArgs, hideShow, applyNumberFormatting, insertModel } from '../../workbook/common/index';
import { CellModel, SheetModel, getColumn, isLocked as isCellLocked, exportDialog, getFormatFromType } from '../../workbook/index';
import { setCell, getCell } from '../../workbook/base/cell';
import { RowModel } from '../../workbook/base/row-model';
import { isNullOrUndefined, closest, select } from '@syncfusion/ej2-base';
import { ItemModel, Tab } from '@syncfusion/ej2-navigations';
import { RibbonItem } from '../../ribbon';

/**
 * Represents keyboard shortcut support for Spreadsheet.
 */
export class KeyboardShortcut {
    private parent: Spreadsheet;

    /**
     * Constructor for the Spreadsheet Keyboard Shortcut module.
     *
     * @param {Spreadsheet} parent - Specify the spreadsheet.
     * @private
     */
    constructor(parent: Spreadsheet) {
        this.parent = parent;
        this.addEventListener();
    }

    private addEventListener(): void {
        this.parent.on(keyDown, this.keyDownHandler, this);
    }

    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(keyDown, this.keyDownHandler);
        }
    }

    private isTrgtNotInput(e: KeyboardEvent): boolean {
        const trgt: Element = e.target as Element;
        return (!closest(trgt, '.e-filter-popup')
            && !closest(trgt, '.e-find-dlg') && !closest(trgt, '.e-hyperlink-dlg') &&
            !closest(trgt, '.e-sheet-tab') && !closest(trgt, '.e-name-box') && !closest(trgt, '.e-link-dialog'));
    }

    private ribbonShortCuts(e: KeyboardEvent): void {//switch between ribbon tabs
        if (this.parent.showRibbon && e.altKey && !e.ctrlKey && !e.shiftKey) {
            const tabObj: Tab = this.parent.ribbonModule.ribbon.tabObj;
            if (e.keyCode === 72) { /*alt + H =home*/
                e.preventDefault();
                tabObj.select(1);
            }
            else if (e.keyCode === 78) {    /*alt + N =insert */
                tabObj.select(2);
            }
            else if (e.keyCode === 65) {    /*alt + A =data */
                tabObj.select(4);
            }
            else if (e.keyCode === 87) {    /*alt + W =view*/
                tabObj.select(5);
            }
            else if (e.keyCode === 77) {    /*alt + M =formula */
                tabObj.select(3);
            }
            else if (e.keyCode === 70) {    /*alt + F =file */
                e.preventDefault();
                select('#' + this.parent.element.id + '_File', this.parent.element).click();
            }
            else if (e.keyCode === 18) {     /** alt = active tab focus */
                e.preventDefault();
                const activeCell: number[] = getCellIndexes(this.parent.getActiveSheet().activeCell);
                const args: FilterInfoArgs = { sheetIdx: this.parent.activeSheetIndex };
                this.parent.notify(getFilterRange, args);
                if (!(args.hasFilter && args.filterRange && args.filterRange[0] === activeCell[0] && args.filterRange[1] <= activeCell[1] &&
                    args.filterRange[3] >= activeCell[1])) {
                    if (!closest(document.activeElement as Element, '.e-dropdown-btn') && !closest(document.activeElement as Element, '.e-split-btn')) {
                        if (!closest(document.activeElement as Element, '.e-popup-open')) {
                            for (let i: number = 0; i <= this.parent.ribbonModule.ribbon.items.length; i++) {
                                if (i === this.parent.ribbonModule.ribbon.selectedTab) {
                                    const focusEle: HTMLElement = this.parent.element.querySelector('.e-toolbar-items').children[i + 2].children[0] as HTMLElement;
                                    focusEle.setAttribute('tabindex', '0');
                                    focusEle.focus();
                                    return;
                                }
                            }
                        }
                    }
                }
            }
        }

        // tab and shift + tab
        if ((e.keyCode === 9 || (e.shiftKey && e.keyCode === 9)) && closest(document.activeElement, '.e-ribbon') || closest(document.activeElement, '.e-chart')) {
            let id: string;
            const selectedTab: number = this.parent.ribbonModule.ribbon.selectedTab;
            const items: RibbonItem[] = this.parent.ribbonModule.ribbon.items;
            const tabItems: ItemModel[] = e.shiftKey ? items[selectedTab as number].content.slice().reverse() :
                items[selectedTab as number].content;
            let selectedItem: number;
            if (closest(document.activeElement, '.e-tab-header')) {
                selectedItem = 0;
            } else {
                const toolbarItem: Element = closest(document.activeElement, '.e-toolbar-item');
                if (toolbarItem) {
                    const toolbarSibilings: Element[] = [].slice.call(toolbarItem.parentElement.children);
                    selectedItem = (e.shiftKey ? toolbarSibilings.reverse().indexOf(toolbarItem) :
                        toolbarSibilings.indexOf(toolbarItem)) + 1;
                }
            }
            for (let i: number = selectedItem; i <= tabItems.length; i++) {
                if (i === tabItems.length) {
                    i = -1; continue;
                }
                id = (selectedTab === 5 && tabItems[i as number].id === '') ? tabItems[i as number].type.toLowerCase() : tabItems[i as number].id;
                if (id.indexOf('separator') < 0) {
                    if (id.includes('find')) {
                        id = id.replace('find', 'findbtn');
                    } else if (selectedTab !== 5 && id.includes('chart')) {
                        id = id.replace('chart', 'chart-btn');
                    }
                    if (selectedTab === 5) {
                        if (id.includes('chart_type')) {
                            id = id.replace('chart_type', 'chart-type-btn');
                        }
                        else if (id.includes('add_chart_ element_chart')) {
                            id = id.replace('add_chart_ element_chart', '_addchart');
                        }
                    }
                    let element: HTMLElement = this.parent.element.querySelector('#' + id);
                    if (!tabItems[i as number].disabled) {
                        if (element.classList.contains('e-colorpicker-wrapper')) {
                            element = element.querySelector('.e-split-btn');
                        }
                        element.focus();
                        return;
                    }
                }
            }
        }
    }


    private keyDownHandler(e: KeyboardEvent): void {
        const isSelectionNone: boolean = this.parent.selectionSettings.mode === 'None';
        this.ribbonShortCuts(e);
        if ((e.ctrlKey || e.metaKey) && this.isTrgtNotInput(e)) {
            if (!closest(e.target as Element, '.e-find-dlg') && !isSelectionNone) {
                if ([79, 83].indexOf(e.keyCode) > -1) {
                    e.preventDefault();
                } else if (e.keyCode === 65 && !this.parent.isEdit) {
                    e.preventDefault();
                }
            }
            if (e.keyCode === 79 && this.parent.allowOpen) { /*Ctrl + O*/
                select('#' + this.parent.element.id + '_fileUpload', this.parent.element).click();
            } else if (e.keyCode === 83) { /*Ctrl + S*/
                if (this.parent.saveUrl && this.parent.allowSave) { this.parent.notify(exportDialog, null); }
            } else if (e.keyCode === 67 && !isSelectionNone) { /*Ctrl + C*/
                this.parent.notify(copy, { promise: Promise });
            } else if (e.keyCode === 75 && !isSelectionNone) {  /*Ctrl + K*/
                const sheet: SheetModel = this.parent.getActiveSheet(); const indexes: number[] = getCellIndexes(sheet.activeCell);
                const row: RowModel = this.parent.sheets[this.parent.getActiveSheet().id - 1].rows[indexes[0]];
                let cell: CellModel; e.preventDefault();
                if (!isNullOrUndefined(row)) {
                    cell = row.cells[indexes[1]];
                }
                if (isNullOrUndefined(cell)) {
                    setCell(indexes[0], indexes[1], this.parent.getActiveSheet(), cell, false);
                }
                if (cell && cell.hyperlink) {
                    this.parent.notify(editHyperlink, null);
                } else {
                    this.parent.notify(initiateHyperlink, null);
                }
            } else if (e.keyCode === 90 && !isSelectionNone) { /* Ctrl + Z */
                if (!this.parent.isEdit) {
                    e.preventDefault(); this.parent.notify(performUndoRedo, { isUndo: true });
                }
            } else if (e.keyCode === 89 && !isSelectionNone) { /* Ctrl + Y */
                if (!this.parent.isEdit) {
                    e.preventDefault(); this.parent.notify(performUndoRedo, { isUndo: false });
                }
            }
            else if ((e.keyCode === 82 || e.keyCode === 68) && !isSelectionNone) { /* Ctrl + R */ /* Ctrl + D */
                e.preventDefault();
                this.parent.notify(fillRange, { verticalFill: e.keyCode === 68 });
            }
            const actSheet: SheetModel = this.parent.sheets[this.parent.getActiveSheet().id - 1];
            let isLocked: boolean;
            if (actSheet) {
                const actCell: string = actSheet.activeCell;
                const actCellIndex: number[] = getCellIndexes(actCell);
                const cellObj: CellModel = getCell(actCellIndex[0], actCellIndex[1], actSheet);
                isLocked = actSheet.isProtected && isCellLocked(cellObj, getColumn(actSheet, actCellIndex[1]));
            }
            if (e.keyCode === 70 && !isSelectionNone) { /* Ctrl + F */
                e.preventDefault();
                this.parent.notify(ribbonFind, null);
            }
            if ((!isLocked || !actSheet.isProtected || e.keyCode === 86) && e.keyCode !== 70 && !isSelectionNone) {
                if (e.keyCode === 71) { /* Ctrl + G */
                    e.preventDefault(); this.parent.notify(gotoDlg, null);
                }
                else if (e.keyCode === 72) {  /* Ctrl + H */
                    e.preventDefault(); this.parent.notify(findDlg, null);
                } else if (e.keyCode === 88) { /* Ctrl + X */
                    this.parent.notify(cut, { promise: Promise });
                } else if (e.keyCode === 86) {  /* Ctrl + v */
                    this.parent.notify(paste, { isAction: true });
                } else if (e.keyCode === 66) {  /* Ctrl + B */
                    e.preventDefault();
                    let value: FontWeight = this.parent.getCellStyleValue(
                        ['fontWeight'], getCellIndexes(this.parent.getActiveSheet().activeCell)).fontWeight;
                    value = value === 'bold' ? 'normal' : 'bold';
                    this.parent.notify(setCellFormat, { style: { fontWeight: value }, onActionUpdate: true, refreshRibbon: true });
                } else if (e.keyCode === 73) {  /* Ctrl + I */
                    e.preventDefault();
                    let value: FontStyle = this.parent.getCellStyleValue(
                        ['fontStyle'], getCellIndexes(this.parent.getActiveSheet().activeCell)).fontStyle;
                    value = value === 'italic' ? 'normal' : 'italic';
                    this.parent.notify(setCellFormat, { style: { fontStyle: value }, onActionUpdate: true, refreshRibbon: true });
                } else if (e.ctrlKey && e.keyCode === 85 && !e.shiftKey) { /* Ctrl + U */
                    e.preventDefault();
                    this.parent.notify(textDecorationUpdate, { style: { textDecoration: 'underline' }, refreshRibbon: true });
                } else if (e.ctrlKey && e.keyCode === 53 && !e.shiftKey) { /* Ctrl + 5 */
                    e.preventDefault();
                    this.parent.notify(textDecorationUpdate, { style: { textDecoration: 'line-through' }, refreshRibbon: true });
                }
                if (e.shiftKey) {
                    if (e.keyCode === 76) { /* Ctrl + Shift + L */
                        if (!this.parent.isEdit) { e.preventDefault(); this.parent.notify(initiateFilterUI, {}); }
                    }
                }
            }
        }
        if (e.keyCode === 27) { /*ESC*/
            this.parent.notify(clearCopy, null);
        }
        if (((e.ctrlKey || e.metaKey) && e.keyCode === 119)) { /*ctrl + f8*/
            e.preventDefault();
            this.parent.ribbonModule.ribbon.ribbonExpandCollapse();
        }
        //general key actions
        if ((e.ctrlKey || e.metaKey) && !isSelectionNone) {
            const indexes: number[] = getRangeIndexes(this.parent.getActiveSheet().selectedRange);
            if (e.keyCode === 57) {   /*ctrl + 9(row-hide)*/
                e.preventDefault();
                this.parent.notify(hideShow, <HideShowEventArgs>{
                    startIndex: indexes[0], endIndex: indexes[2], hide: e.shiftKey ? false : true, isCol: false, actionUpdate: true
                });
            }
            else if (e.keyCode === 48) {   /*ctrl + 0(col-hide)*/
                this.parent.notify(hideShow, <HideShowEventArgs>{
                    startIndex: indexes[1], endIndex: indexes[3], hide: e.shiftKey ? false : true, isCol: true, actionUpdate: true
                });
            }
            else if (e.keyCode === 55) {    /*ctrl + &(ampersand)*/
                e.preventDefault();
                const border: string = '1px solid #000000';
                this.parent.notify(setCellFormat, { style: { border: border }, onActionUpdate: true, borderType: 'Outer' });
            }
        }

        if (e.shiftKey && e.keyCode === 114 && !isSelectionNone) { /*shift + F3(insert-function dialog)*/
            e.preventDefault();
            this.parent.notify(renderInsertDlg, null);
        }
        if ((e.ctrlKey || e.metaKey) && e.altKey && e.keyCode === 78 && !isSelectionNone) {/*ctrl+alt+N*/
            e.preventDefault();
            this.parent.refresh(true);
        }

        //number-formatting
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && !isSelectionNone) {
            const sheet: SheetModel = this.parent.getActiveSheet();
            const range: string = sheet.selectedRange;
            let format: string;
            if (e.keyCode === 192) { /*ctrl + shift + ~General*/
                format = getFormatFromType('General');
            }
            else if (e.keyCode === 52) { /*ctrl + shift + $(currency)*/
                format = '$#,##0.00;[Red]($#,##0.00)';
            }
            else if (e.keyCode === 53) { /*ctrl + shift + %(percent)*/
                format = '0%';
            }
            else if (e.keyCode === 54) { /*ctrl + shift + ^(scentific)*/
                format = getFormatFromType('Scientific');
            }
            else if (e.keyCode === 51) { /*ctrl + shift + #(Date)*/
                format = 'dd-mmm-yy';
            }
            else if (e.keyCode === 50) { /*ctrl + shift + @(Time)*/
                format = 'h:mm AM/PM';
            }
            else if (e.keyCode === 49) { /*ctrl + shift + !(Number)*/
                format = '#,###.00';
            }
            else if (e.keyCode === 85) { /*ctrl + shift + U*/
                e.preventDefault();
                this.parent.notify(toggleFormulaBar, null);
            }
            else if (e.keyCode === 55) {   /*ctrl + shift + &(ampersand)*/
                e.preventDefault();
                this.parent.notify(setCellFormat, { style: { border: '' }, onActionUpdate: true });
            }
            if (format) {
                this.parent.notify(applyNumberFormatting, { format: format, range: range });
            }
        }

        if (e.shiftKey && e.keyCode === 122) { // shift+f11
            this.parent.notify(insertModel, <InsertDeleteModelArgs>{
                model: this.parent, start: this.parent.activeSheetIndex + 1, end:
                    this.parent.activeSheetIndex + 1, modelType: 'Sheet', isAction: true, activeSheetIndex: this.parent.activeSheetIndex + 1
            });
        }
        if (e.shiftKey && e.altKey && e.keyCode === 75) { /* Shift + Alt + K*/
            (this.parent.element.querySelector('.e-sheets-list') as HTMLElement).click();
        }
    }

    private getModuleName(): string {
        return 'keyboardShortcut';
    }
    public destroy(): void {
        this.removeEventListener();
        this.parent = null;
    }
}
