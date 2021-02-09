import { Spreadsheet, DialogBeforeOpenEventArgs } from '../index';
import { applyProtect, protectSheet, protectCellFormat, editAlert, enableFormulaInput } from '../common/event';
import { clearCopy, protectSelection, clearUndoRedoCollection, focus } from '../common/index';
import { Dialog } from '../services/dialog';
import { ListView, SelectedCollection} from '@syncfusion/ej2-lists';
import { L10n, EventHandler } from '@syncfusion/ej2-base';
import { locale, updateToggleItem, dialog} from '../common/index';
import { CheckBox } from '@syncfusion/ej2-buttons';
import { SheetModel } from '../../workbook';
import { applyLockCells, CellModel, setCell } from '../../workbook/index';
import { BeforeOpenEventArgs } from '@syncfusion/ej2-popups';
/**
 * The `Protect-sheet` module is used to handle the Protecting functionalities in Spreadsheet.
 */
export class ProtectSheet {
    private parent: Spreadsheet;
    private dialog: Dialog;
    private optionList: ListView;
    /**
     * Constructor for protectSheet module in Spreadsheet.
     * @private
     */
    constructor(parent: Spreadsheet) {
        this.parent = parent;
        this.init();
    }

    private init(): void {
        this.addEventListener();
    }

    /**
     * To destroy the protectSheet module. 
     * @return {void}
     * @hidden
     */
    public destroy(): void {
        this.removeEventListener();
        this.parent = null;
    }

    private addEventListener(): void {
        this.parent.on(applyProtect, this.protect, this);
        this.parent.on(protectSheet, this.protectSheetHandler, this);
        this.parent.on(editAlert, this.editProtectedAlert, this);
        this.parent.on(applyLockCells, this.lockCellsHandler, this);
    }
    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(applyProtect, this.protect);
            this.parent.off(protectSheet, this.protectSheetHandler);
            this.parent.off(editAlert, this.editProtectedAlert);
            this.parent.off(applyLockCells, this.lockCellsHandler);
        }
    }
    private protect(args: { isActive: boolean }): void {
        this.parent.notify(clearCopy, null);
        if (!args.isActive) {
            this.createDialogue();
        } else {
            this.parent.setSheetPropertyOnMute(this.parent.getActiveSheet(), 'isProtected', false);
            this.parent.notify(updateToggleItem, { props: 'Protect' });
            this.parent.notify(protectSheet, { isActive: args.isActive });
            this.parent.notify(protectSelection, null);
        }
    }
    private createDialogue(): void {
        let l10n: L10n = this.parent.serviceLocator.getService(locale);
        let listData: { [key: string]: Object }[] = [
            {text:  l10n.getConstant('SelectCells'), id: '1'},
            {text:  l10n.getConstant('FormatCells'), id: '2'},
            {text:  l10n.getConstant('FormatRows'), id: '3'},
            {text:  l10n.getConstant('FormatColumns'), id: '4'},
            {text:  l10n.getConstant('InsertLinks'), id: '5'}];
        this.optionList = new ListView({
            width: '250px',
            dataSource: listData,
            showCheckBox: true,
            select: this.dialogOpen.bind(this),
        });
        let protectHeaderCntent: HTMLElement = this.parent.createElement('div', {className: 'e-protect-content',
            innerHTML: l10n.getConstant('ProtectAllowUser')});
        this.parent.setSheetPropertyOnMute(this.parent.getActiveSheet(), 'isProtected', false);
        let checkbox: CheckBox = new CheckBox({checked: true, label: l10n.getConstant('ProtectContent'), cssClass: 'e-protect-checkbox'});
        let listViewElement: HTMLElement = this.parent.createElement('div', {className: 'e-protect-option-list',
            id: this.parent.element.id + '_option_list' });
        let headerContent: HTMLElement = this.parent.createElement
            ('div', { className: 'e-header-content', innerHTML: l10n.getConstant('ProtectSheet') });
        let checkBoxElement: HTMLElement = this.parent.createElement
            ('input', { id: this.parent.element.id + '_protect_check', attrs: { type: 'checkbox' }});

        this.dialog = this.parent.serviceLocator.getService('dialog');
        this.dialog.show({
            header: headerContent.outerHTML,
            content: checkBoxElement.outerHTML + protectHeaderCntent.outerHTML +  listViewElement.outerHTML,
            showCloseIcon: true, isModal: true,
            cssClass: 'e-protect-dlg',
            beforeOpen: (args: BeforeOpenEventArgs): void => {
                let dlgArgs: DialogBeforeOpenEventArgs = {
                    dialogName: 'ProtectSheetDialog',
                    element: args.element, target: args.target, cancel: args.cancel
                };
                this.parent.trigger('dialogBeforeOpen', dlgArgs);
                if (dlgArgs.cancel) {
                    args.cancel = true;
                }
                focus(this.parent.element);
            },
            open: (): void => {
                this.okBtnFocus();
            },
            beforeClose: (): void => {
                let checkboxElement: HTMLInputElement = document.getElementById(
                    this.parent.element.id + '_protect_check') as HTMLInputElement;
                EventHandler.remove(checkboxElement, 'focus', this.okBtnFocus);
                EventHandler.remove(checkbox.element, 'click', this.checkBoxClickHandler);
                focus(this.parent.element);
            },
            buttons: [{ click: (this.selectOption.bind(this, this.dialog, this)),
                buttonModel: {  content: l10n.getConstant('Ok'), isPrimary: true}}]
        });
        checkbox.appendTo('#' + this.parent.element.id + '_protect_check');
        this.optionList.appendTo('#' + this.parent.element.id + '_option_list');
        this.optionList.selectMultipleItems([{id: '1'}]);
        EventHandler.add(checkbox.element, 'click', this.checkBoxClickHandler, this);
    };
    private okBtnFocus(): void {
        let checkboxElement: HTMLInputElement = document.getElementById(this.parent.element.id + '_protect_check') as HTMLInputElement;
        checkboxElement.addEventListener('focus', (): void => {
           this.dialog.dialogInstance.element.getElementsByClassName('e-footer-content')[0].querySelector('button').focus();
        });
    }
    private checkBoxClickHandler(): void {
        let ch: HTMLInputElement = document.getElementById(this.parent.element.id + '_protect_check') as HTMLInputElement;
        if (ch.checked === false) {
            this.dialog.dialogInstance.element.getElementsByClassName('e-footer-content')[0].querySelector('button').disabled = true;
        } else {
            this.dialog.dialogInstance.element.getElementsByClassName('e-footer-content')[0].querySelector('button').disabled = false;
            this.dialog.dialogInstance.element.getElementsByClassName('e-footer-content')[0].querySelector('button').focus();
        }
    }
    private dialogOpen(): void {
        this.dialog.dialogInstance.element.getElementsByClassName('e-footer-content')[0].querySelector('button').focus();
    }

    private selectOption(): void {
        let l10n: L10n = this.parent.serviceLocator.getService(locale);
        let selectedItems: SelectedCollection = this.optionList.getSelectedItems() as SelectedCollection;
        this.parent.setSheetPropertyOnMute(this.parent.getActiveSheet(), 'isProtected', true);
        let protectSettings: {[key: string]: boolean} = { selectCells: selectedItems.text.indexOf(l10n.getConstant('SelectCells')) > -1,
             formatCells: selectedItems.text.indexOf(l10n.getConstant('FormatCells')) > -1,
             formatRows: selectedItems.text.indexOf(l10n.getConstant('FormatRows')) > -1,
             formatColumns: selectedItems.text.indexOf(l10n.getConstant('FormatColumns')) > -1,
             insertLink: selectedItems.text.indexOf(l10n.getConstant('InsertLinks')) > -1 };
        this.parent.protectSheet(null, protectSettings);
        this.parent.notify(protectSelection, null);
        this.parent.notify(clearUndoRedoCollection, null);
        this.dialog.hide();
    }
    private protectSheetHandler(args: {[key: string]: boolean}): void {
        let sheet: SheetModel = this.parent.getActiveSheet();
        let id: string = this.parent.element.id;
        let disableHomeBtnId: string[] = [id + '_undo', id + '_redo', id + '_cut', id + '_copy', id + '_paste', id + '_number_format',
            id + '_font_name', id + '_font_size', id + '_bold', id + '_italic', id + '_line-through', id + '_underline',
            id + '_font_color_picker', id + '_fill_color_picker', id + '_borders', id + '_merge_cells', id + '_text_align',
            id + '_vertical_align', id + '_wrap', id + '_sorting', id + '_clear', id + '_conditionalformatting'];
        let enableHomeBtnId: string[] = [id + '_cut', id + '_copy', id + '_number_format', id + '_font_name', id + '_font_size',
            id + '_bold', id + '_italic', id + '_line-through', id + '_underline', id + '_font_color_picker', id + '_fill_color_picker',
            id + '_borders', id + '_text_align', id + '_vertical_align', id + '_wrap', id + '_sorting',
            id + '_clear', id + '_conditionalformatting'];
        let enableFrmlaBtnId: string[] = [id + '_insert_function'];
        let enableInsertBtnId: string[] = [id + '_hyperlink', id + '_', id + '_chart'];
        let imageBtnId: string[] = [id + '_'];
        let findBtnId: string[] = [id + '_find'];
        let dataValidationBtnId: string[]  = [id + '_datavalidation'];
        let chartBtnId: string[] = [id + '_chart'];
        let sheetElement: HTMLElement = document.getElementById(this.parent.element.id + '_sheet_panel');
        if (sheetElement) {
        if ((sheet.isProtected && sheet.protectSettings.selectCells)) {
            {
                sheetElement.classList.remove('e-protected');
            }
        } else {
            sheetElement.classList.add('e-protected');
        }
        if (!sheet.isProtected) {
            sheetElement.classList.remove('e-protected');
        }
      }
        this.parent.dataBind();
        this.parent.notify( protectCellFormat, { disableHomeBtnId: disableHomeBtnId,
            enableHomeBtnId: enableHomeBtnId, enableFrmlaBtnId: enableFrmlaBtnId, enableInsertBtnId: enableInsertBtnId,
            findBtnId: findBtnId, dataValidationBtnId: dataValidationBtnId, imageBtnId: imageBtnId, chartBtnId: chartBtnId });
        this.parent.notify(enableFormulaInput, null);
        this.parent.notify(updateToggleItem, { props: 'Protect' });
    }

    private editProtectedAlert(): void {
        let l10n: L10n = this.parent.serviceLocator.getService(locale);
        this.dialog = this.parent.serviceLocator.getService('dialog');
        this.dialog.show({
            content: l10n.getConstant('EditAlert'),
            isModal: true,
            closeOnEscape: true,
            showCloseIcon: true,
            width: '400px',
            cssClass: 'e-editAlert-dlg',
            beforeOpen: (args: BeforeOpenEventArgs): void => {
                let dlgArgs: DialogBeforeOpenEventArgs = {
                    dialogName: 'EditAlertDialog',
                    element: args.element, target: args.target, cancel: args.cancel
                };
                this.parent.trigger('dialogBeforeOpen', dlgArgs);
                if (dlgArgs.cancel) {
                    args.cancel = true;
                }
                focus(this.parent.element);
            },
            close: (): void => focus(this.parent.element)
        });
    }

    private lockCellsHandler(args: { rowIdx: number, colIdx: number, isLocked?: boolean }): void {
        let sheet: SheetModel = this.parent.getActiveSheet();
        let cellObj: CellModel = { isLocked: args.isLocked ? args.isLocked : false };
        setCell(args.rowIdx, args.colIdx, sheet, cellObj, true);
    }

    /**
     * Get the module name.
     * @returns string
     * 
     * @private
     */
    public getModuleName(): string {
        return 'protectSheet';
    }
}
