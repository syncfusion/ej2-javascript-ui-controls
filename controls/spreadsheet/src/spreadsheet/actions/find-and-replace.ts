import { Spreadsheet } from '../base/index';
import { findDlg, locale, dialog, gotoDlg, findHandler, focus, getUpdateUsingRaf } from '../common/index';
import { DialogBeforeOpenEventArgs } from '../common/index';
import { L10n, getComponent, isNullOrUndefined } from '@syncfusion/ej2-base';
import { Dialog } from '../services';
import { ToolbarFind, goto, FindOptions, showDialog, replaceAllDialog, findKeyUp, replace, replaceAll, SheetModel } from '../../workbook/index';
import { getRangeIndexes, getSwapRange } from '../../workbook/common/index';
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
            this.parent.off(showDialog, this.showDialog);
            this.parent.off(replaceAllDialog, this.replaceAllDialog);
            this.parent.off(findKeyUp, this.findKeyUp);
        }
    }
    private renderFindDlg(): void {
        const dialogInst: Dialog = (this.parent.serviceLocator.getService(dialog) as Dialog);
        if (!this.parent.element.querySelector('.e-find-dlg')) {
            const l10n: L10n = this.parent.serviceLocator.getService(locale);
            const dlg: DialogModel = {
                isModal: false, showCloseIcon: true, cssClass: 'e-find-dlg',
                header: l10n.getConstant('FindAndReplace'),
                beforeOpen: (args: BeforeOpenEventArgs): void => {
                    const dlgArgs: DialogBeforeOpenEventArgs = { dialogName: 'FindAndReplaceDialog', element: args.element, target:
                        args.target, cancel: args.cancel };
                    this.parent.trigger('dialogBeforeOpen', dlgArgs);
                    if (dlgArgs.cancel) {
                        args.cancel = true;
                    } else {
                        dialogInst.dialogInstance.content = this.findandreplaceContent();
                        dialogInst.dialogInstance.dataBind();
                    }
                    focus(this.parent.element);
                },
                buttons: [{
                    buttonModel: { content: l10n.getConstant('FindPreviousBtn'), isPrimary: true, cssClass: 'e-btn-findPrevious',
                        disabled: true },
                    click: (e: KeyboardEvent): void => {
                        this.dialogMessage();
                        this.findHandler({ findOption: e && e.keyCode === 13 ? 'next' : 'prev' });
                    }
                },
                {
                    buttonModel: { content: l10n.getConstant('FindNextBtn'), isPrimary: true, cssClass: 'e-btn-findNext', disabled: true },
                    click: (): void => {
                        this.dialogMessage();
                        this.findHandler({ findOption: 'next' });
                    }
                },
                {
                    buttonModel: { content: l10n.getConstant('ReplaceBtn'), isPrimary: true, cssClass: 'e-btn-replace', disabled: true },
                    click: (): void => {
                        this.dialogMessage();
                        this.replaceHandler(replace);
                    }
                },
                {
                    buttonModel: { content: l10n.getConstant('ReplaceAllBtn'), isPrimary: true, cssClass: 'e-btn-replaceAll', disabled:
                        true },
                    click: (): void => {
                        this.dialogMessage();
                        this.replaceHandler(replaceAll);
                    }
                }],
                open: (): void => {
                    const findInput: HTMLInputElement = this.parent.element.querySelector('.e-text-findNext') as HTMLInputElement;
                    if (findInput.value) {
                        const prevButton: HTMLElement = this.parent.element.querySelector('.e-btn-findPrevious') as HTMLElement;
                        const prevButtonObj: Button = getComponent(prevButton, 'btn') as Button;
                        prevButtonObj.disabled = false;
                        (getComponent(
                            this.parent.element.querySelector('.e-btn-findNext') as HTMLElement, 'btn') as Button).disabled = false;
                    }
                    getUpdateUsingRaf((): void => {
                        focus(findInput);
                    });
                },
                close: (): void => dialogInst.hide()
            };
            dialogInst.show(dlg);
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
                width: 300, isModal: false, showCloseIcon: true, cssClass: 'e-goto-dlg',
                header: l10n.getConstant('GotoHeader'),
                beforeOpen: (args: BeforeOpenEventArgs): void => {
                    const dlgArgs: DialogBeforeOpenEventArgs = {
                        dialogName: 'GoToDialog',
                        element: args.element, target: args.target, cancel: args.cancel
                    };
                    this.parent.trigger('dialogBeforeOpen', dlgArgs);
                    if (dlgArgs.cancel) {
                        args.cancel = true;
                    } else {
                        dialogInst.dialogInstance.content = this.GotoContent();
                        dialogInst.dialogInstance.dataBind();
                    }
                    focus(this.parent.element);
                },
                buttons: [{
                    buttonModel: {
                        content: l10n.getConstant('Ok'), isPrimary: true, cssClass: 'e-btn-goto-ok'
                    },
                    click: (): void => {
                        if (this.gotoHandler()) {
                            dialogInst.hide();
                        }
                    }
                }], open: (): void => {
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
            const sheet: SheetModel = this.parent.getActiveSheet();
            if (sheet.isProtected && !sheet.protectSettings.selectCells && !sheet.protectSettings.selectUnLockedCells) {
                return;
            }
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
            this.parent.find(args);
        }
    }
    private replaceHandler(action: string): void {
        const dlg: HTMLElement = this.parent.element.querySelector('.e-find-dlg');
        const findValue: string = (dlg.querySelector('.e-text-findNext') as HTMLInputElement).value;
        const replaceValue: string = (this.parent.element.querySelector('.e-text-replaceInp') as HTMLInputElement).value;
        const checkCase: boolean = (this.parent.element.querySelector('.e-findnreplace-checkcase') as HTMLInputElement).checked;
        const checkmatch: boolean = (this.parent.element.querySelector('.e-findnreplace-checkmatch') as HTMLInputElement).checked;
        const searchInValue: string = (this.parent.element.querySelector('.e-search-within .e-ddl-hidden') as HTMLInputElement).value;
        const searchByValue: string = (this.parent.element.querySelector('.e-searchby .e-ddl-hidden') as HTMLInputElement).value;
        this.parent.notify(
            action, <FindOptions>{ value: findValue, mode: searchInValue, isCSen: checkCase, isEMatch: checkmatch, searchBy: searchByValue,
                findOpt: 'next', replaceValue: replaceValue, replaceBy: action, sheetIndex: this.parent.activeSheetIndex, isAction: true });
    }

    private gotoHandler(address?: { [key: string]: string }): boolean {
        let isNotAlertShown: boolean = true;
        if (address) {
            this.parent.goTo(address.address);
        } else {
            let gotoAddress: string = (this.parent.element.querySelector('.e-text-goto') as HTMLInputElement).value;
            for (let nameIdx: number = 0; nameIdx < this.parent.definedNames.length; nameIdx++) {
                if (this.parent.definedNames[nameIdx as number].name === gotoAddress) {
                    gotoAddress = this.parent.definedNames[nameIdx as number].refersTo.slice(1);
                    break;
                }
            }
            let addr: string = gotoAddress;
            if (gotoAddress.includes('!')) {
                addr = gotoAddress.split('!')[1];
            }
            addr = addr.split('$').join('');
            if (addr.includes(':')) {
                addr = addr.split(':')[0];
            }
            const rowMatch: RegExpMatchArray = addr.match(/\d+/);
            const colMatch: RegExpMatchArray = addr.match(/[A-Z]+/i);
            if (!rowMatch || !colMatch || colMatch.index !== 0) {
                this.gotoAlert();
                isNotAlertShown = false;
            } else {
                const indexes: number[] = getSwapRange(getRangeIndexes(addr));
                if (indexes[2] >= 1048576 || indexes[3] >= 16384) {
                    this.gotoAlert();
                    isNotAlertShown = false;
                } else {
                    this.parent.goTo(gotoAddress);
                }
            }
        }
        return isNotAlertShown;
    }

    private gotoAlert(): void {
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        const gotoSpan: HTMLElement = this.parent.createElement('span', { className: 'e-goto-alert-span' });
        gotoSpan.innerText = l10n.getConstant('InsertingEmptyValue');
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
        const findSpan: HTMLElement = this.parent.createElement('span', { className: 'e-find-alert-span' });
        findSpan.innerText = l10n.getConstant('NoElements');
        if (this.parent.element.querySelector('.e-find-dlg')) {
            (this.parent.element.querySelector('.e-find-dlg').querySelector('.e-dlg-content')).appendChild(findSpan);
        }
    }
    private replaceAllDialog(options: { [key: string]: number | string }): void {
        if (this.parent.element.querySelector('.e-find-alert-span')) {
            this.parent.element.querySelector('.e-find-alert-span').remove();
        }
        const l10n: L10n = (this.parent.serviceLocator.getService(locale));
        const replaceSpan: HTMLElement = this.parent.createElement('span', { className: 'e-replace-alert-span' });
        replaceSpan.innerText = options.count + l10n.getConstant('ReplaceAllEnd') + options.replaceValue;
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
            if (!this.parent.getActiveSheet().isProtected) {
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
        const findTextH: HTMLElement = this.parent.createElement('p', { className: 'e-header' });
        findTextH.innerText = l10n.getConstant('FindWhat');
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
        const replaceTextH: HTMLElement = this.parent.createElement('p', { className: 'e-header' });
        replaceTextH.innerText = l10n.getConstant('ReplaceWith');
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
                cssClass: 'e-search-within',
                fields: { value: 'Id', text: 'Within' }, width: '50%', index: 0
            });
        let label: string = l10n.getConstant('SearchWithin');
        const withIn: HTMLElement = this.parent.createElement('input', {
            className: 'e-findnreplace-searchwithin', attrs: { type: 'select', label: label }
        });
        const withinTextH: HTMLElement = this.parent.createElement('p', { className: 'e-header' });
        withinTextH.innerText = label;
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
        label = l10n.getConstant('SearchBy');
        const searchIn: HTMLElement = this.parent.createElement('input', {
            className: 'e-findnreplace-searchby', attrs: { type: 'select', label: label }
        });
        const searchTextH: HTMLElement = this.parent.createElement('p', { className: 'e-header' });
        searchTextH.innerText = label;
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
        const gotoTextH: HTMLElement = this.parent.createElement('p', { className: 'e-header' });
        gotoTextH.innerText = l10n.getConstant('Reference');
        const gotoTextBox: TextBox = new TextBox({
            placeholder: l10n.getConstant('EnterCellAddress')
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
