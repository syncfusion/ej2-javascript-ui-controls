import { Spreadsheet } from '../index';
import { initiateHyperlink, locale, dialog, click, getUpdateUsingRaf, keyUp, createHyperlinkElement } from '../common/index';
import { editHyperlink, removeHyperlink, openHyperlink } from '../common/index';
import { L10n, isNullOrUndefined, closest } from '@syncfusion/ej2-base';
import { Dialog } from '../services';
import { SheetModel } from '../../workbook/base/sheet-model';
import { getRangeIndexes, getRangeAddress, getCellIndexes, getCellAddress } from '../../workbook/common/address';
import { CellModel, HyperlinkModel, BeforeHyperlinkArgs, AfterHyperlinkArgs } from '../../workbook';
import { beforeHyperlinkClick, afterHyperlinkClick } from '../../workbook/common/event';
import { Tab, TreeView } from '@syncfusion/ej2-navigations';

/**
 * `Hyperlink` module 
 */
export class SpreadsheetHyperlink {
    private parent: Spreadsheet;

    /**
     * Constructor for Hyperlink module.
     */
    constructor(parent: Spreadsheet) {
        this.parent = parent;
        this.addEventListener();
    }

    /**
     * To destroy the Hyperlink module.
     * @return {void}
     */
    protected destroy(): void {
        this.removeEventListener();
        this.parent = null;
    }

    private addEventListener(): void {
        this.parent.on(initiateHyperlink, this.initiateHyperlinkHandler, this);
        this.parent.on(editHyperlink, this.editHyperlinkHandler, this);
        this.parent.on(removeHyperlink, this.removeHyperlinkHandler, this);
        this.parent.on(openHyperlink, this.openHyperlinkHandler, this);
        this.parent.on(click, this.clickHandler, this);
        this.parent.on(createHyperlinkElement, this.createHyperlinkElementHandler, this);
        this.parent.on(keyUp, this.keyUpHandler, this);
    }

    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(initiateHyperlink, this.initiateHyperlinkHandler);
            this.parent.off(editHyperlink, this.editHyperlinkHandler);
            this.parent.off(removeHyperlink, this.removeHyperlinkHandler);
            this.parent.off(openHyperlink, this.openHyperlinkHandler);
            this.parent.off(click, this.clickHandler);
            this.parent.off(createHyperlinkElement, this.createHyperlinkElementHandler);
            this.parent.off(keyUp, this.keyUpHandler);
        }
    }

    /**
     * Gets the module name.
     * @returns string
     */
    protected getModuleName(): string {
        return 'spreadsheetHyperlink';
    }

    private keyUpHandler(e: MouseEvent): void {
        let trgt: Element = e.target as Element;
        if (trgt.classList.contains('e-text') && closest(trgt, '.e-cont')) {
            if (closest(trgt, '.e-webpage') && closest(trgt, '.e-webpage').getElementsByClassName('e-cont')[1] === trgt.parentElement) {
                let dlgEle: Element = closest(trgt, '.e-hyperlink-dlg') || closest(trgt, '.e-edithyperlink-dlg');
                let ftrEle: HTMLElement = dlgEle.getElementsByClassName('e-footer-content')[0] as HTMLElement;
                let insertBut: HTMLElement = ftrEle.firstChild as HTMLElement;
                if ((trgt as CellModel).value !== '') {
                    insertBut.removeAttribute('disabled');
                } else {
                    let linkDialog: Element = closest(trgt, '.e-link-dialog');
                    let webPage: Element = linkDialog.querySelector('.e-webpage');
                    let isUrl: boolean =
                        (webPage.querySelectorAll('.e-cont')[1].querySelector('.e-text') as CellModel).value ? true : false;
                    if (!isUrl) {
                        insertBut.setAttribute('disabled', 'true');
                    }
                }
            }
        }
    }

    private initiateHyperlinkHandler(): void {
        let l10n: L10n = this.parent.serviceLocator.getService(locale);
        if (!this.parent.element.querySelector('.e-dlg-container')) {
            let dialogInst: Dialog = (this.parent.serviceLocator.getService(dialog) as Dialog);
            dialogInst.show({
                width: 323, isModal: true, showCloseIcon: true, cssClass: 'e-hyperlink-dlg',
                header: l10n.getConstant('InsertLink'),
                beforeOpen: (): void => {
                    dialogInst.dialogInstance.content = this.hyperlinkContent(); dialogInst.dialogInstance.dataBind();
                    this.parent.element.focus();
                },
                buttons: [{
                    buttonModel: {
                        content: l10n.getConstant('Insert'), isPrimary: true, disabled: true
                    },
                    click: (): void => {
                        this.dlgClickHandler(dialogInst);
                        dialogInst.hide();
                    }
                }]
            });
        }
    }

    private dlgClickHandler(dialogInst: Dialog): void {
        let value: string;
        let address: string;
        let spreadsheetInst: Spreadsheet = this.parent;
        let item: HTMLElement = this.parent.element.querySelector('.e-link-dialog').
            getElementsByClassName('e-content')[0].querySelector('.e-item.e-active') as HTMLElement;
        if (item) {
            if (item.querySelector('.e-webpage')) {
                value = (item.getElementsByClassName('e-cont')[0].querySelector('.e-text') as CellModel).value;
                address = (item.getElementsByClassName('e-cont')[1].querySelector('.e-text') as CellModel).value;
                let args: HyperlinkModel = { address: address };
                this.parent.insertHyperlink(args, this.parent.getActiveSheet().activeCell, value, false);
            } else {
                value = (item.getElementsByClassName('e-cont')[0].querySelector('.e-text') as CellModel).value;
                address = (item.getElementsByClassName('e-cont')[1].querySelector('.e-text') as CellModel).value;
                let sheetIdx: number;
                let dlgContent: HTMLElement = item.getElementsByClassName('e-cont')[2] as HTMLElement;
                if (dlgContent.getElementsByClassName('e-list-item')[0].querySelector('.e-active')) {
                    let sheetName: string = item.getElementsByClassName('e-cont')[2].querySelector('.e-active').textContent;
                    let sheets: SheetModel[] = spreadsheetInst.sheets;
                    for (let idx: number = 0; idx < sheets.length; idx++) {
                        if (sheets[idx].name === sheetName) {
                            sheetIdx = idx + 1;
                        }
                    }
                    address = sheetName + '!' + address.toUpperCase();
                    let args: HyperlinkModel = { address: address };
                    this.parent.insertHyperlink(args, this.parent.getActiveSheet().activeCell, value, false);
                } else if (dlgContent.querySelector('.e-active')) {
                    let definedName: string = item.getElementsByClassName('e-cont')[2].querySelector('.e-active').textContent;
                    for (let idx: number = 0; idx < this.parent.definedNames.length; idx++) {
                        if (this.parent.definedNames[idx].name === definedName) {
                            let args: HyperlinkModel = {
                                address: this.parent.definedNames[idx].name,
                            };
                            this.parent.insertHyperlink(
                                args, this.parent.getActiveSheet().activeCell, value, false);
                        }
                    }
                }
            }
        }
    }

    private editHyperlinkHandler(): void {
        let isWeb: boolean = true;
        let l10n: L10n = this.parent.serviceLocator.getService(locale);
        let dialogInst: Dialog = (this.parent.serviceLocator.getService(dialog) as Dialog);
        dialogInst.show({
            width: 323, isModal: true, showCloseIcon: true, cssClass: 'e-edithyperlink-dlg',
            header: l10n.getConstant('EditLink'),
            beforeOpen: (): void => {
                dialogInst.dialogInstance.content = this.hyperEditContent(); dialogInst.dialogInstance.dataBind();
                this.parent.element.focus();
            },
            buttons: [{
                buttonModel: {
                    content: l10n.getConstant('Update'), isPrimary: true
                },
                click: (): void => {
                    this.dlgClickHandler(dialogInst);
                    dialogInst.hide();
                }
            }]
        });
    }

    private openHyperlinkHandler(): void {
        let cellIndexes: number[] = getCellIndexes(this.parent.getActiveSheet().activeCell);
        let trgt: HTMLElement = this.parent.getCell(cellIndexes[0], cellIndexes[1]);
        if (trgt.getElementsByClassName('e-hyperlink')[0]) {
            trgt = trgt.querySelector('.e-hyperlink') as HTMLElement;
        }
        this.hlOpenHandler(trgt);
    }

    private removeHyperlinkHandler(cell: string): void {
        this.parent.removeHyperlink(cell);
    }

    // tslint:disable-next-line:max-func-body-length
    private hlOpenHandler(trgt: HTMLElement): void {
        if (trgt.classList.contains('e-hyperlink')) {
            let range: string[] = ['', ''];
            let selRange: string;
            let rangeIndexes: number[];
            let isEmpty: boolean = true;
            trgt.style.color = '#551A8B';
            let sheet: SheetModel = this.parent.getActiveSheet();
            let colIdx: number = parseInt(trgt.parentElement.getAttribute('aria-colindex'), 10) - 1;
            let rowIdx: number = parseInt(trgt.parentElement.parentElement.getAttribute('aria-rowindex'), 10) - 1;
            let rangeAddr: string | HyperlinkModel = sheet.rows[rowIdx].cells[colIdx].hyperlink;
            let address: string;
            let befArgs: BeforeHyperlinkArgs;
            let aftArgs: AfterHyperlinkArgs;
            befArgs = { hyperlink: rangeAddr, cell: this.parent.getActiveSheet().activeCell, target: '_blank', cancel: false };
            this.parent.trigger(beforeHyperlinkClick, befArgs);
            if (befArgs.cancel) { return; }
            rangeAddr = befArgs.hyperlink;
            aftArgs = { hyperlink: rangeAddr, cell: this.parent.getActiveSheet().activeCell };
            if (typeof (rangeAddr) === 'string') { address = rangeAddr; }
            if (typeof (rangeAddr) === 'object') { address = rangeAddr.address; }
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
                    selRange = range[1];
                    let sheetIdx: number;
                    for (let idx: number = 0; idx < this.parent.sheets.length; idx++) {
                        if (this.parent.sheets[idx].name === range[0]) {
                            sheetIdx = idx;
                        }
                    }
                    sheet = this.parent.sheets[sheetIdx];
                    if (range[1].indexOf(':') !== -1) {
                        let colIndex: number = range[1].indexOf(':');
                        let left: string = range[1].substr(0, colIndex);
                        let right: string = range[1].substr(colIndex + 1, range[1].length);
                        left = left.replace('$', '');
                        right = right.replace('$', '');
                        if (right.match(/\D/g) && !right.match(/[0-9]/g) && left.match(/\D/g) && !left.match(/[0-9]/g)) {
                            selRange = left + '1' + ':' + right + sheet.rowCount;
                            left = left + '1';
                            right = right + sheet.rowCount;
                            range[1] = left + ':' + right;
                        } else if (!right.match(/\D/g) && right.match(/[0-9]/g) && !left.match(/\D/g) && left.match(/[0-9]/g)) {
                            selRange = getCellAddress(parseInt(left, 10) - 1, 0) + ':' +
                             getCellAddress(parseInt(right, 10) - 1, sheet.colCount - 1);
                            rangeIndexes = [parseInt(left, 10) - 1, 0, parseInt(right, 10) - 1, sheet.colCount - 1];
                            isEmpty = false;
                        }
                    }
                    rangeIndexes = isEmpty ? getRangeIndexes(range[1]) : rangeIndexes;
                    if (this.parent.scrollSettings.enableVirtualization) {
                        rangeIndexes[0] = rangeIndexes[0] >= this.parent.viewport.topIndex ?
                            rangeIndexes[0] - this.parent.viewport.topIndex : rangeIndexes[0];
                        rangeIndexes[1] = rangeIndexes[1] >= this.parent.viewport.leftIndex ?
                            rangeIndexes[1] - this.parent.viewport.leftIndex : rangeIndexes[1];
                    }
                    if (!isNullOrUndefined(sheet)) {
                        if (sheet === this.parent.getActiveSheet()) {
                            this.parent.selectRange(getRangeAddress(rangeIndexes));
                        } else {
                            sheet.selectedRange = selRange;
                            this.parent.activeSheetTab = sheetIdx + 1;
                            this.parent.dataBind();
                        }
                        if (this.parent.scrollSettings.enableVirtualization) {
                            rangeIndexes[0] = rangeIndexes[0] >= this.parent.viewport.rowCount ?
                                rangeIndexes[0] - (this.parent.viewport.rowCount - 2) : 0;
                            rangeIndexes[2] = rangeIndexes[2] >= this.parent.viewport.rowCount ?
                                rangeIndexes[2] - (this.parent.viewport.rowCount - 2) : 0;
                            rangeIndexes[1] = rangeIndexes[1] >= this.parent.viewport.colCount ?
                                rangeIndexes[1] - (this.parent.viewport.colCount - 2) : 0;
                            rangeIndexes[3] = rangeIndexes[3] >= this.parent.viewport.colCount ?
                                rangeIndexes[3] - (this.parent.viewport.colCount - 2) : 0;
                        }
                        let rangeAddr: string = getRangeAddress(rangeIndexes);
                        getUpdateUsingRaf((): void => { this.parent.goTo(rangeAddr); });
                    }
                }
            } else {
                trgt.setAttribute('target', befArgs.target);
            }
            this.parent.trigger(afterHyperlinkClick, aftArgs);
        }
    }

    private clickHandler(e: MouseEvent): void {
        let trgt: HTMLElement = e.target as HTMLElement;
        if (closest(trgt, '.e-dlg-content') && closest(trgt, '.e-toolbar-item')) {
            let dlgEle: Element = closest(trgt, '.e-hyperlink-dlg') || closest(trgt, '.e-edithyperlink-dlg');
            let ftrEle: HTMLElement = dlgEle.getElementsByClassName('e-footer-content')[0] as HTMLElement;
            let insertBut: HTMLElement = ftrEle.firstChild as HTMLElement;
            let docEle: Element = dlgEle.querySelector('.e-document');
            let webEle: Element = dlgEle.querySelector('.e-webpage');
            let webEleText: string = webEle ? (webEle.querySelectorAll('.e-cont')[0].querySelector('.e-text') as CellModel).value :
                (docEle.querySelectorAll('.e-cont')[0].querySelector('.e-text') as CellModel).value;
            let docEleText: string = docEle ? (docEle.querySelectorAll('.e-cont')[0].querySelector('.e-text') as CellModel).value :
                webEleText;
            let toolbarItems: Element = closest(trgt, '.e-toolbar-items');
            if (toolbarItems.getElementsByClassName('e-toolbar-item')[1].classList.contains('e-active')) {
                let actEle: Element = docEle.querySelectorAll('.e-cont')[2].querySelector('.e-active');
                (docEle.querySelectorAll('.e-cont')[0].querySelector('.e-text') as CellModel).value = webEleText;
                if (closest(actEle, '.e-list-item').classList.contains('e-level-2') && insertBut.hasAttribute('disabled')) {
                    insertBut.removeAttribute('disabled');
                } else if (closest(actEle, '.e-list-item').classList.contains('e-level-1') && !insertBut.hasAttribute('disabled')) {
                    insertBut.setAttribute('disabled', 'true');
                }
            } else {
                let isEmpty: boolean = (webEle.querySelectorAll('.e-cont')[1].querySelector('.e-text') as CellModel).value ? false : true;
                (webEle.querySelectorAll('.e-cont')[0].querySelector('.e-text') as CellModel).value = docEleText;
                if (isEmpty && !insertBut.hasAttribute('disabled')) {
                    insertBut.setAttribute('disabled', 'true');
                } else if (!isEmpty && insertBut.hasAttribute('disabled')) {
                    insertBut.removeAttribute('disabled');
                }
            }
        }
        if (closest(trgt, '.e-list-item') && trgt.classList.contains('e-fullrow')) {
            let item: HTMLElement = this.parent.element.getElementsByClassName('e-link-dialog')[0].
                getElementsByClassName('e-content')[0].getElementsByClassName('e-active')[0] as HTMLElement;
            let cellRef: HTMLElement = item.getElementsByClassName('e-cont')[1].getElementsByClassName('e-text')[0] as HTMLElement;
            let dlgEle: Element = closest(trgt, '.e-hyperlink-dlg') || closest(trgt, '.e-edithyperlink-dlg');
            let ftrEle: HTMLElement = dlgEle.getElementsByClassName('e-footer-content')[0] as HTMLElement;
            let insertBut: HTMLElement = ftrEle.firstChild as HTMLElement;
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
        let cell: CellModel = args.cell;
        let td: HTMLElement = args.td;
        let rowIdx: number = args.rowIdx;
        let colIdx: number = args.colIdx;
        let hyperEle: HTMLElement = this.parent.createElement('a', { className: 'e-hyperlink' });
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
                hyperEle.innerText = td.innerText !== '' ? td.innerText : hyperlink.address as string;
                td.textContent = '';
                td.innerText = '';
                td.appendChild(hyperEle);
            }
        }
    }

    private hyperEditContent(): HTMLElement {
        let isWeb: boolean = true;
        let dialog: HTMLElement = this.hyperlinkContent();
        let indexes: number[] = getRangeIndexes(this.parent.getActiveSheet().activeCell);
        let cell: CellModel = this.parent.sheets[this.parent.getActiveSheet().id - 1].rows[indexes[0]].cells[indexes[1]];
        if (this.parent.scrollSettings.enableVirtualization) {
            indexes[0] = indexes[0] - this.parent.viewport.topIndex;
            indexes[1] = indexes[1] - this.parent.viewport.leftIndex;
        }
        let value: string = this.parent.getDisplayText(cell);
        let address: string;
        let hyperlink: string | HyperlinkModel = cell.hyperlink;
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
        let item: HTMLElement = dialog.querySelector('.e-content') as HTMLElement;
        if (isWeb) {
            let webContElem: HTMLElement = item.querySelector('.e-webpage') as HTMLElement;
            webContElem.getElementsByClassName('e-cont')[0].getElementsByClassName('e-text')[0].setAttribute('value', value);
            if (typeof (hyperlink) === 'string') {
                webContElem.getElementsByClassName('e-cont')[1].querySelector('.e-text').setAttribute('value', hyperlink);
            } else {
                let address: HTMLElement;
                address = webContElem.getElementsByClassName('e-cont')[1].querySelector('.e-text') as HTMLElement;
                address.setAttribute('value', hyperlink.address);
            }
        } else {
            let isDefinedNamed: boolean;
            let docContElem: HTMLElement = item.querySelector('.e-document') as HTMLElement;
            docContElem.getElementsByClassName('e-cont')[0].getElementsByClassName('e-text')[0].setAttribute('value', value);
            let rangeArr: string[];
            let sheet: SheetModel = this.parent.getActiveSheet();
            let sheetIdx: number;
            if (this.parent.definedNames) {
                for (let idx: number = 0; idx < this.parent.definedNames.length; idx++) {
                    if (this.parent.definedNames[idx].name === address) {
                        isDefinedNamed = true;
                        break;
                    }
                }
            }
            if (isDefinedNamed) {
                let cellRef: HTMLElement;
                cellRef = docContElem.getElementsByClassName('e-cont')[1].getElementsByClassName('e-text')[0] as HTMLElement;
                cellRef.setAttribute('readonly', 'true');
                cellRef.classList.add('e-disabled');
                cellRef.setAttribute('disabled', 'true');
                let treeCont: HTMLElement = docContElem.getElementsByClassName('e-cont')[2] as HTMLElement;
                let listEle: HTMLElement = treeCont.querySelectorAll('.e-list-item.e-level-1')[1] as HTMLElement;
                for (let idx: number = 0; idx < listEle.getElementsByTagName('li').length; idx++) {
                    if ((listEle.getElementsByTagName('li')[idx] as HTMLElement).innerText === address) {
                        listEle.getElementsByTagName('li')[idx].classList.add('e-active');
                    }
                }
            } else {
                if (address && address.indexOf('!') !== -1) {
                    rangeArr = address.split('!');
                    sheetIdx = parseInt(rangeArr[0].replace(/\D/g, ''), 10) - 1;
                    sheet = this.parent.sheets[sheetIdx];
                }
                let sheetName: string = rangeArr[0];
                docContElem.getElementsByClassName('e-cont')[1].querySelector('.e-text').setAttribute('value', rangeArr[1]);
                let treeCont: HTMLElement = docContElem.getElementsByClassName('e-cont')[2] as HTMLElement;
                let listEle: HTMLElement = treeCont.querySelectorAll('.e-list-item.e-level-1')[0] as HTMLElement;
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

    // tslint:disable-next-line:max-func-body-length
    private hyperlinkContent(): HTMLElement {
        let l10n: L10n = this.parent.serviceLocator.getService(locale);
        let idx: number = 0; let selIdx: number = 0;
        let isWeb: boolean = true;
        let isDefinedName: boolean;
        let isCellRef: boolean = true;
        let address: string;
        let indexes: number[] = getRangeIndexes(this.parent.getActiveSheet().activeCell);
        let sheet: SheetModel = this.parent.getActiveSheet();
        let cell: CellModel = this.parent.sheets[this.parent.getActiveSheet().id - 1].rows[indexes[0]].cells[indexes[1]];
        let isEnable: boolean = true;
        if (sheet.rows[indexes[0]] && sheet.rows[indexes[0]].cells[indexes[1]]) {
            let cell: CellModel = sheet.rows[indexes[0]].cells[indexes[1]];
            if ((cell.value && typeof (cell.value) === 'string' && cell.value.match('[A-Za-z]+') !== null) ||
                cell.value === '' || isNullOrUndefined(cell.value)) {
                isEnable = true;
            } else {
                isEnable = false;
            }
            let hyperlink: string | HyperlinkModel = cell.hyperlink;
            if (typeof (hyperlink) === 'string') {
                let hl: string = hyperlink;
                if (hl.indexOf('http://') === -1 && hl.indexOf('https://') === -1 && hl.indexOf('ftp://') === -1) {
                    address = hyperlink;
                    isWeb = false;
                }
            } else if (typeof (hyperlink) === 'object') {
                let hl: string = hyperlink.address;
                if (hl.indexOf('http://') === -1 && hl.indexOf('https://') === -1 && hl.indexOf('ftp://') === -1) {
                    address = hyperlink.address;
                    isWeb = false;
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
        let dialogElem: HTMLElement = this.parent.createElement('div', { className: 'e-link-dialog' });
        let webContElem: HTMLElement = this.parent.createElement('div', { className: 'e-webpage' });
        let docContElem: HTMLElement = this.parent.createElement('div', { className: 'e-document' });
        let headerTabs: Tab = new Tab({
            selectedItem: selIdx,
            items: [
                {
                    header: { 'text': 'WEB PAGE' },
                    content: webContElem
                },
                {
                    header: { 'text': 'THIS DOCUMENT' },
                    content: docContElem
                },
            ]
        });
        headerTabs.appendTo(dialogElem);
        if (isWeb) {
            dialogElem.querySelector('.e-toolbar-items').querySelector('.e-indicator').setAttribute('style', 'left: 0; right: 136px');
        } else {
            dialogElem.querySelector('.e-toolbar-items').querySelector('.e-indicator').setAttribute('style', 'left: 136px; right: 0');
        }
        let textCont: HTMLElement = this.parent.createElement('div', { className: 'e-cont' });
        let urlCont: HTMLElement = this.parent.createElement('div', { className: 'e-cont' });
        let textH: HTMLElement = this.parent.createElement('div', { className: 'e-header', innerHTML: 'Display Text' });
        let urlH: HTMLElement = this.parent.createElement('div', { className: 'e-header', innerHTML: 'URL' });
        let textInput: HTMLElement = this.parent.createElement('input', { className: 'e-input e-text', attrs: { 'type': 'Text' }, });
        if (!isEnable) {
            textInput.classList.add('e-disabled');
            textInput.setAttribute('readonly', 'true');
            textInput.setAttribute('disabled', 'true');
        }
        if (cell && isNullOrUndefined(cell.hyperlink)) {
            textInput.setAttribute('value', this.parent.getDisplayText(cell));
        }
        let urlInput: HTMLElement = this.parent.createElement('input', { className: 'e-input e-text', attrs: { 'type': 'Text' } });
        textInput.setAttribute('placeholder', 'Enter the text to display');
        urlInput.setAttribute('placeholder', 'Enter the URL');
        textCont.appendChild(textInput);
        textCont.insertBefore(textH, textInput);
        urlCont.appendChild(urlInput);
        urlCont.insertBefore(urlH, urlInput);
        webContElem.appendChild(urlCont);
        webContElem.insertBefore(textCont, urlCont);
        let cellRef: Object[] = [];
        let definedName: object[] = [];
        let sheets: SheetModel[] = this.parent.sheets;
        for (idx; idx < this.parent.sheets.length; idx++) {
            let sheetName: string = this.parent.sheets[idx].name;
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
        for (idx = 0; idx < this.parent.definedNames.length; idx++) {
            definedName.push({
                nodeId: 'defName',
                nodeText: this.parent.definedNames[idx].name
            });
        }
        let data: { [key: string]: Object }[] = [
            {
                nodeId: '01', nodeText: 'Cell Reference', expanded: isCellRef,
                nodeChild: cellRef
            },
            {
                nodeId: '02', nodeText: 'Defined Names', expanded: isDefinedName,
                nodeChild: definedName
            },
        ];
        let treeObj: TreeView = new TreeView({
            fields: { dataSource: data, id: 'nodeId', text: 'nodeText', child: 'nodeChild' }
        });
        let cellrefCont: HTMLElement = this.parent.createElement('div', { className: 'e-cont' });
        let cellrefH: HTMLElement = this.parent.createElement('div', { className: 'e-header', innerHTML: 'Cell Reference' });
        let cellrefInput: HTMLElement = this.parent.createElement('input', { className: 'e-input e-text', attrs: { 'type': 'Text' } });
        cellrefInput.setAttribute('value', 'A1');
        cellrefCont.appendChild(cellrefInput);
        cellrefCont.insertBefore(cellrefH, cellrefInput);
        let textCont1: HTMLElement = this.parent.createElement('div', { className: 'e-cont' });
        let textH1: HTMLElement = this.parent.createElement('div', { className: 'e-header', innerHTML: 'Display Text' });
        let textInput1: HTMLElement = this.parent.createElement('input', { className: 'e-input e-text', attrs: { 'type': 'Text' } });
        if (!isEnable) {
            textInput1.classList.add('e-disabled');
            textInput1.setAttribute('readonly', 'true');
            textInput1.setAttribute('disabled', 'true');
        }
        if (cell && isNullOrUndefined(cell.hyperlink)) {
            textInput1.setAttribute('value', this.parent.getDisplayText(cell));
        }
        textInput1.setAttribute('placeholder', 'Enter the text to display');
        textCont1.appendChild(textInput1);
        textCont1.insertBefore(textH1, textInput1);
        let sheetCont: HTMLElement = this.parent.createElement('div', { className: 'e-cont' });
        let sheetH: HTMLElement = this.parent.createElement('div', { className: 'e-header', innerHTML: 'Sheet' });
        let refCont: HTMLElement = this.parent.createElement('div', { className: 'e-refcont' });
        sheetCont.appendChild(refCont);
        sheetCont.insertBefore(sheetH, refCont);
        docContElem.appendChild(cellrefCont);
        docContElem.insertBefore(textCont1, cellrefCont);
        treeObj.appendTo(refCont);
        docContElem.appendChild(sheetCont);
        return dialogElem;
    }
}
