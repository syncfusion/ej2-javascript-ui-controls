import { Spreadsheet } from '../base/index';
import { findDlg, locale, dialog, gotoDlg, replace, findHandler, focus } from '../common/index';
import { DialogBeforeOpenEventArgs } from '../common/index';
import { L10n, getComponent, isNullOrUndefined } from '@syncfusion/ej2-base';
import { Dialog } from '../services';
import { ToolbarFind, goto, FindOptions, showDialog, count, replaceAllDialog, findKeyUp } from '../../workbook/index';
import { CheckBox, Button } from '@syncfusion/ej2-buttons';
import { BeforeOpenEventArgs } from '@syncfusion/ej2-popups';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { TextBox } from '@syncfusion/ej2-inputs';
import { DialogModel } from '@syncfusion/ej2-popups';

/**
 * `FindAndReplace` module is used to handle the search action in Spreadsheet.
 */

export class FindAndReplace {
    private parent: Spreadsheet;
    private shortValue: string = '';
    /**
     * Constructor for FindAndReplace module.
     *
     * @param {Spreadsheet} parent - Constructor for FindAndReplace module.
     */
    constructor(parent: Spreadsheet) {
        this.parent = parent;
        this.addEventListener();
    }

    private addEventListener(): void {
        this.parent.on(findDlg, this.renderFindDlg, this);
        this.parent.on(gotoDlg, this.renderGotoDlg, this);
        this.parent.on(goto, this.gotoHandler, this);
        this.parent.on(findHandler, this.findHandler, this);
        this.parent.on(replace, this.replaceHandler, this);
        this.parent.on(showDialog, this.showDialog, this);
        this.parent.on(replaceAllDialog, this.replaceAllDialog, this);
        this.parent.on(findKeyUp, this.findKeyUp, this);
    }

    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(findDlg, this.renderFindDlg);
            this.parent.off(gotoDlg, this.renderGotoDlg);
            this.parent.off(goto, this.gotoHandler);
            this.parent.off(findHandler, this.findHandler);
            this.parent.off(replace, this.replaceHandler);
            this.parent.off(showDialog, this.showDialog);
            this.parent.off(replaceAllDialog, this.replaceAllDialog);
            this.parent.off(findKeyUp, this.findKeyUp);
        }
    }
    private renderFindDlg(): void {
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        const dialogInst: Dialog = (this.parent.serviceLocator.getService(dialog) as Dialog);
        const cancelButton: boolean = false;
        if (isNullOrUndefined(this.parent.element.querySelector('.e-find-dlg'))) {
            const dlg: DialogModel = {
                isModal: false, showCloseIcon: true, cssClass: 'e-find-dlg', allowDragging: true,
                header: l10n.getConstant('FindAndReplace'), closeOnEscape: false,
                beforeOpen: (args: BeforeOpenEventArgs): void => {
                    const dlgArgs: DialogBeforeOpenEventArgs = {
                        dialogName: 'FindAndReplaceDialog',
                        element: args.element, target: args.target, cancel: args.cancel
                    };
                    this.parent.trigger('dialogBeforeOpen', dlgArgs);
                    if (dlgArgs.cancel) {
                        args.cancel = true;
                    }
                    dialogInst.dialogInstance.content = this.findandreplaceContent(); dialogInst.dialogInstance.dataBind();
                    focus(this.parent.element);
                },
                buttons: [{
                    buttonModel: {
                        content: l10n.getConstant('FindPreviousBtn'), isPrimary: true, cssClass: 'e-btn-findPrevious', disabled: true
                    },
                    click: (e: KeyboardEvent): void => {
                        this.dialogMessage();
                        if (e && e.keyCode === 13) {
                            this.findDlgClick('next');
                            return;
                        }
                        this.findDlgClick('prev');
                    }
                }, {
                    buttonModel: {
                        content: l10n.getConstant('FindNextBtn'), isPrimary: true, cssClass: 'e-btn-findNext', disabled: true

                    },
                    click: (): void => {
                        this.dialogMessage();
                        this.findDlgClick('next');
                    }
                }, {
                    buttonModel: {
                        content: l10n.getConstant('ReplaceBtn'), isPrimary: true, cssClass: 'e-btn-replace', disabled: true
                    },
                    click: (): void => {
                        this.dialogMessage();
                        this.findDlgClick('replace');
                    }
                }, {
                    buttonModel: {
                        content: l10n.getConstant('ReplaceAllBtn'), isPrimary: true, cssClass: 'e-btn-replaceAll', disabled: true
                    },
                    click: (): void => {
                        this.dialogMessage();
                        this.findDlgClick('replaceAll');
                    }
                }], open: (): void => {
                    const findInput: string = (this.parent.element.querySelector('.e-text-findNext') as HTMLInputElement).value;
                    if (findInput) {
                        const prevButton: HTMLElement = this.parent.element.querySelector('.e-btn-findPrevious') as HTMLElement;
                        const prevButtonObj: Button = getComponent(prevButton, 'btn') as Button;
                        prevButtonObj.disabled = false;
                        (getComponent(
                            this.parent.element.querySelector('.e-btn-findNext') as HTMLElement, 'btn') as Button).disabled = false;
                    }
                }, close: (): void => {
                    dialogInst.hide();
                }
            };
            dialogInst.show(dlg, cancelButton);
        } else {
            dialogInst.hide();
        }
    }
    private dialogMessage(): void {
        if (this.parent.element.querySelector('.e-replace-alert-span')) {
            this.parent.element.querySelector('.e-replace-alert-span').remove();
        } else if (this.parent.element.querySelector('.e-find-alert-span')) {
            this.parent.element.querySelector('.e-find-alert-span').remove();
        }
    }
    private renderGotoDlg(): void {
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        const dialogInst: Dialog = (this.parent.serviceLocator.getService(dialog) as Dialog);
        const cancelBtn: boolean = false;
        if (isNullOrUndefined(this.parent.element.querySelector('.e-find-dlg'))) {
            const dlg: DialogModel = {
                width: 300, isModal: false, showCloseIcon: true, cssClass: 'e-goto-dlg', allowDragging: true,
                header: l10n.getConstant('GotoHeader'),
                beforeOpen: (args: BeforeOpenEventArgs): void => {
                    const dlgArgs: DialogBeforeOpenEventArgs = {
                        dialogName: 'GoToDialog',
                        element: args.element, target: args.target, cancel: args.cancel
                    };
                    this.parent.trigger('dialogBeforeOpen', dlgArgs);
                    if (dlgArgs.cancel) {
                        args.cancel = true;
                    }
                    dialogInst.dialogInstance.content = this.GotoContent(); dialogInst.dialogInstance.dataBind();
                    focus(this.parent.element);
                },
                buttons: [{
                    buttonModel: {
                        content: l10n.getConstant('Ok'), isPrimary: true, cssClass: 'e-btn-goto-ok'
                    },
                    click: (): void => {
                        this.gotoHandler();
                    }
                }], close: (): void => {
                    dialogInst.hide();
                }, open: (): void => {
                    this.textFocus();
                }

            };
            dialogInst.show(dlg, cancelBtn);
        } else {
            dialogInst.hide();
        }
    }
    private textFocus(): void {
        const element: HTMLElement = this.parent.element.querySelector('.e-text-goto');
        element.addEventListener('focus', (): void => {
            if (this.parent.element.querySelector('.e-goto-alert-span')) {
                this.parent.element.querySelector('.e-goto-alert-span').remove();
            }
        });
    }
    private findDlgClick(findDlgArgs: string): void {
        if (findDlgArgs === 'prev') {
            this.findHandler({ findOption: findDlgArgs });
        } else if (findDlgArgs === 'next') {
            this.findHandler({ findOption: findDlgArgs });
        } else {
            this.replaceHandler({ findDlgArgs: findDlgArgs });
        }
    }
    private findHandler(findOpt?: ToolbarFind): void {
        let findInput: HTMLInputElement = (this.parent.element.querySelector('.e-text-findNext') as HTMLInputElement);
        if (!findInput) {
            findInput = this.parent.element.querySelector('.e-text-findNext-short') as HTMLInputElement;
            if (!findInput) {
                this.gotoAlert();
            }
        }
        const value: string = findInput.value;
        if (findInput.value !== '') {
            const sheetIndex: number = this.parent.activeSheetIndex;
            const checkCase: HTMLElement = this.parent.element.querySelector('.e-findnreplace-checkcase') as HTMLElement;
            let isCSen: boolean;
            if (!checkCase) {
                isCSen = false;
            } else {
                const caseCheckbox: CheckBox = getComponent(checkCase, 'checkbox') as CheckBox;
                isCSen = caseCheckbox.checked;
            }
            const checkmatch: HTMLElement = this.parent.element.querySelector('.e-findnreplace-checkmatch') as HTMLElement;
            let isEMatch: boolean;
            if (!checkmatch) {
                isEMatch = false;
            } else {
                const entireMatchCheckbox: CheckBox = getComponent(checkmatch, 'checkbox') as CheckBox;
                isEMatch = entireMatchCheckbox.checked;
            }
            const searchitem: HTMLElement = this.parent.element.querySelector('.e-findnreplace-searchby') as HTMLElement;
            let searchBy: string;
            if (!searchitem) {
                searchBy = 'By Row';
            } else {
                const searchDDL: DropDownList = getComponent(searchitem, 'dropdownlist') as DropDownList;
                searchBy = searchDDL.value.toString();
            }
            const modeitem: HTMLElement = this.parent.element.querySelector('.e-findnreplace-searchwithin') as HTMLElement;
            let mode: string;
            if (!modeitem) {
                mode = 'Sheet';
            } else {
                const modeDDL: DropDownList = getComponent(modeitem, 'dropdownlist') as DropDownList;
                mode = modeDDL.value.toString();
            }
            const args: FindOptions = {
                value: value, sheetIndex: sheetIndex, findOpt: findOpt.findOption, mode: mode, isCSen: isCSen,
                isEMatch: isEMatch, searchBy: searchBy, isAction: true
            };
            if (findOpt.findOption === 'next' || findOpt.findOption === 'prev') {
                this.parent.find(args);
            } else if (findOpt.countArgs.countOpt === 'count') {
                this.parent.notify(count, args);
                findOpt.countArgs.findCount = args.findCount;
            }
        }
    }
    private replaceHandler(replace: { [key: string]: string }): void {
        const sheetIndex: number = this.parent.activeSheetIndex;
        const findInput: HTMLInputElement = this.parent.element.querySelector('.e-text-findNext') as HTMLInputElement;
        const replaceWith: HTMLInputElement = this.parent.element.querySelector('.e-text-replaceInp') as HTMLInputElement;
        const checkCase: HTMLElement = this.parent.element.querySelector('.e-findnreplace-checkcase') as HTMLElement;
        const caseCheckbox: CheckBox = getComponent(checkCase, 'checkbox') as CheckBox;
        const checkmatch: HTMLElement = this.parent.element.querySelector('.e-findnreplace-checkmatch') as HTMLElement;
        const eMatchCheckbox: CheckBox = getComponent(checkmatch, 'checkbox') as CheckBox;
        const searchitem: HTMLElement = this.parent.element.querySelector('.e-findnreplace-searchby') as HTMLElement;
        const searchDDL: DropDownList = getComponent(searchitem, 'dropdownlist') as DropDownList;
        const modeitem: HTMLElement = this.parent.element.querySelector('.e-findnreplace-searchwithin') as HTMLElement;
        const modeDDL: DropDownList = getComponent(modeitem, 'dropdownlist') as DropDownList;
        const findOption: string = 'next';
        const args: FindOptions = {
            value: findInput.value, mode: modeDDL.value.toString(), isCSen: caseCheckbox.checked,
            isEMatch: eMatchCheckbox.checked, searchBy: searchDDL.value.toString(), findOpt: findOption, replaceValue: replaceWith.value,
            replaceBy: replace.findDlgArgs ? replace.findDlgArgs : replace.replaceMode, sheetIndex: sheetIndex
        };
        this.parent.replace(args);
    }

    private gotoHandler(address?: { [key: string]: string }): void {
        if (address) {
            this.parent.goTo(address.address);
        } else {
            const item: HTMLInputElement = this.parent.element.querySelector('.e-text-goto') as HTMLInputElement;
            const gotoaddress: string = item.value;
            const splitAddress: string[] = gotoaddress.split('');
            if ((gotoaddress === '') || isNaN(parseInt(splitAddress[1], 10))) {
                this.gotoAlert();
                return;
            } else {
                const address: string = gotoaddress.toString().toUpperCase();
                this.parent.goTo(address);
            }
        }
    }

    private gotoAlert(): void {
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        const gotoSpan: Element = this.parent.createElement('span', {
            className: 'e-goto-alert-span',
            innerHTML: l10n.getConstant('InsertingEmptyValue')
        });
        if (this.parent.element.querySelector('.e-goto-alert-span')) {
            this.parent.element.querySelector('.e-goto-alert-span').remove();
        }
        (this.parent.element.querySelector('.e-goto-dlg').querySelector('.e-dlg-content')).appendChild(gotoSpan);
    }

    private showDialog(): void {
        if (this.parent.element.querySelector('.e-replace-alert-span')) {
            this.parent.element.querySelector('.e-replace-alert-span').remove();
        }
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        const findSpan: Element = this.parent.createElement('span', {
            className: 'e-find-alert-span',
            innerHTML: l10n.getConstant('NoElements')
        });
        if (this.parent.element.querySelector('.e-find-dlg')) {
            (this.parent.element.querySelector('.e-find-dlg').querySelector('.e-dlg-content')).appendChild(findSpan);
        }
    }
    private replaceAllDialog(options: { [key: string]: number | string }): void {
        if (this.parent.element.querySelector('.e-find-alert-span')) {
            this.parent.element.querySelector('.e-find-alert-span').remove();
        }
        const l10n: L10n = (this.parent.serviceLocator.getService(locale));
        const replaceSpan: Element = this.parent.createElement('span', {
            className: 'e-replace-alert-span',
            innerHTML: options.count + l10n.getConstant('ReplaceAllEnd') + options.replaceValue
        });
        if (this.parent.element.querySelector('.e-find-dlg')) {
            (this.parent.element.querySelector('.e-find-dlg').querySelector('.e-dlg-content')).appendChild(replaceSpan);
        }
    }

    private findKeyUp(e: KeyboardEvent): void {
        if ((e.target as HTMLElement).classList.contains('e-text-findNext')) {
            const findValue: string = (this.parent.element.querySelector('.e-text-findNext') as HTMLInputElement).value;
            if (!isNullOrUndefined(findValue) && findValue !== '') {
                const prevButton: HTMLElement = this.parent.element.querySelector('.e-btn-findPrevious') as HTMLElement;
                const prevButtonObj: Button = getComponent(prevButton, 'btn') as Button;
                prevButtonObj.disabled = false;
                (getComponent(this.parent.element.querySelector('.e-btn-findNext') as HTMLElement, 'btn') as Button).disabled = false;
            } else {
                (getComponent(this.parent.element.querySelector('.e-btn-findPrevious') as HTMLElement, 'btn') as Button).disabled = true;
                (getComponent(this.parent.element.querySelector('.e-btn-findNext') as HTMLElement, 'btn') as Button).disabled = true;
                this.dialogMessage();
            }
        }
        const findValue: string = (this.parent.element.querySelector('.e-text-findNext') as HTMLInputElement).value;
        const replaceValue: string = (this.parent.element.querySelector('.e-text-replaceInp') as HTMLInputElement).value;
        if (!isNullOrUndefined(findValue) && !isNullOrUndefined(replaceValue) && (findValue !== '') && (replaceValue !== '')) {
            if (this.parent.getActiveSheet().isProtected === false) {
                (getComponent(this.parent.element.querySelector('.e-btn-replace') as HTMLElement, 'btn') as Button).disabled = false;
                (getComponent(this.parent.element.querySelector('.e-btn-replaceAll') as HTMLElement, 'btn') as Button).disabled = false;
            }
        } else {
            (getComponent(this.parent.element.querySelector('.e-btn-replace') as HTMLElement, 'btn') as Button).disabled = true;
            (getComponent(this.parent.element.querySelector('.e-btn-replaceAll') as HTMLElement, 'btn') as Button).disabled = true;
        }
    }

    private findandreplaceContent(): HTMLElement {
        if (this.parent.element.querySelector('.e-text-findNext-short') as HTMLInputElement) {
            this.shortValue = (this.parent.element.querySelector('.e-text-findNext-short') as HTMLInputElement).value;
        }
        const dialogElem: HTMLElement = this.parent.createElement('div', { className: 'e-link-dialog' });
        const findElem: HTMLElement = this.parent.createElement('div', { className: 'e-find' });
        const findCheck: HTMLElement = this.parent.createElement('div', { className: 'e-findCheck' });
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        dialogElem.appendChild(findElem);
        const findTextE: HTMLElement = this.parent.createElement('div', { className: 'e-cont' });
        const findTextH: HTMLElement = this.parent.createElement('p', { className: 'e-header', innerHTML: l10n.getConstant('FindWhat') });
        const findTextIp: HTMLElement = this.parent.createElement('input', {
            className: 'e-input e-text-findNext', attrs: {
                'type': 'Text', 'placeholder': l10n.getConstant('FindValue'),
                'value': this.shortValue
            }
        });
        findTextE.appendChild(findTextIp);
        findTextE.insertBefore(findTextH, findTextIp);
        findElem.appendChild(findTextE);
        const findTextBox: TextBox = new TextBox({ width: '70%' });
        findTextBox.createElement = this.parent.createElement;
        findTextBox.appendTo(findTextIp);
        const replaceTextE: HTMLElement = this.parent.createElement('div', { className: 'e-cont' });
        const replaceTextH: HTMLElement =
            this.parent.createElement('p', { className: 'e-header', innerHTML: l10n.getConstant('ReplaceWith') });
        const replaceTextIp: HTMLElement = this.parent.createElement('input', {
            className: 'e-input e-text-replaceInp', attrs: { 'type': 'Text', 'placeholder': l10n.getConstant('ReplaceValue') }
        });
        replaceTextE.appendChild(replaceTextIp);
        replaceTextE.insertBefore(replaceTextH, replaceTextIp);
        findElem.appendChild(replaceTextE);
        const replaceTextBox: TextBox = new TextBox({ width: '70%' });
        replaceTextBox.createElement = this.parent.createElement;
        replaceTextBox.appendTo(replaceTextIp);
        const withinData: { [key: string]: Object }[] = [
            { Id: 'Sheet', Within: l10n.getConstant('Sheet') },
            { Id: 'Workbook', Within: l10n.getConstant('Workbook') }
        ];
        const withInDDL: DropDownList = new DropDownList(
            {
                dataSource: withinData,
                cssClass: 'e-searchby',
                fields: { value: 'Id', text: 'Within' }, width: '50%', index: 0
            });
        const withIn: HTMLElement = this.parent.createElement('input', {
            className: 'e-findnreplace-searchwithin', attrs: { type: 'select', label: l10n.getConstant('SearchBy') }
        });
        const withinTextH: HTMLElement =
            this.parent.createElement('p', { className: 'e-header', innerHTML: l10n.getConstant('SearchWithin') });
        findElem.appendChild(withinTextH);
        findElem.appendChild(withIn);
        withInDDL.createElement = this.parent.createElement;
        withInDDL.appendTo(withIn);
        const searchData: { [key: string]: Object }[] = [
            { Id: 'By Row', Search: l10n.getConstant('ByRow') },
            { Id: 'By Column', Search: l10n.getConstant('ByColumn') }
        ];
        const searchDDL: DropDownList = new DropDownList(
            {
                dataSource: searchData,
                cssClass: 'e-searchby',
                fields: { value: 'Id', text: 'Search' }, width: '50%', index: 0
            });
        const searchIn: HTMLElement = this.parent.createElement('input', {
            className: 'e-findnreplace-searchby', attrs: { type: 'select', label: l10n.getConstant('SearchBy') }
        });
        const searchTextH: HTMLElement = this.parent.createElement('p', { className: 'e-header', innerHTML: l10n.getConstant('SearchBy') });
        findElem.appendChild(searchTextH);
        findElem.appendChild(searchIn);
        searchDDL.createElement = this.parent.createElement;
        searchDDL.appendTo(searchIn);

        const isCSen: CheckBox = new CheckBox({
            label: l10n.getConstant('MatchCase'), checked: false,
            cssClass: 'e-findnreplace-casecheckbox'
        });
        const caaseCheckbox: HTMLElement = this.parent.createElement('input', {
            className: 'e-findnreplace-checkcase', attrs: { type: 'checkbox' }
        });
        findCheck.appendChild(caaseCheckbox);
        isCSen.createElement = this.parent.createElement;
        isCSen.appendTo(caaseCheckbox);
        const isEMatch: CheckBox = new CheckBox({
            label: l10n.getConstant('MatchExactCellElements'), checked: false,
            cssClass: 'e-findnreplace-exactmatchcheckbox'
        });
        const entirematchCheckbox: HTMLElement = this.parent.createElement('input', {
            className: 'e-findnreplace-checkmatch', attrs: { type: 'checkbox' }
        });
        findCheck.appendChild(entirematchCheckbox);
        isEMatch.createElement = this.parent.createElement;
        isEMatch.appendTo(entirematchCheckbox);
        findElem.appendChild(findCheck);
        return dialogElem;
    }
    private GotoContent(): HTMLElement {
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        const dialogElem: HTMLElement = this.parent.createElement('div', { className: 'e-link-dialog' });
        const gotoElem: HTMLElement = this.parent.createElement('div', { className: 'e-goto' });
        dialogElem.appendChild(gotoElem);
        const gotoTextE: HTMLElement = this.parent.createElement('div', { className: 'e-cont' });
        const gotoTextH: HTMLElement = this.parent.createElement('p', { className: 'e-header', innerHTML: l10n.getConstant('Reference') });
        const gotoTextBox: TextBox = new TextBox({
            placeholder: l10n.getConstant('EntercellAddress')
        });
        const gotoTextIp: HTMLElement = this.parent.createElement('input', { className: 'e-text-goto', attrs: { 'type': 'Text' } });
        gotoTextE.appendChild(gotoTextIp);
        gotoTextE.insertBefore(gotoTextH, gotoTextIp);
        gotoElem.appendChild(gotoTextE);
        gotoTextBox.createElement = this.parent.createElement;
        gotoTextBox.appendTo(gotoTextIp);
        return dialogElem;
    }

    /**
     * To destroy the find-and-replace module.
     *
     * @returns {void} - To destroy the find-and-replace module.
     */
    protected destroy(): void {
        this.removeEventListener();
        this.parent = null;
    }
    /**
     * Gets the module name.
     *
     * @returns {string} - Gets the module name.
     */
    protected getModuleName(): string {
        return 'findAndReplace';
    }
}
