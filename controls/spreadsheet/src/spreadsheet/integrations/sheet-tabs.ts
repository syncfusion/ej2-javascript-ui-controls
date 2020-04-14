import { Tab, SelectingEventArgs, TabItemModel, SelectEventArgs } from '@syncfusion/ej2-navigations';
import { Spreadsheet } from '../base/index';
import { refreshSheetTabs, locale, insertSheetTab, cMenuBeforeOpen, dialog, renameSheet, hideSheet, completeAction } from '../common/index';
import { sheetNameUpdate, clearUndoRedoCollection } from '../common/index';
import { sheetTabs, renameSheetTab, removeSheetTab, activeSheetChanged, onVerticalScroll, onHorizontalScroll } from '../common/index';
import { getUpdateUsingRaf,  protectSheet } from '../common/index';
import { SheetModel, getSheetName, aggregateComputation, AggregateArgs } from '../../workbook/index';
import { isSingleCell, getRangeIndexes, getSheet, getSheetIndex } from '../../workbook/index';
import { DropDownButton, MenuEventArgs, BeforeOpenCloseMenuEventArgs, OpenCloseMenuEventArgs } from '@syncfusion/ej2-splitbuttons';
import { ItemModel } from '@syncfusion/ej2-splitbuttons';
import { isCollide, OffsetPosition, calculatePosition } from '@syncfusion/ej2-popups';
import { rippleEffect, L10n, closest, EventHandler, remove } from '@syncfusion/ej2-base';
import { Dialog } from '../services/index';
import { sheetsDestroyed, activeCellChanged, workbookFormulaOperation, InsertDeleteModelArgs } from '../../workbook/common/index';
import { insertModel } from './../../workbook/common/index';

/**
 * Represents SheetTabs for Spreadsheet.
 */
export class SheetTabs {
    private parent: Spreadsheet;
    private tabInstance: Tab;
    private dropDownInstance: DropDownButton;
    private addBtnRipple: Function;
    private aggregateDropDown: DropDownButton;
    private aggregateContent: string = '';
    constructor(parent: Spreadsheet) {
        this.parent = parent;
        this.addEventListener();
    }

    public getModuleName(): string {
        return 'sheetTabs';
    }

    private createSheetTabs(): void {
        if (!this.parent.showSheetTabs && this.tabInstance) {
            this.destroy(); return;
        }
        let l10n: L10n = this.parent.serviceLocator.getService(locale);
        let panel: HTMLElement = this.parent.createElement('div', {
            className: 'e-sheet-tab-panel', id: this.parent.element.id + '_sheet_tab_panel'
        });
        let addBtn: HTMLElement = this.parent.createElement('button', {
            className: 'e-add-sheet-tab e-btn e-css e-flat e-icon-btn' + (this.parent.allowInsert ? '' : ' e-disabled'),
            attrs: { 'title': l10n.getConstant('AddSheet') }
        });
        addBtn.appendChild(this.parent.createElement('span', { className: 'e-btn-icon e-icons e-add-icon' }));
        addBtn.addEventListener('click', this.addSheetTab.bind(this));
        (addBtn as HTMLButtonElement).disabled = !this.parent.allowInsert;
        panel.appendChild(addBtn);
        if (this.parent.allowInsert) { this.addBtnRipple = rippleEffect(panel, { selector: '.e-add-sheet-tab' }); }
        let ddb: HTMLElement = this.parent.createElement('button', { attrs: { 'title': l10n.getConstant('ListAllSheets') } });
        panel.appendChild(ddb);
        this.parent.element.appendChild(panel);
        let items: { tabItems: TabItemModel[], ddbItems: ItemModel[] } = this.getSheetTabItems();
        this.dropDownInstance = new DropDownButton({
            iconCss: 'e-icons',
            items: items.ddbItems,
            beforeItemRender: (args: MenuEventArgs): void => {
                let sheet: SheetModel = this.parent.sheets[this.dropDownInstance.items.indexOf(args.item)];
                if (sheet.state === 'Hidden') {
                    args.element.classList.add('e-hide');
                } else if (sheet.state === 'VeryHidden') {
                    args.element.style.display = 'none';
                }
            },
            select: (args: MenuEventArgs): void => this.updateSheetTab({ idx: this.dropDownInstance.items.indexOf(args.item) }),
            beforeOpen: (args: BeforeOpenCloseMenuEventArgs): void => this.beforeOpenHandler(this.dropDownInstance, args.element),
            open: (args: OpenCloseMenuEventArgs): void => this.openHandler(this.dropDownInstance, args.element, 'left'),
            cssClass: 'e-sheets-list e-flat e-caret-hide',
            close: (): void => this.parent.element.focus()
        });
        this.dropDownInstance.createElement = this.parent.createElement;
        this.dropDownInstance.appendTo(ddb);
        let sheetTab: HTMLElement = this.parent.createElement('div', { className: 'e-sheet-tab' });
        this.tabInstance = new Tab({
            selectedItem: this.parent.activeSheetIndex,
            overflowMode: 'Scrollable',
            items: items.tabItems,
            scrollStep: 250,
            selecting: (args: SelectingEventArgs): void => {
                /** */
            },
            selected: (args: SelectEventArgs): void => {
                if (args.selectedIndex === args.previousIndex) { return; }
                this.parent.activeSheetIndex = args.selectedIndex;
                this.parent.dataBind();
                this.updateDropDownItems(args.selectedIndex, args.previousIndex);
                this.parent.element.focus();
            },
            created: (): void => {
                let tBarItems: HTMLElement = this.tabInstance.element.querySelector('.e-toolbar-items');
                tBarItems.classList.add('e-sheet-tabs-items');
                EventHandler.add(tBarItems, 'dblclick', this.renameSheetTab, this);
            },
        });
        panel.appendChild(sheetTab);
        this.tabInstance.createElement = this.parent.createElement;
        this.tabInstance.appendTo(sheetTab);
        // tslint:disable-next-line:no-any
        EventHandler.remove(this.tabInstance.element, 'keydown', (this.tabInstance as any).spaceKeyDown);
        let sheetCount: number = items.tabItems.length;
        for (let i: number = 0; i < sheetCount; i++) {
            let sheetName: string = getSheetName(this.parent, i);
            let arg: { [key: string]: Object } = { action: 'addSheet', sheetName: 'Sheet' + (i + 1), index: i + 1, visibleName: sheetName };
            this.parent.notify(workbookFormulaOperation, arg);
        }
        this.parent.notify(workbookFormulaOperation, { action: 'initiateDefinedNames' });
        this.parent.notify(protectSheet, null);
    }

    private updateDropDownItems(curIdx: number, prevIdx?: number): void {
        if (prevIdx > -1) { this.dropDownInstance.items[prevIdx].iconCss = ''; }
        this.dropDownInstance.items[curIdx].iconCss = 'e-selected-icon e-icons';
        this.dropDownInstance.setProperties({ 'items': this.dropDownInstance.items }, true);
    }

    private beforeOpenHandler(instance: DropDownButton, element: HTMLElement): void {
        let viewportHeight: number = this.parent.viewport.height;
        let actualHeight: number = (parseInt(getComputedStyle(element.firstElementChild).height, 10) *
            instance.items.length) + (parseInt(getComputedStyle(element).paddingTop, 10) * 2);
        if (actualHeight > viewportHeight) {
            element.style.height = `${viewportHeight}px`; element.style.overflowY = 'auto';
        }
        element.parentElement.style.visibility = 'hidden';
    }

    private openHandler(instance: DropDownButton, element: HTMLElement, positionX: string): void {
        let wrapper: HTMLElement = element.parentElement; let height: number;
        let collide: string[] = isCollide(wrapper);
        if (collide.indexOf('bottom') === -1) {
            height = element.style.overflowY === 'auto' ? this.parent.viewport.height : wrapper.getBoundingClientRect().height;
            let offset: OffsetPosition = calculatePosition(instance.element, positionX, 'top');
            if (positionX === 'right') {
                offset.left -= wrapper.getBoundingClientRect().width;
            }
            wrapper.style.left = `${offset.left}px`;
            wrapper.style.top = `${offset.top - height}px`;
        }
        wrapper.style.visibility = '';
    }

    private getSheetTabItems(): { tabItems: TabItemModel[], ddbItems: ItemModel[] } {
        let tabItems: TabItemModel[] = []; let ddbItems: ItemModel[] = []; let sheetName: string;
        this.parent.sheets.forEach((sheet: SheetModel, index: number) => {
            sheetName = getSheetName(this.parent, index);
            tabItems.push({ header: { 'text': sheetName }, cssClass: sheet.state === 'Visible' ? '' : 'e-hide' });
            ddbItems.push({ text: sheetName, iconCss: index === this.parent.activeSheetIndex ? 'e-selected-icon e-icons' : '' });
        });
        return { tabItems: tabItems, ddbItems: ddbItems };
    }

    private refreshSheetTab(): void {
        let items: { tabItems: TabItemModel[], ddbItems: ItemModel[] } = this.getSheetTabItems();
        this.dropDownInstance.items = items.ddbItems;
        this.dropDownInstance.setProperties({ 'items': this.dropDownInstance.items }, true);
        this.tabInstance.items = items.tabItems; this.tabInstance.selectedItem = this.parent.activeSheetIndex;
        this.tabInstance.dataBind();
    }

    private addSheetTab(): void {
        this.parent.notify(insertModel, <InsertDeleteModelArgs>{ model: this.parent, start: this.parent.activeSheetIndex + 1,  end:
            this.parent.activeSheetIndex + 1, modelType: 'Sheet', isAction: true, activeSheetIndex: this.parent.activeSheetIndex + 1 });
        this.parent.element.focus();
    }

    private insertSheetTab(args: { startIdx: number, endIdx: number, isAction: boolean }): void {
        this.dropDownInstance.items[this.tabInstance.selectedItem].iconCss = '';
        for (let i: number = args.startIdx; i <= args.endIdx; i++) {
            let sheetName: string = this.parent.sheets[i].name;
            this.dropDownInstance.items.splice(i, 0, <ItemModel>{ text: sheetName });
            this.tabInstance.addTab(<TabItemModel[]>[{ header: { text: sheetName }, content: '' }], i);
        }
        this.dropDownInstance.items[args.startIdx].iconCss = 'e-selected-icon e-icons';
        this.dropDownInstance.setProperties({ 'items': this.dropDownInstance.items }, true);
        if (args.isAction) { this.updateSheetTab({ idx: args.startIdx }); }
    }

    private updateSheetTab(args: { idx: number, name?: string }): void {
        if (args.name === 'activeSheetChanged') {
            args.idx = this.parent.skipHiddenSheets(args.idx);
        } else {
            if (this.parent.sheets[args.idx].state === 'Hidden') {
                this.parent.sheets[args.idx].state = 'Visible';
                this.tabInstance.items[args.idx].cssClass = '';
                this.tabInstance.items = this.tabInstance.items;
                this.tabInstance.dataBind();
            }
        }
        this.tabInstance.selectedItem = args.idx; this.tabInstance.dataBind();
        this.parent.notify(protectSheet, null);
    }

    private switchSheetTab(args: BeforeOpenCloseMenuEventArgs): void {
        let target: Element = closest(args.event.target as Element, '.e-toolbar-item');
        if (!target) { return; }
        let text: string = target.querySelector('.e-tab-text').textContent;
        for (let i: number = 0, len: number = this.tabInstance.items.length; i < len; i++) {
            if (this.tabInstance.items[i].header.text === text) {
                if (this.parent.activeSheetIndex !== i) {
                    this.updateSheetTab({ idx: i });
                }
                break;
            }
        }
        if (args.element.classList.contains('e-contextmenu') && args.items[0] &&
            args.items[0].id === `${this.parent.element.id}_cmenu_insert_sheet`) {
            if (this.skipHiddenSheets() === 1) {
                //let id: string = `${this.parent.element.id}_cmenu`;
                //this.parent.enableFileMenuItems([`${id}_hide_sheet`, `${id}_delete_sheet`], false, true);
                args.element.children[1].classList.add('e-disabled'); args.element.children[3].classList.add('e-disabled');
            }
            if (!this.parent.allowInsert) { args.element.children[0].classList.add('e-disabled'); }
        }
    }

    private skipHiddenSheets(): number {
        let count: number = this.parent.sheets.length;
        this.parent.sheets.forEach((sheet: SheetModel): void => {
            if (sheet.state !== 'Visible') { --count; }
        });
        return count;
    }

    private renameSheetTab(): void {
        let target: Element = this.tabInstance.element.querySelector('.e-toolbar-item.e-active');
        if (target) {
            target = target.querySelector('.e-text-wrap');
            let value: string = target.querySelector('.e-tab-text').textContent;
            let input: HTMLElement = this.parent.createElement('input', {
                id: this.parent.element.id + '_rename_input',
                className: 'e-input e-sheet-rename', styles: `width: ${target.getBoundingClientRect().width}px`, attrs: {
                    'type': 'text', 'name': 'Rename', 'required': '', 'value': value, 'spellcheck': 'false', 'maxlength': '31'
                }
            });
            (target.firstElementChild as HTMLElement).style.display = 'none';
            target.appendChild(input);
            EventHandler.add(document, 'mousedown touchstart', this.renameInputFocusOut, this);
            EventHandler.add(input, 'input', this.updateWidth, this);
            input.focus();
            (input as HTMLInputElement).setSelectionRange(0, value.length);
            EventHandler.remove(closest(target, '.e-toolbar-items'), 'dblclick', this.renameSheetTab);
        }
    }

    private updateWidth(e: UIEvent): void {
        let target: HTMLInputElement = e.target as HTMLInputElement;
        let len: number = target.value.length;
        let value: string[] = target.value.split(' ');
        if (value.length) {
            let spaceLen: number = value.length - 1;
            len -= spaceLen; len += (spaceLen * 0.5);
        }
        target.style.width = `${len}ch`;
    }

    private renameInputFocusOut(e: KeyboardEvent | MouseEvent): void {
        let target: HTMLInputElement = e.target as HTMLInputElement;
        if ((e.type === 'mousedown' || e.type === 'touchstart') && (target.classList.contains('e-sheet-rename') ||
            closest(target, '.e-dlg-container'))) { return; }
        target = document.getElementById(this.parent.element.id + '_rename_input') as HTMLInputElement;
        if (e.type === 'keydown' && (e as KeyboardEvent).keyCode === 27) {
            this.removeRenameInput(target); this.parent.element.focus(); return;
        }
        let value: string = target.value;
        let l10n: L10n = this.parent.serviceLocator.getService(locale);
        if (value) {
            let idx: number = this.tabInstance.selectedItem;
            if (!value.match(new RegExp('.*[\\[\\]\\*\\\\\/\\?].*'))) {
                if (this.tabInstance.items[idx].header.text !== value) {
                    for (let i: number = 0, len: number = this.parent.sheets.length; i < len; i++) {
                        if (i !== this.parent.activeSheetIndex && this.parent.sheets[i].name.toLowerCase() === value.toLowerCase()) {
                            this.showRenameDialog(target, l10n.getConstant('SheetRenameAlreadyExistsAlert'));
                            return;
                        }
                    }
                }
                let items: Element = this.removeRenameInput(target);
                if (this.tabInstance.items[idx].header.text !== value) {
                    this.parent.sheets[idx].name = value;
                    this.updateSheetName({ value: value, idx: idx, items: items });
                }
                if (e.type === 'keydown' || (closest(e.target as Element, '.e-spreadsheet'))) { this.parent.element.focus(); }
            } else {
                this.showRenameDialog(target, l10n.getConstant('SheetRenameInvalidAlert'));
            }
        } else {
            this.showRenameDialog(target, l10n.getConstant('SheetRenameEmptyAlert'));
        }
        let sheetIndex: number = this.parent.getActiveSheet().id;
        let args: { [key: string]: Object } = { action: 'renameUpdation', value: value, sheetId: sheetIndex };
        this.parent.notify(workbookFormulaOperation, args);
        let eventArgs: { [key: string]: Object } = {
            index: sheetIndex,
            value: value
        };
        this.parent.notify(completeAction, { eventArgs: eventArgs, action: 'renameSheet' });
    }

    private updateSheetName(args: { value: string, idx: number, items?: Element, }): void {
        this.tabInstance.items[args.idx].header.text = args.value;
        this.dropDownInstance.items[args.idx].text = args.value;
        this.dropDownInstance.setProperties({ 'items': this.dropDownInstance.items }, true);
        if (args.value.indexOf('  ') > -1) {
            this.tabInstance.setProperties({ 'items': this.tabInstance.items }, true);
            args.items.querySelector('.e-toolbar-item.e-active .e-tab-text').textContent = args.value;
        } else {
            this.tabInstance.items = this.tabInstance.items;
            this.tabInstance.dataBind();
        }

    }

    private hideSheet(): void {
        this.parent.getActiveSheet().state = 'Hidden';
        this.tabInstance.items[this.parent.activeSheetIndex].cssClass = 'e-hide';
        this.tabInstance.items = this.tabInstance.items; this.tabInstance.dataBind();
        this.tabInstance.selectedItem = this.parent.skipHiddenSheets(
            this.parent.activeSheetIndex === this.parent.sheets.length - 1 ? this.parent.activeSheetIndex - 1 :
                this.parent.activeSheetIndex + 1);
        this.tabInstance.dataBind();
    }

    private removeRenameInput(target: HTMLInputElement): Element {
        let textEle: HTMLElement = target.parentElement.querySelector('.e-tab-text');
        let sheetItems: Element = closest(target, '.e-toolbar-items');
        EventHandler.add(sheetItems, 'dblclick', this.renameSheetTab, this);
        EventHandler.remove(document, 'mousedown touchstart', this.renameInputFocusOut);
        EventHandler.remove(target, 'input', this.updateWidth);
        remove(target);
        textEle.style.display = '';
        return sheetItems;
    }

    private showRenameDialog(target: HTMLInputElement, content: string): void {
       let dialogInst: Dialog = this.parent.serviceLocator.getService(dialog) as Dialog;
       if (!dialogInst.dialogInstance) {
            dialogInst.show({
            target: document.getElementById(this.parent.element.id + '_sheet_panel'),
            height: 180, width: 400, isModal: true, showCloseIcon: true,
            content: content,
            beforeOpen: (): void => target.focus(),
            close: (): void => target.setSelectionRange(0, target.value.length)
            });
        }
    }

    private focusRenameInput(): void {
        let input: HTMLElement = document.getElementById(this.parent.element.id + '_rename_input');
        if (input) { input.focus(); }
    }

    private removeSheetTab(args: {
        event: MouseEvent & TouchEvent, index?: number, isAction?: boolean,
        count?: number, clicked?: boolean, sheetName?: string
    }): void {
        if (args.count && (args.count === this.parent.sheets.length)) {
            return;
        }
        let l10n: L10n = this.parent.serviceLocator.getService(locale);
        if (this.skipHiddenSheets() > 1) {
            let sheet: SheetModel = args.sheetName ? getSheet(this.parent, getSheetIndex(this.parent, args.sheetName)) :
                this.parent.getActiveSheet();
            let sheetIndex: number = args.index || getSheetIndex(this.parent, sheet.name);
            let eventArgs: { [key: string]: Object } = {
                index: sheetIndex,
                sheetCount: this.parent.sheets.length,
                sheetName: sheet.name
            };
            let isDataAvail: boolean = sheet.rows && sheet.rows.length ?
                (sheet.rows.length === 1 ? (sheet.rows[0].cells && sheet.rows[0].cells.length ? true : false) : true) : false;
            if (isDataAvail) {
                let dialogInst: Dialog = (this.parent.serviceLocator.getService(dialog) as Dialog);
                if (args.clicked) {
                    this.forceDelete(sheetIndex);
                } else {
                    dialogInst.show({
                        height: 200, width: 400, isModal: true, showCloseIcon: true,
                        content: l10n.getConstant('DeleteSheetAlert'),
                        beforeOpen: (): void => this.parent.element.focus(),
                        buttons: [{
                            buttonModel: {
                                content: l10n.getConstant('Ok'), isPrimary: true
                            },
                            click: (): void => {
                                dialogInst.hide();
                                this.forceDelete(sheetIndex);
                                this.parent.notify(clearUndoRedoCollection, null);
                                if (args && !args.isAction) {
                                    eventArgs.sheetCount = this.parent.sheets.length;
                                    this.parent.notify(completeAction, { eventArgs: eventArgs, action: 'removeSheet' });
                                }
                            }
                        }]
                    });
                }
            } else {
                this.destroySheet(sheetIndex);
                let sheetArgs: { action: string, sheetName: string, index: number } = {
                    action: 'deleteSheetTab', sheetName: '', index: sheetIndex
                };
                this.parent.notify(workbookFormulaOperation, sheetArgs);
                this.parent.notify(clearUndoRedoCollection, null);
                if (args && !args.isAction) {
                    eventArgs.sheetCount = this.parent.sheets.length;
                    this.parent.notify(completeAction, { eventArgs: eventArgs, action: 'removeSheet' });
                }
            }
        } else {
            (this.parent.serviceLocator.getService(dialog) as Dialog).show({
                target: document.getElementById(this.parent.element.id + '_sheet_panel'),
                height: 180, width: 400, isModal: true, showCloseIcon: true,
                content: l10n.getConstant('DeleteSingleLastSheetAlert'),
                beforeOpen: (): void => this.parent.element.focus()
            });
        }
    }

    private forceDelete(sheetIndex: number): void {
        this.destroySheet(sheetIndex);
        let sheetArgs: { action: string, sheetName: string, index: number } = {
            action: 'deleteSheetTab', sheetName: '', index: sheetIndex
        };
        this.parent.notify(workbookFormulaOperation, sheetArgs);
    }

    private destroySheet(sheetIndex?: number): void {
        let activeSheetIdx: number = sheetIndex || this.parent.activeSheetIndex;
        this.parent.removeSheet(activeSheetIdx);
        this.parent.notify(sheetsDestroyed, { sheetIndex: activeSheetIdx });
        this.dropDownInstance.items.splice(activeSheetIdx, 1);
        this.dropDownInstance.setProperties({ 'items': this.dropDownInstance.items }, true);
        this.tabInstance.removeTab(activeSheetIdx);
        let activeIndex: number = this.parent.skipHiddenSheets(this.tabInstance.selectedItem);
        this.parent.activeSheetIndex = activeIndex;
        this.parent.renderModule.refreshSheet();
        this.tabInstance.selectedItem = activeIndex; this.tabInstance.dataBind();
        this.updateDropDownItems(activeIndex);
        this.parent.notify(protectSheet, null);
        this.parent.element.focus();
    }

    private showAggregate(): void {
        if (isSingleCell(getRangeIndexes(this.parent.getActiveSheet().selectedRange))) { return; }
        getUpdateUsingRaf((): void => {
            let eventArgs: AggregateArgs = { Count: 0, Sum: '0', Avg: '0', Min: '0', Max: '0' };
            this.parent.notify(aggregateComputation, eventArgs);
            if (eventArgs.Count) {
                if (!this.aggregateContent) { this.aggregateContent = eventArgs.Sum ? 'Sum' : 'Count'; }
                let key: string = this.aggregateContent;
                let content: string = `${key}: ${eventArgs[key]}`;
                if (!this.aggregateDropDown) {
                    let aggregateEle: HTMLElement = this.parent.createElement('button');
                    document.getElementById(`${this.parent.element.id}_sheet_tab_panel`).appendChild(aggregateEle);
                    this.aggregateDropDown = new DropDownButton({
                        content: content,
                        items: this.getAggregateItems(eventArgs),
                        select: (args: MenuEventArgs): void => this.updateAggregateContent(args.item.text, eventArgs),
                        beforeOpen: (args: BeforeOpenCloseMenuEventArgs): void =>
                            this.beforeOpenHandler(this.aggregateDropDown, args.element),
                        open: (args: OpenCloseMenuEventArgs): void => this.openHandler(this.aggregateDropDown, args.element, 'right'),
                        close: (): void => this.parent.element.focus(),
                        cssClass: 'e-aggregate-list e-flat'
                    });
                    this.aggregateDropDown.createElement = this.parent.createElement;
                    this.aggregateDropDown.appendTo(aggregateEle);
                } else {
                    this.updateAggregateContent(content, eventArgs);
                }
            }
        });
    }

    private getAggregateItems(args: AggregateArgs): ItemModel[] {
        let items: ItemModel[] = []; let text: string; let iconCss: string;
        Object.keys(args).forEach((key: string): void => {
            if (args[key] !== aggregateComputation) {
                text = `${key}: ${args[key]}`; iconCss = key === this.aggregateContent ? 'e-selected-icon e-icons' : '';
                items.push({ text: text, iconCss: iconCss });
            }
        });
        return items;
    }

    private updateAggregateContent(text: string, eventArgs: AggregateArgs): void {
        this.aggregateContent = text.split(': ')[0];
        this.aggregateDropDown.content = text;
        this.aggregateDropDown.dataBind();
        this.aggregateDropDown.setProperties({ 'items': this.getAggregateItems(eventArgs) }, true);
    }

    private removeAggregate(): void {
        if (this.aggregateDropDown && isSingleCell(getRangeIndexes(this.parent.getActiveSheet().selectedRange))) {
            this.aggregateDropDown.destroy();
            remove(this.aggregateDropDown.element);
            this.aggregateDropDown = null;
        }
    }

    private addEventListener(): void {
        this.parent.on(sheetTabs, this.createSheetTabs, this);
        this.parent.on(refreshSheetTabs, this.refreshSheetTab, this);
        this.parent.on(insertSheetTab, this.insertSheetTab, this);
        this.parent.on(removeSheetTab, this.removeSheetTab, this);
        this.parent.on(renameSheetTab, this.renameSheetTab, this);
        this.parent.on(cMenuBeforeOpen, this.switchSheetTab, this);
        this.parent.on(activeSheetChanged, this.updateSheetTab, this);
        this.parent.on(renameSheet, this.renameInputFocusOut, this);
        this.parent.on(activeCellChanged, this.removeAggregate, this);
        this.parent.on(onVerticalScroll, this.focusRenameInput, this);
        this.parent.on(onHorizontalScroll, this.focusRenameInput, this);
        this.parent.on(sheetNameUpdate, this.updateSheetName, this);
        this.parent.on(hideSheet, this.hideSheet, this);
    }

    public destroy(): void {
        this.removeEventListener();
        this.dropDownInstance.destroy();
        this.dropDownInstance = null;
        this.tabInstance.destroy();
        this.tabInstance = null;
        this.aggregateDropDown = null;
        this.aggregateContent = null;
        this.addBtnRipple();
        this.addBtnRipple = null;
        EventHandler.remove(document, 'mousedown touchstart', this.renameInputFocusOut);
        let ele: HTMLElement = document.getElementById(this.parent.element.id + '_sheet_tab_panel');
        if (ele) { remove(ele); }
        this.parent = null;
    }

    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(sheetTabs, this.createSheetTabs);
            this.parent.off(refreshSheetTabs, this.refreshSheetTab);
            this.parent.off(insertSheetTab, this.insertSheetTab);
            this.parent.off(removeSheetTab, this.removeSheetTab);
            this.parent.off(renameSheetTab, this.renameSheetTab);
            this.parent.off(cMenuBeforeOpen, this.switchSheetTab);
            this.parent.off(activeSheetChanged, this.updateSheetTab);
            this.parent.off(renameSheet, this.renameInputFocusOut);
            this.parent.off(activeCellChanged, this.removeAggregate);
            this.parent.off(onVerticalScroll, this.focusRenameInput);
            this.parent.off(onHorizontalScroll, this.focusRenameInput);
            this.parent.off(sheetNameUpdate, this.updateSheetName);
            this.parent.off(hideSheet, this.hideSheet);
        }
    }
}