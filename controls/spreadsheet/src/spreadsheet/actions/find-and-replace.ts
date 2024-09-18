import { Spreadsheet } from '../base/index';
import { findDlg, locale, dialog, gotoDlg, findHandler, focus, getUpdateUsingRaf, activeSheetChanged, removeElements } from '../common/index';
import { DialogBeforeOpenEventArgs } from '../common/index';
import { L10n, getComponent, isNullOrUndefined, closest, select, EventHandler, detach, Browser } from '@syncfusion/ej2-base';
import { Dialog } from '../services';
import { ToolbarFind, goto, FindOptions, showFindAlert, replaceAllDialog, findKeyUp, replace, replaceAll, SheetModel } from '../../workbook/index';
import { getRangeIndexes, getSwapRange, findToolDlg, count } from '../../workbook/common/index';
import { CheckBox, Button } from '@syncfusion/ej2-buttons';
import { BeforeOpenEventArgs } from '@syncfusion/ej2-popups';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { TextBox } from '@syncfusion/ej2-inputs';
import { Toolbar, ItemModel, ClickEventArgs } from '@syncfusion/ej2-navigations';
import { DialogModel, Dialog as FindDialog, AnimationSettingsModel } from '@syncfusion/ej2-popups';

/**
 * `FindAndReplace` module is used to handle the search action in Spreadsheet.
 */

export class FindAndReplace {
    private parent: Spreadsheet;
    private shortValue: string = '';
    private findDialog: FindDialog;
    private findValue: string;
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
        this.parent.on(showFindAlert, this.showFindAlert, this);
        this.parent.on(replaceAllDialog, this.replaceAllDialog, this);
        this.parent.on(findKeyUp, this.findKeyUp, this);
        this.parent.on(findToolDlg, this.findToolDlg, this);
        this.parent.on(activeSheetChanged, this.refreshFindDlg, this);
    }

    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(findDlg, this.renderFindDlg);
            this.parent.off(gotoDlg, this.renderGotoDlg);
            this.parent.off(goto, this.gotoHandler);
            this.parent.off(findHandler, this.findHandler);
            this.parent.off(showFindAlert, this.showFindAlert);
            this.parent.off(replaceAllDialog, this.replaceAllDialog);
            this.parent.off(findKeyUp, this.findKeyUp);
            this.parent.off(findToolDlg, this.findToolDlg);
            this.parent.off(activeSheetChanged, this.refreshFindDlg);
        }
    }

    private findToolDlg(
        args: { event?: MouseEvent, findValue?: string, isPublic?: boolean, headerHgt?: number, refreshPosition?: boolean,
            dialogEle?: HTMLElement }): void {
        const updateDisableState: (disable: boolean) => void = (disable: boolean): void => {
            const ribbon: HTMLElement = this.parent.showRibbon && this.parent.element.querySelector('.e-ribbon') as HTMLElement;
            if (ribbon) {
                const findBtn: HTMLButtonElement = (args.event && args.event.target ?
                    closest(args.event.target as Element, `#${this.parent.element.id}_findbtn`) :
                    select(`#${this.parent.element.id}_findbtn`, ribbon)) as HTMLButtonElement;
                if (findBtn) {
                    if (disable) {
                        findBtn.classList.add('e-disabled');
                    } else {
                        findBtn.classList.remove('e-disabled');
                    }
                    findBtn.disabled = disable;
                }
            }
        };
        let dialogDiv: HTMLElement = args.dialogEle || this.parent.element.getElementsByClassName('e-findtool-dlg')[0] as HTMLElement;
        if (args.isPublic) {
            this.findValue = args.findValue;
        }
        const sheet: SheetModel = this.parent.getActiveSheet();
        let toolbarObj: Toolbar; let findTextInput: HTMLInputElement; let findSpan: HTMLElement;
        const findHandlerFn: Function = (e?: KeyboardEvent): void => {
            if (!findTextInput || (sheet.isProtected && !sheet.protectSettings.selectCells &&
                !sheet.protectSettings.selectUnLockedCells)) {
                return;
            }
            const inputValue: string = findTextInput.value;
            if (e && e.keyCode === 13) {
                if (findTextInput.value && findSpan.textContent !== '0 of 0') {
                    this.parent.notify(findHandler, { findOption: e.shiftKey ? 'prev' : 'next' });
                    this.updateCount(findSpan, e.shiftKey);
                }
            } else {
                let enable: boolean;
                if (inputValue === '') {
                    findSpan.textContent = '0 of 0';
                    enable = false;
                } else {
                    const countArgs: { [key: string]: string | number | boolean } = { value: inputValue, mode: 'Sheet',
                        isCSen: false, sheetIndex: this.parent.activeSheetIndex, isEMatch: false, searchBy: 'By Row' };
                    this.parent.notify(count, countArgs);
                    findSpan.textContent = <string>countArgs.findCount;
                    enable = countArgs.findCount !== '0 of 0';
                }
                toolbarObj.enableItems(1, enable);
                toolbarObj.enableItems(2, enable);
            }
        };
        if (dialogDiv) {
            if (args.isPublic || args.refreshPosition) {
                if (args.isPublic) {
                    findTextInput = dialogDiv.querySelector('.e-text-findNext-short') as HTMLInputElement;
                    findTextInput.value = this.findValue;
                    findSpan = dialogDiv.querySelector('.e-input-group-icon') as HTMLElement;
                    toolbarObj = getComponent(dialogDiv.querySelector('.e-find-toolbar') as HTMLElement, 'toolbar') as Toolbar;
                    findHandlerFn();
                }
                if (args.refreshPosition) {
                    let headerHgt: number;
                    if (this.parent.getActiveSheet().showHeaders) {
                        const hdrPanel: HTMLElement = this.parent.getColumnHeaderContent().parentElement;
                        headerHgt = ((hdrPanel && hdrPanel.offsetHeight) || 30) + 1;
                    } else {
                        headerHgt = 1;
                    }
                    dialogDiv.style.top = `${headerHgt}px`;
                }
            } else {
                updateDisableState(true);
                this.findDialog.hide();
            }
        } else {
            const findTextElement: HTMLElement = this.parent.createElement('div', { className: 'e-input-group'});
            findTextInput = this.parent.createElement(
                'input', { className: 'e-input e-text-findNext-short', attrs: { 'type': 'Text'  } }) as HTMLInputElement;
            if (this.findValue) {
                findTextInput.value = this.findValue;
            }
            const l10n: L10n = this.parent.serviceLocator.getService(locale);
            findTextInput.setAttribute('placeholder', l10n.getConstant('FindValue'));
            findSpan = this.parent.createElement('span', { className: 'e-input-group-icon'});
            let timeoutHandler: number;
            const largeData: boolean = (sheet.usedRange.rowIndex * sheet.usedRange.colIndex) > 100;
            findTextInput.onkeyup = (e: KeyboardEvent): void => {
                if (largeData) {
                    if (timeoutHandler) {
                        clearTimeout(timeoutHandler);
                    }
                    timeoutHandler = setTimeout(findHandlerFn.bind(this, e), 500);
                } else {
                    findHandlerFn(e);
                }
            };
            findTextElement.appendChild(findTextInput);
            findTextElement.appendChild(findSpan);
            const toolItemModel: ItemModel[] = [
                { type: 'Input', template: findTextElement },
                {
                    prefixIcon: 'e-icons e-prev-icon', tooltipText: l10n.getConstant('FindPreviousBtn'), type: 'Button', cssClass: 'e-findRib-prev',
                    disabled: true
                },
                { prefixIcon: 'e-icons e-next-icon', tooltipText: l10n.getConstant('FindNextBtn'), type: 'Button', cssClass: 'e-findRib-next', disabled: true },
                { type: 'Separator' },
                { prefixIcon: 'e-icons e-option-icon', tooltipText: l10n.getConstant('MoreOptions'), type: 'Button', cssClass: 'e-findRib-more' },
                { prefixIcon: 'e-icons e-close', tooltipText: l10n.getConstant('Close'), type: 'Button', cssClass: 'e-findRib-close' }
            ];
            toolbarObj = new Toolbar({
                clicked: (args: ClickEventArgs): void => {
                    if (args.item.cssClass === 'e-findRib-next') {
                        this.parent.notify(findHandler, { findOption: 'next' });
                        this.updateCount(findSpan);
                    } else if (args.item.cssClass === 'e-findRib-prev') {
                        this.parent.notify(findHandler, { findOption: 'prev' });
                        this.updateCount(findSpan, true);
                    } else if (args.item.cssClass === 'e-findRib-more') {
                        this.findDialog.animationSettings.effect = 'None';
                        this.findDialog.setProperties({ animationSettings: this.findDialog.animationSettings }, true);
                        this.renderFindDlg();
                        this.findDialog.hide();
                    }
                }, width: 'auto', height: 'auto', items: toolItemModel, cssClass: 'e-find-toolObj',
                created: (): void => {
                    const tbarBtns: NodeList = toolbarObj.element.querySelectorAll('.e-toolbar-item .e-tbar-btn');
                    tbarBtns.forEach((tbarBtn: HTMLElement): void => tbarBtn.removeAttribute('tabindex'));
                }
            });
            const tbarEle: HTMLElement = this.parent.createElement('div', { className: 'e-find-toolbar', attrs: { 'tabindex': '-1' } });
            toolbarObj.createElement = this.parent.createElement;
            toolbarObj.appendTo(tbarEle);
            dialogDiv = this.parent.createElement(
                'div', { className: 'e-dlg-div', attrs: { 'aria-label': l10n.getConstant('FindValue') } });
            const sheetPanel: HTMLElement = this.parent.element.getElementsByClassName('e-sheet-panel')[0] as HTMLElement;
            const findDlgModel: DialogModel = {
                cssClass: 'e-findtool-dlg', visible: false, enableRtl: this.parent.enableRtl, target: sheetPanel,
                open: (): void => {
                    EventHandler.add(document, 'click', this.closeDialog, this);
                    if (this.findValue && (!sheet.isProtected || sheet.protectSettings.selectCells ||
                        sheet.protectSettings.selectUnLockedCells)) {
                        const countArgs: { [key: string]: string | number | boolean } = { value: this.findValue, mode: 'Sheet',
                            isCSen: false, sheetIndex: this.parent.activeSheetIndex, isEMatch: false, searchBy: 'By Row' };
                        this.parent.notify(count, countArgs);
                        findSpan.textContent = <string>countArgs.findCount;
                        const enable: boolean = countArgs.findCount !== '0 of 0';
                        toolbarObj.enableItems(1, enable);
                        toolbarObj.enableItems(2, enable);
                    } else {
                        findSpan.textContent = '0 of 0';
                    }
                    updateDisableState(false);
                    const inputContainer: HTMLElement = toolbarObj.element.querySelector('.e-input-group') as HTMLElement;
                    if (inputContainer) {
                        inputContainer.addEventListener('focus', (): void => {
                            const textInput: HTMLInputElement = toolbarObj.element.querySelector('.e-text-findNext-short');
                            focus(textInput);
                            textInput.classList.add('e-input-focus');
                            (textInput).setSelectionRange(0, textInput.value.length);
                        });
                    }
                    if (animationSettings) {
                        this.findDialog.setProperties({ animationSettings: animationSettings }, true);
                    }
                },
                beforeOpen: (): void => focus(this.parent.element),
                beforeClose: (): void => {
                    this.findValue = findTextInput.value || null;
                    toolbarObj.destroy();
                    EventHandler.remove(document, 'click', this.closeDialog);
                },
                close: (): void => {
                    this.findDialog.destroy();
                    this.findDialog = null;
                    detach(dialogDiv);
                    sheetPanel.style.position = '';
                    focus(this.parent.element);
                    updateDisableState(false);
                },
                created: (): void => {
                    sheetPanel.style.position = 'relative';
                    dialogDiv.style.width = this.parent.getMainContent().offsetWidth + 'px';
                    dialogDiv.style.visibility = 'hidden';
                    dialogDiv.style.display = 'block';
                    this.findDialog.width = (parseInt(getComputedStyle(dialogDiv).borderLeftWidth, 10) * 2) +
                        dialogDiv.querySelector('.e-toolbar-items').getBoundingClientRect().width + 'px';
                    dialogDiv.style.display = '';
                    dialogDiv.style.width = '';
                    dialogDiv.style.visibility = '';
                    dialogDiv.style.top =
                        `${(args && args.headerHgt) || (this.parent.getColumnHeaderContent().parentElement.offsetHeight + 1)}px`;
                    dialogDiv.style.left = '';
                    dialogDiv.style[this.parent.enableRtl ? 'left' : 'right'] = `${this.parent.sheetModule.getScrollSize()}px`;
                    this.findDialog.show();
                }
            };
            if (Browser.isDevice) {
                findDlgModel.header = tbarEle;
                findDlgModel.allowDragging = true;
            } else {
                findDlgModel.content = tbarEle;
            }
            this.findDialog = new FindDialog(findDlgModel);
            this.findDialog.createElement = this.parent.createElement;
            let animationSettings: AnimationSettingsModel;
            if (args && args.isPublic) {
                animationSettings = { effect: this.findDialog.animationSettings.effect };
                this.findDialog.setProperties({ animationSettings: { effect: 'None' } }, true);
            }
            this.findDialog.appendTo(dialogDiv);
        }
    }

    private refreshFindDlg(): void {
        const findDialog: HTMLElement = this.findDialog && this.parent.element.getElementsByClassName('e-findtool-dlg')[0] as HTMLElement;
        if (findDialog) {
            const findToolInput: HTMLInputElement = findDialog.querySelector('.e-text-findNext-short') as HTMLInputElement;
            this.findToolDlg({ findValue: findToolInput.value, isPublic: true, refreshPosition: true, dialogEle: findDialog });
        }
    }

    private updateCount(countEle: HTMLElement, isPrev?: boolean): void {
        const values: string[] = countEle.textContent.split(' ');
        let newStart: number;
        if (isPrev) {
            newStart = Number(values[0]) - 1;
            if (newStart < 1) { newStart = Number(values[2]); }
        } else {
            newStart = Number(values[0]) + 1;
            if (newStart > Number(values[2])) { newStart = 1; }
        }
        values[0] = newStart.toString();
        countEle.textContent = values.join(' ');
    }
    private closeDialog(e: MouseEvent & TouchEvent): void {
        if ((closest(e.target as Element, '.e-findRib-close') || !closest(e.target as Element, '.e-spreadsheet')) && this.findDialog) {
            this.findToolDlg({});
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
                beforeClose: this.dialogBeforeClose.bind(this),
                close: (): void => dialogInst.hide()
            };
            dialogInst.show(dlg);
        } else {
            dialogInst.hide();
        }
    }

    private dialogBeforeClose(): void {
        const checkBox: CheckBox = this.checkBoxElements;
        if (checkBox && checkBox.element) {
            checkBox.destroy();
            checkBox.element.remove();
        }
        this.checkBoxElements = null;

        this.textBoxElements.forEach((textBox: TextBox) => {
            if (textBox && textBox.element) {
                textBox.destroy();
                textBox.element.remove();
            }
        });
        this.textBoxElements = [];

        this.dropDownListElements.forEach((dropDownList: DropDownList) => {
            if (dropDownList && dropDownList.element) {
                dropDownList.destroy();
                dropDownList.element.remove();
            }
        });
        this.dropDownListElements = [];

        removeElements(this.paraElements); this.paraElements = [];
        removeElements(this.inputElements); this.inputElements = [];
        removeElements(this.divElements); this.divElements = [];
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

    private showFindAlert(): void {
        if (this.parent.element.querySelector('.e-replace-alert-span')) {
            this.parent.element.querySelector('.e-replace-alert-span').remove();
        }
        const replaceDlgCont: HTMLElement = this.parent.element.querySelector('.e-find-dlg .e-dlg-content');
        if (replaceDlgCont) {
            const findSpan: HTMLElement = this.parent.createElement('span', { className: 'e-find-alert-span' });
            findSpan.innerText = this.parent.serviceLocator.getService<L10n>(locale).getConstant('NoElements');
            replaceDlgCont.appendChild(findSpan);
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

    private divElements: HTMLElement[] = [];
    private paraElements: HTMLElement[] = [];
    private inputElements: HTMLElement[] = [];
    private textBoxElements: TextBox[] = [];
    private dropDownListElements: DropDownList[] = [];
    private checkBoxElements: CheckBox;

    private findandreplaceContent(): HTMLElement {
        if (this.parent.element.querySelector('.e-text-findNext-short') as HTMLInputElement) {
            this.shortValue = (this.parent.element.querySelector('.e-text-findNext-short') as HTMLInputElement).value;
        }
        const dialogElem: HTMLElement = this.parent.createElement('div', { className: 'e-link-dialog' });
        const findElem: HTMLElement = this.parent.createElement('div', { className: 'e-find' });
        const findCheck: HTMLElement = this.parent.createElement('div', { className: 'e-findCheck' });
        this.divElements.push(dialogElem); this.divElements.push(findElem); this.divElements.push(findCheck);
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
        this.divElements.push(findTextE); this.paraElements.push(findTextH); this.inputElements.push(findTextIp);
        findTextE.appendChild(findTextIp);
        findTextE.insertBefore(findTextH, findTextIp);
        findElem.appendChild(findTextE);
        const findTextBox: TextBox = new TextBox({ width: '70%' });
        this.textBoxElements.push(findTextBox);
        findTextBox.createElement = this.parent.createElement;
        findTextBox.appendTo(findTextIp);
        const replaceTextE: HTMLElement = this.parent.createElement('div', { className: 'e-cont' });
        const replaceTextH: HTMLElement = this.parent.createElement('p', { className: 'e-header' });
        replaceTextH.innerText = l10n.getConstant('ReplaceWith');
        const replaceTextIp: HTMLElement = this.parent.createElement('input', {
            className: 'e-input e-text-replaceInp', attrs: { 'type': 'Text', 'placeholder': l10n.getConstant('ReplaceValue') }
        });
        this.divElements.push(replaceTextE); this.paraElements.push(replaceTextH); this.inputElements.push(replaceTextIp);
        replaceTextE.appendChild(replaceTextIp);
        replaceTextE.insertBefore(replaceTextH, replaceTextIp);
        findElem.appendChild(replaceTextE);
        const replaceTextBox: TextBox = new TextBox({ width: '70%' });
        this.textBoxElements.push(replaceTextBox);
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
        this.dropDownListElements.push(withInDDL);
        let label: string = l10n.getConstant('SearchWithin');
        const withIn: HTMLElement = this.parent.createElement('input', {
            className: 'e-findnreplace-searchwithin', attrs: { type: 'select', label: label }
        });
        const withinTextH: HTMLElement = this.parent.createElement('p', { className: 'e-header' });
        withinTextH.innerText = label;
        this.inputElements.push(withIn); this.paraElements.push(withinTextH);
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
        this.dropDownListElements.push(searchDDL);
        label = l10n.getConstant('SearchBy');
        const searchIn: HTMLElement = this.parent.createElement('input', {
            className: 'e-findnreplace-searchby', attrs: { type: 'select', label: label }
        });
        const searchTextH: HTMLElement = this.parent.createElement('p', { className: 'e-header' });
        searchTextH.innerText = label;
        this.inputElements.push(searchIn); this.paraElements.push(searchTextH);
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
        this.inputElements.push(caaseCheckbox);
        findCheck.appendChild(caaseCheckbox);
        isCSen.createElement = this.parent.createElement;
        isCSen.appendTo(caaseCheckbox);
        const isEMatch: CheckBox = new CheckBox({
            label: l10n.getConstant('MatchExactCellElements'), checked: false,
            cssClass: 'e-findnreplace-exactmatchcheckbox'
        });
        this.checkBoxElements = isEMatch;
        const entirematchCheckbox: HTMLElement = this.parent.createElement('input', {
            className: 'e-findnreplace-checkmatch', attrs: { type: 'checkbox' }
        });
        this.inputElements.push(entirematchCheckbox);
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
        if (this.findDialog) {
            this.findDialog.hide();
        }
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
