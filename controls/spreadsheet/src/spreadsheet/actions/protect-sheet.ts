import { Spreadsheet, DialogBeforeOpenEventArgs, getUpdateUsingRaf } from '../index';
import { applyProtect, protectSheet, protectCellFormat, editAlert, enableFormulaInput, protectWorkbook, keyUp, unProtectSheetPassword } from '../common/event';
import { unProtectWorkbook, getPassWord, importProtectWorkbook, UnProtectWorksheet, hideAutoFillElement } from '../common/event';
import { clearCopy, protectSelection, clearUndoRedoCollection, focus } from '../common/index';
import { Dialog } from '../services/dialog';
import { ListView, SelectedCollection } from '@syncfusion/ej2-lists';
import { L10n, EventHandler, closest, getComponent } from '@syncfusion/ej2-base';
import { locale, updateToggleItem, dialog } from '../common/index';
import { CheckBox } from '@syncfusion/ej2-buttons';
import { SheetModel } from '../../workbook';
import { applyLockCells, CellModel, setCell } from '../../workbook/index';
import { BeforeOpenEventArgs } from '@syncfusion/ej2-popups';
import { OpenOptions } from '../common/interface';
/**
 * The `Protect-sheet` module is used to handle the Protecting functionalities in Spreadsheet.
 */
export class ProtectSheet {
    private parent: Spreadsheet;
    private dialog: Dialog;
    private optionList: ListView;
    private password: string = '';
    /**
     * Constructor for protectSheet module in Spreadsheet.
     *
     * @param {Spreadsheet} parent - Specify the spreadsheet.
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
     *
     * @returns {void} - To destroy the protectSheet module.
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
        this.parent.on(protectWorkbook, this.protectWorkbook, this);
        this.parent.on(keyUp, this.KeyUpHandler, this);
        this.parent.on(unProtectWorkbook, this.unProtectWorkbook, this);
        this.parent.on(UnProtectWorksheet, this.unProtectsheet, this);
        this.parent.on(unProtectSheetPassword, this.unProtectSheetPassword, this);
        this.parent.on(getPassWord, this.getPassWord, this);
        this.parent.on(importProtectWorkbook, this.importProtectWorkbook, this);
    }
    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(applyProtect, this.protect);
            this.parent.off(protectSheet, this.protectSheetHandler);
            this.parent.off(editAlert, this.editProtectedAlert);
            this.parent.off(applyLockCells, this.lockCellsHandler);
            this.parent.off(protectWorkbook, this.protectWorkbook);
            this.parent.off(keyUp, this.KeyUpHandler);
            this.parent.off(unProtectWorkbook, this.unProtectWorkbook);
            this.parent.off(UnProtectWorksheet, this.unProtectsheet);
            this.parent.off(unProtectSheetPassword, this.unProtectSheetPassword);
            this.parent.off(getPassWord, this.getPassWord);
            this.parent.off(importProtectWorkbook, this.importProtectWorkbook);
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
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        const listData: { [key: string]: Object }[] = [
            { text: l10n.getConstant('SelectCells'), id: '1' },
            { text: l10n.getConstant('FormatCells'), id: '2' },
            { text: l10n.getConstant('FormatRows'), id: '3' },
            { text: l10n.getConstant('FormatColumns'), id: '4' },
            { text: l10n.getConstant('InsertLinks'), id: '5' }];
        this.optionList = new ListView({
            width: '250px',
            dataSource: listData,
            showCheckBox: true,
            select: this.dialogOpen.bind(this)
        });

        const dialogElem: HTMLElement = this.parent.createElement('div', { className: 'e-sheet-password-dialog' });
        const pwdCont: HTMLElement = this.parent.createElement('div', { className: 'e-sheet-password-content' });
        const textH: HTMLElement = this.parent.createElement('div', { className: 'e-header', innerHTML: l10n.getConstant('SheetPassword') });
        const pwdInput: HTMLElement = this.parent.createElement('input', { className: 'e-input e-text', attrs: { 'type': 'password' } });
        pwdInput.setAttribute('placeholder', l10n.getConstant('EnterThePassword'));
        pwdCont.appendChild(pwdInput);
        pwdCont.insertBefore(textH, pwdInput);
        dialogElem.appendChild(pwdCont);
        const protectHeaderCntent: HTMLElement = this.parent.createElement('div', {
            className: 'e-protect-content',
            innerHTML: l10n.getConstant('ProtectAllowUser')
        });
        this.parent.setSheetPropertyOnMute(this.parent.getActiveSheet(), 'isProtected', false);
        const checkbox: CheckBox = new CheckBox({ checked: true, label: l10n.getConstant('ProtectContent'), cssClass: 'e-protect-checkbox' });
        const listViewElement: HTMLElement = this.parent.createElement('div', {
            className: 'e-protect-option-list',
            id: this.parent.element.id + '_option_list'
        });
        const headerContent: HTMLElement = this.parent.createElement(
            'div', { className: 'e-header-content', innerHTML: l10n.getConstant('ProtectSheet') });
        const checkBoxElement: HTMLElement = this.parent.createElement(
            'input', { id: this.parent.element.id + '_protect_check', attrs: { type: 'checkbox' } });

        this.dialog = this.parent.serviceLocator.getService('dialog');
        this.dialog.show({
            header: headerContent.outerHTML,
            content: dialogElem.outerHTML + checkBoxElement.outerHTML + protectHeaderCntent.outerHTML + listViewElement.outerHTML,
            showCloseIcon: true, isModal: true,
            cssClass: 'e-protect-dlg',
            
            beforeOpen: (args: BeforeOpenEventArgs): void => {
                const dlgArgs: DialogBeforeOpenEventArgs = {
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
                const checkboxElement: HTMLInputElement = document.getElementById(
                    this.parent.element.id + '_protect_check') as HTMLInputElement;
                EventHandler.remove(checkboxElement, 'focus', this.okBtnFocus);
                EventHandler.remove(checkbox.element, 'click', this.checkBoxClickHandler);
                focus(this.parent.element);
            },
            buttons: [{
                click: (this.selectOption.bind(this, this.dialog, this)),
                buttonModel: { content: l10n.getConstant('Ok'), isPrimary: true }
            },
            {
                click: (this.cancelClick.bind(this, this.dialog, this)),
                buttonModel: { content: l10n.getConstant('Cancel')}
            }]
        }, false);
        checkbox.appendTo('#' + this.parent.element.id + '_protect_check');
        this.optionList.appendTo('#' + this.parent.element.id + '_option_list');
        this.optionList.selectMultipleItems([{ id: '1' }]);
        EventHandler.add(checkbox.element, 'click', this.checkBoxClickHandler, this);
    }
    private okBtnFocus(): void {
        const checkboxElement: HTMLInputElement = document.getElementById(this.parent.element.id + '_protect_check') as HTMLInputElement;
        checkboxElement.addEventListener('focus', (): void => {
            this.dialog.dialogInstance.element.getElementsByClassName('e-footer-content')[0].querySelector('button').focus();
        });
    }
    private cancelClick(): void {
        const sheetDlgPopup: HTMLElement = document.querySelector('.e-protect-dlg');
        const sheetDlg: Dialog = getComponent(sheetDlgPopup, 'dialog');
        sheetDlg.destroy();
    }
    private checkBoxClickHandler(): void {
        const ch: HTMLInputElement = document.getElementById(this.parent.element.id + '_protect_check') as HTMLInputElement;
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
        let actSheet: SheetModel = this.parent.getActiveSheet();
        const pwd: HTMLElement = this.parent.element.querySelector('.e-sheet-password-dialog').
            getElementsByClassName('e-sheet-password-content')[0].querySelector('.e-input');
        if ((pwd as CellModel).value.length == 0) {
            this.parent.setSheetPropertyOnMute(actSheet, 'isProtected', true);
            this.parent.setSheetPropertyOnMute(actSheet, 'password', (pwd as CellModel).value);
            this.updateProtectSheet((pwd as CellModel).value);
            this.dialog.hide();
            if (!actSheet.protectSettings.selectCells) {
                this.parent.notify(hideAutoFillElement, null);
            }
        } else {
            this.reEnterSheetPassword();
        }
    }

    private selectSheetPassword(): void {
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        let actSheet: SheetModel = this.parent.getActiveSheet();
        const pwd: HTMLElement = this.parent.element.querySelector('.e-sheet-password-dialog').
            getElementsByClassName('e-sheet-password-content')[0].querySelector('.e-input');
        const cnfrmPwd: HTMLElement = this.parent.element.querySelector('.e-reenterpwd-dialog').
            getElementsByClassName('e-reenterpwd-content')[0].querySelector('.e-input');
        const pwdSpan: HTMLElement = this.parent.createElement('span', {
            className: 'e-reenterpwd-alert-span'
        });
        if ((pwd as CellModel).value === (cnfrmPwd as CellModel).value) {
            this.parent.setSheetPropertyOnMute(actSheet, 'isProtected', true);
            this.parent.setSheetPropertyOnMute(actSheet, 'password', (pwd as CellModel).value);
            this.updateProtectSheet((pwd as CellModel).value);
            this.dialog.hide();
            const sheetDlgPopup: HTMLElement = document.querySelector('.e-protect-dlg');
            const sheetDlg: Dialog = getComponent(sheetDlgPopup, 'dialog');
            sheetDlg.destroy();
            if (!actSheet.protectSettings.selectCells) {
                this.parent.notify(hideAutoFillElement, null);
            }
        }
        else {
            if ((pwd as CellModel).value === '') {
                pwdSpan.textContent = l10n.getConstant('PasswordAlertMsg');
            } else if ((cnfrmPwd as CellModel).value === '') {
                pwdSpan.textContent = l10n.getConstant('ConfirmPasswordAlertMsg');
            } else if ((pwd as CellModel).value !== (cnfrmPwd as CellModel).value) {
                pwdSpan.textContent = l10n.getConstant('PasswordAlert');
            }
            (this.parent.element.querySelector('.e-reenterpwd-dlg').querySelector('.e-reenterpwd-dialog')).appendChild(pwdSpan);
        }
    }

    private updateProtectSheet(password: string): void {
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        const selectedItems: SelectedCollection = this.optionList.getSelectedItems() as SelectedCollection;
        const protectSettings: { [key: string]: boolean | string } = {
            selectCells: selectedItems.text.indexOf(l10n.getConstant('SelectCells')) > -1,
            formatCells: selectedItems.text.indexOf(l10n.getConstant('FormatCells')) > -1,
            formatRows: selectedItems.text.indexOf(l10n.getConstant('FormatRows')) > -1,
            formatColumns: selectedItems.text.indexOf(l10n.getConstant('FormatColumns')) > -1,
            insertLink: selectedItems.text.indexOf(l10n.getConstant('InsertLinks')) > -1,
        };
        this.parent.protectSheet(null, protectSettings, password);
        this.parent.notify(protectSelection, null);
        this.parent.notify(clearUndoRedoCollection, null);
    }

    private protectSheetHandler(): void {
        const sheet: SheetModel = this.parent.getActiveSheet();
        const id: string = this.parent.element.id;
        const disableHomeBtnId: string[] = [id + '_undo', id + '_redo', id + '_cut', id + '_copy', id + '_paste', id + '_number_format',
        id + '_font_name', id + '_font_size', id + '_bold', id + '_italic', id + '_line-through', id + '_underline',
        id + '_font_color_picker', id + '_fill_color_picker', id + '_borders', id + '_merge_cells', id + '_text_align',
        id + '_vertical_align', id + '_wrap', id + '_sorting', id + '_clear', id + '_conditionalformatting'];
        const enableHomeBtnId: string[] = [id + '_cut', id + '_copy', id + '_number_format', id + '_font_name', id + '_font_size',
        id + '_bold', id + '_italic', id + '_line-through', id + '_underline', id + '_font_color_picker', id + '_fill_color_picker',
        id + '_borders', id + '_text_align', id + '_vertical_align', id + '_wrap', id + '_sorting',
        id + '_clear', id + '_conditionalformatting'];
        const enableFrmlaBtnId: string[] = [id + '_insert_function'];
        const enableInsertBtnId: string[] = [id + '_hyperlink', id + '_', id + '_chart'];
        const imageBtnId: string[] = [id + '_'];
        const findBtnId: string[] = [id + '_find'];
        const dataValidationBtnId: string[] = [id + '_datavalidation'];
        const chartBtnId: string[] = [id + '_chart'];
        const sheetElement: HTMLElement = document.getElementById(this.parent.element.id + '_sheet_panel');
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
        this.parent.notify(protectCellFormat, {
            disableHomeBtnId: disableHomeBtnId,
            enableHomeBtnId: enableHomeBtnId, enableFrmlaBtnId: enableFrmlaBtnId, enableInsertBtnId: enableInsertBtnId,
            findBtnId: findBtnId, dataValidationBtnId: dataValidationBtnId, imageBtnId: imageBtnId, chartBtnId: chartBtnId
        });
        this.parent.notify(enableFormulaInput, null);
        if (sheet.isProtected) {
            this.parent.notify(updateToggleItem, { props: 'Protect' });
        }
    }

    private editProtectedAlert(): void {
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        this.dialog = this.parent.serviceLocator.getService('dialog');
        this.dialog.show({
            content: l10n.getConstant('EditAlert'),
            isModal: true,
            closeOnEscape: true,
            showCloseIcon: true,
            width: '400px',
            cssClass: 'e-editAlert-dlg',
            beforeOpen: (args: BeforeOpenEventArgs): void => {
                const dlgArgs: DialogBeforeOpenEventArgs = {
                    dialogName: 'EditAlertDialog',
                    element: args.element, target: args.target, cancel: args.cancel
                };
                this.parent.trigger('dialogBeforeOpen', dlgArgs);
                if (dlgArgs.cancel) {
                    args.cancel = true;
                    getUpdateUsingRaf((): void => this.dialog.destroyDialog());
                }
                focus(this.parent.element);
            },
            close: (): void => focus(this.parent.element)
        });
    }

    private lockCellsHandler(args: { rowIdx: number, colIdx: number, isLocked?: boolean }): void {
        const sheet: SheetModel = this.parent.getActiveSheet();
        const cellObj: CellModel = { isLocked: args.isLocked ? args.isLocked : false };
        setCell(args.rowIdx, args.colIdx, sheet, cellObj, true);
    }

    private protectWorkbook(): void {
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        const dialogInst: Dialog = (this.parent.serviceLocator.getService(dialog) as Dialog);
        dialogInst.show({
            width: 323, isModal: true, showCloseIcon: true, cssClass: 'e-protectworkbook-dlg',
            header: l10n.getConstant('ProtectWorkbook'),
            beforeOpen: (args: BeforeOpenEventArgs): void => {
                const dlgArgs: DialogBeforeOpenEventArgs = {
                    dialogName: 'ProtectWorkbook',
                    element: args.element, target: args.target, cancel: args.cancel
                };
                this.parent.trigger('dialogBeforeOpen', dlgArgs);
                if (dlgArgs.cancel) {
                    args.cancel = true;
                }
                dialogInst.dialogInstance.content = this.passwordProtectContent(); dialogInst.dialogInstance.dataBind();
                this.parent.element.focus();
            },
            buttons: [{
                buttonModel: {
                    content: l10n.getConstant('Ok'), isPrimary: true
                },
                click: (): void => {
                    this.alertMessage();
                    this.dlgClickHandler(dialogInst);
                }
            }]
        });
    }

    private passwordProtectContent(): HTMLElement {
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        const dialogElem: HTMLElement = this.parent.createElement('div', { className: 'e-password-dialog' });
        const pwdCont: HTMLElement = this.parent.createElement('div', { className: 'e-password-content' });
        const cnfrmPwdCont: HTMLElement = this.parent.createElement('div', { className: 'e-password-content' });
        const textH: HTMLElement = this.parent.createElement('div', { className: 'e-header', innerHTML: l10n.getConstant('Password') });
        const urlH: HTMLElement = this.parent.createElement('div', { className: 'e-header', innerHTML: l10n.getConstant('ConfirmPassword') });
        const pwdInput: HTMLElement = this.parent.createElement('input', { className: 'e-input e-text', attrs: { 'type': 'password' } });
        const cnfrmPwdInput: HTMLElement = this.parent.createElement('input', { className: 'e-input e-text', attrs: { 'type': 'password' } });
        pwdInput.setAttribute('placeholder', l10n.getConstant('EnterThePassword'));
        cnfrmPwdInput.setAttribute('placeholder', l10n.getConstant('EnterTheConfirmPassword'));
        pwdCont.appendChild(pwdInput);
        pwdCont.insertBefore(textH, pwdInput);
        cnfrmPwdCont.appendChild(cnfrmPwdInput);
        cnfrmPwdCont.insertBefore(urlH, cnfrmPwdInput);
        dialogElem.appendChild(cnfrmPwdCont);
        dialogElem.insertBefore(pwdCont, cnfrmPwdCont);
        return dialogElem;
    }

    private KeyUpHandler(e: MouseEvent): void {
        const trgt: Element = e.target as Element;
        if (trgt.classList.contains('e-text') && closest(trgt, '.e-password-content')) {
            if (closest(trgt, '.e-password-dialog') && closest(trgt, '.e-password-dialog').
                getElementsByClassName('e-password-content')[1] === trgt.parentElement) {
                const dlgEle: Element = closest(trgt, '.e-protectworkbook-dlg');
                const ftrEle: HTMLElement = dlgEle.getElementsByClassName('e-footer-content')[0] as HTMLElement;
                const okBtn: HTMLElement = ftrEle.firstChild as HTMLElement;
                if ((trgt as CellModel).value !== '') {
                    okBtn.removeAttribute('disabled');
                }
                else {
                    okBtn.setAttribute('disabled', 'true');
                }
            }
        }
        if (trgt.classList.contains('e-text') && closest(trgt, '.e-unprotectpwd-content')) {
            if (closest(trgt, '.e-unprotectpwd-dialog') && closest(trgt, '.e-unprotectpwd-dialog').
                getElementsByClassName('e-unprotectpwd-content')[0] === trgt.parentElement) {
                const dlgElement: Element = closest(trgt, '.e-unprotectworkbook-dlg');
                const ftrElement: HTMLElement = dlgElement.getElementsByClassName('e-footer-content')[0] as HTMLElement;
                const okButton: HTMLElement = ftrElement.firstChild as HTMLElement;
                if ((trgt as CellModel).value !== '') {
                    okButton.removeAttribute('disabled');
                }
                else {
                    okButton.setAttribute('disabled', 'true');
                }
            }
        }
        if (trgt.classList.contains('e-text') && closest(trgt, '.e-reenterpwd-content')) {
            if (closest(trgt, '.e-reenterpwd-dialog') && closest(trgt, '.e-reenterpwd-dialog').
                getElementsByClassName('e-reenterpwd-content')[0] === trgt.parentElement) {
                const dlgCnt: Element = closest(trgt, '.e-reenterpwd-dlg');
                const ftrCnt: HTMLElement = dlgCnt.getElementsByClassName('e-footer-content')[0] as HTMLElement;
                const okBtnElem: HTMLElement = ftrCnt.firstChild as HTMLElement;
                if ((trgt as CellModel).value !== '') {
                    okBtnElem.removeAttribute('disabled');
                }
                else {
                    okBtnElem.setAttribute('disabled', 'true');
                }
            }
        }
        if (trgt.classList.contains('e-text') && closest(trgt, '.e-unprotectsheetpwd-content')) {
            if (closest(trgt, '.e-unprotectsheetpwd-dialog') && closest(trgt, '.e-unprotectsheetpwd-dialog').
                getElementsByClassName('e-unprotectsheetpwd-content')[0] === trgt.parentElement) {
                const dlg: Element = closest(trgt, '.e-unprotectworksheet-dlg');
                const ftr: HTMLElement = dlg.getElementsByClassName('e-footer-content')[0] as HTMLElement;
                const btn: HTMLElement = ftr.firstChild as HTMLElement;
                if ((trgt as CellModel).value !== '') {
                    btn.removeAttribute('disabled');
                }
                else {
                    btn.setAttribute('disabled', 'true');
                }
            }
        }
        if (trgt.classList.contains('e-text') && closest(trgt, '.e-importprotectpwd-content')) {
            if (closest(trgt, '.e-importprotectpwd-dialog') && closest(trgt, '.e-importprotectpwd-dialog').
                getElementsByClassName('e-importprotectpwd-content')[0] === trgt.parentElement) {
                const dlgElem: Element = closest(trgt, '.e-importprotectworkbook-dlg');
                const ftrElem: HTMLElement = dlgElem.getElementsByClassName('e-footer-content')[0] as HTMLElement;
                const btn: HTMLElement = ftrElem.firstChild as HTMLElement;
                if ((trgt as CellModel).value !== '') {
                    btn.removeAttribute('disabled');
                }
                else {
                    btn.setAttribute('disabled', 'true');
                }
            }
        }
    }

    private alertMessage(): void {
        const spanElem: Element = this.parent.element.querySelector('.e-pwd-alert-span');
        const unpotectSpanElem: Element = this.parent.element.querySelector('.e-unprotectpwd-alert-span');
        const importpotectSpanElem: Element = this.parent.element.querySelector('.e-importprotectpwd-alert-span');
        const protectSheetSpanElem: Element = this.parent.element.querySelector('.e-reenterpwd-alert-span');
        const unProtectSheetSpanElem: Element = this.parent.element.querySelector('.e-unprotectsheetpwd-alert-span');
        if (spanElem) {
            spanElem.remove();
        }
        if (unpotectSpanElem) {
            unpotectSpanElem.remove();
        }
        if (importpotectSpanElem) {
            importpotectSpanElem.remove();
        }
        if (protectSheetSpanElem) {
            protectSheetSpanElem.remove();
        }
        if (unProtectSheetSpanElem) {
            unProtectSheetSpanElem.remove();
        }
    }

    private dlgClickHandler(dialogInst: Dialog): void {
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        const pwdVal: HTMLElement = this.parent.element.querySelector('.e-password-dialog').
            getElementsByClassName('e-password-content')[0].querySelector('.e-input');
        const cnfrmPwd: HTMLElement = this.parent.element.querySelector('.e-password-dialog').
            getElementsByClassName('e-password-content')[1].querySelector('.e-input');
        const pwdSpan: HTMLElement = this.parent.createElement('span', {
            className: 'e-pwd-alert-span'
        });
        if ((pwdVal as CellModel).value === (cnfrmPwd as CellModel).value) {
            this.parent.password = (pwdVal as CellModel).value;
            this.parent.isProtected = true;
            dialogInst.hide();
            if (this.parent.showSheetTabs) {
                this.parent.element.querySelector('.e-add-sheet-tab').setAttribute('disabled', 'true');
                this.parent.element.querySelector('.e-add-sheet-tab').classList.add('e-disabled');
            }
            this.parent.notify(updateToggleItem, { props: 'Protectworkbook' });
        } else if ((pwdVal as CellModel).value === '') {
            pwdSpan.textContent = l10n.getConstant('PasswordAlertMsg');
        } else if ((cnfrmPwd as CellModel).value === '') {
            pwdSpan.textContent = l10n.getConstant('ConfirmPasswordAlertMsg');
        } else if ((pwdVal as CellModel).value !== (cnfrmPwd as CellModel).value) {
            pwdSpan.textContent = l10n.getConstant('PasswordAlert');
        }
        (this.parent.element.querySelector('.e-protectworkbook-dlg').querySelector('.e-dlg-content')).appendChild(pwdSpan);
    }

    private unProtectWorkbook(): void {
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        const dialogInst: Dialog = (this.parent.serviceLocator.getService(dialog) as Dialog);
        dialogInst.show({
            width: 323, isModal: true, showCloseIcon: true, cssClass: 'e-unprotectworkbook-dlg',
            header: l10n.getConstant('UnProtectWorkbook'),
            beforeOpen: (args: BeforeOpenEventArgs): void => {
                const dlgArgs: DialogBeforeOpenEventArgs = {
                    dialogName: 'UnProtectWorkbook',
                    element: args.element, target: args.target, cancel: args.cancel
                };
                this.parent.trigger('dialogBeforeOpen', dlgArgs);
                if (dlgArgs.cancel) {
                    args.cancel = true;
                }
                dialogInst.dialogInstance.content = this.unProtectPasswordContent(); dialogInst.dialogInstance.dataBind();
                this.parent.element.focus();
            },
            buttons: [{
                buttonModel: {
                    content: l10n.getConstant('Ok'), isPrimary: true, disabled: true
                },
                click: (): void => {
                    this.alertMessage();
                    this.unprotectdlgOkClick(dialogInst);
                }
            }]
        });
    }

    private unProtectsheet(args :{isImportedSheet?:boolean}): void {
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        const dialogInst: Dialog = (this.parent.serviceLocator.getService(dialog) as Dialog);
        dialogInst.show({
            width: 323, isModal: true, showCloseIcon: true, cssClass: 'e-unprotectworksheet-dlg',
            header: l10n.getConstant('UnProtectWorksheet'),
            beforeOpen: (args: BeforeOpenEventArgs): void => {
                const dlgArgs: DialogBeforeOpenEventArgs = {
                    dialogName: 'UnProtectSheet',
                    element: args.element, target: args.target, cancel: args.cancel
                };
                this.parent.trigger('dialogBeforeOpen', dlgArgs);
                if (dlgArgs.cancel) {
                    args.cancel = true;
                }
                dialogInst.dialogInstance.content = this.unProtectSheetPasswordContent(); dialogInst.dialogInstance.dataBind();
                this.parent.element.focus();
            },
            buttons: [{
                buttonModel: {
                    content: l10n.getConstant('Ok'), isPrimary: true, disabled: this.parent.openModule.isImportedFile &&
                        (this.parent.openModule.unProtectSheetIdx.indexOf(this.parent.activeSheetIndex) === -1) ? false : true
                },
                click: (): void => {
                    this.alertMessage();
                    this.unprotectSheetdlgOkClick(dialogInst, args && args.isImportedSheet);
                }
            }]
        });
    }

    private reEnterSheetPassword(): void {
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        const dialogInst: Dialog = (this.parent.serviceLocator.getService(dialog) as Dialog);
        dialogInst.show({
            width: 323, isModal: true, showCloseIcon: true, cssClass: 'e-reenterpwd-dlg',
            header: l10n.getConstant('ConfirmPassword'),
            beforeOpen: (args: BeforeOpenEventArgs): void => {
                const dlgArgs: DialogBeforeOpenEventArgs = {
                    dialogName: 'Re-enterPassword',
                    element: args.element, target: args.target, cancel: args.cancel
                };
                this.parent.trigger('dialogBeforeOpen', dlgArgs);
                if (dlgArgs.cancel) {
                    args.cancel = true;
                }
                dialogInst.dialogInstance.content = this.reEnterSheetPasswordContent(); dialogInst.dialogInstance.dataBind();
                this.parent.element.focus();
            },
            buttons: [{
                buttonModel: {
                    content: l10n.getConstant('Ok'), isPrimary: true, disabled: true
                },
                click: (): void => {
                    this.alertMessage();
                    this.selectSheetPassword();
                }
            }]
        });
    }

    private unProtectPasswordContent(): HTMLElement {
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        const dlgElem: HTMLElement = this.parent.createElement('div', { className: 'e-unprotectpwd-dialog' });
        const pwdCont: HTMLElement = this.parent.createElement('div', { className: 'e-unprotectpwd-content' });
        const textHeader: HTMLElement = this.parent.createElement('div', { className: 'e-header', innerHTML: l10n.getConstant('EnterThePassword') });
        const pwdInputElem: HTMLElement = this.parent.createElement('input', { className: 'e-input e-text', attrs: { 'type': 'password' } });
        pwdCont.appendChild(pwdInputElem);
        pwdCont.insertBefore(textHeader, pwdInputElem);
        dlgElem.appendChild(pwdCont);
        return dlgElem;
    }

    private reEnterSheetPasswordContent(): HTMLElement {
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        const dialogElem: HTMLElement = this.parent.createElement('div', { className: 'e-reenterpwd-dialog' });
        const pwdCont: HTMLElement = this.parent.createElement('div', { className: 'e-reenterpwd-content' });
        const textH: HTMLElement = this.parent.createElement('div', { className: 'e-header', innerHTML: l10n.getConstant('ReEnterPassword') });
        const pwdInput: HTMLElement = this.parent.createElement('input', { className: 'e-input e-text', attrs: { 'type': 'password' } });
        pwdCont.appendChild(pwdInput);
        pwdCont.insertBefore(textH, pwdInput);
        dialogElem.appendChild(pwdCont);
        return dialogElem;
    }

    private unProtectSheetPasswordContent(): HTMLElement {
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        const dialogCnt: HTMLElement = this.parent.createElement('div', { className: 'e-unprotectsheetpwd-dialog' });
        const pwdCnt: HTMLElement = this.parent.createElement('div', { className: 'e-unprotectsheetpwd-content' });
        const textH: HTMLElement = this.parent.createElement('div', { className: 'e-header', innerHTML: l10n.getConstant('EnterThePassword') });
        const pwdInput: HTMLElement = this.parent.createElement('input', { className: 'e-input e-text', attrs: { 'type': 'password' } });
        pwdCnt.appendChild(pwdInput);
        pwdCnt.insertBefore(textH, pwdInput);
        dialogCnt.appendChild(pwdCnt);
        return dialogCnt;
    }
    private unprotectdlgOkClick(dialogInst: Dialog): void {
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        const pwd: HTMLElement = this.parent.element.querySelector('.e-unprotectpwd-dialog').
            getElementsByClassName('e-unprotectpwd-content')[0].querySelector('.e-input');
        if (this.parent.password === (pwd as CellModel).value) {
            dialogInst.hide();
            this.parent.password = '';
            this.parent.isProtected = false;
            if (this.parent.showSheetTabs) {
                this.parent.element.querySelector('.e-add-sheet-tab').removeAttribute('disabled');
                this.parent.element.querySelector('.e-add-sheet-tab').classList.remove('e-disabled');
            }
            document.getElementById(this.parent.element.id + '_protectworkbook').classList.remove('e-active');
            this.parent.notify(updateToggleItem, { props: 'Protectworkbook' });
        } else {
            const pwdSpan: Element = this.parent.createElement('span', {
                className: 'e-unprotectpwd-alert-span',
                innerHTML: l10n.getConstant('UnProtectPasswordAlert')
            });
            (this.parent.element.querySelector('.e-unprotectworkbook-dlg').querySelector('.e-dlg-content')).appendChild(pwdSpan);
        }
    }
    private unprotectSheetdlgOkClick(dialogInst: Dialog, isImportedSheet?:boolean): void {
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        let sheet: SheetModel = this.parent.getActiveSheet();
        let isActive: boolean;
        const pwd: HTMLElement = this.parent.element.querySelector('.e-unprotectsheetpwd-dialog').
            getElementsByClassName('e-unprotectsheetpwd-content')[0].querySelector('.e-input');
            if (isImportedSheet && sheet.password.length === 0) {
            const impArgs: OpenOptions = {
                sheetPassword: (pwd as CellModel).value,
                sheetIndex: this.parent.activeSheetIndex
            };
            this.parent.open(impArgs);
        }
        else {
            if (sheet.password === (pwd as CellModel).value) {
                dialogInst.hide();
                this.unProtectSheetPassword()
            } else {
                const pwdSpan: Element = this.parent.createElement('span', {
                    className: 'e-unprotectsheetpwd-alert-span',
                    innerHTML: l10n.getConstant('UnProtectPasswordAlert')
                });
                (this.parent.element.querySelector('.e-unprotectworksheet-dlg').querySelector('.e-dlg-content')).appendChild(pwdSpan);
            }
        }
    }

    private unProtectSheetPassword(){
        let sheet: SheetModel = this.parent.getActiveSheet();
        let isActive: boolean;
        let sheetIdx: number =this.parent.activeSheetIndex;
        this.parent.setSheetPropertyOnMute(sheet, 'isProtected', !sheet.isProtected);
        this.parent.setSheetPropertyOnMute(sheet, 'password', '');
        isActive = sheet.isProtected ? false : true;
        this.parent.notify(applyProtect, { isActive: isActive, id: this.parent.element.id + '_protect' });
        if(this.parent.openModule.isImportedFile && this.parent.openModule.unProtectSheetIdx.indexOf(sheetIdx) === -1 ) {
            this.parent.openModule.unProtectSheetIdx.push(sheetIdx);
        }
    }
    private getPassWord(args: { [key: string]: string }): void {
        args.passWord = this.password;
    }

    private importProtectWorkbook(fileArgs: OpenOptions): void {
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        const dialogInst: Dialog = (this.parent.serviceLocator.getService(dialog) as Dialog);
        dialogInst.show({
            width: 323, isModal: true, showCloseIcon: true, cssClass: 'e-importprotectworkbook-dlg',
            header: l10n.getConstant('UnProtectWorkbook'),
            beforeOpen: (args: BeforeOpenEventArgs): void => {
                const dlgArgs: DialogBeforeOpenEventArgs = {
                    dialogName: 'ImportProtectWorkbook',
                    element: args.element, target: args.target, cancel: args.cancel
                };
                this.parent.trigger('dialogBeforeOpen', dlgArgs);
                if (dlgArgs.cancel) {
                    args.cancel = true;
                }
                dialogInst.dialogInstance.content = this.importProtectPasswordContent(fileArgs);
                dialogInst.dialogInstance.dataBind();
                this.parent.element.focus();
            },
            buttons: [{
                buttonModel: {
                    content: l10n.getConstant('Ok'), isPrimary: true, disabled: true
                },
                click: (): void => {
                    this.alertMessage();
                    this.importOkClick(fileArgs);
                }
            }]
        });
    }

    private importProtectPasswordContent(args: OpenOptions): HTMLElement {
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        const dialogElem: HTMLElement = this.parent.createElement('div', { className: 'e-importprotectpwd-dialog' });
        const pwdCont: HTMLElement = this.parent.createElement('div', { className: 'e-importprotectpwd-content' });
        const textSpan: HTMLElement = this.parent.createElement('span', {
            className: 'e-header',
            innerHTML: '"' + (args.file as File).name + '"' + ' ' + l10n.getConstant('IsProtected')
        });
        const pwdInput: HTMLElement = this.parent.createElement('input', { className: 'e-input e-text', attrs: { 'type': 'password' } });
        pwdInput.setAttribute('placeholder', l10n.getConstant('EnterThePassword'));
        pwdCont.appendChild(textSpan);
        pwdCont.appendChild(pwdInput);
        dialogElem.appendChild(pwdCont);
        return dialogElem;
    }
    private importOkClick(args: OpenOptions): void {
        const pwd: HTMLElement = this.parent.element.querySelector('.e-importprotectpwd-dialog').
            getElementsByClassName('e-importprotectpwd-content')[0].querySelector('.e-input');
        this.parent.password = (pwd as CellModel).value;
        const impArgs: OpenOptions = {
            file: args.file,
            password: (pwd as CellModel).value
        };
        this.parent.open(impArgs);
    }


    /**
     * Get the module name.
     *
     * @returns {string} - Get the module name.
     *
     * @private
     */
    public getModuleName(): string {
        return 'protectSheet';
    }
}
