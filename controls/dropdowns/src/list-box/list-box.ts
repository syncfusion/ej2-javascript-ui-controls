/// <reference path='../drop-down-base/drop-down-base-model.d.ts'/>
import { Input, InputObject } from '@syncfusion/ej2-inputs';
import { DropDownBase, dropDownBaseClasses, FilteringEventArgs, SelectEventArgs } from '../drop-down-base/drop-down-base';
import { FieldSettingsModel } from '../drop-down-base/drop-down-base-model';
import { EventHandler, closest, removeClass, addClass, Complex, Property, ChildProperty, BaseEventArgs, L10n } from '@syncfusion/ej2-base';
import { ModuleDeclaration, NotifyPropertyChanges, getComponent, EmitType, Event, extend, detach, attributes } from '@syncfusion/ej2-base';
import { getUniqueID, Browser, formatUnit, isNullOrUndefined, updateBlazorTemplate, resetBlazorTemplate } from '@syncfusion/ej2-base';
import { prepend, append } from '@syncfusion/ej2-base';
import { cssClass, Sortable, moveTo } from '@syncfusion/ej2-lists';
import { SelectionSettingsModel, ListBoxModel, ToolbarSettingsModel } from './list-box-model';
import { Button } from '@syncfusion/ej2-buttons';
import { createSpinner, showSpinner, hideSpinner } from '@syncfusion/ej2-popups';
import { DataManager, Query } from '@syncfusion/ej2-data';

const ITEMTEMPLATE_PROPERTY: string = 'ItemTemplate';

export type SelectionMode = 'Multiple' | 'Single';

export type ToolBarPosition = 'Left' | 'Right';

export type CheckBoxPosition = 'Left' | 'Right';

type dataType = { [key: string]: object } | string | boolean | number;
type obj = { [key: string]: object };

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

    /**
     * Set the position of the checkbox.
     * @default 'Left'
     */
    @Property('Left')
    public checkboxPosition: CheckBoxPosition;
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
    private allowDragAll: boolean;
    private checkBoxSelectionModule: { onDocumentClick: Function, checkAllParent: HTMLElement, clearIconElement: HTMLElement };
    private tBListBox: ListBox;
    private initLoad: boolean;
    private spinner: HTMLElement;
    private initialSelectedOptions: string[] | number[] | boolean[];
    private showSelectAll: boolean;
    private selectAllText: string;
    private unSelectAllText: string;
    private popupWrapper: Element;
    private targetInputElement: HTMLInputElement | string;
    private isValidKey: boolean = false;
    private isFiltered: boolean;
    private remoteFilterAction: boolean;
    private mainList: HTMLElement;
    private remoteCustomValue: boolean;
    private filterParent: HTMLElement;

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
     * @isGenericType true
     */
    @Property([])
    public value: string[] | number[] | boolean[];

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
     * To enable the filtering option in this component. 
     * Filter action performs when type in search box and collect the matched item through `filtering` event.
     * If searching character does not match, `noRecordsTemplate` property value will be shown.
     * @default false
     */
    @Property(false)
    public allowFiltering: boolean;

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
     * @blazorProperty 'OnItemRender'
     */
    @Event()
    public beforeItemRender: EmitType<BeforeItemRenderEventArgs>;

    /**
     * Triggers on typing a character in the component.
     * @event
     * @blazorProperty 'ItemSelected'
     */
    @Event()
    public filtering: EmitType<FilteringEventArgs>;

    /**
     * Triggers when an item in the popup is selected by the user either with mouse/tap or with keyboard navigation.
     * @event
     * @private
     */
    @Event()
    public select: EmitType<SelectEventArgs>;

    /**
     * Adds a new item to the popup list. By default, new item appends to the list as the last item,
     * but you can insert based on the index parameter.
     * @param  { Object[] } items - Specifies an array of JSON data or a JSON data.
     * @param { number } itemIndex - Specifies the index to place the newly added item in the popup list.
     * @return {void}.
     * @private
     */
    public addItem(
        items: { [key: string]: Object }[] | { [key: string]: Object } | string | boolean | number | string[] | boolean[] | number[],
        itemIndex?: number): void {
        super.addItem(items, itemIndex);
    }

    /**
     * Triggers while select / unselect the list item.
     * @event
     * @blazorProperty 'ValueChange'
     */
    @Event()
    public change: EmitType<ListBoxChangeEventArgs>;

    /**
     * Triggers after dragging the list item.
     * @event
     * @blazorProperty 'DragStart'
     */
    @Event()
    public dragStart: EmitType<DragEventArgs>;

    /**
     * Triggers while dragging the list item.
     * @event
     * @blazorProperty 'Dragging'
     */
    @Event()
    public drag: EmitType<DragEventArgs>;

    /**
     * Triggers before dropping the list item on another list item.
     * @event
     * @blazorProperty 'Dropped'
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
        if (this.itemTemplate) {
            this.list.classList.add('e-list-template');
        }
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
        if (this.itemTemplate) {
            let listBoxProxy: ListBox = this;
            resetBlazorTemplate(this.element.id + ITEMTEMPLATE_PROPERTY, ITEMTEMPLATE_PROPERTY);
            this.isStringTemplate = true;
            setTimeout(
                () => {
                    updateBlazorTemplate(listBoxProxy.element.id + ITEMTEMPLATE_PROPERTY, ITEMTEMPLATE_PROPERTY, listBoxProxy);
                },
                500);
        }
        this.list.insertBefore(hiddenSelect, this.list.firstChild);
        if (this.list.getElementsByClassName(cssClass.li)[0]) {
            this.list.getElementsByClassName(cssClass.li)[0].classList.remove(dropDownBaseClasses.focus);
        }
        removeClass([this.list], [dropDownBaseClasses.content, dropDownBaseClasses.root]);
        this.validationAttribute(this.element as HTMLInputElement, hiddenSelect as HTMLSelectElement);
        this.list.setAttribute('role', 'listbox');
        attributes(this.list, { 'role': 'listbox', 'aria-multiselectable': this.selectionSettings.mode === 'Multiple' ? 'true' : 'false' });
        if (this.selectionSettings.showCheckbox && this.selectionSettings.showSelectAll && this.liCollections.length) {
            let l10nSelect: L10n = new L10n(
                this.getModuleName(), { selectAllText: 'Select All', unSelectAllText: 'Unselect All' }, this.locale);
            this.showSelectAll = true;
            this.selectAllText = l10nSelect.getConstant('selectAllText');
            this.unSelectAllText = l10nSelect.getConstant('unSelectAllText');
            this.popupWrapper = this.list;
            this.checkBoxSelectionModule.checkAllParent = null;
            this.notify('selectAll', {});
        }
    }

    private initDraggable(): void {
        if (this.allowDragAndDrop) {
            new Sortable(this.ulElement, {
                scope: this.scope,
                itemClass: cssClass.li,
                dragStart: this.triggerDragStart.bind(this),
                drag: this.triggerDrag.bind(this),
                drop: this.dragEnd.bind(this),
                placeHolder: () => { return this.createElement('span', { className: 'e-placeholder' }); },
                helper: (e: { sender: Element }) => {
                    let ele: HTMLElement = e.sender.cloneNode(true) as HTMLElement;
                    ele.style.width = (this.getItems()[0] as HTMLElement).offsetWidth + 'px';
                    if (this.value.length > 1 && this.isSelected(ele)) {
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
            if (this.scope) {
                document.querySelector(this.scope).setAttribute('data-value', this.element.id);
            } else {
                this.updateToolBarState();
            }
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
        let l10n: L10n = new L10n(
            this.getModuleName(),
            {
                moveUp: 'Move Up', moveDown: 'Move Down', moveTo: 'Move To',
                moveFrom: 'Move From', moveAllTo: 'Move All To', moveAllFrom: 'Move All From'
            },
            this.locale
        );
        this.toolbarSettings.items.forEach((value: string) => {
            title = l10n.getConstant(value);
            ele = this.createElement('button', {
                attrs: {
                    'type': 'button',
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

    protected validationAttribute(input: HTMLInputElement, hiddenSelect: HTMLSelectElement): void {
        super.validationAttribute(input, hiddenSelect);
        hiddenSelect.required = input.required;
        input.required = false;
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

    private onInput(): void {
        if (this.keyDownStatus) {
            this.isValidKey = true;
        } else {
            this.isValidKey = false;
        }
        this.keyDownStatus = false;
    }

    protected onActionComplete(
        ulElement: HTMLElement,
        list: obj[] | boolean[] | string[] | number[],
        e?: Object): void {
        let searchEle: Element;
        if (this.allowFiltering) {
            searchEle = this.list.getElementsByClassName('e-filter-parent')[0];
        }
        super.onActionComplete(ulElement, list, e);
        if (this.allowFiltering && !isNullOrUndefined(searchEle)) {
            this.list.insertBefore(searchEle, this.list.firstElementChild);
        }
        this.initWrapper();
        this.setSelection();
        this.initDraggable();
        if (this.initLoad) {
            this.initToolbarAndStyles();
            this.wireEvents();
            this.mainList = this.ulElement;
            if (this.showCheckbox) {
                this.setCheckboxPosition();
            }
            if (this.allowFiltering) {
                this.setFiltering();
            }
        }
        this.initLoad = false;
    }

    private initToolbarAndStyles(): void {
        this.initToolbar();
        this.setCssClass();
        this.setEnable();
        this.setHeight();
    }

    private triggerDragStart(args: DragEventArgs): void {
        let badge: Element;
        args = extend(this.getDragArgs(args), { dragSelected: true }) as DragEventArgs;
        if (Browser.isIos) {
            this.list.style.overflow = 'hidden';
        }
        this.trigger('dragStart', args, (args: DragEventArgs) => {
            this.allowDragAll = args.dragSelected;
            if (!this.allowDragAll) {
                badge = this.ulElement.getElementsByClassName('e-list-badge')[0];
                if (badge) { detach(badge); }
            }
        });
    }

    private triggerDrag(args: DragEventArgs): void {
        this.trigger('drag', this.getDragArgs(args));
        let listObj: ListBox = this.getComponent(args.target);
        if (listObj && listObj.listData.length === 0) {
            listObj.ulElement.innerHTML = '';
        }
    }

    private dragEnd(args: DropEventArgs): void {
        let listData: dataType[];
        let selectedOptions: (string | boolean | number)[];
        let dropValue: string | number | boolean = this.getFormattedValue(args.droppedElement.getAttribute('data-value'));
        let droppedData: dataType;
        let listObj: ListBox = this.getComponent(args.droppedElement);
        let dragArgs: Object
            = extend({}, this.getDragArgs({ target: args.droppedElement } as DragEventArgs, true), { target: args.target });
        if (Browser.isIos) {
            this.list.style.overflow = '';
        }
        if (listObj === this) {
            let ul: Element = this.ulElement;
            listData = [].slice.call(this.listData);
            let toIdx: number = args.currentIndex = this.getCurIdx(this, args.currentIndex);
            listData.splice(toIdx, 0, listData.splice(listData.indexOf(this.getDataByValue(dropValue)), 1)[0] as obj);
            if (this.allowDragAll) {
                selectedOptions = Array.prototype.indexOf.call(this.value, dropValue) > -1 ? this.value : [dropValue];
                selectedOptions.forEach((value: string) => {
                    if (value !== dropValue) {
                        let idx: number = listData.indexOf(this.getDataByValue(value));
                        if (idx > toIdx) {
                            toIdx++;
                        }
                        listData.splice(toIdx, 0, listData.splice(idx, 1)[0] as obj);
                        ul.insertBefore(this.getItems()[this.getIndexByValue(value)], ul.getElementsByClassName('e-placeholder')[0]);
                    }
                });
            }
            (this.listData as dataType[]) = listData;
            this.setProperties({ dataSource: listData }, true);
        } else {
            let li: Element;
            let currIdx: number = args.currentIndex = this.getCurIdx(listObj, args.currentIndex);
            let ul: Element = listObj.ulElement;
            listData = [].slice.call(listObj.listData);
            selectedOptions = (Array.prototype.indexOf.call(this.value, dropValue) > -1 && this.allowDragAll) ? this.value : [dropValue];
            selectedOptions.forEach((value: string) => {
                droppedData = this.getDataByValue(value);
                this.listData.splice((this.listData as dataType[]).indexOf(droppedData), 1);
                listData.splice(value === dropValue ? args.currentIndex : currIdx, 0, droppedData);
                li = this.getItems()[this.getIndexByValue(value)];
                this.removeSelected(this, value === dropValue ? [args.droppedElement] : [li]);
                ul.insertBefore(li, ul.getElementsByClassName('e-placeholder')[0]);
                currIdx++;
            });
            this.updateSelectedOptions();
            if (this.fields.groupBy) {
                this.ulElement.innerHTML = this.renderItems(this.listData as obj[], this.fields).innerHTML;
                this.setSelection();
            }
            if (listObj.sortOrder !== 'None' || this.selectionSettings.showCheckbox
                !== listObj.selectionSettings.showCheckbox || listObj.fields.groupBy) {
                let sortabale: { placeHolderElement: Element } = getComponent(ul as HTMLElement, 'sortable');
                ul.innerHTML = listObj.renderItems(listData as obj[], listObj.fields).innerHTML;
                ul.appendChild(sortabale.placeHolderElement);
                ul.appendChild(args.helper);
                listObj.setSelection();
            }
            this.setProperties({ dataSource: this.listData }, true);
            (listObj.listData as dataType[]) = listData;
            listObj.setProperties({ dataSource: listObj.listData }, true);
            if (this.listData.length === 0) {
                this.l10nUpdate();
            }
        }
        this.trigger('drop', dragArgs);
    }

    private removeSelected(listObj: ListBox, elems: Element[]): void {
        if (listObj.selectionSettings.showCheckbox) {
            elems.forEach((ele: Element) => { ele.getElementsByClassName('e-frame')[0].classList.remove('e-check'); });
        } else {
            removeClass(elems, cssClass.selected);
        }
    }

    private getCurIdx(listObj: ListBox, idx: number): number {
        if (listObj.fields.groupBy) {
            idx -= [].slice.call(listObj.ulElement.children).slice(0, idx)
                .filter((ele: Element) => ele.classList.contains(cssClass.group)).length;
        }
        return idx;
    }

    private getComponent(li: Element): ListBox {
        let listObj: ListBox;
        let ele: HTMLElement = (this.element.tagName === 'EJS-LISTBOX' ? closest(li, '.e-listbox')
            : closest(li, '.e-listbox-wrapper') && closest(li, '.e-listbox-wrapper').querySelector('.e-listbox')) as HTMLElement;
        if (ele) {
            listObj = getComponent(ele, this.getModuleName());
        }
        return listObj;
    }

    protected listOption(
        dataSource: obj[] | string[] | number[] | boolean[],
        fields: FieldSettingsModel): FieldSettingsModel {
        this.listCurrentOptions = super.listOption(dataSource, fields);
        this.listCurrentOptions = extend({}, this.listCurrentOptions, { itemCreated: this.triggerBeforeItemRender.bind(this) }, true);
        this.notify('listoption', { module: 'CheckBoxSelection' });
        return this.listCurrentOptions;
    }

    private triggerBeforeItemRender(e: { item: Element, curData: obj }): void {
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
        this.setSelection(items, state, true);
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
     * @returns {void}.
     */
    public addItems(items: obj[] | obj, itemIndex?: number): void {
        super.addItem(items, itemIndex);
    }

    private selectAllItems(state: boolean, event?: MouseEvent): void {
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
        if (this.allowFiltering && this.selectionSettings.showCheckbox) {
            let liEle: HTMLCollectionOf<HTMLLIElement> = this.list.getElementsByTagName('li') as HTMLCollectionOf<HTMLLIElement>;
            let index: number = 0;
            if (state) {
                for (index = 0; index < liEle.length; index++) {
                    let dataValue1: string = this.getFormattedValue(liEle[index].getAttribute('data-value')) as string;
                    if (!(this.value as string[]).some((e: string) => e === dataValue1)) {
                        (this.value as string[]).push(this.getFormattedValue(liEle[index].getAttribute('data-value')) as string);
                    }
                }
            } else {
                for (index = 0; index < liEle.length; index++) {
                    let dataValue2: string = this.getFormattedValue(liEle[index].getAttribute('data-value')) as string;
                    this.value = (this.value as string[]).filter((e: string) => e !== dataValue2);
                }

            }
            if (document.querySelectorAll('ul').length < 2) {
                this.updateMainList();
            }
        }
        this.triggerChange(this.getSelectedItems(), event);
    }

    private updateMainList(): void {
        let mainCount: number = this.mainList.childElementCount;
        let ulEleCount: number = this.ulElement.childElementCount;
        if (this.selectionSettings.showCheckbox || (document.querySelectorAll('ul').length > 1 || mainCount !== ulEleCount)) {
            let listindex: number = 0;
            let valueindex: number = 0;
            let count: number = 0;
            for (listindex; listindex < this.mainList.childElementCount; ) {
                for (valueindex; valueindex < this.value.length; valueindex++) {
                    if (this.mainList.getElementsByTagName('li')[listindex].getAttribute('data-value') === this.value[valueindex]) {
                        count++;
                    }
                }
                if (!count && this.selectionSettings.showCheckbox) {
                    this.mainList.getElementsByTagName('li')[listindex].getElementsByClassName('e-frame')[0].classList.remove('e-check');
                }
                if (document.querySelectorAll('ul').length > 1 && count && mainCount !== ulEleCount) {
                    this.mainList.removeChild(this.mainList.getElementsByTagName('li')[listindex]);
                    listindex = 0;
                } else {
                    listindex++;
                }
                count = 0;
                valueindex = 0;
            }
        }
    }

    private wireEvents(): void {
        let form: Element = closest(this.element, 'form');
        let wrapper: Element = this.element.tagName === 'EJS-LISTBOX' ? this.element : this.list;
        EventHandler.add(this.list, 'click', this.clickHandler, this);
        EventHandler.add(wrapper, 'keydown', this.keyDownHandler, this);
        EventHandler.add(wrapper, 'focusout', this.focusOutHandler, this);
        this.wireToolbarEvent();
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

    private wireToolbarEvent(): void {
        if (this.toolbarSettings.items.length) {
            EventHandler.add(this.getToolElem(), 'click', this.toolbarClickHandler, this);
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
    };

    private checkSelectAll(): void {
        let searchCount: number = this.list.querySelectorAll('li.' + dropDownBaseClasses.li).length;
        let len: number = this.getSelectedItems().length;
        if (this.showSelectAll && searchCount) {
            this.notify('checkSelectAll', { module: 'CheckBoxSelection', value: (searchCount === len) ? 'check' : 'uncheck' });
        }
    }

    private setFiltering(): InputObject | void {
        if (isNullOrUndefined(this.filterParent)) {
            this.filterParent = this.createElement('span', {
                className: 'e-filter-parent'
            });
            let filterInput: HTMLInputElement = <HTMLInputElement>this.createElement('input', {
                attrs: { type: 'text' },
                className: 'e-input-filter'
            });
            this.element.parentNode.insertBefore(filterInput, this.element);
            let filterInputObj: InputObject = Input.createInput(
                {
                    element: filterInput
                },
                this.createElement
            );
            append([filterInputObj.container], this.filterParent);
            prepend([this.filterParent], this.list);
            attributes(filterInput, {
                'aria-disabled': 'false',
                'aria-owns': this.element.id + '_options',
                'role': 'listbox',
                'aria-activedescendant': null,
                'autocomplete': 'off',
                'autocorrect': 'off',
                'autocapitalize': 'off',
                'spellcheck': 'false'
            });
            EventHandler.add(filterInput, 'input', this.onInput, this);
            EventHandler.add(filterInput, 'keyup', this.KeyUp, this);
            EventHandler.add(filterInput, 'keydown', this.onKeyDown, this);
            return filterInputObj;
        }
    }

    private selectHandler(e: MouseEvent | { target: EventTarget, ctrlKey?: boolean, shiftKey?: boolean }, isKey?: boolean): void {
        let isSelect: boolean = true;
        let currSelIdx: number;
        let li: Element = closest(e.target as Element, '.' + cssClass.li);
        let selectedLi: Element[] = [li];
        if (li) {
            currSelIdx = [].slice.call(li.parentElement.children).indexOf(li);
            if (!this.selectionSettings.showCheckbox) {
                if ((e.ctrlKey || Browser.isDevice) && this.isSelected(li)) {
                    li.classList.remove(cssClass.selected);
                    li.removeAttribute('aria-selected');
                    isSelect = false;
                } else if (!(this.selectionSettings.mode === 'Multiple' && (e.ctrlKey || Browser.isDevice))) {
                    this.getSelectedItems().forEach((ele: Element) => {
                        ele.removeAttribute('aria-selected');
                    });
                    removeClass(this.getSelectedItems(), cssClass.selected);
                }
            } else {
                isSelect = !li.getElementsByClassName('e-frame')[0].classList.contains('e-check');
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
            if (this.allowFiltering && !isKey) {
                let liDataValue: string = this.getFormattedValue(li.getAttribute('data-value')) as string;
                if (!isSelect) {
                    this.value = (this.value as string[]).filter((value1: string) =>
                        value1 !== liDataValue);
                } else {
                    (this.value as string[]).push(liDataValue);
                }
                if (document.querySelectorAll('ul').length < 2) {
                    this.updateMainList();
                }
            }
            this.updateSelectedOptions();
            this.triggerChange(this.getSelectedItems(), e as MouseEvent);
        }
    }

    private triggerChange(selectedLis: Element[], event: MouseEvent): void {
        this.trigger('change', { elements: selectedLis, items: this.getDataByElems(selectedLis), value: this.value, event: event });
    }

    private getDataByElems(elems: Element[]): Object[] {
        let data: Object[] = [];
        elems.forEach((ele: Element) => {
            data.push(this.getDataByValue(ele.getAttribute('data-value')));
        });
        return data;
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
        let elems: Element[] = this.getSelectedItems();
        if ((isUp && this.isSelected(this.ulElement.firstElementChild))
            || (!isUp && this.isSelected(this.ulElement.lastElementChild))) {
            return;
        }
        (isUp ? elems : elems.reverse()).forEach((ele: Element) => {
            let idx: number = Array.prototype.indexOf.call(this.ulElement.children, ele);
            moveTo(this.ulElement, this.ulElement, [idx], isUp ? idx - 1 : idx + 2);
            this.changeData(idx, isUp ? idx - 1 : idx + 1);
        });
        (elems[0] as HTMLElement).focus();
        if (!isKey && this.toolbarSettings.items.length) {
            (this.getToolElem().querySelector('[data-value=' + (isUp ? 'moveUp' : 'moveDown') + ']') as HTMLElement).focus();
        }
        this.updateToolBarState();
    }

    private moveTo(): void {
        this.moveData(this, this.getScopedListBox());
    }

    private moveFrom(): void {
        this.moveData(this.getScopedListBox(), this);
    }

    /**
     * Called internally if any of the property value changed.
     * @returns void
     * @private
     */
    // tslint:disable-next-line:max-func-body-length
    private moveData(fListBox: ListBox, tListBox: ListBox, isKey?: boolean): void {
        let count: number = 0;
        let idx: number[] = [];
        let dataIdx: number[] = [];
        let listData: dataType[] = [].slice.call(fListBox.listData);
        let tListData: dataType[] = [].slice.call(tListBox.listData);
        let data: dataType[] = [];
        let elems: Element[] = fListBox.getSelectedItems();
        let isRefresh: boolean | string = tListBox.sortOrder !== 'None' ||
            (tListBox.selectionSettings.showCheckbox !== fListBox.selectionSettings.showCheckbox) || tListBox.fields.groupBy;
        if (fListBox.getSelectedItems().length !== fListBox.value.length) {
            let index: number = 0;
            fListBox.value = [];
            for (index; index < fListBox.getSelectedItems().length; index++) {
                fListBox.value[index] = fListBox.getSelectedItems()[index].getAttribute('data-value');
            }
        }
        if (elems.length) {
            this.removeSelected(fListBox, elems);
            if (fListBox.allowFiltering) {
                (fListBox.sortedData as string[] | boolean[] | number[] | {
                    [key: string]: Object;
                }[] | DataManager) = fListBox.dataSource;
            }
            elems.forEach((ele: Element, i: number) => {
                idx.push(Array.prototype.indexOf.call(fListBox.ulElement.children, ele));
                dataIdx.push(Array.prototype.indexOf.call(listData, fListBox.sortedData[idx[i]]));
            });
            if (tListBox.listData.length === 0) {
                tListBox.ulElement.innerHTML = '';
            }
            dataIdx.sort().reverse().forEach((i: number) => {
                listData.splice(i, 1)[0];
            });
            idx.slice().reverse().forEach((i: number) => {
                if (fListBox.mainList.childElementCount === fListBox.ulElement.childElementCount) {
                    data.push(fListBox.sortedData.splice(i, 1)[0]);
                } else {
                    fListBox.sortedData = (fListBox.sortedData as { [key: string]: Object }[]
                    ).filter((value1: { [key: string]: Object; }) =>
                        !(value1.Country === fListBox.ulElement.getElementsByTagName('li')[i].getAttribute('data-value')));
                    if (count === 0) {
                        let i: number;
                        let j: number;
                        for (i = 0; i < fListBox.sortedData.length; i++) {
                            for (j = 0; j < fListBox.value.length; j++) {
                                if (fListBox.sortedData[i].text === fListBox.value[j]) {
                                    (tListBox.dataSource as { [key: string]: object; }[]).push(fListBox.sortedData[i]);
                                    fListBox.sortedData = (fListBox.sortedData as { [key: string]: Object }[]
                                    ).filter((value1: { [key: string]: Object; }) =>
                                        !(value1.text === fListBox.value[j]));

                                }
                            }
                        }
                        count++;
                    }
                }
                fListBox.setProperties({ dataSource: fListBox.sortedData }, true);
            });
            if (tListBox.sortedData.length !== (tListBox.dataSource as string[]).length) {
                tListBox.setProperties({ sortedData: tListBox.dataSource }, true);
                tListData = tListBox.dataSource as string[];
            }
            if (isRefresh) {
                if (fListBox.fields.groupBy) {
                    fListBox.ulElement.innerHTML = fListBox.renderItems(listData as obj[], fListBox.fields).innerHTML;
                } else {
                    elems.forEach((ele: Element) => { detach(ele); });
                }
            } else {
                moveTo(fListBox.ulElement, tListBox.ulElement, idx);
            }
            if (tListBox.mainList.childElementCount !== (tListBox.dataSource as string[]).length) {
                tListBox.mainList = tListBox.ulElement;
            }
            fListBox.updateMainList();
            let childCnt: number = fListBox.ulElement.childElementCount;
            let ele: Element;
            let liIdx: number;
            if (elems.length === 1 && childCnt && !fListBox.selectionSettings.showCheckbox) {
                liIdx = childCnt <= idx[0] ? childCnt - 1 : idx[0];
                ele = fListBox.ulElement.children[liIdx];
                fListBox.ulElement.children[fListBox.getValidIndex(ele, liIdx, childCnt === idx[0]
                    ? 38 : 40)].classList.add(cssClass.selected);
            }
            if (isKey) {
                this.list.focus();
            }
            listData = fListBox.dataSource as dataType[];
            (fListBox.listData as dataType[]) = listData;
            fListBox.setProperties({ dataSource: listData }, true);
            tListData = tListData.concat(data.reverse());
            (tListBox.listData as dataType[]) = tListData;
            tListBox.setProperties({ dataSource: tListData }, true);
            if (isRefresh) {
                tListBox.ulElement.innerHTML = tListBox.renderItems(tListData as obj[], tListBox.fields).innerHTML;
                tListBox.setSelection();
            } else {
                (tListBox.sortedData as dataType[]) = tListData;
            }
            fListBox.updateSelectedOptions();
            if (fListBox.listData.length === 0) {
                fListBox.l10nUpdate();
            }
        }
        if (fListBox.value.length === 1 && fListBox.getSelectedItems().length) {
            fListBox.value[0] = fListBox.getSelectedItems()[0].innerHTML;
        }
    }

    private moveAllTo(): void {
        this.moveAllData(this, this.getScopedListBox());
    }

    private moveAllFrom(): void {
        this.moveAllData(this.getScopedListBox(), this);
    }

    private moveAllData(fListBox: ListBox, tListBox: ListBox, isKey?: boolean): void {
        type sortedType = dataType | { isHeader: boolean };
        let listData: dataType[] = [].slice.call(tListBox.listData);
        let isRefresh: boolean | string = tListBox.sortOrder !== 'None' ||
            (tListBox.selectionSettings.showCheckbox !== fListBox.selectionSettings.showCheckbox) || tListBox.fields.groupBy;
        this.removeSelected(fListBox, fListBox.getSelectedItems());
        if (tListBox.listData.length === 0) {
            tListBox.ulElement.innerHTML = '';
        }
        if (isRefresh) {
            fListBox.ulElement.innerHTML = '';
        } else {
            moveTo(
                fListBox.ulElement,
                tListBox.ulElement,
                Array.apply(null, { length: fListBox.ulElement.childElementCount }).map(Number.call, Number));
        }
        if (isKey) {
            this.list.focus();
        }
        (listData as sortedType[]) = (listData as sortedType[]).concat((fListBox.sortedData as sortedType[])
            .filter((data: sortedType) => (data as { isHeader: boolean }).isHeader !== true));
        (tListBox.listData as dataType[]) = listData;
        fListBox.listData = fListBox.sortedData = [];
        tListBox.setProperties({ dataSource: listData }, true);
        fListBox.setProperties({ dataSource: [] }, true);
        if (isRefresh) {
            tListBox.ulElement.innerHTML = tListBox.renderItems(listData as obj[], tListBox.fields).innerHTML;
        } else {
            (tListBox.sortedData as dataType[]) = listData;
        }
        fListBox.updateSelectedOptions();
        if (fListBox.listData.length === 0) {
            fListBox.l10nUpdate();
        }
    }

    private changeData(fromIdx: number, toIdx: number): void {
        let listData: obj[] = [].slice.call(this.listData);
        listData.splice(toIdx, 0, listData.splice(fromIdx, 1)[0] as obj);
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
        if (this.scope) {
            [].slice.call(document.querySelectorAll(this.scope)).forEach((ele: Element) => {
                if (getComponent(ele as HTMLElement, this.getModuleName())) {
                    listObj = getComponent(ele as HTMLElement, this.getModuleName());
                }
            });
        }
        return listObj;
    }

    private getDragArgs(args: DragEventArgs, isDragEnd?: boolean): DragEventArgs {
        let elems: Element[] = this.getSelectedItems();
        if (elems.length) {
            elems.pop();
            if (isDragEnd) {
                elems.push(args.target);
            }
        } else {
            elems = [args.target];
        }
        return { elements: elems, items: this.getDataByElems(elems) };
    }

    private onKeyDown(e: KeyboardEvent): void {
        this.keyDownHandler(e);
    }

    private keyDownStatus: boolean = false;

    private keyDownHandler(e: KeyboardEvent): void {
        if ([32, 35, 36, 37, 38, 39, 40, 65].indexOf(e.keyCode) > -1 && !this.allowFiltering) {
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
        let fli: Element = ul.getElementsByClassName('e-focused')[0] || ul.getElementsByClassName(cssClass.selected)[0];
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

    private KeyUp(e: KeyboardEvent): void {
        let char: string = String.fromCharCode(e.keyCode);
        let isWordCharacter: Object = char.match(/\w/);
        if (!isNullOrUndefined(isWordCharacter)) {
            this.isValidKey = true;
        }
        this.isValidKey = (e.keyCode === 8) || this.isValidKey;
        if (this.isValidKey) {
            this.isValidKey = false;
            switch (e.keyCode) {
                default:
                    let text: string = this.targetElement();
                    let keyCode: number = e.keyCode;
                    if (this.allowFiltering) {
                        let eventArgsData: { [key: string]: Object } = {
                            preventDefaultAction: false,
                            text: this.targetElement(),
                            updateData: (
                                dataSource: {
                                    [key: string]: Object
                                }[] | DataManager | string[] | number[], query?: Query, fields?: FieldSettingsModel) => {
                                if (eventArgsData.cancel) { return; }
                                this.isFiltered = true;
                                this.remoteFilterAction = true;
                                this.dataUpdater(dataSource, query, fields);
                            },
                            event: e,
                            cancel: false
                        };
                        this.trigger('filtering', eventArgsData);
                        if (eventArgsData.cancel) { return; }
                        if (!this.isFiltered && !eventArgsData.preventDefaultAction) {
                            this.dataUpdater(this.dataSource, null, this.fields);
                        }
                        (this.list.getElementsByClassName('e-input-filter')[0] as HTMLElement).focus();
                    }
            }
        }
    }

    protected targetElement(): string {
        this.targetInputElement = this.list.getElementsByClassName('e-input-filter')[0] as HTMLInputElement;
        return this.targetInputElement.value;
    }

    private dataUpdater(
        dataSource: { [key: string]: Object }[] | DataManager | string[] | number[] | boolean[],
        query?: Query, fields?: FieldSettingsModel): void {
        this.isDataFetched = false;
        let backCommand: boolean = true;
        if (this.targetElement().trim() === '') {
            let list: HTMLElement = this.mainList.cloneNode ? <HTMLElement>this.mainList.cloneNode(true) : this.mainList;
            if (backCommand) {
                this.remoteCustomValue = false;
                this.onActionComplete(list, this.dataSource as { [key: string]: Object }[] | string[] | number[] | boolean[]);
                this.notify('reOrder', { module: 'CheckBoxSelection', enable: this.selectionSettings.showCheckbox, e: this });
            }
        } else {
            this.resetList(dataSource, fields, query);
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
        this.getSelectedItems().forEach((ele: Element) => {
            if (!ele.classList.contains('e-grabbed')) {
                selectedOptions.push(this.getFormattedValue(ele.getAttribute('data-value')) as string);
            }
        });
        if (this.mainList.childElementCount === this.ulElement.childElementCount) {
            this.setProperties({ value: selectedOptions }, true);
        }
        this.updateSelectTag();
        this.updateToolBarState();
        if (this.tBListBox) {
            this.tBListBox.updateToolBarState();
        }
        if (this.allowFiltering) {
            (this.list.getElementsByClassName('e-input-filter')[0] as HTMLElement).focus();
        }
    }

    private clearSelection(values: (string | number | boolean)[] = this.value): void {
        if (this.selectionSettings.showCheckbox) {
            let dvalue: string | number | boolean;
            this.getSelectedItems().forEach((li: Element) => {
                dvalue = this.getFormattedValue(li.getAttribute('data-value'));
                if (values.indexOf(dvalue) < 0) {
                    li.getElementsByClassName('e-check')[0].classList.remove('e-check');
                    li.getElementsByClassName('e-checkbox-wrapper')[0].removeAttribute('aria-checked');
                    li.removeAttribute('aria-selected');
                }
            });
        }
    };

    private setSelection(values: (string | boolean | number)[] = this.value, isSelect: boolean = true, isText: boolean = false): void {
        let li: Element;
        let liselect: boolean;
        if (values) {
            values.forEach((value: string) => {
                li = this.list.querySelector('[data-value="' + (isText ? this.getValueByText(value) : value) + '"]');
                if (li) {
                    if (this.selectionSettings.showCheckbox) {
                        liselect = li.getElementsByClassName('e-frame')[0].classList.contains('e-check');
                    } else {
                        liselect = li.classList.contains('e-selected');
                    }
                    if (!isSelect && liselect || isSelect && !liselect && li) {
                        if (this.selectionSettings.showCheckbox) {
                            this.notify('updatelist', { li: li });
                        } else {
                            if (isSelect) {
                                li.classList.add(cssClass.selected);
                                li.setAttribute('aria-selected', 'true');
                            } else {
                                li.classList.remove(cssClass.selected);
                                li.removeAttribute('aria-selected');
                            }
                        }
                    }
                }
            });
        }
        this.updateSelectTag();
    }

    private updateSelectTag(): void {
        let ele: Element = this.getSelectTag();
        ele.innerHTML = '';
        if (this.value) {
            Array.prototype.forEach.call(this.value, (value: string) => {
                ele.innerHTML += '<option selected value="' + value + '"></option>';
            });
        }
        this.checkSelectAll();
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
                        btn.disabled = listObj.value && listObj.value.length ? false : true;
                        break;
                    case 'moveUp':
                        btn.disabled = this.value && this.value.length
                            && !this.isSelected(this.ulElement.children[0]) ? false : true;
                        break;
                    case 'moveDown':
                        btn.disabled = this.value && this.value.length
                            && !this.isSelected(this.ulElement.children[this.ulElement.childElementCount - 1]) ? false : true;
                        break;
                    default:
                        btn.disabled = this.value && this.value.length ? false : true;
                        break;
                }
            });
        }
    }

    private setCheckboxPosition(): void {
        let listWrap: HTMLElement = this.list;
        if (!this.initLoad && this.selectionSettings.checkboxPosition === 'Left') {
            listWrap.classList.remove('e-right');
        }
        if (this.selectionSettings.checkboxPosition === 'Right') {
            listWrap.classList.add('e-right');
        }
    }

    private showCheckbox(showCheckbox: boolean): void {
        let index: number = 0;
        let liColl: NodeListOf<Element> = this.list.lastElementChild.querySelectorAll('li');
        let liCollLen: number = this.list.lastElementChild.getElementsByClassName('e-list-item').length;
        if (showCheckbox) {
            this.ulElement = this.renderItems(this.listData as obj[], this.fields);
            this.mainList = this.ulElement;
            this.list.removeChild(this.list.getElementsByTagName('ul')[0]);
            this.list.appendChild(this.ulElement);

            if (this.selectionSettings.showSelectAll) {
                let l10nShow: L10n = new L10n(
                    this.getModuleName(), { selectAllText: 'Select All', unSelectAllText: 'Unselect All' }, this.locale);
                this.showSelectAll = true;
                this.selectAllText = l10nShow.getConstant('selectAllText');
                this.unSelectAllText = l10nShow.getConstant('unSelectAllText');
                this.popupWrapper = this.list;
                this.checkBoxSelectionModule.checkAllParent = null;
                this.notify('selectAll', {});
                this.checkSelectAll();
            }
        } else {
            if (this.selectionSettings.showSelectAll) {
                this.list.removeChild(this.list.getElementsByClassName('e-selectall-parent')[0]);
            }
            for (index; index < liCollLen; index++) {
                liColl[index].removeChild(liColl[index].getElementsByClassName('e-checkbox-wrapper')[0]);
                if (liColl[index].hasAttribute('aria-selected')) {
                    liColl[index].removeAttribute('aria-selected');
                }
            }
            this.mainList = this.ulElement;
        }
        this.value = [];
    }

    private isSelected(ele: Element): boolean {
        if (!isNullOrUndefined(ele)) {
            return ele.classList.contains(cssClass.selected) || ele.querySelector('.e-check') !== null;
        } else {
            return false;
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

    protected getLocaleName(): string {
        return 'listbox';
    };

    public destroy(): void {
        this.unwireEvents();
        if (this.element.tagName === 'EJS-LISTBOX') {
            this.element.innerHTML = '';
        } else {
            this.element.style.display = 'inline-block';
            if (this.toolbarSettings.items.length) {
                this.list.parentElement.parentElement.insertBefore(this.list, this.list.parentElement);
                detach(this.list.nextElementSibling);
            }
            this.list.parentElement.insertBefore(this.element, this.list);
        }
        super.destroy();
    }

    /**
     * Called internally if any of the property value changed.
     * @returns void
     * @private
     */
    // tslint:disable-next-line:max-func-body-length
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
                    this.clearSelection(this.value);
                    this.setSelection();
                    break;
                case 'height':
                    this.setHeight();
                    break;
                case 'enabled':
                    this.setEnable();
                    break;
                case 'allowDragAndDrop':
                    if (newProp.allowDragAndDrop) {
                        this.initDraggable();
                    } else {
                        (getComponent(this.ulElement, 'sortable') as Sortable).destroy();
                    }
                    break;
                case 'allowFiltering':
                    if (this.allowFiltering) {
                        this.setFiltering();
                    } else {
                        this.list.removeChild(this.list.getElementsByClassName('e-filter-parent')[0]);
                        this.filterParent = null;
                    }
                    break;
                case 'scope':
                    if (this.allowDragAndDrop) {
                        (getComponent(this.ulElement, 'sortable') as Sortable).scope = newProp.scope;
                    }
                    if (this.toolbarSettings.items.length) {
                        if (oldProp.scope) {
                            (getComponent(document.querySelector(oldProp.scope) as HTMLElement, this.getModuleName()) as ListBox)
                                .tBListBox = null;
                        }
                        if (newProp.scope) {
                            (getComponent(document.querySelector(newProp.scope) as HTMLElement, this.getModuleName()) as ListBox)
                                .tBListBox = this;
                        }
                    }
                    break;
                case 'toolbarSettings':
                    let ele: Element;
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
                        if (oldProp.toolbarSettings.items.length) {
                            ele = this.list.parentElement;
                            ele.parentElement.insertBefore(this.list, ele);
                            detach(ele);
                        }
                        this.initToolbarAndStyles();
                        this.wireToolbarEvent();
                    }
                    break;
                case 'selectionSettings':
                    let showSelectAll: boolean = newProp.selectionSettings.showSelectAll;
                    let showCheckbox: boolean = newProp.selectionSettings.showCheckbox;
                    if (!isNullOrUndefined(showSelectAll)) {
                        this.showSelectAll = showSelectAll;
                        if (this.showSelectAll) {
                            let l10nSel: L10n = new L10n(
                                this.getModuleName(), { selectAllText: 'Select All', unSelectAllText: 'Unselect All' }, this.locale);
                            this.checkBoxSelectionModule.checkAllParent = null;
                            this.showSelectAll = true;
                            this.selectAllText = l10nSel.getConstant('selectAllText');
                            this.unSelectAllText = l10nSel.getConstant('selectAllText');
                            this.popupWrapper = this.list;
                        }
                        this.notify('selectAll', {});
                        this.checkSelectAll();
                    }
                    if (!isNullOrUndefined(showCheckbox)) {
                        this.showCheckbox(showCheckbox);
                    }
                    if (this.selectionSettings.showCheckbox) {
                        this.setCheckboxPosition();
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
    helper: Element;
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
/**
 * @isGenericType true
 */
    items: Object[];
    target?: Element;
    dragSelected?: boolean;
}

/**
 * Interface for change event args.
 */
export interface ListBoxChangeEventArgs extends BaseEventArgs {
    elements: Element[];
/**
 * @isGenericType true
 */
    items: Object[];
/**
 * @isGenericType true
 */
    value: number | string | boolean;
    event: Event;
}