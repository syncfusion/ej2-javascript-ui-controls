import { Spreadsheet } from '../base/index';
import { keyDown, cut, paste, copy, clearCopy, performUndoRedo, initiateHyperlink, editHyperlink } from '../common/index';
import { setCellFormat, textDecorationUpdate, FontWeight, getCellIndexes, FontStyle } from '../../workbook/common/index';
import { CellModel, SheetModel } from '../../workbook';

/**
 * Represents keyboard shortcut support for Spreadsheet.
 */
export class KeyboardShortcut {
    private parent: Spreadsheet;

    /**
     * Constructor for the Spreadsheet Keyboard Shortcut module.
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
        if (e.ctrlKey) {
            if ([79, 83, 65].indexOf(e.keyCode) > -1) {
                e.preventDefault();
            }
            if (e.keyCode === 75) {
                let sheet: SheetModel = this.parent.getActiveSheet();
                let idx: number[] = getCellIndexes(sheet.activeCell);
                let cell: CellModel = sheet.rows[idx[0]].cells[idx[1]];
                e.preventDefault();
                if (cell && cell.hyperlink) {
                    this.parent.notify(editHyperlink, null);
                } else {
                    this.parent.notify(initiateHyperlink, null);
                }
            }
            if (e.keyCode === 79) {
                (this.parent.element.querySelector('#' + this.parent.element.id + '_fileUpload') as HTMLElement).click();
            } else if (e.keyCode === 83) {
                if (this.parent.saveUrl && this.parent.allowSave) { this.parent.save(); }
            } else if (e.keyCode === 88) {
                this.parent.notify(cut, { promise: Promise });
            } else if (e.keyCode === 67) {
                this.parent.notify(copy, { promise: Promise });
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
            } else if (e.keyCode === 90) { /* Ctrl + Z */
                if (!this.parent.isEdit) {
                    e.preventDefault();
                    this.parent.notify(performUndoRedo, { isUndo: true });
                }
            } else if (e.keyCode === 89) { /* Ctrl + Y */
                if (!this.parent.isEdit) {
                    e.preventDefault();
                    this.parent.notify(performUndoRedo, { isUndo: false });
                }
            }
            if (e.shiftKey) {
                if (e.keyCode === 76) { /* Ctrl + Shift + L */
                    if (!this.parent.isEdit) {
                        e.preventDefault();
                        this.parent.applyFilter();
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