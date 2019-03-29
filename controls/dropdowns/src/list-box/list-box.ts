/// <reference path='../drop-down-base/drop-down-base-model.d.ts'/>
import { DropDownBase, dropDownBaseClasses, SelectEventArgs } from '../drop-down-base/drop-down-base';
import { FieldSettingsModel } from '../drop-down-base/drop-down-base-model';
import { EventHandler, closest, removeClass, addClass, Complex, Property, ChildProperty, BaseEventArgs } from '@syncfusion/ej2-base';
import { ModuleDeclaration, NotifyPropertyChanges, getComponent, EmitType, Event, extend, detach, attributes } from '@syncfusion/ej2-base';
import { getUniqueID, Browser, formatUnit } from '@syncfusion/ej2-base';
import { cssClass, Sortable, moveTo } from '@syncfusion/ej2-lists';
import { SelectionSettingsModel, ListBoxModel, ToolbarSettingsModel } from './list-box-model';
import { Button } from '@syncfusion/ej2-buttons';
import { createSpinner, showSpinner, hideSpinner } from '@syncfusion/ej2-popups';
export type SelectionMode = 'Multiple' | 'Single';

export type ToolBarPosition = 'Left' | 'Right';

export class SelectionSettings extends ChildProperty<SelectionSettings> {
    /**
     * Specifies the selection modes. The possible values are
     * * `Single`: Allows you to select a single item in the ListBox.
     * * `Multiple`: Allows you to select more than one item in the ListBox.
     * @default 'Multiple'
     */
    @Property('Multiple')
    public mode: SelectionMode;

    /**
     * If 'showCheckbox' is set to true, then 'checkbox' will be visualized in the list item.
     * @default false
     */
    @Property(false)
    public showCheckbox: boolean;

    /**
     * Allows you to either show or hide the selectAll option on the component.
     * @default false
     */
    @Property(false)
    public showSelectAll: boolean;
}

export class ToolbarSettings extends ChildProperty<ToolbarSettings> {
    /** 
     * Specifies the list of tools for dual ListBox.
     * The predefined tools are 'moveUp', 'moveDown', 'moveTo', 'moveFrom', 'moveAllTo', and 'moveAllFrom'.
     * @default []
     */
    @Property([])
    public items: string[];

    /** 
     * Positions the toolbar before/after the ListBox.
     * The possible values are:
     * * Left: The toolbar will be positioned to the left of the ListBox.
     * * Right: The toolbar will be positioned to the right of the ListBox.
     * @default 'Right'
     */
    @Property('Right')
    public position: ToolBarPosition;
}

/**
 * The ListBox is a graphical user interface component used to display a list of items.
 * Users can select one or more items in the list using a checkbox or by keyboard selection.
 * It supports sorting, grouping, reordering, and drag and drop of items.
 * ```html
 * <select id="listbox">
 *      <option value='1'>Badminton</option>
 *      <option value='2'>Basketball</option>
 *      <option value='3'>Cricket</option>
 *      <option value='4'>Football</option>
 *      <option value='5'>Tennis</option>
 * </select>
 * ```
 * ```typescript
 * <script>
 *   var listObj = new ListBox();
 *   listObj.appendTo("#listbox");
 * </script>
 * ```
 */
@NotifyPropertyChanges
export class ListBox extends DropDownBase {
    private prevSelIdx: number;
    private listCurrentOptions: FieldSettingsModel;
    private checkBoxSelectionModule: { onDocumentClick: Function };
    private tBListBox: ListBox;
    private initLoad: boolean;
    private spinner: HTMLElement;
    private initialSelectedOptions: string[];
    private showSelectAll: boolean;
    private selectAllText: string;
    private unSelectAllText: string;
    private popupWrapper: Element;

    /**
     * Sets the CSS classes to root element of this component, which helps to customize the
     * complete styles.
     * @default ''
     */
    @Property('')
    public cssClass: string;

    /**
     * Sets the specified item to the selected state or gets the selected item in the ListBox.
     * @default []
     * @aspType object
     */
    @Property([])
    public value: string[];

    /**
     * Sets the height of the ListBox component.
     * @default ''
     */
    @Property('')
    public height: number | string;

    /**
     * If 'allowDragAndDrop' is set to true, then you can perform drag and drop of the list item.
     * ListBox contains same 'scope' property enables drag and drop between multiple ListBox.
     * @default false
     */
    @Property(false)
    public allowDragAndDrop: boolean;

    /**
     * Defines the scope value to group sets of draggable and droppable ListBox.
     * A draggable with the same scope value will be accepted by the droppable.
     * @default ''
     */
    @Property('')
    public scope: string;

    /**
     * Triggers while rendering each list item.
     * @event
     */
    @Event()
    public beforeItemRender: EmitType<BeforeItemRenderEventArgs>;

    /**
     * Triggers while selecting the list item.
     * @event
     */
    @Event()
    public select: EmitType<SelectEventArgs>;

    /**
     * Triggers after dragging the list item.
     * @event
     */
    @Event()
    public dragStart: EmitType<DragEventArgs>;

    /**
     * Triggers while dragging the list item.
     * @event
     */
    @Event()
    public drag: EmitType<DragEventArgs>;

    /**
     * Triggers before dropping the list item on another list item.
     * @event
     */
    @Event()
    public drop: EmitType<DragEventArgs>;

    /**
     * Triggers when data source is populated in the list.
     * @event
     * @private
     */
    @Event()
    public dataBound: EmitType<Object>;

    /**
     * Accepts the template design and assigns it to the group headers present in the list.
     * @default null
     * @private
     */
    @Property(null)
    public groupTemplate: string;
    /**
     * Accepts the template design and assigns it to list of component
     * when no data is available on the component.
     * @default 'No Records Found'
     * @private
     */
    @Property('No Records Found')
    public noRecordsTemplate: string;
    /**
     * Accepts the template and assigns it to the list content of the component
     * when the data fetch request from the remote server fails.
     * @default 'The Request Failed'
     * @private
     */
    @Property('The Request Failed')
    public actionFailureTemplate: string;

    /**
     * specifies the z-index value of the component popup element.
     * @default 1000
     * @private
     */
    @Property(1000)
    public zIndex: number;
    /**
     * ignoreAccent set to true, then ignores the diacritic characters or accents when filtering.
     * @private
     */
    @Property(false)
    public ignoreAccent: boolean;

    /**
     * Specifies the toolbar items and its position.
     * @default { items: [], position: 'Right' }
     */
    @Complex<ToolbarSettingsModel>({}, ToolbarSettings)
    public toolbarSettings: ToolbarSettingsModel;

    /**
     * Specifies the selection mode and its type.
     * @default { mode: 'Multiple', type: 'Default' }
     */
    @Complex<SelectionSettingsModel>({}, SelectionSettings)
    public selectionSettings: SelectionSettingsModel;

    /**
     * Constructor for creating the ListBox component.
     */
    constructor(options?: ListBoxModel, element?: string | HTMLElement) {
        super(options, element);
    };

    /**
     * Build and render the component
     * @private
     */
    public render(): void {
        this.initLoad = true;
        this.initialSelectedOptions = this.value;
        super.render();
    }

    private initWrapper(): void {
        let hiddenSelect: Element = this.createElement('select', { className: 'e-hidden-select', attrs: { 'multiple': '' } });
        this.list.classList.add('e-listbox-wrapper');
        if (this.element.tagName === 'EJS-LISTBOX') {
            this.element.setAttribute('tabindex', '0');
            if (this.initLoad) {
                this.element.appendChild(this.list);
            }
        } else {
            if (this.initLoad) {
                this.element.parentElement.insertBefore(this.list, this.element);
            }
            this.list.insertBefore(this.element, this.list.firstChild);
            this.element.style.display = 'none';
        }
        this.list.appendChild(hiddenSelect);
        if (this.list.getElementsByClassName(cssClass.li)[0]) {
            this.list.getElementsByClassName(cssClass.li)[0].classList.remove(dropDownBaseClasses.focus);
        }
        removeClass([this.list], [dropDownBaseClasses.content, dropDownBaseClasses.root]);
        this.validationAttribute(this.element, hiddenSelect);
        this.list.setAttribute('role', 'listbox');
        attributes(this.list, { 'role': 'listbox', 'aria-multiselectable': this.selectionSettings.mode === 'Multiple' ? 'true' : 'false' });
        if (this.selectionSettings.showCheckbox && this.selectionSettings.showSelectAll) {
            this.showSelectAll = true;
            this.selectAllText = 'Select All';
            this.unSelectAllText = 'Unselect All';
            this.popupWrapper = this.list;
            this.notify('selectAll', {});
        }
    }

    private initDraggable(): void {
        if (this.allowDragAndDrop) {
            new Sortable(this.ulElement, {
                scope: this.scope,
                dragStart: this.triggerDragStart.bind(this),
                drag: this.triggerDrag.bind(this),
                drop: this.dragEnd.bind(this),
                placeHolder: () => { return this.createElement('span', { className: 'e-placeholder' }); },
                helper: (e: { sender: Element }) => {
                    let ele: HTMLElement = e.sender.cloneNode(true) as HTMLElement;
                    ele.style.width = (this.getItems()[0] as HTMLElement).offsetWidth + 'px';
                    if (this.value.length > 1 && ele.classList.contains('e-selected')) {
                        ele.appendChild(this.createElement('span', {
                            className: 'e-list-badge', innerHTML: this.value.length + ''
                        }));
                    }
                    return ele;
                }
            }
            );
        }
    }

    private initToolbar(): void {
        let scope: string;
        let pos: string = this.toolbarSettings.position;
        if (this.toolbarSettings.items.length) {
            let toolElem: Element = this.createElement('div', { className: 'e-listbox-tool', attrs: { 'role': 'toolbar' } });
            let wrapper: Element = this.createElement('div', {
                className: 'e-listboxtool-wrapper e-' + pos.toLowerCase()
            });
            this.list.parentElement.insertBefore(wrapper, this.list);
            wrapper.appendChild(pos === 'Right' ? this.list : toolElem);
            wrapper.appendChild(pos === 'Right' ? toolElem : this.list);
            this.createButtons(toolElem);
            if (!this.element.id) {
                this.element.id = getUniqueID('e-' + this.getModuleName());
            }
            document.querySelector(this.scope).setAttribute('data-value', this.element.id);
        }
        scope = this.element.getAttribute('data-value');
        if (scope) {
            this.tBListBox = getComponent(document.getElementById(scope), this.getModuleName());
            this.tBListBox.updateToolBarState();
        }
    }

    private createButtons(toolElem: Element): void {
        let btn: Button;
        let ele: HTMLButtonElement;
        let title: string;
        this.toolbarSettings.items.forEach((value: string) => {
            title = (value.charAt(0).toUpperCase() + value.slice(1)).match(/[A-Z][a-z]+/g).join(' ');
            ele = this.createElement('button', {
                attrs: {
                    'data-value': value,
                    'title': title,
                    'aria-label': title
                }
            }) as HTMLButtonElement;
            toolElem.appendChild(ele);
            btn = new Button({ iconCss: 'e-icons e-' + value.toLowerCase() }, ele);
            btn.createElement = this.createElement;
        });
    }

    private setHeight(): void {
        let ele: HTMLElement = this.toolbarSettings.items.length ? this.list.parentElement : this.list;
        ele.style.height = formatUnit(this.height);
    }

    private setCssClass(): void {
        let wrap: Element = this.toolbarSettings.items.length ? this.list.parentElement : this.list;
        if (this.cssClass) {
            addClass([wrap], this.cssClass.split(' '));
        }
        if (this.enableRtl) {
            addClass([wrap], 'e-rtl');
        }
    }

    private setEnable(): void {
        let ele: Element = this.toolbarSettings.items.length ? this.list.parentElement : this.list;
        if (this.enabled) {
            removeClass([ele], cssClass.disabled);
        } else {
            addClass([ele], cssClass.disabled);
        }
    }

    protected showSpinner(): void {
        if (!this.spinner) {
            this.spinner = this.createElement('div', { className: 'e-listbox-wrapper', styles: 'height:' + formatUnit(this.height) });
        }
        this.element.parentElement.insertBefore(this.spinner, this.element.nextSibling);
        createSpinner({ target: this.spinner }, this.createElement);
        showSpinner(this.spinner);
    }

    protected hideSpinner(): void {
        if (this.spinner.querySelector('.e-spinner-pane')) {
            hideSpinner(this.spinner);
        }
        if (this.spinner.parentElement) {
            detach(this.spinner);
        }
    }

    protected onActionComplete(
        ulElement: HTMLElement,
        list: { [key: string]: Object }[] | boolean[] | string[] | number[],
        e?: Object): void {
        super.onActionComplete(ulElement, list, e);
        this.initWrapper();
        this.setSelection();
        this.initDraggable();
        if (this.initLoad) {
            this.initToolbar();
            this.setCssClass();
            this.setEnable();
            this.setHeight();
            this.wireEvents();
        }
        this.initLoad = false;
    }

    private triggerDragStart(args: { target: Element }): void {
        if (Browser.isIos) {
            this.list.style.overflow = 'hidden';
        }
        this.trigger('dragStart', this.getDragArgs(args));
    }

    private triggerDrag(args: { target: Element }): void {
        this.trigger('drag', this.getDragArgs(args));
    }

    private dragEnd(args: DropEventArgs): void {
        let listData: { [key: string]: Object }[];
        let dropValue: string = args.droppedElement.getAttribute('data-value');
        let droppedData: { [key: string]: Object } = this.getDataByValue(
            dropValue) as { [key: string]: Object };
        let listObj: ListBox = this.getComponent(args.droppedElement);
        let dragArgs: Object = extend({}, this.getDragArgs({ target: args.droppedElement }, true), { target: args.target });
        dropValue = this.getTextByValue(dropValue);
        if (Browser.isIos) {
            this.list.style.overflow = '';
        }
        if (listObj === this) {
            let ul: Element = this.ulElement;
            let selectedOptions: string[] = this.value.indexOf(dropValue) > -1 ? this.value : [dropValue];
            listData = [].slice.call(this.listData);
            let fromIdx: number = args.previousIndex;
            let toIdx: number = args.currentIndex;
            listData.splice(toIdx, 0, listData.splice(fromIdx, 1)[0] as { [key: string]: Object });
            if (fromIdx > toIdx) {
                toIdx += 1;
            }
            selectedOptions.forEach((value: string) => {
                if (value !== dropValue) {
                    listData.splice(toIdx, 0, listData.splice(this.getIndexByValue(value), 1)[0] as { [key: string]: Object });
                    ul.insertBefore(this.getItems()[this.getIndexByValue(value)], ul.getElementsByClassName('e-placeholder')[0]);
                    if (fromIdx > toIdx) {
                        toIdx++;
                    }
                }
            });
            this.listData = listData;
            this.setProperties({ dataSource: listData }, true);
        } else {
            let li: Element;
            let prevIdx: number = args.previousIndex;
            let currIdx: number = args.currentIndex;
            let ul: Element = listObj.ulElement;
            listData = [].slice.call(listObj.listData);
            let selectedOptions: string[] = this.value.indexOf(dropValue) > -1 ? this.value : [dropValue];
            selectedOptions.forEach((value: string) => {
                droppedData = this.getDataByValue(value) as { [key: string]: Object };
                this.listData.splice(value === dropValue ? prevIdx : this.getIndexByValue(value), 1);
                listData.splice(value === dropValue ? args.currentIndex : currIdx, 0, droppedData);
                li = this.getItems()[this.getIndexByValue(value)];
                removeClass([value === dropValue ? args.droppedElement : li], cssClass.selected);
                ul.insertBefore(li, ul.getElementsByClassName('e-placeholder')[0]);
                currIdx++;
                prevIdx--;
            });
            this.setProperties({ dataSource: this.listData }, true);
            listObj.listData = listData;
            listObj.setProperties({ dataSource: listObj.listData }, true);
            this.updateSelectedOptions();
            if (this.selectionSettings.showCheckbox) {
                listObj.updateSelectedOptions();
            }
        }
        this.trigger('drop', dragArgs);
    }

    private getComponent(li: Element): ListBox {
        return getComponent(
            (this.element.tagName === 'EJS-LISTBOX' ? closest(li, '.e-listbox')
                : closest(li, '.e-listbox-wrapper').querySelector('.e-listbox')) as HTMLElement,
            this.getModuleName());
    }

    protected listOption(
        dataSource: { [key: string]: Object }[] | string[] | number[] | boolean[],
        fields: FieldSettingsModel): FieldSettingsModel {
        this.listCurrentOptions = super.listOption(dataSource, fields);
        this.listCurrentOptions = extend({}, this.listCurrentOptions, { itemCreated: this.triggerBeforeItemRender.bind(this) }, true);
        this.notify('listoption', { module: 'CheckBoxSelection' });
        return this.listCurrentOptions;
    }

    private triggerBeforeItemRender(e: { item: Element, curData: { [key: string]: Object } }): void {
        e.item.setAttribute('tabindex', '-1');
        this.trigger('beforeItemRender', { element: e.item, item: e.curData });
    }

    public requiredModules(): ModuleDeclaration[] {
        let modules: ModuleDeclaration[] = [];
        if (this.selectionSettings.showCheckbox) {
            modules.push({
                member: 'CheckBoxSelection',
                args: [this]
            });
        }
        return modules;
    }

    /**
     * This method is used to enable or disable the items in the ListBox based on the items and enable argument.
     * @param items Text items that needs to be enabled/disabled.
     * @param enable Set `true`/`false` to enable/disable the list items.
     * @returns void
     */
    public enableItems(items: string[], enable: boolean = true): void {
        let li: HTMLElement;
        items.forEach((item: string) => {
            li = this.findListElement(this.list, 'li', 'data-value', this.getValueByText(item));
            if (enable) {
                removeClass([li], cssClass.disabled);
                li.removeAttribute('aria-disabled');
            } else {
                addClass([li], cssClass.disabled);
                li.setAttribute('aria-disabled', 'true');
            }
        });
    }

    /**
     * Based on the state parameter, specified list item will be selected/deselected.
     * @param items Array of text value of the item.
     * @param state Set `true`/`false` to select/un select the list items.
     * @returns void
     */
    public selectItems(items: string[], state: boolean = true): void {
        this.setSelection(items, state);
        this.updateSelectedOptions();
    }

    /**
     * Based on the state parameter, entire list item will be selected/deselected.
     * @param state Set `true`/`false` to select/un select the entire list items.
     * @returns void
     */
    public selectAll(state: boolean = true): void {
        this.selectAllItems(state);
    }

    /**
     * Adds a new item to the list. By default, new item appends to the list as the last item,
     * but you can insert based on the index parameter.
     * @param  { Object[] } items - Specifies an array of JSON data or a JSON data.
     * @param { number } itemIndex - Specifies the index to place the newly added item in the list.
     * @return {void}.
     */
    public addItems(items: { [key: string]: Object }[] | { [key: string]: Object }, itemIndex?: number): void {
        super.addItem(items, itemIndex);
    }

    private selectAllItems(state: boolean): void {
        [].slice.call(this.getItems()).forEach((li: Element) => {
            if (!li.classList.contains(cssClass.disabled)) {
                if (this.selectionSettings.showCheckbox) {
                    let ele: Element = li.getElementsByClassName('e-check')[0];
                    if ((!ele && state) || (ele && !state)) {
                        this.notify('updatelist', { li: li });
                    }
                } else {
                    if (state) {
                        li.classList.add(cssClass.selected);
                    } else {
                        li.classList.remove(cssClass.selected);
                    }
                }
            }
        });
        this.updateSelectedOptions();
    }

    private wireEvents(): void {
        let form: Element = closest(this.element, 'form');
        let wrapper: Element = this.element.tagName === 'EJS-LISTBOX' ? this.element : this.list;
        EventHandler.add(this.list, 'click', this.clickHandler, this);
        EventHandler.add(wrapper, 'keydown', this.keyDownHandler, this);
        EventHandler.add(wrapper, 'focusout', this.focusOutHandler, this);
        if (this.toolbarSettings.items.length) {
            EventHandler.add(this.getToolElem(), 'click', this.toolbarClickHandler, this);
        }
        if (this.selectionSettings.showCheckbox) {
            EventHandler.remove(document, 'mousedown', this.checkBoxSelectionModule.onDocumentClick);
        }
        if (this.fields.groupBy || this.element.querySelector('select>optgroup')) {
            EventHandler.remove(this.list, 'scroll', this.setFloatingHeader);
        }
        if (form) {
            EventHandler.add(form, 'reset', this.formResetHandler, this);
        }
    }

    private unwireEvents(): void {
        let form: Element = closest(this.element, 'form');
        let wrapper: Element = this.element.tagName === 'EJS-LISTBOX' ? this.element : this.list;
        EventHandler.remove(this.list, 'click', this.clickHandler);
        EventHandler.remove(wrapper, 'keydown', this.keyDownHandler);
        EventHandler.remove(wrapper, 'focusout', this.focusOutHandler);
        if (this.toolbarSettings.items.length) {
            EventHandler.remove(this.getToolElem(), 'click', this.toolbarClickHandler);
        }
        if (form) {
            EventHandler.remove(form, 'reset', this.formResetHandler);
        }
    }

    private clickHandler(e: MouseEvent): void {
        this.selectHandler(e);
    }

    private selectHandler(e: MouseEvent | { target: EventTarget, ctrlKey?: boolean, shiftKey?: boolean }, isKey?: boolean): void {
        let isSelect: boolean = true;
        let currSelIdx: number;
        let li: Element = closest(e.target as Element, '.' + cssClass.li);
        let selectedLi: Element[] = [li];
        if (li) {
            currSelIdx = [].slice.call(li.parentElement.children).indexOf(li);
            if (!this.selectionSettings.showCheckbox) {
                if ((e.ctrlKey || Browser.isDevice) && li.classList.contains(cssClass.selected)) {
                    li.classList.remove(cssClass.selected);
                    li.removeAttribute('aria-selected');
                    isSelect = false;
                } else if (!(this.selectionSettings.mode === 'Multiple' && (e.ctrlKey || Browser.isDevice))) {
                    this.getSelectedItems().forEach((ele: Element) => {
                        ele.removeAttribute('aria-selected');
                    });
                    removeClass(this.getSelectedItems(), cssClass.selected);
                }
            }
            if (e.shiftKey && !this.selectionSettings.showCheckbox && this.selectionSettings.mode !== 'Single') {
                selectedLi = [].slice.call(li.parentElement.children)
                    .slice(Math.min(currSelIdx, this.prevSelIdx), Math.max(currSelIdx, this.prevSelIdx) + 1)
                    .filter((ele: Element) => { return ele.classList.contains(cssClass.li); });
            } else {
                this.prevSelIdx = [].slice.call(li.parentElement.children).indexOf(li);
            }
            if (isSelect) {
                if (!this.selectionSettings.showCheckbox) {
                    addClass(selectedLi, cssClass.selected);
                }
                selectedLi.forEach((ele: Element) => {
                    ele.setAttribute('aria-selected', 'true');
                });
                this.list.setAttribute('aria-activedescendant', li.id);
            }
            if (!isKey) {
                this.notify('updatelist', { li: li, e: e });
            }
            this.updateSelectedOptions();
            if (isSelect) {
                this.trigger('select', { element: li, item: this.getDataByValue(li.getAttribute('data-value')) });
            }
            this.trigger('change', { value: this.value });
        }
    }

    private toolbarClickHandler(e: MouseEvent): void {
        let btn: Element = closest(e.target as Element, 'button');
        if (btn) {
            switch (btn.getAttribute('data-value')) {
                case 'moveUp':
                    this.moveUpDown(true);
                    break;
                case 'moveDown':
                    this.moveUpDown();
                    break;
                case 'moveTo':
                    this.moveTo();
                    break;
                case 'moveFrom':
                    this.moveFrom();
                    break;
                case 'moveAllTo':
                    this.moveAllTo();
                    break;
                case 'moveAllFrom':
                    this.moveAllFrom();
                    break;
            }
        }
    }

    private moveUpDown(isUp?: boolean, isKey?: boolean): void {
        let elems: Element[] = [].slice.call(this.list.getElementsByClassName(cssClass.selected));
        if ((isUp && this.ulElement.firstElementChild.classList.contains(cssClass.selected))
            || (!isUp && this.ulElement.lastElementChild.classList.contains(cssClass.selected))) {
            return;
        }
        (isUp ? elems : elems.reverse()).forEach((ele: Element) => {
            let idx: number = Array.prototype.indexOf.call(this.ulElement.children, ele);
            moveTo(this.ulElement, this.ulElement, [idx], isUp ? idx - 1 : idx + 2);
            this.changeData(idx, isUp ? idx - 1 : idx + 1);
        });
        if (isKey) {
            this.list.focus();
        }
        this.updateToolBarState();
    }

    private moveTo(): void {
        this.moveData(this, this.getScopedListBox());
    }

    private moveFrom(): void {
        this.moveData(this.getScopedListBox(), this);
    }

    private moveData(fListBox: ListBox, tListBox: ListBox, isKey?: boolean): void {
        let idx: number[] = [];
        let listData: { [key: string]: Object }[] = [].slice.call(fListBox.listData);
        let tListData: { [key: string]: Object }[] = [].slice.call(tListBox.listData);
        let data: { [key: string]: Object }[] = [];
        let elems: Element[] = fListBox.getSelectedItems();
        if (elems.length) {
            if (!this.selectionSettings.showCheckbox) {
                removeClass(elems, cssClass.selected);
            }
            elems.forEach((ele: Element) => {
                idx.push(Array.prototype.indexOf.call(fListBox.ulElement.children, ele));
            });
            moveTo(fListBox.ulElement, tListBox.ulElement, idx);
            let childCnt: number = fListBox.ulElement.childElementCount;
            if (elems.length === 1 && childCnt) {
                fListBox.ulElement.children[childCnt === idx[0] ? idx[0] - 1 : idx[0]].classList.add(cssClass.selected);
            }
            if (isKey) {
                this.list.focus();
            }
            for (let i: number = idx.length - 1; i >= 0; i--) {
                data.push(listData.splice(idx[i], 1)[0]);
            }
            fListBox.listData = listData;
            fListBox.setProperties({ dataSource: listData }, true);
            data.reverse().forEach((datum: { [key: string]: Object }) => {
                tListData.push(datum);
            });
            tListBox.listData = tListData;
            tListBox.setProperties({ dataSource: tListData }, true);
            fListBox.updateSelectedOptions();
            if (this.selectionSettings.showCheckbox) {
                tListBox.updateSelectedOptions();
            }
        }
    }

    private moveAllTo(): void {
        this.moveAllData(this, this.getScopedListBox());
    }

    private moveAllFrom(): void {
        this.moveAllData(this.getScopedListBox(), this);
    }

    private moveAllData(fListBox: ListBox, tListBox: ListBox, isKey?: boolean): void {
        let listData: { [key: string]: Object }[] = [].slice.call(tListBox.listData);
        if (!this.selectionSettings.showCheckbox) {
            removeClass(this.getSelectedItems(), cssClass.selected);
        }
        moveTo(
            fListBox.ulElement,
            tListBox.ulElement,
            Array.apply(null, { length: fListBox.ulElement.childElementCount }).map(Number.call, Number));
        if (isKey) {
            this.list.focus();
        }
        [].slice.call(fListBox.listData).forEach((data: { [key: string]: Object }) => {
            listData.push(data);
        });
        tListBox.listData = listData;
        fListBox.listData = [];
        tListBox.setProperties({ dataSource: listData }, true);
        fListBox.setProperties({ dataSource: [] }, true);
        fListBox.updateSelectedOptions();
        if (this.selectionSettings.showCheckbox) {
            tListBox.updateSelectedOptions();
        }
    }

    private changeData(fromIdx: number, toIdx: number): void {
        let listData: { [key: string]: Object }[] = [].slice.call(this.listData);
        listData.splice(toIdx, 0, listData.splice(fromIdx, 1)[0] as { [key: string]: Object });
        this.listData = listData;
        this.setProperties({ dataSource: listData }, true);
    }

    private getSelectedItems(): Element[] {
        let ele: Element[] = [];
        if (this.selectionSettings.showCheckbox) {
            [].slice.call(this.ulElement.getElementsByClassName('e-check')).forEach((cbox: Element) => {
                ele.push(closest(cbox, '.' + cssClass.li));
            });
        } else {
            ele = [].slice.call(this.ulElement.getElementsByClassName(cssClass.selected));
        }
        return ele;
    }

    private getScopedListBox(): ListBox {
        let listObj: ListBox;
        [].slice.call(document.querySelectorAll(this.scope)).forEach((ele: Element) => {
            if (getComponent(ele as HTMLElement, this.getModuleName())) {
                listObj = getComponent(ele as HTMLElement, this.getModuleName());
            }
        });
        return listObj;
    }

    private getDragArgs(args: { target: Element }, isDragEnd?: boolean): DragEventArgs {
        let data: Object[] = [];
        let elems: Element[] = this.getSelectedItems();
        if (elems.length) {
            elems.pop();
            if (isDragEnd) {
                elems.push(args.target);
            }
        } else {
            elems = [args.target];
        }
        elems.forEach((ele: Element) => {
            data.push(this.getDataByValue(ele.getAttribute('data-value')));
        });
        return { elements: elems, items: data };
    }

    private keyDownHandler(e: KeyboardEvent): void {
        if ([32, 35, 36, 37, 38, 39, 40, 65].indexOf(e.keyCode) > -1) {
            e.preventDefault();
            if (e.keyCode === 32) {
                this.selectHandler({
                    target: this.ulElement.getElementsByClassName('e-focused')[0],
                    ctrlKey: e.ctrlKey, shiftKey: e.shiftKey
                });
            } else if (e.keyCode === 65 && e.ctrlKey) {
                this.selectAll();
            } else if ((e.keyCode === 38 || e.keyCode === 40) && e.ctrlKey && e.shiftKey) {
                this.moveUpDown(e.keyCode === 38 ? true : false, true);
            } else if ((this.toolbarSettings.items.length || this.tBListBox) && (e.keyCode === 39 || e.keyCode === 37) && e.ctrlKey) {
                let listObj: ListBox = this.tBListBox || this.getScopedListBox();
                if (e.keyCode === 39) {
                    e.shiftKey ? this.moveAllData(this, listObj, true) : this.moveData(this, listObj, true);
                } else {
                    e.shiftKey ? this.moveAllData(listObj, this, true) : this.moveData(listObj, this, true);
                }
            } else if (e.keyCode !== 37 && e.keyCode !== 39) {
                this.upDownKeyHandler(e);
            }
        }
    }

    private upDownKeyHandler(e: KeyboardEvent): void {
        let ul: Element = this.ulElement;
        let defaultIdx: number = (e.keyCode === 40 || e.keyCode === 36) ? 0 : ul.childElementCount - 1;
        let fliIdx: number = defaultIdx;
        let fli: Element = ul.getElementsByClassName('e-focused')[0] || ul.getElementsByClassName('e-selected')[0];
        if (fli) {
            if (e.keyCode !== 35 && e.keyCode !== 36) {
                fliIdx = Array.prototype.indexOf.call(ul.children, fli);
                e.keyCode === 40 ? fliIdx++ : fliIdx--;
                if (fliIdx < 0 || fliIdx > ul.childElementCount - 1) {
                    return;
                }
            }
            removeClass([fli], 'e-focused');
        }
        let cli: Element = ul.children[fliIdx];
        fliIdx = this.getValidIndex(cli, fliIdx, e.keyCode);
        if (fliIdx === -1) {
            addClass([fli], 'e-focused');
            return;
        }
        (ul.children[fliIdx] as HTMLElement).focus();
        ul.children[fliIdx].classList.add('e-focused');
        if (!e.ctrlKey) {
            this.selectHandler({ target: ul.children[fliIdx], ctrlKey: e.ctrlKey, shiftKey: e.shiftKey }, true);
        }
    }

    private focusOutHandler(): void {
        let ele: Element = this.list.getElementsByClassName('e-focused')[0];
        if (ele) {
            ele.classList.remove('e-focused');
        }
    }

    private getValidIndex(cli: Element, index: number, keyCode: number): number {
        let cul: Element = this.ulElement;
        if (cli.classList.contains('e-disabled') || cli.classList.contains(cssClass.group)) {
            (keyCode === 40 || keyCode === 36) ? index++ : index--;
        }
        if (index < 0 || index === cul.childElementCount) {
            return -1;
        }
        cli = cul.children[index];
        if (cli.classList.contains('e-disabled') || cli.classList.contains(cssClass.group)) {
            index = this.getValidIndex(cli, index, keyCode);
        }
        return index;
    }

    private updateSelectedOptions(): void {
        let selectedOptions: string[] = [];
        if (this.selectionSettings.showCheckbox) {
            [].slice.call(this.ulElement.getElementsByClassName('e-check')).forEach((ele: Element) => {
                selectedOptions.push(this.getTextByValue(closest(ele, 'li').getAttribute('data-value')));
            });
        } else {
            [].slice.call(this.list.getElementsByClassName(cssClass.selected)).forEach((ele: Element) => {
                if (!ele.classList.contains('e-grabbed')) {
                    selectedOptions.push(this.getTextByValue(ele.getAttribute('data-value')));
                }
            });
        }
        this.setProperties({ value: selectedOptions }, true);
        this.updateSelectTag();
        this.updateToolBarState();
        if (this.tBListBox) {
            this.tBListBox.updateToolBarState();
        }

    }

    private setSelection(values: string[] = this.value, isSelect: boolean = true): void {
        let li: Element;
        values.forEach((value: string) => {
            li = this.list.querySelector('[data-value="' + this.getTextByValue(value) + '"]');
            if (li) {
                if (this.selectionSettings.showCheckbox) {
                    this.notify('updatelist', { li: li });
                } else {
                    isSelect ? li.classList.add(cssClass.selected) : li.classList.remove(cssClass.selected);
                }
            }
        });
        this.updateSelectTag();
    }


    private updateSelectTag(): void {
        let ele: Element = this.getSelectTag();
        ele.innerHTML = '';
        this.value.forEach((value: string) => {
            ele.innerHTML += '<option selected value="' + value + '"></option>';
        });
    }

    private updateToolBarState(): void {
        if (this.toolbarSettings.items.length) {
            let listObj: ListBox = this.getScopedListBox();
            let wrap: Element = this.list.parentElement.getElementsByClassName('e-listbox-tool')[0];
            this.toolbarSettings.items.forEach((value: string) => {
                let btn: HTMLButtonElement = wrap.querySelector('[data-value="' + value + '"]');
                switch (value) {
                    case 'moveAllTo':
                        btn.disabled = this.ulElement.childElementCount ? false : true;
                        break;
                    case 'moveAllFrom':
                        btn.disabled = listObj.ulElement.childElementCount ? false : true;
                        break;
                    case 'moveFrom':
                        btn.disabled = listObj.value.length ? false : true;
                        break;
                    case 'moveUp':
                        btn.disabled = this.value.length
                            && !this.ulElement.children[0].classList.contains(cssClass.selected) ? false : true;
                        break;
                    case 'moveDown':
                        btn.disabled = this.value.length
                            && !this.ulElement.children[this.ulElement.childElementCount - 1]
                                .classList.contains(cssClass.selected) ? false : true;
                        break;
                    default:
                        btn.disabled = this.value.length ? false : true;
                        break;
                }
            });
        }
    }

    private getSelectTag(): Element {
        return this.list.getElementsByClassName('e-hidden-select')[0];
    }

    private getToolElem(): Element {
        return this.list.parentElement.getElementsByClassName('e-listbox-tool')[0];
    }

    private formResetHandler(): void {
        this.value = this.initialSelectedOptions;
    }

    /**
     * Return the module name.
     * @private
     */
    public getModuleName(): string {
        return 'listbox';
    }

    /**
     * Get the properties to be maintained in the persisted state.
     */
    protected getPersistData(): string {
        return this.addOnPersist(['value']);
    }


    public destroy(): void {
        if (this.element.tagName === 'EJS-LISTBOX') {
            this.element.innerHTML = '';
        } else {
            this.element.style.display = 'inline-block';
            this.list.parentElement.insertBefore(this.element, this.list);
        }
        this.unwireEvents();
        super.destroy();
    }

    /**
     * Called internally if any of the property value changed.
     * @returns void
     * @private
     */
    public onPropertyChanged(newProp: ListBoxModel, oldProp: ListBoxModel): void {
        let wrap: Element = this.toolbarSettings.items.length ? this.list.parentElement : this.list;
        super.onPropertyChanged(newProp, oldProp);
        this.setUpdateInitial(['fields', 'query', 'dataSource'], newProp as { [key: string]: string; });
        for (let prop of Object.keys(newProp)) {
            switch (prop) {
                case 'cssClass':
                    if (oldProp.cssClass) {
                        removeClass([wrap], oldProp.cssClass.split(' '));
                    }
                    if (newProp.cssClass) {
                        addClass([wrap], newProp.cssClass.split(' '));
                    }
                    break;
                case 'enableRtl':
                    if (newProp.enableRtl) {
                        wrap.classList.add('e-rtl');
                    } else {
                        wrap.classList.remove('e-rtl');
                    }
                    break;
                case 'value':
                    removeClass(this.list.querySelectorAll('.' + cssClass.selected), cssClass.selected);
                    this.setSelection();
                    break;
                case 'height':
                    this.setHeight();
                    break;
                case 'enabled':
                    this.setEnable();
                    break;
                case 'toolbarSettings':
                    let pos: string = newProp.toolbarSettings.position;
                    let toolElem: Element = this.getToolElem();
                    if (pos) {
                        removeClass([wrap], ['e-right', 'e-left']);
                        wrap.classList.add('e-' + pos.toLowerCase());
                        if (pos === 'Left') {
                            wrap.insertBefore(toolElem, this.list);
                        } else {
                            wrap.appendChild(toolElem);
                        }
                    }
                    if (newProp.toolbarSettings.items) {
                        toolElem.innerHTML = '';
                        this.createButtons(toolElem);
                    }
                    break;
            }
        }
    }
}

interface DropEventArgs {
    previousIndex: number;
    currentIndex: number;
    droppedElement: Element;
    target: Element;
}

/**
 * Interface for before item render event.
 */
export interface BeforeItemRenderEventArgs extends BaseEventArgs {
    element: Element;
    item: { [key: string]: Object };
}

/**
 * Interface for drag and drop event.
 */
export interface DragEventArgs {
    elements: Element[];
    items: Object[];
    target?: Element;
}

/**
 * Interface for select event args.
 */
export interface ListBoxSelectEventArgs {
    element: Element;
    item: Object;
}