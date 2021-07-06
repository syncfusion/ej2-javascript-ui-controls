import { Spreadsheet } from '../base/index';
import { keyDown, cut, paste, copy, clearCopy, performUndoRedo, initiateHyperlink, editHyperlink } from '../common/index';
import { findDlg, gotoDlg } from '../common/index';
import { setCellFormat, textDecorationUpdate, FontWeight, getCellIndexes, FontStyle, ribbonFind } from '../../workbook/common/index';
import { CellModel, SheetModel, getColumn, isLocked as isCellLocked } from '../../workbook/index';
import { setCell, getCell } from '../../workbook/base/cell';
import { RowModel } from '../../workbook/base/row-model';
import { isNullOrUndefined, closest, select } from '@syncfusion/ej2-base';

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

    private keyDownHandler(e: KeyboardEvent): void {
        if (e.ctrlKey || e.metaKey) {
            if (!closest(e.target as Element, '.e-find-dlg')) {
                if ([79, 83].indexOf(e.keyCode) > -1) {
                    e.preventDefault();
                } else if (e.keyCode === 65 && !this.parent.isEdit) {
                    e.preventDefault();
                }
            }
            if (e.keyCode === 79) {
                select('#' + this.parent.element.id + '_fileUpload', this.parent.element).click();
            } else if (e.keyCode === 83) {
                if (this.parent.saveUrl && this.parent.allowSave) { this.parent.save(); }
            } else if (e.keyCode === 67) {
                this.parent.notify(copy, { promise: Promise });
            } else if (e.keyCode === 75) {
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
            } else if (e.keyCode === 90) { /* Ctrl + Z */
                if (!this.parent.isEdit) {
                    e.preventDefault(); this.parent.notify(performUndoRedo, { isUndo: true });
                }
            } else if (e.keyCode === 89) { /* Ctrl + Y */
                if (!this.parent.isEdit) {
                    e.preventDefault(); this.parent.notify(performUndoRedo, { isUndo: false });
                }
            }
            const actSheet: SheetModel = this.parent.sheets[this.parent.getActiveSheet().id - 1];
            let isLocked: boolean;
            if (actSheet) {
                const actCell: string = actSheet.activeCell;
                const actCellIndex: number[] = getCellIndexes(actCell);
                const cellObj: CellModel = getCell(actCellIndex[0], actCellIndex[1], actSheet);
                isLocked = actSheet.isProtected && isCellLocked(cellObj, getColumn(actSheet, actCellIndex[1]));
            }
            if (e.keyCode === 70) {
                e.preventDefault();
                this.parent.notify(ribbonFind, null);
            }
            if ((!isLocked || !actSheet.isProtected || e.keyCode === 86) && e.keyCode !== 70) {
                if (e.keyCode === 71) {
                    e.preventDefault(); this.parent.notify(gotoDlg, null);
                } else if (e.keyCode === 72) {
                    e.preventDefault(); this.parent.notify(findDlg, null);
                } else if (e.keyCode === 88) {
                    this.parent.notify(cut, { promise: Promise });
                } else if (e.keyCode === 86) {
                    this.parent.notify(paste, { isAction: true });
                } else if (e.keyCode === 66) {
                    e.preventDefault();
                    let value: FontWeight = this.parent.getCellStyleValue(
                        ['fontWeight'], getCellIndexes(this.parent.getActiveSheet().activeCell)).fontWeight;
                    value = value === 'bold' ? 'normal' : 'bold';
                    this.parent.notify(setCellFormat, { style: { fontWeight: value }, onActionUpdate: true, refreshRibbon: true });
                } else if (e.keyCode === 73) {
                    e.preventDefault();
                    let value: FontStyle = this.parent.getCellStyleValue(
                        ['fontStyle'], getCellIndexes(this.parent.getActiveSheet().activeCell)).fontStyle;
                    value = value === 'italic' ? 'normal' : 'italic';
                    this.parent.notify(setCellFormat, { style: { fontStyle: value }, onActionUpdate: true, refreshRibbon: true });
                } else if (e.keyCode === 85) {
                    e.preventDefault();
                    this.parent.notify(textDecorationUpdate, { style: { textDecoration: 'underline' }, refreshRibbon: true });
                } else if (e.keyCode === 53) {
                    e.preventDefault();
                    this.parent.notify(textDecorationUpdate, { style: { textDecoration: 'line-through' }, refreshRibbon: true });
                }
                if (e.shiftKey) {
                    if (e.keyCode === 76) { /* Ctrl + Shift + L */
                        if (!this.parent.isEdit) { e.preventDefault(); this.parent.applyFilter(); }
                    }
                }
            }
        }
        if (e.keyCode === 27) {
            this.parent.notify(clearCopy, null);
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
