import { Spreadsheet, DialogBeforeOpenEventArgs, ICellRenderer, completeAction } from '../index';
import { initiateHyperlink, locale, dialog, click, keyUp, createHyperlinkElement, getUpdateUsingRaf, focus } from '../common/index';
import { editHyperlink, openHyperlink, editAlert, removeHyperlink, } from '../common/index';
import { L10n, isNullOrUndefined, closest } from '@syncfusion/ej2-base';
import { Dialog } from '../services';
import { SheetModel } from '../../workbook/base/sheet-model';
import { getRangeIndexes, getCellIndexes, getRangeAddress } from '../../workbook/common/address';
import { CellModel, HyperlinkModel, BeforeHyperlinkArgs, AfterHyperlinkArgs, getTypeFromFormat, getCell } from '../../workbook/index';
import { beforeHyperlinkClick, afterHyperlinkClick, refreshRibbonIcons, deleteHyperlink, beginAction } from '../../workbook/common/event';
import { isCellReference, DefineNameModel } from '../../workbook/index';
import { Tab, TreeView } from '@syncfusion/ej2-navigations';
import { BeforeOpenEventArgs } from '@syncfusion/ej2-popups';

/**
 * `Hyperlink` module
 */
export class SpreadsheetHyperlink {
    private parent: Spreadsheet;

    /**
     * Constructor for Hyperlink module.
     *
     * @param {Spreadsheet} parent - Constructor for Hyperlink module.
     */
    constructor(parent: Spreadsheet) {
        this.parent = parent;
        this.addEventListener();
    }

    /**
     * To destroy the Hyperlink module.
     *
     * @returns {void} - To destroy the Hyperlink module.
     */
    protected destroy(): void {
        this.removeEventListener();
        this.parent = null;
    }

    private addEventListener(): void {
        this.parent.on(initiateHyperlink, this.initiateHyperlinkHandler, this);
        this.parent.on(editHyperlink, this.editHyperlinkHandler, this);
        this.parent.on(openHyperlink, this.openHyperlinkHandler, this);
        this.parent.on(click, this.hyperlinkClickHandler, this);
        this.parent.on(createHyperlinkElement, this.createHyperlinkElementHandler, this);
        this.parent.on(keyUp, this.keyUpHandler, this);
        this.parent.on(deleteHyperlink, this.removeHyperlink, this);
        this.parent.on(removeHyperlink, this.removeHyperlinkHandler, this);
    }

    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(initiateHyperlink, this.initiateHyperlinkHandler);
            this.parent.off(editHyperlink, this.editHyperlinkHandler);
            this.parent.off(openHyperlink, this.openHyperlinkHandler);
            this.parent.off(click, this.hyperlinkClickHandler);
            this.parent.off(createHyperlinkElement, this.createHyperlinkElementHandler);
            this.parent.off(keyUp, this.keyUpHandler);
            this.parent.off(deleteHyperlink, this.removeHyperlink);
            this.parent.off(removeHyperlink, this.removeHyperlinkHandler);
        }
    }

    /**
     * Gets the module name.
     *
     * @returns {string} - Gets the module name.
     */
    protected getModuleName(): string {
        return 'spreadsheetHyperlink';
    }

    private keyUpHandler(e: MouseEvent): void {
        const trgt: Element = e.target as Element;
        if (closest(trgt, '.e-document')) {
            const hyperlinkText: HTMLInputElement = document.querySelector('.e-hyp-text') as HTMLInputElement;
            const hyperlinkSpan: HTMLElement = this.parent.element.querySelector('.e-hyperlink-alert-span');
            const dlgElement: Element = closest(trgt, '.e-hyperlink-dlg') || closest(trgt, '.e-edithyperlink-dlg');
            const footerEle: HTMLElement = dlgElement.getElementsByClassName('e-footer-content')[0] as HTMLElement;
            const insertBut: HTMLElement = footerEle.firstChild as HTMLElement;
            if (hyperlinkText && hyperlinkText.value) {
                if (!isCellReference(hyperlinkText.value.toUpperCase())) {
                    this.showDialog();
                    insertBut.setAttribute('disabled', 'true');
                } else if (hyperlinkSpan) {
                    hyperlinkSpan.remove();
                    insertBut.removeAttribute('disabled');
                }
            }
        }
        if (trgt.classList.contains('e-text') && closest(trgt, '.e-cont')) {
            if (closest(trgt, '.e-webpage') && closest(trgt, '.e-webpage').getElementsByClassName('e-cont')[1] === trgt.parentElement) {
                const dlgEle: Element = closest(trgt, '.e-hyperlink-dlg') || closest(trgt, '.e-edithyperlink-dlg');
                const ftrEle: HTMLElement = dlgEle.getElementsByClassName('e-footer-content')[0] as HTMLElement;
                const insertBut: HTMLElement = ftrEle.firstChild as HTMLElement;
                if ((trgt as CellModel).value !== '') {
                    insertBut.removeAttribute('disabled');
                } else {
                    const linkDialog: Element = closest(trgt, '.e-link-dialog');
                    const webPage: Element = linkDialog.querySelector('.e-webpage');
                    const isUrl: boolean =
                        (webPage.querySelectorAll('.e-cont')[1].querySelector('.e-text') as CellModel).value ? true : false;
                    if (!isUrl) {
                        insertBut.setAttribute('disabled', 'true');
                    }
                }
            }
        }
    }

    private initiateHyperlinkHandler(): void {
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        const sheet: SheetModel = this.parent.getActiveSheet();
        if (sheet.isProtected && !sheet.protectSettings.insertLink) {
            this.parent.notify(editAlert, null);
            return;
        }
        if (!this.parent.element.querySelector('.e-hyperlink-dlg')) {
            const dialogInst: Dialog = (this.parent.serviceLocator.getService(dialog) as Dialog);
            dialogInst.show({
                width: 323, isModal: true, showCloseIcon: true, cssClass: 'e-hyperlink-dlg',
                header: l10n.getConstant('InsertLink'),
                beforeOpen: (args: BeforeOpenEventArgs): void => {
                    const dlgArgs: DialogBeforeOpenEventArgs = {
                        dialogName: 'InsertLinkDialog',
                        element: args.element, target: args.target, cancel: args.cancel
                    };
                    this.parent.trigger('dialogBeforeOpen', dlgArgs);
                    if (dlgArgs.cancel) {
                        args.cancel = true;
                    }
                    dialogInst.dialogInstance.content = this.hyperlinkContent(); dialogInst.dialogInstance.dataBind();
                    focus(this.parent.element);
                },
                open: (): void => {
                    setTimeout(() => {
                        focus(dialogInst.dialogInstance.element.querySelectorAll('.e-webpage input')[1] as HTMLElement);
                    });
                },
                buttons: [{
                    buttonModel: {
                        content: l10n.getConstant('Insert'), isPrimary: true, disabled: true
                    },
                    click: (): void => {
                        this.dlgClickHandler();
                        dialogInst.hide();
                    }
                }]
            });
        }
    }

    private dlgClickHandler(): void {
        let value: string;
        let address: string;
        let sheet: SheetModel = this.parent.getActiveSheet();
        let cellAddress: string = sheet.name + '!' + sheet.selectedRange;
        const item: HTMLElement = this.parent.element.querySelector('.e-link-dialog').
            getElementsByClassName('e-content')[0].querySelector('.e-item.e-active') as HTMLElement;
        if (item) {
            if (item.querySelector('.e-webpage')) {
                value = (item.getElementsByClassName('e-cont')[0].querySelector('.e-text') as CellModel).value;
                address = (item.getElementsByClassName('e-cont')[1].querySelector('.e-text') as CellModel).value;
                const args: HyperlinkModel = { address: address };
                this.parent.insertHyperlink(args, cellAddress, value, false);
            } else {
                value = (item.getElementsByClassName('e-cont')[0].querySelector('.e-text') as CellModel).value;
                address = (item.getElementsByClassName('e-cont')[1].querySelector('.e-text') as CellModel).value;
                const dlgContent: HTMLElement = item.getElementsByClassName('e-cont')[2] as HTMLElement;
                if (dlgContent.getElementsByClassName('e-list-item')[0].querySelector('.e-active')) {
                    const sheetName: string = item.getElementsByClassName('e-cont')[2].querySelector('.e-active').textContent;
                    // const sheets: SheetModel[] = spreadsheetInst.sheets;
                    // for (let idx: number = 0; idx < sheets.length; idx++) {
                    //     if (sheets[idx].name === sheetName) {
                    //         const sheetIdx: number = idx + 1;
                    //     }
                    // }
                    address = sheetName + '!' + address.toUpperCase();
                    const args: HyperlinkModel = { address: address };
                    this.parent.insertHyperlink(args, cellAddress, value, false);
                } else if (dlgContent.querySelector('.e-active')) {
                    const definedName: string = item.getElementsByClassName('e-cont')[2].querySelector('.e-active').textContent;
                    for (let idx: number = 0; idx < this.parent.definedNames.length; idx++) {
                        if (this.parent.definedNames[idx].name === definedName) {
                            const args: HyperlinkModel = {
                                address: this.parent.definedNames[idx].name
                            };
                            this.parent.insertHyperlink(
                                args, cellAddress, value, false);
                        }
                    }
                }
            }
        }
    }
    private showDialog(): void {
        if (this.parent.element.querySelector('.e-hyperlink-alert-span')) {
            this.parent.element.querySelector('.e-hyperlink-alert-span').remove();
        }
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        const hyperlinkSpan: Element = this.parent.createElement('span', {
            className: 'e-hyperlink-alert-span',
            innerHTML: l10n.getConstant('HyperlinkAlert')
        });
        const dlgEle: HTMLElement =
            this.parent.element.querySelector('.e-hyperlink-dlg') || this.parent.element.querySelector('.e-edithyperlink-dlg');
        (dlgEle.querySelector('.e-dlg-content')).appendChild(hyperlinkSpan);
    }
    private editHyperlinkHandler(): void {
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        const dialogInst: Dialog = (this.parent.serviceLocator.getService(dialog) as Dialog);
        dialogInst.show({
            width: 323, isModal: true, showCloseIcon: true, cssClass: 'e-edithyperlink-dlg',
            header: l10n.getConstant('EditLink'),
            beforeOpen: (args: BeforeOpenEventArgs): void => {
                const dlgArgs: DialogBeforeOpenEventArgs = {
                    dialogName: 'EditLinkDialog',
                    element: args.element, target: args.target, cancel: args.cancel
                };
                this.parent.trigger('dialogBeforeOpen', dlgArgs);
                if (dlgArgs.cancel) {
                    args.cancel = true;
                }
                dialogInst.dialogInstance.content = this.hyperEditContent(); dialogInst.dialogInstance.dataBind();
                focus(this.parent.element);
            },
            open: (): void => {
                setTimeout(() => {
                    if (dialogInst.dialogInstance.element.querySelector('.e-webpage')) {
                        focus(dialogInst.dialogInstance.element.querySelectorAll('.e-webpage input')[1] as HTMLElement);
                    } else {
                        focus(dialogInst.dialogInstance.element.querySelectorAll('.e-document input')[1] as HTMLElement);
                    }
                });
            },
            buttons: [{
                buttonModel: {
                    content: l10n.getConstant('Update'), isPrimary: true
                },
                click: (): void => {
                    this.dlgClickHandler();
                    dialogInst.hide();
                }
            }]
        });
    }

    private openHyperlinkHandler(): void {
        const cellIndexes: number[] = getCellIndexes(this.parent.getActiveSheet().activeCell);
        let trgt: HTMLElement = this.parent.getCell(cellIndexes[0], cellIndexes[1]);
        if (trgt.getElementsByClassName('e-hyperlink')[0]) {
            trgt = trgt.querySelector('.e-hyperlink') as HTMLElement;
        }
        this.hlOpenHandler(trgt);
    }

    private hlOpenHandler(trgt: HTMLElement): void {
        if (trgt.classList.contains('e-hyperlink')) {
            trgt.style.color = '#551A8B';
            let cellEle: HTMLElement = closest(trgt, '.e-cell') as HTMLElement;
            if (cellEle) {
                cellEle.style.color = '#551A8B';
            } else {
                return;
            }
            let range: string[] = ['', ''];
            let rangeIndexes: number[];
            let isEmpty: boolean = true;
            let sheet: SheetModel = this.parent.getActiveSheet();
            const colIdx: number = parseInt(cellEle.getAttribute('aria-colindex'), 10) - 1;
            const rowIdx: number = parseInt(cellEle.parentElement.getAttribute('aria-rowindex'), 10) - 1;
            const cell: CellModel = getCell(rowIdx, colIdx, sheet, false, true);
            let rangeAddr: string | HyperlinkModel = cell.hyperlink;
            let address: string;
            const befArgs: BeforeHyperlinkArgs = { hyperlink: rangeAddr, address: sheet.activeCell, target: '_blank', cancel: false };
            this.parent.trigger(beforeHyperlinkClick, befArgs);
            if (befArgs.cancel) { return; }
            rangeAddr = befArgs.hyperlink;
            const aftArgs: AfterHyperlinkArgs = { hyperlink: rangeAddr, address: sheet.activeCell };
            if (typeof (rangeAddr) === 'string') { address = rangeAddr; }
            if (typeof (rangeAddr) === 'object') { address = rangeAddr.address; }
            const definedNameCheck: string = address;
            if (address.indexOf('http://') === -1 && address.indexOf('https://') === -1 && address.indexOf('ftp://') === -1) {
                if (!isNullOrUndefined(address)) {
                    if (this.parent.definedNames) {
                        for (let idx: number = 0; idx < this.parent.definedNames.length; idx++) {
                            if (this.parent.definedNames[idx].name === address) {
                                address = this.parent.definedNames[idx].refersTo;
                                address = address.slice(1);
                                break;
                            }
                        }
                    }
                    if (address.indexOf('!') !== -1) {
                        range = address.split('!');
                        if (range[0].indexOf(' ') !== -1) {
                            range[0] = range[0].slice(1, range[0].length - 1);
                        }
                    } else {
                        range[0] = this.parent.getActiveSheet().name;
                        range[1] = address;
                    }
                    // selRange = range[1];
                    let sheetIdx: number;
                    for (let idx: number = 0; idx < this.parent.sheets.length; idx++) {
                        if (this.parent.sheets[idx].name === range[0]) {
                            sheetIdx = idx;
                        }
                    }
                    sheet = this.parent.sheets[sheetIdx];
                    if (range[1].indexOf(':') !== -1) {
                        const colIndex: number = range[1].indexOf(':');
                        let left: string = range[1].substr(0, colIndex);
                        let right: string = range[1].substr(colIndex + 1, range[1].length);
                        left = left.replace('$', '');
                        right = right.replace('$', '');
                        if (right.match(/\D/g) && !right.match(/[0-9]/g) && left.match(/\D/g) && !left.match(/[0-9]/g)) {
                            // selRange = left + '1' + ':' + right + sheet.rowCount;
                            left = left + '1';
                            right = right + sheet.rowCount;
                            range[1] = left + ':' + right;
                        } else if (!right.match(/\D/g) && right.match(/[0-9]/g) && !left.match(/\D/g) && left.match(/[0-9]/g)) {
                            // selRange = getCellAddress(parseInt(left, 10) - 1, 0) + ':' +
                            //     getCellAddress(parseInt(right, 10) - 1, sheet.colCount - 1);
                            rangeIndexes = [parseInt(left, 10) - 1, 0, parseInt(right, 10) - 1, sheet.colCount - 1];
                            isEmpty = false;
                        }
                    }
                    let isDefinedNamed: boolean;
                    const definedname: DefineNameModel[] = this.parent.definedNames;
                    if (!isNullOrUndefined(definedname)) {
                        for (let idx: number = 0; idx < definedname.length; idx++) {
                            if (definedname[idx].name === definedNameCheck) {
                                isDefinedNamed = true;
                                break;
                            }
                        }
                    }
                    if (isCellReference(range[1]) || isDefinedNamed) {
                        rangeIndexes = isEmpty ? getRangeIndexes(range[1]) : rangeIndexes;
                        if (this.parent.scrollSettings.enableVirtualization) {
                            rangeIndexes[0] = rangeIndexes[0] >= this.parent.viewport.topIndex ?
                                rangeIndexes[0] - this.parent.viewport.topIndex : rangeIndexes[0];
                            rangeIndexes[1] = rangeIndexes[1] >= this.parent.viewport.leftIndex ?
                                rangeIndexes[1] - this.parent.viewport.leftIndex : rangeIndexes[1];
                        }
                        if (!isNullOrUndefined(sheet)) {
                            let rangeAddr: string = getRangeAddress(rangeIndexes);
                            if (sheet === this.parent.getActiveSheet()) {
                                getUpdateUsingRaf((): void => { this.parent.goTo(rangeAddr); });
                            } else {
                                if (rangeAddr.indexOf(':') >= 0) {
                                    const addArr: string[] = rangeAddr.split(':');
                                    rangeAddr = addArr[0] === addArr[1] ? addArr[0] : rangeAddr;
                                }
                                getUpdateUsingRaf((): void => { this.parent.goTo(this.parent.sheets[sheetIdx].name + '!' + rangeAddr); });
                            }
                        }
                    } else {
                        this.showInvalidHyperlinkDialog();
                    }
                }
            } else {
                if (this.isValidUrl(address)) {
                    window.open(address, befArgs.target);
                } else {
                    this.showInvalidHyperlinkDialog();
                }
            }
            this.parent.trigger(afterHyperlinkClick, aftArgs);
        }
    }

    private isValidUrl(url: string): boolean {
        // eslint-disable-next-line no-useless-escape
        return /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/.test(url);
    }

    private showInvalidHyperlinkDialog(): void {
        const dialogInst: Dialog = (this.parent.serviceLocator.getService(dialog) as Dialog);
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        dialogInst.show({
            width: 323, isModal: true, showCloseIcon: true,
            header: l10n.getConstant('Hyperlink'),
            content: l10n.getConstant('InvalidHyperlinkAlert'),
            buttons: [{
                buttonModel: {
                    content: l10n.getConstant('Ok'), isPrimary: true
                },
                click: (): void => {
                    dialogInst.hide();
                }
            }]
        }, false);
    }

    private hyperlinkClickHandler(e: MouseEvent): void {
        const trgt: HTMLElement = e.target as HTMLElement;
        if (closest(trgt, '.e-link-dialog') && closest(trgt, '.e-toolbar-item')) {
            const dlgEle: Element = closest(trgt, '.e-hyperlink-dlg') || closest(trgt, '.e-edithyperlink-dlg');
            const ftrEle: HTMLElement = dlgEle.getElementsByClassName('e-footer-content')[0] as HTMLElement;
            const insertBut: HTMLElement = ftrEle.firstChild as HTMLElement;
            const docEle: Element = dlgEle.querySelector('.e-document');
            const webEle: Element = dlgEle.querySelector('.e-webpage');
            const webEleText: string = webEle ? (webEle.querySelectorAll('.e-cont')[0].querySelector('.e-text') as CellModel).value :
                (docEle.querySelectorAll('.e-cont')[0].querySelector('.e-text') as CellModel).value;
            const docEleText: string = docEle ? (docEle.querySelectorAll('.e-cont')[0].querySelector('.e-text') as CellModel).value :
                webEleText;
            const toolbarItems: Element = closest(trgt, '.e-toolbar-items');
            if (toolbarItems.getElementsByClassName('e-toolbar-item')[1].classList.contains('e-active')) {
                const actEle: Element = docEle.querySelectorAll('.e-cont')[2].querySelector('.e-active');
                (docEle.querySelectorAll('.e-cont')[0].querySelector('.e-text') as CellModel).value = webEleText;
                if (closest(actEle, '.e-list-item').classList.contains('e-level-2') && insertBut.hasAttribute('disabled')) {
                    insertBut.removeAttribute('disabled');
                } else if (closest(actEle, '.e-list-item').classList.contains('e-level-1') && !insertBut.hasAttribute('disabled')) {
                    insertBut.setAttribute('disabled', 'true');
                }
            } else {
                const isEmpty: boolean = (webEle.querySelectorAll('.e-cont')[1].querySelector('.e-text') as CellModel).value ? false : true;
                (webEle.querySelectorAll('.e-cont')[0].querySelector('.e-text') as CellModel).value = docEleText;
                if (isEmpty && !insertBut.hasAttribute('disabled')) {
                    insertBut.setAttribute('disabled', 'true');
                } else if (!isEmpty && insertBut.hasAttribute('disabled')) {
                    insertBut.removeAttribute('disabled');
                }
            }
        }
        if (closest(trgt, '.e-list-item') && trgt.classList.contains('e-fullrow')) {
            let item: HTMLElement = this.parent.element.getElementsByClassName('e-link-dialog')[0] as HTMLElement;
            if (item) {
                item = item.getElementsByClassName('e-content')[0].getElementsByClassName('e-active')[0] as HTMLElement;
            } else {
                return;
            }
            const cellRef: HTMLElement = item.getElementsByClassName('e-cont')[1].getElementsByClassName('e-text')[0] as HTMLElement;
            const dlgEle: Element = closest(trgt, '.e-hyperlink-dlg') || closest(trgt, '.e-edithyperlink-dlg');
            const ftrEle: HTMLElement = dlgEle.getElementsByClassName('e-footer-content')[0] as HTMLElement;
            const insertBut: HTMLElement = ftrEle.firstChild as HTMLElement;
            if (closest(trgt, '.e-list-item').classList.contains('e-level-2')) {
                if (closest(trgt, '.e-list-item').getAttribute('data-uid') === 'defName') {
                    if (!cellRef.classList.contains('e-disabled') && !cellRef.hasAttribute('readonly')) {
                        cellRef.setAttribute('readonly', 'true');
                        cellRef.classList.add('e-disabled');
                        cellRef.setAttribute('disabled', 'true');
                    }
                } else if (closest(trgt, '.e-list-item').getAttribute('data-uid') === 'sheet') {
                    if (cellRef.classList.contains('e-disabled') && cellRef.hasAttribute('readonly')) {
                        cellRef.removeAttribute('readonly');
                        cellRef.classList.remove('e-disabled');
                        cellRef.removeAttribute('disabled');
                    }
                }
                if (insertBut.hasAttribute('disabled')) {
                    insertBut.removeAttribute('disabled');
                }
            } else if (closest(trgt, '.e-list-item').classList.contains('e-level-1')) {
                insertBut.setAttribute('disabled', 'true');
            }
        } else {
            this.hlOpenHandler(trgt);
        }
    }

    private createHyperlinkElementHandler(args: { cell: CellModel, td: HTMLElement, rowIdx: number, colIdx: number }): void {
        const cell: CellModel = args.cell;
        const td: HTMLElement = args.td;
        const hyperEle: HTMLElement = this.parent.createElement('a', { className: 'e-hyperlink e-hyperlink-style' });
        hyperEle.style.color = '#00e';
        if (!isNullOrUndefined(cell.hyperlink)) {
            let hyperlink: string | HyperlinkModel = cell.hyperlink;
            if (typeof (hyperlink) === 'string') {
                if (hyperlink.indexOf('http://') === -1 && hyperlink.indexOf('https://') === -1 &&
                    hyperlink.indexOf('ftp://') === -1 && hyperlink.indexOf('www.') !== -1) {
                    hyperlink = 'http://' + hyperlink;
                }
                if (hyperlink.indexOf('http://') === 0 || hyperlink.indexOf('https://') === 0 || hyperlink.indexOf('ftp://') === 0) {
                    hyperEle.setAttribute('href', hyperlink as string);
                    hyperEle.setAttribute('target', '_blank');
                } else if (hyperlink.includes('=') || hyperlink.includes('!')) {
                    hyperEle.setAttribute('ref', hyperlink as string);
                }
                hyperEle.innerText = td.innerText !== '' ? td.innerText : hyperlink as string;
                td.textContent = '';
                td.innerText = '';
                td.appendChild(hyperEle);
            } else if (typeof (hyperlink) === 'object') {
                if (hyperlink.address.indexOf('http://') === 0 || hyperlink.address.indexOf('https://') === 0 ||
                    hyperlink.address.indexOf('ftp://') === 0) {
                    hyperEle.setAttribute('href', hyperlink.address as string);
                    hyperEle.setAttribute('target', '_blank');
                } else if (hyperlink.address.includes('=') || hyperlink.address.includes('!')) {
                    hyperEle.setAttribute('ref', hyperlink.address as string);
                }
                if (getTypeFromFormat(cell.format) === 'Accounting') {
                    hyperEle.innerHTML = td.innerHTML;
                } else {
                    hyperEle.innerText = td.innerText !== '' ? td.innerText : hyperlink.address as string;
                }
                td.textContent = '';
                td.innerText = '';
                td.appendChild(hyperEle);
            }
        } else if (td.querySelector('a') && cell.hyperlink) {
            if (typeof (cell.hyperlink) === 'string') {
                td.querySelector('a').setAttribute('href', cell.hyperlink);
            }
        }
    }

    private hyperEditContent(): HTMLElement {
        let isWeb: boolean = true;
        const dialog: HTMLElement = this.hyperlinkContent();
        const indexes: number[] = getRangeIndexes(this.parent.getActiveSheet().activeCell);
        const cell: CellModel = this.parent.sheets[this.parent.getActiveSheet().id - 1].rows[indexes[0]].cells[indexes[1]];
        if (this.parent.scrollSettings.enableVirtualization) {
            indexes[0] = indexes[0] - this.parent.viewport.topIndex;
            indexes[1] = indexes[1] - this.parent.viewport.leftIndex;
        }
        let value: string = this.parent.getDisplayText(cell);
        let address: string;
        const hyperlink: string | HyperlinkModel = cell.hyperlink;
        if (typeof (hyperlink) === 'string') {
            address = hyperlink;
            value = value || address;
            if (address.indexOf('http://') === -1 && address.indexOf('https://') === -1 && address.indexOf('ftp://') === -1) {
                isWeb = false;
            }
        } else if (typeof (hyperlink) === 'object') {
            address = hyperlink.address;
            value = value || address;
            if (address.indexOf('http://') === -1 && address.indexOf('https://') === -1 && address.indexOf('ftp://') === -1) {
                isWeb = false;
            }
        }
        let definedNamesCount: number = 0;
        let rangeCount: number = 0;
        const definedNames: DefineNameModel[] = this.parent.definedNames;
        const sheets: SheetModel[] = this.parent.sheets;
        for (let idx: number = 0, len: number = definedNames.length; idx < len; idx++) {
            if (definedNames[idx].name === address) {
                definedNamesCount++;
            }
        }
        for (let idx: number = 0, len: number = sheets.length; idx < len; idx++) {
            if (address.includes(sheets[idx].name)) {
                rangeCount++;
            }
        }
        if (definedNamesCount === 0 && rangeCount === 0) {
            isWeb = true;
        }
        const item: HTMLElement = dialog.querySelector('.e-content') as HTMLElement;
        if (isWeb) {
            const webContElem: HTMLElement = item.querySelector('.e-webpage') as HTMLElement;
            webContElem.getElementsByClassName('e-cont')[0].getElementsByClassName('e-text')[0].setAttribute('value', value);
            if (typeof (hyperlink) === 'string') {
                webContElem.getElementsByClassName('e-cont')[1].querySelector('.e-text').setAttribute('value', hyperlink);
            } else {
                const address: HTMLElement = webContElem.getElementsByClassName('e-cont')[1].querySelector('.e-text') as HTMLElement;
                address.setAttribute('value', hyperlink.address);
            }
        } else {
            let isDefinedNamed: boolean;
            const docContElem: HTMLElement = item.querySelector('.e-document') as HTMLElement;
            docContElem.getElementsByClassName('e-cont')[0].getElementsByClassName('e-text')[0].setAttribute('value', value);
            let rangeArr: string[];
            // let sheet: SheetModel = this.parent.getActiveSheet();
            // let sheetIdx: number;
            if (this.parent.definedNames) {
                for (let idx: number = 0; idx < this.parent.definedNames.length; idx++) {
                    if (this.parent.definedNames[idx].name === address) {
                        isDefinedNamed = true;
                        break;
                    }
                }
            }
            if (isDefinedNamed) {
                const cellRef: HTMLElement = docContElem.getElementsByClassName('e-cont')[1].getElementsByClassName('e-text')[0] as HTMLElement;
                cellRef.setAttribute('readonly', 'true');
                cellRef.classList.add('e-disabled');
                cellRef.setAttribute('disabled', 'true');
                const treeCont: HTMLElement = docContElem.getElementsByClassName('e-cont')[2] as HTMLElement;
                const listEle: HTMLElement = treeCont.querySelectorAll('.e-list-item.e-level-1')[1] as HTMLElement;
                for (let idx: number = 0; idx < listEle.getElementsByTagName('li').length; idx++) {
                    if ((listEle.getElementsByTagName('li')[idx] as HTMLElement).innerText === address) {
                        listEle.getElementsByTagName('li')[idx].classList.add('e-active');
                    }
                }
            } else {
                if (address && address.indexOf('!') !== -1) {
                    rangeArr = address.split('!');
                    // sheetIdx = parseInt(rangeArr[0].replace(/\D/g, ''), 10) - 1;
                    // sheet = this.parent.sheets[sheetIdx];
                }
                const sheetName: string = rangeArr[0];
                docContElem.getElementsByClassName('e-cont')[1].querySelector('.e-text').setAttribute('value', rangeArr[1]);
                const treeCont: HTMLElement = docContElem.getElementsByClassName('e-cont')[2] as HTMLElement;
                const listEle: HTMLElement = treeCont.querySelectorAll('.e-list-item.e-level-1')[0] as HTMLElement;
                for (let idx: number = 0; idx < listEle.getElementsByTagName('li').length; idx++) {
                    if ((listEle.getElementsByTagName('li')[idx] as HTMLElement).innerText === sheetName) {
                        if (listEle.getElementsByTagName('li')[idx].classList.contains('e-active')) {
                            break;
                        } else {
                            listEle.getElementsByTagName('li')[idx].classList.add('e-active');
                        }

                    } else {
                        if (listEle.getElementsByTagName('li')[idx].classList.contains('e-active')) {
                            listEle.getElementsByTagName('li')[idx].classList.remove('e-active');
                        }
                    }
                }

            }
        }
        return dialog;
    }

    private hyperlinkContent(): HTMLElement {
        const l10n: L10n = this.parent.serviceLocator.getService(locale);
        let idx: number = 0; let selIdx: number = 0;
        let isWeb: boolean = true;
        let isDefinedName: boolean;
        let isCellRef: boolean = true;
        let address: string;
        const indexes: number[] = getRangeIndexes(this.parent.getActiveSheet().activeCell);
        const sheet: SheetModel = this.parent.getActiveSheet();
        const cell: CellModel = getCell(indexes[0], indexes[1], sheet);
        let isEnable: boolean = true;
        if (cell) {
            if ((cell.value && typeof (cell.value) === 'string' && cell.value.match('[A-Za-z]+') !== null) ||
                cell.value === '' || isNullOrUndefined(cell.value)) {
                isEnable = true;
            } else {
                isEnable = false;
            }
            const hyperlink: string | HyperlinkModel = cell.hyperlink;
            if (typeof (hyperlink) === 'string') {
                const hl: string = hyperlink;
                if (hl.indexOf('http://') === -1 && hl.indexOf('https://') === -1 && hl.indexOf('ftp://') === -1) {
                    address = hyperlink;
                    isWeb = false;
                }
            } else if (typeof (hyperlink) === 'object') {
                const hl: string = hyperlink.address;
                if (hl.indexOf('http://') === -1 && hl.indexOf('https://') === -1 && hl.indexOf('ftp://') === -1) {
                    address = hyperlink.address;
                    isWeb = false;
                }
            }
            if (address) {
                let defNamesCnt: number = 0;
                let rangeCnt: number = 0;
                const definedNames: DefineNameModel[] = this.parent.definedNames;
                const sheets: SheetModel[] = this.parent.sheets;
                for (let idx: number = 0, len: number = sheets.length; idx < len; idx++) {
                    if (address.includes(sheets[idx].name)) {
                        rangeCnt++;
                    }
                }
                for (let idx: number = 0, len: number = definedNames.length; idx < len; idx++) {
                    if (definedNames[idx].name === address) {
                        defNamesCnt++;
                    }
                }
                if (defNamesCnt === 0 && rangeCnt === 0) {
                    isWeb = true;
                }
            }
            if (isWeb) {
                selIdx = 0;
            } else {
                selIdx = 1;
            }

            if (this.parent.definedNames) {
                for (let idx: number = 0; idx < this.parent.definedNames.length; idx++) {
                    if (this.parent.definedNames[idx].name === address) {
                        isDefinedName = true;
                        isCellRef = false;
                        break;
                    }
                }
            }
        }
        const dialogElem: HTMLElement = this.parent.createElement('div', { className: 'e-link-dialog' });
        const webContElem: HTMLElement = this.parent.createElement('div', { className: 'e-webpage' });
        const docContElem: HTMLElement = this.parent.createElement('div', { className: 'e-document' });
        const headerTabs: Tab = new Tab({
            selectedItem: selIdx,
            items: [
                {
                    header: { 'text': l10n.getConstant('WebPage') },
                    content: webContElem
                },
                {
                    header: { 'text': l10n.getConstant('ThisDocument') },
                    content: docContElem
                }
            ]
        });
        headerTabs.appendTo(dialogElem);
        if (isWeb) {
            dialogElem.querySelector('.e-toolbar-items').querySelector('.e-indicator').setAttribute('style', 'left: 0; right: 136px');
        } else {
            dialogElem.querySelector('.e-toolbar-items').querySelector('.e-indicator').setAttribute('style', 'left: 136px; right: 0');
        }
        const textCont: HTMLElement = this.parent.createElement('div', { className: 'e-cont' });
        const urlCont: HTMLElement = this.parent.createElement('div', { className: 'e-cont' });
        const textH: HTMLElement = this.parent.createElement('div', { className: 'e-header', innerHTML: l10n.getConstant('DisplayText') });
        const urlH: HTMLElement = this.parent.createElement('div', { className: 'e-header', innerHTML: l10n.getConstant('Url') });
        const textInput: HTMLElement = this.parent.createElement('input', { className: 'e-input e-text', attrs: { 'type': 'Text' } });
        if (!isEnable) {
            textInput.classList.add('e-disabled');
            textInput.setAttribute('readonly', 'true');
            textInput.setAttribute('disabled', 'true');
        }
        if (cell && isNullOrUndefined(cell.hyperlink)) {
            textInput.setAttribute('value', this.parent.getDisplayText(cell));
        }
        const urlInput: HTMLElement = this.parent.createElement('input', { className: 'e-input e-text', attrs: { 'type': 'Text' } });
        textInput.setAttribute('placeholder', l10n.getConstant('EnterTheTextToDisplay'));
        urlInput.setAttribute('placeholder', l10n.getConstant('EnterTheUrl'));
        textCont.appendChild(textInput);
        textCont.insertBefore(textH, textInput);
        urlCont.appendChild(urlInput);
        urlCont.insertBefore(urlH, urlInput);
        webContElem.appendChild(urlCont);
        webContElem.insertBefore(textCont, urlCont);
        const cellRef: Object[] = [];
        const definedName: object[] = [];
        const sheets: SheetModel[] = this.parent.sheets;
        for (idx; idx < this.parent.sheets.length; idx++) {
            const sheetName: string = this.parent.sheets[idx].name;
            if (this.parent.sheets[idx].state === 'Visible') {
                if (sheets[idx] === this.parent.getActiveSheet()) {
                    cellRef.push({
                        nodeId: 'sheet',
                        nodeText: sheetName.indexOf(' ') !== -1 ? '\'' + sheetName + '\'' : sheetName,
                        selected: true
                    });
                } else {
                    cellRef.push({
                        nodeId: 'sheet',
                        nodeText: sheetName.indexOf(' ') !== -1 ? '\'' + sheetName + '\'' : sheetName
                    });
                }
            }
        }
        for (idx = 0; idx < this.parent.definedNames.length; idx++) {
            definedName.push({
                nodeId: 'defName',
                nodeText: this.parent.definedNames[idx].name
            });
        }
        const data: { [key: string]: Object }[] = [
            {
                nodeId: '01', nodeText: l10n.getConstant('CellReference'), expanded: isCellRef,
                nodeChild: cellRef
            },
            {
                nodeId: '02', nodeText: l10n.getConstant('DefinedNames'), expanded: isDefinedName,
                nodeChild: definedName
            }
        ];
        const treeObj: TreeView = new TreeView({
            fields: { dataSource: data, id: 'nodeId', text: 'nodeText', child: 'nodeChild' }
        });
        const cellrefCont: HTMLElement = this.parent.createElement('div', { className: 'e-cont' });
        const cellrefH: HTMLElement = this.parent.createElement(
            'div', { className: 'e-header', innerHTML: l10n.getConstant('CellReference') });
        const cellrefInput: HTMLElement = this.parent.createElement('input', {
            className: 'e-input e-text e-hyp-text',
            attrs: { 'type': 'Text' }
        });
        cellrefInput.setAttribute('value', 'A1');
        cellrefCont.appendChild(cellrefInput);
        cellrefCont.insertBefore(cellrefH, cellrefInput);
        const textCont1: HTMLElement = this.parent.createElement('div', { className: 'e-cont' });
        const textH1: HTMLElement = this.parent.createElement('div', { className: 'e-header', innerHTML: l10n.getConstant('DisplayText') });
        const textInput1: HTMLElement = this.parent.createElement('input', { className: 'e-input e-text', attrs: { 'type': 'Text' } });
        if (!isEnable) {
            textInput1.classList.add('e-disabled');
            textInput1.setAttribute('readonly', 'true');
            textInput1.setAttribute('disabled', 'true');
        }
        if (cell && isNullOrUndefined(cell.hyperlink)) {
            textInput1.setAttribute('value', this.parent.getDisplayText(cell));
        }
        textInput1.setAttribute('placeholder', l10n.getConstant('EnterTheTextToDisplay'));
        textCont1.appendChild(textInput1);
        textCont1.insertBefore(textH1, textInput1);
        const sheetCont: HTMLElement = this.parent.createElement('div', { className: 'e-cont' });
        const sheetH: HTMLElement = this.parent.createElement('div', { className: 'e-header', innerHTML: l10n.getConstant('Sheet') });
        const refCont: HTMLElement = this.parent.createElement('div', { className: 'e-refcont' });
        sheetCont.appendChild(refCont);
        sheetCont.insertBefore(sheetH, refCont);
        docContElem.appendChild(cellrefCont);
        docContElem.insertBefore(textCont1, cellrefCont);
        treeObj.appendTo(refCont);
        docContElem.appendChild(sheetCont);
        return dialogElem;
    }

    private removeHyperlink(args: { sheet: SheetModel, rowIdx: number, colIdx: number, preventRefresh?: boolean }): void {
        const cell: CellModel = getCell(args.rowIdx, args.colIdx, args.sheet);
        if (cell && cell.hyperlink) {
            if (typeof (cell.hyperlink) === 'string') {
                cell.value = cell.value ? cell.value : cell.hyperlink;
            } else {
                cell.value = cell.value ? cell.value : cell.hyperlink.address;
            }
            delete (cell.hyperlink);
            if (cell.style) { delete cell.style.textDecoration; delete cell.style.color; }
            if (cell.validation){
                if (cell.validation.isHighlighted){
                    if (cell.style.backgroundColor){
                        cell.style.color = '#ff0000';
                    }
                }
            }
            if (args.sheet === this.parent.getActiveSheet()) {
                if (cell.style) { this.parent.notify(refreshRibbonIcons, null); }
                if (!args.preventRefresh) {
                    this.parent.serviceLocator.getService<ICellRenderer>('cell').refreshRange(
                        [args.rowIdx, args.colIdx, args.rowIdx, args.colIdx]);
                }
            }
        }
    }

    private removeHyperlinkHandler(args: { range: string, preventEventTrigger?: boolean }): void {
        let range: string = args.range;
        let rangeArr: string[];
        let sheet: SheetModel = this.parent.getActiveSheet();
        let sheetIdx: number;
        if (!args.preventEventTrigger) {
            const eventArgs: { address: string, cancel: boolean } = { address: range.indexOf('!') === -1 ? sheet.name + '!' + range : range, cancel: false };
            this.parent.notify(beginAction, { action: 'removeHyperlink', eventArgs: eventArgs });
            if (eventArgs.cancel) {
                return;
            }
        }
        if (range && range.indexOf('!') !== -1) {
            rangeArr = range.split('!');
            const sheets: SheetModel[] = this.parent.sheets;
            for (let idx: number = 0; idx < sheets.length; idx++) {
                if (sheets[idx].name === rangeArr[0]) {
                    sheetIdx = idx;
                }
            }
            sheet = this.parent.sheets[sheetIdx];
            range = rangeArr[1];
        }
        const rangeIndexes: number[] = range ? getRangeIndexes(range) : getRangeIndexes(sheet.activeCell);
        for (let rowIdx: number = rangeIndexes[0]; rowIdx <= rangeIndexes[2]; rowIdx++) {
            for (let colIdx: number = rangeIndexes[1]; colIdx <= rangeIndexes[3]; colIdx++) {
                if (sheet && sheet.rows[rowIdx] && sheet.rows[rowIdx].cells[colIdx]) {
                    const prevELem: HTMLElement = this.parent.getCell(rowIdx, colIdx);
                    const classList: string[] = [];
                    for (let i: number = 0; i < prevELem.classList.length; i++) {
                        classList.push(prevELem.classList[i]);
                    }
                    this.parent.notify(deleteHyperlink, { sheet: sheet, rowIdx: rowIdx, colIdx: colIdx });
                    for (let i: number = 0; i < classList.length; i++) {
                        if (!this.parent.getCell(rowIdx, colIdx).classList.contains(classList[i])) {
                            this.parent.getCell(rowIdx, colIdx).classList.add(classList[i]);
                        }
                    }
                }
            }
        }
        if (!args.preventEventTrigger) {
            this.parent.notify(completeAction, { action: 'removeHyperlink', eventArgs: { address: range.indexOf('!') === -1 ? sheet.name + '!' + range : range } });
        }
    }
}
