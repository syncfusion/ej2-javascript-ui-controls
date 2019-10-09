import { Spreadsheet } from '../base/index';
import { keyDown, cut, paste, copy, clearCopy } from '../common/index';
import { setCellFormat, textDecorationUpdate, FontWeight, getCellIndexes, FontStyle } from '../../workbook/common/index';

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
            if (e.keyCode === 79) {
                (this.parent.element.querySelector('#' + this.parent.element.id + '_fileUpload') as HTMLElement).click();
            } else if (e.keyCode === 83) {
                this.parent.save();
            } else if (e.keyCode === 88) {
                this.parent.notify(cut, null);
            } else if (e.keyCode === 67) {
                this.parent.notify(copy, null);
            } else if (e.keyCode === 86) {
                this.parent.notify(paste, null);
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